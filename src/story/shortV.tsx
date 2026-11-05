import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import STL from './short-timeline.json';
import {Pose, toLocal} from '../engine/Stickman';
import {env, idle, reach, SIT} from '../kit/actions';
import {Actor, Line, ShotCtx, TalkOverride} from '../kit/core';
import {clamp, ease} from '../kit/kit';
import {AgeBadge, FONT, HAND} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {Jacket} from './common';
import {Ico, Plaque} from './places';
import {DayCell} from './places2';
import {Mug} from './shots4';

/* ===== 9:16 short (1080×1920), native vertical scenes. Rules: plate and text in the top half,
   heroes full height with feet above y=1280, nothing important in the bottom third,
   every plaque ≥ 60 px from the frame edge. Numbers on the plate follow the day table. ===== */
const SL = STL.lines as Line[];
const k = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});
const talkAt = (sp: string, g: number) => {
	for (const l of SL) {
		if (l.sp !== sp || g < l.from || g >= l.from + l.dur) continue;
		const i = g - l.from;
		return ((l.env[i] ?? 0) + (l.env[i + 1] ?? 0)) / 2;
	}
	return 0;
};
type Body = React.FC<{f: number; g: number; dur: number; at: (id: string) => number}>;
/* a native vertical segment: supplies the shot context (for blinks, lip flap) and a full-bleed canvas */
const seg = (lineId: string, first: boolean, B: Body): React.FC<{f: number; dur: number}> => {
	const Seg: React.FC<{f: number; dur: number}> = ({f, dur}) => {
		const line = SL.find((l) => l.id.startsWith(lineId))!;
		const start = first ? 0 : line.from - 6;
		const at = (id: string) => SL.find((l) => l.id.startsWith(id))!.from - start;
		const ctx = {f, gf: start + f, dur, start, at, end: (id: string) => at(id) + SL.find((l) => l.id.startsWith(id))!.dur};
		return (
			<ShotCtx.Provider value={ctx}>
				<TalkOverride.Provider value={talkAt}>
					<AbsoluteFill style={{background: '#14152e'}}>
						<svg viewBox="0 0 1080 1920" width={1080} height={1920}>
							<B f={f} g={start + f} dur={dur} at={at} />
						</svg>
					</AbsoluteFill>
				</TalkOverride.Provider>
			</ShotCtx.Provider>
		);
	};
	return Seg;
};
/* slow living camera on the scene layer (the plate and plaques stay put inside the safe zone) */
const Drift: React.FC<{f: number; dur: number; z0?: number; z1?: number; dx?: number; children: React.ReactNode}> = ({f, dur, z0 = 1, z1 = 1.07, dx = 14, children}) => {
	const u = f / Math.max(1, dur);
	const z = z0 + (z1 - z0) * u;
	return <g transform={`translate(540,900) scale(${z}) translate(${-540 + Math.sin(f / 40) * dx},-900)`}>{children}</g>;
};
const Plt: React.FC<{v: number; y?: number; warn?: boolean; pop?: number}> = ({v, y = 160, warn, pop = 1}) => (
	<g>
		<AgeBadge x={540} y={y} value={v} s={1.75 * pop} label="СВОБОДНЫХ ВЕЧЕРОВ" c={warn ? '#ff6a5a' : undefined} />
	</g>
);
const popAfter = (f: number, t: number) => (f >= t ? 1 + 0.25 * Math.exp(-(f - t) / 6) : 1);
const DayTag: React.FC<{text: string; f: number; t?: number; y?: number}> = ({text, f, t = 0, y = 290}) => {
	const s = f >= t ? 1 + 0.2 * Math.exp(-(f - t) / 7) : 1;
	return (
		<g transform={`translate(540,${y}) scale(${s}) translate(-540,${-y})`} opacity={k(f, t, t + 6)}>
			<Plaque x={540} y={y} w={680} h={96} text={text} size={56} c="#ffd34a" />
		</g>
	);
};
const Floor: React.FC<{c?: string}> = ({c = '#3a3050'}) => (
	<g>
		<rect x={0} y={1240} width={1080} height={700} fill={c} />
		<rect x={0} y={1240} width={1080} height={8} fill="#000" opacity={0.15} />
		{Array.from({length: 7}).map((_, i) => (
			<line key={i} x1={0} y1={1300 + i * 90} x2={1080} y2={1300 + i * 90} stroke="#000" opacity={0.12} strokeWidth={4} />
		))}
	</g>
);
const Kitchen: React.FC<{f: number; dark?: number; moon?: number}> = ({f, dark = 0, moon = 0}) => (
	<g>
		<defs>
			<linearGradient id="vk" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#1f1f3a" />
				<stop offset="1" stopColor="#3a3352" />
			</linearGradient>
		</defs>
		<rect x={0} y={0} width={1080} height={1920} fill="url(#vk)" />
		{Array.from({length: 9}).map((_, r) =>
			Array.from({length: 13}).map((__, c) => <rect key={`${r}${c}`} x={-40 + c * 90 + (r % 2) * 45} y={640 + r * 70} width={86} height={66} fill="#3d3a5c" opacity={0.6} />),
		)}
		<rect x={640} y={360} width={320} height={300} rx={8} fill="#c9c4dc" />
		<rect x={654} y={374} width={292} height={272} fill="#0b1030" />
		<circle cx={880} cy={440} r={26} fill="#eef1ff" />
		<line x1={800} y1={374} x2={800} y2={646} stroke="#c9c4dc" strokeWidth={8} />
		<line x1={654} y1={510} x2={946} y2={510} stroke="#c9c4dc" strokeWidth={8} />
		<rect x={0} y={1010} width={420} height={24} fill="#5a5478" />
		<rect x={0} y={1034} width={420} height={210} fill="#3a3556" />
		<rect x={760} y={780} width={250} height={470} rx={18} fill="#c9c6dc" />
		<line x1={760} y1={930} x2={1010} y2={930} stroke="#b9bcc8" strokeWidth={4} />
		<g transform="translate(60,0)">
			<rect x={52} y={910} width={140} height={100} fill="#3d3a5c" opacity={0.97} />
			<path d="M60,1010 L60,970 Q60,924 120,920 Q182,924 182,970 L182,1010 Z" fill="#8c96ad" stroke="#10132a" strokeWidth={5} />
			<path d="M60,976 L28,936 L42,926 L70,954 Z" fill="#8c96ad" stroke="#10132a" strokeWidth={5} />
			<path d="M76,930 Q121,870 170,930" fill="none" stroke="#10132a" strokeWidth={12} strokeLinecap="round" />
		</g>
		<Floor />
		<rect x={0} y={0} width={1080} height={1920} fill="#04051a" opacity={dark} />
		{moon > 0 ? <path d="M700,360 L960,360 L1100,1100 L520,1100 Z" fill="#cfe0ff" opacity={moon} /> : null}
	</g>
);
const TableV: React.FC<{f: number; mugs: number; steam?: number; s?: number; cy?: number}> = ({f, mugs, steam = 1, cy = 1090}) => (
	<g>
		<ellipse cx={620} cy={cy} rx={400} ry={44} fill="#8a7aa0" />
		<rect x={300} y={cy + 20} width={22} height={1240 - cy - 20} fill="#4a3d5a" />
		<rect x={920} y={cy + 20} width={22} height={1240 - cy - 20} fill="#4a3d5a" />
		{[520, 700, 880].map((cx, i) => (mugs > i ? <g key={cx} transform={`translate(${cx},${cy - 6}) scale(1.7) translate(${-cx},${-690})`}><Mug x={cx} y={690} c={i ? '#3a6fd2' : '#f2b21c'} steam={steam} f={f + i * 13} /></g> : null))}
	</g>
);
const Kettle: React.FC<{f: number}> = ({f}) => (
	<g>
		{[0, 1, 2, 3].map((i) => {
			const u = ((f / 38 + i / 4) % 1);
			return <circle key={i} cx={46 + Math.sin(u * 6 + i) * 14} cy={930 - u * 160} r={14 + u * 22} fill="#fff" opacity={(1 - u) * 0.7} />;
		})}
	</g>
);
const Mitya: React.FC<{x: number; floor?: number; s?: number; facing?: 1 | -1; pose?: Pose; look?: [number, number]; jacket?: boolean; who?: string; expr?: 'normal' | 'wide' | 'worried' | 'sad'}> = ({x, floor = 1235, s = 1.7, facing = 1, pose, look = [0.8, 0.1], jacket = true, who, expr}) => {
	const p = pose ?? idle(0, 3);
	return (
		<g>
			<Actor who={who ?? (jacket ? 'heroSuit' : 'hero')} x={x} floor={floor} s={s} facing={facing} faceTurn={0.4} look={look} expr={expr} pose={pose} uid={'v' + x} />
			{jacket ? <Jacket p={p} x={x} facing={facing} s={s} seat={floor - 157 * s} /> : null}
		</g>
	);
};

