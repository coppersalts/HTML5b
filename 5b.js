// TODO: rename _locn_ variables.
// TODO: implement depths
// TODO: look up the difference between var and let.
// TODO: go through all the todo's I've put throughout this file.

var canvas;
var ctx;
const cwidth = 960;
const cheight = 540;
const pixelRatio = window.devicePixelRatio;

var _xmouse = 0;
var _ymouse = 0;
const _keysDown = new Array(222).fill(false);
var _frameCount = 0;
// var _quality = "HIGH";
var qTimer = 0;

var levelsString = "";
var levelCount = 53;
var f = 19;
var levels = new Array(levelCount);
var startLocations = new Array(levelCount);
var locations = new Array(6);
var bgs = new Array(levelCount);
var levelStart = 0;
var levelWidth = 0;
var levelHeight = 0;
var thisLevel = new Array(0);
var tileFrames = new Array(0); //added by me
var switchable = new Array(6);
var charCount = 0;
var charCount2 = 0;
var playMode = 0;
var lineCount = 0;
var lineLength = 0;
var dialogueChar = new Array(levelCount);
var dialogueText = new Array(levelCount);
var dialogueFace = new Array(levelCount);
var levelName = new Array(levelCount);
var mdao = new Array(levelCount);
var mdao2 = 0;
var levelProgress;
var gotCoin;
var gotThisCoin = false;
var tileCount = 11;
// var bfdia5b = SharedObject.getLocal("bfdia5b");
var deathCount;
var timer;
var coins;
var longMode = false;

function clearVars() {
	// deathCount = timer = coins = levelProgress = 0;
	deathCount = timer = coins = 0;
	levelProgress = levelCount-1;
	gotCoin = new Array(levelCount);
	for (var _loc1_ = 0; _loc1_ < levelCount; _loc1_++) {
		gotCoin[_loc1_] = false;
	}
}
// function saveGame() {
// 	bfdia5b.data.gotCoin = new Array(levelCount);
// 	var _loc1_ = 0;
// 	while (_loc1_ < levelCount) {
// 		bfdia5b.data.gotCoin[_loc1_] = gotCoin[_loc1_];
// 		_loc1_ = _loc1_ + 1;
// 	}
// 	bfdia5b.data.coins = coins;
// 	bfdia5b.data.levelProgress = levelProgress;
// 	bfdia5b.data.deathCount = deathCount;
// 	bfdia5b.data.timer = timer;
// 	bfdia5b.flush();
// }

// if (bfdia5b.data.levelProgress == undefined) {
	clearVars();
// } else {
// 	levelProgress = bfdia5b.data.levelProgress;
// 	gotCoin = new Array(levelCount);
// 	coins = 0;
// 	for (var i = 0; i < levelCount; i++) {
// 		gotCoin[i] = bfdia5b.data.gotCoin[i];
// 		if (gotCoin[i]) coins++;
// 	}
// 	deathCount = bfdia5b.data.deathCount;
// 	timer = bfdia5b.data.timer;
// }


var white_alpha = 0;

function getTimer() {
	return _frameCount/0.06;
}
function charAt(j) {
	return levelsString.charCodeAt(j + levelStart) - 48;
}
function charAt2(j) {
	return levelsString.charAt(j + levelStart);
}
function tileAt(j, i, y) {
	var _loc1_ = levelsString.charCodeAt(j + levelStart);
	if (_loc1_ == 128 || _loc1_ == 8364) return 93;
	if (_loc1_ <= 126) return _loc1_ - 46;
	if (_loc1_ <= 182) return _loc1_ - 80;
	return _loc1_ - 81;
}

// Load Level Data
levelsString = loadedLevels;
for (var _loc3_ = 0; _loc3_ < levelCount; _loc3_++) {
	levelStart += 2;
	// Read Level Name
	levelName[_loc3_] = "";
	for (lineLength = 0; charAt(lineLength) != -35; lineLength++) {
		levelName[_loc3_] += charAt2(lineLength);
	}
	// Read Level Metadata
	levelStart += lineLength;
	levelWidth = 10 * charAt(2) + charAt(3);
	levelHeight = 10 * charAt(5) + charAt(6);
	charCount = 10 * charAt(8) + charAt(9);
	bgs[_loc3_] = 10 * charAt(11) + charAt(12);
	longMode = false;
	if (charAt(14) == 24) longMode = true;
	// Read Level Block Layout Data
	levels[_loc3_] = new Array(levelHeight);
	for (var _loc5_ = 0; _loc5_ < levelHeight; _loc5_++) {
		levels[_loc3_][_loc5_] = new Array(levelWidth);
	}
	if (longMode) {
		for (var _loc7_ = 0; _loc7_ < levelHeight; _loc7_++) {
			for (var _loc6_ = 0; _loc6_ < levelWidth; _loc6_++) {
				levels[_loc3_][_loc7_][_loc6_] = 111 * tileAt(_loc7_ * (levelWidth * 2 + 2) + _loc6_ * 2 + 17,_loc3_,_loc7_) + tileAt(_loc7_ * (levelWidth * 2 + 2) + _loc6_ * 2 + 18,_loc3_,_loc7_);
			}
		}
		levelStart += levelHeight * (levelWidth * 2 + 2) + 17;
	} else {
		for (var _loc7_ = 0; _loc7_ < levelHeight; _loc7_++) {
	for (var _loc6_ = 0; _loc6_ < levelWidth; _loc6_++) {
		levels[_loc3_][_loc7_][_loc6_] = tileAt(_loc7_ * (levelWidth + 2) + _loc6_ + 17,_loc3_,_loc7_);
	}
		}
		levelStart += levelHeight * (levelWidth + 2) + 17;
	}
	// Read Entity Data
	startLocations[_loc3_] = new Array(charCount);
	for (var _loc5_ = 0; _loc5_ < charCount; _loc5_++) {
		startLocations[_loc3_][_loc5_] = new Array(6);
		for (var _loc4_ = 0; _loc4_ < (f - 1) / 3; _loc4_++) {
	startLocations[_loc3_][_loc5_][_loc4_] = charAt(_loc4_ * 3) * 10 + charAt(_loc4_ * 3 + 1);
		}
		levelStart += f - 2;
		if (startLocations[_loc3_][_loc5_][5] == 3 || startLocations[_loc3_][_loc5_][5] == 4) {
	levelStart++;
	startLocations[_loc3_][_loc5_].push(new Array(0));
	for (lineLength = 0; charAt(lineLength) != -35; lineLength++) {
		startLocations[_loc3_][_loc5_][6].push(charAt(lineLength));
	}
	levelStart += lineLength;
		}
		levelStart += 2;
	}
	// Read Dilogue
	lineCount = 10 * charAt(0) + charAt(1);
	levelStart += 4;
	dialogueText[_loc3_] = new Array(lineCount);
	dialogueChar[_loc3_] = new Array(lineCount);
	dialogueFace[_loc3_] = new Array(lineCount);
	for (var _loc5_ = 0; _loc5_ < lineCount; _loc5_++) {
		dialogueChar[_loc3_][_loc5_] = 10 * charAt(0) + charAt(1);
		if (charAt(2) == 24) dialogueFace[_loc3_][_loc5_] = 2;
		else dialogueFace[_loc3_][_loc5_] = 3;
		levelStart += 4;
		dialogueText[_loc3_][_loc5_] = "";
		for (lineLength = 1; charAt(lineLength) != -35; lineLength++) {
	dialogueText[_loc3_][_loc5_] += charAt2(lineLength - 1);
		}
		levelStart += lineLength + 2;
	}
	// Read Necessary Deaths
	mdao2 += 100000 * charAt(0) + 10000 * charAt(1) + 1000 * charAt(2) + 100 * charAt(3) + 10 * charAt(4) + charAt(5);
	mdao[_loc3_] = mdao2;
	levelStart += 8;
}
var musicSound = new Audio('data/music.mp3');

// [15] - animated?
// [16] - animation frames
// [17] - loop?
// [18] - loop frames
var blockProperties = [
// tile0
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,0,false],
[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,false,1,false],
[true,true,true,true,true,false,false,false,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,true,false,false,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,false,true,false,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,true,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
// tile1
[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,0,false,false,false,0,false],
[true,true,true,true,false,false,false,false,true,false,false,0,0,false,false,true,14,false,[0,1,2,3,4,5,6,7,8,9,10,11,12,13]],
[true,true,true,true,false,false,false,false,true,false,false,0,6,false,false,true,12,true,[0,1,2,3,4,5,6,7,8,9,10,11]],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,41,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]],
[true,true,true,true,false,false,false,false,true,false,false,0,6,false,false,true,12,true,[0,1,2,3,4,5,6,7,8,9,10,11]],
[true,true,true,true,true,true,true,true,false,false,false,0,0,false,false,false,1,true],
[false,true,false,false,false,false,false,false,false,true,false,0,0,false,false,false,1,false],
[true,true,true,true,true,false,false,false,false,false,false,0,0,false,false,false,1,false],
// tile2
[true,true,true,true,false,true,false,false,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,false,true,false,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,true,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,true,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
// tile3
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,false,true,false,false,0,1,false,false,false,1,false],
[true,true,true,true,false,false,false,false,true,false,false,0,1,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,1,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,7,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,2,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,8,0,false,false,false,1,false],
[false,true,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
// tile4
[true,true,true,true,false,false,false,false,true,false,false,13,0,false,false,true,5,false],
[true,true,true,true,false,false,false,false,true,false,false,14,0,false,false,true,5,false],
[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,true,false,false,false,false,false,false,true,false,0,0,false,false,false,1,false],
[true,true,true,true,false,true,false,true,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,true,true,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,false,true,false,false,0,0,false,false,true,3,true,[0,0,0,0,0,1,1,2,2,1,1]],
// tile5
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,false,true,false,false,0,2,false,false,false,1,false],
[true,true,true,true,false,false,false,false,true,false,false,0,2,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,2,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,2,false,false,false,1,false],
[false,true,false,false,false,false,false,false,false,true,false,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,3,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,9,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,false,0,false],
// tile6
[true,true,true,true,false,false,false,false,true,false,false,0,3,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,3,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,3,false,false,false,1,false],
[false,true,false,false,false,false,false,false,true,false,false,0,3,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,3,false,false,false,1,false],
[true,true,true,true,false,false,false,false,true,false,false,0,3,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,true,2,true,[0,0,0,1,1,1]],
[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,true,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[true,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
// tile7
[false,false,false,true,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,false,true,false,false,15,0,false,false,true,5,false],
[true,true,true,true,true,true,true,true,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,false,1,false],
[true,true,true,true,false,false,false,false,true,false,false,0,0,false,false,true,30,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]],
[false,false,false,false,true,true,true,true,true,false,false,0,0,false,false,true,20,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]],
[false,false,false,false,true,true,true,true,true,false,false,0,0,false,false,true,20,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false,false,1,false],
[true,true,true,true,true,true,true,true,true,false,false,0,1,false,false,false,1,false],
// tile8
[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,false,0,false],
[false,true,false,false,false,false,false,false,true,false,false,0,1,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false,false,1,false],
[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,true,12,true,[0,1,2,3,4,5,6,7,8,9,10,11]],
[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,false,0,false],
[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,true,12,true,[0,1,2,3,4,5,6,7,8,9,10,11]],
[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
// tile9
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
// tile10
[false,false,false,false,true,true,true,true,false,false,false,0,1,false,true,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,0,false,false,true,60,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]],
[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,false,1,false],
[false,false,false,false,true,true,true,true,false,false,false,0,1,false,true,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,0,0,false,false,true,60,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]],
[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,6,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,true,false,false,12,0,false,false,false,1,false],
// tile11
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
// tile12
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false],
// tile13
[false,false,false,false,false,false,false,false,false,false,false,0,1,false,true,false,1,false],
[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,false,1,false],
[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,0,false]];
var switches = [[31,33,32,34,79,78,81,82],[51,53,52,54],[65,61,60,62,63,64],[],[],[14,16,83,85]];
var charD = [
[28,45.4,0.45,27,0.8,false,1],
[23,56,0.36,31,0.8,false,1.7],
[20,51,0.41,20,0.85,false,5],
[10,86,0.26,31,0.8,false,1.6],
[10,84,0.23,31,0.8,false,1.4],
[28,70,0.075,28,0.8,false,9],
[26,49,0.2,20,0.75,false,0.6],
[44,65,0.8,20,0.75,false,0.8],
[16,56,0.25,17,0.76,false,0.8],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[0,0,0,0,0,false],
[36.5,72.8,1,20,0.6,false,0],
[15.1,72.8,0.6,20,0.7,true,0],
[20,40,0.15,20,0.7,true,0.7],
[25,50,0.64,20,0.6,true,0.1],
[25,10,1,0,0.7,true,0.2],
[25,50,1,20,0.7,true,0.1],
[25,29,0.1,20,0.8,true,1],
[21.5,43,0.3,20,0.6,true,0.5],
[35,60,1,20,0.7,true,0.1],
[22.5,45,1,20,0.7,true,0.8],
[25,50,1,0,0.7,true,0.1],
[15,30,0.64,20,0.6,true,0.2],
[10,55,0.8,0,0.3,true,0.4],
[45,10,1,0,0.7,true,0.2],
[20,40,1,0,0.8,false,0.8],
[16,45,0.4,20,0.94,false,1.1],
[25,10,1,0,0.7,true,0.3],
[45,10,0.4,0,0.7,true,0.7],
[15,50,0.1,0,0.8,true,1.9],
[25,25,0.1,0,0.8,true,1.7],
[30,540,10,10,0.4,true,0]];

