let player = require('play-sound')(opts = {})

export const soundState = reactive({
	mute: false,
	volume: 1,
})

const soundMap = {
	join: '',
	leave: '',
	page: '',
	countdown: '',
	warning: '',
	roundEnd: '',
	match: '',
	error: '',
}

// play sound
export function sound(soundId) {
	player.play(soundMap[soundId], function(err){
		if (err) throw err
	})
}