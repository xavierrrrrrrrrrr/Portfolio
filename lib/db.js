import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createClient } from "@supabase/supabase-js";

let dbInstance = null;
let supabaseClient = null;

// Supabase backend (used when SUPABASE_URL + SUPABASE_SECRET_KEY are set,
// e.g. on Vercel). Otherwise falls back to local SQLite for development.
function getSupabase() {
  if (supabaseClient) return supabaseClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  supabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabaseClient;
}

function toRow(data) {
  const clean = (v) => (typeof v === "string" ? v.trim() : "");
  return {
    name: clean(data.name),
    email: clean(data.email),
    company: clean(data.company),
    service: data.service || "",
    budget: data.budget || "",
    timeline: data.timeline || "",
    message: clean(data.message),
    selected_day: data.selected_day || "",
    selected_slot: data.selected_slot || "",
  };
}

function getDatabase() {
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

export async function insertInquiry(data) {
  const sb = getSupabase();
  if (sb) {
    const { data: row, error } = await sb
      .from("inquiries")
      .insert(toRow(data))
      .select("id")
      .single();
    if (error) throw error;
    return Number(row.id);
  }

  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO inquiries (
      name, email, company, service, budget, timeline, message, selected_day, selected_slot
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const r = toRow(data);
  const result = stmt.run(
    r.name,
    r.email,
    r.company,
    r.service,
    r.budget,
    r.timeline,
    r.message,
    r.selected_day,
    r.selected_slot
  );
  return Number(result.lastInsertRowid);
}

// Insert an inquiry, but refuse to double-book an already taken
// (selected_day, selected_slot) pair. Returns the new id, or null on conflict.
export async function tryInsertInquiry(data) {
  const sb = getSupabase();
  if (sb) {
    // The partial unique index on (selected_day, selected_slot) enforces
    // this at the database level — 23505 = unique_violation.
    const { data: row, error } = await sb
      .from("inquiries")
      .insert(toRow(data))
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505") return null;
      throw error;
    }
    return Number(row.id);
  }

  const db = getDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    if (data.selected_day && data.selected_slot) {
      const existing = db
        .prepare(
          "SELECT id FROM inquiries WHERE selected_day = ? AND selected_slot = ? LIMIT 1"
        )
        .get(data.selected_day, data.selected_slot);
      if (existing) {
        db.exec("ROLLBACK");
        return null;
      }
    }
    const id = await insertInquiry(data);
    db.exec("COMMIT");
    return id;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

export async function getAllInquiries() {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("inquiries")
      .select("*")
      .order("id", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data;
  }

  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM inquiries ORDER BY id DESC LIMIT 50
  `);
  return stmt.all();
}
