/* Locations and cards of parts 4–6 (lines 036–089). Every plate keeps ≥ 60 px from the frame edge. */
import React from 'react';
import {interpolate} from 'remotion';
import {Svg} from '../engine/camera';
import {clamp, ease} from '../kit/kit';
import {FONT} from '../kit/ui';
import {ClassroomEve, Kitchen} from '../kit/sets';
import {Wall, Ground, Ico, IcoKind, Mini, Plaque} from './places';

export const kk = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});

/* школьный спортзал: шведская стенка, мат, баскетбольное кольцо */
export const Gym: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="gy-w" top="#e8dcc0" bot="#d4c39a" />
		<rect x={-700} y={560} width={3300} height={30} fill="#9a7a58" />
		{Array.from({length: 4}).map((_, b) => (
			<g key={b}>
				<rect x={120 + b * 130} y={200} width={14} height={700} fill="#8a6a44" />
				{Array.from({length: 12}).map((__, i) => (
					<rect key={i} x={120 + b * 130} y={230 + i * 56} width={130} height={8} fill="#a8824f" />
				))}
			</g>
		))}
		<rect x={1500} y={180} width={260} height={170} rx={8} fill="#fff" stroke="#c9544a" strokeWidth={10} />
		<rect x={1580} y={280} width={100} height={70} fill="none" stroke="#c9544a" strokeWidth={8} />
		<path d="M1590,350 L1600,420 M1670,350 L1660,420 M1630,350 L1630,420" stroke="#fff" strokeWidth={5} />
		<ellipse cx={1000} cy={910} rx={420} ry={34} fill="#3a6fd2" />
		<ellipse cx={1000} cy={904} rx={400} ry={26} fill="#4a86ee" />
		<Ground y={900} c="#d9b57a" />
		<ellipse cx={960} cy={40} rx={800} ry={240} fill="#fff6dd" opacity={0.2 + 0.02 * Math.sin(f / 30)} />
	</Svg>
);

/* прихожая: вешалка, полка с коробкой, дверь */
export const Hall: React.FC<{f: number; box?: boolean}> = ({f, box = true}) => (
	<Svg>
		<Wall id="hl-w" top="#e6d8bc" bot="#d4c298" />
		<rect x={1360} y={230} width={300} height={670} rx={10} fill="#8a6a44" stroke="#10132a" strokeWidth={6} />
		<circle cx={1400} cy={600} r={14} fill="#ffd34a" />
		<rect x={150} y={250} width={280} height={14} fill="#5a3a22" />
		{[0, 1, 2].map((i) => (
			<g key={i}>
				<rect x={190 + i * 90} y={264} width={10} height={36} fill="#5a3a22" />
				<circle cx={195 + i * 90} cy={312} r={14} fill="#ffd34a" />
			</g>
		))}
		<rect x={600} y={400} width={560} height={16} fill="#5a3a22" />
		{box ? (
			<g transform="translate(880,336)">
				<rect x={-190} y={-84} width={380} height={98} rx={8} fill="#3a6fd2" stroke="#10132a" strokeWidth={5} />
				<text y={-12} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
					НАСТОЛКИ
				</text>
			</g>
		) : null}
		<Ground y={900} c="#b9a27c" />
		<ellipse cx={900} cy={60} rx={700} ry={220} fill="#fff6dd" opacity={0.2 + 0.02 * Math.sin(f / 30)} />
	</Svg>
);

