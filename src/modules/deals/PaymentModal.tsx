/* Payment plan breakdown for a unit (prototype modal payment; args: [projectId, unitId]). */
import React from 'react';
import { eng } from '../../engine';
import { Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { nw } from './shared';
import { paymentPlanRows } from './propertyMappers';

export const PaymentModal: ModalComp = ({ args }) => {
  const pr = eng.projById(args[0]), x = pr.units.find((u: any) => u.id === args[1]);
  const rows = paymentPlanRows(pr, x.price);
  const fromApi = Array.isArray(pr.paymentPlans) && pr.paymentPlans.some((p: any) =>
    (p?.milestones || p?.installments || p?.rows || p?.schedule || []).length,
  );
  return (
    <Modal title="Payment breakdown" sub={pr.name + ' · ' + x.id + ' · ' + eng.mfull(x.price)}
      foot={<button className="btn" type="button" data-act="mclose">Close</button>}>
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>Milestone</th><th className="num">%</th><th className="num">Amount (AED)</th></tr></thead>
          <tbody>
            {rows.map((r, i) => <tr key={i}><td className={nw(r.n)}>{r.n}</td><td className="num nw">{r.pct}%</td><td className="num nw">{eng.nf(r.amt)}</td></tr>)}
            <tr><td className="nw"><b>Total</b></td><td className="num nw"><b>100%</b></td><td className="num nw"><b>{eng.nf(x.price)}</b></td></tr>
          </tbody>
        </table>
      </div>
      <p className="muted sm">DLD fee of 4% ({eng.mfull(Math.round(x.price * 0.04))}) and the Oqood fee are paid by the buyer on top. Plan: {pr.plan}{fromApi ? '' : ' (estimated)'}.</p>
    </Modal>
  );
};
