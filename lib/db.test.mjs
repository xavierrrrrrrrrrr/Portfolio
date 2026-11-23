import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Point the database at a throwaway directory before importing db.js,
// which resolves data/inquiries.db lazily from process.cwd().
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "inquiries-test-"));
process.chdir(tmpDir);

const { insertInquiry, tryInsertInquiry, getAllInquiries } = await import(
  "./db.js"
);

const baseInquiry = {
  name: "Test User",
  email: "test@example.com",
  company: "Acme",
  service: "Full-Stack",
  budget: "$1k – $5k",
  timeline: "Immediate",
  message: "Hello",
  selected_day: "2026-12-01",
  selected_slot: "10:30 EST",
};

test("insertInquiry persists a row readable by getAllInquiries", async () => {
  const id = await insertInquiry(baseInquiry);
  assert.equal(typeof id, "number");

  const rows = await getAllInquiries();
  const row = rows.find((r) => r.id === id);
  assert.ok(row);
  assert.equal(row.email, "test@example.com");
  assert.equal(row.selected_day, "2026-12-01");
  assert.equal(row.selected_slot, "10:30 EST");
});

test("tryInsertInquiry refuses a duplicate day+slot booking", async () => {
  const first = await tryInsertInquiry({ ...baseInquiry, selected_day: "2026-12-02" });
  assert.equal(typeof first, "number");

  const dupe = await tryInsertInquiry({ ...baseInquiry, selected_day: "2026-12-02" });
  assert.equal(dupe, null);
});

test("tryInsertInquiry allows a different slot on the same day", async () => {
  const id = await tryInsertInquiry({
    ...baseInquiry,
    selected_day: "2026-12-02",
    selected_slot: "14:00 EST",
  });
  assert.equal(typeof id, "number");
});

test("inquiries without a booking slot never conflict", async () => {
  const noSlot = { ...baseInquiry, selected_day: "", selected_slot: "" };
  const a = await tryInsertInquiry(noSlot);
  const b = await tryInsertInquiry(noSlot);
  assert.equal(typeof a, "number");
  assert.equal(typeof b, "number");
});
