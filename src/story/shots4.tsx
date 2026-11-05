import React from 'react';
import {interpolate, random} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {Chair} from '../engine/props';
import {env, gesture, idle, reach, SIT, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Bedroom, HallBack, SchoolYard} from '../kit/sets';
import {CrowdRow, Layer, Sleeper, Stage, Svg, camOn, clamp, ease} from '../kit/kit';
import {AgeBadge, Bubble, Board, FONT, HAND} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {FL, HS, Jacket, Plate, Screen, camPath, hands, hip} from './common';
import {Face, GrandRoom, Ico, Mini, Plaque, Ribbon, SchemeNote, Bathroom} from './places';
import {DayCell, Hall, KitchenK, kk} from './places2';
import {NightLane, PhoneFrame} from './places3';
import {Badge, Words, slouch} from './shots2';

/* ===== Part 9 (lines 124–158): the climax. Plates ≥ 60 px from the edge. ===== */
const WARM = {x: 20, y: 10, o: 0.4};
const k = kk;
const Sepia: React.FC = () => (
	<Screen>
		<rect x={0} y={0} width={1920} height={1080} fill="#9a6a2a" opacity={0.3} />
		<Plaque x={1560} y={150} w={520} h={110} text="ВСПОМИНАЕШЬ" size={56} c="#ffd34a" />
	</Screen>
);
export const CHARRED = [1, 2, 3, 4, 6, 11, 12, 15, 18, 19, 20, 24, 25, 26];
export const Bunch: React.FC<{x: number; y: number; n: number; s?: number}> = ({x, y, n, s = 1}) => (
	<g>
		{Array.from({length: n}).map((_, r) =>
			[-1, 0, 1].map((c) => <rect key={`${r}${c}`} x={x + (c * 56 + (r % 2) * 12 - 28) * s} y={y - (r + 1) * 56 * s} width={54 * s} height={54 * s} rx={4} fill={['#e2483a', '#3a6fd2', '#ffd34a', '#3aa37a', '#8b5cf6'][(r + c + 3) % 5]} stroke="#10132a" strokeWidth={3} />),
		)}
	</g>
);
export const Mug: React.FC<{x: number; y: number; c: string; steam?: number; f?: number}> = ({x, y, c, steam = 0, f = 0}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-22} y={-40} width={44} height={44} rx={8} fill={c} stroke="#10132a" strokeWidth={3} />
		<path d="M22,-30 q18,0 18,14 q0,14 -18,14" stroke={c} strokeWidth={7} fill="none" />
		{steam > 0
			? [0, 1, 2].map((j) => {
					const u = ((f / 30 + j / 3) % 1);
					return <circle key={j} cx={Math.sin(u * 6 + j) * 8} cy={-50 - u * 70} r={7 + u * 9} fill="#fff" opacity={(1 - u) * 0.7 * steam} />;
				})
			: null}
	</g>
);

/* ---- 124 · день 28: список на холодильнике, зачёркнуто всё, кроме «СОН» ---- */
const W1: React.FC = () => {
	const {f} = useShot();
	const items = ['СТРИЖКА', 'УМЫВАНИЕ', 'СПИНА', 'ОДЕЖДА', 'ГОЛОС', 'ШАГ И ЖЕСТЫ', 'ДИКЦИЯ', 'ГАЛСТУК'];
	const pulse = 1 + 0.05 * Math.sin(f / 6);
	return (
		<Board tint="#243060">
			<Badge />
			<rect x={240} y={290} width={1440} height={640} rx={18} fill="#fbf8ef" stroke="#10132a" strokeWidth={8} />
			<circle cx={310} cy={345} r={24} fill="#e2483a" stroke="#10132a" strokeWidth={5} />
			<circle cx={1610} cy={345} r={24} fill="#3a6fd2" stroke="#10132a" strokeWidth={5} />
			{items.map((t, i) => {
				const col = i < 4 ? 0 : 1;
				const row = i % 4;
				const x = 320 + col * 700;
				const y = 430 + row * 90;
				const u = k(f, 8 + i * 8, 20 + i * 8);
				return (
					<g key={i}>
						<text x={x} y={y} fontSize={74} fontFamily={HAND} fontWeight={700} fill="#10132a">
							{t}
						</text>
						<path d={`M${x - 10},${y - 24} L${x + 40 + u * (t.length * 36)},${y - 28}`} stroke="#e2483a" strokeWidth={9} strokeLinecap="round" opacity={u > 0 ? 1 : 0} />
					</g>
				);
			})}
			<g transform={`translate(960,855) scale(${pulse})`} opacity={k(f, 80, 96)}>
				<Plaque x={0} y={0} w={560} h={120} text="СОН" size={96} c="#5fe08a" />
			</g>
		</Board>
	);
};

/* ---- 125 · лента: стрелка от «сон» к клетке 29 с тортом и «80» ---- */
const W2: React.FC = () => {
	const {f} = useShot();
	const a = k(f, 10, 70);
	return (
		<Board tint="#141a48">
			<Ribbon t={f} burned={CHARRED} cursor={28} mine={[28, 30]} />
			<Plaque x={420} y={800} w={400} h={120} text="СОН" size={90} c="#5fe08a" />
			<path d={`M600,790 Q1000,${700 - 30 * a} ${460 + 1100 * a},640`} stroke="#5fe08a" strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="1 0" opacity={a > 0 ? 1 : 0} />
			<path d="M1560,640 L1610,610 L1600,680 Z" fill="#5fe08a" opacity={k(f, 66, 74)} />
			<g opacity={k(f, 66, 80)} transform="translate(1560,820)">
				<Ico k="cake" x={-80} y={0} s={1} />
				<Plaque x={70} y={10} w={190} h={96} text="80" size={72} c="#e86aa0" />
			</g>
		</Board>
	);
};

/* ---- 126 · клетка 29 тлеет по краям: правило 3 ---- */
const W3: React.FC = () => {
	const {f} = useShot();
	const sm = k(f, 20, 110);
	return (
		<Board tint="#141a48">
			<Badge />
			<DayCell x={960} y={560} s={0.82} wd="ПН" day={29} ico="cake" label="ДЕДУ 80" smolder={sm} />
			<g opacity={k(f, 50, 66)}>
				<Plaque x={960} y={880} w={1560} h={120} text="ПРАВИЛО 3: ВСТРЕЧИ НЕ БУДЕТ" size={80} c="#ff9a6a" />
			</g>
		</Board>
	);
};

