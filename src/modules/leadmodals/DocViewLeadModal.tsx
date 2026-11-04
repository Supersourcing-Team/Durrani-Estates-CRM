/* S-L3-08 View a lead document. */
import React from 'react';
import { eng, fd } from '../../engine';
import { Icon, Kvs, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const DocViewLeadModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]);
  const d = l.docs.find((x: any) => x.id === a[1]);
  return (
    <Modal title={a[2] || 'Document'} sub={l.name} foot={<button className="btn" type="button" data-act="mclose">Close</button>}>
      <div className="pv" style={{ minHeight: 260 }}>
        <Icon n="file" s={28} /><b>{d ? d.name : a[2] + '.pdf'}</b><span>Preview of the uploaded file appears here.</span>
      </div>
      {d ? <Kvs items={[['Category', eng.DOCCAT[eng.docCat(d)].t], ['Uploaded by', eng.uname(d.by)], ['Date', fd(d.at)], ['Type', eng.docType(d)]]} /> : null}
    </Modal>
  );
};
