/* AD Add or edit a person (prototype modal user-form, with the "Market tag" options from a later file). args: [userId?]. Drawer. */
import React from 'react';
import { eng } from '../../engine';
import { Bn, Fld, MInput, MOpt, MSel, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

const ROLES: [string, string, string][] = [['agent', 'Agent', 'Works leads and bookings'], ['mgmt', 'Management', 'Runs a team, read-only on bookings'], ['admin', 'Admin', 'Approves and configures']];

export const UserFormModal: ModalComp = ({ args }) => {
  const S = eng.S, f = eng.UI.mf, e = f._e || {};
  const u = args[0] ? eng.userById(args[0]) : null;
  const ag = f.role === 'agent';
  return (
    <Modal title={u ? 'Edit ' + u.name : 'Add a person'} drawer
      foot={<><button className="btn" type="button" data-act="mclose">Cancel</button><button className="btn pri" type="button" data-act={`usersave|${u ? u.id : ''}`}>{u ? 'Save changes' : 'Create and invite'}</button></>}>
      <Fld label="Full name" htmlFor="m_name" err={e.name} req><MInput k="name" bad={!!e.name} /></Fld>
      <div className="frm">
        <Fld label="Work email" htmlFor="m_email" err={e.email} req><MInput k="email" type="email" bad={!!e.email} /></Fld>
        <Fld label="Phone" htmlFor="m_phone" err={e.phone} req><MInput k="phone" bad={!!e.phone} ph="+971 50 000 0000" /></Fld>
      </div>
      <Fld label="Role"><div className="optgrid">{ROLES.map(([k, t, d]) => <MOpt key={k} k="role" v={k} t={t} d={d} />)}</div></Fld>
      {f.role !== 'admin' ? (
        <Fld label="Team" htmlFor="m_team" err={e.team} req>
          <MSel k="team" opts={S.teams.map((t: any) => [t.id, t.name] as [string, string])} bad={!!e.team} blank="Choose a team" />
        </Fld>
      ) : null}
      {ag ? (
        <>
          <div className="frm">
            <Fld label="Commission slab" htmlFor="m_slab" hint="Admin assigns this. Without a slab, commission is blocked.">
              <MSel k="slab" opts={S.set.slabs.map((s: any) => [s.id, s.name + ' (' + s.rate + '%)'] as [string, string])} blank="No slab yet" />
            </Fld>
            <Fld label="Active lead ceiling" htmlFor="m_cap" err={e.cap}><MInput k="cap" type="number" bad={!!e.cap} min={1} /></Fld>
          </div>
          <Fld label="Market tag">
            <div className="optgrid">
              <MOpt k="tag" v="" t="None" d="Primary only: off-plan leads, bookings and convertible notes. Can still raise resale requests." />
              <MOpt k="tag" v="Secondary" t="Secondary" d="Also works resale deals. Admin can assign them seller listings and buyer requests." />
            </div>
            <button type="button" className="btn lnk xs mt8" data-open="sec-info">What is the difference?</button>
          </Fld>
        </>
      ) : null}
      {u ? null : <Bn kind="info" body="An invite link is created. The person sets their own password within 24 hours." />}
    </Modal>
  );
};