// frames:
// 00 - run left
// 01 - stand left
// 02 - run right
// 03 - stand right
// 04 - jump left
// 05 - jump right
// 06 - 
// 07 - 
// 08 - die left
// 09 - die right
// 10 - 
// 11 - 
// 12 - 
// 13 - 
var charModels = [
	{
		torsoX: 1.15,
		torsoY: -8.95,
		legx: [-5.55, 8.8],
		legy: [-11.25,-11.25],
		firemat: {a:-0.45697021484375,b:0.0060882568359375,c:0.0076904296875,d:0.5772552490234375,tx:-2.3,ty:-51.8},
		charimgmat: {a:0.15606689453125,b:0,c:0,d:0.15606689453125,tx:0.05,ty:0.6}
	},
	{
		torsoX: 1.15,
		torsoY: -8.95,
		legx: [-5.55, 8.8],
		legy: [-11.25,-11.25],
		firemat: {a:-0.4046630859375,b:0.0060882568359375,c:0.006805419921875,d:0.5772552490234375,tx:1.05,ty:-51.05},
		charimgmat: {a:0.12158203125,b:-0.0020751953125,c:0.0037384033203125,d:0.12152099609375,tx:0.1,ty:0.4},
		frames: [
			[
				{bodypart:0,mat:{a:0.2847747802734375,b:-0.0040130615234375,c:0.0086822509765625,d:0.285064697265625,tx:0.35,ty:-26.65}},
				{bodypart:1,mat:{a:-0.375213623046875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-9.05,ty:-30.6}},
				{bodypart:1,mat:{a:-0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:4.2,ty:-30.35}},
				{bodypart:2,mat:{a:-0.3180999755859375,b:0.01141357421875,c:0.022735595703125,d:0.43402099609375,tx:-2.5,ty:-17.5}},
			],
			[
				{bodypart:3,mat:{a:0.3733978271484375,b:0.0712127685546875,c:-0.0721435546875,d:0.3782196044921875,tx:-21.35,ty:-16.9}},
				{bodypart:0,mat:{a:0.2847747802734375,b:-0.0040130615234375,c:0.0086822509765625,d:0.285064697265625,tx:0.6,ty:-26.2}},
				{bodypart:1,mat:{a:-0.375213623046875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-8.8,ty:-30.15}},
				{bodypart:1,mat:{a:-0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:4.45,ty:-29.8}},
				{bodypart:3,mat:{a:-0.3849334716796875,b:0.0501251220703125,c:0.0777587890625,d:0.3766937255859375,tx:21.1,ty:-18.65}}
			],
			[
				{bodypart:0,mat:{a:0.283721923828125,b:0.0136260986328125,c:-0.0087432861328125,d:0.283905029296875,tx:0.85,ty:-26.65}},
				{bodypart:1,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-4.2,ty:-30.25}},
				{bodypart:1,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:9.05,ty:-30.6}},
				{bodypart:2,mat:{a:0.3180999755859375,b:0.01141357421875,c:-0.022735595703125,d:0.43402099609375,tx:2.5,ty:-17.5}},
			],
			[
				{bodypart:3,mat:{a:-0.3730010986328125,b:0.071136474609375,c:0.0718994140625,d:0.3780364990234375,tx:21.2,ty:-16.8}},
				{bodypart:0,mat:{a:0.2848052978515625,b:0.003997802734375,c:-0.0077362060546875,d:0.2839813232421875,tx:-0.3,ty:-26.2}},
				{bodypart:1,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-4.4,ty:-29.75}},
				{bodypart:1,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:8.75,ty:-30.1}},
				{bodypart:3,mat:{a:0.3796844482421875,b:0.0500335693359375,c:-0.076751708984375,d:0.3769683837890625,tx:-20.85,ty:-18.65}}
			],
			[
				{bodypart:0,mat:{a:0.28375244140625,b:0.0136871337890625,c:-0.009918212890625,d:0.2838592529296875,tx:1.9,ty:-26.75}},
				{bodypart:1,mat:{a:-0.37451171875,b:-0.0196380615234375,c:-0.0245208740234375,d:0.374267578125,tx:-7.25,ty:-31.35}},
				{bodypart:1,mat:{a:-0.37451171875,b:-0.0196380615234375,c:-0.0245208740234375,d:0.374267578125,tx:6,ty:-30.1}},
				{bodypart:2,mat:{a:-0.3180389404296875,b:-0.0084075927734375,c:-0.004058837890625,d:0.310455322265625,tx:-1.55,ty:-17.8}}
			],
			[
				{bodypart:0,mat:{a:0.2836456298828125,b:-0.0136871337890625,c:0.009918212890625,d:0.2837677001953125,tx:0.9,ty:-26.75}},
				{bodypart:1,mat:{a:0.37451171875,b:-0.0196380615234375,c:0.0245208740234375,d:0.374267578125,tx:-3.2,ty:-30.1}},
				{bodypart:1,mat:{a:0.37451171875,b:-0.0196380615234375,c:0.0245208740234375,d:0.374267578125,tx:10.05,ty:-31.35}},
				{bodypart:2,mat:{a:0.3180389404296875,b:-0.0084075927734375,c:0.004058837890625,d:0.310455322265625,tx:4.35,ty:-17.8}}
			],
			[
				{bodypart:4,mat:{a:-0.0284576416015625,b:-0.457672119140625,c:-0.385009765625,d:0.023651123046875,tx:-17.15,ty:-21.15}},
				{bodypart:0,mat:{a:0.28375244140625,b:0.0136871337890625,c:-0.009918212890625,d:0.2838592529296875,tx:1.9,ty:-26.75}},
				{bodypart:1,mat:{a:-0.37451171875,b:-0.0196380615234375,c:-0.0245208740234375,d:0.374267578125,tx:-7.25,ty:-31.35}},
				{bodypart:1,mat:{a:-0.37451171875,b:-0.0196380615234375,c:-0.0245208740234375,d:0.374267578125,tx:6,ty:-30.1}},
				{bodypart:2,mat:{a:-0.3180389404296875,b:-0.0084075927734375,c:-0.004058837890625,d:0.310455322265625,tx:-1.55,ty:-17.8}},
				{bodypart:4,mat:{a:-0.02813720703125,b:-0.4629669189453125,c:-0.386383056640625,d:0.0238037109375,tx:9.25,ty:-19.75}}
			],
			[
				{bodypart:4,mat:{a:0.0284576416015625,b:-0.457672119140625,c:0.385009765625,d:0.023651123046875,tx:16.9,ty:-21.25}},
				{bodypart:0,mat:{a:0.28363037109375,b:-0.0136871337890625,c:0.009918212890625,d:0.28375244140625,tx:-2.3,ty:-26.75}},
				{bodypart:1,mat:{a:0.37451171875,b:-0.0196380615234375,c:0.0245208740234375,d:0.374267578125,tx:-6.4,ty:-30.1}},
				{bodypart:1,mat:{a:0.37451171875,b:-0.0196380615234375,c:0.0245208740234375,d:0.374267578125,tx:6.85,ty:-31.35}},
				{bodypart:2,mat:{a:0.3180389404296875,b:-0.0084075927734375,c:0.004058837890625,d:0.310455322265625,tx:1.15,ty:-17.8}},
				{bodypart:4,mat:{a:0.02813720703125,b:-0.46295166015625,c:0.386383056640625,d:0.0238037109375,tx:-9.5,ty:-19.75}}
			],
			[
				{bodypart:3,mat:{a:-0.26220703125,b:0.2750244140625,c:-0.2784881591796875,d:-0.2655029296875,tx:-20.2,ty:-24.1}},
				{bodypart:0,mat:{a:0.283966064453125,b:0.0086822509765625,c:-0.00372314453125,d:0.28411865234375,tx:1.5,ty:-25.95}},
				{bodypart:5,mat:{a:-0.37493896484375,b:-0.011810302734375,c:-0.016754150390625,d:0.3746490478515625,tx:-7.6,ty:-30.4}},
				{bodypart:5,mat:{a:-0.3749237060546875,b:-0.011810302734375,c:-0.016448974609375,d:0.3746795654296875,tx:5.6,ty:-29.45}},
				{bodypart:6,mat:{a:-0.3182525634765625,b:-0.0028076171875,c:0.0003204345703125,d:0.3105926513671875,tx:-0.7,ty:-18.75}},
				{bodypart:3,mat:{a:0.21820068359375,b:0.313629150390625,c:0.29925537109375,d:-0.2410430908203125,tx:21.95,ty:-24.25}}
			],
			[
				{bodypart:3,mat:{a:0.26220703125,b:0.2750244140625,c:0.2784881591796875,d:-0.2655029296875,tx:20.6,ty:-24.5}},
				{bodypart:0,mat:{a:0.2838592529296875,b:-0.0077362060546875,c:0.0037994384765625,d:0.284027099609375,tx:-1.2,ty:-26.4}},
				{bodypart:5,mat:{a:0.3748626708984375,b:-0.0118255615234375,c:0.0179901123046875,d:0.374542236328125,tx:-5.2,ty:-29.85}},
				{bodypart:5,mat:{a:0.3748779296875,b:0.011810302734375,c:0.0179901123046875,d:0.3745269775390625,tx:8,ty:-30.8}},
				{bodypart:6,mat:{a:0.3182220458984375,b:-0.0028076171875,c:-0.0013580322265625,d:0.3105621337890625,tx:1.1,ty:-19.15}},
				{bodypart:3,mat:{a:-0.21820068359375,b:0.313629150390625,c:-0.29925537109375,d:-0.2410430908203125,tx:-21.2,ty:-24.75}}
			],
			[
				{bodypart:0,mat:{a:0.2847747802734375,b:-0.0040130615234375,c:0.0086822509765625,d:0.285064697265625,tx:0.6,ty:-26.2}},
				{bodypart:1,mat:{a:-0.375213623046875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-8.8,ty:-30.15}},
				{bodypart:1,mat:{a:-0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:4.45,ty:-29.9}},
				{bodypart:2,mat:{a:-0.3180999755859375,b:0.01141357421875,c:0.022735595703125,d:0.43402099609375,tx:-2.25,ty:-17.05}}
			],
			[
				{bodypart:0,mat:{a:0.28399658203125,b:0.00396728515625,c:-0.008697509765625,d:0.2838592529296875,tx:0.25,ty:-26.2}},
				{bodypart:1,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-3.45,ty:-29.8}},
				{bodypart:1,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:9.8,ty:-30.15}},
				{bodypart:2,mat:{a:0.3180999755859375,b:0.01141357421875,c:-0.022735595703125,d:0.43402099609375,tx:3.25,ty:-17.05}}
			],
			[
				{bodypart:0,mat:{a:-0.28411865234375,b:0.0000152587890625,c:-0.0037078857421875,d:0.2840576171875,tx:0.4,ty:-26.2}},
			],
			[
				{bodypart:0,mat:{a:-0.28411865234375,b:0.0000152587890625,c:-0.0037078857421875,d:0.2840576171875,tx:0.4,ty:-26.2}},
			]
		]
	},
	{
		torsoX: -0.05,
		torsoY: -4.6,
		legx: [-5.55, 8.8],
		legy: [-11.25,-11.25],
		firemat: {a:0.8855438232421875,b:0,c:0,d:1,tx:2.05,ty:0},
		charimgmat: {a:0.14532470703125,b:-0.00250244140625,c:0.00445556640625,d:0.1452484130859375,tx:-0.3,ty:0.5},
		frames: [
			[
				{bodypart:0,mat:{a:0.319091796875,b:-0.0054779052734375,c:0.009796142578125,d:0.3189697265625,tx:0.35,ty:-26.65}},
				{bodypart:40,mat:{a:-0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:-17.4,ty:-30}},
				{bodypart:2,mat:{a:-0.318145751953125,b:0.0123748779296875,c:0.01629638671875,d:0.31024169921875,tx:-11.3,ty:-18.55}}
			],
			[
				{bodypart:0,mat:{a:0.31939697265625,b:-0.005462646484375,c:0.0098114013671875,d:0.3192596435546875,tx:-0.05,ty:-26.6}},
				{bodypart:40,mat:{a:-0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:-17.75,ty:-29.55}}
			],
			[
				{bodypart:0,mat:{a:-0.319091796875,b:-0.0054779052734375,c:-0.009796142578125,d:0.3189697265625,tx:-0.45,ty:-26.65}},
				{bodypart:40,mat:{a:0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:17.3,ty:-30}},
				{bodypart:2,mat:{a:0.318145751953125,b:0.0123748779296875,c:-0.01629638671875,d:0.31024169921875,tx:11.2,ty:-18.55}}
			],
			[
				{bodypart:0,mat:{a:-0.31939697265625,b:-0.005462646484375,c:-0.0098114013671875,d:0.3192596435546875,tx:1.05,ty:-26.6}},
				{bodypart:40,mat:{a:0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:18.75,ty:-29.55}}
			],
			[
				{bodypart:0,mat:{a:0.3189697265625,b:0.0085296630859375,c:-0.00421142578125,d:0.31903076171875,tx:0.6,ty:-26.6}},
				{bodypart:40,mat:{a:-0.3750457763671875,b:-0.0113525390625,c:-0.0164642333984375,d:0.37481689453125,tx:-16.95,ty:-30.7}},
				{bodypart:2,mat:{a:-0.318328857421875,b:-0.0016021728515625,c:0.002655029296875,d:0.31060791015625,tx:-11.35,ty:-19}}
			],
			[
				{bodypart:0,mat:{a:-0.3189697265625,b:0.0085296630859375,c:0.00421142578125,d:0.31903076171875,tx:-0.7,ty:-26.6}},
				{bodypart:40,mat:{a:0.3750457763671875,b:-0.0113525390625,c:0.0164642333984375,d:0.37481689453125,tx:16.85,ty:-30.7}},
				{bodypart:2,mat:{a:0.318328857421875,b:-0.0016021728515625,c:-0.002655029296875,d:0.31060791015625,tx:11.25,ty:-19}}
			],
			[],
			[],
			[
				{bodypart:0,mat:{a:0.31939697265625,b:-0.005462646484375,c:0.0098114013671875,d:0.3192596435546875,tx:-0.05,ty:-26.6}},
				{bodypart:41,mat:{a:-0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:-16.85,ty:-28}},
				{bodypart:6,mat:{a:-0.318145751953125,b:0.0123748779296875,c:0.01629638671875,d:0.31024169921875,tx:-11.4,ty:-19.15}}
			],
			[
				{bodypart:0,mat:{a:-0.31939697265625,b:-0.005462646484375,c:-0.0098114013671875,d:0.3192596435546875,tx:1.6,ty:-26.6}},
				{bodypart:41,mat:{a:0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:18.4,ty:-28}},
				{bodypart:6,mat:{a:0.318145751953125,b:0.0123748779296875,c:-0.01629638671875,d:0.31024169921875,tx:12.95,ty:-19.15}}
			],
			[],
			[],
			[],
			[]
		]
	},
	{
		torsoX: 0.4,
		torsoY: -8.95,
		legx: [-2.45, 5.1],
		legy: [-11.25,-11.25],
		firemat: {a:-0.1956634521484375,b:0.0030975341796875,c:0.0032806396484375,d:0.2937164306640625,tx:1.05,ty:-94},
		charimgmat: {a:0.1161346435546875,b:0,c:0,d:0.1161346435546875,tx:-0.15,ty:0.2},
		frames: [
			[
				{bodypart:0,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.05,ty:-41.75}},
				{bodypart:1,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:-3.6,ty:-39.6}},
				{bodypart:37,mat:{a:-0.194427490234375,b:0,c:0,d:0.329345703125,tx:-1.4,ty:-29.45}}
			],
			[
				{bodypart:3,mat:{a:-0.322235107421875,b:-0.090789794921875,c:-0.090789794921875,d:0.322235107421875,tx:-5.6,ty:-19.95}},
				{bodypart:0,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.05,ty:-40.85}},
				{bodypart:1,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:-3.6,ty:-38.7}},
				{bodypart:3,mat:{a:-0.313751220703125,b:0.1172332763671875,c:0.1172332763671875,d:0.313751220703125,tx:4.65,ty:-20.1}}
			],
			[
				{bodypart:0,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.05,ty:-41.75}},
				{bodypart:1,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:5,ty:-39.6}},
				{bodypart:37,mat:{a:0.194427490234375,b:0,c:0,d:0.329345703125,tx:2.8,ty:-29.45}}
			],
			[
				{bodypart:3,mat:{a:0.322235107421875,b:-0.090789794921875,c:0.090789794921875,d:0.322235107421875,tx:6.2,ty:-19.95}},
				{bodypart:0,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.55,ty:-40.85}},
				{bodypart:1,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:4.2,ty:-38.7}},
				{bodypart:3,mat:{a:0.313751220703125,b:0.1172332763671875,c:-0.1172332763671875,d:0.313751220703125,tx:-4.05,ty:-20.1}}
			],
			[
				{bodypart:0,mat:{a:0.33477783203125,b:0.0128631591796875,c:-0.0128631591796875,d:0.33477783203125,tx:2.45,ty:-41.05}},
				{bodypart:1,mat:{a:-0.33477783203125,b:-0.0128631591796875,c:-0.0128631591796875,d:0.33477783203125,tx:-1.3,ty:-39.05}},
				{bodypart:38,mat:{a:-0.194244384765625,b:-0.0074615478515625,c:-0.0112762451171875,d:0.2929840087890625,tx:0.55,ty:-28.7}}
			],
			[
				{bodypart:0,mat:{a:-0.334716796875,b:0.014404296875,c:0.014404296875,d:0.334716796875,tx:-0.5,ty:-40.5}},
				{bodypart:1,mat:{a:0.334716796875,b:-0.014404296875,c:0.014404296875,d:0.334716796875,tx:3.25,ty:-38.55}},
				{bodypart:38,mat:{a:0.1941986083984375,b:-0.0083465576171875,c:0.012603759765625,d:0.2929229736328125,tx:1.45,ty:-28.2}}
			],
			[
				{bodypart:4,mat:{a:0.02471923828125,b:-0.3337860107421875,c:-0.3337860107421875,d:-0.0247039794921875,tx:-3.5,ty:-20.2}},
				{bodypart:0,mat:{a:0.3344268798828125,b:0.0204620361328125,c:-0.0204620361328125,d:0.3344268798828125,tx:3.4,ty:-40.75}},
				{bodypart:39,mat:{a:-0.19403076171875,b:-0.011871337890625,c:-0.017913818359375,d:0.29266357421875,tx:1.2,ty:-28.45}},
				{bodypart:40,mat:{a:-0.3344268798828125,b:-0.0204620361328125,c:-0.0204620361328125,d:0.3344268798828125,tx:-0.4,ty:-38.85}},
				{bodypart:4,mat:{a:0.02471923828125,b:-0.3337860107421875,c:-0.3337860107421875,d:-0.0247039794921875,tx:7.25,ty:-20.2}}
			],
			[
				{bodypart:4,mat:{a:-0.02471923828125,b:-0.3337860107421875,c:0.3337860107421875,d:-0.0247039794921875,tx:5.55,ty:-20.2}},
				{bodypart:0,mat:{a:-0.3344268798828125,b:0.0204620361328125,c:0.0204620361328125,d:0.3344268798828125,tx:-1.35,ty:-40.75}},
				{bodypart:39,mat:{a:0.19403076171875,b:-0.011871337890625,c:0.017913818359375,d:0.29266357421875,tx:0.85,ty:-28.45}},
				{bodypart:40,mat:{a:0.33441162109375,b:-0.0204620361328125,c:0.0204620361328125,d:0.33441162109375,tx:2.45,ty:-38.85}},
				{bodypart:4,mat:{a:-0.02471923828125,b:-0.3337860107421875,c:0.3337860107421875,d:-0.0247039794921875,tx:-5.2,ty:-20.2}}
			],
			[
				{bodypart:4,mat:{a:0.247894287109375,b:-0.2249298095703125,c:-0.2249298095703125,d:-0.247894287109375,tx:-4.9,ty:-20.15}},
				{bodypart:0,mat:{a:0.334869384765625,b:0.011962890625,c:-0.011962890625,d:0.334869384765625,tx:1.5,ty:-40.85}},
				{bodypart:6,mat:{a:-0.19427490234375,b:-0.0069427490234375,c:-0.011749267578125,d:0.3291015625,tx:-0.05,ty:-30.75}},
				{bodypart:5,mat:{a:-0.334869384765625,b:-0.011962890625,c:-0.011962890625,d:0.334869384765625,tx:-1.95,ty:-41.55}},
				{bodypart:4,mat:{a:-0.1793365478515625,b:-0.380706787109375,c:0.3028411865234375,d:-0.1426544189453125,tx:5.35,ty:-20}}
			],
			[
				{bodypart:4,mat:{a:-0.247894287109375,b:-0.2249298095703125,c:0.2249298095703125,d:-0.247894287109375,tx:5.95,ty:-20.15}},
				{bodypart:0,mat:{a:-0.334869384765625,b:0.011962890625,c:0.011962890625,d:0.334869384765625,tx:-0.45,ty:-40.85}},
				{bodypart:6,mat:{a:0.19427490234375,b:-0.0069427490234375,c:0.011749267578125,d:0.3291015625,tx:1.1,ty:-30.75}},
				{bodypart:5,mat:{a:0.334869384765625,b:-0.011962890625,c:0.011962890625,d:0.334869384765625,tx:3,ty:-41.55}},
				{bodypart:4,mat:{a:0.1793365478515625,b:-0.380706787109375,c:-0.3028411865234375,d:-0.1426544189453125,tx:-4.3,ty:-20}}
			],
			[
				{bodypart:0,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.05,ty:-40.85}},
				{bodypart:1,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:-3.6,ty:-38.7}},
				{bodypart:37,mat:{a:-0.194427490234375,b:0,c:0,d:0.329345703125,tx:-1.4,ty:-28.55}}
			],
			[
				{bodypart:0,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.55,ty:-40.85}},
				{bodypart:1,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:4.2,ty:-38.7}},
				{bodypart:37,mat:{a:0.194427490234375,b:0,c:0,d:0.329345703125,tx:2,ty:-28.55}}
			],
			[
				{bodypart:0,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.2,ty:-40.85}},
				{bodypart:1,mat:{a:-0.20111083984375,b:0,c:0,d:0.3351287841796875,tx:-5.15,ty:-38.7}},
				{bodypart:37,mat:{a:-0.1166839599609375,b:0,c:0,d:0.329345703125,tx:-3.8,ty:-28.55}}
			],
			[
				{bodypart:0,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.1,ty:-40.85}},
				{bodypart:1,mat:{a:0.20111083984375,b:0,c:0,d:0.3351287841796875,tx:5.8,ty:-38.7}},
				{bodypart:37,mat:{a:0.1166839599609375,b:0,c:0,d:0.329345703125,tx:4.45,ty:-28.55}}
			]
		] 
	},
	{
		torsoX: 1.15,
		torsoY: -8.95,
		legx: [-5.55, 8.8],
		legy: [-11.25,-11.25],
		firemat: {a:-0.16912841796875,b:0.0142822265625,c:0.031341552734375,d:0.6383819580078125,tx:-3.65,ty:-58.2},
		charimgmat: {a:0.10894775390625,b:-0.003753662109375,c:0.003753662109375,d:0.10894775390625,tx:-0.2,ty:-1.4},
		frames: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
	},
	{
		torsoX: -0.7,
		torsoY: -3,
		legx: [-5.1, 10.85],
		legy: [-11.25,-11.25],
		firemat: {a:0.8855438232421875,b:0,c:0,d:1,tx:1.8,ty:-4.75},
		charimgmat: {a:0.126861572265625,b:0,c:0,d:0.126861572265625,tx:-0.1,ty:-0.3},
		frames: [
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			],
			[
				{bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0.4,ty:-39.1}}
			]
		]
	},
	{
		torsoX: 1.15,
		torsoY: -8.95,
		legx: [-5.55, 8.8],
		legy: [-11.25,-11.25],
		firemat: {a:0.8855438232421875,b:0,c:0,d:1,tx:-0.2,ty:0.05},
		charimgmat: {a:0.116455078125,b:0,c:0,d:0.116455078125,tx:0.4,ty:20.05},
		frames: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
	},
	{
		torsoX: 1.15,
		torsoY: -8.95,
		legx: [-5.55, 8.8],
		legy: [-11.25,-11.25],
		firemat: {a:1.8939666748046875,b:0,c:0,d:1.1790008544921875,tx:2.05,ty:0},
		charimgmat: {a:-0.06329345703125,b:0,c:0,d:0.0632781982421875,tx:-0.6,ty:18.65},
		frames: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
	},
	{
		torsoX: 1.15,
		torsoY: -8.95,
		legx: [-5.55, 8.8],
		legy: [-11.25,-11.25],
		firemat: {a:0.757598876953125,b:0,c:0,d:1,tx:2.3,ty:-2.5},
		charimgmat: {a:-0.112091064453125,b:0,c:0,d:0.112091064453125,tx:8.05,ty:-5.8},
		frames: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {},
	},
	{
		firemat: {a:-0.34619140625,b:0.0040283203125,c:0.0058135986328125,d:0.3830718994140625,tx:-1.25,ty:-27.6},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
	{
		firemat: {a:0.89483642578125,b:0,c:0,d:0.7838592529296875,tx:-0.45,ty:4.75},
	},
];
var names = ["Ruby","Book","Ice Cube","Match","Pencil","Bubble"];
var selectedTab = 0;
var power = 1;
var jumpPower = 11;
var qPress = false;
var upPress = false;
var csPress = false;
var downPress = false;
var leftPress = false;
var rightPress = false;
var recover = false;
var recover2 = 0;
var recoverTimer = 0;
var HPRC2 = 0;
var cornerHangTimer = 0;
var goal = 0;
var charsAtEnd = 0;
var qPressTimer = 0;
var transitionType = 1;
var char = new Array(1);
var currentLevel = -1;
var control = 0;
var wipeTimer = 30;
var cutScene = 0;
var cutSceneLine = 0;
var bubWidth = 500;
var bubHeight = 100;
var bubMargin = 40;
var charDepth = 0;
var levelWidth = 0;
var levelHeight = 0;
var cameraX = 0;
var cameraY = 0;
var shakeX = 0;
var shakeY = 0;
var menuScreen = -1;
var myLevel;
var scale = 20;
var tool = 0;
var selectedTile = 0;
var mouseIsDown = false;
var LCEndGateX = 0;
var LCEndGateY = 0;
var cardinal = [[0,-1],[0,1],[-1,0],[1,0]];
var diagonal = [[-1,-1],[1,-1],[1,1],[-1,1]];
var diagonal2 = [[0,2],[0,3],[1,2],[1,3]];
var undid = false;
var LCRect = [-1,-1,-1,-1];
var levelTimer = 0;
var levelTimer2 = 0;
var bgXScale = 0;
var bgYscale = 0;
var stopX = 0;
var stopY = 0;
var toBounce = false;
var toSeeCS = true;
var csText = '';

var tileShadows;
var tileBorders;
var HPRCBubbleFrame; // TODO: refactor this thing out
var HPRCText = '';
var HPRCCrankRot = 0;
var charDepths = [];

function numberToText(i, hundreds) {
	if (hundreds) {
		if (i < 10) return "00" + i;
		if (i < 100) return "0" + i;
		return i;
	}
	if (i == 0) return "00";
	if (i < 10) return "0" + i;
	return i;
}
function toHMS(i) {
	var _loc5_ = Math.floor(i / 3600000);
	var _loc3_ = Math.floor(i / 60000) % 60;
	var _loc2_ = Math.floor(i / 1000) % 60;
	var _loc4_ = Math.floor(i / 100) % 10;
	return numberToText(_loc5_,false) + ":" + numberToText(_loc3_,false) + ":" + numberToText(_loc2_,false) + "." + _loc4_;
}
function addCommas(i) {
	var _loc4_ = String(i);
	var _loc2_ = "";
	var _loc3_ = _loc4_.length;
	for (var _loc1_ = 0; _loc1_ < _loc3_; _loc1_++) {
		if ((_loc3_ - _loc1_) % 3 == 0 && _loc1_ != 0) _loc2_ += ",";
		_loc2_ += _loc4_.charAt(_loc1_);
	}
	return _loc2_;
}






















// https://grabthiscode.com/javascript/check-if-file-exists-javascript
function doesFileExist(urlToFile) {
	var xhr = new XMLHttpRequest();
	xhr.open('HEAD', urlToFile, false);
	xhr.send();	
	return xhr.status !== 404;
}





var imgBgs = new Array(12);

var svgTiles = new Array(blockProperties.length);
var svgLevers = new Array(6);
var svgShadows = new Array(19);
var svgTileBorders = new Array(19);

var svgChars = new Array(charD.length);
var svgBodyParts = [];

// var svgHPRCBubble = new Array(4);
var svgHPRCBubble = new Array(3);
var svgCSBubble = new Image();
svgCSBubble.src = 'visuals/ui/csbubble/dia.svg';
var svgHPRCCrank = new Image();
svgHPRCCrank.src = 'visuals/entities/e0035crank.svg';

var svgCoin = new Image();
svgCoin.src = 'visuals/wintoken.svg';
var svgCoinGet = new Array(11);
var svgFire = new Array(18);
var svgIceCubeMelt = new Image();
svgIceCubeMelt.src = 'visuals/effects/icecubemelt.svg';

for (var i = 0; i < imgBgs.length; i++) {
	imgBgs[i] = new Image();
	imgBgs[i].src = 'visuals/bg/bg' + i.toString(10).padStart(4, '0') + '.png';
}
for (var i = 0; i < blockProperties.length; i++) {
	var id = i.toString(10).padStart(4, '0');
	if (blockProperties[i][16] < 1) continue;
	else if (blockProperties[i][16] == 1) {
		svgTiles[i] = new Image();
		svgTiles[i].src = 'visuals/blocks/b' + id + '.svg';
	} else {
		svgTiles[i] = new Array(blockProperties[i][16]);
		for (var j = 0; j < svgTiles[i].length; j++) {
			svgTiles[i][j] = new Image();
			svgTiles[i][j].src = 'visuals/blocks/b' + id + 'f' + j.toString(10).padStart(4, '0') + '.svg';;
		}
	}
}
for (var i = 0; i < svgLevers.length; i++) {
	var filename = 'visuals/blocks/b' + i.toString(10).padStart(2, '0') + 'lever.svg';
	if (doesFileExist(filename)) {
		svgLevers[i] = new Image();
		svgLevers[i].src = filename;
	}
}
for (var i = 0; i < svgShadows.length; i++) {
	svgShadows[i] = new Image();
	svgShadows[i].src = 'visuals/shadows/s' + i.toString(10).padStart(4, '0') + '.svg';
}
for (var i = 0; i < svgTileBorders.length; i++) {
	svgTileBorders[i] = new Image();
	svgTileBorders[i].src = 'visuals/borders/tb' + i.toString(10).padStart(4, '0') + '.svg';
}
for (var i = 0; i < svgChars.length; i++) {
	var filename = 'visuals/entities/e' + i.toString(10).padStart(4, '0') + '.svg';
	if (doesFileExist(filename)) {
		svgChars[i] = new Image();
		svgChars[i].src = filename;
	}
}
for (var i = 0; i < svgHPRCBubble.length; i++) {
	svgHPRCBubble[i] = new Image();
	svgHPRCBubble[i].src = 'visuals/ui/hprcbubble/hprcbubble' + i.toString(10).padStart(4, '0') + '.svg';
}
for (var i = 0; doesFileExist('visuals/bodyparts/bp' + i.toString(10).padStart(4, '0') + '.svg'); i++) {
	svgBodyParts[i] = new Image();
	svgBodyParts[i].src = 'visuals/bodyparts/bp' + i.toString(10).padStart(4, '0') + '.svg';
}
for (var i = 0; i < svgCoinGet.length; i++) {
	svgCoinGet[i] = new Image();
	svgCoinGet[i].src = 'visuals/wtgetf' + i.toString(10).padStart(4, '0') + '.svg';
}
for (var i = 0; i < svgFire.length; i++) {
	svgFire[i] = new Image();
	svgFire[i].src = 'visuals/effects/fire' + i.toString(10).padStart(4, '0') + '.svg';
}

var wcFrames = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
var legFrames = [6,7,wcFrames];

//TODO: optimize this at some point
var svgCharsVB = new Array(charD.length);
var xhr = new Array(charD.length);
for (var i = 0; i < svgChars.length; i++) {
	//https://stackoverflow.com/questions/25220486/xmlhttprequest-in-for-loop
	(function(i) {
		if (typeof svgChars[i] !== 'undefined') {
			// I've been avoiding doing xmlhttprequest stuff as long as I could, doing things wrong so I could fix them and do them right later. But this seems to be the only way here, so...
			// But it was all worth it for not using any libraries!
			// https://stackoverflow.com/questions/38580176/how-can-i-read-an-svg-file-included-in-my-project-and-write-to-it
			xhr[i] = new XMLHttpRequest();
			xhr[i].open("GET", svgChars[i].src);
			xhr[i].setRequestHeader("Content-Type", "image/svg+xml");
			xhr[i].onload = function(event) {
				var response = event.target.responseText;
				var doc = new DOMParser();
				var xml = doc.parseFromString(response, "image/svg+xml");
				var svg = xml.getElementsByTagName('svg')[0];
				svgCharsVB[i] = svg.getAttribute('viewBox').split(' ').map(Number);
				return;
			};
			xhr[i].send();
		}
	})(i);
}
var svgTilesVB = new Array(blockProperties.length);
xhr = new Array(charD.length);
for (var i = 0; i < svgTiles.length; i++) {
	(function(i) {
		if (typeof svgTiles[i] !== 'undefined' && Object.prototype.toString.call(svgTiles[i]) !== '[object Array]') {
			xhr[i] = new XMLHttpRequest();
			xhr[i].open("GET", svgTiles[i].src);
			xhr[i].setRequestHeader("Content-Type", "image/svg+xml");
			xhr[i].onload = function(event) {
				var response = event.target.responseText;
				var doc = new DOMParser();
				var xml = doc.parseFromString(response, "image/svg+xml");
				var svg = xml.getElementsByTagName('svg')[0];
				svgTilesVB[i] = svg.getAttribute('viewBox').split(' ').map(Number);
				return;
			};
			xhr[i].send();
		}
	})(i);
}
var xhr2 = new Array(charD.length);
for (var i = 0; i < svgTiles.length; i++) {
	// (function(i) {
		if (Object.prototype.toString.call(svgTiles[i]) === '[object Array]') {
			svgTilesVB[i] = new Array(svgTiles[i].length);
			xhr2[i] = new Array(svgTiles[i].length);
			for (var j = 0; j < svgTiles[i].length; j++) {
				(function(i,j) {
					xhr2[i][j] = new XMLHttpRequest();
					xhr2[i][j].open("GET", svgTiles[i][j].src);
					xhr2[i][j].setRequestHeader("Content-Type", "image/svg+xml");
					xhr2[i][j].onload = function(event) {
						var response = event.target.responseText;
						var doc = new DOMParser();
						var xml = doc.parseFromString(response, "image/svg+xml");
						var svg = xml.getElementsByTagName('svg')[0];
						svgTilesVB[i][j] = svg.getAttribute('viewBox').split(' ').map(Number);
						return;
					};
					xhr2[i][j].send();
				})(i,j);
			}
		}
	// })(i);
}












































