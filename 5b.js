var canvas;
const width = 960;
const height = 540;
const pixelRatio = 2;
var ctx;

var pmouseIsPressed = false;

var menu = 0;

var buttonWatch5a = new button(670, 308, 264, 27.5, 5, '#fff', '#d4d4d4', '#b8b8b8', 'WATCH BFDIA 5a');
var buttonNewGame = new button(670, 353, 264, 27.5, 5, '#fff', '#d4d4d4', '#b8b8b8', 'NEW GAME');
var buttonContinueGame = new button(670, 398, 264, 27.5, 5, '#fff', '#d4d4d4', '#b8b8b8', 'CONTINUE GAME');
var buttonLevelCreator = new button(670, 443, 264, 27.5, 5, '#fff', '#d4d4d4', '#b8b8b8', 'LEVEL CREATOR');
var buttonExplore = new button(670, 488, 264, 27.5, 5, '#fff', '#d4d4d4', '#b8b8b8', 'EXPLORE');

function setup() {
	createCanvas(width, height);
	canvas = document.getElementById('defaultCanvas0');
	document.getElementById('center').insertBefore(canvas,document.getElementsByTagName('p')[0]);
	ctx = canvas.getContext('2d');
	pixelDensity(pixelRatio);
}

function draw() {
	requestAnimationFrame(draw);
	
	ctx.fillStyle = '#666';
	ctx.fillRect(0, 0, width, height);

	if (menu == 0){
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

		if (buttonContinueGame.relesed()){
			menu = 1;
		}
	}

	pmouseIsPressed = mouseIsPressed
}

function button(x, y, w, h, cr, fillNormal, fillHover, fillPress, text) {
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

		ctx.font = 'bold 30px Arial';
		ctx.fillStyle = '#666';
		ctx.textAlign = 'center';
		ctx.fillText(this.text, this.x + (this.w/2), this.y + (this.h*0.9));
	}

	this.update = function(){
		this.hover();
		if(this.pressed()){
			this.held = true;
		} else if(!mouseIsPressed){
			this.held = false;
		}
	}

	this.hover = function() {
		if (this.hovering(mouseX, mouseY)){
			this.fill = this.fillHover;
			if(mouseIsPressed){
				this.fill = this.fillPress;
			}
		} else if(this.held && !this.hovering(mouseX, mouseY)){
			this.fill = this.fillHover;
		} else {
			this.fill = this.fillNormal;
		}
	}

	this.hovering = function(x, y){
		return x>this.x && x<this.x+this.w && y>this.y && y<this.y+this.h;
	}

	this.pressed = function(){
		return this.hovering(mouseX, mouseY) && mouseIsPressed;
	}

	this.ppressed = function(){
		return this.hovering(pmouseX, pmouseY) && pmouseIsPressed;
	}

	this.relesed = function(){
		return this.ppressed() && !this.pressed() && !this.held;
	}
}

// https://www.youtube.com/watch?v=4q77g4xo9ic

setup();
draw();