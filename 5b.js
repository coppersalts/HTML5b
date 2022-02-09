// TODO: rename _locn_ variables.
// TODO: look up the difference between var and let.
// UPDATE: I now know the difference and I can't decide whether or not to use it in certain places. All I know is I probably shouldn't use it in for loops.
// I'll look more into it once I get more into optimizing.
// TODO: go through all the todo's I've put throughout this file.
// TODO: rename some functions
// TODO: precalculate some of the stuff in the draw functions when the level in reset.
// TODO: if possible, cashe some things as bitmaps for better performance.
// TODO: remove some of the commented out actionscript stuff.

var canvas;
var ctx;
const cwidth = 960;
const cheight = 540;
const pixelRatio = window.devicePixelRatio;

var _xmouse = 0;
var _ymouse = 0;
var _cursor = 'default';
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
var tileFrames = new Array(0);
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
var bonusProgress;
var gotCoin;
var gotThisCoin = false;
var tileCount = 11;
// var bfdia5b = SharedObject.getLocal("bfdia5b");
var deathCount;
var timer;
var coins;
var longMode = false;

function clearVars() {
	// deathCount = timer = coins = bonusProgress = levelProgress = 0;
	deathCount = timer = coins = bonusProgress = 0;
	levelProgress = 52;
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
	if (_loc1_ == 8364) return 93;
	if (_loc1_ <= 126) return _loc1_ - 46;
	if (_loc1_ <= 182) return _loc1_ - 80;
	return _loc1_ - 81;
}

// Load Level Data
function loadLevels() {
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
}

var musicSound = new Audio('data/music hq.wav');

// [15] - animated?
// [16] - animation frames
// [17] - loop?
// [18] - loop frame order
var blockProperties = [
	// tile0
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,false,0,false],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,false,1,false],
	[true,true,true,true,true,false,false,false,false,false,false,0,0,false,false,false,1,false],
	[true,true,true,true,false,true,false,false,false,false,false,0,0,false,false,false,1,false],
	[true,true,true,true,false,false,true,false,false,false,false,0,0,false,false,false,1,false],
	[true,true,true,true,false,false,false,true,false,false,false,0,0,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,true,120,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119]],
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
	[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,true,120,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119]],
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
	[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,true,120,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119]],
	[false,true,false,false,false,false,false,false,true,false,false,0,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false,false,1,false],
	[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,true,12,true,[0,1,2,3,4,5,6,7,8,9,10,11]],
	[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,false,1,false],
	[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,true,12,true,[0,1,2,3,4,5,6,7,8,9,10,11]],
	[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,false,1,false],
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
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false]
];
var switches = [[31,33,32,34,79,78,81,82],[51,53,52,54],[65,61,60,62,63,64],[],[],[14,16,83,85]];
var charD = [
	[28,45.4,0.45,27,0.8,false,1,1],
	[23,56,0.36,31,0.8,false,1.7,1],
	[20,51,0.41,20,0.85,false,5,1],
	[10,86,0.26,31,0.8,false,1.6,1],
	[10,84,0.23,31,0.8,false,1.4,1],
	[28,70,0.075,28,0.8,false,9,1],
	[26,49,0.2,20,0.75,false,0.6,1],
	[44,65,0.8,20,0.75,false,0.8,1],
	[16,56,0.25,17,0.76,false,0.8,1],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[0,0,0,0,0,false,1,0],
	[36.5,72.8,1,20,0.6,false,0,1],
	[15.1,72.8,0.6,20,0.7,true,0,1],
	[20,40,0.15,20,0.7,true,0.7,1],
	[25,50,0.64,20,0.6,true,0.1,1],
	[25,10,1,0,0.7,true,0.2,1],
	[25,50,1,20,0.7,true,0.1,1],
	[25,29,0.1,20,0.8,true,1,1],
	[21.5,43,0.3,20,0.6,true,0.5,1],
	[35,60,1,20,0.7,true,0.1,1],
	[22.5,45,1,20,0.7,true,0.8,1],
	[25,50,1,0,0.7,true,0.1,27],
	[15,30,0.64,20,0.6,true,0.2,1],
	[10,55,0.8,0,0.3,true,0.4,1],
	[45,10,1,0,0.7,true,0.2,1],
	[20,40,1,0,0.8,false,0.8,5],
	[16,45,0.4,20,0.94,false,1.1,60],
	[25,10,1,0,0.7,true,0.3,1],
	[45,10,0.4,0,0.7,true,0.7,1],
	[15,50,0.1,0,0.8,true,1.9,1],
	[25,25,0.1,0,0.8,true,1.7,1],
[30,540,10,10,0.4,true,0,1]
];

var diaMouths = [
	{
		frameorder: [1,2,3,2,1,0,0,1,2,3,2,1,0,0,1,2,3,2,1,0,0,1,2,3,2,1,0,0,1,2,3,2,1,0,0,1,2,3,2,1,0,0,1,2,3,2,1,0,0,1,2,3,2,1,0],
		frames: [
			{type:'static',bodypart:36,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-1.55,ty:-0.1}},
			{type:'static',bodypart:37,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-1.55,ty:-0.1}},
			{type:'static',bodypart:45,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-1.55,ty:-0.1}},
			{type:'static',bodypart:36,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-1.55,ty:-0.1}},
		]
	},
	{
		frameorder: [0,0,1,2,3,1,1,0,0,1,2,3,1,1,0,0,1,2,3,1,1,0,0,1,2,3,1,1,0,0,1,2,3,1,1,0,0,1,2,3,1,1,0,0,1,2,3,1,1,0,0,1,2,3,1,1,0],
		frames: [
			{type:'static',bodypart:1,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-0.55,ty:1.35}},
			{type:'static',bodypart:42,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-0.55,ty:1.35}},
			{type:'static',bodypart:43,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-0.55,ty:1.35}},
			{type:'static',bodypart:44,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-0.55,ty:1.35}},
		]
	},
	{
		frameorder: [1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0],
		frames: [
			{type:'static',bodypart:51,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-33.45,ty:-2.15}},
			{type:'static',bodypart:52,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-33.45,ty:-2.15}},
			{type:'static',bodypart:53,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-33.45,ty:-2.15}},
		]
	},
	{
		frameorder: [1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0,0,1,2,2,2,1,0],
		frames: [
			{type:'static',bodypart:54,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-33.45,ty:-2.15}},
			{type:'static',bodypart:55,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-33.45,ty:-2.15}},
			{type:'static',bodypart:56,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-33.45,ty:-2.15}},
		]
	}
]
var bodyPartAnimations = [
	{
		// Running Arm
		bodypart: 41,
		frames: [
			{a:0.1691741943359375,b:-0.3343353271484375,c:-0.32513427734375,d:-0.164520263671875,tx:0,ty:0},
			{a:0.1628875732421875,b:-0.3369293212890625,c:-0.32763671875,d:-0.1584014892578125,tx:-0.05,ty:0.05},
			{a:0.143402099609375,b:-0.3457183837890625,c:-0.3361968994140625,d:-0.13946533203125,tx:0,ty:0.05},
			{a:0.106475830078125,b:-0.35894775390625,c:-0.3490753173828125,d:-0.1035614013671875,tx:0,ty:0.15},
			{a:0.0476837158203125,b:-0.37158203125,c:-0.3613433837890625,d:-0.0463714599609375,tx:0,ty:0.2},
			{a:-0.0312652587890625,b:-0.3734130859375,c:-0.3631439208984375,d:0.0304107666015625,tx:0.1,ty:0.3},
			{a:-0.130035400390625,b:-0.3511962890625,c:-0.341522216796875,d:0.12646484375,tx:0.2,ty:0.45},
			{a:-0.2310028076171875,b:-0.29461669921875,c:-0.2865142822265625,d:0.224639892578125,tx:0.4,ty:0.6},
			{a:-0.31005859375,b:-0.209991455078125,c:-0.2042236328125,d:0.3015289306640625,tx:0.5,ty:0.6},
			{a:-0.3542327880859375,b:-0.1222076416015625,c:-0.1188507080078125,d:0.3444976806640625,tx:0.75,ty:0.65},
			{a:-0.3712921142578125,b:-0.0524749755859375,c:-0.051025390625,d:0.361083984375,tx:0.9,ty:0.65},
			{a:-0.37493896484375,b:-0.0117645263671875,c:-0.011444091796875,d:0.3646240234375,tx:1,ty:0.6},
			{a:-0.37518310546875,b:-0.0000152587890625,c:-0.0000152587890625,d:0.3648681640625,tx:0.95,ty:0.55},
			{a:-0.375152587890625,b:-0.0035858154296875,c:-0.0034942626953125,d:0.364837646484375,tx:0.95,ty:0.55},
			{a:-0.3746490478515625,b:-0.0182647705078125,c:-0.01776123046875,d:0.364349365234375,tx:0.95,ty:0.55},
			{a:-0.3723907470703125,b:-0.044281005859375,c:-0.0430755615234375,d:0.3621368408203125,tx:0.85,ty:0.6},
			{a:-0.3656005859375,b:-0.0829010009765625,c:-0.08062744140625,d:0.35552978515625,tx:0.8,ty:0.65},
			{a:-0.3497314453125,b:-0.1344451904296875,c:-0.1307373046875,d:0.3401031494140625,tx:0.7,ty:0.6},
			{a:-0.3190460205078125,b:-0.196136474609375,c:-0.19073486328125,d:0.310272216796875,tx:0.6,ty:0.6},
			{a:-0.2664947509765625,b:-0.2629547119140625,c:-0.2557220458984375,d:0.2591705322265625,tx:0.5,ty:0.6},
			{a:-0.19036865234375,b:-0.3223876953125,c:-0.3135223388671875,d:0.1851348876953125,tx:0.3,ty:0.5},
			{a:-0.0957794189453125,b:-0.36212158203125,c:-0.3521575927734375,d:0.0931396484375,tx:0.2,ty:0.45},
			{a:-0.0017242431640625,b:-0.3748016357421875,c:-0.3644866943359375,d:0.001678466796875,tx:0.15,ty:0.3},
			{a:0.076385498046875,b:-0.3666534423828125,c:-0.3565673828125,d:-0.07427978515625,tx:0.1,ty:0.15},
			{a:0.129913330078125,b:-0.35107421875,c:-0.3414154052734375,d:-0.1263275146484375,tx:0.05,ty:0.05},
			{a:0.159912109375,b:-0.338348388671875,c:-0.32904052734375,d:-0.155517578125,tx:0.05,ty:0.05},
		]
	},
	{
		// Jump Arm
		bodypart: 3,
		frames: [
			{a:0.24114990234375,b:0.0818023681640625,c:-0.123992919921875,d:0.365570068359375,tx:-0.05,ty:4.4},
			{a:0.2412567138671875,b:0.083343505859375,c:-0.12591552734375,d:0.364501953125,tx:0,ty:4.4},
			{a:0.2418670654296875,b:0.0895843505859375,c:-0.1339111328125,d:0.3616180419921875,tx:-0.1,ty:4.25},
			{a:0.2423858642578125,b:0.1007843017578125,c:-0.1479644775390625,d:0.356048583984375,tx:-0.1,ty:4.2},
			{a:0.2422637939453125,b:0.1172943115234375,c:-0.1678619384765625,d:0.3470306396484375,tx:-0.15,ty:4},
			{a:0.240447998046875,b:0.139434814453125,c:-0.193145751953125,d:0.3335418701171875,tx:-0.25,ty:3.8},
			{a:0.2349395751953125,b:0.1680755615234375,c:-0.222930908203125,d:0.3143310546875,tx:-0.3,ty:3.6},
			{a:0.22479248046875,b:0.20147705078125,c:-0.255889892578125,d:0.2880706787109375,tx:-0.4,ty:3.25},
			{a:0.2071990966796875,b:0.239471435546875,c:-0.2901611328125,d:0.25347900390625,tx:-0.6,ty:2.85},
			{a:0.1816253662109375,b:0.27899169921875,c:-0.3218231201171875,d:0.2118682861328125,tx:-0.75,ty:2.5},
			{a:0.146728515625,b:0.3177032470703125,c:-0.3484039306640625,d:0.1646728515625,tx:-0.85,ty:2.1},
			{a:0.1043548583984375,b:0.351959228515625,c:-0.3685150146484375,d:0.11297607421875,tx:-1.05,ty:1.65},
			{a:0.056854248046875,b:0.37933349609375,c:-0.3805389404296875,d:0.062042236328125,tx:-1.2,ty:1.3},
			{a:0.0088653564453125,b:0.3985443115234375,c:-0.3854522705078125,d:0.0136566162109375,tx:-1.3,ty:0.9},
			{a:-0.0344390869140625,b:0.410064697265625,c:-0.3846893310546875,d:-0.0270843505859375,tx:-1.4,ty:0.6},
			{a:-0.07354736328125,b:0.41558837890625,c:-0.3806915283203125,d:-0.0607147216796875,tx:-1.5,ty:0.35},
			{a:-0.1043243408203125,b:0.41729736328125,c:-0.375457763671875,d:-0.0870208740234375,tx:-1.6,ty:0.15},
			{a:-0.1259613037109375,b:0.4172210693359375,c:-0.37078857421875,d:-0.104949951171875,tx:-1.6,ty:0},
			{a:-0.1394805908203125,b:0.4163665771484375,c:-0.3674163818359375,d:-0.115997314453125,tx:-1.7,ty:-0.1},
			{a:-0.1436767578125,b:0.4165496826171875,c:-0.3667144775390625,d:-0.119384765625,tx:-1.7,ty:-0.1},
		]
	},
	{
		// Jump Arm 2
		bodypart: 2,
		frames: [
			{a:0.363616943359375,b:0.0290069580078125,c:-0.0290069580078125,d:0.363616943359375,tx:0.05,ty:2.5},
			{a:0.3632659912109375,b:0.03179931640625,c:-0.03179931640625,d:0.3632659912109375,tx:0.1,ty:2.45},
			{a:0.362457275390625,b:0.0399322509765625,c:-0.0399322509765625,d:0.362457275390625,tx:0,ty:2.45},
			{a:0.3603515625,b:0.0555419921875,c:-0.0555419921875,d:0.3603515625,tx:0,ty:2.4},
			{a:0.356475830078125,b:0.07623291015625,c:-0.07623291015625,d:0.356475830078125,tx:0,ty:2.35},
			{a:0.3489227294921875,b:0.105255126953125,c:-0.105255126953125,d:0.3489227294921875,tx:0,ty:2.3},
			{a:0.336517333984375,b:0.1396942138671875,c:-0.1396942138671875,d:0.336517333984375,tx:-0.05,ty:2.25},
			{a:0.317535400390625,b:0.178497314453125,c:-0.178497314453125,d:0.317535400390625,tx:-0.1,ty:2.1},
			{a:0.2895660400390625,b:0.2209014892578125,c:-0.2209014892578125,d:0.2895660400390625,tx:-0.15,ty:2.05},
			{a:0.252410888671875,b:0.26251220703125,c:-0.26251220703125,d:0.252410888671875,tx:-0.15,ty:2},
			{a:0.20660400390625,b:0.2999420166015625,c:-0.2999420166015625,d:0.20660400390625,tx:-0.25,ty:2},
			{a:0.152862548828125,b:0.3306884765625,c:-0.3306884765625,d:0.152862548828125,tx:-0.3,ty:2},
			{a:0.096160888671875,b:0.3515472412109375,c:-0.3515472412109375,d:0.096160888671875,tx:-0.3,ty:2},
			{a:0.0413360595703125,b:0.3622894287109375,c:-0.3622894287109375,d:0.0413360595703125,tx:-0.35,ty:2.05},
			{a:-0.00811767578125,b:0.364654541015625,c:-0.364654541015625,d:-0.00811767578125,tx:-0.5,ty:2.05},
			{a:-0.04949951171875,b:0.361236572265625,c:-0.361236572265625,d:-0.04949951171875,tx:-0.55,ty:2.1},
			{a:-0.08221435546875,b:0.3551177978515625,c:-0.3551177978515625,d:-0.08221435546875,tx:-0.6,ty:2.25},
			{a:-0.103973388671875,b:0.34930419921875,c:-0.34930419921875,d:-0.103973388671875,tx:-0.7,ty:2.25},
			{a:-0.117431640625,b:0.344970703125,c:-0.344970703125,d:-0.117431640625,tx:-0.7,ty:2.25},
			{a:-0.12213134765625,b:0.343719482421875,c:-0.343719482421875,d:-0.12213134765625,tx:-0.75,ty:2.25},
		]
	},
	{
		// Shaking Arm
		bodypart: 2,
		frames: [
			{a:1,b:0,c:0,d:1,tx:0.45,ty:-0.05},
			{a:0.941253662109375,b:0.334625244140625,c:-0.334625244140625,d:0.941253662109375,tx:0.45,ty:-0.05},
			{a:0.902191162109375,b:-0.428955078125,c:0.428955078125,d:0.902191162109375,tx:0.45,ty:-0.05},
			{a:0.962890625,b:0.2609100341796875,c:-0.2609100341796875,d:0.962890625,tx:0.45,ty:-0.05},
		]
	},
	{
		bodypart: 57,
		frames: [
			{a:-0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:27.45,ty:-49.95},
			{a:-0.30633544921875,b:0.0095062255859375,c:0.0095062255859375,d:0.30633544921875,tx:26.5,ty:-50.75},
			{a:-0.3059234619140625,b:0.01763916015625,c:0.01763916015625,d:0.3059234619140625,tx:25.75,ty:-51.45},
			{a:-0.305419921875,b:0.0243682861328125,c:0.0243682861328125,d:0.305419921875,tx:25.1,ty:-51.95},
			{a:-0.304901123046875,b:0.029693603515625,c:0.029693603515625,d:0.304901123046875,tx:24.5,ty:-52.4},
			{a:-0.304473876953125,b:0.0336456298828125,c:0.0336456298828125,d:0.304473876953125,tx:24.15,ty:-52.75},
			{a:-0.304168701171875,b:0.0362091064453125,c:0.0362091064453125,d:0.304168701171875,tx:23.85,ty:-52.95},
			{a:-0.3041229248046875,b:0.037567138671875,c:0.037567138671875,d:0.3041229248046875,tx:23.75,ty:-53.05},
			{a:-0.304168701171875,b:0.0362091064453125,c:0.0362091064453125,d:0.304168701171875,tx:23.85,ty:-52.95},
			{a:-0.3044586181640625,b:0.0336456298828125,c:0.0336456298828125,d:0.3044586181640625,tx:24.1,ty:-52.7},
			{a:-0.304901123046875,b:0.029693603515625,c:0.029693603515625,d:0.304901123046875,tx:24.55,ty:-52.4},
			{a:-0.305419921875,b:0.0243682861328125,c:0.0243682861328125,d:0.305419921875,tx:25.05,ty:-51.95},
			{a:-0.3059234619140625,b:0.01763916015625,c:0.01763916015625,d:0.3059234619140625,tx:25.75,ty:-51.45},
			{a:-0.30633544921875,b:0.009521484375,c:0.009521484375,d:0.30633544921875,tx:26.55,ty:-50.7},
			{a:-0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:27.45,ty:-49.95},
			{a:-0.3064117431640625,b:-0.008209228515625,c:-0.008209228515625,d:0.3064117431640625,tx:28.15,ty:-49.15},
			{a:-0.3060760498046875,b:-0.0161285400390625,c:-0.0161285400390625,d:0.3060760498046875,tx:28.85,ty:-48.45},
			{a:-0.305633544921875,b:-0.022735595703125,c:-0.022735595703125,d:0.305633544921875,tx:29.45,ty:-47.8},
			{a:-0.30517578125,b:-0.028045654296875,c:-0.028045654296875,d:0.30517578125,tx:29.9,ty:-47.3},
			{a:-0.304779052734375,b:-0.0320587158203125,c:-0.0320587158203125,d:0.304779052734375,tx:30.25,ty:-46.9},
			{a:-0.3044586181640625,b:-0.0347747802734375,c:-0.0347747802734375,d:0.3044586181640625,tx:30.45,ty:-46.6},
			{a:-0.304290771484375,b:-0.0362091064453125,c:-0.0362091064453125,d:0.304290771484375,tx:30.55,ty:-46.45},
			{a:-0.3042755126953125,b:-0.037353515625,c:-0.037353515625,d:0.3042755126953125,tx:30.65,ty:-46.35},
			{a:-0.304290771484375,b:-0.0361785888671875,c:-0.0361785888671875,d:0.304290771484375,tx:30.55,ty:-46.45},
			{a:-0.304595947265625,b:-0.033599853515625,c:-0.033599853515625,d:0.304595947265625,tx:30.4,ty:-46.7},
			{a:-0.3050079345703125,b:-0.0296630859375,c:-0.0296630859375,d:0.3050079345703125,tx:30,ty:-47.1},
			{a:-0.305511474609375,b:-0.0243377685546875,c:-0.0243377685546875,d:0.305511474609375,tx:29.6,ty:-47.65},
			{a:-0.3059844970703125,b:-0.0176239013671875,c:-0.0176239013671875,d:0.3059844970703125,tx:29,ty:-48.3},
			{a:-0.306365966796875,b:-0.0095062255859375,c:-0.0095062255859375,d:0.306365966796875,tx:28.3,ty:-49},
			{a:-0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:27.45,ty:-49.95},
		]
	}
]
var legFrames = [
	{type:'static',bodypart:6},
	{type:'static',bodypart:7},
	{type:'anim',usesMats:false,frames:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35]},
	{type:'anim',usesMats:true,bodypart:62,frames:[
		{a:0.351593017578125,b:0.111663818359375,c:-0.1230926513671875,d:0.463104248046875,tx:0.25,ty:-0.7},
		{a:0.3514251708984375,b:0.1110687255859375,c:-0.122222900390625,d:0.46295166015625,tx:0.2,ty:-0.75},
		{a:0.3518218994140625,b:0.1097564697265625,c:-0.12200927734375,d:0.4629974365234375,tx:0.25,ty:-0.75},
		{a:0.351898193359375,b:0.1095123291015625,c:-0.12017822265625,d:0.4634857177734375,tx:0.25,ty:-0.7},
		{a:0.35235595703125,b:0.10797119140625,c:-0.118133544921875,d:0.4640350341796875,tx:0.35,ty:-0.7},
		{a:0.3529052734375,b:0.1063232421875,c:-0.115966796875,d:0.464569091796875,tx:0.25,ty:-0.7},
		{a:0.3537445068359375,b:0.103363037109375,c:-0.1120758056640625,d:0.4655303955078125,tx:0.25,ty:-0.75},
		{a:0.35467529296875,b:0.1002655029296875,c:-0.108001708984375,d:0.46649169921875,tx:0.25,ty:-0.7},
		{a:0.3555755615234375,b:0.097015380859375,c:-0.103729248046875,d:0.4674835205078125,tx:0.35,ty:-0.7},
		{a:0.3567962646484375,b:0.0924530029296875,c:-0.0977325439453125,d:0.468780517578125,tx:0.35,ty:-0.75},
		{a:0.3580169677734375,b:0.08770751953125,c:-0.09149169921875,d:0.470062255859375,tx:0.35,ty:-0.75},
		{a:0.35943603515625,b:0.0815887451171875,c:-0.0834808349609375,d:0.4715576171875,tx:0.4,ty:-0.7},
		{a:0.3608551025390625,b:0.075286865234375,c:-0.0751953125,d:0.4729461669921875,tx:0.4,ty:-0.65},
		{a:0.36212158203125,b:0.068817138671875,c:-0.0667266845703125,d:0.4742431640625,tx:0.35,ty:-0.75},
		{a:0.363555908203125,b:0.06097412109375,c:-0.0564727783203125,d:0.4756011962890625,tx:0.35,ty:-0.7},
		{a:0.36480712890625,b:0.052978515625,c:-0.046051025390625,d:0.476715087890625,tx:0.45,ty:-0.7},
		{a:0.3661041259765625,b:0.0436859130859375,c:-0.033905029296875,d:0.477783203125,tx:0.4,ty:-0.65},
		{a:0.3669586181640625,b:0.0355377197265625,c:-0.02325439453125,d:0.4784393310546875,tx:0.5,ty:-0.75},
		{a:0.3676605224609375,b:0.0273284912109375,c:-0.0125579833984375,d:0.4788665771484375,tx:0.6,ty:-0.75},
		{a:0.3682708740234375,b:0.017974853515625,c:-0.000396728515625,d:0.4790496826171875,tx:0.5,ty:-0.75},
		{a:0.368621826171875,b:0.009918212890625,c:0.00848388671875,d:0.47894287109375,tx:0.6,ty:-0.75},
		{a:0.3687286376953125,b:0.003204345703125,c:0.017181396484375,d:0.4786376953125,tx:0.6,ty:-0.75},
		{a:0.36871337890625,b:-0.0032806396484375,c:0.027191162109375,d:0.4781646728515625,tx:0.65,ty:-0.7},
		{a:0.3686370849609375,b:-0.00836181640625,c:0.0337677001953125,d:0.4777069091796875,tx:0.6,ty:-0.7},
		{a:0.3684844970703125,b:-0.0131988525390625,c:0.040069580078125,d:0.4771728515625,tx:0.65,ty:-0.7},
		{a:0.368255615234375,b:-0.0178070068359375,c:0.0460052490234375,d:0.4766387939453125,tx:0.65,ty:-0.7},
		{a:0.3680419921875,b:-0.0209503173828125,c:0.0500946044921875,d:0.4762115478515625,tx:0.7,ty:-0.7},
		{a:0.3679656982421875,b:-0.0226898193359375,c:0.0523529052734375,d:0.4759368896484375,tx:0.65,ty:-0.7},
		{a:0.3678741455078125,b:-0.024200439453125,c:0.054290771484375,d:0.4757080078125,tx:0.65,ty:-0.7},
		{a:0.367889404296875,b:-0.02484130859375,c:0.05499267578125,d:0.4757843017578125,tx:0.65,ty:-0.7},
		{a:0.3678741455078125,b:-0.024261474609375,c:0.0543670654296875,d:0.4757080078125,tx:0.65,ty:-0.7},
		{a:0.367919921875,b:-0.02288818359375,c:0.0525970458984375,d:0.475921630859375,tx:0.6,ty:-0.7},
		{a:0.367950439453125,b:-0.02264404296875,c:0.052276611328125,d:0.4759368896484375,tx:0.65,ty:-0.7},
		{a:0.3680419921875,b:-0.0210723876953125,c:0.05023193359375,d:0.476165771484375,tx:0.65,ty:-0.75},
		{a:0.3681793212890625,b:-0.019378662109375,c:0.048065185546875,d:0.476409912109375,tx:0.65,ty:-0.7},
		{a:0.368316650390625,b:-0.0163421630859375,c:0.044158935546875,d:0.4768218994140625,tx:0.65,ty:-0.75},
		{a:0.3684844970703125,b:-0.0131988525390625,c:0.0400543212890625,d:0.4771728515625,tx:0.6,ty:-0.7},
		{a:0.3685760498046875,b:-0.0099029541015625,c:0.0358123779296875,d:0.4775543212890625,tx:0.6,ty:-0.7},
		{a:0.36865234375,b:-0.0064544677734375,c:0.0313262939453125,d:0.4778594970703125,tx:0.6,ty:-0.7},
		{a:0.3687286376953125,b:-0.00164794921875,c:0.0251007080078125,d:0.4782867431640625,tx:0.6,ty:-0.7},
		{a:0.3687286376953125,b:0.0032958984375,c:0.01708984375,d:0.4786376953125,tx:0.5,ty:-0.7},
		{a:0.3686370849609375,b:0.0084075927734375,c:0.01043701171875,d:0.4788970947265625,tx:0.5,ty:-0.7},
		{a:0.36834716796875,b:0.0160980224609375,c:0.000457763671875,d:0.4790191650390625,tx:0.5,ty:-0.7},
		{a:0.3679962158203125,b:0.022705078125,c:-0.006561279296875,d:0.47900390625,tx:0.5,ty:-0.75},
		{a:0.367431640625,b:0.0306549072265625,c:-0.01690673828125,d:0.4787139892578125,tx:0.4,ty:-0.7},
		{a:0.3666534423828125,b:0.0386505126953125,c:-0.0273590087890625,d:0.47821044921875,tx:0.45,ty:-0.7},
		{a:0.36572265625,b:0.0467376708984375,c:-0.0378875732421875,d:0.47747802734375,tx:0.4,ty:-0.7},
		{a:0.36456298828125,b:0.0548095703125,c:-0.0484161376953125,d:0.4764862060546875,tx:0.35,ty:-0.75},
		{a:0.363250732421875,b:0.062835693359375,c:-0.0604705810546875,d:0.47509765625,tx:0.4,ty:-0.7},
		{a:0.36151123046875,b:0.07196044921875,c:-0.0708770751953125,d:0.4736328125,tx:0.25,ty:-0.65},
		{a:0.3601226806640625,b:0.0785675048828125,c:-0.0795135498046875,d:0.47222900390625,tx:0.35,ty:-0.7},
		{a:0.3583526611328125,b:0.0861663818359375,c:-0.089508056640625,d:0.4704437255859375,tx:0.35,ty:-0.65},
		{a:0.3568267822265625,b:0.0923919677734375,c:-0.09765625,d:0.468780517578125,tx:0.2,ty:-0.75},
		{a:0.3555145263671875,b:0.0972137451171875,c:-0.1039886474609375,d:0.4674072265625,tx:0.25,ty:-0.7},
		{a:0.3542022705078125,b:0.1017913818359375,c:-0.1100006103515625,d:0.46600341796875,tx:0.25,ty:-0.65},
		{a:0.3532867431640625,b:0.1049957275390625,c:-0.114227294921875,d:0.4650115966796875,tx:0.2,ty:-0.75},
		{a:0.3524017333984375,b:0.10797119140625,c:-0.1181488037109375,d:0.4640045166015625,tx:0.15,ty:-0.7},
		{a:0.3518829345703125,b:0.109619140625,c:-0.120269775390625,d:0.4634552001953125,tx:0.25,ty:-0.7},
		{a:0.3514404296875,b:0.1110076904296875,c:-0.1221466064453125,d:0.46295166015625,tx:0.2,ty:-0.7},
		{a:0.351593017578125,b:0.111663818359375,c:-0.1230926513671875,d:0.463104248046875,tx:0.25,ty:-0.7},
	]},
	{type:'anim',usesMats:true,bodypart:62,frames:[
		{a:0.2861175537109375,b:0.232147216796875,c:-0.2834320068359375,d:0.3856353759765625,tx:0.1,ty:-0.65},
		{a:0.2884979248046875,b:0.228240966796875,c:-0.2781219482421875,d:0.3885650634765625,tx:0.15,ty:-0.7},
		{a:0.29730224609375,b:0.2166748046875,c:-0.262603759765625,d:0.3993072509765625,tx:0,ty:-0.7},
		{a:0.312591552734375,b:0.194122314453125,c:-0.23236083984375,d:0.417724609375,tx:0.2,ty:-0.7},
		{a:0.3320465087890625,b:0.1588134765625,c:-0.18536376953125,d:0.4407501220703125,tx:0.35,ty:-0.7},
		{a:0.3515167236328125,b:0.1096343994140625,c:-0.120361328125,d:0.4630279541015625,tx:0.45,ty:-0.75},
		{a:0.3641204833984375,b:0.0562286376953125,c:-0.05029296875,d:0.47607421875,tx:0.5,ty:-0.65},
		{a:0.368499755859375,b:0.0100250244140625,c:0.0083465576171875,d:0.4788360595703125,tx:0.65,ty:-0.7},
		{a:0.368316650390625,b:-0.0161285400390625,c:0.043853759765625,d:0.4767913818359375,tx:0.7,ty:-0.75},
		{a:0.367889404296875,b:-0.0248565673828125,c:0.05499267578125,d:0.4757843017578125,tx:0.7,ty:-0.7},
		{a:0.3680419921875,b:-0.02099609375,c:0.050140380859375,d:0.476165771484375,tx:0.7,ty:-0.75},
		{a:0.3685760498046875,b:-0.0084228515625,c:0.0338897705078125,d:0.4776763916015625,tx:0.65,ty:-0.7},
		{a:0.3684844970703125,b:0.0113525390625,c:0.0066070556640625,d:0.4788665771484375,tx:0.6,ty:-0.7},
		{a:0.365966796875,b:0.043426513671875,c:-0.0335845947265625,d:0.4776153564453125,tx:0.5,ty:-0.65},
		{a:0.358428955078125,b:0.0848388671875,c:-0.0877532958984375,d:0.4704437255859375,tx:0.45,ty:-0.7},
		{a:0.3435211181640625,b:0.13238525390625,c:-0.1503753662109375,d:0.45404052734375,tx:0.35,ty:-0.65},
		{a:0.3231201171875,b:0.1761322021484375,c:-0.208404541015625,d:0.430267333984375,tx:0.2,ty:-0.7},
		{a:0.3029327392578125,b:0.2087860107421875,c:-0.2519989013671875,d:0.4060821533203125,tx:0.1,ty:-0.65},
		{a:0.29034423828125,b:0.225860595703125,c:-0.274932861328125,d:0.390838623046875,tx:0.1,ty:-0.7},
		{a:0.2861175537109375,b:0.232147216796875,c:-0.2834320068359375,d:0.3856353759765625,tx:0.1,ty:-0.65},
	]},
]
// frames:
// 00 - run left
// 01 - stand left
// 02 - run right
// 03 - stand right
// 04 - jump left
// 05 - jump right
// 06 - carry left
// 07 - carry right
// 08 - die left
// 09 - die right
// 10 - recover left
// 11 - recover right
// 12 - recover2 left
// 13 - recover2 right

