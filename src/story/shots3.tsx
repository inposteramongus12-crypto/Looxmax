import React from 'react';
import {interpolate} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {Chair} from '../engine/props';
import {env, gesture, idle, reach, run, SIT, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {HallBack, Bedroom, Blanket, SchoolYard, Corridor} from '../kit/sets';
import {CrowdRow, Layer, Stage, Svg, camOn, clamp, ease} from '../kit/kit';
import {AgeBadge, Bubble, Board, FONT, HAND} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {FL, HS, Jacket, Plate, Screen, camPath, hands, hip} from './common';
import {Face, GrandRoom, Ico, Mini, Plaque, Ribbon, SchemeNote, WeekCal, Bathroom} from './places';
import {Battery, BusStop, DayCell, Gym, Hall, KitchenK, Cat, kk} from './places2';
import {Ladder, NightLane, ParkEve, PhoneFrame} from './places3';
import {Badge, Words, slouch, hipsPose} from './shots2';

/* ===== Parts 7–9 (lines 090–158). Plates ≥ 60 px from the edge; Board safe zone x 160–1760, y 110–950. ===== */
const WARM = {x: 20, y: 10, o: 0.4};
const k = kk;
const Sepia: React.FC<{o?: number}> = ({o = 0.3}) => (
	<Screen>
		<rect x={0} y={0} width={1920} height={1080} fill="#9a6a2a" opacity={o} />
		<Plaque x={1560} y={150} w={520} h={110} text="ВСПОМИНАЕШЬ" size={56} c="#ffd34a" />
	</Screen>
);
const Hopeless: React.FC = () => null;

/* ---- 090 · двор, день 20: Тёма без булки ---- */
const U1: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(900, 580, 1.0)], [140, camOn(960, 570, 1.18)]]);
	return (
		<Stage cam={cam} bg="#7fc0ea" light={WARM}>
			<Layer depth={1.6}>
				<SchoolYard f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.2]} expr="worried" pose={slouch(idle(gf, 3), 0.6)} uid="h60" />
					<Plate x={700} yy={400} s={1.7} />
					<Actor who="tema" x={1250} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} pose={reach(idle(gf, 4), 'F', [14, -10], 0.7)} uid="t60" />
					<g transform="translate(1180,1010)" opacity={0}>
						<rect width={1} height={1} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 091–094 · «Две пятницы. Ты платишь мной.» ---- */
const U2: React.FC = () => {
	const {f, gf, at} = useShot();
	const a91 = at('091');
	const a93 = at('093');
	const a94 = at('094');
	const shown = k(f, a91 + 6, a91 + 20);
	const leave = walkTo(f, a93 + 14, a93 + 120, 1250, 1640, 6, 0.3);
	const tx = f < a93 + 14 ? 1250 : leave.x;
	const step = env(f, a94 + 4, a94 + 24, 6, 6);
	const hp = f < a94 ? {...idle(gf, 3), head: 12 * env(f, at('092'), at('092') + 40, 6, 8)} : {...idle(gf, 3), lean: 6 * step};
	const cam = camPath(f, [[0, camOn(980, 580, 1.15)], [a93, camOn(1000, 570, 1.1)], [a93 + 80, camOn(1100, 570, 1.0)]]);
	return (
		<>
			<Stage cam={cam} bg="#7fc0ea" light={WARM}>
				<Layer depth={1.6}>
					<SchoolYard f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="hero" x={f < a94 ? 700 : 700 + 40 * step} floor={FL} s={HS} facing={1} faceTurn={0.4} look={f < at('092') + 60 ? [0.2, 0.7] : [0.8, 0.1]} expr="worried" pose={hp} uid="h61" />
						<Plate x={700} yy={400} s={1.7} />
						<Actor who="tema" x={tx} floor={FL} s={1} facing={f < a93 + 14 ? -1 : 1} faceTurn={0.4} look={[-0.8, 0]} pose={f < a93 + 14 ? gesture('point', idle(gf, 4), env(f, a91, a91 + 60, 8, 10), f) : leave.pose} vx={f < a93 + 14 ? 0 : leave.vx} bob={leave.bob} uid="t61" />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<g opacity={shown * (f < a93 ? 1 : 0.0)}>
					<DayCell x={1440} y={330} s={0.5} wd="ПТ" day={12} ico="popcorn" label="" burn={0.55} />
					<DayCell x={1730} y={330} s={0.5} wd="ПТ" day={19} ico="popcorn" label="" burn={0.55} />
				</g>
			</Screen>
		</>
	);
};