/* остановка: небо, дорога, навес */
export const BusStop: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="bs-w" top="#9fd2f0" bot="#e6f4fb" />
		{[300, 1100, 1700].map((x, i) => (
			<ellipse key={i} cx={x + f * 0.3} cy={160 + i * 40} rx={140} ry={36} fill="#fff" opacity={0.85} />
		))}
		<rect x={-700} y={560} width={3300} height={140} fill="#8d95a6" />
		<rect x={-700} y={700} width={3300} height={200} fill="#5a6278" />
		{Array.from({length: 14}).map((_, i) => (
			<rect key={i} x={-300 + i * 260} y={770} width={120} height={12} fill="#f2f2f2" />
		))}
		<g transform="translate(560,0)">
			<rect x={0} y={440} width={16} height={460} fill="#4a5164" />
			<rect x={380} y={440} width={16} height={460} fill="#4a5164" />
			<rect x={-20} y={410} width={436} height={36} rx={8} fill="#3aa37a" />
			<rect x={20} y={470} width={340} height={300} fill="#bfe6ff" opacity={0.35} />
		</g>
		<Ground y={900} c="#aab1c0" />
	</Svg>
);
export const Bus: React.FC<{x: number; y?: number; sign?: string}> = ({x, y = 600, sign = 'В ПАРК'}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={0} y={0} width={820} height={250} rx={30} fill="#e2483a" stroke="#10132a" strokeWidth={6} />
		<rect x={30} y={-6} width={360} height={92} rx={10} fill="#11142c" />
		<text x={210} y={70} textAnchor="middle" fontSize={78} fontFamily={FONT} fontWeight={900} fill="#ffd34a">
			{sign}
		</text>
		{[0, 1, 2, 3, 4].map((i) => (
			<rect key={i} x={40 + i * 150} y={110} width={118} height={80} rx={8} fill="#cfe6f4" stroke="#10132a" strokeWidth={4} />
		))}
		<circle cx={170} cy={252} r={44} fill="#10132a" />
		<circle cx={640} cy={252} r={44} fill="#10132a" />
		<circle cx={170} cy={252} r={20} fill="#9aa0ae" />
		<circle cx={640} cy={252} r={20} fill="#9aa0ae" />
	</g>
);

/* футбольное поле, залитое водой */
export const FloodField: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="ff-w" top="#8fa2b4" bot="#c9d4de" />
		{[200, 800, 1500].map((x, i) => (
			<ellipse key={i} cx={x + f * 0.2} cy={130 + i * 30} rx={190} ry={44} fill="#6b788a" opacity={0.8} />
		))}
		<rect x={-700} y={560} width={3300} height={500} fill="#3d8f3d" />
		<rect x={-700} y={560} width={3300} height={10} fill="#fff" opacity={0.5} />
		<rect x={1500} y={380} width={20} height={260} fill="#fff" />
		<rect x={1500} y={380} width={300} height={14} fill="#fff" />
		<rect x={1790} y={380} width={14} height={260} fill="#fff" />
		<ellipse cx={900} cy={800} rx={800} ry={120} fill="#6aa8d8" opacity={0.85} />
		<ellipse cx={900} cy={790} rx={780} ry={100} fill="#8cc4ee" opacity={0.7} />
		{Array.from({length: 6}).map((_, i) => (
			<ellipse key={i} cx={300 + i * 250 + ((f * 1.2) % 80)} cy={790 + (i % 2) * 30} rx={50} ry={9} fill="none" stroke="#fff" strokeWidth={4} opacity={0.5} />
		))}
	</Svg>
);

/* дорога с деревьями, которые мелькают */
export const RoadTrees: React.FC<{f: number; speed?: number}> = ({f, speed = 30}) => (
	<Svg>
		<Wall id="rt-w" top="#9fd2f0" bot="#e6f4fb" />
		<rect x={-700} y={600} width={3300} height={400} fill="#7a8397" />
		<rect x={-700} y={600} width={3300} height={14} fill="#fff" opacity={0.6} />
		{Array.from({length: 8}).map((_, i) => {
			const x = ((i * 320 - f * speed) % 2560) - 320;
			return (
				<g key={i} transform={`translate(${x},0)`}>
					<rect x={-12} y={360} width={24} height={240} fill="#6b4a2a" />
					<circle cx={0} cy={330} r={110} fill={i % 2 ? '#3d8f3d' : '#4aa04a'} />
					<circle cx={-60} cy={380} r={70} fill="#3d8f3d" />
				</g>
			);
		})}
	</Svg>
);
export const CarSide: React.FC<{x: number; y?: number; children?: React.ReactNode}> = ({x, y = 560, children}) => (
	<g transform={`translate(${x},${y})`}>
		<path d="M0,170 L0,120 Q0,80 50,70 L170,60 Q220,-10 300,-10 L520,-10 Q600,-10 640,60 L730,80 Q780,90 780,130 L780,170 Z" fill="#3a6fd2" stroke="#10132a" strokeWidth={6} />
		<path d="M230,56 Q260,10 310,10 L500,10 Q550,10 580,56 Z" fill="#cfe6f4" stroke="#10132a" strokeWidth={5} />
		{children}
		<circle cx={170} cy={180} r={54} fill="#10132a" />
		<circle cx={610} cy={180} r={54} fill="#10132a" />
		<circle cx={170} cy={180} r={24} fill="#9aa0ae" />
		<circle cx={610} cy={180} r={24} fill="#9aa0ae" />
	</g>
);

