/* S-L3-04 Punch clock modal (prototype: MD['punch'].render from 13-polish). Clock and ring are live. */
import React from 'react';
import { eng, fd, fhm } from '../../engine';
import { Bn, Chip, Icon, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { ClockRing, LiveClock } from './parts';

export const PunchModal: ModalComp = () => {
  const u = eng.me(), p = eng.punchState(u.id), NOW = eng.NOW();
  const done = !!(p.outAt && eng.sameDay(p.outAt, NOW));
  const ta = eng.S.todayAtt[u.id];
  const hist = u.role === 'mgmt' ? 'mgmt-attendance' : 'agent-attendance';
  return (
    <Modal title="Attendance" sub={fd(NOW) + ' · Dubai'}>
      <div className="punchbox">
        <ClockRing p={p} size={188} />
        <div className="pb-now"><span className="muted sm">Now</span> <b><LiveClock /></b></div>
        <div className="row g6 wrap" style={{ justifyContent: 'center' }}>
          {p.in ? <Chip t={'In since ' + fhm(p.t)} cls="s6" /> : done ? <Chip t={'Out at ' + fhm(p.outAt)} cls="s2" /> : <Chip t="Not punched in" cls="s2" />}
          {ta ? <Chip t={ta.st} cls={ta.st === 'Late' ? 's5' : 's6'} /> : null}
          {p.brk ? <Chip t={'Break since ' + fhm(p.brkAt)} cls="s3" /> : null}
        </div>
      </div>
      <div className="col">
        {!p.in && !done ? (
          <>
            <button className="btn pri lg blk" type="button" data-act="punch|in"><Icon n="clock" s={18} />Punch in now</button>
            <span className="hint muted sm tc">Punching in after 10:00 marks the day as Late.</span>
          </>
        ) : null}
        {p.in && !p.brk ? (
          <div className="grid g2 keep">
            <button className="btn lg" type="button" data-act="punch|brk">Start break</button>
            <button className="btn lg dngo" type="button" data-act="punch|out">Punch out</button>
          </div>
        ) : null}
        {p.in && p.brk ? (
          <>
            <button className="btn pri lg blk" type="button" data-act="punch|endbrk">End break</button>
            <span className="hint muted sm tc">End your break before punching out.</span>
          </>
        ) : null}
        {done ? <Bn kind="ok" title="You are punched out" body="Need a correction? Use Request regularisation in Attendance." /> : null}
      </div>
      <a className="btn ghost blk" href={'#' + hist} data-go={hist}>Open attendance history</a>
    </Modal>
  );
};
