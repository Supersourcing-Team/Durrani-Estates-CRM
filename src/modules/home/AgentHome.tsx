/* A05 Home Dashboard (prototype route agent-home). */
import React from 'react';
import { eng, money, pct, fd, fhm, f2, rel, HR } from '../../engine';
import { Av, Bar, Card, Chip, Empty, Icon, Kpi, LeadLinks, PgHead, TempChip } from '../../ui';
import type { ScreenComp } from '../../app/types';

type Action = [title: string, detail: string, go: string, cls: string];

export const AgentHome: ScreenComp = () => {
  const S = eng.S;
  const u = eng.me(), a: any[] = eng.leadsOf(u.id), c = eng.capInfo(u.id), sl = eng.slabOf(u), ns = eng.nextSlab(u);
  const today = a.filter(eng.isToday).sort((x, y) => x.next.at - y.next.at);
  const od = a.filter(eng.isOverdue);
  const risk = a.filter((l) => eng.leadRisk(l).state === 'risk');
  const rk: any[] = eng.ranking((x: any) => x.team === u.team);
  const my = rk.find((x) => x.u.id === u.id);
  const rev = eng.revOf(u.id), tg = eng.targetOf(u), bc = eng.bookingsCount(u.id), pp = eng.punchState(u.id);
  const NOW = eng.NOW();

  const actions: Action[] = [];
  S.bookings.filter((b: any) => b.agent === u.id && b.status === 'changes')
    .forEach((b: any) => actions.push(['Booking ' + b.id + ' needs changes', b.reason, 'agent-booking-' + eng.bkP(b.id), 's3']));
  S.bookings.filter((b: any) => b.agent === u.id && ['pending', 'changes'].includes(b.status) && b.holdUntil > NOW && b.holdUntil - NOW < 12 * HR)
    .forEach((b: any) => actions.push(['Unit hold ends ' + rel(b.holdUntil), b.unit + ' on ' + b.id, 'agent-booking-' + eng.bkP(b.id), 's5']));
  S.bookings.filter((b: any) => b.agent === u.id && b.status === 'approved' && !b.spaIssued)
    .forEach((b: any) => actions.push(['Waiting for SPA on ' + b.id, 'Mark it issued once the developer sends it', 'agent-booking-' + eng.bkP(b.id), 's1']));
  eng.leadsOf(u.id).filter((l: any) => l.meets.some((m: any) => m.status === 'scheduled' && m.at < NOW))
    .forEach((l: any) => actions.push(['Meeting passed: ' + l.name, 'Send the client confirmation link', 'agent-lead-' + l.id, 's4']));

  const sched = today.length ? today.map((l) => (
    <a key={l.id} className={'sch ' + (l.next.done ? 'done' : '')} href={`#agent-lead-${l.id}`} data-go={`agent-lead-${l.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <span className="tm">{fhm(l.next.at)}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="b nm" style={{ display: 'block' }}>{l.name}</span>
        <span className="muted xs">{l.next.type}{l.next.note ? ' · ' + l.next.note : ''}</span>
      </span>
      {l.next.done ? <Chip t="Done" cls="s6" /> : <TempChip t={l.temp} />}
    </a>
  )) : <Empty icn="cal" t="Nothing scheduled today" d="Pick a lead and set the next follow-up." />;

  const nx = a.filter((l) => !l.archived).sort((x, y) => eng.prio(x) - eng.prio(y))[0];
  const why = nx ? (eng.isOverdue(nx) ? 'Follow-up overdue' : eng.leadRisk(nx).state === 'risk' ? 'At risk' : eng.isToday(nx) ? 'Due today' : !nx.attempts ? 'Not contacted yet' : 'Top priority') : '';

  return (
    <>
      <PgHead t={'Good morning, ' + u.name.split(' ')[0]} sub={fd(NOW) + (pp.in ? ' · Punched in ' + fhm(pp.t) : ' · You have not punched in yet')} />

      <section className="card flat mb16 rankhero">
        <div className="rh-main">
          <div className="row sb wrap" style={{ marginBottom: 14 }}>
            <h2 className="h2">My ranking · {f2(NOW, { month: 'long' })}</h2>
            <a className="lnkg" href="#agent-leaderboard" data-go="agent-leaderboard">Full ranking <Icon n="chev" s={14} /></a>
          </div>
          <div className="rk3">
            <a className="rankcard rk-g" href="#agent-leaderboard" data-go="agent-leaderboard">
              <span className="scope">Team</span><span className="rkn">#{my ? my.rank : '-'} <small>/ {rk.length}</small></span><span className="mv">{eng.teamName(u.team)}</span>
            </a>
            <a className="rankcard rk-c" href="#agent-leaderboard" data-go="agent-leaderboard">
              <span className="scope">Company</span><span className="rkn">#{S.rank.global[0]} <small>/ {S.rank.global[1]}</small></span><span className="mv">All offices</span>
            </a>
            <a className="rankcard rk-o" href="#agent-leaderboard" data-go="agent-leaderboard">
              <span className="scope">GCC</span><span className="rkn">#{S.rank.gcc[0]} <small>/ {S.rank.gcc[1]}</small></span><span className="mv">Gulf offices</span>
            </a>
          </div>
          <div className="gapline mt16">
            <Icon n="target" s={15} />
            <span>{ns ? <><b>{money(ns.gap)}</b> more in approved bookings reaches {ns.slab.name}. This is information only. Admin assigns slabs.</> : 'You are on the top slab.'}</span>
          </div>
        </div>
        <div className="rh-side">
          <div className="lbl">Commission slab</div>
          <div className="row sb" style={{ marginTop: 8 }}>
            <span className="kns">{sl ? sl.name : 'Not assigned'}</span>
            {sl ? <span className="chip s3">{sl.rate}% of brokerage</span> : <Chip t="No slab" cls="s7" />}
          </div>
          {ns ? (
            <div className="mt16">
              <Bar p={pct(rev, rev + ns.gap)} />
              <div className="row sb xs muted mt8"><span>{money(rev)} approved</span><span>{ns.slab.name} at {money(rev + ns.gap)}</span></div>
            </div>
          ) : null}
          <div className="row sb mt16 sm"><span className="muted">Bookings this month</span><b>{bc} of {tg.book}</b></div>
          <a className="lnkg mt8" style={{ display: 'inline-flex' }} href="#agent-performance" data-go="agent-performance">View performance <Icon n="chev" s={14} /></a>
        </div>
      </section>

      <div className="grid g21">
        <div className="col g16">
          {nx ? (
            <section className="callnext">
              <div className="row sb wrap"><span className="cnl">Call next</span><span className="why"><Icon n="clock" s={13} />{why}</span></div>
              <div className="row" style={{ gap: 14, marginTop: 14 }}>
                <Av n={nx.name} cls="lg" />
                <div style={{ minWidth: 0 }}>
                  <div className="cnn">{nx.name}</div>
                  <div className="cns"><LeadLinks text={`LEAD-${nx.id} · ${nx.phone} · ${nx.city}`} /></div>
                </div>
              </div>
              <div className="row g6 wrap" style={{ marginTop: 12 }}>
                <TempChip t={nx.temp} /><span className="cnt2">{nx.src}</span><span className="cnt2">{nx.camp}</span>
              </div>
              <div className="row" style={{ gap: 10, marginTop: 16 }}>
                <a className="btn callb lg" style={{ flex: 1 }} href={'tel:' + nx.phone.replace(/\s/g, '')} data-act={`dial|${nx.id}`}><Icon n="phone" s={18} />Call</a>
                <a className="btn ondark lg" href={`#agent-lead-${nx.id}`} data-go={`agent-lead-${nx.id}`}>Open lead</a>
              </div>
            </section>
          ) : null}

          <div className="grid g4c keep">
            <Kpi l="Active leads" n={<>{a.length}<span className="faint" style={{ fontSize: 16 }}> / {c.cap}</span></>} d={c.full ? 'At ceiling' : c.left + ' slots left'} act="leadsview|all" />
            <Kpi l="Due today" n={String(today.filter((l) => !l.next.done).length)} d={od.length + ' overdue'} act="leadsview|today" />
            <Kpi l="At risk" n={String(risk.length)} d={risk.length ? 'Act before they return to the pool' : 'All leads active'} act="leadsview|risk" cls={risk.length ? 'warn' : ''} />
            <Kpi l="Hot leads" n={String(a.filter((l) => l.temp === 'hot').length)} d="Prioritise these" act="leadsview|hot" />
          </div>

          <Card title="Today's schedule" right={<a className="btn s" href="#agent-schedule" data-go="agent-schedule">Full schedule</a>} bare={!today.length}>
            {sched}
          </Card>

          <Card title="Targets this month" right={<a className="btn s" href="#agent-performance" data-go="agent-performance">Performance</a>}>
            <div className="col g16">
              <div><div className="row sb sm"><span>Revenue (approved bookings)</span><b>{money(rev)} of {money(tg.rev)}</b></div><Bar p={pct(rev, tg.rev)} /></div>
              <div><div className="row sb sm"><span>Bookings</span><b>{bc} of {tg.book}</b></div><Bar p={pct(bc, tg.book)} cls={bc >= tg.book ? 'ok' : ''} /></div>
            </div>
            <p className="muted sm mt16">Only approved or closed bookings count. Pending bookings do not.</p>
          </Card>
        </div>

        <div className="col g16">
          <Card title="Needs your attention">
            {actions.length || risk.length || od.length ? (
              <div className="col" style={{ gap: 2, margin: '0 -8px' }}>
                {risk.slice(0, 4).map((l) => {
                  const left = eng.leadRisk(l).left;
                  return (
                    <a key={l.id} className="attn err" href={`#agent-lead-${l.id}`} data-go={`agent-lead-${l.id}`}>
                      <span><Icon n="alert" s={16} /></span>
                      <div><div className="t">{l.name} is at risk</div><div>{left} day{left === 1 ? '' : 's'} before it returns to the pool</div></div>
                    </a>
                  );
                })}
                {od.length ? (
                  <button type="button" className="attn warn" data-act="leadsview|overdue">
                    <span><Icon n="clock" s={16} /></span>
                    <div><div className="t">{od.length} overdue follow-up{od.length === 1 ? '' : 's'}</div><div>Contact them or reschedule</div></div>
                  </button>
                ) : null}
                {actions.map((x, i) => (
                  <a key={i} className="attn info" href={'#' + x[2]} data-go={x[2]}>
                    <span><Icon n="info" s={16} /></span>
                    <div><div className="t">{x[0]}</div><div>{x[1]}</div></div>
                  </a>
                ))}
              </div>
            ) : <Empty icn="check" t="All clear" d="Nothing needs you right now." />}
          </Card>

          <Card title="Unit holds">
            <div className="row sb"><span>Active holds</span><b>{eng.holdsOf(u.id)} of {S.set.holdCap}</b></div>
            <Bar p={pct(eng.holdsOf(u.id), S.set.holdCap)} />
            <p className="muted sm mt8">A booking holds the unit for {S.set.holdHours} hours while Admin reviews it.</p>
          </Card>
        </div>
      </div>
    </>
  );
};