/* ---- 127 · выбор между дедом и сценой ---- */
const W4: React.FC = () => {
	const {f} = useShot();
	const tilt = Math.sin(f / 10) * 4;
	return (
		<Board tint="#141a48">
			<DayCell x={480} y={540} s={0.7} wd="ПН" day={29} ico="cake" label="ДЕД" smolder={0.5} />
			<g transform="translate(1440,540)">
				<rect x={-300} y={-260} width={600} height={520} rx={26} fill="#2a1a3a" stroke="#ffd34a" strokeWidth={10} />
				<path d="M-300,-260 Q-220,-120 -300,260 L-200,260 Q-150,-80 -200,-260 Z" fill="#c9342a" />
				<path d="M300,-260 Q220,-120 300,260 L200,260 Q150,-80 200,-260 Z" fill="#c9342a" />
				<path d="M-120,-260 L120,-260 L220,260 L-220,260 Z" fill="#fff3b0" opacity={0.3} />
				<rect x={-6} y={-20} width={12} height={250} fill="#cfd6e6" />
				<ellipse cx={0} cy={-40} rx={32} ry={44} fill="#3a4256" stroke="#10132a" strokeWidth={5} />
				<text y={-300} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff" opacity={0}>
					.
				</text>
			</g>
			<g transform={`translate(960,540) rotate(${tilt})`}>
				<Plaque x={0} y={0} w={190} h={140} text="ИЛИ" size={72} c="#ffd34a" />
			</g>
			<Plaque x={480} y={920} w={360} h={90} text="ДЕД" size={64} c="#e86aa0" />
			<Plaque x={1440} y={920} w={460} h={90} text="СЦЕНА" size={64} c="#6aa8ff" />
		</Board>
	);
};

/* ---- 128 · Тёма по видеосвязи разводит руками ---- */
const W5: React.FC = () => {
	const {f} = useShot();
	const spread = k(f, 8, 24);
	const sw = Math.sin(f / 5) * 6 * spread;
	return (
		<Board tint="#1a2150">
			<rect x={420} y={150} width={1080} height={720} rx={40} fill="#0b0d1e" stroke="#6f7bd8" strokeWidth={8} />
			<g transform="translate(960,560)">
				<path d="M-300,260 Q-300,70 0,70 Q300,70 300,260 Z" fill="#d94a3a" stroke="#10132a" strokeWidth={7} />
				<circle cy={-60} r={150} fill="#ffe0bd" stroke="#10132a" strokeWidth={8} />
				<path d="M-150,-90 Q0,-300 150,-90 L150,-120 Q0,-250 -150,-120 Z" fill="#2f6fd8" stroke="#10132a" strokeWidth={6} />
				<circle cx={-52} cy={-70} r={14} fill="#10132a" />
				<circle cx={52} cy={-70} r={14} fill="#10132a" />
				<path d="M-60,-5 Q0,30 60,-5" stroke="#10132a" strokeWidth={8} fill="none" strokeLinecap="round" />
				<g transform={`translate(${-380 * spread},${110 + sw})`}>
					<circle r={44} fill="#ffe0bd" stroke="#10132a" strokeWidth={6} />
				</g>
				<g transform={`translate(${380 * spread},${110 - sw})`}>
					<circle r={44} fill="#ffe0bd" stroke="#10132a" strokeWidth={6} />
				</g>
			</g>
		</Board>
	);
};

/* ---- 129 · «Швеция, 2010» + холодильник «У НАС: последняя ночь» ---- */
const W6: React.FC = () => {
	const {f} = useShot();
	const a = k(f, 6, 22);
	const b = k(f, 80, 100);
	return (
		<Board tint="#1a2150">
			<g opacity={a}>
				<rect x={170} y={170} width={800} height={660} rx={30} fill="#fff6dc" stroke="#ffd34a" strokeWidth={10} />
				<Plaque x={570} y={270} w={740} h={120} text="ШВЕЦИЯ, 2010" size={78} c="#ffd34a" />
				<text x={570} y={450} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#10132a">
					ФОТО — ДНЁМ
				</text>
				<text x={570} y={560} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={800} fill="#10132a">
					после короткой ночи
				</text>
				<text x={570} y={630} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={800} fill="#10132a">
					и долгого бодрствования
				</text>
			</g>
			<g opacity={b}>
				<rect x={1080} y={170} width={620} height={700} rx={30} fill="#f4f6fa" stroke="#9aa0ae" strokeWidth={10} />
				<line x1={1080} y1={420} x2={1700} y2={420} stroke="#b9bcc8" strokeWidth={6} />
				<g transform="translate(1390,560) rotate(-3)">
					<rect x={-250} y={-170} width={500} height={330} rx={10} fill="#fbf8ef" stroke="#10132a" strokeWidth={6} />
					<text y={-70} textAnchor="middle" fontSize={84} fontFamily={HAND} fontWeight={700} fill="#c9342a">
						У НАС:
					</text>
					<text y={40} textAnchor="middle" fontSize={84} fontFamily={HAND} fontWeight={700} fill="#c9342a">
						последняя
					</text>
					<text y={130} textAnchor="middle" fontSize={84} fontFamily={HAND} fontWeight={700} fill="#c9342a">
						ночь
					</text>
				</g>
			</g>
		</Board>
	);
};

/* ---- 130–131 · флешбек: часы 21:25, дед встаёт из-за доски ---- */
const W7: React.FC = () => {
	const {f, gf, at} = useShot();
	const a131 = at('131');
	const stand = f >= a131 + 16;
	const walk = walkTo(f, a131 + 20, a131 + 80, 760, 560, 4, 0.25);
	const cam = camPath(f, [[0, camOn(980, 590, 1.1)], [a131, camOn(940, 580, 1.25)]]);
	return (
		<>
			<Stage cam={cam} bg="#d6b98e" light={WARM}>
				<Layer depth={1.6}>
					<GrandRoom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Chair x={1200} y={800} facing={-1} />
						<Actor who="hero" x={1200} floor={FL} seat={790} s={HS} facing={-1} faceTurn={0.4} look={[-0.8, 0.3]} pose={SIT} uid="h80" />
						{stand ? (
							<Actor who="grandpa" x={walk.x} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={walk.pose} vx={walk.vx} bob={walk.bob} uid="g80b" />
						) : (
							<>
								<Chair x={760} y={800} facing={1} />
								<Actor who="grandpa" x={760} floor={FL} seat={790} s={1} facing={1} faceTurn={0.4} look={[0.8, 0.4]} pose={SIT} uid="g80" />
							</>
						)}
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={1500} y={290} w={440} h={150} text="21:25" size={110} c="#ffd34a" />
			</Screen>
			<Sepia />
		</>
	);
};

