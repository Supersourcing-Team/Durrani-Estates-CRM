/* Add a project to a lead's shortlist (prototype modal shortlist-add; args: [projectId]). Save runs A.shortsave. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const ShortlistAddModal: ModalComp = ({ args }) => {
  const pr = eng.projById(args[0]);
  const ls: any[] = eng.leadsOf(eng.me().id).filter((l: any) => !l.shortlist.some((s: any) => s.p === pr.id));
  const err = eng.UI.mf._e && eng.UI.mf._e.lead;
  return (
    <Modal title="Add to a lead" sub={pr.name}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button>{ls.length ? <button className="btn pri" type="button" data-act={`shortsave|${pr.id}`}>Add</button> : null}</>}>
      {ls.length ? (
        <Fld label="Lead" htmlFor="m_lead" err={err}>
          <MSel k="lead" opts={ls.map((l) => [l.id, l.name + ' · LEAD-' + l.id] as [string, string])} bad={!!err} blank="Choose a lead" />
        </Fld>
      ) : <Bn kind="info" title="" body="All your leads already have this project." />}
    </Modal>
  );
};
