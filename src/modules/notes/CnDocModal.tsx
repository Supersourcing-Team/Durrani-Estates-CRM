/* Upload a note document (prototype modal cn-doc, args [leadId, docKey]). Saves with the cndoc action. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, Icon, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const CnDocModal: ModalComp = ({ args }) => {
  const UI = eng.UI;
  const t = (eng.CNDOCS as [string, string][]).find((x) => x[0] === args[1])![1];
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act={`cndoc|${args[0]}|${args[1]}`}>Upload</button>
    </>
  );
  return (
    <Modal title={'Upload: ' + t} foot={foot}>
      <Fld label="File" err={UI.mf._e && UI.mf._e.name} hint="PDF, JPG or PNG, up to 10 MB.">
        <label className="btn blk" style={{ cursor: 'pointer' }}>
          <Icon n="upload" s={16} />{UI.mf.name ? UI.mf.name : 'Choose a file'}
          <input type="file" className="hide" data-mfile="1" accept=".pdf,.jpg,.jpeg,.png" />
        </label>
      </Fld>
    </Modal>
  );
};