export const Cat: React.FC<{x: number; y: number; s?: number; facing?: 1 | -1; f?: number}> = ({x, y, s = 1, facing = 1, f = 0}) => (
	<g transform={`translate(${x},${y}) scale(${facing * s},${s})`}>
		<path d={`M-56,0 Q-110,-30 -90,-80 Q-80,-40 -50,-30`} fill="none" stroke="#3a3a4a" strokeWidth={14} strokeLinecap="round" transform={`rotate(${Math.sin(f / 10) * 6} -56 0)`} />
		<ellipse cx={0} cy={-34} rx={64} ry={38} fill="#5a5a6e" stroke="#10132a" strokeWidth={4} />
		<circle cx={52} cy={-68} r={34} fill="#5a5a6e" stroke="#10132a" strokeWidth={4} />
		<path d="M32,-92 L36,-124 L56,-98 Z M60,-98 L76,-122 L82,-86 Z" fill="#5a5a6e" stroke="#10132a" strokeWidth={4} />
		<circle cx={64} cy={-70} r={7} fill="#ffe08a" />
		<circle cx={44} cy={-70} r={7} fill="#ffe08a" />
		<rect x={-40} y={-6} width={14} height={22} rx={5} fill="#3a3a4a" />
		<rect x={24} y={-6} width={14} height={22} rx={5} fill="#3a3a4a" />
	</g>
);

export const Camera: React.FC<{x: number; y: number; s?: number; flash?: number}> = ({x, y, s = 1, flash = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-90} y={-60} width={180} height={120} rx={20} fill="#3a4256" stroke="#10132a" strokeWidth={6} />
		<rect x={-40} y={-84} width={70} height={30} rx={8} fill="#3a4256" stroke="#10132a" strokeWidth={6} />
		<circle cx={0} cy={0} r={44} fill="#10132a" />
		<circle cx={0} cy={0} r={30} fill="#6aa8ff" />
		<circle cx={-10} cy={-10} r={9} fill="#fff" opacity={0.8} />
		<circle cx={62} cy={-36} r={9} fill="#ff6a5a" />
		{flash > 0 ? <circle cx={0} cy={0} r={150 * flash} fill="#fff" opacity={0.7 * (1 - flash)} /> : null}
	</g>
);

export const Battery: React.FC<{x: number; y: number; s?: number; pct: number; low?: boolean}> = ({x, y, s = 1, pct, low}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-170} y={-70} width={320} height={140} rx={26} fill="#11142c" stroke={low ? '#ff6a5a' : '#5fe08a'} strokeWidth={8} />
		<rect x={150} y={-30} width={26} height={60} rx={8} fill={low ? '#ff6a5a' : '#5fe08a'} />
		<rect x={-154} y={-54} width={Math.max(14, 190 * pct)} height={108} rx={14} fill={low ? '#ff6a5a' : '#5fe08a'} />
		<text x={90} y={22} textAnchor="middle" fontSize={78} fontFamily={FONT} fontWeight={900} fill="#fff" stroke="#10132a" strokeWidth={8} paintOrder="stroke">
			3%
		</text>
	</g>
);

