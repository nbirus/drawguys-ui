import { reactive, computed, ref } from 'vue'

let canvas
let context
let paint
let canvasWidth = 678
let canvasHeight = 500

let clickX = new Array()
let clickY = new Array()
let clickDrag = new Array()
let clickColor = new Array()
let clickSize = new Array()

let undoIndex = ref([])

export const drawState = reactive({
	color: '#111111',
	size: 5,
	tool: 'marker',
})

export const undoDisabled = computed(() => undoIndex.value.length === 0)

export default function() {
	let canvasDiv = document.getElementById('canvasDiv')
	canvas = document.createElement('canvas')
	canvas.setAttribute('width', canvasWidth)
	canvas.setAttribute('height', canvasHeight)
	canvas.setAttribute('id', 'canvas')
	canvasDiv.appendChild(canvas)
	context = canvas.getContext('2d')

	canvas.addEventListener('mousedown', mousedown, false)
	canvas.addEventListener('mousemove', mousemove, false)
	canvas.addEventListener('mouseup', mouseup)
	canvas.addEventListener('mouseout', mouseout, false)
}

// events
function mousedown(e) {
	paint = true
	undoIndex.value.push(clickX.length)
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
	clickSize.push(parseInt(drawState.size))
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
	undoIndex.value = []
}
export function undo() {
	let index = undoIndex.value.pop()
	let spliceLength = clickX.length - index
	clickX.splice(index, spliceLength)
	clickY.splice(index, spliceLength)
	clickDrag.splice(index, spliceLength)
	clickColor.splice(index, spliceLength)
	clickSize.splice(index, spliceLength)
	redraw()
}
