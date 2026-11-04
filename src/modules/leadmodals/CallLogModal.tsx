/*
 * A-L3-01 Log call: the guided call log.
 * Steps are revealed one at a time (1 result, 2 length and temperature, 3 outcome, 4 next step / try again),
 * finished steps fold into a summary row with "Change", and the notes step appears once everything is done
 * (or straight away for Wrong number / DND requested). Which steps exist depends on the result.
 */
import React from 'react';
import { eng, cap1, dtl, dtp, fts, fhm, startOfDay, NOW, HR, DAY } from '../../engine';
import { Av, Bn, Fld, Icon, MInput, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { ErrLine, TempPick, errs } from './parts';

/* `show` keeps the prototype's JS truthiness: only an explicit `false` hides a step. Before a result is
   chosen, step 4's condition evaluates to '' (not false), so the prototype counts it ("Step 1 of 2"). */
interface Step { n: number; t: string; done: boolean; val: string; show?: any }

export const CallLogModal: ModalComp = ({ args: a }) => {
  const S = eng.S, f = eng.UI.mf, e = errs();
  const l = eng.leadById(a[0]);
  const conn = f.res === 'Connected';
  const need = ['Interested', 'Follow up', 'Meeting fixed'].includes(f.disp);
  const un = S.unlogged[eng.me().id];
  const bad = f.res === 'Wrong number' || f.res === 'DND requested';
  const hasErr = Object.keys(e).length > 0;
  const sod = startOfDay(NOW());
  const quick: [string, string][] = conn
    ? [['Today 17:00', dtl(sod + 13 * HR)], ['Tomorrow 11:00', dtl(sod + DAY + 7 * HR)], ['In 3 days', dtl(sod + 3 * DAY + 7 * HR)], ['Next week', dtl(sod + 7 * DAY + 7 * HR)]]
    : [['In 2 hours', dtl(Math.ceil((NOW() + 2 * HR) / (15 * 60000)) * 15 * 60000)], ['This evening', dtl(sod + 14 * HR)], ['Tomorrow 10:00', dtl(sod + DAY + 6 * HR)]];

  /* steps in order */
  const S1: Step = { n: 1, t: 'How did the call go?', done: !!f.res, val: f.res };
  const S2: Step = { n: 2, t: 'Length and temperature', done: !!f.dur && !!f.temp, val: (f.dur ? f.dur + ' min' : '') + (f.temp ? ' · ' + cap1(f.temp) : ''), show: conn };
  const S3: Step = { n: 3, t: 'Outcome', done: !!f.disp, val: f.disp, show: conn };
  const S4: Step = { n: 4, t: conn ? 'Next step' : 'Try again', done: !!f.nat, val: f.nat ? (conn ? f.ntype + ' · ' : '') + fts(dtp(f.nat)) : '', show: (conn && need) || (f.res && !conn && !bad) };
  const steps = [S1, S2, S3, S4].filter((s) => s.show !== false);
  const cur: number = f._open || (steps.find((s) => !s.done) || ({} as Step)).n || 0;
  const reached = (s: Step) => steps.indexOf(s) <= steps.findIndex((x) => x.n === cur) || s.done;

  const head = (s: Step) => {
    const folded = s.done && cur !== s.n;
    return <div className={'clstep ' + (folded ? 'done' : '')}><span className="cls-n">{folded ? <Icon n="check" s={12} /> : steps.indexOf(s) + 1}</span><span>{s.t}</span></div>;
  };
  const folded = (s: Step) => (
    <button key={s.n} type="button" className="clfold" data-act={`mset|_open|${s.n}`}>
      <span className="cls-n"><Icon n="check" s={12} /></span><span className="cf-t">{s.t}</span><span className="cf-v">{s.val}</span><span className="cf-c">Change</span>
    </button>
  );

  const blocks: Record<number, () => React.ReactNode> = {
    /* 1. result of the call */
    1: () => (
      <>
        <div className="resgrid">
          {(eng.CALLRES as string[]).map((r) => {
            const [i, d, k] = eng.RESINFO[r];
            return (
              <button key={r} type="button" className={`resb ${k} ${f.res === r ? 'on' : ''} ${r === 'Connected' ? 'wide' : ''}`} data-act={`mset|res|${r}`}>
                <span className="rb-i"><Icon n={i} s={18} /></span><span><span className="rb-t">{r}</span><span className="rb-d">{d}</span></span>
              </button>
            );
          })}
        </div>
        <ErrLine e={e.res} />
      </>
    ),
    /* 2. call length and temperature */
    2: () => (
      <>
        <div className="durrow">
          <div className="stepper">
            <button type="button" data-act="mdur|-1" aria-label="One minute less"><Icon n="minus" s={16} /></button>
            <MInput k="dur" type="number" min={1} bad={!!e.dur} />
            <button type="button" data-act="mdur|1" aria-label="One minute more"><Icon n="plus" s={16} /></button>
          </div>
          <span className="muted sm">min</span>
          <div className="row g6 wrap">
            {[2, 5, 10, 15].map((m) => <button key={m} type="button" className={'pill ' + (String(f.dur) === String(m) ? 'on' : '')} data-act={`mset|dur|${m}`}>{m} min</button>)}
          </div>
        </div>
        <span className="hint muted sm">How long you spoke, in minutes. Tap a shortcut or type it.</span>
        <ErrLine e={e.dur} />
        <TempPick cur={f.temp} act="mset|temp|" />
      </>
    ),
    /* 3. outcome (disposition) */
    3: () => (
      <>
        <div className="resgrid">
          {(S.set.dispositions as string[]).map((d) => {
            const [i, t] = eng.DISPINFO[d] || ['check', ''];
            return (
              <button key={d} type="button" className={`resb ${d === 'Not interested' ? 'bad' : d === 'Meeting fixed' ? 'ok' : ''} ${f.disp === d ? 'on' : ''}`} data-act={`mset|disp|${d}`}>
                <span className="rb-i"><Icon n={i} s={18} /></span><span><span className="rb-t">{d}</span><span className="rb-d">{t}</span></span>
              </button>
            );
          })}
        </div>
        <ErrLine e={e.disp} />
        {f.disp === 'Not interested' ? <Bn kind="warn" title="This archives the lead" body="It leaves your active list. Add the reason in the notes." /> : null}
      </>
    ),
    /* 4. next step (connected) or retry time (not connected) */
    4: () => (
      <>
        {conn ? (
          <div className="seg mb8">
            {[['Follow-up', 'Follow-up'], ['Meeting', 'Meeting']].map(([v, t]) => <button key={v} type="button" className={f.ntype === v ? 'on' : ''} data-act={`mset|ntype|${v}`}>{t}</button>)}
          </div>
        ) : null}
        <div className="row g6 wrap">
          {quick.map((x) => <button key={x[0]} className={'pill ' + (f.nat === x[1] ? 'on' : '')} type="button" data-act={`mset|nat|${x[1]}`}>{x[0]}</button>)}
        </div>
        <Fld label="Or pick a date and time (Dubai)" htmlFor="m_nat" err={e.nat}><MInput k="nat" type="datetime-local" bad={!!e.nat} /></Fld>
        {conn && f.ntype === 'Meeting' ? (
          <div className="frm">
            <Fld label="Meeting type">
              <div className="seg">
                {[['in-person', 'In person'], ['virtual', 'Online']].map(([v, t]) => <button key={v} type="button" className={f.mkind === v ? 'on' : ''} data-act={`mset|mkind|${v}`}>{t}</button>)}
              </div>
            </Fld>
            <Fld label={f.mkind === 'virtual' ? 'Meeting link or app' : 'Place'} htmlFor="m_mplace" err={e.mplace}>
              <MInput k="mplace" bad={!!e.mplace} ph={f.mkind === 'virtual' ? 'Google Meet' : 'Marina Views sales gallery'} />
            </Fld>
          </div>
        ) : null}
      </>
    ),
  };

  const stepEls = steps.map((s) => {
    if (!reached(s)) return null;
    const open = s.n === cur || (hasErr && !s.done);
    return open ? <div key={s.n} className="clsec">{head(s)}{blocks[s.n]()}</div> : folded(s);
  });
  const allDone = steps.every((s) => s.done);

  const notes = f.res && (allDone || bad) ? (
    <div className="clsec">
      <div className="clstep"><span className="cls-n">{steps.length + 1}</span><span>Notes{f.disp === 'Not interested' ? ' (reason required)' : ' (optional)'}</span></div>
      <div className="row g6 wrap">
        {((conn ? eng.NOTECHIPS.Connected : eng.NOTECHIPS.other) as string[]).map((t) => (
          <button key={t} type="button" className="pill sm" data-act={`mnote|${t}`}><Icon n="plus" s={12} />{t}</button>
        ))}
      </div>
      <MTxa k="note" bad={!!e.note} ph="What did the client say?" />
      <ErrLine e={e.note} />
    </div>
  ) : null;

  const sum = [f.res, conn && f.dur ? f.dur + ' min' : '', conn ? f.disp : '', f.temp && conn ? cap1(f.temp) : '',
    f.nat ? (conn ? f.ntype || 'Follow-up' : 'Retry') + ' ' + fts(dtp(f.nat)) : ''].filter(Boolean).join(' · ');
  const done = steps.filter((s) => s.done).length;

  return (
    <Modal title="Log call" size="w"
      sub={allDone || bad ? 'Ready to save' : 'Step ' + Math.min(steps.length, done + 1) + ' of ' + steps.length}
      foot={<>
        {sum ? <span className="clsum">{sum}</span> : null}
        <button className="btn" type="button" data-act="mclose">Cancel</button>
        <button className="btn pri" type="button" data-act={`callsave|${l.id}`} disabled={f.res ? undefined : true}><Icon n="check" s={16} />{bad ? 'Save and archive' : 'Save call'}</button>
      </>}>
      <div className="clhead">
        <Av n={l.name} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="b trunc">{l.name}</div>
          <div className="xs muted">{l.phone} · {l.attempts} earlier attempt{l.attempts === 1 ? '' : 's'}</div>
        </div>
        {un && un.lead === l.id ? <span className="chip s3"><Icon n="clock" s={12} />Called {fhm(un.t)}</span> : <span className="chip s2">Manual log</span>}
      </div>
      {steps.length ? <div className="clprog"><i style={{ width: Math.round(done / steps.length * 100) + '%' }} /></div> : null}
      {stepEls}
      {f.res === 'Wrong number' ? <Bn kind="warn" title="Number will be flagged invalid" body="The lead is archived and Admin is told so the source can be reviewed." /> : null}
      {f.res === 'DND requested' ? <Bn kind="err" title="Number goes on the Do Not Call list" body="No agent can call it again. The lead is archived. Only Admin can remove it." /> : null}
      {notes}
    </Modal>
  );
};
