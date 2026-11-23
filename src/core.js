export function getReply(message, language = "both") {
  const q = String(message || "").toLowerCase();
  const hi = language === "hindi";
  const en = language === "english";
  const answer = (h, e) => hi ? h : en ? e : h + "\n\n" + e;
  if (/price|cost|rate|कीमत|रेट|कितना/.test(q)) return answer("कृपया डिवाइस का मॉडल और समस्या बताएं। जांच के बाद सही कीमत बताई जाएगी।", "Please share the device model and issue. We’ll confirm the price after diagnosis.");
  if (/repair|रिपेयर|खराब|काम नहीं|not working|issue/.test(q)) return answer("हम Laptop, Desktop, MacBook, Printer और Motherboard की जांच/रिपेयर करते हैं। कृपया मॉडल, समस्या और अपना नाम/फोन साझा करें।", "We diagnose and repair laptops, desktops, MacBooks, printers and motherboards. Please share the model, issue, name and phone number.");
  if (/ssd|ram|upgrade|एसएसडी|रैम/.test(q)) return answer("RAM और SSD upgrade उपलब्ध हैं। डिवाइस मॉडल और मौजूदा configuration भेजें।", "RAM and SSD upgrades are available. Send your device model and current configuration.");
  if (/address|location|पता|कहाँ|kharghar/.test(q)) return answer("पता: Shop No. 8, Medical Health Care Center, Plot No. 19C, Sector 20, Kharghar, Navi Mumbai, Maharashtra 410210.", "Address: Shop No. 8, Medical Health Care Center, Plot No. 19C, Sector 20, Kharghar, Navi Mumbai, Maharashtra 410210.");
  if (/time|hours|open|समय|कब खुल/.test(q)) return answer("दुकान रोज़ सुबह 8:00 बजे से रात 10:00 बजे तक खुली रहती है।", "We are open daily from 8:00 AM to 10:00 PM.");
  if (/refurb|used|second hand|पुराना लैपटॉप/.test(q)) return answer("Refurbished laptop की उपलब्धता और कीमत जानने के लिए मॉडल/बजट भेजें।", "Share your preferred model and budget to check refurbished laptop availability and pricing.");
  return answer("RK TECH SOLUTIONS में आपका स्वागत है। बताएं आपको repair, upgrade, refurbished laptop या printer service चाहिए?", "Welcome to RK TECH SOLUTIONS. Do you need a repair, upgrade, refurbished laptop or printer service?");
}

export function createLead(input = {}) {
  const name = String(input.name || "").trim();
  const phone = String(input.phone || "").replace(/\\D/g, "");
  const issue = String(input.issue || "").trim();
  if (name.length < 2 || !/^\\d{10}$/.test(phone) || issue.length < 3) return { ok: false, error: "Name, valid 10-digit phone and issue are required." };
  return { ok: true, lead: { name, phone, issue, createdAt: new Date().toISOString(), status: "New" } };
}

export function getDashboardSummary(entries = []) {
  const sales = entries.filter(x => x.type === "sale").reduce((n, x) => n + Number(x.amount || 0), 0);
  const expenses = entries.filter(x => x.type === "expense").reduce((n, x) => n + Number(x.amount || 0), 0);
  return { sales, expenses, profit: sales - expenses };
}
