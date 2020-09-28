<template>
	<modal :open="open" @close="$emit('update:open', false)">
		<div class="card">
			<h4 class="mb-5">Invite others to the game...</h4>
			<div class="actions">
				<input
					ref="input"
					@click="selectInput"
					type="text"
					:value="link"
					@input.prevent
				/>
				<button @click="onCopy"><i class="ri-clipboard-line"></i>Copy</button>
			</div>
		</div>
	</modal>
</template>

<script>
import Modal from '@/components/Modal'
import { ref } from 'vue'
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
		let link = ref(`drawguys.com/${roomid}`)
		let input = ref(null)

		function onCopy() {
			copy(link.value)
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

<style lang="scss" scoped>
@import '@/styles/component.scss';
.card {
	padding: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	h4 {
		font-weight: $bold;
	}
}
.actions {
	display: flex;
	align-items: center;

	input {
		text-align: center;
		margin-right: 1rem;
	}
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		transition-delay: unset;
		font-weight: $bold;
		font-size: 0.9rem;

		i {
			display: block;
			margin-right: 0.25rem;
			font-size: 0.9rem;
		}
	}
}
</style>
