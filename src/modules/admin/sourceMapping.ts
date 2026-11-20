/**
 * Lead Sources: field-mapping step of the Meta / Google connect wizard.
 * Each form question is mapped to a CRM field, then checked before the source can be connected:
 *  - Name and Phone must be mapped (leads are de-duplicated on phone)
 *  - Name, Phone, Email, City, Budget and Project interest can each be filled by only one question
 *  - sample answers must look like the field they feed (phone, email, budget, name)
 *
 * There is no lead-source API yet, so the form questions below are the prototype's sample questions
 * and the mapping is stored on the connected source in the engine state.
 */
import { actions, eng, renderOverlay } from "../../engine";

export interface FormQuestion {
  q: string;
  sample: string;
}

export const CRM_FIELDS: Array<[string, string]> = [
  ["name", "Full name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["city", "City"],
  ["budget", "Budget"],
  ["project", "Project interest"],
  ["notes", "Notes"],
  ["skip", "Do not import"],
];

/** Fields that only one form question may fill. */
const SINGLE = ["name", "phone", "email", "city", "budget", "project"];
const REQUIRED = ["name", "phone"];
const FIELD_LABEL: Record<string, string> = Object.fromEntries(CRM_FIELDS);

export const FORM_QUESTIONS: Record<string, FormQuestion[]> = {
  meta: [
    { q: "Full name", sample: "Sara Khan" },
    { q: "Phone number", sample: "+971 50 123 4567" },
    { q: "Email", sample: "sara.khan@example.com" },
    { q: "City", sample: "Dubai" },
    { q: "What is your budget?", sample: "AED 1,500,000" },
    { q: "Which project are you interested in?", sample: "Marina Views" },
    { q: "How should we contact you?", sample: "WhatsApp" },
  ],
  google: [
    { q: "Full name", sample: "Rahul Mehta" },
    { q: "Mobile number", sample: "+91 98765 43210" },
    { q: "Work email", sample: "rahul.mehta@example.com" },
    { q: "Preferred location", sample: "Dubai Marina" },
    { q: "Budget range", sample: "AED 2M to 3M" },
    { q: "Property interest", sample: "Palm Crest" },
    { q: "Any other requirement", sample: "Sea view, high floor" },
  ],
};

/** Best guess for a question, from its wording. */
export function suggestField(question: string): string {
  const q = question.toLowerCase();
  if (/e-?mail/.test(q)) return "email";
  if (/phone|mobile|whatsapp number|contact number/.test(q)) return "phone";
  if (/name/.test(q)) return "name";
  if (/budget|price/.test(q)) return "budget";
  if (/city|location|area/.test(q)) return "city";
  if (/project|property|interested/.test(q)) return "project";
  if (/requirement|message|comment|contact you/.test(q)) return "notes";
  return "skip";
}

function sampleProblem(field: string, sample: string): string | null {
  const s = sample.trim();
  if (field === "phone") {
    const digits = s.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15 || /[a-z]/i.test(s)) return `Sample "${s}" does not look like a phone number.`;
  }
  if (field === "email" && !/^\S+@\S+\.\S+$/.test(s)) return `Sample "${s}" does not look like an email address.`;
  if (field === "budget" && !/\d/.test(s)) return `Sample "${s}" has no amount in it.`;
  if (field === "name" && (s.length < 2 || /^[\d\s+()-]+$/.test(s))) return `Sample "${s}" does not look like a name.`;
  return null;
}

export interface MappingCheck {
  /** inline error per question row: mp0, mp1, ... */
  errors: Record<string, string>;
  /** summary checks shown in the checklist */
  list: Array<{ ok: boolean; text: string }>;
  ok: boolean;
  mapped: number;
  skipped: number;
}

export function currentMap(k: string, f: any): Array<{ q: string; sample: string; field: string }> {
  return (FORM_QUESTIONS[k] || []).map((x, i) => ({ ...x, field: String(f["mp" + i] || "") }));
}

export function checkMapping(k: string, f: any): MappingCheck {
  const rows = currentMap(k, f);
  const errors: Record<string, string> = {};

  const missing = REQUIRED.filter((fld) => !rows.some((r) => r.field === fld));
  const unset = rows.filter((r) => !r.field);
  rows.forEach((r, i) => {
    if (!r.field) errors["mp" + i] = "Choose a CRM field, or Do not import.";
  });

  let dupes = 0;
  SINGLE.forEach((fld) => {
    const hits = rows.map((r, i) => ({ r, i })).filter((x) => x.r.field === fld);
    hits.slice(1).forEach((x) => {
      dupes++;
      errors["mp" + x.i] = `${FIELD_LABEL[fld]} is already filled by "${hits[0].r.q}". Map one question per field.`;
    });
  });

  let badSamples = 0;
  rows.forEach((r, i) => {
    if (errors["mp" + i] || !r.field) return;
    const p = sampleProblem(r.field, r.sample);
    if (p) {
      badSamples++;
      errors["mp" + i] = p + " Pick a different field.";
    }
  });

  const mapped = rows.filter((r) => r.field && r.field !== "skip").length;
  const skipped = rows.filter((r) => r.field === "skip").length;
  const list = [
    { ok: !missing.includes("name"), text: "Name is mapped" },
    { ok: !missing.includes("phone"), text: "Phone is mapped (used to spot duplicate leads)" },
    { ok: !unset.length, text: "Every question has a choice" },
    { ok: !dupes, text: "Each CRM field is filled by only one question" },
    { ok: !badSamples, text: "Sample answers match their fields" },
  ];
  return {
    errors,
    list,
    ok: list.every((x) => x.ok),
    mapped,
    skipped,
  };
}

/** Seed (or reset) the mapping from the question wording. */
export function seedMapping(k: string, f: any): void {
  (FORM_QUESTIONS[k] || []).forEach((x, i) => {
    f["mp" + i] = suggestField(x.q);
  });
}

export function installSourceMappingOverrides(): void {
  const A = actions();
  const origNext = A.srcnext;
  const origSave = A.srcsave;

  A.srcnext = (a: string[], el: any) => {
    const f = eng.UI.mf;
    const k = a[0];
    if (f.st === 3) {
      const c = checkMapping(k, f);
      if (!c.ok) {
        f._e = { ...c.errors, map: "Fix the mapping before you continue." };
        renderOverlay();
        return;
      }
      f._e = {};
      f.st = 4;
      renderOverlay();
      return;
    }
    origNext?.(a, el);
    // Landing on the mapping step: pre-fill from the question wording (once).
    if (f.st === 3 && f.mp0 === undefined) seedMapping(k, f);
    if (f.st === 3) renderOverlay();
  };

  A.srcmapreset = (a: string[]) => {
    const f = eng.UI.mf;
    seedMapping(a[0], f);
    f._e = {};
    renderOverlay();
  };

  A.srcsave = (a: string[], el: any) => {
    const f = eng.UI.mf;
    const k = a[0];
    const c = checkMapping(k, f);
    if (!c.ok) {
      f.st = 3;
      f._e = { ...c.errors, map: "Fix the mapping before you connect." };
      renderOverlay();
      return;
    }
    const mapping = currentMap(k, f).map(({ q, field }) => ({ q, field }));
    const summary = mapping
      .filter((m) => m.field !== "skip")
      .map((m) => `${m.q} → ${FIELD_LABEL[m.field]}`)
      .join("; ");
    origSave?.(a, el);
    const src = eng.S.sources[k];
    if (src && Array.isArray(src.forms)) src.forms.forEach((fm: any) => (fm.map = mapping));
    eng.audit("Lead source field mapping", eng.SRCN[k][0], "", summary);
  };
}