// TODO: load this externally?
var charModels = [
	{
		// Ruby
		torsomat: {a:1,b:0,c:0,d:1,tx:0.05,ty:-3.1},
		legx: [-8.55, 9.8],
		legy: [-11.25, -11.25],
		firemat: {a:-0.45697021484375,b:0.0060882568359375,c:0.0076904296875,d:0.5772552490234375,tx:-2.3,ty:-51.8},
		charimgmat: {a:0.15606689453125,b:0,c:0,d:0.15606689453125,tx:0.05,ty:0.6},
		burstmat: {a:1.5308685302734375,b:0,c:0,d:0.8062744140625,tx:0.05,ty:-23.95},
		defaultExpr: 0,
		mouthType: 0,
		frames: [
			[
				{type:'anim',anim:0,offset:15,loop:true,mat:{a:1,b:0,c:0,d:1,tx:-19.05,ty:-17.65}},
				{type:'body',mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0,ty:-24.75}},
				{type:'static',bodypart:36,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-13.05,ty:-20.25}},
				{type:'static',bodypart:39,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-25.35,ty:-30.7}},
				{type:'static',bodypart:39,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-9.65,ty:-30.95}},
				{type:'anim',anim:0,offset:0,loop:true,mat:{a:1,b:0,c:0,d:1,tx:15.95,ty:-17.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:0.3648681640625,b:0.0000152587890625,c:-0.0000152587890625,d:0.3648681640625,tx:-19.15,ty:-18.1}},
				{type:'body',mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0,ty:-23.85}},
				{type:'dia',mat:{a:1,b:0,c:0,d:1,tx:-11.7,ty:-19.35}},
				{type:'static',bodypart:39,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-25.35,ty:-29.8}},
				{type:'static',bodypart:39,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-9.65,ty:-30.05}},
				{type:'static',bodypart:2,mat:{a:0.3648681640625,b:0,c:0.0000152587890625,d:0.3648681640625,tx:19.2,ty:-19.6}},
			],
			[
				{type:'anim',anim:0,offset:15,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:18.95,ty:-17.65}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-0.1,ty:-24.75}},
				{type:'static',bodypart:36,mat:{a:0.400299072265625,b:0,c:0,d:0.400299072265625,tx:12.95,ty:-20.25}},
				{type:'static',bodypart:39,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:9.55,ty:-30.95}},
				{type:'static',bodypart:39,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:25.25,ty:-30.7}},
				{type:'anim',anim:0,offset:0,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:-16.05,ty:-17.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-0.3648681640625,b:0.0000152587890625,c:0.0000152587890625,d:0.3648681640625,tx:19.15,ty:-18.1}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0,ty:-23.85}},
				{type:'dia',mat:{a:-1,b:0,c:0,d:1,tx:11.7,ty:-19.35}},
				{type:'static',bodypart:39,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:9.65,ty:-30.05}},
				{type:'static',bodypart:39,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:25.35,ty:-29.8}},
				{type:'static',bodypart:2,mat:{a:-0.3648681640625,b:0,c:-0.0000152587890625,d:0.3648681640625,tx:-19.2,ty:-19.35}},
			],
			[
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:1,b:0,c:0,d:1,tx:-20.65,ty:-23.15}},
				{type:'body',mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:1.5,ty:-23.8}},
				{type:'static',bodypart:36,mat:{a:-0.39892578125,b:-0.0318145751953125,c:-0.0318145751953125,d:0.39892578125,tx:-11.85,ty:-20.4}},
				{type:'static',bodypart:39,mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:-23.3,ty:-31.75}},
				{type:'static',bodypart:39,mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:-7.6,ty:-30.75}},
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:-1,b:0,c:0,d:1,tx:21.75,ty:-22.9}},
			],
			[
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:-1,b:0,c:0,d:1,tx:21.05,ty:-23.15}},
				{type:'body',mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:-1.1,ty:-23.8}},
				{type:'static',bodypart:36,mat:{a:0.39892578125,b:-0.0318145751953125,c:0.0318145751953125,d:0.39892578125,tx:12.25,ty:-20.4}},
				{type:'static',bodypart:39,mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:8,ty:-30.75}},
				{type:'static',bodypart:39,mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:23.7,ty:-31.75}},
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:1,b:0,c:0,d:1,tx:-21.35,ty:-22.9}},
			],
			[
				{type:'static',bodypart:41,mat:{a:0.211151123046875,b:-0.2940673828125,c:-0.300384521484375,d:-0.2069244384765625,tx:-21.25,ty:-20.6}},
				{type:'body',mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:1.5,ty:-23.8}},
				{type:'static',bodypart:1,mat:{a:-0.399322509765625,b:-0.0230865478515625,c:-0.0230865478515625,d:0.399322509765625,tx:-13,ty:-21.15}},
				{type:'static',bodypart:0,mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:-19.45,ty:-31.5}},
				{type:'static',bodypart:0,mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:-5.4,ty:-30.5}},
				{type:'static',bodypart:41,mat:{a:0.211151123046875,b:-0.2940673828125,c:-0.300384521484375,d:-0.2069244384765625,tx:-1.35,ty:-17.85}},
			],
			[
				{type:'static',bodypart:41,mat:{a:-0.211151123046875,b:-0.2940673828125,c:0.300384521484375,d:-0.2069244384765625,tx:23.05,ty:-20.6}},
				{type:'body',mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:-1.1,ty:-23.8}},
				{type:'static',bodypart:1,mat:{a:0.399322509765625,b:-0.0230865478515625,c:0.0230865478515625,d:0.399322509765625,tx:14.8,ty:-21.15}},
				{type:'static',bodypart:0,mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:7.2,ty:-30.5}},
				{type:'static',bodypart:0,mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:21.25,ty:-31.5}},
				{type:'static',bodypart:41,mat:{a:-0.211151123046875,b:-0.2940673828125,c:0.300384521484375,d:-0.2069244384765625,tx:3.15,ty:-17.85}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-0.12213134765625,b:0.343719482421875,c:-0.343719482421875,d:-0.12213134765625,tx:-21.4,ty:-20.9}},
				{type:'body',mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:1.5,ty:-23.8}},
				{type:'static',bodypart:5,mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:-20.8,ty:-32}},
				{type:'static',bodypart:4,mat:{a:-0.412109375,b:-0.0328521728515625,c:-0.024749755859375,d:0.3104248046875,tx:-9.3,ty:-21.75}},
				{type:'static',bodypart:4,mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:-4.85,ty:-31}},
				{type:'static',bodypart:2,mat:{a:-0.0661163330078125,b:-0.358734130859375,c:0.358734130859375,d:-0.066131591796875,tx:20.35,ty:-18.1}},
			],
			[
				{type:'static',bodypart:2,mat:{a:0.12213134765625,b:0.343719482421875,c:0.343719482421875,d:-0.12213134765625,tx:22.4,ty:-20.9}},
				{type:'body',mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:-0.5,ty:-23.8}},
				{type:'static',bodypart:5,mat:{a:0.412109375,b:-0.0328521728515625,c:0.024749755859375,d:0.3104248046875,tx:10.3,ty:-21.75}},
				{type:'static',bodypart:4,mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:5.85,ty:-31}},
				{type:'static',bodypart:4,mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:21.8,ty:-32}},
				{type:'static',bodypart:2,mat:{a:0.0661163330078125,b:-0.358734130859375,c:-0.358734130859375,d:-0.066131591796875,tx:-19.35,ty:-18.1}},
			],
			[
				{type:'armroot',id:0,pos:{x:-19.4,y:-17.4}},
				{type:'body',mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0,ty:-23.85}},
				{type:'static',bodypart:36,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-13.05,ty:-19.35}},
				{type:'static',bodypart:39,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-25.35,ty:-29.8}},
				{type:'static',bodypart:39,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-9.65,ty:-30.05}},
				{type:'armroot',id:1,pos:{x:19.2,y:-17.4}},
			],
			[
				{type:'armroot',id:0,pos:{x:19.2,y:-17.4}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0,ty:-23.85}},
				{type:'static',bodypart:36,mat:{a:0.400299072265625,b:0,c:0,d:0.400299072265625,tx:11.6,ty:-19.35}},
				{type:'static',bodypart:39,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:9.65,ty:-30.05}},
				{type:'static',bodypart:39,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:25.35,ty:-29.8}},
				{type:'armroot',id:1,pos:{x:-19.4,y:-17.4}},
			],
			[
				{type:'armroot',id:0,pos:{x:19.2,y:-17.4}},
				{type:'armroot',id:1,pos:{x:-19.4,y:-17.4}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0,ty:-23.85}},
			],
			[
				{type:'armroot',id:0,pos:{x:19.2,y:-17.4}},
				{type:'armroot',id:1,pos:{x:-19.4,y:-17.4}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:0,ty:-23.85}},
			]
		]
	},
	{
		// Book
		torsomat: {a:1,b:0,c:0,d:1,tx:1.15,ty:-8.95},
		legx: [-5.55, 8.8],
		legy: [-11.25, -11.25],
		firemat: {a:-0.4046630859375,b:0.0060882568359375,c:0.006805419921875,d:0.5772552490234375,tx:1.05,ty:-51.05},
		charimgmat: {a:0.12158203125,b:-0.0020751953125,c:0.0037384033203125,d:0.12152099609375,tx:0.1,ty:0.4},
		burstmat: {a:1.0688934326171875,b:0,c:0,d:1,tx:1.6,ty:-32.25},
		defaultExpr: 1,
		mouthType: 0,
		frames: [
			[
				{type:'anim',anim:0,offset:15,loop:true,mat:{a:1,b:0,c:0,d:1,tx:-21.05,ty:-17.65}},
				{type:'body',mat:{a:0.2847747802734375,b:-0.0040130615234375,c:0.0086822509765625,d:0.285064697265625,tx:0.35,ty:-26.65}},
				{type:'static',bodypart:0,mat:{a:-0.375213623046875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-9.05,ty:-30.6}},
				{type:'static',bodypart:0,mat:{a:-0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:4.2,ty:-30.35}},
				{type:'static',bodypart:1,mat:{a:-0.3180999755859375,b:0.01141357421875,c:0.022735595703125,d:0.43402099609375,tx:-2.5,ty:-17.5}},
				{type:'anim',anim:0,offset:0,loop:true,mat:{a:1,b:0,c:0,d:1,tx:17.95,ty:-17.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:0.3733978271484375,b:0.0712127685546875,c:-0.0721435546875,d:0.3782196044921875,tx:-21.35,ty:-16.9}},
				{type:'body',mat:{a:0.2847747802734375,b:-0.0040130615234375,c:0.0086822509765625,d:0.285064697265625,tx:0.6,ty:-26.2}},
				{type:'static',bodypart:0,mat:{a:-0.375213623046875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-8.8,ty:-30.15}},
				{type:'static',bodypart:0,mat:{a:-0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:4.45,ty:-29.8}},
				{type:'static',bodypart:2,mat:{a:-0.3849334716796875,b:0.0501251220703125,c:0.0777587890625,d:0.3766937255859375,tx:21.1,ty:-18.65}},
				{type:'dia',mat:{a:0.886138916015625,b:0,c:0,d:0.886138916015625,tx:-2.05,ty:-18.05}},
			],
			[
				{type:'anim',anim:0,offset:15,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:22.1,ty:-17.65}},
				{type:'body',mat:{a:0.283721923828125,b:0.0136260986328125,c:-0.0087432861328125,d:0.283905029296875,tx:0.85,ty:-26.65}},
				{type:'static',bodypart:0,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-4.2,ty:-30.25}},
				{type:'static',bodypart:0,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:9.05,ty:-30.6}},
				{type:'static',bodypart:1,mat:{a:0.3180999755859375,b:0.01141357421875,c:-0.022735595703125,d:0.43402099609375,tx:2.5,ty:-17.5}},
				{type:'anim',anim:0,offset:0,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:-17.95,ty:-17.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-0.3730010986328125,b:0.071136474609375,c:0.0718994140625,d:0.3780364990234375,tx:21.2,ty:-16.8}},
				{type:'body',mat:{a:0.2848052978515625,b:0.003997802734375,c:-0.0077362060546875,d:0.2839813232421875,tx:-0.3,ty:-26.2}},
				{type:'static',bodypart:0,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-4.4,ty:-29.75}},
				{type:'static',bodypart:0,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:8.75,ty:-30.1}},
				{type:'static',bodypart:2,mat:{a:0.3796844482421875,b:0.0500335693359375,c:-0.076751708984375,d:0.3769683837890625,tx:-20.85,ty:-18.65}},
				{type:'dia',mat:{a:-0.886138916015625,b:0,c:0,d:0.886138916015625,tx:2.35,ty:-18.05}},
			],
			[
				{type:'anim',anim:1,offset:0,loop:false,mat:{a:1,b:0,c:0,d:1,tx:-18.55,ty:-24.65}},
				{type:'body',mat:{a:0.28375244140625,b:0.0136871337890625,c:-0.009918212890625,d:0.2838592529296875,tx:1.9,ty:-26.75}},
				{type:'static',bodypart:0,mat:{a:-0.37451171875,b:-0.0196380615234375,c:-0.0245208740234375,d:0.374267578125,tx:-7.25,ty:-31.35}},
				{type:'static',bodypart:0,mat:{a:-0.37451171875,b:-0.0196380615234375,c:-0.0245208740234375,d:0.374267578125,tx:6,ty:-30.1}},
				{type:'static',bodypart:1,mat:{a:-0.3180389404296875,b:-0.0084075927734375,c:-0.004058837890625,d:0.310455322265625,tx:-1.55,ty:-17.8}},
				{type:'anim',anim:1,offset:0,loop:false,mat:{a:-1,b:0,c:0,d:1,tx:21.4,ty:-24.65}},
			],
			[
				{type:'anim',anim:1,offset:0,loop:false,mat:{a:-1,b:0,c:0,d:1,tx:21.4,ty:-24.65}},
				{type:'body',mat:{a:0.2836456298828125,b:-0.0136871337890625,c:0.009918212890625,d:0.2837677001953125,tx:0.9,ty:-26.75}},
				{type:'static',bodypart:0,mat:{a:0.37451171875,b:-0.0196380615234375,c:0.0245208740234375,d:0.374267578125,tx:-3.2,ty:-30.1}},
				{type:'static',bodypart:0,mat:{a:0.37451171875,b:-0.0196380615234375,c:0.0245208740234375,d:0.374267578125,tx:10.05,ty:-31.35}},
				{type:'static',bodypart:1,mat:{a:0.3180389404296875,b:-0.0084075927734375,c:0.004058837890625,d:0.310455322265625,tx:4.35,ty:-17.8}},
				{type:'anim',anim:1,offset:0,loop:false,mat:{a:1,b:0,c:0,d:1,tx:-18.55,ty:-24.65}},
			],
			[
				{type:'static',bodypart:3,mat:{a:-0.0284576416015625,b:-0.457672119140625,c:-0.385009765625,d:0.023651123046875,tx:-17.15,ty:-21.15}},
				{type:'body',mat:{a:0.28375244140625,b:0.0136871337890625,c:-0.009918212890625,d:0.2838592529296875,tx:1.9,ty:-26.75}},
				{type:'static',bodypart:0,mat:{a:-0.37451171875,b:-0.0196380615234375,c:-0.0245208740234375,d:0.374267578125,tx:-7.25,ty:-31.35}},
				{type:'static',bodypart:0,mat:{a:-0.37451171875,b:-0.0196380615234375,c:-0.0245208740234375,d:0.374267578125,tx:6,ty:-30.1}},
				{type:'static',bodypart:1,mat:{a:-0.3180389404296875,b:-0.0084075927734375,c:-0.004058837890625,d:0.310455322265625,tx:-1.55,ty:-17.8}},
				{type:'static',bodypart:3,mat:{a:-0.02813720703125,b:-0.4629669189453125,c:-0.386383056640625,d:0.0238037109375,tx:9.25,ty:-19.75}},
			],
			[
				{type:'static',bodypart:3,mat:{a:0.0284576416015625,b:-0.457672119140625,c:0.385009765625,d:0.023651123046875,tx:16.9,ty:-21.25}},
				{type:'body',mat:{a:0.28363037109375,b:-0.0136871337890625,c:0.009918212890625,d:0.28375244140625,tx:-2.3,ty:-26.75}},
				{type:'static',bodypart:0,mat:{a:0.37451171875,b:-0.0196380615234375,c:0.0245208740234375,d:0.374267578125,tx:-6.4,ty:-30.1}},
				{type:'static',bodypart:0,mat:{a:0.37451171875,b:-0.0196380615234375,c:0.0245208740234375,d:0.374267578125,tx:6.85,ty:-31.35}},
				{type:'static',bodypart:1,mat:{a:0.3180389404296875,b:-0.0084075927734375,c:0.004058837890625,d:0.310455322265625,tx:1.15,ty:-17.8}},
				{type:'static',bodypart:3,mat:{a:0.02813720703125,b:-0.46295166015625,c:0.386383056640625,d:0.0238037109375,tx:-9.5,ty:-19.75}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-0.26220703125,b:0.2750244140625,c:-0.2784881591796875,d:-0.2655029296875,tx:-20.2,ty:-24.1}},
				{type:'body',mat:{a:0.283966064453125,b:0.0086822509765625,c:-0.00372314453125,d:0.28411865234375,tx:1.5,ty:-25.95}},
				{type:'static',bodypart:4,mat:{a:-0.37493896484375,b:-0.011810302734375,c:-0.016754150390625,d:0.3746490478515625,tx:-7.6,ty:-30.4}},
				{type:'static',bodypart:4,mat:{a:-0.3749237060546875,b:-0.011810302734375,c:-0.016448974609375,d:0.3746795654296875,tx:5.6,ty:-29.45}},
				{type:'static',bodypart:5,mat:{a:-0.3182525634765625,b:-0.0028076171875,c:0.0003204345703125,d:0.3105926513671875,tx:-0.7,ty:-18.75}},
				{type:'static',bodypart:2,mat:{a:0.21820068359375,b:0.313629150390625,c:0.29925537109375,d:-0.2410430908203125,tx:21.95,ty:-24.25}},
			],
			[
				{type:'static',bodypart:2,mat:{a:0.26220703125,b:0.2750244140625,c:0.2784881591796875,d:-0.2655029296875,tx:20.6,ty:-24.5}},
				{type:'body',mat:{a:0.2838592529296875,b:-0.0077362060546875,c:0.0037994384765625,d:0.284027099609375,tx:-1.2,ty:-26.4}},
				{type:'static',bodypart:4,mat:{a:0.3748626708984375,b:-0.0118255615234375,c:0.0179901123046875,d:0.374542236328125,tx:-5.2,ty:-29.85}},
				{type:'static',bodypart:4,mat:{a:0.3748779296875,b:0.011810302734375,c:0.0179901123046875,d:0.3745269775390625,tx:8,ty:-30.8}},
				{type:'static',bodypart:5,mat:{a:0.3182220458984375,b:-0.0028076171875,c:-0.0013580322265625,d:0.3105621337890625,tx:1.1,ty:-19.15}},
				{type:'static',bodypart:2,mat:{a:-0.21820068359375,b:0.313629150390625,c:-0.29925537109375,d:-0.2410430908203125,tx:-21.2,ty:-24.75}},
			],
			[
				{type:'armroot',id:0,pos:{x:-21.1,y:-17.05}},
				{type:'body',mat:{a:0.2847747802734375,b:-0.0040130615234375,c:0.0086822509765625,d:0.285064697265625,tx:0.6,ty:-26.2}},
				{type:'static',bodypart:0,mat:{a:-0.375213623046875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-8.8,ty:-30.15}},
				{type:'static',bodypart:0,mat:{a:-0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:4.45,ty:-29.9}},
				{type:'static',bodypart:1,mat:{a:-0.3180999755859375,b:0.01141357421875,c:0.022735595703125,d:0.43402099609375,tx:-2.25,ty:-17.05}},
				{type:'armroot',id:1,pos:{x:21.5,y:-17.05}},
			],
			[
				{type:'armroot',id:0,pos:{x:22.1,y:-17.05}},
				{type:'body',mat:{a:0.28399658203125,b:0.00396728515625,c:-0.008697509765625,d:0.2838592529296875,tx:0.25,ty:-26.2}},
				{type:'static',bodypart:0,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:-3.45,ty:-29.8}},
				{type:'static',bodypart:0,mat:{a:0.37518310546875,b:0.00494384765625,c:0,d:0.375213623046875,tx:9.8,ty:-30.15}},
				{type:'static',bodypart:1,mat:{a:0.3180999755859375,b:0.01141357421875,c:-0.022735595703125,d:0.43402099609375,tx:3.25,ty:-17.05}},
				{type:'armroot',id:1,pos:{x:-20.5,y:-17.05}},
			],
			[
				{type:'armroot',id:0,pos:{x:22.1,y:-17.05}},
				{type:'armroot',id:1,pos:{x:-20.5,y:-17.05}},
				{type:'body',mat:{a:-0.28411865234375,b:0.0000152587890625,c:-0.0037078857421875,d:0.2840576171875,tx:0.4,ty:-26.2}},
			],
			[
				{type:'armroot',id:0,pos:{x:22.1,y:-17.05}},
				{type:'armroot',id:1,pos:{x:-20.5,y:-17.05}},
				{type:'body',mat:{a:-0.28411865234375,b:0.0000152587890625,c:-0.0037078857421875,d:0.2840576171875,tx:0.4,ty:-26.2}},
			]
		]
	},
	{
		// Ice Cube	
		torsomat: {a:1,b:0,c:0,d:1,tx:-0.05,ty:-4.6},
		legx: [-5.55, 8.8],
		legy: [-11.25, -11.25],
		firemat: {a:0.8855438232421875,b:0,c:0,d:1,tx:2.05,ty:0},
		charimgmat: {a:0.14532470703125,b:-0.00250244140625,c:0.00445556640625,d:0.1452484130859375,tx:-0.3,ty:0.5},
		burstmat: {a:1,b:0,c:0,d:0.8679046630859375,tx:0.6,ty:-27.95},
		defaultExpr: 1,
		mouthType: 0,
		frames: [
			[
				{type:'body',mat:{a:0.319091796875,b:-0.0054779052734375,c:0.009796142578125,d:0.3189697265625,tx:0.35,ty:-26.65}},
				{type:'static',bodypart:39,mat:{a:-0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:-17.4,ty:-30}},
				{type:'static',bodypart:1,mat:{a:-0.318145751953125,b:0.0123748779296875,c:0.01629638671875,d:0.31024169921875,tx:-11.3,ty:-18.55}},
			],
			[
				{type:'body',mat:{a:0.31939697265625,b:-0.005462646484375,c:0.0098114013671875,d:0.3192596435546875,tx:-0.05,ty:-26.6}},
				{type:'static',bodypart:39,mat:{a:-0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:-17.75,ty:-29.55}},
				{type:'dia',mat:{a:0.759613037109375,b:0,c:0,d:0.759613037109375,tx:-11.75,ty:-19.85}},
			],
			[
				{type:'body',mat:{a:-0.319091796875,b:-0.0054779052734375,c:-0.009796142578125,d:0.3189697265625,tx:-0.45,ty:-26.65}},
				{type:'static',bodypart:39,mat:{a:0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:17.3,ty:-30}},
				{type:'static',bodypart:1,mat:{a:0.318145751953125,b:0.0123748779296875,c:-0.01629638671875,d:0.31024169921875,tx:11.2,ty:-18.55}},
			],
			[
				{type:'body',mat:{a:-0.31939697265625,b:-0.005462646484375,c:-0.0098114013671875,d:0.3192596435546875,tx:1.05,ty:-26.6}},
				{type:'static',bodypart:39,mat:{a:0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:18.75,ty:-29.55}},
				{type:'dia',mat:{a:-0.759613037109375,b:0,c:0,d:0.759613037109375,tx:12.75,ty:-19.85}},
			],
			[
				{type:'body',mat:{a:0.3189697265625,b:0.0085296630859375,c:-0.00421142578125,d:0.31903076171875,tx:0.6,ty:-26.6}},
				{type:'static',bodypart:39,mat:{a:-0.3750457763671875,b:-0.0113525390625,c:-0.0164642333984375,d:0.37481689453125,tx:-16.95,ty:-30.7}},
				{type:'static',bodypart:1,mat:{a:-0.318328857421875,b:-0.0016021728515625,c:0.002655029296875,d:0.31060791015625,tx:-11.35,ty:-19}},
			],
			[
				{type:'body',mat:{a:-0.3189697265625,b:0.0085296630859375,c:0.00421142578125,d:0.31903076171875,tx:-0.7,ty:-26.6}},
				{type:'static',bodypart:39,mat:{a:0.3750457763671875,b:-0.0113525390625,c:0.0164642333984375,d:0.37481689453125,tx:16.85,ty:-30.7}},
				{type:'static',bodypart:1,mat:{a:0.318328857421875,b:-0.0016021728515625,c:-0.002655029296875,d:0.31060791015625,tx:11.25,ty:-19}},
			],
			[],
			[],
			[
				{type:'body',mat:{a:0.31939697265625,b:-0.005462646484375,c:0.0098114013671875,d:0.3192596435546875,tx:-0.05,ty:-26.6}},
				{type:'static',bodypart:40,mat:{a:-0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:-16.85,ty:-28}},
				{type:'static',bodypart:5,mat:{a:-0.318145751953125,b:0.0123748779296875,c:0.01629638671875,d:0.31024169921875,tx:-11.4,ty:-19.15}},
			],
			[
				{type:'body',mat:{a:-0.31939697265625,b:-0.005462646484375,c:-0.0098114013671875,d:0.3192596435546875,tx:1.6,ty:-26.6}},
				{type:'static',bodypart:40,mat:{a:0.375244140625,b:0.0051116943359375,c:0,d:0.375244140625,tx:18.4,ty:-28}},
				{type:'static',bodypart:5,mat:{a:0.318145751953125,b:0.0123748779296875,c:-0.01629638671875,d:0.31024169921875,tx:12.95,ty:-19.15}},
			],
			[],
			[],
			[],
			[]
		]
	},
	{
		// Match
		torsomat: {a:0.9517822265625,b:0,c:0,d:0.9517822265625,tx:0.4,ty:-8.95},
		legx: [-2.45, 5.1],
		legy: [-11.25, -11.25],
		firemat: {a:-0.1956634521484375,b:0.0030975341796875,c:0.0032806396484375,d:0.2937164306640625,tx:1.05,ty:-94},
		charimgmat: {a:0.1161346435546875,b:0,c:0,d:0.1161346435546875,tx:-0.15,ty:0.2},
		burstmat: {a:0.5277099609375,b:0,c:0,d:1.2281951904296875,tx:0.6,ty:-41},
		defaultExpr: 0,
		mouthType: 0,
		frames: [
			[
				{type:'anim',anim:0,offset:15,loop:true,mat:{a:1,b:0,c:0,d:1,tx:-6.1,ty:-22.1}},
				{type:'body',mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.05,ty:-41.75}},
				{type:'static',bodypart:0,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:-3.6,ty:-39.6}},
				{type:'static',bodypart:36,mat:{a:-0.194427490234375,b:0,c:0,d:0.329345703125,tx:-1.4,ty:-29.45}},
				{type:'anim',anim:0,offset:0,loop:true,mat:{a:1,b:0,c:0,d:1,tx:5.95,ty:-22.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-0.322235107421875,b:-0.090789794921875,c:-0.090789794921875,d:0.322235107421875,tx:-5.6,ty:-19.95}},
				{type:'body',mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.05,ty:-40.85}},
				{type:'static',bodypart:0,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:-3.6,ty:-38.7}},
				{type:'static',bodypart:2,mat:{a:-0.313751220703125,b:0.1172332763671875,c:0.1172332763671875,d:0.313751220703125,tx:4.65,ty:-20.1}},
				{type:'dia',mat:{a:0.4889373779296875,b:0,c:0,d:0.9688720703125,tx:-0.8,ty:-28.85}},
			],
			[
				{type:'anim',anim:0,offset:15,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:7.5,ty:-22.65}},
				{type:'body',mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.05,ty:-41.75}},
				{type:'static',bodypart:0,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:5,ty:-39.6}},
				{type:'static',bodypart:36,mat:{a:0.194427490234375,b:0,c:0,d:0.329345703125,tx:2.8,ty:-29.45}},
				{type:'anim',anim:0,offset:0,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:-4.55,ty:-22.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:0.322235107421875,b:-0.090789794921875,c:0.090789794921875,d:0.322235107421875,tx:6.2,ty:-19.95}},
				{type:'body',mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.55,ty:-40.85}},
				{type:'static',bodypart:0,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:4.2,ty:-38.7}},
				{type:'static',bodypart:2,mat:{a:0.313751220703125,b:0.1172332763671875,c:-0.1172332763671875,d:0.313751220703125,tx:-4.05,ty:-20.1}},
				{type:'dia',mat:{a:-0.4889373779296875,b:0,c:0,d:0.9688720703125,tx:1.4,ty:-28.85}},
			],
			[
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:0.999664306640625,b:-0.022705078125,c:0.022705078125,d:0.999664306640625,tx:-3.05,ty:-25.7}},
				{type:'body',mat:{a:0.33477783203125,b:0.0128631591796875,c:-0.0128631591796875,d:0.33477783203125,tx:2.45,ty:-41.05}},
				{type:'static',bodypart:0,mat:{a:-0.33477783203125,b:-0.0128631591796875,c:-0.0128631591796875,d:0.33477783203125,tx:-1.3,ty:-39.05}},
				{type:'static',bodypart:37,mat:{a:-0.194244384765625,b:-0.0074615478515625,c:-0.0112762451171875,d:0.2929840087890625,tx:0.55,ty:-28.7}},
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:-0.999664306640625,b:0.022705078125,c:0.022705078125,d:0.999664306640625,tx:6.7,ty:-25.1}},
			],
			[
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:-0.999755859375,b:-0.01812744140625,c:-0.01812744140625,d:0.999755859375,tx:5.05,ty:-25.2}},
				{type:'body',mat:{a:-0.334716796875,b:0.014404296875,c:0.014404296875,d:0.334716796875,tx:-0.5,ty:-40.5}},
				{type:'static',bodypart:0,mat:{a:0.334716796875,b:-0.014404296875,c:0.014404296875,d:0.334716796875,tx:3.25,ty:-38.55}},
				{type:'static',bodypart:37,mat:{a:0.1941986083984375,b:-0.0083465576171875,c:0.012603759765625,d:0.2929229736328125,tx:1.45,ty:-28.2}},
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:0.999755859375,b:0.01812744140625,c:-0.01812744140625,d:0.999755859375,tx:-4.65,ty:-24.6}},
			],
			[
				{type:'static',bodypart:3,mat:{a:0.02471923828125,b:-0.3337860107421875,c:-0.3337860107421875,d:-0.0247039794921875,tx:-3.5,ty:-20.2}},
				{type:'body',mat:{a:0.3344268798828125,b:0.0204620361328125,c:-0.0204620361328125,d:0.3344268798828125,tx:3.4,ty:-40.75}},
				{type:'static',bodypart:38,mat:{a:-0.19403076171875,b:-0.011871337890625,c:-0.017913818359375,d:0.29266357421875,tx:1.2,ty:-28.45}},
				{type:'static',bodypart:39,mat:{a:-0.3344268798828125,b:-0.0204620361328125,c:-0.0204620361328125,d:0.3344268798828125,tx:-0.4,ty:-38.85}},
				{type:'static',bodypart:3,mat:{a:0.02471923828125,b:-0.3337860107421875,c:-0.3337860107421875,d:-0.0247039794921875,tx:7.25,ty:-20.2}},
			],
			[
				{type:'static',bodypart:3,mat:{a:-0.02471923828125,b:-0.3337860107421875,c:0.3337860107421875,d:-0.0247039794921875,tx:5.55,ty:-20.2}},
				{type:'body',mat:{a:-0.3344268798828125,b:0.0204620361328125,c:0.0204620361328125,d:0.3344268798828125,tx:-1.35,ty:-40.75}},
				{type:'static',bodypart:38,mat:{a:0.19403076171875,b:-0.011871337890625,c:0.017913818359375,d:0.29266357421875,tx:0.85,ty:-28.45}},
				{type:'static',bodypart:39,mat:{a:0.33441162109375,b:-0.0204620361328125,c:0.0204620361328125,d:0.33441162109375,tx:2.45,ty:-38.85}},
				{type:'static',bodypart:3,mat:{a:-0.02471923828125,b:-0.3337860107421875,c:0.3337860107421875,d:-0.0247039794921875,tx:-5.2,ty:-20.2}},
			],
			[
				{type:'static',bodypart:3,mat:{a:0.247894287109375,b:-0.2249298095703125,c:-0.2249298095703125,d:-0.247894287109375,tx:-4.9,ty:-20.15}},
				{type:'body',mat:{a:0.334869384765625,b:0.011962890625,c:-0.011962890625,d:0.334869384765625,tx:1.5,ty:-40.85}},
				{type:'static',bodypart:5,mat:{a:-0.19427490234375,b:-0.0069427490234375,c:-0.011749267578125,d:0.3291015625,tx:-0.05,ty:-30.75}},
				{type:'static',bodypart:4,mat:{a:-0.334869384765625,b:-0.011962890625,c:-0.011962890625,d:0.334869384765625,tx:-1.95,ty:-41.55}},
				{type:'static',bodypart:3,mat:{a:-0.1793365478515625,b:-0.380706787109375,c:0.3028411865234375,d:-0.1426544189453125,tx:5.35,ty:-20}},
			],
			[
				{type:'static',bodypart:3,mat:{a:-0.247894287109375,b:-0.2249298095703125,c:0.2249298095703125,d:-0.247894287109375,tx:5.95,ty:-20.15}},
				{type:'body',mat:{a:-0.334869384765625,b:0.011962890625,c:0.011962890625,d:0.334869384765625,tx:-0.45,ty:-40.85}},
				{type:'static',bodypart:5,mat:{a:0.19427490234375,b:-0.0069427490234375,c:0.011749267578125,d:0.3291015625,tx:1.1,ty:-30.75}},
				{type:'static',bodypart:4,mat:{a:0.334869384765625,b:-0.011962890625,c:0.011962890625,d:0.334869384765625,tx:3,ty:-41.55}},
				{type:'static',bodypart:3,mat:{a:0.1793365478515625,b:-0.380706787109375,c:-0.3028411865234375,d:-0.1426544189453125,tx:-4.3,ty:-20}},
			],
			[
				{type:'armroot',id:0,pos:{x:-6.15,y:-20.1}},
				{type:'body',mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.05,ty:-40.85}},
				{type:'static',bodypart:0,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:-3.6,ty:-38.7}},
				{type:'static',bodypart:36,mat:{a:-0.194427490234375,b:0,c:0,d:0.329345703125,tx:-1.4,ty:-28.55}},
				{type:'armroot',id:1,pos:{x:5.4,y:-20.1}},
			],
			[
				{type:'armroot',id:0,pos:{x:6.75,y:-20.1}},
				{type:'body',mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.55,ty:-40.85}},
				{type:'static',bodypart:0,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:4.2,ty:-38.7}},
				{type:'static',bodypart:36,mat:{a:0.194427490234375,b:0,c:0,d:0.329345703125,tx:2,ty:-28.55}},
				{type:'armroot',id:1,pos:{x:-4.8,y:-20.1}},
			],
			[
				{type:'armroot',id:0,pos:{x:-6.15,y:-20.1}},
				{type:'armroot',id:1,pos:{x:7.2,y:-20.1}},
				{type:'body',mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.2,ty:-40.85}},
				{type:'static',bodypart:0,mat:{a:-0.20111083984375,b:0,c:0,d:0.3351287841796875,tx:-5.15,ty:-38.7}},
				{type:'static',bodypart:36,mat:{a:-0.1166839599609375,b:0,c:0,d:0.329345703125,tx:-3.8,ty:-28.55}},
			],
			[
				{type:'armroot',id:0,pos:{x:6.9,y:-20.1}},
				{type:'armroot',id:1,pos:{x:-6.3,y:-20.1}},
				{type:'body',mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.1,ty:-40.85}},
				{type:'static',bodypart:0,mat:{a:0.20111083984375,b:0,c:0,d:0.3351287841796875,tx:5.8,ty:-38.7}},
				{type:'static',bodypart:36,mat:{a:0.1166839599609375,b:0,c:0,d:0.329345703125,tx:4.45,ty:-28.55}},
			]
		]
	},
	{
		// Pencil
		torsomat: {a:0.9736328125,b:0,c:0,d:0.9736328125,tx:-0.2,ty:-8.75},
		legx: [-2.45, 5.1],
		legy: [-11.25, -11.25],
		firemat: {a:-0.16912841796875,b:0.0142822265625,c:0.031341552734375,d:0.6383819580078125,tx:-3.65,ty:-58.2},
		charimgmat: {a:0.10894775390625,b:-0.003753662109375,c:0.003753662109375,d:0.10894775390625,tx:-0.2,ty:-1.4},
		burstmat: {a:0.557373046875,b:0,c:0,d:1.2081451416015625,tx:-2.65,ty:-42.2},
		defaultExpr: 0,
		mouthType: 0,
		frames: [
			[
				{type:'anim',anim:0,offset:15,loop:true,mat:{a:1,b:0,c:0,d:1,tx:-4.55,ty:-20.4}},
				{type:'body',mat:{a:0.333160400390625,b:-0.035125732421875,c:0.035125732421875,d:0.333160400390625,tx:-2.5,ty:-39.2}},
				{type:'static',bodypart:0,mat:{a:-0.333160400390625,b:0.035125732421875,c:0.035125732421875,d:0.333160400390625,tx:-7.1,ty:-36.05}},
				{type:'static',bodypart:36,mat:{a:-0.1932830810546875,b:0.0203857421875,c:0.034515380859375,d:0.327423095703125,tx:-3.85,ty:-26.2}},
				{type:'anim',anim:0,offset:0,loop:true,mat:{a:1,b:0,c:0,d:1,tx:5.95,ty:-20.4}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-0.322235107421875,b:-0.090789794921875,c:-0.090789794921875,d:0.322235107421875,tx:-5.25,ty:-18.95}},
				{type:'body',mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:1.4,ty:-39.85}},
				{type:'static',bodypart:0,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:-3.25,ty:-37.2}},
				{type:'static',bodypart:2,mat:{a:-0.313751220703125,b:0.1172332763671875,c:0.1172332763671875,d:0.313751220703125,tx:6.5,ty:-19.1}},
				{type:'dia',mat:{a:0.555206298828125,b:0,c:0,d:0.8481903076171875,tx:-0.25,ty:-27.2}},
			],
			[
				{type:'anim',anim:0,offset:15,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:7.45,ty:-20.4}},
				{type:'body',mat:{a:-0.333160400390625,b:-0.035125732421875,c:-0.035125732421875,d:0.333160400390625,tx:5.4,ty:-39.2}},
				{type:'static',bodypart:0,mat:{a:0.333160400390625,b:0.035125732421875,c:-0.035125732421875,d:0.333160400390625,tx:10,ty:-36.05}},
				{type:'static',bodypart:36,mat:{a:0.1932830810546875,b:0.0203857421875,c:-0.034515380859375,d:0.327423095703125,tx:6.75,ty:-26.2}},
				{type:'anim',anim:0,offset:0,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:-3.05,ty:-20.4}},
			],
			[
				{type:'static',bodypart:2,mat:{a:0.322235107421875,b:-0.090789794921875,c:0.090789794921875,d:0.322235107421875,tx:7.45,ty:-18.95}},
				{type:'body',mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.8,ty:-39.85}},
				{type:'static',bodypart:0,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:4.2,ty:-38.7}},
				{type:'static',bodypart:2,mat:{a:0.313751220703125,b:0.1172332763671875,c:-0.1172332763671875,d:0.313751220703125,tx:-4.3,ty:-19.1}},
				{type:'dia',mat:{a:-0.555206298828125,b:0,c:0,d:0.8481903076171875,tx:2.45,ty:-27.2}},
			],
			[
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:0.9993896484375,b:-0.0311737060546875,c:0.0311737060546875,d:0.9993896484375,tx:-4.05,ty:-24.5}},
				{type:'body',mat:{a:0.334869384765625,b:0.0100250244140625,c:-0.0100250244140625,d:0.334869384765625,tx:2.45,ty:-39.9}},
				{type:'static',bodypart:0,mat:{a:-0.334869384765625,b:-0.0100250244140625,c:-0.0100250244140625,d:0.334869384765625,tx:-2.4,ty:-37.85}},
				{type:'static',bodypart:37,mat:{a:-0.19427490234375,b:-0.005828857421875,c:-0.0087738037109375,d:0.293060302734375,tx:-0.5,ty:-27.5}},
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:-0.9993896484375,b:0.0311737060546875,c:0.0311737060546875,d:0.9993896484375,tx:5.7,ty:-24}},
			],
			[
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:-0.9992523193359375,b:-0.0352020263671875,c:-0.0352020263671875,d:0.9992523193359375,tx:6.75,ty:-24.55}},
				{type:'body',mat:{a:-0.33489990234375,b:0.0086669921875,c:0.0086669921875,d:0.33489990234375,tx:0.35,ty:-39.9}},
				{type:'static',bodypart:0,mat:{a:0.33489990234375,b:-0.0086669921875,c:0.0086669921875,d:0.33489990234375,tx:5.15,ty:-37.85}},
				{type:'static',bodypart:37,mat:{a:0.1942901611328125,b:-0.0050201416015625,c:0.007598876953125,d:0.2930755615234375,tx:3.2,ty:-27.55}},
				{type:'anim',anim:2,offset:0,loop:false,mat:{a:0.9992523193359375,b:0.0352020263671875,c:-0.0352020263671875,d:0.9992523193359375,tx:-3,ty:-24.05}},
			],
			[
				{type:'static',bodypart:3,mat:{a:0.02471923828125,b:-0.3337860107421875,c:-0.3337860107421875,d:-0.0247039794921875,tx:-4.45,ty:-20.75}},
				{type:'body',mat:{a:0.3344268798828125,b:0.0204620361328125,c:-0.0204620361328125,d:0.3344268798828125,tx:3.4,ty:-39.75}},
				{type:'static',bodypart:1,mat:{a:-0.19403076171875,b:-0.011871337890625,c:-0.017913818359375,d:0.29266357421875,tx:0.2,ty:-27.2}},
				{type:'static',bodypart:0,mat:{a:-0.3344268798828125,b:-0.0204620361328125,c:-0.0204620361328125,d:0.3344268798828125,tx:-1.15,ty:-37.85}},
				{type:'static',bodypart:3,mat:{a:0.02471923828125,b:-0.3337860107421875,c:-0.3337860107421875,d:-0.0247039794921875,tx:6.35,ty:-20.75}},
			],
			[
				{type:'static',bodypart:3,mat:{a:-0.02471923828125,b:-0.3337860107421875,c:0.3337860107421875,d:-0.0247039794921875,tx:6.4,ty:-20.75}},
				{type:'body',mat:{a:-0.3344268798828125,b:0.0204620361328125,c:0.0204620361328125,d:0.3344268798828125,tx:-1.45,ty:-39.75}},
				{type:'static',bodypart:1,mat:{a:0.19403076171875,b:-0.011871337890625,c:0.017913818359375,d:0.29266357421875,tx:1.75,ty:-27.2}},
				{type:'static',bodypart:0,mat:{a:0.3344268798828125,b:-0.0204620361328125,c:0.0204620361328125,d:0.3344268798828125,tx:3.1,ty:-37.85}},
				{type:'static',bodypart:3,mat:{a:-0.02471923828125,b:-0.3337860107421875,c:0.3337860107421875,d:-0.0247039794921875,tx:-4.4,ty:-20.75}},
			],
			[
				{type:'anim',anim:3,offset:0,loop:true,mat:{a:0.2680206298828125,b:-0.1997222900390625,c:-0.1997222900390625,d:-0.2680206298828125,tx:-5.7,ty:-23.55}},
				{type:'body',mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.95,ty:-39.85}},
				{type:'static',bodypart:5,mat:{a:-0.194427490234375,b:0,c:0,d:0.329345703125,tx:-1.75,ty:-27.05}},
				{type:'static',bodypart:40,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:-3.7,ty:-37.2}},
				{type:'anim',anim:3,offset:0,loop:true,mat:{a:-0.2680206298828125,b:-0.1997222900390625,c:0.1997222900390625,d:-0.2680206298828125,tx:5.75,ty:-25.4}},
			],
			[
				{type:'anim',anim:3,offset:0,loop:true,bodypart:3,mat:{a:-0.2680206298828125,b:-0.1997222900390625,c:0.1997222900390625,d:-0.2680206298828125,tx:6.8,ty:-23.55}},
				{type:'body',mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.15,ty:-39.85}},
				{type:'static',bodypart:5,mat:{a:0.194427490234375,b:0,c:0,d:0.329345703125,tx:2.85,ty:-27.05}},
				{type:'static',bodypart:40,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:4.8,ty:-37.2}},
				{type:'anim',anim:3,offset:0,loop:true,bodypart:3,mat:{a:0.2680206298828125,b:-0.1997222900390625,c:-0.1997222900390625,d:-0.2680206298828125,tx:-4.65,ty:-25.4}},
			],
			[
				{type:'armroot',id:0,pos:{x:-6.4,y:-21.2}},
				{type:'body',mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.8,ty:-40.1}},
				{type:'static',bodypart:0,mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:-3.85,ty:-37.95}},
				{type:'static',bodypart:36,mat:{a:-0.194427490234375,b:0,c:0,d:0.329345703125,tx:-1.65,ty:-27.8}},
				{type:'armroot',id:1,pos:{x:5.65,y:-21.2}},
			],
			[
				{type:'armroot',id:0,pos:{x:8.55,y:-21.2}},
				{type:'body',mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:1.35,ty:-40.1}},
				{type:'static',bodypart:0,mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:6,ty:-37.95}},
				{type:'static',bodypart:36,mat:{a:0.194427490234375,b:0,c:0,d:0.329345703125,tx:3.8,ty:-27.8}},
				{type:'armroot',id:1,pos:{x:-3.5,y:-21.2}},
			],
			[
				{type:'armroot',id:0,pos:{x:-6.4,y:-21.2}},
				{type:'armroot',id:1,pos:{x:8,y:-21.2}},
				{type:'body',mat:{a:0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:0.8,ty:-40.1}},
				{type:'static',bodypart:0,mat:{a:-0.17022705078125,b:0,c:0,d:0.3351287841796875,tx:-5.35,ty:-38.25}},
				{type:'static',bodypart:36,mat:{a:-0.0987548828125,b:0,c:0,d:0.329345703125,tx:-4.25,ty:-28.1}},
			],
			[
				{type:'armroot',id:0,pos:{x:8.55,y:-20.45}},
				{type:'armroot',id:1,pos:{x:-5.85,y:-20.45}},
				{type:'body',mat:{a:-0.3351287841796875,b:0,c:0,d:0.3351287841796875,tx:1.35,ty:-40.1}},
				{type:'static',bodypart:0,mat:{a:0.20745849609375,b:0,c:0,d:0.3351287841796875,tx:6.7,ty:-37.95}},
				{type:'static',bodypart:36,mat:{a:0.120361328125,b:0,c:0,d:0.329345703125,tx:5.35,ty:-27.8}},
			]
		]
	},
	{
		// Bubble
		torsomat: {a:0.87811279296875,b:0,c:0,d:0.87811279296875,tx:-0.7,ty:-3},
		legx: [-5.1, 10.85],
		legy: [-11.25, -11.25],
		firemat: {a:0.8855438232421875,b:0,c:0,d:1,tx:1.8,ty:-4.75},
		charimgmat: {a:0.126861572265625,b:0,c:0,d:0.126861572265625,tx:-0.1,ty:-0.3},
		burstmat: {a:1.35589599609375,b:0,c:0,d:1.2286834716796875,tx:1.8,ty:-39.65},
		defaultExpr: 0,
		mouthType: 0,
		frames: [
			[
				{type:'anim',anim:0,offset:15,loop:true,mat:{a:1,b:0,c:0,d:1,tx:-26.55,ty:-24.15}},
				{type:'body',mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.9,ty:-42}},
				{type:'static',bodypart:36,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-15.75,ty:-28.25}},
				{type:'static',bodypart:0,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-9.25,ty:-44.2}},
				{type:'static',bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-24.95,ty:-43.95}},
				{type:'anim',anim:0,offset:0,loop:true,mat:{a:1,b:0,c:0,d:1,tx:20.95,ty:-26.15}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-0.3739166259765625,b:-0.0296478271484375,c:-0.02886962890625,d:0.3636322021484375,tx:-26.25,ty:-23.9}},
				{type:'body',mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.35,ty:-42}},
				{type:'dia',mat:{a:1,b:0,c:0,d:1,tx:-14.9,ty:-27.95}},
				{type:'static',bodypart:0,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-9.8,ty:-44.2}},
				{type:'static',bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-25.5,ty:-43.95}},
				{type:'static',bodypart:2,mat:{a:-0.3738250732421875,b:0.0201416015625,c:0.0196075439453125,d:0.3635406494140625,tx:23.75,ty:-23.85}},
			],
			[
				{type:'anim',anim:0,offset:15,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:32.2,ty:-24.15}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.75,ty:-42}},
				{type:'static',bodypart:36,mat:{a:0.400299072265625,b:0,c:0,d:0.400299072265625,tx:21.4,ty:-28.25}},
				{type:'static',bodypart:0,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:30.6,ty:-43.95}},
				{type:'static',bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:14.9,ty:-44.2}},
				{type:'anim',anim:0,offset:0,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:-15.3,ty:-26.15}},
			],
			[
				{type:'static',bodypart:2,mat:{a:0.3739166259765625,b:-0.0296478271484375,c:0.02886962890625,d:0.3636322021484375,tx:31.4,ty:-23.9}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.8,ty:-42}},
				{type:'dia',mat:{a:-1,b:0,c:0,d:1,tx:20.05,ty:-27.95}},
				{type:'static',bodypart:0,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:30.6,ty:-43.95}},
				{type:'static',bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:14.9,ty:-44.2}},
				{type:'static',bodypart:2,mat:{a:0.3738250732421875,b:0.0201416015625,c:-0.0196075439453125,d:0.3635406494140625,tx:-18.6,ty:-23.85}},
			],
			[
				{type:'anim',anim:1,offset:0,loop:false,mat:{a:1,b:0,c:0,d:1,tx:-30.9,ty:-34.05}},
				{type:'body',mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:1.9,ty:-42}},
				{type:'static',bodypart:36,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-16.75,ty:-28.25}},
				{type:'static',bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-25.95,ty:-43.95}},
				{type:'static',bodypart:0,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-10.25,ty:-44.2}},
				{type:'anim',anim:1,offset:0,loop:false,mat:{a:-1,b:0,c:0,d:1,tx:18.65,ty:-34.6}},
			],
			[
				{type:'anim',anim:1,offset:0,loop:false,mat:{a:-1,b:0,c:0,d:1,tx:35.4,ty:-34.05}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.6,ty:-42}},
				{type:'static',bodypart:36,mat:{a:0.400299072265625,b:0,c:0,d:0.400299072265625,tx:21.25,ty:-28.25}},
				{type:'static',bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:14.75,ty:-44.2}},
				{type:'static',bodypart:0,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:30.45,ty:-43.95}},
				{type:'anim',anim:1,offset:0,loop:false,mat:{a:1,b:0,c:0,d:1,tx:-14.15,ty:-34.6}},
			],
			[
				{type:'static',bodypart:3,mat:{a:0.0090179443359375,b:-0.382843017578125,c:-0.3640899658203125,d:-0.0085601806640625,tx:-26.85,ty:-25.15}},
				{type:'body',mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:1.9,ty:-42}},
				{type:'static',bodypart:36,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-16.75,ty:-28.25}},
				{type:'static',bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-25.95,ty:-43.95}},
				{type:'static',bodypart:0,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-10.25,ty:-44.2}},
				{type:'static',bodypart:3,mat:{a:0.0090179443359375,b:-0.382843017578125,c:-0.3640899658203125,d:-0.0085601806640625,tx:2.2,ty:-24.85}},
			],
			[
				{type:'static',bodypart:3,mat:{a:-0.0090179443359375,b:-0.382843017578125,c:0.3640899658203125,d:-0.0085601806640625,tx:31.7,ty:-25.15}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.95,ty:-42}},
				{type:'static',bodypart:36,mat:{a:0.400299072265625,b:0,c:0,d:0.400299072265625,tx:21.25,ty:-28.25}},
				{type:'static',bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:14.75,ty:-44.2}},
				{type:'static',bodypart:0,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:30.45,ty:-43.95}},
				{type:'static',bodypart:3,mat:{a:-0.0090179443359375,b:-0.382843017578125,c:0.3640899658203125,d:-0.0085601806640625,tx:2.65,ty:-23.8}},
			],
			[
				{type:'static',bodypart:47,mat:{a:0.606903076171875,b:0,c:0,d:0.606903076171875,tx:4.3,ty:-65.55}},
			],
			[
				{type:'static',bodypart:47,mat:{a:0.606903076171875,b:0,c:0,d:0.606903076171875,tx:4.3,ty:-65.55}},
			],
			[
				{type:'armroot',id:0,pos:{x:-26.25,y:-22.9}},
				{type:'body',mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.35,ty:-42}},
				{type:'static',bodypart:36,mat:{a:-0.400299072265625,b:0,c:0,d:0.400299072265625,tx:-16.3,ty:-28.25}},
				{type:'static',bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-25.5,ty:-43.95}},
				{type:'static',bodypart:0,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:-9.8,ty:-44.2}},
				{type:'armroot',id:1,pos:{x:23.3,y:-22.9}},
			],
			[
				{type:'armroot',id:0,pos:{x:29.35,y:-22.9}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.35,ty:-42}},
				{type:'static',bodypart:36,mat:{a:0.400299072265625,b:0,c:0,d:0.400299072265625,tx:21,ty:-28.25}},
				{type:'static',bodypart:0,mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:14.5,ty:-44.2}},
				{type:'static',bodypart:0,mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:30.2,ty:-43.95}},
				{type:'armroot',id:1,pos:{x:-20.2,y:-22.9}},
			],
			[
				{type:'armroot',id:0,pos:{x:-27.95,y:-22.9}},
				{type:'armroot',id:1,pos:{x:31.8,y:-22.9}},
				{type:'body',mat:{a:0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.35,ty:-42}},
				{type:'static',bodypart:36,mat:{a:-0.1955413818359375,b:0,c:0,d:0.400299072265625,tx:-25.8,ty:-29.65}},
				{type:'static',bodypart:0,mat:{a:0.193145751953125,b:0,c:0,d:0.3648529052734375,tx:-30.55,ty:-43.05}},
			],
			[
				{type:'armroot',id:0,pos:{x:31.05,y:-22.9}},
				{type:'armroot',id:1,pos:{x:-27,y:-22.9}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.35,ty:-42}},
				{type:'static',bodypart:36,mat:{a:0.1955413818359375,b:0,c:0,d:0.400299072265625,tx:30.5,ty:-29.65}},
				{type:'static',bodypart:0,mat:{a:-0.193145751953125,b:0,c:0,d:0.3648529052734375,tx:35.25,ty:-43.05}},
			]
		]
	},
	{
		// Lego Brick
		torsomat: {a:0.2733306884765625,b:0,c:0,d:0.273284912109375,tx:-26,ty:-49.75},
		legx: [-7.9, 12.5],
		legy: [-12, -11.85],
		firemat: {a:0.8855438232421875,b:0,c:0,d:1,tx:-0.2,ty:0.05},
		charimgmat: {a:0.116455078125,b:0,c:0,d:0.116455078125,tx:0.4,ty:20.05},
		burstmat: {a:1.35589599609375,b:0,c:0,d:0.9438323974609375,tx:2.55,ty:-22.5},
		defaultExpr: 0,
		mouthType: 0,
		frames: [
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:48,mat:{a:1,b:0,c:0,d:1,tx:93.2,ty:25.95}},
				{type:'static',bodypart:49,mat:{a:-2.3869781494140625,b:0,c:0.0482177734375,d:2.29827880859375,tx:96.75,ty:73.45}},
			],
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:95.1,ty:139.35}},
				{type:'dia',mat:{a:4.6165771484375,b:0,c:0,d:4.6165771484375,tx:97.65,ty:82.35}},
				{type:'static',bodypart:48,mat:{a:1,b:0,c:0,d:1,tx:93.2,ty:25.95}},
			],
			[
				{type:'body',mat:{a:-1,b:0,c:0,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:48,mat:{a:-1,b:0,c:0,d:1,tx:93.2,ty:25.95}},
				{type:'static',bodypart:49,mat:{a:2.3869781494140625,b:0,c:-0.0482177734375,d:2.29827880859375,tx:93.45,ty:73.45}},
			],
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:95.1,ty:139.35}},
				{type:'dia',mat:{a:-4.6165771484375,b:0,c:0,d:4.6165771484375,tx:97.65,ty:82.35}},
				{type:'static',bodypart:48,mat:{a:1,b:0,c:0,d:1,tx:93.2,ty:25.95}},
			],
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:48,mat:{a:1,b:0,c:0,d:1,tx:93.2,ty:25.95}},
				{type:'static',bodypart:50,mat:{a:-2.0886993408203125,b:0,c:-0.0366058349609375,d:1.745025634765625,tx:97.05,ty:76.75}},
			],
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:48,mat:{a:1,b:0,c:0,d:1,tx:93.2,ty:25.95}},
				{type:'static',bodypart:50,mat:{a:2.0886993408203125,b:0,c:0.0366058349609375,d:1.745025634765625,tx:89.1,ty:77.65}},
			],
			[],
			[],
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:40,mat:{a:1.5439453125,b:0,c:0,d:1.5439453125,tx:51.85,ty:40.95}},
				{type:'static',bodypart:40,mat:{a:-1.5439453125,b:0,c:0,d:1.5439453125,tx:134.55,ty:40.95}},
				{type:'static',bodypart:5,mat:{a:-2.0886993408203125,b:0,c:-0.0366058349609375,d:1.745025634765625,tx:93,ty:77.2}},
			],
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:40,mat:{a:1.5439453125,b:0,c:0,d:1.5439453125,tx:58.25,ty:40.95}},
				{type:'static',bodypart:40,mat:{a:-1.5439453125,b:0,c:0,d:1.5439453125,tx:140.95,ty:40.95}},
				{type:'static',bodypart:5,mat:{a:2.0886993408203125,b:0,c:0.0366058349609375,d:1.745025634765625,tx:99.8,ty:77.2}},
			],
			[],
			[],
			[],
			[]
		]
	},
	{
		// Waffle
		torsomat: {a:0.2268524169921875,b:0,c:0,d:0.22625732421875,tx:-23.45,ty:-42.7},
		legx: [-10.15, 16],
		legy: [-12.25, -11.7],
		firemat: {a:1.8939666748046875,b:0,c:0,d:1.1790008544921875,tx:2.05,ty:0},
		charimgmat: {a:-0.06329345703125,b:0,c:0,d:0.0632781982421875,tx:-0.6,ty:18.65},
		burstmat: {a:1.55078125,b:0,c:0,d:1.09588623046875,tx:1.55,ty:-36.75},
		defaultExpr: 0,
		mouthType: 1,
		frames: [
			[
				{type:'body',mat:{a:-1,b:0,c:0,d:1,tx:101.7,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:-1.33612060546875,b:0,c:0.0269927978515625,d:1.2864837646484375,tx:52.7,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:-1.33612060546875,b:0,c:0.0269927978515625,d:1.2864837646484375,tx:153.3,ty:-19.15}},
				{type:'static',bodypart:51,mat:{a:-1.81903076171875,b:0,c:0.0367431640625,d:1.7514495849609375,tx:99.65,ty:52.8}},
			],
			[
				{type:'body',mat:{a:-1,b:0,c:0,d:1,tx:101.7,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:-1.33612060546875,b:0,c:0.0269927978515625,d:1.2864837646484375,tx:52.7,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:-1.33612060546875,b:0,c:0.0269927978515625,d:1.2864837646484375,tx:153.3,ty:-19.15}},
				{type:'dia',mat:{a:4.6165771484375,b:0,c:0,d:4.6165771484375,tx:104.55,ty:58.9}},
			],
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:105.2,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:1.33612060546875,b:0,c:-0.0269927978515625,d:1.2864837646484375,tx:53.6,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:1.33612060546875,b:0,c:-0.0269927978515625,d:1.2864837646484375,tx:154.2,ty:-19.15}},
				{type:'static',bodypart:51,mat:{a:1.81903076171875,b:0,c:-0.0367431640625,d:1.7514495849609375,tx:107.25,ty:52.8}},
			],
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:105.2,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:-1.33612060546875,b:0,c:0.0269927978515625,d:1.2864837646484375,tx:52.7,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:-1.33612060546875,b:0,c:0.0269927978515625,d:1.2864837646484375,tx:153.3,ty:-19.15}},
				{type:'dia',mat:{a:-4.6165771484375,b:0,c:0,d:4.6165771484375,tx:104.55,ty:58.9}},
			],
			[
				{type:'body',mat:{a:-1,b:0,c:0,d:1,tx:101.7,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:-1.33612060546875,b:0,c:0.0269927978515625,d:1.2864837646484375,tx:52.7,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:-1.33612060546875,b:0,c:0.0269927978515625,d:1.2864837646484375,tx:153.3,ty:-19.15}},
				{type:'static',bodypart:52,mat:{a:-1.81903076171875,b:0,c:0.0367431640625,d:1.7514495849609375,tx:99.65,ty:52.8}},
			],
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:105.2,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:-1.33612060546875,b:0,c:0.0269927978515625,d:1.2864837646484375,tx:52.7,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:-1.33612060546875,b:0,c:0.0269927978515625,d:1.2864837646484375,tx:153.3,ty:-19.15}},
				{type:'static',bodypart:52,mat:{a:1.81903076171875,b:0,c:-0.0367431640625,d:1.7514495849609375,tx:106.45,ty:52.8}},
			],
			[],
			[],
			[
				{type:'body',mat:{a:-1,b:0,c:0,d:1,tx:101.7,ty:139.35}},
				{type:'static',bodypart:40,mat:{a:1.5439453125,b:0,c:0,d:1.5439453125,tx:65,ty:-6.75}},
				{type:'static',bodypart:40,mat:{a:-1.5439453125,b:0,c:0,d:1.5439453125,tx:147.7,ty:-3.45}},
				{type:'static',bodypart:56,mat:{a:1.81903076171875,b:0,c:-0.0367431640625,d:1.7514495849609375,tx:106.45,ty:52.8}},
			],
			[
				{type:'body',mat:{a:1,b:0,c:0,d:1,tx:105.2,ty:139.35}},
				{type:'static',bodypart:40,mat:{a:1.5439453125,b:0,c:0,d:1.5439453125,tx:54.95,ty:-3.45}},
				{type:'static',bodypart:40,mat:{a:-1.5439453125,b:0,c:0,d:1.5439453125,tx:137.65,ty:-3.45}},
				{type:'static',bodypart:56,mat:{a:-1.81903076171875,b:0,c:0.0367431640625,d:1.7514495849609375,tx:96.2,ty:52.8}},
			],
			[],
			[],
			[],
			[]
		]
	},
	{
		// Tune
		torsomat: {a:0.87811279296875,b:0,c:0,d:0.87811279296875,tx:-0.7,ty:-3},
		legx: [-4.45, 7.7],
		legy: [-11.25, -11.25],
		firemat: {a:0.757598876953125,b:0,c:0,d:1,tx:2.3,ty:-2.5},
		charimgmat: {a:-0.112091064453125,b:0,c:0,d:0.112091064453125,tx:8.05,ty:-5.8},
		burstmat: {a:0.794342041015625,b:0,c:0,d:0.952484130859375,tx:1.55,ty:-29.75},
		defaultExpr: 0,
		frames: [
			[
				{type:'static',bodypart:57,mat:{a:-0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:29.95,ty:-51.95}},
			],
			[
				{type:'anim',anim:4,offset:0,loop:true,mat:{a:1,b:0,c:0,d:1,tx:2.5,ty:-2}},
			],
			[
				{type:'static',bodypart:57,mat:{a:0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:-25.35,ty:-51.95}},
			],
			[
				{type:'anim',anim:4,offset:0,loop:true,mat:{a:-1,b:0,c:0,d:1,tx:2.25,ty:-2}},
			],
			[
				{type:'static',bodypart:57,mat:{a:-0.305023193359375,b:-0.0296630859375,c:-0.0296630859375,d:0.305023193359375,tx:32.55,ty:-49.1}},
			],
			[
				{type:'static',bodypart:57,mat:{a:0.3050384521484375,b:-0.0294647216796875,c:0.0294647216796875,d:0.3050384521484375,tx:-28,ty:-49.1}},
			],
			[
				{type:'static',bodypart:58,mat:{a:-0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:29.95,ty:-51.95}},
			],
			[
				{type:'static',bodypart:58,mat:{a:0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:-25.05,ty:-51.95}},
			],
			[
				{type:'static',bodypart:59,mat:{a:-0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:29.95,ty:-51.95}},
			],
			[
				{type:'static',bodypart:59,mat:{a:0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:-25.05,ty:-51.95}},
			],
			[
				{type:'static',bodypart:60,mat:{a:-0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:29.95,ty:-51.95}},
				{type:'armroot',id:0,pos:{x:-12,y:-14.25}},
				{type:'armroot',id:1,pos:{x:14.6,y:-15.75}},
			],
			[
				{type:'static',bodypart:60,mat:{a:0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:-25.05,ty:-51.95}},
				{type:'armroot',id:0,pos:{x:-10.85,y:-15.75}},
				{type:'armroot',id:1,pos:{x:15.75,y:-14.25}},
			],
			[
				{type:'armroot',id:0,pos:{x:-3.6,y:-15.6}},
				{type:'static',bodypart:61,mat:{a:-0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:29.95,ty:-51.95}},
				{type:'armroot',id:1,pos:{x:-15.6,y:-15.6}},
			],
			[
				{type:'armroot',id:0,pos:{x:6.95,y:-15.6}},
				{type:'static',bodypart:61,mat:{a:0.3065643310546875,b:0,c:0,d:0.3065643310546875,tx:-25.05,ty:-51.95}},
				{type:'armroot',id:1,pos:{x:8.05,y:-15.6}},
			]
		]
	},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
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
// TODO: add the npcs to this? that might break something, so I'll wait to try it out.
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
var bubSc = 1;
var bubX = 0;
var bubY = 0;
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
var hprcCrankPos = {x:-29.5,y:-23.7}
var charDepths = [];
var tileDepths;
var doorLightX = [[27.5],[15,40],[10,27.5,45],[10,21.75,33.25,45],[4,16.25,27.5,38.75,50],[4,14,23,32,41,50]];
var doorLightFade = [0,0,0,0,0,0];
var doorLightFadeDire = [0,0,0,0,0,0];

