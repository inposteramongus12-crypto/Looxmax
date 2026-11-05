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
