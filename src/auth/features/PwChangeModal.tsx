/*
 * Change password pop-up (modal pw-change), opened from Settings.
 * Wired to POST /v1/auth/change-password/.
 */
import React from "react";
import { eng, bump, closeM, renderOverlay, toast } from "../../engine";
import { Fld, MInput, Modal } from "../../ui";
import type { ModalComp } from "../../app/types";
import { apiErrorToForm, changePasswordWithApi } from "../session";
import { passwordHint } from "../password";

async function submitChange() {
  const UI = eng.UI;
  if (UI.mf._busy) return;

  const cur = String(UI.mf.cur || "");
  const nw = String(UI.mf.nw || "");
  const cf = String(UI.mf.cf || "");
  const e: Record<string, string> = {};

  if (!cur) e.cur = "Enter your current password.";
  const hint = passwordHint(nw);
  if (hint) e.nw = hint;
  else if (nw === cur) e.nw = "Choose a password you have not used before.";
  if (cf !== nw) e.cf = "The two passwords do not match.";

  if (Object.keys(e).length) {
    UI.mf._e = e;
    renderOverlay();
    return;
  }

  UI.mf._busy = true;
  UI.mf._e = {};
  bump();
  renderOverlay();

  try {
    await changePasswordWithApi(cur, nw);
    UI.mf._busy = false;
    closeM();
    toast("Password updated", "ok");
  } catch (err) {
    const mapped = apiErrorToForm(err);
    UI.mf._busy = false;
    UI.mf._e = {
      ...(mapped.fields.current_password ? { cur: mapped.fields.current_password } : {}),
      ...(mapped.fields.new_password ? { nw: mapped.fields.new_password } : {}),
      ...(mapped.fields.cur ? { cur: mapped.fields.cur } : {}),
      ...(mapped.fields.nw ? { nw: mapped.fields.nw } : {}),
    };
    if (!Object.keys(UI.mf._e).length && mapped.message) {
      UI.mf._e = { cur: mapped.message };
    }
    renderOverlay();
  }
}

export const PwChangeModal: ModalComp = () => {
  const e = eng.UI.mf._e || {};
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal
      title="Change password"
      foot={
        <>
          <button className="btn" type="button" data-act="mclose" disabled={busy}>
            Cancel
          </button>
          <button
            className="btn pri"
            type="button"
            disabled={busy}
            onClick={() => void submitChange()}
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </>
      }
    >
      <Fld label="Current password" htmlFor="m_cur" err={e.cur}>
        <MInput k="cur" type="password" bad={!!e.cur} />
      </Fld>
      <Fld
        label="New password"
        htmlFor="m_nw"
        err={e.nw}
        hint="At least 8 characters with a letter and a number."
      >
        <MInput k="nw" type="password" bad={!!e.nw} />
      </Fld>
      <Fld label="Confirm new password" htmlFor="m_cf" err={e.cf}>
        <MInput k="cf" type="password" bad={!!e.cf} />
      </Fld>
    </Modal>
  );
};