// TODO: replace usages with this with String.padStart()
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
// I missed processing's map() function so much I wrote my own that I think I stole parts of from stackoverflow, but didn't link to.
function mapRange(value, min1, max1, min2, max2) {
	return min2 + (((value - min1) / (max1 - min1)) * (max2 - min2));
}





















// https://grabthiscode.com/javascript/check-if-file-exists-javascript
function doesFileExist(urlToFile) {
	var xhr = new XMLHttpRequest();
	xhr.open('HEAD', urlToFile, false);
	xhr.send();	
	return xhr.status !== 404;
}

// https://stackoverflow.com/questions/46399223/async-await-in-image-loading
async function asyncLoadImage(src) {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}
async function asyncLoadVB(src) {
	return new Promise((resolve, reject) => {
		let req = new XMLHttpRequest();
		req.open('GET', src);
		req.setRequestHeader("Content-Type", "image/svg+xml");
		req.onload = (event) => {
			let response = event.target.responseText;
			let doc = new DOMParser();
			let xml = doc.parseFromString(response, "image/svg+xml");
			let svg = xml.getElementsByTagName('svg')[0];
			resolve(svg.getAttribute('viewBox').split(' ').map(Number));
		}
		req.onerror = reject;
		req.send();
	});
}

function drawLoadingScreen(total, progress, w, h, pad) {
	ctx.fillRect((cwidth-w+pad)/2, (cheight+pad)/2, mapRange(progress, 0, total, 0, w-pad), h-pad);
}