/* ---- 132 · флешбек: Тёма с попкорном, Митя берёт телефон ---- */
const W8: React.FC = () => {
	const {f, gf} = useShot();
	const take = env(f, 20, 80, 8, 10);
	const cam = camPath(f, [[0, camOn(960, 590, 1.1)], [80, camOn(960, 570, 1.3)]]);
	return (
		<>
			<Stage cam={cam} bg="#d8e8e6" light={WARM}>
				<Layer depth={1.6}>
					<Bedroom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Chair x={1250} y={800} facing={-1} />
						<Actor who="tema" x={1250} floor={FL} seat={790} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} mouth={Math.floor(f / 4) % 2 ? 'open' : 'smile'} pose={reach(SIT, 'F', [30, -60], 0.7)} uid="t81" />
						<g transform="translate(1160,700)">
							<Ico k="popcorn" x={0} y={0} s={0.9} />
						</g>
						<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.3]} pose={reach(idle(gf, 3), 'F', [38, -60], take)} uid="h81" />
						<g transform={`translate(${860},${hip(HS) - 70 - 30 * take})`}>
							<rect x={-14} y={-26} width={28} height={50} rx={5} fill="#1b1e2a" stroke="#6f7bd8" strokeWidth={3} />
						</g>
					</Svg>
				</Layer>
			</Stage>
			<Sepia />
		</>
	);
};

/* ---- 133–135 · видеозвонок: дед слишком близко к камере ---- */
const W9: React.FC = () => {
	const {f, at} = useShot();
	const a134 = at('134');
	const a135 = at('135');
	const nod = Math.abs(Math.sin(Math.max(0, f - a135) / 6)) * 18 * (f >= a135 ? 1 : 0);
	const point = k(f, a134 + 10, a134 + 24);
	return (
		<Board tint="#1a2150">
			<rect x={170} y={170} width={620} height={700} rx={36} fill="#0b0d1e" stroke="#6f7bd8" strokeWidth={8} />
			<Mini x={480} y={540} c="#f2b21c" hair="#3a2a1c" s={3.2} />
			<g opacity={point}>
				<Plaque x={480} y={250} w={400} h={140} text="21:30" size={100} c="#ffd34a" />
			</g>
			<rect x={850} y={170} width={900} height={700} rx={36} fill="#0b0d1e" stroke="#6f7bd8" strokeWidth={8} />
			<g transform={`translate(1300,${540 + nod})`}>
				<path d="M-340,330 Q-340,150 0,150 Q340,150 340,330 Z" fill="#6b7f8e" stroke="#10132a" strokeWidth={8} />
				<circle r={250} fill="#ffe0bd" stroke="#10132a" strokeWidth={9} />
				<path d="M-250,-50 Q-250,-260 0,-262 Q250,-260 250,-50 Q200,-170 0,-170 Q-200,-170 -250,-50 Z" fill="#d0d4dc" stroke="#10132a" strokeWidth={7} />
				<circle cx={-90} cy={-10} r={52} fill="none" stroke="#10132a" strokeWidth={9} />
				<circle cx={90} cy={-10} r={52} fill="none" stroke="#10132a" strokeWidth={9} />
				<line x1={-38} y1={-10} x2={38} y2={-10} stroke="#10132a" strokeWidth={9} />
				<circle cx={-90} cy={-10} r={14} fill="#10132a" />
				<circle cx={90} cy={-10} r={14} fill="#10132a" />
				<path d="M-90,100 Q0,170 90,100" stroke="#10132a" strokeWidth={10} fill="none" strokeLinecap="round" />
			</g>
		</Board>
	);
};

/* ---- 136 · Чирк. Два. ---- */
const W10: React.FC = () => {
	const {f, gf} = useShot();
	const pop = 1 + 0.28 * (f >= 86 ? Math.exp(-(f - 86) / 6) : 0);
	const sm = 1 - k(f, 84, 120);
	return (
		<Board tint="#141a48">
			<g transform={`translate(960,200) scale(${pop})`}>
				<AgeBadge x={0} y={0} value={counterAt(gf)} s={2.7} label="СВОБОДНЫХ ВЕЧЕРОВ" />
			</g>
			<DayCell x={960} y={640} s={0.72} wd="ПН" day={29} ico="cake" label="ДЕД + СОН" dual={f > 84} smolder={f > 84 ? sm * 0.5 : 0.5} flash={env(f, 84, 94, 3, 10)} />
			<Onoma x={1380} y={470} text="ЧИРК" t={f - 86} c="#5fe08a" size={110} />
		</Board>
	);
};

/* ---- 137–138 · вся семья у деда: торт «80», шахматы, очередь за шахматами ---- */
const Party: React.FC<{f: number; gf: number; story?: boolean; cakeOn?: boolean; extra?: React.ReactNode; dark?: number; mitya?: boolean}> = ({f, gf, story, cakeOn = true, extra, dark = 0, mitya = true}) => (
	<Stage cam={camOn(960, 580, 1.0)} bg="#d6b98e" light={WARM}>
		<Layer depth={1.6}>
			<GrandRoom f={gf} dark={dark} />
		</Layer>
		<Layer depth={1}>
			<Svg>
				<Actor who="mom" x={420} floor={FL} s={1.05} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" pose={idle(gf, 2)} uid="m90" />
				<Actor who="sis" x={650} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.8, 0]} pose={idle(gf, 3)} uid="s90" />
				{mitya ? <Actor who="hero" x={850} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} pose={idle(gf, 4)} uid="h90" /> : null}
				<Actor who="grandpa" x={1150} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={story ? {...idle(gf, 5), armF: [95, 10], armB: [-95, 10]} : idle(gf, 5)} uid="g90" />
				<Actor who="bro" x={1450} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={idle(gf, 6)} uid="b90" />
				{cakeOn ? (
					<g transform="translate(960,650)">
						<rect x={-80} y={-20} width={160} height={50} rx={10} fill="#f2a6c0" stroke="#10132a" strokeWidth={4} />
						<rect x={-60} y={-60} width={120} height={44} rx={8} fill="#fff" stroke="#10132a" strokeWidth={4} />
						{[-30, 0, 30].map((c) => (
							<g key={c}>
								<rect x={c - 4} y={-86} width={8} height={28} fill="#5ab0ff" />
								<ellipse cx={c} cy={-92} rx={6} ry={10} fill="#ffb400" />
							</g>
						))}
						<text y={20} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={900} fill="#10132a">
							80
						</text>
					</g>
				) : null}
				{extra}
			</Svg>
		</Layer>
	</Stage>
);
const W11: React.FC = () => {
	const {f, gf} = useShot();
	return (
		<>
			<Party f={f} gf={gf} />
			<Screen>
				<Plaque x={420} y={170} w={540} h={130} text="ДЕНЬ 29" size={84} c="#ffd34a" />
			</Screen>
		</>
	);
};
const W12: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(1000, 580, 1.05)], [150, camOn(1100, 560, 1.35)]]);
	return (
		<Stage cam={cam} bg="#d6b98e" light={WARM}>
			<Layer depth={1.6}>
				<GrandRoom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="sis" x={650} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.8, -0.5]} expr="wide" mouth="smile" pose={idle(gf, 3)} uid="s91" />
					<Actor who="hero" x={850} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} pose={idle(gf, 4)} uid="h91" />
					<Actor who="grandpa" x={1150} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} mouth={Math.floor(f / 4) % 2 ? 'open' : 'smile'} pose={{...idle(gf, 5), armF: [95 + 10 * Math.sin(f / 8), 10], armB: [-95, 10]}} uid="g91" />
					<Actor who="bro" x={1450} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={idle(gf, 6)} uid="b91" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 139 · брат смеётся над тортом; клетка 30 с чемоданом на краю ---- */
