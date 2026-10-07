const express = require("express");
const path = require("path");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const PROJECT_ID = "inercja-424dd";
const YOUTUBE_CHANNEL_ID = "UC2Wi6cHYsLz48s95HHeOptw";
const YOUTUBE_MISSION_REWARD = 4;
const FIREBASE_ISSUER = `https://securetoken.google.com/${PROJECT_ID}`;

app.use(express.json({ limit: "32kb" }));
app.use(express.static(__dirname));

let firebaseCertsCache = { expiresAt: 0, certs: {} };
let serviceTokenCache = { token: null, expiresAt: 0 };

async function getFirebaseCerts() {
    if (Date.now() < firebaseCertsCache.expiresAt) return firebaseCertsCache.certs;
    const response = await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
    if (!response.ok) throw new Error("FIREBASE_CERTS");
    const certs = await response.json();
    const cacheControl = response.headers.get("cache-control") || "";
    const maxAge = Number((cacheControl.match(/max-age=(\d+)/) || [])[1] || 3600);
    firebaseCertsCache = { certs, expiresAt: Date.now() + Math.min(maxAge, 21600) * 1000 };
    return certs;
}

async function verifyFirebaseIdToken(idToken) {
    const decoded = jwt.decode(idToken, { complete: true });
    if (!decoded?.header?.kid) throw new Error("FIREBASE_TOKEN");
    const certs = await getFirebaseCerts();
    const certificate = certs[decoded.header.kid];
    if (!certificate) throw new Error("FIREBASE_TOKEN");
    const payload = jwt.verify(idToken, certificate, {
        algorithms: ["RS256"],
        issuer: FIREBASE_ISSUER,
        audience: PROJECT_ID
    });
    if (!payload.sub || payload.firebase?.sign_in_provider === "anonymous" || !payload.email) {
        throw new Error("FIREBASE_TOKEN");
    }
    return payload;
}

function getServiceAccount() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error("FIREBASE_ADMIN_NOT_CONFIGURED");
    try {
        const account = JSON.parse(raw);
        if (!account.client_email || !account.private_key) throw new Error("invalid");
        return account;
    } catch {
        throw new Error("FIREBASE_ADMIN_NOT_CONFIGURED");
    }
}

async function getFirestoreAccessToken() {
    if (serviceTokenCache.token && Date.now() < serviceTokenCache.expiresAt) return serviceTokenCache.token;
    const account = getServiceAccount();
    const now = Math.floor(Date.now() / 1000);
    const assertion = jwt.sign({
        iss: account.client_email,
        scope: "https://www.googleapis.com/auth/datastore",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600
    }, account.private_key, { algorithm: "RS256" });
    const body = new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion
    });
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
    });
    if (!response.ok) throw new Error("FIREBASE_SERVICE_TOKEN");
    const data = await response.json();
    serviceTokenCache = { token: data.access_token, expiresAt: Date.now() + Math.max(60, Number(data.expires_in || 3600) - 120) * 1000 };
    return data.access_token;
}

async function firestoreRequest(url, options = {}) {
    const token = await getFirestoreAccessToken();
    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(data?.error?.status || "FIRESTORE");
        error.status = response.status;
        throw error;
    }
    return data;
}

function fsString(value) { return { stringValue: String(value) }; }
function fsInteger(value) { return { integerValue: String(Math.trunc(value)) }; }
function fsMap(fields) { return { mapValue: { fields } }; }
function fsTimestampNow() { return { timestampValue: new Date().toISOString() }; }

