import { readFileSync } from "node:fs";

const files = [
    "js/app.js",
    "js/config.js",
    "js/firebase.js",
    "data/curriculum.js",
    "data/missions.js"
];

for (const file of files) {
    const source = readFileSync(file, "utf8");
    if (!source.trim()) throw new Error(`${file} is empty`);
    if (source.includes("TODO: REMOVE")) {
        throw new Error(`${file} contains a temporary marker`);
    }
}

console.log(`Client source check passed (${files.length} modules).`);