/* ---- 001–003 · хук: 21:40, ноль вечеров, три чашки ---- */
export const V1 = seg('001', true, ({f, at, dur}) => {
	const a2 = at('002');
	const lightT = a2 + 22;
	const dark = f < lightT ? 0.6 : interpolate(f, [lightT, lightT + 6], [0.6, 0], clamp);
	const mugs = Number(f >= a2 + 70) + Number(f >= a2 + 84) + Number(f >= a2 + 98);
	return (
		<g>
			<Drift f={f} dur={dur} z0={1.0} z1={1.08}>
				<Kitchen f={f} dark={dark} />
				{f >= lightT ? <Kettle f={f} /> : null}
				<TableV f={f} mugs={mugs} />
				<Mitya x={300} s={1.95} look={[0.9, 0]} pose={idle(f, 3)} />
				<Onoma x={540} y={820} text="ТУК" t={f - (a2 + 70)} c="#ffd36a" size={90} />
				<Onoma x={700} y={820} text="ТУК" t={f - (a2 + 84)} c="#ffd36a" size={90} />
				<Onoma x={860} y={820} text="ТУК" t={f - (a2 + 98)} c="#ffd36a" size={90} />
			</Drift>
			<Plt v={0} warn={f < lightT} />
			<DayTag text="ДЕНЬ 30 · 21:40" f={f} t={0} y={290} />
		</g>
	);
});

