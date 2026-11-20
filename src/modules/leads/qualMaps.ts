/** UI labels -> API values for the qualification fields (shared by the agent form and the admin drawer). */
export const mapTimeline = (t: string) => {
  if (/0 to 3|immediate/i.test(t)) return "immediate";
  if (/3 to 6/i.test(t)) return "3_months";
  if (/6 to 12/i.test(t)) return "6_months";
  return t || "";
};

export const mapPayment = (t: string) => {
  const x = t.toLowerCase();
  if (x.includes("cash")) return "cash";
  if (x.includes("mortgage")) return "mortgage";
  if (x.includes("plan")) return "payment_plan";
  return t || "";
};

export const mapPurpose = (t: string) => {
  const x = t.toLowerCase();
  if (x.includes("invest")) return "investment";
  if (x.includes("own") || x.includes("end")) return "end_use";
  return t || "";
};

export const mapPtype = (t: string) => {
  const x = t.toLowerCase();
  if (x.includes("off-plan") || x.includes("off plan")) return "off_plan";
  if (x.includes("villa")) return "villa";
  if (x.includes("town")) return "townhouse";
  if (x.includes("commercial")) return "commercial";
  if (x.includes("apartment") || x.includes("ready")) return "apartment";
  return t || "";
};
const LABELS: Record<string, string> = {
  immediate: "0 to 3 months",
  "3_months": "3 to 6 months",
  "6_months": "6 to 12 months",
  cash: "Cash",
  mortgage: "Mortgage",
  payment_plan: "Payment plan",
  investment: "Investment",
  end_use: "Own use",
  off_plan: "Off-plan apartment",
  apartment: "Ready apartment",
  villa: "Villa",
  townhouse: "Townhouse",
  commercial: "Commercial",
};

/** API value -> the label the forms and cards show (unknown values pass through). */
export const qualLabel = (v: unknown) => (v ? LABELS[String(v)] || String(v) : "");