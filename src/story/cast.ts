import type {Base} from '../kit/actions';

/* Characters of this video. Key = id used in <Actor who="..."/>; `sp` = speaker code in
   lines.json (default: the id in upper case). Keep the hero yellow: the audience learns
   the colour in the first seconds and finds the hero in any crowd.
   Looks: color (hoodie), outfit hoodie|suit|gown|coat|apron|tee, hair none|spiky|bun|cap|
   ponytail|grey|bob|short, hairColor, acc [headphones|mustache|glasses], shoe. */
export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	hero: {color: '#f2b21c', hair: 'short', rim: '#fff0cc', rimW: 2.4},
	heroSuit: {color: '#2f6fd8', outfit: 'suit', hair: 'short', rim: '#fff0cc', rimW: 2.4, sp: 'HERO'},
	tema: {color: '#d94a3a', hair: 'cap', hairColor: '#2f6fd8', rim: '#ffe0c8', rimW: 2.4, shoe: '#f2f2f2'},
	vovan: {color: '#2f8f5a', outfit: 'tee', hair: 'none', rim: '#e8fff2', rimW: 2.4, shoe: '#111'},
	bro: {color: '#2f6fd8', hair: 'short', hairColor: '#5a3a22', rim: '#e6f0ff', rimW: 2.4, shoe: '#f2f2f2'},
	sis: {color: '#e86aa0', hair: 'ponytail', hairColor: '#5a3a22', rim: '#ffe6f0', rimW: 2.4, shoe: '#f2f2f2'},
	mom: {color: '#7a5cc4', outfit: 'gown', hair: 'bob', rim: '#ffe6c8', rimW: 2.4, shoe: '#2c2540'},
	grandpa: {color: '#22a6a6', outfit: 'tee', hair: 'grey', acc: ['glasses'], rim: '#ffffff', rimW: 4.2, shoe: '#8a5a3a'},
	teacher: {color: '#8e3a4f', outfit: 'suit', hair: 'bun', acc: ['glasses'], rim: '#ffe6d6', rimW: 2.4, shoe: '#2b1d24'},
	barber: {color: '#3aa37a', outfit: 'apron', hair: 'none', acc: ['mustache'], rim: '#e8fff2', rimW: 2.4, shoe: '#1d2b24'},
	heroMess: {color: '#f2b21c', hair: 'spiky', hairColor: '#3a2a1c', rim: '#fff0cc', rimW: 2.4, sp: 'HERO'},
	coach: {color: '#3a4256', outfit: 'tee', hair: 'cap', hairColor: '#c9342a', acc: ['mustache'], rim: '#e6ecff', rimW: 2.4, shoe: '#f2f2f2'},
	seller: {color: '#3aa37a', outfit: 'apron', hair: 'bun', rim: '#e8fff2', rimW: 2.4, shoe: '#1d2b24'},
	anya: {color: '#a6d94a', hair: 'ponytail', hairColor: '#e9b44c', rim: '#f4ffd8', rimW: 2.4, shoe: '#f2ffd8'},
	aunt: {color: '#d9822b', outfit: 'coat', hair: 'bob', rim: '#fff0d8', rimW: 2.4, shoe: '#2b2f3a'},
	kid: {color: '#4aa8d8', hair: 'spiky', hairColor: '#5a3a22', rim: '#e6f6ff', rimW: 2.4, shoe: '#f2f2f2'},
};
