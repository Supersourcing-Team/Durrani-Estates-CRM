/* M Secondary Market for managers (prototype route mgmt-secondary, plus the 15c-deals "How it works" button). */
import React from 'react';
import { eng } from '../../engine';
import { Card, Empty, Icon, PgHead } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { SecTable } from './SecList';

export const SecListMgmt: ScreenComp = () => {
  const l: any[] = eng.secList('mgmt');
  return (
    <>
      <PgHead t="Secondary Market" sub="Requests raised by or assigned to your team. Admin lists and assigns."
        right={<button className="btn" type="button" data-open="sec-info"><Icon n="info" s={16} />How it works</button>} />
      <Card title="" bare>
        {l.length ? <SecTable rows={l} role="mgmt" /> : <Empty icn="store" t="Nothing yet" d="Your agents have not raised any requests." />}
      </Card>
    </>
  );
};