var svgMenu0 = new Image();
svgMenu0.src = 'visuals/menu0.svg';
var svgMenu2 = new Image();
svgMenu2.src = 'visuals/menu2.svg';
var svgMenu2border = new Image();
svgMenu2border.src = 'visuals/menu2border.svg';
var svgMenu2borderimg = new Image();
svgMenu2borderimg.src = 'visuals/bitmap737.jpg';
var preMenuBG = new Image();
preMenuBG.src = 'visuals/premenubg.png';

var menu2_3Buttons = [];
menu2_3Buttons.push(new Path2D('M 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nL 104.5 10.05\nM 98.75 7.6\nL 98.75 21.65\nQ 98.75 26.2 96.2 28.45 93.65 30.7 89.15 30.7 84.55 30.7 82.05 28.45 79.55 26.25 79.55 21.65\nL 79.55 7.6 84.5 7.6 84.5 21.65\nQ 84.5 22.55 84.65 23.45 84.8 24.35 85.3 25\nL 86.7 26.1 89.15 26.55\nQ 91.75 26.55 92.8 25.35 93.8 24.15 93.8 21.65\nL 93.8 7.6 98.75 7.6\nM 70.55 7.6\nL 75.2 7.6 75.2 30.15 70.25 30.15 60.85 15.05 60.8 15.05 60.8 30.15 56.15 30.15 56.15 7.6 61.1 7.6 70.5 22.75 70.55 22.75 70.55 7.6\nM 40.75 16.6\nL 51.65 16.6 51.65 20.45 40.75 20.45 40.75 26 52.85 26 52.85 30.15 35.75 30.15 35.75 7.6 52.6 7.6 52.6 11.8 40.75 11.8 40.75 16.6\nM 24.4 7.6\nL 31.4 7.6 31.4 30.15 26.75 30.15 26.75 14.2 26.7 14.2 21.15 30.15 17.35 30.15 11.8 14.35 11.75 14.35 11.75 30.15 7.1 30.15 7.1 7.6 14.1 7.6 19.35 23.15 19.45 23.15 24.4 7.6 Z'));
menu2_3Buttons.push(new Path2D('M 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nL 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nM 92.9 6.5\nL 99.6 6.5 90.05 16.15 100.55 30.9 93.8 30.9 86.45 19.95 83.4 23.05 83.4 30.9 78 30.9 78 6.5 83.4 6.5 83.4 16.6 92.9 6.5\nM 67.15 11.65\nQ 66.45 11.05 65.55 10.75\nL 63.65 10.4\nQ 61.85 10.4 60.6 11.1 59.3 11.85 58.55 13 57.75 14.2 57.4 15.7 57.05 17.2 57.05 18.8 57.05 20.35 57.4 21.8 57.75 23.25 58.55 24.4 59.3 25.6 60.6 26.3 61.85 27 63.65 27 66.1 27 67.5 25.45 68.9 23.95 69.2 21.5\nL 74.4 21.5\nQ 74.2 23.8 73.35 25.65 72.45 27.5 71.05 28.8 69.65 30.1 67.8 30.8\nL 63.65 31.5\nQ 60.8 31.5 58.6 30.5 56.35 29.5 54.8 27.8 53.3 26.1 52.45 23.75 51.65 21.45 51.65 18.8 51.65 16.1 52.45 13.75 53.3 11.4 54.8 9.65 56.35 7.9 58.6 6.9 60.8 5.9 63.65 5.9 65.65 5.9 67.45 6.5 69.25 7.1 70.65 8.2 72.1 9.3 73 10.95 73.95 12.6 74.15 14.7\nL 68.95 14.7\nQ 68.85 13.8 68.35 13\nL 67.15 11.65\nM 50.6 30.9\nL 45 30.9 43.15 25.5 34.05 25.5 32.15 30.9 26.7 30.9 35.95 6.5 41.45 6.5 50.6 30.9\nM 22.35 7.8\nQ 23.35 8.5 23.9 9.65 24.5 10.85 24.5 12.55 24.5 14.35 23.65 15.6 22.8 16.85 21.15 17.65 23.45 18.3 24.55 19.9 25.65 21.55 25.65 23.8 25.65 25.7 24.95 27.05 24.2 28.4 23 29.25 21.8 30.1 20.2 30.5\nL 17.05 30.9 5.2 30.9 5.2 6.5 16.7 6.5 19.85 6.8\nQ 21.3 7.1 22.35 7.8\nM 19.2 20.85\nQ 18.15 20.05 16.4 20.05\nL 10.6 20.05 10.6 26.75 16.3 26.75 17.8 26.6 19.05 26.05 19.95 25.1 20.25 23.5\nQ 20.25 21.65 19.2 20.85\nM 19 12.1\nQ 18.65 11.5 18.15 11.2\nL 17 10.8 15.6 10.65 10.6 10.65 10.6 16.4 16 16.4\nQ 17.45 16.4 18.35 15.7 19.3 15 19.3 13.5\nL 19 12.1\nM 38.7 12.5\nL 38.65 12.5 35.45 21.45 41.75 21.45 38.7 12.5 Z'));
menu2_3Buttons.push(new Path2D('M 104.5 27.3\nL 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nM 97.5 11.4\nL 85.2 11.4 85.2 16.35 96.5 16.35 96.5 20.35 85.2 20.35 85.2 26.1 97.75 26.1 97.75 30.4 80.05 30.4 80.05 7.05 97.5 7.05 97.5 11.4\nM 77.4 7.05\nL 77.4 11.4 70.4 11.4 70.4 30.4 65.25 30.4 65.25 11.4 58.3 11.4 58.3 7.05 77.4 7.05\nM 40.95 21.6\nL 41.1 23.45\nQ 41.25 24.35 41.8 25.1\nL 43.25 26.2 45.75 26.65\nQ 48.5 26.65 49.55 25.4 50.6 24.2 50.6 21.6\nL 50.6 7.05 55.7 7.05 55.7 21.6\nQ 55.7 26.3 53.05 28.65 50.4 30.95 45.75 30.95 41 30.95 38.4 28.65 35.8 26.35 35.8 21.6\nL 35.8 7.05 40.95 7.05 40.95 21.6\nM 26.55 13.85\nL 26.45 13.85 20.75 30.4 16.8 30.4 11.05 14.05 11 14.05 11 30.4 6.2 30.4 6.2 7.05 13.45 7.05 18.9 23.1 18.95 23.1 24.1 7.05 31.35 7.05 31.35 30.4 26.55 30.4 26.55 13.85 Z'));
menu2_3Buttons.push(new Path2D('\nM 104.5 27.3\nL 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nM 86.35 6.35\nL 86.35 26.35 98.3 26.35 98.3 30.85 80.95 30.85 80.95 6.35 86.35 6.35\nM 64.1 6.35\nL 69.6 6.35 78.8 30.85 73.2 30.85 71.35 25.4 62.2 25.4 60.25 30.85 54.8 30.85 64.1 6.35\nM 52.8 6.35\nL 52.8 21.6\nQ 52.8 26.55 50.05 29 47.25 31.45 42.35 31.45 37.35 31.45 34.65 29 31.9 26.6 31.9 21.6\nL 31.9 6.35 37.3 6.35 37.3 21.6 37.45 23.55\nQ 37.65 24.5 38.2 25.25 38.75 26.05 39.7 26.45\nL 42.35 26.9\nQ 45.2 26.9 46.3 25.65 47.4 24.35 47.4 21.6\nL 47.4 6.35 52.8 6.35\nM 21.4 6.75\nQ 23.65 7.8 25.2 9.5 26.75 11.3 27.55 13.65 28.35 16 28.35 18.7 28.35 21.4 27.55 23.7 26.75 26 25.2 27.7\nL 28.25 30.5 25.75 33.15 22.25 30\nQ 21.05 30.7 19.6 31.05\nL 16.35 31.45\nQ 13.5 31.45 11.25 30.45 9.05 29.45 7.5 27.75 5.95 26 5.15 23.7 4.3 21.35 4.3 18.7 4.3 16 5.15 13.65 5.95 11.3 7.5 9.5 9.05 7.8 11.25 6.75 13.5 5.8 16.35 5.8 19.2 5.8 21.4 6.75\nM 21.45 24.35\nQ 22.15 23.4 22.55 22.05 23 20.65 23 18.7 23 17.1 22.65 15.6 22.25 14.05 21.45 12.9 20.7 11.7 19.4 11 18.15 10.3 16.35 10.3 14.5 10.3 13.25 11 12 11.7 11.2 12.9 10.4 14.05 10.05 15.6 9.7 17.1 9.7 18.7 9.7 20.25 10.05 21.7 10.4 23.2 11.2 24.35 12 25.5 13.25 26.2 14.5 26.9 16.35 26.9\nL 17.55 26.9 18.5 26.6 16.2 24.45 18.7 21.8 21.45 24.35\nM 66.85 12.4\nL 66.75 12.4 63.6 21.4 69.9 21.4 66.85 12.4 Z'));

var menu0ButtonSize = {w: 273.0, h: 36.9, cr: 6.65};
var menu2_3ButtonSize = {w: 104.5, h: 37.3};
var levelButtonSize = {w: 100, h: 40};
var menu0ButtonClicked = -1;
var menu2_3ButtonClicked = -1;
var levelButtonClicked = -1;

function onRect(mx, my, x, y, w, h) {
	return mx>x&&mx<x+w&&my>y&&my<y+h;
}


function drawMenu0Button(text, x, y, id, grayed, action) {
	var fill = '#ffffff';
	if (!grayed) {
		if (onRect(_xmouse, _ymouse, x, y, menu0ButtonSize.w, menu0ButtonSize.h)) {
			if (mouseIsDown) {
				fill = '#b8b8b8';
				menu0ButtonClicked = id;
			} else fill = '#d4d4d4';
		}
		if (!mouseIsDown && menu0ButtonClicked === id) {
			menu0ButtonClicked = -1;
			action();
		}
	} else {
		fill = '#b8b8b8';
	}

	drawRoundedRect(fill, x, y, menu0ButtonSize.w, menu0ButtonSize.h, menu0ButtonSize.cr);

	ctx.font = '30px Helvetica';
	ctx.fillStyle = '#666666';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, x+menu0ButtonSize.w/2, y+menu0ButtonSize.h*1.1/2);
}

function drawMenu2_3Button(id, x, y, action) {
	var fill = '#ffffff';
	if (onRect(_xmouse, _ymouse, x, y, menu2_3ButtonSize.w, menu2_3ButtonSize.h)) {
		if (mouseIsDown) {
			fill = '#CCCCCC';
			menu2_3ButtonClicked = id;
		}
	} else {
		ctx.globalAlpha = 0.5;
	}
	if (!mouseIsDown && menu2_3ButtonClicked === id) {
		menu2_3ButtonClicked = -1;
		action();
	}
	ctx.fillStyle = fill;

	ctx.translate(x, y);
	ctx.fill(menu2_3Buttons[id]);
	ctx.translate(-x, -y);
	ctx.globalAlpha = 1;
}

function drawLevelButton(text, x, y, id, color) {
	var fill = '#585858';
	if (color == 2) fill = '#ff8000';
	else if (color == 3) fill = '#efe303';
	else if (color == 4) fill = '#00cc00';
	if (color > 1) {
		if (onRect(_xmouse, _ymouse-cameraY, x, y, levelButtonSize.w, levelButtonSize.h)) {
			if (mouseIsDown) {
				if (color == 2) fill = '#d56a00';
				else if (color == 3) fill = '#c6bc02';
				else if (color == 4) fill = '#00a200';
				levelButtonClicked = id;
			} else {
				if (color == 2) fill = '#ffaa55';
				else if (color == 3) fill = '#ffff99';
				else if (color == 4) fill = '#22ff22';
			}
		}
		if (!mouseIsDown && levelButtonClicked === id) {
			levelButtonClicked = -1;
			if (id <= levelProgress) {
				playLevel(id);
				// white._alpha = 100;
			}
		}
	}

	ctx.fillStyle = fill;
	ctx.fillRect(x, y, levelButtonSize.w, levelButtonSize.h);
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#000000';
	ctx.strokeRect(x, y, levelButtonSize.w, levelButtonSize.h);

	ctx.font = 'bold 41px Helvetica';
	ctx.fillStyle = '#000000';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, x+levelButtonSize.w/2, y+levelButtonSize.h*1.1/2);
}

function drawNewGame2Button(text, x, y, id, color, action) {
	var size = 107.5;
	if (onRect(_xmouse, _ymouse, x, y, size, size)) {
		if (mouseIsDown) {
			menu0ButtonClicked = id;
		}
	}
	if (!mouseIsDown && menu0ButtonClicked === id) {
		menu0ButtonClicked = -1;
		action();
	}

	drawRoundedRect(color, x, y, size, size, 25);

	ctx.font = 'bold 40px Helvetica';
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, x+size/2, y+size*1.1/2);
}

function drawRoundedRect(fill, x, y, w, h, cr) {
	var x1 = x+cr;
	var y1 = y+cr;
	var w1 = w-cr-cr;
	var h1 = h-cr-cr;
	ctx.beginPath();
	ctx.fillStyle = fill;
	ctx.arc(x1,   y1,   cr, Math.PI,       Math.PI * 1.5, false);
	ctx.arc(x1+w1,y1,   cr, Math.PI * 1.5, Math.PI * 2,   false);
	ctx.arc(x1+w1,y1+h1,cr, Math.PI * 2,   Math.PI * 2.5, false);
	ctx.arc(x1,   y1+h1,cr, Math.PI * 2.5, Math.PI * 3,   false);
	ctx.lineTo(x1 - cr, y);
	ctx.fill();
}
//https://thewebdev.info/2021/05/15/how-to-add-line-breaks-into-the-html5-canvas-with-filltext/
function linebreakText(text, x, y, lineheight) {
	var lines = text.split('\n');
	for (var i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], x, y + (i * lineheight));
	}
}

//https://thewebdev.info/2021/08/28/how-to-wrap-text-in-a-canvas-element-with-javascript/
function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const [index, w] of words.entries()) {
    const testLine = line + w + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && index > 0) {
      ctx.fillText(line, x, y);
      line = w + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}









// var started = levelProgress != 0;
var showingNewGame2 = false;

function menuWatch() {
	window.open('https://www.youtube.com/watch?v=4q77g4xo9ic');
}
function menuNewGame() {
	if (levelProgress != 0) {
		showingNewGame2 = true;
	} else {
		beginNewGame();
	}
}
function menuNewGame2no() {
	showingNewGame2 = false;
}
function menuNewGame2yes() {
	showingNewGame2 = false;
	beginNewGame();
}
function menuContGame() {
	menuScreen = 2;
}
function menuLevelCreator() {
	window.open('https://zolo101.github.io/BFDIA5bLevelEditor/');
}
function menuExplore() {
	//
}
function menu2Back() {
	menuScreen = 0;
	cameraX = 0;
	cameraY = 0;
}
function menu3Menu() {
	timer += getTimer() - levelTimer2;
	// saveGame();
	exitLevel();
}


function drawMenu() {
	// _root.attachMovie("menuMovieClip","menuMovieClip",0);
	ctx.fillStyle = '#666666';
	ctx.fillRect(0, 0, cwidth, cheight);
	ctx.drawImage(svgMenu0, 0, 0);

	drawMenu0Button('WATCH BFDIA 5a', 665.55, 303.75, 0, false, menuWatch);
	if (showingNewGame2) {
		drawRoundedRect('#ffffff', 665.5, 81, 273, 72.95, 15);
		ctx.font = '20px Helvetica';
		ctx.fillStyle = '#666666';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		linebreakText('Are you sure you want to\nerase your saved progress\nand start a new game?', 802, 84.3, 22);
		// ctx.fillText('Are you sure you want to\nerase your saved progress\nand start a new game?', 802, 82.3);
		drawNewGame2Button('YES', 680.4, 169.75, 5, '#993333', menuNewGame2yes);
		drawNewGame2Button('NO', 815.9, 169.75, 6, '#1A4D1A', menuNewGame2no);
	}
	else drawMenu0Button('NEW GAME', 665.55, 348.4, 1, false,  menuNewGame);
	drawMenu0Button('CONTINUE GAME', 665.55, 393.05, 2, levelProgress == 0,  menuContGame);
	drawMenu0Button('LEVEL CREATOR', 665.55, 437.7, 3, true,  menuLevelCreator);
	drawMenu0Button('EXPLORE', 665.55, 482.5, 4, true,  menuExplore);

	// menuMovieClip.menuLevelCreatorGray.gotoAndStop(2);
	// menuMovieClip.menuLevelViewerGray.gotoAndStop(2);
	// var started = true;
	// if (bfdia5b.data.levelProgress == undefined || bfdia5b.data.levelProgress == 0) {
	//    started = false;
	// }
	// if (!started) {
	//    menuMovieClip.menuContGameGray.gotoAndStop(2);
	// }
	// menuMovieClip.menuNewGame.onRelease = function() {
	//    if(started) {
	//       menuMovieClip.menuNewGame._x += 1000;
	//       menuMovieClip.menuNewGame2._x -= 1000;
	//    }
	//    else
	//    {
	//       beginNewGame();
	//    }
	// };
	// menuMovieClip.menuNewGame2.yes.onRelease = function()
	// {
	//    beginNewGame();
	// };
	// menuMovieClip.menuNewGame2.no.onRelease = function()
	// {
	//    menuMovieClip.menuNewGame._x -= 1000;
	//    menuMovieClip.menuNewGame2._x += 1000;
	// };
	// menuMovieClip.menuContGame.onRelease = function()
	// {
	// 	if(started)
	// 	{
	// 		_root.menuMovieClip.removeMovieClip();
	// 		drawLevelMap();
	// 	}
	// };
}

function beginNewGame() {
	clearVars();
	// saveGame();
	menuScreen = 2;
	cameraY = 0;
	cameraX = 0;
}

function drawLevelMapBorder() {
	// https://stackoverflow.com/questions/18379818/canvas-image-masking-overlapping
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(0,540);
	ctx.lineTo(960,540);
	ctx.lineTo(960,0);
	ctx.lineTo(0,0);
	ctx.moveTo(20,38.75);
	ctx.quadraticCurveTo(20.6,20.6,38.75,20);
	ctx.lineTo(921.25,20);
	ctx.quadraticCurveTo(939.4,20.6,940,38.75);
	ctx.lineTo(940,501.25);
	ctx.quadraticCurveTo(939.4,519.4,921.25,520);
	ctx.lineTo(38.75,520);
	ctx.quadraticCurveTo(20.6,519.4,20,501.25);
	ctx.lineTo(20,38.75);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(svgMenu2borderimg, 0, 0, cwidth, cheight);
	ctx.restore();

	ctx.drawImage(svgMenu2border, 0, 0);

	drawMenu2_3Button(2, 705, 469, toggleSound);
	drawMenu2_3Button(1, 823, 469, menu2Back);
}
function drawLevelMap() {
	// ctx.fillRect(0, 0, 100, 100);
	ctx.drawImage(svgMenu2, 0, 0);
	// _root.attachMovie("levelMap","levelMap",2,{_x:0,_y:0});
	// _root.attachMovie("levelMapBorder","levelMapBorder",3);

	// levelMapBorder.goBack.onRelease = function()
	// {
	//    _root.levelMap.removeMovieClip();
	//    _root.levelMapBorder.removeMovieClip();
	//    menuScreen = 0;
	// };
	// levelMapBorder.muteButton2.onRelease = function()
	// {
	//    if(musicSound.getVolume() == 100)
	//    {
	//       musicSound.setVolume(0);
	//    }
	//    else
	//    {
	//       musicSound.setVolume(100);
	//    }
	// };


	ctx.fillStyle = '#000000';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.font = '40px Helvetica';
	ctx.fillText('x ' + coins, 477.95, 44.9);
	ctx.font = '21px Helvetica';
	ctx.fillText(toHMS(timer), 767.3, 27.5);
	ctx.fillText(addCommas(deathCount), 767.3, 55.9);
	ctx.textAlign = 'right';
	ctx.fillText('Time:', 757.05, 27.5);
	ctx.fillText('Deaths:', 757.05, 55.9);
	if(levelProgress > 0) {
		ctx.font = '14px Helvetica';
		ctx.textAlign = 'right';
		ctx.fillText('Minimal deaths to complete level ' + levelProgress + ':', 756.3, 90.5);
		ctx.font = '21px Helvetica';
		ctx.fillText('Unnecessary deaths:', 756.3, 116.8);
		ctx.textAlign = 'left';
		ctx.fillText(mdao[levelProgress - 1], 767.3, 85.4);
		ctx.fillText(addCommas(deathCount - mdao[levelProgress - 1]), 767.3, 116.8);
	}
	for (var _loc3_ = 0; _loc3_ < 133; _loc3_++) {
		var _loc4_ = _loc3_;
		if (_loc4_ >= 100) _loc4_ += 19;
		var color = 1;
		if (gotCoin[_loc3_]) color = 4;
		else if (levelProgress == _loc3_) color = 2;
		else if (levelProgress > _loc3_) color = 3;
		var text = '';
		if(_loc3_ >= 100) text = "B" + numberToText(_loc3_ - 99,false);
		else text = numberToText(_loc3_ + 1,true);
		drawLevelButton(text, _loc4_ % 8 * 110 + 45, Math.floor(_loc4_ / 8) * 50 + 160, _loc3_, color);
	}
}

function playLevel(i) {
	if (i == levelProgress) playMode = 0;
	else if (i < levelProgress) playMode = 1;
	currentLevel = i;
	wipeTimer = 30;
	// _root.attachMovie("csBubble","csBubble",8);
	// _root.createEmptyMovieClip("HPRCBubble",7);
	// _root.createEmptyMovieClip("levelChar",5);
	// addTileMovieClips();
	// _root.attachMovie("bg","bg",0);
	// levelStill.cacheAsBitmap = true;
	// levelStill.cacheAsBitmap = true;
	// levelShadow.cacheAsBitmap = true;
	// bg.cacheAsBitmap = true;
	menuScreen = 3;
	// _root.attachMovie("levelButtons","levelButtons",9);
	toSeeCS = true;
	transitionType = 1;
	resetLevel();
	// levelButtons.levelMapButton.onRelease = function()
	// {
	// 	timer += getTimer() - levelTimer2;
	// 	saveGame();
	// 	exitLevel();
	// };
}

function resetLevel() {
	HPRCBubbleFrame = 0;
	charCount = startLocations[currentLevel].length;
	levelWidth = levels[currentLevel][0].length;
	levelHeight = levels[currentLevel].length;
	charDepths = new Array(charCount);
	for (var i = 0; i < charDepths.length; i++) charDepths[i] = charCount-i-1;
	copyLevel(levels[currentLevel]);
	charDepth = levelWidth * levelHeight + charCount * 2;
	charCount2 = 0;
	HPRC1 = HPRC2 = 1000000;
	for (var _loc1_ = 0; _loc1_ < charCount; _loc1_++) {
		var _loc2_ = startLocations[currentLevel][_loc1_][0];
		char[_loc1_] = new Character(_loc2_,startLocations[currentLevel][_loc1_][1] * 30 + startLocations[currentLevel][_loc1_][2] * 30 / 100,startLocations[currentLevel][_loc1_][3] * 30 + startLocations[currentLevel][_loc1_][4] * 30 / 100,70 + _loc1_ * 40,400 - _loc1_ * 30,0,0,false,4,false,0,200,200,30,startLocations[currentLevel][_loc1_][5],-1,new Array(0),charD[_loc2_][0],charD[_loc2_][1],charD[_loc2_][2],charD[_loc2_][2],charD[_loc2_][3],false,charD[_loc2_][4],0,2,0,new Array(0),0,0,0,0,charD[_loc2_][6]);
		if (_loc2_ <= 5) charCount2++;
		if (_loc2_ == 36) HPRC1 = _loc1_;
		if (_loc2_ == 35) HPRC2 = _loc1_;
		if (char[_loc1_].charState == 3 || char[_loc1_].charState == 4) {
			char[_loc1_].speed = startLocations[currentLevel][_loc1_][6][0] * 10 + startLocations[currentLevel][_loc1_][6][1];
		}
	}
	drawLevel();
	drawCharacters();
	recover = false;
	cornerHangTimer = 0;
	charsAtEnd = 0;
	control = 0;
	cutScene = 0;
	// white._visible = true;
	bgXScale = ((levelWidth - 32) * 10 + 960) / 9.6;
	bgYScale = ((levelHeight - 18) * 10 + 540) / 5.4;
	// bg._xscale = Math.max(bgXScale,bgYScale);
	// bg._yscale = Math.max(bgXScale,bgYScale);
	// bg.gotoAndStop(bgs[currentLevel] + 1);
	// levelShadow.cacheAsBitmap = true;
	// levelStill.cacheAsBitmap = true;
	// bg.cacheAsBitmap = true;
	cameraX = Math.min(Math.max(char[0].x - 480,0),levelWidth * 30 - 960);
	cameraY = Math.min(Math.max(char[0].y - 270,0),levelHeight * 30 - 540);
	// levelButtons.textie.text = numberToText(currentLevel + 1,true) + ". " + levelName[currentLevel];
	gotThisCoin = false;
	levelTimer = 0;
	levelTimer2 = getTimer();
	if (char[0].charState <= 9)  changeControl();
	calculateShadowsAndBorders();
}

