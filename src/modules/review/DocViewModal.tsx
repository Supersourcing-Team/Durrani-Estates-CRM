/* AD-L3-08 View an uploaded booking document (prototype modal doc-view). */
import React from 'react';
import { eng } from '../../engine';
import { Icon, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const DocViewModal: ModalComp = ({ args }) => {
  const b = eng.bkById(args[0]), d = b.docs[args[1]];
  return (
    <Modal title={eng.DOCN[args[1]]} sub={b.id} foot={<button className="btn" type="button" data-act="mclose">Close</button>}>
      <div className="card soft" style={{ textAlign: 'center', padding: '36px 16px' }}>
        <div className="ei" style={{ margin: '0 auto 8px' }}><Icon n="file" s={22} /></div>
        <div className="b">{d.name || ''}</div>
        <div className="muted sm">Uploaded {d.at ? eng.ft(d.at) : ''} by {eng.uname(b.agent)}</div>
        <p className="muted sm mt16">The real product shows the uploaded file here. This prototype has no file store.</p>
      </div>
    </Modal>
  );
};