/* карточка дня: день недели, число, значок, подпись; burn 0..1 — обугливается */
export const DayCell: React.FC<{x: number; y: number; wd: string; day: number; ico: IcoKind; label: string; burn?: number; flash?: number; s?: number; who?: {c: string; hair: string}; dual?: boolean; smolder?: number}> = ({x, y, wd, day, ico, label, burn = 0, flash = 0, s = 1, who, dual, smolder = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s * (1 + 0.06 * flash)})`}>
		<rect x={-250} y={-310} width={500} height={620} rx={40} fill="#fff6dc" stroke={flash > 0.1 ? '#ff9a3a' : '#ffd34a'} strokeWidth={10} />
		{dual ? <path d="M0,-310 H210 Q250,-310 250,-270 V270 Q250,310 210,310 H0 Z" fill="#bff0cf" /> : null}
		{smolder > 0 ? <rect x={-250} y={-310} width={500} height={620} rx={40} fill="none" stroke="#ff6a3a" strokeWidth={14 + 10 * smolder} opacity={0.5 + 0.4 * Math.sin(smolder * 60)} style={{filter: 'blur(3px)'}} /> : null}
		<text x={-130} y={-190} textAnchor="middle" fontSize={84} fontFamily={FONT} fontWeight={900} fill="#10132a">
			{wd}
		</text>
		<text x={110} y={-170} textAnchor="middle" fontSize={190} fontFamily={FONT} fontWeight={900} fill="#10132a">
			{day}
		</text>
		<Ico k={ico} x={-70} y={20} s={1.9} />
		{who ? <Mini x={150} y={30} c={who.c} hair={who.hair} s={1.5} /> : null}
		<text y={250} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#10132a">
			{label}
		</text>
		<rect x={-250} y={-310} width={500} height={620} rx={40} fill="#1a0f0f" opacity={0.88 * burn} />
		<ellipse cx={0} cy={320 - 560 * burn} rx={240} ry={50 + 20 * Math.sin(burn * 40)} fill="#ff6a3a" opacity={burn > 0.02 && burn < 0.98 ? 0.9 : 0} />
		{burn > 0.6 ? (
			<path d="M-190,-250 L190,250 M190,-250 L-190,250" stroke="#ff6a3a" strokeWidth={16} strokeLinecap="round" opacity={burn} />
		) : null}
	</g>
);

export const Battery3: React.FC<{x: number; y: number}> = ({x, y}) => <Battery x={x} y={y} pct={0.1} low />;
export { Plaque };

/* kitchen with a steel kettle instead of the white mug-like one (the only cups are the three mugs) */
export const KitchenK: React.FC<{night?: boolean}> = ({night}) => (
	<>
		<Kitchen night={night} />
		<Svg>
			<rect x={228} y={540} width={140} height={100} fill={night ? '#3d3a5c' : '#fbf3dc'} opacity={0.97} />
			<path d="M236,646 L236,606 Q236,560 296,556 Q358,560 358,606 L358,646 Z" fill="#8c96ad" stroke="#10132a" strokeWidth={5} />
			<path d="M236,612 L204,572 L218,562 L246,590 Z" fill="#8c96ad" stroke="#10132a" strokeWidth={5} />
			<path d="M252,566 Q297,505 346,566" fill="none" stroke="#10132a" strokeWidth={12} strokeLinecap="round" />
			<circle cx={296} cy={552} r={9} fill="#10132a" />
		</Svg>
	</>
);

/* the classroom with a clean blackboard (the kit one has a PTA-meeting caption) */
export const ClassroomClean: React.FC = () => (
	<>
		<ClassroomEve />
		<Svg>
			<rect x={216} y={156} width={868} height={368} fill="#2f4a3a" />
			<path d="M300,420 H520 M600,300 L760,300" stroke="#f6f2e4" strokeWidth={5} opacity={0.35} />
		</Svg>
	</>
);