/* ---- 095 · «Он не ждёт» ---- */
const U3: React.FC = () => {
	const {f, gf} = useShot();
	const w = walkTo(f, 6, 120, 1500, 2300, 6, 0.3);
	const cam = camPath(f, [[0, camOn(1100, 580, 1.0)], [70, camOn(1000, 570, 1.12)]]);
	return (
		<Stage cam={cam} bg="#7fc0ea" light={WARM}>
			<Layer depth={1.6}>
				<SchoolYard f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0.1]} expr="sad" pose={slouch(idle(gf, 3), 0.8)} uid="h62" />
					<Plate x={760} yy={400} s={1.7} />
					<Actor who="tema" x={w.x} floor={FL} s={1} facing={1} faceTurn={0.2} look={[1, 0]} pose={w.pose} vx={w.vx} bob={w.bob} uid="t62" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 096 · лестница: приятель → друг → близкий ---- */
const U4: React.FC = () => {
	const {f} = useShot();
	return (
		<Board tint="#1a2150">
			<Ladder t={f} />
			<SchemeNote />
		</Board>
	);
};

/* ---- 097 · Митя и Тёма на верхней ступени, она подтаивает ---- */
const U5: React.FC = () => {
	const {f} = useShot();
	const melt = k(f, 50, 150);
	return (
		<Board tint="#1a2150">
			<Ladder t={200} melt={melt} />
			<Mini x={1360} y={280 + melt * 70} c="#f2b21c" hair="#3a2a1c" s={1.6} />
			<Mini x={1620} y={280 + melt * 70} c="#d94a3a" hair="#2f6fd8" s={1.6} />
			<SchemeNote />
		</Board>
	);
};

/* ---- 098 · два ведра попкорна тают, «−6 ч» ---- */
const U6: React.FC = () => {
	const {f} = useShot();
	const melt = k(f, 20, 100);
	const slide = k(f, 40, 110);
	return (
		<Board tint="#1a2150">
			{[620, 1300].map((x, i) => (
				<g key={i} transform={`translate(${x},${560 + melt * 80}) scale(${3.2},${3.2 * (1 - 0.45 * melt)})`} opacity={1 - 0.3 * melt}>
					<Ico k="popcorn" x={0} y={0} />
				</g>
			))}
			<g opacity={k(f, 4, 18)}>
				<Plaque x={960} y={190} w={1100} h={130} text="ВЕЧЕР = 3 ЧАСА" size={90} c="#ffd34a" />
			</g>
			<g transform={`translate(960,${300 + slide * 360})`}>
				<Plaque x={0} y={0} w={420} h={130} text="−6 Ч" size={100} c="#ff6a5a" />
			</g>
			<SchemeNote />
		</Board>
	);
};

