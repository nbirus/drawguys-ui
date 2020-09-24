<template>
	<div class="chat" :class="{ focus }">
		<div class="chat__box">
			<transition-group tag="ul" name="chat" class="chat__messages">
				<chat-message v-for="(message, i) in messages" :key="i" v-bind="message" class="chat__message" />
			</transition-group>
		</div>
		<form
			class="chat__input sm nudge-2"
			:class="[`ready-outline-${roomState.user.color}`, { ready: focus }]"
			@submit.prevent="onSubmit"
		>
			<input
				class="b-none"
				placeholder="Send message..."
				type="text"
				required
				maxlength="40"
				:disabled="roomState.user.ready"
				v-model="message"
				@focus="focus=true"
				@blur="focus=false"
			/>
			<button class="icon mr-1" type="submit">
				<i :class="`text-${roomState.user.color}`" class="ri-send-plane-fill"></i>
			</button>
		</form>
	</div>
</template>

<script>
import ChatMessage from './RoomChatMessage'
import { roomState, sendMessage } from '@/services/Room'
import { computed, ref } from 'vue'

export default {
	name: 'room-chat',
	components: {
		ChatMessage,
	},
	setup() {
		let focus = ref(false)
		let message = ref('')
		let messages = computed(() => roomState.messages)

		function onSubmit() {
			sendMessage(message.value)
			message.value = ''
		}

		return {
			focus,
			onSubmit,
			message,
			messages: computed(() => messages.value.reverse()),
			roomState,
		}
	},
}
</script>

<style lang="scss" scoped>
@import '@/styles/component.scss';

.chat {
	height: 100%;
	display: flex;
	flex-direction: column;

	&__box {
		flex: 0 1 100%;
	}
	&__messages {
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-start;
		overflow-y: auto;
		overflow-x: hidden;
		height: 358px;
		width: 327px;
	}
	&__input {
		flex: 0 0 auto;
		border-top: solid thin $border-color;
		position: relative;
		display: flex;
		align-items: center;

		button {
			background-color: transparent;
		}
		button i {
			color: darken($light, 20);
			transform: translateY(1px) translateX(-1px);
		}
		button:hover i {
			color: $text;
		}
		&:after {
			border-radius: 0 0 $border-radius 0;
		}
		input {
			width: 100%;
			font-size: 0.9rem;
			height: 50px;
			border: none !important;
			padding-left: 1.25rem;
			background-color: lighten($light, 1);

			&:focus,
			&:active {
				box-shadow: none !important;
			}
		}
	}

	&.focus {
		.chat__input button i {
			color: $text;
		}
	}
}
</style>
