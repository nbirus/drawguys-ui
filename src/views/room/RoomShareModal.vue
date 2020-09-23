<template>
	<modal :open="open" @close="$emit('update:open', false)">
		<div class="card">
			<h4 class="mb-5">Invite others to the game</h4>
			<div class="actions">
				<input type="text" :value="link" @input.prevent />
				<button>
					<i class="ri-clipboard-line"></i>Copy
				</button>
			</div>
		</div>
	</modal>
</template>

<script>
import Modal from '@/components/Modal'
import { ref } from 'vue'
export default {
	name: 'room-share-modal',
	components: {
		Modal,
	},
	props: ['open'],
	setup() {
		let link = ref('drawguys.com/asdf')
		return {
			link,
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

		i {
			display: block;
			margin-right: 0.25rem;
			font-size: 0.9rem;
		}
	}
}
</style>