const W13: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(1100, 580, 1.3)], [150, camOn(1160, 570, 1.6)]]);
	return (
		<>
			<Stage cam={cam} bg="#d6b98e" light={WARM}>
				<Layer depth={1.6}>
					<GrandRoom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="bro" x={1150} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} expr="wide" mouth="open" pose={{...idle(gf, 6), lean: Math.sin(f / 4) * 4}} uid="b92" />
						<g transform="translate(760,650)">
							<rect x={-80} y={-20} width={160} height={50} rx={10} fill="#f2a6c0" stroke="#10132a" strokeWidth={4} />
							<rect x={-60} y={-60} width={120} height={44} rx={8} fill="#fff" stroke="#10132a" strokeWidth={4} />
						</g>
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<g transform="translate(1640,780)">
					<DayCell x={0} y={0} s={0.46} wd="ВТ" day={30} ico="suitcase" label="" />
				</g>
			</Screen>
		</>
	);
};

/* ---- 140 · 21:30: свет гаснет, Митя под пледом на диване ---- */
const W14: React.FC = () => {
	const {f, gf} = useShot();
	const walk = walkTo(f, 6, 60, 700, 1500, 4, 0.3);
	const sw = env(f, 62, 86, 6, 8);
	const gp = reach(walk.pose, 'F', toLocal(1620, 560, 1500, hip(1), 1, 1), sw);
	const dark = interpolate(f, [80, 92], [0, 0.78], clamp);
	const cam = camPath(f, [[0, camOn(1000, 590, 1.0)], [90, camOn(900, 600, 1.2)]]);
	return (
		<>
			<Stage cam={cam} bg="#2a2038" light={{x: 20, y: 10, o: 0.35}}>
				<Layer depth={1.6}>
					<GrandRoom f={gf} dark={dark / 0.78} />
				</Layer>
				<Layer depth={1.2}>
					<Svg>
						<rect x={200} y={760} width={560} height={140} rx={30} fill="#7a5cc4" stroke="#10132a" strokeWidth={5} />
						<rect x={1612} y={520} width={26} height={60} rx={6} fill="#e8e4d8" stroke="#10132a" strokeWidth={4} />
						<rect x={-700} y={-400} width={3300} height={1500} fill="#05061a" opacity={dark} />
					</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="grandpa" x={walk.x} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, -0.2]} pose={gp} vx={walk.vx} bob={walk.bob} uid="g93" />
						<Onoma x={1560} y={470} text="ЩЕЛК" t={f - 74} c="#fff3b0" size={64} />
						{f > 80 ? (
							<g opacity={k(f, 84, 100)}>
								<Sleeper x={470} y={770} s={1} expr="sleepy" />
								<rect x={330} y={742} width={380} height={90} rx={36} fill="#c9544a" stroke="#10132a" strokeWidth={5} />
							</g>
						) : null}
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={1500} y={150} w={440} h={150} text="21:30" size={110} c="#ff9a6a" />
			</Screen>
		</>
	);
};

/* ---- 141 · клетка 29 горит двумя цветами; табличка 1 ---- */
const W15: React.FC = () => {
	const {f, gf} = useShot();
	const pop = 1 + 0.28 * (f >= 106 ? Math.exp(-(f - 106) / 6) : 0);
	return (
		<Board tint="#141a48">
			<g transform={`translate(960,200) scale(${pop})`}>
				<AgeBadge x={0} y={0} value={counterAt(gf)} s={2.7} label="СВОБОДНЫХ ВЕЧЕРОВ" />
			</g>
			<DayCell x={960} y={620} s={0.72} wd="ПН" day={29} ico="cake" label="ДЕД + СОН" dual flash={0.6} />
			<g opacity={k(f, 30, 46)}>
				<Plaque x={960} y={900} w={1300} h={100} text="ПРОВЕРКА ПРОЙДЕНА" size={76} c="#5fe08a" />
			</g>
		</Board>
	);
};

/* ---- 142 · день 30, 7:00: костюм на стуле и записка «надень» ---- */
const W16: React.FC = () => {
	const {f, gf} = useShot();
	const up = k(f, 10, 40);
	const cam = camPath(f, [[0, camOn(900, 600, 1.0)], [100, camOn(980, 580, 1.25)]]);
	return (
		<>
			<Stage cam={cam} bg="#d6b98e" light={WARM}>
				<Layer depth={1.6}>
					<GrandRoom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<rect x={200} y={760} width={560} height={140} rx={30} fill="#7a5cc4" stroke="#10132a" strokeWidth={5} />
						<Actor who="hero" x={480} floor={FL} seat={760} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.2]} expr={up > 0.5 ? 'wide' : 'sleepy'} pose={{...SIT, lean: -4 + 6 * (1 - up)}} uid="h94" />
						<Plate x={480} yy={420} s={1.7} />
						<g transform="translate(1050,0)">
							<Chair x={0} y={800} facing={1} />
							<path d="M-80,520 L-20,500 L40,500 L100,520 L112,740 L66,744 L60,640 L-40,640 L-46,744 L-92,740 Z" fill="#2f6fd8" stroke="#10132a" strokeWidth={5} />
							<path d="M10,500 L30,560 L50,500 Z" fill="#fff" />
						</g>
						<g transform="translate(1180,600) rotate(5)">
							<rect x={-190} y={-80} width={380} height={160} rx={10} fill="#fbf8ef" stroke="#10132a" strokeWidth={6} />
							<text y={34} textAnchor="middle" fontSize={110} fontFamily={HAND} fontWeight={700} fill="#c9342a">
								надень
							</text>
						</g>
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={1500} y={150} w={440} h={150} text="07:00" size={110} c="#ffd34a" />
			</Screen>
		</>
	);
};

