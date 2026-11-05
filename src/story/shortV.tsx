import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import STL from './short-timeline.json';
import {Pose} from '../engine/Stickman';
import {env, idle, reach} from '../kit/actions';
import {Actor, Line, ShotCtx, TalkOverride} from '../kit/core';
import {clamp, ease} from '../kit/kit';
import {AgeBadge, FONT, HAND} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {Jacket} from './common';
import {Plaque} from './places';
import {DayCell} from './places2';
import {Mug} from './shots4';

/* ===== 9:16 short (1080×1920), native vertical scenes. Rules: the plate, the day tag and the text stay in the top half
   and never move; heroes stand on a floor at y=1230 (feet), the floor fills the lower third with texture and a rug,
   nothing important sits in the bottom third; every plaque ≥ 60 px from the frame edge. Plate values follow the day table. ===== */
const FY = 1230; // the floor line (feet)
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
/* camera on the scene layer: keys [frame, zoom, cx, cy]; the point (cx, cy) goes to the middle of the frame. A near-equal pair of
   frames is a cut to a new angle. The plate and the plaques are drawn outside of it. */
type CK = [number, number, number, number];
const Cam: React.FC<{f: number; keys: CK[]; children: React.ReactNode}> = ({f, keys, children}) => {
	let a = keys[0];
	let b = keys[0];
	let u = 0;
	if (f >= keys[keys.length - 1][0]) a = b = keys[keys.length - 1];
	else
		for (let i = 1; i < keys.length; i++)
			if (f <= keys[i][0]) {
				a = keys[i - 1];
				b = keys[i];
				u = ease(Math.max(0, Math.min(1, (f - a[0]) / Math.max(1, b[0] - a[0]))));
				break;
			}
	const z = a[1] + (b[1] - a[1]) * u;
	const cx = Math.min(1080 - 540 / z, Math.max(540 / z, a[2] + (b[2] - a[2]) * u + Math.sin(f / 42) * 6));
	const cy = Math.min(1920 - 960 / z, Math.max(960 / z, a[3] + (b[3] - a[3]) * u));
	return <g transform={`translate(540,960) scale(${z}) translate(${-cx},${-cy})`}>{children}</g>;
};
const Plt: React.FC<{v: number; y?: number; warn?: boolean; pop?: number}> = ({v, y = 160, warn, pop = 1}) => (
	<AgeBadge x={540} y={y} value={v} s={1.75 * pop} label="СВОБОДНЫХ ВЕЧЕРОВ" c={warn ? '#ff6a5a' : undefined} />
);
const popAfter = (f: number, t: number) => (f >= t ? 1 + 0.25 * Math.exp(-(f - t) / 6) : 1);
/* day tag under the plate: bright fill with dark text; on day 28 a second pill says how many evenings are left */
const DayRow: React.FC<{f: number; t?: number; day: string; left?: string; leftT?: number}> = ({f, t = 0, day, left, leftT}) => {
	const s = f >= t ? 1 + 0.2 * Math.exp(-(f - t) / 7) : 1;
	const s2 = leftT !== undefined && f >= leftT ? 1 + 0.25 * Math.exp(-(f - leftT) / 7) : 1;
	const y = 290;
	return (
		<g opacity={k(f, t, t + 6)}>
			{left ? (
				<>
					<g transform={`translate(225,${y}) scale(${s}) translate(-225,${-y})`}>
						<Plaque x={225} y={y} w={300} h={96} text={day} size={56} c="#ffd34a" fg="#10132a" fill="#ffd34a" />
					</g>
					<g transform={`translate(720,${y}) scale(${s2}) translate(-720,${-y})`}>
						<Plaque x={720} y={y} w={580} h={96} text={left} size={50} c="#5fe08a" fg="#fff" fill="#0b3a24" />
					</g>
				</>
			) : (
				<g transform={`translate(540,${y}) scale(${s}) translate(-540,${-y})`}>
					<Plaque x={540} y={y} w={day.length > 10 ? 720 : 460} h={96} text={day} size={56} c="#ffd34a" fg="#10132a" fill="#ffd34a" />
				</g>
			)}
		</g>
	);
};
/* floor: planks in perspective, a rug and a soft shadow — the whole lower part of the frame is a floor, never an empty void */
const Floor: React.FC<{c?: string; c2?: string; rug?: string}> = ({c = '#3a3050', c2 = '#2a2340', rug = '#5a4a78'}) => (
	<g>
		<defs>
			<linearGradient id="vfl" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={c} />
				<stop offset="1" stopColor={c2} />
			</linearGradient>
			<radialGradient id="vpool" cx="0.5" cy="0.5" r="0.5">
				<stop offset="0" stopColor="#fff" stopOpacity={0.22} />
				<stop offset="1" stopColor="#fff" stopOpacity={0} />
			</radialGradient>
		</defs>
		<rect x={-100} y={FY} width={1300} height={900} fill="url(#vfl)" />
		{Array.from({length: 14}).map((_, i) => {
			const x0 = 540 + (i - 7) * 80;
			const x1 = 540 + (i - 7) * 330;
			const x2 = 540 + (i - 6) * 330;
			const x3 = 540 + (i - 6) * 80;
			return <polygon key={i} points={`${x0},${FY} ${x1},1950 ${x2},1950 ${x3},${FY}`} fill={i % 2 ? '#000' : '#fff'} opacity={i % 2 ? 0.1 : 0.04} />;
		})}
		{Array.from({length: 6}).map((_, i) => (
			<line key={i} x1={-100} y1={FY + 60 + i * i * 22 + i * 40} x2={1200} y2={FY + 60 + i * i * 22 + i * 40} stroke="#000" opacity={0.16} strokeWidth={4} />
		))}
		<rect x={-100} y={FY} width={1300} height={10} fill="#000" opacity={0.25} />
		<ellipse cx={540} cy={FY + 220} rx={540} ry={200} fill="url(#vpool)" />
		<ellipse cx={540} cy={FY + 330} rx={420} ry={90} fill={rug} opacity={0.35} />
	</g>
);
const Grid: React.FC<{c?: string}> = ({c = '#141a48'}) => (
	<g>
		<rect x={-100} y={0} width={1300} height={1920} fill={c} />
		{Array.from({length: 42}).map((_, i) => (
			<line key={i} x1={-100} y1={i * 46} x2={1200} y2={i * 46} stroke="#fff" opacity={0.04} />
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
		<rect x={-100} y={0} width={1300} height={1920} fill="url(#vk)" />
		<g transform="translate(0,-10)">
			{Array.from({length: 9}).map((_, r) =>
				Array.from({length: 14}).map((__, c) => <rect key={`${r}${c}`} x={-80 + c * 90 + (r % 2) * 45} y={640 + r * 70} width={86} height={66} fill="#3d3a5c" opacity={0.6} />),
			)}
			<rect x={640} y={360} width={320} height={300} rx={8} fill="#c9c4dc" />
			<rect x={654} y={374} width={292} height={272} fill="#0b1030" />
			<circle cx={880} cy={440} r={26} fill="#eef1ff" />
			<line x1={800} y1={374} x2={800} y2={646} stroke="#c9c4dc" strokeWidth={8} />
			<line x1={654} y1={510} x2={946} y2={510} stroke="#c9c4dc" strokeWidth={8} />
			<rect x={-40} y={1010} width={460} height={24} fill="#5a5478" />
			<rect x={-40} y={1034} width={460} height={226} fill="#3a3556" />
			<rect x={780} y={780} width={250} height={480} rx={18} fill="#c9c6dc" />
			<line x1={780} y1={930} x2={1030} y2={930} stroke="#b9bcc8" strokeWidth={4} />
			<g transform="translate(60,0)">
				<rect x={52} y={910} width={140} height={100} fill="#3d3a5c" opacity={0.97} />
				<path d="M60,1010 L60,970 Q60,924 120,920 Q182,924 182,970 L182,1010 Z" fill="#8c96ad" stroke="#10132a" strokeWidth={5} />
				<path d="M60,976 L28,936 L42,926 L70,954 Z" fill="#8c96ad" stroke="#10132a" strokeWidth={5} />
				<path d="M76,930 Q121,870 170,930" fill="none" stroke="#10132a" strokeWidth={12} strokeLinecap="round" />
			</g>
		</g>
		<Floor />
		<rect x={-100} y={0} width={1300} height={1920} fill="#04051a" opacity={dark} />
		{moon > 0 ? <path d="M700,300 L960,300 L1100,1100 L520,1100 Z" fill="#cfe0ff" opacity={moon} /> : null}
	</g>
);
const KettleSteam: React.FC<{f: number}> = ({f}) => (
	<g transform="translate(0,-10)">
		{[0, 1, 2, 3].map((i) => {
			const u = ((f / 38 + i / 4) % 1);
			return <circle key={i} cx={46 + Math.sin(u * 6 + i) * 14} cy={930 - u * 160} r={14 + u * 22} fill="#fff" opacity={(1 - u) * 0.7} />;
		})}
	</g>
);
const TV = 1000; // table top
const TableV: React.FC<{f: number; mugs: number; steam?: number}> = ({f, mugs, steam = 1}) => (
	<g>
		<ellipse cx={730} cy={TV} rx={310} ry={40} fill="#8a7aa0" />
		<rect x={470} y={TV + 18} width={22} height={FY - TV - 18} fill="#4a3d5a" />
		<rect x={970} y={TV + 18} width={22} height={FY - TV - 18} fill="#4a3d5a" />
		{[560, 730, 900].map((cx, i) => (mugs > i ? <g key={cx} transform={`translate(${cx},${TV - 6}) scale(1.8)`}><Mug x={0} y={0} c={i ? '#3a6fd2' : '#f2b21c'} steam={steam} f={f + i * 13} /></g> : null))}
	</g>
);
const Person: React.FC<{x: number; s?: number; facing?: 1 | -1; pose?: Pose; look?: [number, number]; jacket?: boolean; who?: string; expr?: 'normal' | 'wide' | 'worried' | 'sad'; floor?: number}> = ({x, s = 1.6, facing = 1, pose, look = [0.8, 0.1], jacket = true, who, expr, floor = FY}) => {
	const p = pose ?? idle(0, 3);
	return (
		<g>
			<Actor who={who ?? (jacket ? 'heroSuit' : 'hero')} x={x} floor={floor} s={s} facing={facing} faceTurn={0.4} look={look} expr={expr} pose={pose} uid={'v' + x + (who ?? '')} />
			{jacket ? <Jacket p={p} x={x} facing={facing} s={s} seat={floor - 157 * s} /> : null}
		</g>
	);
};

/* ---- 001–003 · хук: пар и три чашки с первого кадра, подъезд камеры ---- */
export const V1 = seg('001', true, ({f, at, dur}) => {
	const a2 = at('002');
	const lightT = a2 + 22;
	const dark = f < lightT ? 0.5 : interpolate(f, [lightT, lightT + 6], [0.5, 0], clamp);
	return (
		<g>
			<Cam f={f} keys={[[0, 1.0, 560, 1000], [a2, 1.08, 520, 980], [dur, 1.18, 460, 960]]}>
				<Kitchen f={f} dark={dark} />
				<KettleSteam f={f} />
				<TableV f={f} mugs={3} />
				<Person x={360} s={1.95} look={[0.9, 0]} pose={idle(f, 3)} />
			</Cam>
			<Plt v={0} warn={f < lightT} />
			<DayRow f={f} t={0} day="ДЕНЬ 30 · 21:40" />
		</g>
	);
});

/* ---- 004–006 · правило первое, «Чирк»: 29 → 28; смена плана на «щёлкает» ---- */
export const V2 = seg('004', false, ({f, at, dur}) => {
	const a5 = at('005');
	const a6 = at('006');
	const cut = f >= a5 - 6;
	const v = interpolate(f, [a6 + 4, a6 + 14], [29, 28], clamp);
	const burn = k(f, a6 + 2, a6 + 26);
	const sheet = k(f, 6, 22) * (cut ? 0 : 1);
	const cz = cut ? 0.8 : 0.56;
	return (
		<g>
			<Cam f={f} keys={cut ? [[a5 - 6, 1.0, 540, 960], [dur, 1.1, 580, 990]] : [[0, 1.0, 540, 960], [a5 - 7, 1.08, 560, 975]]}>
				<Grid c="#243060" />
				<Floor c="#1c2150" c2="#141a48" rug="#3a4a90" />
				<g opacity={sheet} transform={`translate(0,${(1 - k(f, 6, 22)) * -30})`}>
					<rect x={190} y={390} width={700} height={240} rx={18} fill="#fbf8ef" stroke="#10132a" strokeWidth={8} transform="rotate(-0.6 540 510)" />
					<circle cx={232} cy={422} r={18} fill="#e2483a" stroke="#10132a" strokeWidth={4} />
					<circle cx={848} cy={422} r={18} fill="#3a6fd2" stroke="#10132a" strokeWidth={4} />
					<text x={540} y={466} textAnchor="middle" fontSize={60} fontFamily={HAND} fontWeight={700} fill="#c9342a">
						ПРАВИЛО 1
					</text>
					<text x={540} y={538} textAnchor="middle" fontSize={66} fontFamily={HAND} fontWeight={700} fill="#10132a">
						УЛУЧШЕНИЕ = 1 ВЕЧЕР
					</text>
					<text x={540} y={602} textAnchor="middle" fontSize={56} fontFamily={HAND} fontWeight={700} fill="#10132a">
						2 УЛУЧШЕНИЯ = 2 ВЕЧЕРА
					</text>
				</g>
				<Person x={cut ? 330 : 380} s={cut ? 1.7 : 1.5} jacket={false} look={[0.9, 0]} pose={idle(f, 3)} />
				<g transform={`translate(${cut ? 730 : 770},${cut ? 880 : 960})`}>
					<DayCell x={0} y={0} s={cz} wd="ВТ" day={2} ico="scissors" label="СТРИЖКА" burn={burn} />
				</g>
				<Onoma x={cut ? 740 : 760} y={cut ? 560 : 720} text="ЧИРК" t={f - (a6 + 4)} c="#ff9a6a" size={110} />
			</Cam>
			<Plt v={v} pop={popAfter(f, a6 + 14)} />
			<DayRow f={f} t={a6 + 4} day="ДЕНЬ 2" />
		</g>
	);
});

/* ---- 007 · правило третье: встречи не будет ---- */
export const V3 = seg('007', false, ({f, dur}) => {
	const sm = k(f, 20, 110);
	const pl = k(f, 8, 22);
	return (
		<g>
			<Cam f={f} keys={[[0, 1.0, 540, 960], [dur, 1.1, 540, 980]]}>
				<Grid />
				<Floor c="#1c2150" c2="#141a48" rug="#3a4a90" />
				<Person x={740} who="grandpa" jacket={false} look={[-0.6, 0.1]} facing={-1} pose={idle(f, 5)} s={1.6} />
				<g transform="translate(370,1010)">
					<DayCell x={0} y={0} s={0.67} wd="ПН" day={29} ico="cake" label="ДЕДУ 80" smolder={sm * 0.7} />
				</g>
			</Cam>
			<g opacity={pl} transform={`translate(0,${(1 - pl) * 20})`}>
				<Plaque x={540} y={485} w={920} h={230} text="" size={10} c="#ff9a6a" />
				<text x={540} y={475} textAnchor="middle" fontSize={78} fontFamily={FONT} fontWeight={900} fill="#fff">
					ПРАВИЛО 3:
				</text>
				<text x={540} y={570} textAnchor="middle" fontSize={76} fontFamily={FONT} fontWeight={900} fill="#ff9a6a">
					ВСТРЕЧИ НЕ БУДЕТ
				</text>
			</g>
			<Plt v={3} />
			<DayRow f={f} t={0} day="ДЕНЬ 28" left="ОСТАЛОСЬ 3 ВЕЧЕРА" />
		</g>
	);
});

/* ---- 008 · выбор между дедом и сценой ---- */
export const V4 = seg('008', false, ({f, dur}) => {
	const tilt = Math.sin(f / 10) * 5;
	const b = k(f, 6, 20);
	return (
		<g>
			<Cam f={f} keys={[[0, 1.0, 540, 960], [dur, 1.12, 540, 980]]}>
				<Grid />
				<Floor c="#1c2150" c2="#141a48" rug="#3a4a90" />
				<Person x={540} s={1.7} jacket look={[0, -0.3]} pose={idle(f, 3)} expr="worried" />
			</Cam>
			<g opacity={b}>
				<g transform="translate(250,570)">
					<DayCell x={0} y={0} s={0.61} wd="ПН" day={29} ico="cake" label="ДЕД" smolder={0.5} />
				</g>
				<g transform="translate(830,570) scale(1.33)">
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
			<DayRow f={f} t={0} day="ДЕНЬ 28" left="ОСТАЛОСЬ 3 ВЕЧЕРА" />
		</g>
	);
});

/* ---- 009–011 · звонок деду: окно на всю ширину, «ВМЕСТЕ = 1 ВЕЧЕР НА ДВОИХ» крупно ---- */
export const V5 = seg('009', false, ({f, dur, at}) => {
	const pl = k(f, 14, 28);
	const nod = Math.abs(Math.sin(Math.max(0, f - at('011')) / 6)) * (f >= at('011') ? 1 : 0);
	const up = reach(idle(f, 3), 'F', [40, -90], 0.8);
	return (
		<g>
			<Cam f={f} keys={[[0, 1.0, 540, 960], [dur, 1.08, 540, 1000]]}>
				<Grid c="#1a2150" />
				<Floor c="#1c2150" c2="#141a48" rug="#3a4a90" />
				<clipPath id="vwin">
					<rect x={70} y={340} width={940} height={400} rx={36} />
				</clipPath>
				<rect x={60} y={330} width={960} height={420} rx={42} fill="#0b0d1e" stroke="#6f7bd8" strokeWidth={8} />
				<g clipPath="url(#vwin)">
					<rect x={70} y={340} width={940} height={400} fill="#d6b98e" />
					<rect x={700} y={380} width={240} height={190} rx={8} fill="#243066" stroke="#f3ead2" strokeWidth={8} />
					<rect x={70} y={680} width={940} height={80} fill="#8a6a52" />
					<rect x={110} y={380} width={200} height={300} rx={8} fill="#8a6a44" />
					<Actor who="grandpa" x={540} floor={725} s={0.96} facing={1} faceTurn={0.2} look={[0.1, 0.3]} pose={{...idle(f, 5), head: 8 * nod}} uid="vg" />
				</g>
				<Person x={200} s={1.15} look={[0.4, -0.5]} jacket pose={up} />
			</Cam>
			<g opacity={pl} transform={`translate(0,${(1 - pl) * 20})`}>
				<Plaque x={690} y={970} w={600} h={330} text="" size={10} c="#5fe08a" />
				<text x={690} y={930} textAnchor="middle" fontSize={82} fontFamily={FONT} fontWeight={900} fill="#fff">
					ВМЕСТЕ =
				</text>
				<text x={690} y={1020} textAnchor="middle" fontSize={82} fontFamily={FONT} fontWeight={900} fill="#fff">
					1 ВЕЧЕР
				</text>
				<text x={690} y={1110} textAnchor="middle" fontSize={82} fontFamily={FONT} fontWeight={900} fill="#5fe08a">
					НА ДВОИХ
				</text>
			</g>
			<Plt v={3} />
			<DayRow f={f} t={0} day="ДЕНЬ 28" left="ОСТАЛОСЬ 3 ВЕЧЕРА" />
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
			<Cam f={f} keys={[[0, 1.0, 540, 960], [t - 4, 1.06, 540, 970], [dur, 1.1, 540, 960]]}>
				<Grid />
				<Floor c="#1c2150" c2="#141a48" rug="#3a4a90" />
				<g transform="translate(540,660)">
					<DayCell x={0} y={0} s={0.61} wd="ПН" day={29} ico="cake" label="ДЕД + СОН" dual={dual} smolder={dual ? 0 : 0.5} flash={env(f, t - 2, t + 8, 3, 12)} />
				</g>
				<Person x={340} s={1.6} look={[0.9, 0]} pose={idle(f, 3)} />
				<Person x={740} s={1.6} who="grandpa" jacket={false} facing={-1} look={[-0.9, 0]} pose={idle(f, 6)} />
				<Onoma x={850} y={520} text="ЧИРК" t={f - t} c="#5fe08a" size={110} />
			</Cam>
			<Plt v={v} pop={popAfter(f, t + 10)} />
			<DayRow f={f} t={0} day="ДЕНЬ 28" left={v < 2.5 ? 'ОСТАЛОСЬ 2 ВЕЧЕРА' : 'ОСТАЛОСЬ 3 ВЕЧЕРА'} leftT={t + 4} />
		</g>
	);
});

/* ---- 013 · три гостя, три чашки ---- */
export const V7 = seg('013', false, ({f, dur}) => {
	const u = [k(f, 4, 16), k(f, 16, 28), k(f, 28, 40)];
	return (
		<g>
			<Cam f={f} keys={[[0, 1.0, 540, 960], [dur, 1.15, 540, 1000]]}>
				<Kitchen f={f} />
				<KettleSteam f={f} />
				{[260, 540, 820].map((cx, i) => (
					<g key={cx} opacity={u[i]} transform={`translate(${cx},600) scale(2.6)`}>
						<Mug x={0} y={0} c={i ? '#3a6fd2' : '#f2b21c'} steam={1} f={f + i * 13} />
					</g>
				))}
				<Person x={210} s={1.25} look={[0.9, 0]} pose={idle(f, 3)} />
				<Person x={440} s={1.25} who="bro" jacket={false} facing={1} look={[0.8, 0]} pose={idle(f, 4)} />
				<Person x={660} s={1.25} who="tema" jacket={false} facing={1} look={[0.8, 0]} pose={idle(f, 5)} />
				<Person x={880} s={1.25} who="grandpa" jacket={false} facing={-1} look={[-0.8, 0]} pose={idle(f, 6)} />
			</Cam>
			<Plt v={0} />
			<DayRow f={f} t={0} day="ДЕНЬ 30 · 21:41" />
		</g>
	);
});

/* ---- 014 · финальный вопрос, три чашки, «Полная история на канале» ---- */
export const V8 = seg('014', false, ({f, dur}) => {
	const q = k(f, 6, 22);
	const flick = 0.1 + 0.06 * Math.sin(f / 5) + 0.04 * Math.sin(f / 2.3);
	return (
		<g>
			<Cam f={f} keys={[[0, 1.0, 540, 960], [dur, 1.16, 540, 1010]]}>
				<Kitchen f={f} dark={0.74} moon={flick} />
				<ellipse cx={540} cy={1040} rx={400} ry={58} fill="#8a7aa0" opacity={0.9} />
				{[240, 540, 840].map((cx, i) => (
					<g key={cx} transform={`translate(${cx},1030) scale(3.3)`}>
						<Mug x={0} y={0} c={i ? '#3a6fd2' : '#f2b21c'} steam={0.0} f={f} />
					</g>
				))}
			</Cam>
			<Plt v={0} />
			<g opacity={q} transform={`translate(0,${(1 - q) * 24})`}>
				{[['К КОМУ ТЫ', '#fff'], ['ЗАЙДЁШЬ', '#ffc94a'], ['СЕГОДНЯ', '#ffc94a'], ['БЕЗ ЗВОНКА?', '#ffc94a']].map(([t, c], i) => (
					<text key={t} x={540} y={400 + i * 118} textAnchor="middle" fontSize={98} fontFamily={FONT} fontWeight={900} fill={c} stroke="#0b0d1e" strokeWidth={10} paintOrder="stroke">
						{t}
					</text>
				))}
			</g>
			<g opacity={k(f, 40, 56)}>
				<Plaque x={540} y={1210} w={900} h={120} text="Полная история на канале" size={58} c="#ffd34a" fill="#1b2150" />
			</g>
		</g>
	);
});
