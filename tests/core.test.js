import test from "node:test";
import assert from "node:assert/strict";
import { getReply, createLead, getDashboardSummary } from "../src/core.js";

test("answers service questions in Hindi and English", () => {
  assert.match(getReply("laptop repair", "both"), /Laptop/);
  assert.match(getReply("लैपटॉप रिपेयर", "both"), /लैपटॉप/);
});

test("captures a lead only with valid name, phone and issue", () => {
  assert.equal(createLead({ name: "A", phone: "123", issue: "screen" }).ok, false);
  assert.equal(createLead({ name: "Ravi", phone: "9876543210", issue: "screen" }).ok, true);
});

test("summarizes sales and expenses without negative profit confusion", () => {
  assert.deepEqual(getDashboardSummary([{ amount: 1000, type: "sale" }, { amount: 400, type: "expense" }]), { sales: 1000, expenses: 400, profit: 600 });
});
