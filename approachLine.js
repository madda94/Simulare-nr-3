export class ArcDetection {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.x = this.totalWidth / 2
		this.y = this.totalHeight / 2;
		this.blinking = true;
		this.lastBlinkTime = 0;
		this.blinkInterval = 450;
		this.appearBlinking = false;
	}
	draw(context, radius) {
		if (this.blink() && this.appearBlinking) {
			context.beginPath();
			context.setLineDash([7]);
			context.arc(this.x, this.y, radius, 0, 2 * Math.PI);
			context.lineWidth = 3;
			context.strokeStyle = 'red';
			context.stroke();
		}
	}
	blink() {
		const currentTime = new Date().getTime();
		if (currentTime - this.lastBlinkTime > this.blinkInterval) {
			this.lastBlinkTime = currentTime;
			this.blinking = !this.blinking;
		}
		return this.blinking;
	}
}