/* ---- 099 · прихожая: мама с телефоном, настолки на полке ---- */
const U7: React.FC = () => {
	const {f, gf} = useShot();
	const p = reach(idle(gf, 7), 'F', toLocal(1190, 470, 1150, hip(1.05), 1.05, 1), 1);
	const cam = camPath(f, [[0, camOn(900, 560, 1.0)], [100, camOn(1000, 560, 1.25)]]);
	return (
		<Stage cam={cam} bg="#e6d8bc" light={WARM}>
			<Layer depth={1.6}>
				<Hall f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="mom" x={1150} floor={FL} s={1.05} facing={1} faceTurn={0.4} look={[0.6, 0.2]} pose={p} uid="m63" />
					<g transform="translate(1196,460) rotate(-12)">
						<rect x={-12} y={-24} width={24} height={44} rx={5} fill="#1b1e2a" stroke="#6f7bd8" strokeWidth={3} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 100–101 · кухня, свет горит; сестра приносит две чашки ---- */
const U8: React.FC = () => {
	const {f, gf, at} = useShot();
	const a101 = at('101');
	const w = walkTo(f, a101 + 10, a101 + 70, 2250, 1250, 5, 0.3);
	const sit = k(f, a101 + 80, a101 + 90);
	const cam = camPath(f, [[0, camOn(900, 600, 1.1)], [a101, camOn(1000, 590, 1.1)], [a101 + 100, camOn(1050, 590, 1.2)]]);
	return (
		<>
			<Stage cam={cam} bg="#2a2a48" light={{x: 20, y: 10, o: 0.4}}>
				<Layer depth={1.6}>
					<KitchenK night />
				</Layer>
				<Layer depth={1.25}>
					<Svg>
						<ellipse cx={960} cy={720} rx={430} ry={46} fill="#8a7aa0" />
						<rect x={700} y={740} width={20} height={190} fill="#4a3d5a" />
						<rect x={1200} y={740} width={20} height={190} fill="#4a3d5a" />
					</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Chair x={760} y={800} facing={1} />
						<Actor who="hero" x={760} floor={FL} seat={790} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.5]} expr="sad" pose={{...SIT, head: 8}} uid="h64" />
						<Plate x={760} yy={430} s={1.8} />
						{f > a101 + 70 ? <Actor who="sis" x={1180} floor={FL} seat={790} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} pose={SIT} uid="s64" /> : <Actor who="sis" x={w.x} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} pose={reach(w.pose, 'F', [40, -60], 0.8)} vx={w.vx} bob={w.bob} uid="s64" />}
						{f > a101 + 70 ? <Chair x={1180} y={800} facing={-1} /> : null}
						{[900, 1080].map((x, i) => (
							<g key={i} opacity={k(f, a101 + 74, a101 + 84)} transform={`translate(${x},700)`}>
								<rect x={-22} y={-40} width={44} height={44} rx={8} fill={i ? '#e86aa0' : '#3a6fd2'} />
								<path d="M22,-30 q18,0 18,14 q0,14 -18,14" stroke={i ? '#e86aa0' : '#3a6fd2'} strokeWidth={7} fill="none" />
							</g>
						))}
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				{f > a101 + 120 ? (
					<Bubble x={1300} y={190} w={1020} h={190} t={f - (a101 + 120)} tail={[-160, 130]}>
						<text y={-6} textAnchor="middle" fontSize={62} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Дроби я сама решила.
						</text>
						<text y={64} textAnchor="middle" fontSize={62} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Просто посиди.
						</text>
					</Bubble>
				) : null}
			</Screen>
		</>
	);
};

/* ---- 102 · сестра дует на чай, Митя смотрит в чашку ---- */
const U9: React.FC = () => {
	const {f, gf} = useShot();
	const blow = Math.abs(Math.sin(f / 7));
	const cam = camPath(f, [[0, camOn(1000, 600, 1.2)], [80, camOn(990, 640, 1.7)]]);
	return (
		<>
			<Stage cam={cam} bg="#2a2a48" light={{x: 20, y: 10, o: 0.4}}>
				<Layer depth={1.6}>
					<KitchenK night />
				</Layer>
				<Layer depth={1.25}>
					<Svg>
						<ellipse cx={960} cy={720} rx={430} ry={46} fill="#8a7aa0" />
						<rect x={700} y={740} width={20} height={190} fill="#4a3d5a" />
						<rect x={1200} y={740} width={20} height={190} fill="#4a3d5a" />
					</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Chair x={760} y={800} facing={1} />
						<Actor who="hero" x={760} floor={FL} seat={790} s={HS} facing={1} faceTurn={0.4} look={[0.6, 0.9]} expr="sad" pose={{...SIT, head: 14}} uid="h65" />
						<Chair x={1180} y={800} facing={-1} />
						<Actor who="sis" x={1180} floor={FL} seat={790} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.5]} mouth={blow > 0.5 ? 'open' : 'line'} pose={{...SIT, head: 6}} uid="s65" />
						{[900, 1080].map((x, i) => (
							<g key={i} transform={`translate(${x},700)`}>
								<rect x={-22} y={-40} width={44} height={44} rx={8} fill={i ? '#e86aa0' : '#3a6fd2'} />
								<path d="M22,-30 q18,0 18,14 q0,14 -18,14" stroke={i ? '#e86aa0' : '#3a6fd2'} strokeWidth={7} fill="none" />
								{[0, 1, 2].map((j) => {
									const u = ((f / 30 + j / 3) % 1);
									return <circle key={j} cx={Math.sin(u * 6 + j) * 8} cy={-50 - u * 70} r={7 + u * 9} fill="#fff" opacity={(1 - u) * 0.7} />;
								})}
							</g>
						))}
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={400} y={170} w={440} h={120} text="ДЕНЬ 20" size={80} c="#ffd34a" />
			</Screen>
		</>
	);
};

