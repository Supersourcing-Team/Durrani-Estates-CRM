/* A-L3-03 Send the meeting confirmation link (with the WhatsApp / email channel picker). */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, Icon, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { ChanPick } from './parts';

export const SendConfirmModal: ModalComp = ({ args: a }) => {
  const UI = eng.UI;
  const l = eng.leadById(a[0]);
  const m = l.meets.find((x: any) => x.id === a[1]);
  const virt = m.kind === 'virtual';
  const tk = UI.mf.tok;
  if (!UI.mf.ch) UI.mf.ch = 'WhatsApp'; // prototype default, set while rendering
  const ch = UI.mf.ch;
  const link = tk ? location.href.split('#')[0] + '#client-confirm-' + tk : '';
  const first = l.name.split(' ')[0];
  return (
    <Modal title={virt ? 'Ask client to confirm' : 'Send confirmation link'} sub={l.name}
      foot={<>
        <button className="btn" type="button" data-act="mclose">{tk ? 'Done' : 'Cancel'}</button>
        {tk ? null : <button className="btn pri" type="button" data-act={`genlink|${l.id}|${m.id}`}>Generate link</button>}
      </>}>
      <p className="muted">
        The client opens a private page
        {virt
          ? <> and confirms the online meeting. It will show as <b>Client confirmed</b>, not Verified.</>
          : <>, confirms the visit, adds a photo and gives feedback. This marks the meeting <b>Verified</b>.</>}
        {' '}The link works for 24 hours and only for this client's number.
      </p>
      {tk ? (
        <div className="card soft">
          <div className="ov">Link</div>
          <div className="code mt8" style={{ wordBreak: 'break-all', display: 'block' }}>{link}</div>
          <div className="row g6 wrap mt8">
            <button className="btn s" type="button" data-act={`copy|${link}`}><Icon n="copy" s={14} />Copy link</button>
            <a className="btn s" href={`https://wa.me/${eng.norm(l.phone)}?text=${encodeURIComponent('Hi ' + first + ', please confirm our meeting here: ' + link)}`} target="_blank" rel="noopener" data-ext="1"><Icon n="msg" s={14} />Send on WhatsApp</a>
            <a className="btn s" href={`mailto:${l.email}?subject=${encodeURIComponent('Please confirm our meeting')}&body=${encodeURIComponent('Hi ' + first + ', please confirm our meeting here: ' + link)}`} data-act={`emailopen|${l.id}`}><Icon n="mail" s={14} />Send by email</a>
            <a className="btn s" data-proto="1" href={`#client-confirm-${tk}`} data-go={`client-confirm-${tk}`}>Preview client page</a>
          </div>
        </div>
      ) : (
        <>
          <Bn kind="info" body={'Tap Generate to create a one-time link for ' + l.phone + '.'} />
          <Fld label="Send the link by" hint={ch === 'Email' ? 'To ' + l.email : ch === 'WhatsApp' ? 'To ' + l.phone : 'To ' + l.phone + ' and ' + l.email}>
            <ChanPick k="ch" />
          </Fld>
        </>
      )}
    </Modal>
  );
};
