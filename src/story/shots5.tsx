import React from 'react';
import {interpolate} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {Chair} from '../engine/props';
import {env, gesture, idle, reach, SIT, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Caption} from '../kit/graphics';
import {Layer, Stage, Svg, camOn, clamp, ease} from '../kit/kit';
import {Bubble, Board, FONT, HAND} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {FL, HS, Jacket, Plate, Screen, camPath, hands, hip} from './common';
import {Ico, Mini, Plaque} from './places';
import {CarSide, KitchenK, kk} from './places2';
import {Wall, Ground} from './places';
import {Bunch, Mug} from './shots4';
import {Steam, Words} from './shots2';

/* ===== Parts 10–11 (lines 159–187). Plate = 0 all the way. Plates ≥ 60 px from the edge. ===== */
const k = kk;
const Sepia: React.FC = () => (
	<Screen>
		<rect x={0} y={0} width={1920} height={1080} fill="#9a6a2a" opacity={0.26} />
		<rect x={40} y={40} width={1840} height={1000} rx={30} fill="none" stroke="#ffd34a" strokeWidth={8} opacity={0.7} />
		<Plaque x={1560} y={150} w={520} h={110} text="ВСПОМИНАЕШЬ" size={56} c="#ffd34a" />
	</Screen>
);
const CUPS: [number, string][] = [[860, '#f2b21c'], [1060, '#3a6fd2'], [1260, '#3a6fd2']];
const TableK: React.FC<{f: number; steam?: number}> = ({f, steam = 1}) => (
	<Svg>
		<ellipse cx={960} cy={720} rx={430} ry={46} fill="#8a7aa0" />
		<rect x={700} y={740} width={20} height={190} fill="#4a3d5a" />
		<rect x={1200} y={740} width={20} height={190} fill="#4a3d5a" />
		{CUPS.map(([cx, c], i) => (
			<Mug key={cx} x={cx} y={690} c={c} steam={steam} f={f + i * 13} />
		))}
	</Svg>
);
const Kitch: React.FC<{f: number; children?: React.ReactNode; cam: ReturnType<typeof camOn>; table?: boolean}> = ({f, children, cam, table = true}) => (
	<Stage cam={cam} bg="#14152e" light={{x: 20, y: 10, o: 0.45}}>
		<Layer depth={1.6}>
			<KitchenK night />
			<Svg>
				<Steam x={206} y={556} f={f} />
				<Bunch x={1000} y={410} n={5} s={0.55} />
				<Mug x={470} y={640} c="#e86aa0" />
				<Mug x={540} y={640} c="#3a6fd2" />
			</Svg>
		</Layer>
		{table ? (
			<Layer depth={1.25}>
				<TableK f={f} />
			</Layer>
		) : null}
		<Layer depth={1}>
			<Svg>{children}</Svg>
		</Layer>
	</Stage>
);
const Hero: React.FC<{x: number; facing?: 1 | -1; pose?: Pose; look?: [number, number]; seat?: boolean; s?: number}> = ({x, facing = 1, pose, look = [0.8, 0.1], seat}) => {
	const {gf} = useShot();
	const p = pose ?? idle(gf, 3);
	return (
		<g>
			<Actor who="heroSuit" x={x} floor={FL} seat={seat ? 790 : undefined} s={HS} facing={facing} faceTurn={0.4} look={look} pose={p} uid="hx" />
			<Jacket p={p} x={x} facing={facing} seat={seat ? 790 : undefined} />
			<Plate x={x} yy={400} s={1.9} />
		</g>
	);
};
const Facade: React.FC<{lit?: boolean; figures?: boolean; f?: number}> = ({lit = true, figures, f = 0}) => (
	<Svg>
		<Wall id="fc-w" top="#080b22" bot="#1b2250" />
		<circle cx={1620} cy={170} r={50} fill="#eef1ff" opacity={0.9} />
		<rect x={260} y={90} width={1400} height={820} fill="#202a5a" stroke="#10132a" strokeWidth={6} />
		{Array.from({length: 4}).map((_, r) =>
			Array.from({length: 6}).map((__, c) => {
				const x = 330 + c * 230;
				const y = 140 + r * 190;
				const kit = r === 1 && c === 2;
				return <rect key={`${r}${c}`} x={x} y={y} width={150} height={130} rx={6} fill={kit && lit ? '#ffd98a' : '#0d1233'} stroke="#3a4180" strokeWidth={5} />;
			}),
		)}
		{lit ? <rect x={790} y={330} width={150} height={130} rx={6} fill="#ffe3a0" opacity={0.2 + 0.05 * Math.sin(f / 8)} style={{filter: 'blur(14px)'}} /> : null}
		{figures
			? [0, 1, 2, 3].map((i) => (
					<g key={i} transform={`translate(${815 + i * 0},${470})`}>
						{null}
					</g>
				))
			: null}
		<Ground y={900} c="#10142c" />
	</Svg>
);