/* ---- 103 · часы 22:00, две пустые чашки ---- */
const U10: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(980, 610, 1.3)], [90, camOn(960, 600, 1.1)]]);
	return (
		<>
			<Stage cam={cam} bg="#2a2a48" light={{x: 20, y: 10, o: 0.4}}>
				<Layer depth={1.6}>
					<KitchenK night />
				</Layer>
				<Layer depth={1.25}>
					<Svg>
						<ellipse cx={960} cy={720} rx={430} ry={46} fill="#8a7aa0" />
						<rect x={700} y={740} width={20} height={190} fill="#4a3d5a" />
						<rect x={1200} y={740} width={20} height={190} fill="#4a3d5a" />
					</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Chair x={760} y={800} facing={1} />
						<Actor who="hero" x={760} floor={FL} seat={790} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.3]} pose={{...SIT, lean: -2}} uid="h66" />
						<Chair x={1180} y={800} facing={-1} />
						<Actor who="sis" x={1180} floor={FL} seat={790} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.3]} pose={SIT} uid="s66" />
						{[900, 1080].map((x, i) => (
							<g key={i} transform={`translate(${x},700)`}>
								<rect x={-22} y={-40} width={44} height={44} rx={8} fill={i ? '#e86aa0' : '#3a6fd2'} />
								<path d="M22,-30 q18,0 18,14 q0,14 -18,14" stroke={i ? '#e86aa0' : '#3a6fd2'} strokeWidth={7} fill="none" />
								<ellipse cx={0} cy={-38} rx={16} ry={5} fill="#10132a" opacity={0.5} />
							</g>
						))}
						<Plate x={760} yy={430} s={1.8} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={1500} y={150} w={440} h={150} text="22:00" size={110} c="#ffd34a" />
			</Screen>
		</>
	);
};

/* ---- 104 · ночь, лист «занятый вечер — вечер без людей» в свете телефона ---- */
const U11: React.FC = () => {
	const {f} = useShot();
	const u = 0.55 + 0.45 * k(f, 6, 24);
	return (
		<Board tint="#0a0d26">
			<g opacity={u} transform={`rotate(-2 960 520) translate(0,${(1 - u) * 20})`}>
				<rect x={260} y={170} width={1400} height={640} rx={20} fill="#fbf8ef" stroke="#10132a" strokeWidth={8} />
				<circle cx={330} cy={230} r={24} fill="#e2483a" stroke="#10132a" strokeWidth={5} />
				<circle cx={1590} cy={230} r={24} fill="#3a6fd2" stroke="#10132a" strokeWidth={5} />
				<text x={960} y={430} textAnchor="middle" fontSize={140} fontFamily={HAND} fontWeight={700} fill="#c9342a">
					Занятый вечер —
				</text>
				<text x={960} y={620} textAnchor="middle" fontSize={140} fontFamily={HAND} fontWeight={700} fill="#c9342a">
					вечер без людей
				</text>
			</g>
			<rect x={0} y={0} width={1920} height={1080} fill="#02030f" opacity={0.35} />
		</Board>
	);
};

/* ---- 105 · «А если не вместо, а вместе?» ---- */
const U12: React.FC = () => {
	const {f, gf} = useShot();
	const sit = k(f, 4, 24);
	const blink = Math.floor(f / 6) % 2 === 0 ? 1 : 0.5;
	const cam = camPath(f, [[0, camOn(1450, 620, 1.1)], [55, camOn(1430, 600, 1.35)]]);
	return (
		<Stage cam={cam} bg="#101a3a" light={{x: 20, y: 10, o: 0.2}}>
			<Layer depth={1.6}>
				<Bedroom night f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Chair x={1400} y={800} facing={-1} />
					<Actor who="hero" x={1400} floor={FL} seat={790} s={HS} facing={-1} faceTurn={0.5} look={[-0.7, -0.2]} expr="wide" pose={{...SIT, lean: -4 - 8 * sit, head: 0}} uid="h67" />
					<g opacity={blink}>
						<Plate x={1400} yy={430} s={1.9} />
					</g>
				</Svg>
			</Layer>
			<Layer depth={0.9}>
				<Blanket night f={gf} />
			</Layer>
		</Stage>
	);
};

