
class Vector2 {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	add(that: Vector2): Vector2 {
		return new Vector2(this.x + that.x, this.y + that.y);
	}
	sub(that: Vector2): Vector2 {
		return new Vector2(this.x - that.x, this.y - that.y);
	}
	div(that: Vector2): Vector2 {
		return new Vector2(this.x / that.x, this.y / that.y);
	}
	mul(that: Vector2): Vector2 {
		return new Vector2(this.x * that.x, this.y * that.y);
	}
	length(): number {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	norm(): Vector2 {
		const l = this.length();
		if (l == 0) return new Vector2(0, 0);
		return new Vector2(this.x / l, this.y / l);
	}
	scale(value: number): Vector2 {
		return new Vector2(this.x * value, this.y * value);
	}
	array(): [number, number] {
		return [this.x, this.y];
	}
}
const GRID_ROWS = 10
const GRID_COLS = 10;
const GRID_SIZE = new Vector2(GRID_COLS, GRID_ROWS);

function canvasSize(ctx: CanvasRenderingContext2D): Vector2 {
	return new Vector2(ctx.canvas.width, ctx.canvas.height);

}
function rayStep(p1: Vector2, p2: Vector2): Vector2 {
	const rise = p2.y - p1.y;
	const run = p2.x - p1.x;
	let k = 1;
	if (run !== 0) {
		k = (p2.y - p1.y) / (p2.x - p1.x);
	}
	const c = p1.y - k * p1.x
	let x3 = 0;
	if (run > 0){
		x3 = Math.ceil(p2.x);
	}
	if (run < 0) {
		x3 = Math.floor(p2.x);
	}

	let y3 = k * x3 + c;
	return new Vector2(x3, y3); 
}
function fillCircle(ctx: CanvasRenderingContext2D, center: Vector2, radius: number) {
	ctx.beginPath();
	ctx.arc(...center.array(), radius, 0, 2*Math.PI);
	ctx.fill();

}

function strokeLine(ctx: CanvasRenderingContext2D, p1: Vector2, p2: Vector2) {
	ctx.beginPath();
	ctx.moveTo(...p1.array());
	ctx.lineTo(...p2.array());
	ctx.stroke();
}

function grid(ctx: CanvasRenderingContext2D, p2: Vector2 | undefined) {
	ctx.reset();
	ctx.fillStyle = "#181818";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	ctx.scale(ctx.canvas.width/GRID_COLS, ctx.canvas.height/GRID_ROWS);
	ctx.lineWidth = 0.03;
	ctx.strokeStyle = "#404040";
	for (let x = 0; x <= GRID_COLS; ++x) {
		strokeLine(ctx, new Vector2(x, 0), new Vector2(x, GRID_ROWS));
	}
	for (let y = 0; y <= GRID_ROWS; ++y) {
		strokeLine(ctx, new Vector2(0, y), new Vector2(GRID_COLS, y));
	}

	const p1 = new Vector2(GRID_ROWS * 0.44, GRID_COLS * 0.33);
	ctx.fillStyle = "pink";
	fillCircle(ctx, p1, 0.2);
	if (p2 !== undefined) {
		fillCircle(ctx, p2, 0.2);
		ctx.strokeStyle = "pink";
		strokeLine(ctx, p1, p2);
		const p3 = rayStep(p1, p2);
		fillCircle(ctx, p3, 0.2);
		strokeLine(ctx, p2, p3)
	}
	

}
(() => {
	const game = document.getElementById("game") as (HTMLCanvasElement | null);
	if (game === null) {
		throw new Error("No canvas with id `game` was found");	
	}
	game.width = 800;
	game.height = 800;
	const ctx = game.getContext("2d");
	if (ctx === null) {
		throw new Error("Context was not able to load");
	}
	let p2: Vector2 | undefined = undefined;

	game.addEventListener("mousemove", (event) => {
		p2 = new Vector2(event.offsetX, event.offsetY)
		.div(canvasSize(ctx))
		.mul(new Vector2(GRID_COLS, GRID_ROWS));
		console.log(p2);
		grid(ctx, p2);
	})
	grid(ctx, p2);

})()
