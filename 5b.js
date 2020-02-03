var canvas;
const width = 960;
const height = 540;
const pixelRatio = 2;
var ctx;
const fontFamily = 'Helvetica'

var pmouseIsPressed = false;

const lvlCount = 133;
var menu = 0;
var levelStatuses = new Array(lvlCount);
var levelButtons = new Array(lvlCount);
var flashEffect = 1;
var m1Scroll = 0;

var menu0img = new Image();

var buttonWatch5a = new button(670, 308, 264, 27.5, 5, '#fff', '#d4d4d4', '#b8b8b8', 'WATCH BFDIA 5a', 30);
var buttonNewGame = new button(670, 353, 264, 27.5, 5, '#fff', '#d4d4d4', '#b8b8b8', 'NEW GAME', 30);
var buttonContinueGame = new button(670, 398, 264, 27.5, 5, '#fff', '#d4d4d4', '#b8b8b8', 'CONTINUE GAME', 30);
var buttonLevelCreator = new button(670, 443, 264, 27.5, 5, '#fff', '#d4d4d4', '#b8b8b8', 'LEVEL CREATOR', 30);
var buttonExplore = new button(670, 488, 264, 27.5, 5, '#939393', '#868686', '#7e7e7e', 'EXPLORE', 30);

function setup() {
	createCanvas(width, height);
	canvas = document.getElementById('defaultCanvas0');
	document.getElementById('center').insertBefore(canvas,document.getElementsByTagName('p')[0]);
	ctx = canvas.getContext('2d');
	pixelDensity(pixelRatio);

	menu0img.onload = function() {ctx.drawImage(menu0img, 0, 0);}
	menu0img.src = 'imgs/menu0.png';

	for (var i = 0; i < lvlCount; i++) {
		levelStatuses[i] = 0;
		levelButtons[i] = new levelButton(i);
	}
	levelStatuses[0] = 3;
	levelStatuses[1] = 2;
	levelStatuses[2] = 1;
}

function draw() {
	requestAnimationFrame(draw);

	if (menu == 0) {
		// Background
		ctx.fillStyle = '#666';
		ctx.fillRect(0, 0, width, height);

		buttonWatch5a.show();
		buttonWatch5a.update();
		buttonNewGame.show();
		buttonNewGame.update();
		buttonContinueGame.show();
		buttonContinueGame.update();
		buttonLevelCreator.show();
		buttonLevelCreator.update();
		buttonExplore.show();
		buttonExplore.update();

		if (buttonContinueGame.relesed()) {
			menu = 1;
		}
		if (buttonWatch5a.relesed()) {
			window.open('https://www.youtube.com/watch?v=4q77g4xo9ic');
		}
		if (buttonLevelCreator.relesed()) {
			window.open('https://zolo101.github.io/BFDIA5bLevelEditor/');
		}

		ctx.drawImage(menu0img, 0, 0, width, height);

		ctx.font = '32px '+fontFamily;
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'right';
		ctx.textBaseline = 'top';
		ctx.fillText('By Cary Huang', width-10, 10);
		ctx.font = '16px '+fontFamily;
		ctx.fillText('Music By Michael Huang', width-10, 46);
	} else if (menu == 1) {
		ctx.fillStyle = '#777';
		ctx.fillRect(0, 0, width, height);

		ctx.translate(0, m1Scroll);

		for (var i=0; i<lvlCount; i++) {
			levelButtons[i].show();
			if (levelStatuses[i] != 0) {levelButtons[i].update();}
		}
	}

	ctx.fillStyle = 'rgba(255,255,255,'+flashEffect+')';
	ctx.fillRect(0, 0, width, height);
	if (flashEffect>0) flashEffect-=0.001;
	pmouseIsPressed = mouseIsPressed
}

function mouseWheel (event) {
	if (menu == 1) {
		m1Scroll -= event.delta;
		return false;
	}
}

