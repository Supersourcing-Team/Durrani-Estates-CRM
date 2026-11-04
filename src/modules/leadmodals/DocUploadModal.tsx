/* A-L3-08 Upload a lead document: category, type, file, note. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, Icon, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { errs } from './parts';

export const DocUploadModal: ModalComp = ({ args: a }) => {
  const l = eng.leadById(a[0]), f = eng.UI.mf, e = errs();
  const cats = eng.DOCCAT as Record<string, { t: string; i: string; types: string[] }>;
  const c = cats[f.cat];
  return (
    <Modal title="Upload document" sub={'' + l.name + ' · LEAD-' + l.id}
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`docsave|${l.id}`}><Icon n="upload" s={16} />Upload</button></>}>
      <Fld label="1. Category" err={e.cat}>
        <div className="catgrid">
          {Object.entries(cats).map(([k, v]) => (
            <button key={k} type="button" className={'catb ' + (f.cat === k ? 'on' : '')} data-act={`dcat|${k}`}><Icon n={v.i} s={18} /><span>{v.t}</span></button>
          ))}
        </div>
      </Fld>
      {c ? (
        <>
          <Fld label="2. Document type" err={e.kind}>
            <div className="row g6 wrap">
              {c.types.map((t) => <button key={t} type="button" className={'pill ' + (f.kind === t ? 'on' : '')} data-act={`mset|kind|${t}`}>{t}</button>)}
            </div>
          </Fld>
          <Fld label="3. File" err={e.name}>
            <label className={'dropz ' + (f.name ? 'has' : '')}>
              <Icon n={f.name ? 'check' : 'upload'} s={20} />
              <span className="b">{f.name ? f.name : 'Choose a file'}</span>
              <span className="xs muted">{f.name ? 'Tap to replace' : 'PDF, JPG or PNG, up to 10 MB'}</span>
              <input type="file" className="hide" id="m_file" data-mfile="1" accept=".pdf,.jpg,.jpeg,.png" />
            </label>
            {f.name ? null : <button type="button" className="btn lnk xs" data-act={`mset|name|${(f.kind || 'document').replace(/\s+/g, '_')}.pdf`} data-proto="1">Prototype: use a sample file</button>}
          </Fld>
          <Fld label="Note (optional)"><MTxa k="note" ph="Anything Admin or your manager should know" /></Fld>
        </>
      ) : null}
      <Bn kind="info" body="Booking documents (SPA, DLD, Oqood) are uploaded on the booking. Convertible Note documents are uploaded in the note application." />
    </Modal>
  );
};
