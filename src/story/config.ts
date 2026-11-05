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
			{line: '038', off: 100, v: 27, roll: 8}, // день 3: умывание → вечер 3
			{line: '040', off: 75, v: 26, roll: 8}, // стена для спины → вечер 6
			{line: '044', off: 120, v: 25, roll: 8}, // полночь забрала вечер 4
			{line: '050', off: 10, v: 24, roll: 10}, // день 6
			{line: '073', off: 2, v: 23, roll: 10}, // день 8: полночь
			{line: '073', off: 105, v: 22, roll: 8}, // одежда → вечер 11
			{line: '074', off: 150, v: 21, roll: 8}, // голос → вечер 12
			{line: '075', off: 0, v: 18, roll: 30}, // дни 9–11: полночи
			{line: '080', off: 100, v: 17, roll: 6}, // день 13: прогулки
			{line: '080', off: 130, v: 16, roll: 6}, // шаг и жесты
			{line: '080', off: 160, v: 15, roll: 6}, // выход на сцену
			{line: '080', off: 190, v: 14, roll: 6}, // дикция
			{line: '084', off: 30, v: 12, roll: 14}, // день 15: поле залито
			{line: '084', off: 112, v: 10, roll: 12}, // день 18: лифт
			{line: '106', off: 4, v: 9, roll: 10}, // день 22: полночь
			{line: '108', off: 55, v: 8, roll: 8}, // отдаёшь среду (24)
			{line: '109', off: 6, v: 7, roll: 10}, // день 24: полночь
			{line: '110', off: 4, v: 6, roll: 8}, // вместе: один вечер на двоих
			{line: '111', off: 20, v: 5, roll: 8},
			{line: '115', off: 60, v: 4, roll: 8}, // дни 24–27: 4
			{line: '124', off: 4, v: 3, roll: 12}, // день 28
			{line: '136', off: 80, v: 2, roll: 8}, // сон вместе с дедом: Чирк, два
			{line: '141', off: 100, v: 1, roll: 8}, // день 29 пройден
			{line: '148', off: 6, v: 0, roll: 8}, // день 30: Чирк
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: ['К КОМУ ТЫ ЗАЙДЁШЬ', 'СЕГОДНЯ БЕЗ ЗВОНКА?'],
};
