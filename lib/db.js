import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

let dbInstance = null;

export function getDatabase() {
  if (dbInstance) return dbInstance;

  let dbPath;
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    dbPath = path.join(dataDir, "inquiries.db");
  } catch {
    dbPath = path.join("/tmp", "inquiries.db");
  }

  const db = new DatabaseSync(dbPath);

  // 1. Create base table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      service TEXT,
      budget TEXT,
      timeline TEXT,
      message TEXT,
      selected_day TEXT,
      selected_slot TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Safe schema migration: ensure selected_day & selected_slot columns exist
  try {
    const cols = db.prepare("PRAGMA table_info(inquiries)").all();
    const colNames = new Set(cols.map((c) => c.name));

    if (!colNames.has("selected_day")) {
      db.exec("ALTER TABLE inquiries ADD COLUMN selected_day TEXT;");
    }
    if (!colNames.has("selected_slot")) {
      db.exec("ALTER TABLE inquiries ADD COLUMN selected_slot TEXT;");
    }
    if (!colNames.has("company")) {
      db.exec("ALTER TABLE inquiries ADD COLUMN company TEXT;");
    }
    if (!colNames.has("service")) {
      db.exec("ALTER TABLE inquiries ADD COLUMN service TEXT;");
    }
    if (!colNames.has("budget")) {
      db.exec("ALTER TABLE inquiries ADD COLUMN budget TEXT;");
    }
    if (!colNames.has("timeline")) {
      db.exec("ALTER TABLE inquiries ADD COLUMN timeline TEXT;");
    }
    if (!colNames.has("message")) {
      db.exec("ALTER TABLE inquiries ADD COLUMN message TEXT;");
    }
  } catch (err) {
    console.error("Migration warning in inquiries table:", err);
  }

  dbInstance = db;
  return db;
}

export function insertInquiry(data) {
  const db = getDatabase();

  const stmt = db.prepare(`
    INSERT INTO inquiries (
      name, email, company, service, budget, timeline, message, selected_day, selected_slot
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.name.trim(),
    data.email.trim(),
    (data.company || "").trim(),
    data.service || "",
    data.budget || "",
    data.timeline || "",
    (data.message || "").trim(),
    data.selected_day || "",
    data.selected_slot || ""
  );

  return Number(result.lastInsertRowid);
}

export function getAllInquiries() {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM inquiries ORDER BY id DESC LIMIT 50
  `);
  return stmt.all();
}
