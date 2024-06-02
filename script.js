import { Simulare } from './simulare.js';

export const btnsScenarii = document.querySelector('.btns-scenarii');
const startBtn = document.querySelector('.start');
const btnScenariu1 = document.getElementById('scenariu1');
const btnScenariu2 = document.getElementById('scenariu2');
const btnContinue = document.getElementById('continue');

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const simulare = new Simulare(canvas.width, canvas.height);

window.addEventListener('load', () => {
	simulare.background.draw(ctx);
	simulare.initialDisplay(ctx);
	startBtn.style.display = 'block';
});

startBtn.addEventListener('click', function () {
	simulare.animate(ctx);
	startBtn.style.display = 'none';
	btnContinue.style.display = 'block';
});
btnContinue.addEventListener('click', function () {
	if (simulare.continue) {
		simulare.continue = false;
		btnContinue.classList.add('selected');
	} else
	{
		simulare.continue = true;
		btnContinue.classList.remove('selected');
	} 

});

btnsScenarii.addEventListener('click', function (e) {
	btnScenariu1.classList.remove('selected');
	btnScenariu2.classList.remove('selected');
	if (e.target.dataset.id === '1') {
		btnScenariu1.classList.add('selected');
		if (simulare.continue) {
			simulare.scenariu1Time = true;
			simulare.scenariu1(ctx);
		}
	} else if (e.target.dataset.id === '2') {
		btnScenariu2.classList.add('selected');
		console.log(simulare.scenariu2Time);
		if (simulare.scenariu2Time && simulare.continue && simulare.attackOverS1) {
			simulare.scenariu2(ctx);
		}
	}
});