/* ---- 143 · пиджак великоват: у зеркала в прихожей деда ---- */
const W17: React.FC = () => {
	const {f, gf} = useShot();
	const refl = <Actor who="heroSuit" x={960} floor={700} s={0.8} facing={-1} faceTurn={0.15} look={[0, 0]} pose={idle(gf, 9)} uid="r95" shadow={false} />;
	const cam = camPath(f, [[0, camOn(820, 580, 1.1)], [90, camOn(800, 570, 1.4)]]);
	const p = reach(reach(idle(gf, 3), 'F', [26, -60], 0.9), 'B', [18, -52], 0.9);
	return (
		<Stage cam={cam} bg="#cfe6ee" light={{x: 20, y: 10, o: 0.3}}>
			<Layer depth={1.5}>
				<Bathroom f={gf} reflect={refl} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0.2]} pose={p} uid="h95" />
					<path d={`M${640 - 10},${hip(HS) - 190} L${640 + 90},${hip(HS) - 200} L${640 + 100},${hip(HS) + 40} L${640 + 20},${hip(HS) + 50} Z`} fill="#2f6fd8" stroke="#10132a" strokeWidth={5} />
					<path d={`M${640 + 90},${hip(HS) - 190} L${640 + 140},${hip(HS) + 130} L${640 + 100},${hip(HS) + 134} L${640 + 70},${hip(HS) - 130} Z`} fill="#2f6fd8" stroke="#10132a" strokeWidth={5} />
					<Plate x={640} yy={410} s={1.7} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 144 · Митя набирает номер ---- */
const W18: React.FC = () => {
	const {f, gf} = useShot();
	const ear = k(f, 20, 60);
	const p = reach(idle(gf, 3), 'F', toLocal(700, 520, 640, hip(HS), HS, 1), ear);
	const cam = camPath(f, [[0, camOn(850, 580, 1.0)], [96, camOn(780, 560, 1.4)]]);
	return (
		<Stage cam={cam} bg="#e6d8bc" light={WARM}>
			<Layer depth={1.6}>
				<Hall f={gf} box={false} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.2]} expr="worried" pose={p} uid="h96" />
					<g transform="translate(704,510) rotate(-12)">
						<rect x={-13} y={-26} width={26} height={48} rx={5} fill="#1b1e2a" stroke="#6f7bd8" strokeWidth={3} />
					</g>
					<Plate x={640} yy={410} s={1.7} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 145–146 · «Выключен»; потом лента: костюм → клетка 30, брат недоступен ---- */
const W19: React.FC = () => {
	const {f, at} = useShot();
	const a146 = at('146');
	const A = f < a146 + 40;
	const b = k(f, a146 + 40, a146 + 60);
	const arrow = k(f, a146 + 70, a146 + 130);
	return (
		<Board tint="#141a48">
			<Badge />
			{A ? (
				<g>
					<PhoneFrame x={600} y={560} w={720} h={740}>
						<Mini x={0} y={-200} c="#2f6fd8" hair="#5a3a22" s={2.2} />
						<text y={10} textAnchor="middle" fontSize={92} fontFamily={FONT} fontWeight={900} fill="#fff">
							БРАТ
						</text>
						<Plaque x={0} y={150} w={660} h={116} text="Абонент" size={86} c="#ff6a5a" />
						<Plaque x={0} y={290} w={660} h={116} text="недоступен" size={86} c="#ff6a5a" />
					</PhoneFrame>
					<g transform="translate(1480,640) rotate(-8)">
						<rect x={-190} y={-250} width={380} height={500} rx={46} fill="#07080f" stroke="#4a5164" strokeWidth={8} />
						<circle r={64} fill="none" stroke="#4a5164" strokeWidth={10} />
						<line x1={0} y1={-90} x2={0} y2={-20} stroke="#4a5164" strokeWidth={12} strokeLinecap="round" />
						<Plaque x={0} y={340} w={480} h={96} text="ВЫКЛЮЧЕН" size={64} c="#4a5164" />
					</g>
				</g>
			) : (
				<g opacity={b}>
					<Ribbon t={f} burned={[...CHARRED, 27]} cursor={0} mine={[28, 29]} />
					<g transform="translate(420,790) scale(1.2)">
						<path d="M-60,-70 L-20,-86 L20,-86 L60,-70 L72,-30 L100,60 L72,66 L56,10 L56,70 L-56,70 L-56,10 L-72,66 L-100,60 L-72,-30 Z" fill="#2f6fd8" stroke="#10132a" strokeWidth={5} />
						<path d="M-20,-86 L0,-40 L20,-86 Z" fill="#fff" stroke="#10132a" strokeWidth={4} />
					</g>
					<path d={`M560,780 Q1000,${700} ${560 + 1040 * arrow},690`} stroke="#ffd34a" strokeWidth={12} fill="none" strokeLinecap="round" opacity={arrow > 0 ? 1 : 0} />
					<g transform="translate(1690,690)">
						<Ico k="suitcase" x={0} y={0} s={0.7} />
					</g>
					<g transform="translate(1180,830)" opacity={k(f, a146 + 100, a146 + 120)}>
						<Mini x={-170} y={0} c="#8a92a8" hair="#6a7288" s={1.1} />
						<Plaque x={90} y={0} w={440} h={90} text="недоступен" size={56} c="#8a92a8" />
					</g>
					<Plaque x={960} y={290} w={1100} h={100} text="ПРОВОДЫ 19:00 — ВЕЧЕР 30" size={64} c="#ffd34a" />
				</g>
			)}
		</Board>
	);
};

