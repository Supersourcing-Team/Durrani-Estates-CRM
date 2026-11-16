/*
 * A04 Lead detail, Qualification tab (prototype: leadQual(role, l) in 06-leads.js).
 * The agent edits page fields (UI.pf) and saves with the qualsave action; others see a read-only summary.
 */
import React from 'react';
import { eng, money } from '../../engine';
import { BusyBtn, Card, Fld, Kvs, PfInput, PfSel } from '../../ui';
import type { LeadTabProps } from './LeadScreen';

export function LeadQual({ role, l }: LeadTabProps) {
  const mine = role === 'agent' && !l.archived;
  const cur = l.cur || 'AED';
  const b = l.budget || ['', ''];
  const e = eng.UI.pf._e || {};
  const busy = !!eng.UI.pf._busy;
  if (!mine) {
    return (
      <Card title="Qualification">
        <Kvs items={[
          ['Qualified', l.qualified ? 'Yes' : 'Not yet'],
          ['Track', l.track ? eng.TRACKS[l.track] : 'Not set'],
          ['Budget', l.budget ? money(l.budget[0], cur) + ' to ' + money(l.budget[1], cur) : 'Not captured'],
          ['Property type', l.ptype || 'Not captured'],
          ['Timeline', l.timeline || 'Not captured'],
          ['Payment', l.payment || 'Not captured'],
          ['Purpose', l.purpose || 'Not captured'],
          ['Visa interest', l.visa || 'Not captured'],
        ]} />
      </Card>
    );
  }
  return (
    <Card title="Qualification">
      <div className="frm">
        <Fld label="Track" htmlFor="p_trk" err={e.trk} hint="Decides where this lead goes next.">
          <PfSel k="trk" opts={[['property', 'Property Sale'], ['cn', 'Convertible Notes'], ['secondary', 'Secondary Market']]} d={l.track || ''} blank="Choose a track" bad={!!e.trk} />
        </Fld>
        <Fld label="Currency" htmlFor="p_cur"><PfSel k="cur" opts={['AED', 'INR']} d={cur} /></Fld>
        <Fld label="Budget from" htmlFor="p_bmin" err={e.bmin}><PfInput k="bmin" type="number" d={b[0]} min={0} bad={!!e.bmin} /></Fld>
        <Fld label="Budget to" htmlFor="p_bmax" err={e.bmax}><PfInput k="bmax" type="number" d={b[1]} min={0} bad={!!e.bmax} /></Fld>
        <Fld label="Property type" htmlFor="p_ptype"><PfSel k="ptype" opts={['Off-plan apartment', 'Ready apartment', 'Villa', 'Townhouse', 'Commercial']} d={l.ptype || ''} blank="Select" /></Fld>
        <Fld label="Buying timeline" htmlFor="p_tline"><PfSel k="tline" opts={['0 to 3 months', '3 to 6 months', '6 to 12 months', 'Just exploring']} d={l.timeline || ''} blank="Select" /></Fld>
        <Fld label="Payment method" htmlFor="p_pay"><PfSel k="pay" opts={['Cash', 'Mortgage', 'Payment plan']} d={l.payment || ''} blank="Select" /></Fld>
        <Fld label="Purpose" htmlFor="p_purp"><PfSel k="purp" opts={['Investment', 'Own use', 'Both']} d={l.purpose || ''} blank="Select" /></Fld>
        <Fld label="Visa interest" htmlFor="p_visa"><PfSel k="visa" opts={['Interested', 'Not needed', 'Already has']} d={l.visa || ''} blank="Select" /></Fld>
      </div>
      <div className="sticky-save">
        <span className="muted sm" style={{ marginRight: 'auto' }}>{l.qualified ? 'Qualified. You can update details anytime.' : 'Fill budget, type, timeline, payment and purpose to mark as qualified.'}</span>
        <BusyBtn busy={busy} act={`qualsave|${l.id}`} label="Save qualification" busyLabel="Saving…" />
      </div>
    </Card>
  );
}
