<template>
	<div class="chat" :class="{ focus }">
		<div class="chat__box">
			<ul class="chat__messages">
				<chat-message v-for="(message, i) in messages" :key="i" v-bind="message" class="chat__message" />
			</ul>
		</div>
		<form class="chat__input" @submit.prevent="onSubmit">
			<input
				class="b-none"
				placeholder="Send message..."
				type="text"
				v-model="message"
				@focus="focus=true"
				@blur="focus=false"
			/>
			<i class="ri-send-plane-2-fill"></i>
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
			messages,
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
	}
	&__input {
		flex: 0 0 auto;
		border-top: solid thin $border-color;
		position: relative;

		i {
			position: absolute;
			right: 1rem;
			top: 1rem;
			font-size: 1.25rem;
			color: $text;
		}

		input {
			width: 100%;
			font-size: 1.05rem;
			height: 52px;
			border: none !important;
			padding-left: 1.25rem;

			&:focus,
			&:active {
				box-shadow: none !important;
			}
		}
	}

	&.focus {
		.chat {
			&__input:after {
				content: '';
				position: absolute;
				top: 0px;
				right: 0px;
				bottom: 0px;
				left: 0px;
				border: solid thin $blue;
				border-bottom-right-radius: $border-radius;
			}
		}
	}
}
</style>
