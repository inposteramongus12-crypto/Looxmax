/* Locations made for this video only (a beach, a spaceship, a desert…).
   Copy the structure of a set from ../kit/sets.tsx or ../reference/PauseTime.tsx:
   sky/wall gradient, ground, 2–3 big objects, one light source, a `night` prop and one
   living detail (waves, flicker, leaves). Use them inside <Layer depth={1.4–2}> in shots.tsx. */
import React from 'react';
import {interpolateColors} from 'remotion';
import {AgeBadge, FONT} from '../kit/ui';
import {STORY} from './config';

/* ---------- Counter badge over the hero's head with a pulsing heart (helper for common.tsx HT) ----------
   label comes from STORY.counter.label; bpm>0 shows the heart, `auto` colours it by pulse. */
export const Heart: React.FC<{x: number; y: number; f: number; bpm?: number; s?: number; c?: string}> = ({x, y, f, bpm = 70, s = 1, c = '#ff4a5e'}) => {
	const period = (60 / Math.max(1, bpm)) * 30;
	const ph = (f % period) / period;
	const beat = bpm > 0 ? 1 + 0.28 * Math.max(0, Math.sin(ph * Math.PI * 2)) ** 3 : 1;
	return (
		<g transform={`translate(${x},${y}) scale(${s * beat})`}>
			<path d="M0,16 C-34,-6 -22,-30 -9,-26 C-4,-25 0,-20 0,-16 C0,-20 4,-25 9,-26 C22,-30 34,-6 0,16 Z" fill={c} stroke="#10132a" strokeWidth={3} />
		</g>
	);
};
// heart colour by pulse: grey (rest) -> yellow -> red
export const heartColor = (bpm: number) => interpolateColors(bpm, [85, 115, 142, 150], ['#8c93a8', '#ffd34a', '#ffd34a', '#ff4a5e']);
export const Tag: React.FC<{x: number; y: number; value: number; f: number; s?: number; warn?: boolean; ok?: boolean; grey?: boolean; bpm?: number; label?: string; pop?: number; heart?: boolean; auto?: boolean; showBpm?: boolean; heartK?: number}> = ({x, y, value, f, s = 0.8, warn = false, ok = false, grey = false, bpm = 70, label = STORY.counter?.label ?? 'СЧЁТ', pop = 1, heart = true, auto = false, showBpm = false, heartK = 1}) => {
	const digits = String(Math.floor(value));
	const dw = Math.max(2, digits.length) * 27;
	const w = 26 + (label.length * 16 + 10) + 18 + dw + 22;
	const c = grey ? '#aab1c4' : ok ? '#5fe08a' : warn && Math.floor(f / 7) % 2 === 0 ? '#ff4a3a' : '#ffc94a';
	const hc = auto ? heartColor(bpm) : bpm > 0 ? '#ff4a5e' : '#7a8296';
	const hx = x + (w / 2 + 42) * s;
	return (
		<g>
			<AgeBadge x={x} y={y} value={value} s={s} pop={pop} label={label} c={c} />
			{heart && heartK > 0.02 ? <Heart x={hx} y={y - 4 * s} f={f} bpm={bpm} s={s * 0.9 * heartK} c={hc} /> : null}
			{heart && showBpm && heartK > 0.5 ? (
				<text x={hx + 40 * s} y={y + 15 * s} fontSize={44 * s} fontFamily={FONT} fontWeight={800} fill={hc} stroke="#10132a" strokeWidth={6 * s} paintOrder="stroke">
					{Math.round(bpm)}
				</text>
			) : null}
		</g>
	);
};

/* =================== locations and cards of parts 1–3 =================== */
import {interpolate, random} from 'remotion';
import {Svg} from '../engine/camera';
import {Mirror} from '../kit/kit';
import {Chair} from '../engine/props';
import {clamp, ease} from '../kit/kit';