/* ---- 004–006 · правило первое, «Чирк»: 29 → 28 ---- */
export const V2 = seg('004', false, ({f, at, dur}) => {
	const a6 = at('006');
	const v = interpolate(f, [a6 + 4, a6 + 14], [29, 28], clamp);
	const burn = k(f, a6 + 2, a6 + 26);
	const sheet = k(f, 6, 22);
	return (
		<g>
			<Drift f={f} dur={dur}>
				<rect x={0} y={0} width={1080} height={1920} fill="#243060" />
				{Array.from({length: 42}).map((_, i) => (
					<line key={i} x1={0} y1={i * 46} x2={1080} y2={i * 46} stroke="#fff" opacity={0.04} />
				))}
				<Floor c="#1c2150" />
				<g opacity={sheet} transform={`translate(0,${(1 - sheet) * -30})`}>
					<rect x={130} y={340} width={820} height={250} rx={18} fill="#fbf8ef" stroke="#10132a" strokeWidth={8} transform="rotate(-0.6 540 470)" />
					<circle cx={176} cy={374} r={18} fill="#e2483a" stroke="#10132a" strokeWidth={4} />
					<circle cx={904} cy={374} r={18} fill="#3a6fd2" stroke="#10132a" strokeWidth={4} />
					<text x={540} y={420} textAnchor="middle" fontSize={64} fontFamily={HAND} fontWeight={700} fill="#c9342a">
						ПРАВИЛО 1
					</text>
					<text x={540} y={494} textAnchor="middle" fontSize={68} fontFamily={HAND} fontWeight={700} fill="#10132a">
						УЛУЧШЕНИЕ = 1 ВЕЧЕР
					</text>
					<text x={540} y={560} textAnchor="middle" fontSize={58} fontFamily={HAND} fontWeight={700} fill="#10132a">
						2 УЛУЧШЕНИЯ = 2 ВЕЧЕРА
					</text>
				</g>
				<Mitya x={330} s={1.6} jacket={false} look={[0.9, 0]} pose={idle(f, 3)} />
				<g transform="translate(790,1010)">
					<DayCell x={0} y={0} s={0.42} wd="ВТ" day={2} ico="scissors" label="СТРИЖКА" burn={burn} />
				</g>
				<Onoma x={820} y={820} text="ЧИРК" t={f - (a6 + 4)} c="#ff9a6a" size={110} />
			</Drift>
			<Plt v={v} pop={popAfter(f, a6 + 14)} />
			<DayTag text="ДЕНЬ 2" f={f} t={a6 + 4} />
		</g>
	);
});

