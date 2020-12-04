import { socket } from '@/services/Socket'
import { reactive, ref, watch } from 'vue'
import { roomState } from '@/services/Room'

let canvas
let context
let paint
let canvasWidth = 792
let canvasHeight = 502

let clickX = new Array()
let clickY = new Array()
let clickDrag = new Array()
let clickColor = new Array()
let clickSize = new Array()
let undoIndex = new Array()

export const history = ref([])

export const drawState = reactive({
	color: '#111111',
	size: 0,
	tool: 'marker',
})

// allow undo event
// export const undoDisabled = computed(() => undoIndex.value === undefined || undoIndex.value.length === 0)
export const undoDisabled = false

// default run
export default function() {
	let canvasDiv = document.getElementById('canvasDiv')
	canvas = document.createElement('canvas')
	canvas.setAttribute('width', canvasWidth)
	canvas.setAttribute('style', 'pointer-events: auto;')
	canvas.setAttribute('height', canvasHeight)
	canvas.setAttribute('id', 'canvas')
	canvasDiv.appendChild(canvas)
	context = canvas.getContext('2d')
	canvas.addEventListener('mousedown', (e) => {
		socket.emit('mousedown', formatEvent(e))
		mousedown(e)
	}, false)
	canvas.addEventListener('mousemove', (e) => {
		socket.emit('mousemove', formatEvent(e))
		mousemove(e)
	}, false)
	canvas.addEventListener('mouseup', (e) => {
		socket.emit('mouseup', formatEvent(e))
		mouseup(e)
	})
	canvas.addEventListener('mouseout', (e) => {
		socket.emit('mouseout', formatEvent(e))
		mouseout(e)
	}, false)
}

// events
function mousedown(e) {
	paint = true
	undoIndex.push(clickX.length)
	addClick(e.offsetX, e.offsetY)
	redraw()
}
function mousemove(e) {
	if (paint) {
		addClick(e.offsetX, e.offsetY, true)
		redraw()
	}
}
function mouseup() {
	paint = false
}
function mouseout() {
	paint = false
}

// helpers
function addClick(x, y, dragging) {
	clickX.push(x)
	clickY.push(y)
	clickDrag.push(dragging)
	clickColor.push(drawState.tool === 'eraser' ? 'white' : drawState.color)
	clickSize.push([3, 10, 25, 50][parseInt(drawState.size)])
}
function redraw() {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height) // Clears the canvas
	context.lineJoin = 'round'

	for (var i = 0; i < clickX.length; i++) {
		context.beginPath()
		if (clickDrag[i] && i) {
			context.moveTo(clickX[i - 1], clickY[i - 1])
		} else {
			context.moveTo(clickX[i] - 1, clickY[i])
		}
		context.lineTo(clickX[i], clickY[i])
		context.closePath()
		context.strokeStyle = clickColor[i]
		context.lineWidth = clickSize[i]
		context.stroke()
	}
}
function formatEvent(e) {
	return {
		offsetX: e.offsetX,
		offsetY: e.offsetY,
	}
}
function setDrawState(newDrawState) {
	Object.keys(drawState).forEach(key => {
		drawState[key] = newDrawState[key]
	})
}
export function updateDrawState() {
	socket.emit('set_draw_state', drawState)
}

// watch
watch(() => roomState.gameState.event, event => {
	if (event === 'turn_end') {
		let img = new Image()
		img.src = canvas.toDataURL("image/png")
		history.value.push(img)
	}
	if (event === 'round_start') {
		history.value = []
	}
})

// socket events
socket.on('set_draw_state', setDrawState)
socket.on('mousedown', mousedown)
socket.on('mousemove', mousemove)
socket.on('mouseup', mouseup)
socket.on('mouseout', mouseout)
socket.on('undo', undo)
socket.on('reset', reset)

// actions
export function reset() {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height)
	context.beginPath()
	var w = canvas.width
	context.width = 1
	context.width = w

	// reset vars
  clickX = new Array()
  clickY = new Array()
  clickDrag = new Array()
  clickColor = new Array()
  clickSize = new Array()
  undoIndex = new Array()
}
export function undo() {
	let index = undoIndex.pop()
	let spliceLength = clickX.length - index
	clickX.splice(index, spliceLength)
	clickY.splice(index, spliceLength)
	clickDrag.splice(index, spliceLength)
	clickColor.splice(index, spliceLength)
	clickSize.splice(index, spliceLength)
	redraw()
}
export function resetState() {
	drawState.color = '#111111'
	drawState.size = 1
	drawState.tool = 'marker'
}
