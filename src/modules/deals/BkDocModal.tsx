/* Upload a booking document (prototype modal bk-doc; args: [bookingId, docKey]). Save runs A.bkdocsave. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, BusyBtn, Fld, Icon, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const BkDocModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]);
  const UI = eng.UI;
  const busy = !!UI.mf._busy;
  return (
    <Modal title={'Upload ' + eng.DOCN[args[1]].toLowerCase()} sub={b.id}
      foot={<><button className="btn" type="button" data-act="mclose" disabled={busy || undefined}>Cancel</button><BusyBtn busy={busy} act={`bkdocsave|${b.id}|${args[1]}`} label="Upload" busyLabel="Uploading…" /></>}>
      <Fld label="File" err={UI.mf._e && UI.mf._e.name} hint="PDF, JPG or PNG, up to 10 MB.">
        <label className="btn blk" style={{ cursor: 'pointer' }}><Icon n="upload" s={16} />{UI.mf.name ? UI.mf.name : 'Choose a file'}<input type="file" className="hide" data-mfile="1" accept=".pdf,.jpg,.jpeg,.png" /></label>
      </Fld>
      {args[1] === 'dld' ? <Bn kind="info" title="" body="Upload one file that shows both the 4% DLD fee and the Oqood fee receipts." /> : null}
    </Modal>
  );
};
