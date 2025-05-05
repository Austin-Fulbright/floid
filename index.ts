const GRID_ROWS = 10
const GRID_COLS = 10;

class Vector2 {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	array(): [number, number] {
		return [this.x, this.y];
	}
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
	ctx.fillStyle = "#181818";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	ctx.scale(ctx.canvas.width/GRID_COLS, ctx.canvas.height/GRID_ROWS);
	ctx.lineWidth = 0.03;
	ctx.strokeStyle = "#404040";
	for (let x = 0; x <= GRID_COLS; ++x) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, GRID_ROWS);
		ctx.stroke();
	}
	for (let y = 0; y <= GRID_ROWS; ++y) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(GRID_COLS, y);
		ctx.stroke();
	}

	const p1 = new Vector2(GRID_ROWS * 0.44, GRID_COLS * 0.33);
	const p2 = new Vector2(GRID_ROWS * 0.34, GRID_COLS * 0.43);
	ctx.fillStyle = "pink";
	fillCircle(ctx, p1, 0.2);
	fillCircle(ctx, p2, 0.2);
	ctx.strokeStyle = "pink";
	strokeLine(ctx, p1, p2);
})()
