import type React from 'react';
import {V1, V2, V3, V4, V5, V6, V7, V8} from './shortV';

/* How the vertical version is made.
   crop  — shorts-only video: Short = the same shots as Long, cropped to 9:16 around ShotDef.focus.
   recut — "long + short": the short has its own (shorter) script and voice taken from the long's existing clips
           (short-pick.json -> tools/make-short-timeline.mjs -> short-timeline.json); every segment is a native
           vertical scene (src/story/shortV.tsx), no 16:9 footage is cropped. Segment fields:
             line  short line id prefix ('004'); C  the vertical scene. */
export type Seg = {
	line: string;
	at?: number;
	ep?: string;
	off?: number;
	cont?: boolean;
	hold?: boolean;
	a?: {cx?: number; cy?: number; z?: number};
	b?: {cx?: number; cy?: number; z?: number};
	C?: React.FC<{f: number; dur: number}>;
};

export const SHORT: {mode: 'crop'; hook?: string[]; bed?: string} | {mode: 'recut'; segs: Seg[]; hook?: string[]; bed?: string} = {
	mode: 'recut',
	bed: 'sfx/bed_short.wav',
	segs: [
		{line: '001', C: V1},
		{line: '004', C: V2},
		{line: '007', C: V3},
		{line: '008', C: V4},
		{line: '009', C: V5},
		{line: '012', C: V6},
		{line: '013', C: V7},
		{line: '014', C: V8},
	],
};