async function getFirestoreDoc(collection, uid) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${encodeURIComponent(uid)}`;
    try {
        return await firestoreRequest(url);
    } catch (error) {
        if (error.status === 404) return null;
        throw error;
    }
}

async function awardYoutubeMission(uid) {
    const postepUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/postepy/${encodeURIComponent(uid)}`;
    const misjeUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/misje/${encodeURIComponent(uid)}`;
    const [postep, misje] = await Promise.all([getFirestoreDoc("postepy", uid), getFirestoreDoc("misje", uid)]);
    if (!postep) throw new Error("BRAK_POSTEPU");
    const wykonane = misje?.fields?.wykonane?.mapValue?.fields || {};
    if (wykonane.youtube_subskrypcja) throw new Error("MISJA_WYKONANA");
    const aktualne = Math.max(0, Number(postep.fields?.gwiazdki?.integerValue || 0));
    const nowe = aktualne + YOUTUBE_MISSION_REWARD;
    const wykonanePo = { ...wykonane, youtube_subskrypcja: { booleanValue: true } };

    const postepFields = { ...(postep.fields || {}) };
    postepFields.gwiazdki = fsInteger(nowe);
    postepFields.misja = fsString("youtube_subskrypcja");
    postepFields.zaktualizowano = fsTimestampNow();
    const misjeFields = { ...(misje?.fields || {}) };
    misjeFields.uid = fsString(uid);
    misjeFields.wykonane = fsMap(wykonanePo);
    misjeFields.ostatniaMisja = fsString("youtube_subskrypcja");
    misjeFields.zaktualizowano = fsTimestampNow();

    const writes = [
        {
            update: { name: postep?.name || postepUrl.replace("https://firestore.googleapis.com/v1/", ""), fields: postepFields },
            currentDocument: postep.updateTime ? { updateTime: postep.updateTime } : undefined
        },
        misje
            ? {
                update: { name: misje.name, fields: misjeFields },
                currentDocument: { updateTime: misje.updateTime }
            }
            : {
                update: { name: `projects/${PROJECT_ID}/databases/(default)/documents/misje/${uid}`, fields: misjeFields },
                currentDocument: { exists: false }
            }
    ];

    const response = await firestoreRequest(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:commit`, {
        method: "POST",
        body: JSON.stringify({ writes })
    });
    if (!response.writeResults || response.writeResults.length !== 2) throw new Error("FIRESTORE_COMMIT");
    return nowe;
}

async function verifyYoutubeSubscription(accessToken, firebaseEmail) {
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!userResponse.ok) throw new Error("GOOGLE_AUTORYZACJA");
    const user = await userResponse.json();
    if (!user.email || String(user.email).toLowerCase() !== String(firebaseEmail).toLowerCase()) throw new Error("YOUTUBE_KONTO_NIEZGODNE");

    const url = new URL("https://www.googleapis.com/youtube/v3/subscriptions");
    url.searchParams.set("part", "id,snippet");
    url.searchParams.set("mine", "true");
    url.searchParams.set("forChannelId", YOUTUBE_CHANNEL_ID);
    url.searchParams.set("maxResults", "1");
    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!response.ok) throw new Error("YOUTUBE_WERYFIKACJA");
    const data = await response.json();
    if (!Array.isArray(data.items) || data.items.length === 0) throw new Error("YOUTUBE_NIE_SUBSKRYBUJE");
    return true;
}

app.get("/api/health", async (_req, res) => {
    let firebaseConfigured = false;
    try { getServiceAccount(); firebaseConfigured = true; } catch {}
    res.json({ ok: true, youtubeMission: true, firebaseAdminConfigured: firebaseConfigured });
});

app.post("/api/missions/youtube", async (req, res) => {
    try {
        const authHeader = req.get("authorization") || "";
        const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
        const accessToken = typeof req.body?.accessToken === "string" ? req.body.accessToken : "";
        if (!idToken || !accessToken) return res.status(401).json({ ok: false, code: "BRAK_AUTORYZACJI" });
        const firebaseUser = await verifyFirebaseIdToken(idToken);
        await verifyYoutubeSubscription(accessToken, firebaseUser.email);
        const gwiazdki = await awardYoutubeMission(firebaseUser.sub);
        res.json({ ok: true, gwiazdki, nagroda: YOUTUBE_MISSION_REWARD });
    } catch (error) {
        const known = ["YOUTUBE_NIE_SUBSKRYBUJE", "YOUTUBE_KONTO_NIEZGODNE", "MISJA_WYKONANA", "GOOGLE_AUTORYZACJA", "YOUTUBE_WERYFIKACJA", "BRAK_POSTEPU"];
        const code = known.includes(error.message) ? error.message : "YOUTUBE_WERYFIKACJA";
        console.error("Misja YouTube:", code);
        res.status(code === "MISJA_WYKONANA" ? 409 : 400).json({ ok: false, code });
    }
});

app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.listen(PORT, () => console.log(`🚀 Serwer działa na porcie ${PORT}`));
