import {Howl, Howler} from 'howler';
import { reactive } from 'vue'

export const soundState = reactive({
	mute: false,
	volume: .8,
})

const soundMap = {
	join: '',
	leave: '',
	countdown: '',
	warning: '',
	roundEnd: '',
	match: 'match.mp3',
	error: '',
	submit: 'pop.mp3',
	pop: 'pop-2.mp3',
	tick: 'tick.mp3',
	message: 'tick.mp3',
}

// play sound
export function playSound(id) {
	if (!soundState.mute) {
		const sound = new Howl({
			src: [`sounds/${soundMap[id]}`],
			volume: soundState.volume,
			onload() {
				sound.play();
			}
		});
	}
}