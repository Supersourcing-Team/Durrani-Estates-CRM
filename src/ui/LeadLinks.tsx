/*
 * prototype: linkLeads(). After every render the prototype turned "LEAD-1234" in page text into a
 * link to that lead (when the user may open it). In React, wrap such text in <LeadLinks text={...} />.
 * Not used inside links, buttons, form fields, labels or clickable rows' inner links, and not in modals.
 */
import React from 'react';
import { eng } from '../engine';

export function LeadLinks({ text }: { text: string }): JSX.Element {
  const s = String(text ?? '');
  if (!/LEAD-\d{3,5}/.test(s) || !eng.S.session) return <>{s}</>;
  const role = eng.S.session.role;
  const out: React.ReactNode[] = [];
  let last = 0;
  s.replace(/LEAD-(\d{3,5})/g, (m: string, id: string, i: number) => {
    out.push(s.slice(last, i));
    const l = eng.leadById(id);
    if (l && eng.leadAccess(role, l) === 'ok') {
      const go = role + '-lead-' + id;
      out.push(<a key={i} href={'#' + go} data-go={go} className="ldl">{m}</a>);
    } else out.push(m);
    last = i + m.length;
    return m;
  });
  out.push(s.slice(last));
  return <>{out}</>;
}
