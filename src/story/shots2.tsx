import React from 'react';
import {interpolate, random} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {Chair} from '../engine/props';
import {blend, env, gesture, idle, reach, SIT, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {CrowdRow, Layer, Stage, Svg, camOn, clamp, ease} from '../kit/kit';
import {Bedroom, Blanket, ClassroomEve, Corridor, Elevator, Entrance, Kitchen, KitchenTable, SchoolYard, Shop} from '../kit/sets';
import {Bubble, Board, FONT, HAND, AgeBadge} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {FL, HS, Plate, Screen, camPath, hands, hip} from './common';
import {Face, Ico, Mini, Plaque, Ribbon, SchemeNote, WeekCal, Bathroom} from './places';
import {ClassroomClean, KitchenK, Battery, BusStop, Bus, CarSide, Cat, Camera, DayCell, FloodField, Gym, Hall, RoadTrees, kk} from './places2';

/* ===== Parts 4–6 (lines 036–089) ===== */
const WARM = {x: 20, y: 10, o: 0.4};
const k = kk;
export const slouch = (p: Pose, a = 1): Pose => ({...p, lean: p.lean + 9 * a, head: p.head + 16 * a});
export const hipsPose = (p: Pose, a: number): Pose => reach(reach(p, 'F', [34, -26], a), 'B', [-28, -26], a);
export const Badge: React.FC<{y?: number}> = ({y = 180}) => {
	const {gf} = useShot();
	return <AgeBadge x={960} y={y} value={counterAt(gf)} s={2.0} label="СВОБОДНЫХ ВЕЧЕРОВ" />;
};
export const Words: React.FC<{x: number; y: number; t: string; size?: number; c?: string}> = ({x, y, t, size = 84, c = '#fff'}) => (
	<text x={x} y={y} textAnchor="middle" fontSize={size} fontFamily={FONT} fontWeight={900} fill={c} stroke="#10132a" strokeWidth={size / 9} paintOrder="stroke">
		{t}
	</text>
);
export const Drop: React.FC<{f: number; x: number; y: number; on: number}> = ({f, x, y, on}) => (
	<g opacity={on}>
		{Array.from({length: 9}).map((_, i) => {
			const u = ((f / 14 + i / 9) % 1);
			return <circle key={i} cx={x + (random('dx' + i) - 0.5) * 90 * u} cy={y - u * 120 + u * u * 100} r={8 * (1 - u * 0.5)} fill="#bfe6ff" stroke="#6aa8ff" strokeWidth={2} opacity={1 - u * 0.6} />;
		})}
	</g>
);
export const Steam: React.FC<{x: number; y: number; f: number; z?: number}> = ({x, y, f, z = 1}) => (
	<g>
		{[0, 1, 2, 3].map((i) => {
			const u = ((f / 38 + i / 4) % 1);
			return <circle key={i} cx={x + Math.sin(u * 6 + i) * 14 * z} cy={y - u * 150 * z} r={(14 + u * 22) * z} fill="#fff" opacity={(1 - u) * 0.7} />;
		})}
	</g>
);

/* ---- 036–037 · ванная: умывание, Тёма в дверях ---- */
const T1: React.FC = () => {
	const {f, gf, at} = useShot();
	const a37 = at('037');
	const wash = env(f, 14, at('036') + 140, 12, 14);
	const bend = reach(reach({...idle(gf, 3), lean: 28 * wash, head: 22 * wash}, 'F', toLocal(950, 740, 900, hip(HS), HS, 1), wash), 'B', toLocal(1000, 740, 900, hip(HS), HS, 1), wash);
	const tp = gesture('point', idle(gf, 6), env(f, a37 + 6, a37 + 50, 8, 10), f);
	const refl = <Actor who="hero" x={960} floor={700} s={0.8} facing={-1} faceTurn={0.15} look={[0, 0]} pose={idle(gf, 9)} uid="r23" shadow={false} />;
	const cam = camPath(f, [[0, camOn(1000, 580, 1.05)], [a37, camOn(1100, 560, 1.15)], [a37 + 60, camOn(1150, 560, 1.3)]]);
	return (
		<Stage cam={cam} bg="#cfe6ee" light={{x: 20, y: 10, o: 0.35}}>
			<Layer depth={1.5}>
				<Bathroom f={gf} reflect={refl} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={900} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.6]} pose={bend} uid="h23" />
					<Drop f={f} x={960} y={740} on={wash} />
					<Plate x={900} yy={f < 2000 ? 400 : 400} />
					<Actor who="tema" x={1540} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.8, 0.1]} pose={tp} uid="t23" />
					<g transform="translate(1486,700) rotate(-10)">
						<rect x={-26} y={-34} width={52} height={68} rx={4} fill="#fbf8ef" stroke="#10132a" strokeWidth={4} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 038 · «жмёшь на сегодняшнюю клетку»: СР 3 FIFA, чирк ---- */
const T2: React.FC = () => {
	const {f, at} = useShot();
	const burn = k(f, 100, 124);
	const tap = env(f, 70, 94, 10, 10);
	return (
		<Board tint="#1a2150">
			<Badge />
			<DayCell x={960} y={590} s={0.9} wd="СР" day={3} ico="pad" label="FIFA С БРАТОМ" burn={burn} flash={env(f, 92, 100, 3, 8)} who={{c: '#2f6fd8', hair: '#5a3a22'}} />
			<g opacity={tap} transform={`translate(${1100 - 40 * tap},${760 - 60 * tap})`}>
				<circle r={60} fill="#fff" opacity={0.45} />
				<circle r={26} fill="#fff" />
			</g>
			<Onoma x={1380} y={500} text="ЧИРК" t={f - 106} c="#ff9a6a" size={110} />
		</Board>
	);
};

/* ---- 039 · спортзал: стена, пятки, лопатки, затылок ---- */
const T3: React.FC = () => {
	const {f, gf, at} = useShot();
	const L3 = [{t: 'ПЯТКИ', y: 190, a: 30}, {t: 'ЛОПАТКИ', y: 300, a: 80}, {t: 'ЗАТЫЛОК', y: 410, a: 130}];
	const cam = camPath(f, [[0, camOn(860, 580, 1.0)], [60, camOn(900, 570, 1.15)], [150, camOn(920, 560, 1.3)]]);
	return (
		<>
			<Stage cam={cam} bg="#e8dcc0" light={WARM}>
				<Layer depth={1.6}>
					<Gym f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="hero" x={690} floor={FL} s={HS} facing={1} faceTurn={0.2} look={[0.8, 0]} pose={{lean: -3, head: -2, armB: [-4, 8], armF: [4, 8], legB: [-2, 0], legF: [2, 0]}} uid="h24" />
						<Plate x={690} />
						{[{y: 890}, {y: 700}, {y: 560}].map((d, i) => (
							<circle key={i} cx={620} cy={d.y} r={14} fill="#ffd34a" stroke="#10132a" strokeWidth={4} opacity={k(f, L3[i].a, L3[i].a + 8)} />
						))}
						<Actor who="coach" x={1230} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.8, 0]} pose={gesture('point', idle(gf, 5), env(f, 20, 90, 8, 10), f)} uid="c24" />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				{L3.map((l, i) => {
					const u = k(f, l.a, l.a + 10);
					return u > 0 ? (
						<g key={i} opacity={u}>
							<Plaque x={1560} y={l.y} w={440} h={96} text={l.t} size={68} c="#ffd34a" />
						</g>
					) : null;
				})}
			</Screen>
		</>
	);
};

/* ---- 040 · суббота отдана: два улучшения — два вечера ---- */
const T4: React.FC = () => {
	const {f} = useShot();
	const burn6 = k(f, 58, 82);
	const u = k(f, 120, 134);
	return (
		<Board tint="#1a2150">
			<Badge />
			<DayCell x={560} y={540} s={0.8} wd="СР" day={3} ico="pad" label="FIFA" burn={1} />
			<DayCell x={1360} y={540} s={0.8} wd="СБ" day={6} ico="dice" label="НАСТОЛКИ" burn={burn6} flash={env(f, 50, 58, 3, 8)} />
			<Onoma x={1460} y={380} text="ЧИРК" t={f - 81} c="#ff9a6a" size={100} />
			<g opacity={u} transform={`translate(0,${(1 - u) * 20})`}>
				<Plaque x={960} y={870} w={1560} h={140} text="2 УЛУЧШЕНИЯ = 2 ВЕЧЕРА" size={100} c="#10132a" fg="#10132a" fill="#5fe08a" />
			</g>
		</Board>
	);
};

