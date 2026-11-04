/* Request availability of a held or booked unit (prototype modal avail; args: [projectId, unitId]). Save runs A.availsave. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const AvailModal: ModalComp = ({ args }) => {
  const pr = eng.projById(args[0]), x = pr.units.find((u: any) => u.id === args[1]);
  return (
    <Modal title="Request availability" sub={pr.name + ' · ' + x.id}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`availsave|${pr.id}|${x.id}`}>Send request</button></>}>
      <Bn kind="info" title="" body={x.status === 'Held'
        ? 'This unit is held until ' + eng.fts(x.holdUntil) + '. If the hold expires or the booking is rejected, Admin can offer it to you.'
        : 'This unit is already booked.'} />
      <Fld label="Message to Admin" htmlFor="m_txt"><MTxa k="txt" ph="Client is ready to book this week" /></Fld>
    </Modal>
  );
};
