/* Admin: add a project to a lead's shortlist from the lead's Properties tab (args: [leadId]). */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Fld, MSel, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const LeadShortlistAddModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]);
  const f = eng.UI.mf;
  const err = f._e && f._e.proj;
  const busy = !!f._busy;
  const projects: any[] = eng.S.projects.filter((p: any) => p.active !== false && !(l.shortlist || []).some((s: any) => s.p === p.id));
  return (
    <Modal title="Add property" sub={l.name + ' · LEAD-' + l.id} drawer
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button>{projects.length ? <BusyBtn busy={busy} act={`leadshortsave|${l.id}`} label="Add to shortlist" busyLabel="Adding…" /> : null}</>}>
      {projects.length ? (
        <>
          <Fld label="Property" htmlFor="m_proj" err={err}>
            <MSel k="proj" opts={projects.map((p) => [p.id, p.name + (p.area ? ' · ' + p.area : '')] as [string, string])} bad={!!err} blank="Choose a property" />
          </Fld>
          <Fld label="Note (optional)" htmlFor="m_txt"><MTxa k="txt" /></Fld>
          <Bn kind="info" body="This is logged in the lead timeline and the audit log." />
        </>
      ) : <Bn kind="info" title="" body="Every project is already shortlisted for this lead." />}
    </Modal>
  );
};