/* ---- 159 · 21:40, чайник, три чашки, табличка 0 — как в начале ---- */
const X1: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(1150, 560, 1.2)], [90, camOn(1250, 560, 1.15)], [160, camOn(1400, 570, 1.1)]]);
	return (
		<>
			<Kitch f={f} cam={cam}>
				<rect x={1790} y={300} width={200} height={600} rx={8} fill="#8a6a44" stroke="#10132a" strokeWidth={6} />
				<Hero x={1060} look={[0.9, 0]} />
			</Kitch>
			<Screen>
				<Plaque x={300} y={930} w={400} h={150} text="21:40" size={110} c="#ff9a6a" />
			</Screen>
		</>
	);
};

/* ---- 160–161 · стук; на пороге брат с папкой и рюкзаком ---- */
const X2: React.FC = () => {
	const {f, gf, at} = useShot();
	const a161 = at('161');
	const w = walkTo(f, a161 + 14, a161 + 60, 2250, 1560, 5, 0.3);
	const toTable = walkTo(f, a161 + 80, a161 + 118, 1560, 1260, 5, 0.3);
	const x = f < a161 + 80 ? w.x : toTable.x;
	const pose = f < a161 + 80 ? w.pose : toTable.pose;
	const cam = camPath(f, [[0, camOn(1150, 570, 1.12)], [a161, camOn(1250, 570, 1.05)], [a161 + 100, camOn(1180, 570, 1.08)]]);
	return (
		<>
			<Kitch f={f} cam={cam}>
				<rect x={1790} y={300} width={200} height={600} rx={8} fill="#8a6a44" stroke="#10132a" strokeWidth={6} />
				<Hero x={1000} look={[0.9, 0]} pose={f < a161 ? {...idle(gf, 3), head: 0} : idle(gf, 3)} />
				<Actor who="bro" x={x} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.1]} pose={pose} vx={f < a161 + 80 ? w.vx : toTable.vx} bob={f < a161 + 80 ? w.bob : toTable.bob} uid="b110" />
				<rect x={x + 6} y={hip(1) - 100} width={64} height={78} rx={6} fill="#3a4256" stroke="#10132a" strokeWidth={4} />
				<rect x={x - 70} y={hip(1) - 70} width={60} height={44} rx={4} fill="#e8e0c8" stroke="#10132a" strokeWidth={4} />
			</Kitch>
			<Screen>
				<Onoma x={1500} y={330} text="ТУК-ТУК" t={f - 4} c="#ffd36a" size={96} />
				<Onoma x={1500} y={330} text="ТУК-ТУК" t={f - 40} c="#ffd36a" size={96} />
				{f > a161 + 90 ? (
					<Bubble x={1060} y={190} w={1240} h={200} t={f - (a161 + 90)} tail={[300, 140]}>
						<text y={-6} textAnchor="middle" fontSize={60} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Документы забрал. Ужин на проводы
						</text>
						<text y={64} textAnchor="middle" fontSize={60} fontFamily={FONT} fontWeight={800} fill="#10132a">
							отменили, а я голодный.
						</text>
					</Bubble>
				) : null}
			</Screen>
		</>
	);
};

/* ---- 162–163 · Тёма: «Я всё снял. Ты не бубнил.» ---- */
const X3: React.FC = () => {
	const {f, gf, at} = useShot();
	const a163 = at('163');
	const w = walkTo(f, 20, 80, 2250, 1560, 6, 0.3);
	const show = env(f, a163 + 6, a163 + 80, 8, 12);
	const tp = reach(w.pose, 'F', [50, -70], show);
	const card = k(f, 40, 56);
	const cam = camPath(f, [[0, camOn(1250, 570, 1.02)], [a163, camOn(1200, 560, 1.06)], [a163 + 80, camOn(1120, 560, 1.1)]]);
	return (
		<>
			<Kitch f={f} cam={cam}>
				<rect x={1790} y={300} width={200} height={600} rx={8} fill="#8a6a44" stroke="#10132a" strokeWidth={6} />
				<Hero x={900} look={[0.9, 0]} />
				<Actor who="bro" x={1260} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.1]} pose={idle(gf, 5)} uid="b111" />
				<Actor who="tema" x={w.x} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.1]} pose={tp} vx={w.vx} bob={w.bob} uid="t111" />
			</Kitch>
			<Screen>
				{f < 50 && f > 0 ? (
					<Bubble x={1060} y={190} w={1240} h={200} t={f + 60} tail={[300, 140]}>
						<text y={-6} textAnchor="middle" fontSize={60} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Документы забрал. Ужин на проводы
						</text>
						<text y={64} textAnchor="middle" fontSize={60} fontFamily={FONT} fontWeight={800} fill="#10132a">
							отменили, а я голодный.
						</text>
					</Bubble>
				) : null}
				<g opacity={card} transform="translate(1600,300)">
					<rect x={-230} y={-190} width={460} height={380} rx={30} fill="#0b0d1e" stroke="#6f7bd8" strokeWidth={8} />
					<rect x={-190} y={-150} width={380} height={190} rx={10} fill="#2a1a3a" />
					<path d="M-190,-150 Q-150,-60 -190,40 L-130,40 Q-110,-60 -130,-150 Z" fill="#c9342a" />
					<path d="M190,-150 Q150,-60 190,40 L130,40 Q110,-60 130,-150 Z" fill="#c9342a" />
					<circle cx={0} cy={-60} r={30} fill="#ffe0bd" stroke="#10132a" strokeWidth={4} />
					<rect x={-26} y={-30} width={52} height={64} rx={14} fill="#f2b21c" stroke="#10132a" strokeWidth={4} />
					{Array.from({length: 7}).map((_, i) => (
						<circle key={i} cx={-150 + i * 50} cy={90 + (i % 2) * 14 - Math.abs(Math.sin(f / 5 + i)) * 10} r={22} fill="#1b2150" />
					))}
					<Plaque x={0} y={150} w={360} h={70} text="ЗАЛ СМЕЁТСЯ" size={44} c="#5fe08a" />
				</g>
			</Screen>
		</>
	);
};