/* ---- 041 · комната брата: геймпад ломается ---- */
const T5: React.FC = () => {
	const {f, gf, at} = useShot();
	const crack = k(f, 50, 64);
	const p = reach(idle(gf, 2), 'F', [50, -70], 0.8);
	const h = hands(p, 960, 1, -1);
	const cam = camPath(f, [[0, camOn(900, 600, 1.1)], [60, camOn(940, 580, 1.4)], [150, camOn(960, 580, 1.55)]]);
	return (
		<>
			<Stage cam={cam} bg="#d8e8e6" light={WARM}>
				<Layer depth={1.6}>
					<Bedroom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="bro" x={960} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.6, 0.5]} expr={crack > 0.5 ? 'sad' : 'normal'} pose={p} uid="b25" />
						<g transform={`translate(${h.f[0] - 40},${h.f[1] - 20})`}>
							<g transform={`translate(${-60 * crack},${40 * crack}) rotate(${-24 * crack})`}>
								<path d="M-62,-30 L0,-30 L-6,0 L8,10 L0,32 L-62,32 Q-84,32 -84,0 Q-84,-30 -62,-30 Z" fill="#3a4256" stroke="#10132a" strokeWidth={5} />
							</g>
							<g transform={`translate(${60 * crack},${30 * crack}) rotate(${26 * crack})`}>
								<path d="M62,-30 L0,-30 L-6,0 L8,10 L0,32 L62,32 Q84,32 84,0 Q84,-30 62,-30 Z" fill="#3a4256" stroke="#10132a" strokeWidth={5} />
								<circle cx={38} cy={-8} r={8} fill="#ffd34a" />
							</g>
						</g>
						<Onoma x={h.f[0] - 40} y={h.f[1] - 120} text="ХРЯСЬ!" t={f - 52} c="#ff9a6a" size={92} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				{f > 78 ? (
					<Bubble x={1400} y={190} w={880} h={150} t={f - 78} tail={[-200, 110]}>
						<text y={24} textAnchor="middle" fontSize={72} fontFamily={FONT} fontWeight={800} fill="#10132a">
							В другой раз, Мить.
						</text>
					</Bubble>
				) : null}
			</Screen>
		</>
	);
};

/* ---- 042 · Тёма: «Нужно больше данных» ---- */
const T6: React.FC = () => {
	const {f, gf} = useShot();
	const bite = env(f, 10, 40, 6, 8);
	const p = reach(idle(gf, 5), 'F', [26, -128], bite);
	const bun = hands(p, 960, 1, -1).f;
	const cam = camPath(f, [[0, camOn(960, 560, 1.3)], [70, camOn(960, 540, 1.7)]]);
	return (
		<Stage cam={cam} bg="#f1e6c8" light={WARM}>
			<Layer depth={1.6}>
				<Corridor f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={960} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.2, 0.8]} expr="worried" pose={p} uid="t26" />
					<ellipse cx={bun[0]} cy={bun[1]} rx={26} ry={18} fill="#d9a05a" stroke="#10132a" strokeWidth={4} />
					<g transform="translate(1180,720) rotate(8)">
						<rect x={-70} y={-48} width={140} height={96} rx={6} fill="#fbf8ef" stroke="#10132a" strokeWidth={5} />
						<path d="M-50,-20 Q-20,-40 0,-10 T50,-20 M-50,10 L50,10" stroke="#3a6fd2" strokeWidth={6} fill="none" />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 043 · кот и зрительный контакт, 23:59 ---- */
const T7: React.FC = () => {
	const {f, gf} = useShot();
	const away = k(f, 120, 140);
	const cam = camPath(f, [[0, camOn(1180, 600, 1.0)], [100, camOn(1170, 590, 1.2)], [180, camOn(1160, 580, 1.35)]]);
	return (
		<>
			<Stage cam={cam} bg="#1d2550" light={{x: 20, y: 10, o: 0.3}}>
				<Layer depth={1.6}>
					<Bedroom night f={gf} />
				</Layer>
				<Layer depth={1.1}>
					<Svg>
						<Cat x={1020} y={900} s={1.5} facing={away > 0.5 ? -1 : 1} f={f} />
					</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Chair x={1380} y={800} facing={-1} />
						<Actor who="hero" x={1380} floor={FL} seat={790} s={HS} facing={-1} faceTurn={0.5} look={away > 0.5 ? [-0.2, 0.5] : [-1, 0.3]} expr={away > 0.5 ? 'sad' : 'wide'} pose={{...SIT, lean: 2, head: 4}} uid="h27" />
						<Plate x={1380} yy={440} s={1.9} />
					</Svg>
				</Layer>
				<Layer depth={0.9}>
					<Blanket night f={gf} />
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={300} y={150} w={440} h={150} text="23:59" size={110} c="#ff9a6a" />
			</Screen>
		</>
	);
};

/* ---- 044 · полночь: четверг обугливается сам ---- */
const T8: React.FC = () => {
	const {f, gf} = useShot();
	const burn = k(f, 90, 130);
	const hand = interpolate(f, [0, 80], [-14, 0], {...clamp, easing: ease});
	return (
		<Board tint="#141a48">
			<g transform={`translate(960,200) scale(${1 + 0.28 * Math.exp(-Math.max(0, f - 126) / 6) * (f >= 126 ? 1 : 0)})`}>
				<AgeBadge x={0} y={0} value={counterAt(gf)} s={2.7} label="СВОБОДНЫХ ВЕЧЕРОВ" />
			</g>
			{f >= 126 && f < 170 ? <Words x={1560} y={150 - (f - 126) * 1.6} t="−1" size={150} c="#ff6a5a" /> : null}
			<g transform="translate(520,660)">
				<circle r={250} fill="#11142c" stroke="#ffd34a" strokeWidth={14} />
				{Array.from({length: 12}).map((_, i) => (
					<line key={i} x1={0} y1={-228} x2={0} y2={-198} stroke="#8a92d8" strokeWidth={8} transform={`rotate(${i * 30})`} />
				))}
				<line x1={0} y1={0} x2={0} y2={-200} stroke="#ff6a5a" strokeWidth={12} strokeLinecap="round" transform={`rotate(${hand})`} />
				<line x1={0} y1={0} x2={0} y2={-120} stroke="#fff" strokeWidth={16} strokeLinecap="round" />
				<text y={150} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#fff">
					00:00
				</text>
			</g>
			<DayCell x={1400} y={660} s={0.8} wd="ЧТ" day={4} ico="knight" label="ШАХМАТЫ" burn={burn} who={{c: '#6b7f8e', hair: '#d0d4dc'}} />
		</Board>
	);
};

/* ---- 045 · дед на остановке, пустой автобус ---- */
const T9: React.FC = () => {
	const {f, gf} = useShot();
	const ear = env(f, 6, 100, 10, 10);
	const p = reach(idle(gf, 4), 'F', toLocal(820, 520, 820, hip(1), 1, 1), ear);
	const cam = camPath(f, [[0, camOn(900, 580, 1.0)], [100, camOn(960, 570, 1.25)]]);
	return (
		<Stage cam={cam} bg="#9fd2f0" light={WARM}>
			<Layer depth={1.6}>
				<BusStop f={gf} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Bus x={-780 + f * 18} y={400} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="grandpa" x={820} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.8, -0.1]} expr="worried" pose={p} uid="g28" />
					<g transform="translate(870,500) rotate(-12)">
						<rect x={-12} y={-24} width={24} height={44} rx={5} fill="#1b1e2a" stroke="#6f7bd8" strokeWidth={3} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 046–049 · лист ПРАВИЛА на холодильнике ---- */
