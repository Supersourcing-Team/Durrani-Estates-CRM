/* AD Sign-in / punch location detail (prototype modal ip-detail). args: [geo id]. */
import React from 'react';
import { eng, ft } from '../../engine';
import { Bn, Dl, Fld, MTxa, Modal } from '../../ui';
import type { ModalComp } from '../../app/types';
import { GeoFlag } from './parts';

const why = (iss: string) => iss.startsWith('VPN')
  ? 'The address belongs to a VPN or proxy service, so the real location is hidden. Ask the person to switch it off for punching in.'
  : iss === 'New device' ? 'First time this device was used. Usually a new phone. Confirm with the person.'
  : 'The IP is in a different city from the team office. They may be on a site visit or travelling. Ask before acting.';

export const IpDetailModal: ModalComp = ({ args }) => {
  const g = eng.S.geo.find((x: any) => x.id === args[0]);
  const iss: string = eng.geoIssue(g);
  const u = eng.userById(g.u);
  const ask = !!iss && !g.ok;
  return (
    <Modal title={u.name + ' · ' + g.ev} sub={ft(g.at)}
      foot={<>
        <button className="btn" type="button" data-act="mclose">Close</button>
        {ask ? <><button className="btn" type="button" data-act={`ipok|${g.id}`}>Mark as explained</button><button className="btn pri" type="button" data-act={`ipask|${g.id}`}>Send question</button></> : null}
      </>}>
      <Dl items={[
        ['Location', g.city + ', ' + g.cc + ' (approximate)'],
        ['IP address', <span className="mono">{g.ip}</span>],
        ['Network', g.isp],
        ['Device', g.dev],
        ['Office city', eng.OFFICE[u.team] || 'Not set'],
        ['Check', iss ? <GeoFlag g={g} /> : 'Matches the office city'],
      ]} />
      {iss ? <Bn kind="warn" title="Why this is flagged" body={why(iss)} /> : null}
      {ask ? (
        <Fld label="Ask for an explanation" htmlFor="m_txt" hint="Sent as a notification. Their reply goes in the audit log.">
          <MTxa k="txt" ph={'Hi, your punch-in today shows ' + g.city + '. Can you tell me where you were?'} />
        </Fld>
      ) : null}
    </Modal>
  );
};