/* ---- 164 · двор: окно светится, Тёма задирает голову ---- */
const X4: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(960, 760, 1.2)], [50, camOn(960, 700, 1.15)], [100, camOn(900, 420, 1.15)]]);
	return (
		<Stage cam={cam} bg="#080b22" light={{x: 20, y: 10, o: 0.2}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={900} floor={FL} s={1.1} facing={1} faceTurn={0.3} look={[0.3, -1]} pose={{...idle(gf, 4), head: -22}} uid="t112" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 165 · лестница: дед держится за перила, часы 21:41 ---- */
const X5: React.FC = () => {
	const {f, gf} = useShot();
	const u = k(f, 0, 80);
	const gx = interpolate(u, [0, 1], [640, 1080]);
	const gy = interpolate(u, [0, 1], [900, 740]);
	const cam = camPath(f, [[0, camOn(800, 640, 1.1)], [80, camOn(1000, 600, 1.25)]]);
	return (
		<>
			<Stage cam={cam} bg="#2a2038" light={{x: 20, y: 10, o: 0.3}}>
				<Layer depth={1.6}>
					<Svg>
						<Wall id="st-w" top="#3a3350" bot="#2a2540" />
						<rect x={1300} y={200} width={300} height={560} rx={8} fill="#8a6a44" stroke="#10132a" strokeWidth={6} />
						{Array.from({length: 9}).map((_, i) => (
							<rect key={i} x={300 + i * 130} y={900 - i * 30} width={140} height={30 + i * 30} fill={i % 2 ? '#5a5478' : '#6a6490'} stroke="#10132a" strokeWidth={3} />
						))}
						<path d="M300,760 L1480,380" stroke="#c9cfdd" strokeWidth={10} strokeLinecap="round" />
						{Array.from({length: 9}).map((_, i) => (
							<line key={i} x1={330 + i * 130} y1={760 - i * 42} x2={330 + i * 130} y2={880 - i * 30} stroke="#c9cfdd" strokeWidth={6} />
						))}
					</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="grandpa" x={gx} floor={gy} s={1} facing={1} faceTurn={0.4} look={[0.8, -0.3]} pose={reach(idle(gf, 4), 'F', [40, -90], 0.8)} uid="g113" />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={1500} y={150} w={440} h={150} text="21:41" size={110} c="#ffd34a" />
			</Screen>
		</>
	);
};

/* ---- 166–167 · дед входит, часы 21:41, садится, ставит шахматы ---- */
const X6: React.FC = () => {
	const {f, gf, at} = useShot();
	const a167 = at('167');
	const w = walkTo(f, 4, 56, 2250, 1560, 6, 0.3);
	const sit = f >= a167 + 40;
	const wave = env(f, 70, 120, 6, 10);
	const gp = gesture('wave', w.pose, wave, f);
	const board = k(f, a167 + 60, a167 + 80);
	const cam = camPath(f, [[0, camOn(1100, 580, 1.0)], [a167, camOn(1050, 580, 1.0)], [a167 + 140, camOn(1000, 590, 1.08)]]);
	return (
		<>
			<Kitch f={f} cam={cam}>
				<rect x={1790} y={300} width={200} height={600} rx={8} fill="#8a6a44" stroke="#10132a" strokeWidth={6} />
				<Hero x={640} look={[0.9, 0]} />
				<Actor who="bro" x={860} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.8, 0.1]} pose={idle(gf, 5)} uid="b114" />
				<Actor who="tema" x={1180} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.1]} pose={idle(gf, 6)} uid="t114" />
				{sit ? (
					<>
						<rect x={1470} y={790} width={90} height={14} fill="#c99a62" />
						<rect x={1480} y={804} width={10} height={96} fill="#2c2f38" />
						<rect x={1540} y={804} width={10} height={96} fill="#2c2f38" />
						<Actor who="grandpa" x={1520} floor={FL} seat={790} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} pose={SIT} uid="g114b" />
					</>
				) : (
					<Actor who="grandpa" x={w.x} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.9, -0.3]} pose={gp} vx={w.vx} bob={w.bob} uid="g114" />
				)}
				<g opacity={board} transform="translate(1110,712)">
					<rect x={-80} y={-14} width={160} height={14} fill="#5a3a22" />
					{Array.from({length: 4}).map((_, r) => Array.from({length: 4}).map((__, c) => <rect key={`${r}${c}`} x={-72 + c * 36} y={-14 - (4 - r) * 0 - 0} width={36} height={3} fill={(r + c) % 2 ? '#5a3a22' : '#f0e0bc'} />))}
					{[-40, 0, 40].map((cx) => (
						<circle key={cx} cx={cx} cy={-26} r={10} fill="#f0e0bc" stroke="#10132a" strokeWidth={3} />
					))}
				</g>
			</Kitch>
			<Screen>
				<Plaque x={400} y={170} w={440} h={150} text="21:41" size={110} c="#ffd34a" />
			</Screen>
		</>
	);
};