const T10: React.FC = () => {
	const {f, at} = useShot();
	const a47 = at('047');
	const a48 = at('048');
	const a49 = at('049');
	const sheet = k(f, 2, 22);
	const R = [
		{a: a47 + 6, y: 410, t: '1. УЛУЧШЕНИЕ = 1 ВЕЧЕР'},
		{a: a48 + 6, y: 570, t: '2. ВЕЧЕР ВЫБИРАЕШЬ ТЫ'},
		{a: a49 + 6, y: 730, t: '3. ЗАНЯТЫЙ ВЕЧЕР —'},
	];
	return (
		<Board tint="#243060">
			<g opacity={sheet} transform={`translate(0,${(1 - sheet) * -40})`}>
				<rect x={220} y={120} width={1480} height={780} rx={18} fill="#fbf8ef" stroke="#10132a" strokeWidth={8} transform="rotate(-0.6 960 510)" />
				<circle cx={290} cy={170} r={26} fill="#e2483a" stroke="#10132a" strokeWidth={5} />
				<circle cx={1630} cy={170} r={26} fill="#3a6fd2" stroke="#10132a" strokeWidth={5} />
				<text x={960} y={270} textAnchor="middle" fontSize={130} fontFamily={HAND} fontWeight={700} fill="#c9342a">
					ПРАВИЛА
				</text>
				{R.map((r, i) => {
					const u = k(f, r.a, r.a + 12);
					return u > 0 ? (
						<g key={i} opacity={u} transform={`translate(0,${(1 - u) * 24})`}>
							<text x={290} y={r.y} fontSize={104} fontFamily={HAND} fontWeight={700} fill="#10132a">
								{r.t}
							</text>
							{i === 1 ? (
								<g transform={`translate(1560,${r.y - 36})`}>
									<circle r={60} fill="#fff" stroke="#10132a" strokeWidth={6} />
									<line x1={0} y1={0} x2={0} y2={-42} stroke="#10132a" strokeWidth={8} strokeLinecap="round" />
									<line x1={0} y1={0} x2={0} y2={-30} stroke="#c9342a" strokeWidth={6} strokeLinecap="round" />
								</g>
							) : null}
							{i === 2 ? (
								<text x={290} y={r.y + 120} fontSize={104} fontFamily={HAND} fontWeight={700} fill="#10132a">
									ВСТРЕЧИ НЕТ
								</text>
							) : null}
							{i === 2 ? (
								<g transform={`translate(1500,${r.y + 40})`}>
									<Ico k="pad" x={-70} y={-110} s={0.85} />
									<path d="M-70,-130 L-60,-90" stroke="#c9342a" strokeWidth={6} />
									<rect x={-20} y={-150} width={110} height={50} rx={12} fill="#e2483a" stroke="#10132a" strokeWidth={4} />
								</g>
							) : null}
						</g>
					) : null;
				})}
			</g>
		</Board>
	);
};