export const Wall: React.FC<{id: string; top: string; bot: string}> = ({id, top, bot}) => (
	<g>
		<defs>
			<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={top} />
				<stop offset="1" stopColor={bot} />
			</linearGradient>
		</defs>
		<rect x={-700} y={-400} width={3300} height={1400} fill={`url(#${id})`} />
	</g>
);
export const Ground: React.FC<{y: number; c: string; c2?: string}> = ({y, c, c2 = 'rgba(0,0,0,0.12)'}) => (
	<g>
		<rect x={-700} y={y} width={3300} height={500} fill={c} />
		<rect x={-700} y={y} width={3300} height={8} fill={c2} />
	</g>
);

/* ванная: плитка, зеркало над раковиной (зеркало x 750..1170, y 130..700) */
export const Bathroom: React.FC<{f: number; reflect?: React.ReactNode}> = ({f, reflect}) => (
	<Svg>
		<Wall id="bt-w" top="#cfe6ee" bot="#b4d3df" />
		{Array.from({length: 11}).map((_, r) => Array.from({length: 32}).map((__, c) => <rect key={`${r}-${c}`} x={-300 + c * 90 + (r % 2) * 45} y={-100 + r * 70} width={86} height={66} fill="#e6f3f7" opacity={0.55} />))}
		<rect x={738} y={118} width={444} height={594} rx={22} fill="#7e98a6" />
		<rect x={750} y={130} width={420} height={570} rx={14} fill="#d9eef7" />
		<Mirror x={750} y={130} w={420} h={570} id="bt-m">
			{reflect}
		</Mirror>
		<rect x={820} y={740} width={280} height={60} rx={20} fill="#f4f8fa" />
		<rect x={940} y={800} width={40} height={100} fill="#d3dde3" />
		<rect x={948} y={690} width={24} height={52} rx={8} fill="#aeb9c2" />
		<rect x={1420} y={300} width={300} height={600} rx={10} fill="#6aa892" />
		<rect x={1440} y={320} width={260} height={560} rx={6} fill="#7fb8a4" />
		<ellipse cx={960} cy={30} rx={700} ry={220} fill="#fffbe8" opacity={0.2 + 0.03 * Math.sin(f / 40)} />
		<Ground y={900} c="#9db9b8" />
	</Svg>
);

/* парикмахерская: большое зеркало слева, кресло по центру */
export const Barber: React.FC<{f: number; reflect?: React.ReactNode}> = ({f, reflect}) => (
	<Svg>
		<Wall id="bb-w" top="#efe4d0" bot="#e0d0b4" />
		<rect x={0} y={640} width={1920} height={30} fill="#9a7a58" />
		<rect x={300} y={160} width={500} height={560} rx={20} fill="#6b4a2a" />
		<rect x={316} y={176} width={468} height={528} rx={12} fill="#d9eef7" />
		<Mirror x={316} y={176} w={468} h={528} id="bb-m">
			{reflect}
		</Mirror>
		<rect x={1260} y={170} width={420} height={60} rx={8} fill="#3aa37a" />
		<text x={1470} y={214} textAnchor="middle" fontSize={40} fontFamily="'Rubik', sans-serif" fontWeight={800} fill="#fff">
			СТРИЖКИ
		</text>
		{[0, 1, 2].map((i) => (
			<rect key={i} x={1280 + i * 140} y={300} width={110} height={150} rx={6} fill={['#f2d9a8', '#cfe3dc', '#f0b8b8'][i]} stroke="#6b4a2a" strokeWidth={6} />
		))}
		{/* barber chair */}
		<rect x={900} y={820} width={140} height={80} rx={14} fill="#3a3f55" />
		<rect x={955} y={790} width={30} height={40} fill="#9aa0ae" />
		<rect x={850} y={760} width={240} height={36} rx={14} fill="#a8473a" />
		<rect x={1075} y={560} width={34} height={220} rx={14} fill="#a8473a" />
		<Ground y={900} c="#b9a27c" />
		<ellipse cx={960} cy={40} rx={800} ry={240} fill="#fff6dd" opacity={0.22 + 0.02 * Math.sin(f / 30)} />
	</Svg>
);