function copyLevel(thatLevel) {
	thisLevel = new Array(thatLevel.length);
	tileFrames = new Array(thatLevel.length);
	tileShadows = new Array(thatLevel.length);
	tileBorders = new Array(thatLevel.length);
	for (var _loc2_ = 0; _loc2_ < levelHeight; _loc2_++) {
		thisLevel[_loc2_] = new Array(thatLevel[_loc2_].length);
		tileFrames[_loc2_] = new Array(thatLevel[_loc2_].length);
		tileShadows[_loc2_] = new Array(thatLevel[_loc2_].length);
		tileBorders[_loc2_] = new Array(thatLevel[_loc2_].length);
		for (var _loc1_ = 0; _loc1_ < levelWidth; _loc1_++) {
			thisLevel[_loc2_][_loc1_] = thatLevel[_loc2_][_loc1_];
			var sw = Math.ceil(blockProperties[thisLevel[_loc2_][_loc1_]][11]/6);
			tileFrames[_loc2_][_loc1_] = {cf: 0, playing: false, rotation: (sw==1?-60:(sw==2?60:0))};
			tileShadows[_loc2_][_loc1_] = [];
			tileBorders[_loc2_][_loc1_] = [];
		}
	}
}

function drawLevelButtons() {
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.font = 'bold 32px Helvetica';
	ctx.fillText(numberToText(currentLevel + 1,true) + ". " + levelName[currentLevel], 12.85, 489.45);
	drawMenu2_3Button(0, 837.5, 486.95, menu3Menu);
}

function drawLevel() {
	// if (playMode == 0 && currentLevel >= 1) {
	// 	removeTileMovieClips();
	// 	addTileMovieClips();
	// }
	for (var _loc3_ = 0; _loc3_ < 6; _loc3_++) {
		switchable[_loc3_] = new Array(0);
	}
	for (var _loc2_ = 0; _loc2_ < levelHeight; _loc2_++) {
		for (var _loc1_ = 0; _loc1_ < levelWidth; _loc1_++) {
			if (thisLevel[_loc2_][_loc1_] >= 1) {
				// console.log(thisLevel[_loc2_][_loc1_]);
				if (blockProperties[thisLevel[_loc2_][_loc1_]][12] >= 1) {
					switchable[blockProperties[thisLevel[_loc2_][_loc1_]][12] - 1].push([_loc1_,_loc2_]);
				}
				if (blockProperties[thisLevel[_loc2_][_loc1_]][14]) {
					addTileMovieClip(_loc1_,_loc2_); //levelActive3
				} else if (blockProperties[thisLevel[_loc2_][_loc1_]][11] >= 1) {
					addTileMovieClip(_loc1_,_loc2_); //levelActive2
					if (blockProperties[thisLevel[_loc2_][_loc1_]][11] >= 7 && blockProperties[thisLevel[_loc2_][_loc1_]][11] <= 12) {
						// levelActive2["tileX" + _loc1_ + "Y" + _loc2_].lever._rotation = 60;
					}
				} else if (blockProperties[thisLevel[_loc2_][_loc1_]][8]) {
					addTileMovieClip(_loc1_,_loc2_); //levelActive
				} else {
					addTileMovieClip(_loc1_,_loc2_); //levelStill
				}
				if (thisLevel[_loc2_][_loc1_] == 6) {
					locations[0] = _loc1_;
					locations[1] = _loc2_;
					if (bgs[currentLevel] == 9 || bgs[currentLevel] == 10) {
						// levelActive["tileX" + _loc1_ + "Y" + _loc2_].bg.gotoAndStop(2);
					}
				}
				if (thisLevel[_loc2_][_loc1_] == 12) {
					locations[2] = _loc1_;
					locations[3] = _loc2_;
					locations[4] = 1000;
					locations[5] = 0;
				}
			}
		}
	}
	// ctx.globalAlpha = 0.4;
	for (var _loc2_ = 0; _loc2_ < levelHeight; _loc2_++) {
		for (var _loc1_ = 0; _loc1_ < levelWidth; _loc1_++) {
			// if (tileBorders[_loc2_][_loc1_]  > 0) ctx.drawImage(svgTileBorders[tileBorders[_loc2_][_loc1_] -1], _loc1_*30, _loc2_*30);
			for (var i = 0; i < tileShadows[_loc2_][_loc1_].length; i++) {
				ctx.drawImage(svgShadows[tileShadows[_loc2_][_loc1_][i] - 1], _loc1_*30, _loc2_*30);
			}
			for (var i = 0; i < tileBorders[_loc2_][_loc1_].length; i++) {
				ctx.drawImage(svgTileBorders[tileBorders[_loc2_][_loc1_][i] - 1], _loc1_*30, _loc2_*30);
			}
		}
	}
	// ctx.globalAlpha = 1;
}

// TODO: add depths

function addTileMovieClip(x, y) {
	var _loc5_ = thisLevel[y][x];
	if (typeof svgTiles[_loc5_] !== 'undefined') {
		if (!blockProperties[_loc5_][15]) {
			if (blockProperties[_loc5_][11] > 0 && typeof svgLevers[(blockProperties[_loc5_][11]-1)%6] !== 'undefined') {
				ctx.save();
				// ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
				ctx.translate(x*30+15, y*30+28); //x*30, y*30
				ctx.rotate(tileFrames[y][x].rotation*(Math.PI/180));
				ctx.translate(-x*30-15, -y*30-28); // TODO: find out how to remove this line
				ctx.drawImage(svgLevers[(blockProperties[_loc5_][11]-1)%6], x*30, y*30);
				ctx.restore();
				// Math.floor(blockProperties[_loc5_][11]/6);
				//Math.floor(blockProperties[_loc5_][11]/6)
				// ctx.fillStyle = '#505050';
				// ctx.fillRect(x*30, y*30, 30, 30);
			}
			ctx.drawImage(svgTiles[_loc5_], x*30+svgTilesVB[_loc5_][0], y*30+svgTilesVB[_loc5_][1]);
		} else {
			var frame = 0;
			if (blockProperties[_loc5_][17]) frame = blockProperties[_loc5_][18][_frameCount%blockProperties[_loc5_][18].length];
			else {
				frame = tileFrames[y][x].cf;
				if (tileFrames[y][x].playing) tileFrames[y][x].cf++;
				if (tileFrames[y][x].cf >= blockProperties[_loc5_][16]-1) {
					tileFrames[y][x].playing = false;
					tileFrames[y][x].cf = 0;
				}
			}
			ctx.drawImage(svgTiles[_loc5_][frame], x*30+svgTilesVB[_loc5_][frame][0], y*30+svgTilesVB[_loc5_][frame][1]);
			// ctx.drawImage(svgTiles[_loc5_][0], x*30, y*30);
		}
	}
	else if (_loc5_ == 6) {
		ctx.fillStyle = '#505050';
		ctx.fillRect((x-1)*30, (y-3)*30, 60, 120);
	} else if (_loc5_ == 12) {
		if (!gotThisCoin) {
			ctx.save();
			ctx.translate(x*30+15, y*30+15);
			var wtrot = Math.sin((_frameCount*Math.PI)/20)*0.5235987756;
			ctx.transform(Math.cos(wtrot),-Math.sin(wtrot),Math.sin(wtrot),Math.cos(wtrot),0,0);
			ctx.globalAlpha = Math.max(Math.min((140 - locations[4] * 0.7)/100, 1), 0);
			ctx.drawImage(svgCoin, -15, -15, 30, 30);
			ctx.restore();
		} else if (tileFrames[y][x].cf < svgCoinGet.length) {
			ctx.drawImage(svgCoinGet[tileFrames[y][x].cf], x*30-21, y*30-21);
			tileFrames[y][x].cf++;
		}
	}
	// else if (blockProperties[_loc5_][0] || blockProperties[_loc5_][1] || blockProperties[_loc5_][2] || blockProperties[_loc5_][3]) {
	// 	ctx.fillStyle = '#00ff99';
	// 	ctx.fillRect(x*30, y*30, 30, 30);
	// } else if (blockProperties[_loc5_][4] || blockProperties[_loc5_][5] || blockProperties[_loc5_][6] || blockProperties[_loc5_][7]) {
	// 	ctx.fillStyle = '#ff9900';
	// 	ctx.fillRect(x*30, y*30, 30, 30);
	// } else {
	// 	ctx.fillStyle = '#ffff99';
	// 	ctx.fillRect(x*30, y*30, 30, 30);
	// }
	// level.attachMovie("tile" + Math.floor(_loc5_ / 10),"tileX" + x + "Y" + y,y * levelWidth + x,{_x:x * 30,_y:y * 30});
	// level["tileX" + x + "Y" + y].gotoAndStop(_loc5_ % 10 + 1);

	// TODO: precalculate these when the level is loaded. Update when there's a block update.
	// ctx.globalAlpha = 0.4;
	// if(_loc5_ == 6) {
	// // 	level["tileX" + x + "Y" + y].light.gotoAndStop(charCount2);
	// 	for (var _loc2_ = 0; _loc2_ < 2; _loc2_++) {
	// 		for (var _loc1_ = 0; _loc1_ < 4; _loc1_++) {
	// 			setAmbientShadow(x - _loc2_,y - _loc1_);
	// 		}
	// 	}
	// } else if (_loc5_ >= 110 && _loc5_ <= 129) {
	// 	for (var _loc2_ = 0; _loc2_ < 3; _loc2_++) {
	// 		for (var _loc1_ = 0; _loc1_ < 2; _loc1_++) {
	// 			setAmbientShadow(x - _loc2_,y - _loc1_);
	// 		}
	// 	}
	// } else if (blockProperties[thisLevel[y][x]][10]) {
	// 	setAmbientShadow(x,y);
	// }
	// if (blockProperties[thisLevel[y][x]][13]) {
	// 	setBorder(x,y,_loc5_);
	// }
	// ctx.globalAlpha = 1;
}

function calculateShadowsAndBorders() {
	for (var y = 0; y < levelHeight; y++) {
		for (var x = 0; x < levelWidth; x++) {
			if (thisLevel[y][x] >= 1) {
				// // addTileMovieClip(_loc1_,_loc2_);
				// if (blockProperties[thisLevel[_loc2_][_loc1_]][12] >= 1) {
				// 	switchable[blockProperties[thisLevel[_loc2_][_loc1_]][12] - 1].push([_loc1_,_loc2_]);
				// }
				// if (blockProperties[thisLevel[_loc2_][_loc1_]][14]) {
				// 	addTileMovieClip(_loc1_,_loc2_); //levelActive3
				// } else if (blockProperties[thisLevel[_loc2_][_loc1_]][11] >= 1) {
				// 	addTileMovieClip(_loc1_,_loc2_); //levelActive2
				// 	if (blockProperties[thisLevel[_loc2_][_loc1_]][11] >= 7 && blockProperties[thisLevel[_loc2_][_loc1_]][11] <= 12) {
				// 		// levelActive2["tileX" + _loc1_ + "Y" + _loc2_].lever._rotation = 60;
				// 	}
				// } else if (blockProperties[thisLevel[_loc2_][_loc1_]][8]) {
				// 	addTileMovieClip(_loc1_,_loc2_); //levelActive
				// } else {
				// 	addTileMovieClip(_loc1_,_loc2_); //levelStill
				// }
				// if (thisLevel[_loc2_][_loc1_] == 6) {
				// 	locations[0] = _loc1_;
				// 	locations[1] = _loc2_;
				// 	if (bgs[currentLevel] == 9 || bgs[currentLevel] == 10) {
				// 		// levelActive["tileX" + _loc1_ + "Y" + _loc2_].bg.gotoAndStop(2);
				// 	}
				// }
				// if (thisLevel[_loc2_][_loc1_] == 12) {
				// 	locations[2] = _loc1_;
				// 	locations[3] = _loc2_;
				// 	locations[4] = 1000;
				// 	locations[5] = 0;
				// }
				//
				var _loc5_ = thisLevel[y][x];
				if(_loc5_ == 6) {
					for (var _loc2_ = 0; _loc2_ < 2; _loc2_++) {
						for (var _loc1_ = 0; _loc1_ < 4; _loc1_++) {
							setAmbientShadow(x - _loc2_,y - _loc1_);
						}
					}
				} else if (_loc5_ >= 110 && _loc5_ <= 129) {
					for (var _loc2_ = 0; _loc2_ < 3; _loc2_++) {
						for (var _loc1_ = 0; _loc1_ < 2; _loc1_++) {
							setAmbientShadow(x - _loc2_,y - _loc1_);
						}
					}
				} else if (blockProperties[thisLevel[y][x]][10]) {
					setAmbientShadow(x,y);
				}
				if (blockProperties[thisLevel[y][x]][13]) {
					setBorder(x,y,_loc5_);
				}
			}
		}
	}
}

function setAmbientShadow(x, y) {
	tileShadows[y][x] = [];
	// levelShadow.attachMovie("tileShadow","tileX" + x + "Y" + y,y * levelWidth + x,{_x:x * 30,_y:y * 30});
	if (outOfRange(x, y)) return;
	var _loc5_ = 0;
	for (var _loc1_ = 0; _loc1_ < 4; _loc1_++) {
		if ((!outOfRange(x + cardinal[_loc1_][0],y + cardinal[_loc1_][1]))) {
			var _loc4_ = blockProperties[thisLevel[y + cardinal[_loc1_][1]][x + cardinal[_loc1_][0]]][12];
			if(blockProperties[thisLevel[y + cardinal[_loc1_][1]][x + cardinal[_loc1_][0]]][_loc1_] && (_loc4_ == 0 || _loc4_ == 6)) {
				_loc5_ += Math.pow(2,3 - _loc1_);
				// ctx.fillStyle = '#009900';
				// ctx.fillRect(x*30, y*30, 30, 30);
			}
		}
	}
	// if (_loc5_ > 0) ctx.drawImage(svgShadows[_loc5_-1], x*30, y*30);
	if (_loc5_ > 0) tileShadows[y][x].push(_loc5_);
	// levelShadow["tileX" + x + "Y" + y].ambientShadow.gotoAndStop(_loc5_ + 1);
	for (var _loc1_ = 0; _loc1_ < 4; _loc1_++) {
		if ((!outOfRange(x + diagonal[_loc1_][0],y + diagonal[_loc1_][1])) && !blockProperties[thisLevel[y][x + diagonal[_loc1_][0]]][opposite(_loc1_,0)] && !blockProperties[thisLevel[y + diagonal[_loc1_][1]][x]][opposite(_loc1_,1)] && blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][opposite(_loc1_,0)] && blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][12] == 0 && blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][opposite(_loc1_,1)] && blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][12] == 0) {
			// !blockProperties[thisLevel[y                      ][x + diagonal[_loc1_][0]]][opposite(_loc1_,0)] &&
			// !blockProperties[thisLevel[y + diagonal[_loc1_][1]][x                      ]][opposite(_loc1_,1)] &&
			//  blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][opposite(_loc1_,0)] &&
			//  blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][12] == 0 &&
			//  blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][opposite(_loc1_,1)] &&
			//  blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][12] == 0) {

			// levelShadow["tileX" + x + "Y" + y].ambientShadow2["a" + _loc1_].gotoAndStop(2);
			// ctx.drawImage(svgShadows[15+_loc1_], x*30, y*30);
			tileShadows[y][x].push(16+_loc1_);
		} else {
			// levelShadow["tileX" + x + "Y" + y].ambientShadow2["a" + _loc1_].gotoAndStop(1);
		}
	}
}
function setBorder(x, y, s) {
	tileBorders[y][x] = [];
	if (outOfRange(x, y)) return;
	var _loc6_ = 0;
	var _loc1_ = 0;
	while(_loc1_ < 4)
	{
		if ((!outOfRange(x + cardinal[_loc1_][0],y + cardinal[_loc1_][1])) && thisLevel[y + cardinal[_loc1_][1]][x + cardinal[_loc1_][0]] != s)
		{
			_loc6_ += Math.pow(2,3 - _loc1_);
		}
		_loc1_ = _loc1_ + 1;
	}
	// if (_loc6_ > 0) ctx.drawImage(svgTileBorders[_loc6_-1], x*30, y*30);
	if (_loc6_ > 0) tileBorders[y][x].push(_loc6_);
	// tileBorders[_loc2_][_loc1_]
	// tile.ambientShadow.gotoAndStop(_loc6_ + 1);
	_loc1_ = 0;
	while(_loc1_ < 4)
	{
		if((!outOfRange(x + diagonal[_loc1_][0],y + diagonal[_loc1_][1])) &&  thisLevel[y][x + diagonal[_loc1_][0]] == s && thisLevel[y + diagonal[_loc1_][1]][x] == s && thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]] != s)
		{
			tileBorders[y][x].push(16+_loc1_);
			// ctx.drawImage(svgTileBorders[15+_loc1_], x*30, y*30);
			// tile.ambientShadow2["a" + _loc1_].gotoAndStop(2);
		}
		else
		{
			// tile.ambientShadow2["a" + _loc1_].gotoAndStop(1);
		}
		_loc1_ = _loc1_ + 1;
	}
}
function opposite(i, xOrY)
{
	if(xOrY == 0)
	{
		return 3.5 - Math.abs(i - 1.5);
	}
	if(xOrY == 1)
	{
		return Math.floor(i / 2);
	}
}















function drawCharacters() {
	if(playMode == 0 && currentLevel >= 1) {
		for (var _loc1_ = 0; _loc1_ < startLocations[currentLevel - transitionType].length; _loc1_++) {
			// levelChar["char" + _loc1_].removeMovieClip();
		}
	} else {
		for (var _loc1_ = 0; _loc1_ < startLocations[currentLevel].length; _loc1_++) {
			// levelChar["char" + _loc1_].removeMovieClip();
		}
	}
	for (var _loc2_ = 0; _loc2_ < charCount; _loc2_++) {
		var _loc1_ = charDepths[_loc2_];
		// levelChar.attachMovie("char","char" + _loc1_,charDepth - _loc1_ * 2,{_x:char[_loc1_].x,_y:char[_loc1_].y});
		if (char[_loc1_].deathTimer > 0) {
			if (char[_loc1_].id > 34 && typeof svgChars[char[_loc1_].id] !== 'undefined') {
				// ctx.drawImage(svgChars[char[_loc1_].id], char[_loc1_].x-char[_loc1_].w, char[_loc1_].y-char[_loc1_].h);
				// var vb = svgChars[char[_loc1_].id].viewBox;
				// console.log(vb);
				ctx.drawImage(svgChars[char[_loc1_].id], char[_loc1_].x+svgCharsVB[char[_loc1_].id][0], char[_loc1_].y+svgCharsVB[char[_loc1_].id][1]);
				// ctx.strokeStyle = '#ff0000';
				// ctx.lineWidth = 1;
				// ctx.strokeRect(char[_loc1_].x-char[_loc1_].w, char[_loc1_].y-char[_loc1_].h, char[_loc1_].w*2, char[_loc1_].h);
			} else if (char[_loc1_].id <= 34 && typeof svgChars[char[_loc1_].id] !== 'undefined') {
				var model = charModels[char[_loc1_].id];

				// draw legs
				// TODO: remove hard-coded numbers
				var f = [ legFrames[char[_loc1_].leg1frame], legFrames[char[_loc1_].leg2frame] ];
				for (var i = 0; i < f.length; i++) {
					if (Object.prototype.toString.call(f[i]) === '[object Array]') {
							f[i] = f[i][Math.max(char[_loc1_].legAnimationFrame[i], 0)%f[i].length];
					}
				}
				var legdire = (3-char[_loc1_].dire)>0?-1:1;
				ctx.save();
				ctx.transform(
					legdire*0.3648529052734375,
					0,
					char[_loc1_].leg1skew,
					0.3814697265625,
					char[_loc1_].x+model.legx[0]+0.35,
					char[_loc1_].y+model.legy[0]-0.65
				);
				//wcFrames
				var leg1img = svgBodyParts[f[0]];
				ctx.drawImage(leg1img, -leg1img.width/2, -leg1img.height/2);
				ctx.restore();
				ctx.save();
				ctx.transform(
					legdire*0.3648529052734375,
					0,
					char[_loc1_].leg2skew,
					0.3814697265625,
					char[_loc1_].x+model.legx[1]+0.35,
					char[_loc1_].y+model.legy[1]-0.65
				);
				var leg2img = svgBodyParts[f[1]];
				ctx.drawImage(leg2img, -leg2img.width/2, -leg2img.height/2);
				ctx.restore();

				var modelFrame = model.frames[char[_loc1_].frame];
				var xoff = model.torsoX;
				var yoff = model.torsoY;
				// ctx.translate(charModels[char[_loc1_].id].torsoX,charModels[char[_loc1_].id].torsoY);
				for (var i = 0; i < modelFrame.length; i++) {
					var img = svgChars[char[_loc1_].id];
					if (modelFrame[i].bodypart > 0) img = svgBodyParts[modelFrame[i].bodypart-1];
					ctx.save();
					ctx.transform(
						modelFrame[i].mat.a,
						modelFrame[i].mat.b,
						modelFrame[i].mat.c,
						modelFrame[i].mat.d,
						char[_loc1_].x+modelFrame[i].mat.tx+xoff,
						char[_loc1_].y+modelFrame[i].mat.ty+yoff
					);
					ctx.drawImage(img, -img.width/2, -img.height/2);
					ctx.restore();
				}
				// Hitboxes
				// ctx.strokeStyle = HSVtoRGB((char[_loc1_].id*1.618033988749894)%1, 0.7, 0.8);
				// ctx.strokeRect(char[_loc1_].x-char[_loc1_].w, char[_loc1_].y-char[_loc1_].h, char[_loc1_].w*2, char[_loc1_].h);

			} else {
				// ctx.fillStyle = '#00ffff';
				ctx.fillStyle = HSVtoRGB((char[_loc1_].id*1.618033988749894)%1, 0.7, 0.8);
				ctx.fillRect(char[_loc1_].x-char[_loc1_].w, char[_loc1_].y-char[_loc1_].h, char[_loc1_].w*2, char[_loc1_].h);
			}
		}
		// levelChar["char" + _loc1_].gotoAndStop(char[_loc1_].id + 1);
		// levelChar["char" + _loc1_].leg1.gotoAndStop(1);
		// levelChar["char" + _loc1_].leg2.gotoAndStop(1);
		if (char[_loc1_].charState <= 1) {
			// levelChar["char" + _loc1_]._visible = false;
		}
		if (charD[char[_loc1_].id][5]) {
			// levelChar["char" + _loc1_].cacheAsBitmap = true;
		}
		if (char[_loc1_].charState == 9) {
			// char[_loc1_].dire = 2;
			// levelChar["char" + _loc1_].charBody.gotoAndStop(2);
			// levelChar["char" + _loc1_].charBody.mouth.gotoAndStop(3);
			// levelChar["char" + _loc1_].charBody.mouth.mouth.gotoAndStop(57);
		}
		if(_loc1_ == HPRC2) {
			ctx.fillStyle = '#00ff00';
			ctx.textAlign = 'center';
			ctx.font = '6px Helvetica';
			ctx.fillText(HPRCText, char[_loc1_].x+12.65, char[_loc1_].y-41.3);
			// -29.5, -23.7
			var radius = svgHPRCCrank.height/2;
			ctx.save();
			ctx.translate(char[_loc1_].x-29.5-radius, char[_loc1_].y-23.7+radius);
			ctx.rotate(HPRCCrankRot);
			ctx.drawImage(svgHPRCCrank, -radius, -radius);
			ctx.restore();
			// TODO: make this not so hard coded.
			if (HPRCBubbleFrame == 1) {
				ctx.drawImage(svgHPRCBubble[0], char[_loc1_].x-svgHPRCBubble[0].width/2, char[_loc1_].y-128+bounceY(9, 30));
			} else if (HPRCBubbleFrame == 2) {
				ctx.drawImage(svgHPRCBubble[1], char[_loc1_].x-svgHPRCBubble[1].width/2, char[_loc1_].y-150);
			} else if (HPRCBubbleFrame == 3) {
				ctx.drawImage(svgHPRCBubble[2], char[_loc1_].x-svgHPRCBubble[2].width/2, char[_loc1_].y-150);
			}
			// HPRCBubble.attachMovie("charImage","charImage",0,{_x:char[_loc1_].x,_y:char[_loc1_].y,_xscale:143,_yscale:143});
		}

		if(char[_loc1_].temp >= 50) {
			ctx.save();
			var fireImg = svgFire[_frameCount%svgFire.length];
			if (char[_loc1_].id == 2) fireImg = svgIceCubeMelt;
			else ctx.globalAlpha = 0.57;
			var firemat = charModels[char[_loc1_].id].firemat;
			ctx.transform(firemat.a,firemat.b,firemat.c,firemat.d,firemat.tx+char[_loc1_].x,firemat.ty+char[_loc1_].y);
			ctx.drawImage(fireImg, -fireImg.width/2, -fireImg.height/2);
			ctx.restore();
		}
	}
}


// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}



// function setBody(i)
// {
// 	char[i].leg1skew = 0;
// 	char[i].leg2skew = 0;
// 	var _loc2_ = undefined;
// 	var _loc3_ = [0,0];
// 	if(ifCarried(i) && cornerHangTimer == 0)
// 	{
// 		var _loc5_ = 1;
// 		while(_loc5_ <= 2)
// 		{
// 			// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(Math.floor(char[i].dire / 2 + 0.5));
// 			// levelChar["char" + i]["leg" + _loc5_].leg.gotoAndStop(51);
// 			_loc5_ = _loc5_ + 1;
// 		}
// 		// offSetLegs(i,60);
// 	}
// 	else if(char[i].dire % 2 == 0 && char[i].onob)
// 	// else if(char[i].onob)
// 	{
// 		if(char[i].standingOn >= 0)
// 		{
// 			var _loc4_ = char[i].standingOn;
// 			_loc5_ = 1;
// 			while(_loc5_ <= 2)
// 			{
// 				// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(char[i].dire / 2);
// 				// _loc2_ = char[i].x + levelChar["char" + i]["leg" + _loc5_]._x;
// 				_loc2_ = char[i].x + charModels[char[i].id].legx[_loc5_-1];
// 				if(_loc2_ >= char[_loc4_].x + char[_loc4_].w)
// 				{
// 					_loc3_[_loc5_ - 1] = char[_loc4_].x + char[_loc4_].w - _loc2_;
// 				}
// 				else if(_loc2_ <= char[_loc4_].x - char[_loc4_].w)
// 				{
// 					_loc3_[_loc5_ - 1] = char[_loc4_].x - char[_loc4_].w - _loc2_;
// 				}
// 				_loc5_ = _loc5_ + 1;
// 			}
// 		}
// 		else if(char[i].fricGoal == 0)
// 		{
// 			_loc5_ = 1;
// 			while(_loc5_ <= 2)
// 			{
// 				// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(char[i].dire / 2);
// 				// _loc2_ = char[i].x + levelChar["char" + i]["leg" + _loc5_]._x;
// 				_loc2_ = char[i].x + charModels[char[i].id].legx[_loc5_-1];
// 				if(!safeToStandAt(_loc2_,char[i].y + 1))
// 				{
// 					var _loc7_ = safeToStandAt(_loc2_ - 30,char[i].y + 1);
// 					var _loc6_ = safeToStandAt(_loc2_ + 30,char[i].y + 1);
// 					if(_loc7_ && (!_loc6_ || _loc2_ % 30 - (_loc5_ - 1.5) * 10 < 30 - _loc2_ % 30) && !horizontalProp(i,-1,1,char[i].x - 15,char[i].y))
// 					{
// 						_loc3_[_loc5_ - 1] = (- _loc2_) % 30;
// 					}
// 					else if(_loc6_ && !horizontalProp(i,1,1,char[i].x + 15,char[i].y))
// 					{
// 						_loc3_[_loc5_ - 1] = 30 - _loc2_ % 30;
// 					}
// 				}
// 				else
// 				{
// 					_loc3_[_loc5_ - 1] = 0;
// 				}
// 				_loc5_ = _loc5_ + 1;
// 			}
// 		}
// 		if(_loc3_[1] - _loc3_[0] >= 41)
// 		{
// 			_loc3_[0] = _loc3_[1];
// 			_loc3_[1] -= 3;
// 		}
// 		if(_loc3_[0] > _loc3_[1] && _loc3_[1] >= 0)
// 		{
// 			char[i].leg1frame = 0;
// 			char[i].leg2frame = 0;
// 			char[i].leg1skew = _loc3_[0]/60;
// 			char[i].leg2skew = _loc3_[0]/60;
// 			// levelChar["char" + i].leg1.leg.gotoAndStop(toFrame(_loc3_[0] * _loc8_));
// 			// levelChar["char" + i].leg2.leg.gotoAndStop(toFrame(_loc3_[0] * _loc8_));
// 		}
// 		else if(_loc3_[0] > _loc3_[1] && _loc3_[0] <= 0)
// 		{
// 			char[i].leg1frame = 0;
// 			char[i].leg2frame = 0;
// 			char[i].leg1skew = _loc3_[1]/60;
// 			char[i].leg2skew = _loc3_[1]/60;
// 			// levelChar["char" + i].leg1.leg.gotoAndStop(toFrame(_loc3_[1] * _loc8_));
// 			// levelChar["char" + i].leg2.leg.gotoAndStop(toFrame(_loc3_[1] * _loc8_));
// 		}
// 		else if(_loc3_[0] < 0 && _loc3_[1] > 0)
// 		{
// 			char[i].leg1frame = 0;
// 			char[i].leg2frame = 0;
// 			char[i].leg1skew = _loc3_[0]/60;
// 			char[i].leg2skew = _loc3_[1]/60;
// 			// levelChar["char" + i].leg1.leg.gotoAndStop(toFrame(_loc3_[0] * _loc8_));
// 			// levelChar["char" + i].leg2.leg.gotoAndStop(toFrame(_loc3_[1] * _loc8_));
// 		}
// 		else if(_loc3_[1] > 0 && _loc3_[0] == 0)
// 		{
// 			char[i].leg1frame = 0;
// 			char[i].leg2frame = 0;
// 			char[i].leg1skew = -0.5 * (3-char[i].dire);
// 			char[i].leg2skew = -0.5 * (3-char[i].dire);
// 			// levelChar["char" + i].leg1.leg.gotoAndStop(25 + 23 * (3 - char[i].dire));
// 			// levelChar["char" + i].leg2.leg.gotoAndStop(25 + 23 * (3 - char[i].dire));
// 		}
// 		else if(_loc3_[0] < 0 && _loc3_[1] == 0)
// 		{
// 			char[i].leg1frame = 0;
// 			char[i].leg2frame = 0;
// 			char[i].leg1skew = 0.5 * (3-char[i].dire);
// 			char[i].leg2skew = 0.5 * (3-char[i].dire);
// 			// levelChar["char" + i].leg1.leg.gotoAndStop(25 - 23 * (3 - char[i].dire));
// 			// levelChar["char" + i].leg2.leg.gotoAndStop(25 - 23 * (3 - char[i].dire));
// 		}
// 		else
// 		{
// 			char[i].leg1frame = 0;
// 			char[i].leg2frame = 0;
// 			char[i].leg1skew = 0;
// 			char[i].leg2skew = 0;
// 			// levelChar["char" + i].leg1.leg.gotoAndStop(1);
// 			// levelChar["char" + i].leg2.leg.gotoAndStop(1);
// 		}
// 	}
// 	else
// 	{
// 		_loc5_ = 1;
// 		while(_loc5_ <= 2)
// 		{
// 			// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(Math.floor(char[i].dire / 2 + 0.5));
// 			if(char[i].submerged >= 1 && !char[i].onob)
// 			{
// 				// levelChar["char" + i]["leg" + _loc5_].leg.gotoAndStop(52);
// 			}
// 			else
// 			{
// 				char[i].leg1frame = 1;
// 				char[i].leg2frame = 1;
// 				// levelChar["char" + i]["leg" + _loc5_].leg.gotoAndStop(50 - char[i].onob);
// 			}
// 			_loc5_ = _loc5_ + 1;
// 		}
// 		if(char[i].dire % 2 == 1 && char[i].onob)
// 		{
// 			// offSetLegs(i,28);
// 		}
// 		if(char[i].submerged >= 1 && !char[i].onob)
// 		{
// 			// offSetLegs(i,20);
// 		}
// 	}


// 	if(cutScene == 1 && dialogueChar[currentLevel][cutSceneLine] == i)
// 	{
// 		char[i].leg1frame = 0;
// 		char[i].leg2frame = 0;
// 		char[i].frame = Math.ceil(char[i].dire / 2) * 2 - 1;
// 		// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) * 2);
// 	}
// 	else if(i == control && recoverTimer >= 1)
// 	{
// 		if(char[i].x - (char[HPRC2].x - 33) < 25)
// 		{
// 			char[i].frame = Math.ceil(char[i].dire / 2) + 11;
// 			// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 12);
// 		}
// 		else
// 		{
// 			char[i].frame = Math.ceil(char[i].dire / 2) + 9;
// 			// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 10);
// 		}
// 		// drawCrankingArms(i);
// 	}
// 	else if(char[i].carry)
// 	{
// 		char[i].frame = Math.ceil(char[i].dire / 2) + 5;
// 		// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 6);
// 	}
// 	else if(!char[i].onob && !ifCarried(i))
// 	{
// 		char[i].frame = Math.ceil(char[i].dire / 2) + 3;
// 		// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 4);
// 		var _loc9_ = Math.round(Math.min(4 - char[i].vy,15));
// 	}
// 	else
// 	{
// 		char[i].leg1frame = 0;
// 		char[i].leg2frame = 0;
// 		char[i].frame = char[i].dire;
// 		// levelChar["char" + i].charBody.gotoAndStop(char[i].dire);
// 	}
// }
function setBody(i)
{
	char[i].leg1skew = 0;
	char[i].leg2skew = 0;

	var _loc2_ = undefined;
	var _loc3_ = [0,0];
	if (ifCarried(i) && cornerHangTimer == 0) {
		for (var _loc5_ = 1; _loc5_ <= 2; _loc5_++) {
			// Carried legs
			// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(Math.floor(char[i].dire / 2 + 0.5));
			// levelChar["char" + i]["leg" + _loc5_].leg.gotoAndStop(51);
		}
		// offSetLegs(i,60);
	} else if(char[i].dire % 2 == 0 && char[i].onob) {
		if(char[i].standingOn >= 0) {
			var _loc4_ = char[i].standingOn;
			for (var _loc5_ = 1; _loc5_ <= 2; _loc5_++)
			{
				// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(char[i].dire / 2);
				_loc2_ = char[i].x + charModels[char[i].id].legx[_loc5_-1];
				// _loc2_ = char[i].x + levelChar["char" + i]["leg" + _loc5_]._x;
				if(_loc2_ >= char[_loc4_].x + char[_loc4_].w) {
					_loc3_[_loc5_ - 1] = char[_loc4_].x + char[_loc4_].w - _loc2_;
				} else if(_loc2_ <= char[_loc4_].x - char[_loc4_].w) {
					_loc3_[_loc5_ - 1] = char[_loc4_].x - char[_loc4_].w - _loc2_;
				}
			}
		}
		else if (char[i].fricGoal == 0) {
			for (var _loc5_ = 1; _loc5_ <= 2; _loc5_++)
			{
				// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(char[i].dire / 2);
				// _loc2_ = char[i].x + levelChar["char" + i]["leg" + _loc5_]._x;
				_loc2_ = char[i].x + charModels[char[i].id].legx[_loc5_-1];
				if (!safeToStandAt(_loc2_,char[i].y + 1)) {
					var _loc7_ = safeToStandAt(_loc2_ - 30,char[i].y + 1);
					var _loc6_ = safeToStandAt(_loc2_ + 30,char[i].y + 1);
					if(_loc7_ && (!_loc6_ || _loc2_ % 30 - (_loc5_ - 1.5) * 10 < 30 - _loc2_ % 30) && !horizontalProp(i,-1,1,char[i].x - 15,char[i].y)) {
						_loc3_[_loc5_ - 1] = (- _loc2_) % 30;
					} else if(_loc6_ && !horizontalProp(i,1,1,char[i].x + 15,char[i].y)) {
						_loc3_[_loc5_ - 1] = 30 - _loc2_ % 30;
					}
				} else {
					_loc3_[_loc5_ - 1] = 0;
				}
			}
		}
		if (_loc3_[1] - _loc3_[0] >= 41) {
			_loc3_[0] = _loc3_[1];
			_loc3_[1] -= 3;
		}
		var _loc8_ = 3 - char[i].dire;
		if(_loc3_[0] > _loc3_[1] && _loc3_[1] >= 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = _loc3_[0]/90;
			char[i].leg2skew = _loc3_[0]/90;
			// levelChar["char" + i].leg1.leg.gotoAndStop(toFrame(_loc3_[0] * _loc8_));
			// levelChar["char" + i].leg2.leg.gotoAndStop(toFrame(_loc3_[0] * _loc8_));
		} else if(_loc3_[0] > _loc3_[1] && _loc3_[0] <= 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = _loc3_[1]/90;
			char[i].leg2skew = _loc3_[1]/90;
			// levelChar["char" + i].leg1.leg.gotoAndStop(toFrame(_loc3_[1] * _loc8_));
			// levelChar["char" + i].leg2.leg.gotoAndStop(toFrame(_loc3_[1] * _loc8_));
		} else if(_loc3_[0] < 0 && _loc3_[1] > 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = _loc3_[0]/90;
			char[i].leg2skew = _loc3_[1]/90;
			// levelChar["char" + i].leg1.leg.gotoAndStop(toFrame(_loc3_[0] * _loc8_));
			// levelChar["char" + i].leg2.leg.gotoAndStop(toFrame(_loc3_[1] * _loc8_));
		} else if(_loc3_[1] > 0 && _loc3_[0] == 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = -0.5 * (3-char[i].dire);
			char[i].leg2skew = -0.5 * (3-char[i].dire);
			// levelChar["char" + i].leg1.leg.gotoAndStop(25 + 23 * (3 - char[i].dire));
			// levelChar["char" + i].leg2.leg.gotoAndStop(25 + 23 * (3 - char[i].dire));
		} else if(_loc3_[0] < 0 && _loc3_[1] == 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = 0.5 * (3-char[i].dire);
			char[i].leg2skew = 0.5 * (3-char[i].dire);
			// levelChar["char" + i].leg1.leg.gotoAndStop(25 - 23 * (3 - char[i].dire));
			// levelChar["char" + i].leg2.leg.gotoAndStop(25 - 23 * (3 - char[i].dire));
		} else {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			// levelChar["char" + i].leg1.leg.gotoAndStop(1);
			// levelChar["char" + i].leg2.leg.gotoAndStop(1);
		}
	} else {
		if (char[i].dire % 2 == 1 && char[i].onob) {
			// Walk
			offSetLegs(i,28, 2);
		}
		if (char[i].submerged >= 1 && !char[i].onob) {
			// Swim
			// offSetLegs(i,20);
		}
		for (var _loc5_ = 1; _loc5_ <= 2; _loc5_++) {
			// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(Math.floor(char[i].dire / 2 + 0.5));
			if (char[i].submerged >= 1 && !char[i].onob) {
				// levelChar["char" + i]["leg" + _loc5_].leg.gotoAndStop(52);
			} else {
				if (char[i].onob) {
					char[i].leg1frame = 2;
					char[i].leg2frame = 2;
				} else {
					char[i].leg1frame = 1;
					char[i].leg2frame = 1;
				}
				// levelChar["char" + i]["leg" + _loc5_].leg.gotoAndStop(50 - char[i].onob);
			}
		}
	}
	if (cutScene == 1 && dialogueChar[currentLevel][cutSceneLine] == i) {
		char[i].frame = Math.ceil(char[i].dire / 2) * 2 - 1;
		// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) * 2);
	} else if(i == control && recoverTimer >= 1) {
		if(char[i].x - (char[HPRC2].x - 33) < 25) {
			char[i].frame = Math.ceil(char[i].dire / 2) + 11;
			// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 12);
		} else {
			char[i].frame = Math.ceil(char[i].dire / 2) + 9;
			// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 10);
		}
		// drawCrankingArms(i);
	} else if(char[i].carry) {
		char[i].frame = Math.ceil(char[i].dire / 2) + 5;
		// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 6);
	} else if(!char[i].onob && !ifCarried(i)) {
			char[i].frame = Math.ceil(char[i].dire / 2) + 3;
		// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 4);
		var _loc9_ = Math.round(Math.min(4 - char[i].vy,15));
	} else {
		char[i].frame = char[i].dire - 1;
		// levelChar["char" + i].charBody.gotoAndStop(char[i].dire);
	}
}

function offSetLegs(i, duration, frame) {
	if (char[i].leg1frame != frame) {
		char[i].legAnimationFrame[0] = 0;
		char[i].legAnimationFrame[1] = -Math.floor(duration / 2);
	} else {
		char[i].legAnimationFrame[0]++;
		char[i].legAnimationFrame[1]++;
	}
	// levelChar["char" + i].leg2.leg.leg.gotoAndPlay((levelChar["char" + i].leg1.leg.leg._currentframe + (duration / 2 - 1)) % duration + 1);
}
// TODO: implement easing in this.
function bounceY(amt, time) {
	var base = (_frameCount%time)*2;
	return (base>time?time-base+time:base)*amt/time;
}










































function ifCarried(i) {
	if(char[i].carriedBy >= 0 && char[i].carriedBy <= 190) {
		return char[char[i].carriedBy].carry;
	}
	return false;
}

function landOnObject(i) {
	var _loc5_ = 10000;
	var _loc4_ = 0;
	for (var _loc1_ = 0; _loc1_ < charCount; _loc1_++) {
		if (!ifCarried(_loc1_) && (char[_loc1_].charState == 6 || char[_loc1_].charState == 4)) {
			var _loc3_ = Math.abs(char[i].x - char[_loc1_].x);
			if (_loc3_ < char[i].w + char[_loc1_].w && char[i].y >= char[_loc1_].y - char[_loc1_].h && (char[i].py < char[_loc1_].py - char[_loc1_].h || char[i].py == char[_loc1_].py - char[_loc1_].h && char[i].vy == 0))
			{
				if (_loc3_ - char[_loc1_].w < _loc5_)
				{
					_loc5_ = _loc3_ - char[_loc1_].w;
					_loc4_ = _loc1_;
				}
			}
		}
	}
	if (_loc5_ < 10000 && char[i].standingOn != _loc4_) {
		if (char[i].standingOn >= 0) {
			fallOff(i);
		}
		if (char[_loc4_].charState == 6 && !char[_loc4_].onob) {
			char[_loc4_].vy = inter(char[_loc4_].vy,char[i].vy,char[i].weight2 / (char[_loc4_].weight2 + char[i].weight2));
		}
		land(i,char[_loc4_].y - char[_loc4_].h,char[_loc4_].vy);
		if (char[_loc4_].onob) {
			land2(i,char[_loc4_].y - char[_loc4_].h);
		}
		char[i].standingOn = _loc4_;
		char[_loc4_].stoodOnBy.push(i);
		rippleWeight(i,char[i].weight2,1);
		char[i].fricGoal = char[_loc4_].fricGoal;
		if (char[_loc4_].submerged == 1 && char[_loc4_].weight2 >= 0) {
			char[_loc4_].submerged = 2;
			char[_loc4_].weight2 -= 0.16;
		}
	}
}
function calcDist(i) {
	return Math.sqrt(Math.pow(char[i].x - locations[2] * 30 + 15,2) + Math.pow(char[i].y - char[i].h / 2 - locations[3] * 30 + 15,2));
}
function checkButton(i) {
	if (char[i].onob) {
		var _loc4_ = Math.ceil(char[i].y / 30);
		if (_loc4_ >= 0 && _loc4_ <= levelHeight - 1) {
			var _loc6_ = undefined;
			for (var _loc3_ = Math.floor((char[i].x - char[i].w) / 30); _loc3_ <= Math.floor((char[i].x + char[i].w) / 30); _loc3_++) {
				if (!outOfRange(_loc3_, _loc4_)) {
					_loc6_ = blockProperties[thisLevel[_loc4_][_loc3_]][11];
					if (_loc6_ >= 13) {
						// if(levelActive2["tileX" + _loc3_ + "Y" + _loc4_].button._currentframe != 2)
						// {
							// leverSwitch(_loc6_ - 13);
						// 	levelActive2["tileX" + _loc3_ + "Y" + _loc4_].button.gotoAndStop(2);
						// }
						if (tileFrames[_loc4_][_loc3_].cf != 1) {
							leverSwitch(_loc6_ - 13);
							tileFrames[_loc4_][_loc3_].cf = 1;
							tileFrames[_loc4_][_loc3_].playing = false;
						}
						var _loc5_ = true;
						for (var _loc1_ = 0; _loc1_ < char[i].buttonsPressed.length; _loc1_++) {
							if (char[i].buttonsPressed[_loc1_][0] == _loc3_ && char[i].buttonsPressed[_loc1_][1] == _loc4_) {
								_loc5_ = false;
							}
						}
						if (_loc5_) {
							char[i].buttonsPressed.push([_loc3_,_loc4_]);
						}
						break;
					}
				}
			}
		}
	}
}
function checkButton2(i, bypass) {
	if(char[i].y < levelHeight * 30 + 30)
	{
		var _loc8_ = char[i].buttonsPressed.length;
		var _loc5_ = 0;
		while(_loc5_ < _loc8_)
		{
			var _loc4_ = char[i].buttonsPressed[_loc5_][0];
			var _loc6_ = char[i].buttonsPressed[_loc5_][1];
			if(!char[i].onob || char[i].standingOn >= 0 || char[i].x < _loc4_ * 30 - char[i].w || char[i].x >= _loc4_ * 30 + 30 + char[i].w || bypass)
			{
				var _loc7_ = true;
				var _loc3_ = 0;
				while(_loc3_ < charCount)
				{
					if(_loc3_ != i)
					{
						var _loc2_ = 0;
						while(_loc2_ < char[_loc3_].buttonsPressed.length)
						{
							if(char[_loc3_].buttonsPressed[_loc2_][0] == _loc4_ && char[_loc3_].buttonsPressed[_loc2_][1] == _loc6_)
							{
								_loc7_ = false;
							}
							_loc2_ = _loc2_ + 1;
						}
					}
					_loc3_ = _loc3_ + 1;
				}
				if(_loc7_)
				{
					leverSwitch(blockProperties[thisLevel[_loc6_][_loc4_]][11] - 13);
					tileFrames[_loc6_][_loc4_].cf = 2;
					tileFrames[_loc6_][_loc4_].playing = true;
					// levelActive2["tileX" + _loc4_ + "Y" + _loc6_].button.gotoAndPlay(3);
				}
				_loc3_ = 0;
				while(_loc3_ < _loc8_)
				{
					if(_loc3_ > _loc5_)
					{
						char[i].buttonsPressed[_loc3_][0] = char[i].buttonsPressed[_loc3_ - 1][0];
						char[i].buttonsPressed[_loc3_][1] = char[i].buttonsPressed[_loc3_ - 1][1];
					}
					_loc3_ = _loc3_ + 1;
				}
				char[i].buttonsPressed.pop();
			}
			_loc5_ = _loc5_ + 1;
		}
	}
}
function leverSwitch(j)
{
	var _loc5_ = 0;
	while(_loc5_ < switchable[j].length)
	{
		var _loc4_ = switchable[Math.min(j,5)][_loc5_][0];
		var _loc3_ = switchable[Math.min(j,5)][_loc5_][1];
		var _loc1_ = 0;
		while(_loc1_ < switches[j].length)
		{
			if(thisLevel[_loc3_][_loc4_] == switches[j][_loc1_ * 2])
			{
				thisLevel[_loc3_][_loc4_] = switches[j][_loc1_ * 2 + 1];
				// levelActive["tileX" + _loc4_ + "Y" + _loc3_].gotoAndStop(switches[j][_loc1_ * 2 + 1] % 10 + 1);
			}
			else if(thisLevel[_loc3_][_loc4_] == switches[j][_loc1_ * 2 + 1])
			{
				thisLevel[_loc3_][_loc4_] = switches[j][_loc1_ * 2];
				// levelActive["tileX" + _loc4_ + "Y" + _loc3_].gotoAndStop(switches[j][_loc1_ * 2] % 10 + 1);
			}
			_loc1_ = _loc1_ + 1;
		}
		_loc5_ = _loc5_ + 1;
	}
	var _loc6_ = 0;
	while(_loc6_ < charCount)
	{
		char[_loc6_].justChanged = 2;
		checkDeath(_loc6_);
		_loc6_ = _loc6_ + 1;
	}
}
function checkDeath(i)
{
	var _loc3_ = Math.floor((char[i].y - char[i].h) / 30);
	while(_loc3_ <= Math.floor((char[i].y - 0.01) / 30))
	{
		var _loc1_ = Math.floor((char[i].x - char[i].w) / 30);
		while(_loc1_ <= Math.floor((char[i].x + char[i].w) / 30))
		{
			if (!outOfRange(_loc1_, _loc3_)) {
				if (blockProperties[thisLevel[_loc3_][_loc1_]][4] || blockProperties[thisLevel[_loc3_][_loc1_]][5] || blockProperties[thisLevel[_loc3_][_loc1_]][6] || blockProperties[thisLevel[_loc3_][_loc1_]][7])
				{
					startDeath(i);
				}
			}
			_loc1_ = _loc1_ + 1;
		}
		_loc3_ = _loc3_ + 1;
	}
}
function getCoin(i) {
	if(!gotThisCoin && char[i].charState >= 7)
	{
		if(Math.floor((char[i].x - char[i].w) / 30) <= locations[2] && Math.ceil((char[i].x + char[i].w) / 30) - 1 >= locations[2] && Math.floor((char[i].y - char[i].h) / 30) <= locations[3] && Math.ceil(char[i].y / 30) - 1 >= locations[3])
		{
			// levelActive["tileX" + locations[2] + "Y" + locations[3]].coin.gotoAndPlay(2);
			gotThisCoin = true;
		}
	}
}
function setCamera()
{
	if(levelWidth <= 32)
	{
		cameraX = levelWidth * 15 - 480;
	}
	else if(char[control].x - cameraX < 384)
	{
		cameraX = Math.min(Math.max(cameraX + (char[control].x - 384 - cameraX),0),levelWidth * 30 - 960);
	}
	else if(char[control].x - cameraX >= 576)
	{
		cameraX = Math.min(Math.max(cameraX + (char[control].x - 576 - cameraX),0),levelWidth * 30 - 960);
	}

	if(levelHeight <= 18)
	{
		cameraY = levelHeight * 15 - 270;
	}
	else if(char[control].y - cameraY < 216)
	{
		cameraY = Math.min(Math.max(cameraY + (char[control].y - 216 - cameraY),0),levelHeight * 30 - 540);
	}
	else if(char[control].y - cameraY >= 324)
	{
		cameraY = Math.min(Math.max(cameraY + (char[control].y - 324 - cameraY),0),levelHeight * 30 - 540);
	}
}