/* ---- 050 · прихожая: мама на смену, настолки на полке ---- */
const T11: React.FC = () => {
	const {f, gf} = useShot();
	const ear = env(f, 4, 140, 10, 10);
	const p = reach(idle(gf, 7), 'F', toLocal(1190, 470, 1150, hip(1), 1, 1), ear);
	const jack = env(f, 20, 100, 12, 12);
	const cam = camPath(f, [[0, camOn(900, 560, 1.0)], [80, camOn(1000, 560, 1.2)], [140, camOn(1100, 560, 1.35)]]);
	return (
		<Stage cam={cam} bg="#e6d8bc" light={WARM}>
			<Layer depth={1.6}>
				<Hall f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="mom" x={1150} floor={FL} s={1.05} facing={1} faceTurn={0.4} look={[0.6, 0.2]} pose={reach(p, 'B', [20, -60 - 20 * jack], jack * 0.5)} uid="m30" />
					<g transform="translate(1196,460) rotate(-12)">
						<rect x={-12} y={-24} width={24} height={44} rx={5} fill="#1b1e2a" stroke="#6f7bd8" strokeWidth={3} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 051–052 · Тёма пишет на холодильнике, уходит ---- */
const T12: React.FC = () => {
	const {f, gf, at} = useShot();
	const a52 = at('052');
	const write = env(f, 6, a52 + 40, 8, 8);
	const p0 = reach(idle(gf, 3), 'F', toLocal(1620, 540 + 30 * Math.sin(f / 3), 1480, hip(1), 1, 1), write);
	const go = walkTo(f, a52 + 130, a52 + 190, 1480, 2300, 3, 0.35);
	const x = f < a52 + 130 ? 1480 : go.x;
	const card = k(f, a52 + 10, a52 + 24);
	const cam = camPath(f, [[0, camOn(1300, 580, 1.15)], [a52, camOn(1400, 560, 1.3)], [a52 + 130, camOn(1250, 580, 1.1)]]);
	return (
		<>
			<Stage cam={cam} bg="#f3e6c4" light={WARM}>
				<Layer depth={1.6}>
					<KitchenK />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="tema" x={x} floor={FL} s={1} facing={f < a52 + 130 ? 1 : 1} faceTurn={0.4} look={[0.9, -0.2]} pose={f < a52 + 130 ? p0 : go.pose} vx={go.vx} bob={go.bob} uid="t31" />
						<Onoma x={1700} y={460} text="ХЛОП!" t={f - (a52 + 188)} c="#ffd36a" size={90} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				{card > 0 ? (
					<g opacity={card} transform={`translate(960,${230 + (1 - card) * -30})`}>
						<rect x={-780} y={-150} width={1560} height={330} rx={26} fill="#fbf8ef" stroke="#10132a" strokeWidth={8} />
						<text y={-20} textAnchor="middle" fontSize={116} fontFamily={HAND} fontWeight={700} fill="#c9342a">
							Занятый вечер —
						</text>
						<text y={110} textAnchor="middle" fontSize={116} fontFamily={HAND} fontWeight={700} fill="#c9342a">
							вечер без людей
						</text>
					</g>
				) : null}
			</Screen>
		</>
	);
};

/* ---- 053–054 · кухня, вечер, один; стучит малыш ---- */
const T13: React.FC = () => {
	const {f, gf, at} = useShot();
	const a54 = at('054');
	const kw = walkTo(f, a54 + 40, a54 + 90, 2250, 1380, 5, 0.3);
	const welcome = env(f, a54 + 96, a54 + 140, 8, 10);
	const hp = gesture('presentF', slouch(idle(gf, 3), 0.8 * (1 - welcome)), welcome, f);
	const kp = reach(kw.pose, 'F', [30, -40], 0.7);
	const kb = hands(kp, kw.x, 0.78, -1).f;
	const cam = camPath(f, [[0, camOn(1000, 580, 1.15)], [a54, camOn(1100, 580, 1.1)], [a54 + 100, camOn(1200, 580, 1.15)]]);
	return (
		<>
		<Stage cam={cam} bg="#2a2a48" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<KitchenK night />
			</Layer>
			<Layer depth={1.25}>
				<KitchenTable night mugs={1} />
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<rect x={1790} y={300} width={200} height={600} rx={8} fill="#8a6a44" stroke="#10132a" strokeWidth={6} />
					
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={960} floor={FL} s={HS} facing={f < a54 + 60 ? 1 : 1} faceTurn={0.4} look={[0.8, 0.2]} expr={welcome > 0.2 ? 'normal' : 'sad'} pose={hp} uid="h33" />
					<Plate x={960} />
					<Actor who="kid" x={kw.x} floor={FL} s={0.78} facing={-1} faceTurn={0.4} look={[-0.7, 0.1]} pose={kp} vx={kw.vx} bob={kw.bob} uid="k33" />
					<rect x={kb[0] - 36} y={kb[1] - 14} width={72} height={46} rx={6} fill="#e2483a" stroke="#10132a" strokeWidth={4} />
				</Svg>
			</Layer>
		</Stage>
		<Screen>
			<Onoma x={1500} y={330} text="ТУК-ТУК" t={f - (a54 + 24)} c="#ffd36a" size={90} />
		</Screen>
		</>
	);
};

/* ---- 055–056 · башня из кубиков растёт и закрывает правила ---- */
const T14: React.FC = () => {
	const {f, gf, at} = useShot();
	const a56 = at('056');
	const rows = Math.round(interpolate(f, [10, a56 - 4], [1, 13], {...clamp}));
	const place = env(f, a56 + 8, a56 + 40, 8, 10);
	const topY = 900 - rows * 56;
	const hp = reach(idle(gf, 3), 'F', toLocal(1560, topY - 30, 1260, hip(HS), HS, 1), place);
	const clap = Math.abs(Math.sin(f / 3)) * env(f, a56 + 30, 999, 6, 6);
	const kp = reach(reach(idle(gf, 4), 'F', [34, -80 + 8 * clap], clap), 'B', [30, -80 - 8 * clap], clap);
	const cam = camPath(f, [[0, camOn(1300, 600, 1.0)], [at('055') + 80, camOn(1350, 540, 0.95)], [a56, camOn(1400, 520, 1.0)]]);
	const colors = ['#e2483a', '#3a6fd2', '#ffd34a', '#3aa37a', '#8b5cf6', '#ff8a3a'];
	return (
		<Stage cam={cam} bg="#2a2a48" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<KitchenK night />
			</Layer>
			<Layer depth={1.25}>
				<Svg>
					<g transform="translate(1635,600) rotate(2)">
						<rect x={-95} y={-110} width={190} height={230} fill="#fbf8ef" stroke="#10132a" strokeWidth={4} />
						<text y={-60} textAnchor="middle" fontSize={34} fontFamily={HAND} fontWeight={700} fill="#c9342a">
							ПРАВИЛА
						</text>
						<path d="M-70,-20 H70 M-70,20 H70 M-70,60 H70" stroke="#10132a" strokeWidth={5} />
					</g>
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					{Array.from({length: rows}).map((_, r) =>
						[-1, 0, 1].map((c) => <rect key={`${r}${c}`} x={1635 + c * 56 + (r % 2) * 14 - 28} y={900 - (r + 1) * 56} width={54} height={54} rx={4} fill={colors[(r + c + 3) % 6]} stroke="#10132a" strokeWidth={4} />),
					)}
					<Actor who="hero" x={1260} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, -0.3]} pose={hp} uid="h34" />
					<Plate x={1060} yy={300} s={1.6} />
					<Actor who="kid" x={1440} floor={FL} s={0.78} facing={-1} faceTurn={0.4} look={[-0.2, -0.6]} expr={place > 0.5 ? 'wide' : 'normal'} pose={kp} uid="k34" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 057 · свет гаснет, табличка светится ---- */
const T15: React.FC = () => {
	const {f, gf} = useShot();
	const dark = f < 24 ? 0 : interpolate(f, [24, 30], [0, 0.9], clamp);
	const cam = camPath(f, [[0, camOn(980, 560, 1.15)], [60, camOn(980, 500, 1.5)]]);
	return (
		<Stage cam={cam} bg="#101225" light={{x: 20, y: 10, o: 0.3}}>
			<Layer depth={1.6}>
				<KitchenK night />
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<rect x={1388} y={520} width={24} height={64} rx={6} fill="#e8e4d8" stroke="#10132a" strokeWidth={4} />
					<Onoma x={1420} y={500} text="ЩЕЛК" t={f - 24} c="#fff3b0" size={60} />
					<rect x={-700} y={-400} width={3300} height={1500} fill="#02030f" opacity={dark} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<circle cx={960} cy={410} r={260} fill="#ffe08a" opacity={0.2 * dark} />
					<Actor who="hero" x={960} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.5]} pose={slouch(idle(gf, 3), 0.8)} uid="h35" />
					<Plate x={960} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 058 · ночь за монитором, 03:04 ---- */
const T16: React.FC = () => {
	const {f, gf} = useShot();
	const flick = 0.55 + 0.1 * Math.sin(f / 5);
	const cam = camPath(f, [[0, camOn(700, 600, 1.0)], [50, camOn(660, 590, 1.25)]]);
	return (
		<>
			<Stage cam={cam} bg="#101a3a" light={{x: 20, y: 10, o: 0.2}}>
				<Layer depth={1.6}>
					<Bedroom night f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Chair x={540} y={800} facing={-1} />
						<Actor who="hero" x={540} floor={FL} seat={790} s={HS} facing={-1} faceTurn={0.2} look={[-1, 0]} expr="sleepy" pose={{...SIT, lean: 8, head: 8, armF: [40, 60], armB: [36, 60]}} uid="h36" />
						<ellipse cx={420} cy={600} rx={260} ry={200} fill="#3d6fd6" opacity={0.28 * flick} />
						<Plate x={540} yy={430} s={1.9} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<Plaque x={1500} y={150} w={440} h={150} text="03:04" size={110} c="#6aa8ff" />
			</Screen>
		</>
	);
};

/* ---- 059 · утро: зеркало, помятый Митя ---- */
const T17: React.FC = () => {
	const {f, gf} = useShot();
	const refl = <Actor who="heroMess" x={960} floor={700} s={0.8} facing={-1} faceTurn={0.15} look={[0, 0]} expr="sleepy" pose={idle(gf, 9)} uid="r37" shadow={false} />;
	const cam = camPath(f, [[0, camOn(860, 580, 1.1)], [110, camOn(880, 540, 1.45)]]);
	return (
		<Stage cam={cam} bg="#cfe6ee" light={{x: 20, y: 10, o: 0.3}}>
			<Layer depth={1.5}>
				<Bathroom f={gf} reflect={refl} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroMess" x={620} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0.3]} expr="sleepy" pose={slouch(idle(gf, 5), 1)} uid="h37" />
					<Plate x={620} yy={400} s={1.9} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 060 · Швеция, 2010 ---- */
const T18: React.FC = () => {
	const {f} = useShot();
	return (
		<Board tint="#1a2150">
			<Plaque x={960} y={170} w={1200} h={170} text="ШВЕЦИЯ, 2010" size={120} c="#ffd34a" />
			{[0, 1, 2, 3, 4].map((i) => (
				<Camera key={i} x={310 + i * 325} y={560} s={1.75} flash={k(f, 30 + i * 22, 44 + i * 22)} />
			))}
			<g opacity={k(f, 100, 116)}>
				<Plaque x={960} y={880} w={900} h={140} text="23 ВЗРОСЛЫХ" size={100} c="#5fe08a" />
			</g>
		</Board>
	);
};

const Tired: React.FC<{x: number; y: number; tired?: boolean}> = ({x, y, tired}) => (
	<g transform={`translate(${x},${y})`}>
		<circle r={150} fill="#ffe0bd" stroke="#10132a" strokeWidth={8} />
		<circle cx={-52} cy={-24} r={16} fill="#10132a" />
		<circle cx={52} cy={-24} r={16} fill="#10132a" />
		{tired ? (
			<>
				<ellipse cx={-52} cy={6} rx={34} ry={14} fill="#8a6fb0" opacity={0.7} />
				<ellipse cx={52} cy={6} rx={34} ry={14} fill="#8a6fb0" opacity={0.7} />
				<path d="M-46,70 L46,76" stroke="#10132a" strokeWidth={9} strokeLinecap="round" />
			</>
		) : (
			<path d="M-50,56 Q0,100 50,56" stroke="#10132a" strokeWidth={9} fill="none" strokeLinecap="round" />
		)}
	</g>
);

/* ---- 061 · два кадра одного лица ---- */
const T19: React.FC = () => {
	const {f} = useShot();
	const u = k(f, 6, 22);
	const v = k(f, 90, 106);
	return (
		<Board tint="#1a2150">
			<g opacity={u}>
				<rect x={160} y={110} width={760} height={470} rx={30} fill="#fff6dc" stroke="#6aa8ff" strokeWidth={10} />
				<Tired x={540} y={345} />
				<Plaque x={540} y={660} w={640} h={110} text="ОБЫЧНЫЙ СОН" size={64} c="#6aa8ff" />
			</g>
			<g opacity={v}>
				<rect x={1090} y={130} width={600} height={470} rx={30} fill="#fff6dc" stroke="#ff9a3a" strokeWidth={10} />
				<Tired x={1390} y={365} tired />
				<Plaque x={1390} y={660} w={700} h={84} text="КОРОТКАЯ НОЧЬ +" size={56} c="#ff9a3a" />
				<Plaque x={1390} y={750} w={780} h={90} text="ДОЛГОЕ БОДРСТВОВАНИЕ" size={56} c="#ff9a3a" />
			</g>
			<SchemeNote />
		</Board>
	);
};

/* ---- 062 · две шкалы: усталый чуть выше, здоровый чуть ниже ---- */
const T20: React.FC = () => {
	const {f} = useShot();
	const g = k(f, 8, 70);
	const note = k(f, 120, 136);
	const bar = (x: number, h: number, c: string) => <rect x={x - 70} y={640 - h * g} width={140} height={h * g} rx={18} fill={c} stroke="#10132a" strokeWidth={5} />;
	return (
		<Board tint="#1a2150">
			<Plaque x={620} y={150} w={640} h={110} text="УСТАЛЫЙ" size={76} c="#ff9a3a" />
			<Plaque x={1300} y={150} w={640} h={110} text="ЗДОРОВЫЙ" size={76} c="#5fe08a" />
			{bar(450, 300, '#6aa8ff')}
			{bar(790, 350, '#ff9a3a')}
			{bar(1130, 370, '#6aa8ff')}
			{bar(1470, 340, '#ff9a3a')}
			<line x1={300} y1={642} x2={1620} y2={642} stroke="#8a92d8" strokeWidth={6} />
			<g transform="translate(0,0)">
				<rect x={300} y={676} width={44} height={44} rx={10} fill="#6aa8ff" />
				<text x={360} y={714} fontSize={58} fontFamily={FONT} fontWeight={800} fill="#fff">
					после сна
				</text>
				<rect x={780} y={676} width={44} height={44} rx={10} fill="#ff9a3a" />
				<text x={840} y={714} fontSize={58} fontFamily={FONT} fontWeight={800} fill="#fff">
					после короткой ночи
				</text>
			</g>
			<g opacity={note}>
				<Plaque x={960} y={790} w={900} h={96} text="разница небольшая" size={68} c="#ffd34a" />
			</g>
			<SchemeNote />
		</Board>
	);
};

/* ---- 063 · AASM 2016 ---- */
const T21: React.FC = () => {
	const {f} = useShot();
	const a = k(f, 4, 18);
	const b = k(f, 40, 56);
	const c = k(f, 80, 96);
	return (
		<Board tint="#1a2150">
			<g opacity={a}>
				<Words x={960} y={300} t="ПОДРОСТКАМ 13–18 ЛЕТ" size={110} />
			</g>
			<g opacity={b} transform={`translate(0,${(1 - b) * 30})`}>
				<Words x={960} y={560} t="8–10 ЧАСОВ СНА" size={170} c="#ffd34a" />
			</g>
			<g opacity={c}>
				<Plaque x={960} y={800} w={620} h={120} text="AASM, 2016" size={80} c="#6aa8ff" />
			</g>
		</Board>
	);
};

/* ---- 064–065 · «Ты спал четыре» → зевок на весь экран ---- */
const T22: React.FC = () => {
	const {f, gf, at} = useShot();
	const a65 = at('065');
	const fall = k(f, 4, 22);
	const w = walkTo(f, a65 + 8, a65 + 44, 470, 640, 2, 0.3);
	const yawn = env(f, a65 + 80, a65 + 140, 14, 16);
	const refl = <Actor who="heroMess" x={960} floor={700} s={0.8} facing={-1} faceTurn={0.15} look={[0, 0]} expr="sleepy" mouth={yawn > 0.4 ? 'open' : undefined} pose={idle(gf, 9)} uid="r38" shadow={false} />;
	const cam = camPath(f, [[0, camOn(900, 560, 1.1)], [a65 + 20, camOn(800, 560, 1.15)], [a65 + 90, camOn(700, 560, 1.4)], [a65 + 130, camOn(650, 500, 2.5)]]);
	return (
		<Stage cam={cam} bg="#cfe6ee" light={{x: 20, y: 10, o: 0.3}}>
			<Layer depth={1.5}>
				<Bathroom f={gf} reflect={refl} />
			</Layer>
			<Layer depth={1.15}>
				<Svg>
					<text x={960} y={interpolate(fall, [0, 1], [-100, 700])} textAnchor="middle" fontSize={300} fontFamily={FONT} fontWeight={900} fill="#ffd34a" stroke="#10132a" strokeWidth={14} paintOrder="stroke" opacity={f > a65 - 2 ? 0 : 1}>
						4
					</text>
					<Onoma x={960} y={560} text="ДЗЫНЬ!" t={f - 22} c="#ffe08a" size={90} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroMess" x={w.x} floor={FL} s={HS} facing={1} faceTurn={0.3} look={[0.9, 0.2]} expr="sleepy" mouth={yawn > 0.4 ? 'open' : undefined} pose={yawn > 0.2 ? {...idle(gf, 4), head: -8, lean: -4} : w.pose} vx={w.vx} bob={w.bob} uid="h38" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 066 · Тёма по видеосвязи, батарейка 3% ---- */
const T23: React.FC = () => {
	const {f, gf} = useShot();
	const chew = Math.abs(Math.sin(f / 4));
	const pop = k(f, 36, 50);
	const cam = camPath(f, [[0, camOn(960, 560, 1.0)], [90, camOn(980, 560, 1.12)]]);
	return (
		<Stage cam={cam} bg="#f1e6c8" light={WARM}>
			<Layer depth={1.6}>
				<Corridor f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="heroMess" x={560} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.4]} expr="sleepy" pose={slouch(idle(gf, 5), 1)} uid="h39" />
					<Plate x={560} yy={410} s={1.7} />
					<g transform="translate(1300,560)">
						<rect x={-250} y={-200} width={500} height={400} rx={26} fill="#11142c" stroke="#6f7bd8" strokeWidth={8} />
						<g transform="translate(0,20)">
							<circle r={96} fill="#ffe0bd" stroke="#10132a" strokeWidth={6} />
							<path d="M-96,-10 Q0,-130 96,-10 L96,-30 Q0,-120 -96,-30 Z" fill="#2f6fd8" stroke="#10132a" strokeWidth={5} />
							<circle cx={-32} cy={-8} r={11} fill="#10132a" />
							<circle cx={32} cy={-8} r={11} fill="#10132a" />
							<ellipse cx={0} cy={44} rx={30} ry={8 + 18 * chew} fill="#10132a" />
						</g>
					</g>
					{pop > 0 ? (
						<g opacity={pop} transform={`translate(0,${(1 - pop) * 20})`}>
							<Battery x={900} y={230} s={1.1} pct={0.08} low />
						</g>
					) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 067–069 · календарь в телефоне: листаешь, палец зависает ---- */
const T24: React.FC = () => {
	const {f, at} = useShot();
	const a69 = at('069');
	const idx = Math.min(6, Math.max(0, Math.floor((f - (a69 + 20)) / 26)));
	const fx = 62 + idx * 258 + 124;
	const finger = k(f, a69 + 10, a69 + 24);
	const T = [0, 0, 0, 0, 0, 0, 0];
	return (
		<Board tint="#1a2150">
			<WeekCal t={f + 30} times={T} open={1} />
			<g opacity={finger} transform={`translate(${fx},${600 + 20 * Math.sin(f / 6)})`}>
				<circle r={64} fill="#fff" opacity={0.4} />
				<circle r={26} fill="#fff" />
			</g>
		</Board>
	);
};

/* ---- 070–071 · «Сон подождёт»: табличка 24 не меняется; клетка 29 мигает ---- */
const T25: React.FC = () => {
	const {f, at} = useShot();
	const a71 = at('071');
	const blink = f > a71 + 6 ? (Math.floor((f - a71 - 6) / 7) % 2 === 0 ? 1 : 0.55) : 0;
	const u = k(f, a71 + 4, a71 + 16);
	return (
		<Board tint="#1a2150">
			<Badge />
			<g opacity={0.5 + 0.5 * u * (blink || 0.55)} transform={`translate(960,${560})`}>
				<DayCell x={0} y={0} s={0.8} wd="ПН" day={29} ico="cake" label="ДЕДУ 80" flash={blink > 0.9 ? 1 : 0} />
			</g>
			<g opacity={k(f, a71 + 40, a71 + 56)}>
				<Plaque x={960} y={880} w={1300} h={110} text="ПЕРВЫЙ РАЗ: ОТКАЗ" size={76} c="#ff9a6a" />
			</g>
		</Board>
	);
};

/* ---- 072 · ужин с мамой: клетка 7 светится ---- */
const T26: React.FC = () => {
	const {f, gf} = useShot();
	const put = env(f, 20, 80, 10, 14);
	const mp = reach(idle(gf, 3), 'F', toLocal(1010, 700, 1180, hip(1), 1, -1), put);
	const cam = camPath(f, [[0, camOn(1050, 580, 1.0)], [100, camOn(1000, 580, 1.2)]]);
	return (
		<>
			<Stage cam={cam} bg="#f3e6c4" light={WARM}>
				<Layer depth={1.6}>
					<KitchenK />
				</Layer>
				<Layer depth={1.25}>
					<KitchenTable mugs={0} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.2]} pose={idle(gf, 3)} uid="h40" />
						<Plate x={700} yy={400} s={1.7} />
						<Actor who="mom" x={1180} floor={FL} s={1.05} facing={-1} faceTurn={0.4} look={[-0.8, 0.3]} pose={mp} uid="m40" />
						<ellipse cx={940} cy={706} rx={64} ry={14} fill="#fff" stroke="#10132a" strokeWidth={4} opacity={k(f, 56, 66)} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<g transform="translate(1560,380)" opacity={k(f, 40, 56)}>
					<DayCell x={0} y={0} s={0.7} wd="ВС" day={7} ico="plate" label="УЖИН С МАМОЙ" flash={0.6} />
				</g>
			</Screen>
		</>
	);
};

/* ---- 073 · магазин: рубашка по размеру ---- */
const T27: React.FC = () => {
	const {f, gf, at} = useShot();
	const give = env(f, 24, 120, 10, 14);
	const sp = reach(idle(gf, 3), 'F', [46, -86], give);
	const sh = hands(sp, 1230, 1, -1).f;
	const cam = camPath(f, [[0, camOn(960, 580, 1.0)], [100, camOn(980, 570, 1.25)]]);
	return (
		<>
			<Stage cam={cam} bg="#f2efe6" light={WARM}>
				<Layer depth={1.6}>
					<Shop f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="hero" x={780} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.1]} pose={idle(gf, 3)} uid="h41" />
						<Plate x={780} yy={400} s={1.7} />
						<Actor who="seller" x={1230} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={sp} uid="s41" />
						<path d={`M${sh[0] - 40},${sh[1] - 10} l30,-26 l22,10 l22,-10 l30,26 l-20,16 l-8,-6 l0,50 l-48,0 l0,-50 l-8,6 Z`} fill="#6aa8ff" stroke="#10132a" strokeWidth={4} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				{f > 40 ? (
					<Bubble x={1300} y={190} w={800} h={190} t={f - 40} tail={[-200, 130]}>
						<text y={-10} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Вот ваш размер.
						</text>
						<text y={64} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Не на вырост.
						</text>
					</Bubble>
				) : null}
				<g transform="translate(300,690)" opacity={k(f, 104, 116)}>
					<DayCell x={0} y={0} s={0.62} wd="ЧТ" day={11} ico="knight" label="ШАХМАТЫ" burn={k(f, 112, 134)} />
				</g>
			</Screen>
		</>
	);
};

/* ---- 074 · голос: читает вслух, кот уходит ---- */
const T28: React.FC = () => {
	const {f, gf} = useShot();
	const catX = interpolate(f, [60, 170], [1180, -250], clamp);
	const cam = camPath(f, [[0, camOn(900, 600, 1.05)], [200, camOn(880, 590, 1.3)]]);
	return (
		<>
			<Stage cam={cam} bg="#d8e8e6" light={WARM}>
				<Layer depth={1.6}>
					<Bedroom f={gf} />
				</Layer>
				<Layer depth={1.1}>
					<Svg>
						<Cat x={catX} y={900} s={1.4} facing={-1} f={f} />
					</Svg>
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.6]} pose={reach(reach(idle(gf, 3), 'F', [48, -96], 0.9), 'B', [44, -100], 0.9)} uid="h42" />
						<Ico k="book" x={845} y={560} s={1.3} />
						<Plate x={760} yy={410} s={1.8} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				<g opacity={k(f, 150, 160)}>
					<DayCell x={1580} y={400} s={0.62} wd="ПТ" day={12} ico="popcorn" label="КИНО" burn={k(f, 156, 180)} />
				</g>
			</Screen>
		</>
	);
};

/* ---- 075 · день 11: дед и объявление ---- */
const T29: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(900, 580, 1.0)], [70, camOn(960, 560, 1.15)], [82, camOn(1180, 470, 2.0)], [150, camOn(1170, 470, 2.1)], [162, camOn(800, 540, 1.9)], [260, camOn(800, 530, 2.1)]]);
	return (
		<Stage cam={cam} bg="#e8dcc0" light={WARM}>
			<Layer depth={1.6}>
				<Entrance />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<g transform="translate(1180,470) rotate(-2)">
						<rect x={-250} y={-170} width={500} height={340} rx={8} fill="#fbf8ef" stroke="#10132a" strokeWidth={6} />
						<text y={-60} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#c9342a">
							СОБРАНИЕ
						</text>
						<text y={60} textAnchor="middle" fontSize={100} fontFamily={FONT} fontWeight={900} fill="#10132a">
							19:00
						</text>
					</g>
					<Actor who="grandpa" x={780} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, -0.2]} expr="worried" pose={gesture('rubChin', idle(gf, 3), env(f, 30, 120, 10, 10), f)} uid="g43" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 076–077 · день 12: Тёма уезжает на дачу ---- */