/* ---- 106–107 · прихожая: ловишь брата, протягиваешь кроссовок ---- */
const V1: React.FC = () => {
	const {f, gf, at} = useShot();
	const a107 = at('107');
	const reachK = env(f, a107 + 6, a107 + 50, 8, 10);
	const mw = walkTo(f, 20, 70, 300, 640, 3, 0.3);
	const mp = reach(f < 70 ? mw.pose : idle(gf, 3), 'F', [40, -40], reachK);
	const cam = camPath(f, [[0, camOn(850, 580, 1.0)], [a107, camOn(900, 570, 1.2)]]);
	return (
		<Stage cam={cam} bg="#e6d8bc" light={WARM}>
			<Layer depth={1.6}>
				<Hall f={gf} box={false} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={f < 70 ? mw.x : 640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.1]} pose={mp} vx={f < 70 ? mw.vx : 0} bob={f < 70 ? mw.bob : 0} uid="h68" />
					<Plate x={f < 70 ? mw.x : 640} yy={400} s={1.7} />
					<Actor who="bro" x={1150} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={reach(idle(gf, 5), 'B', [20, -50], 0.6)} uid="b68" />
					<rect x={1210} y={720} width={90} height={120} rx={12} fill="#3a4256" stroke="#10132a" strokeWidth={5} />
					<g opacity={k(f, a107 + 8, a107 + 18)} transform={`translate(${760 + reachK * 80},${hip(HS) - 10})`}>
						<path d="M-30,10 Q-34,-16 -6,-18 L22,-6 Q40,2 40,16 L-30,16 Z" fill="#e2483a" stroke="#10132a" strokeWidth={5} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 108 · клетка 24 вспыхивает, табличка 9 → 8; брат: «Ты? Бегать?» ---- */
const V2: React.FC = () => {
	const {f, gf} = useShot();
	const burn = k(f, 56, 84);
	return (
		<>
			<Board tint="#1a2150">
				<Badge />
				<DayCell x={960} y={590} s={0.85} wd="СР" day={24} ico="pad" label="FIFA" burn={burn * 0} flash={env(f, 58, 66, 3, 10)} dual={f > 70} />
				<Onoma x={1330} y={400} text="ЧИРК" t={f - 61} c="#ff9a6a" size={110} />
			</Board>
			<Screen>
				{f < 50 ? (
					<Bubble x={1180} y={800} w={1060} h={170} t={f + 30} tail={[-180, 120]}>
						<text y={20} textAnchor="middle" fontSize={62} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Ты? Бегать? Ладно, засекаю.
						</text>
					</Bubble>
				) : null}
			</Screen>
		</>
	);
};

/* ---- 109 · парк: брат впереди, Митя пыхтит ---- */
const V3: React.FC = () => {
	const {f, gf} = useShot();
	const ph = f * 0.45;
	const bx = interpolate(f, [0, 140], [900, 1300], clamp);
	const mx = interpolate(f, [0, 140], [520, 700], clamp);
	const cam = camPath(f, [[0, camOn(800, 590, 1.0)], [140, camOn(1000, 580, 1.12)]]);
	return (
		<Stage cam={cam} bg="#ff9a6a" light={WARM}>
			<Layer depth={1.6}>
				<ParkEve f={f} speed={14} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="bro" x={bx} floor={FL} s={1} facing={1} faceTurn={0.3} look={[1, 0]} pose={run(ph)} vx={6} uid="b69" />
					<Actor who="hero" x={mx} floor={FL} s={HS} facing={1} faceTurn={0.3} look={[1, 0.2]} expr="worried" mouth="open" pose={{...run(ph + 1.4), lean: 12}} vx={5} uid="h69" />
					<Plate x={mx} yy={400} s={1.7} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 110 · новый геймпад, играют до ночи ---- */
const V4: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(960, 600, 1.0)], [100, camOn(960, 590, 1.2)]]);
	return (
		<>
			<Stage cam={cam} bg="#d8e8e6" light={WARM}>
				<Layer depth={1.6}>
					<Bedroom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Chair x={800} y={800} facing={1} />
						<Actor who="bro" x={800} floor={FL} seat={790} s={1} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={reach(reach({...SIT}, 'F', [50, -20], 0.5), 'B', [46, -18], 0.5)} uid="b70" />
						<Chair x={1100} y={800} facing={1} />
						<Actor who="hero" x={1100} floor={FL} seat={790} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={reach(reach({...SIT}, 'F', [50, -20], 0.5), 'B', [46, -18], 0.5)} uid="h70" />
						<Plate x={1100} yy={420} s={1.7} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<g transform="translate(1560,360)">
					<DayCell x={0} y={0} s={0.5} wd="СР" day={24} ico="pad" label="" dual flash={0.4} />
				</g>
			</Screen>
		</>
	);
};