const Dial: React.FC<{x: number; y: number; r: number; h: number; m: number; c?: string; glow?: boolean}> = ({x, y, r, h, m, c = '#ffd34a', glow}) => (
	<g transform={`translate(${x},${y})`}>
		{glow ? <circle r={r + 40} fill="#ffb347" opacity={0.35} style={{filter: 'blur(18px)'}} /> : null}
		<circle r={r} fill="#11142c" stroke={c} strokeWidth={Math.max(6, r / 9)} />
		{Array.from({length: 12}).map((_, i) => (
			<line key={i} x1={0} y1={-r * 0.86} x2={0} y2={-r * (i % 3 ? 0.78 : 0.7)} stroke="#8a92d8" strokeWidth={Math.max(3, r / 22)} transform={`rotate(${i * 30})`} />
		))}
		<line x1={0} y1={0} x2={Math.sin((((h % 12) + m / 60) * Math.PI) / 6) * r * 0.58} y2={-Math.cos((((h % 12) + m / 60) * Math.PI) / 6) * r * 0.58} stroke="#fff" strokeWidth={Math.max(8, r / 5)} strokeLinecap="round" />
		<line x1={0} y1={0} x2={Math.sin((m * Math.PI) / 30) * r * 0.86} y2={-Math.cos((m * Math.PI) / 30) * r * 0.86} stroke={c} strokeWidth={Math.max(6, r / 7)} strokeLinecap="round" />
		<circle r={Math.max(7, r / 8)} fill={c} />
	</g>
);

/* ---- 168 · двадцать лет в 21:30 — и двадцать первый отдельно: 21:41 ---- */
const X7: React.FC = () => {
	const {f} = useShot();
	const shown = Math.min(20, Math.floor(f / 2));
	const dim = k(f, 92, 104);
	const big = k(f, 96, 110);
	const m = f < 110 ? 30 : interpolate(f, [110, 134], [30, 41], clamp);
	return (
		<Board tint="#141a48">
			<g opacity={k(f, 2, 14) * (1 - dim)}>
				<Plaque x={960} y={150} w={960} h={120} text="20 ЛЕТ ПОДРЯД: 21:30" size={72} c="#ffd34a" />
			</g>
			<g opacity={1 - 0.8 * dim}>
				{Array.from({length: 20}).map((_, i) => {
					const row = Math.floor(i / 10);
					const col = i % 10;
					return i < shown ? (
						<g key={i}>
							<Dial x={205 + col * 170} y={330 + row * 230} r={76} h={21} m={30} />
							<text x={205 + col * 170} y={330 + row * 230 + 128} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={800} fill="#fff">
								{i + 1}
							</text>
						</g>
					) : null;
				})}
			</g>
			<g opacity={big}>
				<rect x={0} y={0} width={1920} height={1080} fill="#141a48" opacity={0.0} />
				<Plaque x={960} y={140} w={760} h={120} text="21-Й ГОД" size={80} c="#ffb347" />
				<Dial x={960} y={520} r={230} h={21} m={m} c="#ffb347" glow />
				<Plaque x={960} y={880} w={520} h={140} text="21:41" size={120} c="#ffb347" />
			</g>
		</Board>
	);
};