const T30: React.FC = () => {
	const {f, gf, at} = useShot();
	const wave = env(f, 14, 70, 8, 8);
	const cam = camPath(f, [[0, camOn(900, 580, 1.0)], [60, camOn(960, 570, 1.12)], [72, camOn(960, 540, 2.3)], [150, camOn(960, 530, 2.5)]]);
	return (
		<Stage cam={cam} bg="#9fd2f0" light={WARM}>
			<Layer depth={1.6}>
				<RoadTrees f={f} speed={f < at('077') ? 4 : 34} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<CarSide x={560} y={560}>
						<g transform="translate(400,40)">
							<circle r={44} fill="#ffe0bd" stroke="#10132a" strokeWidth={5} />
							<path d="M-44,-6 Q0,-70 44,-6 L44,-18 Q0,-60 -44,-18 Z" fill="#2f6fd8" stroke="#10132a" strokeWidth={4} />
							<circle cx={-14} cy={-2} r={6} fill="#10132a" />
							<circle cx={14} cy={-2} r={6} fill="#10132a" />
							<path d="M-12,22 Q0,30 12,22" stroke="#10132a" strokeWidth={5} fill="none" />
							<g transform={`translate(70,-10) rotate(${Math.sin(f / 3) * 28 * wave})`}>
								<circle r={13} fill="#ffe0bd" stroke="#10132a" strokeWidth={4} />
							</g>
						</g>
					</CarSide>
					<rect x={1180} y={640} width={30} height={46} rx={4} fill="#1b1e2a" stroke="#6f7bd8" strokeWidth={3} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 078–079 · «Это для концерта» печатается три раза мельче ---- */
const T31: React.FC = () => {
	const {f, gf, at} = useShot();
	const a79 = at('079');
	const refl = <Actor who="hero" x={960} floor={700} s={0.8} facing={-1} faceTurn={0.15} look={[0, 0]} pose={idle(gf, 9)} uid="r44" shadow={false} />;
	const cam = camPath(f, [[0, camOn(800, 600, 1.1)], [130, camOn(780, 590, 1.3)]]);
	return (
		<>
			<Stage cam={cam} bg="#cfe6ee" light={{x: 20, y: 10, o: 0.3}}>
				<Layer depth={1.5}>
					<Bathroom f={gf} reflect={refl} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="hero" x={640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={idle(gf, 5)} uid="h44" />
						<path d="M570,640 l30,-20 l30,20 l-12,16 l-4,-4 l0,100 l-28,0 l0,-100 l-4,4 Z" fill="#6aa8ff" stroke="#10132a" strokeWidth={3} opacity={0.0} />
						<Plate x={600} yy={410} s={1.7} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				{[0, 1, 2].map((i) => {
					const t0 = a79 + 4 + i * 28;
					const u = k(f, t0, t0 + 8);
					return u > 0 ? (
						<g key={i} opacity={u}>
							<Words x={960} y={120 + i * 80} t="ЭТО ДЛЯ КОНЦЕРТА" size={[76, 66, 58][i]} c="#ffd34a" />
						</g>
					) : null;
				})}
			</Screen>
		</>
	);
};

/* ---- 080 · день 13: четыре вечера оптом ---- */
const T32: React.FC = () => {
	const {f, gf} = useShot();
	const items = [
		{d: 15, ico: 'ball' as IcoKindLocal, t: 'ПРОГУЛКИ', a: 106},
		{d: 18, ico: 'knight' as IcoKindLocal, t: 'ШАГ И ЖЕСТЫ', a: 136},
		{d: 19, ico: 'popcorn' as IcoKindLocal, t: 'ВЫХОД', a: 166},
		{d: 20, ico: 'dice' as IcoKindLocal, t: 'ДИКЦИЯ', a: 196},
	];
	return (
		<Board tint="#1a2150">
			<g transform={`translate(960,200) scale(${1 + 0.3 * [106, 136, 166, 196].reduce((m, a) => Math.max(m, f >= a ? Math.exp(-(f - a) / 6) : 0), 0)})`}>
				<AgeBadge x={0} y={0} value={counterAt(gf)} s={2.7} label="СВОБОДНЫХ ВЕЧЕРОВ" />
			</g>
			{[106, 136, 166, 196].map((a) => (f >= a && f < a + 28 ? <Words key={a} x={1660} y={170 - (f - a) * 1.5} t="−1" size={120} c="#ff6a5a" /> : null))}
			{items.map((it, i) => {
				const u = 0.45 + 0.55 * k(f, it.a - 60, it.a - 44);
				const b = k(f, it.a, it.a + 18);
				return (
					<g key={i} opacity={u}>
						<g transform={`translate(${360 + i * 400},640) scale(0.7)`}>
							<rect x={-250} y={-310} width={500} height={620} rx={40} fill="#fff6dc" stroke="#ffd34a" strokeWidth={10} />
							<text y={-120} textAnchor="middle" fontSize={230} fontFamily={FONT} fontWeight={900} fill="#10132a">
								{it.d}
							</text>
							<Ico k={it.ico} x={0} y={60} s={1.9} />
							<text y={250} textAnchor="middle" fontSize={it.t.length > 8 ? 62 : 74} fontFamily={FONT} fontWeight={900} fill="#10132a">
								{it.t}
							</text>
							<rect x={-250} y={-310} width={500} height={620} rx={40} fill="#1a0f0f" opacity={0.88 * b} />
							{b > 0.5 ? <path d="M-190,-250 L190,250 M190,-250 L-190,250" stroke="#ff6a3a" strokeWidth={18} strokeLinecap="round" /> : null}
						</g>
						<Onoma x={360 + i * 400} y={380} text="ЧИРК" t={f - it.a} c="#ff9a6a" size={80} />
					</g>
				);
			})}
		</Board>
	);
};
type IcoKindLocal = 'ball' | 'knight' | 'popcorn' | 'dice';

/* ---- 081 · спортзал: шаг к микрофону, Тёма — руки в боки ---- */
const T33: React.FC = () => {
	const {f, gf} = useShot();
	const hips = env(f, 14, 60, 8, 8);
	const st = walkTo(f, 4, 34, 560, 760, 2, 0.3);
	const cam = camPath(f, [[0, camOn(900, 580, 1.0)], [60, camOn(940, 570, 1.12)]]);
	return (
		<Stage cam={cam} bg="#e8dcc0" light={WARM}>
			<Layer depth={1.6}>
				<Gym f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<rect x={860} y={560} width={8} height={340} fill="#3a4256" />
					<ellipse cx={864} cy={552} rx={22} ry={30} fill="#3a4256" stroke="#10132a" strokeWidth={4} />
					<Actor who="hero" x={st.x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} pose={gesture('presentF', st.pose, env(f, 36, 64, 6, 6), f)} vx={st.vx} bob={st.bob} uid="h45" />
					<Plate x={660} />
					<Actor who="coach" x={420} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.8, 0]} uid="c45" />
					<Actor who="tema" x={1280} floor={FL} s={1.0} facing={-1} faceTurn={0.4} look={[-0.8, -0.2]} expr="wide" pose={{...hipsPose(idle(gf, 4), hips), lean: -6 * hips}} uid="t45" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 082 · поза супергероя: 200 участников ---- */
const T34: React.FC = () => {
	const {f} = useShot();
	const a = k(f, 6, 20);
	const b = k(f, 70, 86);
	const c = k(f, 130, 146);
	return (
		<Board tint="#1a2150">
			<g opacity={a}>
				<Plaque x={960} y={200} w={1200} h={150} text="200 УЧАСТНИКОВ" size={100} c="#ffd34a" />
			</g>
			<g opacity={b}>
				<Plaque x={960} y={430} w={1300} h={150} text="ГОРМОНЫ — НЕТ" size={100} c="#ff6a5a" />
			</g>
			<g opacity={c}>
				<Plaque x={960} y={660} w={1480} h={150} text="ЧУВСТВО УВЕРЕННОСТИ — ДА" size={90} c="#5fe08a" />
			</g>
			<g opacity={k(f, 160, 176)}>
				<Plaque x={960} y={850} w={760} h={96} text="Ranehill и др., 2015" size={56} c="#6aa8ff" />
			</g>
		</Board>
	);
};

/* ---- 083 · «Мне и чувство пригодится» + нарезка: скороговорки под дождём ---- */
const T35: React.FC = () => {
	const {f, gf} = useShot();
	const gym = f < 24;
	const hips = env(f, 2, 20, 6, 6);
	const walk = walkTo(f, 26, 80, 300, 1500, 3, 0.4);
	return (
		<Stage cam={camOn(960, 560, gym ? 1.15 : 1.0)} bg={gym ? '#e8dcc0' : '#8fa2b4'} light={WARM}>
			<Layer depth={1.6}>{gym ? <Gym f={gf} /> : <RoadTrees f={f} speed={14} />}</Layer>
			<Layer depth={1}>
				<Svg>
					{gym ? (
						<>
							<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, -0.1]} pose={hipsPose(idle(gf, 2), hips)} uid="h46" />
							<Actor who="tema" x={1100} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} pose={hipsPose(idle(gf, 4), 1)} uid="t46" />
						</>
					) : (
						<>
							{Array.from({length: 26}).map((_, i) => (
								<line key={i} x1={(i * 83 + f * 9) % 1980} y1={(i * 131 + f * 28) % 1100 - 60} x2={((i * 83 + f * 9) % 1980) - 14} y2={((i * 131 + f * 28) % 1100) + 10} stroke="#bfe6ff" strokeWidth={4} opacity={0.7} />
							))}
							<Actor who="hero" x={walk.x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} mouth={Math.floor(f / 3) % 2 ? 'open' : 'line'} pose={walk.pose} vx={walk.vx} bob={walk.bob} uid="h47" />
							<path d={`M${walk.x - 80},${hip(HS) - 190} Q${walk.x},${hip(HS) - 290} ${walk.x + 80},${hip(HS) - 190} Z`} fill="#e2483a" stroke="#10132a" strokeWidth={5} />
							<line x1={walk.x} y1={hip(HS) - 190} x2={walk.x + 10} y2={hip(HS) - 40} stroke="#10132a" strokeWidth={6} />
						</>
					)}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 084 (начало) · день 15: футбольное поле залито ---- */
const T36: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(900, 600, 1.0)], [70, camOn(940, 600, 1.2)]]);
	return (
		<>
		<Stage cam={cam} bg="#8fa2b4" light={WARM}>
			<Layer depth={1.6}>
				<FloodField f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="vovan" x={900} floor={FL - 40} s={1} facing={1} faceTurn={0.4} look={[0.4, 0.8]} expr="worried" pose={gesture('shrug', idle(gf, 3), env(f, 20, 60, 8, 10), f)} uid="v48" />
					<circle cx={1080} cy={830} r={28} fill="#fff" stroke="#10132a" strokeWidth={5} />
				</Svg>
			</Layer>
		</Stage>
		<Screen>
			<Plaque x={400} y={170} w={460} h={130} text="ДЕНЬ 15" size={90} c="#ffd34a" />
		</Screen>
		</>
	);
};

