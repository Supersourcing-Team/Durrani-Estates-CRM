/* Domain chips (prototype: tempChip, trackChip, stageChip, dispChip, bkChip, docChip, commChip, riskChip, unitChip, ownerChip). */
import React from 'react';
import { eng, cap1 } from '../engine';
import { Chip, Av } from './core';

export function TempChip({ t }: { t?: string | null }) {
  if (!t) return <span className="faint sm">Not set</span>;
  return <Chip t={cap1(t)} cls={({ hot: 's7', warm: 's5', cold: 's1' } as Record<string, string>)[t]} />;
}
export function TrackChip({ t }: { t?: string | null }) {
  if (!t) return <span className="faint sm">Unqualified</span>;
  return <span className={'chip t-' + t}><i style={{ background: 'currentColor' }} />{eng.TRACKS[t]}</span>;
}
export const StageChip = ({ s }: { s: string }) => <Chip t={s} cls={eng.STG[s] || 's2'} />;
export function DispChip({ d }: { d?: string | null }) {
  if (!d) return <span className="faint sm">None yet</span>;
  return <Chip t={d} cls={eng.DSP[d] || 's2'} />;
}
export const BkChip = ({ s }: { s: string }) => <Chip t={eng.BKS[s][0]} cls={eng.BKS[s][1]} />;
export const DocChip = ({ s }: { s: string }) => <Chip t={eng.DOCS[s][0]} cls={eng.DOCS[s][1]} />;
export const CommChip = ({ s }: { s: string }) => <Chip t={eng.CMS[s][0]} cls={eng.CMS[s][1]} />;
export function RiskChip({ l }: { l: any }) {
  const r = eng.leadRisk(l);
  if (r.state === 'risk') return <Chip t={'At risk · ' + r.left + (r.left === 1 ? ' day' : ' days') + ' left'} cls="s7" />;
  if (r.state === 'hold') return <Chip t="On hold" cls="s4" />;
  return null;
}
export const UnitChip = ({ s }: { s: string }) => <Chip t={s} cls={({ Available: 's6', Held: 's5', Booked: 's4', Sold: 's2' } as Record<string, string>)[s] || 's2'} />;
export function OwnerChip({ id }: { id?: string | null }) {
  if (!id) return <span className="faint">Admin pool</span>;
  return <span className="row g6"><Av n={eng.uname(id)} cls="sm" /><span>{eng.uname(id)}</span></span>;
}