/* ---- 169 · три гостя, три чашки: три руки берут чашки ---- */
const X8: React.FC = () => {
	const {f} = useShot();
	const take = (a: number) => k(f, a, a + 22);
	const arm = (sx: number, sy: number, cx: number, a: number, c: string, rot: number) => {
		const t = take(a);
		const hx = sx + (cx - sx) * t;
		const hy = 690 - 150 * (1 - t) - 8 * t;
		return (
			<g>
				<path d={`M${sx},${sy} L${hx},${hy}`} stroke="#10132a" strokeWidth={72} strokeLinecap="round" />
				<path d={`M${sx},${sy} L${hx},${hy}`} stroke={c} strokeWidth={60} strokeLinecap="round" />
				<g transform={`translate(${hx},${hy}) rotate(${rot})`}>
					<circle r={44} fill="#ffe0bd" stroke="#10132a" strokeWidth={6} />
					<ellipse cx={0} cy={-34} rx={14} ry={22} fill="#ffe0bd" stroke="#10132a" strokeWidth={5} />
					<ellipse cx={30} cy={-18} rx={12} ry={20} fill="#ffe0bd" stroke="#10132a" strokeWidth={5} transform="rotate(35 30 -18)" />
				</g>
			</g>
		);
	};
	const cam = camPath(f, [[0, camOn(1060, 650, 2.2)], [100, camOn(1060, 640, 2.4)]]);
	return (
		<Stage cam={cam} bg="#14152e" light={{x: 20, y: 10, o: 0.45}}>
			<Layer depth={1.6}>
				<KitchenK night />
			</Layer>
			<Layer depth={1.25}>
				<TableK f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					{arm(660, 620, 860, 14, '#2f6fd8', 70)}
					{arm(1060, 330, 1060, 40, '#d94a3a', 0)}
					{arm(1460, 620, 1260, 66, '#22a6a6', -70)}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 170–171 · «Я просто включил свет.»; Тёма идёт к холодильнику ---- */
const X9: React.FC = () => {
	const {f, gf, at} = useShot();
	const a171 = at('171');
	const w = walkTo(f, a171 + 6, a171 + 70, 1180, 1530, 6, 0.3);
	const look = k(f, 8, 30);
	const cam = camPath(f, [[0, camOn(980, 580, 1.0)], [a171, camOn(1050, 580, 1.02)], [a171 + 70, camOn(1150, 580, 1.06)]]);
	return (
		<>
			<Kitch f={f} cam={cam}>
				<rect x={1388} y={520} width={24} height={64} rx={6} fill="#e8e4d8" stroke="#10132a" strokeWidth={4} />
				<Hero x={760} facing={look > 0.5 ? 1 : 1} look={look > 0.5 ? [0.9, -0.2] : [0.5, 0.3]} />
				<Actor who="bro" x={1000} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.1]} pose={idle(gf, 5)} uid="b115" />
				<Actor who="tema" x={f < a171 + 6 ? 1180 : w.x} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={f < a171 + 6 ? idle(gf, 6) : w.pose} vx={w.vx} bob={w.bob} uid="t115" />
				<Actor who="grandpa" x={1560} floor={FL} seat={790} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} pose={SIT} uid="g115" />
			</Kitch>
			<Screen>
				<Plaque x={400} y={170} w={440} h={150} text="21:41" size={110} c="#ffd34a" />
			</Screen>
		</>
	);
};

const SheetRules: React.FC<{strike: number; written: number; marker?: boolean}> = ({strike, written}) => (
	<g>
		<rect x={220} y={110} width={1480} height={820} rx={18} fill="#fbf8ef" stroke="#10132a" strokeWidth={8} transform="rotate(-0.5 960 520)" />
		<text x={960} y={200} textAnchor="middle" fontSize={96} fontFamily={HAND} fontWeight={700} fill="#c9342a">
			ПРАВИЛА
		</text>
		{['1. УЛУЧШЕНИЕ = 1 ВЕЧЕР', '2. ВЕЧЕР ВЫБИРАЕШЬ ТЫ', '3. ЗАНЯТО — ВСТРЕЧИ НЕТ', '4. ВМЕСТЕ — ОДИН ВЕЧЕР НА ДВОИХ'].map((t, i) => (
			<text key={i} x={290} y={300 + i * 85} fontSize={74} fontFamily={HAND} fontWeight={700} fill={i === 3 ? '#1f9a4a' : '#10132a'}>
				{t}
			</text>
		))}
		<path d={`M270,${470 - 22} L${270 + 1180 * strike},${470 - 28}`} stroke="#2a5ad8" strokeWidth={20} strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
		<g opacity={written}>
			<text x={290} y={720} fontSize={104} fontFamily={HAND} fontWeight={700} fill="#2a5ad8">
				План — вместе.
			</text>
			<text x={290} y={840} fontSize={104} fontFamily={HAND} fontWeight={700} fill="#2a5ad8">
				Приход — без звонка.
			</text>
		</g>
	</g>
);

/* ---- 172–174 · Тёма зачёркивает пункт 3 и пишет новое ---- */
const X10: React.FC = () => {
	const {f, at} = useShot();
	const a173 = at('173');
	const a174 = at('174');
	const strike = k(f, a173 + 6, a173 + 40);
	const wr = k(f, a174 + 10, a174 + 90);
	return (
		<Board tint="#243060">
			<SheetRules strike={strike} written={wr} />
			<g transform={`translate(${1500 + 40 * Math.sin(f / 10)},${strike > 0 && strike < 1 ? 520 : 760})`} opacity={0.0}>
				<rect width={1} height={1} />
			</g>
		</Board>
	);
};

/* ---- 175 · камера скользит по башне из кубиков и чашкам сестры ---- */
const X11: React.FC = () => {
	const {f} = useShot();
	const cam = camPath(f, [[0, camOn(1000, 330, 1.7, {farBlur: 1})], [105, camOn(520, 620, 1.7, {farBlur: 1})]]);
	return (
		<>
		<Stage cam={cam} bg="#14152e" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<KitchenK night />
				<Svg>
					<Bunch x={1000} y={410} n={5} s={0.55} />
					<Mug x={470} y={640} c="#e86aa0" />
					<Mug x={540} y={640} c="#3a6fd2" />
					<g opacity={k(f, 8, 22)}>
						<Mini x={1130} y={340} c="#4aa8d8" hair="#5a3a22" s={0.9} />
					</g>
					<g opacity={k(f, 60, 80)}>
						<Mini x={640} y={570} c="#e86aa0" hair="#5a3a22" s={0.9} />
					</g>
				</Svg>
			</Layer>
		</Stage>
		<Sepia />
		</>
	);
};