/* ---- 111 · «Гол!» — геймпад целый ---- */
const V5: React.FC = () => {
	const {f, gf} = useShot();
	const toss = k(f, 40, 70);
	const cam = camPath(f, [[0, camOn(1000, 580, 1.1)], [150, camOn(980, 560, 1.4)]]);
	return (
		<Stage cam={cam} bg="#d8e8e6" light={WARM}>
			<Layer depth={1.6}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="bro" x={900} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.4, -0.6]} expr="wide" pose={gesture('fist', idle(gf, 3), env(f, 36, 90, 6, 8), f)} uid="b71" />
					<g transform={`translate(${900 + 40 * toss},${520 - 200 * Math.sin(toss * Math.PI)}) rotate(${toss * 360})`}>
						<path d="M-62,-30 L62,-30 Q84,-30 84,0 Q84,32 62,32 L-62,32 Q-84,32 -84,0 Q-84,-30 -62,-30 Z" fill="#3a4256" stroke="#10132a" strokeWidth={5} />
						<circle cx={38} cy={-8} r={8} fill="#ffd34a" />
					</g>
					<Onoma x={1150} y={420} text="ГОЛ!" t={f - 40} c="#ffd36a" size={120} />
					<Actor who="hero" x={1250} floor={FL} s={HS} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="wide" pose={gesture('wave', idle(gf, 5), env(f, 44, 100, 6, 8), f)} uid="h71" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 112 · правило 4, зелёным маркером ---- */
const V6: React.FC = () => {
	const {f} = useShot();
	const w = k(f, 90, 160);
	return (
		<Board tint="#243060">
			<rect x={220} y={120} width={1480} height={800} rx={18} fill="#fbf8ef" stroke="#10132a" strokeWidth={8} transform="rotate(-0.6 960 520)" />
			<text x={960} y={225} textAnchor="middle" fontSize={110} fontFamily={HAND} fontWeight={700} fill="#c9342a">
				ПРАВИЛА
			</text>
			{['1. УЛУЧШЕНИЕ = 1 ВЕЧЕР', '2. ВЕЧЕР ВЫБИРАЕШЬ ТЫ', '3. ЗАНЯТО — ВСТРЕЧИ НЕТ'].map((t, i) => (
				<text key={i} x={290} y={330 + i * 95} fontSize={80} fontFamily={HAND} fontWeight={700} fill="#10132a">
					{t}
				</text>
			))}
			<g transform="rotate(-2 960 740)">
				<text x={290} y={680} fontSize={104} fontFamily={HAND} fontWeight={700} fill="#1f9a4a" opacity={k(f, 90, 110)}>
					4. ВМЕСТЕ — ОДИН ВЕЧЕР
				</text>
				<text x={290} y={810} fontSize={104} fontFamily={HAND} fontWeight={700} fill="#1f9a4a" opacity={k(f, 125, 145)}>
					НА ДВОИХ
				</text>
			</g>
		</Board>
	);
};

/* ---- 113–114 · дед учит завязывать галстук ---- */
const V7: React.FC = () => {
	const {f, gf, at} = useShot();
	const a114 = at('114');
	const tie = env(f, 20, a114 + 90, 14, 14);
	const gp = reach(idle(gf, 3), 'F', toLocal(920, 560, 1100, hip(1), 1, -1), tie);
	const pull = env(f, a114 + 40, a114 + 80, 6, 8);
	const cam = camPath(f, [[0, camOn(980, 590, 1.0)], [100, camOn(1000, 570, 1.3)], [a114 + 20, camOn(1000, 560, 1.5)]]);
	return (
		<>
			<Stage cam={cam} bg="#d6b98e" light={WARM}>
				<Layer depth={1.6}>
					<GrandRoom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="hero" x={860} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0.5]} pose={{...idle(gf, 3), head: 6}} uid="h72" />
						<path d={`M${860 + 18},${hip(HS) - 140} l22,0 l${6 + 6 * pull},${60 - 12 * pull} l-${14 + 4 * pull},${50} l-${14 + 4 * pull},-${50} Z`} fill="#c9342a" stroke="#10132a" strokeWidth={4} />
						<Actor who="grandpa" x={1100} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.9, 0.4]} pose={gp} uid="g72" />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				{f > a114 + 40 ? (
					<g transform="translate(1560,380)" opacity={k(f, a114 + 40, a114 + 54)}>
						<DayCell x={0} y={0} s={0.5} wd="ЧТ" day={25} ico="knight" label="" dual flash={0.5} />
					</g>
				) : null}
			</Screen>
		</>
	);
};