/* комната деда: окно вечер, шкаф, лампа, часы, столик с шахматами (стол x 700..1200, y 700) */
export const GrandRoom: React.FC<{f: number; dark?: number}> = ({f, dark = 0}) => (
	<Svg>
		<Wall id="gr-w" top="#d6b98e" bot="#c4a274" />
		<rect x={140} y={170} width={320} height={430} rx={10} fill="#8a6a44" />
		{[0, 1, 2].map((r) => (
			<g key={r}>
				<rect x={156} y={186 + r * 134} width={288} height={8} fill="#6b4a2a" />
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<rect key={i} x={166 + i * 46} y={196 + r * 134 + (i % 3) * 6} width={34} height={110 - (i % 3) * 6} fill={['#c9544a', '#3a6fd2', '#e8c24a', '#4a9a6a', '#8e5ac4', '#d98a3a'][(i + r) % 6]} />
				))}
			</g>
		))}
		<rect x={1380} y={150} width={330} height={300} rx={14} fill="#f3ead2" stroke="#6b4a2a" strokeWidth={10} />
		<rect x={1400} y={170} width={290} height={260} fill="#243066" />
		<circle cx={1610} cy={230} r={34} fill="#fff6c8" />
		<rect x={640} y={690} width={620} height={26} rx={6} fill="#8a5a34" />
		<rect x={680} y={716} width={24} height={184} fill="#6b4a2a" />
		<rect x={1196} y={716} width={24} height={184} fill="#6b4a2a" />
		<g transform="translate(960,690)">
			<ellipse cx={0} cy={-6} rx={250} ry={22} fill="#000" opacity={0.15} />
			{Array.from({length: 8}).map((_, r) => Array.from({length: 8}).map((__, c) => <rect key={`${r}${c}`} x={-180 + c * 45} y={-90 + r * 11} width={45} height={11} fill={(r + c) % 2 ? '#5a3a22' : '#f0e0bc'} />))}
		</g>
		<Ground y={900} c="#8a6a52" />
		<ellipse cx={980} cy={80} rx={760} ry={260} fill="#ffe8b0" opacity={0.3 * (1 - dark)} />
	</Svg>
);

