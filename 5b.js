
/* For testing the performance of any block of code. It averages every 100 runs and prints to the console. To use, simply place the following around the code block you'd like to test:
performanceTest(()=>{
}); */
// let performanceTestTimes = [];
// function performanceTest(action) {
// 	let performanceTestValue = performance.now();
// 	action();
// 	performanceTestTimes.push(performance.now() - performanceTestValue);
// 	if (performanceTestTimes.length >= 100) {
// 		console.log(performanceTestTimes.reduce((a, b) => a + b) / performanceTestTimes.length);
// 		performanceTestTimes = [];
// 	}
// }

let canvasReal;
let ctxReal;
let canvas;
let ctx;
const cwidth = 960;
const cheight = 540;
let pixelRatio;
let addedZoom = 1;
let highQual = true;
const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
const browserPasteSolution = typeof navigator.clipboard.readText === "function";
const browserCopySolution = typeof navigator.clipboard.write === "function";
let copyButton = 0; // Hack to make copying work on Safari.
const isMobile = isTouchDevice();

// offscreen canvases
let osc1, osctx1;
let osc2, osctx2;
let osc3, osctx3;
let osc4, osctx4;
let osc5, osctx5;
// explore level thumbnails
const thumbs = new Array(8);
const thumbsctx = new Array(8);
let thumbBig, thumbBigctx;

let _xmouse = 0;
let _ymouse = 0;
let _pxmouse = 0;
let _pymouse = 0;
let lastClickX = 0;
let lastClickY = 0;
let valueAtClick = 0;
let _cursor = 'default';
let touchCount = 0;
let hoverText = '';
const _keysDown = new Array(222).fill(false);
let _frameCount = 0;
let qTimer = 0;
let inputText = '';
let textAfterCursorAtClick = '';
// let controlOrCommandPress = false;

let levelsString = '';
let levelCount = 53;
let f = 19;
let levels = new Array(levelCount);
let startLocations = new Array(levelCount);
const locations = new Array(6);
let bgs = new Array(levelCount);
let levelStart = 0;
let levelWidth = 0;
let levelHeight = 0;
let thisLevel = [];
let tileFrames = [];
const switchable = new Array(6);
let charCount = 0;
let charCount2 = 0;
let playMode = 0;
let lineCount = 0;
let lineLength = 0;
let dialogueChar = new Array(levelCount);
let dialogueText = new Array(levelCount);
let dialogueFace = new Array(levelCount);
// Why are these next three arrays of length levelCount?
let cLevelDialogueChar = new Array(levelCount);
let cLevelDialogueText = new Array(levelCount);
let cLevelDialogueFace = new Array(levelCount);
let levelName = new Array(levelCount);
let mdao = new Array(levelCount);
let mdao2 = 0;
let levelProgress;
let bonusProgress;
let bonusesCleared;
let gotCoin;
let gotThisCoin = false;
let levelpackProgress = {};
const bfdia5b = window.localStorage;
let deathCount;
let timer;
let coins;
let longMode = false;
let quirksMode = false;
let enableExperimentalFeatures = window.location.hostname==='localhost';
let screenShake = true;
let screenFlashes = true;
let frameRateThrottling = true;
let slowTintsEnabled = true;
let optionText = ['Screen Shake','Screen Flashes','Quirks Mode','Experimental Features','Frame Rate Throttling', 'Slow Tints'];
let levelAlreadySharedToExplore = false;
let lcSavedLevels;
let nextLevelId;
let lcSavedLevelpacks;
let nextLevelpackId;
let whiteAlpha = 0;
let coinAlpha = 0;
let searchParams = new URLSearchParams(window.location.href);
let [levelId, levelpackId] = [searchParams.get("https://coppersalts.github.io/HTML5b/?level"), searchParams.get("https://coppersalts.github.io/HTML5b/?levelpack")]
const difficultyMap = [
	["Unknown", "#e6e6e6"],
	["Easy", "#85ff85"],
	["Normal", "#ffff00"],
	["Difficult", "#ffab1a"],
	["Hard", "#ff7070"],
	["Extreme", "#ff66d6"],
	["Insane", "#eca2de"],
	["Impossible", "#3d0000"],
];

function clearVars() {
	deathCount = timer = coins = bonusProgress = levelProgress = 0;
	bonusesCleared = new Array(33).fill(false);
	gotCoin = new Array(levelCount).fill(false);
}
function saveGame() {
	if (playingLevelpack) {
		if (levelpackType === 1) return;
		levelpackProgress[exploreLevelPageLevel.id].levelProgress = levelProgress;
		levelpackProgress[exploreLevelPageLevel.id].coins = gotCoin;
		levelpackProgress[exploreLevelPageLevel.id].deaths = deathCount;
		levelpackProgress[exploreLevelPageLevel.id].timer = timer;
		saveLevelpackProgress();
		return;
	}
	bfdia5b.setItem('gotCoin', gotCoin);
	bfdia5b.setItem('coins', coins);
	bfdia5b.setItem('levelProgress', levelProgress);
	bfdia5b.setItem('bonusProgress', bonusProgress);
	bfdia5b.setItem('bonusesCleared', bonusesCleared);
	bfdia5b.setItem('deathCount', deathCount);
	bfdia5b.setItem('timer', timer);
}

function getSavedGame() {
	if (bfdia5b.getItem('levelProgress') == undefined) {
		clearVars();
	} else {
		levelProgress = parseInt(bfdia5b.getItem('levelProgress'));
		// bonusProgress = parseInt(bfdia5b.getItem('bonusProgress'));
		bonusProgress = 0;
		deathCount = parseInt(bfdia5b.getItem('deathCount'));
		timer = parseFloat(bfdia5b.getItem('timer'));
		gotCoin = new Array(levelCount);
		let gotCoinRaw = bfdia5b.getItem('gotCoin').split(',');
		coins = 0;
		for (let i = 0; i < levelCount; i++) {
			gotCoin[i] = gotCoinRaw[i] === 'true';
			if (gotCoin[i]) coins++;
		}
		// bonusesCleared = new Array(33);
		// let bonusesClearedRaw = bfdia5b.getItem('bonusesCleared').split(',');
		// for (let i = 0; i < 33; i++) {
		// 	bonusesCleared[i] = bonusesClearedRaw[i] === 'true';
		// }
		bonusesCleared = new Array(33).fill(false);
	}
}
getSavedGame();
getSavedSettings();

function saveSettings() {
	bfdia5b.setItem('settings', JSON.stringify([screenShake, screenFlashes, quirksMode, enableExperimentalFeatures, frameRateThrottling, slowTintsEnabled]));
}

function getSavedSettings() {
	if (bfdia5b.getItem('settings') == undefined) {
		saveSettings();
	} else {
		let settingsArray = JSON.parse(bfdia5b.getItem('settings'));
		screenShake = settingsArray[0];
		screenFlashes = settingsArray[1];
		quirksMode = settingsArray[2];
		enableExperimentalFeatures = settingsArray[3];
		frameRateThrottling = settingsArray[4];
		slowTintsEnabled = settingsArray[5];
	}
}

function saveMyLevels() {
	bfdia5b.setItem('myLevels', JSON.stringify(lcSavedLevels));
	bfdia5b.setItem('nextLevelId', nextLevelId);
}

function getSavedLevels() {
	if (bfdia5b.getItem('myLevels') == undefined) {
		bfdia5b.setItem('myLevels', '{}');
		bfdia5b.setItem('nextLevelId', 0);
	}
	lcSavedLevels = JSON.parse(bfdia5b.getItem('myLevels'));
	nextLevelId = bfdia5b.getItem('nextLevelId');
	if (nextLevelId == "NaN") {
		nextLevelId = 0;
		bfdia5b.setItem('nextLevelId', nextLevelId);
	}
}

function deleteSavedLevel(id) {
	delete lcSavedLevels[id];
	saveMyLevels();
	let keys = Object.keys(lcSavedLevelpacks);
	for (let i = 0; i < keys.length; i++) {
		let levelpackLevels = lcSavedLevelpacks[keys[i]].levels;
		let levelpackLevelsRemoved = [];
		for (let j = 0; j < levelpackLevels.length; j++) {
			if ('l' + levelpackLevels[j] != id) levelpackLevelsRemoved.push(levelpackLevels[j]);
		}
		lcSavedLevelpacks[keys[i]].levels = levelpackLevelsRemoved;
	}
	saveMyLevelpacks();
}

function deleteSavedLevelpack(id) {
	delete lcSavedLevelpacks[id];
	saveMyLevelpacks();
}

function saveMyLevelpacks() {
	bfdia5b.setItem('myLevelpacks', JSON.stringify(lcSavedLevelpacks));
	bfdia5b.setItem('nextLevelpackId', nextLevelpackId);
}

function getSavedLevelpacks() {
	if (bfdia5b.getItem('myLevelpacks') == undefined) {
		bfdia5b.setItem('myLevelpacks', '{}');
		bfdia5b.setItem('nextLevelpackId', 0);
	}
	lcSavedLevelpacks = JSON.parse(bfdia5b.getItem('myLevelpacks'));
	nextLevelpackId = bfdia5b.getItem('nextLevelpackId');
}

function saveLevelpackProgress() {
	bfdia5b.setItem('levelpackProgress', JSON.stringify(levelpackProgress));
}

function getSavedLevelpackProgress() {
	if (bfdia5b.getItem('levelpackProgress') == undefined) {
		bfdia5b.setItem('levelpackProgress', '{}');
	}
	levelpackProgress = JSON.parse(bfdia5b.getItem('levelpackProgress'));
}
getSavedLevelpackProgress();

function getTimer() {
	return _frameCount / 0.06;
}

function charAt(j) {
	return levelsString.charCodeAt(j + levelStart) - 48;
}

function charAt2(j) {
	return levelsString.charAt(j + levelStart);
}

function tileAt(j, i, y) {
	let num = levelsString.charCodeAt(j + levelStart);
	if (num == 8364) return 93;
	if (num <= 126) return num - 46;
	if (num <= 182) return num - 80;
	return num - 81;
}

// Load Level Data
function loadLevels() {
	levelCount = 53;
	levels = new Array(levelCount);
	startLocations = new Array(levelCount);
	bgs = new Array(levelCount);
	dialogueChar = new Array(levelCount);
	dialogueText = new Array(levelCount);
	dialogueFace = new Array(levelCount);
	levelName = new Array(levelCount);
	mdao = new Array(levelCount);
	mdao2 = 0;
	levelStart = 0;

	for (let i = 0; i < levelCount; i++) {
		levelStart += 2;

		// Read Level Name
		levelName[i] = '';
		for (lineLength = 0; charAt(lineLength) != -35; lineLength++) {
			levelName[i] += charAt2(lineLength);
		}

		// Temporary crash fix for chrome devices on version 117+
		console.log(levelsString);

		// Read Level Metadata
		levelStart += lineLength;
		levelWidth = 10 * charAt(2) + charAt(3);
		levelHeight = 10 * charAt(5) + charAt(6);
		charCount = 10 * charAt(8) + charAt(9);
		bgs[i] = 10 * charAt(11) + charAt(12);
		longMode = false;
		if (charAt(14) == 24) longMode = true;

		// Read Level Block Layout Data
		levels[i] = new Array(levelHeight);
		for (let j = 0; j < levelHeight; j++) {
			levels[i][j] = new Array(levelWidth);
		}
		if (longMode) {
			for (let y = 0; y < levelHeight; y++) {
				for (let x = 0; x < levelWidth; x++) {
					levels[i][y][x] =
						111 * tileAt(y * (levelWidth * 2 + 2) + x * 2 + 17, i, y) +
						tileAt(y * (levelWidth * 2 + 2) + x * 2 + 18, i, y);
				}
			}
			levelStart += levelHeight * (levelWidth * 2 + 2) + 17;
		} else {
			for (let y = 0; y < levelHeight; y++) {
				for (let x = 0; x < levelWidth; x++) {
					levels[i][y][x] = tileAt(y * (levelWidth + 2) + x + 17, i, y);
				}
			}
			levelStart += levelHeight * (levelWidth + 2) + 17;
		}

		// Read Entity Data
		startLocations[i] = new Array(charCount);
		for (let j = 0; j < charCount; j++) {
			startLocations[i][j] = new Array(6);
			for (let k = 0; k < (f - 1) / 3; k++) {
				startLocations[i][j][k] = charAt(k * 3) * 10 + charAt(k * 3 + 1);
			}
			levelStart += f - 2;
			if (startLocations[i][j][5] == 3 || startLocations[i][j][5] == 4) {
				levelStart++;
				startLocations[i][j].push([]);
				for (lineLength = 0; charAt(lineLength) != -35; lineLength++) {
					startLocations[i][j][6].push(charAt(lineLength));
				}
				levelStart += lineLength;
			}
			levelStart += 2;
		}

		// Read Dialogue
		lineCount = 10 * charAt(0) + charAt(1);
		levelStart += 4;
		dialogueText[i] = new Array(lineCount);
		dialogueChar[i] = new Array(lineCount);
		dialogueFace[i] = new Array(lineCount);
		for (let j = 0; j < lineCount; j++) {
			dialogueChar[i][j] = 10 * charAt(0) + charAt(1);
			if (charAt(2) == 24) dialogueFace[i][j] = 2;
			else dialogueFace[i][j] = 3;
			levelStart += 4;
			lineLength = 0;
			dialogueText[i][j] = '';
			while (charAt(lineLength) != -35) {
				lineLength++;
				dialogueText[i][j] += charAt2(lineLength - 1);
			}
			levelStart += lineLength + 2;
		}

		// Read Necessary Deaths
		mdao2 += 100000 * charAt(0) + 10000 * charAt(1) + 1000 * charAt(2) + 100 * charAt(3) + 10 * charAt(4) + charAt(5);
		mdao[i] = mdao2;
		levelStart += 8;
	}
}

function loadLevelpack(levelData) {
	levelCount = levelData.length;
	levels = new Array(levelCount);
	startLocations = new Array(levelCount);
	bgs = new Array(levelCount);
	dialogueChar = new Array(levelCount);
	dialogueText = new Array(levelCount);
	dialogueFace = new Array(levelCount);
	levelName = new Array(levelCount);
	mdao = new Array(levelCount);
	mdao2 = 0;

	for (let lvl = 0; lvl < levelCount; lvl++) {
		let i = 0;
		let lines = levelData[lvl].data.replace(/\r/gi, '').split('\n');
		while (lines[i] === '') i++;

		// 5beam allows these in levels
		if (lines[0] === "loadedLevels=") lines.shift()

		// Read Level Name
		levelName[lvl] = lines[i];
		i++;

		// Read Level Metadata
		let metadata = lines[i].split(',');
		levelWidth = parseInt(metadata[0]);
		levelHeight = parseInt(metadata[1]);
		charCount = parseInt(metadata[2]);
		bgs[lvl] = parseInt(metadata[3]);
		longMode = metadata[4] == 'H';
		i++;

		// Read Level Block Layout Data
		levels[lvl] = new Array(levelHeight);
		if (longMode) {
			for (let y = 0; y < levelHeight; y++) {
				levels[lvl][y] = new Array(levelWidth);
				for (let x = 0; x < levelWidth; x++) {
					levels[lvl][y][x] =
						111 * tileIDFromChar(lines[i + y].charCodeAt(x * 2)) +
						tileIDFromChar(lines[i + y].charCodeAt(x * 2 + 1));
				}
			}
		} else {
			for (let y = 0; y < levelHeight; y++) {
				levels[lvl][y] = new Array(levelWidth);
				for (let x = 0; x < levelWidth; x++) {
					levels[lvl][y][x] = tileIDFromChar(lines[i + y].charCodeAt(x));
				}
			}
		}
		i += levelHeight;

		// Read Entity Data
		startLocations[lvl] = new Array(charCount);
		for (let j = 0; j < charCount; j++) {
			let entityInfo = lines[i + j].split(/[\s,\.]+/);
			startLocations[lvl][j] = new Array(6);
			startLocations[lvl][j][0] = parseInt(entityInfo[0], 10);
			startLocations[lvl][j][1] = parseInt(entityInfo[1], 10);
			startLocations[lvl][j][2] = parseInt(entityInfo[2], 10);
			startLocations[lvl][j][3] = parseInt(entityInfo[3], 10);
			startLocations[lvl][j][4] = parseInt(entityInfo[4], 10);
			startLocations[lvl][j][5] = parseInt(entityInfo[5], 10);

			if (startLocations[lvl][j][5] == 3 || startLocations[lvl][j][5] == 4) {
				startLocations[lvl][j].push([]);
				for (let lineLength = 0; lineLength < entityInfo[6].length; lineLength++) {
					startLocations[lvl][j][6].push(entityInfo[6].charCodeAt(lineLength) - 48);
				}
			}
		}
		i += charCount;

		// Read Dialogue
		lineCount = parseInt(lines[i], 10);
		i++;
		dialogueText[lvl] = new Array(lineCount);
		dialogueChar[lvl] = new Array(lineCount);
		dialogueFace[lvl] = new Array(lineCount);
		for (let j = 0; j < lineCount; j++) {
			dialogueChar[lvl][j] = parseInt(lines[i + j].slice(0, 2));
			if (lines[i + j].charAt(2) == 'H') dialogueFace[lvl][j] = 2;
			else dialogueFace[lvl][j] = 3;
			dialogueText[lvl][j] = lines[i + j].substring(4);
		}
		i += lineCount;

		// Read Necessary Deaths
		mdao2 += parseInt(lines[i], 10);
		mdao[lvl] = mdao2;
		// i++;
	}
}

// [0]  - collide down
// [1]  - collide up
// [2]  - collide right
// [3]  - collide left
// [4]  - hurts down
// [5]  - hurts up
// [6]  - hurts right
// [7]  - hurts left
// [8]  - uses movieclip
// [9]  - fill tool not allowed in lc
// [10] - uses shadows
// [11] - switches for
// [12] - switched by
// [13] - uses borders
// [14] - is liquid
// [15] - availible in level creator
// [16] - animation frames
// [17] - loop?
// [18] - loop frame order
const blockProperties = [
	// tile0
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,0,false],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,true,1,false],
	[true,true,true,true,true,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,true,false,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,true,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,true,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,true,0,false],
	[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,true,120,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119]],
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,0,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	// tile1
	[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,true,0,false],
	[true,true,true,true,false,false,false,false,true,false,false,0,0,false,false,true,14,false,[0,1,2,3,4,5,6,7,8,9,10,11,12,13]],
	[true,true,true,true,false,false,false,false,true,false,false,0,6,false,false,true,12,true,[0,1,2,3,4,5,6,7,8,9,10,11]],
	[false,false,false,false,false,false,false,false,true,false,true,0,0,false,false,true,41,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]],
	[true,true,true,true,false,false,false,false,true,false,false,0,6,false,false,true,12,true,[0,1,2,3,4,5,6,7,8,9,10,11]],
	[true,true,true,true,true,true,true,true,false,false,false,0,0,false,false,true,1,true],
	[false,true,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,true,false,false,false,false,false,false,0,0,false,false,true,1,false],
	// tile2
	[true,true,true,true,false,true,false,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,true,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,true,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,true,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	// tile3
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,0,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,0,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,1,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,7,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,2,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,8,0,false,false,true,1,false],
	[false,true,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	// tile4
	[true,true,true,true,false,false,false,false,true,true,false,13,0,false,false,true,5,false],
	[true,true,true,true,false,false,false,false,true,true,false,14,0,false,false,true,5,false],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,true,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,true,false,true,false,true,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,true,true,false,false,true,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,true,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,0,0,false,false,true,3,true,[0,0,0,0,0,1,1,2,2,1,1]],
	// tile5
	[false,false,false,false,false,false,false,false,false,true,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,0,2,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,0,2,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,2,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,2,false,false,true,1,false],
	[false,true,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,3,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,9,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,true,120,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119]],
	// tile6
	[true,true,true,true,false,false,false,false,true,false,false,0,3,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,3,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,3,false,false,true,1,false],
	[false,true,false,false,false,false,false,false,true,false,false,0,3,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,3,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,0,3,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,true,2,true,[0,0,0,1,1,1]],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,true,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[true,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	// tile7
	[false,false,false,true,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,true,false,15,0,false,false,true,5,false],
	[true,true,true,true,true,true,true,true,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,0,0,false,false,true,30,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]],
	[false,false,false,false,true,true,true,true,true,false,false,0,0,false,false,true,20,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]],
	[false,false,false,false,true,true,true,true,true,false,false,0,0,false,false,true,20,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false,true,1,false],
	[true,true,true,true,true,true,true,true,true,false,false,0,1,false,false,true,1,false],
	// tile8
	[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false,true,120,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119]],
	[false,true,false,false,false,false,false,false,true,false,false,0,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false,true,1,false],
	[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,true,12,true,[0,1,2,3,4,5,6,7,8,9,10,11]],
	[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,false,1,false],
	[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,true,12,true,[0,1,2,3,4,5,6,7,8,9,10,11]],
	[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	// tile9
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,false,1,false],
	// tile10
	[false,false,false,false,true,true,true,true,false,false,false,0,1,false,true,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,0,false,false,true,60,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,true,1,false],
	[false,false,false,false,true,true,true,true,false,false,false,0,1,false,true,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,0,false,false,true,60,true,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,6,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,12,0,false,false,true,1,false],
	// tile11
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	// tile12
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,0,false],
	// tile13
	[false,false,false,false,false,false,false,false,false,false,false,0,0,false,true,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,0,0,false,false,false,1,false],
	[false,true,false,false,false,false,false,false,true,false,false,0,2,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,0,2,false,false,true,1,false],
];
const switches = [[31,33,32,34,79,78,81,82],[51,53,52,54,133,134],[65,61,60,62,63,64],[],[],[14,16,83,85]];

// [0] - hitbox width
// [1] - hitbox height
// [2] - weight
// [3] - carried object height
// [4] - friction
// [5] - cached as bitmap
// [6] - heat speed
// [7] - number of frames
// [8] - has arms
// [9] - default state (in level creator)
const charD = [
	[28,45.4,0.45,27,0.8,false,1,1,true,10],
	[23,56,0.36,31,0.8,false,1.7,1,true,10],
	[20,51,0.41,20,0.85,false,5,1,false,10],
	[10,86,0.26,31,0.8,false,1.6,1,true,10],
	[10,84,0.23,31,0.8,false,1.4,1,true,10],
	[28,70,0.075,28,0.8,false,9,1,true,10],
	[26,49,0.2,20,0.75,false,0.6,1,false,10],
	[44,65,0.8,20,0.75,false,0.8,1,false,10],
	[16,56,0.25,17,0.76,false,0.8,1,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[0,0,0,0,0,false,1,0,true,10],
	[36.5,72.8,1,20,0.6,false,0,1,true,6],
	[15.1,72.8,0.6,20,0.7,true,0,1,true,6],
	[20,40,0.15,20,0.7,true,0.7,1,true,6],
	[25,50,0.64,20,0.6,true,0.1,1,true,6],
	[25,10,1,5,0.7,true,0.2,1,true,4],
	[25,50,1,20,0.7,true,0.1,1,true,3],
	[25,29,0.1,20,0.8,true,1,1,true,6],
	[21.5,43,0.3,20,0.6,true,0.5,1,true,6],
	[35,60,1,20,0.7,true,0.1,1,true,3],
	[22.5,45,1,20,0.7,true,0.8,1,true,3],
	[25,50,1,20,0.7,true,0.1,27,true,3],
	[15,30,0.64,20,0.6,true,0.2,1,true,3],
	[10,55,0.8,20,0.3,true,0.4,1,true,6],
	[45,10,1,20,0.7,true,0.2,1,true,4],
	[20,40,1,20,0.8,false,0.8,5,true,3],
	[16,45,0.4,20,0.94,false,1.1,60,true,3],
	[25,10,1,20,0.7,true,0.3,1,true,3],
	[45,10,0.4,20,0.7,true,0.7,1,true,4],
	[15,50,0.1,20,0.8,true,1.9,1,true,6],
	[25,25,0.1,20,0.8,true,1.7,1,true,6],
	[30,540,10,20,0.4,true,0,1,true,3]
];

const diaMouths = [
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
const bodyPartAnimations = [
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
const legFrames = [
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

const charModels = [
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
				{type:'static',bodypart:0,mat:{a:-0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:-5.4,ty:-30.5}},
				{type:'static',bodypart:41,mat:{a:0.211151123046875,b:-0.2940673828125,c:-0.300384521484375,d:-0.2069244384765625,tx:-1.35,ty:-17.85}},
			],
			[
				{type:'static',bodypart:41,mat:{a:-0.211151123046875,b:-0.2940673828125,c:0.300384521484375,d:-0.2069244384765625,tx:23.05,ty:-20.6}},
				{type:'body',mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:-1.1,ty:-23.8}},
				{type:'static',bodypart:1,mat:{a:0.399322509765625,b:-0.0230865478515625,c:0.0230865478515625,d:0.399322509765625,tx:14.8,ty:-21.15}},
				{type:'static',bodypart:0,mat:{a:0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:7.2,ty:-30.5}},
				{type:'static',bodypart:0,mat:{a:-0.3636016845703125,b:0.02899169921875,c:0.02899169921875,d:0.3636016845703125,tx:21.25,ty:-31.5}},
				{type:'static',bodypart:41,mat:{a:-0.211151123046875,b:-0.2940673828125,c:0.300384521484375,d:-0.2069244384765625,tx:3.15,ty:-17.85}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-0.12213134765625,b:0.343719482421875,c:-0.343719482421875,d:-0.12213134765625,tx:-21.4,ty:-20.9}},
				{type:'body',mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:1.5,ty:-23.8}},
				{type:'static',bodypart:5,mat:{a:-0.412109375,b:-0.0328521728515625,c:-0.024749755859375,d:0.3104248046875,tx:-9.3,ty:-21.75}},
				{type:'static',bodypart:4,mat:{a:0.3636016845703125,b:0.02899169921875,c:-0.02899169921875,d:0.3636016845703125,tx:-20.8,ty:-32}},
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
		firemat: {a:1,b:0,c:0,d:1,tx:0,ty:0},
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
				{type:'static',bodypart:0,mat:{a:-0.193145751953125,b:0,c:0,d:0.3648529052734375,tx:-30.55,ty:-43.05}},
			],
			[
				{type:'armroot',id:0,pos:{x:31.05,y:-22.9}},
				{type:'armroot',id:1,pos:{x:-27,y:-22.9}},
				{type:'body',mat:{a:-0.3648529052734375,b:0,c:0,d:0.3648529052734375,tx:2.35,ty:-42}},
				{type:'static',bodypart:36,mat:{a:0.1955413818359375,b:0,c:0,d:0.400299072265625,tx:30.5,ty:-29.65}},
				{type:'static',bodypart:0,mat:{a:0.193145751953125,b:0,c:0,d:0.3648529052734375,tx:35.25,ty:-43.05}},
			]
		]
	},
	{
		// Lego Brick
		torsomat: {a:0.2733306884765625,b:0,c:0,d:0.273284912109375,tx:-26,ty:-49.75},
		legx: [-7.9, 12.5],
		legy: [-12, -11.85],
		firemat: {a:-0.4046630859375,b:0.0060882568359375,c:0.006805419921875,d:0.5772552490234375,tx:-1.15,ty:-51},
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
		firemat: {a:-0.865478515625,b:0.007171630859375,c:0.014556884765625,d:0.680572509765625,tx:0,ty:-60.15},
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
		firemat: {a:-0.34619140625,b:0.0060882568359375,c:0.0058135986328125,d:0.5772552490234375,tx:1.45,ty:-53.55},
		charimgmat: {a:-0.112091064453125,b:0,c:0,d:0.112091064453125,tx:8.05,ty:-5.8},
		burstmat: {a:0.794342041015625,b:0,c:0,d:0.952484130859375,tx:1.55,ty:-29.75},
		defaultExpr: 0,
		mouthType: 0,
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
	{
		burstmat: {a:1.7895660400390625,b:0,c:0,d:1.207855224609375,tx:0.8,ty:-39.25},
		charimgmat: {a:0.3,b:0,c:0,d:0.3,tx:0,ty:0},
	},
	{
		burstmat: {a:0.952056884765625,b:0,c:0,d:1.207855224609375,tx:0.15,ty:-39.65},
		charimgmat: {a:0.3,b:0,c:0,d:0.3,tx:0,ty:0},
	},
	{
		firemat: {a:-0.34619140625,b:0.0040283203125,c:0.0058135986328125,d:0.3830718994140625,tx:-1.25,ty:-27.6},
		burstmat: {a:1.0710906982421875,b:0,c:0,d:0.906219482421875,tx:-0.65,ty:-22.85},
		charimgmat: {a:0.5,b:0,c:0,d:0.5,tx:0,ty:0},
	},
	{
		firemat: {a:-0.408905029296875,b:0.0047607421875,c:0.006866455078125,d:0.452484130859375,tx:-1.4,ty:-35.25},
		burstmat: {a:1.4060821533203125,b:0,c:0,d:1.207855224609375,tx:-0.75,ty:-31.25},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.39605712890625,b:0.0052490234375,c:0.0020904541015625,d:0.15771484375,tx:0.25,ty:-9.1},
		burstmat: {a:1.1382598876953125,b:0,c:0,d:0.3983306884765625,tx:0.1,ty:-8.45},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.4046478271484375,b:0.00537109375,c:0.00616455078125,d:0.467559814453125,tx:0,ty:-36.95},
		burstmat: {a:1.1150665283203125,b:0,c:0,d:0.85455322265625,tx:-0.1,ty:-28.65},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.4213104248046875,b:0.0055694580078125,c:0.003631591796875,d:0.2767333984375,tx:0,ty:-20.25},
		burstmat: {a:1.139404296875,b:0,c:0,d:0.77362060546875,tx:0.95,ty:-20.2},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.3904876708984375,b:0.0051422119140625,c:0.00531005859375,d:0.406890869140625,tx:-0.25,ty:-30.05},
		burstmat: {a:1.079010009765625,b:0,c:0,d:0.906219482421875,tx:0.1,ty:-27.5},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.5459136962890625,b:0.0071868896484375,c:0.0072479248046875,d:0.5560760498046875,tx:-0.3,ty:-42.4},
		burstmat: {a:1.5228729248046875,b:0,c:0,d:1.328765869140625,tx:-0.35,ty:-40.85},
		charimgmat: {a:0.3,b:0,c:0,d:0.3,tx:0,ty:0},
	},
	{
		firemat: {a:-0.371612548828125,b:0.0048828125,c:0.0054473876953125,d:0.4189453125,tx:-0.15,ty:-31.25},
		burstmat: {a:1.0906829833984375,b:0,c:0,d:0.9201812744140625,tx:0.7,ty:-30},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.390960693359375,b:0.005126953125,c:0.0054473876953125,d:0.4189453125,tx:0.1,ty:-33.75},
		burstmat: {a:1.031402587890625,b:0,c:0,d:0.855499267578125,tx:0.95,ty:-30.85},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.2586822509765625,b:0.003387451171875,c:0.0032958984375,d:0.253692626953125,tx:0.1,ty:-20.9},
		burstmat: {a:0.7251434326171875,b:0,c:0,d:0.5919189453125,tx:0.15,ty:-19.4},
		charimgmat: {a:0.3,b:0,c:0,d:0.3,tx:0,ty:0},
	},
	{
		firemat: {a:-0.1841278076171875,b:0.002410888671875,c:0.0059814453125,d:0.46124267578125,tx:-0.05,ty:-36.8},
		burstmat: {a:0.6854095458984375,b:0,c:0,d:1.010223388671875,tx:0.55,ty:-33.6},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.720306396484375,b:0.009429931640625,c:0.0023193359375,d:0.1834716796875,tx:-0.25,ty:-10.55},
		burstmat: {a:1.5430145263671875,b:0,c:0,d:0.371612548828125,tx:-0.35,ty:-8.2},
		charimgmat: {a:0.3,b:0,c:0,d:0.3,tx:0,ty:0},
	},
	{
		firemat: {a:-0.2956695556640625,b:0.00384521484375,c:0.004364013671875,d:0.34716796875,tx:-0.25,ty:-27.4},
		burstmat: {a:0.8918304443359375,b:0,c:0,d:0.7522430419921875,tx:0.15,ty:-24.4},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.27447509765625,b:0.0035400390625,c:0.006561279296875,d:0.5229644775390625,tx:-0.25,ty:-29.7},
		burstmat: {a:0.8918304443359375,b:0,c:0,d:0.94287109375,tx:0.15,ty:-18.1},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.3960723876953125,b:0.0052490234375,c:0.0020904541015625,d:0.15771484375,tx:0.25,ty:-9.1},
		burstmat: {a:1.13824462890625,b:0,c:0,d:0.3983154296875,tx:0.1,ty:-8.45},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.6592254638671875,b:0.0086212158203125,c:0.0023193359375,d:0.18426513671875,tx:0.75,ty:-10.5},
		burstmat: {a:1.5430145263671875,b:0,c:0,d:0.371612548828125,tx:-0.35,ty:-6.95},
		charimgmat: {a:0.3,b:0,c:0,d:0.3,tx:0,ty:0},
	},
	{
		firemat: {a:-0.23907470703125,b:0.00311279296875,c:0.0062713623046875,d:0.49932861328125,tx:-0.4,ty:-38.95},
		burstmat: {a:0.784454345703125,b:0,c:0,d:0.9769287109375,tx:0.15,ty:-28.35},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.39166259765625,b:0.005096435546875,c:0.00311279296875,d:0.249603271484375,tx:-0.3,ty:-18.85},
		burstmat: {a:1.0699005126953125,b:0,c:0,d:0.577911376953125,tx:0.15,ty:-16.85},
		charimgmat: {a:0.4,b:0,c:0,d:0.4,tx:0,ty:0},
	},
	{
		firemat: {a:-0.5117645263671875,b:0.00665283203125,c:0.0527801513671875,d:4.22344970703125,tx:-3.45,ty:-356.65},
		burstmat: {a:1.5361328125,b:0,c:0,d:7.588623046875,tx:0,ty:-286.65},
		charimgmat: {a:0.1,b:0,c:0,d:0.1,tx:0,ty:0},
	},
];
const names = ['Ruby','Book','Ice Cube','Match','Pencil','Bubble','Lego Brick','Waffle','Tune','','','','','','','','','','','','','','','','','','','','','','','','','','','HPRC 1','HPRC 2','Crate','Metal Box','Platform','Spike Ball','Package','Companian Cube','Rusty Apparatuses','Purple Thing','Saw Blade','Spike Ball Jr.','Pillar','Large Platform','Blue Spike Ball','Green Things','Acid Platform','Large Acid Platform','Green Block','Blue Block','Spike Wall'];
let selectedTab = 0;
let selectedBg = 0;
const tabNames = ['Level Info', 'Characters / Objects', 'Tiles', 'Background', 'Dialogue', 'Options'];
let charInfoHeight = 40;
let diaInfoHeight = 20;
const charStateNames = ['', 'Dead', 'Being Recovered', 'Deadly & Moving', 'Moving', 'Deadly', 'Carryable', '', 'Non-Playable Character', 'Rescuable', 'Playable Character'];
const charStateNamesShort = ['', 'D', 'BR', 'D&M', 'M', 'D', 'C', '', 'NPC', 'R', 'P'];
const toolNames = ['Draw Tool', 'Eraser Tool', 'Fill Rectangle Tool', 'Fill Tool', 'Eyedropper Tool', 'Selection Tool', 'Row Tool', 'Column Tool', '', 'Copy', 'Undo / Redo', 'Clear'];
const tileNames = ['Air','Red Ground Block','Downward Facing Gray Spikes','Upward Facing Gray Spikes','Right Facing Gray Spikes','Left Facing Gray Spikes','End Gate','"E" Tree','Dialogue Starter','Red Background Block','Green Ground Block','Green Background Block','Win Token','Spring Block','Left Conveyer','Heater','Right Conveyer','Gray Spike Ball','Upward One-Way Platform','Downward Facing Black Spikes','Upward Facing Black Spikes','Right Facing Black Spikes','Left Facing Black Spikes','Downward Facing Black Spikes with Support Cable','Vertical Support Cable','Vertical Support Cable Connected Right','Horizontal Support Cable','Top Left Support Cable Connector','Horizontal Support Cable Connected Down','Horizontal Support Cable Connected Up','Vertical Support Cable Connected Left','Yellow Switch Block Solid','Dark Yellow Switch Block Solid','Yellow Switch Block Passable','Dark Yellow Switch Block Passable','Yellow Lever Facing Left','Yellow Lever Facing Right','Blue Lever Facing Left','Blue Lever Facing Right','Green Background Block with Upward One-Way Platform','Yellow Button','Blue Button','Gray Grass','Gray Dirt','Right Facing One-Way Platform','Two-Way Gray Spikes Top Left','Two-Way Gray Spikes Top Right','Crumbling Rock','Conglomerate-Like Background Block','Lamp','Gray Gems','Blue Switch Block Solid','Dark Blue Switch Block Solid','Blue Switch Block Passable','Dark Blue Switch Block Passable','Conglomerate-Like Background Block with Upward One-Way Platform','Gray Block','Green Lever Facing Left','Green Lever Facing Right','"V" Tree','Dark Green Switch Block Solid','Green Switch Block Passable','Dark Green Switch Block Passable','Green Switch Platform Up Solid','Green Switch Platform Up Passable','Green Switch Block Solid','Spotlight','Black Block','Left Facing One-Way Platform','Downward One-Way Platform','Green Background Block with Left Facing One-Way Platform','Green Button','Black Spike Ball','Purple Ground Block','"Wind Gust" Block','Vertical Electric Barrier','Horiontal Electric Barrier','Purple Background Block','Yellow Switch Spike Ball Passable','Yellow Switch Spike Ball Solid','"I" Tree','Yellow Switch Platform Up Solid','Yellow Switch Platform Up Passable','One-Way Conveyer Left','One-Way Conveyer Left (not moving)','One-Way Conveyer Right','One-Way Conveyer Right (not moving)','Purple Background Block Slanted Bottom Left','Purple Background Block Slanted Bottom Right','Light Gray Vertical Support Cable','Light Gray Horizontal Support Cable','Light Gray Horizontal Support Cable Connected Down','Light Gray Horizontal Support Cable Connected Up','Wood Block','Wood Background Block','Danger Zone Background Block','Purple Background Block Slanted Top Right','Purple Background Block Slanted Top Left','Gray Metal Ground Block','Wooden Background Block... again?','Acid','Acid Glow','Yellow Metal Ground Block','Lava','Lava Glow','Red Metal Ground Block','Yellow Metal Background Block','Dark Gray Metal Ground Block','Conveyer Lever Facing Left','Conveyer Lever Facing Right','Picture','','','','','','','','','','','','','','','','','','','','Water','Brick Ground Block','Wall of Text','Blue Switch Platform Up Solid','Blue Switch Platform Up Passable'];
let charDropdown = -1;
let charDropdownMS = -1;
let charDropdownType;
let diaDropdown = -1;
let diaDropdownType;
let lcPopUp = false;
let lcPopUpNextFrame = false;
let lcPopUpType = 0;
let tabHeight = 30;
let tileTabScrollBar = 0;
let charsTabScrollBar = 0;
let diaTabScrollBar = 0;
let bgsTabScrollBar = 0;
let draggingScrollbar = false;
let addButtonPressed = false;
let duplicateChar = false;
let reorderCharUp = false;
let reorderCharDown = false;
let reorderDiaUp = false;
let reorderDiaDown = false;
let levelLoadString = '';
let lcMessageTimer = 0;
let lcMessageText = '';
const lcZoomFactor = 2;
let lcZoom = lcZoomFactor;
let lcPan = [0,0];
// const exploreTabNames = ['Featured', 'New', 'Top', '🔍'];
// const exploreTabWidths = [190, 115, 115, 45];
const exploreTabNames = ['Levels', 'Levelpacks','Search'];
const exploreTabWidths = [125, 200, 125];
let power = 1;
let jumpPower = 11;
let qPress = false;
let upPress = false;
let csPress = false;
let downPress = false;
let leftPress = false;
let rightPress = false;
let recover = false;
let recover2 = 0;
let recoverTimer = 0;
let HPRC2 = 0;
let cornerHangTimer = 0;
let goal = 0;
let charsAtEnd = 0;
let qPressTimer = 0;
let transitionType = 1;
let char = new Array(1);
let currentLevel = -1;
let control = 0;
let wipeTimer = 0;
let cutScene = 0;
let cutSceneLine = 0;
let bubWidth = 500;
let bubHeight = 100;
let bubMargin = 40;
let bubSc = 1;
let bubX = 0;
let bubY = 0;
let charDepth = 0;
let cameraX = 0;
let cameraY = 0;
let shakeX = 0;
let shakeY = 0;
let menuScreen = -1;
let pmenuScreen = -1;
let exploreTab = 0;
let explorePage = 1; // 5beam pages start at 1 now
let exploreSort = 0;
let explorePageLevels = [];
let exploreUserPageLevels = [];
let exploreLevelPageLevel;
let exploreLevelPageType;
let editingExploreLevel = false;
let exploreOldLevelData = {};
let previousMenuExplore = 0;
let exploreUser;
let exploreUserPageNumbers = [];
let exploreSortText = ['new','old','plays'];
let exploreSortTextWidth = 160;
let loggedInExploreUser5beamID = -1; // Temporarily just being used for checking if the user is logged in.
let exploreLevelTitlesTruncated = new Array(8);
let exploreLoading = false;
let requestsWaiting = 0;
let exploreSearchInput = '';
let playingLevelpack = false; // Whether or not a custom levelpack is currently loaded.
let levelpackType; // 0 - from explore, 1 - from local saved levelpacks
let lcCurrentSavedLevel = -1;
let lcCurrentSavedLevelpack;
let lcChangesMade;
let myLevelsTab = 0;
let myLevelsPage = 0;
let myLevelsPageCount;
let deletingMyLevels = false;
let levelToDelete;
let levelpackAddScreen = false;
let levelpackCreatorPage = 0;
let levelpackCreatorPageCount;
let levelpackCreatorRemovingLevels = false;
let myLevel;
let myLevelChars;
let myLevelDialogue;
let myLevelInfo;
let myLevelNecessaryDeaths;
let dialogueTabCharHover = [-1,0];
let scale = 20;
let tool = 0;
let selectedTile = 0;
let mouseIsDown = false;
let pmouseIsDown = false;
let mousePressedLastFrame;
let LCEndGateX = 0;
let LCEndGateY = 0;
let LCCoinX = 0;
let LCCoinY = 0;
let cardinal = [[0, -1], [0, 1], [-1, 0], [1, 0]];
let diagonal = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
let diagonal2 = [[0, 2], [0, 3], [1, 2], [1, 3]];
const direLetters = ['U', 'D', 'L', 'R'];
let undid = false;
let copied = false;
let tileClipboard = [[]];
let LCRect = [-1, -1, -1, -1];
let levelTimer = 0;
let levelTimer2 = 0;
let bgXScale = 0;
let bgYscale = 0;
let stopX = 0;
let stopY = 0;
let toBounce = false;
let toSeeCS = true;
let csText = '';
let currentLevelDisplayName = '';

let tileShadows;
let tileBorders;
let HPRCBubbleFrame;
let HPRCText = '';
let HPRCCrankRot = 0;
let hprcCrankPos = {x: -29.5, y: -23.7};
let hprcBubbleAnimationTimer = 0;
let charDepths = [];
let tileDepths;
let doorLightX = [
	[27.5],
	[15, 40],
	[10, 27.5, 45],
	[10, 21.75, 33.25, 45],
	[4, 16.25, 27.5, 38.75, 50],
	[4, 14, 23, 32, 41, 50]
];
let doorLightFade = [];
let doorLightFadeDire = [];

function toHMS(i) {
	let h = Math.floor(i / 3600000);
	let m = Math.floor(i / 60000) % 60;
	let s = Math.floor(i / 1000) % 60;
	let ds = Math.floor(i / 100) % 10;
	return (
		h.toString().padStart(2, '0') + ':' +
		m.toString().padStart(2, '0') + ':' +
		s.toString().padStart(2, '0') + '.' +
		ds
	);
}

// I missed processing's map() function so much I wrote my own that I think I stole parts of from stackoverflow, but didn't link to.
function mapRange(value, min1, max1, min2, max2) {
	return min2 + ((value - min1) / (max1 - min1)) * (max2 - min2);
}

let imgBgs = new Array(12);
let svgTiles = new Array(blockProperties.length);
let svgLevers = new Array(6);
let svgShadows = new Array(19);
let svgTileBorders = new Array(38);
let svgChars = new Array(charD.length);
let svgBodyParts = new Array(63);
let svgHPRCBubble = new Array(5);
let svgCSBubble;
let svgHPRCCrank;
let svgCoin;
let svgCoinGet = new Array(11);
let svgFire = new Array(18);
let svgBurst = new Array(13);
let svgAcidDrop = new Array(9);
let svgIceCubeMelt;
let svgCharsVB = new Array(charD.length);
let svgTilesVB = new Array(blockProperties.length);
let svgMenu0;
let svgMenu2;
let svgMenu6;
let svgMenu2border;
let svgMenu2borderimg;
let preMenuBG;
let svgTools = new Array(12);
let svgMyLevelsIcons = new Array(5);
let menu2_3Buttons = [
	new Path2D('M 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nL 104.5 10.05\nM 98.75 7.6\nL 98.75 21.65\nQ 98.75 26.2 96.2 28.45 93.65 30.7 89.15 30.7 84.55 30.7 82.05 28.45 79.55 26.25 79.55 21.65\nL 79.55 7.6 84.5 7.6 84.5 21.65\nQ 84.5 22.55 84.65 23.45 84.8 24.35 85.3 25\nL 86.7 26.1 89.15 26.55\nQ 91.75 26.55 92.8 25.35 93.8 24.15 93.8 21.65\nL 93.8 7.6 98.75 7.6\nM 70.55 7.6\nL 75.2 7.6 75.2 30.15 70.25 30.15 60.85 15.05 60.8 15.05 60.8 30.15 56.15 30.15 56.15 7.6 61.1 7.6 70.5 22.75 70.55 22.75 70.55 7.6\nM 40.75 16.6\nL 51.65 16.6 51.65 20.45 40.75 20.45 40.75 26 52.85 26 52.85 30.15 35.75 30.15 35.75 7.6 52.6 7.6 52.6 11.8 40.75 11.8 40.75 16.6\nM 24.4 7.6\nL 31.4 7.6 31.4 30.15 26.75 30.15 26.75 14.2 26.7 14.2 21.15 30.15 17.35 30.15 11.8 14.35 11.75 14.35 11.75 30.15 7.1 30.15 7.1 7.6 14.1 7.6 19.35 23.15 19.45 23.15 24.4 7.6 Z'),
	new Path2D('M 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nL 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nM 92.9 6.5\nL 99.6 6.5 90.05 16.15 100.55 30.9 93.8 30.9 86.45 19.95 83.4 23.05 83.4 30.9 78 30.9 78 6.5 83.4 6.5 83.4 16.6 92.9 6.5\nM 67.15 11.65\nQ 66.45 11.05 65.55 10.75\nL 63.65 10.4\nQ 61.85 10.4 60.6 11.1 59.3 11.85 58.55 13 57.75 14.2 57.4 15.7 57.05 17.2 57.05 18.8 57.05 20.35 57.4 21.8 57.75 23.25 58.55 24.4 59.3 25.6 60.6 26.3 61.85 27 63.65 27 66.1 27 67.5 25.45 68.9 23.95 69.2 21.5\nL 74.4 21.5\nQ 74.2 23.8 73.35 25.65 72.45 27.5 71.05 28.8 69.65 30.1 67.8 30.8\nL 63.65 31.5\nQ 60.8 31.5 58.6 30.5 56.35 29.5 54.8 27.8 53.3 26.1 52.45 23.75 51.65 21.45 51.65 18.8 51.65 16.1 52.45 13.75 53.3 11.4 54.8 9.65 56.35 7.9 58.6 6.9 60.8 5.9 63.65 5.9 65.65 5.9 67.45 6.5 69.25 7.1 70.65 8.2 72.1 9.3 73 10.95 73.95 12.6 74.15 14.7\nL 68.95 14.7\nQ 68.85 13.8 68.35 13\nL 67.15 11.65\nM 50.6 30.9\nL 45 30.9 43.15 25.5 34.05 25.5 32.15 30.9 26.7 30.9 35.95 6.5 41.45 6.5 50.6 30.9\nM 22.35 7.8\nQ 23.35 8.5 23.9 9.65 24.5 10.85 24.5 12.55 24.5 14.35 23.65 15.6 22.8 16.85 21.15 17.65 23.45 18.3 24.55 19.9 25.65 21.55 25.65 23.8 25.65 25.7 24.95 27.05 24.2 28.4 23 29.25 21.8 30.1 20.2 30.5\nL 17.05 30.9 5.2 30.9 5.2 6.5 16.7 6.5 19.85 6.8\nQ 21.3 7.1 22.35 7.8\nM 19.2 20.85\nQ 18.15 20.05 16.4 20.05\nL 10.6 20.05 10.6 26.75 16.3 26.75 17.8 26.6 19.05 26.05 19.95 25.1 20.25 23.5\nQ 20.25 21.65 19.2 20.85\nM 19 12.1\nQ 18.65 11.5 18.15 11.2\nL 17 10.8 15.6 10.65 10.6 10.65 10.6 16.4 16 16.4\nQ 17.45 16.4 18.35 15.7 19.3 15 19.3 13.5\nL 19 12.1\nM 38.7 12.5\nL 38.65 12.5 35.45 21.45 41.75 21.45 38.7 12.5 Z'),
	new Path2D('M 104.5 27.3\nL 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nM 97.5 11.4\nL 85.2 11.4 85.2 16.35 96.5 16.35 96.5 20.35 85.2 20.35 85.2 26.1 97.75 26.1 97.75 30.4 80.05 30.4 80.05 7.05 97.5 7.05 97.5 11.4\nM 77.4 7.05\nL 77.4 11.4 70.4 11.4 70.4 30.4 65.25 30.4 65.25 11.4 58.3 11.4 58.3 7.05 77.4 7.05\nM 40.95 21.6\nL 41.1 23.45\nQ 41.25 24.35 41.8 25.1\nL 43.25 26.2 45.75 26.65\nQ 48.5 26.65 49.55 25.4 50.6 24.2 50.6 21.6\nL 50.6 7.05 55.7 7.05 55.7 21.6\nQ 55.7 26.3 53.05 28.65 50.4 30.95 45.75 30.95 41 30.95 38.4 28.65 35.8 26.35 35.8 21.6\nL 35.8 7.05 40.95 7.05 40.95 21.6\nM 26.55 13.85\nL 26.45 13.85 20.75 30.4 16.8 30.4 11.05 14.05 11 14.05 11 30.4 6.2 30.4 6.2 7.05 13.45 7.05 18.9 23.1 18.95 23.1 24.1 7.05 31.35 7.05 31.35 30.4 26.55 30.4 26.55 13.85 Z'),
	new Path2D('\nM 104.5 27.3\nL 104.5 10.05\nQ 104.5 0 94.5 0\nL 10 0\nQ 0 0 0 10.05\nL 0 27.3\nQ 0 37.3 10 37.3\nL 94.5 37.3\nQ 104.5 37.3 104.5 27.3\nM 86.35 6.35\nL 86.35 26.35 98.3 26.35 98.3 30.85 80.95 30.85 80.95 6.35 86.35 6.35\nM 64.1 6.35\nL 69.6 6.35 78.8 30.85 73.2 30.85 71.35 25.4 62.2 25.4 60.25 30.85 54.8 30.85 64.1 6.35\nM 52.8 6.35\nL 52.8 21.6\nQ 52.8 26.55 50.05 29 47.25 31.45 42.35 31.45 37.35 31.45 34.65 29 31.9 26.6 31.9 21.6\nL 31.9 6.35 37.3 6.35 37.3 21.6 37.45 23.55\nQ 37.65 24.5 38.2 25.25 38.75 26.05 39.7 26.45\nL 42.35 26.9\nQ 45.2 26.9 46.3 25.65 47.4 24.35 47.4 21.6\nL 47.4 6.35 52.8 6.35\nM 21.4 6.75\nQ 23.65 7.8 25.2 9.5 26.75 11.3 27.55 13.65 28.35 16 28.35 18.7 28.35 21.4 27.55 23.7 26.75 26 25.2 27.7\nL 28.25 30.5 25.75 33.15 22.25 30\nQ 21.05 30.7 19.6 31.05\nL 16.35 31.45\nQ 13.5 31.45 11.25 30.45 9.05 29.45 7.5 27.75 5.95 26 5.15 23.7 4.3 21.35 4.3 18.7 4.3 16 5.15 13.65 5.95 11.3 7.5 9.5 9.05 7.8 11.25 6.75 13.5 5.8 16.35 5.8 19.2 5.8 21.4 6.75\nM 21.45 24.35\nQ 22.15 23.4 22.55 22.05 23 20.65 23 18.7 23 17.1 22.65 15.6 22.25 14.05 21.45 12.9 20.7 11.7 19.4 11 18.15 10.3 16.35 10.3 14.5 10.3 13.25 11 12 11.7 11.2 12.9 10.4 14.05 10.05 15.6 9.7 17.1 9.7 18.7 9.7 20.25 10.05 21.7 10.4 23.2 11.2 24.35 12 25.5 13.25 26.2 14.5 26.9 16.35 26.9\nL 17.55 26.9 18.5 26.6 16.2 24.45 18.7 21.8 21.45 24.35\nM 66.85 12.4\nL 66.75 12.4 63.6 21.4 69.9 21.4 66.85 12.4 Z')
];
let menu0ButtonSize = {w: 273.0, h: 36.9, cr: 6.65};
let menu2_3ButtonSize = {w: 104.5, h: 37.3};
let levelButtonSize = {w: 100, h: 40};
let onButton = false;
let onTextBox = false;
let onScrollbar = false;
let textBoxes = [];
let editingTextBox = false;
let currentTextBoxAllowsLineBreaks = false;
let mouseOnTabWindow = false;
let menu2_3ButtonClicked = -1;
let levelButtonClicked = -1;
let showingNewGame2 = false;
let showingExploreNewGame2 = false;

let musicSound = new Audio('data/the fiber 16x loop.wav');
// musicSound.addEventListener('canplaythrough', event => {incrementCounter();});

const scaleFactor = 3;

// Creates an image object was a base64 src.
function createImage(base64) {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.src = base64;
		if (base64.split(',')[0] == 'data:image/svg+xml;base64') {
			img.onload = () => {
				let rasterizerCanvas = document.createElement('canvas');
				rasterizerCanvas.width = img.width*scaleFactor;
				rasterizerCanvas.height = img.height*scaleFactor;
				let rasterizerCanvasCtx = rasterizerCanvas.getContext('2d');
				rasterizerCanvasCtx.drawImage(img, 0, 0, img.width*scaleFactor, img.height*scaleFactor);
				resolve(rasterizerCanvas);
			}
			img.onerror = reject;
		} else {
			resolve(img);
		}
	});
}

// Gets the viewbox of an svg from its base64 encoding.
function getVB(base64) {
	let svgString = atob(base64.split(',')[1]);
	let doc = new DOMParser();
	let xml = doc.parseFromString(svgString, 'image/svg+xml');
	let svg = xml.getElementsByTagName('svg')[0];
	return svg.getAttribute('viewBox').split(' ').map(Number);
}

function getPixelRatio(quality) {
	// Round the device pixel ratio to the nearest integer in log base 2
	// This is so that if you have the page zoomed or have some scale factor on Windows
	// there aren't lines between blocks.
	return 2**(Math.round(Math.log2(window.devicePixelRatio))+quality)
}

async function loadingScreen() {
	pixelRatio = getPixelRatio(0);

	// Initialize Canvas Stuff
	canvasReal = document.getElementById('cnv');
	ctxReal = canvasReal.getContext('2d');
	canvasReal.style.width = cwidth + 'px';
	canvasReal.style.height = cheight + 'px';
	canvas = document.createElement('canvas');
	canvas.width = cwidth;
	canvas.height = cheight;
	ctx = canvas.getContext('2d');
	// Account for Pixel Density
	canvas.width = Math.floor(cwidth * pixelRatio);
	canvas.height = Math.floor(cheight * pixelRatio);
	ctx.scale(pixelRatio, pixelRatio);
	canvasReal.width = Math.floor(cwidth * pixelRatio);
	canvasReal.height = Math.floor(cheight * pixelRatio);
	ctxReal.scale(pixelRatio, pixelRatio);

	// Background
	ctx.fillStyle = '#999966';
	ctx.fillRect(0, 0, cwidth, cheight);
	// Text
	ctx.fillStyle = '#000000';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = '30px Helvetica';
	ctx.fillText('Loading...', cwidth / 2, cheight / 2);

	let req = await fetch('data/levels.txt');
	levelsString = await req.text();
	loadLevels();

	req = await fetch('data/images6.json');
	let resourceData = await req.json();

	svgCSBubble = await createImage(resourceData['ui/csbubble/dia.svg']);
	svgHPRCCrank = await createImage(resourceData['entities/e0035crank.svg']);
	svgCoin = await createImage(resourceData['wintoken.svg']);
	svgIceCubeMelt = await createImage(resourceData['effects/icecubemelt.svg']);
	svgIceCubeMelt = await createImage(resourceData['effects/icecubemelt.svg']);
	for (let i = 0; i < imgBgs.length; i++) {
		imgBgs[i] = await createImage(resourceData['bg/bg' + i.toString().padStart(4, '0') + '.png']);
	}
	for (let i = 0; i < blockProperties.length; i++) {
		let id = i.toString().padStart(4, '0');
		if (blockProperties[i][16] == 1 || (blockProperties[i][15] && blockProperties[i][16] == 0)) {
			svgTiles[i] = await createImage(resourceData['blocks/b' + id + '.svg']);
			svgTilesVB[i] = getVB(resourceData['blocks/b' + id + '.svg']);
		} else if (blockProperties[i][16] > 1) {
			svgTiles[i] = new Array(blockProperties[i][16]);
			svgTilesVB[i] = new Array(blockProperties[i][16]);
			for (let j = 0; j < svgTiles[i].length; j++) {
				svgTiles[i][j] = await createImage(
					resourceData['blocks/b' + id + 'f' + j.toString().padStart(4, '0') + '.svg']
				);
				svgTilesVB[i][j] = getVB(resourceData['blocks/b' + id + 'f' + j.toString().padStart(4, '0') + '.svg']);
			}
		}
	}
	for (let i = 0; i < svgLevers.length; i++) {
		svgLevers[i] = await createImage(resourceData['blocks/b' + i.toString().padStart(2, '0') + 'lever.svg']);
	}
	for (let i = 0; i < svgShadows.length; i++) {
		svgShadows[i] = await createImage(resourceData['shadows/s' + i.toString().padStart(4, '0') + '.svg']);
	}
	for (let i = 0; i < svgTileBorders.length; i++) {
		svgTileBorders[i] = await createImage(resourceData['borders/tb' + i.toString().padStart(4, '0') + '.svg']);
	}
	for (let i = 0; i < charD.length; i++) {
		let id = i.toString().padStart(4, '0');
		if (charD[i][7] < 1) continue;
		else if (charD[i][7] == 1) {
			svgChars[i] = await createImage(resourceData['entities/e' + id + '.svg']);
			svgCharsVB[i] = getVB(resourceData['entities/e' + id + '.svg']);
		} else {
			svgChars[i] = new Array(charD[i][7]);
			svgCharsVB[i] = new Array(charD[i][7]);
			for (let j = 0; j < svgChars[i].length; j++) {
				svgChars[i][j] = await createImage(
					resourceData['entities/e' + id + 'f' + j.toString().padStart(4, '0') + '.svg']
				);
				svgCharsVB[i][j] = getVB(resourceData['entities/e' + id + 'f' + j.toString().padStart(4, '0') + '.svg']);
			}
		}
	}
	for (let i = 0; i < svgBodyParts.length; i++) {
		svgBodyParts[i] = await createImage(resourceData['bodyparts/bp' + i.toString().padStart(4, '0') + '.svg']);
	}
	for (let i = 0; i < svgHPRCBubble.length; i++) {
		svgHPRCBubble[i] = await createImage(
			resourceData['ui/hprcbubble/hprcbubble' + i.toString().padStart(4, '0') + '.svg']
		);
	}
	for (let i = 0; i < svgCoinGet.length; i++) {
		svgCoinGet[i] = await createImage(resourceData['effects/wtgetf' + i.toString().padStart(4, '0') + '.svg']);
	}
	for (let i = 0; i < svgFire.length; i++) {
		svgFire[i] = await createImage(resourceData['effects/fire' + i.toString().padStart(4, '0') + '.svg']);
	}
	for (let i = 0; i < svgBurst.length; i++) {
		svgBurst[i] = await createImage(resourceData['effects/burst' + i.toString().padStart(4, '0') + '.svg']);
	}
	for (let i = 0; i < svgAcidDrop.length; i++) {
		svgAcidDrop[i] = await createImage(resourceData['effects/aciddrop' + i.toString().padStart(4, '0') + '.svg']);
	}
	svgMenu0 = await createImage(resourceData['menu0.svg']);
	svgMenu2 = await createImage(resourceData['menu2.svg']);
	svgMenu6 = await createImage(resourceData['menu6.svg']);
	svgMenu2border = await createImage(resourceData['menu2border.svg']);
	svgMenu2borderimg = await createImage(resourceData['menu2borderimg.png']);
	preMenuBG = await createImage(resourceData['premenubg.png']);
	for (let i = 0; i < svgTools.length; i++) {
		svgTools[i] = await createImage(resourceData['lc/tool' + i.toString().padStart(4, '0') + '.svg']);
	}
	for (let i = 0; i < svgMyLevelsIcons.length; i++) {
		svgMyLevelsIcons[i] = await createImage(resourceData['ui/mylevels/icon' + i.toString().padStart(4, '0') + '.svg']);
		// console.log(resourceData['ui/mylevels/icon' + i.toString().padStart(4, '0') + '.svg']);
	}
	setup();
}

window.onload = function () {
	loadingScreen();
};

// https://stackoverflow.com/a/4819886/22438094
function isTouchDevice() {
	return (('ontouchstart' in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0));
}

function onRect(mx, my, x, y, w, h) {
	return mx > x && mx < x + w && my > y && my < y + h;
}

function boundingBoxCheck(x1, y1, w1, h1, x2, y2, w2, h2) {
	return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > h2;
}

function setCursor(newCursor) {
	if (_cursor != newCursor) {
		_cursor = newCursor;
		document.body.style.cursor = _cursor;
	}
}

function setHoverText() {
	if (canvas.getAttribute('title') != hoverText) {
		if (hoverText == '') canvas.removeAttribute('title');
		else canvas.setAttribute('title', hoverText);
	}
}

function menuWatchA() {
	window.open('https://www.youtube.com/watch?v=4q77g4xo9ic');
}

function menuWatchC() {
	window.open('https://www.youtube.com/watch?v=YrsRLT3u0Cg');
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

function openExploreNewGame2() {
	if (typeof levelpackProgress[exploreLevelPageLevel.id] !== 'undefined') showingExploreNewGame2 = true;
	else playExploreLevel();
}

function exploreNewGame2no() {
	showingExploreNewGame2 = false;
}

function exploreNewGame2yes() {
	showingExploreNewGame2 = false;
	playExploreLevel();
}

function menuContGame() {
	enterBaseLevelpackLevelSelect();
	getSavedGame();
}

function menuLevelCreator() {
	menuScreen = 5;
	getSavedLevels();
	resetLevelCreator();
}

function lcTextBoxes() {
	textBoxes = [[],[]];
	textBoxes[0].push(new TextBox(myLevelInfo.name, 785, 10, 150, 40, '#e0e0e0', '#000000', '#a0a0a0', 18, 18, 'Helvetica', false, [5, 2, 2, 2], 0, 10, false));
	textBoxes[0].push(new TextBox(myLevelInfo.desc, 785, 60, 150, 230, '#e0e0e0', '#000000', '#a0a0a0', 14, 14, 'Helvetica', true, [5, 2, 2, 2], 0, 10, false));
	textBoxes[0].push(new TextBox('', 0, 0, 100, 100, '#ffffff', '#000000', '#a0a0a0', 10, 10, 'monospace', true, [5, 5, 5, 5], 0, 10, false));
	generateDialogueTextBoxes();
}

function generateDialogueTextBoxes() {
	textBoxes[1] = [];
	for (var i = 0; i < myLevelDialogue[1].length; i++) {
		textBoxes[1].push(new TextBox(myLevelDialogue[1][i].text, 665 + diaInfoHeight * 3, 0, 240 - diaInfoHeight * 3, 0, '#626262', '#ffffff', '#000000', 20, 20, 'Helvetica', false, [5, 0, 0, 0], 0, 10, true));
	}
}

function exploreTextBoxes() {
	textBoxes = [[],[]];
	textBoxes[0].push(new TextBox('', 28, 75, 839, 45, '#333333', '#ffffff', '#888888', 30, 30, 'Helvetica', false, [10, 12, 10, 10], 1, 10, false));
	textBoxes[0].push(new TextBox('', 430, 98, 500, 387, '#333333', '#ffffff', '#888888', 22, 20, 'Helvetica', true, [5, 5, 5, 5], 0, 10, false));
	textBoxes[0].push(new TextBox('', 30, 10, 910, 45, '#333333', '#ffffff', '#888888', 30, 30, 'Helvetica', false, [10, 12, 10, 10], 1, 10, false));
	textBoxes[0].push(new TextBox('', 0, 0, 100, 100, '#ffffff', '#000000', '#a0a0a0', 10, 10, 'monospace', true, [5, 5, 5, 5], 0, 10, false));
}

function myLevelsTextBoxes() {
	textBoxes = [[],[]];
	textBoxes[0].push(new TextBox(lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].title, 28, 15, 839, 45, '#333333', '#ffffff', '#888888', 30, 30, 'Helvetica', false, [10, 12, 10, 10], 1, 10, false));
	textBoxes[0].push(new TextBox('', 0, 0, 100, 100, '#ffffff', '#000000', '#a0a0a0', 14, 14, 'Helvetica', true, [5, 5, 5, 5], 0, 10, false));
}

function menuExitLevelCreator() {
	menuScreen = 0;
}

function menuExplore() {
	menuScreen = 6;
	exploreTextBoxes();
	exploreTab = 0;
	setExplorePage(1);
}

function menuMyLevels() {
	menuScreen = 10;
	levelpackAddScreen = false;
	deletingMyLevels = false;
	lcPopUp = false;
	getSavedLevelpacks();
	setMyLevelsPage(0);
}

function menuMyLevelsBack() {
	menuScreen = 5;
	lcTextBoxes();
	resetLCOSC();
	lcPopUp = false;
}

function menuLevelpackCreatorBack() {
	menuScreen = 10;
	levelpackAddScreen = false;
	myLevelsTab = 1;
	setMyLevelsPage(myLevelsPage);
	lcPopUp = false;
}

function menuLevelpackAddScreenBack() {
	menuScreen = 11;
	levelpackCreatorRemovingLevels = false;
	levelpackAddScreen = false;
}

function openMyLevelpack(id) {
	menuScreen = 11;
	levelpackCreatorRemovingLevels = false;
	lcCurrentSavedLevelpack = id;
	setLevelpackCreatorPage(0);
	myLevelsTextBoxes();
}

function openAddLevelsToLevelpackScreen() {
	menuScreen = 10;
	levelpackAddScreen = true;
	myLevelsTab = 0;
	setMyLevelsPage(0);
}

function addLevelToLevelpack(id) {
	lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].levels.push(id);
	saveMyLevelpacks();
	openMyLevelpack(lcCurrentSavedLevelpack);
}

function gotoExploreLevelPage(locOnPage) {
	let newExploreLevelPageLevel = menuScreen==8?exploreUserPageLevels[Math.floor(locOnPage/4)][locOnPage%4]:explorePageLevels[locOnPage];
	if ((menuScreen==6 && (exploreTab == 0 || exploreTab == 2)) || (menuScreen==8 && locOnPage < 4)) {
		exploreLevelPageType = 0;
		exploreLevelPageLevel = newExploreLevelPageLevel;
		drawExploreThumb(thumbBigctx, thumbBig.width, exploreLevelPageLevel.data, 0.4);
	} else {
		exploreLevelPageType = 1;
		getExploreLevelpack(newExploreLevelPageLevel.id);
	}
	previousMenuExplore = menuScreen;
	menuScreen = 7;
	// We already have this data, so we don't need to load it again.
	// getExploreLevel(explorePageLevels[locOnPage].id);
}

function menuExploreLevelPageBack() {
	menuScreen = previousMenuExplore;
	showingExploreNewGame2 = false;
	cancelEditExploreLevel();
}

function menuExploreBack() {
	menuScreen = 6;
	exploreTextBoxes();
	// setExplorePage(1);
}

function confirmChangeLevelString() {
	lcPopUp = false;
	exploreLevelPageLevel.data = textBoxes[0][3].text;
}

function cancelChangeLevelString() {
	lcPopUp = false;
}

function playExploreLevel(continueGame=false) {
	cancelEditExploreLevel();
	// increment play counter
	getExplorePlay(exploreLevelPageLevel.id);

	if (exploreLevelPageType == 0) {
		readExploreLevelString(exploreLevelPageLevel.data);
		testLevelCreator();
		playingLevelpack = false;
		playMode = 3;
	} else {
		loadLevelpack(exploreLevelPageLevel.levels);
		clearVars();
		if (continueGame) {
			levelProgress = levelpackProgress[exploreLevelPageLevel.id].levelProgress;
			gotCoin = levelpackProgress[exploreLevelPageLevel.id].coins;
			coins = 0;
			levelpackProgress[exploreLevelPageLevel.id].coins.forEach(e => {
				if (e) coins++;
			});
			if (typeof levelpackProgress[exploreLevelPageLevel.id].deaths === 'undefined') {
				deathCount = 0;
				timer = 0;
			} else {
				deathCount = levelpackProgress[exploreLevelPageLevel.id].deaths;
				timer = levelpackProgress[exploreLevelPageLevel.id].timer;
			}
		} else {
			levelpackProgress[exploreLevelPageLevel.id] = {
				levelProgress: 0,
				coins: [false],
				deaths: 0,
				timer: 0
			};
			saveLevelpackProgress();
		}
		menuScreen = 2;
		playingLevelpack = true;
		levelpackType = 0;
		// playMode = 0;
	}
}

function continueExploreLevelpack() {
	playExploreLevel(true);
}

// function decodeCoinBin(coinBin) {
// 	gotCoin = new Array(levelCount);
// 	for (let i = 0; i < levelCount; i++) {
// 		gotCoin[i] = (coinBin >> i) & 1 == 1;
// 	}
// }

// function encodeCoinBin() {
// 	let coinBin = 0;
// 	for (let i = 0; i < gotCoin.length; i++) {
// 		if (gotCoin[i]) coinBin += 1 << i;
// 	}
// 	return coinBin;
// }

function playSavedLevelpack() {
	// It probably would've been better to modify the levelpack loader than to accommodate it like this.
	let formattedLevelData = [];
	let levelIds = lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].levels;
	for (var i = 0; i < levelIds.length; i++) {
		formattedLevelData.push(lcSavedLevels['l' + levelIds[i]]);
	}

	loadLevelpack(formattedLevelData);
	clearVars();
	menuScreen = 2;
	playingLevelpack = true;
	levelpackType = 1;
}

function getCurrentLevelpackString() {
	let stringOut = '';
	let levelIds = lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].levels;
	for (var i = 0; i < levelIds.length; i++) {
		stringOut += lcSavedLevels['l' + levelIds[i]].data;
	}
	return stringOut;
}

function copySavedLevelpackString() {
	copyText(getCurrentLevelpackString());
}

function exploreMoreByThisUser() {
	cancelEditExploreLevel();
	menuScreen = 8;
	// getExploreUser(exploreLevelPageLevel.creator.id);
	exploreUser = exploreLevelPageLevel.creator;
	setExploreUserPage(0, 1).then(() => setExploreUserPage(1, 1))
}

function setExploreUserPage(type, page) {
	// exploreLevelTitlesTruncated = new Array(8);
	exploreUserPageNumbers[type] = page;
	return getExploreUserPage(exploreUser.id, exploreUserPageNumbers[type], type, 0);
}

function menu2Back() {
	if (playingLevelpack && menuScreen == 2) {
		if (levelpackType === 0) menuScreen = 7;
		if (levelpackType === 1) menuScreen = 11;
	} else menuScreen = 0;
	getSavedGame();
	cameraX = 0;
	cameraY = 0;
}

function menu3Menu() {
	timer += getTimer() - levelTimer2;
	saveGame();
	exitLevel();
}

function menu8Menu() {
	menuScreen = 6;
	exploreTextBoxes();
	setExplorePage(explorePage);
}

function beginNewGame() {
	clearVars();
	saveGame();
	enterBaseLevelpackLevelSelect();
	cameraY = 0;
	cameraX = 0;
}

function menuOptions() {
	menuScreen = 9;
}

function menuExitOptions() {
	menuScreen = 0;
	saveSettings();
}

function enterBaseLevelpackLevelSelect() {
	menuScreen = 2;
	if (playingLevelpack) loadLevels();
	playingLevelpack = false;

}

function toggleSound() {
	if (!musicSound.paused) {
		musicSound.pause();
	} else {
		musicSound.play();
	}
}

function setQual() {
	highQual = !highQual;
	if (highQual) {
		pixelRatio = getPixelRatio(0);
	} else {
		pixelRatio = getPixelRatio(-1);
	}
	canvas.width = cwidth * pixelRatio;
	canvas.height = cheight * pixelRatio;
}

function exitLevel() {
	menuScreen = 2;
}

function playGame() {
	menuScreen = 0;
	musicSound.play();
	musicSound.loop = true;
}

function testLevelCreator() {
	if (myLevelChars[1].length > 0) {
		if (myLevelDialogue[1].length == 0) {
			for (let i = 0; i < myLevel[1].length; i++) {
				for (let j = 0; j < myLevel[1][i].length; j++) {
					if (myLevel[1][i][j] == 8) myLevel[1][i][j] = 0;
				}
			}
		}
		playMode = 2;
		currentLevel = -1;
		editingTextBox = false;
		deselectAllTextBoxes();
		wipeTimer = 30;
		menuScreen = 3;
		toSeeCS = true;
		transitionType = 1;
		resetLevel();
	}
}

function exitTestLevel() {
	menuScreen = 5;
	lcTextBoxes();
	cameraX = 0;
	cameraY = 0;
	resetLevel();
	resetLCOSC();
}

function exitExploreLevel() {
	menuScreen = 7;
	cameraX = 0;
	cameraY = 0;
}

function drawMenu0Button(text, x, y, grayed, action, width = menu0ButtonSize.w) {
	let fill = '#ffffff';
	if (!grayed) {
		if (!lcPopUp && onRect(_xmouse, _ymouse, x, y, width, menu0ButtonSize.h)) {
			onButton = true;
			if (!mouseIsDown) fill = '#d4d4d4';
			if (onRect(lastClickX, lastClickY, x, y, width, menu0ButtonSize.h)) {
				if (mouseIsDown) fill = '#b8b8b8';
				else if (mousePressedLastFrame) action();
			}
		}
	} else fill = '#b8b8b8';

	drawRoundedRect(fill, x, y, width, menu0ButtonSize.h, menu0ButtonSize.cr);

	ctx.font = 'bold 30px Helvetica';
	ctx.fillStyle = '#666666';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, x + width / 2, y + (menu0ButtonSize.h * 1.1) / 2);
}

function drawMenu2_3Button(id, x, y, action) {
	let fill = '#ffffff';
	if (onRect(_xmouse, _ymouse, x, y, menu2_3ButtonSize.w, menu2_3ButtonSize.h)) {
		onButton = true;
		if (mouseIsDown) {
			fill = '#cccccc';
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
	let fill = '#585858';
	if (color == 2) fill = '#ff8000';
	else if (color == 3) fill = '#efe303';
	else if (color == 4) fill = '#00cc00';
	if (color > 1) {
		if (
			onRect(_xmouse, _ymouse + cameraY, x, y, levelButtonSize.w, levelButtonSize.h) &&
			(_xmouse < 587 || _ymouse < 469)
		) {
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
			if (id <= levelProgress) { // || (id > 99 && id < bonusProgress + 100)
				playLevel(id);
				whiteAlpha = 100;
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
	ctx.fillText(text, x + levelButtonSize.w / 2, y + (levelButtonSize.h * 1.1) / 2);
}

function drawNewGame2Button(text, x, y, color, action) {
	let size = 107.5;
	if (onRect(_xmouse, _ymouse, x, y, size, size)) {
		onButton = true;
		if (mousePressedLastFrame && onRect(lastClickX, lastClickY, x, y, size, size)) action();
	}

	drawRoundedRect(color, x, y, size, size, 10);

	ctx.font = 'bold 40px Helvetica';
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, x + size / 2, y + (size * 1.1) / 2);
}

function drawSimpleButton(text, action, x, y, w, h, bottomPad, textColor, bgColor, bgHover, bgActive, kwargs={}) {
	let onThisButton = false; // Part of the hack for making copy work on Safari.
	if (kwargs.enabled !== false) {
		if (onRect(_xmouse, _ymouse, x, y, w, h) && (!lcPopUp || kwargs.isOnPopUp === true)) {
			onButton = true;
			onThisButton = true;
			ctx.fillStyle = bgHover;
			if (kwargs.alt) hoverText = kwargs.alt;
			if (mouseIsDown) ctx.fillStyle = bgActive;
			else if (pmouseIsDown && onRect(lastClickX, lastClickY, x, y, w, h)) action();
		} else ctx.fillStyle = bgColor;
	} else ctx.fillStyle = bgHover;
	ctx.fillRect(x, y, w, h);

	ctx.fillStyle = textColor;
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'center';
	ctx.fillText(text, x + w/2.0, y + h - bottomPad);
	return {hover:onThisButton};
}

function drawRoundedRect(fill, x, y, w, h, cr) {
	let x1 = x + cr;
	let y1 = y + cr;
	let w1 = w - cr - cr;
	let h1 = h - cr - cr;
	ctx.beginPath();
	ctx.fillStyle = fill;
	ctx.arc(x1, y1, cr, Math.PI, Math.PI * 1.5, false);
	ctx.arc(x1 + w1, y1, cr, Math.PI * 1.5, Math.PI * 2, false);
	ctx.arc(x1 + w1, y1 + h1, cr, Math.PI * 2, Math.PI * 2.5, false);
	ctx.arc(x1, y1 + h1, cr, Math.PI * 2.5, Math.PI * 3, false);
	ctx.lineTo(x1 - cr, y);
	ctx.fill();
}

function drawMenu() {
	ctx.fillStyle = '#666666';
	ctx.fillRect(0, 0, cwidth, cheight);
	ctx.drawImage(svgMenu0, 0, 0, cwidth, cheight);
	ctx.fillStyle = '#ffffff';
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'left';
	ctx.font = '20px Helvetica';

	if (levelProgress > 99) drawMenu0Button('WATCH BFDIA 5c', 665.55, 303.75, false, menuWatchC);
	else drawMenu0Button('WATCH BFDIA 5a', 665.55, 303.75, false, menuWatchA);
	if (showingNewGame2) {
		drawRoundedRect('#ffffff', 665.5, 81, 273, 72.95, 15);
		ctx.font = '20px Helvetica';
		ctx.fillStyle = '#666666';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		linebreakText('Are you sure you want to\nerase your saved progress\nand start a new game?', 802, 84.3, 22);
		drawNewGame2Button('YES', 680.4, 169.75, '#993333', menuNewGame2yes);
		drawNewGame2Button('NO', 815.9, 169.75, '#1a4d1a', menuNewGame2no);
	} else {
		drawMenu0Button('OPTIONS', 665.55, 259.1, false, menuOptions);
		drawMenu0Button('NEW GAME', 665.55, 348.4, false, menuNewGame);
	}
	drawMenu0Button('CONTINUE GAME', 665.55, 393.05, levelProgress == 0, menuContGame);
	drawMenu0Button('LEVEL CREATOR', 665.55, 437.7, false, menuLevelCreator);
	drawMenu0Button('EXPLORE', 665.55, 482.5, false, menuExplore);

	// let started = true;
	// if (bfdia5b.data.levelProgress == undefined || bfdia5b.data.levelProgress == 0) {
	//    started = false;
	// }
}

function drawLevelMapBorder() {
	// For security reasons, you can not draw images from svg files to a canvas.
	// So I have to draw the border image manually with masking and stuff.
	// https://stackoverflow.com/questions/18379818/canvas-image-masking-overlapping

	// It might be better to use a path object here instead of hard-coding it.
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 540);
	ctx.lineTo(960, 540);
	ctx.lineTo(960, 0);
	ctx.lineTo(0, 0);
	ctx.moveTo(20, 38.75);
	ctx.quadraticCurveTo(20.6, 20.6, 38.75, 20);
	ctx.lineTo(921.25, 20);
	ctx.quadraticCurveTo(939.4, 20.6, 940, 38.75);
	ctx.lineTo(940, 501.25);
	ctx.quadraticCurveTo(939.4, 519.4, 921.25, 520);
	ctx.lineTo(38.75, 520);
	ctx.quadraticCurveTo(20.6, 519.4, 20, 501.25);
	ctx.lineTo(20, 38.75);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(svgMenu2borderimg, 0, 0, cwidth, cheight);
	ctx.restore();

	ctx.drawImage(svgMenu2border, 0, 0, cwidth, cheight);

	drawMenu2_3Button(3, 587, 469, setQual);
	drawMenu2_3Button(2, 705, 469, toggleSound);
	drawMenu2_3Button(1, 823, 469, menu2Back);
	//setQual
}

function drawLevelMap() {
	ctx.drawImage(svgMenu2, 0, 0, svgMenu2.width/scaleFactor, svgMenu2.height/scaleFactor);

	ctx.fillStyle = '#000000';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';

	if (!playingLevelpack) {
		ctx.font = 'bold 115px Arial';
		ctx.fillText('5b', 47, 23);
		ctx.font = '48px Helvetica';
		ctx.fillText('Level', 211, 30);
		ctx.fillText('Select', 211, 80);

		ctx.drawImage(svgTiles[12], 398.5, 34.5, 73, 73);
		ctx.font = '40px Helvetica';
		ctx.fillText('x ' + coins, 477.95, 50.9);
	} else {
		ctx.font = 'bold 48px Helvetica';
		// ctx.fillText(exploreLevelPageLevel.title, 55, 35);
		let titleLineCount = wrapText((levelpackType === 0)?exploreLevelPageLevel.title:lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].title, 50, 35, 500, 48).length;
		if (levelpackType === 0) {
			ctx.font = 'italic 21px Helvetica';
			ctx.fillText('by ' + exploreLevelPageLevel.creator.username, 50, 32 + titleLineCount*48);
		}

		ctx.drawImage(svgTiles[12], 568.5, 29.5, 50, 50);
		ctx.font = '21px Helvetica';
		ctx.fillText('x ' + coins, 627.95, 45.9);
	}

	ctx.font = '21px Helvetica';
	ctx.fillText(toHMS(timer), 767.3, 27.5);
	ctx.fillText(deathCount.toLocaleString(), 767.3, 55.9);
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
		ctx.fillText((deathCount - mdao[levelProgress - 1]).toLocaleString(), 767.3, 116.8);
	}
	for (let i = 0; i < (playingLevelpack?levelCount:133); i++) {
		let j = i;
		if (!playingLevelpack && j >= 100) j += 19;
		let color = 1;
		if (i >= levelCount) color = 1;
		else if (gotCoin[i]) color = 4;
		else if (levelProgress == i) color = 2;
		else if (levelProgress > i) color = 3;
		// else if (i > 99 && i < bonusProgress + 100) {
		// 	if (!bonusesCleared[i - 100]) color = 2;
		// 	else color = 3;
		// }
		let text = '';
		if (!playingLevelpack && i >= 100) text = 'B' + (i - 99).toString().padStart(2, '0');
		else text = (i + 1).toString().padStart(3, '0');
		drawLevelButton(text, (j % 8) * 110 + 45, Math.floor(j / 8) * 50 + 160, i, color);
	}
}

function drawLevelButtons() {
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.font = 'bold 32px Helvetica';
	ctx.fillText(currentLevelDisplayName, 12.85, 495.45);
	drawMenu2_3Button(0, 837.5, 486.95, playMode == 3 ? exitExploreLevel : playMode == 2 ? exitTestLevel : menu3Menu);
}

//https://thewebdev.info/2021/05/15/how-to-add-line-breaks-into-the-html5-canvas-with-filltext/
function linebreakText(text, x, y, lineheight) {
	let lines = text.split('\n');
	for (let i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], x, y + i * lineheight);
	}
}

function wrapText(text, x, y, maxWidth, lineHeight, drawText = true) {
	let words = text.split(' ');
	let lines = [''];
	for (let i = 0; i < words.length; i++) {
		let lb = words[i].split('\n');
		let back = false;
		for (let l = 0; l < lb.length; l++) {
			if (!back && l > 0) {
				lines.push('');
			}
			back = false;
			if (ctx.measureText(lines[lines.length - 1] + lb[l]).width > maxWidth) {
				if (lines[lines.length - 1].length == 0) {
					for (var j = 0; j < lb[l].length; j++) {
						if (ctx.measureText(lines[lines.length - 1] + lb[l].charAt(j)).width > maxWidth) break;
						lines[lines.length - 1] += lb[l].charAt(j);
					}
					lines.push('');
					if (lb.length == 1) {
						words[i] = words[i].slice(j, words[i].length);
						i--;
					} else {
						lb[l] = lb[l].slice(j, lb[l].length);
						l--;
						back = true;
					}
				} else {
					lines.push('');
					if (lb.length == 1) {
						i--;
					} else {
						l--;
						back = true;
					}
				}
			} else {
				lines[lines.length - 1] += lb[l] + ' ';
			}
		}
	}
	if (drawText) {
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], x, y + lineHeight * i);
		}
	}
	return lines;
}

// https://stackoverflow.com/questions/10508988/html-canvas-text-overflow-ellipsis
function binarySearch({max, getValue, match}) {
	let min = 0;

	while (min <= max) {
		let guess = Math.floor((min + max) / 2);
		const compareVal = getValue(guess);

		if (compareVal === match) return guess;
		if (compareVal < match) min = guess + 1;
		else max = guess - 1;
	}

	return max;
}

function fitString(context, str, maxWidth) {
	let width = context.measureText(str).width;
	const ellipsis = '…';
	const ellipsisWidth = context.measureText(ellipsis).width;
	if (width <= maxWidth || width <= ellipsisWidth) {
		return str;
	}

	const index = binarySearch({
		max: str.length,
		getValue: guess => context.measureText(str.substring(0, guess)).width,
		match: maxWidth - ellipsisWidth
	});

	return str.substring(0, index) + ellipsis;
}

function playLevel(i) {
	if (i == levelProgress) playMode = 0;
	else if (i < levelProgress) playMode = 1;
	currentLevel = i;
	wipeTimer = 30;
	menuScreen = 3;
	toSeeCS = true;
	transitionType = 1;
	resetLevel();
}

function resetLevel() {
	HPRCBubbleFrame = 0;
	tileDepths = [[], [], [], []];
	if (playMode == 2) {
		charCount = myLevelChars[1].length;
		levelWidth = myLevel[1][0].length;
		levelHeight = myLevel[1].length;

		copyLevel(myLevel[1]);

		char = new Array(charCount);
		charCount2 = 0;
		HPRC1 = HPRC2 = 1000000;
		for (let i = 0; i < charCount; i++) {
			let id = myLevelChars[1][i][0];
			char[i] = new Character(
				id,
				myLevelChars[1][i][1] * 30,
				myLevelChars[1][i][2] * 30,
				70 + i * 40,
				400 - i * 30,
				myLevelChars[1][i][3],
				charD[id][0],
				charD[id][1],
				charD[id][2],
				charD[id][2],
				charD[id][3],
				charD[id][4],
				charD[id][6],
				charD[id][8],
				id < 35 ? charModels[id].defaultExpr : 0
			);
			if (char[i].charState == 9) {
				char[i].expr = 1;
				char[i].dire = 2;
				char[i].frame = 1;
				char[i].legdire = 0;
				char[i].diaMouthFrame = 0;
			} else {
				char[i].expr = charModels[char[i].id].defaultExpr;
			}

			if (char[i].charState >= 9) charCount2++;
			if (id == 36) HPRC1 = i;
			if (id == 35) HPRC2 = i;
			if (char[i].charState == 3 || char[i].charState == 4) {
				char[i].speed = myLevelChars[1][i][4];
				char[i].motionString = generateMS(myLevelChars[1][i]);
			}
		}

		cLevelDialogueChar = [];
		cLevelDialogueFace = [];
		cLevelDialogueText = [];
		for (let i = 0; i < myLevelDialogue[1].length; i++) {
			cLevelDialogueChar.push(myLevelDialogue[1][i].char);
			cLevelDialogueFace.push(myLevelDialogue[1][i].face);
			cLevelDialogueText.push(myLevelDialogue[1][i].text);
		}

		currentLevelDisplayName = myLevelInfo.name;
	} else if (playMode == 3) {
		charCount = myLevelChars[1].length;
		levelWidth = myLevel[1][0].length;
		levelHeight = myLevel[1].length;

		copyLevel(myLevel[1]);

		char = new Array(charCount);
		charCount2 = 0;
		HPRC1 = HPRC2 = 1000000;
		for (let i = 0; i < charCount; i++) {
			let id = myLevelChars[1][i][0];
			char[i] = new Character(
				id,
				myLevelChars[1][i][1] * 30,
				myLevelChars[1][i][2] * 30,
				70 + i * 40,
				400 - i * 30,
				myLevelChars[1][i][3],
				charD[id][0],
				charD[id][1],
				charD[id][2],
				charD[id][2],
				charD[id][3],
				charD[id][4],
				charD[id][6],
				charD[id][8],
				id < 35 ? charModels[id].defaultExpr : 0
			);
			if (char[i].charState == 9) {
				char[i].expr = 1;
				char[i].dire = 2;
				char[i].frame = 1;
				char[i].legdire = 0;
				char[i].diaMouthFrame = 0;
			} else {
				char[i].expr = charModels[char[i].id].defaultExpr;
			}

			if (char[i].charState >= 9) charCount2++;
			if (id == 36) HPRC1 = i;
			if (id == 35) HPRC2 = i;
			if (char[i].charState == 3 || char[i].charState == 4) {
				char[i].speed = myLevelChars[1][i][4];
				char[i].motionString = generateMS(myLevelChars[1][i]);
			}
		}

		cLevelDialogueChar = [];
		cLevelDialogueFace = [];
		cLevelDialogueText = [];
		for (let i = 0; i < myLevelDialogue[1].length; i++) {
			cLevelDialogueChar.push(myLevelDialogue[1][i].char);
			cLevelDialogueFace.push(myLevelDialogue[1][i].face);
			cLevelDialogueText.push(myLevelDialogue[1][i].text);
		}

		currentLevelDisplayName = myLevelInfo.name;
	} else {
		charCount = startLocations[currentLevel].length;
		levelWidth = levels[currentLevel][0].length;
		levelHeight = levels[currentLevel].length;

		if (currentLevel === 0 && !playingLevelpack) levels[0][13][29] = levels[0][13][30] = levels[0][13][31] = quirksMode ? 16 : 1; // Adds converyors back to level 1 on quirks mode.

		copyLevel(levels[currentLevel]);
		charCount2 = 0;
		HPRC1 = HPRC2 = 1000000;
		for (let i = 0; i < charCount; i++) {
			let id = startLocations[currentLevel][i][0];
			char[i] = new Character(
				id,
				startLocations[currentLevel][i][1] * 30 + (startLocations[currentLevel][i][2] * 30) / 100,
				startLocations[currentLevel][i][3] * 30 + (startLocations[currentLevel][i][4] * 30) / 100,
				70 + i * 40,
				400 - i * 30,
				startLocations[currentLevel][i][5],
				charD[id][0],
				charD[id][1],
				charD[id][2],
				charD[id][2],
				charD[id][3],
				charD[id][4],
				charD[id][6],
				charD[id][8],
				id < 35 ? charModels[id].defaultExpr : 0
			);
			if (char[i].charState == 9) {
				char[i].expr = 1;
				char[i].dire = 2;
				char[i].frame = 1;
				char[i].legdire = 0;
				char[i].diaMouthFrame = 0;
			} else {
				char[i].expr = charModels[char[i].id].defaultExpr;
			}

			if (char[i].charState >= 9) charCount2++;
			if (id == 36) HPRC1 = i;
			if (id == 35) HPRC2 = i;
			if (char[i].charState == 3 || char[i].charState == 4) {
				char[i].speed = startLocations[currentLevel][i][6][0] * 10 + startLocations[currentLevel][i][6][1];
				char[i].motionString = startLocations[currentLevel][i][6];
			}
		}

		cLevelDialogueChar = dialogueChar[currentLevel];
		cLevelDialogueFace = dialogueFace[currentLevel];
		cLevelDialogueText = dialogueText[currentLevel];

		if (currentLevel > 99) {
			currentLevelDisplayName =
				'B' + (currentLevel - 99).toString().padStart(2, '0') + '. ' + levelName[currentLevel];
		} else {
			currentLevelDisplayName = (currentLevel + 1).toString().padStart(3, '0') + '. ' + levelName[currentLevel];
		}
	}
	charDepths = new Array((charCount + 1) * 2).fill(-1);
	for (let i = 0; i < charCount; i++) charDepths[i * 2] = Math.floor(charCount - i - 1);
	// move the control to the front
	charDepths[(charCount - 1) * 2] = -1;
	charDepths[charCount * 2] = 0;
	charDepth = levelWidth * levelHeight + charCount * 2;
	getTileDepths();
	calculateShadowsAndBorders();

	osc1.width = Math.floor(levelWidth * 30 * pixelRatio);
	osc1.height = Math.floor(levelHeight * 30 * pixelRatio);
	osctx1.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	osc2.width = Math.floor(levelWidth * 30 * pixelRatio);
	osc2.height = Math.floor(levelHeight * 30 * pixelRatio);
	osctx2.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	drawStaticTiles();
	recover = false;
	cornerHangTimer = 0;
	charsAtEnd = 0;
	control = 0;
	cutScene = 0;
	bgXScale = Math.max(((levelWidth - 32) * 10 + 960) / 9.6, 100);
	bgYScale = Math.max(((levelHeight - 18) * 10 + 540) / 5.4, 100);
	drawLevelBG();
	cameraX = Math.min(Math.max(char[0].x - 480, 0), levelWidth * 30 - 960);
	cameraY = Math.min(Math.max(char[0].y - 270, 0), levelHeight * 30 - 540);
	gotThisCoin = false;
	levelTimer = 0;
	recoverTimer = 0;
	levelTimer2 = getTimer();
	if (char[0].charState <= 9) changeControl();

	doorLightFade = new Array(charCount2).fill(0);
	doorLightFadeDire = new Array(charCount2).fill(0);
}

function copyLevel(thatLevel) {
	thisLevel = new Array(thatLevel.length);
	tileFrames = new Array(thatLevel.length);
	tileShadows = new Array(thatLevel.length);
	tileBorders = new Array(thatLevel.length);
	for (let y = 0; y < levelHeight; y++) {
		thisLevel[y] = new Array(thatLevel[y].length);
		tileFrames[y] = new Array(thatLevel[y].length);
		tileShadows[y] = new Array(thatLevel[y].length);
		tileBorders[y] = new Array(thatLevel[y].length);
		for (let x = 0; x < levelWidth; x++) {
			thisLevel[y][x] = thatLevel[y][x];
			let sw = Math.ceil(blockProperties[thisLevel[y][x]][11] / 6);
			tileFrames[y][x] = {cf: 0, playing: false, rotation: sw == 1 ? -60 : sw == 2 ? 60 : 0};
			tileShadows[y][x] = [];
			tileBorders[y][x] = [];
		}
	}
}

function drawStaticTiles() {
	for (let j = 0; j < tileDepths[0].length; j++) {
		addTileMovieClip(tileDepths[0][j].x, tileDepths[0][j].y, osctx1);
	}
	for (let y = 0; y < levelHeight; y++) {
		for (let x = 0; x < levelWidth; x++) {
			for (let i = 0; i < tileShadows[y][x].length; i++) {
				osctx2.drawImage(svgShadows[tileShadows[y][x][i] - 1], x * 30, y * 30, 30, 30);
			}
			for (let i = 0; i < tileBorders[y][x].length; i++) {
				osctx2.drawImage(svgTileBorders[tileBorders[y][x][i] - 1], x * 30, y * 30, 30, 30);
			}
		}
	}
}

function drawLevelBG() {
	let bgScale = Math.max(bgXScale, bgYScale);
	osc4.width = Math.floor((bgScale / 100) * cwidth * pixelRatio);
	osc4.height = Math.floor((bgScale / 100) * cheight * pixelRatio);
	osctx4.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	osctx4.drawImage(
		imgBgs[playMode >= 2 ? selectedBg : bgs[currentLevel]],
		0,
		0,
		(bgScale / 100) * cwidth,
		(bgScale / 100) * cheight
	);
}

function drawLevel(context) {
	// Draw Static tiles
	context.drawImage(osc1, 0, 0, osc1.width / pixelRatio, osc1.height / pixelRatio);
	// Draw Normal Animated Tiles
	for (let j = 0; j < tileDepths[1].length; j++) {
		addTileMovieClip(tileDepths[1][j].x, tileDepths[1][j].y, context);
	}
	// Draw Borders and Shadows
	context.drawImage(osc2, 0, 0, osc2.width / pixelRatio, osc2.height / pixelRatio);
	// Draw Active2 Switches & Buttons
	for (let j = 0; j < tileDepths[2].length; j++) {
		addTileMovieClip(tileDepths[2][j].x, tileDepths[2][j].y, context);
	}
	// We draw the characters in here so we can layer liquids above them.
	drawCharacters(context);
	// Draw Liquids
	for (let j = 0; j < tileDepths[3].length; j++) {
		addTileMovieClip(tileDepths[3][j].x, tileDepths[3][j].y, context);
	}
}

function drawCharacters(context) {
	for (let d = 0; d < (charCount + 1) * 2; d++) {
		let i = charDepths[d];
		if (i < 0) continue;
		let currCharID = char[i].id;
		if (char[i].charState > 1 && typeof svgChars[currCharID] !== 'undefined') {
			// Draw Burst
			if (char[i].burstFrame >= 0) {
				context.save();
				let burstImg = svgBurst[char[i].burstFrame];
				let burstmat = charModels[char[i].id].burstmat;
				context.transform(
					burstmat.a,
					burstmat.b,
					burstmat.c,
					burstmat.d,
					burstmat.tx + char[i].x,
					burstmat.ty + char[i].y
				);
				context.drawImage(burstImg, -burstImg.width / (scaleFactor*2), -burstImg.height / (scaleFactor*2), burstImg.width / scaleFactor, burstImg.height / scaleFactor);
				context.restore();

				char[i].burstFrame++;
				if (char[i].burstFrame > svgBurst.length - 1) char[i].burstFrame = -1;
			}

			context.save();
			if (char[i].charState >= 3) {
				if (qTimer > 0 || char[i].justChanged >= 1) {
					var littleJump = 0;
					if (i == control && qTimer > 0) {
						littleJump = 9 - Math.pow(qTimer - 4, 2);
					}
					context.translate(0, -littleJump);
					// levelChar["char" + i]._x = char[i].x;
					// levelChar["char" + i]._y = char[i].y - littleJump;
					// if (i == HPRC2) {
					// HPRCBubble.charImage._x = char[i].x;
					// HPRCBubble.charImage._y = char[i].y - 78;
					// }
					// if (char[i].deathTimer >= 30) setTint(i);
				}
				char[i].justChanged--;
			}

			if (char[i].charState == 2) {
				let amt = (60 - recoverTimer) / 60;
				context.transform(1, 0, 0, amt, 0, (1 - amt) * char[i].y);
			}

			if (char[i].deathTimer < 30 && char[i].deathTimer % 6 <= 2 && char[i].charState > 2) context.globalAlpha = 0.3;
			if (currCharID > 34) {
				if (charD[currCharID][7] == 1) {
					drawPossiblyTintedImage(svgChars[currCharID], char[i].x + svgCharsVB[currCharID][0], char[i].y + svgCharsVB[currCharID][1], char[i].temp, context);
				} else {
					let currCharFrame = _frameCount % charD[currCharID][7];
					drawPossiblyTintedImage(svgChars[currCharID][currCharFrame], char[i].x + svgCharsVB[currCharID][currCharFrame][0], char[i].y + svgCharsVB[currCharID][currCharFrame][1], char[i].temp, context);
				}

				if (currCharID == 50) {
					if (char[i].acidDropTimer[0] < 9)
						context.drawImage(svgAcidDrop[char[i].acidDropTimer[0]], char[i].x - 17.7, char[i].y - 1.5, svgAcidDrop[0].width/scaleFactor, svgAcidDrop[0].height/scaleFactor);
					char[i].acidDropTimer[0]++;
					if (char[i].acidDropTimer[0] > 28) {
						if (Math.random() < 0.8) {
							char[i].acidDropTimer[0] = 9;
						} else {
							char[i].acidDropTimer[0] = 0;
						}
					}
				} else if (currCharID == 51) {
					if (char[i].acidDropTimer[0] < 9)
						context.drawImage(svgAcidDrop[char[i].acidDropTimer[0]], char[i].x - 25.75, char[i].y + 1.6, (svgAcidDrop[0].width/scaleFactor) * 0.7826, (svgAcidDrop[0].height/scaleFactor) * 0.7826);
					if (char[i].acidDropTimer[1] < 9)
						ctx.drawImage(svgAcidDrop[char[i].acidDropTimer[1]], char[i].x + 18.3, char[i].y + 6.7, (svgAcidDrop[0].width/scaleFactor) * 0.7826, (svgAcidDrop[0].height/scaleFactor) * 0.7826);
					char[i].acidDropTimer[0]++;
					char[i].acidDropTimer[1]++;
					if (char[i].acidDropTimer[0] > 28) {
						if (Math.random() < 0.8) {
							char[i].acidDropTimer[0] = 9;
						} else {
							char[i].acidDropTimer[0] = 0;
						}
					}
					if (char[i].acidDropTimer[1] > 28) {
						if (Math.random() < 0.8) {
							char[i].acidDropTimer[1] = 9;
						} else {
							char[i].acidDropTimer[1] = 0;
						}
					}
				}
			} else {
				let model = charModels[char[i].id];

				// If we're not bubble dying, draw the legs.
				if (!(char[i].id == 5 && Math.floor(char[i].frame / 2) == 4)) {
					// TODO: remove hard-coded numbers
					// TODO: make the character's leg frames an array and loop through them here...
					// ... or just make them one variable instead of two. whichever one I feel like doing at the time ig.
					let legdire = char[i].legdire > 0 ? 1 : -1;
					let legmat = [
						{
							a: 0.3648529052734375,
							b: 0,
							c: char[i].leg1skew * legdire,
							d: 0.3814697265625,
							tx: legdire > 0 ? -0.75 : 0.35,
							ty: -0.35
						},
						{
							a: 0.3648529052734375,
							b: 0,
							c: char[i].leg2skew * legdire,
							d: 0.3814697265625,
							tx: legdire > 0 ? -0.75 : 0.35,
							ty: -0.35
						}
					];
					let f = [];
					let legf = legFrames[char[i].leg1frame];
					if (legf.type == 'static') {
						f = [legf.bodypart, legf.bodypart];
						// f[i] = f[i][Math.max(char[i].legAnimationFrame[i], 0)%f[i].length];
					} else if (legf.type == 'anim') {
						if (legf.usesMats) {
							f = [legf.bodypart, legf.bodypart];
							legmat = [
								legf.frames[Math.max(char[i].legAnimationFrame[0], 0) % legf.frames.length],
								legf.frames[Math.max(char[i].legAnimationFrame[1], 0) % legf.frames.length]
							];
						} else {
							f = [
								legf.frames[Math.max(char[i].legAnimationFrame[0], 0) % legf.frames.length],
								legf.frames[Math.max(char[i].legAnimationFrame[1], 0) % legf.frames.length]
							];
						}
					}
					context.save();
					context.transform(
						legdire * legmat[0].a,
						legmat[0].b,
						legdire * legmat[0].c,
						legmat[0].d,
						char[i].x + model.legx[0] + legmat[0].tx,
						char[i].y + model.legy[0] + legmat[0].ty
					);
					let leg1img = svgBodyParts[f[0]];
					drawPossiblyTintedImage(leg1img, -leg1img.width / (scaleFactor*2), -leg1img.height / (scaleFactor*2), char[i].temp, context, true);
					context.restore();
					context.save();
					context.transform(
						legdire * legmat[1].a,
						legmat[1].b,
						legdire * legmat[1].c,
						legmat[1].d,
						char[i].x + model.legx[1] + legmat[1].tx,
						char[i].y + model.legy[1] + legmat[1].ty
					);
					let leg2img = svgBodyParts[f[1]];
					drawPossiblyTintedImage(leg2img, -leg2img.width / (scaleFactor*2), -leg2img.height / (scaleFactor*2), char[i].temp, context, true);
					context.restore();
				}

				let modelFrame = model.frames[char[i].frame];
				context.save();
				let runbob =
					char[i].frame == 0 || char[i].frame == 2
						? bounceY(4 / charModels[char[i].id].torsomat.a, 13, char[i].poseTimer)
						: 0;
				context.transform(
					charModels[char[i].id].torsomat.a,
					charModels[char[i].id].torsomat.b,
					charModels[char[i].id].torsomat.c,
					charModels[char[i].id].torsomat.d,
					char[i].x + charModels[char[i].id].torsomat.tx,
					char[i].y + charModels[char[i].id].torsomat.ty
				);
				for (let j = 0; j < modelFrame.length; j++) {
					if (char[i].frame > 9 && modelFrame[j].type == 'armroot') {
						let handOff = modelFrame[j].id == 0 ? 10 : 20;
						let handX =
							-charModels[char[i].id].torsomat.tx +
							(char[HPRC2].x - char[i].x) +
							hprcCrankPos.x +
							handOff * Math.cos((Math.PI * recoverTimer) / 15 - 0.2);
						let handY =
							-charModels[char[i].id].torsomat.ty +
							(char[HPRC2].y - char[i].y) +
							hprcCrankPos.y +
							handOff * Math.sin((Math.PI * recoverTimer) / 15 - 0.2);
						context.strokeStyle = '#000000';
						context.lineWidth = 1.5;
						context.beginPath();
						context.moveTo(modelFrame[j].pos.x, modelFrame[j].pos.y);
						context.lineTo(handX, handY);
						context.stroke();

						context.fillStyle = '#000000';
						context.beginPath();
						context.arc(handX, handY, 2.5, 0, 2 * Math.PI, false);
						context.fill();
						continue;
					}
					let img = svgBodyParts[modelFrame[j].bodypart];
					if (modelFrame[j].type == 'body') img = svgChars[char[i].id];

					context.save();
					context.transform(
						modelFrame[j].mat.a,
						modelFrame[j].mat.b,
						modelFrame[j].mat.c,
						modelFrame[j].mat.d,
						modelFrame[j].mat.tx,
						modelFrame[j].mat.ty + (modelFrame[j].type != 'anim' ? runbob : 0)
					);
					if (modelFrame[j].type == 'anim') {
						img = svgBodyParts[bodyPartAnimations[modelFrame[j].anim].bodypart];
						let bpanimframe = modelFrame[j].loop
							? (char[i].poseTimer + modelFrame[j].offset) %
							  bodyPartAnimations[modelFrame[j].anim].frames.length
							: Math.min(
									char[i].poseTimer + modelFrame[j].offset,
									bodyPartAnimations[modelFrame[j].anim].frames.length - 1
							  );
						let mat = bodyPartAnimations[modelFrame[j].anim].frames[bpanimframe];
						context.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
					} else if (modelFrame[j].type == 'dia') {
						let dmf = 0;
						if (cutScene == 1) {
							let expr = char[i].expr + charModels[char[i].id].mouthType * 2;
							dmf = diaMouths[expr].frameorder[char[i].diaMouthFrame];
							img = svgBodyParts[diaMouths[expr].frames[dmf].bodypart];

							// TODO: move this somehwere else
							if (char[i].diaMouthFrame < diaMouths[expr].frameorder.length - 1) char[i].diaMouthFrame++;
						} else {
							img =
								svgBodyParts[
									diaMouths[char[i].expr + charModels[char[i].id].mouthType * 2].frames[dmf].bodypart
								];
						}
						let mat = diaMouths[model.defaultExpr].frames[dmf].mat;
						context.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
					}
					drawPossiblyTintedImage(img, -img.width / (scaleFactor*2), -img.height / (scaleFactor*2), char[i].temp, context, true);
					context.restore();
				}
				context.restore();
				char[i].poseTimer++;

				// Hitboxes
				// ctx.strokeStyle = HSVtoRGB((char[i].id*1.618033988749894)%1, 0.7, 0.8);
				// ctx.strokeStyle = '#ff0000';
				// ctx.lineWidth = 1;
				// ctx.strokeRect(char[i].x-char[i].w, char[i].y-char[i].h, char[i].w*2, char[i].h);
				context.restore();
			}
			if (!slowTintsEnabled && char[i].temp > 0 && char[i].temp < 50) {
				context.save();
				context.globalAlpha = char[i].temp / 70;
				context.fillStyle = 'rgb(255,' + (100 - char[i].temp) + ',' + (100 - char[i].temp) + ')';
				context.fillRect(char[i].x - char[i].w, char[i].y - char[i].h, char[i].w * 2, char[i].h);
				context.restore();
			}
			context.restore();
		}

		if (i == HPRC2) {
			context.fillStyle = '#00ff00';
			context.textAlign = 'center';
			context.font = '6px Helvetica';
			context.fillText(HPRCText, char[i].x + 12.65, char[i].y - 39.6, 30);
			let radius = svgHPRCCrank.height / (scaleFactor*2);
			context.save();
			context.translate(char[i].x + hprcCrankPos.x, char[i].y + hprcCrankPos.y - littleJump);
			context.rotate(HPRCCrankRot);
			context.drawImage(svgHPRCCrank, -radius, -radius, svgHPRCCrank.width/scaleFactor, svgHPRCCrank.height/scaleFactor);
			context.restore();
		}

		if (char[i].temp >= 50 && char[i].id != 5) {
			context.save();
			let fireImg = svgFire[_frameCount % svgFire.length];
			if (char[i].id == 2) fireImg = svgIceCubeMelt;
			else context.globalAlpha = 0.57;
			let firemat = charModels[char[i].id].firemat;
			context.transform(firemat.a, firemat.b, firemat.c, firemat.d, firemat.tx + char[i].x, firemat.ty + char[i].y);
			context.drawImage(fireImg, -fireImg.width / (scaleFactor*2), -fireImg.height / (scaleFactor*2), fireImg.width / scaleFactor, fireImg.height / scaleFactor);
			context.restore();
		}
	}
}

function drawCutScene() {
	let currdiachar = cLevelDialogueChar[Math.min(cutSceneLine, cLevelDialogueChar.length - 1)];
	if (currdiachar >= 50 && currdiachar < 99) return;
	ctx.save();
	ctx.transform(bubSc, 0, 0, bubSc, bubX, bubY);
	let bubLoc = {x: -bubWidth / 2, y: -bubHeight / 2};
	ctx.drawImage(svgCSBubble, bubLoc.x, bubLoc.y, svgCSBubble.width/scaleFactor, svgCSBubble.height/scaleFactor);
	let textwidth = 386.55;
	let textx = 106.7;
	if (currdiachar == 99) {
		textwidth = 488.25;
		textx = 4.25;
	} else {
		ctx.fillStyle = '#ce6fce';
		ctx.fillRect(bubLoc.x + 10, bubLoc.y + 10, 80, 80);
		ctx.save();
		let charimg = svgChars[char[currdiachar].id];
		if (Array.isArray(charimg)) charimg = charimg[0];
		let charimgmat = charModels[char[currdiachar].id].charimgmat;
		ctx.transform(
			charimgmat.a * 2.6,
			charimgmat.b,
			charimgmat.c,
			charimgmat.d * 2.6,
			charimgmat.tx + bubLoc.x + 50,
			charimgmat.ty + bubLoc.y + 50
		);
		ctx.drawImage(charimg, -charimg.width / (scaleFactor*2), -charimg.height / (scaleFactor*2), charimg.width / scaleFactor, charimg.height / scaleFactor);
		ctx.restore();
	}
	ctx.fillStyle = '#000000';
	ctx.textAlign = 'left';
	ctx.font = '21px Helvetica';
	wrapText(csText, bubLoc.x + textx, bubLoc.y + 4.25, textwidth, 23);
	ctx.restore();
	if (cutScene == 2) {
		if (bubSc > 0.1) bubSc -= bubSc / 4;
	} else {
		if (bubSc < 0.99) bubSc += (1 - bubSc) / 4;
		else bubSc = 1;
	}
}

function drawHPRCBubbleCharImg(dead, sc, xoff) {
	let charimgmat = charModels[char[dead].id].charimgmat;
	ctx.save();
	ctx.transform(
		charimgmat.a * sc,
		charimgmat.b,
		charimgmat.c,
		charimgmat.d * sc,
		(charimgmat.tx * sc) / 2 + xoff,
		(charimgmat.ty * sc) / 2 - 44
	);
	let charimg = svgChars[char[dead].id];
	if (Array.isArray(charimg)) charimg = charimg[0];
	ctx.drawImage(charimg, -charimg.width / (scaleFactor*2), -charimg.height / (scaleFactor*2), charimg.width / scaleFactor, charimg.height / scaleFactor);
	ctx.restore();
}

function offSetLegs(i, duration, frame) {
	if (char[i].leg1frame != frame) {
		char[i].legAnimationFrame[0] = 0;
		char[i].legAnimationFrame[1] = Math.floor(duration / 2);
	} else {
		char[i].legAnimationFrame[0]++;
		char[i].legAnimationFrame[1]++;
	}
}

function bounceY(amt, time, t) {
	let base = Math.sin(mapRange(t % time, 0, time * 2, 0, Math.PI)) * time * 2;
	return ((base > time ? time - base + time : base) * amt) / time;
}

function getTintedCanvasImage(img, a, color) {
	osc3.width = img.width * pixelRatio;
	osc3.height = img.height * pixelRatio;
	osctx3.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	osctx3.save();
	osctx3.fillStyle = color;
	osctx3.globalAlpha = a;
	osctx3.fillRect(0, 0, osc3.width, osc3.height);
	osctx3.globalCompositeOperation = 'destination-in';
	osctx3.globalAlpha = 1;
	osctx3.drawImage(img, 0, 0);
	osctx3.restore();
	return osc3;
}

function drawPossiblyTintedImage(img, x, y, temp, context) {
	context.drawImage(img, x, y, img.width / scaleFactor, img.height / scaleFactor);
	if (slowTintsEnabled && temp > 0 && temp < 50) {
		context.drawImage(
			getTintedCanvasImage(img, temp / 70, 'rgb(255,' + (100 - temp) + ',' + (100 - temp) + ')'),
			x,
			y,
			img.width / scaleFactor,
			img.height / scaleFactor
		);
	}
}

function setBody(i) {
	char[i].leg1skew = 0;
	char[i].leg2skew = 0;

	let legX;
	let skew = [0, 0];
	char[i].legdire = char[i].dire / 2 - 1;
	if (ifCarried(i) && cornerHangTimer == 0) {
		offSetLegs(i, 60, 3);
		char[i].leg1frame = 3;
		char[i].leg2frame = 3;
	} else if (char[i].dire % 2 == 0 && char[i].onob) {
		if (char[i].standingOn >= 0) {
			let j = char[i].standingOn;
			for (let z = 1; z <= 2; z++) {
				legX = char[i].x + charModels[char[i].id].legx[z - 1];
				if (legX >= char[j].x + char[j].w) {
					skew[z - 1] = char[j].x + char[j].w - legX;
				} else if (legX <= char[j].x - char[j].w) {
					skew[z - 1] = char[j].x - char[j].w - legX;
				}
			}
		} else if (char[i].fricGoal == 0) {
			for (let z = 1; z <= 2; z++) {
				legX = char[i].x + charModels[char[i].id].legx[z - 1];
				if (!safeToStandAt(legX, char[i].y + 1)) {
					let s1 = safeToStandAt(legX - 30, char[i].y + 1);
					let s2 = safeToStandAt(legX + 30, char[i].y + 1);
					if (
						s1 &&
						(!s2 || (legX % 30) - (z - 1.5) * 10 < 30 - (legX % 30)) &&
						!horizontalProp(i, -1, 1, char[i].x - 15, char[i].y)
					) {
						skew[z - 1] = -legX % 30;
					} else if (s2 && !horizontalProp(i, 1, 1, char[i].x + 15, char[i].y)) {
						skew[z - 1] = 30 - (legX % 30);
					}
				} else {
					skew[z - 1] = 0;
				}
			}
		}
		if (skew[1] - skew[0] >= 41) {
			skew[0] = skew[1];
			skew[1] -= 3;
		}
		if (skew[0] > skew[1] && skew[1] >= 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = skew[0] / 42;
			char[i].leg2skew = skew[0] / 42;
		} else if (skew[0] > skew[1] && skew[0] <= 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = skew[1] / 42;
			char[i].leg2skew = skew[1] / 42;
		} else if (skew[0] < 0 && skew[1] > 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = skew[0] / 42;
			char[i].leg2skew = skew[1] / 42;
		} else if (skew[1] > 0 && skew[0] == 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = 0.72;
			char[i].leg2skew = 0.72;
		} else if (skew[0] < 0 && skew[1] == 0) {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = -0.72;
			char[i].leg2skew = -0.72;
		} else {
			char[i].leg1frame = 0;
			char[i].leg2frame = 0;
			char[i].leg1skew = 0;
			char[i].leg2skew = 0;
		}
	} else {
		if (char[i].dire % 2 == 1 && char[i].onob) {
			// Walk
			offSetLegs(i, 28, 2);
		}
		if (char[i].submerged >= 1 && !char[i].onob) {
			// Swim
			offSetLegs(i, 20, 4);
			char[i].leg1frame = 4;
			char[i].leg2frame = 4;
		}
		for (let z = 1; z <= 2; z++) {
			if (char[i].submerged >= 1 && !char[i].onob) {
			} else {
				if (char[i].onob) {
					char[i].leg1frame = 2;
					char[i].leg2frame = 2;
				} else {
					char[i].leg1frame = 1;
					char[i].leg2frame = 1;
				}
			}
		}
	}
	if (cutScene == 1 && cLevelDialogueChar[cutSceneLine] == i) {
		char[i].setFrame(Math.ceil(char[i].dire / 2) * 2 - 1);
	} else if (i == control && recoverTimer >= 1) {
		if (char[i].x - (char[HPRC2].x - 33) < 25) {
			char[i].setFrame(Math.ceil(char[i].dire / 2) + 11);
		} else {
			char[i].setFrame(Math.ceil(char[i].dire / 2) + 9);
		}
	} else if (char[i].carry) {
		char[i].setFrame(Math.ceil(char[i].dire / 2) + 5);
	} else if (!char[i].onob && !ifCarried(i)) {
		char[i].setFrame(Math.ceil(char[i].dire / 2) + 3);
		// let frame = Math.round(Math.min(4 - char[i].vy,15));
	} else {
		char[i].setFrame(char[i].dire - 1);
	}
}

function getTileDepths() {
	for (let i = 0; i < 6; i++) {
		switchable[i] = [];
	}
	for (let y = 0; y < levelHeight; y++) {
		for (let x = 0; x < levelWidth; x++) {
			if (thisLevel[y][x] >= 1) {
				// switchable
				if (blockProperties[thisLevel[y][x]][12] >= 1) {
					switchable[blockProperties[thisLevel[y][x]][12] - 1].push([x, y]);
				}
				// levelActive3 - liquids
				if (blockProperties[thisLevel[y][x]][14]) {
					tileDepths[3].push({x: x, y: y});
					// levelActive2 - switches & buttons
				} else if (blockProperties[thisLevel[y][x]][11] >= 1) {
					tileDepths[2].push({x: x, y: y});
					// levelActive - animated blocks
				} else if (blockProperties[thisLevel[y][x]][8]) {
					tileDepths[1].push({x: x, y: y});
					// levelStill - static blocks
				} else {
					tileDepths[0].push({x: x, y: y});
				}

				if (thisLevel[y][x] == 6) {
					locations[0] = x;
					locations[1] = y;
				}
				if (thisLevel[y][x] == 12) {
					locations[2] = x;
					locations[3] = y;
					locations[4] = 1000;
					locations[5] = 0;
				}
			}
		}
	}
}
// draws a tile
// TODO: precalculate a this stuff and only do the drawing in here. Unless it's actually all necessary. Then you can just leave it.
function addTileMovieClip(x, y, context) {
	let t = thisLevel[y][x];
	if (blockProperties[t][16] > 0) {
		if (blockProperties[t][16] == 1) {
			if (blockProperties[t][11] > 0 && typeof svgLevers[(blockProperties[t][11] - 1) % 6] !== 'undefined') {
				context.save();
				context.translate(x * 30 + 15, y * 30 + 28);
				context.rotate(tileFrames[y][x].rotation * (Math.PI / 180));
				context.translate(-x * 30 - 15, -y * 30 - 28); // TODO: find out how to remove this line
				context.drawImage(svgLevers[(blockProperties[t][11] - 1) % 6], x * 30, y * 30, svgLevers[0].width / scaleFactor, svgLevers[0].height / scaleFactor);
				context.restore();
				// Math.floor(blockProperties[t][11]/6);
				// Math.floor(blockProperties[t][11]/6)
				// context.fillStyle = '#505050';
				// context.fillRect(x*30, y*30, 30, 30);
			}
			// context.fillStyle = '#cc33ff';
			// context.fillRect(x*30, y*30, 30, 30);
			context.drawImage(svgTiles[t], x * 30 + svgTilesVB[t][0], y * 30 + svgTilesVB[t][1], svgTiles[t].width / scaleFactor, svgTiles[t].height / scaleFactor);
		} else if (blockProperties[t][16] > 1) {
			let frame = 0;
			if (blockProperties[t][17]) frame = blockProperties[t][18][_frameCount % blockProperties[t][18].length];
			else {
				frame = tileFrames[y][x].cf;
				if (tileFrames[y][x].playing) tileFrames[y][x].cf++;
				if (tileFrames[y][x].cf >= blockProperties[t][16] - 1) {
					tileFrames[y][x].playing = false;
					tileFrames[y][x].cf = 0;
				}
			}
			// context.fillStyle = '#00ffcc';
			// context.fillRect(x*30, y*30, 30, 30);
			if (boundingBoxCheck(cameraX, cameraY, 960, 540, x * 30 + svgTilesVB[t][frame][0], y * 30 + svgTilesVB[t][frame][1], svgTilesVB[t][frame][2], svgTilesVB[t][frame][3])) {
				context.drawImage(svgTiles[t][frame], x * 30 + svgTilesVB[t][frame][0], y * 30 + svgTilesVB[t][frame][1], svgTiles[t][frame].width / scaleFactor, svgTiles[t][frame].height / scaleFactor);
			}
			// context.drawImage(svgTiles[t][0], x*30, y*30);
		}
	} else if (t == 6) {
		// Door
		let bgid = playMode == 2 ? selectedBg : bgs[currentLevel];
		context.fillStyle = bgid == 9 || bgid == 10 ? '#999999' : '#505050';
		context.fillRect((x - 1) * 30, (y - 3) * 30, 60, 120);
		for (let i = 0; i < charCount2; i++) {
			context.fillStyle =
				'rgb(' +
				mapRange(doorLightFade[i], 0, 1, 40, 0) +
				',' +
				mapRange(doorLightFade[i], 0, 1, 40, 255) +
				',' +
				mapRange(doorLightFade[i], 0, 1, 40, 0) +
				')';
			context.fillRect(
				(x - 1) * 30 +
					doorLightX[Math.floor(i / 6) == Math.floor((charCount2 - 1) / 6) ? (charCount2 - 1) % 6 : 5][i % 6],
				y * 30 - 80 + Math.floor(i / 6) * 10,
				5,
				5
			);
			if (doorLightFadeDire[i] != 0) {
				doorLightFade[i] = Math.max(Math.min(doorLightFade[i] + doorLightFadeDire[i] * 0.0625, 1), 0);
				if (doorLightFade[i] == 1 || doorLightFade[i] == 0) doorLightFadeDire[i] = 0;
			}
		}
	} else if (t == 12) {
		// Coin
		if (!gotThisCoin) {
			if (locations[4] < 200) {
				context.save();
				context.translate(x * 30 + 15, y * 30 + 15);
				let wtrot = Math.sin((_frameCount * Math.PI) / 20) * 0.5235987756;
				context.transform(Math.cos(wtrot), -Math.sin(wtrot), Math.sin(wtrot), Math.cos(wtrot), 0, 0);
				context.globalAlpha = Math.max(Math.min(coinAlpha / 100, 1), 0);
				context.drawImage(svgCoin, -15, -15, 30, 30);
				context.restore();
			}
		} else if (tileFrames[y][x].cf < svgCoinGet.length) {
			context.drawImage(svgCoinGet[tileFrames[y][x].cf], x * 30 - 21, y * 30 - 21, svgCoinGet[0].width / scaleFactor, svgCoinGet[0].height / scaleFactor);
			tileFrames[y][x].cf++;
		}
	}
}

function calculateShadowsAndBorders() {
	for (let y = 0; y < levelHeight; y++) {
		for (let x = 0; x < levelWidth; x++) {
			if (thisLevel[y][x] >= 1) {
				let t = thisLevel[y][x];
				if (t == 6) {
					for (let x2 = 0; x2 < 2 && x - x2 >= 0; x2++) {
						for (let y2 = 0; y2 < 4 && y - y2 >= 0; y2++) {
							setAmbientShadow(x - x2, y - y2);
						}
					}
				} else if (t >= 110 && t <= 129) {
					for (let x2 = 0; x2 < 3; x2++) {
						for (let y2 = 0; y2 < 2; y2++) {
							setAmbientShadow(x - x2, y - y2);
						}
					}
				} else if (blockProperties[thisLevel[y][x]][10]) {
					setAmbientShadow(x, y);
				}
				if (blockProperties[thisLevel[y][x]][13]) {
					setBorder(x, y, t);
				}
			}
		}
	}
}

function setAmbientShadow(x, y) {
	tileShadows[y][x] = [];
	if (outOfRange(x, y)) return;
	let count = 0;
	for (let i = 0; i < 4; i++) {
		if (!outOfRange(x + cardinal[i][0], y + cardinal[i][1])) {
			let t = blockProperties[thisLevel[y + cardinal[i][1]][x + cardinal[i][0]]][12];
			if (blockProperties[thisLevel[y + cardinal[i][1]][x + cardinal[i][0]]][i] && (t == 0 || t == 6)) {
				count += Math.pow(2, 3 - i);
			}
		}
	}
	if (count > 0) tileShadows[y][x].push(count);
	for (let i = 0; i < 4; i++) {
		if (
			!outOfRange(x + diagonal[i][0], y + diagonal[i][1]) &&
			!blockProperties[thisLevel[y][x + diagonal[i][0]]][opposite(i, 0)] &&
			!blockProperties[thisLevel[y + diagonal[i][1]][x]][opposite(i, 1)] &&
			blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][0]]][opposite(i, 0)] &&
			blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][0]]][12] == 0 &&
			blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][0]]][opposite(i, 1)] &&
			blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][0]]][12] == 0
		) {
			tileShadows[y][x].push(16 + i);
		}
	}
}

function setBorder(x, y, s) {
	let borderset = 0;
	// TODO: remove this hard-coded array
	let metalBlocks = [98, 102, 105, 107];
	if (metalBlocks.includes(thisLevel[y][x])) borderset = 19;
	tileBorders[y][x] = [];
	if (outOfRange(x, y)) return;
	let count = 0;
	for (let i = 0; i < 4; i++) {
		if (
			!outOfRange(x + cardinal[i][0], y + cardinal[i][1]) &&
			thisLevel[y + cardinal[i][1]][x + cardinal[i][0]] != s
		) {
			count += Math.pow(2, 3 - i);
		}
	}
	if (count > 0) tileBorders[y][x].push(count + borderset);
	for (let i = 0; i < 4; i++) {
		if (
			!outOfRange(x + diagonal[i][0], y + diagonal[i][1]) &&
			thisLevel[y][x + diagonal[i][0]] == s &&
			thisLevel[y + diagonal[i][1]][x] == s &&
			thisLevel[y + diagonal[i][1]][x + diagonal[i][0]] != s
		) {
			tileBorders[y][x].push(16 + i + borderset);
		}
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

function getCoin(i) {
	if (!gotThisCoin && char[i].charState >= 7) {
		if (
			Math.floor((char[i].x - char[i].w) / 30) <= locations[2] &&
			Math.ceil((char[i].x + char[i].w) / 30) - 1 >= locations[2] &&
			Math.floor((char[i].y - char[i].h) / 30) <= locations[3] &&
			Math.ceil(char[i].y / 30) - 1 >= locations[3]
		) {
			gotThisCoin = true;
		}
	}
}

function setCamera() {
	if (levelWidth <= 32) {
		cameraX = levelWidth * 15 - 480;
	} else if (char[control].x - cameraX < 384) {
		cameraX = Math.min(Math.max(cameraX + (char[control].x - 384 - cameraX) * 0.12, 0), levelWidth * 30 - 960);
	} else if (char[control].x - cameraX >= 576) {
		cameraX = Math.min(Math.max(cameraX + (char[control].x - 576 - cameraX) * 0.12, 0), levelWidth * 30 - 960);
	}

	if (levelHeight <= 18) {
		cameraY = levelHeight * 15 - 270;
	} else if (char[control].y - cameraY < 216) {
		cameraY = Math.min(Math.max(cameraY + (char[control].y - 216 - cameraY) * 0.12, 0), levelHeight * 30 - 540);
	} else if (char[control].y - cameraY >= 324) {
		cameraY = Math.min(Math.max(cameraY + (char[control].y - 324 - cameraY) * 0.12, 0), levelHeight * 30 - 540);
	}
}

function checkButton(i) {
	if (char[i].onob) {
		let yTile = Math.ceil(char[i].y / 30);
		if (yTile >= 0 && yTile <= levelHeight - 1) {
			let num;
			for (let j = Math.floor((char[i].x - char[i].w) / 30); j <= Math.floor((char[i].x + char[i].w) / 30); j++) {
				if (!outOfRange(j, yTile)) {
					num = blockProperties[thisLevel[yTile][j]][11];
					if (num >= 13) {
						if (tileFrames[yTile][j].cf != 1) {
							leverSwitch(num - 13);
							tileFrames[yTile][j].cf = 1;
							tileFrames[yTile][j].playing = false;
						}
						let okay = true;
						for (let k = 0; k < char[i].buttonsPressed.length; k++) {
							if (char[i].buttonsPressed[k][0] == j && char[i].buttonsPressed[k][1] == yTile) {
								okay = false;
							}
						}
						if (okay) {
							char[i].buttonsPressed.push([j, yTile]);
						}
						// break;
					}
				}
			}
		}
	}
}

function checkButton2(i, bypass) {
	if (char[i].y < levelHeight * 30 + 30) {
		for (let j = char[i].buttonsPressed.length - 1; j >= 0; j--) {
			let x = char[i].buttonsPressed[j][0];
			let y = char[i].buttonsPressed[j][1];
			if (
				!char[i].onob ||
				char[i].standingOn >= 0 ||
				char[i].x < x * 30 - char[i].w ||
				char[i].x >= x * 30 + 30 + char[i].w ||
				bypass
			) {
				let okay = true;
				for (let k = 0; k < charCount; k++) {
					if (k != i) {
						for (let m = 0; m < char[k].buttonsPressed.length; m++) {
							if (char[k].buttonsPressed[m][0] == x && char[k].buttonsPressed[m][1] == y) {
								okay = false;
							}
						}
					}
				}
				if (okay) {
					if (bypass) leverSwitch2(blockProperties[thisLevel[y][x]][11] - 13, i);
					else leverSwitch(blockProperties[thisLevel[y][x]][11] - 13);
					tileFrames[y][x].cf = 2;
					tileFrames[y][x].playing = true;
				}
				for (let k = 0; k < char[i].buttonsPressed.length; k++) {
					if (k > j) {
						char[i].buttonsPressed[k][0] = char[i].buttonsPressed[k - 1][0];
						char[i].buttonsPressed[k][1] = char[i].buttonsPressed[k - 1][1];
					}
				}
				char[i].buttonsPressed.pop();
			}
		}
	}
}

function leverSwitch(j) {
	for (let z = 0; z < switchable[j].length; z++) {
		let x = switchable[Math.min(j, 5)][z][0];
		let y = switchable[Math.min(j, 5)][z][1];
		for (let k = 0; k < switches[j].length; k++) {
			if (thisLevel[y][x] == switches[j][k * 2]) {
				thisLevel[y][x] = switches[j][k * 2 + 1];
			} else if (thisLevel[y][x] == switches[j][k * 2 + 1]) {
				thisLevel[y][x] = switches[j][k * 2];
			}
		}
	}
	for (let i = 0; i < charCount; i++) {
		char[i].justChanged = 2;
		checkDeath(i);
	}
}

// the exact same as leverSwitch(), but with an aditional argument to avoid calling checkDeath() on the same character.
function leverSwitch2(j, c) {
	for (let z = 0; z < switchable[j].length; z++) {
		let x = switchable[Math.min(j, 5)][z][0];
		let y = switchable[Math.min(j, 5)][z][1];
		for (let k = 0; k < switches[j].length; k++) {
			if (thisLevel[y][x] == switches[j][k * 2]) {
				thisLevel[y][x] = switches[j][k * 2 + 1];
			} else if (thisLevel[y][x] == switches[j][k * 2 + 1]) {
				thisLevel[y][x] = switches[j][k * 2];
			}
		}
	}
	for (let i = 0; i < charCount; i++) {
		// Prevents an infinite loop from crashing the game.
		if (i != c) {
			char[i].justChanged = 2;
			checkDeath(i);
		}
	}
}

function checkDeath(i) {
	for (let y = Math.floor((char[i].y - char[i].h) / 30); y <= Math.floor((char[i].y - 0.01) / 30); y++) {
		for (let x = Math.floor((char[i].x - char[i].w) / 30); x <= Math.floor((char[i].x + char[i].w) / 30); x++) {
			if (!outOfRange(x, y)) {
				if (
					blockProperties[thisLevel[y][x]][4] ||
					blockProperties[thisLevel[y][x]][5] ||
					blockProperties[thisLevel[y][x]][6] ||
					blockProperties[thisLevel[y][x]][7]
				) {
					startDeath(i);
				}
			}
		}
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
	if (exitTileHorizontal(i, -1) || exitTileHorizontal(i, 1) || exitTileVertical(i, 1) || exitTileVertical(i, -1)) {
		if (!somewhereHeated(i)) {
			char[i].heated = 0;
		}
	}
}

function somewhereHeated(i) {
	for (
		let x = Math.max(Math.floor((char[i].x - char[i].w) / 30), 0);
		x <= Math.min(Math.floor((char[i].x + char[i].w) / 30), levelWidth - 1);
		x++
	) {
		for (
			let y = Math.max(Math.floor((char[i].y - char[i].h) / 30), 0);
			y <= Math.min(Math.floor(char[i].y / 30), levelHeight - 1);
			y++
		) {
			if (thisLevel[y][x] == 15) return true;
		}
	}
	return false;
}

function extinguish(i) {
	for (let j = 0; j < charCount; j++) {
		if (char[j].charState >= 5 && j != i && char[j].temp > 0) {
			if (
				Math.abs(char[i].x - char[j].x) < char[i].w + char[j].w &&
				char[j].y > char[i].y - char[i].h &&
				char[j].y < char[i].y + char[j].h
			) {
				char[j].temp = 0;
			}
		}
	}
}

function submerge(i) {
	if (char[i].temp > 0) char[i].temp = 0;
	let goal = somewhereSubmerged(i);
	if (char[i].submerged <= 1 && goal >= 2) {
		char[i].weight2 -= 0.16;
		rippleWeight(i, 0.16, -1);
		char[i].vx *= 0.1;
		char[i].vy *= 0.1;
	}
	char[i].submerged = goal;
}

function unsubmerge(i) {
	if (exitTileHorizontal(i, -1) || exitTileHorizontal(i, 1) || exitTileVertical(i, 1) || exitTileVertical(i, -1)) {
		let goal = somewhereSubmerged(i);
		if (goal == 0 && char[i].submerged >= 1) {
			if (char[i].submerged == 2 && exitTileVertical(i, -1) && char[i].weight2 < 0 && !ifCarried(i)) {
				char[i].vy = 0;
				char[i].y = Math.ceil(char[i].y / 30) * 30;
				goal = 1;
			}
			char[i].weight2 += 0.16;
			rippleWeight(i, 0.16, 1);
		}
		char[i].submerged = goal;
	}
}

function somewhereSubmerged(i) {
	let record = 0;
	for (let x = Math.floor((char[i].x - char[i].w) / 30); x <= Math.floor((char[i].x + char[i].w) / 30); x++) {
		let lowY = Math.floor((char[i].y - char[i].h) / 30);
		let highY = Math.floor(char[i].y / 30);
		for (let y = lowY; y <= highY; y++) {
			if (!outOfRange(x, y) && blockProperties[thisLevel[y][x]][14]) {
				if (y == highY) {
					if (record == 0) {
						record = 2;
					}
				} else {
					record = 3;
				}
			}
		}
	}
	return record;
}

function newTileUp(i) {
	return Math.floor((char[i].y - char[i].h) / 30) < Math.floor((char[i].py - char[i].h) / 30);
}

function newTileDown(i) {
	return Math.ceil(char[i].y / 30) > Math.ceil(char[i].py / 30);
}

function newTileHorizontal(i, sign) {
	return (
		Math.ceil((sign * (char[i].x + char[i].w * sign)) / 30) >
		Math.ceil((sign * (char[i].px + char[i].w * sign)) / 30)
	);
}

function exitTileHorizontal(i, sign) {
	return (
		Math.ceil((sign * (char[i].x - char[i].w * sign)) / 30) >
		Math.ceil((sign * (char[i].px - char[i].w * sign)) / 30)
	);
}

function exitTileVertical(i, sign) {
	let includeHeight = 0.5 * sign + 0.5;
	return (
		Math.ceil((sign * (char[i].y - char[i].h * includeHeight)) / 30) >
		Math.ceil((sign * (char[i].py - char[i].h * includeHeight)) / 30)
	);
}

function allSolid(i) {
	return blockProperties[i][0] && blockProperties[i][1] && blockProperties[i][2] && blockProperties[i][3];
}

function solidAt(x, y) {
	let t = getBlockTypeAt(x, y);
	return typeof t === 'number'
		? blockProperties[t][0] && blockProperties[t][1] && blockProperties[t][2] && blockProperties[t][3]
		: true;
}

function solidCeiling(x, y) {
	return blockProperties[getBlockTypeAt(x, y)][0];
}

function safeToStandAt(x, y) {
	let t = getBlockTypeAt(x, y);
	return typeof t === 'number'
		? blockProperties[t][1] && !blockProperties[t][5] && t != 14 && t != 16 && t != 83 && t != 85
		: true;
}

function getBlockTypeAt(x, y) {
	return thisLevel[Math.floor(y / 30)][Math.floor(x / 30)];
}

function verticalProp(i, sign, prop, x, y) {
	let includeHeight = -0.5 * sign + 0.5;
	let yTile = Math.floor((y - char[i].h * includeHeight) / 30);
	if (prop <= 3 && sign == -1 && yTile == -1) {
		return true;
	}
	if (prop >= 4 && prop <= 7) {
		for (j = Math.floor((x - char[i].w) / 30); j <= Math.floor((x + char[i].w - 0.01) / 30); j++) {
			if (!outOfRange(j, yTile)) {
				if (blockProperties[thisLevel[yTile][j]][prop - 4] && !blockProperties[thisLevel[yTile][j]][prop]) {
					return false;
				}
			}
		}
	}
	for (j = Math.floor((x - char[i].w) / 30); j <= Math.floor((x + char[i].w - 0.01) / 30); j++) {
		if (!outOfRange(j, yTile)) {
			if (blockProperties[thisLevel[yTile][j]][prop]) {
				if (prop != 1 || !ifCarried(i) || allSolid(thisLevel[yTile][j])) {
					return true;
				}
			}
		}
	}
	return false;
}

function horizontalProp(i, sign, prop, x, y) {
	let xTile = Math.floor((x + char[i].w * sign) / 30);
	if (prop <= 3 && ((sign == -1 && xTile <= -1) || (sign == 1 && xTile >= levelWidth))) {
		return true;
	}
	if (prop >= 4 && prop <= 7) {
		for (let j = Math.floor((y - char[i].h) / 30); j <= Math.floor((y - 0.01) / 30); j++) {
			if (!outOfRange(xTile, j) && !outOfRange(xTile - sign, j)) {
				if (
					blockProperties[thisLevel[j][xTile]][prop - 4] &&
					!blockProperties[thisLevel[j][xTile - sign]][prop - 4] &&
					!blockProperties[thisLevel[j][xTile]][prop]
				) {
					return false;
				}
			}
		}
	}
	for (j = Math.floor((y - char[i].h) / 30); j <= Math.floor((y - 0.01) / 30); j++) {
		if (!outOfRange(xTile, j)) {
			if (blockProperties[thisLevel[j][xTile]][prop]) {
				return true;
			}
		}
	}
	return false;
}

function verticalType(i, sign, prop, pist) {
	let includeHeight = -0.5 * sign + 0.5;
	let yTile = Math.floor((char[i].y - char[i].h * includeHeight) / 30);
	let toReturn = false;
	for (let j = Math.floor((char[i].x - char[i].w) / 30); j <= Math.floor((char[i].x + char[i].w - 0.01) / 30); j++) {
		if (!outOfRange(j, yTile)) {
			if (thisLevel[yTile][j] == prop) {
				if (pist) {
					tileFrames[yTile][j].playing = true;
					tileFrames[yTile][j].cf = 1;
				}
				toReturn = true;
			}
		}
	}
	return toReturn;
}

function horizontalType(i, sign, prop) {
	let xTile = Math.floor((char[i].x + char[i].w * sign) / 30);
	for (let j = Math.floor((char[i].y - char[i].h) / 30); j <= Math.floor((char[i].y - 0.01) / 30); j++) {
		if (!outOfRange(xTile, j)) {
			if (thisLevel[j][xTile] == prop) {
				return true;
			}
		}
	}
	return false;
}

function land(i, y, vy) {
	char[i].y = y;
	if (char[i].weight2 <= 0) {
		char[i].vy = -Math.abs(vy);
	} else {
		char[i].vy = vy;
		char[i].onob = true;
	}
}

function land2(i, y) {
	if (control < 1000) char[control].landTimer = 0;
	stopCarrierY(i, y, false);
}

function centered(i, len) {
	if (i % 2 == 0) {
		return (len - i - 2 + (len % 2)) / 2;
	}
	return (i + len - 1 + (len % 2)) / 2;
}

function onlyConveyorsUnder(i) {
	let yTile = Math.floor(char[i].y / 30 + 0.5);
	let min = Math.floor((char[i].x - char[i].w) / 30);
	let max = Math.floor((char[i].x + char[i].w - 0.01) / 30);
	let todo = 0;
	for (let j = 0; j <= max - min; j++) {
		let j2 = centered(j, 1 + max - min) + min;
		if (!outOfRange(j2, yTile)) {
			let t = thisLevel[yTile][j2];
			if (blockProperties[t][1]) {
				if (t == 14 || t == 83) {
					if (todo == 0) todo = -2.48;
				} else if (t == 16 || t == 85) {
					if (todo == 0) todo = 2.48;
				} else if (j == 0 || char[i].charState == 10) {
					return 0;
				}
			}
		}
	}
	return todo;
}

function startCutScene() {
	if (cutScene == 0) {
		if (toSeeCS) {
			cutScene = 1;
			cutSceneLine = 0;
			for (let i = 0; i < char.length; i++) {
				if (char[i].charState >= 7 && char[i].id < 35)
					char[i].diaMouthFrame =
						diaMouths[char[i].expr + charModels[char[i].id].mouthType * 2].frameorder.length - 1;
			}
			displayLine(currentLevel, cutSceneLine);
			char[control].dire = Math.ceil(char[control].dire / 2) * 2;
		} else {
			rescue();
			for (let i = 0; i < cLevelDialogueChar.length; i++) {
				let p = cLevelDialogueChar[i];
				if (p >= 50 && p < 60) leverSwitch(p - 50);
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
}

function rescue() {
	for (let i = 0; i < charCount; i++) {
		if (char[i].charState == 9) {
			char[i].charState = 10;
			char[i].expr = charModels[char[i].id].defaultExpr;
		}
	}
}

function displayLine(level, line) {
	let p = cLevelDialogueChar[line];
	if (p >= 50 && p < 60) {
		leverSwitch(p - 50);
		cutSceneLine++;
		line++;
		p = cLevelDialogueChar[line];
		if (cutSceneLine >= cLevelDialogueChar.length) {
			endCutScene();
			return;
		}
	}
	let x;
	if (p == 99) {
		x = 480;
	} else if (p < char.length) {
		x = Math.min(Math.max(char[p].x, bubWidth / 2 + bubMargin), 960 - bubWidth / 2 - bubMargin);
		putDown(p);
	}
	bubSc = 0.1;
	bubX = x;
	if (char[control].y - cameraY > 270) {
		bubY = bubMargin + bubHeight / 2;
	} else {
		bubY = 520 - bubMargin - bubHeight / 2;
	}
	if (p < char.length) {
		char[p].expr = cLevelDialogueFace[line] - 2;
		char[p].diaMouthFrame = 0;
	}
	csText = cLevelDialogueText[line];
}

function startDeath(i) {
	if (char[i].deathTimer >= 30 && (char[i].charState >= 7 || char[i].temp >= 50)) {
		if (ifCarried(i)) {
			char[char[i].carriedBy].vy = 0;
			char[char[i].carriedBy].vx = 0;
			putDown(char[i].carriedBy);
		}
		char[i].pcharState = char[i].charState;
		checkButton2(i, true);
		fallOff(i);
		char[i].deathTimer = 20;
		char[i].leg1frame = 1;
		char[i].leg2frame = 1;
		char[i].leg1skew = 0;
		char[i].leg2skew = 0;

		char[i].frame = 7 + Math.ceil(char[i].dire / 2);
	}
}

function endDeath(i) {
	putDown(i);
	char[i].temp = 0;
	if (!quirksMode) char[i].heated = 0;
	char[i].charState = 1;
	// OG bug fix
	if (!quirksMode && char[i].atEnd) {
		doorLightFadeDire[charsAtEnd - 1] = -1;
		charsAtEnd--;
		char[i].atEnd = false;
	}
	deathCount++;
	saveGame();
	if (i == control) changeControl();
}

function bounce(i) {
	if (ifCarried(i)) {
		bounce(char[i].carriedBy);
	}
	if (char[i].dire % 2 == 0) {
		char[i].fricGoal = 0;
	}
	char[i].jump(-jumpPower * 1.66);
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

function ifCarried(i) {
	if (char[i].carriedBy >= 0 && char[i].carriedBy <= 190) {
		return char[char[i].carriedBy].carry;
	}
	return false;
}

function stopCarrierX(i, x) {
	if (ifCarried(i)) {
		char[char[i].carriedBy].x = x - xOff(i);
		char[char[i].carriedBy].vx = 0;
	}
}

function stopCarrierY(i, y, canCornerHang) {
	if (
		ifCarried(i) &&
		(!char[char[i].carriedBy].onob ||
			(char[char[i].carriedBy].standingOn >= 0 && char[char[char[i].carriedBy].standingOn].vy != 0))
	) {
		if (char[char[i].carriedBy].standingOn >= 0) {
			char[char[char[i].carriedBy].standingOn].vy = 0;
			fallOff(char[i].carriedBy);
		}
		if (char[char[i].carriedBy].vy >= 0 && canCornerHang && !solidAt(char[char[i].carriedBy].x, char[i].y + 15)) {
			let lSolid =
				solidAt(char[char[i].carriedBy].x - char[char[i].carriedBy].w - 15, char[i].y + 15) ||
				solidAt(char[char[i].carriedBy].x - char[char[i].carriedBy].w - 45, char[i].y + 15);
			let rSolid =
				solidAt(char[char[i].carriedBy].x + char[char[i].carriedBy].w + 15, char[i].y + 15) ||
				solidAt(char[char[i].carriedBy].x + char[char[i].carriedBy].w + 45, char[i].y + 15);
			char[i].justChanged = 2;
			char[char[i].carriedBy].justChanged = 2;
			if (lSolid && rSolid) {
				putDown(char[i].carriedBy);
			} else if (lSolid) {
				char[char[i].carriedBy].vx += power;
			} else if (rSolid) {
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
			if (
				newTileDown(char[i].carriedBy) &&
				verticalProp(char[i].carriedBy, 1, 1, char[char[i].carriedBy].x, char[char[i].carriedBy].y)
			) {
				char[char[i].carriedBy].y = Math.floor(char[char[i].carriedBy].y / 30) * 30;
			}
		}
	}
}

function rippleWeight(i, w, sign) {
	if (char[i].standingOn >= 0) {
		char[char[i].standingOn].weight2 += w * sign;
		if (char[char[i].standingOn].submerged == 1 && char[char[i].standingOn].weight2 < 0) {
			char[char[i].standingOn].submerged = 2;
		}
		if (
			char[char[i].standingOn].submerged >= 2 &&
			char[char[i].standingOn].weight2 < 0 &&
			char[char[i].standingOn].onob
		) {
			char[char[i].standingOn].onob = false;
		}
		rippleWeight(char[i].standingOn, w, sign);
	}
}

function onlyMovesOneBlock(i, j) {
	let sign = Math.floor((char[j].dire - 1) / 2) * 2 - 1;
	let x1 = Math.ceil((sign * (char[i].x + char[i].w * sign)) / 30);
	let x2 = Math.ceil((sign * (char[control].x + xOff2(control) + char[i].w * sign)) / 30);
	return Math.abs(x2 - x1) <= 1;
}

function putDown(i) {
	if (char[i].carry) {
		rippleWeight(i, char[char[i].carryObject].weight2, -1);
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

function landOnObject(i) {
	let record = 10000;
	let k = 0;
	for (let j = 0; j < charCount; j++) {
		if (!ifCarried(j) && (char[j].charState == 6 || char[j].charState == 4)) {
			let dist = Math.abs(char[i].x - char[j].x);
			if (
				dist < char[i].w + char[j].w &&
				char[i].y >= char[j].y - char[j].h &&
				(char[i].py < char[j].py - char[j].h || (char[i].py == char[j].py - char[j].h && char[i].vy == 0))
			) {
				if (dist - char[j].w < record) {
					record = dist - char[j].w;
					k = j;
				}
			}
		}
	}
	if (record < 10000 && char[i].standingOn != k) {
		if (char[i].standingOn >= 0) fallOff(i);
		if (char[k].charState == 6 && !char[k].onob)
			char[k].vy = inter(char[k].vy, char[i].vy, char[i].weight2 / (char[k].weight2 + char[i].weight2));
		land(i, char[k].y - char[k].h, char[k].vy);
		if (char[k].onob) land2(i, char[k].y - char[k].h);
		char[i].standingOn = k;
		char[k].stoodOnBy.push(i);
		rippleWeight(i, char[i].weight2, 1);
		char[i].fricGoal = char[k].fricGoal;
		if (char[k].submerged == 1 && char[k].weight2 >= 0) {
			char[k].submerged = 2;
			char[k].weight2 -= 0.16;
		}
	}
}

function objectsLandOn(i) {
	for (let j = 0; j < charCount; j++) {
		if (char[j].charState >= 5 && char[j].standingOn != i) {
			let dist = Math.abs(char[i].x - char[j].x);
			if (
				dist < char[i].w + char[j].w &&
				char[i].y - char[i].h <= char[j].y &&
				char[i].py - char[i].h > char[j].py &&
				(char[i].submerged <= 1 || !char[j].onob || char[j].submerged == 2)
			) {
				if (char[j].standingOn >= 0) {
					fallOff(j);
				}
				char[j].standingOn = i;
				char[i].stoodOnBy.push(j);
				land(j, char[i].y - char[i].h, char[j].vy);
				if (char[i].charState == 6) {
					char[i].vy = inter(char[i].vy, char[j].vy, char[j].weight2 / (char[i].weight2 + char[j].weight2));
				}
				char[j].vy = char[i].vy;
				rippleWeight(j, char[j].weight2, 1);
				char[j].fricGoal = char[i].fricGoal;
			}
		}
	}
}

function fallOff(i) {
	if (char[i].standingOn >= 0) {
		let after = false;
		if (char[char[i].standingOn].submerged == 1) {
			char[char[i].standingOn].submerged = 2;
		} else {
			rippleWeight(i, char[i].weight2, -1);
		}
		let len = char[char[i].standingOn].stoodOnBy.length;
		for (let j = 0; j < len; j++) {
			if (char[char[i].standingOn].stoodOnBy[j] == i) {
				after = true;
			}
			if (after && j <= len - 2) {
				char[char[i].standingOn].stoodOnBy[j] = char[char[i].standingOn].stoodOnBy[j + 1];
			}
		}
		char[char[i].standingOn].stoodOnBy.pop();
		char[i].standingOn = -1;
		char[i].onob = false;
		for (let j = 0; j < char[i].stoodOnBy.length; j++) {
			fallOff(char[i].stoodOnBy[j]);
		}
	}
}

function aboveFallOff(i) {
	if (char[i].stoodOnBy.length >= 1) {
		for (let j = 0; j < char[i].stoodOnBy.length; j++) {
			fallOff(char[i].stoodOnBy[j]);
		}
	}
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
	let attempts = 0;
	while (char[control].charState != 10 && attempts < charCount) {
		control = (control + 1) % charCount;
		attempts++;
	}
	if (attempts == charCount) {
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
	}
}

function swapDepths(i, jdep) {
	charDepths[charDepths.indexOf(i)] = charDepths[jdep];
	charDepths[jdep] = i;
}

function nextDeadPerson(i, dire) {
	i2 = (i + dire + charCount) % charCount;
	while (char[i2].charState != 1) {
		i2 = (i2 + dire + charCount) % charCount;
	}
	return i2;
}

function numberOfDead() {
	let count = 0;
	for (let i = 0; i < charCount; i++) {
		if (char[i].charState == 1) {
			count++;
		}
	}
	return count;
}

function recoverCycle(i, dire) {
	let attempts = 0;
	let dire2 = dire;
	if (dire == 0) dire2 = 1;
	recover2 = (recover2 + dire2 + charCount) % charCount;
	while ((char[recover2].charState != 1 || char[recover2].pcharState <= 6) && attempts < charCount) {
		recover2 = (recover2 + dire2 + charCount) % charCount;
		attempts++;
	}
	if (attempts == charCount) {
		HPRCBubbleFrame = 4;
		hprcBubbleAnimationTimer = 0;
		recover = false;
		recover2 = 0;
	} else if (numberOfDead() == 1) {
		HPRCBubbleFrame = 2;
	} else {
		HPRCBubbleFrame = 3;
		hprcBubbleAnimationTimer = dire;
	}
}

function near(c1, c2) {
	let yDist = char[c2].y - 23 - (char[c1].y - char[c1].h2 / 2);
	return Math.abs(yDist) <= char[c2].h / 2 + char[c1].h2 / 2 && Math.abs(char[c1].x + xOff2(c1) - char[c2].x) < 50;
}

function near2(c1, c2) {
	let yDist = char[c2].y - 23 - (char[c1].y - char[c1].h2 / 2);
	return Math.abs(yDist) <= 20 && Math.abs(char[c1].x + xOff2(c1) - char[c2].x) < 50;
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

// linear interpolation
function inter(a, b, x) {
	return a + (b - a) * x;
}

function calcDist(i) {
	return Math.sqrt(
		Math.pow(char[i].x - locations[2] * 30 + 15, 2) +
			Math.pow(char[i].y - char[i].h / 2 - locations[3] * 30 + 15, 2)
	);
}

function outOfRange(x, y) {
	return x < 0 || y < 0 || x > levelWidth - 1 || y > levelHeight - 1;
}

function mouseOnGrid() {
	return (
		_xmouse - lcPan[0] > 330 - (scale * levelWidth) / 2 &&
		_xmouse - lcPan[0] < 330 + (scale * levelWidth) / 2 &&
		_ymouse - lcPan[1] > 240 - (scale * levelHeight) / 2 &&
		_ymouse - lcPan[1] < 240 + (scale * levelHeight) / 2 &&
		_xmouse < 660 && _ymouse < 480
	);
}

function resetLevelCreator() {
	// _root.attachMovie("levelCreator","levelCreator",0,{_x:0,_y:0});
	// levelCreator.createEmptyMovieClip("grid",100);
	// levelCreator.createEmptyMovieClip("tiles",98);
	// levelCreator.createEmptyMovieClip("rectSelect",99);
	lcCurrentSavedLevel = -1;
	lcChangesMade = false;
	levelAlreadySharedToExplore = false;
	lcPopUp = false;
	duplicateChar = false;
	reorderCharUp = false;
	reorderCharDown = false;
	reorderDiaUp = false;
	reorderDiaDown = false;
	menuScreen = 5;
	selectedTab = 5;
	selectedBg = 0;
	levelWidth = 32;
	tool = 0;
	levelHeight = 18;
	clearMyWholeLevel();
	myLevelNecessaryDeaths = 0;
	charDropdown = -1;
	charsTabScrollBar = 0;
	tileTabScrollBar = 0;
	diaTabScrollBar = 0;
	bgsTabScrollBar = 0;
	lcMessageTimer = 0;
	lcMessageText = '';
	// drawLCGrid();
	// fillTilesTab();
	charCount2 = 0;
	charCount = 0;
	myLevelDialogue = [[], [], []];
	myLevelInfo = {name: 'Untitled', desc: ''};
	// setEndGateLights();
	LCEndGateX = -1;
	LCEndGateY = -1;
	LCCoinX = -1;
	LCCoinY = -1;
	char = [];
	levelTimer = 0;

	// levelCreator.sideBar.tab1.gotoAndStop(1);
	// let i = 0;
	// while(i < 10)
	// {
	// 	levelCreator.tools["tool" + i].gotoAndStop(2);
	// 	i = i + 1;
	// }
	// levelCreator.tools.tool9.gotoAndStop(1);
	resetLCOSC();
	lcTextBoxes();

	lcSetZoom(0);
	lcPan = [0,0];
}

function loadSavedLevelIntoLevelCreator(locOnPage) {
	menuScreen = 5;
	resetLevelCreator();
	myLevelInfo.name = explorePageLevels[locOnPage].title;
	myLevelInfo.desc = explorePageLevels[locOnPage].description;
	lcTextBoxes();
	readLevelString(explorePageLevels[locOnPage].data);
	lcSetZoom(0);
	lcCurrentSavedLevel = explorePageLevels[locOnPage].id;
	lcChangesMade = false;
}

function resetLCOSC() {
	osc1.width = Math.floor(cwidth * pixelRatio);
	osc1.height = Math.floor(cheight * pixelRatio);
	osctx1.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	setLCBG();

	let bgpr = 2;
	let bgw = 96;
	let bgh = 54;
	let bgdist = 110;
	osc2.width = Math.floor(300 * pixelRatio);
	osc2.height = Math.floor(Math.floor(imgBgs.length / bgpr + 1) * bgdist * pixelRatio);
	osctx2.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	for (let i = 0; i < imgBgs.length; i++) {
		osctx2.drawImage(imgBgs[i],bgdist - bgw + (i % bgpr) * bgdist,bgdist - bgh + Math.floor(i / bgpr) * bgdist,bgw,bgh);
	}

	osc3.width = Math.floor(cwidth * pixelRatio);
	osc3.height = Math.floor(cheight * pixelRatio);
	osctx3.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

	osc5.width = Math.floor(660 * pixelRatio);
	osc5.height = Math.floor(480 * pixelRatio);
	osctx5.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	updateLCtiles();
}

function setLCBG() {
	osctx1.drawImage(imgBgs[selectedBg], -97, 0, 854, 480);
}

function drawLCGrid() {
	// scale = getLCGridScale();
	// levelCreator.grid.lineStyle(scale / 9,0,50);
	osctx5.lineWidth = scale / 9;
	osctx5.strokeStyle = '#000000';
	osctx5.globalAlpha = 0.5;
	osctx5.beginPath();
	for (let i = 0; i <= levelWidth; i++) {
		osctx5.moveTo(330 - (scale * levelWidth) / 2 + i * scale, 240 - (scale * levelHeight) / 2);
		osctx5.lineTo(330 - (scale * levelWidth) / 2 + i * scale, 240 + (scale * levelHeight) / 2);
	}
	for (let i = 0; i <= levelHeight; i++) {
		osctx5.moveTo(330 - (scale * levelWidth) / 2, 240 - (scale * levelHeight) / 2 + i * scale);
		osctx5.lineTo(330 + (scale * levelWidth) / 2, 240 - (scale * levelHeight) / 2 + i * scale);
	}
	osctx5.stroke();
	osctx5.globalAlpha = 1;
	// addLCTiles();
	// updateLCTiles();
}

function lcSetZoom(newValue) {
	lcZoom = newValue;
	if (lcZoom < lcZoomFactor) lcZoom = lcZoomFactor;
	scale = getLCScale();
	updateLCtiles();
}

function getLCScale() {
	return Math.min(640 / levelWidth, 460 / levelHeight) * (lcZoom/lcZoomFactor);
}

function drawLCTiles() {
	scale = getLCScale();
	osctx5.drawImage(osc3, -lcPan[0], -lcPan[1], cwidth, cheight);

	// animated tiles are drawn here.
	let tlx = 330 - (scale * levelWidth) / 2;
	let tly = 240 - (scale * levelHeight) / 2;
	for (let x = 0; x < levelWidth; x++) {
		for (let y = 0; y < levelHeight; y++) {
			let tile = myLevel[1][y][x];
			osctx5.globalAlpha = 1;
			let showTile = blockProperties[tile][16] > 1;
			if (tool == 5 && copied && mouseOnGrid()) {
				let mouseGridX = Math.floor((_xmouse - lcPan[0] - (330 - (scale * levelWidth) / 2)) / scale);
				let mouseGridY = Math.floor((_ymouse - lcPan[1] - (240 - (scale * levelHeight) / 2)) / scale);
				if (
					x >= mouseGridX &&
					x < mouseGridX + tileClipboard[0].length &&
					y >= mouseGridY &&
					y < mouseGridY + tileClipboard.length
				) {
					clipboardTileCandidate = tileClipboard[y - mouseGridY][x - mouseGridX];
					if (!(_keysDown[18] && tile != 0) && clipboardTileCandidate != 0) {
						tile = clipboardTileCandidate;
						osctx5.globalAlpha = 0.5;
						showTile = true;
					}
				}
			}
			// if (blockProperties[tile][11] > 0 && blockProperties[tile][11] < 13) {
			// 	ctx.save();
			// 	ctx.translate(tlx + (x+0.5) * scale, tly + (y+0.9333) * scale);
			// 	ctx.rotate(blockProperties[tile][11]<7?-1:1);
			// 	ctx.translate(-tlx - (x+0.5) * scale, -tly - (y+0.9333) * scale);
			// 	ctx.drawImage(svgLevers[(blockProperties[tile][11]-1)%6], tlx + x * scale, tly + y * scale, scale, scale);
			// 	ctx.restore();
			// }
			if (showTile) {
				let img =
					blockProperties[tile][16] > 1
						? svgTiles[tile][blockProperties[tile][17] ? _frameCount % blockProperties[tile][16] : 0]
						: svgTiles[tile];
				let vb =
					blockProperties[tile][16] > 1
						? svgTilesVB[tile][blockProperties[tile][17] ? _frameCount % blockProperties[tile][16] : 0]
						: svgTilesVB[tile];
				osctx5.drawImage(
					img,
					tlx + x * scale + (scale * vb[0]) / 30,
					tly + y * scale + (scale * vb[1]) / 30,
					(scale * vb[2]) / 30,
					(scale * vb[3]) / 30
				);
			}
			// else if (tile == 6) {
			// 	ctx.fillStyle = selectedBg==9||selectedBg==10?'#999999':'#505050';
			// 	ctx.fillRect(tlx + (x-1) * scale, tly + (y-3) * scale, scale*2, scale*4);
			// } else if (blockProperties[tile][15] && tile > 0) {
			// 	let img = svgTiles[tile];
			// 	let vb = svgTilesVB[tile];
			// 	ctx.drawImage(img, tlx + x * scale + scale * vb[0]/30, tly + y * scale + scale * vb[1]/30, scale * vb[2]/30, scale * vb[3]/30);
			// }
		}
	}
	// addLCTiles();
	// updateLCTiles();
}

function drawLCRect(x1, y1, x2, y2) {
	// levelCreator.rectSelect.lineStyle(1,0,0);
	// ctx.beginFill(16776960,50);
	osctx5.fillStyle = '#ffff00';
	osctx5.globalAlpha = 0.5;
	osctx5.moveTo(x1 * scale + (330 - (scale * levelWidth) / 2), y1 * scale + (240 - (scale * levelHeight) / 2));
	osctx5.lineTo((x2 + 1) * scale + (330 - (scale * levelWidth) / 2), y1 * scale + (240 - (scale * levelHeight) / 2));
	osctx5.lineTo(
		(x2 + 1) * scale + (330 - (scale * levelWidth) / 2),
		(y2 + 1) * scale + (240 - (scale * levelHeight) / 2)
	);
	osctx5.lineTo(x1 * scale + (330 - (scale * levelWidth) / 2), (y2 + 1) * scale + (240 - (scale * levelHeight) / 2));
	osctx5.lineTo(x1 * scale + (330 - (scale * levelWidth) / 2), y1 * scale + (240 - (scale * levelHeight) / 2));
	osctx5.fill();
	osctx5.globalAlpha = 1;
}

function clearMyWholeLevel() {
	myLevel = new Array(3);
	for (let i = 0; i < 3; i++) {
		clearMyLevel(i);
	}
	myLevelChars = [[], [], []];
}

function clearMyLevel(i) {
	myLevel[i] = new Array(levelHeight);
	for (let j = 0; j < levelHeight; j++) {
		myLevel[i][j] = new Array(levelWidth);
		for (let k = 0; k < levelWidth; k++) {
			myLevel[i][j][k] = 0;
		}
	}
}

function clearRectSelect() {
	LCRect = [-1, -1, -1, -1];
}

function fillTile(x, y, after, before) {
	if (after == before) return;
	let rc = [[x, y]];
	while (rc.length >= 1) {
		for (let i = 0; i < 4; i++) {
			if (
				!(
					(i == 3 && x == levelWidth - 1) ||
					(i == 2 && x == 0) ||
					(i == 1 && y == levelHeight - 1) ||
					(i == 0 && y == 0)
				)
			) {
				let x2 = rc[0][0] + cardinal[i][0];
				let y2 = rc[0][1] + cardinal[i][1];
				if (!outOfRange(x2, y2) && myLevel[1][y2][x2] == before) {
					rc.push([x2, y2]);
					myLevel[1][y2][x2] = after;
					// levelCreator.tiles["tileX" + x2 + "Y" + y2].gotoAndStop(after + 1);
				}
			}
		}
		rc.shift();
	}
	updateLCtiles();
}

function setUndo() {
	levelAlreadySharedToExplore = false;
	lcChangesMade = true;
	LCSwapLevelData(1, 0);
	undid = false;
	// levelCreator.tools.tool9.gotoAndStop(1);
}

function undo() {
	levelAlreadySharedToExplore = false;
	lcChangesMade = true;
	LCSwapLevelData(1, 2);
	LCSwapLevelData(0, 1);
	LCSwapLevelData(2, 0);
	// if(undid)
	// {
	// 	levelCreator.tools.tool9.gotoAndStop(1);
	// }
	// else
	// {
	// 	levelCreator.tools.tool9.gotoAndStop(2);
	// }
	undid = !undid;
	updateLCtiles();
	levelTimer = 0;
	char = new Array(myLevelChars[1].length);
	for (let i = 0; i < myLevelChars[1].length; i++) {
		char[i] = generateCharFromInfo(myLevelChars[1][i]);
	}
}

function copyRect() {
	if (copied) {
		copied = false;
	} else if (tool == 5 && LCRect[0] != -1) {
		let x1 = Math.min(LCRect[0], LCRect[2]);
		let y1 = Math.min(LCRect[1], LCRect[3]);
		let x2 = Math.max(LCRect[0], LCRect[2]);
		let y2 = Math.max(LCRect[1], LCRect[3]);
		tileClipboard = new Array(y2 - y1);
		for (let i = y1; i <= y2; i++) {
			tileClipboard[i - y1] = new Array(x2 - x1);
			for (let j = x1; j <= x2; j++) {
				tileClipboard[i - y1][j - x1] = myLevel[1][i][j];
			}
		}
		LCRect = [-1, -1, -1, -1];
		copied = true;
	}
}

function LCSwapLevelData(a, b) {
	myLevel[b] = new Array(myLevel[a].length);
	for (let y = 0; y < myLevel[a].length; y++) {
		myLevel[b][y] = new Array(myLevel[a][0].length);
		for (let x = 0; x < myLevel[a][0].length; x++) {
			myLevel[b][y][x] = myLevel[a][y][x];
			// if(b == 1)
			// {
			// 	levelCreator.tiles["tileX" + x + "Y" + y].gotoAndStop(myLevel[b][y][x] + 1);
			// }
		}
	}
	if (b == 1) {
		levelHeight = myLevel[b].length;
		levelWidth = myLevel[b][0].length;
	}

	myLevelChars[b] = new Array(myLevelChars[a].length);
	for (let y = 0; y < myLevelChars[a].length; y++) {
		myLevelChars[b][y] = cloneCharInfo(myLevelChars[a][y], false);
	}

	myLevelDialogue[b] = new Array(myLevelDialogue[a].length);
	for (let y = 0; y < myLevelDialogue[a].length; y++) {
		let obj = myLevelDialogue[a][y];
		myLevelDialogue[b][y] = {char: obj.char, face: obj.face, text: obj.text, linecount: obj.linecount};
	}
}

function mouseOnScreen() {
	return _xmouse < 660 && _ymouse < 480;
}

function setSelectedTile(i) {
	selectedTile = i;
	if (blockProperties[selectedTile][9] && (tool == 2 || tool == 3)) {
		tool = 1;
	}
	// let x = i % 5 * 60 + 30;
	// let y = Math.floor(i / 5) * 60 + 70;
	// levelCreator.sideBar.tab4.selector._x = x;
	// levelCreator.sideBar.tab4.selector._y = y;
}

function closeToEdgeY() {
	let y2 = ((_ymouse - (240 - (scale * levelHeight) / 2)) / scale) % 1;
	return Math.abs(y2 - 0.5) > 0.25;
}

function closeToEdgeX() {
	let x2 = ((_xmouse - (330 - (scale * levelWidth) / 2)) / scale) % 1;
	return Math.abs(x2 - 0.5) > 0.25;
}

function removeLCTiles() {
	console.log('removeLCTiles');
	// osctx3.clearRect(0, 0, osc3.width, osc3.height);
	// let y = 0;
	// while(y < levelHeight)
	// {
	// 	let x = 0;
	// 	while(x < levelWidth)
	// 	{
	// 		levelCreator.tiles["tileX" + x + "Y" + y].removeMovieClip();
	// 		x = x + 1;
	// 	}
	// 	y = y + 1;
	// }
}

function updateLCtiles() {
	// console.log('updateLCtiles');
	// scale = getLCGridScale();
	osctx3.clearRect(0, 0, osc3.width, osc3.height);
	// let y = 0;
	// while (y < levelHeight) {
	// 	let x = 0;
	// 	while (x < levelWidth) {
	// 		let tile = myLevel[1][y][x];
	// 		if (blockProperties[tile][16] == 1) {
	// 			//
	// 		}
	// 		// levelCreator.tiles["tileX" + x + "Y" + y].gotoAndStop(myLevel[1][y][x] + 1);
	// 		x = x + 1;
	// 	}
	// 	y = y + 1;
	// }

	let tintBlocks = [33, 34, 53, 54, 61, 62, 64, 82, 134];
	let tintBlockOneWay = [false, false, false, false, false, false, true, true, true];
	let tintColors = [
		'#ffcc00',
		'#d5aa00',
		'#0066ff',
		'#0051ca',
		'#20df20',
		'#1ab01a',
		'#20df20',
		'#ffcc00',
		'#0066ff'
	];

	let tlx = 330 - (scale * levelWidth) / 2 + lcPan[0];
	let tly = 240 - (scale * levelHeight) / 2 + lcPan[1];
	for (let x = 0; x < levelWidth; x++) {
		for (let y = 0; y < levelHeight; y++) {
			let tile = myLevel[1][y][x];
			if (blockProperties[tile][11] > 0 && blockProperties[tile][11] < 13) {
				osctx3.save();
				osctx3.translate(tlx + (x + 0.5) * scale, tly + (y + 0.9333) * scale);
				osctx3.rotate(blockProperties[tile][11] < 7 ? -1 : 1);
				osctx3.translate(-tlx - (x + 0.5) * scale, -tly - (y + 0.9333) * scale);
				osctx3.drawImage(
					svgLevers[(blockProperties[tile][11] - 1) % 6],
					tlx + x * scale,
					tly + y * scale,
					scale,
					scale
				);
				osctx3.restore();
			}

			if (blockProperties[tile][16] > 0) {
				if (blockProperties[tile][16] == 1) {
					let img =
						blockProperties[tile][16] > 1
							? svgTiles[tile][blockProperties[tile][17] ? _frameCount % blockProperties[tile][16] : 0]
							: svgTiles[tile];
					let vb =
						blockProperties[tile][16] > 1
							? svgTilesVB[tile][blockProperties[tile][17] ? _frameCount % blockProperties[tile][16] : 0]
							: svgTilesVB[tile];
					osctx3.drawImage(
						img,
						tlx + x * scale + (scale * vb[0]) / 30,
						tly + y * scale + (scale * vb[1]) / 30,
						(scale * vb[2]) / 30,
						(scale * vb[3]) / 30
					);
				}
			} else if (tile == 6) {
				osctx3.fillStyle = '#505050';
				osctx3.fillRect(tlx + (x - 1) * scale, tly + (y - 3) * scale, scale * 2, scale * 4);
			} else if (blockProperties[tile][15] && tile > 0) {
				let img = svgTiles[tile];
				let vb = svgTilesVB[tile];
				osctx3.drawImage(
					img,
					tlx + x * scale + (scale * vb[0]) / 30,
					tly + y * scale + (scale * vb[1]) / 30,
					(scale * vb[2]) / 30,
					(scale * vb[3]) / 30
				);
			}
			if (tintBlocks.indexOf(tile) != -1) {
				osctx3.globalAlpha = 0.25;
				let tintbBlockIndex = tintBlocks.indexOf(tile);
				osctx3.fillStyle = tintColors[tintbBlockIndex];
				osctx3.fillRect(
					tlx + x * scale,
					tly + y * scale,
					scale,
					tintBlockOneWay[tintbBlockIndex] ? scale / 3 : scale
				);
				osctx3.globalAlpha = 1;
			}
		}
	}
}

function setTool(i) {
	// levelCreator.tools["tool" + tool].gotoAndStop(2);
	if (tool == 2 || tool == 5) {
		clearRectSelect();
		if (tool == i && tool == 5) copied = false;
	}
	tool = i;
	// levelCreator.tools["tool" + tool].gotoAndStop(1);
}

function setEndGateLights() {
	// levelCreator.sideBar.tab4.tiles.tile6.light.gotoAndStop(charCount + 1);
	if (LCEndGateX >= 0) {
		// levelCreator.tiles["tileX" + LCEndGateX + "Y" + LCEndGateY].light.gotoAndStop(charCount + 1);
	}
}

function drawLCCharInfo(i, y) {
	ctx.fillStyle = '#626262';
	ctx.fillRect(665, y, 240, charInfoHeight);
	ctx.fillStyle = '#808080';
	ctx.fillRect(665, y, charInfoHeight, charInfoHeight);
	ctx.fillStyle = '#808080';
	ctx.fillRect(665 + 240 - charInfoHeight * 1.5, y, charInfoHeight * 1.5, charInfoHeight);
	let charimgmat = charModels[myLevelChars[1][i][0]].charimgmat;
	if (typeof charimgmat !== 'undefined') {
		let charimg = svgChars[myLevelChars[1][i][0]];
		if (Array.isArray(charimg)) charimg = charimg[0];
		let sc = charInfoHeight / 32;
		ctx.save();
		ctx.transform(
			charimgmat.a * sc,
			charimgmat.b,
			charimgmat.c,
			charimgmat.d * sc,
			(charimgmat.tx * sc) / 2 + 665 + charInfoHeight / 2,
			(charimgmat.ty * sc) / 2 + y + charInfoHeight / 2
		);
		ctx.drawImage(charimg, -charimg.width / (scaleFactor*2), -charimg.height / (scaleFactor*2), charimg.width / scaleFactor, charimg.height / scaleFactor);
		ctx.restore();
	}
	ctx.fillStyle = '#ffffff';
	ctx.fillText(
		twoDecimalPlaceNumFormat(Math.max(myLevelChars[1][i][1], 0)) +
			', ' +
			twoDecimalPlaceNumFormat(Math.max(myLevelChars[1][i][2], 0)),
		665 + charInfoHeight + 5,
		y + charInfoHeight / 2
	);
	ctx.fillText(
		charStateNamesShort[myLevelChars[1][i][3]],
		665 + 240 - charInfoHeight * 1.5 + 5,
		y + charInfoHeight / 2
	);

	if (myLevelChars[1][i][3] == 3 || myLevelChars[1][i][3] == 4) {
		ctx.fillStyle = '#808080';
		ctx.fillRect(665, y + charInfoHeight, charInfoHeight, diaInfoHeight);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(char[i].speed.toString().padStart(2, '0'), 665 + 5, y + charInfoHeight + diaInfoHeight * 0.5);
		let canDropDown =
			mouseOnTabWindow &&
			!lcPopUp &&
			charDropdown == -1 &&
			!duplicateChar &&
			!reorderCharUp &&
			!reorderCharDown &&
			!addButtonPressed;
		if (
			canDropDown &&
			onRect(_xmouse, _ymouse + charsTabScrollBar, 665, y + charInfoHeight, charInfoHeight, diaInfoHeight)
		) {
			onButton = true;
			hoverText = 'Movement Speed';
			if (mouseIsDown && !pmouseIsDown) {
				setUndo();
				charDropdown = -i - 3;
				charDropdownType = 3;
				valueAtClick = char[i].speed;
			}
		}

		let drawingDeleteButtons = myLevelChars[1][i][5].length > 1;

		for (let j = 0; j < myLevelChars[1][i][5].length; j++) {
			ctx.fillStyle = '#626262';
			ctx.fillRect(
				665 + charInfoHeight,
				y + charInfoHeight + diaInfoHeight * j,
				100 - charInfoHeight,
				diaInfoHeight
			);
			ctx.fillStyle = '#ffffff';
			ctx.fillText(
				direLetters[myLevelChars[1][i][5][j][0]],
				665 + charInfoHeight + 5,
				y + charInfoHeight + diaInfoHeight * (j + 0.5),
				240 - charInfoHeight,
				charInfoHeight
			);
			ctx.fillText(
				myLevelChars[1][i][5][j][1],
				665 + charInfoHeight * 1.5 + 5,
				y + charInfoHeight + diaInfoHeight * (j + 0.5),
				240 - charInfoHeight,
				charInfoHeight
			);

			if (canDropDown) {
				if (
					onRect(
						_xmouse,
						_ymouse + charsTabScrollBar,
						665 + charInfoHeight,
						y + charInfoHeight + diaInfoHeight * j,
						120 - charInfoHeight,
						diaInfoHeight
					)
				) {
					if (_xmouse < 665 + charInfoHeight * 1.5) {
						onButton = true;
						hoverText = 'Direction';
						if (mouseIsDown && !pmouseIsDown) {
							setUndo();
							charDropdown = -i - 3;
							charDropdownType = 4;
							charDropdownMS = j;
						}
					} else if (_xmouse < 665 + charInfoHeight + 100 - charInfoHeight) {
						onButton = true;
						hoverText = 'Block Count';
						if (mouseIsDown && !pmouseIsDown) {
							setUndo();
							charDropdown = -i - 3;
							charDropdownType = 5;
							charDropdownMS = j;
							valueAtClick = myLevelChars[1][i][5][j][1];
						}
					} else if (drawingDeleteButtons) {
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) {
							setUndo();
							myLevelChars[1][i][5].splice(j, 1);
							char[i].motionString = generateMS(myLevelChars[1][i]);
							levelTimer = 0;
							resetCharPositions();
						}
					}
					if (drawingDeleteButtons) {
						// ctx.fillStyle = '#ee3333';
						drawRemoveButton(
							665 + charInfoHeight + 100 - charInfoHeight,
							y + charInfoHeight + diaInfoHeight * j,
							diaInfoHeight,
							3
						);
						// ctx.fillRect(665 + charInfoHeight + 100-charInfoHeight, y + charInfoHeight + diaInfoHeight * j, diaInfoHeight, diaInfoHeight);
					}
				} else if (
					j > 0 &&
					onRect(
						_xmouse,
						_ymouse + charsTabScrollBar,
						665 + charInfoHeight + 120 - charInfoHeight,
						y + charInfoHeight + diaInfoHeight * (j - 0.5),
						diaInfoHeight,
						diaInfoHeight
					)
				) {
					drawAddButton(
						665 + charInfoHeight + 120 - charInfoHeight,
						y + charInfoHeight + diaInfoHeight * (j - 0.5),
						diaInfoHeight,
						3
					);
					onButton = true;
					hoverText = 'Insert Into Path';
					if (mouseIsDown && !pmouseIsDown) {
						setUndo();
						myLevelChars[1][i][5].splice(j, 0, [0, 1]);
						char[i].motionString = generateMS(myLevelChars[1][i]);
						levelTimer = 0;
						resetCharPositions();
					}
				}
				// Draw add button
				if (j == myLevelChars[1][i][5].length - 1) {
					// ctx.fillStyle = '#33ee33';
					drawAddButton(
						665 + 240 - charInfoHeight * 1.5,
						y + charInfoHeight + diaInfoHeight * j,
						diaInfoHeight,
						3
					);
					// ctx.fillRect((665+240)-charInfoHeight*1.5, y + charInfoHeight + diaInfoHeight * j, diaInfoHeight, diaInfoHeight);
					if (
						onRect(
							_xmouse,
							_ymouse + charsTabScrollBar,
							665 + 240 - charInfoHeight * 1.5,
							y + charInfoHeight + diaInfoHeight * j,
							diaInfoHeight,
							diaInfoHeight
						)
					) {
						onButton = true;
						hoverText = 'Add to Path';
						if (mouseIsDown && !pmouseIsDown) {
							setUndo();
							myLevelChars[1][i][5].push([0, 1]);
							char[i].motionString = generateMS(myLevelChars[1][i]);
							levelTimer = 0;
							resetCharPositions();
						}
					}
				}
			}
		}
	}

	if (
		mouseOnTabWindow &&
		!lcPopUp &&
		charDropdown == -1 &&
		!addButtonPressed &&
		onRect(_xmouse, _ymouse + charsTabScrollBar, 665, y, 260, charInfoHeight)
	) {
		if (duplicateChar) {
			if (mouseIsDown && !pmouseIsDown) {
				setUndo();
				char.splice(i + 1, 0, cloneChar(char[i]));
				myLevelChars[1].splice(i + 1, 0, cloneCharInfo(myLevelChars[1][i], true));
				// Update dialogue tab
				for (let j = myLevelDialogue[1].length - 1; j >= 0; j--) {
					if (myLevelDialogue[1][j].char < 50) {
						if (myLevelDialogue[1][j].char > i) {
							myLevelDialogue[1][j].char++;
						}
					}
				}
				duplicateChar = false;
			}
		} else if (reorderCharDown) {
			if (mouseIsDown && !pmouseIsDown) {
				if (i < myLevelChars[1].length - 1) {
					setUndo();
					[char[i], char[i + 1]] = [char[i + 1], char[i]];
					[myLevelChars[1][i], myLevelChars[1][i + 1]] = [myLevelChars[1][i + 1], myLevelChars[1][i]];
					// Update dialogue tab
					for (let j = myLevelDialogue[1].length - 1; j >= 0; j--) {
						if (myLevelDialogue[1][j].char < 50) {
							if (myLevelDialogue[1][j].char == i) {
								myLevelDialogue[1][j].char++;
							} else if (myLevelDialogue[1][j].char == i + 1) {
								myLevelDialogue[1][j].char--;
							}
						}
					}
				}
				reorderCharDown = false;
			}
		} else if (reorderCharUp) {
			if (mouseIsDown && !pmouseIsDown) {
				if (i > 0) {
					setUndo();
					[char[i], char[i - 1]] = [char[i - 1], char[i]];
					[myLevelChars[1][i], myLevelChars[1][i - 1]] = [myLevelChars[1][i - 1], myLevelChars[1][i]];
					// Update dialogue tab
					for (let j = myLevelDialogue[1].length - 1; j >= 0; j--) {
						if (myLevelDialogue[1][j].char < 50) {
							if (myLevelDialogue[1][j].char == i) {
								myLevelDialogue[1][j].char--;
							} else if (myLevelDialogue[1][j].char == i - 1) {
								myLevelDialogue[1][j].char++;
							}
						}
					}
				}
				reorderCharUp = false;
			}
		} else {
			ctx.fillStyle = '#ee3333';
			drawRemoveButton(665 + 240, y + charInfoHeight / 2 - 10, 20, 3);
			// ctx.fillRect(665+240, y + charInfoHeight/2 - 10, 20, 20);
			if (onRect(_xmouse, _ymouse + charsTabScrollBar, 665, y, charInfoHeight, charInfoHeight)) {
				onButton = true;
				hoverText = 'ID';
				if (mouseIsDown && !pmouseIsDown) {
					setUndo();
					charDropdown = -i - 3;
					charDropdownType = 0;
				}
			} else if (
				onRect(
					_xmouse,
					_ymouse + charsTabScrollBar,
					665 + 240 - charInfoHeight * 1.5,
					y,
					charInfoHeight * 1.5,
					charInfoHeight
				)
			) {
				onButton = true;
				hoverText = 'State';
				if (mouseIsDown && !pmouseIsDown) {
					charDropdown = -i - 3;
					charDropdownType = 1;
				}
			} else if (_xmouse < 665 + 240) {
				onButton = true;
				hoverText = 'Start Location';
				if (mouseIsDown && !pmouseIsDown) {
					setUndo();
					charDropdown = -i - 3;
					charDropdownType = 2;
				}
			} else if (onRect(_xmouse, _ymouse + charsTabScrollBar, 665 + 240, y + charInfoHeight / 2 - 10, 20, 20)) {
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) {
					setUndo();
					char.splice(i, 1);
					myLevelChars[1].splice(i, 1);
					// Update dialogue tab
					for (let j = myLevelDialogue[1].length - 1; j >= 0; j--) {
						if (myLevelDialogue[1][j].char < 50) {
							if (myLevelDialogue[1][j].char == i) {
								myLevelDialogue[1].splice(j, 1);
							} else if (myLevelDialogue[1][j].char > i) {
								myLevelDialogue[1][j].char--;
							}
						}
					}
				}
			}
		}
	}
	// if (charDropdown == i) {
	// 	if (mouseIsDown) {
	// 		charDropdown = -1;
	// 	}
	// }
}

function drawLCDiaInfo(i, y) {
	// ctx.fillStyle = '#626262';
	// ctx.fillRect(665, y, 240, diaInfoHeight*myLevelDialogue[1][i].linecount);
	ctx.fillStyle = '#808080';
	ctx.fillRect(665, y, diaInfoHeight * 3, diaInfoHeight * myLevelDialogue[1][i].linecount);
	ctx.fillStyle = '#ffffff';
	if (myLevelDialogue[1][i].char >= 50 && myLevelDialogue[1][i].char < 99) {
		var diaTextBox = [myLevelDialogue[1][i].text, ['lever switch']];
		switch (myLevelDialogue[1][i].char) {
			case 50:
				ctx.fillStyle = '#ffcc00';
				break;
			case 51:
				ctx.fillStyle = '#0066ff';
				break;
			case 52:
				ctx.fillStyle = '#20df20';
				break;
			case 53:
				ctx.fillStyle = '#ff0000';
				break;
			case 54:
				ctx.fillStyle = '#9933ff';
				break;
			case 55:
				ctx.fillStyle = '#505050';
				break;
		}
		ctx.fillRect(665 + diaInfoHeight * 3, y, 240 - diaInfoHeight * 3, diaInfoHeight);

		ctx.fillStyle = '#ffffff';
		ctx.font = diaInfoHeight + 'px Helvetica';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText('lever switch', 665 + diaInfoHeight * 3 + 5, y);
	} else {
		textBoxes[1][i].y = y;
		textBoxes[1][i].draw();
		var diaTextBox = [textBoxes[1][i].text, textBoxes[1][i].lines];
	}
	myLevelDialogue[1][i].text = diaTextBox[0];
	myLevelDialogue[1][i].linecount = diaTextBox[1].length;
	ctx.fillText(myLevelDialogue[1][i].face == 2 ? 'H' : 'S', 665 + diaInfoHeight * 2 + 5, y);
	ctx.fillText(myLevelDialogue[1][i].char.toString().padStart(2, '0'), 665 + 5, y);
	// ctx.fillText(charStateNamesShort[myLevelChars[1][i][3]], (665+240)-diaInfoHeight*1.5 + 5, y + diaInfoHeight/2);

	//myLevelDialogue[1][diaDropdown].face
	if (
		mouseOnTabWindow &&
		!lcPopUp &&
		diaDropdown == -1 &&
		!addButtonPressed &&
		onRect(_xmouse, _ymouse, 665, y, 260, diaInfoHeight * myLevelDialogue[1][i].linecount)
	) {
		if (reorderDiaDown) {
			if (mouseIsDown && !pmouseIsDown) {
				if (i < myLevelDialogue[1].length - 1) {
					setUndo();
					[myLevelDialogue[1][i], myLevelDialogue[1][i + 1]] = [
						myLevelDialogue[1][i + 1],
						myLevelDialogue[1][i]
					];
					generateDialogueTextBoxes();
				}
				reorderDiaDown = false;
				editingTextBox = false;
				deselectAllTextBoxes();
			}
		} else if (reorderDiaUp) {
			if (mouseIsDown && !pmouseIsDown) {
				if (i > 0) {
					setUndo();
					[myLevelDialogue[1][i], myLevelDialogue[1][i - 1]] = [
						myLevelDialogue[1][i - 1],
						myLevelDialogue[1][i]
					];
					generateDialogueTextBoxes();
				}
				reorderDiaUp = false;
				editingTextBox = false;
				deselectAllTextBoxes();
			}
		} else {
			ctx.fillStyle = '#ee3333';
			drawRemoveButton(665 + 240, y + (diaInfoHeight * myLevelDialogue[1][i].linecount) / 2 - 10, 20, 3);
			// ctx.fillRect(665+240, y + (diaInfoHeight*myLevelDialogue[1][i].linecount)/2 - 10, 20, 20);
			if (onRect(_xmouse,_ymouse,665,y,diaInfoHeight * 2,diaInfoHeight * myLevelDialogue[1][i].linecount)) {
				onButton = true;
				hoverText = 'Character';
				dialogueTabCharHover = [i,y];
				if (mouseIsDown && !pmouseIsDown) {
					diaDropdown = -i - 3;
					diaDropdownType = 1;
					editingTextBox = false;
					deselectAllTextBoxes();
				}
			} else if (onRect(_xmouse,_ymouse,665 + diaInfoHeight * 2,y,diaInfoHeight,diaInfoHeight * myLevelDialogue[1][i].linecount)) {
				onButton = true;
				hoverText = myLevelDialogue[1][i].face==2?'Happy':'Sad';
				if (mouseIsDown && !pmouseIsDown) {
					diaDropdown = -i - 3;
					diaDropdownType = 0;
					editingTextBox = false;
					deselectAllTextBoxes();
				}
			} else if (_xmouse < 665 + 240 && _xmouse > 665 + diaInfoHeight * 3) {
				if (mouseIsDown && !pmouseIsDown) {
					diaDropdown = -i - 3;
					diaDropdownType = 2;
				}
			} else if (onRect(_xmouse,_ymouse,665 + 240,y + (diaInfoHeight * myLevelDialogue[1][i].linecount) / 2 - 10,20,20)) {
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) {
					setUndo();
					myLevelDialogue[1].splice(i, 1);
					generateDialogueTextBoxes();
					editingTextBox = false;
					deselectAllTextBoxes();
				}
			}
		}
	}
}
function drawLCChars() {
	osctx5.save();
	let scale2 = scale / 30;
	osctx5.transform(scale2, 0, 0, scale2, 330 - (scale * levelWidth) / 2, 240 - (scale * levelHeight) / 2);
	for (let i = char.length - 1; i >= 0; i--) {
		if (char[i].placed || (charDropdown == i && charDropdownType == 2)) {
			if (!char[i].placed) osctx5.globalAlpha = 0.5;
			if (char[i].id < 35) {
				let model = charModels[char[i].id];
				let dire = char[i].charState == 9 ? -1 : 1;

				let legf = legFrames[0];
				let f = [legf.bodypart, legf.bodypart];
				osctx5.save();
				osctx5.transform(0.3648529052734375 * dire,0,0,0.3648529052734375,char[i].x + model.legx[0] + 0.35,char[i].y + model.legy[0] - 0.35);
				let leg1img = svgBodyParts[f[0]];
				osctx5.drawImage(leg1img, -leg1img.width / (scaleFactor*2), -leg1img.height / (scaleFactor*2), leg1img.width / scaleFactor, leg1img.height / scaleFactor);
				osctx5.restore();
				osctx5.save();
				osctx5.transform(0.3648529052734375 * dire,0,0,0.3648529052734375,char[i].x + model.legx[1] + 0.35,char[i].y + model.legy[1] - 0.35);
				let leg2img = svgBodyParts[f[1]];
				osctx5.drawImage(leg2img, -leg2img.width / (scaleFactor*2), -leg2img.height / (scaleFactor*2), leg2img.width / scaleFactor, leg2img.height / scaleFactor);
				osctx5.restore();

				let modelFrame = model.frames[dire == 1 ? 3 : 1];
				osctx5.save();
				osctx5.transform(
					charModels[char[i].id].torsomat.a,
					charModels[char[i].id].torsomat.b,
					charModels[char[i].id].torsomat.c,
					charModels[char[i].id].torsomat.d,
					char[i].x + charModels[char[i].id].torsomat.tx,
					char[i].y + charModels[char[i].id].torsomat.ty
				);
				for (let j = 0; j < modelFrame.length; j++) {
					let img = svgBodyParts[modelFrame[j].bodypart];
					if (modelFrame[j].type == 'body') img = svgChars[char[i].id];

					osctx5.save();
					osctx5.transform(
						modelFrame[j].mat.a,
						modelFrame[j].mat.b,
						modelFrame[j].mat.c,
						modelFrame[j].mat.d,
						modelFrame[j].mat.tx,
						modelFrame[j].mat.ty
					);
					if (modelFrame[j].type == 'anim') {
						img = svgBodyParts[bodyPartAnimations[modelFrame[j].anim].bodypart];
						let bpanimframe = modelFrame[j].loop
							? _frameCount % bodyPartAnimations[modelFrame[j].anim].frames.length
							: 0;
						let mat = bodyPartAnimations[modelFrame[j].anim].frames[bpanimframe];
						osctx5.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
					} else if (modelFrame[j].type == 'dia') {
						img =
							svgBodyParts[
								diaMouths[
									(char[i].charState == 9 ? 1 : char[i].dExpr) + charModels[char[i].id].mouthType * 2
								].frames[0].bodypart
							];
						let mat = diaMouths[model.defaultExpr].frames[0].mat;
						osctx5.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
					}
					osctx5.drawImage(img, -img.width / (scaleFactor*2), -img.height / (scaleFactor*2), img.width / scaleFactor, img.height / scaleFactor);
					osctx5.restore();
				}
				osctx5.restore();
			} else {
				if (charD[char[i].id][7] == 1) {
					var vb = svgCharsVB[char[i].id];
					var img = svgChars[char[i].id];
				} else {
					let f = _frameCount % charD[char[i].id][7];
					var vb = svgCharsVB[char[i].id][f];
					var img = svgChars[char[i].id][f];
				}
				osctx5.drawImage(img, char[i].x + vb[0], char[i].y + vb[1], vb[2], vb[3]);
			}
			osctx5.globalAlpha = 1;
		}
		if (char[i].placed && (char[i].charState == 3 || char[i].charState == 4)) {
			let section = Math.floor(levelTimer / char[i].speed) % (char[i].motionString.length - 2);
			char[i].vx = cardinal[char[i].motionString[section + 2]][0] * (30 / char[i].speed);
			char[i].vy = cardinal[char[i].motionString[section + 2]][1] * (30 / char[i].speed);
			char[i].px = char[i].x;
			char[i].py = char[i].y;
			char[i].charMove();
		}
	}
	osctx5.restore();
}

function resetLCChar(i) {
	if (myLevelChars[1][i][3] == 3 || myLevelChars[1][i][3] == 4) {
		if (char[i].motionString.length == 0) {
			while (myLevelChars[1][i].length < 6) {
				myLevelChars[1][i].push([]);
			}
			myLevelChars[1][i][4] = 10;
			myLevelChars[1][i][5] = [
				[3, 1],
				[2, 1]
			];
			char[i].speed = myLevelChars[1][i][4];
			char[i].motionString = generateMS(myLevelChars[1][i]);
		} else {
			myLevelChars[1][i][4] = char[i].speed;
			myLevelChars[1][i][5] = generateMSOtherFormatted(i);
		}
	} else {
		while (myLevelChars[1][i].length > 4) {
			myLevelChars[1][i].pop();
		}
	}
	let id = myLevelChars[1][i][0];
	char[i].id = id;
	char[i].x = char[i].px = +myLevelChars[1][i][1].toFixed(2) * 30;
	char[i].y = char[i].py = +myLevelChars[1][i][2].toFixed(2) * 30;
	// char[i].px = 70 + i * 40;
	// char[i].py = 400 - i * 30;
	char[i].charState = myLevelChars[1][i][3];
	char[i].w = charD[id][0];
	char[i].h = charD[id][1];
	char[i].weight = charD[id][2];
	char[i].weight2 = charD[id][2];
	char[i].h2 = charD[id][3];
	char[i].friction = charD[id][4];
	char[i].heatSpeed = charD[id][6];
	char[i].hasArms = charD[id][8];
	char[i].dExpr = id < 35 ? charModels[id].defaultExpr : 0;
}

function cloneChar(charObj) {
	let clone = new Character(
		charObj.id,
		0.0,
		0.0,
		0.0,
		0.0,
		charObj.charState,
		charObj.w,
		charObj.h,
		charObj.weight,
		charObj.weight2,
		charObj.h2,
		charObj.friction,
		charObj.heatSpeed,
		charObj.hasArms,
		charObj.dExpr
	);
	clone.placed = false;
	clone.speed = charObj.speed;
	clone.motionString = Object.values(charObj.motionString);
	return clone;
}

function cloneCharInfo(info, unplace) {
	let clone = [info[0], unplace ? -1 : info[1], unplace ? -1 : info[2], info[3]];
	if (info.length == 6) {
		clone.push(info[4]);
		clone.push([]);
		for (let i = 0; i < info[5].length; i++) {
			clone[5].push([info[5][i][0], info[5][i][1]]);
		}
	}
	return clone;
}

function generateCharFromInfo(info) {
	let id = info[0];
	let newChar = new Character(
		id,
		info[1] * 30,
		info[2] * 30,
		info[1] * 30,
		info[2] * 30,
		info[3],
		charD[id][0],
		charD[id][1],
		charD[id][2],
		charD[id][2],
		charD[id][3],
		charD[id][4],
		charD[id][6],
		charD[id][8],
		id < 35 ? charModels[id].defaultExpr : 0
	);
	if (info[1] == -1 || info[2] == -1) {
		newChar.placed = false;
	}
	if (info.length == 6) {
		newChar.speed = info[4];
		newChar.motionString = generateMS(info);
	}
	return newChar;
}

function copyLevelString() {
	copyText(generateLevelString());
}

function exploreCopyLink() {
	copyText('https://coppersalts.github.io/HTML5b/?' + (exploreLevelPageType===0?'level=':'levelpack=') + exploreLevelPageLevel.id);
}

function copyText(textIn) {
	// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
	const text = textIn;
	if (!browserCopySolution) {
		navigator.clipboard.writeText(text).then(
			function () {
				lcMessageTimer = 1;
				lcMessageText = 'Level string successfuly copied to clipboard!';
			},
			function (err) {
				lcMessageTimer = 1;
				lcMessageText = 'There was an error while copying the level string.';
				console.error('Could not copy text: ', err);
			}
		);
	} else if (copyButton) {
		// Handles copying on Safari
		const data = [new ClipboardItem({ 'text/plain': new Blob([text], { type: 'text/plain' }) })];
		navigator.clipboard.write(data).then(
			function () {
				lcMessageTimer = 1;
				lcMessageText = 'Level string successfuly copied to clipboard!';
			},
			function (err) {
				lcMessageTimer = 1;
				lcMessageText = 'There was an error while copying the level string.';
				console.error('Could not copy text: ', err);
			}
		);
	}
	copyButton = 0;
}

function generateLevelString() {
	longMode = false;
	for (let y = 0; y < levelHeight; y++) {
		for (let x = 0; x < levelWidth; x++) {
			if (myLevel[1][y][x] > 120) longMode = true;
		}
		lcLevelString += '\r\n';
	}

	var lcLevelString = '\r\n';
	lcLevelString += myLevelInfo.name == '' ? 'Untitled level' : myLevelInfo.name + '\r\n';
	lcLevelString +=
		levelWidth.toString().padStart(2, '0') +
		',' +
		levelHeight.toString().padStart(2, '0') +
		',' +
		char.length.toString().padStart(2, '0') +
		',' +
		selectedBg.toString().padStart(2, '0') +
		',' +
		(longMode ? 'H' : 'L') +
		'\r\n';
	if (longMode) {
		for (let y = 0; y < levelHeight; y++) {
			for (let x = 0; x < levelWidth; x++) {
				if (myLevel[1][y][x] > 120) {
					lcLevelString += '/';
				} else {
					lcLevelString += '.';
				}
				lcLevelString += tileCharFromID(myLevel[1][y][x]);
			}
			lcLevelString += '\r\n';
		}
	} else {
		for (let y = 0; y < levelHeight; y++) {
			for (let x = 0; x < levelWidth; x++) {
				lcLevelString += tileCharFromID(myLevel[1][y][x]);
			}
			lcLevelString += '\r\n';
		}
	}
	for (let i = 0; i < char.length; i++) {
		lcLevelString +=
			myLevelChars[1][i][0].toString().padStart(2, '0') +
			',' +
			twoDecimalPlaceNumFormat(myLevelChars[1][i][1]) +
			',' +
			twoDecimalPlaceNumFormat(myLevelChars[1][i][2]) +
			',' +
			myLevelChars[1][i][3].toString().padStart(2, '0');
		if (myLevelChars[1][i][3] == 3 || myLevelChars[1][i][3] == 4) {
			lcLevelString += ' ' + char[i].motionString.map(String).join('');
		}
		lcLevelString += '\r\n';
	}
	lcLevelString += myLevelDialogue[1].length.toString().padStart(2, '0') + '\r\n';
	for (let i = 0; i < myLevelDialogue[1].length; i++) {
		lcLevelString +=
			myLevelDialogue[1][i].char.toString().padStart(2, '0') +
			(myLevelDialogue[1][i].face == 2 ? 'H' : 'S') +
			' ' +
			myLevelDialogue[1][i].text +
			'\r\n';
	}
	lcLevelString += myLevelNecessaryDeaths.toString().padStart(6, '0') + '\r\n';

	return lcLevelString;
}

function openLevelLoader() {
	lcPopUpNextFrame = true;
	lcPopUpType = 0;
	levelLoadString = '';
	textBoxes[0][2].text = '';
}

function readLevelString(str) {
	setUndo();
	let lines = str.split('\r\n');
	if (lines.length == 1) lines = str.split('\n');
	let i = 0;

	// skip past any blank lines at the start
	while (i < lines.length && lines[i] == '') i++;
	if (i >= lines.length) return;
	myLevelInfo.name = lines[i];
	i++;
	if (i >= lines.length) return;

	// read level info
	let levelInfo = lines[i].split(',');
	if (levelInfo.length < 5) {
		setLCMessage('Error while loading from string:\nFewer than 5 comma separated values in the line below the title.');
		return;
	}
	levelWidth = Math.max(parseInt(levelInfo[0], 10), 1);
	levelHeight = Math.max(parseInt(levelInfo[1], 10), 1);
	charCount = parseInt(levelInfo[2], 10);
	selectedBg = parseInt(levelInfo[3], 10);
	if (selectedBg > imgBgs.length || isNaN(selectedBg)) selectedBg = 0;
	setLCBG();
	longMode = levelInfo[4] == 'H';
	i++;
	// If we're at the end of the lines, or any of these parseInts returned NaN; then stop here and reset some things.
	if (i >= lines.length || isNaN(levelWidth) || isNaN(levelHeight) || isNaN(charCount) || charCount > 50) {
		levelWidth = myLevel[1][0].length;
		levelHeight = myLevel[1].length;
		charCount = 0;
		myLevelChars[1].length = 0;
		char.length = 0;
		setLCMessage(
			'Error while loading from string:\n' +
				(i >= lines.length
					? 'no tile map was provided.'
					: "one or more values in the level's metadata was invalid.")
		);
		return;
	}
	myLevelChars[1] = new Array(charCount);
	char = new Array(charCount);

	// read block layout data
	myLevel[1] = new Array(levelHeight);
	if (longMode) {
		for (let y = 0; y < levelHeight; y++) {
			myLevel[1][y] = new Array(levelWidth);
			for (let x = 0; x < levelWidth; x++) {
				if (i + y >= lines.length || x * 2 + 1 >= lines[i + y].length) {
					myLevel[1][y][x] = 0;
				} else {
					myLevel[1][y][x] =
						111 * tileIDFromChar(lines[i + y].charCodeAt(x * 2)) +
						tileIDFromChar(lines[i + y].charCodeAt(x * 2 + 1));
					if (myLevel[1][y][x] > blockProperties.length || myLevel[1][y][x] < 0) myLevel[1][y][x] = 0;
				}
			}
		}
	} else {
		for (let y = 0; y < levelHeight; y++) {
			myLevel[1][y] = new Array(levelWidth);
			for (let x = 0; x < levelWidth; x++) {
				if (i + y >= lines.length || x >= lines[i + y].length) {
					myLevel[1][y][x] = 0;
				} else {
					myLevel[1][y][x] = tileIDFromChar(lines[i + y].charCodeAt(x));
					if (myLevel[1][y][x] > blockProperties.length || myLevel[1][y][x] < 0) myLevel[1][y][x] = 0;
				}
			}
		}
	}
	setCoinAndDoorPos();
	updateLCtiles();
	i += levelHeight;
	if (i >= lines.length) {
		charCount = 0;
		myLevelChars[1].length = 0;
		char.length = 0;
		setLCMessage('Error while loading from string:\nno entity data was provided.');
		return;
	}

	// read entity data
	levelTimer = 0;
	for (let e = 0; e < myLevelChars[1].length; e++) {
		if (i + e >= lines.length) {
			myLevelChars[1].length = e;
			char.length = e;
			setLCMessage('Error while loading from string:\nnumber of entities did not match the provided count.');
			return;
		}
		let entityInfo = lines[i + e].split(',').join(' ').split(' ');
		myLevelChars[1][e] = [0, -1.0, -1.0, 10];
		if (entityInfo.length > 3) {
			if (
				isNaN(parseInt(entityInfo[0], 10)) ||
				isNaN(parseFloat(entityInfo[1], 10)) ||
				isNaN(parseFloat(entityInfo[2], 10)) ||
				isNaN(parseInt(entityInfo[3], 10))
			) {
				myLevelChars[1].length = e;
				char.length = e;
				setLCMessage("Error while loading from string:\na data value in one entity's data parsed to NaN.");
				// myLevelChars[1][e] = [0,0.0,0.0,10];
				return;
			}
			myLevelChars[1][e][0] = Math.max(Math.min(parseInt(entityInfo[0], 10), charD.length), 0);
			myLevelChars[1][e][1] = parseFloat(entityInfo[1], 10);
			myLevelChars[1][e][2] = parseFloat(entityInfo[2], 10);
			myLevelChars[1][e][3] = Math.max(Math.min(parseInt(entityInfo[3], 10), 10), 3);
		}
		let id = myLevelChars[1][e][0];
		if (charD[id][7] < 1) id = id < 35 ? 8 : 37;
		char[e] = new Character(
			id,
			+myLevelChars[1][e][1].toFixed(2) * 30,
			+myLevelChars[1][e][2].toFixed(2) * 30,
			70 + e * 40,
			400 - e * 30,
			myLevelChars[1][e][3],
			charD[id][0],
			charD[id][1],
			charD[id][2],
			charD[id][2],
			charD[id][3],
			charD[id][4],
			charD[id][6],
			charD[id][8],
			id < 35 ? charModels[id].defaultExpr : 0
		);
		if (myLevelChars[1][e][1] < 0 || myLevelChars[1][e][2] < 0) char[e].placed = false;
		if (myLevelChars[1][e][3] == 3 || myLevelChars[1][e][3] == 4) {
			if (entityInfo.length == 5) {
				myLevelChars[1][e][4] = parseInt(entityInfo[4].slice(0, 2), 10);
				myLevelChars[1][e][5] = [];
				let d = entityInfo[4].charCodeAt(2) - 48;
				let btm = 1;
				for (let m = 2; m < entityInfo[4].length - 1; m++) {
					if (d != entityInfo[4].charCodeAt(m + 1) - 48) {
						myLevelChars[1][e][5].push([Math.min(Math.max(d, 0), 3), btm]);
						btm = 1;
						d = entityInfo[4].charCodeAt(m + 1) - 48;
					} else {
						btm++;
					}
				}
				myLevelChars[1][e][5].push([d, btm]);
				char[e].motionString = generateMS(myLevelChars[1][e]);
				char[e].speed = myLevelChars[1][e][4];
			} else {
				myLevelChars[1][e][3] = 6;
			}
		}
	}
	i += myLevelChars[1].length;
	if (i >= lines.length) {
		setLCMessage('Error while loading from string:\nnumber of dialogue lines was not provided.');
		return;
	}

	// read dialogue
	myLevelDialogue[1] = new Array(parseInt(lines[i], 10));
	i++;
	for (let d = 0; d < myLevelDialogue[1].length; d++) {
		if (i + d >= lines.length) {
			myLevelDialogue[1].length = d;
			setLCMessage(
				'Error while loading from string:\nnumber of dialogue lines did not match the provided count.'
			);
			return;
		}
		myLevelDialogue[1][d] = {char: 0, face: 2, text: ''};
		myLevelDialogue[1][d].char = parseInt(lines[i + d].slice(0, 2), 10);
		if (isNaN(myLevelDialogue[1][d].char)) myLevelDialogue[1][d].char = 99;
		myLevelDialogue[1][d].face = lines[i + d].charAt(2) == 'S' ? 3 : 2;
		myLevelDialogue[1][d].text = lines[i + d].substring(4);
	}
	i += myLevelDialogue[1].length;
	generateDialogueTextBoxes();
	if (i >= lines.length) {
		setLCMessage(
			"Error while loading from string:\nnecessary deaths was not provided.\n(but everything else loaded so it's probably fine)"
		);
		return;
	}

	myLevelNecessaryDeaths = parseInt(lines[i], 10);
}

function readExploreLevelString(str) {
	myLevelChars = new Array(3);
	myLevel = new Array(3);
	myLevelDialogue = new Array(3);
	myLevelInfo = {name: 'Untitled'};

	let lines = str.split('\r\n');
	if (lines.length == 1) lines = str.split('\n');
	let i = 0;

	// skip past any blank lines at the start
	while (i < lines.length && (lines[i] == '' || lines[i] == 'loadedLevels=')) i++;
	if (i >= lines.length) return;
	myLevelInfo.name = lines[i];
	i++;
	if (i >= lines.length) return;

	// read level info
	let levelInfo = lines[i].split(',');
	if (levelInfo.length != 5) return;
	levelWidth = Math.max(parseInt(levelInfo[0], 10), 1);
	levelHeight = Math.max(parseInt(levelInfo[1], 10), 1);
	charCount = parseInt(levelInfo[2], 10);
	selectedBg = parseInt(levelInfo[3], 10);
	if (selectedBg > imgBgs.length || isNaN(selectedBg)) selectedBg = 0;
	// setLCBG();
	longMode = levelInfo[4] == 'H';
	i++;
	// If we're at the end of the lines, or any of these parseInts returned NaN; then stop here and reset some things.
	if (i >= lines.length || isNaN(levelWidth) || isNaN(levelHeight) || isNaN(charCount) || charCount > 50) {
		levelWidth = myLevel[1][0].length;
		levelHeight = myLevel[1].length;
		charCount = 0;
		myLevelChars[1].length = 0;
		char.length = 0;
		// setLCMessage('Error while loading from string:\n' + (i>=lines.length?'no tile map was provided.':'one or more values in the level\'s metadata was invalid.'));
		return;
	}
	myLevelChars[1] = new Array(charCount);
	char = new Array(charCount);

	// read block layout data
	myLevel[1] = new Array(levelHeight);
	if (longMode) {
		for (let y = 0; y < levelHeight; y++) {
			myLevel[1][y] = new Array(levelWidth);
			for (let x = 0; x < levelWidth; x++) {
				if (i + y >= lines.length || x * 2 + 1 >= lines[i + y].length) {
					myLevel[1][y][x] = 0;
				} else {
					myLevel[1][y][x] =
						111 * tileIDFromChar(lines[i + y].charCodeAt(x * 2)) +
						tileIDFromChar(lines[i + y].charCodeAt(x * 2 + 1));
					if (myLevel[1][y][x] > blockProperties.length || myLevel[1][y][x] < 0) myLevel[1][y][x] = 0;
				}
			}
		}
	} else {
		for (let y = 0; y < levelHeight; y++) {
			myLevel[1][y] = new Array(levelWidth);
			for (let x = 0; x < levelWidth; x++) {
				if (i + y >= lines.length || x >= lines[i + y].length) {
					myLevel[1][y][x] = 0;
				} else {
					myLevel[1][y][x] = tileIDFromChar(lines[i + y].charCodeAt(x));
					if (myLevel[1][y][x] > blockProperties.length || myLevel[1][y][x] < 0) myLevel[1][y][x] = 0;
				}
			}
		}
	}
	// setCoinAndDoorPos();
	// updateLCtiles();
	i += levelHeight;
	if (i >= lines.length) {
		charCount = 0;
		myLevelChars[1].length = 0;
		char.length = 0;
		// setLCMessage('Error while loading from string:\nno entity data was provided.');
		return;
	}

	// read entity data
	levelTimer = 0;
	for (let e = 0; e < myLevelChars[1].length; e++) {
		if (i + e >= lines.length) {
			myLevelChars[1].length = e;
			char.length = e;
			// setLCMessage('Error while loading from string:\nnumber of entities did not match the provided count.');
			return;
		}
		let entityInfo = lines[i + e].split(',').join(' ').split(' ');
		myLevelChars[1][e] = [0, -1.0, -1.0, 10];
		if (entityInfo.length > 3) {
			if (
				isNaN(parseInt(entityInfo[0], 10)) ||
				isNaN(parseFloat(entityInfo[1], 10)) ||
				isNaN(parseFloat(entityInfo[2], 10)) ||
				isNaN(parseInt(entityInfo[3], 10))
			) {
				myLevelChars[1].length = e;
				char.length = e;
				// setLCMessage('Error while loading from string:\na data value in one entity\'s data parsed to NaN.');
				// myLevelChars[1][e] = [0,0.0,0.0,10];
				return;
			}
			myLevelChars[1][e][0] = Math.max(Math.min(parseInt(entityInfo[0], 10), charD.length), 0);
			myLevelChars[1][e][1] = parseFloat(entityInfo[1], 10);
			myLevelChars[1][e][2] = parseFloat(entityInfo[2], 10);
			myLevelChars[1][e][3] = Math.max(Math.min(parseInt(entityInfo[3], 10), 10), 3);
		}
		let id = myLevelChars[1][e][0];
		if (charD[id][7] < 1) id = id < 35 ? 8 : 37;
		char[e] = new Character(
			id,
			+myLevelChars[1][e][1].toFixed(2) * 30,
			+myLevelChars[1][e][2].toFixed(2) * 30,
			70 + e * 40,
			400 - e * 30,
			myLevelChars[1][e][3],
			charD[id][0],
			charD[id][1],
			charD[id][2],
			charD[id][2],
			charD[id][3],
			charD[id][4],
			charD[id][6],
			charD[id][8],
			id < 35 ? charModels[id].defaultExpr : 0
		);
		if (myLevelChars[1][e][1] < 0 || myLevelChars[1][e][2] < 0) char[e].placed = false;
		if (myLevelChars[1][e][3] == 3 || myLevelChars[1][e][3] == 4) {
			if (entityInfo.length == 5) {
				myLevelChars[1][e][4] = parseInt(entityInfo[4].slice(0, 2), 10);
				myLevelChars[1][e][5] = [];
				let d = entityInfo[4].charCodeAt(2) - 48;
				let btm = 1;
				for (let m = 2; m < entityInfo[4].length - 1; m++) {
					if (d != entityInfo[4].charCodeAt(m + 1) - 48) {
						myLevelChars[1][e][5].push([Math.min(Math.max(d, 0), 3), btm]);
						btm = 1;
						d = entityInfo[4].charCodeAt(m + 1) - 48;
					} else {
						btm++;
					}
				}
				myLevelChars[1][e][5].push([d, btm]);
				char[e].motionString = generateMS(myLevelChars[1][e]);
				char[e].speed = myLevelChars[1][e][4];
			} else {
				myLevelChars[1][e][3] = 6;
			}
		}
	}
	i += myLevelChars[1].length;
	if (i >= lines.length) {
		// setLCMessage('Error while loading from string:\nnumber of dialogue lines was not provided.');
		return;
	}

	// read dialogue
	myLevelDialogue[1] = new Array(parseInt(lines[i], 10));
	i++;
	for (let d = 0; d < myLevelDialogue[1].length; d++) {
		if (i + d >= lines.length) {
			myLevelDialogue[1].length = d;
			// setLCMessage('Error while loading from string:\nnumber of dialogue lines did not match the provided count.');
			return;
		}
		myLevelDialogue[1][d] = {char: 0, face: 2, text: ''};
		myLevelDialogue[1][d].char = parseInt(lines[i + d].slice(0, 2), 10);
		if (isNaN(myLevelDialogue[1][d].char)) myLevelDialogue[1][d].char = 99;
		myLevelDialogue[1][d].face = lines[i + d].charAt(2) == 'S' ? 3 : 2;
		myLevelDialogue[1][d].text = lines[i + d].substring(4);
	}
	i += myLevelDialogue[1].length;
	if (i >= lines.length) {
		// setLCMessage('Error while loading from string:\nnecessary deaths was not provided.\n(but everything else loaded so it\'s probably fine)');
		return;
	}

	myLevelNecessaryDeaths = parseInt(lines[i], 10);
}

function setLCMessage(text) {
	lcMessageTimer = 1;
	lcMessageText = text;
	console.log(text);
}

function tileCharFromID(id) {
	let tileCharCode;
	if (id == 93) tileCharCode = 8364;
	else if (id <= 80) tileCharCode = id + 46;
	else if (id <= 102) tileCharCode = id + 80;
	else tileCharCode = id + 81;
	if (id > 120) tileCharCode -= 146;
	return String.fromCharCode(tileCharCode);
}

function tileIDFromChar(c) {
	if (c == 8364) return 93;
	if (c <= 126) return c - 46;
	if (c <= 182) return c - 80;
	return c - 81;
}

function twoDecimalPlaceNumFormat(num) {
	return (Math.round(num * 100) / 100).toFixed(2).padStart(5, '0');
}

function generateMS(info) {
	let out = [];
	out.push(Math.floor(info[4] / 10));
	out.push(info[4] % 10);
	let a = info[5];
	for (let i = 0; i < a.length; i++) {
		for (let j = 0; j < a[i][1]; j++) {
			out.push(a[i][0]);
		}
	}
	return out;
}

function generateMSOtherFormatted(c) {
	let out = [];
	let d = char[c].motionString[2];
	let btm = 1;
	for (let m = 2; m < char[c].motionString.length - 1; m++) {
		if (d != char[c].motionString[m + 1]) {
			out.push([d, btm]);
			btm = 1;
			d = char[c].motionString[m + 1];
		} else {
			btm++;
		}
	}
	out.push([d, btm]);
	return out;
}

function resetCharPositions() {
	for (let i = 0; i < myLevelChars[1].length; i++) {
		char[i].x = myLevelChars[1][i][1] * 30;
		char[i].y = myLevelChars[1][i][2] * 30;
	}
}

function setCoinAndDoorPos() {
	LCEndGateX = LCEndGateY = LCCoinX = LCCoinY = -1;
	for (let i = 0; i < myLevel[1].length; i++) {
		for (let j = 0; j < myLevel[1][i].length; j++) {
			if (myLevel[1][i][j] == 6) {
				if (LCEndGateX == -1 && LCEndGateY == -1) {
					LCEndGateX = j;
					LCEndGateY = i;
				} else {
					myLevel[1][i][j] = 0;
				}
			}
			if (myLevel[1][i][j] == 12) {
				if (LCCoinX == -1 && LCCoinY == -1) {
					LCCoinX = j;
					LCCoinY = i;
				} else {
					myLevel[1][i][j] = 0;
				}
			}
		}
	}
}

function drawAddButton(x, y, s, p) {
	ctx.strokeStyle = '#606060';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.beginPath();
	ctx.moveTo(x + s / 2, y);
	ctx.lineTo(x + s / 2, y + s);
	ctx.moveTo(x, y + s / 2);
	ctx.lineTo(x + s, y + s / 2);
	ctx.stroke();
}

function drawDuplicateButton(x, y, s, p) {
	ctx.strokeStyle = '#606060';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.strokeRect(x + s / 3, y + s / 3, (s * 2) / 3, (s * 2) / 3);
	ctx.beginPath();
	ctx.moveTo(x + s / 3, y + (s * 2) / 3);
	ctx.lineTo(x, y + (s * 2) / 3);
	ctx.lineTo(x, y);
	ctx.lineTo(x + (s * 2) / 3, y);
	ctx.lineTo(x + (s * 2) / 3, y + s / 3);
	ctx.stroke();
}

function drawUpButton(x, y, s, p) {
	ctx.strokeStyle = '#606060';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.beginPath();
	ctx.moveTo(x + s / 2, y + s);
	ctx.lineTo(x + s / 2, y);
	ctx.moveTo(x, y + s / 2);
	ctx.lineTo(x + s / 2, y);
	ctx.lineTo(x + s, y + s / 2);
	ctx.stroke();
}

function drawDownButton(x, y, s, p) {
	ctx.strokeStyle = '#606060';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.beginPath();
	ctx.moveTo(x + s / 2, y);
	ctx.lineTo(x + s / 2, y + s);
	ctx.moveTo(x, y + s / 2);
	ctx.lineTo(x + s / 2, y + s);
	ctx.lineTo(x + s, y + s / 2);
	ctx.stroke();
}

function drawMinusButton(x, y, s, p) {
	ctx.strokeStyle = '#606060';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.beginPath();
	ctx.moveTo(x, y + s / 2);
	ctx.lineTo(x + s, y + s / 2);
	ctx.stroke();
}

function drawRemoveButton(x, y, s, p) {
	ctx.strokeStyle = '#ee3333';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + s, y + s);
	ctx.moveTo(x + s, y);
	ctx.lineTo(x, y + s);
	ctx.stroke();
}

function truncateLevelTitles(arr, offset) {
	ctx.font = '20px Helvetica';
	for (let i = 0; i < arr.length; i++)
		exploreLevelTitlesTruncated[i+offset] = fitString(ctx, arr[i].title, 195.3);
}

function drawExploreLevel(x, y, i, levelType, pageType) {
	// page types:
	// 0 - main explore page
	// 1 - explore user page
	// 2 - local saved levels page
	let thisExploreLevel = (pageType==1)?exploreUserPageLevels[levelType][i - levelType*4]:explorePageLevels[i];
	if (onRect(_xmouse, _ymouse, x, y, 208, 155) && !lcPopUp) {
		onButton = true;
		if (pageType == 2 && deletingMyLevels || pageType == 3 && levelpackCreatorRemovingLevels) ctx.fillStyle = '#800000';
		else ctx.fillStyle = '#404040';
		if (mousePressedLastFrame && onRect(lastClickX, lastClickY, x, y, 208, 155)) {
			if (pageType == 2) {
				if (levelpackAddScreen) addLevelToLevelpack(explorePageLevels[i].id);
				else if (deletingMyLevels) openLevelDeletePopUp(i);
				else {
					if (levelType == 0) loadSavedLevelIntoLevelCreator(i);
					else openMyLevelpack(explorePageLevels[i].id);
				}
			} else if (pageType == 3) {
				if (levelpackCreatorRemovingLevels) removeLevelpackLevel(i);
				else loadSavedLevelIntoLevelCreator(i);
			} else gotoExploreLevelPage(i);
		}
	} else {
		ctx.fillStyle = '#333333';
	}

	ctx.fillRect(x, y, 208, 155);
	// ctx.fillStyle = '#cccccc';
	// ctx.fillRect(x+8, y+8, 192, 108);
	if (levelType == 0) ctx.drawImage(thumbs[i], x + 8, y + 8, 192, 108);

	ctx.fillStyle = '#ffffff';
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.font = '20px Helvetica';
	ctx.fillText(exploreLevelTitlesTruncated[i], x + 6.35, y + 119.4);
	// ctx.fillText(fitString(ctx, explorePageLevels[i].title, 195.3), x+6.35, y+119.4);
	// fitString(ctx, explorePageLevels[i].title, 142.3);

	if (pageType < 2) {
		ctx.fillStyle = '#999999';
		ctx.font = '10px Helvetica';
		ctx.fillText('by ' + thisExploreLevel.creator.username, x + 7, y + 138.3);


		// Views icon & counter
		ctx.fillStyle = '#47cb46';
		ctx.beginPath();
		ctx.moveTo(x + 194, y + 137.3);
		ctx.lineTo(x + 189, y + 146.3);
		ctx.lineTo(x + 199, y + 146.3);
		ctx.closePath();
		ctx.fill();

		ctx.textAlign = "right";
		ctx.fillText(thisExploreLevel.plays, x + 186, y + 138.3);
		ctx.textAlign = "left";
	}

	// explorePageLevels[i]
}

function setExplorePage(page) {
	explorePage = page;
	exploreLevelTitlesTruncated = new Array(8); // Is this needed?
	if (exploreTab == 2) getSearchPage(exploreSearchInput, 0);
	else getExplorePage(explorePage, exploreTab, exploreSort);
	// setExploreThumbs();
}

function setMyLevelsPage(page) {
	myLevelsPage = page;
	let keys = Object.keys(myLevelsTab==0?lcSavedLevels:lcSavedLevelpacks);
	let offset = myLevelsPage*8;
	myLevelsPageCount = Math.ceil(keys.length / 8.0);
	if (myLevelsPage >= myLevelsPageCount) myLevelsPage = myLevelsPageCount - 1;
	explorePageLevels = [];
	for (let i = 0; i + offset < keys.length && i < 8; i++) {
		let key = keys[i + offset];
		explorePageLevels.push(myLevelsTab===0?lcSavedLevels[key]:lcSavedLevelpacks[key]);
	}
	truncateLevelTitles(explorePageLevels, 0);
	if (myLevelsTab === 0) setExploreThumbs();
}

function setLevelpackCreatorPage(page) {
	levelpackCreatorPage = page;
	let thisLevelpackLevels = lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].levels;
	let offset = levelpackCreatorPage*8;
	levelpackCreatorPageCount = Math.ceil(thisLevelpackLevels.length / 8.0);
	explorePageLevels = [];
	if (levelpackCreatorPage >= levelpackCreatorPageCount) levelpackCreatorPage = levelpackCreatorPageCount - 1;
	for (let i = 0; i + offset < thisLevelpackLevels.length && i < 8; i++) {
		explorePageLevels.push(lcSavedLevels['l' + thisLevelpackLevels[i + offset]]);
	}
	truncateLevelTitles(explorePageLevels, 0);
	setExploreThumbs();
}

function setExploreThumbs() {
	for (let i = 0; i < explorePageLevels.length; i++) {
		drawExploreThumb(thumbsctx[i], thumbs[i].width, explorePageLevels[i].data, 0.2);
	}
}

function setExploreThumbsUserPage(t) {
	for (let i = 0; i < exploreUserPageLevels[t].length; i++) {
		drawExploreThumb(thumbsctx[i+t*4], thumbs[i+t*4].width, exploreUserPageLevels[t][i].data, 0.2);
	}
}

function drawExploreThumb(context, size, data, scale) {
	try {
		if (!enableExperimentalFeatures) {
			// size is the width
			if (exploreTab == 1 && menuScreen == 6) return;
			context.clearRect(0, 0, (size * pixelRatio) / scale, (size * 0.5625 * pixelRatio) / scale);

			let lines = data.split('\r\n');
			if (lines.length == 1) lines = data.split('\n');
			// skip past any blank lines at the start
			let j = 0;
			while (j < lines.length && (lines[j] == '' || lines[j] == 'loadedLevels=')) j++;
			lines = lines.splice(j);
			let thumbLevelHead = lines[1].split(',');
			let thumbLevelW = parseInt(thumbLevelHead[0]);
			let thumbLevelH = parseInt(thumbLevelHead[1]);
			context.drawImage(imgBgs[parseInt(thumbLevelHead[3])], 0, 0, cwidth, cheight);

			if (thumbLevelHead[4] == 'H') {
				for (let y = 0; y < Math.min(thumbLevelH, 18); y++) {
					for (let x = 0; x < Math.min(thumbLevelW, 32); x++) {
						exploreDrawThumbTile(context, x, y, 111 * tileIDFromChar(lines[y + 2].charCodeAt(x * 2)) + tileIDFromChar(lines[y + 2].charCodeAt(x * 2 + 1)));
					}
				}
			} else {
				for (let y = 0; y < Math.min(thumbLevelH, 18); y++) {
					for (let x = 0; x < Math.min(thumbLevelW, 32); x++) {
						exploreDrawThumbTile(context, x, y, tileIDFromChar(lines[y + 2].charCodeAt(x)));
					}
				}
			}
		} else {
			let thispmenuScreen = menuScreen; // terrible variable name
			readExploreLevelString(data);
			testLevelCreator();
			// Reset a few things that were set by testLevelCreator() that we don't want.
			menuScreen = thispmenuScreen;
			wipeTimer = 0;
			context.drawImage(imgBgs[selectedBg], 0, 0, cwidth, cheight);
			setCamera();
			context.save();
			context.translate(-cameraX, -cameraY);
			drawLevel(context);
			context.restore();
		}
	} catch(e) {
		console.warn(e);
	}
}

function exploreDrawThumbTile(context, x, y, tile) {
	if (blockProperties[tile][16] > 0) {
		if (blockProperties[tile][16] == 1) {
			if (
				blockProperties[tile][11] > 0 &&
				typeof svgLevers[(blockProperties[tile][11] - 1) % 6] !== 'undefined'
			) {
				context.save();
				context.translate(x * 30 + 15, y * 30 + 28);
				context.rotate((Math.ceil(blockProperties[tile][11] / 6) == 1 ? -60 : 60) * (Math.PI / 180));
				context.translate(-x * 30 - 15, -y * 30 - 28);
				context.drawImage(svgLevers[(blockProperties[tile][11] - 1) % 6], x * 30, y * 30, svgLevers[0].width / scaleFactor, svgLevers[0].height / scaleFactor);
				context.restore();
			}
			context.drawImage(svgTiles[tile], x * 30 + svgTilesVB[tile][0], y * 30 + svgTilesVB[tile][1], svgTilesVB[tile][2], svgTilesVB[tile][3]);
		} else if (blockProperties[tile][16] > 1) {
			context.drawImage(svgTiles[tile][0], x * 30 + svgTilesVB[tile][0][0], y * 30 + svgTilesVB[tile][0][1], svgTilesVB[tile][0][2], svgTilesVB[tile][0][3]);
		}
	} else if (tile == 6) {
		// Door
		// let bgid = playMode==2?selectedBg:bgs[currentLevel];
		// context.fillStyle = bgid==9||bgid==10?'#999999':'#505050';
		context.fillStyle = '#505050';
		context.fillRect((x - 1) * 30, (y - 3) * 30, 60, 120);
		// for (let i = 0; i < charCount2; i++) {
		// 	context.fillStyle = 'rgb(' + mapRange(doorLightFade[i], 0, 1, 40, 0) + ',' + mapRange(doorLightFade[i], 0, 1, 40, 255) + ',' + mapRange(doorLightFade[i], 0, 1, 40, 0) + ')';
		// 	context.fillRect((x-1)*30+doorLightX[Math.floor(i/6)==Math.floor((charCount2-1)/6)?(charCount2-1)%6:5][i%6], y*30-80 + Math.floor(i/6)*10, 5, 5);
		// 	if (doorLightFadeDire[i] != 0) {
		// 		doorLightFade[i] = Math.max(Math.min(doorLightFade[i]+doorLightFadeDire[i]*0.0625, 1), 0);
		// 		if (doorLightFade[i] == 1 || doorLightFade[i] == 0) doorLightFadeDire[i] = 0;
		// 	}
		// }
	}
}

function drawExploreLoadingText() {
	ctx.font = 'bold 35px Helvetica';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('loading...', cwidth / 2, cheight / 2);
}

function drawArrow(x, y, w, h, dir) {
	ctx.beginPath();
	ctx.moveTo(x + w * (dir == 1 ? 1 : dir == 3 ? 0 : 0.5), y + h * (dir == 2 ? 1 : dir == 0 ? 0 : 0.5));
	ctx.lineTo(x + w * (dir != 1), y + h * (dir != 2));
	ctx.lineTo(x + w * (dir == 3), y + h * (dir == 0));
	ctx.fill();
}

function shareToExplore() {
	if (loggedInExploreUser5beamID !== -1) {
		logInExplore();
	} else {
	postExploreLevelOrPack(myLevelInfo.name, myLevelInfo.desc, generateLevelString(), false);
	}
}

function sharePackToExplore() {
	if (loggedInExploreUser5beamID !== -1) {
		logInExplore();
	} else {
		if (loggedInExploreUser5beamID !== -1) {
			logInExplore();
		} else {
			postExploreLevelOrPack(lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].title, lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].description, getCurrentLevelpackString(), true);
		}
	}
}

function editExploreLevel() {
	// /modify/level
	if (editingExploreLevel) {
		editingExploreLevel = false;
		exploreLevelPageLevel.description = textBoxes[0][1].text;
		exploreLevelPageLevel.title = textBoxes[0][2].text;

		postExploreModifyLevel(exploreLevelPageLevel.id, exploreLevelPageLevel.title, exploreLevelPageLevel.description, exploreLevelPageLevel.difficulty, (exploreLevelPageLevel.data == exploreOldLevelData.data)?'':exploreLevelPageLevel.data);
	} else {
		exploreOldLevelData = {description: exploreLevelPageLevel.description, title: exploreLevelPageLevel.title, difficulty: exploreLevelPageLevel.difficulty, data: exploreLevelPageLevel.data}
		editingExploreLevel = true;
		textBoxes[0][1].text = exploreLevelPageLevel.description;
		textBoxes[0][2].text = exploreLevelPageLevel.title;
	}
}

function cancelEditExploreLevel() {
	if (!editingExploreLevel) return;
	editingExploreLevel = false;
	exploreLevelPageLevel.description = exploreOldLevelData.description;
	exploreLevelPageLevel.title = exploreOldLevelData.title;
	exploreLevelPageLevel.difficulty = exploreOldLevelData.difficulty;
	exploreLevelPageLevel.data = exploreOldLevelData.data;
}

function saveLevelCreator() {
	if (lcCurrentSavedLevel == -1) {
		lcCurrentSavedLevel = nextLevelId;
		nextLevelId++;
	}
	lcSavedLevels['l' + lcCurrentSavedLevel] = {data:generateLevelString(), description: myLevelInfo.desc, id: lcCurrentSavedLevel, title: myLevelInfo.name};
	saveMyLevels();
	lcChangesMade = false;
}

function saveLevelCreatorCopy() {
	// Say that the level we're editing is not saved, save that, then switch back to editing the saved level from before.
	let oldSavedLevel = lcCurrentSavedLevel;
	let oldChangesMade = lcChangesMade;
	lcCurrentSavedLevel = -1;
	saveLevelCreator();
	lcCurrentSavedLevel = oldSavedLevel;
	lcChangesMade = oldChangesMade; // There might be a better way to do this.
}

function toggleMyLevelDeleting() {
	deletingMyLevels = !deletingMyLevels;
}

function toggleLevelpackCreatorRemovingLevels() {
	levelpackCreatorRemovingLevels = !levelpackCreatorRemovingLevels;
}

function openLevelDeletePopUp(locOnPage) {
	lcPopUpNextFrame = true;
	levelToDelete = 'l' + explorePageLevels[locOnPage].id;
}

function confirmDeleteLevel() {
	lcPopUp = false;
	deletingMyLevels = false;
	if (myLevelsTab === 0) deleteSavedLevel(levelToDelete);
	else deleteSavedLevelpack(levelToDelete);
	setMyLevelsPage(myLevelsPage);
}

function cancelDeleteLevel() {
	lcPopUp = false;
	deletingMyLevels = false;
}

function openEditLevelpackDescriptionDialog() {
	lcPopUpNextFrame = true;
}

function closeLevelpackDescriptionDialog() {
	lcPopUp = false;
}

function removeLevelpackLevel(locOnPage) {
	levelpackCreatorRemovingLevels = false;
	lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].levels.splice(levelpackCreatorPage * 8 + locOnPage, 1);
	saveMyLevelpacks();
	setLevelpackCreatorPage(levelpackCreatorPage);
}

function createNewLevelpack() {
	lcCurrentSavedLevelpack = nextLevelpackId;
	nextLevelpackId++;
	lcSavedLevelpacks['l' + lcCurrentSavedLevelpack] = {levels:[], description: '', id: lcCurrentSavedLevelpack, title: 'My Levelpack ' + lcCurrentSavedLevelpack};
	openMyLevelpack(lcCurrentSavedLevelpack);
	saveMyLevelpacks();
}

function touchstart(event) {
	event.preventDefault();
	touchCount++;
	mousemove(event.changedTouches[0]);
	mousedown(event);
}

function touchend(event) {
	event.preventDefault();
	touchCount--;
	if (touchCount == 0) mouseup(event);
}

function touchcancel(event) {
	event.preventDefault();
	touchCount--;
	if (touchCount == 0) mouseIsDown = false;
}

function touchmove(event) {
	event.preventDefault();
	mousemove(event.changedTouches[0]);
}

function mousemove(event) {
	_xmouse = event.pageX*addedZoom - canvasReal.getBoundingClientRect().left;
	_ymouse = event.pageY*addedZoom - canvasReal.getBoundingClientRect().top;
}

function mousedown(event) {
	mouseIsDown = true;
	lastClickX = _xmouse;
	lastClickY = _ymouse;
	if (onRect(_xmouse, _ymouse, 0, 0, cwidth, cheight)) {
		document.querySelectorAll('.bottomtext').forEach(element => element.classList.add('unselectable'));
	} else {
		document.querySelectorAll('.bottomtext').forEach(element => element.classList.remove('unselectable'));
	}

	if (menuScreen == 5) {
		if (_xmouse > 660) {
			// for (let i = 0; i < 6; i++) {
			// 	let y = i * 40;
			// 	if (i > selectedTab) {
			// 		y += 300;
			// 	}
			// 	if (_ymouse >= y && _ymouse < y + 40) {
			// 		setSelectedTab(i);
			// 		if (i == 3 && (selectedTile < 0 || selectedTile > tileCount)) {
			// 			setTool(0);
			// 			setSelectedTile(1);
			// 		}
			// 		break;
			// 	}
			// }

			// if (selectedTab == 2) {
			// 	let x = Math.floor((_xmouse - 660) / 60);
			// 	y = Math.floor((_ymouse - 160) / 60);
			// 	i = x + y * 5;
			// 	if (i >= 0 && i < tileCount && (tool != 3 && tool != 2 || !blockProperties[i][9])) {
			// 		setSelectedTile(i);
			// 		if (i >= 1 && tool == 1) {
			// 			setTool(0);
			// 		}
			// 	}
			// } else {
			// 	setSelectedTile(1000);
			// }
			clearRectSelect();
		} else if (Math.abs(_ymouse - 510) <= 20 && Math.abs(_xmouse - 330) <= 300) {
			// let i = Math.floor((_xmouse - 30) / 50);
			// if (i != 8) {
			// 	if (i >= 9) {
			// 		i = i - 1;
			// 	}
			// 	if (i == 9) {
			// 		undo();
			// 	} else if (i == 10) {
			// 		setUndo();
			// 		clearMyLevel(1);
			// 		updateLCtiles();
			// 	} else {
			// 		setTool(i);
			// 		if(tool <= 3) {
			// 			setSelectedTab(3);
			// 			if ((tool == 3 || tool == 2) && blockProperties[selectedTile][9]) {
			// 				setSelectedTile(1);
			// 			}
			// 		}
			// 	}
			// }
		} else {
			if (selectedTab == 2 && !_keysDown[32]) {
				if (tool != 4) {
					setUndo();
				}
				let x = Math.floor((_xmouse - lcPan[0] - (330 - (scale * levelWidth) / 2)) / scale);
				let y = Math.floor((_ymouse - lcPan[1] - (240 - (scale * levelHeight) / 2)) / scale);
				if (mouseOnScreen()) {
					if (tool == 2 || (tool == 5 && !copied)) {
						LCRect[0] = LCRect[2] = Math.min(Math.max(x, 0), levelWidth - 1);
						LCRect[1] = LCRect[3] = Math.min(Math.max(y, 0), levelHeight - 1);
					}
				}
				if (mouseOnGrid()) {
					if (tool == 3) {
						if (!blockProperties[selectedTile][9]) {
							let fillType = myLevel[1][y][x];
							fillTile(x, y, selectedTile, fillType);
						} else {
							setTool(0);
						}
					} else if (tool == 4) {
						selectedTab = 2;
						setTool(0);
						setSelectedTile(myLevel[1][y][x]);
					} else if (tool == 5) {
						if (copied) {
							for (let i = 0; i < tileClipboard.length && y + i < levelHeight; i++) {
								for (let j = 0; j < tileClipboard[i].length && x + j < levelWidth; j++) {
									let testTile = tileClipboard[i][j];
									if (
										!(_keysDown[18] && myLevel[1][y + i][x + j] != 0) &&
										testTile != 0 &&
										testTile != 6 &&
										testTile != 12
									)
										myLevel[1][y + i][x + j] = testTile;
								}
							}
						}
						updateLCtiles();
						// selectedTab = 2;
						// setTool(0);
						// setSelectedTile(myLevel[1][y][x]);
					} else if (tool == 6) {
						let sizeChange = 0;
						if (closeToEdgeY() || levelHeight >= 2) {
							if (closeToEdgeY()) {
								sizeChange = 1;
							} else {
								sizeChange = -1;
							}
							removeLCTiles();
							let y2 = Math.round((_ymouse - (240 - (scale * levelHeight) / 2)) / scale);
							levelHeight += sizeChange;
							myLevel[1] = new Array(levelHeight);
							let y4 = 0;
							for (let y3 = 0; y3 < levelHeight; y3++) {
								if (y3 < y2) {
									y4 = y3;
								} else {
									y4 = Math.max(y3 - sizeChange, 0);
								}
								myLevel[1][y3] = new Array(levelWidth);
								for (let x3 = 0; x3 < levelWidth; x3++) {
									myLevel[1][y3][x3] = myLevel[0][y4][x3];
								}
							}
							for (let i = 0; i < myLevelChars[1].length; i++) {
								if (myLevelChars[1][i][2] > y2) {
									myLevelChars[1][i][2] += sizeChange;
									resetCharPositions();
									// char[i].y += sizeChange * 30;
								}
							}
							setCoinAndDoorPos();
							scale = getLCScale();
							updateLCtiles();
							// drawLCGrid();
						}
					} else if (tool == 7) {
						let x2 = ((_xmouse - (330 - (scale * levelWidth) / 2)) / scale) % 1;
						sizeChange = 0;
						if (closeToEdgeX() || levelWidth >= 2) {
							if (closeToEdgeX()) {
								sizeChange = 1;
							} else {
								sizeChange = -1;
							}
							removeLCTiles();
							x2 = Math.round((_xmouse - (330 - (scale * levelWidth) / 2)) / scale);
							levelWidth += sizeChange;
							myLevel[1] = new Array(levelHeight);
							let x4 = 0;
							for (let y3 = 0; y3 < levelHeight; y3++) {
								myLevel[1][y3] = new Array(levelWidth);
								x3 = 0;
								for (let x3 = 0; x3 < levelWidth; x3++) {
									if (x3 < x2) {
										x4 = x3;
									} else {
										x4 = Math.max(x3 - sizeChange, 0);
									}
									myLevel[1][y3][x3] = myLevel[0][y3][x4];
								}
							}
							for (let i = 0; i < myLevelChars[1].length; i++) {
								if (myLevelChars[1][i][1] > x2) {
									myLevelChars[1][i][1] += sizeChange;
									resetCharPositions();
									// char[i].x += sizeChange * 30;
								}
							}
							setCoinAndDoorPos();
							scale = getLCScale();
							updateLCtiles();
							// drawLCGrid();
						}
					}
				}
			}
		}
	}
}

function mouseup(event) {
	mouseIsDown = false;

	// Makes copying possible on Safari.
	if (copyButton != 0) {
		if (browserCopySolution) {
			if (copyButton == 1) copyLevelString();
			else if (copyButton == 2) copySavedLevelpackString();
			else if (copyButton == 3) exploreCopyLink();
		}
		copyButton = 0;
	}
	if (menuScreen == 5) {
		if (!blockProperties[selectedTile][9]) {
			if (tool == 2 && LCRect[0] != -1) {
				y = Math.min(LCRect[1], LCRect[3]);
				while (y <= Math.max(LCRect[1], LCRect[3])) {
					x = Math.min(LCRect[0], LCRect[2]);
					while (x <= Math.max(LCRect[0], LCRect[2])) {
						myLevel[1][y][x] = selectedTile;
						// levelCreator.tiles["tileX" + x + "Y" + y].gotoAndStop(selectedTile + 1);
						x++;
					}
					y++;
				}
				clearRectSelect();
				updateLCtiles();
			}
		}
	}
}

function keydown(event) {
	_keysDown[event.keyCode || event.charCode] = true;

	if (editingTextBox && event.key) {
		if (currentTextBoxAllowsLineBreaks && event.key == 'v' && (event.metaKey || event.ctrlKey)) {
			if (browserPasteSolution) navigator.clipboard.readText().then(clipText => {inputText += clipText;}).catch(err => console.log(err));
		} else if (event.key.length == 1) {
			inputText += event.key;
		} else if (event.key == 'Backspace') {
			inputText = inputText.slice(0, -1);
		} else if (currentTextBoxAllowsLineBreaks && (event.key == 'Enter' || event.key == 'Return') && event.shiftKey) {
			inputText += '\n';
		}
	}

	// if (event.metaKey || event.ctrlKey) controlOrCommandPress = true;
	if (menuScreen == 5 && !lcPopUp && !editingTextBox) {
		// tool shortcuts
		if (_xmouse < 660 && selectedTab == 2) {
			if (event.key == '1' || event.key == 'p' || event.key == 'd') setTool(0);
			else if (event.key == '2' || event.key == 'e') setTool(1);
			else if (event.key == '3' || event.key == 'r') setTool(2);
			else if (event.key == '4' || event.key == 'f') setTool(3);
			else if (event.key == '5' || event.key == 'i') setTool(4);
			else if (event.key == '6' || event.key == 's') setTool(5);
			else if (event.key == '7' || event.key == 'h') setTool(6);
			else if (event.key == '8' || event.key == 'j') setTool(7);
		}
		// undo shortcut
		if (event.key == 'z' && (event.metaKey || event.ctrlKey)) {
			undo();
		}
		// zoom
		if (event.key == '=' || event.key == '+') {
			// zoom in
			lcSetZoom(lcZoom+1);
		} else if (event.key == '-' || event.key == '_') {
			// zoom out
			lcSetZoom(lcZoom-1);
		} else if (event.key == '0') {
			// reset zoom
			lcSetZoom(0);
			lcPan = [0,0];
			updateLCtiles();
		}
	}
}

function keyup(event) {
	_keysDown[event.keyCode || event.charCode] = false;
	// if (event.metaKey || event.ctrlKey) controlOrCommandPress = false;
}

// https://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser
function handlePaste(e) {
	if (canvas.getAttribute('contenteditable')) {
		let clipboardData, pastedData;

		// Stop data actually being pasted into div
		e.stopPropagation();
		e.preventDefault();

		// Get pasted data via clipboard API
		clipboardData = e.clipboardData || window.clipboardData;
		pastedData = clipboardData.getData('Text');

		// Do whatever with pasteddata
		if (editingTextBox && currentTextBoxAllowsLineBreaks) {
			inputText += pastedData;
		}
	}
	//canvas.setAttribute('contenteditable', true);
}

function setup() {
	osc1 = document.createElement('canvas');
	osc1.width = cwidth;
	osc1.height = cheight;
	osctx1 = osc1.getContext('2d');

	osc2 = document.createElement('canvas');
	osc2.width = cwidth;
	osc2.height = cheight;
	osctx2 = osc2.getContext('2d');

	osc3 = document.createElement('canvas');
	osc3.width = cwidth;
	osc3.height = cheight;
	osctx3 = osc3.getContext('2d');

	osc4 = document.createElement('canvas');
	osc4.width = cwidth;
	osc4.height = cheight;
	osctx4 = osc4.getContext('2d');

	osc5 = document.createElement('canvas');
	osc5.width = cwidth;
	osc5.height = cheight;
	osctx5 = osc5.getContext('2d');

	for (let i = 0; i < thumbs.length; i++) {
		thumbs[i] = document.createElement('canvas');
		thumbs[i].width = Math.floor(192 * pixelRatio);
		thumbs[i].height = Math.floor(108 * pixelRatio);
		thumbsctx[i] = thumbs[i].getContext('2d');
		thumbsctx[i].scale(pixelRatio * 0.2, pixelRatio * 0.2);
	}
	thumbBig = document.createElement('canvas');
	thumbBig.width = Math.floor(384 * pixelRatio);
	thumbBig.height = Math.floor(216 * pixelRatio);
	thumbBigctx = thumbBig.getContext('2d');
	thumbBigctx.scale(pixelRatio * 0.4, pixelRatio * 0.4);

	window.addEventListener('pointermove', mousemove);
	window.addEventListener('pointerdown', mousedown);
	window.addEventListener('pointerup', mouseup);
	window.addEventListener('keydown', keydown);
	window.addEventListener('keyup', keyup);
	if (isMobile) {
		window.addEventListener('touchstart', touchstart);
		window.addEventListener('touchend', touchend);
		window.addEventListener('touchcancel', touchcancel);
		window.addEventListener('touchmove', touchmove);
	}
	canvas.addEventListener('paste', handlePaste);

	if (getCookie('5beam_id')) loggedInExploreUser5beamID = getCookie('5beam_id');

	if (levelId) {
		// If the level ID is specified in the URL, load that level.
		menuScreen = 0;
		exploreLevelPageType = 0;
		fetch('https://5beam.zelo.dev/api/level?id=' + levelId, {method: 'GET'})
			.then(async (res) => {
				exploreLevelPageLevel = await res.json();
				playExploreLevel();
				rAF60fps();
			})
			.catch((e) => {
				alert("Unable to find level!", e);
				console.error(e);
			});
	} else if (levelpackId) {
		// If the levelpack ID is specified in the URL, load that levelpack.
		menuScreen = 1;
		exploreLevelPageType = 1;
		fetch('https://5beam.zelo.dev/api/levelpack?levels=1&id=' + levelpackId, {method: 'GET'})
			.then(async (res) => {
				exploreLevelPageLevel = await res.json();
				if (levelpackProgress[exploreLevelPageLevel.id] === 'undefined') playExploreLevel();
				else continueExploreLevelpack();
				rAF60fps();
			})
			.catch((e) => {
				alert("Unable to find levelpack!", e);
				console.error(e);
			});
	} else {
		rAF60fps();
	}
}

function draw() {
	onButton = false;
	hoverText = '';
	onTextBox = false;
	onScrollbar = false;
	mousePressedLastFrame = pmouseIsDown && !mouseIsDown;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (menuScreen == 2 || menuScreen == 3) ctx.translate(Math.floor(-cameraX + shakeX), Math.floor(-cameraY + shakeY));
	switch (menuScreen) {
		case -1:
			ctx.drawImage(preMenuBG, 0, 0, cwidth, cheight);
			drawMenu0Button('START GAME', (cwidth - menu0ButtonSize.w) / 2, (cheight - menu0ButtonSize.h) / 2, false, playGame);
			break;

		case 0:
			drawMenu();
			break;

		case 2:
			drawLevelMap();
			if (_xmouse < 587 || _ymouse < 469) {
				if (_ymouse <= 180) {
					cameraY = Math.min(Math.max(cameraY - (180 - _ymouse) * 0.1, 0), 1080);
				} else if (_ymouse >= 360) {
					cameraY = Math.min(Math.max(cameraY + (_ymouse - 360) * 0.1, ), 1080);
				}
			}
			break;

		case 3:
			// TODO: Look into if it would be more accurate to the Flash version if this were moved to after the game logic.
			// ctx.drawImage(
			// 	osc4,
			// 	-Math.floor((Math.max(cameraX, 0) + shakeX) / 1.5 + (cameraX < 0 ? cameraX / 3 : 0)),
			// 	-Math.floor((Math.max(cameraY, 0) + shakeY) / 1.5 + (cameraY < 0 ? cameraY / 3 : 0)),
			// 	osc4.width / pixelRatio,
			// 	osc4.height / pixelRatio
			// );
			ctx.drawImage(osc4, -Math.floor(-cameraX + shakeX) + Math.floor( (-cameraX+shakeX)/3), -Math.floor(-cameraY + shakeY) + Math.floor( Math.max( -cameraY/3 - ((bgXScale>bgYScale)?Math.max(0,(bgXScale*5.4-540)/2):0), 540 - osc4.height / pixelRatio) + shakeY/3), osc4.width / pixelRatio, osc4.height / pixelRatio);
			drawLevel(ctx);

			if (wipeTimer == 30) {
				if (transitionType == 0) {
					// resetting preexisting level
					if (!quirksMode) timer += getTimer() - levelTimer2;
					resetLevel();
				} else if (charsAtEnd >= charCount2) {
					// beat the level!
					if (playMode != 2 && gotThisCoin && !gotCoin[currentLevel]) {
						gotCoin[currentLevel] = true;
						coins++;
						// bonusProgress = Math.floor(coins * 0.33);
					}
					timer += getTimer() - levelTimer2;
					if (playMode == 0) {
						currentLevel++;
						if (!quirksMode) toSeeCS = true; // This line was absent in the original source, but without it dialogue doesn't play after level 1 when on a normal playthrough.
						levelProgress = currentLevel;
						if (currentLevel < levelCount) resetLevel();
						else exitLevel();
					} else {
						if (playMode == 3) {
							exitExploreLevel();
						} else if (playMode == 2) {
							exitTestLevel();
						} else {
							exitLevel();
							// if (currentLevel > 99) {
							// 	bonusesCleared[currentLevel - 100] = true;
							// }
						}
					}
					saveGame();
				}
			}

			if (cutScene == 1 || cutScene == 2) {
				if (_keysDown[13] || _keysDown[16]) {
					if (!csPress && cutScene == 1) {
						cutSceneLine++;
						if (cutSceneLine >= cLevelDialogueChar.length) endCutScene();
						else displayLine(currentLevel, cutSceneLine);
					}
					csPress = true;
				} else {
					csPress = false;
					if (cutScene == 2) cutScene = 3;
				}
			} else {
				if (control < 1000) {
					if (recover) {
						char[control].justChanged = 2;
						if (recoverTimer == 0) {
							if (_keysDown[37]) {
								if (!leftPress) recoverCycle(HPRC2, -1);
								leftPress = true;
							} else leftPress = false;
							if (_keysDown[39]) {
								if (!rightPress) recoverCycle(HPRC2, 1);
								rightPress = true;
							} else rightPress = false;
						}
					} else {
						if (cornerHangTimer == 0) {
							if (_keysDown[37]) {
								char[control].moveHorizontal(-power);
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
								char[recover2].x = char[HPRC1] ? char[HPRC1].x : 0;
								char[recover2].y = char[HPRC1] ? char[HPRC1].y - 20 : 0;
								char[recover2].vx = 0;
								char[recover2].vy = -1;
								char[recover2].frame = 3;
								char[recover2].leg1frame = 1;
								char[recover2].leg2frame = 1;
								char[recover2].legdire = 1;
								HPRCBubbleFrame = 0;
								goal = Math.round((char[HPRC1] ? char[HPRC1].x : 0) / 30) * 30;
							} else if (char[control].hasArms && !recover && char[control].deathTimer >= 30) {
								if (char[control].carry) {
									putDown(control);
									charThrow(control);
								} else {
									for (let i = 0; i < charCount; i++) {
										if (
											i != control &&
											near(control, i) &&
											char[i].charState >= 6 &&
											char[control].standingOn != i &&
											onlyMovesOneBlock(i, control)
										) {
											if (char[i].carry) putDown(i);
											if (ifCarried(i)) putDown(char[i].carriedBy);
											char[control].carry = true;
											char[control].carryObject = i;
											swapDepths(i, charCount * 2 + 1);
											char[i].carriedBy = control;
											char[i].weight2 = char[i].weight;
											char[control].weight2 = char[i].weight + char[control].weight;
											rippleWeight(control, char[i].weight2, 1);
											fallOff(i);
											aboveFallOff(i);
											char[i].justChanged = 2;
											char[control].justChanged = 2;
											if (char[i].submerged == 1) char[i].submerged = 0;
											if (char[i].onob && char[control].y - char[i].y > yOff(i)) {
												char[control].y = char[i].y + yOff(i);
												char[control].onob = false;
												char[i].onob = true;
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
								}
							} else if (
								HPRC2 < 10000 &&
								near2(control, HPRC2) &&
								char[control].hasArms &&
								char[control].onob
							) {
								char[control].stopMoving();
								if (char[control].x >= char[HPRC2].x - 33) char[control].dire = 2;
								else char[control].dire = 4;
								recover = true;
								recover2 = charCount - 1;
								recoverCycle(HPRC2, 0);
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
						if (
							(char[control].onob || char[control].submerged == 3) &&
							char[control].landTimer > 2 &&
							!recover
						) {
							if (char[control].submerged == 3) char[control].swimUp(0.14 / char[control].weight2);
							else char[control].jump(-jumpPower);
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
			for (let i = 0; i < charCount; i++) {
				if (char[i].charState >= 5) {
					char[i].landTimer = char[i].landTimer + 1;
					if (char[i].carry && char[char[i].carryObject].justChanged < char[i].justChanged) {
						char[char[i].carryObject].justChanged = char[i].justChanged;
					}
					if (char[i].standingOn == -1) {
						if (char[i].onob) {
							if (char[i].charState >= 5) {
								char[i].fricGoal = onlyConveyorsUnder(i);
							}
						}
					} else char[i].fricGoal = char[char[i].standingOn].vx;

					char[i].applyForces(char[i].weight2, control == i, jumpPower * 0.7);
					if (char[i].deathTimer >= 30) char[i].charMove();
					if (char[i].id == 3) {
						if (char[i].temp > 50) {
							for (let j = 0; j < charCount; j++) {
								if (char[j].charState >= 5 && j != i) {
									if (
										Math.abs(char[i].x - char[j].x) < char[i].w + char[j].w &&
										char[j].y > char[i].y - char[i].h &&
										char[j].y < char[i].y + char[j].h
									) {
										char[j].heated = 2;
										heat(j);
									}
								}
							}
						}
					}
				} else if (char[i].charState >= 3) {
					let section = Math.floor(levelTimer / char[i].speed) % (char[i].motionString.length - 2);
					char[i].vx = cardinal[char[i].motionString[section + 2]][0] * (30 / char[i].speed);
					char[i].vy = cardinal[char[i].motionString[section + 2]][1] * (30 / char[i].speed);
					char[i].px = char[i].x;
					char[i].py = char[i].y;
					char[i].charMove();
				}
				if (char[i].charState == 3 || char[i].charState == 5) {
					for (let j = 0; j < charCount; j++) {
						if (char[j].charState >= 7 && j != i) {
							if (
								Math.abs(char[i].x - char[j].x) < char[i].w + char[j].w &&
								char[j].y > char[i].y - char[i].h &&
								char[j].y < char[i].y + char[j].h
							) {
								startDeath(j);
							}
						}
					}
				}
				if (char[i].justChanged >= 1) {
					if (char[i].standingOn >= 1) {
						if (char[char[i].standingOn].charState == 4) {
							char[i].justChanged = 2;
						}
					}
					if (char[i].stoodOnBy.length >= 1) {
						for (let j = 0; j < char[i].stoodOnBy.length; j++) {
							char[char[i].stoodOnBy[j]].y = char[i].y - char[i].h;
							char[char[i].stoodOnBy[j]].vy = char[i].vy;
						}
					} else if (!char[i].carry && char[i].submerged >= 2) {
						char[i].weight2 = char[i].weight - 0.16;
					}
					if (char[i].charState >= 5 && !ifCarried(i)) {
						if (char[i].vy > 0 || (char[i].vy == 0 && char[i].vx != 0)) {
							landOnObject(i);
						}
						if (char[i].vy < 0 && (char[i].charState == 4 || char[i].charState == 6) && !ifCarried(i)) {
							objectsLandOn(i);
						}
					}
				}

				if (char[i].charState >= 7 && char[i].charState != 9 && !gotThisCoin) {
					let dist = calcDist(i);
					if (dist < locations[4]) {
						locations[4] = dist;
						locations[5] = i;
					}
				}
			}
			if (!gotThisCoin) coinAlpha = 140 - locations[4] * 0.7;
			if (playMode < 2 && gotCoin[currentLevel]) coinAlpha = Math.max(coinAlpha, 30);
			for (let i = 0; i < charCount; i++) {
				if (char[i].vy != 0 || char[i].vx != 0 || char[i].x != char[i].px || char[i].py != char[i].y)
					char[i].justChanged = 2;
				if (char[i].charState == 2) {
					recoverTimer--;
					let trans = (60 - recoverTimer) / 60;
					char[i].x = inter(char[HPRC1] ? char[HPRC1].x : 0, goal, trans);
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
						checkDeath(i);
					}
				} else if (char[i].justChanged >= 1 && char[i].charState >= 5) {
					for (let y = Math.floor((char[i].y - char[i].h) / 30); y <= Math.floor(char[i].y / 30); y++) {
						for (
							let x = Math.floor((char[i].x - char[i].w) / 30);
							x <= Math.floor((char[i].x + char[i].w - 0.01) / 30);
							x++
						) {
							if (!outOfRange(x, y)) {
								if (
									blockProperties[thisLevel[y][x]][11] >= 1 &&
									blockProperties[thisLevel[y][x]][11] <= 12
								) {
									if (Math.floor(char[i].x / 30) == x) {
										let rot = (char[i].x - Math.floor(char[i].x / 30) * 30 - 15) * 5;
										if (
											(rot < tileFrames[y][x].rotation && char[i].vx < 0) ||
											(rot > tileFrames[y][x].rotation && char[i].vx > 0)
										) {
											if (
												(rot < 0 && tileFrames[y][x].rotation > 0) ||
												(rot > 0 && tileFrames[y][x].rotation < 0)
											) {
												leverSwitch((blockProperties[thisLevel[y][x]][11] - 1) % 6);
											}
											tileFrames[y][x].rotation = rot;
										}
									}
								}
							}
						}
					}
					checkButton2(i, false);
					if (ifCarried(i)) {
						char[i].vx = char[char[i].carriedBy].vx;
						char[i].vy = char[char[i].carriedBy].vy;

						if (char[char[i].carriedBy].x + xOff(i) >= char[i].x + 20) {
							char[i].x += 20;
						} else if (char[char[i].carriedBy].x + xOff(i) <= char[i].x - 20) {
							char[i].x -= 20;
						} else {
							char[i].x = char[char[i].carriedBy].x + xOff(i);
						}

						if (char[char[i].carriedBy].y - yOff(i) >= char[i].y + 20) {
							char[i].y += 20;
						} else if (char[char[i].carriedBy].y - yOff(i) <= char[i].y - 20) {
							char[i].y -= 20;
						} else {
							char[i].y = char[char[i].carriedBy].y - yOff(i);
						}
						char[i].dire = Math.ceil(char[char[i].carriedBy].dire / 2) * 2;
					}
					if (char[i].standingOn >= 0) {
						char[i].y = char[char[i].standingOn].y - char[char[i].standingOn].h;
						char[i].vy = char[char[i].standingOn].vy;
					}
					stopX = 0;
					stopY = 0;
					toBounce = false;
					if (newTileHorizontal(i, 1)) {
						if (horizontalType(i, 1, 8) && char[i].charState == 10) {
							startCutScene();
						}
						if (horizontalProp(i, 1, 7, char[i].x, char[i].y) && char[i].charState >= 7) {
							startDeath(i);
						} else if (char[i].x > char[i].px && horizontalProp(i, 1, 3, char[i].x, char[i].y)) {
							stopX = 1;
						}
					}
					if (newTileHorizontal(i, -1)) {
						if (horizontalType(i, -1, 8) && char[i].charState == 10) {
							startCutScene();
						}
						if (horizontalProp(i, -1, 6, char[i].x, char[i].y) && char[i].charState >= 7) {
							startDeath(i);
						} else if (char[i].x < char[i].px && horizontalProp(i, -1, 2, char[i].x, char[i].y)) {
							stopX = -1;
						}
					}
					if (newTileDown(i)) {
						if (verticalType(i, 1, 8, false) && char[i].charState == 10) {
							startCutScene();
						}
						if (verticalType(i, 1, 13, true)) {
							toBounce = true;
						} else if (verticalProp(i, 1, 5, char[i].px, char[i].y) && char[i].charState >= 7) {
							startDeath(i);
						} else if (char[i].y > char[i].py && verticalProp(i, 1, 1, char[i].px, char[i].y)) {
							stopY = 1;
						}
					}
					if (newTileUp(i)) {
						if (verticalType(i, -1, 8, false) && char[i].charState == 10) {
							startCutScene();
						}
						if (verticalProp(i, -1, 4, char[i].x, char[i].y) && char[i].charState >= 7) {
							startDeath(i);
						} else if (char[i].y < char[i].py && verticalProp(i, -1, 0, char[i].px, char[i].y)) {
							stopY = -1;
						}
					}
					if (stopX != 0 && stopY != 0) {
						// two coordinates changed at once! Make sure snags don't happen
						if (stopY == 1) {
							y = Math.floor(char[i].y / 30) * 30;
						}
						if (stopY == -1) {
							y = Math.ceil((char[i].y - char[i].h) / 30) * 30 + char[i].h;
						}
						if (!horizontalProp(i, stopX, stopX / 2 + 2.5, char[i].x, y)) {
							stopX = 0;
						} else {
							if (stopX == 1) {
								x = Math.floor((char[i].x + char[i].w) / 30) * 30 - char[i].w;
							}
							if (stopX == -1) {
								x = Math.ceil((char[i].x - char[i].w) / 30) * 30 + char[i].w;
							}
							if (!verticalProp(i, stopY, stopY / 2 + 0.5, x, char[i].y)) {
								stopY = 0;
							}
						}
					}
					if (stopX != 0) {
						char[i].fricGoal = 0;
						if (char[i].submerged >= 2) {
							j = i;
							if (ifCarried(i)) {
								j = char[i].carriedBy;
							}
							if (char[j].dire % 2 == 1) {
								char[j].swimUp(0.14 / char[j].weight2);
								if (char[j].standingOn >= 0) {
									fallOff(i);
								}
								char[j].onob = false;
							}
						}
						if (char[i].id == 5) {
							startDeath(i);
						}
						if (stopX == 1) {
							x = Math.floor((char[i].x + char[i].w) / 30) * 30 - char[i].w;
						} else if (stopX == -1) {
							x = Math.ceil((char[i].x - char[i].w) / 30) * 30 + char[i].w;
						}
						char[i].x = x;
						char[i].vx = 0;
						stopCarrierX(i, x);
					}
					if (stopY != 0) {
						if (stopY == 1) {
							y = Math.floor(char[i].y / 30) * 30;
							if (!ifCarried(i)) cornerHangTimer = 0;
							fallOff(i);
							land(i, y, 0);
							land2(i, y);
							checkButton(i);
						} else if (stopY == -1) {
							if (char[i].id == 5) {
								startDeath(i);
							}
							if (char[i].id == 3 && char[i].temp > 50) {
								char[i].temp = 0;
							}
							y = Math.ceil((char[i].y - char[i].h) / 30) * 30 + char[i].h;
							char[i].y = y;
							char[i].vy = 0;
							bumpHead(i);
							if (ifCarried(i)) {
								bumpHead(char[i].carriedBy);
							}
						}
						stopCarrierY(i, y, stopY == 1);
					}
					if (newTileHorizontal(i, 1) || newTileHorizontal(i, -1)) {
						if (verticalType(i, 1, 13, true)) {
							toBounce = true;
						}
						if (
							horizontalProp(i, 1, 14, char[i].x, char[i].y) ||
							horizontalProp(i, -1, 14, char[i].x, char[i].y)
						) {
							submerge(i);
						}
						if (horizontalType(i, 1, 15) || horizontalType(i, -1, 15)) {
							char[i].heated = 1;
						}
						checkButton(i);
					}
					if (newTileUp(i)) {
						if (verticalProp(i, -1, 14, char[i].x, char[i].y)) {
							submerge(i);
						}
						if (verticalType(i, -1, 15, false)) {
							char[i].heated = 1;
						}
					}
					if (newTileDown(i)) {
						if (verticalProp(i, 1, 14, char[i].x, char[i].y)) {
							submerge(i);
						}
						if (verticalType(i, 1, 15, false)) {
							char[i].heated = 1;
						}
					}
					if (char[i].submerged >= 2 && char[i].standingOn >= 0 && char[i].weight2 < 0) {
						fallOff(i);
					}
					if (char[i].submerged >= 2) {
						unsubmerge(i);
					}
					if (char[i].heated >= 1) {
						heat(i);
					} else if (char[i].id != 3 || char[i].temp <= 50) {
						if (char[i].temp >= 0) {
							char[i].temp -= char[i].heatSpeed;
							char[i].justChanged = 2;
						} else char[i].temp = 0;
					}
					if (char[i].heated == 2) {
						char[i].heated = 0;
					}
					if (char[i].standingOn >= 0) {
						j = char[i].standingOn;
						if (Math.abs(char[i].x - char[j].x) >= char[i].w + char[j].w || ifCarried(j)) {
							fallOff(i);
						}
					} else if (char[i].onob) {
						if (!ifCarried(i) && char[i].standingOn == -1) {
							char[i].y = Math.round(char[i].y / 30) * 30;
						}
						if (!verticalProp(i, 1, 1, char[i].x, char[i].y)) {
							char[i].onob = false;
							aboveFallOff(i);
							if (ifCarried(i)) {
								cornerHangTimer = 0;
							}
						}
						if (char[i].charState >= 7 && verticalProp(i, 1, 5, char[i].x, char[i].y)) {
							startDeath(i);
						}
					}
				}
				if (char[i].charState >= 5) {
					char[i].px = char[i].x;
					char[i].py = char[i].y;
					if (char[i].justChanged >= 1 && char[i].charState >= 5) {
						if (toBounce) {
							bounce(i);
						}
						getCoin(i);
					}
					if (char[i].deathTimer < 30) {
						if (char[i].id == 5 && char[i].deathTimer >= 7) {
							char[i].deathTimer = 6;
						}
						char[i].deathTimer--;
						if (char[i].deathTimer <= 0) {
							endDeath(i);
						}
					} else if (
						char[i].charState >= 7 &&
						char[i].id < 35 &&
						(char[i].justChanged >= 1 || levelTimer == 0)
					) {
						setBody(i);
					}
					if (i == HPRC2) {
						if (!recover) {
							HPRCText = '';
						} else if (recoverTimer == 0) {
							HPRCText = 'enter name';
						} else if (recoverTimer > 40) {
							HPRCText = names[char[recover2].id];
						} else if (recoverTimer > 10) {
							HPRCText = 'Keep going';
						} else {
							HPRCText = 'Done';
						}
						HPRCCrankRot = recoverTimer * 12 * (Math.PI / 180);
						if (!recover && HPRCBubbleFrame <= 2) {
							if (control < 10000 && near(control, i) && numberOfDead() >= 1 && char[control].hasArms) {
								HPRCBubbleFrame = 1;
							} else {
								HPRCBubbleFrame = 0;
							}
						}
						ctx.save();
						ctx.translate(char[i].x, char[i].y - char[i].h - 5);
						ctx.scale(1.43, 1.43);
						if (HPRCBubbleFrame == 1) {
							ctx.drawImage(svgHPRCBubble[0], -svgHPRCBubble[0].width / (scaleFactor*2), bounceY(5.874, 30, _frameCount) - 5.874 - svgHPRCBubble[0].height / scaleFactor, svgHPRCBubble[0].width / scaleFactor, svgHPRCBubble[0].height / scaleFactor);
						} else if (HPRCBubbleFrame == 2) {
							ctx.drawImage(svgHPRCBubble[1], -svgHPRCBubble[1].width / (scaleFactor*2), -svgHPRCBubble[1].height / scaleFactor, svgHPRCBubble[1].width / scaleFactor, svgHPRCBubble[1].height / scaleFactor);
							drawHPRCBubbleCharImg(recover2, 1, 0);
						} else if (HPRCBubbleFrame == 3) {
							ctx.drawImage(svgHPRCBubble[2], -svgHPRCBubble[2].width / (scaleFactor*2), -svgHPRCBubble[2].height / scaleFactor, svgHPRCBubble[2].width / scaleFactor, svgHPRCBubble[2].height / scaleFactor);
							if (hprcBubbleAnimationTimer > 0) {
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, -1), inter(1, 0.6, hprcBubbleAnimationTimer / 16), inter(0, -31.45, hprcBubbleAnimationTimer / 16));
								drawHPRCBubbleCharImg(recover2, inter(0.6, 1, hprcBubbleAnimationTimer / 16), inter(31.45, 0, hprcBubbleAnimationTimer / 16));
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, 1), inter(0.25, 0.6, hprcBubbleAnimationTimer / 16), inter(44.75, 31.45, hprcBubbleAnimationTimer / 16));
								hprcBubbleAnimationTimer++;
								if (hprcBubbleAnimationTimer > 16) hprcBubbleAnimationTimer = 0;
							} else if (hprcBubbleAnimationTimer < 0) {
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, -1), inter(0.25, 0.6, -hprcBubbleAnimationTimer / 16), inter(-44.75, -31.45, -hprcBubbleAnimationTimer / 16));
								drawHPRCBubbleCharImg(recover2, inter(0.6, 1, -hprcBubbleAnimationTimer / 16), inter(-31.45, 0, -hprcBubbleAnimationTimer / 16));
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, 1), inter(1, 0.6, -hprcBubbleAnimationTimer / 16), inter(0, 31.45, -hprcBubbleAnimationTimer / 16));
								hprcBubbleAnimationTimer--;
								if (hprcBubbleAnimationTimer < -16) hprcBubbleAnimationTimer = 0;
							} else {
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, -1), 0.6, -31.45);
								drawHPRCBubbleCharImg(recover2, 1, 0);
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, 1), 0.6, 31.45);
							}
						} else if (HPRCBubbleFrame == 4 && hprcBubbleAnimationTimer <= 64) {
							if (hprcBubbleAnimationTimer > 30) ctx.globalAlpha = (-hprcBubbleAnimationTimer + 64) / 33;
							ctx.drawImage(svgHPRCBubble[3], -svgHPRCBubble[3].width / (scaleFactor*2), -svgHPRCBubble[3].height / scaleFactor, svgHPRCBubble[3].width / scaleFactor, svgHPRCBubble[3].height / scaleFactor);
							ctx.globalAlpha = 1;
							ctx.drawImage(svgHPRCBubble[4], -svgHPRCBubble[4].width / (scaleFactor*2), -svgHPRCBubble[4].height / scaleFactor, svgHPRCBubble[4].width / scaleFactor, svgHPRCBubble[4].height / scaleFactor);
							hprcBubbleAnimationTimer++;
						}
						ctx.restore();
					}
					if (char[i].y > levelHeight * 30 + 160 && char[i].charState >= 7) {
						startDeath(i);
					}
					if (char[i].charState == 10 && char[i].justChanged >= 1) {
						if (
							Math.abs(char[i].x - locations[0] * 30) <= 30 &&
							Math.abs(char[i].y - (locations[1] * 30 + 10)) <= 50
						) {
							if (!char[i].atEnd) {
								charsAtEnd++;
								doorLightFadeDire[charsAtEnd - 1] = 1;
								if (charsAtEnd >= charCount2) {
									wipeTimer = 1;
									if (playMode == 0) {
										transitionType = 1;
									} else {
										transitionType = 2;
									}
								}
							}
							char[i].atEnd = true;
						} else {
							if (char[i].atEnd) {
								doorLightFadeDire[charsAtEnd - 1] = -1;
								charsAtEnd--;
							}
							char[i].atEnd = false;
						}
					}
					if (i == control) setCamera();
				}
			}

			// This is an easter egg I added for The Wiki Camp 2. You can ignore it.
			if (currentLevel == 52 && onRect(_xmouse, _ymouse, 674, 142, 30, 30)) {
				onButton = true;
				if (mousePressedLastFrame) {
					window.open('https://camp2.rectangle.zone/index.php?title=5b_Challenge_Crystal');
				}
			}

			qTimer--;
			x = -cameraX;
			y = -cameraY;
			if (wipeTimer < 60) {
				x += (Math.random() - 0.5) * (30 - Math.abs(wipeTimer - 30));
				y += (Math.random() - 0.5) * (30 - Math.abs(wipeTimer - 30));
			}
			if (control < 10000) {
				if (char[control].temp > 0 && char[control].temp <= 50) {
					x += (Math.random() - 0.5) * char[control].temp * 0.2;
					y += (Math.random() - 0.5) * char[control].temp * 0.2;
				}
			}
			if (screenShake) {
				shakeX = x + cameraX;
				shakeY = y + cameraY;
			} else {
				shakeX = 0;
				shakeY = 0;
			}
			levelTimer++;
			break;

		case 5:
			// menuExitLevelCreator
			lcPopUpNextFrame = false;
			copyButton = false;

			ctx.drawImage(osc1, 0, 0, cwidth, cheight);
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, 960, 540);
			ctx.globalAlpha = 1;
			ctx.fillStyle = '#aeaeae';
			ctx.fillRect(0, 480, 660, 60);
			ctx.fillStyle = '#cccccc';
			ctx.fillRect(660, 0, 300, 540);

			let tabWindowH = cheight - tabHeight * tabNames.length;
			let tabWindowY = (selectedTab + 1) * tabHeight;
			mouseOnTabWindow = onRect(_xmouse, _ymouse, 660, (selectedTab + 1) * tabHeight, 300, tabWindowH);
			// Draw Tab Contents
			switch (selectedTab) {
				case 0:
					// Level Info
					ctx.textAlign = 'right';
					ctx.textBaseline = 'top';
					ctx.font = '18px Helvetica';
					ctx.fillStyle = '#000000';
					ctx.fillText('Name:', 770, tabWindowY + 10);
					ctx.fillText('Description:', 770, tabWindowY + 60);

					textBoxes[0][0].y = tabWindowY + 10;
					textBoxes[0][1].y = tabWindowY + 60;
					textBoxes[0][0].draw();
					textBoxes[0][1].draw();
					myLevelInfo.name = textBoxes[0][0].text;
					myLevelInfo.desc = textBoxes[0][1].text;
					if (mouseIsDown && !pmouseIsDown && !onTextBox) {
						editingTextBox = false;
						deselectAllTextBoxes();
					}


					ctx.fillStyle = '#000000';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'bottom';
					ctx.font = '21px Helvetica';
					ctx.fillText('Necessary Deaths:', 660 + (cwidth - 660) / 2, tabWindowY + 317);
					ctx.font = '25px Helvetica';
					let necessaryDeathsW = 100;
					ctx.fillStyle = '#808080';
					ctx.fillRect(660 + (cwidth - 660 - necessaryDeathsW) / 2, tabWindowY + 320, necessaryDeathsW, 25);
					// ctx.fillStyle = '#ee3333';
					drawMinusButton(660 + (cwidth - 660 - necessaryDeathsW) / 2 - 35, tabWindowY + 320, 25, 3);
					if (
						onRect(
							_xmouse,
							_ymouse,
							660 + (cwidth - 660 + necessaryDeathsW) / 2 + 10,
							tabWindowY + 320,
							25,
							25
						) &&
						myLevelNecessaryDeaths < 999999
					) {
						if (mouseIsDown && !pmouseIsDown) myLevelNecessaryDeaths++;
					}
					// ctx.fillStyle = '#33ee33';
					drawAddButton(660 + (cwidth - 660 + necessaryDeathsW) / 2 + 10, tabWindowY + 320, 25, 3);
					if (
						onRect(
							_xmouse,
							_ymouse,
							660 + (cwidth - 660 - necessaryDeathsW) / 2 - 35,
							tabWindowY + 320,
							25,
							25
						) &&
						myLevelNecessaryDeaths > 0
					) {
						if (mouseIsDown && !pmouseIsDown) myLevelNecessaryDeaths--;
					}

					ctx.fillStyle = '#ffffff';
					ctx.textBaseline = 'top';
					ctx.fillText(
						myLevelNecessaryDeaths.toString().padStart(6, '0'),
						660 + (cwidth - 660) / 2,
						tabWindowY + 320
					);
					break;

				case 1:
					// Entities
					let charInfoY = (selectedTab + 1) * tabHeight + 5;
					// TODO: only compute the look up table when it changes
					let charInfoYLookUp = [];
					for (let i = 0; i < myLevelChars[1].length; i++) {
						charInfoYLookUp.push(charInfoY);
						charInfoY += charInfoHeight + 5;
						if (myLevelChars[1][i][3] == 3 || myLevelChars[1][i][3] == 4)
							charInfoY += diaInfoHeight * myLevelChars[1][i][5].length;
					}
					var tabContentsHeight = Math.max(
						charInfoY,
						charInfoYLookUp[myLevelChars[1].length - 1] + charInfoHeight * 2
					);
					var scrollBarH = (tabWindowH / tabContentsHeight) * tabWindowH;
					var scrollBarY =
						(selectedTab + 1) * tabHeight +
						(charsTabScrollBar / (tabContentsHeight == tabWindowH ? 1 : tabContentsHeight - tabWindowH)) *
							(tabWindowH - scrollBarH);
					if (
						!draggingScrollbar &&
						!lcPopUp &&
						onRect(_xmouse, _ymouse, cwidth - 10, scrollBarY, 10, scrollBarH)
					) {
						onScrollbar = true;
						if (mouseIsDown && !pmouseIsDown) {
							draggingScrollbar = true;
							valueAtClick = _ymouse - scrollBarY;
						}
					}
					if (draggingScrollbar) {
						charsTabScrollBar = Math.floor(
							Math.max(
								Math.min(
									((_ymouse - valueAtClick - tabWindowY) / (tabWindowH - scrollBarH)) *
										(tabContentsHeight - tabWindowH),
									tabContentsHeight - tabWindowH
								),
								0
							)
						);
						if (!mouseIsDown) draggingScrollbar = false;
					}
					ctx.fillStyle = '#a0a0a0';
					ctx.fillRect(cwidth - 10, scrollBarY, 10, scrollBarH);
					ctx.save();
					ctx.translate(0, -charsTabScrollBar);
					ctx.textAlign = 'left';
					ctx.textBaseline = 'middle';
					ctx.font = '20px Helvetica';
					for (let i = 0; i < Math.min(myLevelChars[1].length, charInfoYLookUp.length); i++) {
						if (
							(duplicateChar || reorderCharUp || reorderCharDown) &&
							onRect(_xmouse, _ymouse + charsTabScrollBar, 665, charInfoYLookUp[i], 260, charInfoHeight)
						) {
							ctx.fillStyle = '#e8e8e8';
							ctx.fillRect(660, charInfoYLookUp[i] - 5, 270, charInfoHeight + 10);
						}
						drawLCCharInfo(i, charInfoYLookUp[i]);
						if (i == charDropdown) charDropdownY = charInfoYLookUp[i];
					}
					addButtonPressed = false;
					if (
						!lcPopUp &&
						onRect(
							_xmouse,
							_ymouse,
							660 + 5,
							cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20,
							15,
							15
						)
					) {
						if (myLevelChars[1].length < 50) {
							onButton = true;
							hoverText = 'Add New Character or Object';
							if (mouseIsDown && !pmouseIsDown) {
								duplicateChar = false;
								reorderCharUp = false;
								reorderCharDown = false;
								setUndo();
								myLevelChars[1].push([0, -1, -1, 10]);
								let newestCharIndex = myLevelChars[1].length - 1;
								let i = myLevelChars[1][newestCharIndex][0];
								char.push(
									new Character(
										i,
										0.0,
										0.0,
										70 + newestCharIndex * 40,
										400 - newestCharIndex * 30,
										myLevelChars[1][newestCharIndex][3],
										charD[i][0],
										charD[i][1],
										charD[i][2],
										charD[i][2],
										charD[i][3],
										charD[i][4],
										charD[i][6],
										charD[i][8],
										i < 35 ? charModels[i].defaultExpr : 0
									)
								);
								char[char.length - 1].placed = false;
							}
						}
						addButtonPressed = true;
					}
					if (
						!lcPopUp &&
						onRect(
							_xmouse,
							_ymouse,
							660 + 25,
							cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20,
							15,
							15
						)
					) {
						if (myLevelChars[1].length < 50) {
							onButton = true;
							hoverText = 'Duplicate Character or Object';
							if (mouseIsDown && !pmouseIsDown) {
								reorderCharUp = false;
								reorderCharDown = false;
								duplicateChar = true;
							}
						}
						addButtonPressed = true;
					}
					if (duplicateChar && !addButtonPressed && mouseIsDown && !pmouseIsDown) duplicateChar = false;
					if (
						!lcPopUp &&
						onRect(
							_xmouse,
							_ymouse,
							660 + 45,
							cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20,
							15,
							15
						)
					) {
						if (myLevelChars[1].length < 50) {
							onButton = true;
							hoverText = 'Move Character or Object Up';
							if (mouseIsDown && !pmouseIsDown) {
								duplicateChar = false;
								reorderCharDown = false;
								reorderCharUp = true;
							}
						}
						addButtonPressed = true;
					}
					if (reorderCharUp && !addButtonPressed && mouseIsDown && !pmouseIsDown) reorderCharUp = false;
					if (
						!lcPopUp &&
						onRect(
							_xmouse,
							_ymouse,
							660 + 65,
							cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20,
							15,
							15
						)
					) {
						if (myLevelChars[1].length < 50) {
							onButton = true;
							hoverText = 'Move Character or Object Down';
							if (mouseIsDown && !pmouseIsDown) {
								duplicateChar = false;
								reorderCharUp = false;
								reorderCharDown = true;
							}
						}
						addButtonPressed = true;
					}
					if (reorderCharDown && !addButtonPressed && mouseIsDown && !pmouseIsDown) reorderCharDown = false;

					if (charDropdown == -2) charDropdown = -1;
					if (charDropdown >= 0) {
						if (charDropdownType == 0) {
							if (_keysDown[16]) {
								myLevelChars[1][charDropdown][0]--;
								if (myLevelChars[1][charDropdown][0] < 0)
									myLevelChars[1][charDropdown][0] = charD.length - 1;
								while (charD[myLevelChars[1][charDropdown][0]][7] == 0) {
									myLevelChars[1][charDropdown][0]--;
									if (myLevelChars[1][charDropdown][0] < 0)
										myLevelChars[1][charDropdown][0] = charD.length - 1;
								}
							} else {
								myLevelChars[1][charDropdown][0]++;
								if (myLevelChars[1][charDropdown][0] > charD.length - 1)
									myLevelChars[1][charDropdown][0] = 0;
								while (charD[myLevelChars[1][charDropdown][0]][7] == 0) {
									myLevelChars[1][charDropdown][0]++;
									if (myLevelChars[1][charDropdown][0] > charD.length - 1)
										myLevelChars[1][charDropdown][0] = 0;
								}
							}
							myLevelChars[1][charDropdown][3] = charD[myLevelChars[1][charDropdown][0]][9];
							if (myLevelChars[1][charDropdown][3] == 3 || myLevelChars[1][charDropdown][3] == 4) {
								levelTimer = 0;
								resetCharPositions();
							}
							resetLCChar(charDropdown);
							charDropdown = -2;
						} else if (charDropdownType == 1) {
							ctx.fillStyle = '#ffffff';
							let textSize = 12.5;
							ctx.fillRect(
								665 + 240 - charInfoHeight * 3.5,
								charDropdownY + charInfoHeight,
								charInfoHeight * 3.5,
								textSize * 7
							);
							ctx.textBaseline = 'top';
							ctx.textAlign = 'right';
							ctx.font = textSize + 'px Helvetica';
							ctx.fillStyle = '#000000';
							let j = 0;
							for (let i = 3; i < charStateNames.length; i++) {
								if (charStateNames[i] != '') {
									if (
										mouseOnTabWindow &&
										!lcPopUp &&
										onRect(
											_xmouse,
											_ymouse + charsTabScrollBar,
											665 + 240 - charInfoHeight * 3.5,
											charDropdownY + charInfoHeight + j * textSize,
											charInfoHeight * 3.5,
											textSize
										)
									) {
										ctx.fillStyle = '#dddddd';
										ctx.fillRect(
											665 + 240 - charInfoHeight * 3.5,
											charDropdownY + charInfoHeight + j * textSize,
											charInfoHeight * 3.5,
											textSize
										);
										ctx.fillStyle = '#000000';
										if (mouseIsDown && !addButtonPressed) {
											setUndo();
											myLevelChars[1][charDropdown][3] = i;
										}
									}
									ctx.fillText(
										charStateNames[i],
										665 + 240 - 1,
										charDropdownY + charInfoHeight + j * textSize
									);
									j++;
								}
							}
						} else if (charDropdownType == 2) {
							let xmouseConstrained = Math.min(
								Math.max(_xmouse - lcPan[0] - (330 - (scale * levelWidth) / 2), 0),
								levelWidth * scale
							);
							let ymouseConstrained = Math.min(
								Math.max(_ymouse - lcPan[1] - (240 - (scale * levelHeight) / 2), 0),
								levelHeight * scale
							);
							myLevelChars[1][charDropdown][1] = mapRange(
								xmouseConstrained,
								0,
								levelWidth * scale,
								0,
								levelWidth
							);
							myLevelChars[1][charDropdown][2] = mapRange(
								ymouseConstrained,
								0,
								levelHeight * scale,
								0,
								levelHeight
							);
							if (!_keysDown[16]) {
								myLevelChars[1][charDropdown][1] = Math.round(myLevelChars[1][charDropdown][1] * 2) / 2;
								myLevelChars[1][charDropdown][2] = Math.round(myLevelChars[1][charDropdown][2] * 2) / 2;
							}
							char[charDropdown].x = char[charDropdown].px =
								+myLevelChars[1][charDropdown][1].toFixed(2) * 30;
							char[charDropdown].y = char[charDropdown].py =
								+myLevelChars[1][charDropdown][2].toFixed(2) * 30;
						} else if (charDropdownType == 3) {
							let flat = (valueAtClick + (lastClickY - _ymouse)) * 0.5;
							char[charDropdown].speed = flat > 100 ? 100 : -Math.log(1 - flat / 100) * 100;
							char[charDropdown].speed = Math.floor(Math.max(Math.min(char[charDropdown].speed, 99), 1));
							myLevelChars[1][charDropdown][4] = char[charDropdown].speed;
							levelTimer = 0;
							resetCharPositions();
							if (mousePressedLastFrame) {
								char[charDropdown].motionString = generateMS(myLevelChars[1][charDropdown]);
								charDropdown = -2;
							}
						} else if (charDropdownType == 4) {
							let newDire = myLevelChars[1][charDropdown][5][charDropdownMS][0] + 1;
							if (newDire > 3) newDire = 0;
							myLevelChars[1][charDropdown][5][charDropdownMS][0] = newDire;
							char[charDropdown].motionString = generateMS(myLevelChars[1][charDropdown]);
							levelTimer = 0;
							resetCharPositions();
							charDropdown = -2;
						} else if (charDropdownType == 5) {
							// let flat = (valueAtClick + (lastClickY-_ymouse));
							myLevelChars[1][charDropdown][5][charDropdownMS][1] = Math.floor(
								Math.max(Math.min(valueAtClick + (lastClickY - _ymouse) * 0.3, 32), 1)
							);
							if (mousePressedLastFrame) {
								char[charDropdown].motionString = generateMS(myLevelChars[1][charDropdown]);
								levelTimer = 0;
								resetCharPositions();
								charDropdown = -2;
							}
						}

						if (charDropdown >= 0 && mouseIsDown && !pmouseIsDown && !addButtonPressed) {
							let pCharState = char[charDropdown].charState;
							resetLCChar(charDropdown);
							if (charDropdownType == 2) {
								char[charDropdown].placed = true;
								levelTimer = 0;
								resetCharPositions();
							} else if (charDropdownType == 1) {
								if (char[charDropdown].charState == 3 || char[charDropdown].charState == 4) {
									if (pCharState != 3 && pCharState != 4) {
										char[charDropdown].speed = myLevelChars[1][charDropdown][4];
										char[charDropdown].motionString = generateMS(myLevelChars[1][charDropdown]);
									}
								} else {
									char[charDropdown].speed = 0;
									char[charDropdown].motionString = [];
								}
							}
							charDropdown = -2;
						}
					}
					if (charDropdown < -2) charDropdown = -charDropdown - 3;
					ctx.restore();

					ctx.fillStyle = '#cccccc';
					ctx.fillRect(660, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 25, 85, 25);
					drawAddButton(660 + 5, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20, 15, 0);
					drawDuplicateButton(
						660 + 25,
						cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20,
						15,
						1
					);
					drawUpButton(660 + 45, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20, 15, 1);
					drawDownButton(660 + 65, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20, 15, 1);
					break;

				case 2:
					// Tiles
					let j = 0;
					let bpr = 5;
					let bs = 40;
					let bdist = 53;
					ctx.save();
					ctx.translate(0, -tileTabScrollBar);
					if (mouseOnTabWindow && !lcPopUp) {
						var mouseTileRow = _ymouse + tileTabScrollBar - tabWindowY;
						var mouseTileColumn = _xmouse - 660;
						if (mouseTileRow % bdist < bdist - bs || mouseTileColumn % bdist < bdist - bs) {
							mouseTileRow = -1;
							mouseTileColumn = -1;
						} else {
							mouseTileRow = Math.floor((mouseTileRow - (bdist - bs)) / bdist);
							mouseTileColumn = Math.floor((mouseTileColumn - (bdist - bs)) / bdist);
						}
					} else {
						var mouseTileRow = -1;
						var mouseTileColumn = -1;
					}
					for (let i = 0; i < blockProperties.length; i++) {
						if (blockProperties[i][15]) {
							if (i == selectedTile) {
								ctx.fillStyle = '#a0a0a0';
								ctx.fillRect(
									660 + (bdist - bs) + (j % bpr) * bdist - (bdist - bs) / 2,
									(selectedTab + 1) * tabHeight +
										(bdist - bs) +
										Math.floor(j / bpr) * bdist -
										(bdist - bs) / 2,
									bs + bdist - bs,
									bs + bdist - bs
								);
							}
							if (j % bpr == mouseTileColumn && Math.floor(j / bpr) == mouseTileRow) {
								hoverText = tileNames[i];
								if (i != selectedTile) {
									onButton = true;
									ctx.fillStyle = '#dddddd';
									// ctx.fillRect(660 + (bdist-bs) + (j%bpr)*bdist - bpr/2, (selectedTab+1)*tabHeight + (bdist-bs) + Math.floor(j/bpr)*bdist - bpr/2, bs + bpr, bs + bpr);
									ctx.fillRect(
										660 + (bdist - bs) + (j % bpr) * bdist - (bdist - bs) / 2,
										(selectedTab + 1) * tabHeight +
											(bdist - bs) +
											Math.floor(j / bpr) * bdist -
											(bdist - bs) / 2,
										bs + bdist - bs,
										bs + bdist - bs
									);
									if (mouseIsDown && !pmouseIsDown) {
										// selectedTile = i;
										setSelectedTile(i);
										if (tool != 2 && tool != 3) setTool(0);
									}
								}
							}
							if (i == 6) {
								ctx.fillStyle = '#505050';
								ctx.fillRect(
									660 + (bdist - bs) + (j % bpr) * bdist + bs / 4,
									(selectedTab + 1) * tabHeight + (bdist - bs) + Math.floor(j / bpr) * bdist,
									bs / 2,
									bs
								);
							} else {
								let img = blockProperties[i][16] > 1 ? svgTiles[i][blockProperties[i][17] ? _frameCount % blockProperties[i][16] : 0] : svgTiles[i];
								let vb = blockProperties[i][16] > 1 ? svgTilesVB[i][blockProperties[i][17] ? _frameCount % blockProperties[i][16] : 0] : svgTilesVB[i];
								if (vb[2] <= 60) {
									let sc = bs / 30;
									let tlx = 660 + (bdist - bs) + (j % bpr) * bdist;
									let tly =
										(selectedTab + 1) * tabHeight + (bdist - bs) + Math.floor(j / bpr) * bdist;
									if (blockProperties[i][11] > 0 && blockProperties[i][11] < 13) {
										ctx.save();
										ctx.translate(tlx + 15 * sc, tly + 28 * sc);
										ctx.rotate(blockProperties[i][11] < 7 ? -1 : 1);
										ctx.translate(-tlx - 15 * sc, -tly - 28 * sc);
										// ctx.translate(-tlx - (rot+0.5) * scale, -tly - (i+0.9333) * scale);
										ctx.drawImage(svgLevers[(blockProperties[i][11] - 1) % 6], tlx, tly, bs, bs);
										ctx.restore();
									}
									ctx.drawImage(img, tlx + vb[0]*sc, tly + vb[1]*sc, vb[2]*sc, vb[3]*sc);
								} else {
									let sc = bs / vb[2];
									ctx.drawImage(img, 660 + (bdist-bs) + (j%bpr)*bdist - (vb[2]*sc)/2 + bs/2, (selectedTab+1) * tabHeight + (bdist-bs) + Math.floor(j/bpr)*bdist - (vb[3]*sc)/2 + bs/2, vb[2]*sc, vb[3]*sc);
								}
							}
							j++;
						}
					}
					ctx.restore();

					var tabContentsHeight = bdist - bs + Math.floor((j - 1) / bpr + 1) * bdist;
					var scrollBarH = (tabWindowH / tabContentsHeight) * tabWindowH;
					var scrollBarY =
						tabWindowY + (tileTabScrollBar / (tabContentsHeight - tabWindowH)) * (tabWindowH - scrollBarH);
					if (
						!draggingScrollbar &&
						!lcPopUp &&
						onRect(_xmouse, _ymouse, cwidth - 10, scrollBarY, 10, scrollBarH)
					) {
						onScrollbar = true;
						if (mouseIsDown && !pmouseIsDown) {
							draggingScrollbar = true;
							valueAtClick = _ymouse - scrollBarY;
						}
					}
					if (draggingScrollbar) {
						tileTabScrollBar = Math.floor(
							Math.max(
								Math.min(
									((_ymouse - valueAtClick - tabWindowY) / (tabWindowH - scrollBarH)) *
										(tabContentsHeight - tabWindowH),
									tabContentsHeight - tabWindowH
								),
								0
							)
						);
						if (!mouseIsDown) draggingScrollbar = false;
					}
					ctx.fillStyle = '#a0a0a0';
					ctx.fillRect(cwidth - 10, scrollBarY, 10, scrollBarH);
					break;

				case 3:
					// Background
					// let j = 0;
					let bgpr = 2;
					let bgw = 96;
					let bgh = 54;
					let bgdist = 110;
					// let h = _frameCount;
					ctx.save();
					ctx.translate(0, -bgsTabScrollBar);
					for (var i = 0; i < imgBgs.length; i++) {
						if (i == selectedBg) {
							ctx.fillStyle = '#a0a0a0';
							ctx.fillRect(
								660 + (bgdist - bgw) + (i % bgpr) * bgdist - (bgdist - bgw) / 2,
								tabWindowY + (bgdist - bgh) + Math.floor(i / bgpr) * bgdist - (bgdist - bgh) / 2,
								bgw + bgdist - bgw,
								bgh + bgdist - bgh
							);
						} else if (
							mouseOnTabWindow &&
							!lcPopUp &&
							onRect(
								_xmouse,
								_ymouse + bgsTabScrollBar,
								660 + (bgdist - bgw) + (i % bgpr) * bgdist,
								tabWindowY + (bgdist - bgh) + Math.floor(i / bgpr) * bgdist,
								bgw,
								bgh
							)
						) {
							onButton = true;
							ctx.fillStyle = '#dddddd';
							ctx.fillRect(
								660 + (bgdist - bgw) + (i % bgpr) * bgdist - (bgdist - bgw) / 2,
								tabWindowY + (bgdist - bgh) + Math.floor(i / bgpr) * bgdist - (bgdist - bgh) / 2,
								bgw + bgdist - bgw,
								bgh + bgdist - bgh
							);
							if (mouseIsDown && !pmouseIsDown) {
								selectedBg = i;
								setLCBG();
								updateLCtiles();
							}
						}
						// ctx.drawImage(imgBgs[i],
						// 	660 + (bgdist-bgw) + (i%bgpr)*bgdist,
						// 	(selectedTab+1)*tabHeight + (bgdist-bgh) + Math.floor(i/bgpr)*bgdist,
						// 	bgw,
						// 	bgh
						// );
					}
					ctx.drawImage(osc2, 660, tabWindowY, osc2.width / pixelRatio, osc2.height / pixelRatio);
					ctx.restore();

					var tabContentsHeight = bgdist - bgh + Math.floor((i - 1) / bgpr + 1) * bgdist;
					var scrollBarH = (tabWindowH / tabContentsHeight) * tabWindowH;
					var scrollBarY =
						(selectedTab + 1) * tabHeight +
						(bgsTabScrollBar / (tabContentsHeight - tabWindowH)) * (tabWindowH - scrollBarH);
					if (
						!draggingScrollbar &&
						!lcPopUp &&
						onRect(_xmouse, _ymouse, cwidth - 10, scrollBarY, 10, scrollBarH)
					) {
						onScrollbar = true;
						if (mouseIsDown && !pmouseIsDown) {
							draggingScrollbar = true;
							valueAtClick = _ymouse - scrollBarY;
						}
					}
					if (draggingScrollbar) {
						bgsTabScrollBar = Math.floor(
							Math.max(
								Math.min(
									((_ymouse - valueAtClick - tabWindowY) / (tabWindowH - scrollBarH)) *
										(tabContentsHeight - tabWindowH),
									tabContentsHeight - tabWindowH
								),
								0
							)
						);
						if (!mouseIsDown) draggingScrollbar = false;
					}
					ctx.fillStyle = '#a0a0a0';
					ctx.fillRect(cwidth - 10, scrollBarY, 10, scrollBarH);
					break;

				case 4:
					// Dialogue
					var tabContentsHeight = 5;
					for (let i = 0; i < myLevelDialogue[1].length; i++) {
						tabContentsHeight += diaInfoHeight * myLevelDialogue[1][i].linecount + 5;
					}
					var scrollBarH = (tabWindowH / tabContentsHeight) * tabWindowH;
					var scrollBarY =
						(selectedTab + 1) * tabHeight +
						(diaTabScrollBar / (tabContentsHeight == tabWindowH ? 1 : tabContentsHeight - tabWindowH)) *
							(tabWindowH - scrollBarH);
					if (
						!draggingScrollbar &&
						!lcPopUp &&
						onRect(_xmouse, _ymouse, cwidth - 10, scrollBarY, 10, scrollBarH)
					) {
						onScrollbar = true;
						if (mouseIsDown && !pmouseIsDown) {
							draggingScrollbar = true;
							valueAtClick = _ymouse - scrollBarY;
						}
					}
					if (draggingScrollbar) {
						diaTabScrollBar = Math.floor(
							Math.max(
								Math.min(
									((_ymouse - valueAtClick - tabWindowY) / (tabWindowH - scrollBarH)) *
										(tabContentsHeight - tabWindowH),
									tabContentsHeight - tabWindowH
								),
								0
							)
						);
						if (!mouseIsDown) draggingScrollbar = false;
					}
					ctx.fillStyle = '#a0a0a0';
					ctx.fillRect(cwidth - 10, scrollBarY, 10, scrollBarH);
					// ctx.save();
					// ctx.translate(0, -diaTabScrollBar);
					// ctx.textAlign = 'left';
					// ctx.textBaseline = 'middle';
					// ctx.font = '20px Helvetica';
					//myLevelDialogue[1][i].linecount
					dialogueTabCharHover = [-1,0];
					let diaInfoY = (selectedTab + 1) * tabHeight + 5 - diaTabScrollBar;
					for (let i = 0; i < myLevelDialogue[1].length; i++) {
						if ((reorderDiaUp || reorderDiaDown) && onRect(_xmouse,_ymouse - diaTabScrollBar,665,diaInfoY,260,diaInfoHeight * myLevelDialogue[1][i].linecount)) {
							ctx.fillStyle = '#e8e8e8';
							ctx.fillRect(660, diaInfoY - 5, 270, diaInfoHeight * myLevelDialogue[1][i].linecount + 10);
						}
						drawLCDiaInfo(i, diaInfoY);
						if (i >= myLevelDialogue[1].length) break;
						diaInfoY += diaInfoHeight * myLevelDialogue[1][i].linecount + 5;
						// ctx.fillStyle = '#000000';
						// ctx.fillText(myLevelChars[1][i], 660, 60+i*20);
					}
					addButtonPressed = false;
					if (!lcPopUp && onRect(_xmouse,_ymouse,660 + 5,cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20,15,15)) {
						onButton = true;
						hoverText = 'Add New Dialogue Line';
						if (mouseIsDown && !pmouseIsDown) {
							reorderDiaDown = false;
							reorderDiaUp = false;
							editingTextBox = false;
							deselectAllTextBoxes();
							setUndo();
							myLevelDialogue[1].push({char: 99, face: 2, text: 'Enter text', linecount: 1});
							generateDialogueTextBoxes();
						}
						addButtonPressed = true;
					}
					if (!lcPopUp && onRect(_xmouse,_ymouse,660 + 25,cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20,15,15)) {
						if (myLevelChars[1].length < 50) {
							onButton = true;
							hoverText = 'Move Dialogue Line Up';
							if (mouseIsDown && !pmouseIsDown) {
								reorderDiaDown = false;
								reorderDiaUp = true;
								editingTextBox = false;
								deselectAllTextBoxes();
							}
						}
						addButtonPressed = true;
					}
					if (reorderDiaUp && !addButtonPressed && mouseIsDown && !pmouseIsDown) reorderDiaUp = false;
					if (!lcPopUp && onRect(_xmouse,_ymouse,660 + 45,cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20,15,15)) {
						if (myLevelChars[1].length < 50) {
							onButton = true;
							hoverText = 'Move Dialogue Line Down';
							if (mouseIsDown && !pmouseIsDown) {
								reorderDiaUp = false;
								reorderDiaDown = true;
								editingTextBox = false;
								deselectAllTextBoxes();
							}
						}
						addButtonPressed = true;
					}
					if (reorderDiaDown && !addButtonPressed && mouseIsDown && !pmouseIsDown) reorderDiaDown = false;
					if (diaDropdown == -2) diaDropdown = -1;
					if (diaDropdown >= 0) {
						if (diaDropdownType == 0) {
							setUndo();
							if (myLevelDialogue[1][diaDropdown].face == 2) myLevelDialogue[1][diaDropdown].face = 3;
							else if (myLevelDialogue[1][diaDropdown].face == 3)
								myLevelDialogue[1][diaDropdown].face = 2;
							diaDropdown = -2;
						} else if (diaDropdownType == 1) {
							setUndo();
							let allowedDiaCharIndices = [99, 55, 52, 51, 50];
							for (let i = myLevelChars[1].length - 1; i >= 0; i--)
								// if (myLevelChars[1][i][3] > 6)
									allowedDiaCharIndices.push(i);
							let ourCurrentIndex = allowedDiaCharIndices.indexOf(myLevelDialogue[1][diaDropdown].char);
							if (_keysDown[16]) {
								ourCurrentIndex++;
								if (ourCurrentIndex >= allowedDiaCharIndices.length) ourCurrentIndex = 0;
							} else {
								ourCurrentIndex--;
								if (ourCurrentIndex < 0) ourCurrentIndex = allowedDiaCharIndices.length - 1;
							}
							myLevelDialogue[1][diaDropdown].char = allowedDiaCharIndices[ourCurrentIndex];
							diaDropdown = -2;
						} else if (diaDropdownType == 2) {
							if (_keysDown[13]) diaDropdown = -2;
						}

						if (diaDropdown >= 0 && mouseIsDown && !pmouseIsDown && !addButtonPressed) {
							diaDropdown = -2;
						}
					}
					if (diaDropdown < -2) diaDropdown = -diaDropdown - 3;
					// ctx.restore();

					ctx.fillStyle = '#cccccc';
					ctx.fillRect(660, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 25, 65, 25);
					drawAddButton(660 + 5, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20, 15, 0);
					drawUpButton(660 + 25, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20, 15, 1);
					drawDownButton(660 + 45, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 20, 15, 1);
					break;

				case 5:
					// Options
					ctx.font = '23px Helvetica';
					if (drawSimpleButton('Copy String', copyLevelString, 675, tabWindowY + 10, 130, 30, 3, '#ffffff', '#404040', '#666666', '#555555').hover) copyButton = 1;
					drawSimpleButton('Load String', openLevelLoader, 815, tabWindowY + 10, 130, 30, 3, '#ffffff', '#404040', '#666666', '#555555');
					drawSimpleButton('Test Level', testLevelCreator, 675, tabWindowY + 50, 130, 30, 3, '#ffffff', '#404040', '#666666', '#555555');
					// if (enableExperimentalFeatures) {
					let isNew = lcCurrentSavedLevel==-1;
					if (!isNew) ctx.font = '18px Helvetica';
					drawSimpleButton(isNew?'Save Level':'Save Changes', saveLevelCreator, 675, tabWindowY + 90, 130, 30, isNew?3:5, '#ffffff', '#404040', '#666666', '#555555', {enabled:lcChangesMade});
					ctx.font = '23px Helvetica';
					drawSimpleButton('Save Copy', saveLevelCreatorCopy, 815, tabWindowY + 90, 130, 30, 3, '#ffffff', '#404040', '#666666', '#555555', {enabled:!isNew});
					drawSimpleButton('New Blank Level', resetLevelCreator, 675, tabWindowY + 130, 270, 30, 3, '#ffffff', '#404040', '#666666', '#555555');
					drawSimpleButton('My Levels', menuMyLevels, 675, tabWindowY + 170, 270, 30, 3, '#ffffff', '#404040', '#666666', '#555555');
					// }

					drawSimpleButton('Share to Explore', shareToExplore, 675, tabWindowY + 210, 270, 30, 3, '#ffffff', '#404040', '#666666', '#555555');
					drawMenu0Button('EXIT', 846, cheight - 50, false, menuExitLevelCreator, 100);
					// drawMenu2_3Button(0, 837.5, 486.95, menuExitLevelCreator);
					break;
			}

			// Draw Tabs
			ctx.textAlign = 'left';
			ctx.font = '25px Helvetica';
			ctx.textBaseline = 'middle';
			for (let i = 0; i < tabNames.length; i++) {
				if (i % 2 == 0) ctx.fillStyle = '#808080';
				else ctx.fillStyle = '#626262';
				let tabY = i > selectedTab ? cheight - (tabNames.length - i) * tabHeight : i * tabHeight;
				ctx.fillRect(660, tabY, 300, tabHeight);
				ctx.fillStyle = '#ffffff';
				ctx.fillText(tabNames[i], 664, tabY + tabHeight * 0.6);

				if (!lcPopUp && onRect(_xmouse, _ymouse, 660, tabY, 300, tabHeight)) {
					onButton = true;
					if (mouseIsDown && !pmouseIsDown) {
						selectedTab = i;
						draggingScrollbar = false;
						duplicateChar = false;
						reorderCharUp = false;
						reorderCharDown = false;
						reorderDiaUp = false;
						reorderDiaDown = false;
						editingTextBox = false;
						deselectAllTextBoxes();
					}
				}
			}

			// Draw Tools
			for (let i = 0; i < 12; i++) {
				if (i != 8) {
					if (i == tool || (i == 9 && copied)) ctx.fillStyle = '#999999';
					else ctx.fillStyle = '#666666';
					ctx.fillRect(35 + i * 50, 490, 40, 40);
					ctx.drawImage(svgTools[i==10&&undid?8:i], 35 + i*50, 490, svgTools[i].width/scaleFactor, svgTools[i].height/scaleFactor);

					if (!lcPopUp && _ymouse > 480 && onRect(_xmouse, _ymouse, 35 + i * 50, 490, 40, 40)) {
						onButton = true;
						hoverText = toolNames[i];
						if (mouseIsDown && !pmouseIsDown) {
							if (i < 8) {
								setTool(i);
								selectedTab = 2;
								if ((tool == 2 || tool == 3) && blockProperties[selectedTile][9]) {
									setSelectedTile(0);
								}
							} else if (i == 9) copyRect();
							else if (i == 10) undo();
							else if (i == 11) {
								setUndo();
								clearMyLevel(1);
								updateLCtiles();
							}
						}
					}
				}
			}

			if (mouseIsDown && _keysDown[32]) {
				lcPan[0] += _xmouse - _pxmouse;
				lcPan[1] += _ymouse - _pymouse;
				updateLCtiles();
			}

			osctx5.clearRect(0, 0, osc5.width, osc5.height);
			osctx5.save();
			osctx5.translate(lcPan[0], lcPan[1]);
			drawLCTiles();
			drawLCGrid();
			drawLCChars();

			// Dialogue tab mini character popup
			if (selectedTab == 4 && dialogueTabCharHover[0] != -1 && myLevelDialogue[1][dialogueTabCharHover[0]].char < 50) {
				let dialogueTabCharHoverChar = myLevelChars[1][myLevelDialogue[1][dialogueTabCharHover[0]].char][0];
				ctx.fillStyle = '#666666';
				drawArrow(660 + diaInfoHeight - 5, dialogueTabCharHover[1] - 10, 10, 10, 2);
				ctx.fillRect(660 + diaInfoHeight - charInfoHeight/2, dialogueTabCharHover[1] - 10 - charInfoHeight, charInfoHeight, charInfoHeight);

				let charimgmat = charModels[dialogueTabCharHoverChar].charimgmat;
				if (typeof charimgmat !== 'undefined') {
					let charimg = svgChars[dialogueTabCharHoverChar];
					if (Array.isArray(charimg)) charimg = charimg[0];
					let sc = charInfoHeight / 32;
					ctx.save();
					ctx.transform(
						charimgmat.a * sc,
						charimgmat.b,
						charimgmat.c,
						charimgmat.d * sc,
						(charimgmat.tx * sc) / 2 + 660 + diaInfoHeight,
						(charimgmat.ty * sc) / 2 + dialogueTabCharHover[1] - 10 - charInfoHeight/2
					);
					ctx.drawImage(charimg, -charimg.width / (2*scaleFactor), -charimg.height / (2*scaleFactor), charimg.width / scaleFactor, charimg.height / scaleFactor);
					ctx.restore();
				}
			}

			let shiftedXMouse = _xmouse - lcPan[0];
			let shiftedYMouse = _ymouse - lcPan[1];
			if (_keysDown[16]) {
				if (Math.abs(shiftedYMouse - lastClickY) > Math.abs(shiftedXMouse - lastClickX)) shiftedXMouse = lastClickX;
				else shiftedYMouse = lastClickY;
			}
			x = Math.floor((shiftedXMouse - (330 - (scale * levelWidth) / 2)) / scale);
			y = Math.floor((shiftedYMouse - (240 - (scale * levelHeight) / 2)) / scale);
			if (mouseIsDown && !_keysDown[32]) {
				if (selectedTab == 2) {
					if (tool <= 1 && mouseOnGrid()) {
						if (tool == 1) i = 0;
						else i = selectedTile;
						if (i >= 0 && i < blockProperties.length) {
							let redraw = false;
							if (myLevel[1][y][x] != i) {
								myLevel[1][y][x] = i;
								redraw = true;
							}
							if (i == 6 && (x != LCEndGateX || y != LCEndGateY)) {
								if (LCEndGateY != -1) myLevel[1][LCEndGateY][LCEndGateX] = 0;
								LCEndGateX = x;
								LCEndGateY = y;
								setEndGateLights();
								redraw = true;
							}
							if (i == 12 && (x != LCCoinX || y != LCCoinY)) {
								if (LCCoinY != -1) myLevel[1][LCCoinY][LCCoinX] = 0;
								LCCoinX = x;
								LCCoinY = y;
								redraw = true;
							}
							if (redraw) updateLCtiles();
						}
					}
				}
				if ((tool == 2 || (tool == 5 && !copied)) && LCRect[0] != -1 && mouseOnGrid()) {
					if (x != LCRect[2] || y != LCRect[3]) {
						LCRect[2] = Math.min(Math.max(x, 0), levelWidth - 1);
						LCRect[3] = Math.min(Math.max(y, 0), levelHeight - 1);
					}
				}
			}
			if (LCRect[0] != -1)
				drawLCRect(
					Math.min(LCRect[0], LCRect[2]),
					Math.min(LCRect[1], LCRect[3]),
					Math.max(LCRect[0], LCRect[2]),
					Math.max(LCRect[1], LCRect[3])
				);

			if (selectedTab == 2 && mouseOnGrid()) {
				if (tool == 6) {
					// levelCreator.rectSelect.clear();
					let y2;
					let y3;
					osctx5.lineWidth = (2 * scale) / 9;
					if (closeToEdgeY()) {
						osctx5.strokeStyle = '#008000';
						y2 = Math.round((_ymouse - lcPan[1] - (240 - (scale * levelHeight) / 2)) / scale);
						y3 = 0;
					} else {
						osctx5.strokeStyle = '#800000';
						y2 = Math.floor((_ymouse - lcPan[1] - (240 - (scale * levelHeight) / 2)) / scale);
						y3 = 0.5;
					}
					osctx5.beginPath();
					osctx5.moveTo(330 - (scale * levelWidth) / 2, 240 - (scale * levelHeight) / 2 + scale * (y2 + y3));
					osctx5.lineTo(330 + (scale * levelWidth) / 2, 240 - (scale * levelHeight) / 2 + scale * (y2 + y3));
					osctx5.stroke();
				} else if (tool == 7) {
					// levelCreator.rectSelect.clear();
					let x2;
					let x3;
					osctx5.lineWidth = (2 * scale) / 9;
					if (closeToEdgeX()) {
						osctx5.strokeStyle = '#008000';
						x2 = Math.round((_xmouse - lcPan[0] - (330 - (scale * levelWidth) / 2)) / scale);
						x3 = 0;
					} else {
						osctx5.strokeStyle = '#800000';
						x2 = Math.floor((_xmouse - lcPan[0] - (330 - (scale * levelWidth) / 2)) / scale);
						x3 = 0.5;
					}
					osctx5.beginPath();
					osctx5.moveTo(330 - (scale * levelWidth) / 2 + scale * (x2 + x3), 240 - (scale * levelHeight) / 2);
					osctx5.lineTo(330 - (scale * levelWidth) / 2 + scale * (x2 + x3), 240 + (scale * levelHeight) / 2);
					osctx5.stroke();
				}
			}
			ctx.drawImage(osc5, 0, 0, 660, 480);
			osctx5.restore();
			// else if (tool == 6 || tool == 7) {
			// 	levelCreator.rectSelect.clear();
			// }

			// for (let i = 0; i < 6; i++) {
			// 	y = i * 40;
			// 	if (i > selectedTab) {
			// 		y += 300;
			// 	}
			// 	if (Math.abs(levelCreator.sideBar["tab" + (i + 1)]._y - y) < 0.5) {
			// 		levelCreator.sideBar["tab" + (i + 1)]._y = y;
			// 	} else {
			// 		levelCreator.sideBar["tab" + (i + 1)]._y += (y - levelCreator.sideBar["tab" + (i + 1)]._y) * 0.2;
			// 	}
			// }

			if (lcPopUp && !lcPopUpNextFrame) {
				if (lcPopUpType == 0) {
					ctx.globalAlpha = 0.2;
					ctx.fillStyle = '#000000';
					ctx.fillRect(0, 0, cwidth, cheight);
					ctx.globalAlpha = 1;
					let lcPopUpW = 750;
					let lcPopUpH = 540;
					ctx.fillStyle = '#eaeaea';
					ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);
					if (
						mouseIsDown &&
						!pmouseIsDown &&
						!onRect(_xmouse, _ymouse, (cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH)
					) {
						lcPopUp = false;
						editingTextBox = false;
						deselectAllTextBoxes();
						levelLoadString = '';
					}
					ctx.fillStyle = '#000000';
					ctx.font = '20px Helvetica';
					ctx.textBaseline = 'top';
					ctx.textAlign = 'left';
					ctx.fillText(
						"Paste your level's string here:",
						(cwidth - lcPopUpW) / 2 + 10,
						(cheight - lcPopUpH) / 2 + 5
					);
					textBoxes[0][2].x = (cwidth - lcPopUpW) / 2 + 10;
					textBoxes[0][2].y = (cheight - lcPopUpH) / 2 + 30;
					textBoxes[0][2].w = lcPopUpW - 30;
					textBoxes[0][2].h = lcPopUpH - 80;
					textBoxes[0][2].draw();
					levelLoadString = textBoxes[0][2].text;

					ctx.font = '18px Helvetica';
					ctx.textAlign = 'center';
					ctx.fillStyle = '#a0a0a0';
					ctx.fillRect(
						(cwidth - lcPopUpW) / 2 + lcPopUpW - 140,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 40,
						60,
						30
					);
					ctx.fillStyle = '#ffffff';
					ctx.fillText(
						'Cancel',
						(cwidth - lcPopUpW) / 2 + lcPopUpW - 110,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 33
					);
					ctx.fillStyle = '#00a0ff';
					ctx.fillRect(
						(cwidth - lcPopUpW) / 2 + lcPopUpW - 70,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 40,
						60,
						30
					);
					ctx.fillStyle = '#ffffff';
					ctx.fillText(
						'Load',
						(cwidth - lcPopUpW) / 2 + lcPopUpW - 40,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 33
					);
					if (
						onRect(
							_xmouse,
							_ymouse,
							(cwidth - lcPopUpW) / 2 + lcPopUpW - 140,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 40,
							60,
							30
						)
					) {
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) {
							lcPopUp = false;
							editingTextBox = false;
							deselectAllTextBoxes();
							levelLoadString = '';
						}
					} else if (
						onRect(
							_xmouse,
							_ymouse,
							(cwidth - lcPopUpW) / 2 + lcPopUpW - 70,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 40,
							60,
							30
						)
					) {
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) {
							readLevelString(levelLoadString);
							lcPopUp = false;
							editingTextBox = false;
							deselectAllTextBoxes();
							levelLoadString = '';
						}
					}
				}
			}

			if (lcMessageTimer > 0) {
				if (lcMessageTimer > 50) ctx.globalAlpha = (100 - lcMessageTimer) / 50;
				ctx.font = '25px Helvetica';
				ctx.textBaseline = 'middle';
				ctx.textAlign = 'center';
				ctx.fillStyle = '#ffffff';
				let lcMessageLines = lcMessageText.split('\n');
				lcMessageLines.forEach((v, i) => {
					lcMessageLines[i] = ctx.measureText(v).width + 10;
				});
				let msgWidth = Math.max(...lcMessageLines);
				let msgHeight = 25 * lcMessageLines.length + 5;
				// let msgWidth = ctx.measureText(lcMessageText).width+10;
				ctx.fillRect((cwidth - msgWidth) / 2, (cheight - 30) / 2, msgWidth, msgHeight);
				ctx.fillStyle = '#000000';
				linebreakText(lcMessageText, cwidth / 2, cheight / 2, 25);
				lcMessageTimer++;
				if (lcMessageTimer > 100) {
					lcMessageTimer = 0;
				}
				ctx.globalAlpha = 1;
			}

			levelTimer++;
			if (lcPopUpNextFrame) lcPopUp = true;
			lcPopUpNextFrame = false;
			break;

		case 6:
			// Explore main page

			ctx.drawImage(svgMenu6, 0, 0, cwidth, cheight);
			ctx.fillStyle = '#666666';

			// Tabs
			ctx.font = 'bold 35px Helvetica';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			let tabx = 28;
			for (let i = 0; i < exploreTabWidths.length; i++) {
				if (i == exploreTab) ctx.fillStyle = '#666666';
				else if (onRect(_xmouse, _ymouse, tabx, 20, exploreTabWidths[i], 45)) {
					ctx.fillStyle = '#b3b3b3';
					if (mouseIsDown && !pmouseIsDown) {
						exploreTab = i;
						if (exploreTab == 2) exploreSearchInput = '';
						setExplorePage(1);
					}
				} else ctx.fillStyle = '#999999';
				ctx.fillRect(tabx, 20, exploreTabWidths[i], 45);
				ctx.fillStyle = '#ffffff';
				ctx.fillText(exploreTabNames[i], tabx + exploreTabWidths[i] / 2, 45);
				// exploreTabNames[i];
				tabx += exploreTabWidths[i] + 5;
			}

			// Levels
			if (exploreLoading) {
				drawExploreLoadingText();
			} else {
				for (let i = 0; i < explorePageLevels.length; i++) {
					drawExploreLevel(232 * (i % 4) + 28, Math.floor(i / 4) * 182 + (exploreTab==2?140:130), i, exploreTab==1?1:0, 0);
				}
			}


			if (exploreTab == 2) {
				textBoxes[0][0].draw();
				exploreSearchInput = textBoxes[0][0].text;

				if (onRect(_xmouse, _ymouse, 877, 75, 55, 55)) {
					ctx.fillStyle = '#404040';
					onButton = true;
					if (mousePressedLastFrame) setExplorePage(1);
				} else ctx.fillStyle = '#333333';
				ctx.fillRect(877, 75, 55, 55);

				// Magnifying glass
				ctx.strokeStyle = '#ffffff';
				ctx.lineWidth = 5;
				ctx.beginPath();
				ctx.arc(909, 98, 13, -1.25 * Math.PI, 0.75 * Math.PI);
				ctx.lineTo(887, 120);
				ctx.stroke();
			}

			if (exploreTab != 2) { // Sort and pages aren't supported for search yet
				// Sort by
				if (onRect(_xmouse, _ymouse, 932-exploreSortTextWidth, 85, exploreSortTextWidth, 30)) {
					ctx.fillStyle = '#404040';
					onButton = true;
					if (mouseIsDown && !pmouseIsDown) {
						exploreSort = (exploreSort + 1) % exploreSortText.length;
						setExplorePage(1);
					}
				} else ctx.fillStyle = '#333333';
				ctx.fillRect(932-exploreSortTextWidth, 85, exploreSortTextWidth, 30);
				ctx.textBaseline = 'top';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#ffffff';
				ctx.font = '24px Helvetica';
				ctx.fillText('Sort by: ' + exploreSortText[exploreSort], 932-exploreSortTextWidth + 5, 88);

				// Page number
				ctx.textAlign = 'center';
				ctx.font = '30px Helvetica';
				ctx.fillText(explorePage, cwidth / 2, 490);

				// Previous page button
				if (explorePage <= 1 || exploreLoading) ctx.fillStyle = '#505050';
				else if (onRect(_xmouse, _ymouse, 227.5, 487, 25, 30)) {
					ctx.fillStyle = '#cccccc';
					onButton = true;
					if (mouseIsDown && !pmouseIsDown) setExplorePage(explorePage - 1);
				} else ctx.fillStyle = '#999999';
				drawArrow(227.5, 487, 25, 30, 3);

				// Next page button
				if (exploreLoading) ctx.fillStyle = '#505050';
				else if (onRect(_xmouse, _ymouse, 707.5, 487, 25, 30)) {
					ctx.fillStyle = '#cccccc';
					onButton = true;
					if (mouseIsDown && !pmouseIsDown) setExplorePage(explorePage + 1);
				} else ctx.fillStyle = '#999999';
				drawArrow(707.5, 487, 25, 30, 1);
			}

			drawMenu2_3Button(1, 837.5, 486.95, menu2Back);
			// if (enableExperimentalFeatures) drawMenu2_3Button(2, 10, 486.95, logInExplore);
			if (loggedInExploreUser5beamID === -1) {
				drawMenu0Button('LOG IN', 540, 20, false, logInExplore, 120);
			} else {
				drawMenu0Button('LOG OUT', 520, 20, false, logOutExplore, 150);
			}
			break;

		case 7:
			// Explore level page
			lcPopUpNextFrame = false;

			ctx.fillStyle = '#666666';
			ctx.fillRect(0, 0, cwidth, cheight);
			if (exploreLoading) {
				drawExploreLoadingText();
			} else {
				ctx.textBaseline = 'top';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#b0b0b0';
				ctx.font = '18px Helvetica';
				ctx.fillText('by ' + exploreLevelPageLevel.creator.username, 31.85, 68);

				let showImpossibleNotice = false;
				if (editingExploreLevel) {
					textBoxes[0][1].draw();
					textBoxes[0][2].draw();
					if (!lcPopUp && onRect(_xmouse, _ymouse, 30, 347, 188, 26)) {
						ctx.fillStyle = '#404040';
						onButton = true;
						if (pmouseIsDown && !mouseIsDown && onRect(lastClickX, lastClickY, 30, 347, 188, 26)) {
							exploreLevelPageLevel.difficulty = (exploreLevelPageLevel.difficulty + 1) % difficultyMap.length;
						}
						if (exploreLevelPageLevel.difficulty == 7) {
							showImpossibleNotice = true;
						}
					} else ctx.fillStyle = '#333333';
					ctx.fillRect(30, 347, 188, 26);
				} else {
					ctx.fillStyle = '#ffffff';
					ctx.font = '38px Helvetica';
					ctx.fillText(exploreLevelPageLevel.title, 29.15, 27.4);

					ctx.fillStyle = '#ffffff';
					ctx.font = '20px Helvetica';
					wrapText(exploreLevelPageLevel.description, 430, 98, 500, 22);
				}

				ctx.fillStyle = '#333333';
				ctx.font = 'italic 18px Helvetica';
				ctx.fillText('created ' + exploreLevelPageLevel.created.slice(0,10), 31.85, 325);

				// Views icon & counter
				ctx.fillStyle = '#47cb46';
				ctx.font = 'bold 18px Helvetica';
				ctx.textAlign = 'right';

				let pluralViewText = exploreLevelPageLevel.plays === 1
				ctx.fillText(exploreLevelPageLevel.plays + (pluralViewText ? ' play' : ' plays'), 410, 325);
				ctx.textAlign = 'left';

				// Difficulty in levelpacks arent supported yet
				if (exploreLevelPageType === 0) {
					// difficulty circle
					ctx.beginPath();
					ctx.arc(40, 360, 8, 0, 2 * Math.PI);
					ctx.fillStyle = (editingExploreLevel && exploreLevelPageLevel.difficulty == 7)?'#ffffff':difficultyMap[exploreLevelPageLevel.difficulty][1];
					ctx.closePath();
					ctx.fill();

					ctx.fillText(difficultyMap[exploreLevelPageLevel.difficulty][0], 54, 352);
				}

				ctx.drawImage(thumbBig, 30, 98, 384, 216);
				if (editingExploreLevel) {
					if (!lcPopUp && onRect(_xmouse, _ymouse, 34, 102, 52, 52)) {
						ctx.fillStyle = '#404040';
						onButton = true;
						if (pmouseIsDown && !mouseIsDown && onRect(lastClickX, lastClickY, 34, 102, 52, 52)) {
							lcPopUpNextFrame = true;
						}
						if (exploreLevelPageLevel.difficulty == 7) {
							showImpossibleNotice = true;
						}
					} else ctx.fillStyle = '#333333';
					ctx.beginPath();
					ctx.arc(60, 128, 26, 0, 2 * Math.PI);
					ctx.closePath();
					ctx.fill();
					ctx.drawImage(svgTools[0], 40, 108);

				}

				ctx.font = '20px Helvetica';
				if (!showingExploreNewGame2) {
					drawSimpleButton(exploreLevelPageType===0?'Play Level':'New Game', playExploreLevel===0?playExploreLevel:openExploreNewGame2, 30, 379, 188, 30, 3, '#ffffff', '#404040', '#808080', '#808080');

					if (exploreLevelPageType != 0) {
						drawSimpleButton('Continue Game', continueExploreLevelpack, 30, 417, 188, 30, 3, '#ffffff', '#404040', '#808080', '#808080', {enabled:typeof levelpackProgress[exploreLevelPageLevel.id] !== 'undefined'});
					}
				} else {
					drawSimpleButton('Yes', exploreNewGame2yes, 30, 417, 90, 30, 3, '#ffffff', '#404040', '#808080', '#808080');
					drawSimpleButton('No', exploreNewGame2no, 128, 417, 90, 30, 3, '#ffffff', '#404040', '#808080', '#808080');
					ctx.fillStyle ='#ffffff';
					ctx.textBaseline = 'middle';
					ctx.fillText('Are you sure?', 124, 396);
				}

				if (drawSimpleButton('Copy Link', exploreCopyLink, 226, 379, 188, 30, 3, '#ffffff', '#404040', '#808080', '#808080').hover) copyButton = 3;
				drawSimpleButton('More By This User', exploreMoreByThisUser, 226, 417, 188, 30, 3, '#ffffff', '#404040', '#808080', '#808080');

				if (exploreLevelPageType != 1 && loggedInExploreUser5beamID === exploreLevelPageLevel.creator.id) {
					drawSimpleButton(editingExploreLevel?'Save Changes':'Edit', editExploreLevel, 226, 455, 188, 30, 3, '#ffffff', '#404040', '#808080', '#808080');
					if (editingExploreLevel) {
						drawSimpleButton('Cancel', cancelEditExploreLevel, 226, 493, 188, 30, 3, '#ffffff', '#404040', '#808080', '#808080');
						;
					}
				}

				if (showImpossibleNotice && !lcPopUp) {
					ctx.fillStyle = '#a0a0a0';
					ctx.fillRect(_xmouse + 10, _ymouse, 400, 73);
					ctx.font = '16px Helvetica';
					ctx.fillStyle = '#000000';
					ctx.textAlign = 'left';
					ctx.textBaseline = 'top';
					wrapText('Warning: The "Impossible" difficulty is only for levels which are, without a doubt, impossible to complete. In the future, these levels may be put on a separate page.', _xmouse + 15, _ymouse + 5, 390, 16);
				}
			}

			drawMenu2_3Button(1, 837.5, 486.95, menuExploreLevelPageBack);

			if (lcPopUp && !lcPopUpNextFrame) {
				if (lcPopUpType == 0) {
					ctx.globalAlpha = 0.2;
					ctx.fillStyle = '#000000';
					ctx.fillRect(0, 0, cwidth, cheight);
					ctx.globalAlpha = 1;
					let lcPopUpW = 750;
					let lcPopUpH = 540;
					ctx.fillStyle = '#eaeaea';
					ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);
					if (
						mouseIsDown &&
						!pmouseIsDown &&
						!onRect(_xmouse, _ymouse, (cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH)
					) {
						lcPopUp = false;
						editingTextBox = false;
						deselectAllTextBoxes();
						levelLoadString = '';
					}
					ctx.fillStyle = '#000000';
					ctx.font = '20px Helvetica';
					ctx.textBaseline = 'top';
					ctx.textAlign = 'left';
					ctx.fillText(
						'You can modify your level\'s data for small changes. Paste your new string here:',
						(cwidth - lcPopUpW) / 2 + 10,
						(cheight - lcPopUpH) / 2 + 5
					);
					textBoxes[0][3].x = (cwidth - lcPopUpW) / 2 + 10;
					textBoxes[0][3].y = (cheight - lcPopUpH) / 2 + 30;
					textBoxes[0][3].w = lcPopUpW - 30;
					textBoxes[0][3].h = lcPopUpH - 80;
					textBoxes[0][3].draw();
					// levelLoadString = textBoxes[0][3].text;

					ctx.font = '18px Helvetica';
					drawSimpleButton('Save', confirmChangeLevelString, (cwidth - lcPopUpW) / 2 + lcPopUpW - 70, (cheight + lcPopUpH) / 2 - 40, 60, 30, 3, '#ffffff', '#00a0ff', '#40a0ff', '#40a0ff', {isOnPopUp:true});
					drawSimpleButton('Cancel', cancelChangeLevelString, (cwidth - lcPopUpW) / 2 + lcPopUpW - 140, (cheight + lcPopUpH) / 2 - 40, 60, 30, 3, '#ffffff', '#a0a0a0', '#a0a0a0', '#a0a0a0', {isOnPopUp:true});
				}
			}

			if (lcPopUpNextFrame) lcPopUp = true;
			lcPopUpNextFrame = false;
			break;
		case 8:
			// Explore user page
			ctx.drawImage(svgMenu6, 0, 0, cwidth, cheight);

			// Username
			ctx.textBaseline = 'bottom';
			ctx.textAlign = 'left';
			ctx.fillStyle = '#ffffff';
			ctx.font = 'bold 36px Helvetica';
			ctx.fillText(exploreUser.username, 10, 60);

			ctx.font = '21px Helvetica';

			if (exploreLoading) {
				drawExploreLoadingText();
			} else {
				// Levels
				for (let j = 0; j < 2; j++) {
					let y = j * 205 + 115;

					ctx.textBaseline = 'bottom';
					ctx.textAlign = 'left';
					ctx.fillStyle = '#ffffff';
					ctx.font = '25px Helvetica';
					ctx.fillText(j==0?'Levels':'Levelpacks', 55, y-3);

					// Previous page button
					if (exploreUserPageNumbers[j] <= 1 || exploreLoading) ctx.fillStyle = '#505050';
					else if (onRect(_xmouse, _ymouse, 15, y + 60, 25, 30)) {
						ctx.fillStyle = '#cccccc';
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) setExploreUserPage(j, exploreUserPageNumbers[j] - 1);
					} else ctx.fillStyle = '#999999';
					drawArrow(15, y + 60, 25, 30, 3);

					// Next page button
					if (exploreLoading) ctx.fillStyle = '#505050';
					else if (onRect(_xmouse, _ymouse, 920, y + 60, 25, 30)) {
						ctx.fillStyle = '#cccccc';
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) setExploreUserPage(j, exploreUserPageNumbers[j] + 1);
					} else ctx.fillStyle = '#999999';
					drawArrow(920, y + 60, 25, 30, 1);

					for (let i = 0; i < exploreUserPageLevels[j].length; i++) {
						drawExploreLevel(214 * i + 55, y, i+j*4, (i+j*4)>=4?1:0, 1);
					}
				}
			}

			drawMenu2_3Button(0, 837.5, 486.95, menu8Menu);
			break;

		case 9:
			// Options menu
			ctx.fillStyle = '#666666';
			ctx.fillRect(0, 0, cwidth, cheight);

			ctx.textBaseline = 'top';
			ctx.font = '26px Helvetica';

			for (var i = 0; i < optionText.length; i++) {
				let y = i*50 + 150;
				ctx.fillStyle = '#444444';
				ctx.fillRect(590, y, 50, 28);
				ctx.fillStyle = '#ffffff';
				ctx.textAlign = 'right';
				ctx.fillText(optionText[i], 580, y+2);
				ctx.textAlign = 'center';
				let thisOptionValue;
				switch (i) {
					case 0:
						thisOptionValue = screenShake;
						break;
					case 1:
						thisOptionValue = screenFlashes;
						break;
					case 2:
						thisOptionValue = quirksMode;
						break;
					case 3:
						thisOptionValue = enableExperimentalFeatures;
						break;
					case 4:
						thisOptionValue = frameRateThrottling;
						break;
					case 5:
						thisOptionValue = slowTintsEnabled;
				}
				ctx.fillStyle = thisOptionValue?'#00ff00':'#ff0000';
				ctx.fillText(thisOptionValue?'on':'off', 615, y+2);

				if (onRect(_xmouse, _ymouse, 590, y, 50, 28)) {
					onButton = true;
					if (mouseIsDown && !pmouseIsDown) {
						switch (i) {
							case 0:
								screenShake = !screenShake;
								break;
							case 1:
								screenFlashes = !screenFlashes;
								break;
							case 2:
								quirksMode = !quirksMode;
								break;
							case 3:
								enableExperimentalFeatures = !enableExperimentalFeatures;
								break;
							case 4:
								frameRateThrottling = !frameRateThrottling;
								break;
							case 5:
								slowTintsEnabled = !slowTintsEnabled;
								break;
						}
					}
				}
			}

			drawMenu2_3Button(1, 837.5, 486.95, menuExitOptions);
			break;

		case 10:
			lcPopUpNextFrame = false;
			ctx.fillStyle = '#666666';
			ctx.fillRect(0, 0, cwidth, cheight);
			ctx.fillStyle = '#808080';
			ctx.fillRect(0, 0, cwidth, 65);

			if (levelpackAddScreen) {
				ctx.font = 'bold 35px Helvetica';
				ctx.textAlign = 'left';
				ctx.textBaseline = 'bottom';
				ctx.fillStyle = '#ffffff';
				ctx.fillText('Select a level to add', 28, 55);
			} else {
				ctx.font = '26px Helvetica';
				ctx.textAlign = 'right';
				ctx.textBaseline = 'bottom';
				ctx.fillStyle = '#ffffff';
				ctx.fillText(deletingMyLevels?'click the trash can to exit delete mode':'click on a level or levelpack to edit it', cwidth-28, 60);

				// Tabs
				ctx.font = 'bold 35px Helvetica';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				let tabx2 = 28; // had to give this a different name from the variable used in the menu 6 case.
				for (let i = 0; i < 2; i++) {
					if (i == myLevelsTab) ctx.fillStyle = '#666666';
					else if (onRect(_xmouse, _ymouse, tabx2, 20, exploreTabWidths[i], 45)) {
						ctx.fillStyle = '#b3b3b3';
						if (mouseIsDown && !pmouseIsDown) {
							myLevelsTab = i;
							setMyLevelsPage(0);
						}
					} else ctx.fillStyle = '#999999';
					ctx.fillRect(tabx2, 20, exploreTabWidths[i], 45);
					ctx.fillStyle = '#ffffff';
					ctx.fillText(exploreTabNames[i], tabx2 + exploreTabWidths[i] / 2, 45);
					// exploreTabNames[i];
					tabx2 += exploreTabWidths[i] + 5;
				}

				// delete button
				ctx.font = '23px Helvetica';
				drawSimpleButton('', toggleMyLevelDeleting, 28, 85, 30, 30, 3, '#ffffff', '#ff0000', '#ff4040', '#ff4040', {alt:myLevelsTab===0?'Delete levels':'Delete levelpacks'});
				ctx.drawImage(svgMyLevelsIcons[0], 28, 85, svgMyLevelsIcons[0].width/scaleFactor, svgMyLevelsIcons[0].height/scaleFactor);
				if (myLevelsTab === 1) {
					// create levelpack button
					ctx.font = '23px Helvetica';
					drawSimpleButton('', createNewLevelpack, 68, 85, 30, 30, 3, '#ffffff', '#00a0ff', '#40a0ff', '#40a0ff', {alt:'Create new levelpack'});
					ctx.drawImage(svgMyLevelsIcons[1], 68, 85, svgMyLevelsIcons[1].width/scaleFactor, svgMyLevelsIcons[1].height/scaleFactor);
				}
			}

			// The levels themselves
			for (let i = 0; i < explorePageLevels.length; i++) {
				drawExploreLevel(232 * (i % 4) + 28, Math.floor(i / 4) * 182 + 130, i, myLevelsTab, 2);
			}

			// Page number
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.font = '30px Helvetica';
			ctx.fillText((myLevelsPage + 1) + ' / ' + myLevelsPageCount, cwidth / 2, 490);

			// Previous page button
			if (myLevelsPage <= 0) ctx.fillStyle = '#505050';
			else if (onRect(_xmouse, _ymouse, 227.5, 487, 25, 30)) {
				ctx.fillStyle = '#cccccc';
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) setMyLevelsPage(myLevelsPage - 1);
			} else ctx.fillStyle = '#999999';
			drawArrow(227.5, 487, 25, 30, 3);

			// Next page button
			if (myLevelsPage >= myLevelsPageCount - 1) ctx.fillStyle = '#505050';
			else if (onRect(_xmouse, _ymouse, 707.5, 487, 25, 30)) {
				ctx.fillStyle = '#cccccc';
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) setMyLevelsPage(myLevelsPage + 1);
			} else ctx.fillStyle = '#999999';
			drawArrow(707.5, 487, 25, 30, 1);

			if (lcPopUp && !lcPopUpNextFrame) {
				ctx.globalAlpha = 0.2;
				ctx.fillStyle = '#000000';
				ctx.fillRect(0, 0, cwidth, cheight);
				ctx.globalAlpha = 1;
				let lcPopUpW = 350;
				let lcPopUpH = 150;
				ctx.fillStyle = '#eaeaea';
				ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);
				if (mousePressedLastFrame && !onRect(_xmouse, _ymouse, (cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH) ) cancelDeleteLevel();

				ctx.fillStyle = '#000000';
				ctx.font = '20px Helvetica';
				ctx.textBaseline = 'top';
				ctx.textAlign = 'left';
				wrapText((myLevelsTab===0)?('Are you sure you want to delete the level "' + lcSavedLevels[levelToDelete].title):('Are you sure you want to delete the levelpack "' + lcSavedLevelpacks[levelToDelete].title) + '"? This action can not be undone.', (cwidth - lcPopUpW) / 2 + 10, (cheight - lcPopUpH) / 2 + 5, lcPopUpW - 20, 22);

				drawSimpleButton('Cancel', cancelDeleteLevel, cwidth/2 - 125, (cheight + lcPopUpH) / 2 - 40, 100, 30, 3, '#ffffff', '#a0a0a0', '#c0c0c0', '#c0c0c0', {isOnPopUp:true});
				drawSimpleButton('Delete', confirmDeleteLevel, cwidth/2 + 25, (cheight + lcPopUpH) / 2 - 40, 100, 30, 3, '#ffffff', '#ff0000', '#ff8080', '#ffa0a0', {isOnPopUp:true});
			}


			if (lcPopUpNextFrame) lcPopUp = true; // Why did I decide to do it like this
			lcPopUpNextFrame = false;
			drawMenu2_3Button(1, 837.5, 486.95, levelpackAddScreen?menuLevelpackAddScreenBack:menuMyLevelsBack);
			break;

		case 11:
			// Levelpack Creator
			lcPopUpNextFrame = false;
			copyButton = 0;
			ctx.fillStyle = '#666666';
			ctx.fillRect(0, 0, cwidth, cheight);

			let wasEditingBefore = editingTextBox;
			textBoxes[0][0].draw();
			lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].title = textBoxes[0][0].text;
			if (wasEditingBefore && !editingTextBox) saveMyLevelpacks();
			drawSimpleButton('', openEditLevelpackDescriptionDialog, 877, 15, 55, 55, 3, '#ffffff', '#333333', '#404040', '#404040', {alt:'Remove levels'});
			ctx.drawImage(svgMyLevelsIcons[1], 877, 15, 55, 55);


			drawSimpleButton('', toggleLevelpackCreatorRemovingLevels, 28, 85, 30, 30, 3, '#ffffff', '#ff0000', '#ff4040', '#ff4040', {alt:'Remove levels'});
			ctx.drawImage(svgMyLevelsIcons[0], 28, 85, svgMyLevelsIcons[0].width/scaleFactor, svgMyLevelsIcons[0].height/scaleFactor);

			drawSimpleButton('', openAddLevelsToLevelpackScreen, 68, 85, 30, 30, 3, '#ffffff', '#00a0ff', '#40a0ff', '#40a0ff', {alt:'Add levels'});
			ctx.drawImage(svgMyLevelsIcons[1], 68, 85, svgMyLevelsIcons[1].width/scaleFactor, svgMyLevelsIcons[1].height/scaleFactor);

			if (drawSimpleButton('', copySavedLevelpackString, 108, 85, 30, 30, 3, '#ffffff', '#00a0ff', '#40a0ff', '#40a0ff', {alt:'Copy levelpack string'}).hover) copyButton = 2;
			ctx.drawImage(svgMyLevelsIcons[2], 108, 85, svgMyLevelsIcons[2].width/scaleFactor, svgMyLevelsIcons[2].height/scaleFactor);

			drawSimpleButton('', playSavedLevelpack, 148, 85, 30, 30, 3, '#ffffff', '#00a0ff', '#40a0ff', '#40a0ff', {alt:'Play levelpack'});
			ctx.drawImage(svgMyLevelsIcons[4], 148, 85, svgMyLevelsIcons[4].width/scaleFactor, svgMyLevelsIcons[4].height/scaleFactor);

			ctx.font = '23px Helvetica';
			drawSimpleButton('Share to Explore', sharePackToExplore, 188, 85, 200, 30, 3, '#ffffff', '#00a0ff', '#40a0ff', '#40a0ff', {alt:'Share levelpack to exlore'});
			// ctx.drawImage(svgMyLevelsIcons[3], 188, 85);

			if (levelpackCreatorRemovingLevels) {
				ctx.font = '26px Helvetica';
				ctx.textAlign = 'right';
				ctx.textBaseline = 'top';
				ctx.fillStyle = '#ffffff';
				ctx.fillText('click the trash can to exit delete mode', cwidth-28, 85);
			}


			// The levels themselves
			for (let i = 0; i < explorePageLevels.length; i++) {
				drawExploreLevel(232 * (i % 4) + 28, Math.floor(i / 4) * 182 + 130, i, 0, 3);
			}

			// Maybe I should put these in a function so I don't have to keep copy-pasteing them.
			// Page number
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.font = '30px Helvetica';
			ctx.fillText((levelpackCreatorPage + 1) + ' / ' + levelpackCreatorPageCount, cwidth / 2, 490);

			// Previous page button
			if (levelpackCreatorPage <= 0) ctx.fillStyle = '#505050';
			else if (onRect(_xmouse, _ymouse, 227.5, 487, 25, 30)) {
				ctx.fillStyle = '#cccccc';
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) setLevelpackCreatorPage(levelpackCreatorPage - 1);
			} else ctx.fillStyle = '#999999';
			drawArrow(227.5, 487, 25, 30, 3);

			// Next page button
			if (levelpackCreatorPage >= levelpackCreatorPageCount - 1) ctx.fillStyle = '#505050';
			else if (onRect(_xmouse, _ymouse, 707.5, 487, 25, 30)) {
				ctx.fillStyle = '#cccccc';
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) setLevelpackCreatorPage(levelpackCreatorPage + 1);
			} else ctx.fillStyle = '#999999';
			drawArrow(707.5, 487, 25, 30, 1);

			drawMenu2_3Button(1, 837.5, 486.95, menuLevelpackCreatorBack);

			if (lcPopUp && !lcPopUpNextFrame) {
				ctx.globalAlpha = 0.2;
				ctx.fillStyle = '#000000';
				ctx.fillRect(0, 0, cwidth, cheight);
				ctx.globalAlpha = 1;
				let lcPopUpW = 750;
				let lcPopUpH = 500;

				ctx.fillStyle = '#eaeaea';
				ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);
				if (mousePressedLastFrame && !onRect(_xmouse, _ymouse, (cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH) ) closeLevelpackDescriptionDialog();

				
				ctx.fillStyle = '#000000';
				ctx.font = '20px Helvetica';
				ctx.textBaseline = 'top';
				ctx.textAlign = 'left';
				ctx.fillText("Levelpack description:", (cwidth - lcPopUpW) / 2 + 10, (cheight - lcPopUpH) / 2 + 5);
				textBoxes[0][1].x = (cwidth - lcPopUpW) / 2 + 10;
				textBoxes[0][1].y = (cheight - lcPopUpH) / 2 + 30;
				textBoxes[0][1].w = lcPopUpW - 30;
				textBoxes[0][1].h = lcPopUpH - 80;
				textBoxes[0][1].draw();
				lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].description = textBoxes[0][1].text;

				ctx.font = '18px Helvetica';
				drawSimpleButton('Done', closeLevelpackDescriptionDialog, (cwidth - lcPopUpW) / 2 + 10, (cheight + lcPopUpH) / 2 - 40, 60, 30, 3, '#ffffff', '#00a0ff', '#40a0ff', '#40a0ff', {isOnPopUp:true});
			}

			if (lcPopUpNextFrame) lcPopUp = true;
			lcPopUpNextFrame = false;
			break;
	}

	if (levelTimer <= 30 || menuScreen != 3) {
		if (wipeTimer >= 30 && wipeTimer <= 60) {
			whiteAlpha = 220 - wipeTimer * 4;
		}
	} else whiteAlpha = 0;
	if (wipeTimer == 29 && menuScreen == 3 && (charsAtEnd >= charCount2 || transitionType == 0)) whiteAlpha = 100;
	if (wipeTimer >= 60) wipeTimer = 0;
	if (wipeTimer >= 1) wipeTimer++;

	ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	if (pmenuScreen == 2) {
		drawLevelMapBorder();
	} else if (pmenuScreen == 3) {
		if (cutScene == 1 || cutScene == 2) {
			drawCutScene();
		}
		drawLevelButtons();
		if (menuScreen != 3) {
			cameraX = 0;
			cameraY = 0;
			shakeX = 0;
			shakeY = 0;
		}
	}
	if (whiteAlpha > 0 && screenFlashes) {
		ctx.fillStyle = '#ffffff';
		ctx.globalAlpha = whiteAlpha / 100;
		ctx.fillRect(0, 0, cwidth, cheight);
		ctx.globalAlpha = 1;
	}

	if (draggingScrollbar) setCursor('grabbing');
	else if (onScrollbar) setCursor('grab');
	else if (onButton) setCursor('pointer');
	else if (onTextBox) setCursor('text');
	else setCursor('auto');
	setHoverText();

	ctxReal.drawImage(canvas, 0, 0, cwidth, cheight);

	_frameCount++;
	pmouseIsDown = mouseIsDown;
	_pxmouse = _xmouse;
	_pymouse = _ymouse;
	pmenuScreen = menuScreen;
}

// Limits the framerate to 60fps.
// https://gist.github.com/elundmark/38d3596a883521cb24f5
// https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
let fps = 60;
let now;
let then = window.performance.now();
let lastFrameReq = then;
let interval = 1000 / fps;
let delta;

function rAF60fps() {
	requestAnimationFrame(rAF60fps);
	if (frameRateThrottling) {
		now = window.performance.now();
		delta = now - then;
		if (delta > interval) {
			then = now - (delta % interval);
			draw();
		}

		// Added this line to fix unnecessary lag sometimes caused by the framerate limiter.
		if (lastFrameReq - then > interval) then = now;
		lastFrameReq = now;
	} else draw();
}

// Explore API Stuff

function requestAdded() {
	exploreLoading = true;
	requestsWaiting++;
}

function requestResolved() {
	requestsWaiting--;
	if (requestsWaiting === 0) exploreLoading = false;
}

function requestError() {
	requestsWaiting--;
}

function getExplorePage(p, t, s) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/page?page=' + p + '&sort=' + s + '&type=' + t, {method: 'GET'})
		.then(async response => {
			explorePageLevels = await response.json();
			if (exploreTab == 0) setExploreThumbs();
			truncateLevelTitles(explorePageLevels,0);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getSearchPage(searchText, p) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/search?text=' + encodeURIComponent(searchText).replace('%20','+') + '&page=' + p, {method: 'GET'})
		.then(async response => {
			explorePageLevels = await response.json();
			setExploreThumbs();
			truncateLevelTitles(explorePageLevels,0);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getExploreLevel(id) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/level?id=' + id, {method: 'GET'})
		.then(async response => {
			exploreLevelPageLevel = await response.json();
			drawExploreThumb(thumbBigctx, thumbBig.width, exploreLevelPageLevel.data, 0.4);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getExploreLevelpack(id) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/levelpack?levels=1&id=' + id, {method: 'GET'})
		.then(async response => {
			exploreLevelPageLevel = await response.json();
			drawExploreThumb(thumbBigctx, thumbBig.width, exploreLevelPageLevel.levels[0].data, 0.4);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getExplorePlay(id) {
	// we dont care if this errors; it probably will most of the time due to ratelimits
	return fetch(`https://5beam.zelo.dev/api/play?type=${exploreLevelPageType}&id=${id}`)
}

function getExploreUser(id) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/user?id=' + id, {method: 'GET'})
		.then(async response => {
			exploreUser = await response.json();
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getCurrentExploreUserID() {
	return fetch('https://discord.com/api/v10/users/@me', {
		method: 'GET',
		headers: {'Authorization': 'Bearer ' + getCookie('access_token')}
	}).then(async indentity => {
		const discordId = (await indentity.json()).id;
		fetch('https://5beam.zelo.dev/api/user?discordId=' + discordId, {method: 'GET'})
			.then(async response => {
				loggedInExploreUser5beamID = (await response.json()).id;
			document.cookie = '5beam_id=' + loggedInExploreUser5beamID + '; path=/';
			}).catch(err => {console.log(err);});
	}).catch(err => {console.log(err)});
}

function getExploreUserPage(id, p, t, s) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/user/page?id=' + id + '&page=' + p + '&type=' + t + '&sort=' + s, {method: 'GET'})
		.then(async response => {
			exploreUserPageLevels[t] = await response.json();
			if (t === 0) setExploreThumbsUserPage(t);
			truncateLevelTitles(exploreUserPageLevels[t],t*4);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

const tokenLifespan = 600000; // milliseconds in 10 minutes

async function refreshToken() {
	// Checks if we need to refresh.
	if (Date.now() - parseInt(getCookie('token_created_at')) > tokenLifespan) return;

	const token_body = JSON.stringify({
		refresh_token: getCookie('refresh_token')
	})

	const response = await fetch('https://5beam.zelo.dev/api/auth/refresh', {method: 'POST', body: token_body})
	const data = await response.json()
	switch (response.status) {
		case 200:
			document.cookie = 'access_token=' + data.access_token + ';max-age=' + data.expires_in + ';path=/';
			document.cookie = 'refresh_token=' + data.refresh_token + ';path=/';
			if (!getCookie('5beam_id')) getCurrentExploreUserID();
			break;
		case 400:
		default:
			console.error(data)
			setLCMessage('Your session has expired. You need to sign in again!');
	}
	return response;
}

function logInExplore() {
	loggedInExploreUser5beamID = -1;
	newWindow = window.open(
		'https://discord.com/api/oauth2/authorize?client_id=747831622556057693&redirect_uri=https%3A%2F%2F5beam.zelo.dev%2Fapi%2Fauth%2Fcallback%2Fhtml5b&response_type=code&scope=identify',
		'Window Name', // So did I just never set this?
		'height=750,width=450'
	);
	if (window.focus) newWindow.focus();

	// Get access_token once finished
	newWindow.addEventListener('close', refreshToken);
}

/*function logInExploreAfter() {
	getCurrentExploreUserID();
	refreshToken();
}*/

function logOutExplore() {
	loggedInExploreUser5beamID = -1;
	deleteCookie('access_token');
	deleteCookie('refresh_token');
	deleteCookie('token_created_at');
	deleteCookie('5beam_id');

}
async function postExploreLevelOrPack(title, desc, data, isLevelpack=false) {
	await refreshToken();
	if (levelAlreadySharedToExplore) {
		setLCMessage('You already shared that level to explore.');
		return;
	}
	levelAlreadySharedToExplore = true;
	// requestAdded();

	const body = {
		access_token: getCookie('access_token'),
		title: title,
		description: desc,
		file: data,
		modded: ''
	}

	return fetch('https://5beam.zelo.dev/api/create/' + (isLevelpack?'levelpack':'level'), {method: 'POST', body: JSON.stringify(body)})
		.then(response => {
			// requestResolved();
			if (response.status == 200) {
				setLCMessage('Level successfuly sent to explore!');
			} else {
				setLCMessage('Server responded with status ' + response.status);
			}
		})
		.catch(err => {
			console.log(err);
			setLCMessage('Sorry, there was an error while attempting to send the level.');
			// requestError();
		});
}

async function postExploreModifyLevel(id, title, desc, difficulty, file) {
	await refreshToken();
	requestAdded();

	const body = {
		access_token: getCookie('access_token'),
		title: title,
		description: desc,
		// file: data,
		difficulty: difficulty,
		modded: ''
	}
	if (file != '') body.file = file;

	return fetch('https://5beam.zelo.dev/api/modify/level?id=' + id, {method: 'POST', body: JSON.stringify(body)})
		.then(response => {
			requestResolved();
			if (response.status == 200) {
				// setLCMessage('Level successfuly sent to explore!');
			} else {
				// setLCMessage('Server responded with status ' + response.status);
				cancelEditExploreLevel();
			}
		})
		.catch(err => {
			console.log(err);
			// setLCMessage('Sorry, there was an error while attempting to send the level.');
			requestError();
			cancelEditExploreLevel();
		});
}

// https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
	let name = cname + '=';
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}
//https://stackoverflow.com/questions/2144386/how-to-delete-a-cookie
function deleteCookie(name) {
	document.cookie = name + '=; Max-Age=0; path=/; domain=';
}


// Before, this was in a separate file like it was in the Flash version, but it made minifying take more steps and I didn't really edit it that often, so I decided it was just easier to move it into the same file.
class Character {
	constructor(tid, tx, ty, tpx, tpy, tcharState, tw, th, tweight, tweight2, th2, tfriction, theatSpeed, thasArms, tdExpr) {
		this.id = tid;
		this.x = tx;
		this.y = ty;
		this.px = tx;
		this.py = ty;
		this.vx = 0;
		this.vy = 0;
		this.onob = false;
		this.dire = 4;
		this.carry = false;
		this.carryObject = 0;
		this.carriedBy = 200;
		this.landTimer = 200;
		this.deathTimer = 30;
		this.charState = tcharState;
		this.standingOn = -1;
		this.stoodOnBy = [];
		this.w = tw;
		this.h = th;
		this.weight = tweight;
		this.weight2 = tweight2;
		this.h2 = th2;
		this.atEnd = false;
		this.friction = tfriction;
		this.fricGoal = 0;
		this.justChanged = 2;
		this.speed = 0;
		this.motionString = [];
		this.buttonsPressed = [];
		this.pcharState = 0;
		this.submerged = 0;
		this.temp = 0;
		this.heated = 0;
		this.heatSpeed = theatSpeed;
		this.hasArms = thasArms;
		this.placed = true; // used in the level creator

		this.frame = 3;
		this.poseTimer = 0;
		this.leg1frame = 0;
		this.leg2frame = 0;
		this.leg1skew = 0;
		this.leg2skew = 0;
		this.legdire = 1;
		this.legAnimationFrame = [0, 0]; // Animation offset.
		this.burstFrame = -1;
		this.diaMouthFrame = 0;
		this.expr = 0;
		this.dExpr = tdExpr;
		this.acidDropTimer = [0, 0]; // Why am I doing it like this
	}

	applyForces(grav, control, waterUpMaxSpeed) {
		let gravity = Math.sign(grav) * Math.sqrt(Math.abs(grav));

		if (!this.onob && this.submerged != 1) this.vy = Math.min(this.vy + gravity, 25);
		if (this.onob || control) {
			this.vx = (this.vx - this.fricGoal) * this.friction + this.fricGoal;
		} else {
			this.vx *= 1 - (1 - this.friction) * 0.12;
		}

		if (Math.abs(this.vx) < 0.01) this.vx = 0;

		if (this.submerged == 1) {
			this.vy = 0;
			if (this.weight2 > 0.18) this.submerged = 2;
		} else if (this.submerged >= 2) {
			if (this.vx > 1.5) this.vx = 1.5;
			if (this.vx < -1.5) this.vx = -1.5;

			if (this.vy > 1.8) this.vy = 1.8;
			if (this.vy < - waterUpMaxSpeed) this.vy = - waterUpMaxSpeed;
		}
	}

	charMove() {
		this.y += this.vy;
		this.x += this.vx;
	}

	moveHorizontal(power) {
		if (power * this.fricGoal <= 0 && !this.onob) this.fricGoal = 0;
		this.vx += power;
		if (power < 0) this.dire = 1;
		if (power > 0) this.dire = 3;
		this.justChanged = 2;
	}

	stopMoving() {
		if (this.dire == 1) this.dire = 2;
		if (this.dire == 3) this.dire = 4;
	}

	jump(jumpPower) {
		this.vy = jumpPower;
	}

	swimUp(jumpPower) {
		this.vy -= this.weight2 + jumpPower;
	}

	setFrame(newFrame) {
		if (newFrame != this.frame) {
			if (!((this.frame == 5 && newFrame == 4) || (this.frame == 4 && newFrame == 5))) this.poseTimer = 0;
			this.frame = newFrame;
			if (cutScene == 3 && this.expr != this.dExpr) this.expr = this.dExpr;
		}
	}
}

class TextBox {
	constructor(startingText, x, y, w, h, bgColor, textColor, scrollbarColor, lineHeight, textSize, font, allowsLineBreaks, pad, scrollbarAxis, scrollbarSize, resize) {
		this.text = startingText;
		this.textAfterCursor = '';
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.bgColor = bgColor;
		this.textColor = textColor;
		this.lineHeight = lineHeight;
		this.textSize = textSize;
		this.font = font;
		this.allowsLineBreaks = allowsLineBreaks;
		this.beingEdited = false;
		this.pad = pad;
		this.lines = [''];
		this.cursorPosition; // Where in the text the cursor lies.
		this.scrollbarSize = scrollbarSize;
		this.scrollbarLength = 0;
		this.scrollbarPos = 0;
		this.scrollbarAxis = scrollbarAxis;
		this.scrollbarColor = scrollbarColor;
		this.draggingScrollbar = false;
		this.lineWidth = 0; // Only used for horizontal scrollbars.
		this.resize = resize;

		if (this.resize) {
			ctx.font = this.textSize + 'px ' + this.font;
			this.lines = wrapText(this.text, 0, 0, this.w - this.pad[0] - this.pad[1], this.lineHeight, false);
			this.h = this.lines.length * this.lineHeight + this.pad[1] + this.pad[3];
		}
	}

	setCursorPosition(newPosition) {
		this.cursorPosition = newPosition;
		this.textAfterCursor = this.text.slice(this.cursorPosition);
		inputText = this.text.slice(0, this.cursorPosition);
	}

	draw() {
		// Draw the background.
		ctx.fillStyle = this.bgColor;
		if (this.resize)
			ctx.fillRect(this.x, this.y, this.w, this.h);
		else if (this.scrollbarAxis === 0)
			ctx.fillRect(this.x, this.y, this.w + this.scrollbarSize, this.h);
		else if (this.scrollbarAxis === 1)
			ctx.fillRect(this.x, this.y, this.w, this.h + this.scrollbarSize);

		// Set text attributes early for measuring width.
		ctx.font = this.textSize + 'px ' + this.font;
		ctx.textBaseline = 'top';
		ctx.textAlign = 'left';

		// Check if the mouse is currently hovered over the scrollbar.
		if ((this.scrollbarAxis === 0 && onRect(_xmouse, _ymouse, this.x + this.w, this.y + this.scrollbarPos, this.scrollbarSize, this.scrollbarLength) || (this.scrollbarAxis === 1 && onRect(_xmouse, _ymouse, this.x + this.scrollbarPos, this.y + this.h, this.scrollbarLength, this.scrollbarSize))) || this.draggingScrollbar) {
			onScrollbar = true;
			// If we just clicked on it, start dragging.
			if (mouseIsDown && !pmouseIsDown) {
				this.draggingScrollbar = true;
				draggingScrollbar = true;
				valueAtClick = this.scrollbarPos;
				deselectAllTextBoxes();
			}
		}
		// Check if the mouse is currently hovered over the text box.
		if (onRect(_xmouse, _ymouse, this.x, this.y, this.w, this.h)) {
			onTextBox = true;
			// If the mouse is released over the text box and when the mouse was first pressed it was over the text box, process the click.
			if (mousePressedLastFrame && onRect(lastClickX, lastClickY, this.x, this.y, this.w, this.h)) {
				this.setCursorPosition(this.coordinatesToTextPosition(_xmouse, _ymouse, true));
				// If we weren't already editing the text box, start editing it.
				if (!this.beingEdited) {
					deselectAllTextBoxes();
					this.beingEdited = true;
					editingTextBox = true;
					currentTextBoxAllowsLineBreaks = this.allowsLineBreaks;
					// If the browser doesn't support randomly reading from the clipboard (i.e. is Firefox), make the canvas element a thing you can paste into.
					if (!browserPasteSolution) canvas.setAttribute('contenteditable', true);
				}
			}
		}
		// If we clicked anywhere off the text box, stop editing it.
		if (mousePressedLastFrame && this.beingEdited && !((this.scrollbarAxis === 0 && onRect(lastClickX, lastClickY, this.x, this.y, this.w + this.scrollbarSize, this.h)) || (this.scrollbarAxis === 1 && onRect(lastClickX, lastClickY, this.x, this.y, this.w, this.h + this.scrollbarSize)))) {
			deselectAllTextBoxes();
		}

		// Handle scrollbar.
		if (this.draggingScrollbar) {
			if (mousePressedLastFrame) {
				// Letting go of the scrollbar.
				this.draggingScrollbar = false;
				draggingScrollbar = false;
			} else {
				// Dragging the scrollbar.
				if (this.scrollbarAxis === 0)
					this.scrollbarPos = Math.max(Math.min((_ymouse - lastClickY) + valueAtClick, this.h - this.scrollbarLength), 0);
				else if (this.scrollbarAxis === 1)
					this.scrollbarPos = Math.max(Math.min((_xmouse - lastClickX) + valueAtClick, this.w - this.scrollbarLength), 0);
			}
		}

		// Handle text editing.
		if (this.beingEdited) {
			this.text = inputText + this.textAfterCursor;
			this.setCursorPosition(inputText.length);

			// Move cursor with arrow keys.
			if (_keysDown[37]) {
				if (!leftPress) {
					this.setCursorPosition(Math.max(this.cursorPosition - 1, 0));
					leftPress = true;
				}
			} else leftPress = false;
			if (_keysDown[39]) {
				if (!rightPress) {
					this.setCursorPosition(Math.min(this.cursorPosition + 1, this.text.length));
					rightPress = true;
				}
			} else rightPress = false;
			if (_keysDown[38]) {
				if (!upPress) {
					let textCursorCoordinates = this.getTextCursorCoordinates();
					this.setCursorPosition(this.coordinatesToTextPosition(textCursorCoordinates[0], textCursorCoordinates[1] - this.lineHeight, false));
					upPress = true;
				}
			} else upPress = false;
			if (_keysDown[40]) {
				if (!downPress) {
					let textCursorCoordinates = this.getTextCursorCoordinates();
					this.setCursorPosition(this.coordinatesToTextPosition(textCursorCoordinates[0], textCursorCoordinates[1] + this.lineHeight, false));
					downPress = true;
				}
			} else downPress = false;

			inputText = this.text.slice(0, this.cursorPosition);

			if (!this.resize) {
				// Calculate scrollbar length.
				if (this.scrollbarAxis === 0) {
					this.scrollbarLength = this.h / (this.lines.length * this.lineHeight + this.pad[1] + this.pad[3]) * this.h;
					if (this.scrollbarLength >= this.h) {
						this.scrollbarLength = 0;
						this.scrollbarPos = 0;
					} else if (this.scrollbarPos + this.scrollbarLength > this.h) {
						this.scrollbarPos = this.h - this.scrollbarLength;
					}
				} else if (this.scrollbarAxis === 1) {
					this.lineWidth = ctx.measureText(this.text).width;

					this.scrollbarLength = this.w / (this.lineWidth + this.pad[0] + this.pad[2]) * this.w;
					if (this.scrollbarLength >= this.w) {
						this.scrollbarLength = 0;
						this.scrollbarPos = 0;
					} else if (this.scrollbarPos + this.scrollbarLength > this.w) {
						this.scrollbarPos = this.w - this.scrollbarLength;
					}
				}
			}

			// If the enter key is pressed, stop editing the text box.
			if (_keysDown[13] && !_keysDown[16]) deselectAllTextBoxes();
		}

		// Draw scrollbar.
		ctx.fillStyle = this.scrollbarColor;
		if (this.scrollbarAxis === 0)
			ctx.fillRect(this.x + this.w, this.y + this.scrollbarPos, this.scrollbarSize, this.scrollbarLength);
		else if (this.scrollbarAxis === 1)
			ctx.fillRect(this.x + this.scrollbarPos, this.y + this.h, this.scrollbarLength, this.scrollbarSize);

		// Draw text.
		let scrollAmount = (this.scrollbarAxis === 0)
			?this.scrollbarPos * ((this.lines.length * this.lineHeight + this.pad[1] + this.pad[3]) / this.h)
			:this.scrollbarPos * ((this.lineWidth + this.pad[0] + this.pad[2]) / this.w);
		ctx.fillStyle = this.textColor;
		// Set text clipping region
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.clip();
		if (this.scrollbarAxis === 0) {
			this.lines = wrapText(this.text, this.x + this.pad[0], this.y + this.pad[1] - scrollAmount, this.w - this.pad[0] - this.pad[1], this.lineHeight);
			if (this.resize) this.h = this.lines.length * this.lineHeight + this.pad[1] + this.pad[3];
		} else if (this.scrollbarAxis === 1) {
			this.lines = [this.text];
			ctx.fillText(this.text, this.x + this.pad[0] - scrollAmount, this.y + this.pad[1]);
		}

		// Draw text cursor.
		if (this.beingEdited) {
			if (_frameCount % 60 < 30) {
				ctx.strokeStyle = this.textColor;
				ctx.lineWidth = 2;
				ctx.beginPath();
				let textCursorCoordinates = this.getTextCursorCoordinates();
				if (this.scrollbarAxis === 0) textCursorCoordinates[1] -= scrollAmount;
				if (this.scrollbarAxis === 1) textCursorCoordinates[0] -= scrollAmount;
				ctx.moveTo(textCursorCoordinates[0], textCursorCoordinates[1]);
				ctx.lineTo(textCursorCoordinates[0], textCursorCoordinates[1] + this.textSize);
				ctx.stroke();
			}
		}
		ctx.restore();
	}

	getTextCursorCoordinates() {
		let textCursorY = 0;
		let lineLengthBeforeCursor = 0;
		while (textCursorY < this.lines.length) {
			let newlen = lineLengthBeforeCursor + this.lines[textCursorY].length;
			if (newlen > this.cursorPosition || (newlen == this.cursorPosition && textCursorY == this.lines.length - 1)) break;
			lineLengthBeforeCursor = newlen;
			textCursorY++;
		}
		if (textCursorY >= this.lines.length) textCursorY--;
		let textCursorX = ctx.measureText(this.text.slice(lineLengthBeforeCursor, this.cursorPosition)).width + this.x + this.pad[0];
		return [textCursorX, this.y + this.pad[1] + this.lineHeight * textCursorY];
	}

	coordinatesToTextPosition(x, y, useScroll) {
		let lineNumber = Math.floor(mapRange(
			y - (this.y + this.pad[1] - ((useScroll && this.scrollbarAxis === 0)?(this.scrollbarPos * ((this.lines.length * this.lineHeight + this.pad[1] + this.pad[3]) / this.h)):0)),
			0, Math.max(this.lines.length,1) * this.lineHeight,
			0, this.lines.length
		));
		if (lineNumber < 0) return 0;
		if (lineNumber >= this.lines.length) return this.text.length;
		let textPositionOut = 0;
		for (let i = 0; i < lineNumber; i++) {
			textPositionOut += this.lines[i].length;
		}
		let offsetX = x - this.x - this.pad[0] + ((useScroll && this.scrollbarAxis === 1)?(this.scrollbarPos * ((this.lineWidth + this.pad[0] + this.pad[2]) / this.w)):0);
		if (offsetX <= 0) textPositionOut += 0;
		else if (ctx.measureText(this.lines[lineNumber]).width <= offsetX) textPositionOut += this.lines[lineNumber].length-((this.scrollbarAxis === 1)?0:1);
		else textPositionOut += binarySearch({
			max: this.lines[lineNumber].length,
			getValue: guess => ctx.measureText(this.lines[lineNumber].substring(0, guess)).width,
			match: offsetX
		});

		return textPositionOut;
	}
}

function deselectAllTextBoxes() {
	editingTextBox = false;
	for (let i = textBoxes.length - 1; i >= 0; i--) {
		for (let j = textBoxes[i].length - 1; j >= 0; j--) {
			textBoxes[i][j].beingEdited = false;
		}
	}
	canvas.setAttribute('contenteditable', false);
}

// Refresh token if we can
if (getCookie('refresh_token') !== '') {
	refreshToken();
}