function button(x, y, w, h, cr, fillNormal, fillHover, fillPress, text, fontSize) {
	this.fillNormal = fillNormal;
	this.fillHover = fillHover;
	this.fillPress = fillPress;

	this.fill = this.fillNormal;
	this.cr = cr;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.text = text;

	this.held = false;

	this.show = function() {
		ctx.beginPath();
		ctx.fillStyle = this.fill;
		ctx.arc(this.x, this.y, this.cr, Math.PI, Math.PI * 1.5, false);
		ctx.arc(this.x + this.w, this.y, this.cr, Math.PI * 1.5, Math.PI * 2, false);
		ctx.arc(this.x + this.w, this.y + this.h, this.cr, Math.PI * 2, Math.PI * 2.5, false);
		ctx.arc(this.x, this.y+ this.h, this.cr, Math.PI * 2.5, Math.PI * 3, false);
		ctx.lineTo(this.x - this.cr, this.y);
		ctx.fill();

		ctx.font = 'bold '+fontSize+'px '+fontFamily;
		ctx.fillStyle = '#666';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.text, this.x+this.w/2, this.y+this.h*1.1/2);
	}

	this.update = function() {
		this.hover();
		if (this.pressed()) {
			this.held = true;
		} else if (!mouseIsPressed) {
			this.held = false;
		}
	}

	this.hover = function() {
		if (this.hovering(mouseX, mouseY)) {
			this.fill = this.fillHover;
			if (mouseIsPressed) {
				this.fill = this.fillPress;
			}
		} else if (this.held && !this.hovering(mouseX, mouseY)) {
			this.fill = this.fillHover;
		} else {
			this.fill = this.fillNormal;
		}
	}

	this.hovering = function(x, y) {
		return x>=this.x && x<=this.x+this.w && y>=this.y && y<=this.y+this.h;
	}

	this.pressed = function() {
		return this.hovering(mouseX, mouseY) && mouseIsPressed;
	}

	this.ppressed = function() {
		return this.hovering(pmouseX, pmouseY) && pmouseIsPressed;
	}

	this.relesed = function() {
		return this.ppressed() && !this.pressed() && !this.held;
	}
}

function levelButton (place) {
	this.place = place;
	this.text = zeroFill(place+1, 3);

	this.fill = '#585858';
	this.x = 110*(place%8) + 45;
	this.y = 6.2*(Math.floor(place/8)*8);
	this.w = 100;
	this.h = 40;
	this.held = false;

	this.show = function() {
		ctx.fillStyle = this.fill;
		ctx.lineWidth = 2;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		ctx.font = 'bold 45px '+fontFamily;
		ctx.fillStyle = '#000';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(this.text, this.x + (this.w/2), this.y + (this.h/2));
	}

	this.update = function() {
		this.hover();
		if (this.pressed()) {
			this.held = true;
		} else if (!mouseIsPressed) {
			this.held = false;
		}
	}

	this.hover = function() {
		var fillNormal = '#585858';
		var fillHover = '#585858';
		var fillPress = '#585858';
		if (levelStatuses[place] == 1) {
			fillNormal = '#ff8000';
			fillHover = '#ffaa55';
			fillPress = '#d56a01';
		} else if (levelStatuses[place] == 2) {
			fillNormal = '#efe303';
			fillHover = '#ffff99';
			fillPress = '#c6bc03';
		} else if (levelStatuses[place] == 3) {
			fillNormal = '#00cc00';
			fillHover = '#22ff22';
			fillPress = '#00a201';
		}

		if (this.hovering(mouseX, mouseY)) {
			this.fill = fillHover;
			if (mouseIsPressed) {
				this.fill = fillPress;
			}
		} else if (this.held && !this.hovering(mouseX, mouseY)) {
			this.fill = fillHover;
		} else {
			this.fill = fillNormal;
		}
	}

	this.hovering = function(x, y) {
		return x>=this.x && x<=this.x+this.w && (y-m1Scroll)>=this.y && (y-m1Scroll)<=this.y+this.h;
	}

	this.pressed = function() {
		return this.hovering(mouseX, mouseY) && mouseIsPressed;
	}

	this.ppressed = function() {
		return this.hovering(pmouseX, pmouseY) && pmouseIsPressed;
	}

	this.relesed = function() {
		return this.ppressed() && !this.pressed() && !this.held;
	}
}

// https://stackoverflow.com/questions/1267283/how-can-i-pad-a-value-with-leading-zeros
function zeroFill(number, width) {
	width -= number.toString().length;
	if (width > 0) {
		return new Array(width + (/\./.test(number) ? 2:1)).join('0') + number;
	}
	return number + ''; // always return a string
}

setup();
draw();