/* ---- 084 (конец) · день 18: лифт не работает ---- */
const T37: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(1000, 560, 1.0)], [70, camOn(1100, 520, 1.3)]]);
	return (
		<>
		<Stage cam={cam} bg="#9aa3b8" light={WARM}>
			<Layer depth={1.6}>
				<Elevator f={0} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<g transform="translate(1180,350) rotate(3)">
						<rect x={-230} y={-90} width={460} height={180} rx={10} fill="#fbf8ef" stroke="#10132a" strokeWidth={6} />
						<text y={-6} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#c9342a">
							НЕ
						</text>
						<text y={64} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#c9342a">
							РАБОТАЕТ
						</text>
					</g>
					<Actor who="grandpa" x={800} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, -0.1]} expr="worried" pose={gesture('stop', idle(gf, 3), 0, f)} uid="g49" />
				</Svg>
			</Layer>
		</Stage>
		<Screen>
			<Plaque x={400} y={170} w={460} h={130} text="ДЕНЬ 18" size={90} c="#ffd34a" />
		</Screen>
		</>
	);
};

/* ---- 085 · день 19: Тёма в дверях, за спиной родственники ---- */
const T38: React.FC = () => {
	const {f, gf} = useShot();
	const cam = camPath(f, [[0, camOn(1000, 580, 1.0)], [100, camOn(1000, 560, 1.1)]]);
	return (
		<>
		<Stage cam={cam} bg="#e6d8bc" light={WARM}>
			<Layer depth={1.6}>
				<Hall f={gf} box={false} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<CrowdRow n={6} x0={1080} x1={1600} floor={FL} s={0.92} mode="stand" seed="aunt" />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={820} floor={FL} s={1.05} facing={1} faceTurn={0.4} look={[0.8, 0.1]} expr="worried" pose={gesture('shrug', idle(gf, 3), env(f, 24, 80, 8, 10), f)} uid="t50" />
				</Svg>
			</Layer>
		</Stage>
		<Screen>
			<Plaque x={400} y={170} w={460} h={130} text="ДЕНЬ 19" size={90} c="#ffd34a" />
		</Screen>
		</>
	);
};

