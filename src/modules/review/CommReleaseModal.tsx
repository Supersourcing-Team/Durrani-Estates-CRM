/* Release an incentive (prototype modal comm-release, action commrel). Opened from admin-comm. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Dl, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const CommReleaseModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]), c = eng.comm(b);
  const busy = !!eng.UI.mf._busy;
  return (
    <Modal title="Release incentive" sub={b.id + ' · ' + eng.uname(b.agent)}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act={`commrel|${b.id}`} label={`Release ${eng.mfull(c.inc)}`} busyLabel="Releasing…" /></>}>
      <Dl items={[
        ['Incentive', <b>{eng.mfull(c.inc)}</b>],
        ['Slab', c.slab.name + ' · ' + c.rate + '%'],
        ['Buyer has paid', b.paidPct + '%'],
      ]} />
      <Bn kind="info" body="Payment itself happens in your finance system. This records the release and tells the agent." />
    </Modal>
  );
};
