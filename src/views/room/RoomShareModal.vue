<script>
import Modal from '@/components/Modal'
import { onMounted, ref } from 'vue'
import router from '@/router'
import copy from 'copy-to-clipboard'

export default {
	name: 'room-share-modal',
	components: {
		Modal,
	},
	props: ['open'],
	setup() {
		let currentRoute = router.currentRoute.value
		let roomid = currentRoute.params.id
		let link = ref(`www.drawguys.com/${roomid}`)
		let input = ref(null)

		function onCopy() {
			selectInput()
			copy(`https://www.drawguys.com/${roomid}`)
		}
		function selectInput() {
			input.value.select()
		}

		return {
			link,
			onCopy,
			selectInput,
			input,
		}
	},
}
</script>

<template>
	<modal :open="open" @close="$emit('update:open', false)">
		<div class="card">
			<transition name="pop-up" mode="out-in" appear>
				<div class="avatar">
					<i class="ri-share-line"></i>
				</div>
			</transition>
			<transition name="pop-up" mode="out-in" appear>
				<h3 class="mb-5 delay-1">Invite others to the game</h3>
			</transition>
			<transition name="pop-up" mode="out-in" appear>
				<div class="actions delay-2">
					<input
						ref="input"
						@click="selectInput"
						type="text"
						:value="link"
						@input.prevent
					/>
					<button class="striped custom" @click="onCopy">
						<i class="ri-clipboard-line"></i>Copy
					</button>
				</div>
			</transition>
		</div>
	</modal>
</template>

<style lang="scss" scoped>
@import '@/styles/component.scss';
.card {
	padding: 1.5rem 0 1.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	border: none;
	position: relative;
	overflow: hidden;
	// box-shadow: 0 0 0 3px $black;
}
.actions {
	display: flex;
	align-items: center;
	border-top: solid thin $border-color;
	padding-top: 1.5rem;

	input {
		text-align: center;
		margin-right: 1rem;
		padding: 0.35rem 0.75rem;
		font-size: 1.1rem;
		transition: box-shadow 0.2s ease;
		color: $text-light;
		border: none;
		background-color: $light;

		&::selection {
			background: $text;
			color: white;
		}
		&:hover,
		&:focus,
		&:active {
			box-shadow: 0 0 0 3px $text;
			background-color: $light;
		}
	}
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		transition-delay: unset;
		padding: 0rem 1.5rem;
		height: 60px;
		font-size: 1rem;

		i {
			display: block;
			margin-right: 0.35rem;
			font-size: 1rem;
		}
	}
}
.avatar {
	background-color: $light;
	// box-shadow: 0 0 0 3px $black;
	// position: absolute;
	// top: -3rem;
	margin-bottom: 1rem;
}
</style>