function newTileUp(i)
{
	return Math.floor((char[i].y - char[i].h) / 30) < Math.floor((char[i].py - char[i].h) / 30);
}
function newTileDown(i)
{
	return Math.ceil(char[i].y / 30) > Math.ceil(char[i].py / 30);
}
function newTileHorizontal(i, sign)
{
	return Math.ceil(sign * (char[i].x + char[i].w * sign) / 30) > Math.ceil(sign * (char[i].px + char[i].w * sign) / 30);
}
function exitTileHorizontal(i, sign)
{
	return Math.ceil(sign * (char[i].x - char[i].w * sign) / 30) > Math.ceil(sign * (char[i].px - char[i].w * sign) / 30);
}
function exitTileVertical(i, sign)
{
	var _loc1_ = 0.5 * sign + 0.5;
	return Math.ceil(sign * (char[i].y - char[i].h * _loc1_) / 30) > Math.ceil(sign * (char[i].py - char[i].h * _loc1_) / 30);
}
function submerge(i)
{
	if(char[i].temp > 0)
	{
		char[i].temp = 0;
	}
	var _loc2_ = somewhereSubmerged(i);
	if(char[i].submerged <= 1 && _loc2_ >= 2)
	{
		char[i].weight2 -= 0.16;
		rippleWeight(i,0.16,-1);
		char[i].vx *= 0.1;
		char[i].vy *= 0.1;
	}
	char[i].submerged = _loc2_;
}
function unsubmerge(i)
{
	if(exitTileHorizontal(i,-1) || exitTileHorizontal(i,1) || exitTileVertical(i,1) || exitTileVertical(i,-1))
	{
		var _loc2_ = somewhereSubmerged(i);
		if(_loc2_ == 0 && char[i].submerged >= 1)
		{
			if(char[i].submerged == 2 && exitTileVertical(i,-1) && char[i].weight2 < 0 && !ifCarried(i))
			{
				char[i].vy = 0;
				char[i].y = Math.ceil(char[i].y / 30) * 30;
				_loc2_ = 1;
			}
			char[i].weight2 += 0.16;
			rippleWeight(i,0.16,1);
		}
		char[i].submerged = _loc2_;
	}
}
function heat(i)
{
	if(char[i].submerged == 0)
	{
		char[i].temp += char[i].heatSpeed;
	}
	char[i].justChanged = 2;
	if(char[i].temp > 50 && char[i].id != 3)
	{
		startDeath(i);
		if(char[i].id == 2)
		{
			extinguish(i);
		}
	}
	if(char[i].heated == 1)
	{
		unheat(i);
	}
}
function unheat(i)
{
	if(exitTileHorizontal(i,-1) || exitTileHorizontal(i,1) || exitTileVertical(i,1) || exitTileVertical(i,-1))
	{
		if(!somewhereHeated(i))
		{
			char[i].heated = 0;
		}
	}
}
function extinguish(i)
{
	var _loc1_ = 0;
	while(_loc1_ < charCount)
	{
		if(char[_loc1_].charState >= 5 && _loc1_ != i && char[_loc1_].temp > 0)
		{
			if(Math.abs(char[i].x - char[_loc1_].x) < char[i].w + char[_loc1_].w && char[_loc1_].y > char[i].y - char[i].h && char[_loc1_].y < char[i].y + char[_loc1_].h)
			{
				char[_loc1_].temp = 0;
			}
		}
		_loc1_ = _loc1_ + 1;
	}
}
function somewhereSubmerged(i)
{
	var _loc3_ = 0;
	var _loc5_ = Math.floor((char[i].x - char[i].w) / 30);
	while(_loc5_ <= Math.floor((char[i].x + char[i].w) / 30))
	{
		var _loc6_ = Math.floor((char[i].y - char[i].h) / 30);
		var _loc4_ = Math.floor(char[i].y / 30);
		var _loc1_ = _loc6_;
		while(_loc1_ <= _loc4_)
		{
			if (!outOfRange(_loc5_, _loc1_) && blockProperties[thisLevel[_loc1_][_loc5_]][14]) {
				if(_loc1_ == _loc4_)
				{
					if(_loc3_ == 0)
					{
						_loc3_ = 2;
					}
				}
				else
				{
					_loc3_ = 3;
				}
			}
			_loc1_ = _loc1_ + 1;
		}
		_loc5_ = _loc5_ + 1;
	}
	return _loc3_;
}
function somewhereHeated(i)
{
	var _loc3_ = Math.floor((char[i].x - char[i].w) / 30);
	while(_loc3_ <= Math.floor((char[i].x + char[i].w) / 30))
	{
		var _loc2_ = Math.floor((char[i].y - char[i].h) / 30);
		while(_loc2_ <= Math.floor(char[i].y / 30))
		{
			if(thisLevel[_loc2_][_loc3_] == 15)
			{
				return true;
			}
			_loc2_ = _loc2_ + 1;
		}
		_loc3_ = _loc3_ + 1;
	}
	return false;
}
function xOff(i)
{
	return char[char[i].carriedBy].w * (Math.ceil(char[char[i].carriedBy].dire / 2) * 2 - 3) * 0.7;
}
function xOff2(i)
{
	return char[i].w * (Math.ceil(char[i].dire / 2) * 2 - 3) * 0.7;
}
function yOff(i)
{
	if(char[i].charState == 6)
	{
		return char[char[i].carriedBy].h2;
	}
	return char[char[i].carriedBy].h2 - 13;
}

function solidAt(x, y)
{
	var _loc1_ = getBlockTypeAt(x,y);
	return (typeof _loc1_ === 'number')?(blockProperties[_loc1_][0] && blockProperties[_loc1_][1] && blockProperties[_loc1_][2] && blockProperties[_loc1_][3]):true;
}
function solidCeiling(x, y)
{
	return blockProperties[getBlockTypeAt(x,y)][0];
}
function safeToStandAt(x, y)
{
	var _loc1_ = getBlockTypeAt(x,y);
	return (typeof _loc1_ === 'number')?(blockProperties[_loc1_][1] && !blockProperties[_loc1_][5] && _loc1_ != 14 && _loc1_ != 16 && _loc1_ != 83 && _loc1_ != 85):true;
}
function getBlockTypeAt(x, y) {
	return thisLevel[Math.floor(y / 30)][Math.floor(x / 30)];
}
function verticalProp(i, sign, prop, x, y) {
	var _loc6_ = -0.5 * sign + 0.5;
	var _loc4_ = Math.floor((y - char[i].h * _loc6_) / 30);
	if (prop <= 3 && sign == -1 && _loc4_ == -1) {
		return true;
	}
	if (prop >= 4 && prop <= 7) {
		for (_loc1_ = Math.floor((x - char[i].w) / 30); _loc1_ <= Math.floor((x + char[i].w - 0.01) / 30); _loc1_++) {
			if (!outOfRange(_loc1_, _loc4_)) {
				if(blockProperties[thisLevel[_loc4_][_loc1_]][prop - 4] && !blockProperties[thisLevel[_loc4_][_loc1_]][prop]) {
					return false;
				}
			}
		}
	}
	for (_loc1_ = Math.floor((x - char[i].w) / 30); _loc1_ <= Math.floor((x + char[i].w - 0.01) / 30); _loc1_++) {
		if (!outOfRange(_loc1_, _loc4_)) {
			if (blockProperties[thisLevel[_loc4_][_loc1_]][prop]) {
				if (prop != 1 || !ifCarried(i) || allSolid(thisLevel[_loc4_][_loc1_])) {
					return true;
				}
			}
		}
	}
	return false;
}
function horizontalProp(i, sign, prop, x, y) {
	var _loc2_ = Math.floor((x + char[i].w * sign) / 30);
	if (prop <= 3 && (sign == -1 && _loc2_ <= -1 || sign == 1 && _loc2_ >= levelWidth)) {
		return true;
	}
	if (prop >= 4 && prop <= 7) {
		for (var _loc1_ = Math.floor((y - char[i].h) / 30); _loc1_ <= Math.floor((y - 0.01) / 30); _loc1_++) {
			if (!outOfRange(_loc2_, _loc1_)) {
				if(blockProperties[thisLevel[_loc1_][_loc2_]][prop - 4] && !blockProperties[thisLevel[_loc1_][_loc2_ - sign]][prop - 4] && !blockProperties[thisLevel[_loc1_][_loc2_]][prop]) {
					return false;
				}
			}
		}
	}
	for (_loc1_ = Math.floor((y - char[i].h) / 30); _loc1_ <= Math.floor((y - 0.01) / 30); _loc1_++) {
		if (!outOfRange(_loc2_, _loc1_)) {
			if (blockProperties[thisLevel[_loc1_][_loc2_]][prop]) {
				return true;
			}
		}
	}
	return false;
}
function verticalType(i, sign, prop, pist)
{
	var _loc7_ = -0.5 * sign + 0.5;
	var _loc3_ = Math.floor((char[i].y - char[i].h * _loc7_) / 30);
	var _loc4_ = false;
	var _loc1_ = Math.floor((char[i].x - char[i].w) / 30);
	while(_loc1_ <= Math.floor((char[i].x + char[i].w - 0.01) / 30))
	{
		if (!outOfRange(_loc1_, _loc3_)) {
			if(thisLevel[_loc3_][_loc1_] == prop)
			{
				if(pist)
				{
					tileFrames[_loc3_][_loc1_].playing = true;
					tileFrames[_loc3_][_loc1_].cf = 1;
					// levelActive["tileX" + _loc1_ + "Y" + _loc3_].piston.gotoAndPlay(2);
				}
				_loc4_ = true;
			}
		}
		_loc1_ = _loc1_ + 1;
	}
	return _loc4_;
}
function horizontalType(i, sign, prop)
{
	var _loc3_ = Math.floor((char[i].x + char[i].w * sign) / 30);
	var _loc1_ = Math.floor((char[i].y - char[i].h) / 30);
	while(_loc1_ <= Math.floor((char[i].y - 0.01) / 30))
	{
		if (!outOfRange(_loc3_, _loc1_)) {
			if (thisLevel[_loc1_][_loc3_] == prop) {
				return true;
			}
		}
		_loc1_ = _loc1_ + 1;
	}
	return false;
}
function land(i, y, vy)
{
	char[i].y = y;
	if(char[i].weight2 <= 0)
	{
		char[i].vy = - Math.abs(vy);
	}
	else
	{
		char[i].vy = vy;
		char[i].onob = true;
	}
}
function land2(i, y)
{
	char[control].landTimer = 0;
	stopCarrierY(i,y,false);
}
function fallOff(i)
{
	if(char[i].standingOn >= 0)
	{
		var _loc4_ = false;
		if(char[char[i].standingOn].submerged == 1)
		{
			char[char[i].standingOn].submerged = 2;
		}
		else
		{
			rippleWeight(i,char[i].weight2,-1);
		}
		var _loc3_ = char[char[i].standingOn].stoodOnBy.length;
		var _loc2_ = 0;
		while(_loc2_ < _loc3_)
		{
			if(char[char[i].standingOn].stoodOnBy[_loc2_] == i)
			{
				_loc4_ = true;
			}
			if(_loc4_ && _loc2_ <= _loc3_ - 2)
			{
				char[char[i].standingOn].stoodOnBy[_loc2_] = char[char[i].standingOn].stoodOnBy[_loc2_ + 1];
			}
			_loc2_ = _loc2_ + 1;
		}
		char[char[i].standingOn].stoodOnBy.pop();
		char[i].standingOn = -1;
		char[i].onob = false;
		_loc2_ = 0;
		while(_loc2_ < char[i].stoodOnBy.length)
		{
			fallOff(char[i].stoodOnBy[_loc2_]);
			_loc2_ = _loc2_ + 1;
		}
	}
}
function aboveFallOff(i)
{
	if(char[i].stoodOnBy.length >= 1)
	{
		var _loc1_ = 0;
		while(_loc1_ < char[i].stoodOnBy.length)
		{
			fallOff(char[i].stoodOnBy[_loc1_]);
			_loc1_ = _loc1_ + 1;
		}
	}
}
function centered(i, len)
{
	if(i % 2 == 0)
	{
		return (len - i - 2 + len % 2) / 2;
	}
	return (i + len - 1 + len % 2) / 2;
}
function onlyConveyorsUnder(i)
{
	var _loc8_ = Math.floor(char[i].y / 30 + 0.5);
	var _loc4_ = Math.floor((char[i].x - char[i].w) / 30);
	var _loc6_ = Math.floor((char[i].x + char[i].w - 0.01) / 30);
	var _loc3_ = 0;
	var _loc2_ = 0;
	while(_loc2_ <= _loc6_ - _loc4_)
	{
		var _loc5_ = centered(_loc2_,1 + _loc6_ - _loc4_) + _loc4_;
		if (!outOfRange(_loc5_, _loc8_)) {
			var _loc1_ = thisLevel[_loc8_][_loc5_];
			if(blockProperties[_loc1_][1])
			{
				if(_loc1_ == 14 || _loc1_ == 83)
				{
					if(_loc3_ == 0)
					{
						_loc3_ = -2.48;
					}
				}
				else if(_loc1_ == 16 || _loc1_ == 85)
				{
					if(_loc3_ == 0)
					{
						_loc3_ = 2.48;
					}
				}
				else if(_loc2_ == 0 || char[i].charState == 10)
				{
					return 0;
				}
			}
			_loc2_ = _loc2_ + 1;
		}
	}
	return _loc3_;
}
function stopCarrierX(i, x)
{
	if(ifCarried(i))
	{
		char[char[i].carriedBy].x = x - xOff(i);
		char[char[i].carriedBy].vx = 0;
	}
}
function stopCarrierY(i, y, canCornerHang)
{
	if(ifCarried(i) && (!char[char[i].carriedBy].onob || char[char[i].carriedBy].standingOn >= 0 && char[char[char[i].carriedBy].standingOn].vy != 0))
	{
		if(char[char[i].carriedBy].standingOn >= 0)
		{
			char[char[char[i].carriedBy].standingOn].vy = 0;
			fallOff(char[i].carriedBy);
		}
		if(char[char[i].carriedBy].vy >= 0 && canCornerHang && !solidAt(char[char[i].carriedBy].x,char[i].y + 15))
		{
			var _loc3_ = solidAt(char[char[i].carriedBy].x - char[char[i].carriedBy].w - 15,char[i].y + 15) || solidAt(char[char[i].carriedBy].x - char[char[i].carriedBy].w - 45,char[i].y + 15);
			var _loc2_ = solidAt(char[char[i].carriedBy].x + char[char[i].carriedBy].w + 15,char[i].y + 15) || solidAt(char[char[i].carriedBy].x + char[char[i].carriedBy].w + 45,char[i].y + 15);
			char[i].justChanged = 2;
			char[char[i].carriedBy].justChanged = 2;
			if(_loc3_ && _loc2_)
			{
				putDown(char[i].carriedBy);
			}
			else if(_loc3_)
			{
				char[char[i].carriedBy].vx += power;
			}
			else if(_loc2_)
			{
				char[char[i].carriedBy].vx -= power;
			}
			cornerHangTimer++;
			if(cornerHangTimer > 30)
			{
				putDown(char[i].carriedBy);
			}
		}
		if (char[i].carriedBy != -1) {
			char[char[i].carriedBy].vy = 0;
			char[char[i].carriedBy].y = y + yOff(i);
			if(newTileDown(char[i].carriedBy) && verticalProp(char[i].carriedBy,1,1,char[char[i].carriedBy].x,char[char[i].carriedBy].y))
			{
				char[char[i].carriedBy].y = Math.floor(char[char[i].carriedBy].y / 30) * 30;
			}
		}
	}
}
function startCutScene()
{
	if(cutScene == 0)
	{
		if(toSeeCS)
		{
			cutScene = 1;
			cutSceneLine = 0;
			displayLine(currentLevel,cutSceneLine);
			char[control].dire = Math.ceil(char[control].dire / 2) * 2;
		}
		else
		{
			rescue();
			var _loc2_ = 0;
			while(_loc2_ < dialogueChar[currentLevel].length)
			{
				var _loc1_ = dialogueChar[currentLevel][_loc2_];
				if(_loc1_ >= 50 && _loc1_ < 60)
				{
					leverSwitch(_loc1_ - 50);
				}
				_loc2_ = _loc2_ + 1;
			}
			cutScene = 3;
		}
	}
}
function endCutScene()
{
	toSeeCS = false;
	cutScene = 2;
	rescue();
	// csBubble.gotoAndPlay(17);
}
function rescue()
{
	var _loc1_ = 0;
	while(_loc1_ < charCount)
	{
		if(char[_loc1_].charState == 9)
		{
			char[_loc1_].charState = 10;
			// levelChar["char" + _loc1_].charBody.mouth.gotoAndStop(1);
		}
		_loc1_ = _loc1_ + 1;
	}
}
function displayLine(level, line)
{
	var _loc2_ = dialogueChar[level][line];
	if(_loc2_ >= 50 && _loc2_ < 60)
	{
		leverSwitch(_loc2_ - 50);
		cutSceneLine++;
		line = line + 1;
		_loc2_ = dialogueChar[level][line];
	}
	var _loc5_ = undefined;
	if(_loc2_ == 99)
	{
		_loc5_ = 480;
	}
	else
	{
		_loc5_ = Math.min(Math.max(char[_loc2_].x,bubWidth / 2 + bubMargin),960 - bubWidth / 2 - bubMargin);
		// putDown(_loc2_);
	}
	// _root.csBubble.gotoAndPlay(2);
	// _root.csBubble._x = _loc5_;
	if(char[control].y - cameraY > 270)
	{
		// _root.csBubble._y = bubMargin + bubHeight / 2;
	}
	else
	{
		// _root.csBubble._y = 520 - bubMargin - bubHeight / 2;
	}
	if(_loc2_ == 99)
	{
		// _root.csBubble.csBubble2.gotoAndStop(2);
	}
	else
	{
		// _root.csBubble.csBubble2.gotoAndStop(1);
		// _root.csBubble.csBubble2.box.charBody.gotoAndStop(char[_loc2_].id + 1);
		// _root.levelChar["char" + _loc2_].charBody.gotoAndStop(Math.ceil(char[_loc2_].dire / 2) * 2);
		// _root.levelChar["char" + _loc2_].charBody.mouth.gotoAndStop(1);
		// _root.levelChar["char" + _loc2_].charBody.mouth.gotoAndStop(dialogueFace[level][line]);
	}
	// _root.csBubble.csBubble2.textie.text = dialogueText[level][line];
	csText = dialogueText[level][line];
}
function drawCutScene() {
	var bubLoc = {x:(cwidth-bubWidth)/2,y:bubMargin};
	ctx.drawImage(svgCSBubble, bubLoc.x, bubLoc.y)
	var textwidth = 386.55;
	var textx = 106.7;
	var currdiachar = dialogueChar[currentLevel][Math.min(cutSceneLine, dialogueChar[currentLevel].length-1)]
	if (currdiachar==99) {
		textwidth = 488.25;
		textx = 4.25;
	} else {
		ctx.fillStyle = '#ce6fce';
		ctx.fillRect(bubLoc.x+10, bubLoc.y+10, 80, 80);
		ctx.save();
		var charimg = svgChars[char[currdiachar].id];
		var charimgmat = charModels[char[currdiachar].id].charimgmat;
		ctx.transform(charimgmat.a*2.6,charimgmat.b,charimgmat.c,charimgmat.d*2.6,charimgmat.tx+bubLoc.x+50,charimgmat.ty+bubLoc.y+50);
		ctx.drawImage(charimg, -charimg.width/2, -charimg.height/2);
		ctx.restore();
	}
	ctx.fillStyle = '#000000';
	ctx.textAlign = 'left'
	ctx.font = '21px Helvetica';
	wrapText(csText, bubLoc.x+textx, bubLoc.y+4.25, textwidth, 25);
}
function startDeath(i)
{
	// console.log('starting death...');
	if(char[i].deathTimer >= 30 && (char[i].charState >= 7 || char[i].temp >= 50))
	{
		if(ifCarried(i))
		{
			char[char[i].carriedBy].vy = 0;
			char[char[i].carriedBy].vx = 0;
			putDown(char[i].carriedBy);
		}
		char[i].pcharState = char[i].charState;
		checkButton2(i,true);
		fallOff(i);
		char[i].deathTimer = 20;
		char[i].leg1frame = 1;
		char[i].leg2frame = 1;
		char[i].frame = 7 + Math.ceil(char[i].dire / 2);
		// levelChar["char" + i].leg1.leg.gotoAndStop(50);
		// levelChar["char" + i].leg2.leg.gotoAndStop(50);
		// levelChar["char" + i].charBody.gotoAndStop(8 + Math.ceil(char[i].dire / 2));
		clearTint(i);
		// if(char[i].temp >= 50)
		// {
			//svgFire
			// levelChar["char" + i].fire.gotoAndStop(2);
		// }
	}
}
function blinkDeath(i)
{
	if(char[i].deathTimer % 6 <= 2)
	{
		// levelChar["char" + i]._alpha = 30;
	}
	else
	{
		// levelChar["char" + i]._alpha = 100;
	}
}
function endDeath(i) {
	// console.log('ending death...');
	putDown(i);
	char[i].temp = 0;
	// levelChar["char" + i]._visible = false;
	// levelChar["char" + i].fire.gotoAndStop(1);
	char[i].charState = 1;
	deathCount++;
	// saveGame();
	if(i == control)
	{
		changeControl();
	}
}
function clearTint(i)
{
	// myColor = new Color(levelChar["char" + i]);
	// myColorTransform = new Object();
	// myColorTransform = {rb:0,ra:100,ba:100,ga:100};
	// myColor.setTransform(myColorTransform);
}
function bounce(i)
{
	if(ifCarried(i))
	{
		bounce(char[i].carriedBy);
	}
	if(char[i].dire % 2 == 0)
	{
		char[i].fricGoal = 0;
	}
	char[i].jump((- jumpPower) * 1.66);
	char[i].onob = false;
	char[i].y = Math.floor(char[i].y / 30) * 30 - 10;
}
function bumpHead(i)
{
	if(char[i].standingOn >= 0)
	{
		char[i].onob = false;
		char[char[i].standingOn].vy = 0;
		fallOff(i);
	}
}
function rippleWeight(i, w, sign)
{
	if(char[i].standingOn >= 0)
	{
		char[char[i].standingOn].weight2 += w * sign;
		if(char[char[i].standingOn].submerged == 1 && char[char[i].standingOn].weight2 < 0)
		{
			char[char[i].standingOn].submerged = 2;
		}
		if(char[char[i].standingOn].submerged >= 2 && char[char[i].standingOn].weight2 < 0 && char[char[i].standingOn].onob)
		{
			char[char[i].standingOn].onob = false;
		}
		rippleWeight(char[i].standingOn,w,sign);
	}
}
function onlyMovesOneBlock(i, j)
{
	var _loc1_ = Math.floor((char[j].dire - 1) / 2) * 2 - 1;
	var _loc3_ = Math.ceil(_loc1_ * (char[i].x + char[i].w * _loc1_) / 30);
	var _loc2_ = Math.ceil(_loc1_ * (char[control].x + xOff2(control) + char[i].w * _loc1_) / 30);
	return Math.abs(_loc2_ - _loc3_) <= 1;
}
function putDown(i)
{
	if(char[i].carry)
	{
		rippleWeight(i,char[char[i].carryObject].weight2,-1);
		char[i].weight2 = char[i].weight;
		char[char[i].carryObject].weight2 = char[char[i].carryObject].weight;
		char[i].carry = false;
		char[i].justChanged = 2;
		swapDepths(char[i].carryObject, charDepths[0], false);
		// levelChar["char" + char[i].carryObject].swapDepths(charDepth - char[i].carryObject * 2);
		char[char[i].carryObject].carriedBy = -1;
		char[char[i].carryObject].stopMoving();
	}
	cornerHangTimer = 0;
}
function swapDepths(i, j, conditional) {
	var idep = charDepths.indexOf(i);
	var jdep = charDepths.indexOf(j);
	if ((conditional && idep<jdep) || !conditional) {
		charDepths[idep] = j;
		charDepths[jdep] = i;
	}
}
function charThrow(i)
{
	char[i].weight2 = char[i].weight;
	char[char[i].carryObject].weight2 = char[char[i].carryObject].weight;
	char[char[i].carryObject].vy = -7.5;
	char[char[i].carryObject].vx = char[i].vx;
	if(char[i].dire <= 2)
	{
		char[char[i].carryObject].vx -= 3;
	}
	else
	{
		char[char[i].carryObject].vx += 3;
	}
}
function fallOff(i)
{
	if(char[i].standingOn >= 0)
	{
		var _loc4_ = false;
		if(char[char[i].standingOn].submerged == 1)
		{
			char[char[i].standingOn].submerged = 2;
		}
		else
		{
			rippleWeight(i,char[i].weight2,-1);
		}
		var _loc3_ = char[char[i].standingOn].stoodOnBy.length;
		var _loc2_ = 0;
		while(_loc2_ < _loc3_)
		{
			if(char[char[i].standingOn].stoodOnBy[_loc2_] == i)
			{
				_loc4_ = true;
			}
			if(_loc4_ && _loc2_ <= _loc3_ - 2)
			{
				char[char[i].standingOn].stoodOnBy[_loc2_] = char[char[i].standingOn].stoodOnBy[_loc2_ + 1];
			}
			_loc2_ = _loc2_ + 1;
		}
		char[char[i].standingOn].stoodOnBy.pop();
		char[i].standingOn = -1;
		char[i].onob = false;
		_loc2_ = 0;
		while(_loc2_ < char[i].stoodOnBy.length)
		{
			fallOff(char[i].stoodOnBy[_loc2_]);
			_loc2_ = _loc2_ + 1;
		}
	}
}
function aboveFallOff(i)
{
	if(char[i].stoodOnBy.length >= 1)
	{
		var _loc1_ = 0;
		while(_loc1_ < char[i].stoodOnBy.length)
		{
			fallOff(char[i].stoodOnBy[_loc1_]);
			_loc1_ = _loc1_ + 1;
		}
	}
}
function objectsLandOn(i)
{
	var _loc1_ = 0;
	while(_loc1_ < charCount)
	{
		if(char[_loc1_].charState >= 5 && char[_loc1_].standingOn != i)
		{
			var _loc3_ = Math.abs(char[i].x - char[_loc1_].x);
			if(_loc3_ < char[i].w + char[_loc1_].w && char[i].y - char[i].h <= char[_loc1_].y && char[i].py - char[i].h > char[_loc1_].py && (char[i].submerged <= 1 || !char[_loc1_].onob || char[_loc1_].submerged == 2))
			{
				if(char[_loc1_].standingOn >= 0)
				{
					fallOff(_loc1_);
				}
				char[_loc1_].standingOn = i;
				char[i].stoodOnBy.push(_loc1_);
				land(_loc1_,char[i].y - char[i].h,char[_loc1_].vy);
				if(char[i].charState == 6)
				{
					char[i].vy = inter(char[i].vy,char[_loc1_].vy,char[_loc1_].weight2 / (char[i].weight2 + char[_loc1_].weight2));
				}
				char[_loc1_].vy = char[i].vy;
				rippleWeight(_loc1_,char[_loc1_].weight2,1);
				char[_loc1_].fricGoal = char[i].fricGoal;
			}
		}
		_loc1_ = _loc1_ + 1;
	}
}
function near(c1, c2)
{
	var _loc3_ = char[c2].y - 23 - (char[c1].y - char[c1].h2 / 2);
	return Math.abs(_loc3_) <= char[c2].h / 2 + char[c1].h2 / 2 && Math.abs(char[c1].x + xOff2(c1) - char[c2].x) < 50;
}
function near2(c1, c2)
{
	var _loc2_ = char[c2].y - 23 - (char[c1].y - char[c1].h2 / 2);
	return Math.abs(_loc2_) <= 20 && Math.abs(char[c1].x + xOff2(c1) - char[c2].x) < 50;
}
function inter(a, b, x)
{
	return a + (b - a) * x;
}
function allSolid(i)
{
	return blockProperties[i][0] && blockProperties[i][1] && blockProperties[i][2] && blockProperties[i][3];
}
function changeControl()
{
	if(char[control].charState >= 7)
	{
		char[control].stopMoving();
		swapDepths(control, charDepths[0], false);
		// levelChar["char" + control].swapDepths(charDepth - control * 2);
		if(char[control].carry)
		{
			swapDepths(char[control].carryObject , control, false);
			// levelChar["char" + char[control].carry].swapDepths(charDepth - control * 2 + 1);
		}
	}
	control = (control + 1) % charCount;
	var _loc1_ = 0;
	while(char[control].charState != 10 && _loc1_ < 10)
	{
		control = (control + 1) % charCount;
		_loc1_ = _loc1_ + 1;
	}
	if(_loc1_ == 10)
	{
		control = 10000;
	}
	if(control < 1000)
	{
		if(ifCarried(control))
		{
			putDown(char[control].carriedBy);
		}
		swapDepths(control, charDepths[charCount-1], false);
		// levelChar["char" + control].swapDepths(charDepth + charCount * 2 - control * 2);
		// levelChar["char" + control].burst.gotoAndPlay(2);
	}
}
function exitLevel()
{
	// _root.csBubble.removeMovieClip();
	// removeTileMovieClips();
	// _root.levelChar.removeMovieClip();
	// _root.bg.removeMovieClip();
	// _root.levelButtons.removeMovieClip();
	menuScreen = 2;
	cameraX = 0;
	cameraY = 0;
}

