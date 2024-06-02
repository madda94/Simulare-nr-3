import { Ship, Fregata } from './ship.js';
import { Background } from './scrollingBackground.js';
import { btnsScenarii } from './script.js';
import { Explosion, ExplosionShip } from './explosions.js';

export class Simulare {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.speed = 1;
		this.background = new Background(this);
		this.ships = [new Ship(this), new Ship(this), new Fregata(this)];
		this.smokeParticles = [];
		this.smokeParticles2 = [];
		this.smokeParticlesAK726 = [];
		this.explosions = [];
		this.explosionsShip = [];
		this.cloud = [];
		this.cloud2 = [];
		this.fregataArcCollision1 = false;
		this.fregataArcCollision2 = false;
		this.fregataArcCollision1_2kmS1 = false;
		this.fregataArcCollision2_2kmS1 = false;
		this.fregataArcCollision1_2kmS2 = false;
		this.fregataArcCollision2_2kmS2 = false;
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
		this.attackOverS1 = false;
		this.attackOverS2 = false;
		this.continue = true;
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
		this.ships[2].draw(context);
	}
	checkFregataLineCollision(context) {
		if (
			this.ships[0].missilesS1.p21 &&
			this.ships[2].checkArcCollision1(
				this.ships[0].missilesS1.p21,
				this.ships[0].missilesS1.p21.x,
				this.ships[0].missilesS1.p21.y
			)
		)
			this.fregataArcCollision1 = true;

		if (
			this.ships[1].missilesS1.p21 &&
			this.ships[2].checkArcCollision2(
				this.ships[1].missilesS1.p21,
				this.ships[1].missilesS1.p21.x2,
				this.ships[1].missilesS1.p21.y2
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
				Object.keys(this.ships[0].missilesS1).forEach((key) => {
					this.ships[0].missilesS1[key].draw(context);
					this.ships[0].missilesS1[key].update();
				});
			else if (this.fregataArcCollision1)
				Object.keys(this.ships[0].missilesS1).forEach((key) => {
					this.ships[0].missilesS1[key].draw(context);
				});
			if (!this.fregataArcCollision2)
				Object.keys(this.ships[1].missilesS1).forEach((key) => {
					this.ships[1].missilesS1[key].draw2(context);
					this.ships[1].missilesS1[key].update2();
				});
			else if (this.fregataArcCollision2)
				Object.keys(this.ships[1].missilesS1).forEach((key) => {
					this.ships[1].missilesS1[key].draw2(context);
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
		Object.keys(this.ships[0].missilesS1).forEach((key) => {
			this.ships[0].missilesS1[key].x -= 50;
			this.ships[0].missilesS1[key].y += 20;
			this.ships[0].missilesS1[key].width *= 1.02;
			this.ships[0].missilesS1[key].height *= 1.02;
			this.ships[0].missilesS1[key].draw(context);
		});
		Object.keys(this.ships[1].missilesS1).forEach((key) => {
			this.ships[1].missilesS1[key].x2 += 50;
			this.ships[1].missilesS1[key].y2 -= 20;
			this.ships[1].missilesS1[key].width *= 1.02;
			this.ships[1].missilesS1[key].height *= 1.02;
			this.ships[1].missilesS1[key].draw(context);
		});
		Object.keys(this.ships[0].missilesS2).forEach((key) => {
			this.ships[0].missilesS2[key].x -= 50;
			this.ships[0].missilesS2[key].y += 20;
			this.ships[0].missilesS2[key].width *= 1.02;
			this.ships[0].missilesS2[key].height *= 1.02;
		});
		Object.keys(this.ships[1].missilesS2).forEach((key) => {
			this.ships[1].missilesS2[key].x += 50;
			this.ships[1].missilesS2[key].y2 -= 20;
			this.ships[1].missilesS2[key].width *= 1.02;
			this.ships[1].missilesS2[key].height *= 1.02;
		});
		this.zoomedIn = true;
		this.scenariu1Time = true;
		setTimeout(() => {
			btnsScenarii.style.display = 'block';
		}, 100);
	}
	update(context) {
		if (this.continue) {
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
			this.cloud2 = this.cloud2.filter((cloud) => !cloud.markedForDeletion);
			if (this.ships[2].isDrawn) this.ships[2].radar.update();
		}
		Object.keys(this.ships[0].missilesS1).forEach((key) => {
			if (!this.ships[0].missilesS1[key].deviat)
				this.ships[0].missilesS1[key].draw(context);
			else this.ships[0].missilesS1[key].drawAfterDeviation(context);
		});
		Object.keys(this.ships[1].missilesS1).forEach((key) => {
			if (!this.ships[1].missilesS1[key].deviat)
				this.ships[1].missilesS1[key].draw2(context);
			else this.ships[1].missilesS1[key].drawAfterDeviation2(context);
		});
		if (
			this.scenariu2Time &&
			Object.keys(this.ships[0].missilesS2).length > 0 
		)
			Object.keys(this.ships[0].missilesS2).forEach((key) => {
				this.ships[0].missilesS2[key].draw(context);
			});
			if (this.scenariu2Time && Object.keys(this.ships[1].missilesS2).length > 0)
			Object.keys(this.ships[1].missilesS2).forEach((key) => {
				this.ships[1].missilesS2[key].draw2(context);
			});
		}
	controlMissilesBeforeAttackShip0P21S1(missile, shipPos) {
		if (missile && missile.x < shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.5;
			missile.lightHeadMissile();
			missile.x += missile.speedX;
			missile.y -= missile.speedY;
		} else if (missile && missile.x >= shipPos) {
			missile.deviat = true;
			missile.lightHead = false;
			missile.speedX = 1;
			missile.speedY = 1.3;
			missile.x += missile.speedX;
			missile.y -= missile.speedY;
		}
		if (missile.y <= 0 || missile.x >= this.width)
			missile.markedForDeletion = true;
	}
	controlMissilesBeforeAttackShip0P22S1(
		missile,
		shipPos,
		explosionX,
		explosionY,
		explosionSize
	) {
		if (missile && missile.x < shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.38;
			missile.lightHeadMissile();
			missile.x += missile.speedX;
			missile.y -= missile.speedY;
		} else if (missile && missile.x >= shipPos) {
			if (this.explosionCount < this.maxExplosions) {
				this.explosionsShip.unshift(
					new ExplosionShip(this, explosionX, explosionY, explosionSize)
				);
				this.explosionCount++;
				missile.markedForDeletion = true;
			}
		}
	}
	controlMissilesBeforeAttackShip1S1(missile, shipPos) {
		if (missile && missile.x2 > shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.38;
			missile.lightHeadMissile();
			missile.x2 -= missile.speedX;
			missile.y2 += missile.speedY;
		} else if (missile && missile.x2 <= shipPos) {
			missile.deviat = true;
			missile.lightHead = false;
			missile.speedX = 1;
			missile.speedY = 1;
			missile.x2 -= missile.speedX;
			missile.y2 -= missile.speedY;
			if (missile.y2 <= 0 - missile.height) missile.markedForDeletion = true;
		}
	}
	controlAttackShip0S1(ship) {
		if (ship.missilesS1.p21) {
			this.controlMissilesBeforeAttackShip0P21S1(
				ship.missilesS1.p21,
				this.ships[2].x - this.ships[2].width / 1.8
			);
		}
		if (ship.missilesS1.p22) {
			this.controlMissilesBeforeAttackShip0P22S1(
				ship.missilesS1.p22,
				this.ships[2].x - this.ships[2].width / 1.8,
				ship.missilesS1.p22.x - ship.missilesS1.p22.width * 1.1,
				ship.missilesS1.p22.y,
				this.explosionShip
			);
		}
		if (ship.missilesS1.p21 && ship.missilesS1.p21.markedForDeletion)
			delete ship.missilesS1.p21;
		if (ship.missilesS1.p22 && ship.missilesS1.p22.markedForDeletion)
			delete ship.missilesS1.p22;
	}
	controlAttackShip1S1(ship) {
		if (ship.missilesS1.p21) {
			this.controlMissilesBeforeAttackShip1S1(
				ship.missilesS1.p21,
				this.ships[2].x + this.ships[2].width * 1.3
			);
		}
		if (ship.missilesS1.p22) {
			this.controlMissilesBeforeAttackShip1S1(
				ship.missilesS1.p22,
				this.ships[2].x + ship.missilesS1.p22.width * 2.5
			);
		}
		if (ship.missilesS1.p21 && ship.missilesS1.p21.markedForDeletion)
			delete ship.missilesS1.p21;
		if (ship.missilesS1.p22 && ship.missilesS1.p22.markedForDeletion)
			delete ship.missilesS1.p22;
	}

	controlFireAK630(context, ak1, ak2) {
		if (!ak1.fireStop && !this.attackOver) {
			ak1.update(context);
			ak2.x = this.width / 1.8;
			ak2.y = this.height / 2.95;
			ak2.update(context);
		}
	}
	controlFireAK630_2(context, ak1, ak2) {
		if (!ak1.fireStop && !this.attackOver) {
			ak1.update(context);
			ak2.x = this.width / 2.35;
			ak2.y = this.height / 3;
			ak2.update(context);
		}
	}
	controlFireAK726(context, ak1, ak2) {
		if (!this.attackOver) {
			ak2.fireInterval = 120;
			ak2.x = this.width / 2.6;
			ak2.y = this.height / 2;
			ak1.update(context);
			ak2.update(context);
		}
	}

	controlMissilesBeforeAttackShip0S2(
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
	controlMissilesBeforeAttackShip1S2(
		missile,
		shipPos,
		explosionX,
		explosionY,
		explosionSize
	) {
		if (missile && missile.x2 > shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.5;
			missile.lightHeadMissile();
			missile.x2 -= missile.speedX;
			missile.y2 += missile.speedY;
		} else if (missile && missile.x2 <= shipPos) {
			if (this.explosionCount < this.maxExplosions) {
				this.explosions.unshift(
					new ExplosionShip(this, explosionX, explosionY, explosionSize)
				);
				this.explosionCount++;
				missile.markedForDeletion = true;
			}
		}
	}

	controlAttackShip0S2(ship) {
		if (ship.missilesS2.p21) {
			this.controlMissilesBeforeAttackShip0S2(
				ship.missilesS2.p21,
				this.ships[2].x - this.ships[2].width / 1.8,
				ship.missilesS2.p22.x - ship.missilesS2.p22.width * 1.5,
				ship.missilesS2.p22.y - ship.missilesS2.p22.height * 1.5,
				this.explosionShip
			);
		}
		if (ship.missilesS2.p22) {
			this.controlMissilesBeforeAttackShip0S2(
				ship.missilesS2.p22,
				this.ships[2].x + 50,
				ship.missilesS2.p22.x - ship.missilesS2.p22.width * 1.25,
				ship.missilesS2.p22.y - ship.missilesS2.p22.height * 1.25,
				this.explosionShip
			);
		}
		if (ship.missilesS2.p21 && ship.missilesS2.p21.markedForDeletion)
			delete ship.missilesS2.p21;
		if (ship.missilesS2.p22 && ship.missilesS2.p22.markedForDeletion)
			delete ship.missilesS2.p22;
	}
	controlAttackShip1S2(ship) {
		if (ship.missilesS2.p21) {
			this.controlMissilesBeforeAttackShip1S2(
				ship.missilesS2.p21,
				this.ships[2].x + this.ships[2].width * 1.3,
				ship.missilesS2.p21.x2,
				ship.missilesS2.p21.y2,
				this.explosionShip
			);
		}
		if (ship.missilesS2.p22) {
			this.controlMissilesBeforeAttackShip1S2(
				ship.missilesS2.p22,
				this.ships[2].x + ship.missilesS2.p22.width * 2.5,
				ship.missilesS2.p22.x2 - ship.missilesS2.p22.width * 1.1,
				ship.missilesS2.p22.y2,
				this.explosionShip
			);
		}
		if (ship.missilesS2.p21 && ship.missilesS2.p21.markedForDeletion)
			delete ship.missilesS2.p21;
		if (ship.missilesS2.p22 && ship.missilesS2.p22.markedForDeletion)
			delete ship.missilesS2.p22;
	}
	checkFregataLineCollision_2kmS1() {
		if (
			this.ships[0].missilesS1.p21 &&
			this.ships[2].checkArcCollision1(
				this.ships[0].missilesS1.p21,
				this.ships[0].missilesS1.p21.x,
				this.ships[0].missilesS1.p21.y
			)
		)
			this.fregataArcCollision1_2kmS1 = true;

		if (
			this.ships[1].missilesS1.p21 &&
			this.ships[2].checkArcCollision2(
				this.ships[1].missilesS1.p21,
				this.ships[1].missilesS1.p21.x2,
				this.ships[1].missilesS1.p21.y2
			)
		)
			this.fregataArcCollision2_2kmS1 = true;
	}
	checkFregataLineCollision_2kmS2() {
		if (
			this.ships[0].missilesS2.p21 &&
			this.ships[2].checkArcCollision1(
				this.ships[0].missilesS2.p21,
				this.ships[0].missilesS2.p21.x,
				this.ships[0].missilesS2.p21.y
			)
		)
			this.fregataArcCollision1_2kmS2 = true;

		if (
			this.ships[1].missilesS2.p21 &&
			this.ships[2].checkArcCollision2(
				this.ships[1].missilesS2.p21,
				this.ships[1].missilesS2.p21.x2,
				this.ships[1].missilesS2.p21.y2
			)
		)
			this.fregataArcCollision2_2kmS2 = true;
	}
	scenariu1(context) {
		if (this.scenariu1Time) {
			if (this.continue && !this.attackOverS1 && !this.scenariu2Time) {
				this.checkFregataLineCollision_2kmS1();
				this.controlAttackShip0S1(this.ships[0]);
				this.controlAttackShip1S1(this.ships[1]);
				if (this.fregataArcCollision1_2kmS1) {
					this.ships[2].firePK16.update(context);
				}
				this.cloud.forEach((cloud) => {
					cloud.update(context);
				});
				this.cloud2.forEach((cloud) => {
					cloud.update(context);
				});
				// this.ships[2].draw(context);
				Object.keys(this.ships[0].missilesS1).forEach((key) => {
					if (!this.ships[0].missilesS1[key].deviat)
						this.ships[0].missilesS1[key].draw(context);
					else this.ships[0].missilesS1[key].drawAfterDeviation(context);
				});
				Object.keys(this.ships[1].missilesS1).forEach((key) => {
					if (!this.ships[1].missilesS1[key].deviat)
						this.ships[1].missilesS1[key].draw2(context);
					else this.ships[1].missilesS1[key].drawAfterDeviation2(context);
				});
				this.ships[2].draw(context);
				if (this.fregataArcCollision2_2kmS1) {
					this.ships[2].firePK16_2.update(context);
				}
				this.explosionsShip.forEach((explosion) => {
					explosion.update(context);
					explosion.draw(context);
				});
				if (
					Object.keys(this.ships[0].missilesS1).length === 0 &&
					Object.keys(this.ships[1].missilesS1).length === 0
				) {
					this.attackOverS1 = true;
					this.scenariu2Time = true;
				} else {
					requestAnimationFrame(() => this.scenariu1(context));
				}
			}
		}
	}

	scenariu2(context) {
		console.log(this.scenariu2Time);
		if (this.scenariu2Time && this.continue) {
			Object.keys(this.ships[0].missilesS2).forEach((key) => {
				this.ships[0].missilesS2[key].draw(context);
				this.ships[0].missilesS2[key].update();
			});
			Object.keys(this.ships[1].missilesS2).forEach((key) => {
				this.ships[1].missilesS2[key].draw2(context);
				this.ships[1].missilesS2[key].update2();
			});
			this.checkFregataLineCollision_2kmS2();
			this.controlAttackShip0S2(this.ships[0]);
			this.controlAttackShip1S2(this.ships[1]);
			if (this.fregataArcCollision1_2kmS2) {
				this.controlFireAK630_2(
					context,
					this.ships[2].fireAK630_2[0],
					this.ships[2].fireAK630_2[1]
				);
				this.smokeParticles2.forEach((particle) => {
					particle.draw(context);
				});
			}
			this.ships[2].draw(context);
			if (this.fregataArcCollision2_2kmS2) {
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
			Object.keys(this.ships[1].missilesS2).forEach((key) => {
				this.ships[1].missilesS2[key].draw2(context);
			});
			this.explosionsShip.forEach((explosion) => {
				explosion.update(context);
				explosion.draw(context);
			});
			if (
				Object.keys(this.ships[0].missilesS2).length === 0 &&
				Object.keys(this.ships[1].missilesS2).length === 0
			)
				this.attackOverS2 = true;
			else {
				requestAnimationFrame(() => this.scenariu2(context));
			}
		}
	}

	animate(context) {
		this.draw(context);
		this.update(context);
		requestAnimationFrame(() => this.animate(context));
	}
}