/* ---- 007 · правило третье: встречи не будет ---- */
export const V3 = seg('007', false, ({f, dur}) => {
	const sm = k(f, 20, 110);
	const pl = k(f, 8, 22);
	return (
		<g>
			<Drift f={f} dur={dur}>
				<rect x={0} y={0} width={1080} height={1920} fill="#141a48" />
				{Array.from({length: 42}).map((_, i) => (
					<line key={i} x1={0} y1={i * 46} x2={1080} y2={i * 46} stroke="#fff" opacity={0.04} />
				))}
				<Floor c="#1c2150" />
				<Mitya x={800} who="grandpa" jacket={false} look={[-0.6, 0.1]} facing={-1} pose={idle(f, 5)} s={1.6} />
				<g transform="translate(300,1000)">
					<DayCell x={0} y={0} s={0.5} wd="ПН" day={29} ico="cake" label="ДЕДУ 80" smolder={sm * 0.7} />
				</g>
			</Drift>
			<g opacity={pl} transform={`translate(0,${(1 - pl) * 20})`}>
				<Plaque x={540} y={480} w={920} h={230} text="" size={10} c="#ff9a6a" />
				<text x={540} y={470} textAnchor="middle" fontSize={78} fontFamily={FONT} fontWeight={900} fill="#fff">
					ПРАВИЛО 3:
				</text>
				<text x={540} y={565} textAnchor="middle" fontSize={76} fontFamily={FONT} fontWeight={900} fill="#ff9a6a">
					ВСТРЕЧИ НЕ БУДЕТ
				</text>
			</g>
			<Plt v={3} />
			<DayTag text="ДЕНЬ 28" f={f} t={0} />
		</g>
	);
});

/* ---- 008 · выбор между дедом и сценой ---- */
export const V4 = seg('008', false, ({f, dur}) => {
	const tilt = Math.sin(f / 10) * 5;
	const b = k(f, 6, 20);
	return (
		<g>
			<Drift f={f} dur={dur}>
				<rect x={0} y={0} width={1080} height={1920} fill="#141a48" />
				{Array.from({length: 42}).map((_, i) => (
					<line key={i} x1={0} y1={i * 46} x2={1080} y2={i * 46} stroke="#fff" opacity={0.04} />
				))}
				<Floor c="#1c2150" />
				<Mitya x={540} jacket look={[0, -0.3]} pose={idle(f, 3)} expr="worried" />
			</Drift>
			<g opacity={b}>
				<g transform="translate(250,520)">
					<DayCell x={0} y={0} s={0.46} wd="ПН" day={29} ico="cake" label="ДЕД" smolder={0.5} />
				</g>
				<g transform="translate(830,520)">
					<rect x={-120} y={-150} width={240} height={300} rx={20} fill="#2a1a3a" stroke="#ffd34a" strokeWidth={8} />
					<path d="M-120,-150 Q-70,-40 -120,150 L-80,150 Q-50,-30 -80,-150 Z" fill="#c9342a" />
					<path d="M120,-150 Q70,-40 120,150 L80,150 Q50,-30 80,-150 Z" fill="#c9342a" />
					<rect x={-4} y={-10} width={8} height={150} fill="#cfd6e6" />
					<ellipse cx={0} cy={-30} rx={20} ry={28} fill="#3a4256" stroke="#10132a" strokeWidth={4} />
					<Plaque x={0} y={200} w={250} h={76} text="СЦЕНА" size={50} c="#6aa8ff" />
				</g>
				<g transform={`translate(540,470) rotate(${tilt})`}>
					<Plaque x={0} y={0} w={170} h={110} text="ИЛИ" size={66} c="#ffd34a" />
				</g>
			</g>
			<Plt v={3} />
			<DayTag text="ДЕНЬ 28" f={f} t={0} />
		</g>
	);
});

