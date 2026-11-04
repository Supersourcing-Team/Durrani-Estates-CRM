/* S-L3-10 Attendance day detail (prototype modal att-day). args: [userId, day timestamp]. */
import React from 'react';
import { eng, fhm, f2 } from '../../engine';
import { Chip, Dl, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { GeoFlag, ReqChip } from './parts';

const KCLS: Record<string, string> = { ok: 's6', late: 's5', early: 's5', miss: 's7', abs: 's7', leave: 's4', lpend: 's4', none: 's2' };

export const AttDayModal: ModalComp = ({ args }) => {
  const S = eng.S, { SHIFT, hmOf, minsOf, MIN } = eng;
  const uid = args[0], d = +args[1];
  const p = eng.userById(uid), i = eng.dayInfo(uid, d), u = eng.me(), r = i.r;
  const lateBy = i.in ? minsOf(i.in) - SHIFT.start : 0, earlyBy = i.out ? SHIFT.end - minsOf(i.out) : 0;

  const rows: [React.ReactNode, React.ReactNode][] = [
    ['Status', <Chip t={i.t || eng.KCL[i.k]} cls={KCLS[i.k] || 's2'} />],
    ['Shift', hmOf(SHIFT.start) + ' to ' + hmOf(SHIFT.end)],
  ];
  if (i.k !== 'leave' && i.k !== 'lpend') {
    rows.push(['Punch in', i.in
      ? <>{fhm(i.in)} · {i.late ? <span className="warntx">late by {lateBy} min</span> : <span className="oktx">on time</span>}</>
      : <span className="faint">None</span>]);
    rows.push(['Punch out', i.out
      ? <>{fhm(i.out)} · {i.early ? <span className="warntx">left {earlyBy} min early</span> : <span className="oktx">on time</span>}</>
      : <span className="faint">None</span>]);
    if (i.in && i.out) { const w = Math.round((i.out - i.in) / MIN); rows.push(['Worked', Math.floor(w / 60) + ' h ' + (w % 60) + ' min']); }
  }
  if (i.lv) rows.push(['Leave', i.lv.type + ' · ' + eng.cap1(i.lv.status)], ['Reason', i.lv.reason], ['Decided by', i.lv.by ? eng.uname(i.lv.by) : 'Waiting']);
  const rq = S.reg.filter((x: any) => x.user === uid && eng.startOfDay(x.date) === d).pop();
  if (rq) rows.push(['Regularisation', <ReqChip x={rq} />]);

  const gs: any[] = (S.geo || []).filter((g: any) => g.u === uid && eng.sameDay(g.at, d));
  const canReg = uid === u.id && r && ['late', 'early', 'miss', 'abs'].includes(i.k) && !rq;

  return (
    <Modal title={p.name} sub={f2(d, { weekday: 'long', day: 'numeric', month: 'long' })}
      foot={<><button className="btn" type="button" data-act="mclose">Close</button>{canReg ? <button className="btn pri" type="button" data-act={`regfrom|${r.date}`}>Request regularisation</button> : null}</>}>
      <Dl items={rows} />
      {u.role === 'admin' && gs.length ? (
        <>
          <div className="ov mt16 mb8">Locations from IP</div>
          {gs.map((g, k) => (
            <div key={k} className="row sb sm" style={{ padding: '6px 0', borderBottom: '1px solid var(--bd)' }}>
              <span>{g.ev} {fhm(g.at)}</span>
              <span>{g.city}, {g.cc} · <span className="faint">{g.ip}</span> <GeoFlag g={g} /></span>
            </div>
          ))}
        </>
      ) : null}
    </Modal>
  );
};