/* ----------------------------- иконки для календаря ----------------------------- */
export type IcoKind = 'ball' | 'book' | 'pad' | 'knight' | 'popcorn' | 'dice' | 'plate' | 'cake' | 'suitcase' | 'scissors' | 'moon';
export const Ico: React.FC<{k: IcoKind; x: number; y: number; s?: number; c?: string}> = ({k, x, y, s = 1, c}) => {
	const st = {stroke: '#10132a', strokeWidth: 5, strokeLinejoin: 'round' as const};
	let g: React.ReactNode = null;
	if (k === 'ball')
		g = (
			<g>
				<circle r={52} fill="#fff" {...st} />
				<polygon points="0,-24 23,-8 14,20 -14,20 -23,-8" fill="#10132a" />
				<path d="M0,-24 L0,-52 M23,-8 L50,-16 M14,20 L32,42 M-14,20 L-32,42 M-23,-8 L-50,-16" stroke="#10132a" strokeWidth={5} />
			</g>
		);
	if (k === 'book')
		g = (
			<g>
				<rect x={-48} y={-40} width={96} height={80} rx={8} fill={c ?? '#ffd34a'} {...st} />
				<line x1={0} y1={-40} x2={0} y2={40} stroke="#10132a" strokeWidth={5} />
				<path d="M-34,-14 H-12 M-34,4 H-12 M12,-14 H34 M12,4 H34" stroke="#10132a" strokeWidth={5} />
			</g>
		);
	if (k === 'pad')
		g = (
			<g>
				<rect x={-62} y={-30} width={124} height={62} rx={30} fill="#3a4256" {...st} />
				<path d="M-38,-6 H-14 M-26,-18 V6" stroke="#fff" strokeWidth={7} />
				<circle cx={26} cy={-14} r={7} fill="#ffd34a" />
				<circle cx={42} cy={4} r={7} fill="#ff6a5a" />
			</g>
		);
	if (k === 'knight')
		g = (
			<g>
				<path d="M-34,44 L-30,10 C-48,-8 -30,-44 4,-48 C38,-48 42,-14 30,0 L10,0 L30,44 Z" fill="#f0e0bc" {...st} />
				<circle cx={6} cy={-26} r={5} fill="#10132a" />
			</g>
		);
	if (k === 'popcorn')
		g = (
			<g>
				{[-30, 0, 30].map((dx, i) => (
					<circle key={i} cx={dx} cy={-30 - (i % 2) * 14} r={22} fill="#fff6c8" {...st} />
				))}
				<path d="M-46,-8 H46 L34,46 H-34 Z" fill="#e2483a" {...st} />
				<path d="M-16,-8 L-12,46 M16,-8 L12,46" stroke="#fff" strokeWidth={8} />
			</g>
		);
	if (k === 'dice')
		g = (
			<g>
				<rect x={-44} y={-44} width={88} height={88} rx={16} fill="#fff" {...st} />
				{[[-20, -20], [20, -20], [0, 0], [-20, 20], [20, 20]].map(([dx, dy], i) => (
					<circle key={i} cx={dx} cy={dy} r={8} fill="#10132a" />
				))}
			</g>
		);
	if (k === 'plate')
		g = (
			<g>
				<ellipse cx={0} cy={10} rx={58} ry={24} fill="#fff" {...st} />
				<ellipse cx={0} cy={6} rx={34} ry={13} fill="#e8d6a8" />
				<path d="M-60,-40 V16 M-52,-40 V-6 M-68,-40 V-6" stroke="#10132a" strokeWidth={5} />
			</g>
		);
	if (k === 'cake')
		g = (
			<g>
				<rect x={-50} y={0} width={100} height={46} rx={10} fill="#f2a6c0" {...st} />
				<rect x={-38} y={-34} width={76} height={34} rx={8} fill="#fff" {...st} />
				<rect x={-5} y={-62} width={10} height={28} fill="#5ab0ff" />
				<ellipse cx={0} cy={-68} rx={7} ry={11} fill="#ffb400" />
			</g>
		);
	if (k === 'suitcase')
		g = (
			<g>
				<path d="M-18,-36 V-52 H18 V-36" stroke="#10132a" strokeWidth={8} fill="none" />
				<rect x={-58} y={-36} width={116} height={86} rx={12} fill="#c9544a" {...st} />
				<rect x={-58} y={-4} width={116} height={8} fill="#10132a" opacity={0.4} />
				<rect x={-10} y={-10} width={20} height={20} rx={4} fill="#ffd34a" {...st} />
			</g>
		);
	if (k === 'scissors')
		g = (
			<g>
				<path d="M-40,-44 L30,28 M40,-44 L-30,28" stroke="#cfd6e6" strokeWidth={12} strokeLinecap="round" />
				<circle cx={-34} cy={38} r={16} fill="none" stroke="#e2483a" strokeWidth={9} />
				<circle cx={34} cy={38} r={16} fill="none" stroke="#e2483a" strokeWidth={9} />
			</g>
		);
	if (k === 'moon')
		g = <path d="M10,-52 A52,52 0 1 0 50,22 A42,42 0 1 1 10,-52 Z" fill="#fff0a8" {...st} />;
	return <g transform={`translate(${x},${y}) scale(${s})`}>{g}</g>;
};

