import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {Chair} from '../engine/props';
import {blend, env, gesture, idle, reach, SIT, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Callout, Caption} from '../kit/graphics';
import {HeroBadge, Layer, Stage, Svg, camOn, clamp, ease, mixCam} from '../kit/kit';
import {Corridor, Kitchen, KitchenTable, Bedroom, Blanket, SchoolYard, Lamp} from '../kit/sets';
import {Sleeper} from '../kit/kit';
import {Bubble, Board, FONT, HAND} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {AgeBadge} from '../kit/ui';
import {FL, HS, WRAP, Jacket, Screen, camPath, hands, hip, Plate} from './common';
import {Barber, Bathroom, Face, GrandRoom, Ico, Mini, Plaque, Ribbon, SchemeNote, WeekCal} from './places';

/* ===== Parts 1–3 (lines 001–035). Mitya = hero. World 1920×1080, floor 900. Plates ≥ 60 px. ===== */
const WARM = {x: 20, y: 10, o: 0.4};
const k = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});
const slouch = (p: Pose, a = 1): Pose => ({...p, lean: p.lean + 9 * a, head: p.head + 16 * a});
const BigText: React.FC<{x: number; y: number; t: string; size?: number; c?: string; rot?: number}> = ({x, y, t, size = 84, c = '#fff', rot = 0}) => (
	<text x={x} y={y} textAnchor="middle" transform={`rotate(${rot} ${x} ${y})`} fontSize={size} fontFamily={FONT} fontWeight={900} fill={c} stroke="#10132a" strokeWidth={size / 8} paintOrder="stroke">
		{t}
	</text>
);
const Steam: React.FC<{x: number; y: number; f: number; on: number; z?: number}> = ({x, y, f, on, z = 1}) => (
	<g opacity={on}>
		{[0, 1, 2, 3, 4].map((i) => {
			const u = ((f / 38 + i / 5) % 1);
			return <circle key={i} cx={x + Math.sin(u * 6 + i) * 18 * z} cy={y - u * 190 * z} r={(16 + u * 26) * z} fill="#fff" opacity={(1 - u) * 0.75} />;
		})}
	</g>
);

/* ---- 001–002 · кухня, 21:40, табличка 0 мигает, свет, чайник, три чашки ---- */
/* a steel kettle (so the only cups on the table are the three mugs) — drawn over the kitchen's white one */
const Kettle: React.FC<{f: number; on?: number; night?: boolean}> = ({f, on = 1, night}) => (
	<g>
		<rect x={228} y={540} width={140} height={100} fill={night ? '#3d3a5c' : '#fbf3dc'} opacity={0.97} />
		<path d="M236,646 L236,606 Q236,560 296,556 Q358,560 358,606 L358,646 Z" fill="#8c96ad" stroke="#10132a" strokeWidth={5} />
		<path d="M236,612 L204,572 L218,562 L246,590 Z" fill="#8c96ad" stroke="#10132a" strokeWidth={5} />
		<path d="M252,566 Q297,505 346,566" fill="none" stroke="#10132a" strokeWidth={12} strokeLinecap="round" />
		<circle cx={296} cy={552} r={9} fill="#10132a" />
		<rect x={252} y={600} width={14} height={36} rx={6} fill="#fff" opacity={0.25} />
		<Steam x={206} y={556} f={f} on={on} />
	</g>
);
const CupSteam: React.FC<{f: number}> = ({f}) => (
	<g>
		{[860, 1060, 1260].map((cx, i) => (
			<Steam key={cx} x={cx} y={640} f={f + i * 13} on={1} z={0.55} />
		))}
	</g>
);
const S1: React.FC = () => {
	const {f, gf, at} = useShot();
	const a2 = at('002');
	const HX = 1230;
	const lightT = a2 + 22;
	const dark = f < lightT ? 0.62 : interpolate(f, [lightT, lightT + 6], [0.62, 0], clamp);
	const sw = env(f, a2 + 8, lightT + 8, 8, 8);
	const mv = walkTo(f, a2 + 36, a2 + 62, HX, 1070, 2, 0.3);
	const x = f < a2 + 36 ? HX : mv.x;
	let p: Pose = f < a2 + 36 ? idle(gf, 1) : mv.pose;
	p = reach(p, 'F', toLocal(1400, 560, HX, hip(HS), HS, 1), sw);
	const cam = camPath(f, [
		[0, camOn(1150, 520, 1.3)],
		[a2 - 10, camOn(1150, 440, 1.6)],
		[a2 + 40, camOn(1150, 600, 1.25)],
		[a2 + 100, camOn(1050, 660, 1.3)],
	]);
	return (
		<>
		<Stage cam={cam} bg="#14152e" light={{x: 20, y: 10, o: 0.3 + 0.2 * (1 - dark)}}>
			<Layer depth={1.6}>
				<><Kitchen night /><Svg><Kettle f={f} night /></Svg></>
			</Layer>
			<Layer depth={1.25}>
				<KitchenTable night mugs={3} />
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<rect x={1388} y={520} width={24} height={64} rx={6} fill="#e8e4d8" stroke="#10132a" strokeWidth={4} />
					<rect x={-700} y={-400} width={3300} height={1500} fill="#04051a" opacity={dark} />
					<CupSteam f={f} />
					<Onoma x={1420} y={500} text="ЩЕЛК" t={f - lightT} c="#fff3b0" size={60} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroSuit" x={x} floor={FL} s={HS} facing={f < a2 + 36 ? 1 : -1} faceTurn={0.5} look={f < a2 + 36 ? [0.8, 0] : [-0.6, 0.3]} pose={p} vx={mv.vx} bob={mv.bob} uid="h1" />
					<Jacket p={p} x={x} facing={f < a2 + 36 ? 1 : -1} />
					<Plate x={x} warn={f < a2 + 8} />
				</Svg>
			</Layer>
		</Stage>
		<Screen>
			<Plaque x={300} y={930} w={400} h={150} text="21:40" size={110} c="#ff9a6a" />
		</Screen>
		</>
	);
};

