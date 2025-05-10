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
	distanceTo(that: Vector2): number {
		return that.sub(this).length(); 
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
const EPS = 1e-3;
const GRID_ROWS = 10
const GRID_COLS = 10;
const GRID_SIZE = new Vector2(GRID_COLS, GRID_ROWS);

function canvasSize(ctx: CanvasRenderingContext2D): Vector2 {
	return new Vector2(ctx.canvas.width, ctx.canvas.height);

}

function snap(dx: number, x: number): number {
	if (dx > 0) return Math.ceil(x + Math.sign(dx)*EPS);
	if (dx < 0) return Math.floor(x + Math.sign(dx)*EPS);
	return x;
}

function hittingCell(p1: Vector2, p2: Vector2): Vector2 {
	const d = p2.sub(p1);
	return new Vector2(Math.floor(p2.x + Math.sign(d.x) * EPS),
					   Math.floor(p2.y + Math.sign(d.y) * EPS));
}

function rayStep(p1: Vector2, p2: Vector2): Vector2 {
	const EPS = 1e-3;
	const d = p2.sub(p1);
	let p3 = p2;
	if (d.x !== 0) {
		const k = d.y / d.x;
		const c = p1.y - k * p1.x;
		{
			const x = snap(d.x, p2.x);
			const y = k * x + c;
			//ctx.fillStyle = "green";
			p3 = new Vector2(x, y);
			//fillCircle(ctx, new Vector2(x, y), 0.2);
		}
		if (k !== 0) {
			const y = snap(d.y, p2.y);
			const x = (y - c)/k;
			const p3temp = new Vector2(x, y);
			if (p2.distanceTo(p3temp) < p2.distanceTo(p3)) {
				p3 = p3temp;
			}
			//ctx.fillStyle = "cyan";
			//fillCircle(ctx, new Vector2(x, y), 0.2);
		}	
	} else {
		const y = snap(d.y, p2.y);
		const x = p2.x
		p3 = new Vector2(x, y);
	}

	return p3;
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

	let p1 = new Vector2(GRID_ROWS * 0.44, GRID_COLS * 0.33);
	ctx.fillStyle = "pink";
	fillCircle(ctx, p1, 0.2);
	if (p2 !== undefined) {
		for (;;) {
			const c = hittingCell(p1, p2);
			fillCircle(ctx, p2, 0.2);
			ctx.strokeStyle = "pink";
			strokeLine(ctx, p1, p2);
			if (c.x < 0 || c.x >= GRID_SIZE.x || c.y < 0 || c.y >= GRID_SIZE.y) {
				break;
			}

			const p3 = rayStep(p1, p2);
			p1 = p2;
			p2 = p3;
		}
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
