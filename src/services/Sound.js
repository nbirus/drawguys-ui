import { Howl } from 'howler';
import { reactive } from 'vue'

export const soundState = reactive({
	mute: true,
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
	whoosh1: 'whoosh-1.mp3',
	whoosh2: 'whoosh-2.mp3',
	thunk: 'thunk',
}

// play sound
export function playSound(id, volumn = 1) {
	if (!soundState.mute) {
		const sound = new Howl({
			src: [`sounds/${soundMap[id]}`],
			volume: soundState.volume * volumn,
			onload() {
				sound.play();
			}
		});
	}
}