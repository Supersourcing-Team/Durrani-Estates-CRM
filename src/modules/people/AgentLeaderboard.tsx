/* A Leaderboard (prototype route agent-leaderboard). Scope toggle lives in UI.f.lbs. */
import React from 'react';
import { eng, money } from '../../engine';
import { Av, Card, Kpi, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';

const MEDAL = ['#F2D27A', '#D9D2C2', '#E0B58A'];

export const AgentLeaderboard: ScreenComp = () => {
  const S = eng.S;
  const u = eng.me();
  const f = eng.UI.f.lbs || 'team';
  const rk: any[] = eng.ranking(f === 'team' ? (x: any) => x.team === u.team : null);
  const my = rk.find((x) => x.u.id === u.id);

  return (
    <>
      <PgHead t="Leaderboard" sub="Ranks use approved bookings only. You see your own amounts. Everyone else shows rank and name." />
      <div className="seg mb16">
        <button className={f === 'team' ? 'on' : ''} data-act="ui|lbs|team">My team</button>
        <button className={f === 'all' ? 'on' : ''} data-act="ui|lbs|all">Company</button>
      </div>
      <div className="grid g3 keep mb16">
        <Kpi l="Your rank" n={my ? '#' + my.rank + ' of ' + rk.length : '-'} d={f === 'team' ? eng.teamName(u.team) : 'All teams'} />
        <Kpi l="Company rank" n={'#' + S.rank.global[0]} d={'of ' + S.rank.global[1] + ' agents'} />
        <Kpi l="GCC rank" n={'#' + S.rank.gcc[0]} d={'of ' + S.rank.gcc[1] + ' agents'} />
      </div>
      <Card bare>
        <div>
          {rk.map((x) => {
            const isMe = x.u.id === u.id;
            return (
              <div key={x.u.id} className={'rk ' + (isMe ? 'me' : '')}>
                <span className="n">{x.rank <= 3 ? <span className="rank-medal" style={{ background: MEDAL[x.rank - 1] }}>{x.rank}</span> : x.rank}</span>
                <Av n={x.u.name} cls="sm" />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="b trunc" style={{ display: 'block' }}>{x.u.name}{isMe ? ' (you)' : ''}</span>
                  <span className="xs faint">{eng.teamName(x.u.team)}</span>
                </span>
                {isMe ? <span className="b">{money(x.rev)} · {eng.bookingsCount(u.id)} bookings</span> : null}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};
