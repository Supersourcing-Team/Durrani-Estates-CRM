/* AD09 New import (prototype route admin-importnew): 4-step wizard kept in UI.pf (step, camp, file, result). */
import React from 'react';
import { eng } from '../../engine';
import { Btn, Card, Chip, Fld, Icon, Kpi, PfSel, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';

const STEPS = ['Choose file', 'Check', 'Review', 'Done'];
const COLS: [string, string][] = [['name', 'Client name'], ['phone', 'Phone'], ['email', 'Email (optional)'], ['city', 'City (optional)']];
const RES_T: Record<string, string> = { dup: 'Discarded', linked: 'Linked lead', err: 'Error' };
const RES_C: Record<string, string> = { dup: 's2', linked: 's4', err: 's7' };

/** Step indicator across the top */
function StepBar({ st }: { st: number }) {
  return (
    <div className="stp h mb16">
      {STEPS.map((s, i) => (
        <div key={s} className={'stpi ' + (i + 1 < st ? 'done' : i + 1 === st ? 'cur' : '')}>
          <span className="dot2">{i + 1 < st ? <Icon n="check" s={14} /> : i + 1}</span>
          <div className="bd"><div className="b">{s}</div></div>
        </div>
      ))}
    </div>
  );
}

export const AdminImportNew: ScreenComp = () => {
  const S = eng.S, UI = eng.UI;
  const st = +eng.pfv('step', 1), camp = eng.pfv('camp', 'Bulk upload · Expo lead list'), file = eng.pfv('file', '');
  const e = (UI.pf && UI.pf._e) || {};
  const R_: any[] = eng.impClass(eng.impRows(camp), camp);
  const c = (k: string) => R_.filter((r) => r.k === k).length;

  /* 1. Choose file */
  if (st === 1) return (
    <>
      <PgHead t="New import" sub="Upload a CSV with name, phone and optional email, city and country columns." />
      <StepBar st={st} />
      <Card title="1. Choose file">
        <div className="frm">
          <Fld label="Campaign or source name" htmlFor="p_camp" hint="Used to tell duplicates from linked leads.">
            <PfSel k="camp" opts={eng.IMPCAMP} d={camp} />
          </Fld>
          <Fld label="CSV file" err={e.file} hint="Up to 5,000 rows. UTF-8.">
            <label className="btn blk" style={{ cursor: 'pointer' }}>
              <Icon n="upload" s={16} />{file ? file : 'Choose a CSV'}
              <input type="file" className="hide" data-pffile="file" accept=".csv" />
            </label>
          </Fld>
        </div>
        <div className="row g6 wrap mt16">
          <button className="btn" type="button" data-act="impsample">Use the sample file</button>
          <span className="muted sm">{S.dnd.length} number{S.dnd.length === 1 ? '' : 's'} on the Do Not Call list will be skipped.</span>
        </div>
      </Card>
      <div className="row g6 mt16">
        <Btn go="admin-import">Cancel</Btn>
        <button className="btn pri" type="button" data-act="impnext|2">Continue</button>
      </div>
    </>
  );

  /* 2. Check the columns */
  if (st === 2) return (
    <>
      <PgHead t="New import" sub={'We read ' + R_.length + ' rows from ' + (file || 'the sample file') + '.'} />
      <StepBar st={st} />
      <Card title="2. Check the columns">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Your column</th><th>Maps to</th></tr></thead>
            <tbody>{COLS.map(([a, b]) => <tr key={a}><td><code>{a}</code></td><td><Chip t={b} cls="s6" dot={false} /></td></tr>)}</tbody>
          </table>
        </div>
        <p className="muted sm mt16">All columns were recognised. Unknown columns would be ignored.</p>
      </Card>
      <div className="row g6 mt16">
        <button className="btn" type="button" data-act="impnext|1">Back</button>
        <button className="btn pri" type="button" data-act="impnext|3">See what will happen</button>
      </div>
    </>
  );

  /* 3. Review: counts and the rows that are not plain new leads */
  if (st === 3) {
    const pv = R_.filter((r) => r.k !== 'new').slice(0, 10);
    return (
      <>
        <PgHead t="New import" sub="Nothing is saved until you press Import." />
        <StepBar st={st} />
        <div className="grid g4c keep mb16">
          <Kpi l="New leads" n={String(c('new'))} d="Will go to the pool" />
          <Kpi l="Discarded" n={String(c('dup'))} d="Duplicates" />
          <Kpi l="Linked" n={String(c('linked'))} d="Different campaign" />
          <Kpi l="Errors" n={String(c('err'))} d="Not imported" cls={c('err') ? 'warn' : ''} />
        </div>
        <Card title="Rows that need attention" bare>
          {pv.length ? (
            <div className="tw">
              <table className="tbl">
                <thead><tr><th>Name</th><th>Phone</th><th>Result</th><th>Why</th></tr></thead>
                <tbody>
                  {pv.map((r, i) => (
                    <tr key={i}>
                      <td>{r.n}</td>
                      <td className="sm">{r.p || '(empty)'}</td>
                      <td><Chip t={RES_T[r.k]} cls={RES_C[r.k]} /></td>
                      <td className="sm">{r.why}{r.k === 'linked' ? (r.orig ? '. Goes to ' + eng.uname(r.orig.owner) : '. Original is inactive, goes to the pool') : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="muted">Every row is new.</p>}
        </Card>
        <div className="row g6 wrap mt16">
          <button className="btn" type="button" data-act="impnext|2">Back</button>
          {c('err') ? <button className="btn" type="button" data-act="imperr"><Icon n="copy" s={16} />Copy error rows</button> : null}
          <button className="btn pri" type="button" data-act="impgo">Import {c('new') + c('linked')} leads</button>
        </div>
      </>
    );
  }

  /* 4. Done */
  const r = eng.pfv('result', null) || {};
  return (
    <>
      <PgHead t="Import finished" sub={file || 'Sample file'} />
      <StepBar st={st} />
      <Card>
        <div className="grid g4c keep">
          <Kpi l="New leads" n={String(r.ok || 0)} />
          <Kpi l="Discarded" n={String(r.dup || 0)} />
          <Kpi l="Linked" n={String(r.linked || 0)} />
          <Kpi l="Errors" n={String(r.err || 0)} />
        </div>
        <p className="muted mt16">New leads are in the Admin pool, ready to assign. Linked leads went to the agent who already holds the original.</p>
        <div className="row g6 wrap mt16">
          <Btn cls="pri" go="admin-assign">Assign leads</Btn>
          <Btn go="admin-import">Back to history</Btn>
        </div>
      </Card>
    </>
  );
};
