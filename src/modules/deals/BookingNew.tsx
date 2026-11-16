/* New booking form (prototype route agent-bookingnew; params: [leadId, projectId, unitId]). Submit runs A.booksave. */
import React from 'react';
import { eng, HR } from '../../engine';
import { Bn, BusyBtn, Card, Dl, Empty, Fld, Icon, PgHead, PfTxa, pv } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { PInp, PSel } from './shared';

const DOC_SLOTS: [string, string][] = [['f_form', 'Developer booking form (signed by buyer)'], ['f_receipt', 'Deposit receipt']];

export const BookingNew: ScreenComp = ({ params: p }) => {
  const S = eng.S;
  const u = eng.me(), e = eng.UI.pf._e || {};
  const busy = !!eng.UI.pf._busy;
  const ls: any[] = eng.leadsOf(u.id).filter((l: any) => l.track === 'property' && !S.bookings.some((b: any) => b.lead === l.id && ['pending', 'changes', 'approved'].includes(b.status)));
  const lead = pv('lead', p[0] || ''), proj = pv('proj', p[1] || ''), pr = proj ? eng.projById(proj) : null;
  const units: any[] = pr ? pr.units.filter((x: any) => x.status === 'Available' || x.holdBy === u.id) : [];
  let unit = pv('unit', p[2] || '');
  if (unit && !units.some((x) => x.id === unit)) unit = '';
  const un = pr && units.find((x) => x.id === unit);
  const holds = eng.holdsOf(u.id); const capHit = holds >= S.set.holdCap;
  const price = pv('price', un ? un.price : ''), dep = pv('dep', un ? Math.round(un.price * 0.1) : '');
  const diff = un && price && +price < un.price ? Math.round((1 - price / un.price) * 1000) / 10 : 0;

  return (
    <>
      <PgHead t="New booking" sub={'Submit to hold the unit for ' + S.set.holdHours + ' hours while Admin reviews. You can hold up to ' + S.set.holdCap + ' units at once.'} />
      {capHit ? <div className="mb16"><Bn kind="err" title="You have reached the hold limit" body={'You already hold ' + holds + ' units. Wait for a decision or let one expire before raising another.'} /></div> : null}
      <div className="grid g21">
        <div className="col g16">
          <Card title="Client and unit">
            <div className="frm">
              <Fld label="Client" htmlFor="p_lead" err={e.lead} hint={ls.length ? '' : 'No Property Sale leads without an open booking.'}>
                <PSel k="lead" opts={ls.map((l) => [l.id, l.name + ' · LEAD-' + l.id] as [string, string])} d={lead} blank="Choose a lead" bad={!!e.lead} />
              </Fld>
              <Fld label="Project" htmlFor="p_proj" err={e.proj}>
                <PSel k="proj" opts={S.projects.filter((x: any) => x.active).map((x: any) => [x.id, x.name] as [string, string])} d={proj} blank="Choose a project" bad={!!e.proj} />
              </Fld>
              <Fld label="Unit" htmlFor="p_unit" err={e.unit}>
                <PSel k="unit" opts={units.map((x) => [x.id, x.id + ' · ' + x.type + ' · ' + eng.mfull(x.price)] as [string, string])} d={unit}
                  blank={pr ? (units.length ? 'Choose a unit' : 'No units available') : 'Pick a project first'} bad={!!e.unit} dis={!pr} />
              </Fld>
              <Fld label="Unit type" htmlFor="p_utype"><PInp k="utype" d={un ? un.type : ''} dis /></Fld>
            </div>
          </Card>
          <Card title="Deal terms">
            <div className="frm">
              <Fld label="Agreed price (AED)" htmlFor="p_price" err={e.price} hint={un ? 'List price ' + eng.mfull(un.price) : ''}>
                <PInp k="price" type="number" d={price} min={0} bad={!!e.price} />
              </Fld>
              <Fld label="Payment plan" htmlFor="p_plan"><PInp k="plan" d={pr ? pr.plan : ''} /></Fld>
              <Fld label="Booking deposit (AED)" htmlFor="p_dep" err={e.dep}><PInp k="dep" type="number" d={dep} min={0} bad={!!e.dep} /></Fld>
              <Fld label="Deposit method" htmlFor="p_mode"><PSel k="mode" opts={['Bank transfer', 'Cheque', 'Card', 'Cash']} d="Bank transfer" blank={false} /></Fld>
              <div className="full">
                <Fld label="Offer or special terms" htmlFor="p_offer" hint="Be exact. Admin checks this against the developer offer.">
                  <PfTxa k="offer" ph="Discounts, furnishing pack, fee waivers the client was promised" />
                </Fld>
              </div>
            </div>
            {diff ? <div className="mt16"><Bn kind="warn" title={'Price is ' + diff + '% below list'} body="Admin sees the gap during review. If you promised a discount, raise it with your manager first." /></div> : null}
          </Card>
          <Card title="Documents">
            <div className="col">
              {DOC_SLOTS.map(([k, t]) => (
                <div key={k} className={'slot ' + (pv(k) ? 'up' : '')}>
                  <span className="ic"><Icon n="file" s={16} /></span>
                  <div className="m"><div className="b">{t}</div><div className={'xs ' + (e[k] ? 'dangertx' : 'faint')}>{pv(k) ? pv(k) : e[k] || 'Required. PDF or image.'}</div></div>
                  <label className="btn s" style={{ cursor: 'pointer' }}>{pv(k) ? 'Replace' : 'Upload'}<input type="file" className="hide" data-pffile={k} accept=".pdf,.jpg,.jpeg,.png" /></label>
                </div>
              ))}
            </div>
            <p className="muted sm mt8">The SPA, DLD and Oqood documents are added later, after Admin approves.</p>
          </Card>
        </div>
        <div className="col g16">
          <Card title="Summary">
            {un ? (
              <>
                <Dl items={[['Unit', un.id + ' · ' + un.type], ['Project', pr.name], ['Price', eng.mfull(+price || 0)], ['Deposit', eng.mfull(+dep || 0)], ['Developer commission', pr.comm + '%']]} />
                <div className="bn info mt16"><span><Icon n="info" s={16} /></span><div>Submitting holds <b>{un.id}</b> until {eng.fts(eng.NOW() + S.set.holdHours * HR)}.</div></div>
              </>
            ) : <Empty icn="building" t="Pick a unit" d="The summary appears here." />}
          </Card>
          <BusyBtn busy={busy} cls="btn pri blk" act="booksave" disabled={capHit} label="Submit for Admin review" busyLabel="Submitting…" />
          <a className="btn blk" href="#agent-bookings" data-go="agent-bookings">Cancel</a>
        </div>
      </div>
    </>
  );
};