/* ---- 086 · зеркало: ровная спина, «Добрый вечер» ---- */
const T39: React.FC = () => {
	const {f, gf} = useShot();
	const refl = <Actor who="hero" x={960} floor={700} s={0.8} facing={-1} faceTurn={0.15} look={[0, 0]} pose={{...idle(gf, 9), lean: -2}} uid="r51" shadow={false} />;
	const cam = camPath(f, [[0, camOn(820, 580, 1.1)], [110, camOn(840, 560, 1.35)]]);
	return (
		<>
			<Stage cam={cam} bg="#cfe6ee" light={{x: 20, y: 10, o: 0.3}}>
				<Layer depth={1.5}>
					<Bathroom f={gf} reflect={refl} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="hero" x={640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, -0.05]} pose={{...idle(gf, 5), lean: -3, head: -3}} uid="h51" />
						<Plate x={640} yy={400} s={1.7} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				{f > 36 ? (
					<Bubble x={1400} y={190} w={820} h={150} t={f - 36} tail={[-260, 110]}>
						<text y={24} textAnchor="middle" fontSize={72} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Добрый вечер.
						</text>
					</Bubble>
				) : null}
			</Screen>
		</>
	);
};

/* ---- 087 · у доски: запинается, выдыхает, договаривает ---- */
const T40: React.FC = () => {
	const {f, gf} = useShot();
	const stum = env(f, 8, 36, 6, 8);
	const breathe = env(f, 40, 62, 8, 10);
	const p = {...idle(gf, 3), lean: 6 * stum - 4 * breathe, head: 10 * stum - 6 * breathe};
	const cam = camPath(f, [[0, camOn(760, 560, 1.1)], [60, camOn(780, 540, 1.4)]]);
	return (
		<Stage cam={cam} bg="#e9d9ae" light={WARM}>
			<Layer depth={1.6}>
				<ClassroomClean />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, stum > 0.3 ? 0.6 : 0]} expr={stum > 0.3 ? 'worried' : 'normal'} mouth={breathe > 0.4 ? 'open' : undefined} pose={p} uid="h52" />
					<Plate x={760} yy={400} s={1.7} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ---- 088 · Аня оборачивается, Митя кивает, уши краснеют ---- */
