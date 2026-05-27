import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Find local D1 SQLite
const d1Dir = join(__dirname, "../.wrangler/state/v3/d1/miniflare-D1DatabaseObject");
const files = readdirSync(d1Dir).filter((f) => f.endsWith(".sqlite") && !f.includes("metadata"));
if (files.length === 0) throw new Error("D1 SQLite file not found");
const dbPath = join(d1Dir, files[0]);

// Hash password using PBKDF2 (same logic as server.ts)
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 },
    keyMaterial,
    256,
  );
  const toHex = (arr) =>
    Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${toHex(salt)}:${toHex(new Uint8Array(hashBuffer))}`;
}

const Database = require("better-sqlite3");
const db = new Database(dbPath);

const adminEmail = "admin@test.com";
const adminPassword = "password123";
const adminId = crypto.randomUUID();

const passwordHash = await hashPassword(adminPassword);

// Delete existing test admin if any
db.prepare("DELETE FROM admin WHERE email = ?").run(adminEmail);

db.prepare(
  "INSERT INTO admin (id, email, password_hash) VALUES (?, ?, ?)"
).run(adminId, adminEmail, passwordHash);

console.log("✅ Admin user created:");
console.log(`   Email:    ${adminEmail}`);
console.log(`   Password: ${adminPassword}`);

// Also insert test data: hackathon, teams, scoring items
const hackathonId = crypto.randomUUID();
db.prepare("DELETE FROM hackathon WHERE id = ?").run(hackathonId);
db.prepare(
  "INSERT OR IGNORE INTO hackathon (id, name, scoring_date, access_password) VALUES (?, ?, ?, ?)"
).run(hackathonId, "テストハッカソン2026", "2026-06-01", "guest123");

const teams = ["チームA", "チームB", "チームC"];
const teamIds = teams.map(() => crypto.randomUUID());
for (let i = 0; i < teams.length; i++) {
  db.prepare(
    "INSERT OR IGNORE INTO team (id, name, hackathon_id) VALUES (?, ?, ?)"
  ).run(teamIds[i], teams[i], hackathonId);
}

const items = [
  { name: "技術力", max: 30 },
  { name: "アイデア", max: 30 },
  { name: "プレゼン", max: 20 },
  { name: "完成度", max: 20 },
];
for (const item of items) {
  db.prepare(
    "INSERT OR IGNORE INTO scoring_item (id, name, max_score, hackathon_id) VALUES (?, ?, ?, ?)"
  ).run(crypto.randomUUID(), item.name, item.max, hackathonId);
}

console.log("\n✅ Test hackathon created:");
console.log(`   Name:            テストハッカソン2026`);
console.log(`   Access Password: guest123`);
console.log(`   Teams:           ${teams.join(", ")}`);
console.log(`   Scoring Items:   ${items.map((i) => i.name).join(", ")}`);

db.close();
