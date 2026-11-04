/* A-L3-22 New secondary request (prototype modal sec-req). Saves with the secsave action. */
import React from 'react';
import { eng } from '../../engine';
import { Fld, Icon, MInput, MOpt, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const SecReqModal: ModalComp = () => {
  const f = eng.UI.mf, e = f._e || {};
  const buyer = f.kind === 'buyer';
  const ls: any[] = eng.leadsOf(eng.me().id).filter((l: any) => l.track === 'secondary' || !l.track);
  const foot = (
    <>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act="secsave">Send to Admin</button>
    </>
  );
  return (
    <Modal title="New secondary request" foot={foot}>
      <Fld label="I am raising a">
        <div className="optgrid">
          <MOpt k="kind" v="buyer" t="Buyer request" d="A client wants a resale property" />
          <MOpt k="kind" v="seller" t="Seller listing" d="A client wants to sell a property" />
        </div>
      </Fld>
      <div className="frm">
        {buyer ? <Fld label="Linked lead (optional)" htmlFor="m_lead"><MSel k="lead" opts={ls.map((l) => [l.id, l.name] as [string, string])} blank="None" /></Fld> : null}
        <Fld label={buyer ? 'Client name' : 'Owner name'} htmlFor="m_name" err={e.name}><MInput k="name" bad={!!e.name} /></Fld>
        <div className="full">
          <Fld label={buyer ? 'What they want' : 'Property'} htmlFor="m_prop" err={e.prop}>
            <MInput k="prop" bad={!!e.prop} ph={buyer ? '2 to 3 bedroom in Dubai Hills' : 'Marina Views 1204, 2BR'} />
          </Fld>
        </div>
        <Fld label="Location" htmlFor="m_loc" err={e.loc}><MInput k="loc" bad={!!e.loc} /></Fld>
        {buyer ? (
          <>
            <Fld label="Budget from (AED)" htmlFor="m_min" err={e.min}><MInput k="min" type="number" bad={!!e.min} /></Fld>
            <Fld label="Budget to (AED)" htmlFor="m_max" err={e.max}><MInput k="max" type="number" bad={!!e.max} /></Fld>
          </>
        ) : (
          <>
            <Fld label="Asking price (AED)" htmlFor="m_ask" err={e.ask}><MInput k="ask" type="number" bad={!!e.ask} /></Fld>
            <Fld label="Documents" err={e.docs} hint="Admin needs ownership proof to list.">
              <label className="btn blk" style={{ cursor: 'pointer' }}>
                <Icon n="upload" s={16} />{f.docs ? f.docs : 'Title deed or Oqood certificate'}
                <input type="file" className="hide" data-mfile2="1" accept=".pdf,.jpg,.jpeg,.png" />
              </label>
            </Fld>
          </>
        )}
      </div>
    </Modal>
  );
};
