const express = require("express");
const path = require("path");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_CHANNEL_ID = "UC2Wi6cHYsLz48s95HHeOptw";
const YOUTUBE_MISSION_ID = "youtube_subskrypcja";

app.use(express.json({ limit: "32kb" }));
app.use(express.static(__dirname));

function initFirebaseAdmin() {
    if (admin.apps.length) return admin.app();
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error("Brak FIREBASE_SERVICE_ACCOUNT_JSON na serwerze.");
    let serviceAccount;
    try {
        serviceAccount = JSON.parse(raw);
    } catch {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON nie jest poprawnym JSON-em.");
    }
    return admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

app.post("/api/missions/youtube/verify", async (req, res) => {
    try {
        const authHeader = req.get("authorization") || "";
        const firebaseIdToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
        const youtubeAccessToken = typeof req.body?.youtubeAccessToken === "string" ? req.body.youtubeAccessToken.trim() : "";
        if (!firebaseIdToken || !youtubeAccessToken) {
            return res.status(400).json({ ok: false, code: "BRAK_AUTORYZACJI" });
        }

        const firebaseApp = initFirebaseAdmin();
        const decoded = await firebaseApp.auth().verifyIdToken(firebaseIdToken);
        if (!decoded.uid || decoded.firebase?.sign_in_provider === "anonymous") {
            return res.status(403).json({ ok: false, code: "KONTO_NIE_OBSLUGIWANE" });
        }

        const youtubeUrl = new URL("https://www.googleapis.com/youtube/v3/subscriptions");
        youtubeUrl.searchParams.set("part", "id");
        youtubeUrl.searchParams.set("mine", "true");
        youtubeUrl.searchParams.set("forChannelId", YOUTUBE_CHANNEL_ID);
        youtubeUrl.searchParams.set("maxResults", "50");

        const youtubeResponse = await fetch(youtubeUrl, {
            headers: { Authorization: `Bearer ${youtubeAccessToken}` }
        });
        const youtubeData = await youtubeResponse.json().catch(() => ({}));

        if (youtubeResponse.status === 401 || youtubeResponse.status === 403) {
            return res.status(401).json({ ok: false, code: "YOUTUBE_AUTORYZACJA", detail: youtubeData?.error?.errors?.[0]?.reason || "Brak uprawnień YouTube." });
        }
        if (!youtubeResponse.ok) {
            console.error("YouTube API error:", youtubeResponse.status, youtubeData);
            return res.status(502).json({ ok: false, code: "YOUTUBE_API" });
        }

        const subscribed = Array.isArray(youtubeData.items) && youtubeData.items.length > 0;
        if (!subscribed) {
            return res.status(200).json({ ok: false, code: "BRAK_SUBSKRYPCJI" });
        }

        const db = firebaseApp.firestore();
        const postepRef = db.collection("postepy").doc(decoded.uid);
        const misjeRef = db.collection("misje").doc(decoded.uid);
        let newStars = 0;
        let alreadyClaimed = false;

        await db.runTransaction(async tx => {
            const [postepSnap, misjeSnap] = await Promise.all([tx.get(postepRef), tx.get(misjeRef)]);
            if (!postepSnap.exists) throw new Error("BRAK_POSTEPU");
            const postep = postepSnap.data() || {};
            const wykonane = misjeSnap.exists ? (misjeSnap.data().wykonane || {}) : {};
            if (wykonane[YOUTUBE_MISSION_ID]) {
                alreadyClaimed = true;
                newStars = Number(postep.gwiazdki) || 0;
                return;
            }

            const currentStars = Math.max(0, Math.min(10, Number(postep.gwiazdki) || 0));
            newStars = Math.min(10, currentStars + 1);
            tx.set(misjeRef, {
                uid: decoded.uid,
                wykonane: { ...wykonane, [YOUTUBE_MISSION_ID]: true },
                ostatniaMisja: YOUTUBE_MISSION_ID,
                zaktualizowano: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            tx.update(postepRef, {
                gwiazdki: newStars,
                misja: YOUTUBE_MISSION_ID,
                zaktualizowano: admin.firestore.FieldValue.serverTimestamp()
            });
        });

        return res.json({ ok: true, alreadyClaimed, gwiazdki: newStars });
    } catch (error) {
        if (error?.message === "BRAK_POSTEPU") return res.status(409).json({ ok: false, code: "BRAK_POSTEPU" });
        console.error("Weryfikacja misji YouTube nie powiodła się:", error);
        return res.status(500).json({ ok: false, code: "SERWER" });
    }
});

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        youtubeMission: true,
        firebaseAdminConfigured: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na porcie ${PORT}`);
});
