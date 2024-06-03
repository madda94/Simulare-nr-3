import {
  MissileP21,
  MissileP22,
  FireAK630,
  FireAK630_2,
  FireAK726,
  FirePK16_1,
	FirePK16_2,
	FirePK16_3,
	FirePK16_4,
	FirePK16_5,
	FirePK16_6,
	FirePK16_7,
	FirePK16_8,
	FirePK16_9,
	FirePK16_10,
	FirePK16_11,
	FirePK16_12,
  Radar,
} from './missile.js';
import { ArcDetection } from './approachLine.js';

export class Ship {
  constructor(simulare) {
    this.simulare = simulare;
    this.totalWidth = this.simulare.width;
    this.totalHeight = this.simulare.height;
    this.spriteWidth = 402;
    this.spriteHeight = 149;
    this.initialWidth = this.spriteWidth / 2.5;
    this.width = this.spriteWidth;
    this.initialHeight = this.spriteHeight / 2.5;
    this.height = this.spriteHeight;
    this.initialX = this.simulare.width - this.initialWidth;
    this.initialY = this.initialHeight / 2;
    this.image = npr0Image;
    this.collisionLine;
    this.missilesS1 = {
      p21: new MissileP21(this.simulare),
      p22: new MissileP22(this.simulare),
    }; this.missilesS2 = {
      p21: new MissileP21(this.simulare),
      p22: new MissileP22(this.simulare),
    };
    this.updatedPosition = false;
    this.markedForDeletion = false;
    this.timeForNpr2 = false;
    this.moveX = 0;
  }
  createFireReaction() {
    for (let i = 0; i < 10; i++) {
      this.simulare.shipFireParticles.unshift(
        new ShipFire(this.simulare, this)
      );
    }
  }
  update() {
    this.collisionLine = Math.trunc(this.x - this.approachLine.x + 20);
    if (this.collisionLine <= 0) {
      this.createFireReaction();
    }
    if (this.collisionLine <= -100) {
      this.x += this.simulare.speed * 8;
      this.moveX = this.simulare.speed * 8;
    } else {
      this.x -= this.simulare.speed * 5;
      this.moveX = this.simulare.speed * 5;
    }
  }
  initialDraw(context) {
    context.drawImage(
      this.image,
      0,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.initialX,
      this.initialY,
      this.initialWidth,
      this.initialHeight
    );
  }
  lineBlinking(context) {
    if (this.collisionLine <= 300) {
      this.approachLine.appearBlinking = true;
      this.approachLine.draw(context);
    } else {
      this.approachLine.appearBlinking = false;
    }
  }
}
export class Fregata extends Ship {
  constructor(simulare) {
    super(simulare);
    this.simulare = simulare;
    this.image = fregataImage;
    this.spriteWidth = 528;
    this.spriteHeight = 466;
    this.initialWidth = this.spriteWidth / 4;
    this.width = this.spriteWidth / 2.5;
    this.initialHeight = this.spriteHeight / 3;
    this.height = this.spriteHeight / 2;
    this.initialX = this.totalWidth / 2 - this.initialWidth / 2;
    this.x = this.totalWidth / 2 - this.width / 2;
    this.initialY = this.totalHeight / 2 - this.initialHeight / 2;
    this.y = this.totalHeight / 2 - this.height / 2;
    this.isDrawn = false;
    this.radius = this.width * 2.3;
    this.approachLine = new ArcDetection(this.simulare);
    this.radar = new Radar(this.simulare);
    this.fireAK630 = [
      new FireAK630(this.simulare),
      new FireAK630(this.simulare),
    ];
    this.fireAK630_2 = [
      new FireAK630_2(this.simulare),
      new FireAK630_2(this.simulare),
    ];
    this.fireAK726 = [
      new FireAK726(this.simulare),
      new FireAK726(this.simulare),
    ];
    this.firePK16_Right = [
			new FirePK16_1(
				this.simulare,
				this.x + this.width / 0.9,
				this.y + this.height / 3.2
			),
			new FirePK16_2(
				this.simulare,
				this.x + this.width / 0.95,
				this.y + this.height / 3.2
			),
			new FirePK16_3(
				this.simulare,
				this.x + this.width / 1,
				this.y + this.height / 3.2
			),
			new FirePK16_4(
				this.simulare,
				this.x + this.width / 1.2,
				this.y + this.height / 3.2
			),
			new FirePK16_5(
				this.simulare,
				this.x + this.width / 1.4,
				this.y + this.height / 3.2
			),
			new FirePK16_6(
				this.simulare,
				this.x + this.width / 1.6,
				this.y + this.height / 3.2
			),
		];
		this.firePK16_Left = [
			new FirePK16_7(
				this.simulare,
				this.x + this.width / 0.9,
				this.y + this.height / 3.2
			),
			new FirePK16_8(
				this.simulare,
				this.x + this.width / 0.95,
				this.y + this.height / 3.2
			),
			new FirePK16_9(
				this.simulare,
				this.x + this.width / 1,
				this.y + this.height / 3.2
			),
			new FirePK16_10(
				this.simulare,
				this.x + this.width / 1.2,
				this.y + this.height / 3.2
			),
			new FirePK16_11(
				this.simulare,
				this.x + this.width / 1.4,
				this.y + this.height / 3.2
			),
			new FirePK16_12(
				this.simulare,
				this.x + this.width / 1.6,
				this.y + this.height / 3.2
			),
		];
    this.zoomedIn = false;
  }
  draw(context) {
    context.drawImage(
      this.image,
      0,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.drawApproachLine(context, this.approachLine, this.radius);
    this.isDrawn = true;
    if (this.simulare.zoomedIn) this.radar.draw(context);
  }
  drawApproachLine(context, line, radius) {
    line.appearBlinking = true;
    line.draw(context, radius);
  }
  checkArcCollision1(missile, missileX, missileY) {
    if (missile) {
      const dx = this.approachLine.x - missileX;
      const dy = this.approachLine.y - missileY;
      const distance = Math.trunc(Math.sqrt(dx * dx + dy * dy)) - 30;
      const sumOfRadius = missile.radius + this.radius;
      return distance < sumOfRadius;
    }
  }
  checkArcCollision2(missile, missileX, missileY) {
    if (missile) {
      const dx = missileX - this.approachLine.x;
      const dy = missileY - this.approachLine.y;
      const distance = Math.trunc(Math.sqrt(dx * dx + dy * dy)) + 20;
      const sumOfRadius = missile.radius + this.radius;
      return distance < sumOfRadius;
    }
  }
}
