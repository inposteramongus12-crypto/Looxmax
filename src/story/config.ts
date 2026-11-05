/* Story-level settings. Claude rewrites this file for every new video. */
export type CounterKeyDef = {line: string; off?: number; v: number; roll?: number};

export const STORY: {
	title: string;
	hero: string; // cast id of the main character
	counter?: {label: string; color?: string; keys: CounterKeyDef[]}; // badge over the hero (age, lives, money…)
	heroAge?: (counter: number) => number; // 0..1 body ageing driven by the counter (optional)
	heroGrow?: number; // how much bigger the hero gets at full ageing (0.07 = +7 %)
	bed: string; // sound bed in public/ (ambience + sfx, music only if the user wants it)
	musicVolume?: number; // only if the bed has music in it
	endCaption?: string[]; // last words on screen (call to action), optional
} = {
	title: 'Что если за каждое улучшение ты платишь вечером',
	hero: 'hero',
	counter: {
		label: 'СВОБОДНЫХ ВЕЧЕРОВ',
		keys: [
			{line: '001', v: 0},
			{line: '008', off: 24, v: 30, roll: 34}, // «отмотаем на тридцать дней назад»
			{line: '023', off: 28, v: 29, roll: 14}, // полночь забрала вечер 1
			{line: '025', off: 8, v: 28, roll: 8}, // стрижка → вечер 2
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: ['К КОМУ ТЫ ЗАЙДЁШЬ', 'СЕГОДНЯ БЕЗ ЗВОНКА?'],
};