/* ---- 147–148 · флешбек (две секунды): малыш, сестра; потом Чирк — табличка 0 ---- */
const W20: React.FC = () => {
	const {f, gf, at} = useShot();
	const a148 = at('148');
	const one = f < 36;
	const two = f >= 36 && f < a148 - 2;
	const chirk = f >= a148 - 2;
	const pop = 1 + 0.35 * (f >= a148 + 6 ? Math.exp(-(f - (a148 + 6)) / 6) : 0);
	if (chirk)
		return (
			<Board tint="#141a48">
				<g transform={`translate(960,430) scale(${pop})`}>
					<AgeBadge x={0} y={0} value={counterAt(gf)} s={3.2} label="СВОБОДНЫХ ВЕЧЕРОВ" />
				</g>
				<Onoma x={1460} y={300} text="ЧИРК" t={f - a148} c="#ff9a6a" size={130} />
			</Board>
		);
	return (
		<>
			<Stage cam={camOn(960, 580, one ? 1.15 : 1.25)} bg="#e6d8bc" light={WARM}>
				<Layer depth={1.6}>{one ? <Hall f={gf} box={false} /> : <KitchenK />}</Layer>
				<Layer depth={1}>
					<Svg>
						{one ? (
							<>
								<Actor who="kid" x={1180} floor={FL} s={0.8} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="wide" pose={gesture('wave', idle(gf, 3), 1, f)} uid="k97" />
								<rect x={1090} y={640} width={80} height={56} rx={6} fill="#e2483a" stroke="#10132a" strokeWidth={4} />
								<Actor who="heroSuit" x={640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} pose={idle(gf, 4)} uid="h97" />
								<Jacket p={idle(gf, 4)} x={640} facing={1} />
							</>
						) : (
							<>
								<Actor who="sis" x={1180} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={reach(idle(gf, 5), 'F', [44, -50], 0.8)} uid="s97" />
								<Mug x={1020} y={720} c="#3a6fd2" steam={1} f={f} />
								<Mug x={900} y={720} c="#e86aa0" steam={1} f={f} />
								<Actor who="heroSuit" x={640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} pose={idle(gf, 4)} uid="h97b" />
								<Jacket p={idle(gf, 4)} x={640} facing={1} />
							</>
						)}
					</Svg>
				</Layer>
			</Stage>
			<Sepia />
		</>
	);
};

/* ---- 149 · СМС: бронь на 19:00 отменена ---- */
const W21: React.FC = () => {
	const {f} = useShot();
	const a = k(f, 8, 24);
	return (
		<Board tint="#141a48">
			<Badge />
			<PhoneFrame y={600} w={1180} h={680}>
				<g opacity={a}>
					<rect x={-540} y={-290} width={1080} height={120} rx={46} fill="#3a4180" />
					<text x={-500} y={-208} fontSize={70} fontFamily={FONT} fontWeight={800} fill="#fff">
						СМС · РЕСТОРАН
					</text>
					<rect x={-540} y={-130} width={1080} height={330} rx={46} fill="#3a4180" />
					<text x={0} y={-10} textAnchor="middle" fontSize={88} fontFamily={FONT} fontWeight={900} fill="#fff">
						Бронь на 19:00
					</text>
					<text x={0} y={110} textAnchor="middle" fontSize={88} fontFamily={FONT} fontWeight={900} fill="#ff9a6a">
						отменена
					</text>
				</g>
			</PhoneFrame>
		</Board>
	);
};

/* ---- 150 · 17:00, актовый зал: «0,1 с», клетка 30 пополам ---- */
const W22: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(700, 600, 1.0)], [150, camOn(780, 580, 1.15)]]);
	return (
		<>
			<Stage cam={cam} bg="#1b1f40" light={{x: 20, y: 10, o: 0.3}}>
				<Layer depth={1.6}>
					<HallBack f={gf} smoke={0} disco={0} />
				</Layer>
				<Layer depth={1.1}>
					<Svg>
						{Array.from({length: 18}).map((_, i) => (
							<g key={i} transform={`translate(${130 + i * 105},${860 + (i % 3) * 20})`}>
								<circle r={44} fill="#0b0d1e" />
								<rect x={-40} y={30} width={80} height={80} rx={20} fill="#0b0d1e" />
							</g>
						))}
					</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="heroSuit" x={500} floor={FL - 60} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} expr="worried" pose={idle(gf, 3)} uid="h98" />
						<Plate x={500} yy={330} s={1.7} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={1540} y={160} w={500} h={140} text="0,1 с" size={104} c="#ffd34a" />
				<g transform="translate(1540,470)">
					<rect x={-250} y={-130} width={500} height={130} rx={30} fill="#fff6dc" stroke="#ffd34a" strokeWidth={8} />
					<text y={-40} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={900} fill="#10132a">
						17:00 КОНЦЕРТ
					</text>
					<rect x={-250} y={10} width={500} height={130} rx={30} fill="#2a1c1c" stroke="#ff6a3a" strokeWidth={8} />
					<text y={100} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={900} fill="#ff9a6a">
						19:00 ПРОВОДЫ
					</text>
					<path d="M-230,30 L230,120" stroke="#ff6a3a" strokeWidth={8} />
				</g>
			</Screen>
		</>
	);
};