/* ---- 115 · шахматы; 21:25 дед уходит спать ---- */
const V8: React.FC = () => {
	const {f, gf, at} = useShot();
	const walk = walkTo(f, 90, 180, 760, 360, 3, 0.25);
	const wave = env(f, 130, 170, 6, 8);
	const cam = camPath(f, [[0, camOn(960, 600, 1.2)], [90, camOn(900, 580, 1.0)], [160, camOn(700, 580, 1.15)]]);
	return (
		<>
			<Stage cam={cam} bg="#d6b98e" light={WARM}>
				<Layer depth={1.6}>
					<GrandRoom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Chair x={1200} y={800} facing={-1} />
						<Actor who="hero" x={1200} floor={FL} seat={790} s={HS} facing={-1} faceTurn={0.4} look={[-0.8, 0.4]} expr="sad" pose={SIT} uid="h73" />
						{f < 90 ? (
							<>
								<Chair x={760} y={800} facing={1} />
								<Actor who="grandpa" x={760} floor={FL} seat={790} s={1} facing={1} faceTurn={0.4} look={[0.8, 0.4]} expr="wide" pose={SIT} uid="g73" />
							</>
						) : (
							<Actor who="grandpa" x={walk.x} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={gesture('wave', walk.pose, wave, f)} vx={walk.vx} bob={walk.bob} uid="g73b" />
						)}
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={1500} y={150} w={440} h={150} text="21:25" size={110} c="#ffd34a" />
			</Screen>
		</>
	);
};

/* ---- 116 · сообщение Тёме: «Будешь жюри в пятницу?» ---- */
const V9: React.FC = () => {
	const {f} = useShot();
	const typed = k(f, 20, 60);
	const sent = f > 70;
	return (
		<Board tint="#1a2150">
			<PhoneFrame w={760} h={820}>
				<rect x={-380} y={-410} width={760} height={110} rx={52} fill="#2a336e" />
				<text x={0} y={-336} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
					ТЁМА
				</text>
				{sent ? (
					<g opacity={k(f, 70, 82)}>
						<rect x={-340} y={-170} width={680} height={200} rx={36} fill="#5fe08a" />
						<text x={0} y={-80} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Будешь жюри
						</text>
						<text x={0} y={4} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#10132a">
							в пятницу?
						</text>
					</g>
				) : (
					<text x={-340} y={-60} fontSize={64} fontFamily={FONT} fontWeight={800} fill="#fff" opacity={typed}>
						{'Будешь жюри в пятницу?'.slice(0, Math.floor(typed * 22))}|
					</text>
				)}
				{f > 100 ? (
					<g opacity={k(f, 100, 112)}>
						<rect x={-340} y={110} width={260} height={110} rx={40} fill="#3a4180" />
						{[0, 1, 2].map((i) => (
							<circle key={i} cx={-270 + i * 70} cy={165 + Math.sin(f / 4 + i) * 10} r={14} fill="#fff" />
						))}
					</g>
				) : null}
			</PhoneFrame>
		</Board>
	);
};

/* ---- 117–119 · «Буду. Строгим.», голосовое про автобус и геймпад, фото ---- */
const V10: React.FC = () => {
	const {f, at} = useShot();
	const a118 = at('118');
	const a119 = at('119');
	return (
		<Board tint="#1a2150">
			<Badge />
			<PhoneFrame y={600} w={900} h={640}>
				<g opacity={k(f, 4, 16)}>
					<rect x={-420} y={-290} width={520} height={110} rx={40} fill="#3a4180" />
					<text x={-380} y={-216} fontSize={66} fontFamily={FONT} fontWeight={800} fill="#fff">
						Буду. Строгим.
					</text>
				</g>
				<g opacity={k(f, a118 + 4, a118 + 16)}>
					<rect x={-420} y={-120} width={760} height={130} rx={44} fill="#3a4180" />
					<text x={-380} y={-36} fontSize={52} fontFamily={FONT} fontWeight={800} fill="#fff">
						▶ ▂▅▇▅▂▃▆▃▂ 0:04
					</text>
				</g>
				<g opacity={k(f, a119 + 8, a119 + 20)}>
					<rect x={80} y={40} width={330} height={190} rx={36} fill="#5fe08a" />
					<g transform="translate(245,135)">
						<Ico k="pad" x={0} y={0} s={1.3} />
					</g>
				</g>
			</PhoneFrame>
		</Board>
	);
};

