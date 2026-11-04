/* Small shared pieces of the Manager screens. */
import React from 'react';
import { eng } from '../../engine';
import { Chip, Icon } from '../../ui';

/** prototype: chip(todayStat(id), TST[todayStat(id)] || 's2') - agent's attendance status today */
export function TodayChip({ id }: { id: string }) {
  const st = eng.todayStat(id);
  return <Chip t={st} cls={eng.TST[st] || 's2'} />;
}

/**
 * prototype: dlBtn(label, text, name). Stores the CSV in the engine's download buffer and runs A.dlcsv on click.
 * The buffer key is derived from the file name and content length so it is stable across re-renders.
 */
export function DlBtn({ label, text, name }: { label: string; text: string; name: string }) {
  const k = 'r-' + name + '-' + text.length;
  eng.DLBUF[k] = [text, name];
  return <button className="btn" type="button" data-act={`dlcsv|${k}`}><Icon n="dl" s={16} />{label}</button>;
}
