<template>
	<div class="chat">
		<div class="chat__box">
			<ul>
				<li></li>
			</ul>
		</div>
		<div class="chat__input">
			<input class="b-none" placeholder="Send message..." type="text" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'room-chat',
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
	&__input {
		flex: 0 0 auto;
		border-top: solid thin $border-color;

		input {
			width: 100%;
		}
	}
}
</style>