/* ---- 009–011 · звонок деду: «ВМЕСТЕ = 1 ВЕЧЕР НА ДВОИХ» ---- */
export const V5 = seg('009', false, ({f, dur, at}) => {
	const pl = k(f, 14, 28);
	const nod = Math.abs(Math.sin(Math.max(0, f - at('011')) / 6)) * 0.4 * (f >= at('011') ? 1 : 0);
	const up = reach(idle(f, 3), 'F', [40, -90], 0.8);
	return (
		<g>
			<Drift f={f} dur={dur} z0={1} z1={1.05}>
				<rect x={0} y={0} width={1080} height={1920} fill="#1a2150" />
				{Array.from({length: 42}).map((_, i) => (
					<line key={i} x1={0} y1={i * 46} x2={1080} y2={i * 46} stroke="#fff" opacity={0.04} />
				))}
				<Floor c="#1c2150" />
				<clipPath id="vwin">
					<rect x={150} y={330} width={780} height={460} rx={36} />
				</clipPath>
				<rect x={140} y={320} width={800} height={480} rx={42} fill="#0b0d1e" stroke="#6f7bd8" strokeWidth={8} />
				<g clipPath="url(#vwin)">
					<rect x={150} y={330} width={780} height={460} fill="#d6b98e" />
					<rect x={620} y={380} width={240} height={200} rx={8} fill="#243066" stroke="#f3ead2" strokeWidth={8} />
					<rect x={150} y={720} width={780} height={80} fill="#8a6a52" />
					<rect x={190} y={380} width={190} height={300} rx={8} fill="#8a6a44" />
					<Actor who="grandpa" x={520} floor={790} s={1.05} facing={1} faceTurn={0.2} look={[0.1, 0.3]} pose={{...idle(f, 5), head: 8 * nod * 10}} uid="vg" />
				</g>
				<Mitya x={250} s={1.2} floor={1250} look={[0.4, -0.5]} jacket pose={up} />
			</Drift>
			<g opacity={pl} transform={`translate(0,${(1 - pl) * 20})`}>
				<Plaque x={715} y={980} w={580} h={250} text="" size={10} c="#5fe08a" />
				<text x={715} y={950} textAnchor="middle" fontSize={54} fontFamily={FONT} fontWeight={900} fill="#fff">
					ВМЕСТЕ = 1 ВЕЧЕР
				</text>
				<text x={715} y={1030} textAnchor="middle" fontSize={54} fontFamily={FONT} fontWeight={900} fill="#5fe08a">
					НА ДВОИХ
				</text>
			</g>
			<Plt v={3} />
			<DayTag text="ДЕНЬ 28" f={f} t={0} />
		</g>
	);
});