var imgBgs = new Array(12);

var svgTiles = new Array(blockProperties.length);
var svgLevers = new Array(6);
var svgShadows = new Array(19);
var svgTileBorders = new Array(34);

var svgChars = new Array(charD.length);
var svgBodyParts = [];

// var svgHPRCBubble = new Array(4);
var svgHPRCBubble = new Array(3);
var svgCSBubble;
var svgHPRCCrank;

var svgCoin;
var svgCoinGet = new Array(11);
var svgFire = new Array(18);
var svgBurst = new Array(13);
var svgIceCubeMelt;

var svgCharsVB = new Array(charD.length);
var svgTilesVB = new Array(blockProperties.length);

var svgMenu0;
var svgMenu2;
var svgMenu2border;
var svgMenu2borderimg;
var preMenuBG;

var menu2_3Buttons = [];
var menu2_3Buttons = [];
var menu0ButtonSize = {w: 273.0, h: 36.9, cr: 6.65};
var menu2_3ButtonSize = {w: 104.5, h: 37.3};
var levelButtonSize = {w: 100, h: 40};
var menu0ButtonClicked = -1;
var onButton = false;
var menu2_3ButtonClicked = -1;
var levelButtonClicked = -1;

// also loads the resources.
async function loadingScreen() {
	// Initialize Canvas Stuff
	canvas = document.getElementById('cnv');
	ctx = canvas.getContext('2d');
	canvas.style.width = cwidth + "px";
	canvas.style.height = cheight + "px";
	// Account for Pixel Density
	canvas.width = Math.floor(cwidth * pixelRatio);
	canvas.height = Math.floor(cheight * pixelRatio);
	ctx.scale(pixelRatio, pixelRatio);

	// Hard-coded value. You can make it calculated later if you want.
	var totalResources = 1076;
	var loadedResources = 0;
	// Background
	ctx.fillStyle = '#999966';
	ctx.fillRect(0, 0, cwidth, cheight);
	// Text
	ctx.fillStyle = '#000000';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = '30px Helvetica';
	ctx.fillText('Loading Resources...', cwidth/2, cheight*0.4);
	// Bar
	var progressBarW = cwidth*0.6;
	var progressBarH = 40;
	var progressBarPad = 15;
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 2;
	ctx.strokeRect((cwidth-progressBarW)/2, cheight/2, progressBarW, progressBarH);
	ctx.fillStyle = '#4cccb3';


	var req = await fetch("data/levels.txt");
	var text = await req.text();
	levelsString = text;
	loadLevels();

	svgCSBubble = await asyncLoadImage('visuals/ui/csbubble/dia.svg');
	loadedResources++;
	drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	svgHPRCCrank = await asyncLoadImage('visuals/entities/e0035crank.svg');
	loadedResources++;
	drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	svgCoin = await asyncLoadImage('visuals/wintoken.svg');
	loadedResources++;
	drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	svgIceCubeMelt = await asyncLoadImage('visuals/effects/icecubemelt.svg');
	loadedResources++;
	drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);

	for (var i = 0; i < imgBgs.length; i++) {
		imgBgs[i] = await asyncLoadImage('visuals/bg/bg' + i.toString(10).padStart(4, '0') + '.png');
		loadedResources++;
		drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	}
	for (var i = 0; i < blockProperties.length; i++) {
		var id = i.toString(10).padStart(4, '0');
		if (blockProperties[i][16] < 1) continue;
		else if (blockProperties[i][16] == 1) {
			svgTiles[i] = await asyncLoadImage('visuals/blocks/b' + id + '.svg');
			svgTilesVB[i] = await asyncLoadVB(svgTiles[i].src);
			loadedResources++;
			drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
		} else {
			svgTiles[i] = new Array(blockProperties[i][16]);
			svgTilesVB[i] = new Array(blockProperties[i][16]);
			for (var j = 0; j < svgTiles[i].length; j++) {
				svgTiles[i][j] = await asyncLoadImage('visuals/blocks/b' + id + 'f' + j.toString(10).padStart(4, '0') + '.svg');
				svgTilesVB[i][j] = await asyncLoadVB(svgTiles[i][j].src);
				loadedResources++;
				drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
			}
		}
	}
	for (var i = 0; i < svgLevers.length; i++) {
		var filename = 'visuals/blocks/b' + i.toString(10).padStart(2, '0') + 'lever.svg';
		if (doesFileExist(filename)) {
			svgLevers[i] = await asyncLoadImage(filename);
			loadedResources++;
			drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
		}
	}
	for (var i = 0; i < svgShadows.length; i++) {
		svgShadows[i] = await asyncLoadImage('visuals/shadows/s' + i.toString(10).padStart(4, '0') + '.svg');
		loadedResources++;
		drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	}
	for (var i = 0; i < svgTileBorders.length; i++) {
		svgTileBorders[i] = await asyncLoadImage('visuals/borders/tb' + i.toString(10).padStart(4, '0') + '.svg');
		loadedResources++;
		drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	}
	for (var i = 0; i < charD.length; i++) {
		var id = i.toString(10).padStart(4, '0');
		if (charD[i][7] < 1) continue;
		else if (charD[i][7] == 1) {
			svgChars[i] = await asyncLoadImage('visuals/entities/e' + id + '.svg');
			svgCharsVB[i] = await asyncLoadVB(svgChars[i].src);
			loadedResources++;
			drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
		} else {
			svgChars[i] = new Array(charD[i][7]);
			svgCharsVB[i] = new Array(charD[i][7]);
			loadedResources++;
			for (var j = 0; j < svgChars[i].length; j++) {
				svgChars[i][j] = await asyncLoadImage('visuals/entities/e' + id + 'f' + j.toString(10).padStart(4, '0') + '.svg');
				svgCharsVB[i][j] = await asyncLoadVB(svgChars[i][j].src);
				loadedResources++;
				drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
			}
		}
	}
	for (var i = 0; i < svgHPRCBubble.length; i++) {
		svgHPRCBubble[i] = await asyncLoadImage('visuals/ui/hprcbubble/hprcbubble' + i.toString(10).padStart(4, '0') + '.svg');
		loadedResources++;
		drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	}
	for (var i = 0; doesFileExist('visuals/bodyparts/bp' + i.toString(10).padStart(4, '0') + '.svg'); i++) {
		svgBodyParts[i] = await asyncLoadImage('visuals/bodyparts/bp' + i.toString(10).padStart(4, '0') + '.svg');
		loadedResources++;
		drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	}
	for (var i = 0; i < svgCoinGet.length; i++) {
		svgCoinGet[i] = await asyncLoadImage('visuals/wtgetf' + i.toString(10).padStart(4, '0') + '.svg');
		loadedResources++;
		drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	}
	for (var i = 0; i < svgFire.length; i++) {
		svgFire[i] = await asyncLoadImage('visuals/effects/fire' + i.toString(10).padStart(4, '0') + '.svg');
		loadedResources++;
		drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	}
	for (var i = 0; i < svgBurst.length; i++) {
		svgBurst[i] = await asyncLoadImage('visuals/effects/burst' + i.toString(10).padStart(4, '0') + '.svg');
		loadedResources++;
		drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	}

	svgMenu0 = await asyncLoadImage('visuals/menu0.svg');
	loadedResources++;
	drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	svgMenu2 = await asyncLoadImage('visuals/menu2.svg');
	loadedResources++;
	drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	svgMenu2border = await asyncLoadImage('visuals/menu2border.svg');
	loadedResources++;
	drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	svgMenu2borderimg = await asyncLoadImage('visuals/bitmap737.jpg');
	loadedResources++;
	drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);
	preMenuBG = await asyncLoadImage('visuals/premenubg.png');
	loadedResources++;
	drawLoadingScreen(totalResources, loadedResources, progressBarW, progressBarH, progressBarPad);

	menu2_3Buttons.push(new Path2D('M 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nL 104.5 10.05\nM 98.75 7.6\nL 98.75 21.65\nQ 98.75 26.2 96.2 28.45 93.65 30.7 89.15 30.7 84.55 30.7 82.05 28.45 79.55 26.25 79.55 21.65\nL 79.55 7.6 84.5 7.6 84.5 21.65\nQ 84.5 22.55 84.65 23.45 84.8 24.35 85.3 25\nL 86.7 26.1 89.15 26.55\nQ 91.75 26.55 92.8 25.35 93.8 24.15 93.8 21.65\nL 93.8 7.6 98.75 7.6\nM 70.55 7.6\nL 75.2 7.6 75.2 30.15 70.25 30.15 60.85 15.05 60.8 15.05 60.8 30.15 56.15 30.15 56.15 7.6 61.1 7.6 70.5 22.75 70.55 22.75 70.55 7.6\nM 40.75 16.6\nL 51.65 16.6 51.65 20.45 40.75 20.45 40.75 26 52.85 26 52.85 30.15 35.75 30.15 35.75 7.6 52.6 7.6 52.6 11.8 40.75 11.8 40.75 16.6\nM 24.4 7.6\nL 31.4 7.6 31.4 30.15 26.75 30.15 26.75 14.2 26.7 14.2 21.15 30.15 17.35 30.15 11.8 14.35 11.75 14.35 11.75 30.15 7.1 30.15 7.1 7.6 14.1 7.6 19.35 23.15 19.45 23.15 24.4 7.6 Z'));
	menu2_3Buttons.push(new Path2D('M 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nL 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nM 92.9 6.5\nL 99.6 6.5 90.05 16.15 100.55 30.9 93.8 30.9 86.45 19.95 83.4 23.05 83.4 30.9 78 30.9 78 6.5 83.4 6.5 83.4 16.6 92.9 6.5\nM 67.15 11.65\nQ 66.45 11.05 65.55 10.75\nL 63.65 10.4\nQ 61.85 10.4 60.6 11.1 59.3 11.85 58.55 13 57.75 14.2 57.4 15.7 57.05 17.2 57.05 18.8 57.05 20.35 57.4 21.8 57.75 23.25 58.55 24.4 59.3 25.6 60.6 26.3 61.85 27 63.65 27 66.1 27 67.5 25.45 68.9 23.95 69.2 21.5\nL 74.4 21.5\nQ 74.2 23.8 73.35 25.65 72.45 27.5 71.05 28.8 69.65 30.1 67.8 30.8\nL 63.65 31.5\nQ 60.8 31.5 58.6 30.5 56.35 29.5 54.8 27.8 53.3 26.1 52.45 23.75 51.65 21.45 51.65 18.8 51.65 16.1 52.45 13.75 53.3 11.4 54.8 9.65 56.35 7.9 58.6 6.9 60.8 5.9 63.65 5.9 65.65 5.9 67.45 6.5 69.25 7.1 70.65 8.2 72.1 9.3 73 10.95 73.95 12.6 74.15 14.7\nL 68.95 14.7\nQ 68.85 13.8 68.35 13\nL 67.15 11.65\nM 50.6 30.9\nL 45 30.9 43.15 25.5 34.05 25.5 32.15 30.9 26.7 30.9 35.95 6.5 41.45 6.5 50.6 30.9\nM 22.35 7.8\nQ 23.35 8.5 23.9 9.65 24.5 10.85 24.5 12.55 24.5 14.35 23.65 15.6 22.8 16.85 21.15 17.65 23.45 18.3 24.55 19.9 25.65 21.55 25.65 23.8 25.65 25.7 24.95 27.05 24.2 28.4 23 29.25 21.8 30.1 20.2 30.5\nL 17.05 30.9 5.2 30.9 5.2 6.5 16.7 6.5 19.85 6.8\nQ 21.3 7.1 22.35 7.8\nM 19.2 20.85\nQ 18.15 20.05 16.4 20.05\nL 10.6 20.05 10.6 26.75 16.3 26.75 17.8 26.6 19.05 26.05 19.95 25.1 20.25 23.5\nQ 20.25 21.65 19.2 20.85\nM 19 12.1\nQ 18.65 11.5 18.15 11.2\nL 17 10.8 15.6 10.65 10.6 10.65 10.6 16.4 16 16.4\nQ 17.45 16.4 18.35 15.7 19.3 15 19.3 13.5\nL 19 12.1\nM 38.7 12.5\nL 38.65 12.5 35.45 21.45 41.75 21.45 38.7 12.5 Z'));
	menu2_3Buttons.push(new Path2D('M 104.5 27.3\nL 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nM 97.5 11.4\nL 85.2 11.4 85.2 16.35 96.5 16.35 96.5 20.35 85.2 20.35 85.2 26.1 97.75 26.1 97.75 30.4 80.05 30.4 80.05 7.05 97.5 7.05 97.5 11.4\nM 77.4 7.05\nL 77.4 11.4 70.4 11.4 70.4 30.4 65.25 30.4 65.25 11.4 58.3 11.4 58.3 7.05 77.4 7.05\nM 40.95 21.6\nL 41.1 23.45\nQ 41.25 24.35 41.8 25.1\nL 43.25 26.2 45.75 26.65\nQ 48.5 26.65 49.55 25.4 50.6 24.2 50.6 21.6\nL 50.6 7.05 55.7 7.05 55.7 21.6\nQ 55.7 26.3 53.05 28.65 50.4 30.95 45.75 30.95 41 30.95 38.4 28.65 35.8 26.35 35.8 21.6\nL 35.8 7.05 40.95 7.05 40.95 21.6\nM 26.55 13.85\nL 26.45 13.85 20.75 30.4 16.8 30.4 11.05 14.05 11 14.05 11 30.4 6.2 30.4 6.2 7.05 13.45 7.05 18.9 23.1 18.95 23.1 24.1 7.05 31.35 7.05 31.35 30.4 26.55 30.4 26.55 13.85 Z'));
	menu2_3Buttons.push(new Path2D('\nM 104.5 27.3\nL 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nM 86.35 6.35\nL 86.35 26.35 98.3 26.35 98.3 30.85 80.95 30.85 80.95 6.35 86.35 6.35\nM 64.1 6.35\nL 69.6 6.35 78.8 30.85 73.2 30.85 71.35 25.4 62.2 25.4 60.25 30.85 54.8 30.85 64.1 6.35\nM 52.8 6.35\nL 52.8 21.6\nQ 52.8 26.55 50.05 29 47.25 31.45 42.35 31.45 37.35 31.45 34.65 29 31.9 26.6 31.9 21.6\nL 31.9 6.35 37.3 6.35 37.3 21.6 37.45 23.55\nQ 37.65 24.5 38.2 25.25 38.75 26.05 39.7 26.45\nL 42.35 26.9\nQ 45.2 26.9 46.3 25.65 47.4 24.35 47.4 21.6\nL 47.4 6.35 52.8 6.35\nM 21.4 6.75\nQ 23.65 7.8 25.2 9.5 26.75 11.3 27.55 13.65 28.35 16 28.35 18.7 28.35 21.4 27.55 23.7 26.75 26 25.2 27.7\nL 28.25 30.5 25.75 33.15 22.25 30\nQ 21.05 30.7 19.6 31.05\nL 16.35 31.45\nQ 13.5 31.45 11.25 30.45 9.05 29.45 7.5 27.75 5.95 26 5.15 23.7 4.3 21.35 4.3 18.7 4.3 16 5.15 13.65 5.95 11.3 7.5 9.5 9.05 7.8 11.25 6.75 13.5 5.8 16.35 5.8 19.2 5.8 21.4 6.75\nM 21.45 24.35\nQ 22.15 23.4 22.55 22.05 23 20.65 23 18.7 23 17.1 22.65 15.6 22.25 14.05 21.45 12.9 20.7 11.7 19.4 11 18.15 10.3 16.35 10.3 14.5 10.3 13.25 11 12 11.7 11.2 12.9 10.4 14.05 10.05 15.6 9.7 17.1 9.7 18.7 9.7 20.25 10.05 21.7 10.4 23.2 11.2 24.35 12 25.5 13.25 26.2 14.5 26.9 16.35 26.9\nL 17.55 26.9 18.5 26.6 16.2 24.45 18.7 21.8 21.45 24.35\nM 66.85 12.4\nL 66.75 12.4 63.6 21.4 69.9 21.4 66.85 12.4 Z'));
	console.log('all resources have been loaded');
	setup();
}









































