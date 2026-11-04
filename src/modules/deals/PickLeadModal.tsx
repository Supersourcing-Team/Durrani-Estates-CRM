/* Choose the lead for a new booking (prototype modal pick-lead; args: [projectId, unitId]). Continue runs A.picksave. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const PickLeadModal: ModalComp = ({ args }) => {
  const S = eng.S;
  const ls: any[] = eng.leadsOf(eng.me().id).filter((l: any) => l.track === 'property' && !S.bookings.some((b: any) => b.lead === l.id && ['pending', 'changes', 'approved'].includes(b.status)));
  const err = eng.UI.mf._e && eng.UI.mf._e.lead;
  return (
    <Modal title="Who is booking?" sub={eng.projById(args[0]).name + ' · ' + args[1]}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button>{ls.length ? <button className="btn pri" type="button" data-act={`picksave|${args[0]}|${args[1]}`}>Continue</button> : null}</>}>
      {ls.length ? (
        <Fld label="Lead" htmlFor="m_lead" err={err} hint="Only Property Sale leads without an open booking.">
          <MSel k="lead" opts={ls.map((l) => [l.id, l.name + ' · LEAD-' + l.id + (l.qualified ? '' : ' (not qualified)')] as [string, string])} bad={!!err} blank="Choose a lead" />
        </Fld>
      ) : <Bn kind="warn" title="No eligible leads" body="Set a lead to the Property Sale track in Qualification first." />}
    </Modal>
  );
};