/* ---- 003–004 · телефон экраном вниз; записка «надень» ---- */
const S2: React.FC = () => {
	const {f, gf, at} = useShot();
	const a4 = at('004');
	const HX = 900;
	const sleeve = env(f, a4 + 60, a4 + 130, 12, 12);
	const p = reach(idle(gf, 3), 'B', [30, 0], 0) as Pose;
	const hp: Pose = {...p, armF: [20 + 20 * sleeve, 70 - 10 * sleeve], head: p.head + 12 * (1 - k(f, a4 - 10, a4 + 20))};
	const cam = camPath(f, [
		[0, camOn(1180, 700, 2.0)],
		[a4 - 8, camOn(1040, 640, 1.5)],
		[a4 + 80, camOn(1000, 560, 1.4)],
	]);
	const pop = k(f, a4 + 20, a4 + 34);
	return (
		<Stage cam={cam} bg="#14152e" light={{x: 20, y: 10, o: 0.5}}>
			<Layer depth={1.6}>
				<><Kitchen night /><Svg><Kettle f={f} night /></Svg></>
			</Layer>
			<Layer depth={1.25}>
				<KitchenTable night mugs={3} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroSuit" x={HX} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.9, 0.9]} pose={hp} uid="h2" />
					<Plate x={HX} warn />
					<rect x={1130} y={686} width={110} height={16} rx={6} fill="#1b1e2a" stroke="#6f7bd8" strokeWidth={3} />
					<CupSteam f={f} />
					<Jacket p={hp} x={HX} facing={1} />
					{pop > 0 ? (
						<g transform={`translate(${HX + 380},700) rotate(-4) scale(${0.6 + 0.4 * pop})`} opacity={pop}>
							<rect x={-230} y={-90} width={460} height={180} rx={14} fill="#fbf8ef" stroke="#10132a" strokeWidth={6} />
							<text y={34} textAnchor="middle" fontSize={120} fontFamily={HAND} fontWeight={700} fill="#10132a">
								надень
							</text>
						</g>
					) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 005–006 · пар, дверь, титр ---- */
const S3: React.FC = () => {
	const {f, gf, at} = useShot();
	const cam = camPath(f, [
		[0, camOn(300, 520, 1.7)],
		[at('005') + 22, camOn(1250, 580, 1.25)],
		[at('006') + 20, camOn(1500, 560, 1.15)],
	]);
	const look = k(f, at('005') + 30, at('005') + 70);
	return (
		<>
		<Stage cam={cam} bg="#14152e" light={{x: 20, y: 10, o: 0.5}}>
			<Layer depth={1.6}>
				<><Kitchen night /><Svg><Kettle f={f} night /></Svg></>
			</Layer>
			<Layer depth={1.25}>
				<KitchenTable night mugs={3} />
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<CupSteam f={f} />
					<rect x={1790} y={300} width={200} height={600} rx={8} fill="#8a6a44" stroke="#10132a" strokeWidth={6} />
					<circle cx={1830} cy={620} r={14} fill="#ffd34a" />
					<rect x={1796} y={880} width={190} height={14} fill="#ffe8a0" opacity={0.7} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroSuit" x={1250} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.3 + 0.7 * look, 0]} pose={idle(gf, 2)} uid="h3" />
					<Jacket p={idle(gf, 2)} x={1250} facing={1} />
					<Plate x={1250} />
				</Svg>
			</Layer>
		</Stage>
		<Caption f={f} from={at('006') - 4} to={at('006') + 130} top={60} lines={['ЧТО ЕСЛИ ЗА КАЖДОЕ УЛУЧШЕНИЕ', 'ТЫ ПЛАТИШЬ ВЕЧЕРОМ?']} size={84} />
		</>
	);
};

/* ---- 007 · календарь на весь экран, клетки гаснут ---- */
const S4: React.FC = () => {
	const {f, gf} = useShot();
	const T = [4, 8, 12, 16, 20, 24, 28];
	const burn = [84, 1e9, 1e9, 130, 108, 1e9, 1e9];
	return (
		<Board tint="#1a2150">
			<WeekCal t={f} times={T} open={20} burn={burn} />
			<g>
				<Onoma x={270} y={520} text="ЧИРК" t={f - burn[0]} c="#ff9a6a" size={80} />
				<Onoma x={1280} y={520} text="ЧИРК" t={f - burn[4]} c="#ff9a6a" size={80} />
				<Onoma x={1030} y={520} text="ЧИРК" t={f - burn[3]} c="#ff9a6a" size={80} />
			</g>
		</Board>
	);
};

/* ---- 008 · отмотаем на 30 дней ---- */
const S5: React.FC = () => {
	const {f, gf, at} = useShot();
	const rew = k(f, 8, 50);
	const dark = rew;
	const mx = interpolate(rew, [0, 1], [0, -1500]);
	const cam = camPath(f, [[0, camOn(1100, 560, 1.2)], [66, camOn(1180, 480, 1.5)]]);
	return (
		<>
		<Stage cam={cam} bg="#14152e" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<><Kitchen night /><Svg><Kettle f={f} night /></Svg></>
			</Layer>
			<Layer depth={1.25}>
				<g transform={`translate(${mx},${-rew * 220})`} opacity={1 - rew * 0.6}>
					<KitchenTable night mugs={3} />
					<Svg><CupSteam f={f} /></Svg>
				</g>
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<rect x={-700} y={-400} width={3300} height={1500} fill="#04051a" opacity={dark * 0.75} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroSuit" x={1230} floor={FL} s={HS} facing={-1} faceTurn={0.5} look={[-0.7, 0]} pose={idle(gf, 4)} uid="h5" />
					<Jacket p={idle(gf, 4)} x={1230} facing={-1} />
					<Plate x={1230} s={2.2} yy={400} pop={1} />
				</Svg>
			</Layer>
		</Stage>
		<Caption f={f} from={6} to={70} top={60} lines={['◄◄ 30 ДНЕЙ НАЗАД']} size={110} />
		</>
	);
};

/* ---- 009–010 · школьный коридор, учительница ---- */
const S6: React.FC = () => {
	const {f, gf, at} = useShot();
	const a10 = at('010');
	const hw = walkTo(f, 4, 62, -250, 680, 1, 0.3);
	const tw = walkTo(f, 40, 84, 2250, 1250, 5, 0.3);
	const slap = env(f, at('009') + 90, at('009') + 104, 4, 4);
	const tp: Pose = reach(tw.pose, 'F', [40, -90], slap);
	const hunch = env(f, a10 + 4, a10 + 60, 8, 30);
	const hp = slouch(hw.pose, 0.4 + hunch);
	const cam = camPath(f, [[0, camOn(500, 620, 1.0)], [at('009') + 60, camOn(900, 580, 1.15)], [at('009') + 118, camOn(1050, 560, 1.3)], [a10 + 56, camOn(950, 580, 1.2)]]);
	const bt = f - (at('009') + 112);
	return (
		<Stage cam={cam} bg="#f1e6c8" light={WARM}>
			<Layer depth={1.6}>
				<Corridor f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={hw.x} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[hunch > 0.3 ? 0.3 : 0.8, hunch > 0.3 ? 0.8 : 0]} expr={hunch > 0.3 ? 'worried' : 'normal'} pose={hp} vx={hw.vx} bob={hw.bob} uid="h6" />
					<Actor who="teacher" x={tw.x} floor={FL} s={1.0} facing={-1} faceTurn={0.5} look={[-0.8, 0]} pose={tp} vx={tw.vx} bob={tw.bob} uid="t6" />
					<rect x={tw.x - 70} y={hip(1) - 98} width={64} height={46} fill="#e2483a" stroke="#10132a" strokeWidth={4} transform={`rotate(-8 ${tw.x - 70} ${hip(1) - 98})`} />
					<Onoma x={tw.x - 40} y={hip(1) - 150} text="ХЛОП" t={f - (at('009') + 98)} c="#ffd36a" size={52} />
					{f < a10 + 50 ? (
						<Bubble x={1250} y={290} w={940} h={200} t={bt} tail={[-10, 130]}>
							<text x={0} y={-12} textAnchor="middle" fontSize={62} fontFamily={FONT} fontWeight={800} fill="#10132a">
								Митя. Концерт тридцатого.
							</text>
							<text x={0} y={62} textAnchor="middle" fontSize={62} fontFamily={FONT} fontWeight={800} fill="#10132a">
								Ведущий — ты.
							</text>
						</Bubble>
					) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 011 · «голос», «спина», «взгляд» ---- */
const S7: React.FC = () => {
	const {f, gf, at} = useShot();
	const labels = ['ГОЛОС', 'СПИНА', 'ВЗГЛЯД'];
	const T = [24, 62, 104];
	const fl = f > 130 ? (Math.floor((f - 130) / 6) % 2 === 0 ? 1 : 0.55) : 1;
	const cam = camPath(f, [[0, camOn(960, 580, 1.15)], [95, camOn(960, 560, 1.4)], [108, camOn(960, 500, 1.85)], [at('011') + 175, camOn(960, 510, 1.75)]]);
	return (
		<Stage cam={cam} bg="#f1e6c8" light={WARM}>
			<Layer depth={1.6}>
				<Corridor f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={960} floor={FL} s={HS} facing={1} faceTurn={0.3} look={[0.2, 0.9]} expr="sad" pose={slouch(idle(gf, 7), 1.2)} uid="h7" />
					{labels.map((t, i) => {
						const u = k(f, T[i], T[i] + 10);
						return u > 0 ? (
							<g key={t} opacity={u * fl} transform={`translate(${680 + i * 280},${i === 1 ? 310 : 370}) scale(${0.7 + 0.3 * u})`}>
								<Plaque x={0} y={0} w={290} h={110} text={t} size={64} c={['#5fe08a', '#ffd34a', '#6aa8ff'][i]} />
							</g>
						) : null;
					})}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 012 · ванная, шаг к зеркалу и назад ---- */
const S8: React.FC = () => {
	const {f, gf} = useShot();
	const A = walkTo(f, 8, 38, 470, 640, 1, 0.3);
	const B = walkTo(f, 52, 78, 640, 470, 2, 0.3);
	const C = walkTo(f, 92, 116, 470, 640, 3, 0.3);
	const seg = f < 45 ? A : f < 85 ? B : C;
	const refl = (
		<Actor who="hero" x={960} floor={700} s={0.8} facing={-1} faceTurn={0.15} look={[0, 0]} pose={idle(gf, 9)} uid="r8" shadow={false} />
	);
	const cam = camPath(f, [[0, camOn(800, 560, 1.15)], [120, camOn(880, 540, 1.4)]]);
	return (
		<Stage cam={cam} bg="#cfe6ee" light={{x: 20, y: 10, o: 0.35}}>
			<Layer depth={1.5}>
				<Bathroom f={gf} reflect={refl} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={seg.x} floor={FL} s={HS} facing={seg.facing} faceTurn={0.5} look={[seg.facing * 0.8, 0]} pose={seg.pose} vx={seg.vx} bob={seg.bob} uid="h8" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 013 · Принстон, 2006: секундомер 0,1 с ---- */
const S9: React.FC = () => {
	const {f} = useShot();
	const cyc = f % 26;
	const on = cyc < 4;
	const needle = on ? 36 * (cyc / 3) : cyc < 7 ? 36 * (1 - (cyc - 4) / 3) : 0;
	const pl = k(f, 4, 18);
	return (
		<Board tint="#1a2150">
			<g opacity={pl}>
				<Plaque x={960} y={185} w={1100} h={150} text="ПРИНСТОН, 2006" size={104} c="#ffd34a" />
			</g>
			<g transform="translate(520,640)">
				<circle r={250} fill="#11142c" stroke="#ffd34a" strokeWidth={14} />
				<rect x={-26} y={-300} width={52} height={50} rx={8} fill="#ffd34a" />
				{Array.from({length: 12}).map((_, i) => (
					<line key={i} x1={0} y1={-232} x2={0} y2={-206} stroke="#8a92d8" strokeWidth={8} transform={`rotate(${i * 30})`} />
				))}
				<line x1={0} y1={0} x2={0} y2={-200} stroke="#ff6a5a" strokeWidth={12} strokeLinecap="round" transform={`rotate(${needle})`} />
				<circle r={20} fill="#ff6a5a" />
				<text y={130} textAnchor="middle" fontSize={110} fontFamily={FONT} fontWeight={900} fill="#fff">
					0,1 с
				</text>
			</g>
			<g transform="translate(1340,630)">
				<rect x={-270} y={-290} width={540} height={560} rx={28} fill={on ? '#fff6dc' : '#1c2150'} stroke="#8a92d8" strokeWidth={8} />
				{on ? <Face x={0} y={-10} s={2.6} /> : <text y={50} textAnchor="middle" fontSize={200} fontFamily={FONT} fontWeight={900} fill="#3a4180">?</text>}
			</g>
		</Board>
	);
};

/* ---- 014 · схема: уверенность растёт, мнение стоит. Подпись весь показ ---- */
const S10: React.FC = () => {
	const {f} = useShot();
	const conf = interpolate(f, [10, 120], [0.12, 0.92], {...clamp, easing: ease});
	const st = k(f, 130, 146);
	return (
		<Board tint="#1a2150">
			<g transform="translate(380,470)">
				<rect x={-250} y={-250} width={500} height={500} rx={28} fill="#fff6dc" stroke="#8a92d8" strokeWidth={8} />
				<Face x={0} y={0} s={2.8} />
				<Plaque x={0} y={330} w={300} h={110} text="0,1 с" size={80} />
			</g>
			<g transform="translate(960,510)">
				<text y={-300} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#5fe08a">
					УВЕРЕННОСТЬ
				</text>
				<rect x={-60} y={-250} width={120} height={500} rx={30} fill="#11142c" stroke="#5fe08a" strokeWidth={6} />
				<rect x={-48} y={250 - 480 * conf - 10} width={96} height={480 * conf} rx={24} fill="#5fe08a" />
			</g>
			<g transform="translate(1500,510)">
				<text y={-300} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#ffd34a">
					МНЕНИЕ
				</text>
				<path d="M-210,120 A210,210 0 0 1 210,120" fill="none" stroke="#3a4180" strokeWidth={30} strokeLinecap="round" />
				<line x1={0} y1={120} x2={0} y2={-70} stroke="#ffd34a" strokeWidth={14} strokeLinecap="round" transform="rotate(-24 0 120)" />
				<circle cx={0} cy={120} r={22} fill="#ffd34a" />
				<text y={230} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
					стоит
				</text>
			</g>
			<g opacity={st} transform={`translate(1130,${780 - (1 - st) * 20})`}>
				<Plaque x={0} y={0} w={880} h={110} text="верным не становится" size={60} c="#ff6a5a" />
			</g>
			<SchemeNote />
		</Board>
	);
};

/* ---- 015–017 · неделя в телефоне ---- */
const S11: React.FC = () => {
	const {f, at} = useShot();
	const a16 = at('016');
	const a17 = at('017');
	const T = [a16 + 10, a16 + 70, a16 + 135, a17 + 10, a17 + 80, a17 + 125, a17 + 170];
	return (
		<Board tint="#1a2150">
			<WeekCal t={f} times={T} open={30} />
		</Board>
	);
};

/* ---- 018–019 · дед: мат в 21:25, свет в 21:30, 29-е: 80 лет ---- */
const S12: React.FC = () => {
	const {f, gf, at} = useShot();
	const a19 = at('019');
	const sit = f < a19 + 6;
	const mate = k(f, at('018') + 20, at('018') + 44);
	const press = a19 + 98;
	const walk = walkTo(f, a19 + 8, a19 + 86, 700, 1520, 4, 0.3);
	const sw = env(f, a19 + 90, a19 + 112, 6, 8);
	const gp: Pose = sit
		? reach({...SIT, head: 0}, 'F', toLocal(1020, 660, 700, 790, 1, 1), env(f, at('018') + 14, at('018') + 60, 8, 20))
		: reach(walk.pose, 'F', toLocal(1620, 560, 1520, hip(1), 1, 1), sw);
	const dark = interpolate(f, [press, press + 12], [0, 0.72], clamp);
	const clock = f < press ? '21:25' : '21:30';
	const card = k(f, a19 + 128, a19 + 144);
	const cam = camPath(f, [[0, camOn(900, 600, 1.35)], [a19, camOn(960, 560, 1.15)], [a19 + 60, camOn(1250, 580, 1.1)], [a19 + 130, camOn(1250, 570, 1.05)]]);
	return (
		<>
		<Stage cam={cam} bg="#2a2038" light={{x: 20, y: 10, o: 0.35}}>
			<Layer depth={1.6}>
				<GrandRoom f={gf} dark={dark / 0.72} />
			</Layer>
			<Layer depth={1.2}>
				<Svg>
					<Chair x={700} y={800} facing={1} />
					<rect x={1612} y={520} width={26} height={60} rx={6} fill="#e8e4d8" stroke="#10132a" strokeWidth={4} />
					<Ico k="knight" x={interpolate(mate, [0, 1], [900, 1020])} y={interpolate(mate, [0, 1], [520, 640])} s={0.9} />
					<Onoma x={1020} y={560} text="МАТ!" t={f - (at('018') + 46)} c="#ffd36a" size={84} />
				</Svg>
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<rect x={-700} y={-400} width={3300} height={1500} fill="#05061a" opacity={dark} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="grandpa" x={sit ? 700 : walk.x} floor={FL} seat={sit ? 790 : undefined} s={1} facing={1} faceTurn={0.5} look={f < at('018') + 70 ? [0.6, 0.6] : [0.9, -0.5]} pose={gp} vx={sit ? 0 : walk.vx} bob={sit ? 0 : walk.bob} uid="g12" />
				</Svg>
			</Layer>
		</Stage>
		<Screen>
			<Plaque x={1500} y={150} w={440} h={160} text={clock} size={120} c={f < press ? '#ffd34a' : '#ff9a6a'} />
			{card > 0 ? (
				<g transform={`translate(520,560) scale(${0.7 + 0.3 * card})`} opacity={card}>
					<rect x={-290} y={-230} width={580} height={460} rx={34} fill="#fff6dc" stroke="#ffd34a" strokeWidth={8} />
					<text x={-130} y={-60} textAnchor="middle" fontSize={190} fontFamily={FONT} fontWeight={900} fill="#10132a">
						29
					</text>
					<Ico k="cake" x={130} y={-20} s={2.2} />
					<Plaque x={0} y={150} w={440} h={110} text="ДЕДУ 80" size={80} c="#e86aa0" />
				</g>
			) : null}
		</Screen>
		</>
	);
};

/* ---- 020 · клетка 30: проводы 19:00 с бронью ---- */
const S13: React.FC = () => {
	const {f} = useShot();
	const u = 0.8 + 0.2 * k(f, 0, 10);
	const v = k(f, 30, 46);
	const w = k(f, 100, 116);
	return (
		<Board tint="#1a2150">
			<g transform={`translate(480,540) scale(${0.7 + 0.3 * u})`} opacity={u}>
				<rect x={-330} y={-400} width={660} height={800} rx={44} fill="#fff6dc" stroke="#ffd34a" strokeWidth={10} />
				<text y={-170} textAnchor="middle" fontSize={260} fontFamily={FONT} fontWeight={900} fill="#10132a">
					30
				</text>
				<Ico k="suitcase" x={0} y={110} s={3.4} />
			</g>
			<g opacity={v} transform={`translate(1270,400)`}>
				<Plaque x={0} y={0} w={880} h={190} text="ПРОВОДЫ 19:00" size={100} c="#ffd34a" />
			</g>
			<g opacity={w} transform="translate(1270,660)">
				<Plaque x={0} y={0} w={560} h={130} text="БРОНЬ ✓" size={84} c="#5fe08a" />
			</g>
			<Mini x={1620} y={780} c="#2f6fd8" hair="#5a3a22" s={1.5} label="БРАТ" />
		</Board>
	);
};

/* ---- 021–022 · ванная: впервые загорается табличка 30 ---- */
const S14: React.FC = () => {
	const {f, gf, at} = useShot();
	const on = k(f, at('021') + 92, at('021') + 104);
	const a22 = at('022');
	const str = env(f, a22 + 4, a22 + 30, 8, 12);
	const p = slouch(idle(gf, 5), 1 - 1.4 * str);
	const refl = <Actor who="hero" x={960} floor={700} s={0.8} facing={-1} faceTurn={0.15} look={[0, 0]} pose={p} uid="r14" shadow={false} />;
	const cam = camPath(f, [[0, camOn(760, 580, 1.2)], [at('021') + 90, camOn(700, 480, 1.5)]]);
	return (
		<Stage cam={cam} bg="#cfe6ee" light={{x: 20, y: 10, o: 0.35}}>
			<Layer depth={1.5}>
				<Bathroom f={gf} reflect={refl} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, -0.1]} pose={p} uid="h14" />
					{on > 0 ? (
						<g opacity={on}>
							<circle cx={640} cy={425} r={150 * (1.2 - on * 0.4)} fill="#ffe08a" opacity={0.25 * (1 - on)} />
							<Plate x={640} s={2.1} yy={400} pop={0.8 + 0.2 * on} />
						</g>
					) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 023 · утро, 29 едет по коридору, мама проходит мимо ---- */
const S15: React.FC = () => {
	const {f, gf, at} = useShot();
	const hw = walkTo(f, 10, 125, 150, 620, 1, 0.3);
	const mw = walkTo(f, 24, 150, 1600, 120, 6, 0.3);
	const rub = env(f, 0, 40, 6, 10);
	const hp = gesture('touchFace', hw.pose, rub, f);
	const cam = camPath(f, [[0, camOn(760, 580, 1.0)], [160, camOn(800, 570, 1.2)]]);
	return (
		<Stage cam={cam} bg="#f3e6c4" light={WARM}>
			<Layer depth={1.6}>
				<><Kitchen /><Svg><Kettle f={f} /></Svg></>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={hw.x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.2]} pose={hp} expr={rub > 0.3 ? 'sleepy' : 'normal'} vx={hw.vx} bob={hw.bob} armOver={rub > 0.5} uid="h15" />
					<Plate x={hw.x} />
				</Svg>
			</Layer>
			<Layer depth={0.95}>
				<Svg>
					<Actor who="mom" x={mw.x} floor={FL + 14} s={1.08} facing={-1} faceTurn={0.2} look={[0, 1]} pose={{...mw.pose, head: mw.pose.head + 16, armF: [38, 70]}} vx={mw.vx * 0.25} bob={mw.bob} uid="m15" />
					<g transform={`translate(${mw.x - 32},${hip(1.08) + 40})`}>
						<rect x={-14} y={-22} width={28} height={42} rx={5} fill="#1b1e2a" stroke="#6f7bd8" strokeWidth={3} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 024 · парикмахерская ---- */
const S16: React.FC = () => {
	const {f, gf, at} = useShot();
	const a = at('024');
	const snip = env(f, a + 30, a + 120, 8, 10);
	const jit = Math.sin(f * 0.9) * 14 * snip;
	const bp = reach(idle(gf, 3), 'F', toLocal(930 + jit, 560 + Math.abs(jit) * 0.4, 1240, hip(1), 1, -1), 0.9 * snip);
	const up = k(f, a + 118, a + 150);
	const mp: Pose = {...idle(gf, 8), lean: -2 - 8 * up, head: 6 - 12 * up + 4 * (1 - up)};
	const refl = <Actor who="hero" x={550} floor={700} s={0.8} facing={-1} faceTurn={0.15} look={[0, 0]} pose={mp} uid="r16" shadow={false} />;
	const cam = camPath(f, [[0, camOn(980, 560, 1.15)], [a + 90, camOn(1030, 600, 1.55)]]);
	return (
		<>
		<Stage cam={cam} bg="#efe4d0" light={WARM}>
			<Layer depth={1.5}>
				<Barber f={gf} reflect={refl} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={960} floor={FL} seat={790} s={HS} facing={-1} faceTurn={0.4} look={[-0.9, 0]} pose={{...SIT, ...mp, armF: [28, 66], armB: [24, 64], legB: SIT.legB, legF: SIT.legF}} uid="h16" />
					<path d="M900,640 L1030,640 L1060,820 L860,820 Z" fill={WRAP} stroke="#10132a" strokeWidth={4} />
					<Actor who="barber" x={1240} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.8, 0.2]} pose={bp} uid="b16" />
					{Array.from({length: 14}).map((_, i) => {
						const t0 = a + 40 + i * 6;
						const u = (f - t0) / 50;
						if (u < 0 || u > 1.4) return null;
						return <rect key={i} x={940 + (random('hx' + i) - 0.5) * 120 + u * (random('hy' + i) - 0.5) * 100} y={570 + u * u * 300} width={22} height={7} rx={3} fill="#3a2a1c" transform={`rotate(${u * 160 * (random('hr' + i) - 0.5)} 950 600)`} opacity={u > 1 ? 0 : 1} />;
					})}
				</Svg>
			</Layer>
		</Stage>
		<Screen>
			{f > a + 100 ? (
				<Bubble x={1240} y={190} w={840} h={150} t={f - (a + 100)} tail={[-120, 110]}>
					<text y={22} textAnchor="middle" fontSize={72} fontFamily={FONT} fontWeight={800} fill="#10132a">
						Совсем другое дело.
					</text>
				</Bubble>
			) : null}
		</Screen>
		</>
	);
};

/* ---- 025–026 · над головой щёлкает 29 → 28; «Чирк» — вечер обуглился ---- */
const S17: React.FC = () => {
	const {f, gf, at} = useShot();
	const a26 = at('026');
	const pop = k(f, a26 - 6, a26 + 6);
	const burn = k(f, a26 + 4, a26 + 40);
	const refl = <Actor who="hero" x={550} floor={700} s={0.8} facing={-1} faceTurn={0.15} look={[0, 0]} pose={idle(gf, 8)} uid="r17" shadow={false} />;
	const cam = camPath(f, [[0, camOn(960, 460, 1.9)], [a26 - 10, camOn(960, 470, 1.8)], [a26 + 8, camOn(1180, 540, 1.1)]]);
	return (
		<Stage cam={cam} bg="#efe4d0" light={WARM}>
			<Layer depth={1.5}>
				<Barber f={gf} reflect={refl} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={960} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.6, -0.4]} expr="wide" pose={idle(gf, 6)} uid="h17" />
					<HeroBadge x={960} y={420} s={1.7} />
					{pop > 0 ? (
						<g transform={`translate(1560,470) scale(${0.6 + 0.4 * pop})`} opacity={pop}>
							<rect x={-260} y={-150} width={520} height={300} rx={30} fill="#fff6dc" stroke="#ffd34a" strokeWidth={8} />
							<text x={-120} y={-30} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={900} fill="#10132a">
								ВТ 2
							</text>
							<Ico k="book" x={150} y={-50} s={1.4} />
							<text y={90} textAnchor="middle" fontSize={54} fontFamily={FONT} fontWeight={800} fill="#10132a">
								ДРОБИ С СЕСТРОЙ
							</text>
							<rect x={-260} y={-150} width={520} height={300} rx={30} fill="#1a0f0f" opacity={0.85 * burn} />
							<ellipse cx={0} cy={140 - 220 * burn} rx={250} ry={40 + 30 * Math.sin(f / 2)} fill="#ff6a3a" opacity={burn > 0 && burn < 1 ? 0.9 : 0} />
							<Onoma x={0} y={-170} text="ЧИРК" t={f - (a26 + 6)} c="#ff9a6a" size={90} />
						</g>
					) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 027–028 · сестра уходит, тетрадь с дробями, хлопает дверь ---- */
const S18: React.FC = () => {
	const {f, gf, at} = useShot();
	const a27 = at('027');
	const a28 = at('028');
	const toss = k(f, a27 + 24, a27 + 40);
	const run = walkTo(f, a27 + 100, a27 + 176, 1250, 2300, 6, 0.4);
	const sx = f < a27 + 100 ? 1250 : run.x;
	const wave = env(f, a27 + 110, a27 + 170, 6, 8);
	const sp: Pose = f < a27 + 100 ? gesture('presentF', idle(gf, 9), env(f, a27 + 20, a27 + 60, 8, 10), f) : gesture('wave', run.pose, wave, f);
	const hp: Pose = { ...SIT, lean: -2, head: 4 + 10 * k(f, a28, a28 + 20) };
	const cam = camPath(f, [[0, camOn(1000, 600, 1.15)], [a27 + 100, camOn(1300, 560, 1.2)], [a28, camOn(1050, 590, 1.25)]]);
	return (
		<>
		<Stage cam={cam} bg="#2a2a48" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<><Kitchen night /><Svg><Kettle f={f} night /></Svg></>
			</Layer>
			<Layer depth={1.25}>
				<KitchenTable night mugs={0} />
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<rect x={1790} y={300} width={200} height={600} rx={8} fill="#8a6a44" stroke="#10132a" strokeWidth={6} />
					<g transform={`translate(${interpolate(toss, [0, 1], [1180, f > a28 ? 880 : 1060])},${interpolate(toss, [0, 1], [600, 684])}) rotate(${(1 - toss) * 40})`}>
						<rect x={-60} y={-8} width={120} height={14} rx={3} fill="#f6f2e8" stroke="#10132a" strokeWidth={3} />
						<text x={0} y={-14} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill="#10132a">
							½ + ¼
						</text>
					</g>
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Chair x={820} y={800} facing={1} />
					<Actor who="hero" x={820} floor={FL} seat={790} s={HS} facing={1} faceTurn={0.4} look={f < a28 ? [0.8, 0] : [0.2, 0.9]} expr={f < a28 ? 'normal' : 'sad'} pose={hp} uid="h18" />
					<Plate x={820} yy={440} s={1.8} />
					<Actor who="sis" x={sx} floor={FL} s={1} facing={f < a27 + 100 ? -1 : 1} faceTurn={0.5} look={[0, 0]} pose={sp} vx={run.vx} bob={run.bob} uid="s18" />
					<Onoma x={1700} y={460} text="ХЛОП!" t={f - (a28 + 54)} c="#ffd36a" size={90} />
				</Svg>
			</Layer>
		</Stage>
		<Screen>
			{f > a27 + 120 && f < a28 + 70 ? (
				<Bubble x={1220} y={180} w={1200} h={160} t={f - (a27 + 120)} tail={[330, 120]}>
					<text y={24} textAnchor="middle" fontSize={76} fontFamily={FONT} fontWeight={800} fill="#10132a">
						Дроби в следующий вторник!
					</text>
				</Bubble>
			) : null}
		</Screen>
		</>
	);
};

/* ---- 029–030 · ночь, потом лента 30 вечеров ---- */
const S19: React.FC = () => {
	const {f, gf, at} = useShot();
	const a29 = at('029');
	const a30 = at('030');
	const bd = k(f, a29 + 96, a29 + 112);
	const cam = camPath(f, [[0, camOn(1600, 620, 1.1)], [a29 + 100, camOn(1700, 560, 1.5)]]);
	const gl = 0.55 + 0.12 * Math.sin(f / 14);
	// ribbon states
	const midnight = k(f, a30 + 10, a30 + 24);
	const cut = f >= a30 + 150;
	const shift = f >= a30 + 215;
	const burned = [1, 2];
	return (
		<>
			<Stage cam={cam} bg="#1d2550" light={{x: 20, y: 10, o: 0.25}}>
				<Layer depth={1.6}>
					<Bedroom night f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Sleeper x={1790} y={684} s={1} lift={0} expr="worried" />
						<circle cx={1700} cy={470} r={190} fill="#ffe08a" opacity={0.1 * gl} />
						<Plate x={1680} yy={430} s={1.9} />
					</Svg>
				</Layer>
				<Layer depth={0.9}>
					<Blanket night f={gf} />
				</Layer>
			</Stage>
			{bd > 0 ? (
				<AbsoluteFill style={{opacity: bd}}>
					<Board tint="#141a48">
						<AgeBadge x={960} y={180} value={counterAt(gf)} s={2.0} label="СВОБОДНЫХ ВЕЧЕРОВ" />
						<Ribbon t={f} burned={burned} cursor={shift ? 3 : 2} mine={[3, 30]} showMoon={f >= a30 + 10 && f < a30 + 150 ? midnight : shift ? 1 : 0} />
						<Ico k="scissors" x={150} y={470} s={0.7} />
						<Plaque
							x={960}
							y={820}
							w={shift ? 1580 : f >= a30 + 150 ? 1580 : f >= a30 + 10 ? 1400 : 1000}
							h={150}
							text={shift ? 'ПОЛНОЧЬ: СЧЁТ 28 НЕ МЕНЯЕТСЯ' : f >= a30 + 150 ? 'СТРИЖКА → БЛИЖАЙШИЙ: СЕГОДНЯ' : f >= a30 + 10 ? 'ПОЛНОЧЬ ЗАБИРАЕТ ВЕЧЕР' : 'ТВОИ — ЖЁЛТЫЕ'}
							size={84}
							c={shift ? '#5fe08a' : f >= a30 + 150 ? '#ff9a6a' : '#ffd34a'}
						/>
					</Board>
				</AbsoluteFill>
			) : null}
		</>
	);
};

/* ---- 031 · весы: «+ стрижка», «− сестра» ---- */
const S20: React.FC = () => {
	const {f} = useShot();
	const tilt = interpolate(Math.sin(f / 8) * Math.exp(-f / 40) + k(f, 0, 30) * 0.2, [-1, 1], [-14, 14]);
	return (
		<Board tint="#1a2150">
			<g transform="translate(960,300) scale(1.05)">
				<rect x={-14} y={0} width={28} height={420} rx={10} fill="#8a92d8" />
				<g transform={`rotate(${tilt})`}>
					<rect x={-450} y={-14} width={900} height={28} rx={14} fill="#cfd6e6" />
					<line x1={-420} y1={14} x2={-420} y2={150} stroke="#cfd6e6" strokeWidth={8} />
					<line x1={420} y1={14} x2={420} y2={150} stroke="#cfd6e6" strokeWidth={8} />
					<g transform={`translate(-420,${150}) rotate(${-tilt})`}>
						<rect x={-240} y={0} width={480} height={100} rx={24} fill="#5fe08a" />
						<text y={74} textAnchor="middle" fontSize={72} fontFamily={FONT} fontWeight={900} fill="#10132a">
							+ СТРИЖКА
						</text>
					</g>
					<g transform={`translate(420,${150}) rotate(${-tilt})`}>
						<rect x={-240} y={0} width={480} height={100} rx={24} fill="#ff6a5a" />
						<text y={74} textAnchor="middle" fontSize={72} fontFamily={FONT} fontWeight={900} fill="#10132a">
							− СЕСТРА
						</text>
					</g>
				</g>
			</g>
		</Board>
	);
};

/* ---- 032–034 · двор: Тёма, булка, «Правило 1» ---- */
const S21: React.FC = () => {
	const {f, gf, at} = useShot();
	const a32 = at('032');
	const a33 = at('033');
	const a34 = at('034');
	const tw = walkTo(f, 2, 46, 2250, 1250, 5, 0.3);
	const bite = env(f, a32 + 8, a32 + 40, 6, 6) + env(f, a34 + 60, a34 + 90, 6, 6);
	const tpose: Pose = reach(tw.pose, 'F', [24, -128], Math.min(1, bite));
	const pt = env(f, a33 + 14, a33 + 70, 8, 12);
	const hpose: Pose = reach(slouch(idle(gf, 3), 0.8), 'F', toLocal(740, 340, 700, hip(HS), HS, 1), pt);
	const sp = useSpeaking(gf);
	const wide = camOn(960, 560, 1.05);
	const gz = 1 + 0.0006 * f;
	const cam = sp === 'TEMA' ? camOn(960, 540, 1.15 * gz, {farBlur: 5}) : sp === 'HERO' ? camOn(780, 520, 1.3 * gz, {farBlur: 5}) : camOn(960, 560, 1.0 * gz);
	const book = k(f, a34 + 24, a34 + 40);
	const write = k(f, a34 + 44, a34 + 80);
	const bun = hands(tpose, tw.x, 1, -1).f;
	return (
		<Stage cam={cam} bg="#7fc0ea" light={WARM}>
			<Layer depth={1.6}>
				<SchoolYard f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.3]} expr="worried" pose={hpose} uid="h21" />
					<Plate x={700} yy={400} s={1.6} />
					<Actor who="tema" x={tw.x} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.8, 0]} pose={tpose} vx={tw.vx} bob={tw.bob} uid="t21" />
					<ellipse cx={bun[0]} cy={bun[1]} rx={26} ry={18} fill="#d9a05a" stroke="#10132a" strokeWidth={4} />
					{book > 0 ? (
						<g transform={`translate(1640,560) rotate(-4) scale(${0.6 + 0.4 * book})`} opacity={book}>
							<rect x={-230} y={-130} width={460} height={260} rx={14} fill="#fbf8ef" stroke="#10132a" strokeWidth={6} />
							<clipPath id="wr21">
								<rect x={-220} y={-60} width={440 * write} height={140} />
							</clipPath>
							<g clipPath="url(#wr21)">
								<text y={40} textAnchor="middle" fontSize={96} fontFamily={HAND} fontWeight={700} fill="#10132a">
									Правило 1
								</text>
							</g>
						</g>
					) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 035 · «научный руководитель. С булкой» ---- */
const S22: React.FC = () => {
	const {f, gf} = useShot();
	const bite = env(f, 20, 60, 6, 8);
	const tpose: Pose = reach(idle(gf, 5), 'F', [24, -128], bite);
	const under = k(f, 50, 80);
	const bun = hands(tpose, 1150, 1, -1).f;
	const cam = camPath(f, [[0, camOn(1150, 560, 1.15)], [40, camOn(1300, 560, 1.4)], [95, camOn(1400, 540, 1.7)]]);
	return (
		<Stage cam={cam} bg="#7fc0ea" light={WARM}>
			<Layer depth={1.6}>
				<SchoolYard f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={1150} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.2, 0.2]} pose={tpose} uid="t22" />
					<ellipse cx={bun[0]} cy={bun[1]} rx={26} ry={18} fill="#d9a05a" stroke="#10132a" strokeWidth={4} />
					<g transform="translate(1560,600) rotate(-4)">
						<rect x={-230} y={-130} width={460} height={260} rx={14} fill="#fbf8ef" stroke="#10132a" strokeWidth={6} />
						<text y={40} textAnchor="middle" fontSize={96} fontFamily={HAND} fontWeight={700} fill="#10132a">
							Правило 1
						</text>
						<path d={`M-200,66 L${-200 + 400 * under},62`} stroke="#e2483a" strokeWidth={10} strokeLinecap="round" />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

import {SHOTS2} from './shots2';
import {SHOTS3} from './shots3';
import {SHOTS4} from './shots4';
import {SHOTS5} from './shots5';
export const SHOTS: ShotDef[] = [
	{at: '001', C: S1},
	{at: '003', C: S2},
	{at: '005', C: S3},
	{at: '007', C: S4},
	{at: '008', C: S5},
	{at: '009', C: S6, whip: true},
	{at: '011', C: S7},
	{at: '012', C: S8, whip: true},
	{at: '013', C: S9, whip: true},
	{at: '014', C: S10},
	{at: '015', C: S11, whip: true},
	{at: '018', C: S12, whip: true},
	{at: '020', C: S13, whip: true},
	{at: '021', C: S14, whip: true},
	{at: '023', C: S15, whip: true},
	{at: '024', C: S16, whip: true},
	{at: '025', C: S17},
	{at: '027', C: S18, whip: true},
	{at: '029', C: S19, whip: true},
	{at: '031', C: S20},
	{at: '032', C: S21, whip: true},
	{at: '035', C: S22},
	...SHOTS2,
	...SHOTS3,
	...SHOTS4,
	...SHOTS5,
];