/* ---- 120 · день 26: репетиция, Тёма как жюри ---- */
const V11: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(960, 600, 1.0)], [110, camOn(940, 580, 1.25)]]);
	return (
		<Stage cam={cam} bg="#d8e8e6" light={WARM}>
			<Layer depth={1.6}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={620} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} mouth={Math.floor(f / 5) % 2 ? 'open' : 'line'} pose={{...idle(gf, 3), lean: -3}} uid="h74" />
					<Plate x={620} yy={400} s={1.7} />
					<Chair x={1180} y={800} facing={-1} />
					<Actor who="tema" x={1180} floor={FL} seat={790} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={reach(SIT, 'F', [40, -30], 0.6)} uid="t74" />
					<g transform="translate(1110,700) rotate(-8)">
						<rect x={-34} y={-24} width={68} height={48} rx={4} fill="#fbf8ef" stroke="#10132a" strokeWidth={4} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 121 · «Теперь кино»: клетка 26 горит двумя цветами ---- */
const V12: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(960, 580, 1.1)], [80, camOn(980, 560, 1.3)]]);
	return (
		<>
			<Stage cam={cam} bg="#d8e8e6" light={WARM}>
				<Layer depth={1.6}>
					<Bedroom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} pose={idle(gf, 3)} uid="h75" />
						<Plate x={700} yy={400} s={1.7} />
						<Chair x={1250} y={800} facing={-1} />
						<Actor who="tema" x={1250} floor={FL} seat={790} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={gesture('point', SIT, env(f, 10, 60, 8, 10), f)} uid="t75" />
						<rect x={140} y={540} width={200} height={110} rx={8} fill="#1b2030" stroke="#6f7bd8" strokeWidth={4} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<g transform="translate(1560,380)" opacity={k(f, 40, 54)}>
					<DayCell x={0} y={0} s={0.5} wd="ПТ" day={26} ico="popcorn" label="" dual flash={0.5} />
				</g>
			</Screen>
		</>
	);
};

/* ---- 122–123 · «А сон вдвоём считается?» «Не проверял.» клетка 29 ---- */
const V13: React.FC = () => {
	const {f, gf, at} = useShot();
	const a123 = at('123');
	const cam = camPath(f, [[0, camOn(1100, 570, 1.5)], [a123, camOn(1000, 570, 1.2)], [a123 + 40, camOn(880, 560, 1.4)]]);
	return (
		<>
			<Stage cam={cam} bg="#d8e8e6" light={WARM}>
				<Layer depth={1.6}>
					<Bedroom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={f < a123 ? [0.8, 0.1] : [0.2, -0.4]} expr="worried" pose={idle(gf, 3)} uid="h76" />
						<Plate x={760} yy={400} s={1.7} />
						<Chair x={1250} y={800} facing={-1} />
						<Actor who="tema" x={1250} floor={FL} seat={790} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} mouth={Math.floor(f / 4) % 2 ? 'open' : 'smile'} pose={reach(SIT, 'F', [30, -70], 0.8)} uid="t76" />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<g transform="translate(1560,380)" opacity={k(f, a123, a123 + 12)}>
					<DayCell x={0} y={0} s={0.55} wd="ПН" day={29} ico="cake" label="" flash={0.5} />
				</g>
			</Screen>
		</>
	);
};

export const SHOTS3: ShotDef[] = [
	{at: '090', C: U1, whip: true},
	{at: '091', C: U2},
	{at: '095', C: U3},
	{at: '096', C: U4, whip: true},
	{at: '097', C: U5},
	{at: '098', C: U6},
	{at: '099', C: U7, whip: true},
	{at: '100', C: U8, whip: true},
	{at: '102', C: U9},
	{at: '103', C: U10},
	{at: '104', C: U11, whip: true},
	{at: '105', C: U12, whip: true},
	{at: '106', C: V1, whip: true},
	{at: '108', C: V2, whip: true},
	{at: '109', C: V3, whip: true},
	{at: '110', C: V4, whip: true},
	{at: '111', C: V5},
	{at: '112', C: V6, whip: true},
	{at: '113', C: V7, whip: true},
	{at: '115', C: V8},
	{at: '116', C: V9, whip: true},
	{at: '117', C: V10},
	{at: '120', C: V11, whip: true},
	{at: '121', C: V12},
	{at: '122', C: V13},
];
export {Hopeless};