/* ---- 151 · выход к микрофону, Тёма снимает ---- */
const W23: React.FC = () => {
	const {f, gf} = useShot();
	const w = walkTo(f, 10, 70, 420, 820, 3, 0.3);
	const cam = camPath(f, [[0, camOn(800, 600, 1.05)], [200, camOn(900, 570, 1.3)]]);
	const p = w.pose;
	return (
		<Stage cam={cam} bg="#1b1f40" light={{x: 20, y: 10, o: 0.3}}>
			<Layer depth={1.6}>
				<HallBack f={gf} smoke={0} disco={0} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<rect x={1000} y={560} width={8} height={300} fill="#cfd6e6" />
					<ellipse cx={1004} cy={552} rx={22} ry={30} fill="#3a4256" stroke="#10132a" strokeWidth={4} />
					<Actor who="heroSuit" x={w.x} floor={FL - 40} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={p} vx={w.vx} bob={w.bob} uid="h99" />
					<Jacket p={p} x={w.x} facing={1} />
					<Plate x={w.x} yy={380} s={1.7} />
					<Actor who="tema" x={1580} floor={FL + 80} s={0.8} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={reach(idle(gf, 4), 'F', [40, -110], 1)} uid="t99" />
					<g transform="translate(1530,640) rotate(-10)">
						<rect x={-14} y={-26} width={28} height={50} rx={5} fill="#1b1e2a" stroke="#6f7bd8" strokeWidth={3} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 152 · шаг, жест, пауза ---- */
const W24: React.FC = () => {
	const {f, gf} = useShot();
	const st = walkTo(f, 6, 40, 700, 860, 3, 0.3);
	const gest = env(f, 50, 120, 8, 30);
	const p = gesture('presentF', st.pose, gest, f);
	const words = [['ШАГ', 30], ['ЖЕСТ', 70], ['ПАУЗА', 120]] as [string, number][];
	return (
		<>
			<Stage cam={camPath(f, [[0, camOn(860, 600, 1.1)], [120, camOn(900, 580, 1.4)]])} bg="#1b1f40" light={{x: 20, y: 10, o: 0.3}}>
				<Layer depth={1.6}>
					<HallBack f={gf} smoke={0} disco={0} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<rect x={1000} y={560} width={8} height={300} fill="#cfd6e6" />
						<ellipse cx={1004} cy={552} rx={22} ry={30} fill="#3a4256" stroke="#10132a" strokeWidth={4} />
						<Actor who="heroSuit" x={st.x} floor={FL - 40} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={p} vx={st.vx} bob={st.bob} uid="h100" />
						<Jacket p={p} x={st.x} facing={1} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				{words.map(([t, a], i) => (
					<g key={t} opacity={k(f, a, a + 8)}>
						<Plaque x={1520} y={200 + i * 130} w={460} h={110} text={t} size={80} c={['#5fe08a', '#ffd34a', '#6aa8ff'][i]} />
					</g>
				))}
			</Screen>
		</>
	);
};

/* ---- 153 · «Добрый вечер. Начинаем.» в свете прожектора ---- */
const W25: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(960, 560, 1.3)], [51, camOn(960, 540, 1.7)]]);
	return (
		<Stage cam={cam} bg="#0b0d1e" light={false}>
			<Layer depth={1.6}>
				<Svg>
					<rect x={-700} y={-400} width={3300} height={1600} fill="#0b0d1e" />
					<path d="M900,-100 L1020,-100 L1260,900 L660,900 Z" fill="#fff3b0" opacity={0.28} />
					<ellipse cx={960} cy={905} rx={300} ry={40} fill="#fff3b0" opacity={0.3} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroSuit" x={960} floor={FL} s={HS} facing={1} faceTurn={0.2} look={[0.2, 0]} mouth={Math.floor(f / 4) % 2 ? 'open' : 'smile'} pose={idle(gf, 3)} uid="h101" />
					<Jacket p={idle(gf, 3)} x={960} facing={1} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 154 · зал смеётся; Аня хлопает; учительница: «Молодец, Митя.» ---- */
const W26: React.FC = () => {
	const {f, gf} = useShot();
	const clap = Math.abs(Math.sin(f / 3));
	const cam = camPath(f, [[0, camOn(960, 620, 1.0)], [100, camOn(1000, 600, 1.2)]]);
	return (
		<>
			<Stage cam={cam} bg="#0b0d1e" light={{x: 20, y: 10, o: 0.2}}>
				<Layer depth={1.6}>
					<Svg>
						<rect x={-700} y={-400} width={3300} height={1600} fill="#14183a" />
						<rect x={-700} y={800} width={3300} height={400} fill="#0b0d1e" />
					</Svg>
				</Layer>
				<Layer depth={1.2}>
					<Svg>
						{[0, 1, 2].map((r) =>
							Array.from({length: 9}).map((_, i) => (
								<g key={`${r}${i}`} transform={`translate(${160 + i * 200 + (r % 2) * 90},${620 + r * 130 - Math.abs(Math.sin(f / 5 + i + r)) * 18})`}>
									<circle r={40 - r * 4} fill="#0b0d1e" stroke="#2a2f63" strokeWidth={3} />
								</g>
							)),
						)}
					</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="anya" x={1340} floor={FL + 20} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="wide" mouth="open" pose={{...idle(gf, 5), armF: [30 + 30 * clap, 70], armB: [-30 - 30 * clap, 70]}} uid="a102" />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={430} y={170} w={560} h={130} text="ЗАЛ СМЕЁТСЯ" size={72} c="#5fe08a" />
				{f > 90 ? (
					<Bubble x={1300} y={200} w={820} h={150} t={f - 90} tail={[-160, 110]}>
						<text y={22} textAnchor="middle" fontSize={72} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Молодец, Митя.
						</text>
					</Bubble>
				) : null}
			</Screen>
		</>
	);
};

/* ---- 155 · пустой зал, складывают стулья, 21:05 ---- */
const W27: React.FC = () => {
	const {f, gf} = useShot();
	const w = walkTo(f, 4, 70, 300, 1100, 3, 0.3);
	const cam = camPath(f, [[0, camOn(800, 600, 1.0)], [75, camOn(960, 590, 1.12)]]);
	return (
		<>
			<Stage cam={cam} bg="#1b1f40" light={{x: 20, y: 10, o: 0.2}}>
				<Layer depth={1.6}>
					<HallBack f={gf} smoke={0} disco={0} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						{[1200, 1400, 1560].map((x, i) => (
							<Chair key={x} x={x} y={800} facing={1} />
						))}
						<Actor who="heroSuit" x={w.x} floor={FL - 20} s={HS} facing={1} faceTurn={0.3} look={[0.9, 0.1]} pose={reach(reach(w.pose, 'F', [30, -140], 0.9), 'B', [20, -130], 0.9)} vx={w.vx} bob={w.bob} uid="h103" />
						<Jacket p={reach(reach(w.pose, 'F', [30, -140], 0.9), 'B', [20, -130], 0.9)} x={w.x} facing={1} />
						<Chair x={w.x + 60} y={hip(HS) - 220} facing={1} />
						<Actor who="vovan" x={1000} floor={FL - 20} s={1} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={idle(gf, 7)} uid="v103" />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={1500} y={150} w={440} h={150} text="21:05" size={110} c="#ff9a6a" />
			</Screen>
		</>
	);
};

/* ---- 156 · ночная улица: ноль над головой отражается в луже ---- */
const W28: React.FC = () => {
	const {f, gf} = useShot();
	const w = walkTo(f, 4, 150, 200, 760, 3, 0.28);
	const cam = camPath(f, [[0, camOn(520, 600, 1.0)], [160, camOn(680, 640, 1.2)]]);
	return (
		<Stage cam={cam} bg="#0d1230" light={{x: 20, y: 10, o: 0.25}}>
			<Layer depth={1.6}>
				<NightLane f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroSuit" x={w.x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0.1]} pose={w.pose} vx={w.vx} bob={w.bob} uid="h104" />
					<Jacket p={w.pose} x={w.x} facing={1} />
					<Plate x={w.x} yy={400} s={2} />
					<ellipse cx={w.x} cy={950} rx={150} ry={20} fill="#6a86c8" opacity={0.35} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 157 · «Абонент недоступен» на улице ---- */
const W29: React.FC = () => {
	const {f, gf} = useShot();
	const ph = k(f, 10, 26);
	const p = reach(idle(gf, 3), 'F', [36, -80], 0.9);
	const cam = camPath(f, [[0, camOn(900, 600, 1.1)], [80, camOn(880, 590, 1.3)]]);
	return (
		<>
			<Stage cam={cam} bg="#0d1230" light={{x: 20, y: 10, o: 0.25}}>
				<Layer depth={1.6}>
					<NightLane f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="heroSuit" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.8]} expr="sad" pose={p} uid="h105" />
						<Jacket p={p} x={760} facing={1} />
						<Plate x={760} yy={400} s={1.8} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<g opacity={ph} transform="translate(1400,540)">
					<rect x={-330} y={-360} width={660} height={720} rx={64} fill="#07080f" stroke="#6f7bd8" strokeWidth={8} />
					<text y={-230} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#fff">
						БРАТ
					</text>
					<Plaque x={0} y={-30} w={600} h={130} text="Абонент" size={86} c="#ff6a5a" />
					<Plaque x={0} y={150} w={600} h={130} text="недоступен" size={86} c="#ff6a5a" />
				</g>
			</Screen>
		</>
	);
};

/* ---- 158 (начало) · тёмная прихожая, 21:38, ключ в замке ---- */
const W30: React.FC = () => {
	const {f, gf} = useShot();
	const open = k(f, 70, 110);
	const cam = camPath(f, [[0, camOn(1100, 580, 1.1)], [150, camOn(1000, 570, 1.3)]]);
	return (
		<>
			<Stage cam={cam} bg="#101225" light={{x: 20, y: 10, o: 0.2}}>
				<Layer depth={1.6}>
					<Hall f={gf} box={false} />
				</Layer>
				<Layer depth={1.1}>
					<Svg>
						<rect x={-700} y={-400} width={3300} height={1500} fill="#04051a" opacity={0.82} />
						<Onoma x={1480} y={500} text="КЛАЦ" t={f - 60} c="#ffd36a" size={70} />
					</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						<rect x={1360} y={230} width={300} height={670} rx={10} fill="#8a6a44" stroke="#10132a" strokeWidth={6} transform={`translate(${open * 40},0)`} opacity={0.6} />
						<Actor who="heroSuit" x={1180} floor={FL} s={HS} facing={-1} faceTurn={0.3} look={[-0.7, 0.2]} pose={idle(gf, 3)} uid="h106" />
						<Jacket p={idle(gf, 3)} x={1180} facing={-1} />
						<Plate x={1180} yy={400} s={1.8} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={400} y={170} w={440} h={150} text="21:38" size={110} c="#ffd34a" />
			</Screen>
		</>
	);
};

/* ---- 158 (конец, без реплики) · свет, чайник, три чашки ---- */
const W31: React.FC = () => {
	const {f, gf} = useShot();
	const lightT = 24;
	const dark = f < lightT ? 0.66 : interpolate(f, [lightT, lightT + 6], [0.66, 0], clamp);
	const walk = walkTo(f, 4, 22, 1600, 1230, 3, 0.3);
	const m = walkTo(f, 30, 50, 1230, 1070, 3, 0.3);
	const x = f < 30 ? walk.x : m.x;
	const p = f < 30 ? walk.pose : m.pose;
	const mugs = Number(f >= 90) + Number(f >= 106) + Number(f >= 122);
	const cam = camPath(f, [[0, camOn(1250, 560, 1.1)], [60, camOn(1150, 600, 1.25)], [130, camOn(1050, 620, 1.3)]]);
	return (
		<Stage cam={cam} bg="#14152e" light={{x: 20, y: 10, o: 0.3 + 0.2 * (1 - dark)}}>
			<Layer depth={1.6}>
				<KitchenK night />
				<Svg>
					<Bunch x={1000} y={410} n={5} s={0.55} />
					<Mug x={470} y={640} c="#e86aa0" />
					<Mug x={540} y={640} c="#3a6fd2" />
				</Svg>
			</Layer>
			<Layer depth={1.25}>
				<Svg>
					<ellipse cx={960} cy={720} rx={430} ry={46} fill="#8a7aa0" />
					<rect x={700} y={740} width={20} height={190} fill="#4a3d5a" />
					<rect x={1200} y={740} width={20} height={190} fill="#4a3d5a" />
					{[860, 1060, 1260].map((cx, i) => (mugs > i ? <Mug key={cx} x={cx} y={690} c={i ? '#3a6fd2' : '#f2b21c'} steam={1} f={f + i * 13} /> : null))}
				</Svg>
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<rect x={-700} y={-400} width={3300} height={1500} fill="#04051a" opacity={dark} />
					<Onoma x={1420} y={480} text="ЩЕЛК" t={f - lightT} c="#fff3b0" size={60} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroSuit" x={x} floor={FL} s={HS} facing={-1} faceTurn={0.5} look={[-0.6, 0.3]} pose={p} vx={f < 30 ? walk.vx : m.vx} bob={f < 30 ? walk.bob : m.bob} uid="h107" />
					<Jacket p={p} x={x} facing={-1} />
					<Plate x={x} warn={false} />
				</Svg>
			</Layer>
			<Layer depth={0.9}>
				<Svg>
					{[860, 1060, 1260].map((cx, i) => (
						<Onoma key={cx} x={cx} y={560} text="ТУК" t={f - (90 + i * 16)} c="#ffd36a" size={64} />
					))}
				</Svg>
			</Layer>
		</Stage>
	);
};

export const SHOTS4: ShotDef[] = [
	{at: '124', C: W1, whip: true},
	{at: '125', C: W2},
	{at: '126', C: W3},
	{at: '127', C: W4},
	{at: '128', C: W5, whip: true},
	{at: '129', C: W6, whip: true},
	{at: '130', C: W7, whip: true},
	{at: '132', C: W8, whip: true},
	{at: '133', C: W9, whip: true},
	{at: '136', C: W10, whip: true},
	{at: '137', C: W11, whip: true},
	{at: '138', C: W12},
	{at: '139', C: W13},
	{at: '140', C: W14, whip: true},
	{at: '141', C: W15, whip: true},
	{at: '142', C: W16, whip: true},
	{at: '143', C: W17, whip: true},
	{at: '144', C: W18, whip: true},
	{at: '145', C: W19, whip: true},
	{at: '147', C: W20, whip: true},
	{at: '149', C: W21, whip: true},
	{at: '150', C: W22, whip: true},
	{at: '151', C: W23},
	{at: '152', C: W24},
	{at: '153', C: W25},
	{at: '154', C: W26, whip: true},
	{at: '155', C: W27, whip: true},
	{at: '156', C: W28, whip: true},
	{at: '157', C: W29},
	{at: '158', C: W30, whip: true},
	{at: '158', off: 190, C: W31, whip: true},
];
