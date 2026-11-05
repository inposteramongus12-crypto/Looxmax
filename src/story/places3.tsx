/* Locations and cards of parts 7–9 (lines 090–158). */
import React from 'react';
import {Svg} from '../engine/camera';
import {FONT} from '../kit/ui';
import {Wall, Ground, Mini, Plaque, Ico} from './places';

/* ступени «приятель → друг → близкий»; melt 0..1 — верхняя ступень подтаивает */
export const Ladder: React.FC<{t: number; melt?: number}> = ({t, melt = 0}) => {
	const steps = [
		{x: 170, top: 640, w: 500, c: '#3a6fd2', name: 'ПРИЯТЕЛЬ', hours: ''},
		{x: 710, top: 500, w: 500, c: '#2f8f5a', name: 'ДРУГ', hours: '≈ 90 Ч'},
		{x: 1250, top: 360 + melt * 70, w: 500, c: '#e86aa0', name: 'БЛИЗКИЙ', hours: '200+ Ч'},
	];
	return (
		<g>
			{steps.map((s, i) => {
				const u = Math.min(1, Math.max(0, (t - i * 18) / 14));
				const top = s.top + (1 - u) * 80;
				return (
					<g key={i} opacity={u}>
						<rect x={s.x} y={top} width={s.w} height={880 - top} rx={22} fill={s.c} stroke="#10132a" strokeWidth={6} />
						<text x={s.x + s.w / 2} y={top + 84} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff" stroke="#10132a" strokeWidth={7} paintOrder="stroke">
							{s.name}
						</text>
						{s.hours ? (
							<g>
								<Plaque x={s.x + s.w / 2} y={top + 190} w={320} h={100} text={s.hours} size={66} c="#ffd34a" />
							</g>
						) : null}
					</g>
				);
			})}
			{melt > 0
				? [0, 1, 2, 3].map((i) => {
						const u = ((t / 22 + i / 4) % 1);
						return <ellipse key={i} cx={1300 + i * 120} cy={430 + melt * 70 + u * 260} rx={14} ry={22} fill="#e86aa0" opacity={(1 - u) * melt} />;
					})
				: null}
		</g>
	);
};

export const NightLane: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Wall id="nl-w" top="#0d1230" bot="#26305e" />
		{[200, 520, 940, 1380, 1760].map((x, i) => (
			<g key={i}>
				<rect x={x - 90} y={260 + (i % 2) * 60} width={180} height={640 - (i % 2) * 60} fill={i % 2 ? '#1a2250' : '#222c60'} />
				{[0, 1, 2].map((r) => (
					<rect key={r} x={x - 50 + (r % 2) * 60} y={310 + r * 120 + (i % 2) * 60} width={36} height={52} fill={random01(i * 7 + r) > 0.5 ? '#ffd98a' : '#33406e'} />
				))}
			</g>
		))}
		<circle cx={1500} cy={150} r={46} fill="#eef1ff" />
		{[620, 1500].map((x, i) => (
			<g key={i}>
				<rect x={x - 6} y={380} width={12} height={520} fill="#4a5164" />
				<rect x={x - 40} y={366} width={80} height={22} rx={10} fill="#ffe3a0" />
				<path d={`M${x - 40},388 L${x - 190},900 L${x + 190},900 L${x + 40},388 Z`} fill="#ffe3a0" opacity={0.16 + 0.02 * Math.sin(f / 9 + i)} />
			</g>
		))}
		<Ground y={900} c="#2a3150" />
		<ellipse cx={620} cy={930} rx={170} ry={26} fill="#6a86c8" opacity={0.55} />
	</Svg>
);
const random01 = (n: number) => ((Math.sin(n * 91.7) * 43758.5453) % 1 + 1) % 1;

export const ParkEve: React.FC<{f: number; speed?: number}> = ({f, speed = 6}) => (
	<Svg>
		<Wall id="pk-w" top="#ff9a6a" bot="#ffe0a8" />
		<circle cx={1500} cy={380} r={110} fill="#fff3c0" opacity={0.9} />
		<rect x={-700} y={640} width={3300} height={400} fill="#4aa04a" />
		<rect x={-700} y={730} width={3300} height={170} fill="#d9c08a" />
		{Array.from({length: 8}).map((_, i) => {
			const x = ((i * 360 - f * speed) % 2880) - 360;
			return (
				<g key={i} transform={`translate(${x},0)`}>
					<rect x={-14} y={380} width={28} height={280} fill="#6b4a2a" />
					<circle cx={0} cy={340} r={120} fill={i % 2 ? '#2f8f5a' : '#3d9f4a'} />
					<circle cx={-70} cy={400} r={80} fill="#2f8f5a" />
				</g>
			);
		})}
	</Svg>
);

export const PhoneFrame: React.FC<{x?: number; y?: number; w?: number; h?: number; children?: React.ReactNode}> = ({x = 960, y = 540, w = 660, h = 820, children}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-w / 2 - 18} y={-h / 2 - 18} width={w + 36} height={h + 36} rx={70} fill="#0b0d1e" stroke="#6f7bd8" strokeWidth={8} />
		<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={52} fill="#1a2150" />
		{children}
	</g>
);
export { Mini, Ico };
