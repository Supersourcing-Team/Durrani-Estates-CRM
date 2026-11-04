/* AD08 Lead Import (prototype route admin-import): import history and how duplicates are handled.
 * History cells use Td (labelTables): short cells stay on one line, as in the prototype. */
import React from 'react';
import { eng, nf, ft } from '../../engine';
import { Btn, Card, Empty, Kpi, PgHead, Td, isShort } from '../../ui';
import type { ScreenComp } from '../../app/types';

export const AdminImport: ScreenComp = () => {
  const h: any[] = eng.S.imports;
  const sum = (f: (x: any) => number) => eng.sum(h, f);

  return (
    <>
      <PgHead t="Lead Import" sub="Bring leads in from a CSV. Duplicates are handled by rule, never by hand."
        right={<Btn cls="pri" go="admin-importnew" ic="upload">New import</Btn>} />
      <div className="grid g4c keep mb16">
        <Kpi l="Imports so far" n={String(h.length)} />
        <Kpi l="Rows imported" n={nf(sum((x) => x.ok))} d="Became new leads" />
        <Kpi l="Duplicates discarded" n={nf(sum((x) => x.dup))} d="Same number, same campaign" />
        <Kpi l="Linked leads" n={nf(sum((x) => x.linked))} d="Same number, different campaign" />
      </div>
      <div className="grid g21">
        <div className="col g16">
          <Card title="History" bare>
            {h.length ? (
              <div className="tw">
                <table className="tbl">
                  <thead><tr><th>File</th><th>When</th><th>By</th><th className="num">Rows</th><th className="num">New</th><th className="num">Discarded</th><th className="num">Linked</th><th className="num">Errors</th></tr></thead>
                  <tbody>
                    {h.map((x, i) => (
                      <tr key={i}>
                        <Td l="File" first><div className="b">{x.file}</div><div className="xs faint">{x.camp}</div></Td>
                        <Td l="When" className="sm" nw={isShort(ft(x.at))}>{ft(x.at)}</Td>
                        <Td l="By" className="sm" nw={isShort(eng.uname(x.by))}>{eng.uname(x.by)}</Td>
                        <Td l="Rows" className="num" nw>{nf(x.total)}</Td>
                        <Td l="New" className="num" nw>{nf(x.ok)}</Td>
                        <Td l="Discarded" className="num" nw>{nf(x.dup)}</Td>
                        <Td l="Linked" className="num" nw>{nf(x.linked)}</Td>
                        <Td l="Errors" className={'num ' + (x.err ? 'dangertx b' : '')} nw>{nf(x.err)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <Empty icn="upload" t="No imports yet" d="Start with the sample file to see how it works." act={<a className="btn pri" href="#admin-importnew" data-go="admin-importnew">New import</a>} />}
          </Card>
        </div>
        <div className="col g16">
          <Card title="How duplicates are handled">
            <div className="col g16 sm">
              <div><b>Same number, same campaign.</b> The row is discarded. Nothing is created.</div>
              <div><b>Same number, different campaign.</b> A linked lead is created. It goes to the agent who already holds the original while that lead is active. If the original is archived or in the pool, it goes to the pool.</div>
              <div><b>Do Not Call numbers.</b> Skipped and counted as errors.</div>
              <div><b>Invalid numbers.</b> Counted as errors. You can copy the bad rows.</div>
            </div>
            <a className="btn blk mt16" href="#admin-settings-dnd" data-go="admin-settings-dnd">Open Do Not Call list</a>
          </Card>
        </div>
      </div>
    </>
  );
};
