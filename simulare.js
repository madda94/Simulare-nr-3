import { Ship, Fregata } from './ship.js';
import { Background } from './scrollingBackground.js';
import { btnsScenarii } from './script.js';
import { Explosion, ExplosionShip } from './explosions.js';

export class Simulare {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.background = new Background(this);
		this.ships = [new Ship(this), new Ship(this), new Fregata(this)];
		this.smokeParticles = [];
		this.smokeParticles2 = [];
		this.smokeParticlesAK726 = [];
		this.explosions = [];
		this.explosionsShip = [];
		this.cloud = [];
		this.fregataArcCollision1 = false;
		this.fregataArcCollision2 = false;
		this.fregataArcCollision1_2km = false;
		this.fregataArcCollision2_2km = false;
		this.fps = 20;
		this.zoomInterval = 1000 / this.fps;
		this.zoomTime = 0;
		this.scenariu1Time = false;
		this.scenariu2Time = false;
		this.zoomedIn = false;
		this.explosionCount = 0;
		this.maxExplosions = 10;
		this.explosionMissile = 1;
		this.explosionShip = 1.5;
		this.attackOver = false;
	}
	initialDisplay(context) {
		this.background.draw(context);
		this.ships[1].image = npr1Image;
		this.ships[1].initialY = this.height - this.ships[1].initialHeight * 1.5;
		this.ships[1].initialX = 0;

		setTimeout(() => {
			this.ships.forEach((ship) => {
				ship.initialDraw(context);
			});
		}, 100);
	}

	draw(context) {
		context.clearRect(0, 0, this.width, this.height);
		this.background.draw(context);
		if (!this.scenariu1Time) this.ships[2].draw(context);
	}
	checkFregataLineCollision(context) {
		if (
			this.ships[0].missiles.p21 &&
			this.ships[2].checkArcCollision1(
				this.ships[0].missiles.p21,
				this.ships[0].missiles.p21.x,
				this.ships[0].missiles.p21.y
			)
		)
			this.fregataArcCollision1 = true;

		if (
			this.ships[1].missiles.p21 &&
			this.ships[2].checkArcCollision2(
				this.ships[1].missiles.p21,
				this.ships[1].missiles.p21.x2,
				this.ships[1].missiles.p21.y2
			)
		)
			this.fregataArcCollision2 = true;

		if (this.fregataArcCollision1 && this.fregataArcCollision2)
			if (this.zoomTime < this.zoomInterval) {
				this.zoomIn(context);
				this.zoomTime += 5;
			}
	}
	controlMissiles(context) {
		if (!this.scenariu1Time) {
			if (!this.fregataArcCollision1)
				Object.keys(this.ships[0].missiles).forEach((key) => {
					this.ships[0].missiles[key].draw(context);
					this.ships[0].missiles[key].update();
				});
			else if (this.fregataArcCollision1)
				Object.keys(this.ships[0].missiles).forEach((key) => {
					this.ships[0].missiles[key].draw(context);
				});
			if (!this.fregataArcCollision2)
				Object.keys(this.ships[1].missiles).forEach((key) => {
					this.ships[1].missiles[key].draw2(context);
					this.ships[1].missiles[key].update2();
				});
			else if (this.fregataArcCollision2)
				Object.keys(this.ships[1].missiles).forEach((key) => {
					this.ships[1].missiles[key].draw2(context);
				});
		}
	}
	zoomIn(context) {
		this.ships[2].radius *= 1.02;
		this.ships[2].width *= 1.04;
		this.ships[2].x /= 1.01;
		this.ships[2].y /= 1.05;
		this.ships[2].height *= 1.04;
		this.ships[2].draw(context);
		Object.keys(this.ships[0].missiles).forEach((key) => {
			this.ships[0].missiles[key].x -= 50;
			this.ships[0].missiles[key].y += 20;
			this.ships[0].missiles[key].width *= 1.02;
			this.ships[0].missiles[key].height *= 1.02;
			this.ships[0].missiles[key].draw(context);
		});
		Object.keys(this.ships[1].missiles).forEach((key) => {
			this.ships[1].missiles[key].x2 += 50;
			this.ships[1].missiles[key].y2 -= 20;
			this.ships[1].missiles[key].width *= 1.02;
			this.ships[1].missiles[key].height *= 1.02;
			this.ships[1].missiles[key].draw(context);
		});
		this.zoomedIn = true;
		setTimeout(() => {
			btnsScenarii.style.display = 'block';
		}, 100);
	}
	update(context) {
		this.checkFregataLineCollision(context);
		this.controlMissiles(context);
		this.smokeParticles.forEach((particle) => {
			particle.update();
		});
		this.smokeParticles2.forEach((particle) => {
			particle.update();
		});
		this.smokeParticlesAK726.forEach((particle) => {
			particle.update();
		});
		this.smokeParticles = this.smokeParticles.filter(
			(particle) => !particle.markedForDeletion
		);
		this.smokeParticles2 = this.smokeParticles2.filter(
			(particle) => !particle.markedForDeletion
		);
		this.smokeParticlesAK726 = this.smokeParticlesAK726.filter(
			(particle) => !particle.markedForDeletion
		);
		this.explosions.forEach((explosion) => {
			explosion.update(context);
			explosion.draw(context);
		});
		this.explosions = this.explosions.filter(
			(explosion) => !explosion.markedForDeletion
		);
		this.explosionsShip = this.explosionsShip.filter(
			(explosion) => !explosion.markedForDeletion
		);
		this.cloud = this.cloud.filter((cloud) => !cloud.markedForDeletion);
		if (this.ships[2].isDrawn) this.ships[2].radar.update();
	}

	controlMissilesBeforeAttackShip0MisssileP21(missile, shipPos) {
		if (missile && missile.x < shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.5;
			missile.lightHeadMissile();
			missile.x += missile.speedX;
			missile.y -= missile.speedY;
		} else if (missile && missile.x >= shipPos) {
			missile.deviat = true;
			missile.speedX = 1;
			missile.speedY = 1.3;
			missile.x += missile.speedX;
			missile.y -= missile.speedY;
		}
		if (missile.y <= 0 || missile.x >= this.width)
			missile.markedForDeletion = true;
	}
	controlMissilesBeforeAttackShip0MisssileP22(
		missile,
		shipPos,
		explosionX,
		explosionY,
		explosionSize
	) {
		if (missile && missile.x < shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.5;
			missile.lightHeadMissile();
			missile.x += missile.speedX;
			missile.y -= missile.speedY;
		} else if (missile && missile.x >= shipPos) {
			if (this.explosionCount < this.maxExplosions) {
				this.explosions.unshift(
					new ExplosionShip(this, explosionX, explosionY, explosionSize)
				);
				this.explosionCount++;
				missile.markedForDeletion = true;
			}
		}
	}
	controlMissilesBeforeAttackShip1MissileP21(
		missile,
		shipPos,
		explosionX,
		explosionY,
		explosionSize
	) {
		if (missile && missile.x2 > shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.38;
			missile.lightHeadMissile();
			missile.x2 -= missile.speedX;
			missile.y2 += missile.speedY;
		} else if (missile && missile.x2 <= shipPos) {
			if (this.explosionCount < this.maxExplosions) {
				this.explosions.unshift(
					new Explosion(this, explosionX, explosionY, explosionSize)
				);
				this.explosionCount++;
				missile.markedForDeletion = true;
			}
		}
	}
	controlMissilesBeforeAttackShip1MissileP22(
		missile,
		shipPos,
		explosionX,
		explosionY,
		explosionSize
	) {
		if (missile && missile.x2 > shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.38;
			missile.lightHeadMissile();
			missile.x2 -= missile.speedX;
			missile.y2 += missile.speedY;
		} else if (missile && missile.x2 <= shipPos) {
			if (this.explosionCount < this.maxExplosions) {
				this.explosionsShip.unshift(
					new ExplosionShip(this, explosionX, explosionY, explosionSize)
				);
				this.explosionCount++;
				missile.markedForDeletion = true;
			}
		}
	}
	controlFireAK630(context, ak1, ak2) {
		if (!ak1.fireStop) {
			ak1.update(context);
			ak2.x = this.width / 1.8;
			ak2.y = this.height / 2.95;
			ak2.update(context);
		}
	}
	controlFireAK630_2(context, ak1, ak2) {
		if (!ak1.fireStop) {
			ak1.update(context);
			ak2.x = this.width / 2.35;
			ak2.y = this.height / 3;
			ak2.update(context);
		}
	}
	controlFireAK726(context, ak1, ak2) {
		ak2.fireInterval = 120;
		ak2.x = this.width / 2.6;
		ak2.y = this.height / 2;
		ak1.update(context);
		ak2.update(context);
	}

	controlAttackShip0(ship) {
		if (ship.missiles.p21) {
			this.controlMissilesBeforeAttackShip0MisssileP21(
				ship.missiles.p21,
				this.ships[2].x - this.ships[2].width / 1.8
			);
		}
		if (ship.missiles.p22) {
			this.controlMissilesBeforeAttackShip0MisssileP22(
				ship.missiles.p22,
				this.ships[2].x + 50,
				ship.missiles.p22.x - ship.missiles.p22.width * 1.25,
				ship.missiles.p22.y - ship.missiles.p22.height * 1.25,
				this.explosionShip
			);
		}
		if (ship.missiles.p21 && ship.missiles.p21.markedForDeletion)
			delete ship.missiles.p21;
		if (ship.missiles.p22 && ship.missiles.p22.markedForDeletion)
			delete ship.missiles.p22;

		if (!Object.keys(ship.missiles).length) {
			this.attackOver = true;
		}
	}
	controlAttackShip1(ship) {
		if (ship.missiles.p21) {
			this.controlMissilesBeforeAttackShip1MissileP21(
				ship.missiles.p21,
				this.ships[2].x + this.ships[2].width * 1.3,
				ship.missiles.p21.x2,
				ship.missiles.p21.y2,
				this.explosionMissile
			);
		}
		if (ship.missiles.p22) {
			this.controlMissilesBeforeAttackShip1MissileP22(
				ship.missiles.p22,
				this.ships[2].x + ship.missiles.p22.width * 2.5,
				ship.missiles.p22.x2 - ship.missiles.p22.width * 1.1,
				ship.missiles.p22.y2,
				this.explosionShip
			);
		}
		if (ship.missiles.p21 && ship.missiles.p21.markedForDeletion)
			delete ship.missiles.p21;
		if (ship.missiles.p22 && ship.missiles.p22.markedForDeletion)
			delete ship.missiles.p22;

		if (!Object.keys(ship.missiles).length) {
			this.attackOver = true;
		}
	}
	checkFregataLineCollision_2km() {
		if (
			this.ships[0].missiles.p21 &&
			this.ships[2].checkArcCollision1(
				this.ships[0].missiles.p21,
				this.ships[0].missiles.p21.x,
				this.ships[0].missiles.p21.y
			)
		)
			this.fregataArcCollision1_2km = true;

		if (
			this.ships[1].missiles.p21 &&
			this.ships[2].checkArcCollision2(
				this.ships[1].missiles.p21,
				this.ships[1].missiles.p21.x2,
				this.ships[1].missiles.p21.y2
			)
		)
			this.fregataArcCollision2_2km = true;
	}
	scenariu1(context) {
		this.scenariu1Time = true;
		if (this.scenariu1Time) {
			this.checkFregataLineCollision_2km();
			this.controlAttackShip0(this.ships[0]);
			this.controlAttackShip1(this.ships[1]);
			Object.keys(this.ships[0].missiles).forEach((key) => {
				if (!this.ships[0].missiles[key].deviat)
					this.ships[0].missiles[key].draw(context);
				else this.ships[0].missiles[key].drawAfterDeviation(context);
			});
			if (this.fregataArcCollision1_2km) {
				this.controlFireAK630_2(
					context,
					this.ships[2].fireAK630_2[0],
					this.ships[2].fireAK630_2[1]
				);
				this.smokeParticles2.forEach((particle) => {
					particle.draw(context);
				});
				this.ships[2].firePK16.update(context);
			}

			this.cloud.forEach((cloud) => {
				cloud.update(context);
			});
			this.ships[2].draw(context);
			if (this.fregataArcCollision2_2km) {
				this.smokeParticles.forEach((particle) => {
					particle.draw(context);
				});
				this.controlFireAK630(
					context,
					this.ships[2].fireAK630[0],
					this.ships[2].fireAK630[1]
				);
			}
			this.controlFireAK726(
				context,
				this.ships[2].fireAK726[0],
				this.ships[2].fireAK726[1]
			);
			this.smokeParticlesAK726.forEach((particle) => {
				particle.draw(context);
			});
			Object.keys(this.ships[1].missiles).forEach((key) => {
				this.ships[1].missiles[key].draw2(context);
			});
			this.explosionsShip.forEach((explosion) => {
				explosion.update(context);
				explosion.draw(context);
			});
		}
		requestAnimationFrame(() => this.scenariu1(context));
	}

	animate(context) {
		this.draw(context);
		this.update(context);
		requestAnimationFrame(() => this.animate(context));
	}
}