function nextDeadPerson(i, dire)
{
	i2 = (i + dire + charCount) % charCount;
	while(char[i2].charState != 1)
	{
		i2 = (i2 + dire + charCount) % charCount;
	}
	return i2;
}
function numberOfDead()
{
	var _loc2_ = 0;
	var _loc1_ = 0;
	while(_loc1_ < charCount)
	{
		if(char[_loc1_].charState == 1)
		{
			_loc2_ = _loc2_ + 1;
		}
		_loc1_ = _loc1_ + 1;
	}
	return _loc2_;
}
function recoverCycle(i, dire)
{
	var _loc1_ = 0;
	var _loc2_ = dire;
	if(dire == 0)
	{
		_loc2_ = 1;
	}
	recover2 = (recover2 + _loc2_ + charCount) % charCount;
	while((char[recover2].charState != 1 || char[recover2].pcharState <= 6) && _loc1_ < 10)
	{
		recover2 = (recover2 + _loc2_ + charCount) % charCount;
		_loc1_ = _loc1_ + 1;
	}
	if(_loc1_ == 10)
	{
		HPRCBubbleFrame = 4;
		// HPRCBubble.charImage.gotoAndPlay(5);
		recover = false;
		recover2 = 0;
	}
	else if(numberOfDead() == 1)
	{
		HPRCBubbleFrame = 2;
		// HPRCBubble.charImage.gotoAndStop(3);
		// HPRCBubble.charImage.anim.charBody.gotoAndStop(char[recover2].id + 1);
	}
	else
	{
		HPRCBubbleFrame = 3;
		// HPRCBubble.charImage.gotoAndStop(4);
		if(dire == 0)
		{
			// HPRCBubble.charImage.anim.gotoAndStop(1);
		}
		else
		{
			// HPRCBubble.charImage.anim.gotoAndPlay(dire * 8 + 10);
		}
		// HPRCBubble.charImage.anim.charBody.gotoAndStop(char[recover2].id + 1);
		// HPRCBubble.charImage.anim.charBody1.gotoAndStop(char[nextDeadPerson(recover2,-1)].id + 1);
		// HPRCBubble.charImage.anim.charBody2.gotoAndStop(char[nextDeadPerson(recover2,1)].id + 1);
	}
}
function outOfRange(x, y) {
	return x < 0 || y < 0 || x > levelWidth-1 || y > levelHeight-1;
}
function toggleSound() {
	if (!musicSound.paused) {
		musicSound.pause();
	} else {
		musicSound.play();
	}
}












































































// TODO: optimize
function mousemove(event){
	_xmouse = event.pageX - canvas.getBoundingClientRect().left;
	_ymouse = event.pageY - canvas.getBoundingClientRect().top;
}

function mousedown(event){
	// musicSound.play();
	mouseIsDown = true;
}

function mouseup(event){
	mouseIsDown = false;
}

function keydown(event){
	_keysDown[event.keyCode || event.charCode] = true;
}

function keyup(event){
	_keysDown[event.keyCode || event.charCode] = false;
}

// mouseIsDown

function setup() {
	canvas = document.getElementById('cnv');
	ctx = canvas.getContext('2d');
	canvas.style.width = cwidth + "px";
	canvas.style.height = cheight + "px";

	// Account for Pixel Density
	canvas.width = Math.floor(cwidth * pixelRatio);
	canvas.height = Math.floor(cheight * pixelRatio);
	ctx.scale(pixelRatio, pixelRatio);

	window.addEventListener('mousemove', mousemove);
	window.addEventListener('mousedown', mousedown);
	window.addEventListener('mouseup', mouseup);
	window.addEventListener('keydown', keydown);
	window.addEventListener('keyup', keyup);

	setInterval(draw, 17);  // TODO: find out how to use fps over milis
}

