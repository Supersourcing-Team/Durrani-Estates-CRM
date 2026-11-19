/* A-settings / M02: personal profile, security and notification channels (prototype routes agent-settings, mgmt-settings). */
import React from 'react';
import { eng } from '../../engine';
import { Card, Icon, Kvs, PgHead, Toggle } from '../../ui';
import type { ScreenComp } from '../../app/types';
import { SignOutButton } from './SignOutButton';

const CHANNELS = ['Follow-up reminders', 'Lead at-risk warnings', 'Booking decisions', 'Meeting verification replies'];

function SettingsView({ role }: { role: 'agent' | 'mgmt' }) {
  const u = eng.me();
  const sl = eng.slabOf(u);
  // Agents see their slab and lead ceiling; managers see their team instead.
  const rows: [React.ReactNode, React.ReactNode][] = [
    ['Name', u.name], ['Employee ID', u.emp], ['Work email', u.email], ['Phone', u.phone], ['Role', eng.roleLabel(u)],
    ...(role === 'agent'
      ? [['Commission slab', sl ? sl.name + ' · ' + sl.rate + '%' : 'Not assigned yet'], ['Active lead ceiling', eng.capOf(u) + ' leads']] as [string, string][]
      : [['Team', eng.teamName(u.team)]] as [string, string][]),
  ];
  return (
    <>
      <PgHead t="Settings" sub="Your profile and preferences. Contact Admin to change role, team or slab." />
      <div className="grid g2">
        <Card title="Profile">
          <Kvs items={rows} />
          <p className="muted sm mt16">Profile details are managed by Admin so payroll and reports stay correct.</p>
        </Card>
        <Card title="Security">
          <div className="col">
            <div className="row sb">
              <div><div className="b">Password</div><div className="muted sm">Change it at least every 90 days.</div></div>
              <button className="btn" type="button" data-open="pw-change">Change password</button>
            </div>
            <div className="row sb">
              <div><div className="b">Sign out</div><div className="muted sm">End this session on this device.</div></div>
              <SignOutButton variant="btn" />
            </div>
          </div>
        </Card>
        <Card title="Notifications">
          <div className="nchan">
            <div className="nch-h"><span></span><span><Icon n="msg" s={14} />WhatsApp</span><span><Icon n="mail" s={14} />Email</span></div>
            {CHANNELS.map((t, i) => (
              <div className="nch-r" key={i}>
                <span>{t}</span>
                <Toggle on={eng.pref('w' + i)} act={'pref|w' + i} />
                <Toggle on={eng.pref('n' + i)} act={'pref|n' + i} />
              </div>
            ))}
          </div>
          <p className="muted sm mt8">In-app notifications always stay on. Choose where you also want a copy.</p>
        </Card>
      </div>
    </>
  );
}

export const Settings: ScreenComp = () => <SettingsView role="agent" />;
export const MgmtSettings: ScreenComp = () => <SettingsView role="mgmt" />;
