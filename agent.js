import { getReply, createLead, getDashboardSummary } from "./core.js";

const $ = (id) => document.getElementById(id);
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let leads = read("rk_leads", []);
let entries = read("rk_entries", []);

function showTab(tab) {
  document.querySelectorAll("[data-panel]").forEach(el => el.hidden = el.dataset.panel !== tab);
  document.querySelectorAll("[data-tab]").forEach(el => el.classList.toggle("active", el.dataset.tab === tab));
}
document.querySelectorAll("[data-tab]").forEach(el => el.addEventListener("click", () => showTab(el.dataset.tab)));

function addMessage(text, who) {
  const node = document.createElement("div");
  node.className = "message " + who;
  node.textContent = text;
  $("chatLog").append(node);
  $("chatLog").scrollTop = $("chatLog").scrollHeight;
}
$("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const value = $("question").value.trim();
  if (!value) return;
  addMessage(value, "user");
  addMessage(getReply(value, $("language").value), "agent");
  $("question").value = "";
});
$("leadForm").addEventListener("submit", e => {
  e.preventDefault();
  const result = createLead({ name: $("leadName").value, phone: $("leadPhone").value, issue: $("leadIssue").value });
  $("leadStatus").textContent = result.ok ? "Lead saved on this device." : result.error;
  if (!result.ok) return;
  leads.unshift(result.lead); write("rk_leads", leads); renderLeads(); e.target.reset();
});
$("entryForm").addEventListener("submit", e => {
  e.preventDefault();
  const amount = Number($("entryAmount").value);
  if (!Number.isFinite(amount) || amount <= 0) return;
  entries.push({ type: $("entryType").value, amount, note: $("entryNote").value.trim(), date: new Date().toISOString() });
  write("rk_entries", entries); renderFinance(); e.target.reset();
});
function renderLeads() {
  $("leadList").replaceChildren();
  leads.forEach(lead => {
    const li = document.createElement("li");
    li.textContent = lead.name + " · " + lead.phone + " · " + lead.issue + " · " + lead.status;
    $("leadList").append(li);
  });
  $("leadCount").textContent = String(leads.length);
}
function renderFinance() {
  const s = getDashboardSummary(entries);
  $("salesTotal").textContent = "₹" + s.sales.toLocaleString("en-IN");
  $("expenseTotal").textContent = "₹" + s.expenses.toLocaleString("en-IN");
  $("profitTotal").textContent = "₹" + s.profit.toLocaleString("en-IN");
  $("entryList").replaceChildren();
  entries.slice().reverse().forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry.type.toUpperCase() + " · ₹" + entry.amount.toLocaleString("en-IN") + (entry.note ? " · " + entry.note : "");
    $("entryList").append(li);
  });
}
$("exportLeads").addEventListener("click", () => {
  const csv = ["Name,Phone,Issue,Created,Status", ...leads.map(x => [x.name,x.phone,x.issue,x.createdAt,x.status].map(v => '"' + String(v).replaceAll('"','""') + '"').join(","))].join("\\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"})); a.download = "rk-tech-leads.csv"; a.click(); URL.revokeObjectURL(a.href);
});
renderLeads(); renderFinance(); showTab("assistant");
