/* AD-L3-26 Audit entry detail (prototype modal audit-row, opened from a row of the Audit Log). */
import { eng, ft } from '../../engine';
import { Bn, Dl, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';

export const AuditRowModal: ModalComp = ({ args }) => {
  const x = eng.S.audit.find((y: any) => y.id === args[0]);
  const u = eng.userById(x.actor);
  const g = (eng.S.geo || []).filter((y: any) => y.u === x.actor && eng.sameDay(y.at, x.at)).pop();
  const from = u ? (g ? g.city + ', ' + g.cc + ' · ' + g.ip + ' · ' + g.dev : '94.200.141.10 · Dubai, AE · office network') : 'Server';
  const cat = eng.AUDCAT.find((c: any) => c[0] === eng.audCat(x.action))[1];
  return (
    <Modal title={x.action} sub={ft(x.at)} foot={<button className="btn pri" type="button" data-act="mclose">Close</button>}>
      <Dl items={[
        ['Done by', u ? u.name + ' · ' + eng.ROLEN[u.role] : 'System (automatic rule)'],
        ['Record', x.entity],
        ['Before', x.before || 'Empty'],
        ['After', <b>{x.after || 'Empty'}</b>],
        ['Category', cat],
        ['From', from],
      ]} />
      <Bn kind="info" body="This entry is permanent. To undo a change, make a new change. Both stay on record." />
    </Modal>
  );
};