/* ---- 012 · «Чирк. Два.» ---- */
export const V6 = seg('012', false, ({f, dur}) => {
	const t = 86;
	const v = interpolate(f, [t, t + 10], [3, 2], clamp);
	const dual = f > t - 2;
	return (
		<g>
			<Drift f={f} dur={dur}>
				<rect x={0} y={0} width={1080} height={1920} fill="#141a48" />
				{Array.from({length: 42}).map((_, i) => (
					<line key={i} x1={0} y1={i * 46} x2={1080} y2={i * 46} stroke="#fff" opacity={0.04} />
				))}
				<Floor c="#1c2150" />
				<g transform="translate(540,510)">
					<DayCell x={0} y={0} s={0.46} wd="ПН" day={29} ico="cake" label="ДЕД + СОН" dual={dual} smolder={dual ? 0 : 0.5} flash={env(f, t - 2, t + 8, 3, 12)} />
				</g>
				<Mitya x={330} s={1.45} look={[0.9, 0]} pose={idle(f, 3)} />
				<Mitya x={750} s={1.45} who="grandpa" jacket={false} facing={-1} look={[-0.9, 0]} pose={idle(f, 6)} />
				<Onoma x={850} y={440} text="ЧИРК" t={f - t} c="#5fe08a" size={110} />
			</Drift>
			<Plt v={v} pop={popAfter(f, t + 10)} />
			<DayTag text="ДЕНЬ 28" f={f} t={0} />
		</g>
	);
});

/* ---- 013 · три гостя, три чашки ---- */
export const V7 = seg('013', false, ({f, dur}) => {
	const u = [k(f, 4, 16), k(f, 16, 28), k(f, 28, 40)];
	return (
		<g>
			<Drift f={f} dur={dur}>
				<Kitchen f={f} />
				<Kettle f={f} />
				{[260, 540, 820].map((cx, i) => (
					<g key={cx} opacity={u[i]} transform={`translate(${cx},560) scale(2.6)`}>
						<Mug x={0} y={0} c={i ? '#3a6fd2' : '#f2b21c'} steam={1} f={f + i * 13} />
					</g>
				))}
				<Mitya x={170} s={1.25} look={[0.9, 0]} pose={idle(f, 3)} />
				<Mitya x={420} s={1.25} who="bro" jacket={false} facing={1} look={[0.8, 0]} pose={idle(f, 4)} />
				<Mitya x={670} s={1.25} who="tema" jacket={false} facing={1} look={[0.8, 0]} pose={idle(f, 5)} />
				<Mitya x={900} s={1.25} who="grandpa" jacket={false} facing={-1} look={[-0.8, 0]} pose={idle(f, 6)} />
			</Drift>
			<Plt v={0} />
			<DayTag text="ДЕНЬ 30 · 21:41" f={f} t={0} />
		</g>
	);
});

/* ---- 014 · финальный вопрос, три чашки, «Полная история на канале» ---- */
export const V8 = seg('014', false, ({f, dur}) => {
	const q = k(f, 6, 22);
	const flick = 0.1 + 0.06 * Math.sin(f / 5) + 0.04 * Math.sin(f / 2.3);
	return (
		<g>
			<Drift f={f} dur={dur} z0={1} z1={1.1}>
				<Kitchen f={f} dark={0.74} moon={flick} />
				<ellipse cx={540} cy={1040} rx={380} ry={56} fill="#8a7aa0" opacity={0.9} />
				{[260, 540, 820].map((cx, i) => (
					<g key={cx} transform={`translate(${cx},1030) scale(3.3)`}>
						<Mug x={0} y={0} c={i ? '#3a6fd2' : '#f2b21c'} steam={0.0} f={f} />
					</g>
				))}
			</Drift>
			<Plt v={0} />
			<g opacity={q} transform={`translate(0,${(1 - q) * 24})`}>
				{[['К КОМУ ТЫ', '#fff'], ['ЗАЙДЁШЬ', '#ffc94a'], ['СЕГОДНЯ', '#ffc94a'], ['БЕЗ ЗВОНКА?', '#ffc94a']].map(([t, c], i) => (
					<text key={t} x={540} y={380 + i * 118} textAnchor="middle" fontSize={98} fontFamily={FONT} fontWeight={900} fill={c} stroke="#0b0d1e" strokeWidth={10} paintOrder="stroke">
						{t}
					</text>
				))}
			</g>
			<g opacity={k(f, 40, 56)}>
				<Plaque x={540} y={1170} w={900} h={120} text="Полная история на канале" size={58} c="#ffd34a" fill="#1b2150" />
			</g>
		</g>
	);
});