function playGame() {
	menuScreen = 0;
	musicSound.play();
	musicSound.loop = true;
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.translate(Math.floor(cameraX+shakeX), Math.floor(cameraY+shakeY));
	if (menuScreen == -1) {
		// ctx.fillStyle = '#ffee00';
		// ctx.fillRect(0, 0, cwidth, cheight);
		ctx.drawImage(preMenuBG, 0, 0, cwidth, cheight);
		drawMenu0Button('Start Game', (cwidth-menu0ButtonSize.w)/2, (cheight-menu0ButtonSize.h)/2, 0, false, playGame);
	}
	if (menuScreen == 0) {
		drawMenu();
	}
	if (menuScreen == 2) {
		drawLevelMap();
		if (_xmouse < 587 || _ymouse < 469) {
			if (_ymouse <= 180) {
				cameraY = Math.min(Math.max(cameraY + (180 - _ymouse) * 0.1,-1080),0);
			} else if (_ymouse >= 360) {
				cameraY = Math.min(Math.max(cameraY - (_ymouse - 360) * 0.1,-1080),0);
			}
		}
		cameraX = 0;
	}
	if (menuScreen == 3) {
		// imgBgs[bgs[currentLevel]];
		// ctx.fillStyle = '#999966';
		// ctx.fillRect(0, 0, levelWidth*30, levelHeight*30);
		var bgScale = Math.max(bgXScale, bgYScale);
		ctx.drawImage(imgBgs[bgs[currentLevel]], -Math.floor((cameraX+shakeX)/1.5), -Math.floor((cameraY+shakeY)/1.5), (bgScale/100)*cwidth, (bgScale/100)*cheight);

		drawLevel();
		drawCharacters();

		if (wipeTimer == 30) {
			if (transitionType == 0) resetLevel();
			else if (charsAtEnd >= charCount2) {
				if (gotThisCoin && !gotCoin[currentLevel]) {
					gotCoin[currentLevel] = true;
					coins++;
				}
				timer += getTimer() - levelTimer2;
				if (playMode == 0) {
					currentLevel++;
					levelProgress = currentLevel;
					resetLevel();
				} else {
					menuScreen = 2;
					cameraX = 0;
				}
				// saveGame();
			}
		}
		if (cutScene == 1 || cutScene == 2) {
			if (_keysDown[13] || _keysDown[16]) {
				if (!csPress && cutScene == 1) {
					cutSceneLine++;
					if (cutSceneLine >= dialogueChar[currentLevel].length) endCutScene();
					else displayLine(currentLevel,cutSceneLine);
				}
				csPress = true;
			} else {
				csPress = false;
				if (cutScene == 2) cutScene = 3;
			}
		} else {
			if (control < 10000) {
				// if (levelChar["char" + control].burst._currentframe == 2) {
				// 	levelChar["char" + control].burst.play();
				// }
				// if (recover) {
				// 	char[control].justChanged = 2;
				// 	if (recoverTimer == 0) {
				// 		if (_keysDown[37]) {
				// 			if (!leftPress) recoverCycle(HPRC2,-1);
				// 			leftPress = true;
				// 		} else leftPress = false;
				// 		if (_keysDown[39]) {
				// 			if (!rightPress) recoverCycle(HPRC2,1);
				// 			rightPress = true;
				// 		} else rightPress = false;
				// 	}
				// } else {
					if (cornerHangTimer == 0) {
						if (_keysDown[37]) {
							char[control].moveHorizontal(- power);
						} else if (_keysDown[39]) {
							char[control].moveHorizontal(power);
						}
					}
					if (!_keysDown[37] && !_keysDown[39]) char[control].stopMoving();
				// }
				if (_keysDown[38]) {
					if (!upPress) {
						if (recover && recoverTimer == 0) {
							recoverTimer = 60;
							char[recover2].charState = 2;
							char[recover2].x = char[HPRC1].x;
							char[recover2].y = char[HPRC1].y - 20;
							char[recover2].vx = 0;
							char[recover2].vy = -1;
							// levelChar["char" + recover2]._x = char[recover2].x;
							// levelChar["char" + recover2]._y = char[recover2].y;
							char[recover2].frame = 3;
							// levelChar["char" + recover2].charBody.gotoAndStop(4);
							// levelChar["char" + recover2]._visible = true;
							if (char[recover2].id == 5) {
								// levelChar["char" + recover2].leg1._visible = true;
								// levelChar["char" + recover2].leg2._visible = true;
							}
							// levelChar["char" + recover2].leg1.gotoAndStop(2);
							// levelChar["char" + recover2].leg2.gotoAndStop(2);
							// levelChar["char" + recover2]._alpha = 100;
							HPRCBubbleFrame = 0;
				// 			HPRCBubble.charImage.gotoAndStop(1);
							goal = Math.round(char[HPRC1].x / 30) * 30;
						} else if (char[control].id != 2 && !recover && char[control].deathTimer >= 30) {
							if (char[control].carry) {
								putDown(control);
								charThrow(control);
							} else {
								for (var _loc2_ = 0; _loc2_ < charCount; _loc2_++) {
									if (_loc2_ != control && near(control,_loc2_) && char[_loc2_].charState >= 6 && char[control].standingOn != _loc2_ && onlyMovesOneBlock(_loc2_,control)) {
										if (char[_loc2_].carry) putDown(_loc2_);
										if (ifCarried(_loc2_)) putDown(char[_loc2_].carriedBy);
										char[control].carry = true;
										char[control].carryObject = _loc2_;
										swapDepths(_loc2_, control, true);
										// levelChar["char" + _loc2_].swapDepths(charDepth + charCount * 2 - control * 2 + 1);
										char[_loc2_].carriedBy = control;
										char[_loc2_].weight2 = char[_loc2_].weight;
										char[control].weight2 = char[_loc2_].weight + char[control].weight;
										rippleWeight(control,char[_loc2_].weight2,1);
										fallOff(_loc2_);
										aboveFallOff(_loc2_);
										char[_loc2_].justChanged = 2;
										char[control].justChanged = 2;
										if (char[_loc2_].submerged == 1) char[_loc2_].submerged = 0;
										if (char[_loc2_].onob && char[control].y - char[_loc2_].y > yOff(_loc2_)) {
											char[control].y = char[_loc2_].y + yOff(_loc2_);
											char[control].onob = false;
											char[_loc2_].onob = true;
										}
										break;
									}
								}
							}
						}
					}
					upPress = true;
				} else upPress = false;
				if (_keysDown[40]) {
					if (!downPress) {
						if (char[control].carry) putDown(control);
						else if (recover) {
							if (recoverTimer == 0) {
								recover = false;
								HPRCBubbleFrame = 0;
				// 				HPRCBubble.charImage.gotoAndStop(1);
							}
						} else if (HPRC2 < 10000 && near2(control,HPRC2) && char[control].id != 2 && char[control].onob) {
							char[control].stopMoving();
							if (char[control].x >= char[HPRC2].x - 33) char[control].dire = 2;
							else char[control].dire = 4;
							recover = true;
							recover2 = charCount - 1;
							recoverCycle(HPRC2,0);
						}
					}
					downPress = true;
				} else downPress = false;
				if (_keysDown[90]) {
					if (!qPress && !recover) {
						changeControl();
						qTimer = 6;
					}
					qPress = true;
				} else qPress = false;
				if (_keysDown[32]) {
					if ((char[control].onob || char[control].submerged == 3) && char[control].landTimer > 2 && !recover) {
						if (char[control].submerged == 3) char[control].swimUp(0.14 / char[control].weight2);
						else char[control].jump(- jumpPower);
						char[control].onob = false;
						fallOff(control);
					}
				} else char[control].landTimer = 80;
			}
		}
		if (_keysDown[82] && wipeTimer == 0) {
			wipeTimer = 1;
			transitionType = 0;
			// if (cutScene == 1) csBubble.gotoAndPlay(17);
		}


		locations[4] = 1000;
		for (var _loc2_ = 0; _loc2_ < charCount; _loc2_++) {
			if (char[_loc2_].charState >= 5) {
				char[_loc2_].landTimer = char[_loc2_].landTimer + 1;
				if (char[_loc2_].carry && char[char[_loc2_].carryObject].justChanged < char[_loc2_].justChanged) {
					char[char[_loc2_].carryObject].justChanged = char[_loc2_].justChanged;
				}
				if (char[_loc2_].standingOn == -1) {
					if (char[_loc2_].onob) {
						if (char[_loc2_].charState >= 5) {
							char[_loc2_].fricGoal = onlyConveyorsUnder(_loc2_);
						}
					}
				} else char[_loc2_].fricGoal = char[char[_loc2_].standingOn].vx;

				char[_loc2_].applyForces(char[_loc2_].weight2,control == _loc2_,jumpPower * 0.7);
				if (char[_loc2_].deathTimer >= 30) char[_loc2_].charMove();
				if (char[_loc2_].id == 3) {
					if (char[_loc2_].temp > 50) {
						// levelChar["char" + _loc2_].fire.gotoAndStop(2);
						for (var _loc4_ = 0; _loc4_ < charCount; _loc4_++) {
							if (char[_loc4_].charState >= 5 && _loc4_ != _loc2_) {
								if (Math.abs(char[_loc2_].x - char[_loc4_].x) < char[_loc2_].w + char[_loc4_].w && char[_loc4_].y > char[_loc2_].y - char[_loc2_].h && char[_loc4_].y < char[_loc2_].y + char[_loc4_].h) {
									char[_loc4_].heated = 2;
									heat(_loc4_);
								}
							}
						}
					}
					// else levelChar["char" + _loc2_].fire.gotoAndStop(1);
				}
			} else if (char[_loc2_].charState >= 3) {
				var _loc8_ = Math.floor(levelTimer / char[_loc2_].speed) % (startLocations[currentLevel][_loc2_][6].length - 2);
				char[_loc2_].vx = cardinal[startLocations[currentLevel][_loc2_][6][_loc8_ + 2]][0] * (30 / char[_loc2_].speed);
				char[_loc2_].vy = cardinal[startLocations[currentLevel][_loc2_][6][_loc8_ + 2]][1] * (30 / char[_loc2_].speed);
				char[_loc2_].px = char[_loc2_].x;
				char[_loc2_].py = char[_loc2_].y;
				char[_loc2_].charMove();
			} if (char[_loc2_].charState == 3 || char[_loc2_].charState == 5) {
				for (var _loc4_ = 0; _loc4_ < charCount; _loc4_++) {
					if (char[_loc4_].charState >= 7 && _loc4_ != _loc2_) {
						if (Math.abs(char[_loc2_].x - char[_loc4_].x) < char[_loc2_].w + char[_loc4_].w && char[_loc4_].y > char[_loc2_].y - char[_loc2_].h && char[_loc4_].y < char[_loc2_].y + char[_loc4_].h) {
							startDeath(_loc4_);
						}
					}
				}
			}
			if (char[_loc2_].justChanged >= 1) {
				if (char[_loc2_].standingOn >= 1) {
					if (char[char[_loc2_].standingOn].charState == 4) {
						char[_loc2_].justChanged = 2;
					}
				}
				if (char[_loc2_].stoodOnBy.length >= 1) {
					for (var _loc4_ = 0; _loc4_ < char[_loc2_].stoodOnBy.length; _loc4_++) {
						char[char[_loc2_].stoodOnBy[_loc4_]].y = char[_loc2_].y - char[_loc2_].h;
						char[char[_loc2_].stoodOnBy[_loc4_]].vy = char[_loc2_].vy;
					}
				} else if (!char[_loc2_].carry && char[_loc2_].submerged >= 2) {
					char[_loc2_].weight2 = char[_loc2_].weight - 0.16;
				}
				if (char[_loc2_].charState >= 5 && !ifCarried(_loc2_)) {
					if (char[_loc2_].vy > 0 || char[_loc2_].vy == 0 && char[_loc2_].vx != 0) {
						landOnObject(_loc2_);
					}
					if (char[_loc2_].vy < 0 && (char[_loc2_].charState == 4 || char[_loc2_].charState == 6) && !ifCarried(_loc2_)) {
						objectsLandOn(_loc2_);
					}
				}
			}

			if (char[_loc2_].charState >= 7 && char[_loc2_].charState != 9 && !gotThisCoin) {
				var _loc7_ = calcDist(_loc2_);
				if (_loc7_ < locations[4]) {
					locations[4] = _loc7_;
					locations[5] = _loc2_;
				}
			}
		}
		var _loc11_ = undefined;
		if (!gotThisCoin) _loc11_ = 140 - locations[4] * 0.7;
		if (gotCoin[currentLevel]) _loc11_ = Math.max(_loc11_,30);
		// levelActive["tileX" + locations[2] + "Y" + locations[3]]._alpha = _loc11_;
		for (var _loc2_ = 0; _loc2_ < charCount; _loc2_++) {
			if (char[_loc2_].vy != 0 || char[_loc2_].vx != 0 || char[_loc2_].x != char[_loc2_].px || char[_loc2_].py != char[_loc2_].y) char[_loc2_].justChanged = 2;
			if (char[_loc2_].charState == 2) {
				recoverTimer--;
				var _loc5_ = (60 - recoverTimer) / 60;
				// levelChar["char" + _loc2_]._yscale = _loc5_ * 100;
				// levelChar["char" + _loc2_]._x = inter(char[HPRC1].x,goal,_loc5_);
				if (recoverTimer <= 0) {
					recoverTimer = 0;
					recover = false;
					char[recover2].dire = 4;
					char[recover2].charState = char[recover2].pcharState;
					char[recover2].deathTimer = 30;
					char[recover2].x = goal;
					char[recover2].px = char[recover2].x;
					char[recover2].py = char[recover2].y;
					char[recover2].justChanged = 2;
					checkDeath(_loc2_);
				}
			} else if (char[_loc2_].justChanged >= 1 && char[_loc2_].charState >= 5) {
				for (var _loc3_ = Math.floor((char[_loc2_].y - char[_loc2_].h) / 30); _loc3_ <= Math.floor(char[_loc2_].y / 30); _loc3_++) {
					for (var _loc9_ = Math.floor((char[_loc2_].x - char[_loc2_].w) / 30); _loc9_ <= Math.floor((char[_loc2_].x + char[_loc2_].w - 0.01) / 30); _loc9_++) {
						if (!outOfRange(_loc9_, _loc3_)) {
							if (blockProperties[thisLevel[_loc3_][_loc9_]][11] >= 1 && blockProperties[thisLevel[_loc3_][_loc9_]][11] <= 12) {
								if (Math.floor(char[_loc2_].x / 30) == _loc9_) {
									var _loc1_ = (char[_loc2_].x - Math.floor(char[_loc2_].x / 30) * 30 - 15) * 5;
									// if (_loc1_ < levelActive2["tileX" + _loc9_ + "Y" + _loc3_].lever._rotation && char[_loc2_].vx < 0 || _loc1_ > levelActive2["tileX" + _loc9_ + "Y" + _loc3_].lever._rotation && char[_loc2_].vx > 0) {
									// 	if (_loc1_ < 0 && levelActive2["tileX" + _loc9_ + "Y" + _loc3_].lever._rotation > 0 || _loc1_ > 0 && levelActive2["tileX" + _loc9_ + "Y" + _loc3_].lever._rotation < 0) {
									// 		leverSwitch((blockProperties[thisLevel[_loc3_][_loc9_]][11] - 1) % 6);
									// 	}
									// 	levelActive2["tileX" + _loc9_ + "Y" + _loc3_].lever._rotation = _loc1_;
									// }
									if (_loc1_ < tileFrames[_loc3_][_loc9_].rotation && char[_loc2_].vx < 0 || _loc1_ > tileFrames[_loc3_][_loc9_].rotation && char[_loc2_].vx > 0) {
										if (_loc1_ < 0 && tileFrames[_loc3_][_loc9_].rotation > 0 || _loc1_ > 0 && tileFrames[_loc3_][_loc9_].rotation < 0) {
											leverSwitch((blockProperties[thisLevel[_loc3_][_loc9_]][11] - 1) % 6);
										}
										tileFrames[_loc3_][_loc9_].rotation = _loc1_;
									}
								}
							}
						}
					}
				}
				checkButton2(_loc2_,false);
				if (ifCarried(_loc2_)) {
					char[_loc2_].vx = char[char[_loc2_].carriedBy].vx;
					char[_loc2_].vy = char[char[_loc2_].carriedBy].vy;

					if (char[char[_loc2_].carriedBy].x + xOff(_loc2_) >= char[_loc2_].x + 20) {
						char[_loc2_].x += 20;
					} else if (char[char[_loc2_].carriedBy].x + xOff(_loc2_) <= char[_loc2_].x - 20) {
						char[_loc2_].x -= 20;
					} else {
						char[_loc2_].x = char[char[_loc2_].carriedBy].x + xOff(_loc2_);
					}

					if (char[char[_loc2_].carriedBy].y - yOff(_loc2_) >= char[_loc2_].y + 20) {
						char[_loc2_].y += 20;
					} else if (char[char[_loc2_].carriedBy].y - yOff(_loc2_) <= char[_loc2_].y - 20) {
						char[_loc2_].y -= 20;
					} else {
						char[_loc2_].y = char[char[_loc2_].carriedBy].y - yOff(_loc2_);
					}
					char[_loc2_].dire = Math.ceil(char[char[_loc2_].carriedBy].dire / 2) * 2;
				}
				if (char[_loc2_].standingOn >= 0) {
					char[_loc2_].y = char[char[_loc2_].standingOn].y - char[char[_loc2_].standingOn].h;
					char[_loc2_].vy = char[char[_loc2_].standingOn].vy;
				}
				stopX = 0;
				stopY = 0;
				toBounce = false;
				if (newTileHorizontal(_loc2_,1)) {
					if (horizontalType(_loc2_,1,8) && char[_loc2_].charState == 10) {
						startCutScene();
					}
					if (horizontalProp(_loc2_,1,7,char[_loc2_].x,char[_loc2_].y) && char[_loc2_].charState >= 7) {
						startDeath(_loc2_);
					} else if (char[_loc2_].x > char[_loc2_].px && horizontalProp(_loc2_,1,3,char[_loc2_].x,char[_loc2_].y)) {
						stopX = 1;
					}
				}
				if (newTileHorizontal(_loc2_,-1)) {
					if (horizontalType(_loc2_,-1,8) && char[_loc2_].charState == 10) {
						startCutScene();
					}
					if (horizontalProp(_loc2_,-1,6,char[_loc2_].x,char[_loc2_].y) && char[_loc2_].charState >= 7) {
						startDeath(_loc2_);
					} else if (char[_loc2_].x < char[_loc2_].px && horizontalProp(_loc2_,-1,2,char[_loc2_].x,char[_loc2_].y)) {
						stopX = -1;
					}
				}
				if (newTileDown(_loc2_)) {
					if (verticalType(_loc2_,1,8,false) && char[_loc2_].charState == 10) {
						startCutScene();
					}
					if (verticalType(_loc2_,1,13,true)) {
						toBounce = true;
					} else if (verticalProp(_loc2_,1,5,char[_loc2_].px,char[_loc2_].y) && char[_loc2_].charState >= 7) {
						startDeath(_loc2_);
					} else if (char[_loc2_].y > char[_loc2_].py && verticalProp(_loc2_,1,1,char[_loc2_].px,char[_loc2_].y)) {
						stopY = 1;
					}
				}
				if (newTileUp(_loc2_)) {
					if (verticalType(_loc2_,-1,8,false) && char[_loc2_].charState == 10) {
						startCutScene();
					}
					if (verticalProp(_loc2_,-1,4,char[_loc2_].x,char[_loc2_].y) && char[_loc2_].charState >= 7) {
						startDeath(_loc2_);
					} else if (char[_loc2_].y < char[_loc2_].py && verticalProp(_loc2_,-1,0,char[_loc2_].px,char[_loc2_].y)) {
						stopY = -1;
					}
				}
				if (stopX != 0 && stopY != 0) {
					if (stopY == 1) {
						_loc3_ = Math.floor(char[_loc2_].y / 30) * 30;
					}
					if (stopY == -1) {
						_loc3_ = Math.ceil((char[_loc2_].y - char[_loc2_].h) / 30) * 30 + char[_loc2_].h;
					}
					if (!horizontalProp(_loc2_,stopX,stopX / 2 + 2.5,char[_loc2_].x,_loc3_)) {
						stopX = 0;
					} else {
						if (stopX == 1) {
							_loc9_ = Math.floor((char[_loc2_].x + char[_loc2_].w) / 30) * 30 - char[_loc2_].w;
						}
						if (stopX == -1) {
							_loc9_ = Math.ceil((char[_loc2_].x - char[_loc2_].w) / 30) * 30 + char[_loc2_].w;
						}
						if (!verticalProp(_loc2_,stopY,stopY / 2 + 0.5,_loc9_,char[_loc2_].y)) {
							stopY = 0;
						}
					}
				}
				if (stopX != 0) {
					char[_loc2_].fricGoal = 0;
					if (char[_loc2_].submerged >= 2) {
						_loc4_ = _loc2_;
						if (ifCarried(_loc2_)) {
							_loc4_ = char[_loc2_].carriedBy;
						}
						if (char[_loc4_].dire % 2 == 1) {
							char[_loc4_].swimUp(0.14 / char[_loc4_].weight2);
							if (char[_loc4_].standingOn >= 0) {
								fallOff(_loc2_);
							}
							char[_loc4_].onob = false;
						}
					}
					if (char[_loc2_].id == 5) {
						startDeath(_loc2_);
					}
					if (stopX == 1) {
						_loc9_ = Math.floor((char[_loc2_].x + char[_loc2_].w) / 30) * 30 - char[_loc2_].w;
					} else if (stopX == -1) {
						_loc9_ = Math.ceil((char[_loc2_].x - char[_loc2_].w) / 30) * 30 + char[_loc2_].w;
					}
					char[_loc2_].x = _loc9_;
					char[_loc2_].vx = 0;
					stopCarrierX(_loc2_,_loc9_);
				}
				if (stopY != 0) {
					if (stopY == 1) {
						_loc3_ = Math.floor(char[_loc2_].y / 30) * 30;
						if (!ifCarried(_loc2_)) cornerHangTimer = 0;
						fallOff(_loc2_);
						land(_loc2_,_loc3_,0);
						land2(_loc2_,_loc3_);
						checkButton(_loc2_);
					} else if (stopY == -1) {
						if (char[_loc2_].id == 5) {
							startDeath(_loc2_);
						}
						if (char[_loc2_].id == 3 && char[_loc2_].temp > 50) {
							char[_loc2_].temp = 0;
						}
						_loc3_ = Math.ceil((char[_loc2_].y - char[_loc2_].h) / 30) * 30 + char[_loc2_].h;
						char[_loc2_].y = _loc3_;
						char[_loc2_].vy = 0;
						bumpHead(_loc2_);
						if (ifCarried(_loc2_)) {
							bumpHead(char[_loc2_].carriedBy);
						}
					}
					stopCarrierY(_loc2_,_loc3_,stopY == 1);
				}
				if (newTileHorizontal(_loc2_,1) || newTileHorizontal(_loc2_,-1)) {
					if (verticalType(_loc2_,1,13,true)) {
						toBounce = true;
					}
					if (horizontalProp(_loc2_,1,14,char[_loc2_].x,char[_loc2_].y) || horizontalProp(_loc2_,-1,14,char[_loc2_].x,char[_loc2_].y)) {
						submerge(_loc2_);
					}
					if (horizontalType(_loc2_,1,15) || horizontalType(_loc2_,-1,15)) {
						char[_loc2_].heated = 1;
					}
					checkButton(_loc2_);
				}
				if (newTileUp(_loc2_)) {
					if (verticalProp(_loc2_,-1,14,char[_loc2_].x,char[_loc2_].y)) {
						submerge(_loc2_);
					}
					if (verticalType(_loc2_,-1,15,false)) {
						char[_loc2_].heated = 1;
					}
				}
				if (newTileDown(_loc2_)) {
					if (verticalProp(_loc2_,1,14,char[_loc2_].x,char[_loc2_].y)) {
						submerge(_loc2_);
					}
					if (verticalType(_loc2_,1,15,false)) {
						char[_loc2_].heated = 1;
					}
				}
				if (char[_loc2_].submerged >= 2 && char[_loc2_].standingOn >= 0 && char[_loc2_].weight2 < 0) {
					fallOff(_loc2_);
				}
				if (char[_loc2_].submerged >= 2) {
					unsubmerge(_loc2_);
				}
				if (char[_loc2_].heated >= 1) {
					heat(_loc2_);
				} else if (char[_loc2_].id != 3 || char[_loc2_].temp <= 50) {
					if (char[_loc2_].temp >= 0) {
						char[_loc2_].temp -= char[_loc2_].heatSpeed;
						char[_loc2_].justChanged = 2;
					} else char[_loc2_].temp = 0;
				}
				if (char[_loc2_].heated == 2) {
					char[_loc2_].heated = 0;
				}
				if (char[_loc2_].standingOn >= 0) {
					_loc4_ = char[_loc2_].standingOn;
					if (Math.abs(char[_loc2_].x - char[_loc4_].x) >= char[_loc2_].w + char[_loc4_].w || ifCarried(_loc4_)) {
						fallOff(_loc2_);
					}
				} else if (char[_loc2_].onob) {
					if (!ifCarried(_loc2_) && char[_loc2_].standingOn == -1) {
						char[_loc2_].y = Math.round(char[_loc2_].y / 30) * 30;
					} if(!verticalProp(_loc2_,1,1,char[_loc2_].x,char[_loc2_].y)) {
						char[_loc2_].onob = false;
						aboveFallOff(_loc2_);
						if (ifCarried(_loc2_)) {
							cornerHangTimer = 0;
						}
					}
					if (char[_loc2_].charState >= 7 && verticalProp(_loc2_,1,5,char[_loc2_].x,char[_loc2_].y)) {
						startDeath(_loc2_);
					}
				}
			}
			if (char[_loc2_].charState >= 5) {
				char[_loc2_].px = char[_loc2_].x;
				char[_loc2_].py = char[_loc2_].y;
				if (char[_loc2_].justChanged >= 1 && char[_loc2_].charState >= 5) {
					if (toBounce) {
						bounce(_loc2_);
					}
					getCoin(_loc2_);
				}
				if (char[_loc2_].deathTimer < 30) {
					if (char[_loc2_].id == 5 && char[_loc2_].deathTimer >= 7) {
						char[_loc2_].deathTimer = 6;
						// levelChar["char" + _loc2_].leg1._visible = false;
						// levelChar["char" + _loc2_].leg2._visible = false;
					}
					char[_loc2_].deathTimer--;
					blinkDeath(_loc2_);
					if (char[_loc2_].deathTimer <= 0) {
						endDeath(_loc2_);
					}
				} else if (char[_loc2_].charState >= 7 && (char[_loc2_].justChanged >= 1 || levelTimer == 0)) {
					setBody(_loc2_);
				}
				if (_loc2_ == HPRC2) {
					if (!recover) {
						HPRCText = '';
					// 	levelChar["char" + _loc2_].charBody.textie.text = "";
					} else if (recoverTimer == 0) {
						HPRCText = 'enter name';
					// 	levelChar["char" + _loc2_].charBody.textie.text = "enter name";
					} else if (recoverTimer > 40) {
						HPRCText = names[char[recover2].id];
					// 	levelChar["char" + _loc2_].charBody.textie.text = names[char[recover2].id];
					} else if (recoverTimer > 10) {
						HPRCText = 'Keep going';
					// 	levelChar["char" + _loc2_].charBody.textie.text = "Keep going";
					} else {
						HPRCText = 'Done';
					// 	levelChar["char" + _loc2_].charBody.textie.text = "Done";
					}
					HPRCCrankRot = (recoverTimer * 12) * (Math.PI/180);
					// levelChar["char" + _loc2_].charBody.crank._rotation = recoverTimer * 12;
					if (!recover && HPRCBubbleFrame <= 2) {
						if (control < 10000 && near(control,_loc2_) && numberOfDead() >= 1 && char[control].id != 2) {
							HPRCBubbleFrame = 1;
					// 		HPRCBubble.charImage.gotoAndStop(2);
						} else {
							HPRCBubbleFrame = 0;
					// 		HPRCBubble.charImage.gotoAndStop(1);
						}
					}
				}
				// if (char[_loc2_].y > levelHeight * 30 + 160 && char[_loc2_].charState >= 7 && char[_loc2_].deathTimer == 30) {
				if (char[_loc2_].y > levelHeight * 30 + 160 && char[_loc2_].charState >= 7) {
					startDeath(_loc2_);
				}
				if (char[_loc2_].charState == 10 && char[_loc2_].justChanged >= 1) {
					if (Math.abs(char[_loc2_].x - locations[0] * 30) <= 30 && Math.abs(char[_loc2_].y - (locations[1] * 30 + 10)) <= 50) {
						if (!char[_loc2_].atEnd) {
							charsAtEnd++;
							// levelActive["tileX" + locations[0] + "Y" + locations[1]].light["light" + charsAtEnd].gotoAndPlay(2);
							if (charsAtEnd >= charCount2) {
								wipeTimer = 1;
								if (playMode == 0) {
									transitionType = 1;
								} else {
									transitionType = 2;
								}
							}
						}
						char[_loc2_].atEnd = true;
					} else {
						if (char[_loc2_].atEnd) {
							// levelActive["tileX" + locations[0] + "Y" + locations[1]].light["light" + charsAtEnd].gotoAndPlay(16);
							charsAtEnd--;
						}
						char[_loc2_].atEnd = false;
					}
				}
				if (_loc2_ == control) setCamera();
			}
			if (char[_loc2_].charState >= 3) {
				if (qTimer > 0 || char[_loc2_].justChanged >= 1) {
					var _loc6_ = 0;
					if (_loc2_ == control && qTimer > 0) {
						_loc6_ = 9 - Math.pow(qTimer - 4,2);
					}
					// levelChar["char" + _loc2_]._x = char[_loc2_].x;
					// levelChar["char" + _loc2_]._y = char[_loc2_].y - _loc6_;
					if (_loc2_ == HPRC2) {
						// HPRCBubble.charImage._x = char[_loc2_].x;
						// HPRCBubble.charImage._y = char[_loc2_].y - 78;
					}
					// if (char[_loc2_].deathTimer >= 30) setTint(_loc2_);
				}
				char[_loc2_].justChanged--;
			}
		}
		qTimer--;
		_loc9_ = - cameraX;
		_loc3_ = - cameraY;
		if (wipeTimer < 60) {
			_loc9_ += (Math.random() - 0.5) * (30 - Math.abs(wipeTimer - 30));
			_loc3_ += (Math.random() - 0.5) * (30 - Math.abs(wipeTimer - 30));
		}
		if (control < 10000) {
			if (char[control].temp > 0 && char[control].temp <= 50) {
				_loc9_ += (Math.random() - 0.5) * char[control].temp * 0.2;
				_loc3_ += (Math.random() - 0.5) * char[control].temp * 0.2;
			}
		}
		shakeX = _loc9_ - cameraX;
		shakeY = _loc3_ - cameraY;
		// setMovieClipCoordinates(_loc9_,_loc3_);
		levelTimer++;
	}
	// if (menuScreen == 5) {
	// 	_loc9_ = Math.floor((_xmouse - (330 - scale * levelWidth / 2)) / scale);
	// 	_loc3_ = Math.floor((_ymouse - (240 - scale * levelHeight / 2)) / scale);
	// 	if (mouseIsDown) {
	// 		if (selectedTab == 3) {
	// 			if (tool <= 1 && mouseOnGrid()) {
	// 				if (tool == 1) {
	// 					_loc2_ = 0;
	// 				} else {
	// 					_loc2_ = selectedTile;
	// 				}
	// 				if (_loc2_ >= 0 && _loc2_ < tileCount) {
	// 					myLevel[1][_loc3_][_loc9_] = _loc2_;
	// 					levelCreator.tiles["tileX" + _loc9_ + "Y" + _loc3_].gotoAndStop(_loc2_ + 1);
	// 					if (_loc2_ == 6 && (_loc9_ != LCEndGateX || _loc3_ != LCEndGateY)) {
	// 						myLevel[1][LCEndGateY][LCEndGateX] = 0;
	// 						levelCreator.tiles["tileX" + LCEndGateX + "Y" + LCEndGateY].gotoAndStop(1);
	// 						LCEndGateX = _loc9_;
	// 						LCEndGateY = _loc3_;
	// 						setEndGateLights();
	// 					}
	// 				}
	// 			}
	// 		}
	// 		if ((tool == 2 || tool == 5) && LCRect[0] != -1) {
	// 			if (_loc9_ != LCRect[2] || _loc3_ != LCRect[3]) {
	// 				LCRect[2] = Math.min(Math.max(_loc9_,0),levelWidth - 1);
	// 				LCRect[3] = Math.min(Math.max(_loc3_,0),levelHeight - 1);
	// 				drawLCRect(Math.min(LCRect[0],LCRect[2]),Math.min(LCRect[1],LCRect[3]),Math.max(LCRect[0],LCRect[2]),Math.max(LCRect[1],LCRect[3]));
	// 			}
	// 		}
	// 	}
	// 	if (mouseOnGrid()) {
	// 		if (tool == 6) {
	// 			levelCreator.rectSelect.clear();
	// 			var _loc13_ = undefined;
	// 			var _loc12_ = undefined;
	// 			if (closeToEdgeY()) {
	// 				levelCreator.rectSelect.lineStyle(2 * scale / 9,32768,100);
	// 				_loc13_ = Math.round((_ymouse - (240 - scale * levelHeight / 2)) / scale);
	// 				_loc12_ = 0;
	// 			} else {
	// 				levelCreator.rectSelect.lineStyle(2 * scale / 9,8388608,100);
	// 				_loc13_ = Math.floor((_ymouse - (240 - scale * levelHeight / 2)) / scale);
	// 				_loc12_ = 0.5;
	// 			}
	// 			levelCreator.rectSelect.moveTo(330 - scale * levelWidth / 2,240 - scale * levelHeight / 2 + scale * (_loc13_ + _loc12_));
	// 			levelCreator.rectSelect.lineTo(330 + scale * levelWidth / 2,240 - scale * levelHeight / 2 + scale * (_loc13_ + _loc12_));
	// 		} else if (tool == 7) {
	// 			levelCreator.rectSelect.clear();
	// 			var _loc14_ = undefined;
	// 			var _loc10_ = undefined;
	// 			if (closeToEdgeX()) {
	// 				levelCreator.rectSelect.lineStyle(2 * scale / 9,32768,100);
	// 				_loc14_ = Math.round((_xmouse - (330 - scale * levelWidth / 2)) / scale);
	// 				_loc10_ = 0;
	// 			} else {
	// 				levelCreator.rectSelect.lineStyle(2 * scale / 9,8388608,100);
	// 				_loc14_ = Math.floor((_xmouse - (330 - scale * levelWidth / 2)) / scale);
	// 				_loc10_ = 0.5;
	// 			}
	// 			levelCreator.rectSelect.moveTo(330 - scale * levelWidth / 2 + scale * (_loc14_ + _loc10_),240 - scale * levelHeight / 2);
	// 			levelCreator.rectSelect.lineTo(330 - scale * levelWidth / 2 + scale * (_loc14_ + _loc10_),240 + scale * levelHeight / 2);
	// 		}
	// 	} else if (tool == 6 || tool == 7) {
	// 		levelCreator.rectSelect.clear();
	// 	}
	// 	for (var _loc2_ = 0; _loc2_ < 6; _loc2_++) {
	// 		_loc3_ = _loc2_ * 40;
	// 		if (_loc2_ > selectedTab) {
	// 			_loc3_ += 300;
	// 		}
	// 		if (Math.abs(levelCreator.sideBar["tab" + (_loc2_ + 1)]._y - _loc3_) < 0.5) {
	// 			levelCreator.sideBar["tab" + (_loc2_ + 1)]._y = _loc3_;
	// 		} else {
	// 			levelCreator.sideBar["tab" + (_loc2_ + 1)]._y += (_loc3_ - levelCreator.sideBar["tab" + (_loc2_ + 1)]._y) * 0.2;
	// 		}
	// 	}
	// }
	if (levelTimer <= 30 || menuScreen != 4) {
		if (wipeTimer >= 30 && wipeTimer <= 60) {
			white_alpha = 220 - wipeTimer * 4;
		}
	} else {
		white_alpha = 0;
	}
	if (wipeTimer == 29 && menuScreen == 4 && (charsAtEnd >= charCount2 || transitionType == 0)) {
		white_alpha = 100;
	}
	if (wipeTimer >= 60) {
		wipeTimer = 0;
	}
	if (wipeTimer >= 1) {
		wipeTimer++;
	}

	ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	if (menuScreen == 2) {
		drawLevelMapBorder();
		cameraX = 0;
		shakeX = 0;
		shakeY = 0;
	} else if (menuScreen == 3) {
		if (cutScene == 1 || cutScene == 2) {
			drawCutScene();
		}
		drawLevelButtons();
	}
	if (white_alpha > 0) {
		ctx.fillStyle = '#ffffff';
		ctx.globalAlpha = white_alpha/100;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1;
	}

	_frameCount++;
}