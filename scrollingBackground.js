export class Background {
  constructor(simulare) {
    this.totalWidth = simulare.width;
    this.totalHeight = simulare.height;
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 800;
    this.speed = simulare.speed * 10;
    this.moving = false;
    this.color = 'rgba(0, 0, 0, 0)';
  }
  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