const SilFigs: React.FC = () => (
	<g>
		{[-1, 0, 1, 2].map((i) => (
			<g key={i} transform={`translate(${830 + i * 56},470)`}>
				<circle cy={-14} r={22} fill="#1a1020" />
				<rect x={-26} y={8} width={52} height={70} rx={16} fill="#1a1020" />
			</g>
		))}
	</g>
);
/* ---- 176 · окно кухни светится, видны четыре силуэта ---- */
const X12: React.FC = () => {
	const {f} = useShot();
	const cam = camPath(f, [[0, camOn(960, 480, 1.2)], [110, camOn(880, 440, 2.0)]]);
	return (
		<Stage cam={cam} bg="#080b22" light={false}>
			<Layer depth={1.6}>
				<Facade f={f} />
				<Svg>
					<SilFigs />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 177–178 · брат допивает чай; «Поезд в 23:50. Костюм оставь себе.» ---- */
const Y1: React.FC = () => {
	const {f, gf} = useShot();
	const drink = env(f, 6, 40, 8, 10);
	const stand = k(f, 44, 60);
	const bp = reach(idle(gf, 5), 'F', [26, -128], drink);
	const cam = camPath(f, [[0, camOn(1100, 590, 1.2)], [100, camOn(1000, 580, 1.15)]]);
	return (
		<>
			<Kitch f={f} cam={cam}>
				<Hero x={640} look={[0.9, 0]} />
				<Actor who="bro" x={1160} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.3]} pose={{...bp, lean: bp.lean - 4 * stand}} uid="b120" />
				<Actor who="tema" x={1400} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={idle(gf, 6)} uid="t120" />
				<Actor who="grandpa" x={1600} floor={FL} seat={790} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} pose={SIT} uid="g120" />
			</Kitch>
			<Screen>
				{f > 50 ? (
					<Bubble x={1130} y={200} w={1160} h={200} t={f - 50} tail={[260, 140]}>
						<text y={-6} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Поезд в 23:50.
						</text>
						<text y={70} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Костюм оставь себе.
						</text>
					</Bubble>
				) : null}
			</Screen>
		</>
	);
};
const Y2: React.FC = () => {
	const {f, gf} = useShot();
	const u = k(f, 8, 24);
	const cam = camPath(f, [[0, camOn(1000, 580, 1.15)], [60, camOn(960, 570, 1.3)]]);
	return (
		<>
			<Kitch f={f} cam={cam}>
				<Hero x={700} look={[0.9, -0.1]} />
				<Actor who="bro" x={1100} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.1]} pose={reach(idle(gf, 5), 'F', [50, -70], u)} uid="b121" />
			</Kitch>
			<Screen>
				{f < 40 ? (
					<Bubble x={1130} y={200} w={1160} h={200} t={f + 30} tail={[260, 140]}>
						<text y={-6} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Поезд в 23:50.
						</text>
						<text y={70} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Костюм оставь себе.
						</text>
					</Bubble>
				) : null}
				<g opacity={u} transform="translate(1470,560)">
					<rect x={-250} y={-290} width={500} height={580} rx={56} fill="#07080f" stroke="#6f7bd8" strokeWidth={8} />
					<text y={-150} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
						ПОЕЗД
					</text>
					<Plaque x={0} y={40} w={440} h={170} text="23:50" size={130} c="#ffd34a" />
				</g>
			</Screen>
		</>
	);
};
/* ---- 179 · брат поправляет воротник; рукава всё ещё длинноваты ---- */
const Y3: React.FC = () => {
	const {f, gf} = useShot();
	const adj = env(f, 14, 90, 10, 14);
	const p = idle(gf, 3);
	const bp = reach(idle(gf, 5), 'F', toLocal(800, hip(HS) - 250, 960, hip(1), 1, -1), adj);
	const cam = camPath(f, [[0, camOn(900, 570, 1.3)], [110, camOn(880, 540, 1.7)]]);
	return (
		<Kitch f={f} cam={cam}>
			<Hero x={780} look={[0.9, 0.1]} pose={p} />
			<Actor who="bro" x={960} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} pose={bp} uid="b122" />
		</Kitch>
	);
};
const Taxi: React.FC = () => (
	<g>
		<CarSide x={1160} y={600} />
		<rect x={1420} y={560} width={150} height={40} rx={8} fill="#ffd34a" stroke="#10132a" strokeWidth={5} />
		<text x={1495} y={592} textAnchor="middle" fontSize={32} fontFamily={FONT} fontWeight={900} fill="#10132a">
			ТАКСИ
		</text>
	</g>
);
/* ---- 180 · такси у подъезда: брат уезжает, все машут ---- */
const Y4: React.FC = () => {
	const {f, gf} = useShot();
	const w = walkTo(f, 20, 90, 860, 1280, 5, 0.3);
	const inCar = f > 96;
	const wave = env(f, 100, 150, 8, 10);
	const cam = camPath(f, [[0, camOn(900, 580, 1.05)], [80, camOn(1050, 580, 1.2)], [150, camOn(1100, 570, 1.25)]]);
	return (
		<Stage cam={cam} bg="#0d1230" light={{x: 20, y: 10, o: 0.25}}>
			<Layer depth={1.6}>
				<Svg>
					<Wall id="ty-w" top="#0d1230" bot="#26305e" />
					<rect x={-100} y={140} width={560} height={760} fill="#1a2250" />
					<rect x={160} y={560} width={150} height={340} fill="#4a3a2a" stroke="#10132a" strokeWidth={5} />
					<circle cx={1700} cy={150} r={46} fill="#eef1ff" />
					<Ground y={900} c="#2a3150" />
				</Svg>
			</Layer>
			<Layer depth={1.2}>
				<Svg>
					<Taxi />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroSuit" x={540} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={gesture('wave', idle(gf, 3), wave, f)} uid="h130" />
					<Jacket p={gesture('wave', idle(gf, 3), wave, f)} x={540} facing={1} />
					<Actor who="tema" x={700} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={gesture('wave', idle(gf, 4), wave, f)} uid="t130" />
					<Actor who="grandpa" x={880} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={gesture('wave', idle(gf, 5), wave, f)} uid="g130" />
					{!inCar ? <Actor who="bro" x={w.x} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={w.pose} vx={w.vx} bob={w.bob} uid="b130" /> : null}
					{inCar ? (
						<g transform="translate(1560,640)">
							<circle r={40} fill="#ffe0bd" stroke="#10132a" strokeWidth={5} />
							<path d="M-40,-8 Q0,-60 40,-8 L40,-14 Q0,-50 -40,-14 Z" fill="#5a3a22" stroke="#10132a" strokeWidth={4} />
							<circle cx={-14} cy={0} r={6} fill="#10132a" />
							<circle cx={14} cy={0} r={6} fill="#10132a" />
						</g>
					) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};
/* ---- 181 · дед уходит последним: Тёма берёт его под руку ---- */
const Y5: React.FC = () => {
	const {f, gf} = useShot();
	const arm = k(f, 20, 60);
	const cam = camPath(f, [[0, camOn(800, 580, 1.1)], [120, camOn(860, 570, 1.35)]]);
	return (
		<Stage cam={cam} bg="#0d1230" light={{x: 20, y: 10, o: 0.25}}>
			<Layer depth={1.6}>
				<Svg>
					<Wall id="en-w2" top="#0d1230" bot="#26305e" />
					<rect x={380} y={200} width={540} height={700} fill="#1a2250" />
					<rect x={560} y={480} width={180} height={420} fill="#4a3a2a" stroke="#10132a" strokeWidth={5} />
					<rect x={540} y={160} width={220} height={40} rx={8} fill="#ffe3a0" />
					<path d="M540,200 L420,900 L880,900 L760,200 Z" fill="#ffe3a0" opacity={0.15} />
					<Ground y={900} c="#2a3150" />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="grandpa" x={840} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={gesture('wave', idle(gf, 4), env(f, 80, 140, 8, 10), f)} uid="g131" />
					<Actor who="tema" x={1040} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={reach(idle(gf, 5), 'F', toLocal(900, 640, 1040, hip(1), 1, -1), arm)} uid="t131" />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* ---- 182–184 · календарь следующего месяца: пустые клетки, палец, кони по четвергам ---- */
const Y6: React.FC = () => {
	const {f, at} = useShot();
	const a183 = at('183');
	const a184 = at('184');
	const finger = k(f, a183 + 10, a183 + 30);
	const fx = 960 + Math.sin((f - a183) / 16) * 60;
	return (
		<Board tint="#141a48">
			<Plaque x={960} y={150} w={820} h={120} text="СЛЕДУЮЩИЙ МЕСЯЦ" size={72} c="#ffd34a" />
			<PhoneGrid f={f} a184={a184} />
			<g opacity={finger * (f < a184 ? 1 : 0.3)} transform={`translate(${fx},${520 + 14 * Math.sin(f / 7)})`}>
				<circle r={70} fill="#fff" opacity={0.35} />
				<circle r={28} fill="#fff" />
			</g>
		</Board>
	);
};
/* the month has 30 days and began on Monday, so the next one starts on Wednesday: 1 = ср, Thursdays are 2, 9, 16, 23, 30 */
const PhoneGrid: React.FC<{f: number; a184: number}> = ({f, a184}) => (
	<g>
		<rect x={200} y={250} width={1520} height={660} rx={40} fill="#0f1230" stroke="#6f7bd8" strokeWidth={8} />
		{['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map((d, i) => (
			<text key={d} x={290 + i * 190} y={320} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={900} fill={i === 3 ? '#ffd34a' : '#8a92d8'}>
				{d}
			</text>
		))}
		{Array.from({length: 35}).map((_, i) => {
			const r = Math.floor(i / 7);
			const c = i % 7;
			const n = i - 1; // day number: i = 2 (Wednesday of the first row) is day 1
			if (n < 1 || n > 30) return <rect key={i} x={215 + c * 190} y={345 + r * 112} width={150} height={96} rx={18} fill="#12163a" stroke="#242a64" strokeWidth={3} />;
			const th = c === 3;
			const on = th && f > a184 + 10 + r * 14;
			return (
				<g key={i}>
					<rect x={215 + c * 190} y={345 + r * 112} width={150} height={96} rx={18} fill={on ? '#fff6dc' : '#1c2150'} stroke={on ? '#ffd34a' : '#3a4180'} strokeWidth={4} />
					<text x={226 + c * 190} y={on ? 384 + r * 112 : 404 + r * 112} fontSize={on ? 40 : 58} fontFamily={FONT} fontWeight={900} fill={on ? '#10132a' : '#7a84c8'}>
						{n}
					</text>
					{on ? <Ico k="knight" x={290 + c * 190} y={398 + r * 112} s={0.98} /> : null}
				</g>
			);
		})}
	</g>
);
/* ---- 185 · «Свет в окне видят все»: всё тёмное, кроме кухни ---- */
const Y7: React.FC = () => {
	const {f} = useShot();
	const cam = camPath(f, [[0, camOn(960, 520, 1.0)], [110, camOn(870, 450, 1.5)]]);
	return (
		<Stage cam={cam} bg="#080b22" light={false}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
		</Stage>
	);
};
/* ---- 186 · гасишь свет; три чашки в лунном свете ---- */
const Y8: React.FC = () => {
	const {f, gf} = useShot();
	const dark = f < 40 ? 0 : interpolate(f, [40, 52], [0, 0.8], clamp);
	const cam = camPath(f, [[0, camOn(1100, 570, 1.1)], [110, camOn(1060, 640, 1.5)]]);
	return (
		<Stage cam={cam} bg="#14152e" light={{x: 20, y: 10, o: 0.35 * (1 - dark)}}>
			<Layer depth={1.6}>
				<KitchenK night />
				<Svg>
					<Bunch x={1000} y={410} n={5} s={0.55} />
					<Mug x={470} y={640} c="#e86aa0" />
					<Mug x={540} y={640} c="#3a6fd2" />
				</Svg>
			</Layer>
			<Layer depth={1.25}>
				<TableK f={f} steam={1 - dark} />
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<rect x={1388} y={520} width={24} height={64} rx={6} fill="#e8e4d8" stroke="#10132a" strokeWidth={4} />
					<Onoma x={1420} y={500} text="ЩЕЛК" t={f - 40} c="#fff3b0" size={60} />
					<rect x={-700} y={-400} width={3300} height={1500} fill="#02030f" opacity={dark} />
					<path d="M820,150 L1180,150 L1320,740 L700,740 Z" fill="#cfe0ff" opacity={0.12 * dark} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					{f < 46 ? <Hero x={1380} facing={-1} look={[-0.9, 0]} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};
/* ---- 187 · вопрос зрителю; под ним три чашки ---- */
const Y9: React.FC = () => {
	const {f} = useShot();
	const flick = 0.1 + 0.07 * Math.sin(f / 5) + 0.05 * Math.sin(f / 2.3) + (Math.floor(f / 23) % 5 === 0 ? 0.08 : 0);
	const cam = camPath(f, [[0, camOn(1060, 640, 1.2)], [120, camOn(1050, 620, 1.55)], [260, camOn(1050, 600, 1.95)]]);
	return (
		<>
			<Stage cam={cam} bg="#0a0d24" light={false}>
				<Layer depth={1.6}>
					<KitchenK night />
					<Svg>
						<rect x={-700} y={-400} width={3300} height={1500} fill="#02030f" opacity={0.78} />
						<path d="M820,150 L1180,150 L1320,740 L700,740 Z" fill="#cfe0ff" opacity={flick} />
						<rect x={830} y={170} width={340} height={230} fill="#dbe8ff" opacity={flick * 0.9} style={{filter: 'blur(10px)'}} />
					</Svg>
				</Layer>
				<Layer depth={1.25}>
					<TableK f={f} steam={0} />
				</Layer>
			</Stage>
			<Caption f={f} from={6} to={100000} top={90} lines={['К КОМУ ТЫ ЗАЙДЁШЬ', 'СЕГОДНЯ БЕЗ ЗВОНКА?']} size={104} />
		</>
	);
};

export const SHOTS5: ShotDef[] = [
	{at: '159', C: X1, whip: true},
	{at: '160', C: X2},
	{at: '162', C: X3},
	{at: '164', C: X4, whip: true},
	{at: '165', C: X5, whip: true},
	{at: '166', C: X6, whip: true},
	{at: '168', C: X7, whip: true},
	{at: '169', C: X8, whip: true},
	{at: '170', C: X9, whip: true},
	{at: '172', C: X10, whip: true},
	{at: '175', C: X11, whip: true},
	{at: '176', C: X12, whip: true},
	{at: '177', C: Y1, whip: true},
	{at: '178', C: Y2},
	{at: '179', C: Y3},
	{at: '180', C: Y4, whip: true},
	{at: '181', C: Y5},
	{at: '182', C: Y6, whip: true},
	{at: '185', C: Y7, whip: true},
	{at: '186', C: Y8, whip: true},
	{at: '187', C: Y9},
];