const T41: React.FC = () => {
	const {f, gf} = useShot();
	const turn = k(f, 30, 46);
	const ears = k(f, 90, 120);
	const cam = camPath(f, [[0, camOn(980, 580, 1.1)], [150, camOn(1000, 560, 1.35)]]);
	const nod = env(f, 84, 130, 10, 10);
	return (
		<>
			<Stage cam={cam} bg="#e9d9ae" light={WARM}>
				<Layer depth={1.6}>
					<ClassroomClean />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Actor who="anya" x={1180} floor={FL} s={1} facing={turn > 0.5 ? -1 : 1} faceTurn={0.4} look={[turn > 0.5 ? -0.8 : 0.5, 0]} pose={idle(gf, 6)} uid="a53" />
						<Actor who="hero" x={780} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.1]} expr={ears > 0.4 ? 'worried' : 'normal'} pose={{...idle(gf, 3), head: 12 * nod}} uid="h53" />
						<circle cx={753} cy={hip(HS) - 164 * HS + 6} r={11} fill="#ff6a5a" opacity={0.85 * ears} />
						<circle cx={808} cy={hip(HS) - 164 * HS + 6} r={11} fill="#ff6a5a" opacity={0.85 * ears} />
						<Plate x={780} yy={400} s={1.6} />
					</Svg>
				</Layer>
			</Stage>
			<Screen>
				{f > 24 ? (
					<Bubble x={1320} y={190} w={900} h={190} t={f - 24} tail={[-160, 130]}>
						<text y={-6} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Ты постригся?
						</text>
						<text y={68} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#10132a">
							Я сначала не узнала.
						</text>
					</Bubble>
				) : null}
			</Screen>
		</>
	);
};

/* ---- 089 · табличка 10; до концерта 11 дней ---- */
const T42: React.FC = () => {
	const {f, gf} = useShot();
	const u = k(f, 8, 24);
	const w = k(f, 70, 88);
	const charred = [2, 3, 4, 6, 11, 12, 15, 18, 19, 20];
	return (
		<Board tint="#141a48">
			<g transform={`translate(960,200) scale(${0.8 + 0.2 * u})`} opacity={u}>
				<AgeBadge x={0} y={0} value={counterAt(gf)} s={2.6} label="СВОБОДНЫХ ВЕЧЕРОВ" />
			</g>
			<Ribbon t={f} burned={charred} cursor={0} mine={[21, 30]} />
			<g opacity={w}>
				<Plaque x={960} y={820} w={1400} h={130} text="ДО КОНЦЕРТА 11 ДНЕЙ" size={96} c="#ffd34a" />
			</g>
		</Board>
	);
};

export const SHOTS2: ShotDef[] = [
	{at: '036', C: T1, whip: true},
	{at: '038', C: T2},
	{at: '039', C: T3, whip: true},
	{at: '040', C: T4},
	{at: '041', C: T5, whip: true},
	{at: '042', off: 25, C: T6, whip: true},
	{at: '043', C: T7, whip: true},
	{at: '044', C: T8},
	{at: '045', C: T9, whip: true},
	{at: '046', C: T10, whip: true},
	{at: '050', C: T11, whip: true},
	{at: '051', C: T12, whip: true},
	{at: '053', C: T13, whip: true},
	{at: '055', C: T14},
	{at: '057', C: T15},
	{at: '058', C: T16, whip: true},
	{at: '059', C: T17, whip: true},
	{at: '060', C: T18, whip: true},
	{at: '061', C: T19},
	{at: '062', C: T20},
	{at: '063', C: T21},
	{at: '064', C: T22, whip: true},
	{at: '066', C: T23, whip: true},
	{at: '067', C: T24, whip: true},
	{at: '070', C: T25},
	{at: '072', C: T26, whip: true},
	{at: '073', C: T27, whip: true},
	{at: '074', C: T28, whip: true},
	{at: '075', C: T29, whip: true},
	{at: '076', C: T30, whip: true},
	{at: '078', C: T31, whip: true},
	{at: '080', C: T32, whip: true},
	{at: '081', C: T33, whip: true},
	{at: '082', C: T34, whip: true},
	{at: '083', C: T35, whip: true},
	{at: '084', C: T36, whip: true},
	{at: '084', off: 76, C: T37, whip: true},
	{at: '085', C: T38, whip: true},
	{at: '086', C: T39, whip: true},
	{at: '087', C: T40, whip: true},
	{at: '088', C: T41},
	{at: '089', C: T42, whip: true},
];
