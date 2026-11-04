/*
 * Project detail (prototype routes agent-project, mgmt-project, admin-project: projectPage(role, p)).
 * Agent: book / request availability / add to a lead. Admin: edit project and units. Manager and Admin also get
 * the "Who is working this project" pipeline card below.
 */
import React from 'react';
import { eng } from '../../engine';
import { Btn, Card, Empty, Icon, Tag, Td, UnitChip } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { nw } from './shared';
import { ProjPipeline } from './ProjPipeline';

export type Role = 'agent' | 'mgmt' | 'admin';

const SEG: [string, string][] = [['all', 'All'], ['Available', 'Available'], ['Held', 'Held'], ['Booked', 'Booked'], ['Sold', 'Sold']];

/** Row of buttons at the end of each unit row */
function UnitActs({ role, pr, x }: { role: Role; pr: any; x: any }) {
  return (
    <div className="row g6 end" style={{ flexWrap: 'nowrap' }}>
      <button className="btn s" type="button" data-open={`payment|${pr.id}|${x.id}`}>Payment plan</button>
      {role === 'agent'
        ? x.status === 'Available'
          ? <button className="btn s pri" type="button" data-open={`pick-lead|${pr.id}|${x.id}`}>Book</button>
          : x.status === 'Held' || x.status === 'Booked'
            ? <button className="btn s" type="button" data-open={`avail|${pr.id}|${x.id}`}>Request availability</button>
            : null
        : null}
      {role === 'admin' ? <button className="btn s" type="button" data-open={`unit-edit|${pr.id}|${x.id}`}>Edit</button> : null}
    </div>
  );
}

function ProjectPage({ role, params }: { role: Role; params: string[] }) {
  const pr = eng.projById(params[0]);
  if (!pr) return <Card><Empty icn="building" t="Project not found" d="No project with that ID." act={<Btn t="Back" go={role === 'agent' ? 'agent-catalogue' : role + '-projects'} cls="pri" />} /></Card>;
  const u = eng.me(), sl = role === 'agent' ? eng.slabOf(u) : null;
  const f = eng.UI.f.uf || 'all';
  const ul: any[] = pr.units.filter((x: any) => f === 'all' || x.status === f);

  const pay = (
    <div className="col g6">
      <div className="row sb"><span className="muted">Payment plan</span><b>{pr.plan}</b></div>
      <div className="row sb"><span className="muted">Handover</span><b>{pr.ho}</b></div>
      <div className="row sb"><span className="muted">RERA</span><b>{pr.rera}</b></div>
      {role === 'agent' ? (
        <>
          <div className="row sb"><span className="muted">Developer commission</span><b>{pr.comm}%</b></div>
          <div className="row sb"><span className="muted">Your slab pays</span><b>{sl ? sl.rate + '% of that = ' + (+(pr.comm * sl.rate / 100).toFixed(3)) + '% of price' : 'No slab assigned'}</b></div>
        </>
      ) : null}
    </div>
  );

  const unitRows = ul.map((x) => {
    const holdMine = x.holdBy === u.id;
    const held = x.status === 'Held' ? (role === 'admin' || holdMine ? 'by ' + eng.uname(x.holdBy) + ', ' : '') + 'until ' + eng.fts(x.holdUntil) : '';
    const actTxt = 'Payment plan'
      + (role === 'agent' ? (x.status === 'Available' ? 'Book' : x.status === 'Held' || x.status === 'Booked' ? 'Request availability' : '') : '')
      + (role === 'admin' ? 'Edit' : '');
    return (
      <tr key={x.id}>
        <Td first l="Unit" className={nw(x.id)}><b>{x.id}</b></Td>
        <Td l="Type" className={nw(x.type)}>{x.type}</Td>
        <Td l="Size" className={nw(eng.nf(x.size) + ' sqft', 'num')}>{eng.nf(x.size)} sqft</Td>
        <Td l="Price" className={nw(eng.mfull(x.price), 'num')}>{eng.mfull(x.price)}</Td>
        <Td l="Status" className={nw(x.status + held)}><UnitChip s={x.status} />{held ? <div className="xs faint">{held}</div> : null}</Td>
        <td data-l="" className={nw(actTxt, 'tr')}><UnitActs role={role} pr={pr} x={x} /></td>
      </tr>
    );
  });

  return (
    <>
      <div className="card flat mb16">
        <div className="proj">
          <div className={'img i' + pr.img} style={{ height: 160 }}><span className="chip s3" style={{ background: 'rgba(255,255,255,.9)' }}>{pr.status}</span></div>
          <div className="pb">
            <div className="row sb wrap">
              <h1 className="h1" style={{ fontSize: 28 }}>{pr.name}</h1>
              <div className="row g6 wrap">
                {role === 'agent' ? <button className="btn" type="button" data-open={`shortlist-add|${pr.id}`}><Icon n="plus" s={16} />Add to a lead</button> : null}
                {role === 'admin' ? <button className="btn pri" type="button" data-open={`project-edit|${pr.id}`}><Icon n="edit" s={16} />Edit project</button> : null}
              </div>
            </div>
            <div className="muted">{pr.area}, {pr.city} · {pr.dev} · {pr.type}</div>
            <p>{pr.desc}</p>
            <div className="row g6 wrap">{pr.amen.map((x: string, i: number) => <Tag key={i} t={x} />)}</div>
          </div>
        </div>
      </div>
      <div className="grid g21 mb16">
        <Card title="Units" bare>
          <div className="row sb wrap g6" style={{ padding: '14px 20px 0' }}>
            <div className="seg">{SEG.map(([k, t]) => <button key={k} type="button" className={f === k ? 'on' : ''} data-act={`ui|uf|${k}`}>{t}</button>)}</div>
            {role === 'admin' ? <button className="btn s" type="button" data-open={`unit-edit|${pr.id}`}><Icon n="plus" s={16} />Add unit</button> : null}
          </div>
          {ul.length ? (
            <div className="tw mt16">
              <table className="tbl">
                <thead><tr><th>Unit</th><th>Type</th><th className="num">Size</th><th className="num">Price</th><th>Status</th><th></th></tr></thead>
                <tbody>{unitRows}</tbody>
              </table>
            </div>
          ) : <Empty icn="building" t="No units in this view" d="Change the filter." />}
        </Card>
        <Card title="Plan and terms">{pay}</Card>
      </div>
      {role === 'admin' ? <Card title="Last updated">{eng.uname(pr.upd[0])} · {eng.ft(pr.upd[1])}</Card> : null}
      {role !== 'agent' ? <ProjPipeline role={role} pr={pr} /> : null}
    </>
  );
}

/** Screen for one role (registered as agent-project, mgmt-project, admin-project). */
export const projectDetail = (role: Role): ScreenComp => {
  const C: ScreenComp = ({ params }) => <ProjectPage role={role} params={params} />;
  C.displayName = `ProjectDetail(${role})`;
  return C;
};
export const ProjectDetail = projectDetail('agent');