/* маленький человечек для плашек (голова + плечи) */
export const Mini: React.FC<{x: number; y: number; c: string; hair?: string; s?: number; label?: string}> = ({x, y, c, hair = '#3a2a1c', s = 1, label}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M-42,46 Q-42,10 0,10 Q42,10 42,46 Z" fill={c} stroke="#10132a" strokeWidth={5} />
		<circle r={30} cy={-20} fill="#ffe0bd" stroke="#10132a" strokeWidth={5} />
		<path d="M-30,-26 Q0,-62 30,-26 Q14,-40 -30,-26 Z" fill={hair} stroke="#10132a" strokeWidth={4} />
		<circle cx={-10} cy={-18} r={4} fill="#10132a" />
		<circle cx={10} cy={-18} r={4} fill="#10132a" />
		{label ? (
			<text y={96} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={800} fill="#fff" stroke="#10132a" strokeWidth={7} paintOrder="stroke">
				{label}
			</text>
		) : null}
	</g>
);

/* ------------------------- неделя в телефоне (части 2) ------------------------- */
type Cell = {d: string; ico: IcoKind; who: string; c: string; hair?: string; t: number};
export const WEEK: Omit<Cell, 't'>[] = [
	{d: 'ПН', ico: 'ball', who: 'ВОВАН', c: '#2f8f5a', hair: '#e8d6a8'},
	{d: 'ВТ', ico: 'book', who: 'СЕСТРА', c: '#e86aa0', hair: '#5a3a22'},
	{d: 'СР', ico: 'pad', who: 'БРАТ', c: '#2f6fd8', hair: '#5a3a22'},
	{d: 'ЧТ', ico: 'knight', who: 'ДЕД', c: '#6b7f8e', hair: '#d0d4dc'},
	{d: 'ПТ', ico: 'popcorn', who: 'ТЁМА', c: '#d94a3a', hair: '#2f6fd8'},
	{d: 'СБ', ico: 'dice', who: 'ВСЕ', c: '#7a5cc4', hair: '#5a3a22'},
	{d: 'ВС', ico: 'plate', who: 'МАМА', c: '#7a5cc4', hair: '#3a2a1c'},
];
export const WeekCal: React.FC<{t: number; times: number[]; open: number; burn?: number[]}> = ({t, times, open, burn = []}) => {
	const k = interpolate(t, [0, open], [0.25, 1], {...clamp, easing: ease});
	return (
		<g transform={`translate(960,540) scale(${k * 0.9}) translate(-960,-540)`}>
			<rect x={40} y={110} width={1840} height={860} rx={60} fill="#0f1230" stroke="#6f7bd8" strokeWidth={8} />
			<text x={960} y={215} textAnchor="middle" fontSize={84} fontFamily={FONT} fontWeight={900} fill="#fff">
				МОЯ НЕДЕЛЯ
			</text>
			{WEEK.map((w, i) => {
				const on = t >= times[i];
				const pop = interpolate(t, [times[i], times[i] + 10], [0.7, 1], {...clamp, easing: ease});
				const x = 62 + i * 258;
				const dead = t >= (burn[i] ?? 1e9);
				return (
					<g key={i} transform={`translate(${x},0)`}>
						<g transform={`translate(124,590) scale(${on ? pop : 1}) translate(-124,-590)`}>
							<rect x={0} y={290} width={248} height={600} rx={30} fill={dead ? '#2a1c1c' : on ? '#fff6dc' : '#1c2150'} stroke={dead ? '#ff6a3a' : on ? '#ffd34a' : '#3a4180'} strokeWidth={6} />
							<text x={124} y={372} textAnchor="middle" fontSize={76} fontFamily={FONT} fontWeight={900} fill={on ? '#10132a' : '#7a84c8'}>
								{w.d}
							</text>
							{on ? (
								<>
									<Ico k={w.ico} x={124} y={510} s={1.5} />
									<Mini x={124} y={690} c={w.c} hair={w.hair} s={1.3} />
									<text x={124} y={850} textAnchor="middle" fontSize={54} fontFamily={FONT} fontWeight={900} fill="#10132a">
										{w.who}
									</text>
								</>
							) : null}
						</g>
					</g>
				);
			})}
		</g>
	);
};

