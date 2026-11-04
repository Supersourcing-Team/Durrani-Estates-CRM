// @ts-nocheck
/* eslint-disable */
/*
 * Durrani Estates CRM: prototype engine (generated, do not edit by hand).
 * Source: 05-Source/build (prototype v10). Regenerate with scripts/gen-engine.cjs then scripts/trim-engine.cjs (see README).
 *
 * This file is the prototype's sample data, business rules and actions, kept verbatim so the React
 * screens behave exactly like the approved prototype. It stands in for the real backend: in the live
 * product these rules run on the server and the screens call the API instead.
 * Rendering, modals and toasts are provided by ./bridge.ts (React).
 */
import { render, renderOverlay, modalRerender, openM, closeM, confirmM, toast, stageClass, protoBar, fitFrame,
  paintAv, labelTables, inspector, _toastCount, _popToast, _markToastNoTimer, _pushToast } from './bridge';
import LOGO_URL from '../assets/logo.png';
/* ===== core: helpers, icons, registry, router, shell, modals ===== */
const IC={
grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
userplus:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
building:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
file:'<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>',
store:'<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>',
clip:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
percent:'<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
chart:'<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
hist:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
cog:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
chev:'<path d="m9 18 6-6-6-6"/>',chevd:'<path d="m6 9 6 6 6-6"/>',back:'<path d="m15 18-6-6 6-6"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
menu:'<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
check:'<path d="M20 6 9 17l-5-5"/>',
alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
msg:'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
clipb:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
more:'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
edit:'<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
trash:'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
copy:'<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
video:'<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
dollar:'<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
layers:'<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
list:'<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
map:'<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>',
target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
tag:'<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>'};
const ic=(n,s)=>`<svg viewBox="0 0 24 24" width="${s||16}" height="${s||16}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;
const LOGO=`<img class="brandlogo" src="${LOGO_URL}" alt="Durrani Estates" width="96" height="38">`;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));


const MIN=6e4,HR=36e5,DAY=864e5;
const TZ='Asia/Dubai';
const NOW=()=>S.now;
const f2=(t,o)=>new Date(t).toLocaleString('en-GB',Object.assign({timeZone:TZ},o));
const fd=t=>f2(t,{day:'numeric',month:'short',year:'numeric'});
const fds=t=>f2(t,{day:'numeric',month:'short'});
const fhm=t=>f2(t,{hour:'2-digit',minute:'2-digit',hour12:false});
const ft=t=>fd(t)+', '+fhm(t);
const fts=t=>fds(t)+', '+fhm(t);
const dayKey=t=>f2(t,{year:'numeric',month:'2-digit',day:'2-digit'});
const sameDay=(a,b)=>dayKey(a)===dayKey(b);
const startOfDay=t=>{const d=new Date(t+4*HR);d.setUTCHours(0,0,0,0);return d.getTime()-4*HR};
const daysBetween=(a,b)=>Math.floor((startOfDay(b)-startOfDay(a))/DAY);
const rel=t=>{const d=t-NOW(),a=Math.abs(d),s=d<0?' ago':'';const pre=d>0?'in ':'';if(a<HR)return pre+Math.max(1,Math.round(a/MIN))+' min'+s;if(a<DAY)return pre+Math.round(a/HR)+' h'+s;const n=Math.round(a/DAY);return pre+n+(n===1?' day':' days')+s};
const nf=n=>Number(n).toLocaleString('en-US');
const money=(n,cur)=>{cur=cur||'AED';if(cur==='INR'){return 'INR '+Number(Math.round(n)).toLocaleString('en-IN')}return 'AED '+(n>=1e6?(+(n/1e6).toFixed(2))+'M':n>=1e4?(+(n/1e3).toFixed(0))+'K':nf(Math.round(n)))};
const mfull=(n,cur)=>(cur||'AED')+' '+(cur==='INR'?Number(Math.round(n)).toLocaleString('en-IN'):nf(Math.round(n)));
const pct=(a,b)=>b?Math.round(a/b*100):0;
const ini=n=>String(n||'?').split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const cap1=s=>s?s[0].toUpperCase()+s.slice(1):'';
const uid=()=>Math.random().toString(36).slice(2,8);

const sum=(a,f)=>a.reduce((x,y)=>x+(f?f(y):y),0);
const by=(a,f)=>a.reduce((m,x)=>{(m[f(x)]=m[f(x)]||[]).push(x);return m},{});

/* ---- html builders ---- */
function at(o){let s='';if(o.go)s+=` data-go="${esc(o.go)}"`;if(o.open)s+=` data-open="${esc(o.open)}"`;if(o.act)s+=` data-act="${esc(o.act)}"`;if(o.id)s+=` id="${esc(o.id)}"`;if(o.title)s+=` title="${esc(o.title)}"`;if(o.lbl)s+=` data-lbl="${esc(o.lbl)}"`;if(o.dis)s+=' disabled';if(o.on)s+=' aria-current="true"';return s}
const btn=o=>{const tag=o.go?'a':'button';const href=o.go?` href="#${esc(o.go)}"`:'';return `<${tag} class="btn ${o.cls||''}"${href}${at(o)}${tag==='button'?' type="button"':''}>${o.ic?ic(o.ic,o.is||16):''}${o.t||''}</${tag}>`};

const chip=(t,cls,dot)=>`<span class="chip ${cls||'s2'}">${dot===false?'':'<i></i>'}${esc(t)}</span>`;
const tag=(t,cls)=>`<span class="tag ${cls||''}">${esc(t)}</span>`;
const AVC=['#9a6a00','#3f6e2a','#7c3a1d','#1e4d6b','#5b3a7a','#6b5a45','#1f6f5c','#8a3b3b','#44506b','#7a5c1e'];
const avHash=s=>{let h=0;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h};
const av=(n,cls)=>`<span class="av ${cls||''}" style="background:${AVC[avHash(n)%AVC.length]}">${esc(ini(n))}</span>`;
/* labelTables: provided by bridge.ts */
/* paintAv: provided by bridge.ts */
const bn=(kind,title,body,acts)=>`<div class="bn ${kind}"><span>${ic(kind==='ok'?'check':kind==='info'?'info':'alert',18)}</span><div>${title?`<div class="t">${title}</div>`:''}${body?`<div>${body}</div>`:''}</div>${acts?`<div class="acts">${acts}</div>`:''}</div>`;
const empty=(icn,t,d,act)=>`<div class="empty"><div class="ei">${ic(icn,22)}</div><div class="et">${t}</div><div style="max-width:380px">${d||''}</div>${act||''}</div>`;

const card=(title,body,o)=>{o=o||{};return `<section class="card flat ${o.cls||''}">${title||o.right?`<div class="ch"><h2 class="h2">${title||''}</h2>${o.right?`<div class="row g6 wrap">${o.right}</div>`:''}</div>`:''}<div class="${o.bare?'':'cb'}">${body}</div></section>`};
const kvs=a=>`<div class="kv">${a.map(([k,v])=>`<div class="kvi"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('')}</div>`;

const fld=(label,inner,o)=>{o=o||{};return `<div class="fld ${o.cls||''}"><label${o.for?` for="${o.for}"`:''}>${label}${o.req?' <span class="dangertx">*</span>':''}</label>${inner}${o.hint?`<span class="hint">${o.hint}</span>`:''}${o.err?`<span class="err">${ic('alert',14)}${o.err}</span>`:''}</div>`};
const mv=k=>UI.mf[k]==null?'':UI.mf[k];
const minp=(k,o)=>{o=o||{};return `<input class="inp ${o.bad?'bad':''}" id="m_${k}" data-m="${k}" type="${o.type||'text'}" value="${esc(mv(k))}" placeholder="${esc(o.ph||'')}"${o.min!=null?` min="${o.min}"`:''}${o.dis?' disabled':''}>`};
const mtxa=(k,o)=>{o=o||{};return `<textarea class="txa ${o.bad?'bad':''}" id="m_${k}" data-m="${k}" placeholder="${esc(o.ph||'')}">${esc(mv(k))}</textarea>`};

const mopt=(k,v,t,d,o)=>{o=o||{};return `<button type="button" class="opt ${String(mv(k))===String(v)?'on':''} ${o.dg?'dg':''}" data-act="mset|${k}|${esc(v)}"><span><span class="t">${t}</span>${d?`<span class="d" style="display:block">${d}</span>`:''}</span></button>`};

/* ---- registries ---- */
const R={},MD={},A={},NAV={},PRE={agent:'A',mgmt:'M',admin:'AD',client:'C',login:'L',proto:'P',shared:'S'};
const seq={},mseq={};
function def(key,o){const p=PRE[o.role];seq[p]=(seq[p]||0)+1;o.id=p+String(seq[p]).padStart(2,'0');o.key=key;R[key]=o}
function mdef(key,o){const p=PRE[o.role];mseq[p]=(mseq[p]||0)+1;o.id=p+'-L3-'+String(mseq[p]).padStart(2,'0');o.key=key;MD[key]=o}

/* ---- UI state ---- */
let UI;
function resetUI(){UI={m:null,args:[],mf:{},pf:{},c:null,pg:{},f:{},notif:false,dev:UI?UI.dev:false,pframe:UI?UI.pframe:false,next:null,toasts:[],more:false}}
resetUI();

/* ---- router ---- */
function parse(h){h=String(h||'').replace(/^#/,'');if(!h)return null;const p=h.split('-').filter(Boolean);let key=p[0]+'-'+p[1],d=R[key],n=2;if(!d){key=p[0];d=R[key];n=1}if(!d)return null;return {key,def:d,params:p.slice(n),hash:h}}
const hashOf=()=>location.hash.replace(/^#/,'');
function go(h){h=String(h).replace(/^#/,'');if(hashOf()===h){render()}else{location.hash=h}}
function homeOf(role){return {agent:'agent-home',mgmt:'mgmt-home',admin:'admin-home'}[role]||'login'}
/* stageClass: provided by bridge.ts */

function me(){return S.session?S.users.find(u=>u.id===S.session.userId):null}

/* ---- shell ---- */
const NAVS={
agent:[['agent-home','Home Dashboard','grid'],['agent-leads','My Leads','user'],['agent-catalogue','Project Catalogue','building'],['agent-bookings','Bookings','file'],['agent-cn','Convertible Notes','clip'],['agent-secondary','Secondary Market','store'],['agent-attendance','Attendance','cal'],['agent-performance','Performance','chart'],['agent-leaderboard','Leaderboard','trophy']],
mgmt:[['mgmt-home','Home Dashboard','grid'],['mgmt-leads','Team Leads','users'],['mgmt-activity','Team Activity','zap'],['mgmt-performance','Performance & MIS','chart'],['mgmt-assign','Lead Assignment','repeat'],['mgmt-projects','Projects','building'],['mgmt-bookings','Bookings','file'],['mgmt-secondary','Secondary Market','store'],['mgmt-attendance','Team Attendance','cal'],['mgmt-leave','Team Leave','clock']],
admin:[['admin-home','Home Dashboard','grid'],['admin-leads','Leads','user'],['admin-import','Lead Import','upload'],['admin-assign','Assignments','repeat'],['admin-review','Bookings Approval','file'],['admin-projects','Projects & Properties','building'],['admin-commission','Commission','percent'],['admin-cn','Convertible Notes','clip'],['admin-secondary','Secondary Market','store'],['admin-people','People & Teams','users'],['admin-hr','HR & Attendance','cal'],['admin-reports','Reports & MIS','chart'],['admin-audit','Audit Log','hist'],['admin-settings','Settings','cog']]};
const SBG={agent:{'agent-home':'Work','agent-attendance':'Me'},mgmt:{'mgmt-home':'Team','mgmt-projects':'Pipelines','mgmt-attendance':'People'},admin:{'admin-home':'Overview','admin-leads':'Leads','admin-review':'Deals and money','admin-people':'People','admin-reports':'Control'}};
const TABS={agent:[['agent-home','Home','grid'],['agent-leads','Leads','user'],['agent-catalogue','Projects','building'],['agent-bookings','Bookings','file']],mgmt:[['mgmt-home','Home','grid'],['mgmt-leads','Leads','users'],['mgmt-activity','Activity','zap'],['mgmt-bookings','Bookings','file']],admin:[['admin-home','Home','grid'],['admin-leads','Leads','user'],['admin-review','Review','file'],['admin-assign','Assign','repeat']]};
function badgeFor(k){if(!S.session)return '';const r=S.session.role;if(k==='admin-review'){const n=pendingReview().length;return n?`<span class="bdg red">${n}</span>`:''}if(k==='mgmt-leave'){const n=S.leave.filter(l=>l.status==='pending'&&teamOf(l.user)===me().team).length;return n?`<span class="bdg">${n}</span>`:''}if(k==='mgmt-leads'){const n=escalationsFor(me()).filter(e=>e.status==='open').length;return n?`<span class="bdg red">${n}</span>`:''}if(k==='agent-leads'&&r==='agent'){const n=myLeads(me().id).filter(l=>leadRisk(l).state==='risk').length;return n?`<span class="bdg red">${n}</span>`:''}return ''}
function navOf(d){return d.nav||d.key}
function sidebar(role,cur){const u=me();const G=SBG[role]||{};return `<aside class="side" aria-label="Main navigation"><a class="logo" href="#${homeOf(role)}" data-go="${homeOf(role)}" aria-label="Home">${LOGO}</a><nav class="nav">${NAVS[role].map(([k,l,i])=>`${G[k]?`<div class="sbg">${G[k]}</div>`:''}<a class="nl ${cur===k?'on':''}" href="#${k}" data-go="${k}" title="${esc(l)}">${ic(i,18)}<span>${l}</span>${badgeFor(k)}</a>`).join('')}</nav><div class="sbfoot"><a class="nl ${cur===role+'-notifications'?'on':''}" href="#${role}-notifications" data-go="${role}-notifications">${ic('bell',18)}<span>Notifications</span>${unreadCount()?`<span class="bdg">${unreadCount()}</span>`:''}</a>${role!=='admin'?`<a class="nl ${cur===role+'-settings'?'on':''}" href="#${role}-settings" data-go="${role}-settings">${ic('cog',18)}<span>Settings</span></a>`:''}</div><button type="button" class="me" data-open="account-menu" aria-label="Account menu">${av(u.name)}<span style="min-width:0;flex:1"><span class="b trunc" style="display:block">${esc(u.name)}</span><span class="faint xs trunc" style="display:block">${esc(roleLabel(u))}</span></span><span style="color:var(--tx3)">${ic('chevd',14)}</span></button></aside>`}
const roleLabel=u=>({admin:'Admin',mgmt:'Management',agent:'Agent'}[u.role])+(u.team?' · '+teamName(u.team):'');
function tabbar(role,cur){const t=TABS[role];return `<nav class="tabbar" aria-label="Primary">${t.map(([k,l,i])=>`<a href="#${k}" data-go="${k}" class="${cur===k?'on':''}">${ic(i,22)}<span>${l}</span></a>`).join('')}<button type="button" data-open="more-nav" aria-label="More">${ic('menu',22)}<span>More</span></button></nav>`}
function topbar(role,crumbs,d){const u=me();let pp=role!=='admin'?shiftWidget():'';
const RL={agent:'Agent',mgmt:'Management',admin:'Admin'}[role];
const cr=`<span class="rl">${RL}</span><span class="faint rl">${ic('chev',12)}</span>`+crumbs.map((c,i)=>i===crumbs.length-1?`<span class="cur">${esc(c.l)}</span>`:`<a href="#${c.go}" data-go="${c.go}">${esc(c.l)}</a><span class="faint">${ic('chev',12)}</span>`).join('');
const root=d&&d.level==='L1'&&(NAVS[role]||[]).some(n=>n[0]===d.key)||d&&d.key===homeOf(role);const up=crumbs.length>1?crumbs[crumbs.length-2].go:homeOf(role);
const lk={agent:'lq',mgmt:'mq2',admin:'alq'}[role],lr={agent:'agent-leads',mgmt:'mgmt-leads',admin:'admin-leads'}[role];
return `<header class="topbar ${root?'isroot':'isdeep'}"><button type="button" class="iconbtn burger" data-open="more-nav" aria-label="Menu">${ic('menu',20)}</button><a class="iconbtn appback" href="#${up}" data-go="${up}" aria-label="Back">${ic('back',20)}</a><a class="applogo" href="#${homeOf(role)}" data-go="${homeOf(role)}" aria-label="Home">${LOGO}</a><div class="crumbs">${cr}</div><span class="apptitle">${esc(crumbs[crumbs.length-1].l)}</span><span class="sp"></span><label class="tsearch">${ic('search',16)}<input type="search" placeholder="Search lead, phone or ID" aria-label="Search leads" data-tsearch="${lk}|${lr}"></label>${pp}<div style="position:relative"><button type="button" class="iconbtn bell" data-act="notif" aria-label="Notifications">${ic('bell',20)}${unreadCount()?`<span class="dot">${unreadCount()}</span>`:''}</button>${UI.notif?notifDD(role):''}</div><button type="button" class="appav" data-open="account-menu" aria-label="Account">${av(u.name,'sm')}</button></header>`}
/* global listener: handled in React (src/app/events.ts) */
function notifDD(role){const items=myNotifs().slice(0,6);return `<div class="dd" role="dialog" aria-label="Notifications"><div class="row sb" style="padding:12px 14px;border-bottom:1px solid var(--bd)"><span class="h3">Notifications</span><button class="btn lnk xs" type="button" data-act="readall">Mark all read</button></div>${items.length?items.map(n=>`<button type="button" class="ddi ${n.read?'':'un'}" data-act="notifgo|${n.id}"><span class="av sm">${ic(n.ic||'bell',13)}</span><span style="min-width:0"><span class="b" style="display:block;font-size:13px">${esc(n.t)}</span><span class="muted xs" style="display:block">${esc(n.d||'')}</span><span class="faint xs">${rel(n.at)}</span></span></button>`).join(''):empty('bell','All caught up','No notifications yet.')}<a class="ddi" style="justify-content:center;font-weight:600;color:var(--tx-brand)" href="#${role}-notifications" data-go="${role}-notifications">View all notifications</a></div>`}
function shell(role,d,params,inner){const crumbs=d.crumb?d.crumb(params):[{l:d.title}];const cur=navOf(d);return `<div class="shell">${sidebar(role,cur)}<div class="main">${topbar(role,crumbs,d)}<main class="page" id="page"><span class="devtag">${d.id} · ${d.level} · ${esc(hashOf())}</span>${unloggedBanner(role)}${inner}</main>${tabbar(role,cur)}</div></div>`}
/* unloggedBanner: replaced by a later definition */

/* ---- render ---- */
let lastKey=null;
/* render: provided by bridge.ts */

/* ---- overlay (modals / sheets / drawers / confirm) ---- */
/* renderOverlay: provided by bridge.ts */
/* openM: provided by bridge.ts */
/* closeM: provided by bridge.ts */
/* confirmM: provided by bridge.ts */
/* toast: provided by bridge.ts */
/* modalRerender: provided by bridge.ts */

/* ---- events ---- */

/* global listener: handled in React (src/app/events.ts) */
/* global listener: handled in React (src/app/events.ts) */
/* global listener: handled in React (src/app/events.ts) */
/* global listener: handled in React (src/app/events.ts) */
/* global listener: handled in React (src/app/events.ts) */
/* global listener: handled in React (src/app/events.ts) */

/* ---- dev inspector ---- */
/* inspector: provided by bridge.ts */

/* page-form helpers (state in UI.pf, survives re-render) */
const pfv=(k,d)=>UI.pf[k]!=null?UI.pf[k]:(d==null?'':d);

/* ===== seed data ===== */
let S;
function seed(){
const now=Date.parse('2026-10-28T10:10:00+04:00');
const M0=startOfDayAt(now);
const T=(h,m,d)=>M0+(d||0)*DAY+h*HR+(m||0)*MIN;      // today (or +d days) at hh:mm Dubai
let _s=7;const rnd=()=>{_s|=0;_s=_s+0x6D2B79F5|0;let t=Math.imul(_s^_s>>>15,1|_s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pick=a=>a[Math.floor(rnd()*a.length)];
const U=[
 {id:'u1',name:'Mohammad Aatif',role:'admin',emp:'AD-001',email:'aatif@durraniestates.com',phone:'+971 50 555 0100',status:'active'},
 {id:'u2',name:'Mohit Kapoor',role:'mgmt',emp:'MG-007',email:'mohit@durraniestates.com',phone:'+971 50 555 0101',team:'t1',status:'active'},
 {id:'u3',name:'Anil Verma',role:'mgmt',emp:'MG-011',email:'anil@durraniestates.com',phone:'+91 98100 11223',team:'t2',status:'active'},
 {id:'u10',name:'Archit Batham',role:'agent',emp:'AG-021',email:'archit@durraniestates.com',phone:'+971 50 700 2101',team:'t1',slab:'B',cap:40,status:'active',office:'Dubai'},
 {id:'u11',name:'Neha Sharma',role:'agent',emp:'AG-034',email:'neha@durraniestates.com',phone:'+971 50 700 2134',team:'t1',slab:'C',cap:40,status:'active',office:'Dubai'},
 {id:'u12',name:'Rahul Mehta',role:'agent',emp:'AG-018',email:'rahul@durraniestates.com',phone:'+971 50 700 2118',team:'t1',slab:'A',cap:19,status:'active',office:'Dubai'},
 {id:'u13',name:'Aarav Shah',role:'agent',emp:'AG-041',email:'aarav@durraniestates.com',phone:'+971 50 700 2141',team:'t1',slab:'A',cap:25,status:'active',office:'Dubai'},
 {id:'u14',name:'Priya Shah',role:'agent',emp:'AG-052',email:'priya@durraniestates.com',phone:'+971 50 700 2152',team:'t1',slab:'A',cap:25,status:'active',office:'Dubai'},
 {id:'u15',name:'Omar Ali',role:'agent',emp:'AG-029',email:'omar@durraniestates.com',phone:'+971 50 700 2129',team:'t1',slab:'B',cap:30,status:'active',office:'Dubai',tag:'Secondary'},
 {id:'u16',name:'Maya Patel',role:'agent',emp:'AG-063',email:'maya@durraniestates.com',phone:'+91 98200 44556',team:'t2',slab:'A',cap:30,status:'active',office:'Mumbai'},
 {id:'u17',name:'Imran Sheikh',role:'agent',emp:'AG-070',email:'imran@durraniestates.com',phone:'+91 98200 44570',team:'t2',slab:null,cap:30,status:'invited',office:'Mumbai'}
];
const TEAMS=[{id:'t1',name:'Dubai Sales',office:'Dubai',region:'UAE',mgr:'u2'},{id:'t2',name:'Mumbai Sales',office:'Mumbai',region:'India',mgr:'u3'}];
const SLABS=[{id:'A',name:'Slab A',rate:25,from:0},{id:'B',name:'Slab B',rate:30,from:3000000},{id:'C',name:'Slab C',rate:35,from:6000000}];
const PROJ=[
 {id:'p1',name:'Marina Views',dev:'Azure Crest Developments',city:'Dubai',country:'UAE',area:'Dubai Marina',type:'Apartment',status:'Near completion',ho:'Q2 2027',plan:'60/40, 1% monthly post-handover for 5 years',comm:4,relPct:30,from:800000,to:3500000,rera:'RERA-2231',desc:'Contemporary marina-side living with glass balconies and direct access to the promenade.',amen:['Marina walk access','Rooftop lounge','Co-working space','Smart home'],img:1,pri:true,active:true,upd:['u1',T(9,0,-3)],
  units:[['U-1204','2 Bedroom',1050,1200000,'Sold'],['U-3102','1 Bedroom',720,1150000,'Held'],['U-3105','Studio',450,800000,'Available'],['U-3108','1 Bedroom',735,1180000,'Available'],['U-4201','2 Bedroom',1060,1750000,'Available'],['U-4204','3 Bedroom',1620,3400000,'Available']]},
 {id:'p2',name:'Palm Residences',dev:'Palmline Properties',city:'Dubai',country:'UAE',area:'Palm Jumeirah',type:'Apartment',status:'Under construction',ho:'Q4 2028',plan:'50/50, handover plan',comm:5,relPct:30,from:1900000,to:9800000,rera:'RERA-2480',desc:'Beachfront residences on the Palm with private beach access.',amen:['Private beach','Infinity pool','Concierge','Spa'],img:2,active:true,upd:['u1',T(8,30,-7)],
  units:[['U-4101','2 Bedroom',1180,2400000,'Booked'],['U-4102','2 Bedroom',1190,2450000,'Available'],['U-4103','2 Bedroom',1195,2400000,'Available'],['U-5201','3 Bedroom',1900,4600000,'Available'],['U-6001','Penthouse',3400,9800000,'Available']]},
 {id:'p3',name:'Durrani Towers',dev:'Durrani Developments',city:'Dubai',country:'UAE',area:'Business Bay',type:'Apartment',status:'Under construction',ho:'Q1 2028',plan:'70/30, 2% monthly during construction',comm:3.5,relPct:25,from:800000,to:2100000,rera:'RERA-2299',desc:'Mid-rise tower beside the canal with co-working floors.',amen:['Canal view','Gym','Co-working','Kids play area'],img:3,active:true,upd:['u1',T(9,0,-1)],
  units:[['U-2001','Studio',450,800000,'Available'],['U-2002','1 Bedroom',720,1150000,'Available'],['U-2003','2 Bedroom',1050,1750000,'Booked'],['U-2004','2 Bedroom',1080,1800000,'Available']]},
 {id:'p4',name:'Creekside Villas',dev:'Azure Crest Developments',city:'Dubai',country:'UAE',area:'Dubai Creek Harbour',type:'Villa',status:'Launched',ho:'Q3 2029',plan:'80/20, post-handover 3 years',comm:4.5,relPct:30,from:3200000,to:7400000,rera:'RERA-2551',desc:'Low-rise villas facing the creek with private gardens.',amen:['Private garden','Community park','Marina'],img:4,active:true,upd:['u1',T(9,0,-10)],
  units:[['V-101','3 Bedroom Villa',2900,3200000,'Available'],['V-102','4 Bedroom Villa',3600,4400000,'Available'],['V-103','4 Bedroom Villa',3650,4500000,'Available']]},
 {id:'p5',name:'Azure Heights',dev:'Azure Crest Developments',city:'Dubai',country:'UAE',area:'JVC',type:'Apartment',status:'Pre-launch',ho:'Q2 2029',plan:'10/90, post-handover',comm:4,relPct:30,from:600000,to:1500000,rera:'RERA-2610',desc:'Affordable studios and 1BR units, pre-launch pricing.',amen:['Pool','Gym','Retail podium'],img:5,active:true,upd:['u1',T(9,0,-20)],
  units:[['U-801','Studio',420,600000,'Available'],['U-802','1 Bedroom',700,900000,'Available']]}
];
PROJ.forEach(p=>{p.units=p.units.map(u=>({id:u[0],type:u[1],size:u[2],price:u[3],status:u[4],holdBy:null,holdUntil:null,bk:null}))});
PROJ[0].units[1].holdBy='u10';PROJ[0].units[1].holdUntil=T(10,0,1);PROJ[0].units[1].bk='BKG-10021';
PROJ[1].units[0].bk='BKG-10018';PROJ[2].units[2].bk='BKG-10014';PROJ[2].units[2].status='Held';PROJ[2].units[2].holdBy='u11';PROJ[2].units[2].holdUntil=T(10,0,1);
const CAMP=['Meta · Marina Views Sept','Google Ads · Palm Crest Launch','Instagram · Creekside Oct','Bulk upload · Expo lead list','Cold data · KSA batch','Referral · Existing client'];
const SRC={'Meta · Marina Views Sept':'Meta Leads','Google Ads · Palm Crest Launch':'Google Ads','Instagram · Creekside Oct':'Instagram','Bulk upload · Expo lead list':'Bulk upload','Cold data · KSA batch':'Cold data','Referral · Existing client':'Referral'};
const FN=['Rahul','Fatima','Sanjay','Wei','Imran','Priya','Omar','Neha','Kabir','Sara','Vikram','Leila','Arjun','Hira','Dev','Noor','Aditya','Meera','Tariq','Zoya','Harsh','Amira','Rohan','Layla','Nikhil','Yusuf'];
const LN=['Menon','Al Zahra','Kapoor','Tan','Sheikh','Desai','Khan','Iyer','Malik','Nair','Reddy','Haddad','Joshi','Rao','Qureshi','Bose','Hussain','Das','Verma','Chopra'];
const CTRY={UAE:{c:['Dubai','Sharjah','Abu Dhabi'],p:()=>'+971 5'+pick(['0','5','4'])+' '+(100+Math.floor(rnd()*899))+' '+(1000+Math.floor(rnd()*8999)),cur:'AED'},India:{c:['Mumbai','Delhi','Bengaluru','Hyderabad'],p:()=>'+91 9'+(1000+Math.floor(rnd()*8999))+' '+(10000+Math.floor(rnd()*89999)),cur:'INR'},Singapore:{c:['Singapore'],p:()=>'+65 9'+(100+Math.floor(rnd()*899))+' '+(1000+Math.floor(rnd()*8999)),cur:'AED'},KSA:{c:['Riyadh','Jeddah'],p:()=>'+966 5'+(1+Math.floor(rnd()*8))+' '+(100+Math.floor(rnd()*899))+' '+(1000+Math.floor(rnd()*8999)),cur:'AED'}};
const used=new Set();
function L(o){
 const c=o.country||pick(['UAE','UAE','UAE','India','India','Singapore','KSA']);const cd=CTRY[c];
 const name=o.name||(()=>{let n;do{n=pick(FN)+' '+pick(LN)}while(used.has(n));return n})();used.add(name);
 const camp=o.camp||pick(CAMP);
 const l=Object.assign({id:o.id,name,phone:o.phone||cd.p(),email:name.toLowerCase().replace(/[^a-z]+/g,'.')+'@example.com',country:c,city:o.city||pick(cd.c),src:SRC[camp],camp,dir:camp.startsWith('Cold')||camp.startsWith('Referral')?'Outbound':'Inbound',cur:o.cur||cd.cur,track:null,temp:null,disp:null,stage:'New',owner:null,assigned:null,lastCommit:null,hold:null,esc:null,budget:null,ptype:null,timeline:null,payment:null,purpose:null,visa:null,arabic:false,linked:null,attempts:0,qualified:false,shortlist:[],next:null,own:[],ev:[],calls:[],meets:[],docs:[],archived:false,dnd:false,wrong:false,created:o.created||T(9,0,-30)},o);
 l.name=name;return l}
const leads=[];
const add=l=>{leads.push(l);return l};
const ev=(l,t,k,txt,by,x)=>{l.ev.push(Object.assign({t,k,txt,by:by||l.owner,x:x||{}},{}));};
/* ---- Archit (u10) featured ---- */
let l;
l=add(L({id:'1023',name:'Mayank Singh',country:'UAE',city:'Dubai',phone:'+971 50 123 4567',camp:'Meta · Marina Views Sept',track:'property',temp:'cold',disp:'Meeting fixed',stage:'Shortlisted',owner:'u10',assigned:T(9,0,-28),lastCommit:T(9,0,-2),budget:[1200000,1800000],ptype:'Off-plan apartment',timeline:'3 to 6 months',payment:'Mortgage',purpose:'Investment',visa:'Interested',qualified:true,attempts:4,shortlist:[{p:'p1',primary:true}],next:{type:'Meeting',at:T(9,30),done:false,note:'Marina Views sales gallery visit'},created:T(9,0,-30)}));
l.own=[{from:null,to:'u10',reason:'Initial assignment from Admin pool',by:'u1',at:T(9,0,-28)}];
ev(l,T(9,0,-28),'owner','Assigned to Archit Batham by Mohammad Aatif','u1');
ev(l,T(11,20,-27),'call','Call: Not answering',null,{res:'Not answering'});
ev(l,T(16,5,-25),'call','Call: Connected 6 min. Interested, asked for payment plans',null,{res:'Connected'});
ev(l,T(16,12,-25),'wa','WhatsApp sent: Marina Views brochure and payment plan');
ev(l,T(12,30,-9),'call','Call: Connected 9 min. Wants to see the gallery. Meeting fixed',null,{res:'Connected'});
ev(l,T(12,40,-9),'stage','Stage changed: Qualified, then Shortlisted (Marina Views)');
ev(l,T(14,0,-2),'meet','Meeting scheduled: Marina Views sales gallery, today 09:30');
l.calls=[{id:'c1',t:T(11,20,-27),res:'Not answering',dur:0},{id:'c2',t:T(16,5,-25),res:'Connected',disp:'Interested',temp:'warm',dur:6,est:6},{id:'c3',t:T(12,30,-9),res:'Connected',disp:'Meeting fixed',temp:'cold',dur:9,est:8,note:'Wants to see the gallery before choosing a unit.'}];
l.meets=[{id:'m1',at:T(9,30),kind:'in-person',place:'Marina Views sales gallery',status:'scheduled',token:null}];
l.docs=[{id:'d1',name:'Emirates ID (front).jpg',kind:'Emirates ID',cat:'client',by:'u10',at:T(10,0,-8)},{id:'d2',name:'ENBD statement Aug-Sep.pdf',kind:'Bank statement',cat:'finance',by:'u10',at:T(12,10,-6)},{id:'d3',name:'Marina Views 1204 offer.pdf',kind:'Offer letter',cat:'property',by:'u10',at:T(15,30,-3)}];
const PL=[['1031','Mohammed Faisal','UAE','Sharjah','+971 50 412 7789','hot','Meeting fixed','Qualified','property',T(15,0,0),'Meeting',true],['1032','Priya Menon','India','Bengaluru','+91 98450 22136','warm','Follow up','Contacted','property',T(14,0,0),'Follow-up',false],['1034','Abdullah Al Harbi','KSA','Riyadh','+966 55 218 9034','warm','Follow up','Contacted','property',T(17,15,0),'Follow-up',true],['1035','Karan Malhotra','India','Delhi','+91 98110 55021','warm','Follow up','Contacted','property',T(10,0,-9),'Follow-up',false]];
PL.forEach(p=>{const x=add(L({id:p[0],name:p[1],country:p[2],city:p[3],phone:p[4],temp:p[5],disp:p[6],stage:p[7],track:p[8],owner:'u10',assigned:T(9,0,-20),lastCommit:p[0]==='1035'?T(10,0,-9):T(10,0,-3),arabic:p[11],attempts:3,next:{type:p[10],at:p[9],done:false,note:''},camp:p[0]==='1034'?'Cold data · KSA batch':'Meta · Marina Views Sept'}));x.own=[{from:null,to:'u10',reason:'Initial assignment from Admin pool',by:'u1',at:T(9,0,-20)}];ev(x,T(9,0,-20),'owner','Assigned to Archit Batham by Mohammad Aatif','u1');ev(x,T(12,0,-10),'call','Call: Connected 5 min',null,{res:'Connected'});x.calls=[{id:'c0'+p[0],t:T(12,0,-10),res:'Connected',disp:p[6],temp:p[5],dur:5,est:5}]});
const L1031=leads.find(x=>x.id==='1031');L1031.qualified=true;L1031.budget=[2500000,3600000];L1031.stage='Qualified';L1031.cur='AED';L1031.meets=[{id:'m2',at:T(15,0),kind:'in-person',place:'Creekside Villas sales centre',status:'scheduled',token:null},{id:'m3',at:T(11,0,-1),kind:'in-person',place:'Palm Residences gallery',status:'done',token:'k7m2xq'}];L1031.shortlist=[{p:'p4',primary:true}];L1031.next={type:'Meeting',at:T(15,0),done:false,note:'Creekside Villas sales centre'};
const L1034=leads.find(x=>x.id==='1034');L1034.linked='1019';L1034.ev.push({t:T(9,5,-20),k:'sys',txt:'Created as linked lead: same number as LEAD-1019 (Palm Crest Launch), different campaign',by:null,x:{}});
const L1035=leads.find(x=>x.id==='1035');
const L1032=leads.find(x=>x.id==='1032');L1032.cur='INR';L1032.budget=[8000000,12000000];L1032.meets=[{id:'mv',at:T(11,0,-1),kind:'virtual',place:'Google Meet',status:'done',token:'virt01'}];
/* booking leads */
l=add(L({id:'2045',name:'Sarah Johnson',country:'UAE',city:'Dubai',phone:'+971 55 210 4488',temp:'warm',disp:'Interested',stage:'Booking submitted',track:'property',owner:'u10',assigned:T(9,0,-30),lastCommit:T(11,0,-2),budget:[750000,1300000],ptype:'Off-plan apartment',timeline:'0 to 3 months',payment:'Cash',purpose:'Own use',visa:'Not needed',qualified:true,attempts:6,shortlist:[{p:'p1',primary:true}],camp:'Meta · Marina Views Sept'}));
l.own=[{from:null,to:'u10',reason:'Initial assignment from Admin pool',by:'u1',at:T(9,0,-30)}];ev(l,T(12,0,-4),'call','Call: Connected 11 min. Ready to book 1BR',null);ev(l,T(15,0,-3),'doc','Booking BKG-10021 submitted for Admin review (U-3102, AED 1,150,000)');
l=add(L({id:'2047',name:'Emma Wilson',country:'UAE',city:'Dubai',phone:'+971 52 665 0192',temp:'cold',disp:'Follow up',stage:'Qualified',track:'cn',owner:'u10',assigned:T(9,0,-15),lastCommit:T(9,0,-4),budget:[800000,1000000],qualified:true,attempts:3,cur:'AED',next:{type:'Follow-up',at:T(11,30),done:false,note:'Discuss 36-month schedule'},camp:'Referral · Existing client'}));
l.cn={stage:'Qualified',amount:920000,cur:'AED',tenure:36,freq:'Monthly'};l.own=[{from:null,to:'u10',reason:'Initial assignment from Admin pool',by:'u1',at:T(9,0,-15)}];ev(l,T(10,0,-8),'call','Call: Connected 8 min. Interested in fixed-return product',null);
l=add(L({id:'2048',name:'John Doe',country:'UAE',city:'Dubai',phone:'+971 50 998 1177',temp:'warm',disp:'Meeting fixed',stage:'Qualified',track:'secondary',owner:'u10',assigned:T(9,0,-18),lastCommit:T(9,0,-3),budget:[2000000,8000000],qualified:true,attempts:5,next:{type:'Meeting',at:T(14,30,1),done:false,note:'Viewing in Dubai Hills'}}));
l.own=[{from:null,to:'u10',reason:'Initial assignment from Admin pool',by:'u1',at:T(9,0,-18)}];ev(l,T(13,0,-6),'stage','Routed to Secondary Market: buyer wants ready-to-move (request SM-101)');
l=add(L({id:'2049',name:'Lisa Ray',country:'UAE',city:'Dubai',phone:'+971 56 330 7765',temp:'hot',disp:'Interested',stage:'Qualified',track:'cn',owner:'u10',assigned:T(9,0,-22),lastCommit:T(9,0,-1),budget:[1000000,1500000],qualified:true,attempts:7,cur:'AED',camp:'Meta · Marina Views Sept'}));
l.cn={stage:'Admin review',amount:1200000,cur:'AED',tenure:36,freq:'Monthly',kyc:true,nominee:true,bank:true,agreement:true,pdc:true,receipt:true,adminState:'pending',submitted:T(11,0,-1)};l.own=[{from:null,to:'u10',reason:'Initial assignment from Admin pool',by:'u1',at:T(9,0,-22)}];ev(l,T(11,0,-1),'doc','Convertible Note application submitted for Admin review (AED 1,200,000)');
l=add(L({id:'2050',name:'David Chen',country:'Singapore',city:'Singapore',phone:'+65 9123 4478',temp:'warm',disp:'Follow up',stage:'Qualified',track:'cn',owner:'u10',assigned:T(9,0,-12),lastCommit:T(9,0,-2),budget:[1800000,2200000],qualified:true,attempts:4,cur:'AED',next:{type:'Follow-up',at:T(16,0),done:false,note:'Waiting for decision'}}));
l.cn={stage:'Information shared',amount:2000000,cur:'AED',tenure:36,freq:'Monthly'};l.own=[{from:null,to:'u10',reason:'Initial assignment from Admin pool',by:'u1',at:T(9,0,-12)}];ev(l,T(11,0,-2),'wa','WhatsApp sent: payout schedule (AED 2,000,000, 36 months)');
l=add(L({id:'1033',name:'Wei Ling Tan',country:'Singapore',city:'Singapore',phone:'+65 9188 3321',temp:'warm',disp:'Interested',stage:'Qualified',track:'cn',owner:'u10',assigned:T(9,0,-14),lastCommit:T(9,0,-3),budget:[2500000,2500000],qualified:true,attempts:5,cur:'INR'}));
l.cn={stage:'Interested',amount:2500000,cur:'INR',tenure:36,freq:'Monthly'};l.own=[{from:null,to:'u10',reason:'Initial assignment from Admin pool',by:'u1',at:T(9,0,-14)}];
l=add(L({id:'1036',name:'Imran Khan',country:'UAE',city:'Dubai',phone:'+971 54 770 1020',temp:'warm',disp:'Interested',stage:'Qualified',track:'property',owner:'u10',assigned:T(9,0,-26),lastCommit:T(9,0,-4),budget:[1100000,1400000],qualified:true,attempts:5,shortlist:[{p:'p2',primary:true}]}));l.own=[{from:null,to:'u10',reason:'Initial assignment from Admin pool',by:'u1',at:T(9,0,-26)}];ev(l,T(9,0,-6),'doc','Booking BKG-10009 returned: Rejected by Admin (developer form not signed)');
/* Archit's generated leads (to 24) */
const gen=(owner,n,start,opt)=>{for(let i=0;i<n;i++){const hotN=opt.hot||0;const x=add(L({id:String(start+i),owner,assigned:T(9,0,-(5+Math.floor(rnd()*20))),track:'property'}));x.own=[{from:null,to:owner,reason:'Initial assignment from Admin pool',by:'u1',at:x.assigned}];const k=i;x.temp=k<hotN?'hot':k<hotN+Math.ceil((n-hotN)*.55)?'warm':'cold';x.attempts=1+Math.floor(rnd()*4);x.disp=pick(['Follow up','Follow up','Interested','Meeting fixed']);x.stage=pick(['Contacted','Contacted','Qualified']);x.lastCommit=T(9,0,-Math.floor(rnd()*6));x.budget=[800000+Math.floor(rnd()*6)*100000,1500000+Math.floor(rnd()*8)*250000];x.qualified=x.stage==='Qualified';ev(x,x.assigned,'owner','Assigned by Mohammad Aatif','u1');ev(x,x.assigned+2*HR,'call','Call: Connected 4 min',owner,{res:'Connected'});x.calls=[{id:'g'+x.id,t:x.assigned+2*HR,res:'Connected',disp:x.disp,temp:x.temp,dur:4,est:4}];}};
gen('u10',13,1101,{hot:5});
/* approved counts: Archit hot 9 -> 1031 hot + 1101..1105 hot + 2? */
leads.find(x=>x.id==='2049').temp='hot';leads.find(x=>x.id==='1031').temp='hot';leads.find(x=>x.id==='2045').temp='hot';leads.find(x=>x.id==='1033').temp='hot';
/* at-risk for Archit: 1035 (grace 1 day left) + 3 generated */
const arch=leads.filter(x=>x.owner==='u10');
[['1101',9],['1102',8],['1103',9]].forEach(([id,d])=>{const x=leads.find(y=>y.id===id);x.lastCommit=T(9,0,-d);x.next=null;x.disp='Follow up';x.temp=x.temp==='hot'?'warm':x.temp});
leads.find(x=>x.id==='1104').hold={by:'u2',reason:'Buyer travelling until 5 Nov, agreed with manager',at:T(10,0,-4)};leads.find(x=>x.id==='1104').lastCommit=T(9,0,-10);
/* schedule: today follow-ups (8, 3 done), overdue 4, upcoming */
const sched=[['1106','Follow-up',T(9,0),true],['1107','Follow-up',T(9,45),true],['1108','Follow-up',T(8,30),true],['1109','Follow-up',T(12,0),false],['1110','Follow-up',T(13,30),false],['1111','Follow-up',T(18,0),false],['1112','Follow-up',T(18,45),false],['1113','Follow-up',T(10,0,-1),false],['1105','Follow-up',T(15,0,-1),false],['1102','Follow-up',T(11,0,-3),false],['1103','Follow-up',T(14,0,-5),false]];
sched.forEach(([id,k,at,done])=>{const x=leads.find(y=>y.id===id);if(!x)return;x.next={type:k,at,done,note:''};if(done){x.lastCommit=T(9,0)}else if(at>=M0){x.lastCommit=T(9,0,-2)}});
leads.find(x=>x.id==='1102').next={type:'Follow-up',at:T(11,0,-3),done:false,note:''};
leads.find(x=>x.id==='1103').next={type:'Follow-up',at:T(14,0,-5),done:false,note:''};
/* 1035 Karan: overdue + at risk. 1101 no next. */
/* ---- Neha u11 (31 leads), Rahul u12 (19), Aarav u13 (14), Priya u14 (6), Omar u15 (9), Maya u16 (12) ---- */
gen('u11',31,3001,{hot:10});gen('u12',18,4001,{hot:4});gen('u13',14,5001,{hot:3});gen('u14',6,6001,{hot:1});gen('u15',9,7001,{hot:2});gen('u16',12,8001,{hot:3});
const spread=(owner,ids)=>ids.forEach((id,i)=>{const x=leads.find(y=>y.id===id);x.next={type:i%3===0?'Meeting':'Follow-up',at:i<3?T(11+i,0):T(10,0,-(1+i%3)),done:false,note:''}});
spread('u11',['3001','3002','3003','3004','3005']);spread('u12',['4001','4002','4003']);spread('u13',['5001','5002']);
/* featured others */
const pk=(id,o)=>Object.assign(leads.find(x=>x.id===id),o);
pk('3010',{name:'Karim Haddad',country:'UAE',city:'Dubai',phone:'+971 55 441 9023',temp:'warm',disp:'Interested',stage:'Booking submitted',qualified:true});
pk('4010',{name:'Ali Ahmed',country:'UAE',city:'Dubai',phone:'+971 50 312 7788',temp:'hot',disp:'Interested',stage:'Pending',qualified:true,budget:[2200000,2600000]});
/* pool: unassigned, 42 leads */
for(let i=0;i<42;i++){const x=add(L({id:String(9001+i),camp:pick(CAMP)}));x.created=T(8,0,-Math.floor(rnd()*3));x.stage='New'}
['9003','9007'].forEach(id=>{const x=leads.find(y=>y.id===id);x.camp='Cold data · KSA batch';x.country='KSA';x.arabic=true;x.cur='AED'});
leads.find(x=>x.id==='9005').linked='1031';leads.find(x=>x.id==='9005').phone='+971 50 412 7789';leads.find(x=>x.id==='9005').name='Mohammed Faisal';
/* returned-to-pool example */
const rp=leads.find(x=>x.id==='9010');rp.name='Hamza Rauf';rp.own=[{from:'u13',to:null,reason:'Auto-returned: no forward commitment for 10 days',by:'system',at:T(9,0,-1)},{from:null,to:'u13',reason:'Initial assignment',by:'u1',at:T(9,0,-16)}];ev(rp,T(9,0,-1),'owner','Returned to Admin pool automatically: no forward commitment for 10 days','system');
/* DND / wrong / archived */
const dn=add(L({id:'1201',name:'Vikram Joshi',owner:null,dnd:true,archived:true,disp:'DND',stage:'Lost',phone:'+971 50 889 2310'}));dn.dndBy='u10';dn.dndAt=T(10,0,-6);
const wr=add(L({id:'1202',name:'Zoya Hussain',owner:null,wrong:true,archived:true,disp:'Wrong number',stage:'Lost',phone:'+971 55 000 1122'}));
const ni=add(L({id:'1203',name:'Tariq Malik',owner:'u10',archived:true,disp:'Not interested',stage:'Lost',temp:'cold',phone:'+971 54 301 7788',assigned:T(9,0,-30),lastCommit:T(9,0,-12)}));ni.own=[{from:null,to:'u10',reason:'Initial assignment',by:'u1',at:T(9,0,-30)}];ni.archReason='Already bought elsewhere';
/* escalation */
leads.find(x=>x.id==='2045').esc={reason:'Buyer asking for a 2% discount on U-3102. Needs manager approval.',at:T(9,30,-1),status:'open',by:'u10'};
leads.find(x=>x.id==='3002').esc={reason:'Client wants payment plan extension beyond developer standard.',at:T(11,0,-2),status:'open',by:'u11'};
leads.find(x=>x.id==='3010').esc={reason:'Request to waive admin fee.',at:T(11,0,-6),status:'resolved',by:'u11',resp:'Admin fee cannot be waived. Offer free furnishing pack instead.',resAt:T(9,0,-5)};
/* ---- bookings ---- */
const D=(s)=>({s,name:s==='missing'?null:'file.pdf',at:s==='missing'?null:T(10,0,-2)});
const bk=(id,o)=>Object.assign({id,lead:null,agent:null,project:'p1',unit:null,type:'1 Bedroom',price:0,cur:'AED',plan:'60/40',depAmt:0,depMode:'Bank transfer',offer:'',notes:'',status:'pending',reason:'',docs:{form:D('uploaded'),receipt:D('uploaded'),spa:D('missing'),dld:D('missing'),oqood:D('missing')},spaIssued:null,submitted:T(9,0,-3),hist:[],miles:[],paidPct:0,devInv:null,devRec:null,incRel:null,adj:0,adjNote:'',holdUntil:null},o);
const bks=[
 bk('BKG-10021',{lead:'2045',agent:'u10',project:'p1',unit:'U-3102',price:1150000,depAmt:115000,offer:'Quoted best price AED 1,150,000, free furnishing pack requested',hist:[['Submitted for Admin review','u10',T(15,0,-3)]],submitted:T(15,0,-3),holdUntil:T(10,0,1)}),
 bk('BKG-10018',{lead:'4010',agent:'u12',project:'p2',unit:'U-4101',type:'2 Bedroom',price:2400000,depAmt:240000,plan:'50/50',status:'approved',submitted:T(10,0,-12),spaIssued:T(10,0,-6),docs:{form:D('approved'),receipt:D('approved'),spa:D('uploaded'),dld:D('missing'),oqood:D('missing')},hist:[['Submitted for Admin review','u12',T(10,0,-12)],['Approved by Admin. Deal status: PENDING','u1',T(11,0,-11)],['SPA issued by developer','u12',T(10,0,-6)],['Signed SPA uploaded','u12',T(10,0,-2)]]}),
 bk('BKG-10014',{lead:'3010',agent:'u11',project:'p3',unit:'U-2003',type:'2 Bedroom',price:1750000,depAmt:175000,plan:'70/30',status:'changes',reason:'Deposit receipt is unreadable. Upload a clear copy and confirm the transfer date.',submitted:T(10,0,-5),holdUntil:T(10,0,1),docs:{form:D('approved'),receipt:{s:'rejected',name:'receipt.jpg',at:T(10,0,-5)},spa:D('missing'),dld:D('missing'),oqood:D('missing')},hist:[['Submitted for Admin review','u11',T(10,0,-5)],['Changes requested by Admin','u1',T(12,0,-4)]]}),
 bk('BKG-10009',{lead:'1036',agent:'u10',project:'p2',unit:'U-4102',type:'2 Bedroom',price:1200000,depAmt:120000,plan:'50/50',status:'rejected',reason:'Developer booking form is not signed by the buyer. Resubmit as a new booking once signed.',submitted:T(10,0,-8),docs:{form:{s:'rejected',name:'form.pdf',at:T(10,0,-8)},receipt:D('uploaded'),spa:D('missing'),dld:D('missing'),oqood:D('missing')},hist:[['Submitted for Admin review','u10',T(10,0,-8)],['Rejected by Admin','u1',T(11,0,-6)],['Unit U-4102 released','system',T(11,0,-6)]]}),
 bk('BKG-10002',{lead:'1205',agent:'u10',project:'p1',unit:'U-1204',type:'2 Bedroom',price:1200000,depAmt:120000,status:'closed',submitted:T(10,0,-25),spaIssued:T(10,0,-22),paidPct:35,devInv:T(10,0,-6),devRec:T(10,0,-3),incRel:T(10,0,-2),docs:{form:D('approved'),receipt:D('approved'),spa:D('approved'),dld:D('approved'),oqood:D('approved')},hist:[['Closed after Admin approved all documents','u1',T(10,0,-8)]]}),
 bk('BKG-10005',{lead:'1206',agent:'u10',project:'p3',unit:'U-2002',type:'1 Bedroom',price:950000,depAmt:95000,plan:'70/30',status:'approved',submitted:T(10,0,-14),spaIssued:T(10,0,-9),paidPct:12,docs:{form:D('approved'),receipt:D('approved'),spa:D('approved'),dld:D('uploaded'),oqood:D('missing')},hist:[['Approved by Admin. Deal status: PENDING','u1',T(11,0,-13)]]}),
 bk('BKG-10007',{lead:'1207',agent:'u10',project:'p1',unit:'U-3108',type:'1 Bedroom',price:950000,depAmt:95000,status:'approved',submitted:T(10,0,-9),spaIssued:T(10,0,-4),paidPct:10,docs:{form:D('approved'),receipt:D('approved'),spa:D('missing'),dld:D('missing'),oqood:D('missing')},hist:[['Approved by Admin. Deal status: PENDING','u1',T(11,0,-8)]]}),
 bk('BKG-10003',{lead:'3501',agent:'u11',project:'p2',unit:'U-5201',type:'3 Bedroom',price:2100000,depAmt:210000,plan:'50/50',status:'closed',submitted:T(10,0,-26),spaIssued:T(10,0,-23),paidPct:40,devInv:T(10,0,-10),devRec:null,docs:{form:D('approved'),receipt:D('approved'),spa:D('approved'),dld:D('approved'),oqood:D('approved')},hist:[['Closed after Admin approved all documents','u1',T(10,0,-9)]]}),
 bk('BKG-10006',{lead:'3502',agent:'u11',project:'p4',unit:'V-101',type:'3 Bedroom Villa',price:2200000,depAmt:220000,plan:'80/20',status:'closed',submitted:T(10,0,-20),spaIssued:T(10,0,-17),paidPct:22,devInv:null,docs:{form:D('approved'),receipt:D('approved'),spa:D('approved'),dld:D('approved'),oqood:D('approved')},hist:[['Closed after Admin approved all documents','u1',T(10,0,-5)]]}),
 bk('BKG-10004',{lead:'4501',agent:'u12',project:'p2',unit:'U-4103',type:'2 Bedroom',price:2400000,depAmt:240000,plan:'50/50',status:'approved',submitted:T(10,0,-15),spaIssued:T(10,0,-10),paidPct:20,docs:{form:D('approved'),receipt:D('approved'),spa:D('approved'),dld:D('uploaded'),oqood:D('missing')},hist:[['Approved by Admin. Deal status: PENDING','u1',T(11,0,-14)]]}),
 bk('BKG-10008',{lead:'5501',agent:'u13',project:'p5',unit:'U-802',type:'1 Bedroom',price:980000,depAmt:98000,plan:'10/90',status:'approved',submitted:T(10,0,-10),paidPct:10,docs:{form:D('approved'),receipt:D('approved'),spa:D('missing'),dld:D('missing'),oqood:D('missing')},hist:[['Approved by Admin. Deal status: PENDING','u1',T(11,0,-9)]]})
];
/* give booking-only leads a minimal record (owned, closed stage) */
const bl=[['1205','Nadia Karim','u10','Closed'],['1206','Fahad Aziz','u10','Pending'],['1207','Hina Qureshi','u10','Pending'],['3501','Rashid Mansoor','u11','Closed'],['3502','Sunita Rao','u11','Closed'],['4501','Dev Malhotra','u12','Pending'],['5501','Kiran Bose','u13','Pending']];
bl.forEach(([id,name,owner,stg])=>{const x=add(L({id,name,owner,stage:stg,track:'property',temp:'hot',disp:'Interested',qualified:true,assigned:T(9,0,-40),lastCommit:T(9,0,-5),attempts:8,country:'UAE',city:'Dubai',budget:[900000,2500000]}));x.own=[{from:null,to:owner,reason:'Initial assignment',by:'u1',at:T(9,0,-40)}];});
leads.find(x=>x.id==='3010').stage='Booking submitted';leads.find(x=>x.id==='4010').stage='Pending';
/* milestones for closed */
bks.forEach(b=>{const tot=b.price;const pl=b.plan==='50/50'?[['Booking deposit',10],['On SPA signing',10],['Construction 25%',10],['Construction 50%',20],['Handover',50]]:b.plan==='80/20'?[['Booking deposit',10],['On SPA signing',10],['Construction 40%',30],['Construction 80%',30],['Handover',20]]:[['Booking deposit',10],['On SPA signing',10],['Construction 30%',20],['Construction 60%',20],['Handover',40]];let acc=0;b.miles=pl.map(([n,p],i)=>{acc+=p;const paid=acc<=b.paidPct||(b.paidPct>0&&i===0);return{n,pct:p,amt:Math.round(tot*p/100),due:T(10,0,i*30-20),paid:paid&&acc<=Math.max(b.paidPct,10),paidAt:paid?T(10,0,i*30-18):null}})});
/* ---- CN notes ---- */
const notes=[
 {id:'CN-2026-0041',client:'DE-C-0192',lead:null,name:'Rajesh Nair',agent:'u10',principal:2500000,cur:'INR',tenure:36,rate:1.5,freq:'Monthly',start:T(10,0,-80),status:'active',payouts:[],pdc:[]},
 {id:'CN-2026-0040',client:'DE-C-0191',lead:null,name:'Samira Al Qassimi',agent:'u11',principal:400000,cur:'AED',tenure:36,rate:1.5,freq:'Monthly',start:T(10,0,-100),status:'active',payouts:[],pdc:[]}];
notes.forEach((n,k)=>{const m=Math.round(n.principal*n.rate/100);for(let i=1;i<=n.tenure;i++){const due=n.start+i*30*DAY;n.payouts.push({n:i,due,amt:m,status:due<=now-2*DAY?'paid':due<=now?'due':'upcoming',ref:due<=now-2*DAY?'TXN'+(880000+i*7+k*91):null,at:due<=now-2*DAY?due:null});n.pdc.push({no:'PDC-'+(104400+i+k*100),bank:k?'Emirates NBD':'HDFC Bank',due,amt:m,status:due<=now-2*DAY?'cleared':'held'})}});
const n40=notes[1];const bp=n40.payouts.filter(p=>p.status==='paid').pop();if(bp){bp.status='bounced';bp.ref=null;n40.pdc[bp.n-1].status='bounced'}
/* ---- secondary ---- */
const sec=[
 {id:'SM-101',kind:'buyer',lead:'2048',raised:'u10',name:'John Doe',prop:'Dubai Hills resale, 2-3BR',loc:'Dubai Hills Estate',budget:[2000000,8000000],cur:'AED',status:'Matched',owner:'u15',comm:2,docs:[],hist:[['Request raised from LEAD-2048','u10',T(13,0,-6)],['Accepted by Admin, assigned to Omar Ali','u1',T(14,0,-6)],['Matched with SM-201','u15',T(11,0,-1)]],matches:['SM-201']},
 {id:'SM-103',kind:'buyer',lead:null,raised:'u10',name:'Michael Chen',prop:'Palm Residences resale',loc:'Palm Jumeirah',budget:[4000000,6000000],cur:'AED',status:'Follow-up',owner:'u15',comm:2,docs:[],hist:[['Request raised','u10',T(13,0,-8)]],matches:[]},
 {id:'SM-201',kind:'seller',raised:'u15',name:'Rohan Patel',prop:'Marina Views 1204, 2BR, 1,050 sqft',loc:'Dubai Marina',ask:3100000,cur:'AED',status:'Active',owner:'u15',comm:2,docs:['Title deed.pdf','Photos (8)'],hist:[['Listing created by Admin','u1',T(10,0,-12)]],matches:['SM-101']},
 {id:'SM-202',kind:'seller',raised:'u10',name:'Sarah Khan',prop:'Palm Residences 5B, 3BR',loc:'Palm Jumeirah',ask:5800000,cur:'AED',status:'Requested',owner:null,comm:null,docs:['Oqood certificate.pdf','Unit documents.pdf'],hist:[['Listing request raised','u10',T(9,0,-1)]],matches:[]},
 {id:'SM-203',kind:'seller',raised:'u15',name:'Nadia Ali',prop:'Durrani Towers 1802, 2BR',loc:'Business Bay',ask:2250000,cur:'AED',status:'Negotiation',owner:'u15',comm:2,docs:['Title deed.pdf'],hist:[['Listing created by Admin','u1',T(10,0,-20)],['Offer received AED 2,150,000','u15',T(10,0,-1)]],matches:[]}];
/* ---- attendance etc ---- */
const att=[];const days=14;for(let i=days;i>=1;i--){const d=T(0,0,-i);const dow=new Date(d+4*HR).getUTCDay();if(dow===0||dow===6)continue;let st='Present',inn=T(9,15,-i),out=T(19,0,-i);if(i===6){st='Late';inn=T(11,15,-i)}if(i===9){st='Miss punch';out=null}if(i===11){st='Absent';inn=null;out=null}if(i===4){st='Early leave';out=T(16,30,-i)}att.push({u:'u10',date:d,in:inn,out,st,reg:i===9?'none':null})}
bks.forEach(b=>{});
const S0={now,session:null,users:U,teams:TEAMS,leads,projects:PROJ,bookings:bks,notes,sec,att,
 set:{inactX:7,inactY:3,capDefault:40,holdHours:48,holdCap:3,speed:10,fx:22.7,relDubai:30,dispositions:['Interested','Follow up','Meeting fixed','Not interested'],slabs:SLABS,cn:{tenure:36,rate:1.5,cur:['INR','AED'],min:null},targets:{agent:{rev:2600000,book:3,calls:160,meet:30,fu:90},mgmt:{rev:11500000,book:16}},checklist:{property:['Booking form (fixed)','Deposit receipt (fixed)','Signed SPA','4% DLD fee and Oqood receipt','Oqood certificate'],cn:['KYC: passport or Emirates ID','Nominee details','Signed agreement','PDC register','Registration payment receipt','Payout bank details']}},
 unlogged:{},punch:{u10:{in:false,t:null,brk:false},u11:{in:true,t:T(9,5),brk:false},u12:{in:true,t:T(10,12),brk:false},u13:{in:false},u14:{in:false},u15:{in:true,t:T(9,20),brk:false}},
 todayAtt:{u10:null,u11:{st:'Present',in:T(9,5)},u12:{st:'Late',in:T(10,12)},u13:{st:'Absent'},u14:{st:'On leave'},u15:{st:'Present',in:T(9,20)}},
 leave:[{id:'lv1',user:'u10',type:'Casual leave',from:T(0,0,-20),to:T(0,0,-19),days:2,reason:'Family event',status:'approved',by:'u2',at:T(9,0,-24)},{id:'lv2',user:'u11',type:'Casual leave',from:T(0,0,6),to:T(0,0,6),days:1,reason:'Family event',status:'pending'},{id:'lv3',user:'u12',type:'Casual leave',from:T(0,0,12),to:T(0,0,14),days:3,reason:'Travel',status:'pending'},{id:'lv4',user:'u13',type:'Casual leave',from:T(0,0,8),to:T(0,0,9),days:2,reason:'Personal work',status:'pending'},{id:'lv5',user:'u14',type:'Sick leave',from:T(0,0,0),to:T(0,0,2),days:3,reason:'Medical rest',status:'approved',by:'u2',at:T(9,0,-1)},{id:'lv6',user:'u16',type:'Casual leave',from:T(0,0,10),to:T(0,0,11),days:2,reason:'Travel',status:'pending'}],
 reg:[{id:'rg1',user:'u10',date:T(0,0,-9),reason:'Forgot to punch out, left at 7 pm after a site visit',out:T(19,0,-9),status:'none'},{id:'rg2',user:'u11',date:T(0,0,-3),reason:'App crashed on punch in, reached office 9:10',in:T(9,10,-3),status:'pending'}],
 notifs:[],audit:[],activity:[],nudges:[],tokens:{k7m2xq:{lead:'1031',meet:'m3',exp:T(10,0,1),used:false,kind:'in-person',client:'Mohammed Faisal',agent:'u10',place:'Palm Residences gallery'},old001:{lead:'1031',meet:'m3',exp:T(10,0,-1),used:false,kind:'in-person',client:'Mohammed Faisal',agent:'u10',place:'Palm Residences gallery'},used01:{lead:'1031',meet:'m3',exp:T(10,0,2),used:true,kind:'in-person',client:'Mohammed Faisal',agent:'u10',place:'Palm Residences gallery'},virt01:{lead:'1032',meet:'mv',exp:T(10,0,1),used:false,kind:'virtual',client:'Priya Menon',agent:'u10',place:'Google Meet'}},
 invites:{tok24h:{u:'u17',exp:T(10,0,1)},tokold:{u:'u17',exp:T(10,0,-1)}},
 dnd:[{no:'+971 50 889 2310',name:'Vikram Joshi',by:'u10',at:T(10,0,-6),reason:'Client requested no calls'}],
 imports:[{id:'imp3',file:'Expo_lead_list_Oct.csv',at:T(11,0,-2),by:'u1',total:1000,ok:930,dup:55,linked:5,err:10,camp:'Bulk upload · Expo lead list'},{id:'imp2',file:'Meta_Marina_Sept.csv',at:T(11,0,-9),by:'u1',total:480,ok:452,dup:22,linked:4,err:2,camp:'Meta · Marina Views Sept'}],
 rank:{global:[24,200],gcc:[8,59]},
 pool:{}
};
S0.leads.forEach(x=>{x.id=String(x.id)});
return S0}
function startOfDayAt(t){const d=new Date(t+4*HR);d.setUTCHours(0,0,0,0);return d.getTime()-4*HR}

/* ===== domain: lookups, rules engine, derived state, shared actions ===== */
const userById=id=>S.users.find(u=>u.id===id);
const leadById=id=>S.leads.find(l=>l.id===String(id));
const bkById=id=>S.bookings.find(b=>b.id===id);
const bkP=id=>id.replace('BKG-','bk'),bkF=p=>'BKG-'+String(p).replace(/^bk/,'');
const noteById=id=>S.notes.find(n=>n.id===id);
const noteP=id=>id.replace(/-/g,'').toLowerCase(),noteF=p=>{const s=String(p).toUpperCase();return 'CN-'+s.slice(2,6)+'-'+s.slice(6)};
const secById=id=>S.sec.find(s=>s.id===id);
const secP=id=>id.replace('-','').toLowerCase(),secF=p=>{const s=String(p).toUpperCase();return 'SM-'+s.slice(2)};
const projById=id=>S.projects.find(p=>p.id===id);
const teamById=id=>S.teams.find(t=>t.id===id);
const teamName=id=>teamById(id)?teamById(id).name:'No team';
const teamOf=uid=>{const u=userById(uid);return u?u.team:null};
const agentsOf=t=>S.users.filter(u=>u.role==='agent'&&u.team===t&&u.status!=='removed');
const uname=id=>id==='system'?'System':(userById(id)?userById(id).name:'Unknown');
const norm=p=>String(p||'').replace(/\D/g,'');
const leadsOf=uid=>S.leads.filter(l=>l.owner===uid&&!l.archived);
const myLeads=leadsOf;
const teamLeads=t=>{const ids=agentsOf(t).map(a=>a.id);return S.leads.filter(l=>ids.includes(l.owner)&&!l.archived)};
const poolLeads=()=>S.leads.filter(l=>!l.owner&&!l.team&&!l.archived&&!l.dnd&&!l.wrong);
const queueLeads=t=>S.leads.filter(l=>!l.owner&&l.team===t&&!l.archived&&!l.dnd&&!l.wrong);
const capOf=u=>u.cap||S.set.capDefault;
const capInfo=uid=>{const u=userById(uid);const used=leadsOf(uid).length,cap=capOf(u);return {used,cap,left:Math.max(0,cap-used),full:used>=cap}};
const isDnd=ph=>S.dnd.some(d=>norm(d.no)===norm(ph));
const slabOf=u=>S.set.slabs.find(s=>s.id===u.slab)||null;
const TRACKS={property:'Property Sale',cn:'Convertible Notes',secondary:'Secondary Market'};

const CALLRES=['Connected','Not answering','Not connected','Wrong number','DND requested'];

/* chips */
const tempChip=t=>t?chip(cap1(t),{hot:'s7',warm:'s5',cold:'s1'}[t]):'<span class="faint sm">Not set</span>';

const STG={New:'s2',Contacted:'s1',Qualified:'s3',Shortlisted:'s3','Booking submitted':'s5',Pending:'s5',Closed:'s6',Lost:'s2'};
const stageChip=s=>chip(s,STG[s]||'s2');
const DSP={Interested:'s3','Follow up':'s1','Meeting fixed':'s4','Not interested':'s2',DND:'s7','Wrong number':'s2'};

const BKS={pending:['Pending Admin','s5'],changes:['Changes requested','s3'],approved:['Approved','s6'],rejected:['Rejected','s7'],closed:['Closed','s6'],expired:['Hold expired','s2']};
const bkChip=s=>chip(BKS[s][0],BKS[s][1]);
const DOCS={missing:['Missing','s2'],uploaded:['Awaiting Admin','s5'],approved:['Approved','s6'],rejected:['Rejected','s7']};

const CMS={eligible:['Eligible','s3'],released:['Released','s6'],pending:['Pending','s5'],blocked:['Blocked','s7']};


const unitChip=s=>chip(s,{Available:'s6',Held:'s5',Booked:'s4',Sold:'s2'}[s]||'s2');


/* rules engine */
function leadRisk(l){if(!l.owner||l.archived)return {state:'none'};if(l.hold)return {state:'hold',d:0};const base=l.lastCommit||l.assigned||l.created;const d=Math.max(0,daysBetween(base,NOW()));const X=S.set.inactX,Y=S.set.inactY;if(d>=X+Y)return {state:'pool',d,left:0};if(d>=X)return {state:'risk',d,left:X+Y-d};return {state:'ok',d,until:X-d}}
function nextOf(l){return l.next&&!l.next.done?l.next:null}
function isOverdue(l){const n=nextOf(l);return !!n&&n.at<startOfDay(NOW())}
function isToday(l){const n=l.next;return !!n&&sameDay(n.at,NOW())}


function addEv(l,k,txt,x,by){l.ev.push({t:NOW(),k,txt,by:by||(S.session?S.session.userId:null),x:x||{}})}
function audit(action,entity,before,after){S.audit.unshift({id:'a'+uid(),at:NOW(),actor:S.session?S.session.userId:'system',action,entity,before:before==null?'':before,after:after==null?'':after})}
function notify(to,o){const ids=Array.isArray(to)?to:[to];const set=new Set();ids.forEach(t=>{if(['admin','mgmt','agent'].includes(t))S.users.filter(u=>u.role===t).forEach(u=>set.add(u.id));else set.add(t)});S.notifs.unshift(Object.assign({id:'n'+uid(),to:[...set],at:NOW(),read:false},o))}
const myNotifs=()=>S.session?S.notifs.filter(n=>n.to.includes(S.session.userId)):[];
const unreadCount=()=>myNotifs().filter(n=>!n.read).length;
function reassign(l,toId,reason,by){const from=l.owner;if(toId){const c=capInfo(toId);if(c.full)return {err:'capacity',msg:uname(toId)+' is at the active lead ceiling ('+c.used+'/'+c.cap+').'}}l.own.unshift({from,to:toId,reason,by:by||(S.session?S.session.userId:'system'),at:NOW()});l.owner=toId;l.assigned=NOW();l.lastCommit=toId?NOW():l.lastCommit;l.hold=null;l.riskNote=false;if(toId&&l.next&&!l.next.done&&l.next.at<NOW())l.next=null;addEv(l,'owner',(from?'Reassigned from '+uname(from)+' to ':'Assigned to ')+(toId?uname(toId):'Admin pool')+'. Reason: '+reason,{},by);if(toId)notify(toId,{t:'New lead assigned',d:l.name+' ('+'LEAD-'+l.id+')',go:'agent-lead-'+l.id,ic:'user'});if(from&&from!==toId)notify(from,{t:'Lead moved away from you',d:l.name+': '+reason,go:'agent-leads',ic:'repeat'});audit('Lead reassigned','LEAD-'+l.id,from?uname(from):'Admin pool',toId?uname(toId):'Admin pool');return {ok:true}}
function syncUnits(){S.projects.forEach(p=>p.units.forEach(u=>{u.bk=u.bk&&bkById(u.bk)?u.bk:null}));S.projects.forEach(p=>p.units.forEach(u=>{const b=S.bookings.find(x=>x.unit===u.id&&x.project===p.id&&['pending','changes','approved','closed'].includes(x.status));if(b){u.bk=b.id;u.status=b.status==='closed'?'Sold':b.status==='approved'?'Booked':'Held';u.holdBy=u.status==='Held'?b.agent:null;u.holdUntil=u.status==='Held'?b.holdUntil:null}else{u.bk=null;u.status=u.off?'Unavailable':'Available';u.holdBy=null;u.holdUntil=null}}))}
const holdsOf=uid=>S.bookings.filter(b=>b.agent===uid&&['pending','changes'].includes(b.status)&&b.holdUntil>NOW()).length;
function tick(){let ch=[];
 S.bookings.forEach(b=>{if(['pending','changes'].includes(b.status)&&b.holdUntil&&b.holdUntil<=NOW()){b.status='expired';b.reason='Unit hold expired after '+S.set.holdHours+' hours without an Admin decision.';b.hist.push(['Unit hold expired, unit released','system',NOW()]);notify(b.agent,{t:'Unit hold expired',d:b.unit+' released. Raise the booking again.',go:'agent-booking-'+bkP(b.id),ic:'clock'});notify('admin',{t:'Hold expired before review',d:b.id+' (unit '+b.unit+')',go:'admin-review',ic:'clock'});ch.push('hold '+b.id)}});
 S.leads.forEach(l=>{if(!l.owner||l.archived)return;const r=leadRisk(l);if(r.state==='pool'){const from=l.owner;l.own.unshift({from,to:null,reason:'Auto-returned: no forward commitment for '+r.d+' days',by:'system',at:NOW()});l.owner=null;addEv(l,'owner','Returned to Admin pool automatically: no forward commitment for '+r.d+' days',{},'system');notify(from,{t:'Lead returned to pool',d:l.name+' had no forward commitment for '+r.d+' days',go:'agent-leads',ic:'repeat'});notify(teamOf(from)?teamById(teamOf(from)).mgr:'admin',{t:'Lead auto-returned',d:l.name+' from '+uname(from),go:'mgmt-leads',ic:'repeat'});notify('admin',{t:'Lead returned to master pool',d:l.name+' (LEAD-'+l.id+')',go:'admin-leads',ic:'repeat'});audit('Lead auto-returned','LEAD-'+l.id,uname(from),'Admin pool');ch.push('pool '+l.id)}else if(r.state==='risk'&&!l.riskNote){l.riskNote=true;notify(l.owner,{t:'Lead is at risk',d:l.name+': '+r.left+' days left before it returns to the pool',go:'agent-lead-'+l.id,ic:'alert'});ch.push('risk '+l.id)}else if(r.state==='ok'){l.riskNote=false}});
 S.notes.forEach(n=>n.payouts.forEach(p=>{if(p.status==='upcoming'&&p.due<=NOW())p.status='due';if(p.status==='due'&&p.due<NOW()-3*DAY){p.status='overdue'}}));
 syncUnits();return ch}
function revOf(uid){return sum(S.bookings.filter(b=>b.agent===uid&&(b.status==='approved'||b.status==='closed')),b=>b.price)}
function bookingsCount(uid){return S.bookings.filter(b=>b.agent===uid&&(b.status==='approved'||b.status==='closed')).length}
function ranking(filter){const a=S.users.filter(u=>u.role==='agent'&&u.status!=='invited'&&(!filter||filter(u)));return a.map(u=>({u,rev:revOf(u.id)})).sort((x,y)=>y.rev-x.rev).map((x,i)=>Object.assign(x,{rank:i+1}))}
const targetOf=u=>({rev:S.set.targets.agent.rev,book:S.set.targets.agent.book});
function gateOk(b){return ['form','receipt','spa','dld','oqood'].every(k=>b.docs[k].s==='approved')}
function dealStage(b){if(b.status==='pending')return 'Booking submitted';if(b.status==='changes')return 'Changes requested';if(b.status==='rejected')return 'Rejected';if(b.status==='expired')return 'Hold expired';if(b.status==='closed')return 'Closed';if(!b.spaIssued)return 'PENDING: waiting for SPA';if(b.docs.spa.s==='missing')return 'SPA issued: signed copy needed';if(b.docs.dld.s==='missing')return 'SPA signed: DLD and Oqood fees';if(b.docs.oqood.s==='missing')return 'Waiting for Oqood certificate';return gateOk(b)?'Ready for closure approval':'Documents under review'}
function comm(b){const p=projById(b.project),u=userById(b.agent),slab=slabOf(u);const brokerage=b.price*p.comm/100;const rate=slab?slab.rate:0;const inc=Math.round(brokerage*rate/100+(b.adj||0));let st,reason='';if(b.status==='rejected'||b.status==='expired'){st='blocked';reason='Booking was '+b.status}else if(!slab){st='blocked';reason='No commission slab is assigned to this agent. Ask Admin.'}else if(b.status!=='closed'){st='pending';reason='Booking is not closed yet'}else if(b.incRel){st='released'}else if(!b.devRec){st='pending';reason='Waiting for the developer commission to be received'}else if(b.paidPct<p.relPct){st='blocked';reason='Buyer has paid '+b.paidPct+'% of the '+p.relPct+'% release milestone'}else st='eligible';return {brokerage,rate,inc,st,reason,slab,p}}
function devState(b){if(b.status!=='closed')return {k:'na',l:'Not yet'};if(b.devRec)return {k:'rec',l:'Received'};if(b.devInv){const d=daysBetween(b.devInv,NOW());return d>30?{k:'over',l:'Overdue '+d+' days'}:{k:'inv',l:'Invoiced'}}return {k:'ready',l:'Ready to invoice'}}
function pendingReview(){const out=[];S.bookings.forEach(b=>{if(b.status==='pending')out.push({type:'booking',id:b.id,b,at:b.submitted});if(b.status==='approved'){['spa','dld','oqood'].forEach(k=>{if(b.docs[k].s==='uploaded')out.push({type:'doc',id:b.id+':'+k,b,k,at:b.docs[k].at})});if(gateOk(b))out.push({type:'closure',id:b.id,b,at:NOW()})}});S.leads.filter(l=>l.cn&&l.cn.stage==='Admin review'&&l.cn.adminState==='pending').forEach(l=>out.push({type:'cn',id:l.id,l,at:l.cn.submitted}));S.sec.filter(s=>s.status==='Requested').forEach(s=>out.push({type:'sec',id:s.id,s,at:s.hist[0][2]}));return out}
function escalationsFor(u){const t=u.role==='admin'?null:u.team;return S.leads.filter(l=>l.esc&&(!t||teamOf(l.owner||l.esc.by)===t)).map(l=>Object.assign({lead:l},l.esc))}
function punchState(id){const p=S.punch[id]||{in:false};return p}
function pushActivity(u,k,l,out,nextTxt){S.activity.unshift({t:NOW(),u,k,lead:l?l.id:null,out:out||'',next:nextTxt||''})}
function stageSet(l,s){if(l.stage!==s){addEv(l,'stage','Stage changed: '+l.stage+' to '+s);l.stage=s}}
function nextSlab(u){const sl=S.set.slabs;const i=sl.findIndex(s=>s.id===u.slab);const nx=sl[i+1];if(!nx)return null;return {slab:nx,gap:Math.max(0,nx.from-revOf(u.id))}}


/* initial derived state */
function initState(){S=seed();syncUnits();
 S.speed={u10:8,u11:12,u12:6,u13:15,u14:9,u15:7};
 S.base={u10:{calls:118,meet:19,fu:63},u11:{calls:141,meet:27,fu:88},u12:{calls:96,meet:14,fu:51},u13:{calls:72,meet:9,fu:30},u14:{calls:131,meet:22,fu:70},u15:{calls:104,meet:17,fu:58}};
 S.leads.find(l=>l.id==='1203').dnd=false;
 const adm='u1';
 notify('u10',{t:'Booking BKG-10009 rejected',d:'Developer form not signed. Unit U-4102 released.',go:'agent-booking-bk10009',ic:'file'});
 notify('u10',{t:'Follow-up due: Emma Wilson',d:'11:30 today, discuss 36-month schedule',go:'agent-lead-2047',ic:'clock'});
 notify('u10',{t:'Lead at risk: Karan Malhotra',d:'1 day left before it returns to the pool',go:'agent-lead-1035',ic:'alert'});
 notify('u10',{t:'Escalation received by manager',d:'Mohit Kapoor is reviewing the discount request on LEAD-2045',go:'agent-lead-2045',ic:'flag'});
 notify('u2',{t:'Escalation from Archit Batham',d:'LEAD-2045: discount request on U-3102',go:'mgmt-leads-esc',ic:'flag'});
 notify('u2',{t:'Leave requests need your approval',d:'3 pending in Dubai Sales',go:'mgmt-leave',ic:'cal'});
 notify('u1',{t:'2 bookings await your review',d:'BKG-10021 and signed SPA on BKG-10018',go:'admin-review',ic:'file'});
 notify('u1',{t:'Developer commission overdue',d:'BKG-10003: invoiced 7 days ago',go:'admin-commission',ic:'dollar'});
 S.notifs.forEach((n,i)=>{n.at=NOW()-(i+1)*47*MIN;n.read=i>5});
 const acts=[['u11','Call','3001','Connected','Share project'],['u10','Meeting','1031','Interested','Follow-up today 15:00'],['u12','Call','4001','Connected','Site visit tomorrow'],['u13','Follow-up','5001','No answer','Retry 15:00'],['u11','Call','3002','Interested','Negotiation'],['u10','Call','1106','Connected','Follow-up done']];
 acts.forEach((a,i)=>S.activity.push({t:NOW()-(i*28+10)*MIN,u:a[0],k:a[1],lead:a[2],out:a[3],next:a[4]}));
 S.activity.push({t:NOW()-55*MIN,u:'u12',k:'Call',lead:'4002',out:'Connected',next:'Follow-up tomorrow 11:00'});
 S.audit.push({id:'a0',at:NOW()-3*DAY,actor:'u1',action:'Setting changed',entity:'Inactivity window X',before:'5 days',after:'7 days'},{id:'a1',at:NOW()-2*DAY,actor:'u1',action:'User created',entity:'Imran Sheikh (AG-070)',before:'',after:'Agent, Mumbai Sales, no slab'},{id:'a2',at:NOW()-6*DAY,actor:'u1',action:'Lead assigned',entity:'LEAD-1023',before:'Admin pool',after:'Archit Batham'});
 S.audit.sort((a,b)=>b.at-a.at)}

/* shared actions */
Object.assign(A,{
 notif(){UI.notif=!UI.notif;render()},
 readall(){myNotifs().forEach(n=>n.read=true);render()},
 notifgo(a){const n=S.notifs.find(x=>x.id===a[0]);if(n){n.read=true;UI.notif=false;if(n.go)go(n.go);else render()}},
 page(a){UI.pg[a[0]]=Math.max(1,+a[1]);render()},
 ui(a){UI.f[a[0]]=a[1];UI.pg={};render()},
 mset(a){UI.mf[a[0]]=a[1];renderOverlay()},
 mclose(){closeM()},mbg(){closeM()},cclose(){UI.c=null;renderOverlay()},cbg(){UI.c=null;renderOverlay()},
 as(a){const r=a[0];const id={agent:'u10',mgmt:'u2',admin:'u1'}[r];S.session={role:r,userId:id};UI.f={};UI.pg={};closeM();go(homeOf(r))},
 logout(){S.session=null;closeM();go('login')},
 noop(){},
 copy(a){const t=a.join('|');const done=()=>toast('Copied to clipboard','ok');if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,()=>toast('Copy blocked. Select the text and copy it manually.','err'))}else toast('Copy blocked. Select the text and copy it manually.','err')}
});

/* ===== shared: lead components, auth screens, client page, notifications, settings ===== */
const pref=k=>(S.prefs&&S.prefs[k]!=null)?S.prefs[k]:true;
const prio=l=>{const r=leadRisk(l);let s=0;if(isOverdue(l))s+=100;if(isToday(l)&&!l.next.done)s+=60;if(r.state==='risk')s+=50;s+={hot:30,warm:15,cold:5}[l.temp]||0;if(!l.attempts)s+=20;return -s};
function nextTxt(l){const n=nextOf(l);if(!n)return l.next&&l.next.done?'<span class="faint">Done today</span>':'<span class="faint">None set</span>';const od=n.at<startOfDay(NOW());const when=sameDay(n.at,NOW())?'Today '+fhm(n.at):fds(n.at)+' '+fhm(n.at);return `<span class="${od?'dangertx b':''}">${esc(n.type)} · ${when}</span>${od?' <span class="xs dangertx">overdue</span>':''}`}

const COPYBUF={};let _cb=0;

A.copybuf=a=>A.copy([COPYBUF[a[0]]||'']);
A.clearf=()=>{UI.f={};UI.pg={};render()};


/* ---------- login ---------- */
def('login',{role:'login',level:'L1',title:'Sign in',sample:[[]]});
Object.assign(A,{
 pfset(a){UI.pf[a[0]]=a[1];render()},
 login(){const em=(pfv('email')||'').trim().toLowerCase(),pw=pfv('password');const e={};if(!em)e.email='Enter your work email.';else if(!/^\S+@\S+\.\S+$/.test(em))e.email='This does not look like an email address.';if(!pw)e.password='Enter your password.';else if(pw.length<8)e.password='Passwords have at least 8 characters.';
  if((S.fails||0)>=5){UI.pf._e={};render();return}
  UI.pf._m=null;if(Object.keys(e).length){UI.pf._e=e;render();return}
  const u=S.users.find(x=>x.email.toLowerCase()===em);
  if(!u){S.fails=(S.fails||0)+1;UI.pf._e={};UI.pf._m='Email or password is incorrect.';UI.pf._mk='err';render();return}
  if(u.status==='invited'){UI.pf._e={};UI.pf._m='Your account is not active yet. Open the invite link from your email to set a password.';UI.pf._mk='warn';render();return}
  if(u.status==='inactive'||u.status==='removed'){UI.pf._e={};UI.pf._m='This account has been deactivated. Contact your Admin.';UI.pf._mk='err';render();return}
  S.fails=0;S.session={role:u.role,userId:u.id};UI.f={};UI.pg={};const nx=UI.next;UI.next=null;const rr=nx&&parse(nx);if(rr&&rr.def.role===u.role)go(nx);else go(homeOf(u.role))},
 forgot(){const em=(pfv('femail')||'').trim();if(!/^\S+@\S+\.\S+$/.test(em)){UI.pf._e={femail:'Enter a valid email address.'};render();return}UI.pf._sent=em;UI.pf._e={};render()}
});
def('login-forgot',{role:'login',level:'L2',title:'Reset password',sample:[[]]});

/* ---------- invite ---------- */
def('invite',{role:'login',level:'L2',title:'Set password',sample:[['tok24h'],['tokold']]});
A.setpw=a=>{const t=S.invites[a[0]],pw=pfv('npw'),cf=pfv('ncf');const e={};if(!(pw.length>=8&&/[A-Za-z]/.test(pw)&&/\d/.test(pw)))e.npw='Use at least 8 characters with a letter and a number.';if(cf!==pw)e.ncf='The two passwords do not match.';if(Object.keys(e).length){UI.pf._e=e;render();return}
 const u=userById(t.u);u.status='active';t.used=true;audit('User activated',u.name+' ('+u.emp+')','Invited','Active');UI.pf={_m:'Password set. Sign in with '+u.email+'.',_mk:'ok'};go('login')};

/* ---------- client confirmation page ---------- */
def('client-confirm',{role:'client',level:'L2',title:'Meeting confirmation',sample:[['k7m2xq'],['old001'],['used01'],['virt01'],['nope00']]});
/* global listener: handled in React (src/app/events.ts) */
A.cconfirm=a=>{const t=S.tokens[a[0]];const e={};const met=pfv('met');if(!met)e.met='Choose one option.';if(met==='no'&&!pfv('issue').trim())e.issue='Please tell us what happened.';if(met==='yes'){if(t.kind!=='virtual'&&!pfv('photo'))e.photo='Add a photo to verify the visit.';if(!+pfv('stars',0))e.stars='Tap a star rating.';if(t.kind!=='virtual'&&!pfv('consent'))e.consent='Consent is needed to verify the visit.'}
 if(Object.keys(e).length){UI.pf._e=e;render();return}
 const l=leadById(t.lead);const m=l.meets.find(x=>x.id===t.meet);t.used=true;
 if(met==='yes'){m.status=t.kind==='virtual'?'confirmed':'verified';m.fb={stars:+pfv('stars'),text:pfv('fb'),photo:pfv('photo')||null,at:NOW()};addEv(l,'meet',t.kind==='virtual'?'Meeting confirmed by client (virtual)':'Meeting verified by client with photo proof',{},'client');notify(t.agent,{t:t.kind==='virtual'?'Client confirmed the meeting':'Meeting verified',d:l.name+' rated '+pfv('stars')+' of 5',go:'agent-lead-'+l.id,ic:'check'});UI.pf={_done:'ok'}}
 else{m.status='disputed';m.issue=pfv('issue');addEv(l,'warn','Client reported a problem with the meeting: '+pfv('issue'),{},'client');notify(['admin',teamById(teamOf(l.owner)).mgr],{t:'Meeting disputed by client',d:l.name+': '+pfv('issue'),go:'admin-lead-'+l.id,ic:'alert'});UI.pf={_done:'dispute'}}
 render()};

/* ---------- notifications ---------- */
['agent','mgmt','admin'].forEach(role=>{def(role+'-notifications',{role,level:'L1',title:'Notifications',sample:[[]]})});

/* ---------- personal settings (agent & mgmt) ---------- */
['agent','mgmt'].forEach(role=>{def(role+'-settings',{role,level:'L1',title:'Settings',sample:[[]]})});
A.pref=a=>{S.prefs=S.prefs||{};S.prefs[a[0]]=!pref(a[0]);render()};
mdef('pw-change',{role:'shared'});
A.pwsave=()=>{const e={},f=UI.mf;if(!f.cur||f.cur.length<8)e.cur='Enter your current password.';if(!(f.nw&&f.nw.length>=8&&/[A-Za-z]/.test(f.nw)&&/\d/.test(f.nw)))e.nw='Use at least 8 characters with a letter and a number.';else if(f.nw===f.cur)e.nw='Choose a password you have not used before.';if(f.cf!==f.nw)e.cf='The two passwords do not match.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}closeM();toast('Password updated','ok');audit('Password changed',me().name,'','')};

/* ---------- shared modals ---------- */
mdef('account-menu',{role:'shared'});
mdef('more-nav',{role:'shared'});
mdef('punch',{role:'shared'});
A.punch=a=>{const u=me(),p=S.punch[u.id]||(S.punch[u.id]={in:false});const k=a[0];
 if(k==='in'){const t=NOW();const hm=fhm(t).split(':');const late=(+hm[0])*60+(+hm[1])>10*60;S.punch[u.id]={in:true,t,brk:false};S.todayAtt[u.id]={st:late?'Late':'Present',in:t};toast('Punched in at '+fhm(t)+(late?' (marked late)':''),'ok')}
 if(k==='brk'){p.brk=true;p.brkAt=NOW();toast('Break started')}
 if(k==='endbrk'){p.brk=false;toast('Break ended')}
 if(k==='out'){const ta=S.todayAtt[u.id]||{st:'Present'};S.att.push({u:u.id,date:startOfDay(NOW()),in:p.t,out:NOW(),st:ta.st,reg:null});S.punch[u.id]={in:false,t:null,brk:false,outAt:NOW()};toast('Punched out at '+fhm(NOW()),'ok')}
 closeM();render()};

/* ---------- shared bits ---------- */

const projFilter=()=>{const q=(UI.f.pq||'').toLowerCase(),t=UI.f.pt||'all',c=UI.f.pc||'all';return S.projects.filter(p=>p.active&&(!q||(p.name+p.dev+p.area).toLowerCase().includes(q))&&(t==='all'||p.type===t)&&(c==='all'||p.city===c))};

/* ===== leads: list (agent), lead detail (all roles), lead modals and actions ===== */
const dtl=t=>new Date(t+4*HR).toISOString().slice(0,16);
const dtp=v=>Date.parse(v+':00+04:00');
const archivedOf=uid=>S.leads.filter(l=>l.archived&&(l.owner===uid||(l.own.length&&l.own[0].to===uid)));
const estFor=l=>3+(+l.id%6);
function agentLeadsFiltered(uid){let a=leadsOf(uid);const v=UI.f.lv||'all';
 const F={all:()=>true,today:l=>isToday(l)&&!l.next.done,overdue:isOverdue,risk:l=>leadRisk(l).state==='risk',hot:l=>l.temp==='hot',fresh:l=>!l.attempts||l.stage==='New'};
 const base=v==='archived'?archivedOf(uid):a.filter(F[v]||F.all);
 const q=(UI.f.lq||'').toLowerCase().trim(),t=UI.f.lt||'all',k=UI.f.lk||'all';
 let r=base.filter(l=>(!q||(l.name+' '+l.phone+' '+l.id+' '+l.email).toLowerCase().includes(q))&&(t==='all'||l.temp===t)&&(k==='all'||l.track===k));
 const s=UI.f.ls||'prio';r.sort(s==='name'?(x,y)=>x.name.localeCompare(y.name):s==='new'?(x,y)=>y.assigned-x.assigned:s==='old'?(x,y)=>(x.lastCommit||0)-(y.lastCommit||0):(x,y)=>prio(x)-prio(y));return r}
def('agent-leads',{role:'agent',level:'L1',title:'My Leads',nav:'agent-leads',sample:[[]]});

/* ---------------- lead detail (agent, mgmt, admin) ---------------- */

function leadAccess(role,l){if(!l)return 'missing';const u=me();if(role==='agent'){if(l.owner!==u.id)return l.owner?'foreign':'pool';return 'ok'}if(role==='mgmt'){if(l.owner&&teamOf(l.owner)!==u.team)return 'foreign';return 'ok'}return 'ok'}
const leadBack={agent:['My Leads','agent-leads'],mgmt:['Team Leads','mgmt-leads'],admin:['Leads','admin-leads']};

['agent','mgmt','admin'].forEach(role=>def(role+'-lead',{role,level:'L2',title:'Lead detail',nav:role+'-leads',sample:[['1023'],['1023','calls'],['1023','qualify'],['1023','docs'],['1023','props'],['1023','timeline'],['9001'],['1201'],['0000']],crumb:p=>[{l:leadBack[role][0],go:leadBack[role][1]},{l:leadById(p[0])?leadById(p[0]).name:'Lead '+p[0]}]}));

function nextCard(role,l){const n=nextOf(l),mine=role==='agent';const m=l.meets.filter(x=>x.status==='scheduled'||x.status==='link-sent').sort((a,b)=>a.at-b.at)[0];
 let h='';
 if(m&&m.at<NOW()&&mine){h=`<div class="bn warn"><span>${ic('cal',18)}</span><div><div class="t">Meeting time has passed</div><div>${esc(m.kind==='virtual'?'Online meeting':m.place)} was ${sameDay(m.at,NOW())?'today at ':'on '+fds(m.at)+' at '}${fhm(m.at)}. Ask ${esc(l.name.split(' ')[0])} to confirm it${m.kind==='virtual'?'':' with a photo'}.</div></div><div class="acts"><button class="btn pri s" type="button" data-open="send-confirm|${l.id}|${m.id}">Send confirmation link</button><button class="btn s" type="button" data-act="noshow|${l.id}|${m.id}">Client did not show</button></div></div>`}
 else if(n)h=`<div class="row sb wrap g16"><div><div class="ov">Next action</div><div class="kns mt8">${esc(n.type)} · ${sameDay(n.at,NOW())?'Today ':fds(n.at)+' '}${fhm(n.at)}</div>${n.note?`<div class="muted sm mt8">${esc(n.note)}</div>`:''}${isOverdue(l)?'<div class="dangertx sm b mt8">Overdue. Contact the client or reschedule.</div>':''}</div>${mine?`<div class="row g6 wrap"><button class="btn" type="button" data-open="sched|${l.id}|re">Reschedule</button><button class="btn pri" type="button" data-open="call-log|${l.id}">Log result</button></div>`:''}</div>`;
 else h=`<div class="row sb wrap g16"><div><div class="ov">Next action</div><div class="b mt8">Nothing scheduled</div><div class="muted sm">A dated follow-up or meeting keeps this lead active.</div></div>${mine&&!l.archived?`<button class="btn pri" type="button" data-open="sched|${l.id}">${ic('plus',16)}Schedule</button>`:''}</div>`;
 return `<div class="card ${n&&isOverdue(l)?'':''}">${h}</div>`}

function leadOverview(role,l){const mine=role==='agent';const bks=S.bookings.filter(b=>b.lead===l.id);const cur=l.cur||'AED';
 const kv=kvs([['Phone',esc(l.phone)+` <button class="btn lnk xs" type="button" data-act="copy|${esc(l.phone)}">Copy</button>`],['Email',esc(l.email)],['Location',esc(l.city+', '+l.country)],['Source',esc(l.src)],['Campaign',esc(l.camp)],['Direction',esc(l.dir)],['Assigned',l.assigned?fd(l.assigned):'Not assigned'],['Call attempts',String(l.attempts)],['Budget',l.budget?money(l.budget[0],cur)+' to '+money(l.budget[1],cur):'<span class="faint">Not captured</span>'],['Language',l.arabic?'Arabic speaker':'English']]);
 const left=[nextCard(role,l),card('Profile',kv)];
 if(bks.length)left.push(card('Bookings',bks.map(b=>{const g=(role+'-booking-')+bkP(b.id);return `<a class="row sb" style="padding:10px 0;border-bottom:1px solid var(--bd-s);text-decoration:none;color:inherit" href="#${g}" data-go="${g}"><span><span class="b">${b.id}</span> · ${esc(b.unit)}, ${esc(projById(b.project).name)}<br><span class="muted sm">${mfull(b.price,b.cur)}</span></span><span class="row g6">${bkChip(b.status)}${ic('chev',14)}</span></a>`}).join('')));
 if(l.track==='cn'&&l.cn){left.push(card('Convertible Note',kvs([['Stage',esc(l.cn.stage)],['Amount',mfull(l.cn.amount,l.cn.cur)],['Tenure',l.cn.tenure+' months'],['Payout','Monthly, 1.5%']])+(mine?`<div class="mt16"><a class="btn pri" href="#agent-cnapp-${l.id}" data-go="agent-cnapp-${l.id}">Open note application</a></div>`:'')))}
 const so=S.sec.filter(s=>s.lead===l.id);if(so.length)left.push(card('Secondary Market',so.map(s=>`<div class="row sb"><span class="b">${s.id} · ${esc(s.prop)}</span>${chip(s.status,'s4')}</div>`).join('')+`<div class="mt8"><a class="btn s" href="#${role}-sec-${secP(so[0].id)}" data-go="${role}-sec-${secP(so[0].id)}">Open request</a></div>`));
 const right=[];
 if(mine&&!l.archived)right.push(card('Quick actions',`<div class="col g6"><div class="lbl">Lead temperature</div>${tempPick(l.temp,'settemp|'+l.id+'|')}<div class="divh"></div><button class="btn blk" type="button" data-open="share|${l.id}">${ic('send',16)}Share project details</button><button class="btn blk" type="button" data-open="escalate|${l.id}"${l.esc&&l.esc.status==='open'?' disabled':''}>${ic('flag',16)}${l.esc&&l.esc.status==='open'?'Escalation open':'Escalate to manager'}</button><button class="btn blk" type="button" data-open="note|${l.id}">Add a note</button><button class="btn blk" type="button" data-open="archive|${l.id}">Not interested or lost</button><button class="btn blk dngo" type="button" data-open="dnd|${l.id}">Client asked not to be called</button></div>`));
 if(l.esc)right.push(card('Escalation',`<div class="col g6"><div class="row sb">${chip(l.esc.status==='open'?'Open with manager':'Resolved',l.esc.status==='open'?'s5':'s6')}<span class="xs faint">${ft(l.esc.at)}</span></div><div class="sm">${esc(l.esc.reason)}</div>${l.esc.resp?`<div class="bn ok"><span>${ic('check',16)}</span><div><div class="t">Manager response</div><div>${esc(l.esc.resp)}</div></div></div>`:''}<div class="xs muted">You keep ownership of this lead during an escalation.</div>${role==='mgmt'&&l.esc.status==='open'?`<button class="btn pri" type="button" data-open="esc-respond|${l.id}">Respond</button>`:''}</div>`));
 if(l.linked){const o=leadById(l.linked);right.push(card('Linked lead',`<div class="sm">Same phone number as <b>LEAD-${l.linked}</b>${o?' ('+esc(o.camp)+')':''}, different campaign.${role==='agent'?' The original agent keeps it while it is active. Admin can override per project.':''}</div>${role!=='agent'&&o?`<div class="mt8"><a class="btn s" href="#${role}-lead-${o.id}" data-go="${role}-lead-${o.id}">Open LEAD-${o.id}</a></div>`:''}`))}
 right.push(card('Ownership history',l.own.length?`<div class="tl">${l.own.map(o=>`<div class="tli"><div class="ico owner">${ic('repeat',14)}</div><div><div class="tt">${o.from?esc(uname(o.from)):'Admin pool'} to ${o.to?esc(uname(o.to)):o.team?esc(teamName(o.team))+' queue':'Admin pool'}</div><div class="tm">${esc(o.reason)} · ${fd(o.at)}</div></div></div>`).join('')}</div>`:'<div class="muted sm">Never assigned.</div>'));
 return `<div class="grid g21"><div class="col g16">${left.join('')}</div><div class="col g16">${right.join('')}</div></div>`}


A.qualsave=a=>{const l=leadById(a[0]);const g=(k,d)=>pfv(k,d);const e={};const trk=g('trk',l.track||''),b0=+g('bmin',l.budget?l.budget[0]:''),b1=+g('bmax',l.budget?l.budget[1]:'');
 if(!trk)e.trk='Choose a track.';if(!b0&&b0!==0)e.bmin='Enter a budget.';if(!b1)e.bmax='Enter a maximum budget.';else if(b1<b0)e.bmax='Maximum must be at least the minimum.';
 if(Object.keys(e).length){UI.pf._e=e;render();return}
 l.cur=g('cur',l.cur||'AED');l.budget=[b0,b1];l.ptype=g('ptype',l.ptype||'')||null;l.timeline=g('tline',l.timeline||'')||null;l.payment=g('pay',l.payment||'')||null;l.purpose=g('purp',l.purpose||'')||null;l.visa=g('visa',l.visa||'')||null;
 const was=l.track;l.track=trk;const full=l.ptype&&l.timeline&&l.payment&&l.purpose;l.qualified=!!full;if(full&&['New','Contacted'].includes(l.stage))stageSet(l,'Qualified');
 if(was!==trk){addEv(l,'stage','Track set to '+TRACKS[trk]);if(trk==='cn'&&!l.cn)l.cn={stage:'Qualified',amount:l.budget[1],cur:l.cur,tenure:36,freq:'Monthly'}}
 addEv(l,'stage','Qualification updated');UI.pf={};toast(full?'Saved. Lead is qualified':'Saved. Some details are still missing','ok');
 if(trk==='cn')toast('Next: open the note application');render()};
/* leadDocs: replaced by a later definition */

function leadTimeline(role,l){const f=UI.f.tf||'all';const map={call:'call',wa:'wa',meet:'meet',stage:'stage',owner:'owner',doc:'doc',warn:'warn',sys:'owner',note:'doc'};
 const ev=[...l.ev].sort((a,b)=>b.t-a.t).filter(e=>f==='all'||(f==='contact'&&['call','wa','meet'].includes(e.k))||(f==='system'&&['owner','stage','sys','doc','warn'].includes(e.k))||(f==='note'&&e.k==='note'));
 return `<div class="seg mb16">${[['all','All'],['contact','Contact'],['system','Stage and ownership'],['note','Notes']].map(([k,t])=>`<button class="${f===k?'on':''}" type="button" data-act="ui|tf|${k}">${t}</button>`).join('')}</div>`+card('',ev.length?`<div class="tl">${ev.map(e=>`<div class="tli"><div class="ico ${map[e.k]||''}">${ic({call:'phone',wa:'msg',meet:'cal',stage:'flag',owner:'repeat',doc:'file',warn:'alert',note:'edit'}[e.k]||'info',14)}</div><div><div class="tt">${esc(e.txt)}</div><div class="tm">${ft(e.t)} · ${e.by?esc(e.by==='client'?'Client':uname(e.by)):'System'}</div></div></div>`).join('')}</div>`:empty('hist','No activity','Events appear here as the lead moves.'))}

/* ---------------- lead actions ---------------- */
Object.assign(A,{
 dial(a){const l=leadById(a[0]),u=me();if(l.dnd||isDnd(l.phone)){openM('blocked',[l.id,'dnd']);return}const p=S.unlogged[u.id];if(p&&p.lead!==l.id){openM('blocked',[l.id,'unlogged']);return}if(!p){S.unlogged[u.id]={lead:l.id,t:NOW(),est:estFor(l)};addEv(l,'call','Call started from the app (dialer opened)')}toast('Opening the phone dialer for '+l.phone);render()},
 settemp(a){const l=leadById(a[0]);const o=l.temp;l.temp=a[1];addEv(l,'stage','Temperature changed: '+(o||'none')+' to '+a[1]);toast('Marked '+a[1],'ok');render()},
 noshow(a){const l=leadById(a[0]);const m=l.meets.find(x=>x.id===a[1]);m.status='no-show';if(l.next&&l.next.type==='Meeting')l.next=null;addEv(l,'meet','Client did not show for the meeting');toast('Marked as no-show. Schedule the next step.');openM('sched',[l.id])},
 docdel(a){const l=leadById(a[0]);l.docs=l.docs.filter(d=>d.id!==a[1]);addEv(l,'doc','Document removed');toast('Document removed');render()},
 shortdel(a){const l=leadById(a[0]);l.shortlist=l.shortlist.filter(s=>s.p!==a[1]);toast('Removed from shortlist');render()},
 holdoff(a){const l=leadById(a[0]);l.hold=null;l.lastCommit=NOW();addEv(l,'owner','Manager hold released. Inactivity clock restarted.');audit('Hold released','LEAD-'+l.id,'On hold','Active');notify(l.owner,{t:'Hold released',d:l.name+' is active again',go:'agent-lead-'+l.id,ic:'check'});toast('Hold released','ok');render()}
});

/* ---- call log ---- */
mdef('call-log',{role:'agent',init:a=>{const l=leadById(a[0]);const un=S.unlogged[me().id];const est=un&&un.lead===l.id?un.est:null;return {res:'',dur:'',temp:l.temp||'',disp:'',note:'',ntype:'Follow-up',nat:'',mkind:'in-person',mplace:'',_est:est}}});
A.callsave=a=>{const l=leadById(a[0]),f=UI.mf,u=me(),e={};const conn=f.res==='Connected';const need=['Interested','Follow up','Meeting fixed'].includes(f.disp);
 if(!f.res)e.res='Choose what happened on the call.';
 if(conn){if(!(+f.dur>=1))e.dur='Enter the call length in minutes.';if(!f.disp)e.disp='Choose the outcome.';if(f.disp==='Not interested'&&!(f.note||'').trim())e.note='Add a short reason.'}
 const needsWhen=(conn&&need)||(f.nat&&f.res&&!conn);
 if(conn&&need&&!f.nat)e.nat='A next action with a date is required. It keeps the lead active.';
 if(f.nat){const t=dtp(f.nat);if(isNaN(t))e.nat='Enter a valid date and time.';else if(t<=NOW())e.nat='Choose a time in the future.'}
 if(f.ntype==='Meeting'&&needsWhen&&!(f.mplace||'').trim())e.mplace='Add the place or link.';
 if(f.disp==='Meeting fixed'&&f.ntype!=='Meeting')e.nat=e.nat||'Meeting fixed needs a Meeting as the next action.';
 if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 const un=S.unlogged[u.id];const est=un&&un.lead===l.id?un.est:null;const dur=conn?+f.dur:0;
 const flag=false;
 const c={id:'c'+uid(),t:NOW(),by:u.id,live:true,res:f.res,dur,est,flag,manual:!est,note:f.note||'',disp:conn?f.disp:null,temp:f.temp||l.temp};l.calls.push(c);l.attempts++;
 if(conn&&f.temp)l.temp=f.temp;if(conn){l.disp=f.disp}
 if(l.stage==='New')stageSet(l,'Contacted');
 let txt='Call: '+f.res+(conn?' ~'+dur+' min. '+f.disp:'')+(f.note?'. '+f.note:'');addEv(l,'call',txt,{res:f.res});
 let archived=null;
 if(f.res==='Wrong number'){l.wrong=true;l.archived=true;l.disp='Wrong number';l.archReason='Wrong number';archived='Wrong number';notify('admin',{t:'Wrong number reported',d:l.name+' (LEAD-'+l.id+') from '+l.camp,go:'admin-leads',ic:'alert'})}
 else if(f.res==='DND requested'){l.dnd=true;l.archived=true;l.disp='DND';l.archReason='Client asked not to be called';S.dnd.unshift({no:l.phone,name:l.name,by:u.id,at:NOW(),reason:'Client requested no calls'});archived='DND';audit('DND added',l.phone,'','Added by '+u.name)}
 else if(conn&&f.disp==='Not interested'){l.archived=true;l.archReason=f.note;stageSet(l,'Lost');archived='Not interested'}
 if(!archived&&f.nat){const t=dtp(f.nat);const type=need&&conn?f.ntype:f.ntype||'Follow-up';l.next={type,at:t,done:false,note:''};l.lastCommit=NOW();l.riskNote=false;if(type==='Meeting'){l.meets.push({id:'m'+uid(),at:t,kind:f.mkind,place:(f.mplace||'').trim(),status:'scheduled',token:null});addEv(l,'meet','Meeting scheduled: '+(f.mplace||'')+' on '+ft(t))}else addEv(l,'stage','Follow-up scheduled for '+ft(t))}
 else if(!archived&&conn&&f.disp==='Follow up'){}
 if(un&&un.lead===l.id)delete S.unlogged[u.id];
 pushActivity(u.id,'Call',l,f.res==='Connected'?f.disp:f.res,f.nat?(f.ntype+' '+fts(dtp(f.nat))):'');
 if(flag){S.activity[0].flag=true;S.activity[0].next='Duration flagged';const m=teamById(u.team);if(m)notify(m.mgr,{t:'Call duration mismatch',d:u.name+' logged '+dur+' min on '+l.name+' (app estimate '+est+' min)',go:'mgmt-activity',ic:'alert'})}
 closeM();toast(archived?'Call saved. Lead archived ('+archived+')':'Call saved'+(flag?'. Duration flagged for review':''),'ok');if(archived)go('agent-leads');else render()};

/* ---- schedule ---- */
mdef('sched',{role:'agent',init:a=>{const l=leadById(a[0]);const n=nextOf(l);return {type:n?n.type:'Follow-up',nat:n?dtl(n.at):'',note:n?n.note||'':'',mkind:'in-person',mplace:''}}});
A.schedsave=a=>{const l=leadById(a[0]),f=UI.mf,e={};const t=dtp(f.nat);if(!f.nat||isNaN(t))e.nat='Choose a date and time.';else if(t<=NOW())e.nat='Choose a time in the future.';if(f.type==='Meeting'&&!(f.mplace||'').trim())e.mplace='Add the place or link.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 l.next={type:f.type,at:t,done:false,note:f.note||''};l.lastCommit=NOW();l.riskNote=false;if(f.type==='Meeting'){l.meets=l.meets.filter(m=>m.status!=='scheduled'||m.at<NOW());l.meets.push({id:'m'+uid(),at:t,kind:f.mkind,place:f.mplace.trim(),status:'scheduled',token:null});addEv(l,'meet','Meeting scheduled: '+f.mplace.trim()+' on '+ft(t))}else addEv(l,'stage',f.type+' scheduled for '+ft(t));
 closeM();toast(f.type+' saved. Inactivity clock restarted','ok');render()};

/* ---- send confirmation link ---- */
mdef('send-confirm',{role:'agent'});
A.genlink=a=>{const l=leadById(a[0]);const m=l.meets.find(x=>x.id===a[1]);const tk=uid()+uid();S.tokens[tk]={lead:l.id,meet:m.id,exp:NOW()+24*HR,used:false,kind:m.kind,client:l.name,agent:l.owner,place:m.place||'Online',phone:norm(l.phone)};m.token=tk;m.status='link-sent';UI.mf.tok=tk;addEv(l,'meet','Confirmation link created (expires in 24 hours)');renderOverlay()};

/* ---- escalate / archive / dnd / note / blocked / doc upload ---- */
mdef('escalate',{role:'agent',init:()=>({kind:'',txt:''})});
A.escsave=a=>{const l=leadById(a[0]),f=UI.mf,e={};if(!f.kind)e.kind='Choose a reason.';if(!(f.txt||'').trim())e.txt='Add some detail.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 l.esc={reason:f.kind+': '+f.txt.trim(),at:NOW(),status:'open',by:me().id};addEv(l,'warn','Escalated to manager: '+f.kind);notify(teamById(me().team).mgr,{t:'Escalation from '+me().name,d:'LEAD-'+l.id+': '+f.kind,go:'mgmt-leads-esc',ic:'flag'});closeM();toast('Sent to your manager','ok');render()};
mdef('archive',{role:'agent',init:()=>({why:'',txt:''})});
A.archsave=a=>{const l=leadById(a[0]),f=UI.mf;if(!f.why){UI.mf._e={why:'Choose a reason.'};renderOverlay();return}l.archived=true;l.archReason=f.why+(f.txt?': '+f.txt:'');l.disp='Not interested';stageSet(l,'Lost');addEv(l,'stage','Lead archived: '+l.archReason);audit('Lead archived','LEAD-'+l.id,'Active','Archived');closeM();toast('Lead archived','ok');go('agent-leads')};
mdef('dnd',{role:'agent'});
A.dndsave=a=>{const l=leadById(a[0]);l.dnd=true;l.archived=true;l.disp='DND';l.archReason='Client asked not to be called';S.dnd.unshift({no:l.phone,name:l.name,by:me().id,at:NOW(),reason:UI.mf.txt||'Client requested no calls'});addEv(l,'warn','Added to the Do Not Call list');audit('DND added',l.phone,'','Added by '+me().name);closeM();toast('Added to the Do Not Call list','ok');go('agent-leads')};
mdef('note',{role:'shared'});
A.notesave=a=>{const l=leadById(a[0]);if(!(UI.mf.txt||'').trim()){UI.mf._e={txt:'Write a note first.'};renderOverlay();return}addEv(l,'note','Note: '+UI.mf.txt.trim());if(S.session.role!=='agent'&&l.owner)notify(l.owner,{t:'Note on '+l.name,d:UI.mf.txt.trim().slice(0,80),go:'agent-lead-'+l.id,ic:'edit'});closeM();toast('Note saved','ok');render()};
mdef('blocked',{role:'agent'});
mdef('doc-upload',{role:'agent',init:()=>({kind:'',name:''})});
/* global listener: handled in React (src/app/events.ts) */
A.docsave=a=>{const l=leadById(a[0]),f=UI.mf,e={};if(!f.kind)e.kind='Choose the type.';if(!f.name)e.name='Choose a file.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}l.docs.push({id:'d'+uid(),name:f.name,kind:f.kind,by:me().id,at:NOW()});addEv(l,'doc','Document uploaded: '+f.kind);closeM();toast('Document uploaded','ok');render()};

/* ---- share project details ---- */
mdef('share',{role:'agent',init:a=>{const l=leadById(a[0]);const p=a[1]||(l.shortlist[0]?l.shortlist[0].p:'');return {p,ch:'WhatsApp',lang:l.arabic?'ar':'en'}}});
A.sharesave=a=>{const l=leadById(a[0]),f=UI.mf;if(!f.p){UI.mf._e={p:'Choose a project.'};renderOverlay();return}const p=projById(f.p);if(!l.shortlist.some(s=>s.p===p.id))l.shortlist.push({p:p.id,primary:!l.shortlist.length});addEv(l,'wa',f.ch+' sent: '+p.name+' details and brochure');closeM();toast(f.ch+' message prepared and logged','ok');render()};

/* ---- add lead (manual) with rule-based dedupe ---- */
mdef('add-lead',{role:'agent',init:()=>({name:'',cc:'+971',ph:'',email:'',src:'',txt:''})});
A.addlead=()=>{const f=UI.mf,u=me(),e={};const ph=norm(f.ph);if(!(f.name||'').trim())e.name='Enter the client name.';if(!f.src)e.src='Choose a source.';if(ph.length<7||ph.length>12)e.ph='Enter a valid phone number.';if(f.email&&!/^\S+@\S+\.\S+$/.test(f.email))e.email='This does not look like an email address.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 const full=f.cc+' '+f.ph.trim();const n=norm(f.cc)+ph;const camp='Manual · '+f.src;
 const dup=S.leads.filter(l=>norm(l.phone)===n);
 if(isDnd(full)){UI.mf._res={title:'Number is on the Do Not Call list',kind:'err',text:'This client asked not to be contacted. The lead was not created.'};renderOverlay();return}
 const same=dup.find(l=>l.camp===camp);
 if(same){UI.mf._res={title:'Duplicate discarded',kind:'warn',text:'LEAD-'+same.id+' already exists with this number from the same source. Nothing was created.'+(same.owner===u.id?' It is on your list.':'')};renderOverlay();return}
 const c=capInfo(u.id);
 const id=String(Math.max(...S.leads.map(l=>+l.id).filter(x=>x<9000&&x>5600),5600)+1);
 const orig=dup.find(l=>l.owner&&!l.archived);
 const L0=Object.assign({id,name:f.name.trim(),phone:full,email:f.email||f.name.trim().toLowerCase().replace(/[^a-z]+/g,'.')+'@example.com',country:f.cc==='+971'?'UAE':f.cc==='+91'?'India':f.cc==='+65'?'Singapore':f.cc==='+966'?'KSA':'Other',city:'',src:f.src,camp,dir:'Outbound',cur:'AED',track:null,temp:null,disp:null,stage:'New',owner:null,assigned:null,lastCommit:null,hold:null,esc:null,budget:null,ptype:null,timeline:null,payment:null,purpose:null,visa:null,arabic:false,linked:dup.length?dup[0].id:null,attempts:0,qualified:false,shortlist:[],next:null,own:[],ev:[],calls:[],meets:[],docs:[],archived:false,dnd:false,wrong:false,created:NOW()});
 S.leads.push(L0);addEv(L0,'sys',(dup.length?'Created as linked lead: same number as LEAD-'+dup[0].id+', different campaign':'Added manually by '+u.name+' ('+f.src+')'),{},u.id);if(f.txt)addEv(L0,'note','Note: '+f.txt,{},u.id);
 let r;if(orig&&orig.owner!==u.id){const ro=reassign(L0,orig.owner,'Linked lead stays with the original agent',u.id);r=ro.err?{title:'Linked lead created in the Admin pool',kind:'warn',text:'LEAD-'+orig.id+' is active with '+uname(orig.owner)+' who is at their ceiling. The new lead went to the Admin pool.',lead:null}:{title:'Linked lead created',kind:'info',text:'This number is already an active lead with '+uname(orig.owner)+' (LEAD-'+orig.id+'). The new lead was linked and assigned to them. Admin can override per project.',lead:null};if(ro.err){}}
 else if(c.full){UI.mf._res={title:'Lead saved to the Admin pool',kind:'warn',text:'You are at your ceiling ('+c.used+'/'+c.cap+'), so the lead could not be assigned to you. Admin will place it.'};renderOverlay();return}
 else{reassign(L0,u.id,'Added by agent',u.id);r={title:dup.length?'Added as a linked lead':'Lead added',kind:'ok',text:dup.length?'Another lead shares this number from a different campaign. This one is linked to LEAD-'+dup[0].id+' and assigned to you.':'LEAD-'+id+' is on your list. Add a first follow-up to keep it active.',lead:id}}
 UI.mf._res=r;pushActivity(u.id,'Lead added',L0,'','');renderOverlay();render()};

/* ===== agent: home, schedule, catalogue, project, bookings ===== */

const PLANS={'50/50':[['Booking deposit',10],['On SPA signing',10],['Construction 25%',10],['Construction 50%',20],['Handover',50]],'80/20':[['Booking deposit',10],['On SPA signing',10],['Construction 40%',30],['Construction 80%',30],['Handover',20]],def:[['Booking deposit',10],['On SPA signing',10],['Construction 30%',20],['Construction 60%',20],['Handover',40]]};
const planRows=(price,plan)=>{const k=String(plan||'').slice(0,5);return (PLANS[k]||PLANS.def).map(([n,p])=>({n,pct:p,amt:Math.round(price*p/100)}))};
A.leadsview=a=>{UI.f.lv=a[0];go('agent-leads')};

def('agent-home',{role:'agent',level:'L1',title:'Home Dashboard',nav:'agent-home',sample:[[]]});

def('agent-schedule',{role:'agent',level:'L2',title:"Today's schedule",nav:'agent-home',sample:[[]],crumb:()=>[{l:'Home Dashboard',go:'agent-home'},{l:"Today's schedule"}]});

/* ---------------- catalogue & project ---------------- */
['agent','mgmt'].forEach(role=>{def(role+(role==='agent'?'-catalogue':'-projects'),{role,level:'L1',title:role==='agent'?'Project Catalogue':'Projects',sample:[[]]})});
function projectPage(role,p){const pr=projById(p[0]);if(!pr)return card('',empty('building','Project not found','No project with that ID.',btn({t:'Back',go:role==='agent'?'agent-catalogue':role+'-projects',cls:'pri'})));
 const u=me(),sl=role==='agent'?slabOf(u):null;const f=UI.f.uf||'all';const ul=pr.units.filter(x=>f==='all'||x.status===f);
 const pay=`<div class="col g6"><div class="row sb"><span class="muted">Payment plan</span><b>${esc(pr.plan)}</b></div><div class="row sb"><span class="muted">Handover</span><b>${esc(pr.ho)}</b></div><div class="row sb"><span class="muted">RERA</span><b>${esc(pr.rera)}</b></div>${role==='agent'?`<div class="row sb"><span class="muted">Developer commission</span><b>${pr.comm}%</b></div><div class="row sb"><span class="muted">Your slab pays</span><b>${sl?sl.rate+'% of that = '+(+(pr.comm*sl.rate/100).toFixed(3))+'% of price':'No slab assigned'}</b></div>`:''}</div>`;
 const unitRows=ul.map(x=>{const holdMine=x.holdBy===u.id;return `<tr><td><b>${x.id}</b></td><td>${esc(x.type)}</td><td class="num">${nf(x.size)} sqft</td><td class="num">${mfull(x.price)}</td><td>${unitChip(x.status)}${x.status==='Held'?`<div class="xs faint">${role==='admin'||holdMine?'by '+esc(uname(x.holdBy))+', ':''}until ${fts(x.holdUntil)}</div>`:''}</td><td class="tr"><div class="row g6 end" style="flex-wrap:nowrap"><button class="btn s" type="button" data-open="payment|${pr.id}|${x.id}">Payment plan</button>${role==='agent'?(x.status==='Available'?`<button class="btn s pri" type="button" data-open="pick-lead|${pr.id}|${x.id}">Book</button>`:x.status==='Held'||x.status==='Booked'?`<button class="btn s" type="button" data-open="avail|${pr.id}|${x.id}">Request availability</button>`:''):''}${role==='admin'?`<button class="btn s" type="button" data-open="unit-edit|${pr.id}|${x.id}">Edit</button>`:''}</div></td></tr>`}).join('');
 return `<div class="card flat mb16"><div class="proj"><div class="img i${pr.img}" style="height:160px"><span class="chip s3" style="background:rgba(255,255,255,.9)">${esc(pr.status)}</span></div><div class="pb"><div class="row sb wrap"><h1 class="h1" style="font-size:28px">${esc(pr.name)}</h1><div class="row g6 wrap">${role==='agent'?`<button class="btn" type="button" data-open="shortlist-add|${pr.id}">${ic('plus',16)}Add to a lead</button>`:''}${role==='admin'?`<button class="btn pri" type="button" data-open="project-edit|${pr.id}">${ic('edit',16)}Edit project</button>`:''}</div></div><div class="muted">${esc(pr.area)}, ${esc(pr.city)} · ${esc(pr.dev)} · ${esc(pr.type)}</div><p>${esc(pr.desc)}</p><div class="row g6 wrap">${pr.amen.map(x=>tag(x)).join('')}</div></div></div></div>`+
 `<div class="grid g21 mb16">${card('Units',`<div class="row sb wrap g6" style="padding:14px 20px 0"><div class="seg">${[['all','All'],['Available','Available'],['Held','Held'],['Booked','Booked'],['Sold','Sold']].map(([k,t])=>`<button type="button" class="${f===k?'on':''}" data-act="ui|uf|${k}">${t}</button>`).join('')}</div>${role==='admin'?`<button class="btn s" type="button" data-open="unit-edit|${pr.id}">${ic('plus',16)}Add unit</button>`:''}</div>${ul.length?`<div class="tw mt16"><table class="tbl"><thead><tr><th>Unit</th><th>Type</th><th class="num">Size</th><th class="num">Price</th><th>Status</th><th></th></tr></thead><tbody>${unitRows}</tbody></table></div>`:empty('building','No units in this view','Change the filter.')}`,{bare:true})}${card('Plan and terms',pay)}</div>`+
 (role==='admin'?card('Last updated',`${esc(uname(pr.upd[0]))} · ${ft(pr.upd[1])}`):'')}
[['agent','agent-catalogue'],['mgmt','mgmt-projects'],['admin','admin-projects']].forEach(([role,back])=>def(role+'-project',{role,level:'L2',title:'Project detail',nav:back,sample:[['p1'],['p2'],['zz']],crumb:p=>[{l:role==='agent'?'Project Catalogue':role==='mgmt'?'Projects':'Projects & Properties',go:back},{l:projById(p[0])?projById(p[0]).name:'Project'}]}));
mdef('payment',{role:'agent'});
mdef('avail',{role:'agent',init:()=>({txt:''})});
A.availsave=a=>{notify('admin',{t:'Availability request for '+a[1],d:me().name+': '+(UI.mf.txt||'Waiting for the unit'),go:'admin-projects',ic:'building'});audit('Availability requested',a[1],'',me().name);closeM();toast('Request sent to Admin','ok')};
mdef('shortlist-add',{role:'agent',init:()=>({lead:''})});
A.shortsave=a=>{if(!UI.mf.lead){UI.mf._e={lead:'Choose a lead.'};renderOverlay();return}const l=leadById(UI.mf.lead);l.shortlist.push({p:a[0],primary:!l.shortlist.length});if(['New','Contacted','Qualified'].includes(l.stage)&&l.qualified)stageSet(l,'Shortlisted');addEv(l,'stage','Shortlisted '+projById(a[0]).name);closeM();toast('Added to '+l.name+"'s shortlist",'ok');render()};
mdef('pick-lead',{role:'agent',init:()=>({lead:''})});
A.picksave=a=>{if(!UI.mf.lead){UI.mf._e={lead:'Choose a lead.'};renderOverlay();return}const l=UI.mf.lead;closeM();go('agent-bookingnew-'+l+'-'+a[0]+'-'+a[1])};

/* ---------------- bookings list ---------------- */
def('agent-bookings',{role:'agent',level:'L1',title:'Bookings',sample:[[]]});

/* ---------------- new booking ---------------- */
def('agent-bookingnew',{role:'agent',level:'L2',title:'New booking',nav:'agent-bookings',sample:[[],['1036','p2','U-4102']],crumb:()=>[{l:'Bookings',go:'agent-bookings'},{l:'New booking'}]});
/* global listener: handled in React (src/app/events.ts) */
A.booksave=()=>{const u=me(),e={},p=(parse(hashOf())||{params:[]}).params;const lead=pfv('lead',p[0]||''),proj=pfv('proj',p[1]||'');let unit=pfv('unit',p[2]||'');const pr=proj?projById(proj):null;const un=pr&&pr.units.find(x=>x.id===unit&&(x.status==='Available'||x.holdBy===u.id));
 if(!lead)e.lead='Choose the client.';if(!proj)e.proj='Choose a project.';if(proj&&!un)e.unit='Choose an available unit.';const price=+pfv('price',un?un.price:''),dep=+pfv('dep',un?Math.round(un.price*.1):'');if(!(price>0))e.price='Enter the agreed price.';if(!(dep>0))e.dep='Enter the deposit paid.';else if(price&&dep>price)e.dep='Deposit cannot exceed the price.';if(!pfv('f_form'))e.f_form='Upload the signed booking form.';if(!pfv('f_receipt'))e.f_receipt='Upload the deposit receipt.';
 if(holdsOf(u.id)>=S.set.holdCap)e.lead='You have reached the hold limit.';
 if(Object.keys(e).length){UI.pf._e=e;render();return}
 const n=Math.max(...S.bookings.map(b=>+b.id.slice(4)))+1,id='BKG-'+n;const D=(s,name)=>({s,name:name||null,at:s==='missing'?null:NOW()});
 S.bookings.unshift({id,lead,agent:u.id,project:proj,unit:un.id,type:un.type,price,cur:'AED',plan:pfv('plan',pr.plan),depAmt:dep,depMode:pfv('mode','Bank transfer'),offer:pfv('offer'),notes:'',status:'pending',reason:'',docs:{form:D('uploaded',pfv('f_form')),receipt:D('uploaded',pfv('f_receipt')),spa:D('missing'),dld:D('missing'),oqood:D('missing')},spaIssued:null,submitted:NOW(),hist:[['Submitted for Admin review',u.id,NOW()]],miles:[],paidPct:0,devInv:null,devRec:null,incRel:null,adj:0,adjNote:'',holdUntil:NOW()+S.set.holdHours*HR});
 const l=leadById(lead);stageSet(l,'Booking submitted');addEv(l,'doc','Booking '+id+' submitted for Admin review ('+un.id+', '+mfull(price)+')');if(!l.shortlist.some(s=>s.p===proj))l.shortlist.push({p:proj,primary:!l.shortlist.length});
 syncUnits();notify('admin',{t:'New booking to review',d:id+' · '+un.id+' · '+u.name,go:'admin-booking-'+bkP(id),ic:'file'});audit('Booking submitted',id,'',un.id+' held for '+S.set.holdHours+'h');UI.pf={};toast('Submitted. '+un.id+' is held for '+S.set.holdHours+' hours','ok');go('agent-booking-'+bkP(id))};

/* ---------------- booking detail (agent, mgmt read-only) ---------------- */
const DOCN={form:'Developer booking form',receipt:'Deposit receipt',spa:'Signed SPA',dld:'4% DLD fee and Oqood fee receipt',oqood:'Oqood certificate'};


['agent','mgmt'].forEach(role=>def(role+'-booking',{role,level:'L2',title:'Booking detail',nav:role+'-bookings',sample:[['bk10021'],['bk10018'],['bk10014'],['bk10009'],['bk10002'],['bk10003'],['bk10006'],['bk99999']],crumb:p=>[{l:'Bookings',go:role+'-bookings'},{l:bkF(p[0])}]}));
mdef('bk-spa',{role:'agent',init:()=>({d:dtl(NOW()).slice(0,10)})});
A.spasave=a=>{const b=bkById(a[0]);const t=Date.parse(UI.mf.d+'T10:00:00+04:00');if(!UI.mf.d||isNaN(t)||t>NOW()){UI.mf._e={d:'Choose today or an earlier date.'};renderOverlay();return}b.spaIssued=t;b.hist.push(['SPA issued by developer',me().id,NOW()]);closeM();toast('SPA marked as issued','ok');render()};
mdef('bk-doc',{role:'agent',init:()=>({name:''})});
A.bkdocsave=a=>{if(!UI.mf.name){UI.mf._e={name:'Choose a file.'};renderOverlay();return}const b=bkById(a[0]);b.docs[a[1]]={s:'uploaded',name:UI.mf.name,at:NOW()};b.hist.push([DOCN[a[1]]+' uploaded',me().id,NOW()]);notify('admin',{t:'Document to review',d:b.id+': '+DOCN[a[1]],go:'admin-booking-'+bkP(b.id),ic:'file'});closeM();toast('Uploaded. Admin will review it','ok');render()};
mdef('bk-resubmit',{role:'agent',init:()=>({txt:''})});
A.resubsave=a=>{const b=bkById(a[0]);if(Object.values(b.docs).some(d=>d.s==='rejected')){UI.mf._e={txt:'Re-upload the rejected document first.'};renderOverlay();return}if(!(UI.mf.txt||'').trim()){UI.mf._e={txt:'Tell Admin what changed.'};renderOverlay();return}b.status='pending';b.reason='';b.hist.push(['Resubmitted: '+UI.mf.txt.trim(),me().id,NOW()]);notify('admin',{t:'Booking resubmitted',d:b.id,go:'admin-booking-'+bkP(b.id),ic:'file'});closeM();toast('Resubmitted for review','ok');render()};

/* ===== agent: convertible notes, secondary, attendance, performance, leaderboard ===== */
const addMonths=(t,n)=>{const d=new Date(t);d.setUTCMonth(d.getUTCMonth()+n);return d.getTime()};
const CNDOCS=[['kyc','KYC: passport or Emirates ID'],['nominee','Nominee details'],['bank','Payout bank details'],['agreement','Signed agreement'],['pdc','PDC register'],['receipt','Registration payment receipt']];
function cnCalc(principal,start){const m=Math.round(principal*S.set.cn.rate/100),n=S.set.cn.tenure;const rows=[];let cum=0;for(let i=1;i<=n;i++){cum+=m;rows.push({n:i,due:addMonths(start,i),amt:m,cum})}return {m,rows,total:m*n,ret:principal+m*n,n}}
const toAed=(v,cur)=>cur==='INR'?v/S.set.fx:v;
const noteStat=n=>{const ps=n.payouts;const bad=ps.some(p=>p.status==='bounced'),over=ps.some(p=>p.status==='overdue');return bad?['Payout bounced','s7']:over?['Payout overdue','s7']:ps.some(p=>p.status==='due')?['Payout due','s5']:['On track','s6']};
const nextPay=n=>n.payouts.filter(p=>['due','upcoming','overdue','bounced'].includes(p.status))[0];
def('agent-cn',{role:'agent',level:'L1',title:'Convertible Notes',sample:[[]]});
def('agent-cncalc',{role:'agent',level:'L2',title:'Note calculator',nav:'agent-cn',sample:[[],['2047']],crumb:()=>[{l:'Convertible Notes',go:'agent-cn'},{l:'Calculator'}]});
Object.assign(A,{cnlog(a){const l=leadById(a[0]);addEv(l,'wa','Convertible Note illustration shared: '+mfull(+a[1],a[2])+', '+S.set.cn.tenure+' months');if(l.cn&&l.cn.stage==='Qualified')l.cn.stage='Information shared';if(l.cn){l.cn.amount=+a[1];l.cn.cur=a[2]}toast('Logged as sent','ok');render()}});
A.page=a=>{if(a[0]==='pgx'){UI.pf.pg=Math.max(1,+a[1]);render();return}UI.pg[a[0]]=Math.max(1,+a[1]);render()};

/* application */
def('agent-cnapp',{role:'agent',level:'L2',title:'Note application',nav:'agent-cn',sample:[['2047'],['2049'],['2050'],['1033']],crumb:p=>[{l:'Convertible Notes',go:'agent-cn'},{l:leadById(p[0])?leadById(p[0]).name:'Application'}]});
Object.assign(A,{cnstart(a){const l=leadById(a[0]);l.cn.stage='Documents';addEv(l,'stage','Convertible Note: collecting documents');toast('Document collection started');render()},
 cnsubmit(a){const l=leadById(a[0]);if(!CNDOCS.every(([k])=>l.cn[k])){toast('Missing documents','err');return}l.cn.stage='Admin review';l.cn.adminState='pending';l.cn.submitted=NOW();l.cn.adminNote='';addEv(l,'doc','Convertible Note application submitted for Admin review ('+mfull(l.cn.amount,l.cn.cur)+')');notify('admin',{t:'Note application to review',d:l.name+' · '+mfull(l.cn.amount,l.cn.cur),go:'admin-cn',ic:'clip'});toast('Submitted to Admin','ok');render()}});
mdef('cn-share',{role:'agent'});
A.cnshare=a=>{const l=leadById(a[0]);l.cn.stage='Information shared';addEv(l,'wa','WhatsApp sent: Convertible Note terms and payout schedule');closeM();toast('Sent and logged','ok');render()};
mdef('cn-commit',{role:'agent',init:a=>{const l=leadById(a[0]);return {amt:String(l.cn.amount),cur:l.cn.cur,ok:false}}});
A.cncommit=a=>{const l=leadById(a[0]),f=UI.mf,e={};if(!(+f.amt>0))e.amt='Enter the amount.';if(!f.ok)e.ok='Confirm the client understands the terms.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}l.cn.amount=+f.amt;l.cn.cur=f.cur;l.cn.stage='Interested';l.cur=f.cur;addEv(l,'stage','Convertible Note: client confirmed '+mfull(+f.amt,f.cur));closeM();toast('Saved. Start collecting documents','ok');render()};
mdef('cn-doc',{role:'agent',init:()=>({name:''})});
A.cndoc=a=>{if(!UI.mf.name){UI.mf._e={name:'Choose a file.'};renderOverlay();return}const l=leadById(a[0]);l.cn[a[1]]=UI.mf.name;addEv(l,'doc','Convertible Note document received: '+CNDOCS.find(x=>x[0]===a[1])[1]);closeM();toast('Received','ok');render()};
mdef('cn-pdc',{role:'agent',init:()=>({bank:'',first:'',n:String(S.set.cn.tenure)})});
A.cnpdc=a=>{const f=UI.mf,e={};if(!(f.bank||'').trim())e.bank='Enter the bank.';if(!(f.first||'').trim())e.first='Enter the first cheque number.';if(+f.n!==S.set.cn.tenure)e.n='You need exactly '+S.set.cn.tenure+' cheques.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}const l=leadById(a[0]);l.cn.pdc=f.bank+' from '+f.first;addEv(l,'doc','PDC register captured: '+f.n+' cheques, '+f.bank);closeM();toast('PDC register saved','ok');render()};

/* note detail */

['agent','admin'].forEach(role=>def(role+'-cnnote',{role,level:'L2',title:'Note detail',nav:role+'-cn',sample:[['cn20260041'],['cn20260040'],['zz']],crumb:p=>[{l:'Convertible Notes',go:role+'-cn'},{l:noteF(p[0])}]}));

/* ---------------- secondary market ---------------- */
const SECS={Requested:'s5',Active:'s6','Follow-up':'s1',Matched:'s4',Negotiation:'s3',Closed:'s6',Lost:'s2',Declined:'s7'};
function secList(role){const u=me();return role==='agent'?S.sec.filter(s=>s.raised===u.id||s.owner===u.id||s.kind==='seller'&&s.status==='Active'):role==='mgmt'?S.sec.filter(s=>teamOf(s.raised)===u.team||teamOf(s.owner)===u.team):S.sec}
def('agent-secondary',{role:'agent',level:'L1',title:'Secondary Market',sample:[[]]});


[['agent','agent-secondary'],['mgmt','mgmt-secondary'],['admin','admin-secondary']].forEach(([role,back])=>def(role+'-sec',{role,level:'L2',title:'Secondary request',nav:back,sample:[['sm101'],['sm202'],['zz']],crumb:p=>[{l:'Secondary Market',go:back},{l:secF(p[0])}]}));
mdef('sec-req',{role:'agent',init:()=>({kind:'buyer',lead:'',name:'',prop:'',loc:'',min:'',max:'',ask:'',docs:''})});
/* global listener: handled in React (src/app/events.ts) */
A.secsave=()=>{const f=UI.mf,e={};if(!(f.name||'').trim())e.name='Enter a name.';if(!(f.prop||'').trim())e.prop='Describe it.';if(!(f.loc||'').trim())e.loc='Enter a location.';if(f.kind==='buyer'){if(!(+f.min>0))e.min='Enter a minimum.';if(!(+f.max>=+f.min))e.max='Maximum must be at least the minimum.'}else{if(!(+f.ask>0))e.ask='Enter the asking price.';if(!f.docs)e.docs='Upload ownership proof.'}
 if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}const n=Math.max(...S.sec.map(s=>+s.id.slice(3)))+1;const id='SM-'+n;S.sec.unshift({id,kind:f.kind,lead:f.lead||null,raised:me().id,name:f.name.trim(),prop:f.prop.trim(),loc:f.loc.trim(),budget:f.kind==='buyer'?[+f.min,+f.max]:null,ask:f.kind==='seller'?+f.ask:null,cur:'AED',status:'Requested',owner:null,comm:null,docs:f.docs?[f.docs]:[],hist:[['Request raised',me().id,NOW()]],matches:[]});if(f.lead){const l=leadById(f.lead);addEv(l,'stage','Routed to Secondary Market (request '+id+')');l.track='secondary'}
 notify('admin',{t:'Secondary request to review',d:id+' · '+f.prop,go:'admin-sec-'+secP(id),ic:'store'});closeM();toast(id+' sent to Admin','ok');go('agent-sec-'+secP(id))};
mdef('sec-status',{role:'agent',init:a=>({st:secById(a[0]).status,txt:''})});
A.secstat=a=>{const s=secById(a[0]);if(!(UI.mf.txt||'').trim()){UI.mf._e={txt:'Add a short note.'};renderOverlay();return}s.status=UI.mf.st;s.hist.push([UI.mf.st+': '+UI.mf.txt.trim(),me().id,NOW()]);notify('admin',{t:s.id+' is now '+UI.mf.st,d:UI.mf.txt.trim(),go:'admin-sec-'+secP(s.id),ic:'store'});closeM();toast('Status updated','ok');render()};

/* ---------------- attendance and leave ---------------- */
def('agent-attendance',{role:'agent',level:'L1',title:'Attendance',sample:[[]]});
mdef('regularise',{role:'agent',init:a=>({why:'',tin:'',tout:''})});
A.regsave=a=>{const f=UI.mf;if(!(f.why||'').trim()){UI.mf._e={why:'Tell your manager what happened.'};renderOverlay();return}const u=me();S.reg.push({id:'rg'+uid(),user:u.id,date:+a[0],reason:f.why.trim(),in:f.tin?Date.parse(dtl(+a[0]).slice(0,10)+'T'+f.tin+':00+04:00'):null,out:f.tout?Date.parse(dtl(+a[0]).slice(0,10)+'T'+f.tout+':00+04:00'):null,status:'pending'});notify(u.role==='mgmt'?'admin':teamById(u.team).mgr,{t:'Regularisation request',d:u.name+': '+f.why.trim().slice(0,60),go:u.role==='mgmt'?'admin-hr-reg':'mgmt-attendance',ic:'cal'});closeM();toast(u.role==='mgmt'?'Sent to Admin':'Sent to your manager','ok');render()};
mdef('leave-req',{role:'agent',init:()=>({type:'',from:'',to:'',why:''})});
A.leavesave=()=>{const f=UI.mf,u=me(),e={};if(!f.type)e.type='Choose a type.';const a=f.from?Date.parse(f.from+'T00:00:00+04:00'):NaN,b=f.to?Date.parse(f.to+'T00:00:00+04:00'):NaN;if(isNaN(a))e.from='Choose a start date.';if(isNaN(b))e.to='Choose an end date.';else if(!isNaN(a)&&b<a)e.to='End date is before the start.';if(!isNaN(a)&&a<startOfDay(NOW())-7*DAY)e.from='Leave can start at most 7 days in the past.';if(!(f.why||'').trim())e.why='Add a reason.';
 if(!isNaN(a)&&!isNaN(b)&&S.leave.some(l=>l.user===u.id&&['pending','approved'].includes(l.status)&&a<=l.to&&b>=l.from))e.from=e.from||'You already have leave on these dates.';
 if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}const days=Math.round((b-a)/DAY)+1;S.leave.push({id:'lv'+uid(),user:u.id,type:f.type,from:a,to:b,days,reason:f.why.trim(),status:'pending',at:NOW()});notify(u.role==='mgmt'?'admin':teamById(u.team).mgr,{t:'Leave request',d:u.name+' · '+f.type+' · '+days+' day'+(days>1?'s':'')+' from '+fds(a),go:u.role==='mgmt'?'admin-hr-leave':'mgmt-leave',ic:'cal'});closeM();toast(u.role==='mgmt'?'Sent to Admin':'Sent to your manager','ok');render()};
A.leavecancel=a=>{const l=S.leave.find(x=>x.id===a[0]);l.status='cancelled';toast('Request cancelled');render()};

/* ---------------- performance & leaderboard ---------------- */
function perfOf(uid){const b=(S.base&&S.base[uid])||{calls:0,meet:0,fu:0};const live=S.leads.reduce((n,l)=>n+l.calls.filter(c=>c.live&&c.by===uid).length,0);return {calls:b.calls+live,meet:b.meet,fu:b.fu+S.leads.filter(l=>l.owner===uid&&l.next&&l.next.done).length}}
def('agent-performance',{role:'agent',level:'L1',title:'Performance',sample:[[]]});
def('agent-leaderboard',{role:'agent',level:'L1',title:'Leaderboard',sample:[[]]});

/* ===== management screens ===== */
const myTeam=()=>agentsOf(me().team);
const teamIds=()=>myTeam().map(a=>a.id);
const todayStat=id=>{const ta=S.todayAtt[id];if(ta)return ta.st;const p=punchState(id);return p.in?'Present':'Not in yet'};
const TST={Present:'s6',Late:'s5',Absent:'s7','On leave':'s4','Not in yet':'s2'};
const teamBookings=()=>S.bookings.filter(b=>teamIds().includes(b.agent));
const teamRev=()=>sum(myTeam(),a=>revOf(a.id));
const teamEsc=()=>escalationsFor(me());

def('mgmt-home',{role:'mgmt',level:'L1',title:'Home Dashboard',nav:'mgmt-home',sample:[[]]});

/* ---- team leads + escalations ---- */
def('mgmt-leads',{role:'mgmt',level:'L1',title:'Team Leads',nav:'mgmt-leads',sample:[[],['esc']]});
mdef('esc-respond',{role:'mgmt',init:()=>({dec:'',txt:''})});
A.escreply=a=>{const l=leadById(a[0]),f=UI.mf,e={};if(!f.dec)e.dec='Choose a decision.';if(!(f.txt||'').trim())e.txt='Write a reply.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 l.esc.status=f.dec==='Need more information'?'open':'resolved';l.esc.resp=f.dec+': '+f.txt.trim();l.esc.resAt=NOW();addEv(l,'note','Manager reply: '+l.esc.resp);notify(l.owner,{t:'Manager replied: '+f.dec,d:f.txt.trim().slice(0,80),go:'agent-lead-'+l.id,ic:'flag'});audit('Escalation answered','LEAD-'+l.id,'Open',f.dec);closeM();toast('Reply sent to '+uname(l.owner),'ok');render()};

/* ---- reassign / hold / nudge (mgmt and admin) ---- */
mdef('reassign',{role:'shared',init:a=>({to:'',why:''})});
A.reassave=a=>{const l=leadById(a[0]),f=UI.mf,e={};if(!f.to)e.to='Choose who gets this lead.';if(!(f.why||'').trim())e.why='Add a reason.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}const r=reassign(l,f.to==='pool'?null:f.to,f.why.trim());if(r.err){UI.mf._e={to:r.msg};renderOverlay();return}closeM();toast('Lead moved to '+(f.to==='pool'?'the Admin pool':uname(f.to)),'ok');render()};
mdef('hold',{role:'mgmt',init:()=>({why:''})});
A.holdsave=a=>{const l=leadById(a[0]);if(!(UI.mf.why||'').trim()){UI.mf._e={why:'A reason is required.'};renderOverlay();return}l.hold={by:me().id,reason:UI.mf.why.trim(),at:NOW()};addEv(l,'owner','Manager hold placed: '+UI.mf.why.trim());audit('Hold placed','LEAD-'+l.id,'Active','On hold');notify(l.owner,{t:'Lead on hold',d:l.name+': '+UI.mf.why.trim(),go:'agent-lead-'+l.id,ic:'clock'});closeM();toast('Lead on hold. Clock paused','ok');render()};
mdef('nudge',{role:'mgmt',init:()=>({msg:'Please schedule the next step on this lead today.',txt:''})});
A.nudgesave=a=>{const l=leadById(a[0]);const t=UI.mf.msg+(UI.mf.txt?' '+UI.mf.txt.trim():'');S.nudges.push({lead:l.id,by:me().id,at:NOW(),t});addEv(l,'note','Manager nudge: '+t);notify(l.owner,{t:'Nudge from '+me().name,d:t,go:'agent-lead-'+l.id,ic:'bell'});closeM();toast('Nudge sent','ok');render()};

/* ---- team activity ---- */
def('mgmt-activity',{role:'mgmt',level:'L1',title:'Team Activity',nav:'mgmt-activity',sample:[[]]});

/* ---- performance & MIS ---- */
def('mgmt-performance',{role:'mgmt',level:'L1',title:'Performance & MIS',nav:'mgmt-performance',sample:[[]]});
def('mgmt-agent',{role:'mgmt',level:'L2',title:'Agent detail',nav:'mgmt-home',sample:[['u10'],['u12'],['zz']],crumb:p=>[{l:'Home Dashboard',go:'mgmt-home'},{l:userById(p[0])?userById(p[0]).name:'Agent'}]});

/* ---- lead assignment (within team) ---- */
def('mgmt-assign',{role:'mgmt',level:'L1',title:'Lead Assignment',nav:'mgmt-assign',sample:[[]]});
A.selrow=a=>{const s=(UI.f.sel||'').split(',').filter(Boolean);const i=s.indexOf(a[0]);if(i>=0)s.splice(i,1);else s.push(a[0]);UI.f.sel=s.join(',');render()};
mdef('bulk-reassign',{role:'shared',init:()=>({to:'',why:''})});
A.bulksave=()=>{const f=UI.mf,e={};if(!f.to)e.to='Choose an agent.';if(!(f.why||'').trim())e.why='Add a reason.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}let ok=0,skip=0;(UI.f.sel||'').split(',').filter(Boolean).forEach(id=>{const l=leadById(id);if(l.owner===f.to)return;const r=reassign(l,f.to,f.why.trim());if(r.err)skip++;else ok++});UI.f.sel='';closeM();toast(ok+' moved'+(skip?', '+skip+' skipped (agent at ceiling)':''),skip?'err':'ok');render()};

/* ---- bookings, secondary (read-only) ---- */
def('mgmt-bookings',{role:'mgmt',level:'L1',title:'Bookings',nav:'mgmt-bookings',sample:[[]]});
def('mgmt-secondary',{role:'mgmt',level:'L1',title:'Secondary Market',nav:'mgmt-secondary',sample:[[]]});

/* ---- team attendance and leave ---- */
def('mgmt-attendance',{role:'mgmt',level:'L1',title:'Team Attendance',nav:'mgmt-attendance',sample:[[]]});
A.regdec=a=>{const r=S.reg.find(x=>x.id===a[0]);r.status=a[1];r.by=me().id;if(a[1]==='approved'){let row=S.att.find(x=>x.u===r.user&&x.date===r.date);if(!row){row={u:r.user,date:r.date,in:null,out:null,st:'Present',reg:null};S.att.push(row)}if(r.in)row.in=r.in;if(r.out)row.out=r.out;row.st='Present';row.reg='approved'}notify(r.user,{t:'Regularisation '+a[1],d:fds(r.date)+(r.note?': '+r.note:''),go:'agent-attendance',ic:'cal'});audit('Regularisation '+a[1],uname(r.user)+' '+fds(r.date),'Pending',cap1(a[1]));toast('Request '+a[1],'ok');closeM();render()};
mdef('reg-reject',{role:'mgmt',init:()=>({why:''})});
A.regrej=a=>{if(!(UI.mf.why||'').trim()){UI.mf._e={why:'Give a reason.'};renderOverlay();return}S.reg.find(x=>x.id===a[0]).note=UI.mf.why.trim();A.regdec([a[0],'rejected'])};
def('mgmt-leave',{role:'mgmt',level:'L1',title:'Team Leave',nav:'mgmt-leave',sample:[[]]});
A.leavedec=a=>{const x=S.leave.find(l=>l.id===a[0]);x.status=a[1];x.by=me().id;x.at=NOW();if(a[1]==='approved'&&sameDay(x.from,NOW()))S.todayAtt[x.user]={st:'On leave'};notify(x.user,{t:'Leave '+a[1],d:x.type+' · '+fds(x.from)+(x.note?'. '+x.note:''),go:'agent-attendance',ic:'cal'});audit('Leave '+a[1],uname(x.user)+' '+fds(x.from),'Pending',cap1(a[1]));closeM();toast('Leave '+a[1],'ok');render()};
mdef('leave-reject',{role:'mgmt',init:()=>({why:''})});
A.leaverej=a=>{if(!(UI.mf.why||'').trim()){UI.mf._e={why:'Give a reason.'};renderOverlay();return}S.leave.find(x=>x.id===a[0]).note=UI.mf.why.trim();A.leavedec([a[0],'rejected'])};
mdef('leave-apply',{role:'mgmt',init:()=>({who:'',type:'',from:'',to:'',why:''})});
A.leaveapply=()=>{const f=UI.mf,e={};if(!f.who)e.who='Choose an employee.';if(!f.type)e.type='Choose a type.';const a=f.from?Date.parse(f.from+'T00:00:00+04:00'):NaN,b=f.to?Date.parse(f.to+'T00:00:00+04:00'):NaN;if(isNaN(a))e.from='Choose a start date.';if(isNaN(b))e.to='Choose an end date.';else if(!isNaN(a)&&b<a)e.to='End date is before the start.';if(!(f.why||'').trim())e.why='Add a reason.';if(f.who&&!isNaN(a)&&!isNaN(b)&&S.leave.some(l=>l.user===f.who&&['pending','approved'].includes(l.status)&&a<=l.to&&b>=l.from))e.from=e.from||'This employee already has leave on these dates.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 const days=Math.round((b-a)/DAY)+1;S.leave.push({id:'lv'+uid(),user:f.who,type:f.type,from:a,to:b,days,reason:f.why.trim(),status:'approved',by:me().id,at:NOW()});notify(f.who,{t:'Leave applied for you',d:f.type+' · '+fds(a)+' by '+me().name,go:'agent-attendance',ic:'cal'});closeM();toast('Leave applied and approved','ok');render()};

/* ===== admin surface A: home, leads, import, assignment, people ===== */
const agentsAll=()=>S.users.filter(u=>u.role==='agent'&&u.status!=='removed');
const RT={booking:['Booking','s5'],doc:['Document','s1'],closure:['Closure','s6'],cn:['Convertible Note','s4'],sec:['Secondary','s3']};
function reviewGo(it){return it.type==='cn'?'admin-review-cn':it.type==='sec'?'admin-sec-'+secP(it.s.id):'admin-booking-'+bkP(it.b.id)}
function reviewTitle(it){return it.type==='booking'?'Booking '+it.b.id+' · unit '+it.b.unit:it.type==='doc'?DOCN[it.k]+' · '+it.b.id:it.type==='closure'?'Ready to close · '+it.b.id:it.type==='cn'?'Application · '+it.l.name+' · '+mfull(it.l.cn.amount,it.l.cn.cur):it.s.id+' · '+it.s.prop}
function reviewWho(it){return it.type==='cn'?uname(it.l.owner):it.type==='sec'?uname(it.s.raised):uname(it.b.agent)}
const flaggedCalls=()=>S.activity.filter(a=>a.flag).length;
const bouncedN=()=>S.notes.reduce((n,x)=>n+x.payouts.filter(p=>p.status==='bounced').length,0);

def('admin-home',{role:'admin',level:'L1',title:'Home Dashboard',nav:'admin-home',sample:[[]]});

/* ---------------- all leads ---------------- */
def('admin-leads',{role:'admin',level:'L1',title:'Leads',nav:'admin-leads',sample:[[]]});

/* ---------------- lead import ---------------- */
def('admin-import',{role:'admin',level:'L1',title:'Lead Import',nav:'admin-import',sample:[[]]});

const IMPCAMP=['Bulk upload · Expo lead list','Meta · Marina Views Sept','Google Ads · Palm Crest Launch','Instagram · Creekside Oct','Cold data · KSA batch'];
function impRows(camp){const rows=[];const same=S.leads.filter(l=>l.camp===camp&&!l.dnd).slice(0,2);const other=S.leads.filter(l=>l.camp!==camp&&l.owner&&!l.archived&&!l.dnd).slice(0,3);
 for(let i=0;i<12;i++)rows.push({n:['Aisha Rahman','Dmitri Volkov','Sunita Rao','Tomas Berg','Hassan Ali','Mei Lin','Carlos Ortega','Neelam Shah','Yusra Khan','Pavan Kumar','Elena Petrova','Faisal Noor'][i],p:'+971 55 '+(310+i)+' '+(4200+i*7)});
 same.forEach(l=>rows.push({n:l.name,p:l.phone}));other.forEach(l=>rows.push({n:l.name,p:l.phone}));
 rows.push({n:'Broken Row',p:'12345'});rows.push({n:'No Number',p:''});
 if(S.dnd[0])rows.push({n:S.dnd[0].name,p:S.dnd[0].no});
 rows.push({n:rows[0].n,p:rows[0].p});return rows}
function impClass(rows,camp){const seen=new Set();return rows.map(r=>{const n=norm(r.p);if(n.length<8||n.length>13)return Object.assign({k:'err',why:'Not a valid phone number'},r);if(isDnd(r.p))return Object.assign({k:'err',why:'On the Do Not Call list'},r);if(seen.has(n))return Object.assign({k:'dup',why:'Repeated in this file'},r);seen.add(n);const ex=S.leads.filter(l=>norm(l.phone)===n);if(ex.length){if(ex.some(l=>l.camp===camp))return Object.assign({k:'dup',why:'Already exists in the same campaign',ex:ex[0]},r);return Object.assign({k:'linked',why:'Exists in another campaign',ex:ex[0],orig:ex.find(l=>l.owner&&!l.archived)||null},r)}return Object.assign({k:'new',why:''},r)})}
def('admin-importnew',{role:'admin',level:'L2',title:'New import',nav:'admin-import',sample:[[]],crumb:()=>[{l:'Lead Import',go:'admin-import'},{l:'New import'}]});
A.impsample=()=>{UI.pf.file='Expo_lead_list_sample.csv';UI.pf.step=2;render()};
A.impnext=a=>{const n=+a[0];if(n===2&&!pfv('file')){UI.pf._e={file:'Choose a file or use the sample.'};render();return}UI.pf.step=n;render()};
A.imperr=()=>{const R_=impClass(impRows(pfv('camp','Bulk upload · Expo lead list')),pfv('camp','Bulk upload · Expo lead list')).filter(r=>r.k==='err');A.copy(['name,phone,reason\n'+R_.map(r=>[r.n,r.p,r.why].join(',')).join('\n')])};
A.impgo=()=>{const camp=pfv('camp','Bulk upload · Expo lead list');const R_=impClass(impRows(camp),camp);let id=Math.max(...S.leads.map(l=>+l.id).filter(x=>x<9000),6000);const res={ok:0,dup:0,linked:0,err:0};
 R_.forEach(r=>{if(r.k==='dup'){res.dup++;return}if(r.k==='err'){res.err++;return}id++;const L0={id:String(id),name:r.n,phone:r.p,email:r.n.toLowerCase().replace(/[^a-z]+/g,'.')+'@example.com',country:'UAE',city:'',src:'Bulk upload',camp,dir:'Inbound',cur:'AED',track:null,temp:null,disp:null,stage:'New',owner:null,assigned:null,lastCommit:null,hold:null,esc:null,budget:null,ptype:null,timeline:null,payment:null,purpose:null,visa:null,arabic:false,linked:r.k==='linked'?r.ex.id:null,attempts:0,qualified:false,shortlist:[],next:null,own:[],ev:[],calls:[],meets:[],docs:[],archived:false,dnd:false,wrong:false,created:NOW()};S.leads.push(L0);addEv(L0,'sys',r.k==='linked'?'Created as linked lead: same number as LEAD-'+r.ex.id+', different campaign':'Imported from '+pfv('file','sample file'),{},me().id);
  if(r.k==='linked'){res.linked++;if(r.orig){const x=reassign(L0,r.orig.owner,'Linked lead stays with the original agent',me().id);if(x.err)addEv(L0,'sys','Original agent is at the ceiling, left in the pool',{},'system')}}else res.ok++});
 S.imports.unshift({id:'imp'+uid(),file:pfv('file','sample.csv'),at:NOW(),by:me().id,total:R_.length,ok:res.ok,dup:res.dup,linked:res.linked,err:res.err,camp});audit('Lead import',pfv('file','sample.csv'),'',res.ok+' new, '+res.dup+' discarded, '+res.linked+' linked, '+res.err+' errors');UI.pf.result=res;UI.pf.step=4;toast('Import finished','ok');render()};

/* ---------------- assignments ---------------- */
def('admin-assign',{role:'admin',level:'L1',title:'Assignments',nav:'admin-assign',sample:[[]]});
mdef('autodist',{role:'admin',init:()=>({tm:'all',scope:'all'})});
A.distsave=()=>{const f=UI.mf;const sel_=(UI.f.sel||'').split(',').filter(Boolean);const ls=(f.scope==='sel'?sel_.map(leadById):poolLeads()).filter(l=>l&&!l.owner);let ag=agentsAll().filter(a=>a.status==='active'&&(f.tm==='all'||a.team===f.tm));let i=0,ok=0;
 ls.forEach(l=>{for(let k=0;k<ag.length;k++){const a=ag[(i+k)%ag.length];if(!capInfo(a.id).full){const r=reassign(l,a.id,'Spread evenly by Admin',me().id);if(!r.err){ok++;i=(i+k+1)%ag.length;return}}}});
 audit('Leads spread evenly','Pool','',ok+' leads');UI.f.sel='';closeM();toast(ok+' lead'+(ok===1?'':'s')+' assigned'+(ok<ls.length?', '+(ls.length-ok)+' left in the pool':''),ok<ls.length?'err':'ok');render()};

/* ---------------- people and teams ---------------- */
const USTAT={active:['Active','s6'],invited:['Invited','s5'],removed:['Deactivated','s2']};
const ROLEN={agent:'Agent',mgmt:'Management',admin:'Admin'};
def('admin-people',{role:'admin',level:'L1',title:'People & Teams',nav:'admin-people',sample:[[],['teams']]});
def('admin-user',{role:'admin',level:'L2',title:'Person',nav:'admin-people',sample:[['u10'],['u13'],['u17'],['u2'],['zz']],crumb:p=>[{l:'People & Teams',go:'admin-people'},{l:userById(p[0])?userById(p[0]).name:'Person'}]});
mdef('user-form',{role:'admin',init:a=>{const u=a[0]?userById(a[0]):null;return u?{name:u.name,email:u.email,phone:u.phone,role:u.role,team:u.team||'',slab:u.slab||'',cap:String(u.cap||''),tag:u.tag||'',office:u.office||''}:{name:'',email:'',phone:'',role:'agent',team:'',slab:'',cap:String(S.set.capDefault),tag:'',office:''}}});
A.usersave=a=>{const f=UI.mf,e={};const u=a[0]?userById(a[0]):null;if(!(f.name||'').trim())e.name='Enter a name.';if(!/^\S+@\S+\.\S+$/.test(f.email||''))e.email='Enter a valid email.';else if(S.users.some(x=>x.email.toLowerCase()===f.email.trim().toLowerCase()&&(!u||x.id!==u.id)))e.email='This email already has an account.';if(norm(f.phone).length<8)e.phone='Enter a valid phone number.';if(f.role!=='admin'&&!f.team)e.team='Choose a team.';if(f.role==='agent'&&!(+f.cap>=1))e.cap='Enter a number of at least 1.';if(u&&f.role==='agent'&&+f.cap<capInfo(u.id).used)e.cap='This agent already has '+capInfo(u.id).used+' active leads.';
 if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 if(u){const was=u.slab;Object.assign(u,{name:f.name.trim(),email:f.email.trim(),phone:f.phone.trim(),role:f.role,team:f.role==='admin'?undefined:f.team,slab:f.role==='agent'?(f.slab||null):undefined,cap:f.role==='agent'?+f.cap:undefined,tag:f.tag||undefined});if((was||'')!==(f.slab||''))audit('Slab assigned',u.name,was||'None',f.slab||'None');audit('User updated',u.name,'','');closeM();toast('Saved','ok');render();return}
 const pre={agent:'AG',mgmt:'MG',admin:'AD'}[f.role];const nxt=Math.max(0,...S.users.filter(x=>x.role===f.role).map(x=>+String(x.emp).split('-')[1]||0))+1;const id='u'+(Math.max(...S.users.map(x=>+x.id.slice(1)))+1);const tok='inv'+uid();
 const nu={id,name:f.name.trim(),role:f.role,emp:pre+'-'+String(nxt).padStart(3,'0'),email:f.email.trim(),phone:f.phone.trim(),status:'invited'};if(f.role!=='admin'){nu.team=f.team;nu.office=teamById(f.team).office}if(f.role==='agent'){nu.slab=f.slab||null;nu.cap=+f.cap;if(f.tag)nu.tag=f.tag}
 S.users.push(nu);S.invites[tok]={u:id,exp:NOW()+DAY};if(f.role==='mgmt'&&!teamById(f.team).mgr)teamById(f.team).mgr=id;audit('User created',nu.name,'',ROLEN[f.role]+' · '+nu.emp);closeM();toast(nu.name+' invited. Link expires in 24 hours','ok');go('admin-user-'+id)};
A.resendinv=a=>{const u=userById(a[0]);const tok='inv'+uid();S.invites[tok]={u:u.id,exp:NOW()+DAY};audit('Invite resent',u.name,'','');toast('New invite sent to '+u.email,'ok');render()};
A.reactivate=a=>{const u=userById(a[0]);u.status='active';audit('User reactivated',u.name,'Deactivated','Active');toast(u.name+' can sign in again','ok');render()};
mdef('deactivate',{role:'admin',init:()=>({to:''})});
A.deactsave=a=>{const u=userById(a[0]);const ls=leadsOf(u.id);if(u.role==='agent'&&ls.length&&!UI.mf.to){UI.mf._e={to:'Choose where the leads go first.'};renderOverlay();return}
 if(ls.length)ls.forEach(l=>{const r=reassign(l,UI.mf.to==='pool'?null:UI.mf.to,'Account deactivated',me().id)});
 u.status='removed';if(u.role==='mgmt'){S.teams.forEach(t=>{if(t.mgr===u.id)t.mgr=S.users.find(x=>x.role==='mgmt'&&x.id!==u.id&&x.status==='active')?.id||t.mgr})}audit('User deactivated',u.name,'Active','Deactivated');closeM();toast(u.name+' deactivated'+(ls.length?', '+ls.length+' leads moved':''),'ok');render()};
mdef('team-form',{role:'admin',init:a=>{const t=a[0]?teamById(a[0]):null;return t?{name:t.name,office:t.office,region:t.region,mgr:t.mgr}:{name:'',office:'',region:'',mgr:''}}});
A.teamsave=a=>{const f=UI.mf,e={};if(!(f.name||'').trim())e.name='Enter a name.';if(!(f.office||'').trim())e.office='Enter an office.';if(!f.mgr)e.mgr='Choose a manager.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 if(a[0]){Object.assign(teamById(a[0]),{name:f.name.trim(),office:f.office.trim(),region:f.region||'',mgr:f.mgr});audit('Team updated',f.name.trim(),'','')}else{S.teams.push({id:'t'+(S.teams.length+1),name:f.name.trim(),office:f.office.trim(),region:f.region||'',mgr:f.mgr});audit('Team created',f.name.trim(),'','')}closeM();toast('Saved','ok');go('admin-people-teams')};

/* ===== admin surface B: review queue, booking approval, commission, CN, secondary, projects ===== */
function mkMiles(b){if(b.miles&&b.miles.length)return;const pl=b.plan==='50/50'?[['Booking deposit',10],['On SPA signing',10],['Construction 25%',10],['Construction 50%',20],['Handover',50]]:b.plan==='80/20'?[['Booking deposit',10],['On SPA signing',10],['Construction 40%',30],['Construction 80%',30],['Handover',20]]:[['Booking deposit',10],['On SPA signing',10],['Construction 30%',20],['Construction 60%',20],['Handover',40]];
 b.miles=pl.map(([n,p],i)=>({n,pct:p,amt:Math.round(b.price*p/100),due:NOW()+i*45*DAY,paid:i===0,paidAt:i===0?NOW():null}));b.paidPct=10}


/* ---------------- review queue ---------------- */
def('admin-review',{role:'admin',level:'L1',title:'Bookings Approval',nav:'admin-review',sample:[[],['bookings'],['docs'],['closure'],['cn'],['sec']]});

/* ---------------- booking approval (split view) ---------------- */
def('admin-booking',{role:'admin',level:'L2',title:'Booking review',nav:'admin-review',sample:[['bk10021'],['bk10018'],['bk10014'],['bk10009'],['bk10005'],['bk10002'],['bk10003'],['bk99999']],crumb:p=>[{l:'Bookings Approval',go:'admin-review'},{l:bkF(p[0])}]});
A.bkapprove=a=>{const b=bkById(a[0]);b.status='approved';b.reason='';b.holdUntil=null;['form','receipt'].forEach(k=>{if(b.docs[k].s==='uploaded')b.docs[k].s='approved'});mkMiles(b);b.hist.push(['Approved by Admin. Deal status: PENDING',me().id,NOW()]);syncUnits();notify(b.agent,{t:'Booking '+b.id+' approved',d:'Unit '+b.unit+' is booked. Next: mark the SPA as issued.',go:'agent-booking-'+bkP(b.id),ic:'check'});audit('Booking approved',b.id,'Pending','Approved');toast('Booking approved. Unit '+b.unit+' is booked','ok');render()};
mdef('bk-changes',{role:'admin',init:()=>({doc:'',txt:''})});
A.chgsave=a=>{const b=bkById(a[0]),f=UI.mf,e={};if(!f.doc)e.doc='Choose an option.';if(!(f.txt||'').trim())e.txt='Tell the agent what to fix.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}b.status='changes';b.reason=f.txt.trim();(f.doc==='form'||f.doc==='both')&&(b.docs.form.s='rejected');(f.doc==='receipt'||f.doc==='both')&&(b.docs.receipt.s='rejected');b.hist.push(['Changes requested by Admin: '+f.txt.trim(),me().id,NOW()]);notify(b.agent,{t:'Changes needed on '+b.id,d:f.txt.trim(),go:'agent-booking-'+bkP(b.id),ic:'file'});audit('Changes requested',b.id,'Pending','Changes');closeM();toast('Sent back to '+uname(b.agent),'ok');render()};
mdef('bk-reject',{role:'admin',init:()=>({txt:''})});
A.rejsave=a=>{const b=bkById(a[0]);if(!(UI.mf.txt||'').trim()){UI.mf._e={txt:'Give a reason.'};renderOverlay();return}b.status='rejected';b.reason=UI.mf.txt.trim();b.holdUntil=null;b.hist.push(['Rejected by Admin',me().id,NOW()],['Unit '+b.unit+' released','system',NOW()]);syncUnits();notify(b.agent,{t:'Booking '+b.id+' rejected',d:UI.mf.txt.trim(),go:'agent-booking-'+bkP(b.id),ic:'file'});audit('Booking rejected',b.id,'Pending','Rejected');closeM();toast('Booking rejected, unit released','ok');render()};
A.docdec=a=>{const b=bkById(a[0]);b.docs[a[1]].s=a[2];b.hist.push([DOCN[a[1]]+' '+a[2],me().id,NOW()]);if(['spa','dld','oqood'].includes(a[1]))notify(b.agent,{t:DOCN[a[1]]+' approved',d:b.id,go:'agent-booking-'+bkP(b.id),ic:'check'});audit('Document '+a[2],b.id+' · '+DOCN[a[1]],'Uploaded',cap1(a[2]));toast(DOCN[a[1]]+' approved','ok');render()};
mdef('doc-reject',{role:'admin',init:()=>({txt:''})});
A.docrej=a=>{const b=bkById(a[0]);if(!(UI.mf.txt||'').trim()){UI.mf._e={txt:'Say what is wrong.'};renderOverlay();return}b.docs[a[1]].s='rejected';b.docs[a[1]].note=UI.mf.txt.trim();b.hist.push([DOCN[a[1]]+' rejected: '+UI.mf.txt.trim(),me().id,NOW()]);if(b.status==='pending'){b.status='changes';b.reason=DOCN[a[1]]+': '+UI.mf.txt.trim()}notify(b.agent,{t:DOCN[a[1]]+' rejected',d:UI.mf.txt.trim(),go:'agent-booking-'+bkP(b.id),ic:'file'});audit('Document rejected',b.id+' · '+DOCN[a[1]],'Uploaded','Rejected');closeM();toast('Document rejected','ok');render()};
mdef('doc-view',{role:'admin'});
A.bkclose=a=>{const b=bkById(a[0]);if(!gateOk(b)){toast('All five documents must be approved first','err');return}b.status='closed';b.hist.push(['Closed after Admin approved all documents',me().id,NOW()]);syncUnits();notify(b.agent,{t:'Booking '+b.id+' closed',d:'Revenue counted. Commission tracking started.',go:'agent-booking-'+bkP(b.id),ic:'check'});notify(teamById(teamOf(b.agent)).mgr,{t:'Booking closed: '+b.id,d:uname(b.agent)+' · '+mfull(b.price),go:'mgmt-booking-'+bkP(b.id),ic:'check'});audit('Booking closed',b.id,'Approved','Closed');toast('Booking closed. Revenue counted','ok');render()};
mdef('pay-progress',{role:'admin',init:a=>{const b=bkById(a[0]);return {paid:b.miles.map(m=>m.paid?1:0).join(',')}}});
A.paytog=a=>{const x=(UI.mf.paid||'').split(',');x[+a[0]]=x[+a[0]]==='1'?'0':'1';UI.mf.paid=x.join(',');renderOverlay()};
A.paysave=a=>{const b=bkById(a[0]);const pd=(UI.mf.paid||'').split(',').map(x=>x==='1');b.miles.forEach((m,i)=>{if(pd[i]&&!m.paid)m.paidAt=NOW();m.paid=pd[i]});const was=b.paidPct;b.paidPct=sum(b.miles.filter(m=>m.paid),m=>m.pct);b.hist.push(['Buyer payments updated: '+b.paidPct+'% paid',me().id,NOW()]);audit('Buyer payments updated',b.id,was+'%',b.paidPct+'%');closeM();toast('Saved. Buyer has paid '+b.paidPct+'%','ok');render()};

/* ---------------- commission ---------------- */
def('admin-commission',{role:'admin',level:'L1',title:'Commission',nav:'admin-commission',sample:[[]]});
def('admin-comm',{role:'admin',level:'L2',title:'Commission detail',nav:'admin-commission',sample:[['bk10002'],['bk10003'],['bk10006'],['bk10005'],['bk99999']],crumb:p=>[{l:'Commission',go:'admin-commission'},{l:bkF(p[0])}]});
A.devinv=a=>{const b=bkById(a[0]);b.devInv=NOW();b.hist.push(['Developer invoiced',me().id,NOW()]);audit('Developer invoiced',b.id,'','');toast('Marked as invoiced','ok');render()};
A.devrec=a=>{const b=bkById(a[0]);b.devRec=NOW();b.hist.push(['Developer commission received',me().id,NOW()]);notify(b.agent,{t:'Developer commission received for '+b.id,d:'Your incentive moves closer to release.',go:'agent-booking-'+bkP(b.id),ic:'check'});audit('Developer commission received',b.id,'','');toast('Marked as received','ok');render()};
mdef('comm-release',{role:'admin'});
A.commrel=a=>{const b=bkById(a[0]),c=comm(b);if(c.st!=='eligible'){toast('Not eligible any more','err');closeM();return}b.incRel=NOW();b.hist.push(['Incentive released: '+mfull(c.inc),me().id,NOW()]);notify(b.agent,{t:'Incentive released',d:b.id+' · '+mfull(c.inc),go:'agent-booking-'+bkP(b.id),ic:'check'});audit('Incentive released',b.id,'Eligible',mfull(c.inc));closeM();toast('Incentive released','ok');render()};
mdef('comm-adjust',{role:'admin',init:()=>({amt:'',txt:''})});
A.adjsave=a=>{const b=bkById(a[0]),f=UI.mf,e={};if(f.amt===''||isNaN(+f.amt))e.amt='Enter a number.';if(!(f.txt||'').trim())e.txt='A reason is required.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}const was=b.adj||0;b.adj=+f.amt;b.adjNote=f.txt.trim();b.hist.push(['Incentive adjusted by '+mfull(b.adj)+': '+b.adjNote,me().id,NOW()]);audit('Incentive adjusted',b.id,mfull(was),mfull(b.adj)+' · '+b.adjNote);closeM();toast('Adjustment saved','ok');render()};

/* ---------------- convertible notes ---------------- */
def('admin-cn',{role:'admin',level:'L1',title:'Convertible Notes',nav:'admin-cn',sample:[[]]});
mdef('cn-review',{role:'admin',init:()=>({dec:'',txt:''})});
A.cndecide=a=>{const l=leadById(a[0]),f=UI.mf,c=l.cn,e={};if(!f.dec)e.dec='Choose a decision.';if(f.dec==='back'&&!(f.txt||'').trim())e.txt='Tell the agent what to fix.';if(f.dec==='ok'&&!CNDOCS.every(([k])=>c[k]))e.dec='All six documents are needed before you can approve.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 if(f.dec==='back'){c.adminState='changes';c.adminNote=f.txt.trim();c.stage='Documents';addEv(l,'doc','Convertible Note sent back by Admin: '+c.adminNote);notify(l.owner,{t:'Convertible Note sent back',d:c.adminNote,go:'agent-lead-'+l.id,ic:'clip'});audit('CN application sent back','LEAD-'+l.id,'Admin review','Documents');closeM();toast('Sent back to '+uname(l.owner),'ok');render();return}
 const nn=Math.max(...S.notes.map(n=>+n.id.split('-')[2]),0)+1;const id='CN-2026-'+String(nn).padStart(4,'0');const cid='DE-C-'+String(192+S.notes.length).padStart(4,'0');const start=NOW();const m=Math.round(c.amount*S.set.cn.rate/100);
 const note={id,client:cid,lead:l.id,name:l.name,agent:l.owner,principal:c.amount,cur:c.cur,tenure:S.set.cn.tenure,rate:S.set.cn.rate,freq:'Monthly',start,status:'active',payouts:[],pdc:[]};
 for(let i=1;i<=note.tenure;i++){const due=start+i*30*DAY;note.payouts.push({n:i,due,amt:m,status:'upcoming',ref:null,at:null});note.pdc.push({no:'PDC-'+(200000+nn*100+i),bank:'Client bank',due,amt:m,status:'held'})}
 S.notes.push(note);c.stage='Active';c.adminState='approved';c.noteId=id;addEv(l,'doc','Convertible Note approved: '+id);notify(l.owner,{t:'Convertible Note approved',d:id+' · '+l.name,go:'agent-cnnote-'+noteP(id),ic:'check'});audit('CN approved',id,'Admin review','Active');closeM();toast(id+' is now active','ok');go('admin-cnnote-'+noteP(id))};
mdef('payout-pay',{role:'admin',init:()=>({ref:''})});
A.paypaid=a=>{const n=noteById(a[0]),p=n.payouts[+a[1]-1];if(!(UI.mf.ref||'').trim()){UI.mf._e={ref:'Enter the reference.'};renderOverlay();return}p.status='paid';p.ref=UI.mf.ref.trim();p.at=NOW();n.pdc[p.n-1].status='cleared';audit('CN payout paid',n.id+' #'+p.n,'Due','Paid · '+p.ref);closeM();toast('Payout '+p.n+' marked as paid','ok');render()};
mdef('payout-fix',{role:'admin',init:()=>({how:'',ref:''})});
A.payfixed=a=>{const n=noteById(a[0]),p=n.payouts[+a[1]-1],f=UI.mf,e={};if(!f.how)e.how='Choose one.';if(!(f.ref||'').trim())e.ref='Enter the reference.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}p.status='paid';p.ref=f.ref.trim();p.at=NOW();n.pdc[p.n-1].status='cleared';notify(n.agent,{t:'Bounced payout resolved',d:n.id+' payout '+p.n+' is settled.',go:'agent-cnnote-'+noteP(n.id),ic:'check'});audit('CN bounce resolved',n.id+' #'+p.n,'Bounced','Paid · '+p.ref);closeM();toast('Resolved','ok');render()};
mdef('cn-edit',{role:'admin',init:a=>{const n=noteById(a[0]);return {agent:n.agent,txt:n.adminNote||''}}});
A.cnedit=a=>{const n=noteById(a[0]);const was=n.agent;n.agent=UI.mf.agent;n.adminNote=(UI.mf.txt||'').trim();if(was!==n.agent){notify(n.agent,{t:'Convertible note assigned to you',d:n.id+' · '+n.name,go:'agent-cnnote-'+noteP(n.id),ic:'clip'});audit('CN agent changed',n.id,uname(was),uname(n.agent))}closeM();toast('Saved','ok');render()};

/* ---------------- secondary market ---------------- */
def('admin-secondary',{role:'admin',level:'L1',title:'Secondary Market',nav:'admin-secondary',sample:[[],['requests']]});
mdef('sec-accept',{role:'admin',init:a=>{const s=secById(a[0]);return {dec:s.status==='Requested'?'':'re',owner:s.owner||'',comm:s.comm?String(s.comm):'2',txt:''}}});
A.secdecide=a=>{const s=secById(a[0]),f=UI.mf,e={};if(!f.dec)e.dec='Choose a decision.';if(f.dec==='no'&&!(f.txt||'').trim())e.txt='Give a reason.';if((f.dec==='ok'||f.dec==='re')){if(!f.owner)e.owner='Choose an agent.';if(!(+f.comm>0&&+f.comm<=10))e.comm='Enter a percentage between 0 and 10.'}if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 if(f.dec==='no'){s.status='Declined';s.hist.push(['Declined by Admin: '+f.txt.trim(),me().id,NOW()]);notify(s.raised,{t:s.id+' declined',d:f.txt.trim(),go:'agent-sec-'+secP(s.id),ic:'store'});audit('Secondary declined',s.id,'Requested','Declined')}
 else{const was=s.owner;s.owner=f.owner;s.comm=+f.comm;if(s.status==='Requested')s.status=s.kind==='seller'?'Active':'Follow-up';s.hist.push([was?'Reassigned to '+uname(f.owner):'Accepted by Admin, assigned to '+uname(f.owner),me().id,NOW()]);notify(f.owner,{t:s.id+' assigned to you',d:s.prop,go:'agent-sec-'+secP(s.id),ic:'store'});if(s.raised!==f.owner)notify(s.raised,{t:s.id+' accepted',d:'Assigned to '+uname(f.owner),go:'agent-sec-'+secP(s.id),ic:'store'});audit('Secondary assigned',s.id,was?uname(was):'Requested',uname(f.owner))}
 closeM();toast('Saved','ok');render()};
mdef('sec-new',{role:'admin',init:()=>({name:'',prop:'',loc:'',ask:'',owner:'',comm:'2'})});
A.secnew=()=>{const f=UI.mf,e={};['name','prop','loc'].forEach(k=>{if(!(f[k]||'').trim())e[k]='Required.'});if(!(+f.ask>0))e.ask='Enter a price.';if(!f.owner)e.owner='Choose an agent.';if(!(+f.comm>0&&+f.comm<=10))e.comm='0 to 10.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}const id='SM-'+(Math.max(...S.sec.map(s=>+s.id.slice(3)))+1);S.sec.unshift({id,kind:'seller',lead:null,raised:me().id,name:f.name.trim(),prop:f.prop.trim(),loc:f.loc.trim(),ask:+f.ask,cur:'AED',status:'Active',owner:f.owner,comm:+f.comm,docs:[],hist:[['Listing created by Admin',me().id,NOW()]],matches:[]});notify(f.owner,{t:id+' assigned to you',d:f.prop,go:'agent-sec-'+secP(id),ic:'store'});audit('Secondary listing created',id,'','');closeM();toast(id+' created','ok');go('admin-sec-'+secP(id))};

/* ---------------- projects ---------------- */
def('admin-projects',{role:'admin',level:'L1',title:'Projects & Properties',nav:'admin-projects',sample:[[]]});
mdef('project-edit',{role:'admin',init:a=>{const p=a[0]?projById(a[0]):null;return p?{name:p.name,dev:p.dev,area:p.area,city:p.city,type:p.type,status:p.status,ho:p.ho,plan:p.plan,comm:String(p.comm),rel:String(p.relPct),rera:p.rera||'',desc:p.desc||'',pri:p.pri?'1':'',active:p.active?'1':''}:{name:'',dev:'',area:'',city:'Dubai',type:'Apartment',status:'Launched',ho:'',plan:'',comm:'4',rel:'30',rera:'',desc:'',pri:'',active:'1'}}});
A.mflip=a=>{UI.mf[a[0]]=UI.mf[a[0]]?'':'1';renderOverlay()};
A.projsave=a=>{const f=UI.mf,e={};['name','dev','area','plan'].forEach(k=>{if(!(f[k]||'').trim())e[k]='Required.'});if(!(+f.comm>0&&+f.comm<=15))e.comm='Between 0 and 15.';if(!(+f.rel>=0&&+f.rel<=100))e.rel='Between 0 and 100.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 const vals={name:f.name.trim(),dev:f.dev.trim(),area:f.area.trim(),city:f.city||'Dubai',type:f.type,status:f.status,ho:f.ho,plan:f.plan.trim(),comm:+f.comm,relPct:+f.rel,rera:f.rera,desc:f.desc,pri:!!f.pri,active:!!f.active,upd:[me().id,NOW()]};
 if(a[0]){Object.assign(projById(a[0]),vals);audit('Project updated',vals.name,'','')}else{const id='p'+(S.projects.length+1);S.projects.push(Object.assign({id,from:0,to:0,amen:[],img:(S.projects.length%4)+1,units:[]},vals));audit('Project created',vals.name,'','');closeM();toast('Project created. Add its units next','ok');go('admin-project-'+id);return}
 closeM();toast('Saved','ok');render()};
mdef('unit-edit',{role:'admin',init:a=>{const p=projById(a[0]);const u=a[1]?p.units.find(x=>x.id===a[1]):null;return u?{id:u.id,type:u.type,size:String(u.size),price:String(u.price),off:u.off?'1':''}:{id:'',type:'1 Bedroom',size:'',price:'',off:''}}});
A.unitsave=a=>{const p=projById(a[0]),f=UI.mf,e={};const old=a[1]?p.units.find(x=>x.id===a[1]):null;if(!old){if(!(f.id||'').trim())e.id='Enter a unit number.';else if(p.units.some(x=>x.id.toLowerCase()===f.id.trim().toLowerCase()))e.id='This unit number already exists.'}if(!(+f.size>0))e.size='Enter the size.';if(!(+f.price>0))e.price='Enter the price.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 if(old){const was=old.price;old.type=f.type;old.size=+f.size;old.price=+f.price;if(!['Booked','Sold','Held'].includes(old.status))old.off=!!f.off;if(was!==old.price)audit('Unit price changed',p.name+' '+old.id,mfull(was),mfull(old.price))}else{p.units.push({id:f.id.trim(),type:f.type,size:+f.size,price:+f.price,status:'Available',holdBy:null,holdUntil:null,bk:null,off:!!f.off});audit('Unit added',p.name+' '+f.id.trim(),'','')}
 p.from=Math.min(...p.units.map(x=>x.price));p.to=Math.max(...p.units.map(x=>x.price));p.upd=[me().id,NOW()];syncUnits();closeM();toast('Saved','ok');render()};
A.holdrel=a=>{const p=projById(a[0]),u=p.units.find(x=>x.id===a[1]);const b=S.bookings.find(x=>x.id===u.bk);if(b){b.status='expired';b.reason='Hold released by Admin before it ended.';b.holdUntil=null;b.hist.push(['Hold released by Admin','system',NOW()]);notify(b.agent,{t:'Hold released',d:u.id+' was released by Admin.',go:'agent-booking-'+bkP(b.id),ic:'clock'})}syncUnits();audit('Hold released',p.name+' '+u.id,'Held','Available');closeM();toast('Hold released','ok');render()};

/* ===== admin surface C: HR, reports, audit, settings ===== */
/* ---------------- HR and attendance ---------------- */
def('admin-hr',{role:'admin',level:'L1',title:'HR & Attendance',nav:'admin-hr',sample:[[],['leave'],['reg'],['cal'],['loc']]});

/* ---------------- reports ---------------- */
const REPORTS=[
 {k:'revenue',t:'Revenue by agent',d:'Approved and closed bookings, with incentives.',build:()=>({cols:['Agent','Team','Bookings','Revenue (AED)','Incentive earned (AED)'],rows:agentsAll().map(a=>[a.name,teamName(a.team),bookingsCount(a.id),revOf(a.id),sum(S.bookings.filter(b=>b.agent===a.id&&['approved','closed'].includes(b.status)),b=>comm(b).inc)]).sort((x,y)=>y[3]-x[3])})},
 {k:'campaign',t:'Leads by campaign',d:'Where leads come from and how far they go.',build:()=>{const m={};S.leads.forEach(l=>{const r=m[l.camp]||(m[l.camp]=[l.camp,0,0,0,0,0]);r[1]++;if(!l.owner&&!l.archived)r[2]++;if(l.attempts>0)r[3]++;if(l.temp==='hot')r[4]++;if(S.bookings.some(b=>b.lead===l.id&&['approved','closed'].includes(b.status)))r[5]++});return {cols:['Campaign','Leads','In pool','Contacted','Hot','Booked'],rows:Object.values(m).sort((a,b)=>b[1]-a[1])}}},
 {k:'funnel',t:'Pipeline by stage',d:'Active leads by stage.',build:()=>{const m={};S.leads.filter(l=>!l.archived).forEach(l=>m[l.stage]=(m[l.stage]||0)+1);return {cols:['Stage','Leads'],rows:Object.entries(m).sort((a,b)=>b[1]-a[1])}}},
 {k:'bookings',t:'Bookings register',d:'Every booking with its deal stage.',build:()=>({cols:['Booking','Raised','Agent','Project','Unit','Price (AED)','Status','Deal stage'],rows:S.bookings.map(b=>[b.id,fd(b.submitted),uname(b.agent),projById(b.project).name,b.unit,b.price,cap1(b.status),dealStage(b)])})},
 {k:'commission',t:'Commission status',d:'What is ready, waiting, blocked or paid.',build:()=>({cols:['Booking','Agent','Incentive (AED)','Status','Developer','Buyer paid %'],rows:S.bookings.filter(b=>['approved','closed'].includes(b.status)).map(b=>{const c=comm(b);return [b.id,uname(b.agent),c.inc,cap1(c.st),devState(b).l,b.paidPct]})})},
 {k:'activity',t:'Agent activity',d:'Calls, meetings and follow-ups this month.',build:()=>({cols:['Agent','Team','Calls','Meetings','Follow-ups','Speed to lead (min)'],rows:agentsAll().map(a=>{const p=perfOf(a.id);return [a.name,teamName(a.team),p.calls,p.meet,p.fu,(S.speed&&S.speed[a.id])||'']})})}
];
const csvOf=r=>[r.cols.join(','),...r.rows.map(x=>x.map(c=>{c=String(c);return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(','))].join('\n');
def('admin-reports',{role:'admin',level:'L1',title:'Reports & MIS',nav:'admin-reports',sample:[[],['campaign'],['bookings']]});

/* ---------------- audit log ---------------- */
def('admin-audit',{role:'admin',level:'L1',title:'Audit Log',nav:'admin-audit',sample:[[]]});

/* ---------------- settings ---------------- */
const SETTABS=[['rules','Lead rules'],['slabs','Commission slabs'],['targets','Targets'],['cn','Convertible Notes'],['docs','Document lists'],['dnd','Do Not Call']];
def('admin-settings',{role:'admin',level:'L1',title:'Settings',nav:'admin-settings',sample:[[],['slabs'],['targets'],['cn'],['docs'],['dnd']]});
A.setreset=()=>{UI.pf={};render()};
const intIn=(e,k,lo,hi,msg)=>{const v=pfv(k);if(v===''||v==null)return null;const n=+v;if(!Number.isFinite(n)||n<lo||n>hi||(!Number.isInteger(n)&&!/rate|fx/.test(k))){e[k]=msg||('Enter a number from '+lo+' to '+hi+'.');return null}return n};
A.setrules=()=>{const e={},st=S.set;const x=intIn(e,'inactX',1,60),y=intIn(e,'inactY',1,30),c=intIn(e,'capDefault',1,500),sp=intIn(e,'speed',1,240),h=intIn(e,'holdHours',1,168),hc=intIn(e,'holdCap',1,20);if(Object.keys(e).length){UI.pf._e=e;render();return}
 const ch=[];[['inactX',x,'At-risk days'],['inactY',y,'Return days'],['capDefault',c,'Default ceiling'],['speed',sp,'Speed to lead'],['holdHours',h,'Hold hours'],['holdCap',hc,'Hold cap']].forEach(([k,v,l])=>{if(v!=null&&v!==st[k]){audit('Setting changed',l,String(st[k]),String(v));st[k]=v;ch.push(l)}});UI.pf={};toast(ch.length?ch.length+' setting'+(ch.length>1?'s':'')+' saved':'Nothing changed','ok');render()};
A.settargets=()=>{const e={},a=S.set.targets.agent,m=S.set.targets.mgmt;const v={rev:intIn(e,'t_rev',1,1e9),book:intIn(e,'t_book',1,1000),calls:intIn(e,'t_calls',1,5000),meet:intIn(e,'t_meet',1,1000),fu:intIn(e,'t_fu',1,5000)};const mv_={rev:intIn(e,'m_rev',1,1e10),book:intIn(e,'m_book',1,10000)};if(Object.keys(e).length){UI.pf._e=e;render();return}Object.keys(v).forEach(k=>{if(v[k]!=null&&v[k]!==a[k]){audit('Target changed','Agent '+k,String(a[k]),String(v[k]));a[k]=v[k]}});Object.keys(mv_).forEach(k=>{if(mv_[k]!=null&&mv_[k]!==m[k]){audit('Target changed','Team '+k,String(m[k]),String(mv_[k]));m[k]=mv_[k]}});UI.pf={};toast('Targets saved','ok');render()};
A.setcn=()=>{const e={},c=S.set.cn;const t=intIn(e,'c_ten',1,120),r=intIn(e,'c_rate',0.1,10,'Enter a rate from 0.1 to 10.'),fx=intIn(e,'fx',1,1000,'Enter a rate.');if(Object.keys(e).length){UI.pf._e=e;render();return}if(t!=null&&t!==c.tenure){audit('Setting changed','CN tenure',String(c.tenure),String(t));c.tenure=t}if(r!=null&&r!==c.rate){audit('Setting changed','CN rate',String(c.rate),String(r));c.rate=r}if(fx!=null&&fx!==S.set.fx){audit('Setting changed','AED to INR',String(S.set.fx),String(fx));S.set.fx=fx}UI.pf={};toast('Saved. Applies to new notes only','ok');render()};
mdef('slab-edit',{role:'admin',init:a=>{const s=a[0]?S.set.slabs.find(x=>x.id===a[0]):null;return s?{name:s.name,from:String(s.from),rate:String(s.rate)}:{name:'Slab '+String.fromCharCode(65+S.set.slabs.length),from:'',rate:''}}});
A.slabsave=a=>{const f=UI.mf,e={};if(!(f.name||'').trim())e.name='Enter a name.';if(f.from===''||!(+f.from>=0))e.from='Enter 0 or more.';if(!(+f.rate>0&&+f.rate<=100))e.rate='Enter a rate from 0 to 100.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 if(a[0]){const s=S.set.slabs.find(x=>x.id===a[0]);audit('Slab changed',s.name,s.rate+'% from '+nf(s.from),(+f.rate)+'% from '+nf(+f.from));Object.assign(s,{name:f.name.trim(),from:+f.from,rate:+f.rate})}else{const id=String.fromCharCode(65+S.set.slabs.length);S.set.slabs.push({id,name:f.name.trim(),from:+f.from,rate:+f.rate});audit('Slab added',f.name.trim(),'',(+f.rate)+'%')}S.set.slabs.sort((x,y)=>x.from-y.from);closeM();toast('Saved','ok');render()};
mdef('dnd-add',{role:'admin',init:()=>({no:'',name:'',txt:''})});
A.dndadd=()=>{const f=UI.mf,e={};const n=norm(f.no);if(n.length<8||n.length>13)e.no='Enter a valid phone number.';else if(isDnd(f.no))e.no='This number is already on the list.';if(!(f.txt||'').trim())e.txt='Add a reason.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}S.dnd.unshift({no:f.no.trim(),name:(f.name||'').trim(),by:me().id,at:NOW(),reason:f.txt.trim()});let hit=0;S.leads.forEach(l=>{if(norm(l.phone)===n&&!l.dnd){l.dnd=true;l.archived=true;l.disp='DND';l.archReason='On the Do Not Call list';addEv(l,'warn','Added to the Do Not Call list by Admin');hit++}});audit('DND added',f.no.trim(),'','Added by Admin'+(hit?', '+hit+' lead(s) archived':''));closeM();toast('Added'+(hit?'. '+hit+' lead'+(hit>1?'s':'')+' archived':''),'ok');render()};
A.dndremove=a=>{const d=S.dnd[+a[0]];confirmM({title:'Remove from Do Not Call?',text:'<b>'+esc(d.no)+'</b> can be called and imported again. Do this only if the client asked you in writing.',act:'dndremoveok|'+a[0],ok:'Remove number',danger:true})};
A.dndremoveok=a=>{const d=S.dnd.splice(+a[0],1)[0];audit('DND removed',d.no,'On list','Removed');UI.c=null;renderOverlay();toast('Removed','ok');render()};

/* ===== 13-polish: live punch clock, numeric inputs, temperature picker, lead documents, email channel, call log UX ===== */
Object.assign(IC,{
 flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
 snow:'<path d="M2 12h20"/><path d="M12 2v20"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',
 phonex:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/><path d="m22 2-6 6"/><path d="m16 2 6 6"/>',
 phoneoff:'<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91"/><path d="M22 2 2 22"/>',
 hash:'<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>',
 ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
 thumb:'<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
 thumbdown:'<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>',
 folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
 idcard:'<rect width="20" height="14" x="2" y="5" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4"/><path d="M14 14h4"/>',
 wallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
 minus:'<path d="M5 12h14"/>',
 timer:'<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>'
});

/* ---------- 1. live punch clock ---------- */
const BOOT_REAL=Date.now();
const liveNow=()=>NOW()+(Date.now()-BOOT_REAL);
const SHIFT_MS=9*HR;
const pad2=n=>String(Math.floor(n)).padStart(2,'0');
const hms=ms=>{ms=Math.max(0,ms);const s=Math.floor(ms/1000);return pad2(s/3600)+':'+pad2(s%3600/60)+':'+pad2(s%60)};
const clockTxt=t=>{const d=new Date(t+4*HR);return pad2(d.getUTCHours())+':'+pad2(d.getUTCMinutes())+':'+pad2(d.getUTCSeconds())};
function workedMs(p){if(!p||!p.in)return 0;const now=liveNow();const st=p.tl||p.t;let w=now-st-(p.brkMs||0);if(p.brk)w-=now-(p.brkL||now);return Math.max(0,w)}

function shiftWidget(){const u=me();if(!u||u.role==='admin')return '';const p=punchState(u.id);const done=p.outAt&&sameDay(p.outAt,NOW());
 return `<button type="button" class="shiftw ${p.in?(p.brk?'brk':'in'):''}" data-open="punch" aria-label="Attendance">${ic(p.in?'timer':'clock',16)}<span class="sw-t" data-clock="${p.in?'work':'now'}">${p.in?hms(workedMs(p)):clockTxt(liveNow())}</span><span class="sw-l">${p.in?(p.brk?'On break':'Working'):done?'Punched out':'Punch in'}</span></button>`}

{const orig=A.punch;A.punch=a=>{const u=me();const k=a[0];const before=S.punch[u.id]||{};const bm=before.brkMs||0,bl=before.brkL;orig(a);const p=S.punch[u.id];if(!p)return;
 if(k==='in'){p.tl=liveNow();p.brkMs=0}
 else if(k==='brk'){p.brkL=liveNow();p.brkMs=bm;p.tl=before.tl}
 else if(k==='endbrk'){p.brkMs=bm+(bl?liveNow()-bl:0);p.brkL=null;p.tl=before.tl}
 render()}}
setInterval(()=>{const els=document.querySelectorAll('[data-clock]');if(!els.length||!S.session)return;const p=punchState(S.session.userId);
 els.forEach(e=>{e.textContent=e.dataset.clock==='work'?hms(workedMs(p)):clockTxt(liveNow())});
 document.querySelectorAll('[data-ring]').forEach(c=>{const C=+c.dataset.ring;const f=p&&p.in?Math.min(1,workedMs(p)/SHIFT_MS):0;c.setAttribute('stroke-dashoffset',(C*(1-f)).toFixed(1))})},1000);

/* ---------- 2. numeric free-text inputs ---------- */
const fmtNum=(raw,cur)=>{if(raw===''||raw==null)return '';const n=Number(raw);if(!isFinite(n))return '';return cur==='INR'?n.toLocaleString('en-IN'):n.toLocaleString('en-US')};

const words=(n,cur)=>{if(!n)return '';if(cur==='INR'){if(n>=1e7)return (+(n/1e7).toFixed(2))+' crore';if(n>=1e5)return (+(n/1e5).toFixed(2))+' lakh';return nf(n)}if(n>=1e6)return (+(n/1e6).toFixed(3))+' million';if(n>=1e3)return (+(n/1e3).toFixed(1))+' thousand';return nf(n)};

/* global listener: handled in React (src/app/events.ts) */

/* ---------- 3. temperature picker ---------- */
const TEMPS=[['hot','Hot','flame','Ready to buy soon'],['warm','Warm','sun','Interested, needs nurturing'],['cold','Cold','snow','Early or unresponsive']];
function tempPick(cur,act,o){o=o||{};return `<div class="tpick ${o.lg?'lg':''}" role="radiogroup" aria-label="Lead temperature">${TEMPS.map(([k,t,i,d])=>`<button type="button" role="radio" aria-checked="${cur===k}" class="tp tp-${k} ${cur===k?'on':''}" data-act="${act}${k}">${ic(i,o.lg?18:16)}<span class="tp-t">${t}</span>${o.lg?`<span class="tp-d">${d}</span>`:''}</button>`).join('')}</div>`}

/* ---------- 4. lead documents ---------- */
const DOCCAT={client:{t:'Client documents',i:'idcard',types:['Emirates ID','Passport','Visa','Proof of address'],req:['Emirates ID','Passport']},finance:{t:'Financial',i:'wallet',types:['Proof of funds','Bank statement','Salary certificate','Mortgage pre-approval']},property:{t:'Property and offers',i:'building',types:['Offer letter','Reservation form','Signed payment plan','Title deed copy']},other:{t:'Other',i:'folder',types:['Correspondence','Power of attorney','Other']}};
const docCat=d=>d.cat||(d.kind==='KYC'?'client':Object.keys(DOCCAT).find(k=>DOCCAT[k].types.includes(d.kind))||'other');
const docType=d=>d.kind==='KYC'?'Emirates ID':d.kind;
function leadAllDocs(l){const out=[];
 l.docs.forEach(d=>out.push({src:docCat(d),srcT:DOCCAT[docCat(d)].t,name:d.name,type:docType(d),by:d.by,at:d.at,st:'Uploaded',id:d.id,own:true}));
 S.bookings.filter(b=>b.lead===l.id).forEach(b=>Object.keys(DOCN).forEach(k=>{const d=b.docs&&b.docs[k];if(d&&d.s!=='missing')out.push({src:'booking',srcT:'Booking '+b.id,name:d.name||DOCN[k]+'.pdf',type:DOCN[k],by:b.agent,at:d.at||b.raised,st:{uploaded:'Awaiting Admin',approved:'Approved',rejected:'Rejected'}[d.s]||d.s,go:'booking',bk:b.id})}));
 if(l.cn)CNDOCS.forEach(([k,t])=>{if(l.cn[k])out.push({src:'cn',srcT:'Convertible Note',name:t+'.pdf',type:t,by:l.owner,at:l.cn.submitted||l.assigned,st:'Received'})});
 return out.sort((a,b)=>(b.at||0)-(a.at||0))}
const DSTC={Uploaded:'s2','Awaiting Admin':'s5',Approved:'s6',Rejected:'s7',Received:'s6'};


mdef('doc-view-lead',{role:'shared'});
MD['doc-upload'].init=a=>({cat:a[1]||'',kind:a[2]||'',name:'',note:''});

A.dcat=a=>{UI.mf.cat=a[0];if(!DOCCAT[a[0]].types.includes(UI.mf.kind))UI.mf.kind='';if(UI.mf._e)delete UI.mf._e.cat;renderOverlay()};
A.docsave=a=>{const l=leadById(a[0]),f=UI.mf,e={};if(!f.cat)e.cat='Choose a category.';else if(!f.kind)e.kind='Choose the document type.';if(f.cat&&!f.name)e.name='Choose a file.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 l.docs.push({id:'d'+uid(),name:f.name,kind:f.kind,cat:f.cat,by:me().id,at:NOW(),note:f.note||''});addEv(l,'doc','Document uploaded: '+f.kind+' ('+DOCCAT[f.cat].t+')');closeM();toast(f.kind+' uploaded','ok');render()};

/* ---------- 6. email alongside WhatsApp ---------- */
const chanPick=(k,opts)=>`<div class="chanp">${(opts||[['WhatsApp','msg'],['Email','mail'],['Both','send']]).map(([v,i])=>`<button type="button" class="chanb ${mv(k)===v?'on':''}" data-act="mset|${k}|${v}">${ic(i,16)}${v==='Both'?'WhatsApp and email':v}</button>`).join('')}</div>`;
A.emailopen=a=>{const l=leadById(a[0]);addEv(l,'wa','Email opened to '+l.email);toast('Opening your email app for '+l.email)};
{const sh=MD['share'];const oi=sh.init;sh.init=a=>Object.assign(oi(a),{ch:'WhatsApp'});const orr=sh.render;sh.render=a=>{const o=orr(a);const l=leadById(a[0]);
 o.body=o.body.replace(/<div class="fld[^"]*"><label for="m_ch">Channel<\/label>[\s\S]*?<\/select><\/div>/,'').replace('<div class="frm">',`${fld('Send by',chanPick('ch'),{hint:UI.mf.ch==='WhatsApp'?'To '+esc(l.phone):UI.mf.ch==='Email'?'To '+esc(l.email):'To '+esc(l.phone)+' and '+esc(l.email)})}<div class="frm">`);
 o.foot=o.foot.replace(`${ic('send',16)}Send</button>`,`${ic('send',16)}Send ${UI.mf.ch==='Both'?'on both':'by '+(UI.mf.ch==='Email'?'email':'WhatsApp')}</button>`);return o}}
{const os=A.sharesave;A.sharesave=a=>{const ch=UI.mf.ch;if(ch==='Both')UI.mf.ch='WhatsApp and email';os(a)}}
{const sc=MD['send-confirm'];const orr=sc.render;sc.render=a=>{const o=orr(a);const l=leadById(a[0]);const tk=UI.mf.tok;if(!UI.mf.ch)UI.mf.ch='WhatsApp';
 if(!tk){o.body+=fld('Send the link by',chanPick('ch'),{hint:UI.mf.ch==='Email'?'To '+esc(l.email):UI.mf.ch==='WhatsApp'?'To '+esc(l.phone):'To '+esc(l.phone)+' and '+esc(l.email)})}
 else{const link=location.href.split('#')[0]+'#client-confirm-'+tk;o.body=o.body.replace(/(Send on WhatsApp<\/a>)/,`$1<a class="btn s" href="mailto:${esc(l.email)}?subject=${encodeURIComponent('Please confirm our meeting')}&body=${encodeURIComponent('Hi '+l.name.split(' ')[0]+', please confirm our meeting here: '+link)}" data-act="emailopen|${l.id}">${ic('mail',14)}Send by email</a>`)}
 return o}}
{const cs=MD['cn-share'];const orr=cs.render;cs.init=()=>({ch:'WhatsApp'});cs.render=a=>{const o=orr(a);const l=leadById(a[0]);o.body+=fld('Send by',chanPick('ch'),{hint:UI.mf.ch==='Email'?'To '+esc(l.email):UI.mf.ch==='WhatsApp'?'To '+esc(l.phone):'To '+esc(l.phone)+' and '+esc(l.email)});o.foot=o.foot.replace('Send on WhatsApp','Send '+(UI.mf.ch==='Both'?'on both':'by '+(UI.mf.ch==='Email'?'email':'WhatsApp')));return o}}
A.cnshare=a=>{const l=leadById(a[0]);const ch=UI.mf.ch==='Both'?'WhatsApp and email':UI.mf.ch||'WhatsApp';l.cn.stage='Information shared';addEv(l,'wa',ch+' sent: Convertible Note terms and payout schedule');closeM();toast('Sent by '+ch+' and logged','ok');render()};

/* ---------- 7. call log redesign ---------- */
const RESINFO={Connected:['phone','Spoke with the client','ok'],'Not answering':['phonex','Rang, no answer',''],'Not connected':['phoneoff','Busy, off or no network',''],'Wrong number':['hash','Not this person','bad'],'DND requested':['ban','Asked not to be called','bad']};
const DISPINFO={Interested:['thumb','Wants to hear more'],'Follow up':['repeat','Needs another touchpoint'],'Meeting fixed':['cal','Date agreed'],'Not interested':['thumbdown','Lead will be archived']};
const NOTECHIPS={Connected:['Asked for brochure','Price concern','Wants payment plan','Call back after work','Comparing projects'],other:['Phone switched off','Call back later','Sent WhatsApp instead','Busy, asked to call tomorrow']};
A.mdur=a=>{const v=Math.max(1,Math.min(180,(+UI.mf.dur||0)+(+a[0])));UI.mf.dur=String(v);renderOverlay()};
A.mnote=a=>{const t=a[0];const cur=(UI.mf.note||'').trim();UI.mf.note=cur?(cur.includes(t)?cur:cur+'. '+t):t;renderOverlay()};
{const cl=MD['call-log'];cl.render=a=>{const l=leadById(a[0]),f=UI.mf,e=f._e||{};const conn=f.res==='Connected';const need=['Interested','Follow up','Meeting fixed'].includes(f.disp);const est=f._est;const un=S.unlogged[me().id];const bad=f.res==='Wrong number'||f.res==='DND requested';
 const q=conn?[['Today 17:00',dtl(startOfDay(NOW())+13*HR)],['Tomorrow 11:00',dtl(startOfDay(NOW())+DAY+7*HR)],['In 3 days',dtl(startOfDay(NOW())+3*DAY+7*HR)],['Next week',dtl(startOfDay(NOW())+7*DAY+7*HR)]]:[['In 2 hours',dtl(Math.ceil((NOW()+2*HR)/(15*60000))*15*60000)],['This evening',dtl(startOfDay(NOW())+14*HR)],['Tomorrow 10:00',dtl(startOfDay(NOW())+DAY+6*HR)]];
 const step=(n,t,done)=>`<div class="clstep ${done?'done':''}"><span class="cls-n">${done?ic('check',12):n}</span><span>${t}</span></div>`;
 const when=`<div class="clsec">${step(conn?4:2,conn?'Next step':'Try again',!!f.nat)}${conn?`<div class="optgrid">${mopt('ntype','Follow-up','Follow-up','Call or message again')}${mopt('ntype','Meeting','Meeting','In person or online')}</div>`:''}<div class="row g6 wrap">${q.map(x=>`<button class="pill ${f.nat===x[1]?'on':''}" type="button" data-act="mset|nat|${x[1]}">${x[0]}</button>`).join('')}</div>${fld('Or pick a date and time (Dubai)',minp('nat',{type:'datetime-local',bad:!!e.nat}),{for:'m_nat',err:e.nat})}${conn&&f.ntype==='Meeting'?`<div class="frm">${fld('Meeting type',`<div class="seg">${[['in-person','In person'],['virtual','Online']].map(([v,t])=>`<button type="button" class="${f.mkind===v?'on':''}" data-act="mset|mkind|${v}">${t}</button>`).join('')}</div>`)}${fld(f.mkind==='virtual'?'Meeting link or app':'Place',minp('mplace',{bad:!!e.mplace,ph:f.mkind==='virtual'?'Google Meet':'Marina Views sales gallery'}),{for:'m_mplace',err:e.mplace})}</div>`:''}</div>`;
 const sum=[f.res,conn&&f.dur?f.dur+' min':'',conn?f.disp:'',f.temp&&conn?cap1(f.temp):'',f.nat?(f.ntype||'Follow-up')+' '+fts(dtp(f.nat)):''].filter(Boolean).join(' · ');
 const body=`<div class="clhead">${av(l.name)}<div style="min-width:0;flex:1"><div class="b trunc">${esc(l.name)}</div><div class="xs muted">${esc(l.phone)} · ${l.attempts} earlier attempt${l.attempts===1?'':'s'}</div></div>${un&&un.lead===l.id?`<span class="chip s3">${ic('clock',12)}Called ${fhm(un.t)}</span>`:`<span class="chip s2">Manual log</span>`}</div>
 <div class="clsec">${step(1,'How did the call go?',!!f.res)}<div class="resgrid">${CALLRES.map(r=>{const[i,d,k]=RESINFO[r];return `<button type="button" class="resb ${k} ${f.res===r?'on':''} ${r==='Connected'?'wide':''}" data-act="mset|res|${r}"><span class="rb-i">${ic(i,18)}</span><span><span class="rb-t">${r}</span><span class="rb-d">${d}</span></span></button>`}).join('')}</div>${e.res?`<span class="err">${ic('alert',14)}${e.res}</span>`:''}</div>
 ${conn?`<div class="clsec">${step(2,'Call length and temperature',!!f.dur&&!!f.temp)}<div class="durrow"><div class="stepper"><button type="button" data-act="mdur|-1" aria-label="One minute less">${ic('minus',16)}</button>${minp('dur',{type:'number',min:1,bad:!!e.dur})}<button type="button" data-act="mdur|1" aria-label="One minute more">${ic('plus',16)}</button></div><span class="muted sm">min</span><div class="row g6 wrap">${[2,5,10,15].map(m=>`<button type="button" class="pill ${String(f.dur)===String(m)?'on':''}" data-act="mset|dur|${m}">${m} min</button>`).join('')}</div></div><span class="hint muted sm">${est?'App estimate: about '+est+' min. Large gaps are flagged to your manager.':'Not dialled from the app, so this is logged as a manual call.'}</span>${e.dur?`<span class="err">${ic('alert',14)}${e.dur}</span>`:''}${tempPick(f.temp,'mset|temp|')}</div>
 <div class="clsec">${step(3,'What was the outcome?',!!f.disp)}<div class="resgrid">${S.set.dispositions.map(d=>{const[i,t]=DISPINFO[d]||['check',''];return `<button type="button" class="resb ${d==='Not interested'?'bad':d==='Meeting fixed'?'ok':''} ${f.disp===d?'on':''}" data-act="mset|disp|${d}"><span class="rb-i">${ic(i,18)}</span><span><span class="rb-t">${d}</span><span class="rb-d">${t}</span></span></button>`}).join('')}</div>${e.disp?`<span class="err">${ic('alert',14)}${e.disp}</span>`:''}${f.disp==='Not interested'?bn('warn','This archives the lead','It leaves your active list. Add a reason in the notes.'):''}</div>`:''}
 ${f.res==='Wrong number'?bn('warn','Number will be flagged invalid','The lead is archived and Admin is told so the source can be reviewed.'):''}${f.res==='DND requested'?bn('err','Number goes on the Do Not Call list','No agent can call it again. The lead is archived. Only Admin can remove it.'):''}
 ${(conn&&need)||(f.res&&!conn&&!bad)?when:''}
 ${f.res?`<div class="clsec">${step(conn?(need?5:4):(bad?2:3),'Notes'+(f.disp==='Not interested'?' (reason required)':''),!!(f.note||'').trim())}<div class="row g6 wrap">${(conn?NOTECHIPS.Connected:NOTECHIPS.other).map(t=>`<button type="button" class="pill sm" data-act="mnote|${t}">${ic('plus',12)}${t}</button>`).join('')}</div>${mtxa('note',{bad:!!e.note,ph:'What did the client say?'})}${e.note?`<span class="err">${ic('alert',14)}${e.note}</span>`:''}</div>`:''}`;
 return {title:'Log call',sub:'Takes about 20 seconds',body,size:'w',foot:`${sum?`<span class="clsum">${esc(sum)}</span>`:''}<button class="btn" type="button" data-act="mclose">Cancel</button><button class="btn pri" type="button" data-act="callsave|${l.id}"${f.res?'':' disabled'}>${ic('check',16)}${bad?'Save and archive':'Save call'}</button>`}}}
{const oi=MD['call-log'].init;MD['call-log'].init=a=>{const o=oi(a);if(!o.dur)o.dur='';return o}}

/* ===== 14-journey: in-CRM email with Admin templates, up-next call loop, approve-and-next, page flash ===== */

/* ---------- email templates (Admin owned) ---------- */
const TPLVARS=[['first_name','Client first name','Mayank'],['agent_name','Agent name','Archit Batham'],['agent_phone','Agent phone','+971 50 700 2101'],['project','Project','Marina Views'],['area','Area','Dubai Marina'],['price_from','Price from','AED 800K'],['price_to','Price to','AED 3.5M'],['payment_plan','Payment plan','60/40'],['handover','Handover','Q2 2027'],['meeting_time','Meeting time','Wed 29 Oct, 11:00'],['place','Meeting place','Marina Views sales gallery'],['confirm_link','Confirmation link','durraniestates.com/c/7Hq2'],['amount','Note amount','AED 920,000'],['monthly_payout','Monthly payout','AED 13,800'],['tenure','Tenure','36 months'],['booking_id','Booking ID','BKG-10021'],['unit','Unit','U-3102']];
const TPLCAT={property:'Project details',meeting:'Meeting',followup:'Follow-up',cn:'Convertible Notes',booking:'Booking'};
function seedTpls(){return [
 {id:'t1',name:'Project details',cat:'property',lang:'en',active:true,attach:'Project brochure',needs:['project'],subject:'{project} in {area}: prices and payment plan',body:'Hi {first_name},\n\nThank you for your time today. As promised, here are the details for {project} in {area}.\n\nPrices: {price_from} to {price_to}\nPayment plan: {payment_plan}\nHandover: {handover}\n\nThe brochure is attached. I can arrange a visit to the sales gallery whenever it suits you.\n\nBest regards,\n{agent_name}\nDurrani Estates · {agent_phone}',upd:'u1'},
 {id:'t2',name:'Project details (Arabic)',cat:'property',lang:'ar',active:true,attach:'Project brochure',needs:['project'],subject:'{project} في {area}: الأسعار وخطة الدفع',body:'مرحباً {first_name}،\n\nشكراً لوقتك اليوم. إليك تفاصيل {project} في {area}.\n\nالأسعار: من {price_from} إلى {price_to}\nخطة الدفع: {payment_plan}\nالتسليم: {handover}\n\nمع أطيب التحيات،\n{agent_name}\nدوراني العقارية · {agent_phone}',upd:'u1'},
 {id:'t3',name:'Meeting confirmation link',cat:'meeting',lang:'en',active:true,attach:'',needs:['meeting'],subject:'Please confirm our meeting on {meeting_time}',body:'Hi {first_name},\n\nThank you for meeting me at {place} on {meeting_time}. Please confirm the meeting using this private link. It takes less than a minute and works for 24 hours:\n\n{confirm_link}\n\nBest regards,\n{agent_name}\nDurrani Estates',upd:'u1'},
 {id:'t4',name:'Follow-up after a call',cat:'followup',lang:'en',active:true,attach:'',needs:[],subject:'Following up on our call',body:'Hi {first_name},\n\nIt was good speaking with you. If you have any questions about the projects we discussed, reply to this email or call me on {agent_phone}.\n\nBest regards,\n{agent_name}\nDurrani Estates',upd:'u1'},
 {id:'t5',name:'Convertible Note terms',cat:'cn',lang:'en',active:true,attach:'Convertible Note terms',needs:['cn'],subject:'Your Durrani Convertible Note illustration',body:'Hi {first_name},\n\nHere is the illustration we discussed.\n\nInvestment: {amount}\nMonthly payout: {monthly_payout} for {tenure}\nYour principal is returned in full at maturity.\n\nThe full terms are attached.\n\nBest regards,\n{agent_name}\nDurrani Estates',upd:'u1'},
 {id:'t6',name:'Booking received',cat:'booking',lang:'en',active:true,attach:'',needs:['booking'],subject:'We received your booking {booking_id}',body:'Hi {first_name},\n\nThank you. Your booking {booking_id} for unit {unit} at {project} has been received and is being reviewed. I will update you as soon as it is approved.\n\nBest regards,\n{agent_name}\nDurrani Estates',upd:'u1'},
 {id:'t7',name:'Old price list',cat:'property',lang:'en',active:false,attach:'Price list',needs:['project'],subject:'{project} price list',body:'Hi {first_name},\n\nPlease find the {project} price list attached.\n\n{agent_name}',upd:'u1'}]}
{const oi=initState;initState=function(){oi();S.tpls=seedTpls();S.emails=[
 {id:'e1',lead:'1023',tpl:'t1',subject:'Marina Views in Dubai Marina: prices and payment plan',to:'mayank.singh@example.com',by:'u10',at:NOW()-6*DAY,status:'Opened'},
 {id:'e2',lead:'1035',tpl:'t4',subject:'Following up on our call',to:'karan.malhotra@example.com',by:'u10',at:NOW()-9*DAY,status:'Delivered'},
 {id:'e3',lead:'2047',tpl:'t5',subject:'Your Durrani Convertible Note illustration',to:'emma.wilson@example.com',by:'u10',at:NOW()-2*DAY,status:'Opened'},
 {id:'e4',lead:'1102',tpl:'t1',subject:'Palm Residences in Palm Jumeirah: prices and payment plan',to:'rohan.tan@example.com',by:'u10',at:NOW()-11*DAY,status:'Bounced'}]}}
const tplById=id=>S.tpls.find(t=>t.id===id);
function tplVals(l,ctx){ctx=ctx||{};const u=l.owner?S.users.find(x=>x.id===l.owner):me();const v={first_name:l.name.split(' ')[0],agent_name:u?u.name:'',agent_phone:u&&u.phone?u.phone:'+971 4 000 0000'};
 if(ctx.p){const p=projById(ctx.p);Object.assign(v,{project:p.name,area:p.area,price_from:money(p.from),price_to:money(p.to),payment_plan:p.plan,handover:p.ho})}
 const m=ctx.m?l.meets.find(x=>x.id===ctx.m):l.meets.filter(x=>['scheduled','link-sent'].includes(x.status)).sort((a,b)=>b.at-a.at)[0];
 if(m){Object.assign(v,{meeting_time:f2(m.at,{weekday:'short',day:'numeric',month:'short'})+', '+fhm(m.at),place:m.kind==='virtual'?'our online meeting':m.place,confirm_link:m.token?'durraniestates.com/c/'+m.token.slice(0,6):''})}
 if(l.cn){const c=cnCalc(l.cn.amount,NOW());Object.assign(v,{amount:mfull(l.cn.amount,l.cn.cur),monthly_payout:mfull(c.m,l.cn.cur),tenure:c.n+' months'})}
 const b=ctx.b?bkById(ctx.b):S.bookings.filter(x=>x.lead===l.id).sort((x,y)=>(y.submitted||0)-(x.submitted||0))[0];if(b)Object.assign(v,{booking_id:b.id,unit:b.unit,project:v.project||projById(b.project).name});
 return v}

const fillPlain=(txt,v)=>String(txt).replace(/\{([a-z_]+)\}/g,(m,k)=>v[k]!=null&&v[k]!==''?v[k]:m);
const EMST={Sent:'s2',Delivered:'s1',Opened:'s6',Bounced:'s7'};

/* ---------- compose (agent): templates only ---------- */
mdef('email-compose',{role:'agent',init:a=>{const l=leadById(a[0]);const t=a[1]||'';const ctx={};if(a[2])ctx.p=a[2];if(a[3])ctx.m=a[3];return {tpl:t||(l.arabic?'t2':''),p:ctx.p||(l.shortlist[0]?l.shortlist[0].p:''),m:ctx.m||''}}});
A.emailsend=a=>{const l=leadById(a[0]),f=UI.mf;const t=tplById(f.tpl);if(!t){UI.mf._e={tpl:'Choose a template.'};renderOverlay();return}const v=tplVals(l,{p:f.p,m:f.m});const subj=fillPlain(t.subject,v);
 sendMail(l,t,subj,v);closeM();toast('Email sent to '+l.email,'ok');render()};
function sendMail(l,t,subj,v){S.emails.unshift({id:'e'+uid(),lead:l.id,tpl:t.id,subject:subj,to:l.email,by:me().id,at:NOW(),status:'Sent'});addEv(l,'mail','Email sent: '+subj,{tpl:t.id});
 if(t.needs.includes('project')&&v.project){const p=S.projects.find(x=>x.name===v.project);if(p&&!l.shortlist.some(s=>s.p===p.id))l.shortlist.push({p:p.id,primary:!l.shortlist.length})}
 const em=S.emails[0];setTimeout(()=>{em.status='Delivered';if(document.querySelector('[data-emails]'))render()},2500)}
A.emailopen=a=>openM('email-compose',[a[0]]);

/* wire email into share, meeting link and Convertible Note flows */
{const os=A.sharesave;A.sharesave=a=>{const f=UI.mf;const ch=f.ch;const l=leadById(a[0]);if(f.p&&(ch==='Email'||ch==='Both'||ch==='WhatsApp and email')){const t=tplById(f.lang==='ar'?'t2':'t1');const v=tplVals(l,{p:f.p});sendMail(l,t,fillPlain(t.subject,v),v)}if(ch==='Email'){closeM();toast('Email sent to '+l.email,'ok');render();return}os(a)}}
{const og=A.genlink;A.genlink=a=>{const ch=UI.mf.ch;og(a);if(ch==='Email'||ch==='Both'){const l=leadById(a[0]);const t=tplById('t3');const v=tplVals(l,{m:a[1]});sendMail(l,t,fillPlain(t.subject,v),v);toast('Link sent by email to '+l.email,'ok');renderOverlay()}}}
{const oc=A.cnshare;A.cnshare=a=>{const ch=UI.mf.ch;const l=leadById(a[0]);if(ch==='Email'||ch==='Both'){const t=tplById('t5');const v=tplVals(l);sendMail(l,t,fillPlain(t.subject,v),v)}oc(a)}}
/* lead overview: emails card */
{const ol=leadOverview;leadOverview=function(role,l){const h=ol(role,l);const em=S.emails.filter(x=>x.lead===l.id);const mine=role==='agent'&&!l.archived;
 const c=card('Emails',em.length?`<div class="mlist" data-emails="1">${em.slice(0,4).map(x=>`<div class="mrow"><span class="dr-ic dr-client">${ic('mail',15)}</span><div class="dr-m"><div class="b trunc">${esc(x.subject)}</div><div class="xs muted">${esc((tplById(x.tpl)||{}).name||'Template')} · ${esc(uname(x.by))} · ${fts(x.at)}</div></div>${chip(x.status,EMST[x.status]||'s2')}</div>`).join('')}</div>${em.some(x=>x.status==='Bounced')?`<div class="mt8">${bn('warn','','An email bounced. Check the address with the client.')}</div>`:''}`:`<p class="muted sm">No emails sent yet.</p>`,{right:mine?`<button class="btn s" type="button" data-open="email-compose|${l.id}">${ic('mail',14)}Send email</button>`:''});
 const i=h.lastIndexOf('</div></div>');return h.slice(0,i)+c+h.slice(i)}}
/* timeline icon for mail */
{const ot=leadTimeline;leadTimeline=function(role,l){return ot(role,l).replace(/<div class="ico "><svg[^>]*>[\s\S]*?<\/svg><\/div><div><div class="tt">Email sent/g,m=>m.replace('class="ico "','class="ico mail"').replace(/<svg[\s\S]*?<\/svg>/,ic('mail',14)))}}

/* ---------- Admin: email templates in Settings ---------- */
SETTABS.push(['email','Email templates']);
R['admin-settings'].sample.push(['email']);

A.tpltog=a=>{const t=tplById(a[0]);t.active=!t.active;audit('Email template '+(t.active?'turned on':'turned off'),t.name,t.active?'Off':'On',t.active?'On':'Off');toast(t.name+(t.active?' is on':' is off'),'ok');render()};
mdef('tpl-edit',{role:'admin',init:a=>{const t=a[0]?tplById(a[0]):null;return t?{name:t.name,cat:t.cat,lang:t.lang,subject:t.subject,body:t.body,attach:t.attach||''}:{name:'',cat:'followup',lang:'en',subject:'',body:'Hi {first_name},\n\n\n\nBest regards,\n{agent_name}\nDurrani Estates',attach:''}}});
A.rr=()=>renderOverlay();
A.tplvar=a=>{const el=document.getElementById('m_body');const tok='{'+a[0]+'}';if(el&&el.selectionStart!=null){const s=el.value;const i=el.selectionStart;UI.mf.body=s.slice(0,i)+tok+s.slice(el.selectionEnd)}else UI.mf.body=(UI.mf.body||'')+tok;renderOverlay()};
A.tplsave=a=>{const f=UI.mf,e={};if(!(f.name||'').trim())e.name='Enter a name.';if(!(f.subject||'').trim())e.subject='Enter a subject.';if(!(f.body||'').trim())e.body='Write the email.';const sample=Object.fromEntries(TPLVARS.map(x=>[x[0],1]));const bad=((f.subject||'')+(f.body||'')).match(/\{([a-z_]+)\}/g)||[];if(bad.some(x=>!sample[x.slice(1,-1)]))e.body='Remove or fix the unknown fields.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 const txt=f.subject+f.body;const needs=[];if(/\{(project|area|price_from|price_to|payment_plan|handover)\}/.test(txt))needs.push('project');if(/\{(meeting_time|place|confirm_link)\}/.test(txt))needs.push('meeting');if(/\{(amount|monthly_payout|tenure)\}/.test(txt))needs.push('cn');if(/\{(booking_id|unit)\}/.test(txt))needs.push('booking');
 if(a[0]){const t=tplById(a[0]);Object.assign(t,{name:f.name.trim(),cat:f.cat,lang:f.lang,subject:f.subject,body:f.body,attach:f.attach,needs,upd:me().id});audit('Email template changed',t.name,'','Updated')}else{S.tpls.push({id:'t'+uid(),name:f.name.trim(),cat:f.cat,lang:f.lang,subject:f.subject,body:f.body,attach:f.attach,needs,active:true,upd:me().id});audit('Email template created',f.name.trim(),'','Created')}
 closeM();toast('Template saved','ok');render()};

/* ---------- page flash (same-page next-step prompts) ---------- */
function flashHtml(){const f=UI.pf&&UI.pf._flash;if(!f)return '';return `<div class="mb16 flash">${bn(f.kind||'ok',f.t,f.d,(f.acts||'')+`<button class="btn ghost s" type="button" data-act="flashx" aria-label="Dismiss">${ic('x',14)}</button>`)}</div>`}
A.flashx=()=>{if(UI.pf)delete UI.pf._flash;render()};
function unloggedBanner(role){if(!S.session)return '';let h='';if(role==='agent'){const p=S.unlogged[S.session.userId];if(p&&!new RegExp('^agent-lead-'+p.lead+'(-|$)').test(hashOf())){const l=leadById(p.lead);h+=`<div class="mb16">${bn('warn','Unlogged call','You called '+esc(l.name)+' '+rel(p.t)+'. Log the result before your next call.',`<button class="btn pri s" type="button" data-open="call-log|${l.id}">Log call</button><a class="btn s" href="#agent-lead-${l.id}" data-go="agent-lead-${l.id}">Open lead</a>`)}</div>`}}return h+flashHtml()}

/* up-next call loop for agents */
const nextUpFor=(uid,skip)=>leadsOf(uid).filter(l=>!l.archived&&l.id!==skip&&!l.dnd&&!isDnd(l.phone)).sort((a,b)=>prio(a)-prio(b))[0];
const whyOf=l=>isOverdue(l)?'Follow-up overdue':leadRisk(l).state==='risk'?'At risk':isToday(l)&&!l.next.done?'Due today':!l.attempts?'Not contacted yet':l.temp==='hot'?'Hot lead':'Top of your list';
{const oc=A.callsave;A.callsave=a=>{const before=document.querySelector('#overlay .scrim');oc(a);if(UI.m)return;const l=leadById(a[0]);if(l.archived)return;const nx=nextUpFor(me().id,l.id);if(!nx)return;
 UI.pf._flash={kind:'brand',t:'Call saved. Next up: '+esc(nx.name),d:esc(whyOf(nx))+' · LEAD-'+nx.id+' · '+esc(nx.phone),acts:`<a class="btn callb s" href="tel:${esc(nx.phone.replace(/\s/g,''))}" data-act="dialnext|${nx.id}">${ic('phone',14)}Call ${esc(nx.name.split(' ')[0])}</a><a class="btn s" href="#agent-lead-${nx.id}" data-go="agent-lead-${nx.id}">Open lead</a>`};render()}}
A.dialnext=a=>{location.hash='agent-lead-'+a[0];setTimeout(()=>A.dial([a[0]]),30)};

/* approve-and-next for Admin review */
['bkapprove','docdec','bkclose','chgsave','rejsave','docrej','cndecide','secdecide'].forEach(k=>{const o=A[k];if(!o)return;A[k]=(a,el)=>{const h0=hashOf();o(a,el);if(!S.session||S.session.role!=='admin'||UI.m)return;setTimeout(()=>{if(hashOf()!==h0)return;const q=pendingReview().sort((x,y)=>(x.at||0)-(y.at||0));if(!q.length){UI.pf._flash={kind:'ok',t:'Review queue is clear',d:'Nothing else is waiting for your decision.',acts:`<a class="btn s" href="#admin-home" data-go="admin-home">Back to home</a>`}}else{const n=q[0];const g=reviewGo(n);if(g===h0&&q.length===1)return;UI.pf._flash={kind:'brand',t:'Done. '+q.length+' more waiting',d:'Next: '+esc(reviewTitle(n))+' from '+esc(reviewWho(n)),acts:`<a class="btn pri s" href="#${g}" data-go="${g}">Review next</a><a class="btn s" href="#admin-review" data-go="admin-review">Open queue</a>`}}render()},0)}});

/* ===== v6 A: attendance calendar, requests, manager leave, IP location ===== */
IC.dl='<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>';
const LEAVE_TYPES=['Casual leave','Sick leave','Unpaid leave'];
const LVAB={'Casual leave':'CL','Sick leave':'SL','Unpaid leave':'UL','On leave':'LV'};
const SHIFT={start:9*60+30,end:18*60+30,grace:15};
const hmOf=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const minsOf=t=>{const d=new Date(t+4*HR);return d.getUTCHours()*60+d.getUTCMinutes()};
const dowOf=t=>new Date(startOfDay(t)+4*HR).getUTCDay();
const roleTeam=id=>{const u=userById(id);if(!u)return '';return (u.role==='mgmt'?'Manager · ':'')+esc(teamName(u.team)||'')};

/* ---------- seed patch (runs after the base seed) ---------- */
function v6seed(){
 const now=S.now,M0=startOfDay(now),T=(h,m,d)=>M0+(d||0)*DAY+h*HR+(m||0)*MIN;let _s=11;const rnd=()=>{_s=(_s*9301+49297)%233280;return _s/233280};
 S.set.shift={start:hmOf(SHIFT.start),end:hmOf(SHIFT.end),grace:SHIFT.grace};
 /* more leave, incl. managers */
 S.leave.push({id:'lv7',user:'u11',type:'Sick leave',from:T(0,0,-22),to:T(0,0,-22),days:1,reason:'Fever',status:'approved',by:'u2',at:T(9,0,-22)},
  {id:'lv8',user:'u16',type:'Unpaid leave',from:T(0,0,-13),to:T(0,0,-13),days:1,reason:'Personal work',status:'approved',by:'u3',at:T(9,0,-16)},
  {id:'lv9',user:'u2',type:'Casual leave',from:T(0,0,-8),to:T(0,0,-8),days:1,reason:'Family function',status:'approved',by:'u1',at:T(9,0,-12)},
  {id:'lv10',user:'u2',type:'Casual leave',from:T(0,0,6),to:T(0,0,7),days:2,reason:'Travelling home',status:'pending',at:T(9,30,-1)});
 S.leave.forEach(l=>{l.hist=l.hist||[];l.hist.push({a:'Requested',by:l.user,at:l.at||l.from-3*DAY});if(l.status!=='pending')l.hist.push({a:cap1(l.status),by:l.by||'u2',at:l.at||l.from-DAY,why:l.note||''})});
 S.reg.forEach(r=>{r.hist=[{a:'Requested',by:r.user,at:r.date+DAY}]});
 /* attendance for everyone in October */
 const people=S.users.filter(u=>['agent','mgmt'].includes(u.role)&&u.status==='active');const first=startOfDay(Date.parse('2026-10-01T08:00:00+04:00'));
 const onLeave=(u,d)=>S.leave.some(l=>l.user===u&&l.status==='approved'&&d>=startOfDay(l.from)&&d<=startOfDay(l.to));
 people.forEach(p=>{for(let d=first;d<M0;d+=DAY){const dw=dowOf(d);if(dw===0||dw===6)continue;if(p.id==='u10'&&d>=M0-14*DAY)continue;if(onLeave(p.id,d))continue;const x=rnd();let inn=d+9*HR+Math.round(rnd()*40)*MIN,out=d+18*HR+(30+Math.round(rnd()*60))*MIN,st='Present';
  if(x<.11){inn=d+10*HR+Math.round(rnd()*80)*MIN;st='Late'}else if(x<.16){out=d+16*HR+Math.round(rnd()*90)*MIN;st='Early leave'}else if(x<.19){out=null;st='Miss punch'}else if(x<.205){inn=null;out=null;st='Absent'}
  S.att.push({u:p.id,date:d,in:inn,out,st,reg:null})}});
 S.punch.u2={in:true,t:T(9,2),brk:false};S.punch.u3={in:true,t:T(9,48),brk:false};S.todayAtt.u2={st:'Present',in:T(9,2)};S.todayAtt.u3={st:'Late',in:T(9,48)};S.todayAtt.u16={st:'Present',in:T(9,25)};S.punch.u16={in:true,t:T(9,25),brk:false};
 /* IP sessions */
 const G=(u,ev,at,ip,city,cc,isp,dev,x)=>Object.assign({id:'g'+uid(),u,ev,at,ip,city,cc,isp,dev},x||{});
 S.geo=[G('u11','Punch in',T(9,5),'94.200.141.22','Dubai','AE','du (EITC)','iPhone 15 · App'),G('u12','Punch in',T(10,12),'185.220.101.4','Frankfurt','DE','Private VPN network','iPhone 13 · App',{vpn:true}),G('u15','Punch in',T(9,20),'5.195.66.180','Sharjah','AE','Etisalat','Samsung S23 · App'),
  G('u2','Punch in',T(9,2),'94.200.141.10','Dubai','AE','du (EITC)','MacBook · Chrome'),G('u3','Punch in',T(9,48),'49.36.120.77','Mumbai','IN','Reliance Jio','Windows · Edge'),G('u16','Punch in',T(9,25),'103.21.58.90','Pune','IN','Airtel','iPhone 14 · App',{newdev:true}),
  G('u10','Sign in',T(8,51),'94.200.141.31','Dubai','AE','du (EITC)','iPhone 15 Pro · App'),G('u12','Sign in',T(10,10),'185.220.101.4','Frankfurt','DE','Private VPN network','iPhone 13 · App',{vpn:true}),G('u11','Punch out',T(19,4,-1),'94.200.141.22','Dubai','AE','du (EITC)','iPhone 15 · App'),
  G('u13','Punch in',T(9,58,-1),'2.50.12.4','Abu Dhabi','AE','Etisalat','Pixel 8 · App'),G('u14','Punch in',T(9,10,-1),'94.200.141.40','Dubai','AE','du (EITC)','iPhone 12 · App'),G('u10','Punch in',T(9,15,-1),'94.200.141.31','Dubai','AE','du (EITC)','iPhone 15 Pro · App')];
 /* flagged calls get numbers so the manager can judge */
 S.activity.forEach((a,i)=>{a.id='ac'+i;if(a.flag){a.logged=a.logged||12;a.est=a.est||2}});
 /* convertible notes: per-document verification */
 S.leads.forEach(l=>{if(l.cn){l.cn.dv=l.cn.dv||{};if(l.cn.stage==='Admin review'){l.cn.dv.kyc={s:'verified',by:'u2',at:T(15,0,-1)};l.cn.dv.nominee={s:'verified',by:'u2',at:T(15,5,-1)}}}});
 /* lead sources */
 S.sources={meta:{on:true,acct:'Durrani Estates (Business Manager)',page:'Durrani Estates Dubai',since:T(10,0,-40),last:T(9,52),health:'ok',forms:[{id:'f1',name:'Marina Views · Sept lead form',camp:'Meta · Marina Views Sept',proj:'p1',route:'pool',n7:64},{id:'f2',name:'Creekside · Oct form',camp:'Instagram · Creekside Oct',proj:'p4',route:'team|t1',n7:38}]},google:{on:false,forms:[]}};
 /* team queues: a few pool leads routed to Dubai Sales */
 S.leads.filter(l=>!l.owner&&!l.archived&&l.camp==='Instagram · Creekside Oct').slice(0,4).forEach(l=>{l.team='t1';l.own=l.own||[];l.own.unshift({from:null,to:null,team:'t1',reason:'Routing rule: Creekside form goes to Dubai Sales',by:'system',at:l.created||NOW()})});
}
{const _is=initState;initState=function(){_is();v6seed()}}

/* ---------- request status, actions, undo ---------- */

function canDecide(x){const u=me();if(!u||x.user===u.id)return false;const who=userById(x.user);if(u.role==='admin')return true;return u.role==='mgmt'&&who&&who.role==='agent'&&who.team===u.team}

{const od=A.leavedec;A.leavedec=a=>{const x=S.leave.find(l=>l.id===a[0]);x.hist=x.hist||[];x.hist.push({a:cap1(a[1]),by:me().id,at:NOW(),why:a[1]==='rejected'?(UI.mf.why||'').trim():''});od(a);if(userById(x.user).role==='mgmt')notify(x.user,{t:'Leave '+a[1],d:x.type+' · '+fds(x.from),go:'mgmt-myatt',ic:'cal'})}}
{const od=A.regdec;A.regdec=a=>{const r=S.reg.find(x=>x.id===a[0]);if(a[1]==='approved'){const row=S.att.find(x=>x.u===r.user&&x.date===r.date);r._prev=row?{in:row.in,out:row.out,st:row.st,reg:row.reg}:null}r.hist=r.hist||[];r.hist.push({a:cap1(a[1]),by:me().id,at:NOW(),why:a[1]==='rejected'?(UI.mf.why||'').trim():''});od(a)}}
const UNDO={withdraw:['Withdraw request','Withdraw','Your approver no longer sees it. You can send a new request later.'],cancel:['Cancel approved leave','Cancel leave','The leave is removed from the calendar and your approver is told.'],revoke:['Revoke approval','Revoke','The approval is reversed and the person is told.'],reopen:['Reopen request','Reopen','The request goes back to pending so it can be decided again.']};
mdef('req-undo',{role:'shared',init:()=>({why:''})});
A.requndo=a=>{const [kind,id,mode]=a;const why=(UI.mf.why||'').trim();if(!why){UI.mf._e={why:'Add a reason.'};renderOverlay();return}const x=(kind==='leave'?S.leave:S.reg).find(y=>y.id===id);const was=x.status;const u=me();
 x.status={withdraw:'withdrawn',cancel:'cancelled',revoke:'revoked',reopen:'pending'}[mode];x.hist=x.hist||[];x.hist.push({a:{withdraw:'Withdrawn',cancel:'Cancelled',revoke:'Revoked',reopen:'Reopened'}[mode],by:u.id,at:NOW(),why});x.note=why;
 if(kind==='leave'&&(mode==='revoke'||mode==='cancel')&&x.from<=NOW()+DAY&&S.todayAtt[x.user]&&S.todayAtt[x.user].st==='On leave'&&sameDay(x.from,NOW()))S.todayAtt[x.user]=null;
 if(kind==='reg'&&mode==='revoke'){const row=S.att.find(y=>y.u===x.user&&y.date===x.date);if(row){if(x._prev)Object.assign(row,x._prev);else{row.st='Absent';row.in=null;row.out=null;row.reg=null}}}
 const who=userById(x.user);const approver=who.role==='mgmt'?'admin':teamById(who.team).mgr;
 if(x.user===u.id)notify(approver,{t:(kind==='leave'?'Leave ':'Regularisation ')+(mode==='cancel'?'cancelled':'withdrawn'),d:u.name+': '+why,go:who.role==='mgmt'?'admin-hr-leave':'mgmt-leave',ic:'cal'});else notify(x.user,{t:(kind==='leave'?'Leave ':'Regularisation ')+(mode==='revoke'?'approval revoked':'reopened'),d:why,go:who.role==='mgmt'?'mgmt-myatt':'agent-attendance',ic:'cal'});
 audit((kind==='leave'?'Leave ':'Regularisation ')+({withdraw:'withdrawn',cancel:'cancelled',revoke:'approval revoked',reopen:'reopened'}[mode]),uname(x.user)+' '+fds(kind==='leave'?x.from:x.date),cap1(was),cap1(x.status)+'. '+why);closeM();toast({withdraw:'Request withdrawn',cancel:'Leave cancelled',revoke:'Approval revoked',reopen:'Request reopened'}[mode],'ok');render()};
/* leave and regularisation modals: say who approves */

/* ---------- attendance tabs ---------- */

def('agent-attcal',{role:'agent',level:'L2',title:'Attendance calendar',nav:'agent-attendance',sample:[[]],crumb:()=>[{l:'Attendance',go:'agent-attendance'},{l:'Calendar'}]});
def('mgmt-attcal',{role:'mgmt',level:'L2',title:'Attendance calendar',nav:'mgmt-attendance',sample:[[]],crumb:()=>[{l:'Team Attendance',go:'mgmt-attendance'},{l:'Calendar'}]});
def('mgmt-myatt',{role:'mgmt',level:'L2',title:'My attendance',nav:'mgmt-attendance',sample:[[]],crumb:()=>[{l:'Team Attendance',go:'mgmt-attendance'},{l:'My attendance'}]});

/* ---------- day status ---------- */
function leaveOn(uid,day){return S.leave.find(l=>l.user===uid&&['approved','pending'].includes(l.status)&&day>=startOfDay(l.from)&&day<=startOfDay(l.to))}
function dayInfo(uid,day){const lv=leaveOn(uid,day);const dw=dowOf(day);const today=startOfDay(NOW());
 if(lv&&lv.status==='approved')return {k:'leave',t:lv.type,ab:LVAB[lv.type]||'LV',lv};
 if(dw===0||dw===6)return {k:'off',t:'Weekend',ab:''};
 if(day>today)return lv?{k:'lpend',t:lv.type+' requested',ab:LVAB[lv.type]||'LV',lv}:{k:'future',t:'',ab:''};
 if(day===today){const ta=S.todayAtt[uid],p=punchState(uid);if(ta&&ta.st==='On leave')return {k:'leave',t:'On leave',ab:'LV'};if(ta&&ta.st==='Absent')return {k:'abs',t:'Absent',ab:'A'};const inn=ta&&ta.in||(p.in?p.t:null);if(!inn)return {k:'none',t:'Not in yet',ab:'·'};const late=minsOf(inn)>SHIFT.start+SHIFT.grace;return {k:late?'late':'ok',t:late?'Late':'On time',ab:late?'L':'P',in:inn,out:p.outAt&&sameDay(p.outAt,NOW())?p.outAt:null,late,today:true}}
 const r=S.att.find(a=>a.u===uid&&startOfDay(a.date)===day);if(!r)return lv?{k:'lpend',t:lv.type+' requested',ab:LVAB[lv.type],lv}:{k:'none',t:'No record',ab:'·'};
 const late=!!(r.in&&minsOf(r.in)>SHIFT.start+SHIFT.grace),early=!!(r.out&&minsOf(r.out)<SHIFT.end);const reg=r.reg==='approved';
 if(!r.in&&!r.out)return {k:'abs',t:'Absent',ab:'A',r};
 if(!r.out||!r.in)return {k:'miss',t:r.in?'No punch-out':'No punch-in',ab:'M',in:r.in,r,late};
 return {k:late?'late':early?'early':'ok',t:reg?'Regularised':late?'Late':early?'Left early':'On time',ab:late?'L':early?'E':'P',in:r.in,out:r.out,r,late,early,reg}}
const KCL={ok:'On time',late:'Late in',early:'Left early',miss:'Missed punch',abs:'Absent',leave:'Leave',lpend:'Leave requested',off:'Weekend'};

function monthDays(off){const base=new Date(Date.parse('2026-10-15T12:00:00+04:00'));base.setUTCMonth(base.getUTCMonth()+off);const y=base.getUTCFullYear(),m=base.getUTCMonth();const first=Date.parse(`${y}-${String(m+1).padStart(2,'0')}-01T00:00:00+04:00`);const out=[];for(let d=first;new Date(d+4*HR).getUTCMonth()===m;d+=DAY)out.push(d);return out}

A.calpick=a=>{UI.f.calv='person';UI.f.calp=a[0];render()};
mdef('att-day',{role:'shared'});
A.regfrom=a=>{closeM();openM('regularise',[a[0]])};

/* ---------- IP location ---------- */
const OFFICE={t1:'Dubai',t2:'Mumbai'};
function geoIssue(g){const u=userById(g.u);if(g.vpn)return 'VPN or proxy';if(u&&u.team&&OFFICE[u.team]&&g.city!==OFFICE[u.team])return 'Outside '+OFFICE[u.team];if(g.newdev)return 'New device';return ''}

const geoFlags=()=>(S.geo||[]).filter(g=>geoIssue(g)&&g.at>NOW()-7*DAY&&!g.ok);


mdef('ip-detail',{role:'admin',init:()=>({txt:''})});
A.ipask=a=>{const g=S.geo.find(x=>x.id===a[0]);notify(g.u,{t:'Question about your '+g.ev.toLowerCase(),d:(UI.mf.txt||'').trim()||'Your '+g.ev.toLowerCase()+' shows '+g.city+'. Please confirm where you were.',go:homeOf(userById(g.u).role),ic:'pin'});audit('Location question sent',uname(g.u),g.city,'');closeM();toast('Question sent to '+uname(g.u),'ok')};
A.ipok=a=>{const g=S.geo.find(x=>x.id===a[0]);g.ok=true;audit('Location flag cleared',uname(g.u)+' '+g.ev,geoIssue(g),'Explained');closeM();toast('Marked as explained','ok');render()};


/* ---------- CSV download (replaces copy) ---------- */
const DLBUF={};let _dl=0;

A.dlcsv=a=>{const [t,n]=DLBUF[a[0]]||['','export.csv'];try{const b=new Blob([t],{type:'text/csv'});const x=document.createElement('a');x.href=URL.createObjectURL(b);x.download=n;document.body.appendChild(x);x.click();x.remove()}catch(e){}toast('Prototype: the live product downloads '+n,'ok')};

/* ===== v6 B: call log, lead links, flags, assignment, lead sources ===== */

/* ---------- call log: one open step at a time ---------- */
{const om=A.mset;A.mset=a=>{if(UI.m==='call-log'){const f=UI.mf;const k=a[0];if(['res','disp','nat'].includes(k))f._open=null;if(k==='temp'||k==='dur'){if((k==='temp'?f.dur:f.temp))f._open=null}if(k==='_open'){f._open=+a[1];renderOverlay();return}}om(a)}}
{const cl=MD['call-log'];cl.render=a=>{const l=leadById(a[0]),f=UI.mf,e=f._e||{};const conn=f.res==='Connected';const need=['Interested','Follow up','Meeting fixed'].includes(f.disp);const est=f._est;const un=S.unlogged[me().id];const bad=f.res==='Wrong number'||f.res==='DND requested';const hasErr=Object.keys(e).length>0;
 const q=conn?[['Today 17:00',dtl(startOfDay(NOW())+13*HR)],['Tomorrow 11:00',dtl(startOfDay(NOW())+DAY+7*HR)],['In 3 days',dtl(startOfDay(NOW())+3*DAY+7*HR)],['Next week',dtl(startOfDay(NOW())+7*DAY+7*HR)]]:[['In 2 hours',dtl(Math.ceil((NOW()+2*HR)/(15*60000))*15*60000)],['This evening',dtl(startOfDay(NOW())+14*HR)],['Tomorrow 10:00',dtl(startOfDay(NOW())+DAY+6*HR)]];
 /* steps in order */
 const S1={n:1,t:'How did the call go?',done:!!f.res,val:f.res};
 const S2={n:2,t:'Length and temperature',done:!!f.dur&&!!f.temp,val:(f.dur?f.dur+' min':'')+(f.temp?' · '+cap1(f.temp):''),show:conn};
 const S3={n:3,t:'Outcome',done:!!f.disp,val:f.disp,show:conn};
 const S4={n:4,t:conn?'Next step':'Try again',done:!!f.nat,val:f.nat?(conn?f.ntype+' · ':'')+fts(dtp(f.nat)):'',show:(conn&&need)||(f.res&&!conn&&!bad)};
 const steps=[S1,S2,S3,S4].filter(s=>s.show!==false);
 const cur=f._open||(steps.find(s=>!s.done)||{}).n||0;
 const head=(s)=>`<div class="clstep ${s.done&&cur!==s.n?'done':''}"><span class="cls-n">${s.done&&cur!==s.n?ic('check',12):steps.indexOf(s)+1}</span><span>${s.t}</span></div>`;
 const folded=(s)=>`<button type="button" class="clfold" data-act="mset|_open|${s.n}"><span class="cls-n">${ic('check',12)}</span><span class="cf-t">${s.t}</span><span class="cf-v">${esc(s.val)}</span><span class="cf-c">Change</span></button>`;
 const reached=(s)=>steps.indexOf(s)<=steps.findIndex(x=>x.n===cur)||s.done;
 const blocks={
  1:()=>`<div class="resgrid">${CALLRES.map(r=>{const[i,d,k]=RESINFO[r];return `<button type="button" class="resb ${k} ${f.res===r?'on':''} ${r==='Connected'?'wide':''}" data-act="mset|res|${r}"><span class="rb-i">${ic(i,18)}</span><span><span class="rb-t">${r}</span><span class="rb-d">${d}</span></span></button>`}).join('')}</div>${e.res?`<span class="err">${ic('alert',14)}${e.res}</span>`:''}`,
  2:()=>`<div class="durrow"><div class="stepper"><button type="button" data-act="mdur|-1" aria-label="One minute less">${ic('minus',16)}</button>${minp('dur',{type:'number',min:1,bad:!!e.dur})}<button type="button" data-act="mdur|1" aria-label="One minute more">${ic('plus',16)}</button></div><span class="muted sm">min</span><div class="row g6 wrap">${[2,5,10,15].map(m=>`<button type="button" class="pill ${String(f.dur)===String(m)?'on':''}" data-act="mset|dur|${m}">${m} min</button>`).join('')}</div></div><span class="hint muted sm">How long you spoke, in minutes. Tap a shortcut or type it.</span>${e.dur?`<span class="err">${ic('alert',14)}${e.dur}</span>`:''}${tempPick(f.temp,'mset|temp|')}`,
  3:()=>`<div class="resgrid">${S.set.dispositions.map(d=>{const[i,t]=DISPINFO[d]||['check',''];return `<button type="button" class="resb ${d==='Not interested'?'bad':d==='Meeting fixed'?'ok':''} ${f.disp===d?'on':''}" data-act="mset|disp|${d}"><span class="rb-i">${ic(i,18)}</span><span><span class="rb-t">${d}</span><span class="rb-d">${t}</span></span></button>`}).join('')}</div>${e.disp?`<span class="err">${ic('alert',14)}${e.disp}</span>`:''}${f.disp==='Not interested'?bn('warn','This archives the lead','It leaves your active list. Add the reason in the notes.'):''}`,
  4:()=>`${conn?`<div class="seg mb8">${[['Follow-up','Follow-up'],['Meeting','Meeting']].map(([v,t])=>`<button type="button" class="${f.ntype===v?'on':''}" data-act="mset|ntype|${v}">${t}</button>`).join('')}</div>`:''}<div class="row g6 wrap">${q.map(x=>`<button class="pill ${f.nat===x[1]?'on':''}" type="button" data-act="mset|nat|${x[1]}">${x[0]}</button>`).join('')}</div>${fld('Or pick a date and time (Dubai)',minp('nat',{type:'datetime-local',bad:!!e.nat}),{for:'m_nat',err:e.nat})}${conn&&f.ntype==='Meeting'?`<div class="frm">${fld('Meeting type',`<div class="seg">${[['in-person','In person'],['virtual','Online']].map(([v,t])=>`<button type="button" class="${f.mkind===v?'on':''}" data-act="mset|mkind|${v}">${t}</button>`).join('')}</div>`)}${fld(f.mkind==='virtual'?'Meeting link or app':'Place',minp('mplace',{bad:!!e.mplace,ph:f.mkind==='virtual'?'Google Meet':'Marina Views sales gallery'}),{for:'m_mplace',err:e.mplace})}</div>`:''}`};
 const stepHtml=steps.map(s=>{if(!reached(s))return '';const open=s.n===cur||hasErr&&!s.done;return open?`<div class="clsec">${head(s)}${blocks[s.n]()}</div>`:folded(s)}).join('');
 const allDone=steps.every(s=>s.done);
 const notes=f.res&&(allDone||bad)?`<div class="clsec">${`<div class="clstep"><span class="cls-n">${steps.length+1}</span><span>Notes${f.disp==='Not interested'?' (reason required)':' (optional)'}</span></div>`}<div class="row g6 wrap">${(conn?NOTECHIPS.Connected:NOTECHIPS.other).map(t=>`<button type="button" class="pill sm" data-act="mnote|${t}">${ic('plus',12)}${t}</button>`).join('')}</div>${mtxa('note',{bad:!!e.note,ph:'What did the client say?'})}${e.note?`<span class="err">${ic('alert',14)}${e.note}</span>`:''}</div>`:'';
 const sum=[f.res,conn&&f.dur?f.dur+' min':'',conn?f.disp:'',f.temp&&conn?cap1(f.temp):'',f.nat?(conn?f.ntype||'Follow-up':'Retry')+' '+fts(dtp(f.nat)):''].filter(Boolean).join(' · ');
 const prog=steps.length?`<div class="clprog"><i style="width:${Math.round(steps.filter(s=>s.done).length/steps.length*100)}%"></i></div>`:'';
 const body=`<div class="clhead">${av(l.name)}<div style="min-width:0;flex:1"><div class="b trunc">${esc(l.name)}</div><div class="xs muted">${esc(l.phone)} · ${l.attempts} earlier attempt${l.attempts===1?'':'s'}</div></div>${un&&un.lead===l.id?`<span class="chip s3">${ic('clock',12)}Called ${fhm(un.t)}</span>`:`<span class="chip s2">Manual log</span>`}</div>${prog}
 ${stepHtml}
 ${f.res==='Wrong number'?bn('warn','Number will be flagged invalid','The lead is archived and Admin is told so the source can be reviewed.'):''}${f.res==='DND requested'?bn('err','Number goes on the Do Not Call list','No agent can call it again. The lead is archived. Only Admin can remove it.'):''}
 ${notes}`;
 return {title:'Log call',sub:allDone||bad?'Ready to save':'Step '+Math.min(steps.length,steps.filter(s=>s.done).length+1)+' of '+steps.length,body,size:'w',foot:`${sum?`<span class="clsum">${esc(sum)}</span>`:''}<button class="btn" type="button" data-act="mclose">Cancel</button><button class="btn pri" type="button" data-act="callsave|${l.id}"${f.res?'':' disabled'}>${ic('check',16)}${bad?'Save and archive':'Save call'}</button>`}}}

/* ---------- show the first error in any modal ---------- */
/* render wrapper: handled in React */

/* ---------- lead IDs are always links ---------- */

/* render wrapper: handled in React */
{const la=leadAccess;leadAccess=function(role,l){if(role==='mgmt'&&l&&!l.owner){return l.team===me().team?'ok':'pool'}return la(role,l)}}

/* ---------- flags ---------- */

mdef('flag-info',{role:'shared'});
mdef('flag-review',{role:'mgmt',init:()=>({dec:'',txt:''})});
A.flagsave=a=>{const x=S.activity.find(y=>y.id===a[0]);const f=UI.mf,e={};if(!f.dec)e.dec='Choose a decision.';if(f.dec&&f.dec!=='Genuine'&&!(f.txt||'').trim())e.txt='Tell the agent why.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}
 x.rev={dec:f.dec,by:me().id,at:NOW(),note:(f.txt||'').trim()};if(f.dec!=='Genuine')notify(x.u,{t:f.dec==='Coach'?'Note on a logged call':'A logged call was not counted',d:(f.txt||'').trim(),go:'agent-lead-'+x.lead,ic:'flag'});audit('Flagged call reviewed',uname(x.u)+' · LEAD-'+x.lead,'Duration mismatch',f.dec);closeM();toast('Review saved','ok');render()};

/* ---------- assignment model: Admin pool -> team queue -> agent ---------- */
function assignTeam(l,tid,reason){const from=l.owner;l.own.unshift({from,to:null,team:tid,reason,by:me().id,at:NOW()});l.owner=null;l.team=tid;l.assigned=NOW();l.hold=null;addEv(l,'owner',(from?'Moved from '+uname(from)+' to ':'Sent to ')+teamName(tid)+' queue. Reason: '+reason);notify(teamById(tid).mgr,{t:'New lead in your team queue',d:l.name+' (LEAD-'+l.id+')',go:'mgmt-assign',ic:'users'});if(from)notify(from,{t:'Lead moved away from you',d:l.name+': '+reason,go:'agent-leads',ic:'repeat'});audit('Lead sent to team queue','LEAD-'+l.id,from?uname(from):'Admin pool',teamName(tid)+' queue')}
{const ra=reassign;reassign=function(l,toId,reason,by){const r=ra(l,toId,reason,by);if(r&&r.ok)l.team=toId?teamOf(toId):null;return r}}
const RCHIPS=['Agent on leave','Agent at their ceiling','Language or city match','Client asked for someone else','Rebalancing the team','Performance'];
const RCHIPS0=['First assignment','Language or city match','Project specialist','Has room this week'];

{const om=A.mset;A.mset=a=>{if(a[0]==='to'&&a[1]==='team'){UI.mf.to='team|'+a[2];renderOverlay();return}if(a[0]==='tgt'){UI.mf.tgt=a[1];UI.mf.to='';renderOverlay();return}om(a)}}
MD['reassign'].init=()=>({to:'',why:'',tgt:'agent'});

A.reassave=a=>{const l=leadById(a[0]),f=UI.mf,e={};if(f.tgt==='pool')f.to='pool';if(!f.to)e.to='Choose where this lead goes.';if(!(f.why||'').trim())e.why='Add a reason.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}const why=f.why.trim();
 if(f.to.startsWith('team|')){assignTeam(l,f.to.split('|')[1],why);closeM();toast('Sent to '+teamName(f.to.split('|')[1])+' queue','ok');render();return}
 if(f.to==='queue'){assignTeam(l,me().team,why);closeM();toast('Back in the team queue','ok');render();return}
 const r=reassign(l,f.to==='pool'?null:f.to,why);if(r.err){UI.mf._e={to:r.msg};renderOverlay();return}if(f.to==='pool')l.team=null;closeM();toast(f.to==='pool'?'Lead returned to the Admin pool':'Assigned to '+uname(f.to),'ok');render()};
MD['bulk-reassign'].init=()=>({to:'',why:'',tgt:'agent'});

A.bulksave=()=>{const f=UI.mf,e={};if(!f.to)e.to='Choose where they go.';if(!(f.why||'').trim())e.why='Add a reason.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}let ok=0,skip=0;const ids=(UI.f.sel||'').split(',').filter(Boolean);
 ids.forEach(id=>{const l=leadById(id);if(f.to.startsWith('team|')){assignTeam(l,f.to.split('|')[1],f.why.trim());ok++;return}if(l.owner===f.to)return;const r=reassign(l,f.to,f.why.trim());if(r.err)skip++;else ok++});UI.f.sel='';closeM();toast(ok+' moved'+(skip?', '+skip+' skipped (no room)':''),skip?'err':'ok');render()};

/* spread evenly: plan first, then confirm */
function distPlan(f,leads){const role=me().role;let ag=(role==='admin'?agentsAll().filter(a=>a.status==='active'&&(f.tm==='all'||a.team===f.tm)):myTeam().filter(a=>a.status==='active'));if(f.skipleave)ag=ag.filter(a=>todayStat(a.id)!=='On leave');const ex=(f.ex||'').split(',');ag=ag.filter(a=>!ex.includes(a.id));
 const room={},add={};ag.forEach(a=>{room[a.id]=capInfo(a.id).left;add[a.id]=0});const plan=[];
 leads.forEach(l=>{const c=ag.filter(a=>room[a.id]>0);if(!c.length)return;c.sort((x,y)=>f.how==='load'?((capInfo(x.id).used+add[x.id])/capInfo(x.id).cap)-((capInfo(y.id).used+add[y.id])/capInfo(y.id).cap):(add[x.id]-add[y.id])||(room[y.id]-room[x.id]));const a=c[0];room[a.id]--;add[a.id]++;plan.push([l,a.id])});return {ag,add,plan}}
MD['autodist'].init=()=>{const s=(UI.f.sel||'').split(',').filter(Boolean);return {tm:'all',scope:s.length?'sel':'all',how:'equal',skipleave:true,ex:'',to:'agents'}};

A.distex=a=>{const s=(UI.mf.ex||'').split(',').filter(Boolean);const i=s.indexOf(a[0]);if(i>=0)s.splice(i,1);else s.push(a[0]);UI.mf.ex=s.join(',');renderOverlay()};
A.distsave=()=>{const f=UI.mf;const role=me().role;const sel_=(UI.f.sel||'').split(',').filter(Boolean);const src=role==='admin'?poolLeads():queueLeads(me().team);const leads=f.scope==='sel'?sel_.map(leadById).filter(l=>l&&!l.owner):src;
 if(role==='admin'&&f.to==='teams'){leads.forEach((l,i)=>assignTeam(l,S.teams[i%S.teams.length].id,'Spread evenly across team queues'));UI.f.sel='';closeM();toast(leads.length+' leads sent to team queues','ok');render();return}
 const P=distPlan(f,leads);let ok=0;P.plan.forEach(([l,a])=>{const r=reassign(l,a,'Spread evenly by '+(role==='admin'?'Admin':'manager'),me().id);if(!r.err)ok++});audit('Leads spread evenly',role==='admin'?'Admin pool':teamName(me().team)+' queue','',ok+' leads');UI.f.sel='';closeM();toast(ok+' lead'+(ok===1?'':'s')+' assigned'+(ok<leads.length?', '+(leads.length-ok)+' left':''),ok<leads.length?'err':'ok');render()};

/* how assignment works */
mdef('assign-info',{role:'shared'});

/* admin assignments page */


/* manager assignment page */
R['mgmt-assign'].sample=[[],['all']];

A.mafilter=a=>{UI.f.fa=UI.f.fa===a[0]?'all':a[0];UI.f.sa='agent';go('mgmt-assign-all')};

/* ---------- lead sources ---------- */
NAVS.admin=NAVS.admin.map(n=>n[0]==='admin-import'?['admin-sources','Lead Sources','upload']:n);
R['admin-import'].nav='admin-sources';R['admin-importnew'].nav='admin-sources';R['admin-import'].crumb=()=>[{l:'Lead Sources',go:'admin-sources'},{l:'Excel uploads'}];R['admin-import'].level='L2';
const ROUTEL=r=>!r||r==='pool'?'Admin pool':r.startsWith('team|')?teamName(r.split('|')[1])+' queue':r.startsWith('auto|')?'Auto-spread to '+teamName(r.split('|')[1])+' agents':r;
const SRCN={meta:['Meta Lead Ads','Facebook and Instagram lead forms','msg'],google:['Google Ads','Lead form extensions on search and YouTube','search']};
def('admin-sources',{role:'admin',level:'L1',title:'Lead Sources',nav:'admin-sources',sample:[[],['meta'],['google']],crumb:p=>p[0]?[{l:'Lead Sources',go:'admin-sources'},{l:SRCN[p[0]]?SRCN[p[0]][0]:'Source'}]:[{l:'Lead Sources'}]});

A.srcsync=a=>{S.sources[a[0]].last=NOW();toast(SRCN[a[0]][0]+' synced. No new leads since the last sync.','ok');render()};
A.srcoff=a=>{confirmM({title:'Disconnect '+SRCN[a[0]][0]+'?',text:'New leads from these forms stop arriving. Leads already in the CRM stay.',ok:'Disconnect',act:'srcoff2|'+a[0],danger:true})};
A.srcoff2=a=>{S.sources[a[0]].on=false;S.sources[a[0]].forms=[];audit('Lead source disconnected',SRCN[a[0]][0],'Connected','Off');UI.c=null;go('admin-sources')};
mdef('src-connect',{role:'admin',init:a=>({st:1,acct:'',forms:'',route:'pool',team:'t1',proj:''})});
A.srcform=a=>{const s=(UI.mf.forms||'').split('|').filter(Boolean);const i=s.indexOf(a[0]);if(i>=0)s.splice(i,1);else s.push(a[0]);UI.mf.forms=s.join('|');renderOverlay()};
A.srcnext=a=>{const f=UI.mf;if(f.st===2){const e={};if(!f.acct)e.acct='Choose an account.';if(!f.forms)e.forms='Pick at least one form.';if(Object.keys(e).length){f._e=e;renderOverlay();return}}f._e={};f.st++;renderOverlay()};
A.srcsave=a=>{const k=a[0],f=UI.mf;const s=S.sources[k];const route=f.route==='pool'?'pool':f.route+'|'+f.team;s.on=true;s.acct=f.acct;s.since=NOW();s.last=NOW();s.health='ok';s.forms=f.forms.split('|').filter(Boolean).map((x,i)=>({id:k+i,name:x,camp:(k==='google'?'Google Ads · ':'Meta · ')+x.split(' · ')[0],proj:f.proj||'',route,n7:0}));audit('Lead source connected',SRCN[k][0],'Off',s.forms.length+' forms');closeM();toast(SRCN[k][0]+' connected','ok');go('admin-sources')};
mdef('src-route',{role:'admin',init:a=>{const fm=S.sources[a[0]].forms.find(x=>x.id===a[1]);const r=fm.route||'pool';return {route:r.split('|')[0],team:r.split('|')[1]||'t1',proj:fm.proj||''}}});
A.srcroute=a=>{const fm=S.sources[a[0]].forms.find(x=>x.id===a[1]);const f=UI.mf;const was=ROUTEL(fm.route);fm.route=f.route==='pool'?'pool':f.route+'|'+f.team;fm.proj=f.proj;audit('Routing rule changed',fm.name,was,ROUTEL(fm.route));closeM();toast('Rule saved','ok');render()};

/* ===== v6 C: convertible notes for managers and Admin, secondary market clarity, project pipeline, audit log ===== */

/* ---------- convertible notes: document verification ---------- */
const cnDS=(cn,k)=>!cn[k]?'missing':(cn.dv&&cn.dv[k]?cn.dv[k].s:'pending');
const CNDS={missing:['Not received','s2'],pending:['To verify','s5'],verified:['Verified','s6'],rejected:['Rejected','s7']};

const cnFile=(cn,k)=>typeof cn[k]==='string'?cn[k]:({kyc:'Passport_scan.pdf',nominee:'Nominee_form.pdf',bank:'Bank_letter.pdf',agreement:'Signed_agreement.pdf',pdc:'PDC_register.xlsx',receipt:'Registration_receipt.pdf'})[k];

mdef('cn-docview',{role:'shared'});
A.cnrejfrom=a=>{closeM();openM('cn-docrej',a)};
A.cnv=a=>{const l=leadById(a[0]);const k=a[1];l.cn.dv=l.cn.dv||{};l.cn.dv[k]={s:'verified',by:me().id,at:NOW()};addEv(l,'doc','Convertible Note document verified: '+CNDOCS.find(x=>x[0]===k)[1]+' ('+me().name+')');audit('Note document verified','LEAD-'+l.id+' · '+CNDOCS.find(x=>x[0]===k)[1],'To verify','Verified');if(UI.m==='cn-docview')closeM();toast('Verified','ok');if(UI.m)renderOverlay();render()};
mdef('cn-docrej',{role:'shared',init:()=>({why:''})});
A.cnrej=a=>{const why=(UI.mf.why||'').trim();if(!why){UI.mf._e={why:'Say what is wrong.'};renderOverlay();return}const l=leadById(a[0]);l.cn.dv=l.cn.dv||{};l.cn.dv[a[1]]={s:'rejected',by:me().id,at:NOW(),why};const t=CNDOCS.find(x=>x[0]===a[1])[1];if(l.cn.stage==='Admin review'&&me().role==='admin'){}notify(l.owner,{t:'Note document rejected',d:t+': '+why,go:'agent-cnapp-'+l.id,ic:'clip'});addEv(l,'doc','Convertible Note document rejected: '+t+'. '+why);audit('Note document rejected','LEAD-'+l.id+' · '+t,'To verify','Rejected');closeM();toast('Rejected. The agent is told.','ok');render()};
{const od=A.cndoc;A.cndoc=a=>{const l=leadById(a[0]);if(l.cn.dv)delete l.cn.dv[a[1]];od(a)}}
{const od=A.cnpdc;A.cnpdc=a=>{const l=leadById(a[0]);const had=l.cn.dv&&l.cn.dv.pdc;od(a);if(had&&l.cn.pdc&&l.cn.dv)delete l.cn.dv.pdc}}
/* agents can re-open documents after a rejection */
{const os=A.cnsubmit;A.cnsubmit=a=>{const l=leadById(a[0]);if(CNDOCS.some(([k])=>cnDS(l.cn,k)==='rejected')){toast('Replace the rejected documents first','err');return}os(a)}}
/* Admin decision: needs every document verified */

{const od=A.cndecide;A.cndecide=a=>{const l=leadById(a[0]);const f=UI.mf;if(f.dec==='ok'&&!CNDOCS.every(([k])=>cnDS(l.cn,k)==='verified')){UI.mf._e={dec:'Verify all six documents before approving.'};renderOverlay();return}const tm=teamOf(l.owner);od(a);if(!UI.m&&tm&&teamById(tm))notify(teamById(tm).mgr,{t:f.dec==='ok'?'Convertible Note approved':'Note application sent back',d:l.name+' · '+uname(l.owner),go:'mgmt-cn',ic:'clip'})}}
/* agent application page shows verification */


/* ---------- application page for managers and Admin ---------- */
const CNSTEPS=['Qualified','Information shared','Interested','Documents','Admin review','Active'];

['mgmt','admin'].forEach(role=>def(role+'-cnapp',{role,level:'L2',title:'Note application',nav:role+'-cn',sample:[['2047'],['2050']],crumb:p=>[{l:'Convertible Notes',go:role+'-cn'},{l:leadById(p[0])?leadById(p[0]).name:'Application'}]}));
def('mgmt-cnnote',{role:'mgmt',level:'L2',title:'Note detail',nav:'mgmt-cn',sample:[['cn20260041']],crumb:p=>[{l:'Convertible Notes',go:'mgmt-cn'},{l:noteF(p[0])}]});

def('mgmt-cn',{role:'mgmt',level:'L1',title:'Convertible Notes',nav:'mgmt-cn',sample:[[]]});
{const i=NAVS.mgmt.findIndex(n=>n[0]==='mgmt-bookings');NAVS.mgmt.splice(i+1,0,['mgmt-cn','Convertible Notes','clip'])}

mdef('cn-info',{role:'shared'});
/* Admin review queue goes to the application page */


/* ---------- secondary market: what each list means ---------- */
mdef('sec-info',{role:'shared'});
const SECHINT={mine:'Buyer needs and seller listings you sent to Admin. The status shows where each one is. A seller request becomes a live listing once Admin approves it.',asg:'Listings and buyers Admin gave you to work, because you have the Secondary tag.',lst:'Resale properties Admin has approved and published. Any agent can match them to a buyer.'};

const SECFLOW={seller:['Requested','Active','Matched','Negotiation','Closed'],buyer:['Requested','Follow-up','Matched','Negotiation','Closed']};
['agent','mgmt','admin'].forEach(role=>{const d=R[role+'-sec'];if(!d)return;const r0=d.render;d.render=p=>{const h=r0(p);const s=secById(secF(p[0]));if(!s)return h;const st=SECFLOW[s.kind];const i=['Lost','Declined'].includes(s.status)?-1:Math.max(0,st.indexOf(s.status));const lab=s.kind==='seller'?['Requested','Live listing','Matched','Negotiation','Closed']:['Requested','Accepted','Matched','Negotiation','Closed'];const box=`<div class="card mb16"><div class="row sb wrap mb8"><span class="ov">Where this ${s.kind==='seller'?'listing':'request'} is</span><button type="button" class="btn lnk xs" data-open="sec-info">How it works</button></div>${i<0?bn('warn',s.status,'This request is closed without a deal.'):`<div class="hstp">${lab.map((x,k)=>`<div class="hs ${k<i?'done':k===i?'cur':''}">${x}</div>`).join('')}</div>`}${s.status==='Requested'?`<p class="muted sm mt8">${role==='admin'?'Review it to publish it'+(s.kind==='seller'?' as a live listing':'')+'.':'Waiting for Admin to review. Nothing to do yet.'}</p>`:''}</div>`;const j=h.indexOf('<div class="grid g21">');return j<0?h:h.slice(0,j)+box+h.slice(j)}});

/* ---------- project pipeline for managers and Admin ---------- */
{const pp=projectPage;projectPage=function(role,p){const h=pp(role,p);const pr=projById(p[0]);if(!pr||role==='agent')return h;return h+projPipeline(role,pr)}}
function projPipeline(role,pr){const v=UI.f.ppv||'bk';const ids=role==='mgmt'?teamIds():null;const okA=id=>!ids||ids.includes(id);
 const bks=S.bookings.filter(b=>b.project===pr.id&&okA(b.agent)).sort((a,b)=>(b.submitted||0)-(a.submitted||0));
 const lds=S.leads.filter(l=>l.shortlist.some(s=>s.p===pr.id)&&!l.archived&&okA(l.owner));
 const agents=[...new Set([...bks.map(b=>b.agent),...lds.map(l=>l.owner)].filter(Boolean))].map(id=>({id,l:lds.filter(x=>x.owner===id),b:bks.filter(x=>x.agent===id)})).sort((a,b)=>b.b.length-a.b.length||b.l.length-a.l.length);
 const bkGo=b=>role==='admin'?'admin-booking-'+bkP(b.id):'mgmt-booking-'+bkP(b.id);
 const seg=`<div class="seg">${[['bk','Bookings',bks.length],['ld','Leads shortlisting it',lds.length],['ag','Agents',agents.length]].map(([k,t,n])=>`<button type="button" class="${v===k?'on':''}" data-act="ui|ppv|${k}">${t} (${n})</button>`).join('')}</div>`;
 const body=v==='bk'?(bks.length?`<div class="tw"><table class="tbl"><thead><tr><th>Booking</th><th>Unit</th><th>Lead</th><th>Agent</th><th class="num">Price</th><th>Status</th></tr></thead><tbody>${bks.map(b=>{const l=leadById(b.lead);return `<tr><td><a class="b" href="#${bkGo(b)}" data-go="${bkGo(b)}">${b.id}</a><div class="xs faint">${b.submitted?fd(b.submitted):''}</div></td><td>${esc(b.unit)}</td><td>${l?`<a href="#${role}-lead-${l.id}" data-go="${role}-lead-${l.id}">${esc(l.name)}</a><div class="xs faint">LEAD-${l.id}</div>`:'-'}</td><td class="sm">${esc(uname(b.agent))}</td><td class="num">${mfull(b.price)}</td><td>${bkChip(b.status)}</td></tr>`}).join('')}</tbody></table></div>`:empty('file','No bookings yet','Bookings on this project show here.'))
 :v==='ld'?(lds.length?`<div class="tw"><table class="tbl"><thead><tr><th>Lead</th><th>Agent</th><th>Shortlist</th><th>Stage</th><th>Temp</th><th>Booked here</th></tr></thead><tbody>${lds.map(l=>{const sl=l.shortlist.find(s=>s.p===pr.id);const b=bks.find(x=>x.lead===l.id);return `<tr><td><a class="b" href="#${role}-lead-${l.id}" data-go="${role}-lead-${l.id}">${esc(l.name)}</a><div class="xs faint">LEAD-${l.id}</div></td><td class="sm">${l.owner?esc(uname(l.owner)):'Pool'}</td><td>${sl.primary?chip('First choice','s3',false):chip('Also considering','s2',false)}${l.shortlist.length>1?`<div class="xs faint">${l.shortlist.length} projects shortlisted</div>`:''}</td><td>${stageChip(l.stage)}</td><td>${tempChip(l.temp)}</td><td>${b?bkChip(b.status):'<span class="faint">No</span>'}</td></tr>`}).join('')}</tbody></table></div>`:empty('user','No leads have shortlisted it','Agents add projects to a lead from the catalogue.'))
 :(agents.length?`<div class="tw"><table class="tbl"><thead><tr><th>Agent</th><th>Team</th><th class="num">Leads shortlisting it</th><th class="num">Bookings</th><th class="num">Booked value</th></tr></thead><tbody>${agents.map(x=>`<tr><td><a href="#${role==='admin'?'admin-user-':'mgmt-agent-'}${x.id}" data-go="${role==='admin'?'admin-user-':'mgmt-agent-'}${x.id}">${esc(uname(x.id))}</a></td><td class="sm">${esc(teamName(teamOf(x.id)))}</td><td class="num">${x.l.length}</td><td class="num">${x.b.length}</td><td class="num">${mfull(sum(x.b.filter(b=>['approved','closed','pending'].includes(b.status)),b=>b.price))}</td></tr>`).join('')}</tbody></table></div>`:empty('users','No agents yet','Nobody is working this project.'));
 return `<div class="mt16">${card('Who is working this project',`<div style="padding:0 20px 14px">${seg}</div>${body}`,{bare:true})}</div>`}

/* ---------- audit log, easier to read ---------- */
const AUDCAT=[['all','All'],['leads','Leads'],['money','Bookings and money'],['people','People and access'],['att','Attendance'],['rules','Settings and rules']];
const audCat=a=>/leave|regularis|attendance|location/i.test(a)?'att':/lead|assign|spread|queue|import|source|routing/i.test(a)?'leads':/booking|commission|payout|note|doc|closure|secondary|unit|project|hold/i.test(a)?'money':/user|team|invite|deactivat|reactivat|password/i.test(a)?'people':'rules';
{const _is=initState;initState=function(){_is();const n=S.now;const A0=(m,act,ent,b,af,who)=>S.audit.push({id:'a'+uid(),at:n-m*MIN,actor:who,action:act,entity:ent,before:b,after:af});
 A0(80,'Booking approved','BKG-10018','Pending Admin','Approved','u1');A0(130,'Leave approved','Priya Shah 28 Oct','Pending','Approved','u2');A0(300,'Commission slab changed','Archit Batham','Slab A','Slab B','u1');A0(1600,'Routing rule changed','Creekside · Oct form','Admin pool','Dubai Sales queue','u1');A0(2900,'Payout marked paid','CN-2026-0041 #3','Due','Paid','u1');A0(3100,'Regularisation approved','Archit Batham 19 Oct','Pending','Approved','u2');S.audit.sort((a,b)=>b.at-a.at)}}

mdef('audit-row',{role:'admin'});

/* ---------- people: market tag explained ---------- */


/* ---------- client confirmation page: show which meeting ---------- */


/* ===== v7: manager's own leave, undo after a decision, secondary reassign reason ===== */

/* ---------- managers apply for their own leave (Admin approves) ---------- */

/* ---------- undo for a few seconds after any decision ---------- */
let _undoDepth=0;
const UNDOABLE={leavedec:'Leave decision',leaverej:'Leave rejection',regdec:'Regularisation decision',regrej:'Regularisation rejection',requndo:'Request change',bkapprove:'Booking approval',docdec:'Document decision',docrej:'Document rejection',bkclose:'Booking closure',chgsave:'Changes requested',rejsave:'Booking rejection',cndecide:'Note decision',cnv:'Document verified',cnrej:'Document rejected',secdecide:'Secondary decision',commrel:'Commission release',paypaid:'Payout marked paid',payfixed:'Payout resolved',reassave:'Lead assignment',bulksave:'Lead assignment',distsave:'Leads spread'};
Object.entries(UNDOABLE).forEach(([k,label])=>{const o=A[k];if(!o)return;A[k]=(a,el)=>{if(_undoDepth)return o(a,el);_undoDepth++;const snap=JSON.stringify(S);const before=_toastCount();try{o(a,el)}finally{_undoDepth--}
 if(UI.m&&UI.mf&&UI.mf._e&&Object.keys(UI.mf._e).length)return;if(JSON.stringify(S)===snap)return;
 const msg=_toastCount()>before?_popToast():label+' saved';undoToast(msg,label,snap)}});
function undoToast(msg,label,snap){_pushToast({msg,kind:'ok',undo:{label,run:()=>{const who=S.session;S=JSON.parse(snap);S.session=who;if(UI.pf)delete UI.pf._flash;closeM();audit('Decision undone',label,'Saved','Undone within seconds');render();toast(label+' undone','ok')}},ttl:6200})}

/* ---------- secondary market: reason when Admin reassigns ---------- */

{const sd=A.secdecide;A.secdecide=(a,el)=>{const s=secById(a[0]),f=UI.mf;if(s.status!=='Requested'&&f.dec==='re'){const why=(f.why||'').trim();const e={};if(!why)e.why='Add a reason for reassigning.';if(f.owner===s.owner)e.owner='Choose a different agent.';if(Object.keys(e).length){UI.mf._e=e;renderOverlay();return}const was=s.owner;sd(a,el);if(s.owner!==was){const h=s.hist[s.hist.length-1];if(h)h[0]=h[0]+'. Reason: '+why;if(was)notify(was,{t:s.id+' moved to '+uname(s.owner),d:why,go:'agent-secondary',ic:'store'});const au=S.audit[0];if(au&&au.entity===s.id)au.after=uname(s.owner)+'. '+why}return}sd(a,el)}}

/* applying for leave is a request, not a decision: plain confirmation, no timer, no undo */
['leavesave','leaveapply','regsave'].forEach(k=>{const o=A[k];if(!o)return;A[k]=(a,el)=>{const before=_toastCount();o(a,el);if(_toastCount()>before)_markToastNoTimer()}});

/* ===== prototype layer: bar, sitemap, redirect-map crawler, edge cases, guide, boot ===== */
const PROTO={map:null,mapAt:null};
PRE.proto='P';
/* protoBar: provided by bridge.ts */
Object.assign(A,{
 plus1(){S.now+=DAY;const ch=tick();toast('Clock moved to '+f2(NOW(),{weekday:'short',day:'numeric',month:'short'})+(ch.length?'. '+ch.length+' automatic change'+(ch.length>1?'s':'')+' ran':''),'ok');render()},
 devmode(){UI.dev=!UI.dev;document.body.classList.toggle('dev',UI.dev);render()},
 pframe(){UI.pframe=!UI.pframe;document.body.classList.toggle('pf',UI.pframe);fitFrame();setTimeout(()=>{stageClass();render()},0)},
 reset(){const d=UI.dev,p=UI.pframe;initState();resetUI();UI.dev=d;UI.pframe=p;PROTO.map=null;go('login');toast('Prototype reset','ok')},
 protoback(){S.session?go(homeOf(S.session.role)):go('login')},
 asu(a){const u=userById(a[0]);S.session={role:u.role,userId:u.id};UI.f={};UI.pg={};closeM();go(homeOf(u.role))},
 edge(a){const x=EDGES.find(e=>e.id===a[0]);if(x.user){const u=userById(x.user);S.session={role:u.role,userId:u.id}}else if(x.signedOut)S.session=null;if(x.pre)x.pre();UI.f={};UI.pg={};UI.pf={};closeM();go(x.route)},
 copymap(a){const rows=PROTO.map||[];const txt=a[0]==='json'?JSON.stringify(rows,null,1):mapCsv(rows);const done=()=>toast('Copied '+rows.length+' rows','ok');if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,()=>{UI.f.mapraw=txt;render();toast('Clipboard blocked. Text is shown below, select and copy it.','err')});else{UI.f.mapraw=txt;render()}},
 buildmap(){PROTO.map=crawl();PROTO.mapAt=Date.now();UI.pg={};render();toast('Redirect map built: '+PROTO.map.length+' rows','ok')}
});
mdef('proto-guide',{role:'proto'});

/* ---------------- crawler ---------------- */
const TABN=['calls','qualify','docs','props','timeline','esc','overview'];
function patt(h){const r=parse(h);if(!r)return h;return r.key+r.params.map(p=>'-{'+(TABN.includes(p)?'tab':'id')+'}').join('')}
function actEffect(fn){const f=A[fn];if(!f)return 'MISSING ACTION';const s=f.toString();const out=[];const g=[...s.matchAll(/\bgo\(([^)]*?)\)/g)].map(m=>m[1].replace(/['"`]/g,'').replace(/\+/g,'').replace(/\$\{[^}]*\}/g,'{x}').trim()).filter(x=>x&&x.length<70);const o=[...s.matchAll(/openM\(\s*'([a-z0-9-]+)'/g)].map(m=>m[1]);const t=[...s.matchAll(/toast\(\s*'([^']{3,60})/g)].map(m=>m[1]);
 if(g.length)out.push('Goes to '+[...new Set(g)].slice(0,3).join(' or '));if(o.length)out.push('Opens modal '+[...new Set(o)].join(', '));if(/closeM\(\)/.test(s))out.push('Closes the modal');if(/mutes|S\.[a-z]+\.(push|unshift)|\.status=|\.stage=|stageSet|notify\(/.test(s))out.push('Updates data');if(/notify\(/.test(s))out.push('Sends notification(s)');if(/UI\.mf\._e=|UI\.pf\._e=/.test(s))out.push('Validates first, shows inline errors');if(t.length)out.push('Toast: '+t[0]);if(!out.length)out.push('Updates this screen');return out.join('. ')}
function labelOf(el){let t=(el.getAttribute('aria-label')||el.dataset.lbl||el.textContent||el.title||'').replace(/\s+/g,' ').trim();if(!t)t=el.getAttribute('title')||el.tagName.toLowerCase();return t.length>48?t.slice(0,46)+'…':t}
function crawl(){const save={s:S.session,pf:UI.pf,f:UI.f,pg:UI.pg,m:UI.m,mf:UI.mf,args:UI.args,hash:location.hash};const rows=[];const seen=new Set();const users={agent:'u10',mgmt:'u2',admin:'u1'};
 const add=(scr,kind,el,inModal)=>{const act=el.dataset.act!=null?'act':el.dataset.open!=null?'open':'go';const raw=el.dataset[act==='act'?'act':act==='open'?'open':'go'];let tType,tgt,tid,eff;
  if(act==='go'){const r=parse(raw);tType='Screen';tgt=patt(raw);tid=r?r.def.id:'DEAD LINK';eff=r?'Navigates to '+r.def.title:'Target does not exist'}
  else if(act==='open'){const k=raw.split('|')[0];tType='Modal / sheet';tgt=k;tid=MD[k]?MD[k].id:'MISSING';eff=MD[k]?'Opens '+(MD[k].title||k):'Target does not exist'}
  else{const k=raw.split('|')[0];tType='Action';tgt=k;tid=A[k]?'fn':'MISSING';eff=actEffect(k)}
  const label=labelOf(el);const key=[scr.id,scr.pattern,act,tgt,tType==='Action'?'':label.replace(/\d+/g,'#')].join('|');if(seen.has(key))return;seen.add(key);
  rows.push({screenId:scr.id,screen:scr.title,route:scr.pattern,level:scr.level,role:scr.role,element:label,interaction:act==='act'?'Click (action)':act==='open'?'Click (open)':'Click (navigate)',targetType:tType,target:tgt,targetId:tid,effect:eff,inModal:!!inModal,dead:tid==='DEAD LINK'||tid==='MISSING'})};
 const scan=(html,scr,inModal)=>{const t=document.createElement('template');t.innerHTML=html;const found=[];[...t.content.querySelectorAll('[data-go],[data-open],[data-act]')].filter(el=>!el.closest('[data-proto]')&&!el.hasAttribute('data-proto')).forEach(el=>{add(scr,'',el,inModal);if(el.dataset.open!=null)found.push(el.dataset.open)});return found};
 const roles=['login','client','agent','mgmt','admin','proto'];const modalDone=new Set();
 try{roles.forEach(role=>{if(users[role])S.session={role,userId:users[role]};else S.session=null;
  Object.values(R).filter(d=>d.role===role||(role==='admin'&&0)).forEach(d=>{(d.sample||[[]]).forEach(sp=>{UI.pf={};UI.f={};UI.pg={};let html;try{html=d.render(sp,{key:d.key,params:sp,def:d})}catch(e){html='';rows.push({screenId:d.id,screen:d.title,route:d.key,level:d.level,role:d.role,element:'RENDER ERROR',interaction:'',targetType:'',target:e.message,targetId:'ERROR',effect:e.message,dead:true})}
   const hash=d.key+sp.map(x=>'-'+x).join('');const scr={id:d.id,title:d.title,pattern:patt(hash),level:d.level,role:d.role};
   let opens=scan(html,scr,false);
   if(users[role]&&sp===(d.sample||[[]])[0]){const sh=shell(role,{title:d.title,level:'L1',id:d.id,key:d.key,nav:navOf(d)},[],'');const chromeScr={id:role==='agent'?'A-SHELL':role==='mgmt'?'M-SHELL':'AD-SHELL',title:'App shell (sidebar, top bar, tab bar)',pattern:'all '+role+' screens',level:'Shell',role};if(!seen.has('shell'+role)){seen.add('shell'+role);opens=opens.concat(scan(sh,chromeScr,false))}}
   const q=[...opens];let depth=0;while(q.length&&depth<400){depth++;const o=q.shift();const p=o.split('|');const k=p[0];const ck=role+'|'+o;if(modalDone.has(ck)||!MD[k])continue;modalDone.add(ck);const md=MD[k];UI.args=p.slice(1);UI.mf=Object.assign({},md.init?md.init(UI.args):{});let ob;try{ob=md.render(UI.args)}catch(e){rows.push({screenId:md.id,screen:k,route:'modal',level:'L3',role:md.role,element:'RENDER ERROR',interaction:'',targetType:'',target:e.message,targetId:'ERROR',effect:e.message,dead:true});continue}
    const ms={id:md.id,title:String(ob.title).replace(/<[^>]+>/g,''),pattern:k,level:'L3',role:md.role==='shared'?role:md.role};const nested=scan(`<div>${ob.body||''}${ob.foot||''}</div>`,ms,true);nested.forEach(n=>q.push(n))}
  })})})}finally{S.session=save.s;UI.pf=save.pf;UI.f=save.f;UI.pg=save.pg;UI.m=save.m;UI.mf=save.mf;UI.args=save.args}
 return rows}
const mapCsv=rows=>{const h=['Screen ID','Screen','Route pattern','Level','Role','Element','Interaction','Target type','Target','Target ID','Effect'];const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';return [h.map(q).join(',')].concat(rows.map(r=>[r.screenId,r.screen,r.route,r.level,r.role,r.element,r.interaction,r.targetType,r.target,r.targetId,r.effect].map(q).join(','))).join('\n')};

/* ---------------- sitemap page ---------------- */

A.back2=()=>A.protoback();
def('proto-sitemap',{role:'proto',level:'P',title:'Sitemap and redirects',sample:[[]]});

/* ---------------- edge cases ---------------- */
const EDGES=[
 {id:'EC-01',cat:'Sign in',title:'Wrong email or password',signedOut:1,route:'login',steps:'Enter aatif@durraniestates.com with a 3 character password, then a made-up email with 8+ characters.',expect:'Inline error for the short password; generic "Email or password is incorrect" for the unknown email. Five failures lock the form.'},
 {id:'EC-02',cat:'Sign in',title:'Invite link valid and expired',signedOut:1,route:'invite-tok24h',steps:'Open the valid invite, set a weak then a strong password. Then open the expired link.',expect:'Rules checklist updates live. Expired link says to ask Admin. Activated link shows "already used".'},
 {id:'EC-03',cat:'Sign in',title:'Session ended, deep link',signedOut:1,route:'agent-lead-1023',steps:'Signed out, open a lead link.',expect:'Sign-in screen. After sign-in as the right role the lead opens.'},
 {id:'EC-04',cat:'Access',title:'Wrong role opens a screen',user:'u10',route:'admin-review',steps:'As an agent, open the Admin booking approval link.',expect:'Access denied with a way back. Server returns no data.'},
 {id:'EC-05',cat:'Access',title:"Agent opens another agent's lead",user:'u10',route:'agent-lead-3001',steps:"Open a lead owned by Neha.",expect:'"This lead is not yours" with a way back.'},
 {id:'EC-06',cat:'Access',title:'Lead or booking does not exist',user:'u10',route:'agent-lead-0000',steps:'Open LEAD-0000.',expect:'Not-found card with a way back.'},
 {id:'EC-07',cat:'Leads',title:'Lead at risk, one day left',user:'u10',route:'agent-lead-1035',steps:'Open Karan Malhotra. Press +1 day.',expect:'Red banner with days left. After +1 day the lead returns to the Admin pool and the agent is notified.'},
 {id:'EC-08',cat:'Leads',title:'Lead on manager hold',user:'u10',route:'agent-lead-1104',steps:'Open the lead.',expect:'Hold banner. Inactivity clock paused. Manager can release.'},
 {id:'EC-09',cat:'Leads',title:'Unlogged call blocks the next call',user:'u10',route:'agent-lead-1106',steps:'Tap Call on this lead, then open LEAD-1107 and tap Call.',expect:'Banner on every screen. Second call is blocked until the first is logged.'},
 {id:'EC-10',cat:'Leads',title:'Call duration mismatch flagged',user:'u10',route:'agent-lead-1107',steps:'Tap Call, then Log call result, enter a duration far from the app estimate.',expect:'Saved with a Flagged chip. Manager sees it in Team Activity.'},
 {id:'EC-11',cat:'Leads',title:'Number on the DND list',user:'u10',route:'agent-lead-1108',pre:()=>{leadById('1108').phone='+971 50 889 2310'},steps:'Tap Call on this lead.',expect:'Blocked: number is on the Do Not Call list. Adding the same number as a new lead is also refused.'},
 {id:'EC-12',cat:'Leads',title:'Meeting time passed, verification link',user:'u10',route:'agent-lead-1023',steps:'Meeting was 09:30 today. Send confirmation link, preview the client page.',expect:'Prompt to send the link. Client confirms with photo and consent. Meeting becomes Verified.'},
 {id:'EC-13',cat:'Leads',title:'Arabic and linked leads',user:'u10',route:'agent-lead-1034',steps:'Open the lead, then Share project details.',expect:'Arabic tag, linked-lead card, Arabic message preview.'},
 {id:'EC-14',cat:'Leads',title:'Add a duplicate lead',user:'u10',route:'agent-leads',steps:'Add lead twice with the same number and source, then a different source.',expect:'Same source: discarded. Different source: linked lead that stays with the original active agent.'},
 {id:'EC-15',cat:'Leads',title:'Agent at active lead ceiling',user:'u12',route:'agent-leads',steps:'Signed in as Rahul (19 of 19).',expect:'Ceiling banner. Add lead is blocked. Admin cannot assign more to Rahul.'},
 {id:'EC-16',cat:'Leads',title:'New agent, no data',user:'u17',pre:()=>{userById('u17').status='active'},route:'agent-home',steps:'Signed in as Imran, activated and with no slab.',expect:'Empty states everywhere. Commission shows no slab.'},
 {id:'EC-17',cat:'Bookings',title:'Booking with changes requested',user:'u11',route:'agent-booking-bk10014',steps:'As Neha, open the booking.',expect:'Reason banner, rejected receipt, Fix and resubmit.'},
 {id:'EC-18',cat:'Bookings',title:'Rejected booking, unit released',user:'u10',route:'agent-booking-bk10009',steps:'Open the booking.',expect:'Rejected banner and a button to raise a new booking.'},
 {id:'EC-19',cat:'Bookings',title:'Unit hold expires',user:'u10',route:'agent-booking-bk10021',steps:'Press +1 day.',expect:'Hold passes 48 hours. Booking becomes Hold expired, unit goes back on sale, agent and Admin are told.'},
 {id:'EC-20',cat:'Bookings',title:'Hold limit reached',user:'u10',pre:()=>{[['p5','U-801'],['p4','V-102']].forEach(([p,u],i)=>{const b=JSON.parse(JSON.stringify(bkById('BKG-10021')));b.id='BKG-1099'+i;b.project=p;b.unit=u;b.lead='1036';S.bookings.push(b);syncUnits()})},route:'agent-bookingnew',steps:'Three holds are open. Try to raise another.',expect:'Error banner and a disabled submit.'},
 {id:'EC-21',cat:'Bookings',title:'Closed but commission blocked',user:'u11',route:'agent-booking-bk10006',steps:'Open the booking.',expect:'Buyer has paid 22% of the 30% milestone. Incentive is Blocked with the exact reason.'},
 {id:'EC-22',cat:'Bookings',title:'Developer commission not received',user:'u11',route:'agent-booking-bk10003',steps:'Open the booking.',expect:'Incentive is Pending until the developer pays.'},
 {id:'EC-23',cat:'Bookings',title:'Agent without a commission slab',user:'u10',pre:()=>{userById('u10').slab=null},route:'agent-booking-bk10002',steps:'Open a closed booking.',expect:'Incentive is Blocked: no slab. Home shows no slab.'},
 {id:'EC-24',cat:'Convertible Notes',title:'Bounced payout',user:'u1',route:'admin-cnnote-cn20260040',steps:'Open the note.',expect:'Red banner. Admin can resolve the payout.'},
 {id:'EC-25',cat:'Convertible Notes',title:'Application waiting on Admin',user:'u1',route:'admin-cn',steps:'Open the CN queue.',expect:'LEAD-2049 waits. Approve creates an active note.'},
 {id:'EC-26',cat:'Admin',title:'Import with duplicates and bad rows',user:'u1',route:'admin-importnew',steps:'Run the import wizard with the sample file.',expect:'Preview counts: new, discarded, linked, errors. Rows with errors can be downloaded.'},
 {id:'EC-27',cat:'Admin',title:'Assign blocked by ceiling',user:'u1',route:'admin-assign',steps:'Try to assign any lead to Rahul.',expect:'Blocked with the exact count.'},
 {id:'EC-28',cat:'Admin',title:'Deactivate a user with open leads',user:'u1',route:'admin-user-u13',steps:'Deactivate Aarav.',expect:'Must choose a target for his leads first.'},
 {id:'EC-29',cat:'Admin',title:'Booking closure gate',user:'u1',route:'admin-booking-bk10005',steps:'Try to approve closure.',expect:'Disabled until all five documents are approved.'},
 {id:'EC-30',cat:'Client page',title:'Client link states',signedOut:1,route:'client-confirm-k7m2xq',steps:'Open valid, expired (old001), used (used01), virtual (virt01), invalid (nope00).',expect:'Each shows the right message. Virtual skips the photo and shows Client confirmed.'},
 {id:'EC-31',cat:'Layout',title:'Phone width',user:'u10',route:'agent-leads',steps:'Turn on Phone frame.',expect:'Bottom tabs, lead cards instead of table, modals as bottom sheets, no horizontal scroll.'},
 {id:'EC-32',cat:'Management',title:'Escalation with discount request',user:'u2',route:'mgmt-leads-esc',steps:'Open Escalations and respond.',expect:'Agent keeps ownership and sees the reply on the lead.'},
 {id:'EC-33',cat:'Management',title:'Leave overlap and approvals',user:'u2',route:'mgmt-leave',steps:'Approve and reject requests.',expect:'Status updates for the agent. No balances anywhere.'},
 {id:'EC-34',cat:'Attendance',title:'Missed punch and regularisation',user:'u10',route:'agent-attendance',steps:'Request regularisation on the Miss punch day.',expect:'Goes to the manager. Record changes only after approval.'}
];
def('proto-edge',{role:'proto',level:'P',title:'Edge cases',sample:[[]]});

/* ---------------- boot ---------------- */
/* boot: provided by bridge.ts */

/* fitFrame: provided by bridge.ts */
/* global listener: handled in React (src/app/events.ts) */

export { A, AUDCAT, AVC, BKS, BOOT_REAL, CALLRES, CMS, CNDOCS, CNDS, CNSTEPS, COPYBUF, DAY, DISPINFO, DLBUF, DOCCAT, DOCN, DOCS, DSP, DSTC, EDGES, EMST, HR, IC, IMPCAMP, KCL, LEAVE_TYPES, LOGO, LVAB, MD, MIN, NAV, NAVS, NOTECHIPS, NOW, OFFICE, PLANS, PRE, PROTO, R, RCHIPS, RCHIPS0, REPORTS, RESINFO, ROLEN, ROUTEL, RT, S, SBG, SECFLOW, SECHINT, SECS, SETTABS, SHIFT, SHIFT_MS, SRCN, STG, TABN, TABS, TEMPS, TPLCAT, TPLVARS, TRACKS, TST, TZ, UI, UNDO, UNDOABLE, USTAT, _cb, _dl, _undoDepth, actEffect, addEv, addMonths, agentLeadsFiltered, agentsAll, agentsOf, archivedOf, assignTeam, at, audCat, audit, av, avHash, badgeFor, bkById, bkChip, bkF, bkP, bn, bookingsCount, bouncedN, btn, by, canDecide, cap1, capInfo, capOf, card, chanPick, chip, clockTxt, cnCalc, cnDS, cnFile, comm, crawl, csvOf, dayInfo, dayKey, daysBetween, dealStage, def, devState, distPlan, docCat, docType, dowOf, dtl, dtp, empty, esc, escalationsFor, estFor, f2, fd, fds, fhm, fillPlain, flaggedCalls, flashHtml, fld, fmtNum, ft, fts, gateOk, geoFlags, geoIssue, go, hashOf, hmOf, hms, holdsOf, homeOf, ic, impClass, impRows, ini, initState, intIn, isDnd, isOverdue, isToday, kvs, labelOf, lastKey, leadAccess, leadAllDocs, leadBack, leadById, leadOverview, leadRisk, leadTimeline, leadsOf, leaveOn, liveNow, mapCsv, mdef, me, mfull, minp, minsOf, mkMiles, money, monthDays, mopt, mseq, mtxa, mv, myLeads, myNotifs, myTeam, navOf, nextCard, nextOf, nextPay, nextSlab, nextTxt, nextUpFor, nf, norm, noteById, noteF, noteP, noteStat, notifDD, notify, pad2, parse, patt, pct, pendingReview, perfOf, pfv, planRows, poolLeads, pref, prio, projById, projFilter, projPipeline, projectPage, punchState, pushActivity, queueLeads, ranking, reassign, rel, resetUI, revOf, reviewGo, reviewTitle, reviewWho, roleLabel, roleTeam, sameDay, secById, secF, secList, secP, seed, seedTpls, sendMail, seq, shell, shiftWidget, sidebar, slabOf, stageChip, stageSet, startOfDay, startOfDayAt, sum, syncUnits, tabbar, tag, targetOf, teamBookings, teamById, teamEsc, teamIds, teamLeads, teamName, teamOf, teamRev, tempChip, tempPick, tick, toAed, todayStat, topbar, tplById, tplVals, uid, uname, undoToast, unitChip, unloggedBanner, unreadCount, userById, v6seed, whyOf, words, workedMs };
