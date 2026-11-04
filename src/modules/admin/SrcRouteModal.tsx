/* AD-L3-25 Routing rule for one lead form (prototype modal src-route, saved by srcroute). */
import { eng } from '../../engine';
import { Bn, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { RouteFields } from './parts';

export const SrcRouteModal: ModalComp = ({ args }) => {
  const fm = eng.S.sources[args[0]].forms.find((x: any) => x.id === args[1]);
  return (
    <Modal title="Routing for this form" sub={fm.name} foot={<>
      <button className="btn" type="button" data-act="mclose">Cancel</button>
      <button className="btn pri" type="button" data-act={`srcroute|${args[0]}|${args[1]}`}>Save rule</button>
    </>}>
      <RouteFields projLabel="Project" />
      <Bn kind="info" body="Only new leads follow the new rule. Leads already in the CRM stay where they are." />
    </Modal>
  );
};