function onRect(mx, my, x, y, w, h) {
	return mx>x&&mx<x+w&&my>y&&my<y+h;
}

function setCursor(newCursor) {
	if (_cursor != newCursor) {
		_cursor = newCursor;
		document.body.style.cursor = _cursor;
	}
}


function drawMenu0Button(text, x, y, id, grayed, action) {
	var fill = '#ffffff';
	if (!grayed) {
		if (onRect(_xmouse, _ymouse, x, y, menu0ButtonSize.w, menu0ButtonSize.h)) {
			onButton = true;
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

	ctx.font = 'bold 30px Helvetica';
	ctx.fillStyle = '#666666';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, x+menu0ButtonSize.w/2, y+menu0ButtonSize.h*1.1/2);
}

function drawMenu2_3Button(id, x, y, action) {
	var fill = '#ffffff';
	if (onRect(_xmouse, _ymouse, x, y, menu2_3ButtonSize.w, menu2_3ButtonSize.h)) {
		onButton = true;
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
		if (onRect(_xmouse, _ymouse-cameraY, x, y, levelButtonSize.w, levelButtonSize.h) && (_xmouse < 587 || _ymouse < 469)) {
			onButton = true;
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
			if (id <= levelProgress || (id > 99 && id < bonusProgress+100)) {
				playLevel(id);
				white_alpha = 100;
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
		onButton = true;
		if (mouseIsDown) {
			menu0ButtonClicked = id;
		}
	}
	if (!mouseIsDown && menu0ButtonClicked === id) {
		menu0ButtonClicked = -1;
		action();
	}

	drawRoundedRect(color, x, y, size, size, 10);

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

	// var started = true;
	// if (bfdia5b.data.levelProgress == undefined || bfdia5b.data.levelProgress == 0) {
	//    started = false;
	// }
}

function beginNewGame() {
	clearVars();
	// saveGame();
	menuScreen = 2;
	cameraY = 0;
	cameraX = 0;
}

function drawLevelMapBorder() {
	// For security reasons, you can not draw images from svg files to a canvas.
	// So I have to draw the border image manually with masking and stuff.
	// https://stackoverflow.com/questions/18379818/canvas-image-masking-overlapping

	// It might be better to use a path object here instead of hard-coding it.
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
	ctx.drawImage(svgMenu2, 0, 0);

	ctx.fillStyle = '#000000';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.font = '40px Helvetica';
	ctx.fillText('x ' + coins, 477.95, 50.9);
	ctx.font = '21px Helvetica';
	ctx.fillText(toHMS(timer), 767.3, 27.5);
	ctx.fillText(addCommas(deathCount), 767.3, 55.9);
	ctx.textAlign = 'right';
	ctx.fillText('Time:', 757.05, 27.5);
	ctx.fillText('Deaths:', 757.05, 55.9);
	if (levelProgress > 0) {
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
		else if (_loc3_ > 99) {
			if (bonusProgress == _loc3_-99) color = 2;
			else if (bonusProgress > _loc3_-99) color = 3;
		}
		var text = '';
		if (_loc3_ >= 100) text = "B" + numberToText(_loc3_ - 99,false);
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
	doorLightFade = [0,0,0,0,0,0];
	doorLightFadeDire = [0,0,0,0,0,0];
	charCount = startLocations[currentLevel].length;
	levelWidth = levels[currentLevel][0].length;
	levelHeight = levels[currentLevel].length;
	charDepths = new Array((charCount + 1) * 2).fill(-1);
	for (var i = 0; i < charCount; i++) charDepths[i*2] = Math.floor(charCount-i-1);
	// move the control to the front
	charDepths[(charCount-1)*2] = -1;
	charDepths[charCount*2] = 0;
	copyLevel(levels[currentLevel]);
	charDepth = levelWidth * levelHeight + charCount * 2;
	tileDepths = [[],[],[],[]];
	charCount2 = 0;
	HPRC1 = HPRC2 = 1000000;
	for (var _loc1_ = 0; _loc1_ < charCount; _loc1_++) {
		var _loc2_ = startLocations[currentLevel][_loc1_][0];
		char[_loc1_] = new Character(
			_loc2_,
			startLocations[currentLevel][_loc1_][1] * 30 + startLocations[currentLevel][_loc1_][2] * 30 / 100,
			startLocations[currentLevel][_loc1_][3] * 30 + startLocations[currentLevel][_loc1_][4] * 30 / 100,
			70 + _loc1_ * 40,
			400 - _loc1_ * 30,
			0,
			0,
			false,
			4,
			false,
			0,
			200,
			200,
			30,
			startLocations[currentLevel][_loc1_][5],
			-1,
			new Array(0),
			charD[_loc2_][0],
			charD[_loc2_][1],
			charD[_loc2_][2],
			charD[_loc2_][2],
			charD[_loc2_][3],
			false,
			charD[_loc2_][4],
			0,
			2,
			0,
			new Array(0),
			0,
			0,
			0,
			0,
			charD[_loc2_][6]
		);
		if (char[_loc1_].charState == 9) {
			char[_loc1_].expr = 1;
			char[_loc1_].diaMouthFrame = 0;
		} else if (char[_loc1_].charState >= 7) {
			char[_loc1_].expr = charModels[char[_loc1_].id].defaultExpr;
		}
		
		if (_loc2_ <= 5) charCount2++;
		if (_loc2_ == 36) HPRC1 = _loc1_;
		if (_loc2_ == 35) HPRC2 = _loc1_;
		if (char[_loc1_].charState == 3 || char[_loc1_].charState == 4) {
			char[_loc1_].speed = startLocations[currentLevel][_loc1_][6][0] * 10 + startLocations[currentLevel][_loc1_][6][1];
		}
	}
	getTileDepths();
	// drawLevel();
	// drawCharacters();
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

function getTileDepths() {
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
					tileDepths[3].push({x:_loc1_,y:_loc2_});
					// addTileMovieClip(_loc1_,_loc2_); //levelActive3
				} else if (blockProperties[thisLevel[_loc2_][_loc1_]][11] >= 1) {
					tileDepths[2].push({x:_loc1_,y:_loc2_});
					// addTileMovieClip(_loc1_,_loc2_); //levelActive2
					// if (blockProperties[thisLevel[_loc2_][_loc1_]][11] >= 7 && blockProperties[thisLevel[_loc2_][_loc1_]][11] <= 12) {
						// levelActive2["tileX" + _loc1_ + "Y" + _loc2_].lever._rotation = 60;
					// }
				} else if (blockProperties[thisLevel[_loc2_][_loc1_]][8]) {
					tileDepths[1].push({x:_loc1_,y:_loc2_});
					// addTileMovieClip(_loc1_,_loc2_); //levelActive
				} else {
					tileDepths[0].push({x:_loc1_,y:_loc2_});
					// addTileMovieClip(_loc1_,_loc2_); //levelStill
				}
				if (thisLevel[_loc2_][_loc1_] == 6) {
					locations[0] = _loc1_;
					locations[1] = _loc2_;
					// if (bgs[currentLevel] == 9 || bgs[currentLevel] == 10) {
						// levelActive["tileX" + _loc1_ + "Y" + _loc2_].bg.gotoAndStop(2);
					// }
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
}

function drawLevel() {
	// if (playMode == 0 && currentLevel >= 1) {
	// 	removeTileMovieClips();
	// 	addTileMovieClips();
	// }

	// Draw Static & Active1
	for (var i = 0; i < 2; i++) {
		for (var j = 0; j < tileDepths[i].length; j++) {
			addTileMovieClip(tileDepths[i][j].x,tileDepths[i][j].y);
		}
	}
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
	// Draw Active2+
	for (var i = 2; i < tileDepths.length; i++) {
		for (var j = 0; j < tileDepths[i].length; j++) {
			addTileMovieClip(tileDepths[i][j].x,tileDepths[i][j].y);
		}
	}
}


// draws a tile
// TODO: precalculate a this stuff and only do the drawing in here. Unless it's actually all necesarry. Then you can just leave it.
function addTileMovieClip(x, y) {
	var _loc5_ = thisLevel[y][x];
	if (typeof svgTiles[_loc5_] !== 'undefined') {
		if (!blockProperties[_loc5_][15]) {
			if (blockProperties[_loc5_][11] > 0 && typeof svgLevers[(blockProperties[_loc5_][11]-1)%6] !== 'undefined') {
				ctx.save();
				ctx.translate(x*30+15, y*30+28);
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
	} else if (_loc5_ == 6) {
		// Door
		ctx.fillStyle = '#505050';
		ctx.fillRect((x-1)*30, (y-3)*30, 60, 120);
		for (var i = 0; i < charCount2; i++) {
			ctx.fillStyle = 'rgb(' + mapRange(doorLightFade[i], 0, 1, 40, 0) + ',' + mapRange(doorLightFade[i], 0, 1, 40, 255) + ',' + mapRange(doorLightFade[i], 0, 1, 40, 0) + ')';
			ctx.fillRect((x-1)*30+doorLightX[charCount2-1][i], y*30-80, 5, 5);
			if (doorLightFadeDire[i] != 0) {
				doorLightFade[i] = Math.max(Math.min(doorLightFade[i]+doorLightFadeDire[i]*0.0625, 1), 0);
				if (doorLightFade[i] == 1 || doorLightFade[i] == 0) doorLightFadeDire[i] = 0;
			}
		}
	} else if (_loc5_ == 12) {
		// Coin
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
	// if (_loc5_ == 6) {
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
				if (_loc5_ == 6) {
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
			if (blockProperties[thisLevel[y + cardinal[_loc1_][1]][x + cardinal[_loc1_][0]]][_loc1_] && (_loc4_ == 0 || _loc4_ == 6)) {
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
	for (var _loc1_ = 0; _loc1_ < 4; _loc1_++) {
		if ((!outOfRange(x + cardinal[_loc1_][0],y + cardinal[_loc1_][1])) && thisLevel[y + cardinal[_loc1_][1]][x + cardinal[_loc1_][0]] != s) {
			_loc6_ += Math.pow(2,3 - _loc1_);
		}
	}
	// if (_loc6_ > 0) ctx.drawImage(svgTileBorders[_loc6_-1], x*30, y*30);
	if (_loc6_ > 0) tileBorders[y][x].push(_loc6_);
		
	// TODO: remove this hard-coded array
	var metalBlocks = [98,102,105,107];
	if (metalBlocks.includes(levels[currentLevel][y][x])) tileBorders[y][x][tileBorders[y][x].length-1] += 19;
	// tileBorders[_loc2_][_loc1_]
	// tile.ambientShadow.gotoAndStop(_loc6_ + 1);
	for (var _loc1_ = 0; _loc1_ < 4; _loc1_++) {
		if ((!outOfRange(x + diagonal[_loc1_][0],y + diagonal[_loc1_][1])) &&  thisLevel[y][x + diagonal[_loc1_][0]] == s && thisLevel[y + diagonal[_loc1_][1]][x] == s && thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]] != s) {
			tileBorders[y][x].push(16+_loc1_);
			// ctx.drawImage(svgTileBorders[15+_loc1_], x*30, y*30);
			// tile.ambientShadow2["a" + _loc1_].gotoAndStop(2);
		}
		// else {
		// 	// tile.ambientShadow2["a" + _loc1_].gotoAndStop(1);
		// }
	}
}
function opposite(i, xOrY) {
	if (xOrY == 0) {
		return 3.5 - Math.abs(i - 1.5);
	}
	if (xOrY == 1) {
		return Math.floor(i / 2);
	}
}















function drawCharacters() {
	// if (playMode == 0 && currentLevel >= 1) {
	// 	for (var _loc1_ = 0; _loc1_ < startLocations[currentLevel - transitionType].length; _loc1_++) {
			// levelChar["char" + _loc1_].removeMovieClip();
		// }
	// } else {
	// 	for (var _loc1_ = 0; _loc1_ < startLocations[currentLevel].length; _loc1_++) {
			// levelChar["char" + _loc1_].removeMovieClip();
		// }
	// }
	for (var _loc2_ = 0; _loc2_ < (charCount+1)*2; _loc2_++) {
		var _loc1_ = charDepths[_loc2_];
		if (_loc1_ < 0) continue;
		var currCharID = char[_loc1_].id;


		if (char[_loc1_].burstFrame >= 0) {
			ctx.save();
			var burstImg = svgBurst[char[_loc1_].burstFrame];
			var burstmat = charModels[char[_loc1_].id].burstmat;
			ctx.transform(burstmat.a,burstmat.b,burstmat.c,burstmat.d,burstmat.tx+char[_loc1_].x,burstmat.ty+char[_loc1_].y);
			ctx.drawImage(burstImg, -burstImg.width/2, -burstImg.height/2);
			ctx.restore();

			char[_loc1_].burstFrame++;
			if (char[_loc1_].burstFrame > svgBurst.length-1) char[_loc1_].burstFrame = -1;
		}

		// levelChar.attachMovie("char","char" + _loc1_,charDepth - _loc1_ * 2,{_x:char[_loc1_].x,_y:char[_loc1_].y});
		// if statment used to include: && typeof svgChars[char[_loc1_].id] !== 'undefined'
		// if (char[_loc1_].deathTimer > 0 && charD[currCharID][7] > 0) {
		if (char[_loc1_].charState > 1 && charD[currCharID][7] > 0) {
			if (char[_loc1_].deathTimer < 30 && char[_loc1_].deathTimer % 6 <= 2 && char[_loc1_].charState > 2) ctx.globalAlpha = 0.3;
			if (currCharID > 34) {
				// ctx.drawImage(svgChars[char[_loc1_].id], char[_loc1_].x-char[_loc1_].w, char[_loc1_].y-char[_loc1_].h);
				// var vb = svgChars[char[_loc1_].id].viewBox;
				// var vb, currCharSvg;
				// console.log(vb);
				if (charD[currCharID][7] == 1) {
					ctx.drawImage(svgChars[currCharID], char[_loc1_].x+svgCharsVB[currCharID][0], char[_loc1_].y+svgCharsVB[currCharID][1]);
					// currCharSvg = svgChars[char[_loc1_].id];
					// vb = svgCharsVB[char[_loc1_].id];
				} else {
					var currCharFrame = _frameCount%charD[currCharID][7];
					ctx.drawImage(svgChars[currCharID][currCharFrame], char[_loc1_].x+svgCharsVB[currCharID][currCharFrame][0], char[_loc1_].y+svgCharsVB[currCharID][currCharFrame][1]);
					// currCharSvg = svgChars[char[_loc1_].id][currCharFrame];
					// vb = svgCharsVB[char[_loc1_].id][currCharFrame];
				}

				// Hitboxes
				// ctx.strokeStyle = '#ff0000';
				// ctx.lineWidth = 1;
				// ctx.strokeRect(char[_loc1_].x-char[_loc1_].w, char[_loc1_].y-char[_loc1_].h, char[_loc1_].w*2, char[_loc1_].h);
			} else {
				var model = charModels[char[_loc1_].id];

				if (char[_loc1_].charState == 2) {
					ctx.save();
					var amt = (60 - recoverTimer) / 60;
					ctx.transform(1, 0, 0, amt, 0, (1-amt)*char[_loc1_].y);
				}

				// draw legs
				var legdire = char[_loc1_].legdire>0?1:-1;
				var legmat = [
					{a:0.3648529052734375,b:0,c:char[_loc1_].leg1skew*legdire,d:0.3814697265625,tx:0.35,ty:-0.65},
					{a:0.3648529052734375,b:0,c:char[_loc1_].leg2skew*legdire,d:0.3814697265625,tx:0.35,ty:-0.65}
				];
				if (!(char[_loc1_].id == 5 && Math.floor(char[_loc1_].frame/2) == 4)) {
					// TODO: remove hard-coded numbers
					// TODO: make the character's leg frames an array and loop through them here...
					// ... or just make them one variable instead of two. whichever one I feel like doing at the time ig.
					// var f = [ legFrames[char[_loc1_].leg1frame].bodypart, legFrames[char[_loc1_].leg2frame].bodypart ];
					var f = [];
					var legf = legFrames[char[_loc1_].leg1frame];
					if (legf.type == 'static') {
						f = [ legf.bodypart, legf.bodypart ];
							// f[i] = f[i][Math.max(char[_loc1_].legAnimationFrame[i], 0)%f[i].length];
					} else if (legf.type == 'anim') {
						if (legf.usesMats) {
							f = [ legf.bodypart, legf.bodypart ];
							legmat = [
								legf.frames[Math.max(char[_loc1_].legAnimationFrame[0], 0)%legf.frames.length],
								legf.frames[Math.max(char[_loc1_].legAnimationFrame[1], 0)%legf.frames.length]
							];
						} else {
							f = [
								legf.frames[Math.max(char[_loc1_].legAnimationFrame[0], 0)%legf.frames.length],
								legf.frames[Math.max(char[_loc1_].legAnimationFrame[1], 0)%legf.frames.length]
							];
						}
					}
					ctx.save();
					ctx.transform(
						legdire*legmat[0].a,
						legmat[0].b,
						legdire*legmat[0].c,
						legmat[0].d,
						char[_loc1_].x+model.legx[0]+legmat[0].tx,
						char[_loc1_].y+model.legy[0]+legmat[0].ty
					);
					var leg1img = svgBodyParts[f[0]];
					ctx.drawImage(leg1img, -leg1img.width/2, -leg1img.height/2);
					ctx.restore();
					ctx.save();
					ctx.transform(
						legdire*legmat[1].a,
						legmat[1].b,
						legdire*legmat[1].c,
						legmat[1].d,
						char[_loc1_].x+model.legx[1]+legmat[1].tx,
						char[_loc1_].y+model.legy[1]+legmat[1].ty
					);
					var leg2img = svgBodyParts[f[1]];
					ctx.drawImage(leg2img, -leg2img.width/2, -leg2img.height/2);
					ctx.restore();
				}

				var modelFrame = model.frames[char[_loc1_].frame];
				// var xoff = model.torsoX;
				// var yoff = model.torsoY;
				ctx.save();
				var runbob = (char[_loc1_].frame==0||char[_loc1_].frame==2)?bounceY(4/charModels[char[_loc1_].id].torsomat.a, 13, char[_loc1_].poseTimer):0;
				ctx.transform(
					charModels[char[_loc1_].id].torsomat.a,
					charModels[char[_loc1_].id].torsomat.b,
					charModels[char[_loc1_].id].torsomat.c,
					charModels[char[_loc1_].id].torsomat.d,
					char[_loc1_].x+charModels[char[_loc1_].id].torsomat.tx,
					char[_loc1_].y+charModels[char[_loc1_].id].torsomat.ty
					);
				for (var i = 0; i < modelFrame.length; i++) {
					if (char[_loc1_].frame > 9 && modelFrame[i].type == 'armroot') {
						var handOff = modelFrame[i].id==0?10:20;
						var handX = -charModels[char[_loc1_].id].torsomat.tx + (char[HPRC2].x - char[_loc1_].x) + hprcCrankPos.x + handOff * Math.cos(Math.PI * recoverTimer / 15 - 0.2);
						var handY = -charModels[char[_loc1_].id].torsomat.ty + (char[HPRC2].y - char[_loc1_].y) + hprcCrankPos.y + handOff * Math.sin(Math.PI * recoverTimer / 15 - 0.2);
						ctx.strokeStyle = '#000000';
						ctx.lineWidth = 1.5;
						ctx.beginPath();
						ctx.moveTo(modelFrame[i].pos.x, modelFrame[i].pos.y);
						ctx.lineTo(handX, handY);
						ctx.stroke();

						ctx.fillStyle = '#000000';
						ctx.beginPath();
						ctx.arc(handX, handY, 2.5, 0, 2*Math.PI, false);
						ctx.fill();
						continue;
					}
					var img = svgBodyParts[modelFrame[i].bodypart];
					if (modelFrame[i].type == 'body') img = svgChars[char[_loc1_].id];

					ctx.save();
					ctx.transform(
						modelFrame[i].mat.a,
						modelFrame[i].mat.b,
						modelFrame[i].mat.c,
						modelFrame[i].mat.d,
						modelFrame[i].mat.tx,
						modelFrame[i].mat.ty+(modelFrame[i].type != 'anim'?runbob:0)
					);
					if (modelFrame[i].type == 'anim') {
						img = svgBodyParts[bodyPartAnimations[modelFrame[i].anim].bodypart];
						var bpanimframe = modelFrame[i].loop ? ((char[_loc1_].poseTimer+modelFrame[i].offset)%bodyPartAnimations[modelFrame[i].anim].frames.length) : Math.min((char[_loc1_].poseTimer+modelFrame[i].offset),bodyPartAnimations[modelFrame[i].anim].frames.length-1);
						var mat = bodyPartAnimations[modelFrame[i].anim].frames[bpanimframe];
						ctx.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
					} else if (modelFrame[i].type == 'dia') {
						// var bpanimframe = modelFrame[i].loop ? ((char[_loc1_].poseTimer+modelFrame[i].offset)%bodyPartAnimations[modelFrame[i].anim].frames.length) : Math.min((char[_loc1_].poseTimer+modelFrame[i].offset),bodyPartAnimations[modelFrame[i].anim].frames.length-1);
						var dmf = 0;
						if (cutScene == 1) {
							// var expr = dialogueFace[currentLevel][cutSceneLine]-2;
							var expr = char[_loc1_].expr + charModels[char[_loc1_].id].mouthType*2;
							dmf = diaMouths[expr].frameorder[char[_loc1_].diaMouthFrame];
							img = svgBodyParts[diaMouths[expr].frames[dmf].bodypart];

							// TODO: move this somehwere else
							if (char[_loc1_].diaMouthFrame < diaMouths[expr].frameorder.length-1) char[_loc1_].diaMouthFrame++;
						} else {
							img = svgBodyParts[diaMouths[char[_loc1_].expr + charModels[char[_loc1_].id].mouthType*2].frames[dmf].bodypart];
						}
						// var mat = bodyPartAnimations[modelFrame[i].anim].frames[bpanimframe];
						var mat = diaMouths[model.defaultExpr].frames[dmf].mat;
						ctx.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
					}
					ctx.drawImage(img, -img.width/2, -img.height/2);
					ctx.restore();
				}
				ctx.restore();
				char[_loc1_].poseTimer++;
				// Hitboxes
				// ctx.strokeStyle = HSVtoRGB((char[_loc1_].id*1.618033988749894)%1, 0.7, 0.8);
				// ctx.strokeRect(char[_loc1_].x-char[_loc1_].w, char[_loc1_].y-char[_loc1_].h, char[_loc1_].w*2, char[_loc1_].h);

				ctx.globalAlpha = 1;

				if (char[_loc1_].charState == 2) {
					ctx.restore();
				}
			}
		}
		// else {
		// 	// ctx.fillStyle = '#00ffff';
		// 	ctx.fillStyle = HSVtoRGB((char[_loc1_].id*1.618033988749894)%1, 0.7, 0.8);
		// 	ctx.fillRect(char[_loc1_].x-char[_loc1_].w, char[_loc1_].y-char[_loc1_].h, char[_loc1_].w*2, char[_loc1_].h);
		// }
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
			char[_loc1_].dire = 2;
			char[_loc1_].frame = 1;
			// levelChar["char" + _loc1_].charBody.gotoAndStop(2);
			// levelChar["char" + _loc1_].charBody.mouth.gotoAndStop(3);
			// levelChar["char" + _loc1_].charBody.mouth.mouth.gotoAndStop(57);
		}
		if (_loc1_ == HPRC2) {
			ctx.fillStyle = '#00ff00';
			ctx.textAlign = 'center';
			ctx.font = '6px Helvetica';
			ctx.fillText(HPRCText, char[_loc1_].x+12.65, char[_loc1_].y-41.3);
			// -29.5, -23.7
			var radius = svgHPRCCrank.height/2;
			ctx.save();
			ctx.translate(char[_loc1_].x+hprcCrankPos.x, char[_loc1_].y+hprcCrankPos.y);
			ctx.rotate(HPRCCrankRot);
			ctx.drawImage(svgHPRCCrank, -radius, -radius);
			ctx.restore();
			// TODO: make this not so hard coded.
			if (HPRCBubbleFrame == 1) {
				ctx.drawImage(svgHPRCBubble[0], char[_loc1_].x-svgHPRCBubble[0].width/2, char[_loc1_].y-128+bounceY(9, 30, _frameCount));
			} else if (HPRCBubbleFrame == 2) {
				ctx.drawImage(svgHPRCBubble[1], char[_loc1_].x-svgHPRCBubble[1].width/2, char[_loc1_].y-150);
				ctx.save();
				var charimgmat = charModels[char[recover2].id].charimgmat;
				ctx.transform(charimgmat.a,charimgmat.b,charimgmat.c,charimgmat.d,charimgmat.tx/2+char[_loc1_].x,charimgmat.ty/2+char[_loc1_].y-107);
				ctx.drawImage(svgChars[char[recover2].id], -svgChars[char[recover2].id].width/2, -svgChars[char[recover2].id].height/2);
				ctx.restore();
			} else if (HPRCBubbleFrame == 3) {
				ctx.drawImage(svgHPRCBubble[2], char[_loc1_].x-svgHPRCBubble[2].width/2, char[_loc1_].y-150);
				
				var dead = recover2;

				ctx.save();
				var charimgmat = charModels[char[dead].id].charimgmat;
				ctx.transform(charimgmat.a,charimgmat.b,charimgmat.c,charimgmat.d,charimgmat.tx/2+char[_loc1_].x,charimgmat.ty/2+char[_loc1_].y-107);
				ctx.drawImage(svgChars[char[dead].id], -svgChars[char[dead].id].width/2, -svgChars[char[dead].id].height/2);
				ctx.restore();
				
				dead = nextDeadPerson(recover2,-1);

				ctx.save();
				var charimgmat = charModels[char[dead].id].charimgmat;
				ctx.transform(charimgmat.a*0.6,charimgmat.b,charimgmat.c,charimgmat.d*0.6,charimgmat.tx/2+char[_loc1_].x-31.45,charimgmat.ty/2+char[_loc1_].y-107);
				ctx.drawImage(svgChars[char[dead].id], -svgChars[char[dead].id].width/2, -svgChars[char[dead].id].height/2);
				ctx.restore();
				
				dead = nextDeadPerson(recover2,1);

				ctx.save();
				var charimgmat = charModels[char[dead].id].charimgmat;
				ctx.transform(charimgmat.a*0.6,charimgmat.b,charimgmat.c,charimgmat.d*0.6,charimgmat.tx/2+char[_loc1_].x+31.45,charimgmat.ty/2+char[_loc1_].y-107);
				ctx.drawImage(svgChars[char[dead].id], -svgChars[char[dead].id].width/2, -svgChars[char[dead].id].height/2);
				ctx.restore();
			}
			// HPRCBubble.attachMovie("charImage","charImage",0,{_x:char[_loc1_].x,_y:char[_loc1_].y,_xscale:143,_yscale:143});
		}

		if (char[_loc1_].temp >= 50) {
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
// Originally used this for generating colors on the hitboxes. But it's no longer needed since we no longer draw those hitboxes. 
// function HSVtoRGB(h, s, v) {
//     var r, g, b, i, f, p, q, t;
//     if (arguments.length === 1) {
//         s = h.s, v = h.v, h = h.h;
//     }
//     i = Math.floor(h * 6);
//     f = h * 6 - i;
//     p = v * (1 - s);
//     q = v * (1 - f * s);
//     t = v * (1 - (1 - f) * s);
//     switch (i % 6) {
//         case 0: r = v, g = t, b = p; break;
//         case 1: r = q, g = v, b = p; break;
//         case 2: r = p, g = v, b = t; break;
//         case 3: r = p, g = q, b = v; break;
//         case 4: r = t, g = p, b = v; break;
//         case 5: r = v, g = p, b = q; break;
//     }
//     r = Math.round(r * 255);
//     g = Math.round(g * 255);
//     b = Math.round(b * 255);
//     return 'rgb(' + r + ',' + g + ',' + b + ')';
// }


function setBody(i) {
	char[i].leg1skew = 0;
	char[i].leg2skew = 0;

	var _loc2_ = undefined;
	var _loc3_ = [0,0];
	char[i].legdire = char[i].dire / 2 - 1;
	if (ifCarried(i) && cornerHangTimer == 0) {
		// for (var _loc5_ = 1; _loc5_ <= 2; _loc5_++) {
			// Carried legs
			// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(Math.floor(char[i].dire / 2 + 0.5));
			// levelChar["char" + i]["leg" + _loc5_].leg.gotoAndStop(51);
		// }
		offSetLegs(i, 60, 3, 0, 1);
		char[i].leg1frame = 3;
		char[i].leg2frame = 3;
	} else if (char[i].dire % 2 == 0 && char[i].onob) {
		if (char[i].standingOn >= 0) {
			var _loc4_ = char[i].standingOn;
			for (var _loc5_ = 1; _loc5_ <= 2; _loc5_++) {
				// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(char[i].dire / 2);
				_loc2_ = char[i].x + charModels[char[i].id].legx[_loc5_-1];
				// _loc2_ = char[i].x + levelChar["char" + i]["leg" + _loc5_]._x;
				if (_loc2_ >= char[_loc4_].x + char[_loc4_].w) {
					_loc3_[_loc5_ - 1] = char[_loc4_].x + char[_loc4_].w - _loc2_;
				} else if (_loc2_ <= char[_loc4_].x - char[_loc4_].w) {
					_loc3_[_loc5_ - 1] = char[_loc4_].x - char[_loc4_].w - _loc2_;
				}
			}
		}
		else if (char[i].fricGoal == 0) {
			for (var _loc5_ = 1; _loc5_ <= 2; _loc5_++) {
				// levelChar["char" + i]["leg" + _loc5_].gotoAndStop(char[i].dire / 2);
				// _loc2_ = char[i].x + levelChar["char" + i]["leg" + _loc5_]._x;
				_loc2_ = char[i].x + charModels[char[i].id].legx[_loc5_-1];
				if (!safeToStandAt(_loc2_,char[i].y + 1)) {
					var _loc7_ = safeToStandAt(_loc2_ - 30,char[i].y + 1);
					var _loc6_ = safeToStandAt(_loc2_ + 30,char[i].y + 1);
					if (_loc7_ && (!_loc6_ || _loc2_ % 30 - (_loc5_ - 1.5) * 10 < 30 - _loc2_ % 30) && !horizontalProp(i,-1,1,char[i].x - 15,char[i].y)) {
						_loc3_[_loc5_ - 1] = (- _loc2_) % 30;
					} else if (_loc6_ && !horizontalProp(i,1,1,char[i].x + 15,char[i].y)) {
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
		if (_loc3_[0] > _loc3_[1] && _loc3_[1] >= 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = _loc3_[0]/60;
			char[i].leg2skew = _loc3_[0]/60;
		} else if (_loc3_[0] > _loc3_[1] && _loc3_[0] <= 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = _loc3_[1]/60;
			char[i].leg2skew = _loc3_[1]/60;
		} else if (_loc3_[0] < 0 && _loc3_[1] > 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = _loc3_[0]/60;
			char[i].leg2skew = _loc3_[1]/60;
		} else if (_loc3_[1] > 0 && _loc3_[0] == 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = 0.55;
			char[i].leg2skew = 0.55;
		} else if (_loc3_[0] < 0 && _loc3_[1] == 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = -0.55;
			char[i].leg2skew = -0.55;
		} else {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = 0;
			char[i].leg2skew = 0;
		}
	} else {
		if (char[i].dire % 2 == 1 && char[i].onob) {
			// Walk
			offSetLegs(i, 28, 2, Math.floor(-(char[i].dire-2)/2), Math.floor((char[i].dire-2)/2));
		}
		if (char[i].submerged >= 1 && !char[i].onob) {
			// Swim
			offSetLegs(i, 20, 4, 0, 1);
			char[i].leg1frame = 4;
			char[i].leg2frame = 4;
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
		char[i].setFrame(Math.ceil(char[i].dire / 2) * 2 - 1);
		// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) * 2);
	} else if (i == control && recoverTimer >= 1) {
		if (char[i].x - (char[HPRC2].x - 33) < 25) {
			char[i].setFrame(Math.ceil(char[i].dire / 2) + 11);
			// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 12);
		} else {
			char[i].setFrame(Math.ceil(char[i].dire / 2) + 9);
			// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 10);
		}
		// drawCrankingArms(i);
	} else if (char[i].carry) {
		char[i].setFrame(Math.ceil(char[i].dire / 2) + 5);
		// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 6);
	} else if (!char[i].onob && !ifCarried(i)) {
			char[i].setFrame(Math.ceil(char[i].dire / 2) + 3);
		// levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 4);
		var _loc9_ = Math.round(Math.min(4 - char[i].vy,15));
	} else {
		char[i].setFrame(char[i].dire - 1);
		// levelChar["char" + i].charBody.gotoAndStop(char[i].dire);
	}
}

function offSetLegs(i, duration, frame, l1st, l2st) {
	if (char[i].leg1frame != frame) {
		char[i].legAnimationFrame[0] = l1st*Math.floor(duration / 2);
		char[i].legAnimationFrame[1] = l2st*Math.floor(duration / 2);
	} else {
		char[i].legAnimationFrame[0]++;
		char[i].legAnimationFrame[1]++;
	}
	// levelChar["char" + i].leg2.leg.leg.gotoAndPlay((levelChar["char" + i].leg1.leg.leg._currentframe + (duration / 2 - 1)) % duration + 1);
}
function bounceY(amt, time, t) {
	var base = Math.sin(mapRange((t%time), 0, time*2, 0, Math.PI))*time*2;
	return (base>time?time-base+time:base)*amt/time;
}










































function ifCarried(i) {
	if (char[i].carriedBy >= 0 && char[i].carriedBy <= 190) {
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
			if (_loc3_ < char[i].w + char[_loc1_].w && char[i].y >= char[_loc1_].y - char[_loc1_].h && (char[i].py < char[_loc1_].py - char[_loc1_].h || char[i].py == char[_loc1_].py - char[_loc1_].h && char[i].vy == 0)) {
				if (_loc3_ - char[_loc1_].w < _loc5_) {
					_loc5_ = _loc3_ - char[_loc1_].w;
					_loc4_ = _loc1_;
				}
			}
		}
	}
	if (_loc5_ < 10000 && char[i].standingOn != _loc4_) {
		if (char[i].standingOn >= 0) fallOff(i);
		if (char[_loc4_].charState == 6 && !char[_loc4_].onob) char[_loc4_].vy = inter(char[_loc4_].vy,char[i].vy,char[i].weight2 / (char[_loc4_].weight2 + char[i].weight2));
		land(i,char[_loc4_].y - char[_loc4_].h,char[_loc4_].vy);
		if (char[_loc4_].onob) land2(i,char[_loc4_].y - char[_loc4_].h);
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
						// if (levelActive2["tileX" + _loc3_ + "Y" + _loc4_].button._currentframe != 2) {
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
	if (char[i].y < levelHeight * 30 + 30) {
		var _loc8_ = char[i].buttonsPressed.length;
		for (var _loc5_ = 0; _loc5_ < _loc8_; _loc5_++) {
			var _loc4_ = char[i].buttonsPressed[_loc5_][0];
			var _loc6_ = char[i].buttonsPressed[_loc5_][1];
			if (!char[i].onob || char[i].standingOn >= 0 || char[i].x < _loc4_ * 30 - char[i].w || char[i].x >= _loc4_ * 30 + 30 + char[i].w || bypass) {
				var _loc7_ = true;
				for (var _loc3_ = 0; _loc3_ < charCount; _loc3_++) {
					if (_loc3_ != i) {
						for (var _loc2_ = 0; _loc2_ < char[_loc3_].buttonsPressed.length; _loc2_++) {
							if (char[_loc3_].buttonsPressed[_loc2_][0] == _loc4_ && char[_loc3_].buttonsPressed[_loc2_][1] == _loc6_) {
								_loc7_ = false;
							}
						}
					}
				}
				if (_loc7_) {
					leverSwitch(blockProperties[thisLevel[_loc6_][_loc4_]][11] - 13);
					tileFrames[_loc6_][_loc4_].cf = 2;
					tileFrames[_loc6_][_loc4_].playing = true;
					// levelActive2["tileX" + _loc4_ + "Y" + _loc6_].button.gotoAndPlay(3);
				}
				for (var _loc3_ = 0; _loc3_ < _loc8_; _loc3_++) {
					if (_loc3_ > _loc5_) {
						char[i].buttonsPressed[_loc3_][0] = char[i].buttonsPressed[_loc3_ - 1][0];
						char[i].buttonsPressed[_loc3_][1] = char[i].buttonsPressed[_loc3_ - 1][1];
					}
				}
				char[i].buttonsPressed.pop();
			}
		}
	}
}
function leverSwitch(j) {
	for (var _loc5_ = 0; _loc5_ < switchable[j].length; _loc5_++) {
		var _loc4_ = switchable[Math.min(j,5)][_loc5_][0];
		var _loc3_ = switchable[Math.min(j,5)][_loc5_][1];
		for (var _loc1_ = 0; _loc1_ < switches[j].length; _loc1_++) {
			if (thisLevel[_loc3_][_loc4_] == switches[j][_loc1_ * 2]) {
				thisLevel[_loc3_][_loc4_] = switches[j][_loc1_ * 2 + 1];
				// levelActive["tileX" + _loc4_ + "Y" + _loc3_].gotoAndStop(switches[j][_loc1_ * 2 + 1] % 10 + 1);
			} else if (thisLevel[_loc3_][_loc4_] == switches[j][_loc1_ * 2 + 1]) {
				thisLevel[_loc3_][_loc4_] = switches[j][_loc1_ * 2];
				// levelActive["tileX" + _loc4_ + "Y" + _loc3_].gotoAndStop(switches[j][_loc1_ * 2] % 10 + 1);
			}
		}
	}
	for (var _loc6_ = 0; _loc6_ < charCount; _loc6_++) {
		char[_loc6_].justChanged = 2;
		checkDeath(_loc6_);
	}
}
function checkDeath(i) {
	for (var _loc3_ = Math.floor((char[i].y - char[i].h) / 30); _loc3_ <= Math.floor((char[i].y - 0.01) / 30); _loc3_++) {
		for (var _loc1_ = Math.floor((char[i].x - char[i].w) / 30); _loc1_ <= Math.floor((char[i].x + char[i].w) / 30); _loc1_++) {
			if (!outOfRange(_loc1_, _loc3_)) {
				if (blockProperties[thisLevel[_loc3_][_loc1_]][4] || blockProperties[thisLevel[_loc3_][_loc1_]][5] || blockProperties[thisLevel[_loc3_][_loc1_]][6] || blockProperties[thisLevel[_loc3_][_loc1_]][7]) {
					startDeath(i);
				}
			}
		}
	}
}
function getCoin(i) {
	if (!gotThisCoin && char[i].charState >= 7) {
		if (Math.floor((char[i].x - char[i].w) / 30) <= locations[2] && Math.ceil((char[i].x + char[i].w) / 30) - 1 >= locations[2] && Math.floor((char[i].y - char[i].h) / 30) <= locations[3] && Math.ceil(char[i].y / 30) - 1 >= locations[3]) {
			// levelActive["tileX" + locations[2] + "Y" + locations[3]].coin.gotoAndPlay(2);
			gotThisCoin = true;
		}
	}
}
function setCamera() {
	if (levelWidth <= 32) {
		cameraX = levelWidth * 15 - 480;
	} else if (char[control].x - cameraX < 384) {
		cameraX = Math.min(Math.max(cameraX + (char[control].x - 384 - cameraX),0),levelWidth * 30 - 960);
	} else if (char[control].x - cameraX >= 576) {
		cameraX = Math.min(Math.max(cameraX + (char[control].x - 576 - cameraX),0),levelWidth * 30 - 960);
	}

	if (levelHeight <= 18) {
		cameraY = levelHeight * 15 - 270;
	} else if (char[control].y - cameraY < 216) {
		cameraY = Math.min(Math.max(cameraY + (char[control].y - 216 - cameraY),0),levelHeight * 30 - 540);
	} else if (char[control].y - cameraY >= 324) {
		cameraY = Math.min(Math.max(cameraY + (char[control].y - 324 - cameraY),0),levelHeight * 30 - 540);
	}
}




function newTileUp(i) {
	return Math.floor((char[i].y - char[i].h) / 30) < Math.floor((char[i].py - char[i].h) / 30);
}
function newTileDown(i) {
	return Math.ceil(char[i].y / 30) > Math.ceil(char[i].py / 30);
}
function newTileHorizontal(i, sign) {
	return Math.ceil(sign * (char[i].x + char[i].w * sign) / 30) > Math.ceil(sign * (char[i].px + char[i].w * sign) / 30);
}
function exitTileHorizontal(i, sign) {
	return Math.ceil(sign * (char[i].x - char[i].w * sign) / 30) > Math.ceil(sign * (char[i].px - char[i].w * sign) / 30);
}
function exitTileVertical(i, sign) {
	var _loc1_ = 0.5 * sign + 0.5;
	return Math.ceil(sign * (char[i].y - char[i].h * _loc1_) / 30) > Math.ceil(sign * (char[i].py - char[i].h * _loc1_) / 30);
}
function submerge(i) {
	if (char[i].temp > 0) char[i].temp = 0;
	var _loc2_ = somewhereSubmerged(i);
	if (char[i].submerged <= 1 && _loc2_ >= 2) {
		char[i].weight2 -= 0.16;
		rippleWeight(i,0.16,-1);
		char[i].vx *= 0.1;
		char[i].vy *= 0.1;
	}
	char[i].submerged = _loc2_;
}
function unsubmerge(i) {
	if (exitTileHorizontal(i,-1) || exitTileHorizontal(i,1) || exitTileVertical(i,1) || exitTileVertical(i,-1)) {
		var _loc2_ = somewhereSubmerged(i);
		if (_loc2_ == 0 && char[i].submerged >= 1) {
			if (char[i].submerged == 2 && exitTileVertical(i,-1) && char[i].weight2 < 0 && !ifCarried(i)) {
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
function heat(i) {
	if (char[i].submerged == 0) {
		char[i].temp += char[i].heatSpeed;
	}
	char[i].justChanged = 2;
	if (char[i].temp > 50 && char[i].id != 3) {
		startDeath(i);
		if (char[i].id == 2) {
			extinguish(i);
		}
	}
	if (char[i].heated == 1) unheat(i);
}
function unheat(i) {
	if (exitTileHorizontal(i,-1) || exitTileHorizontal(i,1) || exitTileVertical(i,1) || exitTileVertical(i,-1)) {
		if (!somewhereHeated(i)) {
			char[i].heated = 0;
		}
	}
}
function extinguish(i) {
	for (var _loc1_ = 0; _loc1_ < charCount; _loc1_++) {
		if (char[_loc1_].charState >= 5 && _loc1_ != i && char[_loc1_].temp > 0) {
			if (Math.abs(char[i].x - char[_loc1_].x) < char[i].w + char[_loc1_].w && char[_loc1_].y > char[i].y - char[i].h && char[_loc1_].y < char[i].y + char[_loc1_].h) {
				char[_loc1_].temp = 0;
			}
		}
	}
}
function somewhereSubmerged(i) {
	var _loc3_ = 0;
	for (var _loc5_ = Math.floor((char[i].x - char[i].w) / 30); _loc5_ <= Math.floor((char[i].x + char[i].w) / 30); _loc5_++) {
		var _loc6_ = Math.floor((char[i].y - char[i].h) / 30);
		var _loc4_ = Math.floor(char[i].y / 30);
		for (var _loc1_ = _loc6_; _loc1_ <= _loc4_; _loc1_++) {
			if (!outOfRange(_loc5_, _loc1_) && blockProperties[thisLevel[_loc1_][_loc5_]][14]) {
				if (_loc1_ == _loc4_) {
					if (_loc3_ == 0) {
						_loc3_ = 2;
					}
				} else {
					_loc3_ = 3;
				}
			}
		}
	}
	return _loc3_;
}
function somewhereHeated(i) {
	for (var _loc3_ = Math.floor((char[i].x - char[i].w) / 30); _loc3_ <= Math.floor((char[i].x + char[i].w) / 30); _loc3_++) {
		for (var _loc2_ = Math.floor((char[i].y - char[i].h) / 30); _loc2_ <= Math.floor(char[i].y / 30); _loc2_++) {
			if (thisLevel[_loc2_][_loc3_] == 15) return true;
		}
	}
	return false;
}
function xOff(i) {
	return char[char[i].carriedBy].w * (Math.ceil(char[char[i].carriedBy].dire / 2) * 2 - 3) * 0.7;
}
function xOff2(i) {
	return char[i].w * (Math.ceil(char[i].dire / 2) * 2 - 3) * 0.7;
}
function yOff(i) {
	if (char[i].charState == 6) {
		return char[char[i].carriedBy].h2;
	}
	return char[char[i].carriedBy].h2 - 13;
}

function solidAt(x, y) {
	var _loc1_ = getBlockTypeAt(x,y);
	return (typeof _loc1_ === 'number')?(blockProperties[_loc1_][0] && blockProperties[_loc1_][1] && blockProperties[_loc1_][2] && blockProperties[_loc1_][3]):true;
}
function solidCeiling(x, y) {
	return blockProperties[getBlockTypeAt(x,y)][0];
}
function safeToStandAt(x, y) {
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
				if (blockProperties[thisLevel[_loc4_][_loc1_]][prop - 4] && !blockProperties[thisLevel[_loc4_][_loc1_]][prop]) {
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
				if (blockProperties[thisLevel[_loc1_][_loc2_]][prop - 4] && !blockProperties[thisLevel[_loc1_][_loc2_ - sign]][prop - 4] && !blockProperties[thisLevel[_loc1_][_loc2_]][prop]) {
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
function verticalType(i, sign, prop, pist) {
	var _loc7_ = -0.5 * sign + 0.5;
	var _loc3_ = Math.floor((char[i].y - char[i].h * _loc7_) / 30);
	var _loc4_ = false;
	for (var _loc1_ = Math.floor((char[i].x - char[i].w) / 30); _loc1_ <= Math.floor((char[i].x + char[i].w - 0.01) / 30); _loc1_++) {
		if (!outOfRange(_loc1_, _loc3_)) {
			if (thisLevel[_loc3_][_loc1_] == prop) {
				if (pist) {
					tileFrames[_loc3_][_loc1_].playing = true;
					tileFrames[_loc3_][_loc1_].cf = 1;
					// levelActive["tileX" + _loc1_ + "Y" + _loc3_].piston.gotoAndPlay(2);
				}
				_loc4_ = true;
			}
		}
	}
	return _loc4_;
}
function horizontalType(i, sign, prop) {
	var _loc3_ = Math.floor((char[i].x + char[i].w * sign) / 30);
	for (var _loc1_ = Math.floor((char[i].y - char[i].h) / 30); _loc1_ <= Math.floor((char[i].y - 0.01) / 30); _loc1_++) {
		if (!outOfRange(_loc3_, _loc1_)) {
			if (thisLevel[_loc1_][_loc3_] == prop) {
				return true;
			}
		}
	}
	return false;
}
function land(i, y, vy) {
	char[i].y = y;
	if (char[i].weight2 <= 0) {
		char[i].vy = - Math.abs(vy);
	} else {
		char[i].vy = vy;
		char[i].onob = true;
	}
}
function land2(i, y) {
	if (control < 1000) char[control].landTimer = 0;
	stopCarrierY(i,y,false);
}
function fallOff(i) {
	if (char[i].standingOn >= 0) {
		var _loc4_ = false;
		if (char[char[i].standingOn].submerged == 1) {
			char[char[i].standingOn].submerged = 2;
		} else {
			rippleWeight(i,char[i].weight2,-1);
		}
		var _loc3_ = char[char[i].standingOn].stoodOnBy.length;
		for (var _loc2_ = 0; _loc2_ < _loc3_; _loc2_++) {
			if (char[char[i].standingOn].stoodOnBy[_loc2_] == i) {
				_loc4_ = true;
			}
			if (_loc4_ && _loc2_ <= _loc3_ - 2) {
				char[char[i].standingOn].stoodOnBy[_loc2_] = char[char[i].standingOn].stoodOnBy[_loc2_ + 1];
			}
		}
		char[char[i].standingOn].stoodOnBy.pop();
		char[i].standingOn = -1;
		char[i].onob = false;
		for (var _loc2_ = 0; _loc2_ < char[i].stoodOnBy.length; _loc2_++) {
			fallOff(char[i].stoodOnBy[_loc2_]);
		}
	}
}
function aboveFallOff(i) {
	if (char[i].stoodOnBy.length >= 1) {
		for (var _loc1_ = 0; _loc1_ < char[i].stoodOnBy.length; _loc1_++) {
			fallOff(char[i].stoodOnBy[_loc1_]);
			_loc1_ = _loc1_ + 1;
		}
	}
}
function centered(i, len) {
	if (i % 2 == 0) {
		return (len - i - 2 + len % 2) / 2;
	}
	return (i + len - 1 + len % 2) / 2;
}
function onlyConveyorsUnder(i) {
	var _loc8_ = Math.floor(char[i].y / 30 + 0.5);
	var _loc4_ = Math.floor((char[i].x - char[i].w) / 30);
	var _loc6_ = Math.floor((char[i].x + char[i].w - 0.01) / 30);
	var _loc3_ = 0;
	for (var _loc2_ = 0; _loc2_ <= _loc6_ - _loc4_; _loc2_++) {
		var _loc5_ = centered(_loc2_,1 + _loc6_ - _loc4_) + _loc4_;
		if (!outOfRange(_loc5_, _loc8_)) {
			var _loc1_ = thisLevel[_loc8_][_loc5_];
			if (blockProperties[_loc1_][1]) {
				if (_loc1_ == 14 || _loc1_ == 83) {
					if (_loc3_ == 0) _loc3_ = -2.48;
				} else if (_loc1_ == 16 || _loc1_ == 85) {
					if (_loc3_ == 0) _loc3_ = 2.48;
				} else if (_loc2_ == 0 || char[i].charState == 10) {
					return 0;
				}
			}
		}
	}
	return _loc3_;
}
function stopCarrierX(i, x) {
	if (ifCarried(i)) {
		char[char[i].carriedBy].x = x - xOff(i);
		char[char[i].carriedBy].vx = 0;
	}
}
function stopCarrierY(i, y, canCornerHang) {
	if (ifCarried(i) && (!char[char[i].carriedBy].onob || char[char[i].carriedBy].standingOn >= 0 && char[char[char[i].carriedBy].standingOn].vy != 0)) {
		if (char[char[i].carriedBy].standingOn >= 0) {
			char[char[char[i].carriedBy].standingOn].vy = 0;
			fallOff(char[i].carriedBy);
		}
		if (char[char[i].carriedBy].vy >= 0 && canCornerHang && !solidAt(char[char[i].carriedBy].x,char[i].y + 15)) {
			var _loc3_ = solidAt(char[char[i].carriedBy].x - char[char[i].carriedBy].w - 15,char[i].y + 15) || solidAt(char[char[i].carriedBy].x - char[char[i].carriedBy].w - 45,char[i].y + 15);
			var _loc2_ = solidAt(char[char[i].carriedBy].x + char[char[i].carriedBy].w + 15,char[i].y + 15) || solidAt(char[char[i].carriedBy].x + char[char[i].carriedBy].w + 45,char[i].y + 15);
			char[i].justChanged = 2;
			char[char[i].carriedBy].justChanged = 2;
			if (_loc3_ && _loc2_) {
				putDown(char[i].carriedBy);
			} else if (_loc3_) {
				char[char[i].carriedBy].vx += power;
			} else if (_loc2_) {
				char[char[i].carriedBy].vx -= power;
			}
			cornerHangTimer++;
			if (cornerHangTimer > 30) {
				putDown(char[i].carriedBy);
			}
		}
		if (char[i].carriedBy != -1) {
			char[char[i].carriedBy].vy = 0;
			char[char[i].carriedBy].y = y + yOff(i);
			if (newTileDown(char[i].carriedBy) && verticalProp(char[i].carriedBy,1,1,char[char[i].carriedBy].x,char[char[i].carriedBy].y)) {
				char[char[i].carriedBy].y = Math.floor(char[char[i].carriedBy].y / 30) * 30;
			}
		}
	}
}
function startCutScene() {
	if (cutScene == 0) {
		if (toSeeCS) {
			cutScene = 1;
			cutSceneLine = 0;
			for (var i = 0; i < char.length; i++) {
				if (char[i].charState >= 7) char[i].diaMouthFrame = diaMouths[char[i].expr + charModels[char[i].id].mouthType*2].frameorder.length-1;
			}
			displayLine(currentLevel,cutSceneLine);
			char[control].dire = Math.ceil(char[control].dire / 2) * 2;
		} else {
			rescue();
			for (var _loc2_ = 0; _loc2_ < dialogueChar[currentLevel].length; _loc2_++) {
				var _loc1_ = dialogueChar[currentLevel][_loc2_];
				if (_loc1_ >= 50 && _loc1_ < 60) leverSwitch(_loc1_ - 50);
			}
			cutScene = 3;
		}
	}
}
function endCutScene() {
	toSeeCS = false;
	cutScene = 2;
	rescue();
	char[control].expr = charModels[char[control].id].defaultExpr;
	// csBubble.gotoAndPlay(17);
}
function rescue() {
	for (var _loc1_ = 0; _loc1_ < charCount; _loc1_++) {
		if (char[_loc1_].charState == 9) {
			char[_loc1_].charState = 10;
			char[_loc1_].expr = charModels[char[_loc1_].id].defaultExpr;
			// levelChar["char" + _loc1_].charBody.mouth.gotoAndStop(1);
		}
	}
}
function displayLine(level, line) {
	var _loc2_ = dialogueChar[level][line];
	if (_loc2_ >= 50 && _loc2_ < 60) {
		leverSwitch(_loc2_ - 50);
		cutSceneLine++;
		line = line + 1;
		_loc2_ = dialogueChar[level][line];
	}
	var _loc5_ = undefined;
	if (_loc2_ == 99) {
		_loc5_ = 480;
	} else {
		_loc5_ = Math.min(Math.max(char[_loc2_].x,bubWidth / 2 + bubMargin),960 - bubWidth / 2 - bubMargin);
		// putDown(_loc2_);
	}
	bubSc = 0.1;
	// _root.csBubble.gotoAndPlay(2);
	// _root.csBubble._x = _loc5_;
	bubX = _loc5_;
	if (char[control].y - cameraY > 270) {
		bubY = bubMargin + bubHeight / 2;
		// _root.csBubble._y = bubMargin + bubHeight / 2;
	} else {
		bubY = 520 - bubMargin - bubHeight / 2;
		// _root.csBubble._y = 520 - bubMargin - bubHeight / 2;
	}
	if (_loc2_ == 99) {
		// _root.csBubble.csBubble2.gotoAndStop(2);
	} else if (_loc2_ < char.length) {
		// _root.csBubble.csBubble2.gotoAndStop(1);
		// _root.csBubble.csBubble2.box.charBody.gotoAndStop(char[_loc2_].id + 1);
		// _root.levelChar["char" + _loc2_].charBody.gotoAndStop(Math.ceil(char[_loc2_].dire / 2) * 2);
		char[_loc2_].expr = dialogueFace[level][line]-2;
		char[_loc2_].diaMouthFrame = 0;
		// _root.levelChar["char" + _loc2_].charBody.mouth.gotoAndStop(1);
		// _root.levelChar["char" + _loc2_].charBody.mouth.gotoAndStop(dialogueFace[level][line]);
	}
	// _root.csBubble.csBubble2.textie.text = dialogueText[level][line];
	csText = dialogueText[level][line];
}
function drawCutScene() {
	ctx.save();
	ctx.transform(bubSc, 0, 0, bubSc, bubX, bubY);
	var bubLoc = {x:-bubWidth/2,y:-bubHeight/2};
	ctx.drawImage(svgCSBubble, bubLoc.x, bubLoc.y)
	var textwidth = 386.55;
	var textx = 106.7;
	var currdiachar = dialogueChar[currentLevel][Math.min(cutSceneLine, dialogueChar[currentLevel].length-1)]
	if (currdiachar == 99) {
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
	wrapText(csText, bubLoc.x+textx, bubLoc.y+4.25, textwidth, 23);
	ctx.restore();
	if (cutScene == 2) {
		if (bubSc > 0.1) bubSc -= bubSc/4;

	} else {
		if (bubSc < 0.99) bubSc += (1-bubSc)/4;
		else bubSc = 1;
	}
}
function startDeath(i) {
	// console.log('starting death...');
	if (char[i].deathTimer >= 30 && (char[i].charState >= 7 || char[i].temp >= 50)) {
		if (ifCarried(i)) {
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
		// if (char[i].temp >= 50) {
			//svgFire
			// levelChar["char" + i].fire.gotoAndStop(2);
		// }
	}
}
function endDeath(i) {
	// console.log('ending death...');
	putDown(i);
	char[i].temp = 0;
	char[i].heated = 0;
	// levelChar["char" + i]._visible = false;
	// levelChar["char" + i].fire.gotoAndStop(1);
	char[i].charState = 1;
	deathCount++;
	// saveGame();
	if (i == control) {
		changeControl();
	}
}
function clearTint(i) {
	// myColor = new Color(levelChar["char" + i]);
	// myColorTransform = new Object();
	// myColorTransform = {rb:0,ra:100,ba:100,ga:100};
	// myColor.setTransform(myColorTransform);
}
function bounce(i) {
	if (ifCarried(i)) {
		bounce(char[i].carriedBy);
	}
	if (char[i].dire % 2 == 0) {
		char[i].fricGoal = 0;
	}
	char[i].jump((- jumpPower) * 1.66);
	char[i].onob = false;
	char[i].y = Math.floor(char[i].y / 30) * 30 - 10;
}
function bumpHead(i) {
	if (char[i].standingOn >= 0) {
		char[i].onob = false;
		char[char[i].standingOn].vy = 0;
		fallOff(i);
	}
}
function rippleWeight(i, w, sign) {
	if (char[i].standingOn >= 0) {
		char[char[i].standingOn].weight2 += w * sign;
		if (char[char[i].standingOn].submerged == 1 && char[char[i].standingOn].weight2 < 0) {
			char[char[i].standingOn].submerged = 2;
		}
		if (char[char[i].standingOn].submerged >= 2 && char[char[i].standingOn].weight2 < 0 && char[char[i].standingOn].onob) {
			char[char[i].standingOn].onob = false;
		}
		rippleWeight(char[i].standingOn,w,sign);
	}
}
function onlyMovesOneBlock(i, j) {
	var _loc1_ = Math.floor((char[j].dire - 1) / 2) * 2 - 1;
	var _loc3_ = Math.ceil(_loc1_ * (char[i].x + char[i].w * _loc1_) / 30);
	var _loc2_ = Math.ceil(_loc1_ * (char[control].x + xOff2(control) + char[i].w * _loc1_) / 30);
	return Math.abs(_loc2_ - _loc3_) <= 1;
}
function putDown(i) {
	if (char[i].carry) {
		rippleWeight(i,char[char[i].carryObject].weight2,-1);
		char[i].weight2 = char[i].weight;
		char[char[i].carryObject].weight2 = char[char[i].carryObject].weight;
		char[i].carry = false;
		char[i].justChanged = 2;
		swapDepths(char[i].carryObject, (charCount - char[i].carryObject - 1) * 2);
		char[char[i].carryObject].carriedBy = -1;
		char[char[i].carryObject].stopMoving();
	}
	cornerHangTimer = 0;
}
function swapDepths(i, jdep) {
	charDepths[charDepths.indexOf(i)] = charDepths[jdep];
	charDepths[jdep] = i;
}
function charThrow(i) {
	char[i].weight2 = char[i].weight;
	char[char[i].carryObject].weight2 = char[char[i].carryObject].weight;
	char[char[i].carryObject].vy = -7.5;
	char[char[i].carryObject].vx = char[i].vx;
	if (char[i].dire <= 2) {
		char[char[i].carryObject].vx -= 3;
	} else {
		char[char[i].carryObject].vx += 3;
	}
}
function fallOff(i) {
	if (char[i].standingOn >= 0) {
		var _loc4_ = false;
		if (char[char[i].standingOn].submerged == 1) {
			char[char[i].standingOn].submerged = 2;
		} else {
			rippleWeight(i,char[i].weight2,-1);
		}
		var _loc3_ = char[char[i].standingOn].stoodOnBy.length;
		for (var _loc2_ = 0; _loc2_ < _loc3_; _loc2_++) {
			if (char[char[i].standingOn].stoodOnBy[_loc2_] == i) {
				_loc4_ = true;
			}
			if (_loc4_ && _loc2_ <= _loc3_ - 2) {
				char[char[i].standingOn].stoodOnBy[_loc2_] = char[char[i].standingOn].stoodOnBy[_loc2_ + 1];
			}
		}
		char[char[i].standingOn].stoodOnBy.pop();
		char[i].standingOn = -1;
		char[i].onob = false;
		for (var _loc2_; _loc2_ < char[i].stoodOnBy.length; _loc2_++) {
			fallOff(char[i].stoodOnBy[_loc2_]);
		}
	}
}
function aboveFallOff(i) {
	if (char[i].stoodOnBy.length >= 1) {
		for (var _loc1_ = 0; _loc1_ < char[i].stoodOnBy.length; _loc1_++) {
			fallOff(char[i].stoodOnBy[_loc1_]);
		}
	}
}
function objectsLandOn(i) {
	for (var _loc1_ = 0; _loc1_ < charCount; _loc1_++) {
		if (char[_loc1_].charState >= 5 && char[_loc1_].standingOn != i) {
			var _loc3_ = Math.abs(char[i].x - char[_loc1_].x);
			if (_loc3_ < char[i].w + char[_loc1_].w && char[i].y - char[i].h <= char[_loc1_].y && char[i].py - char[i].h > char[_loc1_].py && (char[i].submerged <= 1 || !char[_loc1_].onob || char[_loc1_].submerged == 2)) {
				if (char[_loc1_].standingOn >= 0) {
					fallOff(_loc1_);
				}
				char[_loc1_].standingOn = i;
				char[i].stoodOnBy.push(_loc1_);
				land(_loc1_,char[i].y - char[i].h,char[_loc1_].vy);
				if (char[i].charState == 6) {
					char[i].vy = inter(char[i].vy,char[_loc1_].vy,char[_loc1_].weight2 / (char[i].weight2 + char[_loc1_].weight2));
				}
				char[_loc1_].vy = char[i].vy;
				rippleWeight(_loc1_,char[_loc1_].weight2,1);
				char[_loc1_].fricGoal = char[i].fricGoal;
			}
		}
	}
}
function near(c1, c2) {
	var _loc3_ = char[c2].y - 23 - (char[c1].y - char[c1].h2 / 2);
	return Math.abs(_loc3_) <= char[c2].h / 2 + char[c1].h2 / 2 && Math.abs(char[c1].x + xOff2(c1) - char[c2].x) < 50;
}
function near2(c1, c2) {
	var _loc2_ = char[c2].y - 23 - (char[c1].y - char[c1].h2 / 2);
	return Math.abs(_loc2_) <= 20 && Math.abs(char[c1].x + xOff2(c1) - char[c2].x) < 50;
}
function inter(a, b, x) {
	return a + (b - a) * x;
}
function allSolid(i) {
	return blockProperties[i][0] && blockProperties[i][1] && blockProperties[i][2] && blockProperties[i][3];
}

function changeControl() {
	if (char[control].charState >= 7) {
		char[control].stopMoving();
		swapDepths(control, (charCount - control - 1) * 2);
		if (char[control].carry) {
			swapDepths(char[control].carryObject, (charCount - control - 1) * 2 + 1);
		}
	}
	control = (control + 1) % charCount;
	for (var _loc1_ = 0; char[control].charState != 10 && _loc1_ < 10; _loc1_++) {
		control = (control + 1) % charCount;
	}
	if (_loc1_ == 10) {
		control = 10000;
	}

	if (control < 1000) {
		if (ifCarried(control)) {
			putDown(char[control].carriedBy);
		}
		swapDepths(control, charCount * 2);
		if (char[control].carry) {
			swapDepths(char[control].carryObject, charCount * 2 + 1);
		}
		char[control].burstFrame = 0;
		char[control].expr = charModels[char[control].id].defaultExpr;
		// levelChar["char" + control].burst.gotoAndPlay(2);
	}
}
function exitLevel() {
	// _root.csBubble.removeMovieClip();
	// removeTileMovieClips();
	// _root.levelChar.removeMovieClip();
	// _root.bg.removeMovieClip();
	// _root.levelButtons.removeMovieClip();
	menuScreen = 2;
	cameraX = 0;
	cameraY = 0;
}

function nextDeadPerson(i, dire) {
	i2 = (i + dire + charCount) % charCount;
	while (char[i2].charState != 1) {
		i2 = (i2 + dire + charCount) % charCount;
	}
	return i2;
}
function numberOfDead() {
	var _loc2_ = 0;
	for (var _loc1_ = 0; _loc1_ < charCount; _loc1_++) {
		if (char[_loc1_].charState == 1) {
			_loc2_++;
		}
	}
	return _loc2_;
}
function recoverCycle(i, dire) {
	var _loc1_ = 0;
	var _loc2_ = dire;
	if (dire == 0) _loc2_ = 1;
	recover2 = (recover2 + _loc2_ + charCount) % charCount;
	while ((char[recover2].charState != 1 || char[recover2].pcharState <= 6) && _loc1_ < 10) {
		recover2 = (recover2 + _loc2_ + charCount) % charCount;
		_loc1_++;
	}
	if (_loc1_ == 10) {
		HPRCBubbleFrame = 4;
		// HPRCBubble.charImage.gotoAndPlay(5);
		recover = false;
		recover2 = 0;
	} else if (numberOfDead() == 1) {
		HPRCBubbleFrame = 2;
		// HPRCBubble.charImage.gotoAndStop(3);
		// HPRCBubble.charImage.anim.charBody.gotoAndStop(char[recover2].id + 1);
	} else {
		HPRCBubbleFrame = 3;
		// HPRCBubble.charImage.gotoAndStop(4);
		if (dire == 0) {
			// HPRCBubble.charImage.anim.gotoAndStop(1);
		} else {
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


function setup() {
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

// I think the draw loop coule be a good place to start optimisation when you get there.
function draw() {
	onButton = false;
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
	}
	if (menuScreen == 3) {
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
					bonusProgress = Math.floor(coins*0.33);
				}
				timer += getTimer() - levelTimer2;
				if (playMode == 0 && currentLevel < 99) {
					currentLevel++;
					toSeeCS = true; // this line was absent in the original source, but without it dialog doesn't play after level 1 when on a normal playthrough.
					levelProgress = currentLevel;
					resetLevel();
				} else {
					menuScreen = 2;
					cameraX = 0;
					cameraY = 0;
				}
				// saveGame();
			}
		}
		if (cutScene == 1 || cutScene == 2) {
			if (_keysDown[13] || _keysDown[16]) {
				if (!csPress && cutScene == 1) {
					cutSceneLine++;
					// if (dialogueChar[currentLevel][cutSceneLine] < char.length) char[dialogueChar[currentLevel][cutSceneLine]].diaMouthFrame = 0;
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
				if (recover) {
					char[control].justChanged = 2;
					if (recoverTimer == 0) {
						if (_keysDown[37]) {
							if (!leftPress) recoverCycle(HPRC2,-1);
							leftPress = true;
						} else leftPress = false;
						if (_keysDown[39]) {
							if (!rightPress) recoverCycle(HPRC2,1);
							rightPress = true;
						} else rightPress = false;
					}
				} else {
					if (cornerHangTimer == 0) {
						if (_keysDown[37]) {
							char[control].moveHorizontal(- power);
						} else if (_keysDown[39]) {
							char[control].moveHorizontal(power);
						}
					}
					if (!_keysDown[37] && !_keysDown[39]) char[control].stopMoving();
				}
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
							char[recover2].leg1frame = 1;
							char[recover2].leg2frame = 1;
							char[recover2].legdire = 1;
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
										swapDepths(_loc2_, charCount * 2 + 1);
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
				char[_loc2_].x = inter(char[HPRC1].x,goal,_loc5_);
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
					} if (!verticalProp(_loc2_,1,1,char[_loc2_].x,char[_loc2_].y)) {
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
							doorLightFadeDire[charsAtEnd-1] = 1;
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
							doorLightFadeDire[charsAtEnd-1] = -1;
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
	if (levelTimer <= 30 || menuScreen != 3) {
		if (wipeTimer >= 30 && wipeTimer <= 60) {
			white_alpha = 220 - wipeTimer * 4;
		}
	} else {
		white_alpha = 0;
	}
	if (wipeTimer == 29 && menuScreen == 3 && (charsAtEnd >= charCount2 || transitionType == 0)) {
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



	if (onButton) {
		setCursor('pointer');
	} else {
		setCursor('auto');
	}
	_frameCount++;
}