/* лента 30 вечеров (14 в ряд не помещается — два ряда по 15) */
export const Ribbon: React.FC<{t: number; burned: number[]; cursor: number; mine: [number, number]; cursorAt?: number; showMoon?: number}> = ({t, burned, cursor, mine, showMoon = 0}) => {
	const cell = (n: number) => {
		const row = n <= 15 ? 0 : 1;
		const col = (n - 1) % 15;
		return {x: 150 + col * 108, y: 360 + row * 190};
	};
	return (
		<g>
			{Array.from({length: 30}).map((_, i) => {
				const n = i + 1;
				const p = cell(n);
				const dead = burned.includes(n);
				const mineOn = n >= mine[0] && n <= mine[1];
				return (
					<g key={n}>
						<rect x={p.x} y={p.y} width={100} height={130} rx={18} fill={dead ? '#2a1c1c' : mineOn ? '#fff6dc' : '#242a64'} stroke={dead ? '#ff6a3a' : mineOn ? '#ffd34a' : '#4a52a0'} strokeWidth={dead ? 6 : 5} />
						<text x={p.x + 50} y={p.y + 90} textAnchor="middle" fontSize={60} fontFamily={FONT} fontWeight={900} fill={dead ? '#ff9a6a' : mineOn ? '#10132a' : '#8a92d8'}>
							{n}
						</text>
						{dead ? <path d={`M${p.x + 14},${p.y + 20} L${p.x + 86},${p.y + 112} M${p.x + 86},${p.y + 20} L${p.x + 14},${p.y + 112}`} stroke="#ff6a3a" strokeWidth={8} strokeLinecap="round" /> : null}
					</g>
				);
			})}
			{cursor > 0 ? (() => {
				const p = cell(cursor);
				return (
					<g transform={cursor > 15 ? `translate(${p.x + 50},${p.y + 154}) scale(1,-1)` : `translate(${p.x + 50},${p.y - 24})`}>
						<path d="M-18,-28 L0,0 L18,-28 Z" fill="#5fe08a" />
						<text y={cursor > 15 ? 100 : -40} transform={cursor > 15 ? 'scale(1,-1)' : undefined} textAnchor="middle" fontSize={58} fontFamily={FONT} fontWeight={900} fill="#5fe08a" stroke="#10132a" strokeWidth={8} paintOrder="stroke">
							СЕГОДНЯ
						</text>
					</g>
				);
			})() : null}
			{showMoon > 0 ? <Ico k="moon" x={cell(cursor).x + 84} y={cell(cursor).y + 20} s={0.5 * showMoon} /> : null}
		</g>
	);
};

export const Plaque: React.FC<{x: number; y: number; w: number; h: number; text: string; c?: string; size?: number; fg?: string; fill?: string}> = ({x, y, w, h, text, c = '#ffd34a', size = 64, fg = '#fff', fill = '#11142c'}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.4} fill={fill} stroke={c} strokeWidth={6} />
		<text y={size * 0.35} textAnchor="middle" fontSize={size} fontFamily={FONT} fontWeight={900} fill={fg}>
			{text}
		</text>
	</g>
);

/* подпись «схема, не измерения» — на схемах весь показ */
export const SchemeNote: React.FC = () => (
	<g>
		<rect x={440} y={850} width={1040} height={100} rx={50} fill="#11142c" stroke="#ffd34a" strokeWidth={5} />
		<text x={960} y={918} textAnchor="middle" fontSize={76} fontFamily={FONT} fontWeight={800} fill="#ffd34a">
			схема, не измерения
		</text>
	</g>
);

export const Face: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#ffe0bd'}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<circle r={80} fill={c} stroke="#10132a" strokeWidth={7} />
		<circle cx={-28} cy={-14} r={9} fill="#10132a" />
		<circle cx={28} cy={-14} r={9} fill="#10132a" />
		<path d="M-30,28 Q0,52 30,28" stroke="#10132a" strokeWidth={7} fill="none" strokeLinecap="round" />
	</g>
);
export { random };
