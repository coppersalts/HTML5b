// This is the original 5b code written by Cary Huang.  It was taken from the decompiled swf.
 
function resetLevel()
{
	charCount = startLocations[currentLevel].length;
	levelWidth = levels[currentLevel][0].length;
	levelHeight = levels[currentLevel].length;
	copyLevel(levels[currentLevel]);
	charDepth = levelWidth * levelHeight + charCount * 2;
	charCount2 = 0;
	HPRC1 = HPRC2 = 1000000;
	var _loc1_ = 0;
	while(_loc1_ < charCount)
	{
		var _loc2_ = startLocations[currentLevel][_loc1_][0];
		char[_loc1_] = new Character(_loc2_,startLocations[currentLevel][_loc1_][1] * 30 + startLocations[currentLevel][_loc1_][2] * 30 / 100,startLocations[currentLevel][_loc1_][3] * 30 + startLocations[currentLevel][_loc1_][4] * 30 / 100,70 + _loc1_ * 40,400 - _loc1_ * 30,0,0,false,4,false,0,200,200,30,startLocations[currentLevel][_loc1_][5],-1,new Array(0),charD[_loc2_][0],charD[_loc2_][1],charD[_loc2_][2],charD[_loc2_][2],charD[_loc2_][3],false,charD[_loc2_][4],0,2,0,new Array(0),0,0,0,0,charD[_loc2_][6]);
		if(_loc2_ <= 5)
		{
			charCount2++;
		}
		if(_loc2_ == 36)
		{
			HPRC1 = _loc1_;
		}
		if(_loc2_ == 35)
		{
			HPRC2 = _loc1_;
		}
		if(char[_loc1_].charState == 3 || char[_loc1_].charState == 4)
		{
			char[_loc1_].speed = startLocations[currentLevel][_loc1_][6][0] * 10 + startLocations[currentLevel][_loc1_][6][1];
		}
		_loc1_ = _loc1_ + 1;
	}
	drawLevel();
	drawCharacters();
	recover = false;
	cornerHangTimer = 0;
	charsAtEnd = 0;
	control = 0;
	cutScene = 0;
	white._visible = true;
	bgXScale = ((levelWidth - 32) * 10 + 960) / 9.6;
	bgYScale = ((levelHeight - 18) * 10 + 540) / 5.4;
	bg._xscale = Math.max(bgXScale,bgYScale);
	bg._yscale = Math.max(bgXScale,bgYScale);
	bg.gotoAndStop(bgs[currentLevel] + 1);
	levelShadow.cacheAsBitmap = true;
	levelStill.cacheAsBitmap = true;
	bg.cacheAsBitmap = true;
	cameraX = Math.min(Math.max(char[0].x - 480,0),levelWidth * 30 - 960);
	cameraY = Math.min(Math.max(char[0].y - 270,0),levelHeight * 30 - 540);
	levelButtons.textie.text = numberToText(currentLevel + 1,true) + ". " + levelName[currentLevel];
	gotThisCoin = false;
	levelTimer = 0;
	levelTimer2 = getTimer();
	if(char[0].charState <= 9)
	{
		changeControl();
	}
}
function copyLevel(thatLevel)
{
	thisLevel = new Array(thatLevel.length);
	var _loc2_ = 0;
	while(_loc2_ < levelHeight)
	{
		thisLevel[_loc2_] = new Array(thatLevel[_loc2_].length);
		var _loc1_ = 0;
		while(_loc1_ < levelWidth)
		{
			thisLevel[_loc2_][_loc1_] = thatLevel[_loc2_][_loc1_];
			_loc1_ = _loc1_ + 1;
		}
		_loc2_ = _loc2_ + 1;
	}
}
function numberToText(i, hundreds)
{
	if(hundreds)
	{
		if(i < 10)
		{
			return "00" + i;
		}
		if(i < 100)
		{
			return "0" + i;
		}
		return i;
	}
	if(i == 0)
	{
		return "00";
	}
	if(i < 10)
	{
		return "0" + i;
	}
	return i;
}
function toHMS(i)
{
	var _loc5_ = Math.floor(i / 3600000);
	var _loc3_ = Math.floor(i / 60000) % 60;
	var _loc2_ = Math.floor(i / 1000) % 60;
	var _loc4_ = Math.floor(i / 100) % 10;
	return numberToText(_loc5_,false) + ":" + numberToText(_loc3_,false) + ":" + numberToText(_loc2_,false) + "." + _loc4_;
}
function drawLevel()
{
	if(playMode == 0 && currentLevel >= 1)
	{
		removeTileMovieClips();
		addTileMovieClips();
	}
	var _loc3_ = 0;
	while(_loc3_ < 6)
	{
		switchable[_loc3_] = new Array(0);
		_loc3_ = _loc3_ + 1;
	}
	var _loc2_ = 0;
	while(_loc2_ < levelHeight)
	{
		var _loc1_ = 0;
		while(_loc1_ < levelWidth)
		{
			if(thisLevel[_loc2_][_loc1_] >= 1)
			{
				if(blockProperties[thisLevel[_loc2_][_loc1_]][12] >= 1)
				{
					switchable[blockProperties[thisLevel[_loc2_][_loc1_]][12] - 1].push([_loc1_,_loc2_]);
				}
				if(blockProperties[thisLevel[_loc2_][_loc1_]][14])
				{
					addTileMovieClip(_loc1_,_loc2_,levelActive3);
				}
				else if(blockProperties[thisLevel[_loc2_][_loc1_]][11] >= 1)
				{
					addTileMovieClip(_loc1_,_loc2_,levelActive2);
					if(blockProperties[thisLevel[_loc2_][_loc1_]][11] >= 7 && blockProperties[thisLevel[_loc2_][_loc1_]][11] <= 12)
					{
						levelActive2["tileX" + _loc1_ + "Y" + _loc2_].lever._rotation = 60;
					}
				}
				else if(blockProperties[thisLevel[_loc2_][_loc1_]][8])
				{
					addTileMovieClip(_loc1_,_loc2_,levelActive);
				}
				else
				{
					addTileMovieClip(_loc1_,_loc2_,levelStill);
				}
				if(thisLevel[_loc2_][_loc1_] == 6)
				{
					locations[0] = _loc1_;
					locations[1] = _loc2_;
					if(bgs[currentLevel] == 9 || bgs[currentLevel] == 10)
					{
						levelActive["tileX" + _loc1_ + "Y" + _loc2_].bg.gotoAndStop(2);
					}
				}
				if(thisLevel[_loc2_][_loc1_] == 12)
				{
					locations[2] = _loc1_;
					locations[3] = _loc2_;
					locations[4] = 1000;
					locations[5] = 0;
				}
			}
			_loc1_ = _loc1_ + 1;
		}
		_loc2_ = _loc2_ + 1;
	}
}
function addTileMovieClip(x, y, level)
{
	var _loc5_ = thisLevel[y][x];
	level.attachMovie("tile" + Math.floor(_loc5_ / 10),"tileX" + x + "Y" + y,y * levelWidth + x,{_x:x * 30,_y:y * 30});
	level["tileX" + x + "Y" + y].gotoAndStop(_loc5_ % 10 + 1);
	if(_loc5_ == 6)
	{
		level["tileX" + x + "Y" + y].light.gotoAndStop(charCount2);
		var _loc2_ = 0;
		while(_loc2_ < 2)
		{
			var _loc1_ = 0;
			while(_loc1_ < 4)
			{
				setAmbientShadow(x - _loc2_,y - _loc1_);
				_loc1_ = _loc1_ + 1;
			}
			_loc2_ = _loc2_ + 1;
		}
	}
	else if(_loc5_ >= 110 && _loc5_ <= 129)
	{
		_loc2_ = 0;
		while(_loc2_ < 3)
		{
			_loc1_ = 0;
			while(_loc1_ < 2)
			{
				setAmbientShadow(x - _loc2_,y - _loc1_);
				_loc1_ = _loc1_ + 1;
			}
			_loc2_ = _loc2_ + 1;
		}
	}
	else if(blockProperties[thisLevel[y][x]][10])
	{
		setAmbientShadow(x,y);
	}
	if(blockProperties[thisLevel[y][x]][13])
	{
		setBorder(x,y,levelStill["tileX" + x + "Y" + y].tileBorder,_loc5_);
	}
}
function setAmbientShadow(x, y)
{
	levelShadow.attachMovie("tileShadow","tileX" + x + "Y" + y,y * levelWidth + x,{_x:x * 30,_y:y * 30});
	var _loc5_ = 0;
	var _loc1_ = 0;
	while(_loc1_ < 4)
	{
		var _loc4_ = blockProperties[thisLevel[y + cardinal[_loc1_][1]][x + cardinal[_loc1_][0]]][12];
		if(blockProperties[thisLevel[y + cardinal[_loc1_][1]][x + cardinal[_loc1_][0]]][_loc1_] && (_loc4_ == 0 || _loc4_ == 6))
		{
			_loc5_ += Math.pow(2,3 - _loc1_);
		}
		_loc1_ = _loc1_ + 1;
	}
	levelShadow["tileX" + x + "Y" + y].ambientShadow.gotoAndStop(_loc5_ + 1);
	_loc1_ = 0;
	while(_loc1_ < 4)
	{
		if(!blockProperties[thisLevel[y][x + diagonal[_loc1_][0]]][opposite(_loc1_,0)] && !blockProperties[thisLevel[y + diagonal[_loc1_][1]][x]][opposite(_loc1_,1)] && blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][opposite(_loc1_,0)] && blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][12] == 0 && blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][opposite(_loc1_,1)] && blockProperties[thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]]][12] == 0)
		{
			levelShadow["tileX" + x + "Y" + y].ambientShadow2["a" + _loc1_].gotoAndStop(2);
		}
		else
		{
			levelShadow["tileX" + x + "Y" + y].ambientShadow2["a" + _loc1_].gotoAndStop(1);
		}
		_loc1_ = _loc1_ + 1;
	}
}
function setBorder(x, y, tile, s)
{
	var _loc6_ = 0;
	var _loc1_ = 0;
	while(_loc1_ < 4)
	{
		if(thisLevel[y + cardinal[_loc1_][1]][x + cardinal[_loc1_][0]] != s && !outOfRange(x + cardinal[_loc1_][0],y + cardinal[_loc1_][1]))
		{
			_loc6_ += Math.pow(2,3 - _loc1_);
		}
		_loc1_ = _loc1_ + 1;
	}
	tile.ambientShadow.gotoAndStop(_loc6_ + 1);
	_loc1_ = 0;
	while(_loc1_ < 4)
	{
		if(thisLevel[y][x + diagonal[_loc1_][0]] == s && thisLevel[y + diagonal[_loc1_][1]][x] == s && thisLevel[y + diagonal[_loc1_][1]][x + diagonal[_loc1_][0]] != s)
		{
			tile.ambientShadow2["a" + _loc1_].gotoAndStop(2);
		}
		else
		{
			tile.ambientShadow2["a" + _loc1_].gotoAndStop(1);
		}
		_loc1_ = _loc1_ + 1;
	}
}
function outOfRange(x, y)
{
	return x < 0 || y < 0 || x >= levelWidth || y >= levelHeight;
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
function drawCharacters()
{
	if(playMode == 0 && currentLevel >= 1)
	{
		var _loc1_ = 0;
		while(_loc1_ < startLocations[currentLevel - transitionType].length)
		{
			levelChar["char" + _loc1_].removeMovieClip();
			_loc1_ = _loc1_ + 1;
		}
	}
	else
	{
		_loc1_ = 0;
		while(_loc1_ < startLocations[currentLevel].length)
		{
			levelChar["char" + _loc1_].removeMovieClip();
			_loc1_ = _loc1_ + 1;
		}
	}
	_loc1_ = 0;
	while(_loc1_ < charCount)
	{
		levelChar.attachMovie("char","char" + _loc1_,charDepth - _loc1_ * 2,{_x:char[_loc1_].x,_y:char[_loc1_].y});
		levelChar["char" + _loc1_].gotoAndStop(char[_loc1_].id + 1);
		levelChar["char" + _loc1_].leg1.gotoAndStop(1);
		levelChar["char" + _loc1_].leg2.gotoAndStop(1);
		if(char[_loc1_].charState <= 1)
		{
			levelChar["char" + _loc1_]._visible = false;
		}
		if(charD[id][5])
		{
			levelChar["char" + _loc1_].cacheAsBitmap = true;
		}
		if(char[_loc1_].charState == 9)
		{
			char[_loc1_].dire = 2;
			levelChar["char" + _loc1_].charBody.gotoAndStop(2);
			levelChar["char" + _loc1_].charBody.mouth.gotoAndStop(3);
			levelChar["char" + _loc1_].charBody.mouth.mouth.gotoAndStop(57);
		}
		if(_loc1_ == HPRC2)
		{
			HPRCBubble.attachMovie("charImage","charImage",0,{_x:char[_loc1_].x,_y:char[_loc1_].y,_xscale:143,_yscale:143});
		}
		_loc1_ = _loc1_ + 1;
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
	csBubble.gotoAndPlay(17);
}
function rescue()
{
	var _loc1_ = 0;
	while(_loc1_ < charCount)
	{
		if(char[_loc1_].charState == 9)
		{
			char[_loc1_].charState = 10;
			levelChar["char" + _loc1_].charBody.mouth.gotoAndStop(1);
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
		putDown(_loc2_);
	}
	_root.csBubble.gotoAndPlay(2);
	_root.csBubble._x = _loc5_;
	if(char[control].y - cameraY > 270)
	{
		_root.csBubble._y = bubMargin + bubHeight / 2;
	}
	else
	{
		_root.csBubble._y = 520 - bubMargin - bubHeight / 2;
	}
	if(_loc2_ == 99)
	{
		_root.csBubble.csBubble2.gotoAndStop(2);
	}
	else
	{
		_root.csBubble.csBubble2.gotoAndStop(1);
		_root.csBubble.csBubble2.box.charBody.gotoAndStop(char[_loc2_].id + 1);
		_root.levelChar["char" + _loc2_].charBody.gotoAndStop(Math.ceil(char[_loc2_].dire / 2) * 2);
		_root.levelChar["char" + _loc2_].charBody.mouth.gotoAndStop(1);
		_root.levelChar["char" + _loc2_].charBody.mouth.gotoAndStop(dialogueFace[level][line]);
	}
	_root.csBubble.csBubble2.textie.text = dialogueText[level][line];
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
				levelActive["tileX" + _loc4_ + "Y" + _loc3_].gotoAndStop(switches[j][_loc1_ * 2 + 1] % 10 + 1);
			}
			else if(thisLevel[_loc3_][_loc4_] == switches[j][_loc1_ * 2 + 1])
			{
				thisLevel[_loc3_][_loc4_] = switches[j][_loc1_ * 2];
				levelActive["tileX" + _loc4_ + "Y" + _loc3_].gotoAndStop(switches[j][_loc1_ * 2] % 10 + 1);
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
function solidAt(x, y)
{
	var _loc1_ = getBlockTypeAt(x,y);
	return blockProperties[_loc1_][0] && blockProperties[_loc1_][1] && blockProperties[_loc1_][2] && blockProperties[_loc1_][3];
}
function solidCeiling(x, y)
{
	return blockProperties[getBlockTypeAt(x,y)][0];
}
function safeToStandAt(x, y)
{
	var _loc1_ = getBlockTypeAt(x,y);
	return blockProperties[_loc1_][1] && !blockProperties[_loc1_][5] && _loc1_ != 14 && _loc1_ != 16 && _loc1_ != 83 && _loc1_ != 85;
}
function getBlockTypeAt(x, y)
{
	return thisLevel[Math.floor(y / 30)][Math.floor(x / 30)];
}
function verticalProp(i, sign, prop, x, y)
{
	var _loc6_ = -0.5 * sign + 0.5;
	var _loc4_ = Math.floor((y - char[i].h * _loc6_) / 30);
	if(prop <= 3 && sign == -1 && _loc4_ == -1)
	{
		return true;
	}
	if(prop >= 4 && prop <= 7)
	{
		var _loc1_ = Math.floor((x - char[i].w) / 30);
		while(_loc1_ <= Math.floor((x + char[i].w - 0.01) / 30))
		{
			if(blockProperties[thisLevel[_loc4_][_loc1_]][prop - 4] && !blockProperties[thisLevel[_loc4_][_loc1_]][prop])
			{
				return false;
			}
			_loc1_ = _loc1_ + 1;
		}
	}
	_loc1_ = Math.floor((x - char[i].w) / 30);
	while(_loc1_ <= Math.floor((x + char[i].w - 0.01) / 30))
	{
		if(blockProperties[thisLevel[_loc4_][_loc1_]][prop])
		{
			if(prop != 1 || !ifCarried(i) || allSolid(thisLevel[_loc4_][_loc1_]))
			{
				return true;
			}
		}
		_loc1_ = _loc1_ + 1;
	}
	return false;
}
function horizontalProp(i, sign, prop, x, y)
{
	var _loc2_ = Math.floor((x + char[i].w * sign) / 30);
	if(prop <= 3 && (sign == -1 && _loc2_ <= -1 || sign == 1 && _loc2_ >= levelWidth))
	{
		return true;
	}
	if(prop >= 4 && prop <= 7)
	{
		var _loc1_ = Math.floor((y - char[i].h) / 30);
		while(_loc1_ <= Math.floor((y - 0.01) / 30))
		{
			if(blockProperties[thisLevel[_loc1_][_loc2_]][prop - 4] && !blockProperties[thisLevel[_loc1_][_loc2_ - sign]][prop - 4] && !blockProperties[thisLevel[_loc1_][_loc2_]][prop])
			{
				return false;
			}
			_loc1_ = _loc1_ + 1;
		}
	}
	_loc1_ = Math.floor((y - char[i].h) / 30);
	while(_loc1_ <= Math.floor((y - 0.01) / 30))
	{
		if(blockProperties[thisLevel[_loc1_][_loc2_]][prop])
		{
			return true;
		}
		_loc1_ = _loc1_ + 1;
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
		if(thisLevel[_loc3_][_loc1_] == prop)
		{
			if(pist)
			{
				levelActive["tileX" + _loc1_ + "Y" + _loc3_].piston.gotoAndPlay(2);
			}
			_loc4_ = true;
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
		if(thisLevel[_loc1_][_loc3_] == prop)
		{
			return true;
		}
		_loc1_ = _loc1_ + 1;
	}
	return false;
}
function checkButton(i)
{
	if(char[i].onob)
	{
		var _loc4_ = Math.ceil(char[i].y / 30);
		if(_loc4_ >= 0 && _loc4_ <= levelHeight - 1)
		{
			var _loc6_ = undefined;
			var _loc3_ = Math.floor((char[i].x - char[i].w) / 30);
			while(_loc3_ <= Math.floor((char[i].x + char[i].w) / 30))
			{
				_loc6_ = blockProperties[thisLevel[_loc4_][_loc3_]][11];
				if(_loc6_ >= 13)
				{
					if(levelActive2["tileX" + _loc3_ + "Y" + _loc4_].button._currentframe != 2)
					{
						leverSwitch(_loc6_ - 13);
						levelActive2["tileX" + _loc3_ + "Y" + _loc4_].button.gotoAndStop(2);
					}
					var _loc5_ = true;
					var _loc1_ = 0;
					while(_loc1_ < char[i].buttonsPressed.length)
					{
						if(char[i].buttonsPressed[_loc1_][0] == _loc3_ && char[i].buttonsPressed[_loc1_][1] == _loc4_)
						{
							_loc5_ = false;
						}
						_loc1_ = _loc1_ + 1;
					}
					if(_loc5_)
					{
						char[i].buttonsPressed.push([_loc3_,_loc4_]);
					}
					break;
				}
				_loc3_ = _loc3_ + 1;
			}
		}
	}
}
function checkButton2(i, bypass)
{
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
					levelActive2["tileX" + _loc4_ + "Y" + _loc6_].button.gotoAndPlay(3);
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
function checkDeath(i)
{
	var _loc3_ = Math.floor((char[i].y - char[i].h) / 30);
	while(_loc3_ <= Math.floor((char[i].y - 0.01) / 30))
	{
		var _loc1_ = Math.floor((char[i].x - char[i].w) / 30);
		while(_loc1_ <= Math.floor((char[i].x + char[i].w) / 30))
		{
			if(blockProperties[thisLevel[_loc3_][_loc1_]][4] || blockProperties[thisLevel[_loc3_][_loc1_]][5] || blockProperties[thisLevel[_loc3_][_loc1_]][6] || blockProperties[thisLevel[_loc3_][_loc1_]][7])
			{
				startDeath(i);
			}
			_loc1_ = _loc1_ + 1;
		}
		_loc3_ = _loc3_ + 1;
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
	return _loc3_;
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
			if(blockProperties[thisLevel[_loc1_][_loc5_]][14])
			{
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
		char[char[i].carriedBy].vy = 0;
		char[char[i].carriedBy].y = y + yOff(i);
		if(newTileDown(char[i].carriedBy) && verticalProp(char[i].carriedBy,1,1,char[char[i].carriedBy].x,char[char[i].carriedBy].y))
		{
			char[char[i].carriedBy].y = Math.floor(char[char[i].carriedBy].y / 30) * 30;
		}
	}
}
function allSolid(i)
{
	return blockProperties[i][0] && blockProperties[i][1] && blockProperties[i][2] && blockProperties[i][3];
}
function ifCarried(i)
{
	if(char[i].carriedBy >= 0 && char[i].carriedBy <= 190)
	{
		return char[char[i].carriedBy].carry;
	}
	return false;
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
		levelChar["char" + char[i].carryObject].swapDepths(charDepth - char[i].carryObject * 2);
		char[char[i].carryObject].carriedBy = -1;
		char[char[i].carryObject].stopMoving();
	}
	cornerHangTimer = 0;
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
function landOnObject(i)
{
	var _loc5_ = 10000;
	var _loc4_ = 0;
	var _loc1_ = 0;
	while(_loc1_ < charCount)
	{
		if(!ifCarried(_loc1_) && (char[_loc1_].charState == 6 || char[_loc1_].charState == 4))
		{
			var _loc3_ = Math.abs(char[i].x - char[_loc1_].x);
			if(_loc3_ < char[i].w + char[_loc1_].w && char[i].y >= char[_loc1_].y - char[_loc1_].h && (char[i].py < char[_loc1_].py - char[_loc1_].h || char[i].py == char[_loc1_].py - char[_loc1_].h && char[i].vy == 0))
			{
				if(_loc3_ - char[_loc1_].w < _loc5_)
				{
					_loc5_ = _loc3_ - char[_loc1_].w;
					_loc4_ = _loc1_;
				}
			}
		}
		_loc1_ = _loc1_ + 1;
	}
	if(_loc5_ < 10000 && char[i].standingOn != _loc4_)
	{
		if(char[i].standingOn >= 0)
		{
			fallOff(i);
		}
		if(char[_loc4_].charState == 6 && !char[_loc4_].onob)
		{
			char[_loc4_].vy = inter(char[_loc4_].vy,char[i].vy,char[i].weight2 / (char[_loc4_].weight2 + char[i].weight2));
		}
		land(i,char[_loc4_].y - char[_loc4_].h,char[_loc4_].vy);
		if(char[_loc4_].onob)
		{
			land2(i,char[_loc4_].y - char[_loc4_].h);
		}
		char[i].standingOn = _loc4_;
		char[_loc4_].stoodOnBy.push(i);
		rippleWeight(i,char[i].weight2,1);
		char[i].fricGoal = char[_loc4_].fricGoal;
		if(char[_loc4_].submerged == 1 && char[_loc4_].weight2 >= 0)
		{
			char[_loc4_].submerged = 2;
			char[_loc4_].weight2 -= 0.16;
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
function bumpHead(i)
{
	if(char[i].standingOn >= 0)
	{
		char[i].onob = false;
		char[char[i].standingOn].vy = 0;
		fallOff(i);
	}
}
function changeControl()
{
	if(char[control].charState >= 7)
	{
		char[control].stopMoving();
		levelChar["char" + control].swapDepths(charDepth - control * 2);
		if(char[control].carry)
		{
			levelChar["char" + char[control].carry].swapDepths(charDepth - control * 2 + 1);
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
		levelChar["char" + control].swapDepths(charDepth + charCount * 2 - control * 2);
		levelChar["char" + control].burst.gotoAndPlay(2);
	}
}
function getCoin(i)
{
	if(!gotThisCoin && char[i].charState >= 7)
	{
		if(Math.floor((char[i].x - char[i].w) / 30) <= locations[2] && Math.ceil((char[i].x + char[i].w) / 30) - 1 >= locations[2] && Math.floor((char[i].y - char[i].h) / 30) <= locations[3] && Math.ceil(char[i].y / 30) - 1 >= locations[3])
		{
			levelActive["tileX" + locations[2] + "Y" + locations[3]].coin.gotoAndPlay(2);
			gotThisCoin = true;
		}
	}
}
function startDeath(i)
{
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
		levelChar["char" + i].leg1.leg.gotoAndStop(50);
		levelChar["char" + i].leg2.leg.gotoAndStop(50);
		levelChar["char" + i].charBody.gotoAndStop(8 + Math.ceil(char[i].dire / 2));
		clearTint(i);
		if(char[i].temp >= 50)
		{
			levelChar["char" + i].fire.gotoAndStop(2);
		}
	}
}
function blinkDeath(i)
{
	if(char[i].deathTimer % 6 <= 2)
	{
		levelChar["char" + i]._alpha = 30;
	}
	else
	{
		levelChar["char" + i]._alpha = 100;
	}
}
function endDeath(i)
{
	putDown(i);
	char[i].temp = 0;
	levelChar["char" + i]._visible = false;
	levelChar["char" + i].fire.gotoAndStop(1);
	char[i].charState = 1;
	deathCount++;
	saveGame();
	if(i == control)
	{
		changeControl();
	}
}
function setMovieClipCoordinates(x2, y2)
{
	x = Math.floor(x2);
	y = Math.floor(y2);
	levelShadow._x = x;
	levelShadow._y = y;
	levelStill._x = x;
	levelStill._y = y;
	levelActive._x = x;
	levelActive._y = y;
	levelActive2._x = x;
	levelActive2._y = y;
	levelActive3._x = x;
	levelActive3._y = y;
	levelChar._x = x;
	levelChar._y = y;
	HPRCBubble._x = x;
	HPRCBubble._y = y;
	bg._x = x / 3;
	bg._y = y / 3;
	if(bgXScale > bgYScale)
	{
		bg._y -= Math.max(0,(bgXScale * 5.4 - 540) / 2);
	}
	else if(bgYScale > bgSScale)
	{
		bg._x -= Math.max(0,(bgYScale * 9.6 - 960) / 2);
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
		cameraX = Math.min(Math.max(cameraX + (char[control].x - 384 - cameraX) * 0.12,0),levelWidth * 30 - 960);
	}
	else if(char[control].x - cameraX >= 576)
	{
		cameraX = Math.min(Math.max(cameraX + (char[control].x - 576 - cameraX) * 0.12,0),levelWidth * 30 - 960);
	}
	if(levelHeight <= 18)
	{
		cameraY = levelHeight * 15 - 270;
	}
	else if(char[control].y - cameraY < 216)
	{
		cameraY = Math.min(Math.max(cameraY + (char[control].y - 216 - cameraY) * 0.12,0),levelHeight * 30 - 540);
	}
	else if(char[control].y - cameraY >= 324)
	{
		cameraY = Math.min(Math.max(cameraY + (char[control].y - 324 - cameraY) * 0.12,0),levelHeight * 30 - 540);
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
		HPRCBubble.charImage.gotoAndPlay(5);
		recover = false;
		recover2 = 0;
	}
	else if(numberOfDead() == 1)
	{
		HPRCBubble.charImage.gotoAndStop(3);
		HPRCBubble.charImage.anim.charBody.gotoAndStop(char[recover2].id + 1);
	}
	else
	{
		HPRCBubble.charImage.gotoAndStop(4);
		if(dire == 0)
		{
			HPRCBubble.charImage.anim.gotoAndStop(1);
		}
		else
		{
			HPRCBubble.charImage.anim.gotoAndPlay(dire * 8 + 10);
		}
		HPRCBubble.charImage.anim.charBody.gotoAndStop(char[recover2].id + 1);
		HPRCBubble.charImage.anim.charBody1.gotoAndStop(char[nextDeadPerson(recover2,-1)].id + 1);
		HPRCBubble.charImage.anim.charBody2.gotoAndStop(char[nextDeadPerson(recover2,1)].id + 1);
	}
}
function setBody(i)
{
	var _loc2_ = undefined;
	var _loc3_ = [0,0];
	if(ifCarried(i) && cornerHangTimer == 0)
	{
		var _loc5_ = 1;
		while(_loc5_ <= 2)
		{
			levelChar["char" + i]["leg" + _loc5_].gotoAndStop(Math.floor(char[i].dire / 2 + 0.5));
			levelChar["char" + i]["leg" + _loc5_].leg.gotoAndStop(51);
			_loc5_ = _loc5_ + 1;
		}
		offSetLegs(i,60);
	}
	else if(char[i].dire % 2 == 0 && char[i].onob)
	{
		if(char[i].standingOn >= 0)
		{
			var _loc4_ = char[i].standingOn;
			_loc5_ = 1;
			while(_loc5_ <= 2)
			{
				levelChar["char" + i]["leg" + _loc5_].gotoAndStop(char[i].dire / 2);
				_loc2_ = char[i].x + levelChar["char" + i]["leg" + _loc5_]._x;
				if(_loc2_ >= char[_loc4_].x + char[_loc4_].w)
				{
					_loc3_[_loc5_ - 1] = char[_loc4_].x + char[_loc4_].w - _loc2_;
				}
				else if(_loc2_ <= char[_loc4_].x - char[_loc4_].w)
				{
					_loc3_[_loc5_ - 1] = char[_loc4_].x - char[_loc4_].w - _loc2_;
				}
				_loc5_ = _loc5_ + 1;
			}
		}
		else if(char[i].fricGoal == 0)
		{
			_loc5_ = 1;
			while(_loc5_ <= 2)
			{
				levelChar["char" + i]["leg" + _loc5_].gotoAndStop(char[i].dire / 2);
				_loc2_ = char[i].x + levelChar["char" + i]["leg" + _loc5_]._x;
				if(!safeToStandAt(_loc2_,char[i].y + 1))
				{
					var _loc7_ = safeToStandAt(_loc2_ - 30,char[i].y + 1);
					var _loc6_ = safeToStandAt(_loc2_ + 30,char[i].y + 1);
					if(_loc7_ && (!_loc6_ || _loc2_ % 30 - (_loc5_ - 1.5) * 10 < 30 - _loc2_ % 30) && !horizontalProp(i,-1,1,char[i].x - 15,char[i].y))
					{
						_loc3_[_loc5_ - 1] = (- _loc2_) % 30;
					}
					else if(_loc6_ && !horizontalProp(i,1,1,char[i].x + 15,char[i].y))
					{
						_loc3_[_loc5_ - 1] = 30 - _loc2_ % 30;
					}
				}
				else
				{
					_loc3_[_loc5_ - 1] = 0;
				}
				_loc5_ = _loc5_ + 1;
			}
		}
		if(_loc3_[1] - _loc3_[0] >= 41)
		{
			_loc3_[0] = _loc3_[1];
			_loc3_[1] -= 3;
		}
		var _loc8_ = 3 - char[i].dire;
		if(_loc3_[0] > _loc3_[1] && _loc3_[1] >= 0)
		{
			levelChar["char" + i].leg1.leg.gotoAndStop(toFrame(_loc3_[0] * _loc8_));
			levelChar["char" + i].leg2.leg.gotoAndStop(toFrame(_loc3_[0] * _loc8_));
		}
		else if(_loc3_[0] > _loc3_[1] && _loc3_[0] <= 0)
		{
			levelChar["char" + i].leg1.leg.gotoAndStop(toFrame(_loc3_[1] * _loc8_));
			levelChar["char" + i].leg2.leg.gotoAndStop(toFrame(_loc3_[1] * _loc8_));
		}
		else if(_loc3_[0] < 0 && _loc3_[1] > 0)
		{
			levelChar["char" + i].leg1.leg.gotoAndStop(toFrame(_loc3_[0] * _loc8_));
			levelChar["char" + i].leg2.leg.gotoAndStop(toFrame(_loc3_[1] * _loc8_));
		}
		else if(_loc3_[1] > 0 && _loc3_[0] == 0)
		{
			levelChar["char" + i].leg1.leg.gotoAndStop(25 + 23 * (3 - char[i].dire));
			levelChar["char" + i].leg2.leg.gotoAndStop(25 + 23 * (3 - char[i].dire));
		}
		else if(_loc3_[0] < 0 && _loc3_[1] == 0)
		{
			levelChar["char" + i].leg1.leg.gotoAndStop(25 - 23 * (3 - char[i].dire));
			levelChar["char" + i].leg2.leg.gotoAndStop(25 - 23 * (3 - char[i].dire));
		}
		else
		{
			levelChar["char" + i].leg1.leg.gotoAndStop(1);
			levelChar["char" + i].leg2.leg.gotoAndStop(1);
		}
	}
	else
	{
		_loc5_ = 1;
		while(_loc5_ <= 2)
		{
			levelChar["char" + i]["leg" + _loc5_].gotoAndStop(Math.floor(char[i].dire / 2 + 0.5));
			if(char[i].submerged >= 1 && !char[i].onob)
			{
				levelChar["char" + i]["leg" + _loc5_].leg.gotoAndStop(52);
			}
			else
			{
				levelChar["char" + i]["leg" + _loc5_].leg.gotoAndStop(50 - char[i].onob);
			}
			_loc5_ = _loc5_ + 1;
		}
		if(char[i].dire % 2 == 1 && char[i].onob)
		{
			offSetLegs(i,28);
		}
		if(char[i].submerged >= 1 && !char[i].onob)
		{
			offSetLegs(i,20);
		}
	}
	if(cutScene == 1 && dialogueChar[currentLevel][cutSceneLine] == i)
	{
		levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) * 2);
	}
	else if(i == control && recoverTimer >= 1)
	{
		if(char[i].x - (char[HPRC2].x - 33) < 25)
		{
			levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 12);
		}
		else
		{
			levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 10);
		}
		drawCrankingArms(i);
	}
	else if(char[i].carry)
	{
		levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 6);
	}
	else if(!char[i].onob && !ifCarried(i))
	{
		levelChar["char" + i].charBody.gotoAndStop(Math.ceil(char[i].dire / 2) + 4);
		var _loc9_ = Math.round(Math.min(4 - char[i].vy,15));
	}
	else
	{
		levelChar["char" + i].charBody.gotoAndStop(char[i].dire);
	}
}
function setTint(i)
{
	myColor = new Color(levelChar["char" + i]);
	myColorTransform = new Object();
	var _loc1_ = char[i].temp;
	if(char[i].temp > 50)
	{
		_loc1_ = 0;
	}
	myColorTransform = {rb:_loc1_ * 5.12,ra:100 - _loc1_,ba:100 - _loc1_,ga:100 - _loc1_};
	myColor.setTransform(myColorTransform);
}
function clearTint(i)
{
	myColor = new Color(levelChar["char" + i]);
	myColorTransform = new Object();
	myColorTransform = {rb:0,ra:100,ba:100,ga:100};
	myColor.setTransform(myColorTransform);
}
function toFrame(i)
{
	return Math.min(Math.max(Math.round(i + 25),2),48);
}
function offSetLegs(i, duration)
{
	levelChar["char" + i].leg2.leg.leg.gotoAndPlay((levelChar["char" + i].leg1.leg.leg._currentframe + (duration / 2 - 1)) % duration + 1);
}
function drawCrankingArms(i)
{
	levelChar["char" + i].charBody.arm1.clear();
	levelChar["char" + i].charBody.arm1.lineStyle(2,0,100);
	levelChar["char" + i].charBody.arm1.moveTo(0,0);
	var _loc3_ = - levelChar["char" + i].charBody._x - levelChar["char" + i].charBody.arm1._x + (levelChar["char" + HPRC2]._x - levelChar["char" + i]._x) + levelChar["char" + HPRC2].charBody._x + levelChar["char" + HPRC2].charBody.crank._x * 0.288 + 10 * Math.cos(3.141592653589793 * recoverTimer / 15 - 0.2);
	var _loc2_ = - levelChar["char" + i].charBody._y - levelChar["char" + i].charBody.arm1._y + (levelChar["char" + HPRC2]._y - levelChar["char" + i]._y) + levelChar["char" + HPRC2].charBody._y + levelChar["char" + HPRC2].charBody.crank._y * 0.288 + 10 * Math.sin(3.141592653589793 * recoverTimer / 15 - 0.2);
	levelChar["char" + i].charBody.arm1.lineTo(_loc3_,_loc2_);
	levelChar["char" + i].charBody.arm1.lineStyle(5,0,100);
	levelChar["char" + i].charBody.arm1.lineTo(_loc3_,_loc2_);
	levelChar["char" + i].charBody.arm1.lineTo(_loc3_,_loc2_ + 1);
	levelChar["char" + i].charBody.arm2.clear();
	levelChar["char" + i].charBody.arm2.lineStyle(2,0,100);
	levelChar["char" + i].charBody.arm2.moveTo(0,0);
	_loc3_ = - levelChar["char" + i].charBody._x - levelChar["char" + i].charBody.arm2._x + (levelChar["char" + HPRC2]._x - levelChar["char" + i]._x) + levelChar["char" + HPRC2].charBody._x + levelChar["char" + HPRC2].charBody.crank._x * 0.288 + 20 * Math.cos(3.141592653589793 * recoverTimer / 15 - 0.2);
	_loc2_ = - levelChar["char" + i].charBody._y - levelChar["char" + i].charBody.arm2._y + (levelChar["char" + HPRC2]._y - levelChar["char" + i]._y) + levelChar["char" + HPRC2].charBody._y + levelChar["char" + HPRC2].charBody.crank._y * 0.288 + 20 * Math.sin(3.141592653589793 * recoverTimer / 15 - 0.2);
	levelChar["char" + i].charBody.arm2.lineTo(_loc3_,_loc2_);
	levelChar["char" + i].charBody.arm2.lineStyle(5,0,100);
	levelChar["char" + i].charBody.arm2.lineTo(_loc3_,_loc2_);
	levelChar["char" + i].charBody.arm2.lineTo(_loc3_,_loc2_ + 1);
}
function inter(a, b, x)
{
	return a + (b - a) * x;
}
function drawMenu()
{
	_root.attachMovie("menuMovieClip","menuMovieClip",0);
	menuMovieClip.menuLevelCreatorGray.gotoAndStop(2);
	menuMovieClip.menuLevelViewerGray.gotoAndStop(2);
	var started = true;
	if(bfdia5b.data.levelProgress == undefined || bfdia5b.data.levelProgress == 0)
	{
		started = false;
	}
	if(!started)
	{
		menuMovieClip.menuContGameGray.gotoAndStop(2);
	}
	menuMovieClip.menuNewGame.onRelease = function()
	{
		if(started)
		{
			menuMovieClip.menuNewGame._x += 1000;
			menuMovieClip.menuNewGame2._x -= 1000;
		}
		else
		{
			beginNewGame();
		}
	};
	menuMovieClip.menuNewGame2.yes.onRelease = function()
	{
		beginNewGame();
	};
	menuMovieClip.menuNewGame2.no.onRelease = function()
	{
		menuMovieClip.menuNewGame._x -= 1000;
		menuMovieClip.menuNewGame2._x += 1000;
	};
	menuMovieClip.menuContGame.onRelease = function()
	{
		if(started)
		{
			_root.menuMovieClip.removeMovieClip();
			drawLevelMap();
		}
	};
	menuMovieClip.menuWatch.onRelease = function()
	{
		getUrl("http://www.youtube.com/watch?v=4q77g4xo9ic", "_blank");
	};
	menuMovieClip.menuLevelCreator.onRelease = function()
	{
	};
}
function beginNewGame()
{
	clearVars();
	saveGame();
	_root.menuMovieClip.removeMovieClip();
	drawLevelMap();
}
function drawLevelMap()
{
	cameraY = 0;
	cameraX = 0;
	_root.attachMovie("levelMap","levelMap",2,{_x:0,_y:0});
	_root.attachMovie("levelMapBorder","levelMapBorder",3);
	levelMapBorder.goBack.onRelease = function()
	{
		_root.levelMap.removeMovieClip();
		_root.levelMapBorder.removeMovieClip();
		menuScreen = 0;
	};
	levelMapBorder.muteButton2.onRelease = function()
	{
		if(musicSound.getVolume() == 100)
		{
			musicSound.setVolume(0);
		}
		else
		{
			musicSound.setVolume(100);
		}
	};
	levelMapBorder.qualButton.onRelease = function()
	{
		if(_quality == "HIGH")
		{
			_quality = "LOW";
			levelMapBorder.qualMovie.gotoAndPlay(2);
		}
		else
		{
			_quality = "HIGH";
			levelMapBorder.qualMovie.gotoAndPlay(61);
		}
	};
	levelMap.text1.text = "x " + coins;
	levelMap.text2.text = toHMS(timer);
	levelMap.text3.text = addCommas(deathCount);
	if(levelProgress >= 1)
	{
		levelMap.text4.text = "Minimal deaths to complete level " + levelProgress + ":";
		levelMap.text5.text = mdao[levelProgress - 1];
		levelMap.text6.text = "Unnecessary deaths:";
		levelMap.text7.text = addCommas(deathCount - mdao[levelProgress - 1]);
	}
	var _loc3_ = 0;
	while(_loc3_ < 133)
	{
		var _loc4_ = _loc3_;
		if(_loc4_ >= 100)
		{
			_loc4_ += 19;
		}
		levelMap.attachMovie("levelButton","levelButton" + _loc3_,_loc3_,{_x:_loc4_ % 8 * 110 + 45,_y:Math.floor(_loc4_ / 8) * 50 + 160});
		if(gotCoin[_loc3_])
		{
			levelMap["levelButton" + _loc3_].gotoAndStop(4);
		}
		else if(levelProgress == _loc3_)
		{
			levelMap["levelButton" + _loc3_].gotoAndStop(2);
		}
		else if(levelProgress > _loc3_)
		{
			levelMap["levelButton" + _loc3_].gotoAndStop(3);
		}
		else
		{
			levelMap["levelButton" + _loc3_].gotoAndStop(1);
		}
		levelMap["levelButton" + _loc3_].id = _loc3_;
		if(_loc3_ >= 100)
		{
			levelMap["levelButton" + _loc3_].textie.text = "B" + numberToText(_loc3_ - 99,false);
		}
		else
		{
			levelMap["levelButton" + _loc3_].textie.text = numberToText(_loc3_ + 1,true);
		}
		levelMap["levelButton" + _loc3_].onRollOver = function()
		{
			if(this.id <= levelProgress)
			{
				levelMap["levelButton" + this.id].mov.gotoAndStop(2);
			}
		};
		levelMap["levelButton" + _loc3_].onRollOut = function()
		{
			levelMap["levelButton" + this.id].mov.gotoAndStop(1);
		};
		levelMap["levelButton" + _loc3_].onReleaseOutside = function()
		{
			levelMap["levelButton" + this.id].mov.gotoAndStop(1);
		};
		levelMap["levelButton" + _loc3_].onPress = function()
		{
			if(this.id <= levelProgress)
			{
				levelMap["levelButton" + this.id].mov.gotoAndStop(3);
			}
		};
		levelMap["levelButton" + _loc3_].onRelease = function()
		{
			if(this.id <= levelProgress)
			{
				playLevel(this.id);
				_root.levelMap.removeMovieClip();
				_root.levelMapBorder.removeMovieClip();
				white._alpha = 100;
			}
		};
		_loc3_ = _loc3_ + 1;
	}
	menuScreen = 2;
}
function addCommas(i)
{
	var _loc4_ = String(i);
	var _loc2_ = "";
	var _loc3_ = _loc4_.length;
	var _loc1_ = 0;
	while(_loc1_ < _loc3_)
	{
		if((_loc3_ - _loc1_) % 3 == 0 && _loc1_ != 0)
		{
			_loc2_ += ",";
		}
		_loc2_ += _loc4_.charAt(_loc1_);
		_loc1_ = _loc1_ + 1;
	}
	return _loc2_;
}
function calcDist(i)
{
	return Math.sqrt(Math.pow(char[i].x - locations[2] * 30 + 15,2) + Math.pow(char[i].y - char[i].h / 2 - locations[3] * 30 + 15,2));
}
function drawLevelCreator()
{
	_root.attachMovie("levelCreator","levelCreator",0,{_x:0,_y:0});
	levelCreator.createEmptyMovieClip("grid",100);
	levelCreator.createEmptyMovieClip("tiles",98);
	levelCreator.createEmptyMovieClip("rectSelect",99);
	menuScreen = 5;
	selectedTab = 0;
	levelWidth = 32;
	tool = 0;
	levelHeight = 18;
	clearMyWholeLevel();
	drawLCGrid();
	fillTilesTab();
	charCount2 = 0;
	charCount = 0;
	setEndGateLights();
	LCEndGateX = -1;
	LCEndGateY = -1;
	levelCreator.sideBar.tab1.gotoAndStop(1);
	var _loc2_ = 0;
	while(_loc2_ < 10)
	{
		levelCreator.tools["tool" + _loc2_].gotoAndStop(2);
		_loc2_ = _loc2_ + 1;
	}
	levelCreator.tools.tool9.gotoAndStop(1);
}
function setTool(i)
{
	levelCreator.tools["tool" + tool].gotoAndStop(2);
	tool = i;
	if(tool == 2 || tool == 5)
	{
		clearRectSelect();
	}
	levelCreator.tools["tool" + tool].gotoAndStop(1);
}
function clearRectSelect()
{
	levelCreator.rectSelect.clear();
	LCRect = [-1,-1,-1,-1];
}
function fillTilesTab()
{
	levelCreator.sideBar.tab4.createEmptyMovieClip("tiles",1);
	var _loc1_ = 0;
	while(_loc1_ < tileCount)
	{
		levelCreator.sideBar.tab4.tiles.attachMovie("LEtile3","tile" + _loc1_,_loc1_,{_x:_loc1_ % 5 * 60 + 15,_y:Math.floor(_loc1_ / 5) * 60 + 55});
		levelCreator.sideBar.tab4.tiles["tile" + _loc1_].gotoAndStop(_loc1_ + 1);
		_loc1_ = _loc1_ + 1;
	}
	levelCreator.sideBar.tab4.attachMovie("burst1","selector",0,{_x:30,_y:70,_xscale:100,_yscale:75});
	setSelectedTile(1000);
}
function setSelectedTile(i)
{
	selectedTile = i;
	var _loc3_ = i % 5 * 60 + 30;
	var _loc2_ = Math.floor(i / 5) * 60 + 70;
	levelCreator.sideBar.tab4.selector._x = _loc3_;
	levelCreator.sideBar.tab4.selector._y = _loc2_;
}
function setEndGateLights()
{
	levelCreator.sideBar.tab4.tiles.tile6.light.gotoAndStop(charCount + 1);
	if(LCEndGateX >= 0)
	{
		levelCreator.tiles["tileX" + LCEndGateX + "Y" + LCEndGateY].light.gotoAndStop(charCount + 1);
	}
}
function clearMyWholeLevel()
{
	myLevel = new Array(3);
	var _loc1_ = 0;
	while(_loc1_ < 3)
	{
		clearMyLevel(_loc1_);
		_loc1_ = _loc1_ + 1;
	}
}
function clearMyLevel(i)
{
	myLevel[i] = new Array(levelHeight);
	var _loc2_ = 0;
	while(_loc2_ < levelHeight)
	{
		myLevel[i][_loc2_] = new Array(levelWidth);
		var _loc1_ = 0;
		while(_loc1_ < levelWidth)
		{
			myLevel[i][_loc2_][_loc1_] = 0;
			_loc1_ = _loc1_ + 1;
		}
		_loc2_ = _loc2_ + 1;
	}
}
function drawLCGrid()
{
	scale = Math.min(640 / levelWidth,460 / levelHeight);
	levelCreator.grid.lineStyle(scale / 9,0,50);
	var _loc1_ = 0;
	while(_loc1_ <= levelWidth)
	{
		levelCreator.grid.moveTo(330 - scale * levelWidth / 2 + _loc1_ * scale,240 - scale * levelHeight / 2);
		levelCreator.grid.lineTo(330 - scale * levelWidth / 2 + _loc1_ * scale,240 + scale * levelHeight / 2);
		_loc1_ = _loc1_ + 1;
	}
	_loc1_ = 0;
	while(_loc1_ <= levelHeight)
	{
		levelCreator.grid.moveTo(330 - scale * levelWidth / 2,240 - scale * levelHeight / 2 + _loc1_ * scale);
		levelCreator.grid.lineTo(330 + scale * levelWidth / 2,240 - scale * levelHeight / 2 + _loc1_ * scale);
		_loc1_ = _loc1_ + 1;
	}
	addLCTiles();
	updateLCTiles();
}
function clearLCGrid()
{
	levelCreator.grid.clear();
	removeLCTiles();
}
function addLCTiles()
{
	var _loc2_ = 0;
	while(_loc2_ < levelHeight)
	{
		var _loc1_ = 0;
		while(_loc1_ < levelWidth)
		{
			var _loc4_ = 330 - scale * levelWidth / 2 + _loc1_ * scale;
			var _loc3_ = 240 - scale * levelHeight / 2 + _loc2_ * scale;
			levelCreator.tiles.attachMovie("LEtile2","tileX" + _loc1_ + "Y" + _loc2_,_loc2_ * levelWidth + _loc1_,{_x:_loc4_,_y:_loc3_,_xscale:scale * 100 / 30,_yscale:scale * 100 / 30});
			levelCreator.tiles["tileX" + _loc1_ + "Y" + _loc2_].gotoAndStop(myLevel[1][_loc2_][_loc1_] + 1);
			_loc1_ = _loc1_ + 1;
		}
		_loc2_ = _loc2_ + 1;
	}
}
function removeLCTiles()
{
	var _loc2_ = 0;
	while(_loc2_ < levelHeight)
	{
		var _loc1_ = 0;
		while(_loc1_ < levelWidth)
		{
			levelCreator.tiles["tileX" + _loc1_ + "Y" + _loc2_].removeMovieClip();
			_loc1_ = _loc1_ + 1;
		}
		_loc2_ = _loc2_ + 1;
	}
}
function updateLCtiles()
{
	var _loc2_ = 0;
	while(_loc2_ < levelHeight)
	{
		var _loc1_ = 0;
		while(_loc1_ < levelWidth)
		{
			levelCreator.tiles["tileX" + _loc1_ + "Y" + _loc2_].gotoAndStop(myLevel[1][_loc2_][_loc1_] + 1);
			_loc1_ = _loc1_ + 1;
		}
		_loc2_ = _loc2_ + 1;
	}
}
function fillTile(x, y, after, before)
{
	var _loc4_ = [[x,y]];
	while(_loc4_.length >= 1)
	{
		var _loc1_ = 0;
		while(_loc1_ < 4)
		{
			if(!(_loc1_ == 3 && x == levelWidth - 1 || _loc1_ == 2 && x == 0 || _loc1_ == 1 && y == levelHeight - 1 || _loc1_ == 0 && y == 0))
			{
				var _loc3_ = _loc4_[0][0] + cardinal[_loc1_][0];
				var _loc2_ = _loc4_[0][1] + cardinal[_loc1_][1];
				if(myLevel[1][_loc2_][_loc3_] == before)
				{
					_loc4_.push([_loc3_,_loc2_]);
					myLevel[1][_loc2_][_loc3_] = after;
					levelCreator.tiles["tileX" + _loc3_ + "Y" + _loc2_].gotoAndStop(after + 1);
				}
			}
			_loc1_ = _loc1_ + 1;
		}
		_loc4_.shift();
	}
}
function setSelectedTab(i)
{
	selectedTab = i;
	if(i == 0)
	{
		setTexties();
	}
	else
	{
		setTexties2();
	}
}
function setTexties()
{
	var _loc1_ = 1;
	while(_loc1_ <= 3)
	{
		levelCreator.sideBar.tab1["textie" + _loc1_].selectable = true;
		_loc1_ = _loc1_ + 1;
	}
}
function setTexties2()
{
	var _loc1_ = 1;
	while(_loc1_ <= 3)
	{
		levelCreator.sideBar.tab1["textie" + _loc1_].selectable = false;
		_loc1_ = _loc1_ + 1;
	}
}
function setUndo()
{
	LCSwapLevelData(1,0);
	undid = false;
	levelCreator.tools.tool9.gotoAndStop(1);
}
function undo()
{
	LCSwapLevelData(1,2);
	LCSwapLevelData(0,1);
	LCSwapLevelData(2,0);
	if(undid)
	{
		levelCreator.tools.tool9.gotoAndStop(1);
	}
	else
	{
		levelCreator.tools.tool9.gotoAndStop(2);
	}
	undid = !undid;
}
function LCSwapLevelData(a, b)
{
	myLevel[b] = new Array(myLevel[a].length);
	var _loc2_ = 0;
	while(_loc2_ < levelHeight)
	{
		myLevel[b][_loc2_] = new Array(myLevel[a][0].length);
		var _loc1_ = 0;
		while(_loc1_ < levelWidth)
		{
			myLevel[b][_loc2_][_loc1_] = myLevel[a][_loc2_][_loc1_];
			if(b == 1)
			{
				levelCreator.tiles["tileX" + _loc1_ + "Y" + _loc2_].gotoAndStop(myLevel[b][_loc2_][_loc1_] + 1);
			}
			_loc1_ = _loc1_ + 1;
		}
		_loc2_ = _loc2_ + 1;
	}
}
function drawLCRect(x1, y1, x2, y2)
{
	levelCreator.rectSelect.clear();
	levelCreator.rectSelect.lineStyle(1,0,0);
	levelCreator.rectSelect.beginFill(16776960,50);
	levelCreator.rectSelect.moveTo(x1 * scale + (330 - scale * levelWidth / 2),y1 * scale + (240 - scale * levelHeight / 2));
	levelCreator.rectSelect.lineTo((x2 + 1) * scale + (330 - scale * levelWidth / 2),y1 * scale + (240 - scale * levelHeight / 2));
	levelCreator.rectSelect.lineTo((x2 + 1) * scale + (330 - scale * levelWidth / 2),(y2 + 1) * scale + (240 - scale * levelHeight / 2));
	levelCreator.rectSelect.lineTo(x1 * scale + (330 - scale * levelWidth / 2),(y2 + 1) * scale + (240 - scale * levelHeight / 2));
	levelCreator.rectSelect.lineTo(x1 * scale + (330 - scale * levelWidth / 2),y1 * scale + (240 - scale * levelHeight / 2));
	levelCreator.rectSelect.endFill();
}
function closeToEdgeY()
{
	var _loc1_ = (_ymouse - (240 - scale * levelHeight / 2)) / scale % 1;
	return Math.abs(_loc1_ - 0.5) > 0.25;
}
function closeToEdgeX()
{
	var _loc1_ = (_xmouse - (330 - scale * levelWidth / 2)) / scale % 1;
	return Math.abs(_loc1_ - 0.5) > 0.25;
}
function playLevel(i)
{
	if(i == levelProgress)
	{
		playMode = 0;
	}
	else if(i < levelProgress)
	{
		playMode = 1;
	}
	currentLevel = i;
	wipeTimer = 30;
	_root.attachMovie("csBubble","csBubble",8);
	_root.createEmptyMovieClip("HPRCBubble",7);
	_root.createEmptyMovieClip("levelChar",5);
	addTileMovieClips();
	_root.attachMovie("bg","bg",0);
	levelStill.cacheAsBitmap = true;
	levelStill.cacheAsBitmap = true;
	levelShadow.cacheAsBitmap = true;
	bg.cacheAsBitmap = true;
	menuScreen = 3;
	_root.attachMovie("levelButtons","levelButtons",9);
	toSeeCS = true;
	transitionType = 1;
	resetLevel();
	levelButtons.levelMapButton.onRelease = function()
	{
		timer += getTimer() - levelTimer2;
		saveGame();
		exitLevel();
	};
}
function addTileMovieClips()
{
	_root.createEmptyMovieClip("levelActive3",6);
	_root.createEmptyMovieClip("levelActive2",4);
	_root.createEmptyMovieClip("levelShadow",3);
	_root.createEmptyMovieClip("levelActive",2);
	_root.createEmptyMovieClip("levelStill",1);
}
function removeTileMovieClips()
{
	_root.levelActive.removeMovieClip();
	_root.levelStill.removeMovieClip();
	_root.levelActive2.removeMovieClip();
	_root.levelActive3.removeMovieClip();
	_root.levelShadow.removeMovieClip();
}
function exitLevel()
{
	_root.csBubble.removeMovieClip();
	removeTileMovieClips();
	_root.levelChar.removeMovieClip();
	_root.bg.removeMovieClip();
	_root.levelButtons.removeMovieClip();
	drawLevelMap();
}
function mouseOnGrid()
{
	return _xmouse >= 330 - scale * levelWidth / 2 && _xmouse <= 330 + scale * levelWidth / 2 && _ymouse >= 240 - scale * levelHeight / 2 && _ymouse <= 240 + scale * levelHeight / 2;
}
function mouseOnScreen()
{
	return _xmouse < 660 && _ymouse < 480;
}
var musicSound = new Sound();
musicSound.attachSound("music");
musicSound.start(0,12345);
var blockProperties = [[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false],[true,true,true,true,true,false,false,false,false,false,false,0,0,false,false],[true,true,true,true,false,true,false,false,false,false,false,0,0,false,false],[true,true,true,true,false,false,true,false,false,false,false,0,0,false,false],[true,true,true,true,false,false,false,true,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false],[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,true,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,true,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,true,false,false,0,6,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[true,true,true,true,false,false,false,false,true,false,false,0,6,false,false],[true,true,true,true,true,true,true,true,false,false,false,0,0,false,false],[false,true,false,false,false,false,false,false,false,true,false,0,0,false,false],[true,true,true,true,true,false,false,false,false,false,false,0,0,false,false],[true,true,true,true,false,true,false,false,false,false,false,0,0,false,false],[true,true,true,true,false,false,true,false,false,false,false,0,0,false,false],[true,true,true,true,false,false,false,true,false,false,false,0,0,false,false],[true,true,true,true,true,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,true,false,false,0,1,false,false],[true,true,true,true,false,false,false,false,true,false,false,0,1,false,false],[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false],[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false],[false,false,false,false,false,false,false,false,true,false,false,1,0,false,false],[false,false,false,false,false,false,false,false,true,false,false,7,0,false,false],[false,false,false,false,false,false,false,false,true,false,false,2,0,false,false],[false,false,false,false,false,false,false,false,true,false,false,8,0,false,false],[false,true,false,false,false,false,false,false,false,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,true,false,false,13,0,false,false],[true,true,true,true,false,false,false,false,true,false,false,14,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false],[false,false,true,false,false,false,false,false,false,true,false,0,0,false,false],[true,true,true,true,false,true,false,true,false,false,false,0,0,false,false],[true,true,true,true,false,true,true,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[true,true,true,true,false,false,false,false,true,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,true,false,false,0,2,false,false],[true,true,true,true,false,false,false,false,true,false,false,0,2,false,false],[false,false,false,false,false,false,false,false,true,false,false,0,2,false,false],[false,false,false,false,false,false,false,false,true,false,false,0,2,false,false],[false,true,false,false,false,false,false,false,false,true,false,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,true,false,false,3,0,false,false],[false,false,false,false,false,false,false,false,true,false,false,9,0,false,false],[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false],[true,true,true,true,false,false,false,false,true,false,false,0,3,false,false],[false,false,false,false,false,false,false,false,true,false,false,0,3,false,false],[false,false,false,false,false,false,false,false,true,false,false,0,3,false,false],[false,true,false,false,false,false,false,false,true,false,false,0,3,false,false],[false,false,false,false,false,false,false,false,true,false,false,0,3,false,false],[true,true,true,true,false,false,false,false,true,false,false,0,3,false,false],[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,true,false,false,false,false,false,false,false,0,0,false,false],[true,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,true,false,false,false,false,false,false,true,0,0,false,false],[true,true,true,true,false,false,false,false,true,false,false,15,0,false,false],[true,true,true,true,true,true,true,true,false,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false],[true,true,true,true,false,false,false,false,true,false,false,0,0,false,false],[false,false,false,false,true,true,true,true,true,false,false,0,0,false,false],[false,false,false,false,true,true,true,true,true,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false],[true,true,true,true,true,true,true,true,true,false,false,0,1,false,false],[false,false,false,false,false,false,false,false,true,true,false,0,0,false,false],[false,true,false,false,false,false,false,false,true,false,false,0,1,false,false],[false,false,false,false,false,false,false,false,true,false,false,0,1,false,false],[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false],[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false],[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false],[false,true,false,false,false,false,false,false,true,false,false,0,6,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,true,true,true,true,false,false,false,0,1,false,true],[false,false,false,false,false,false,false,false,true,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false],[false,false,false,false,true,true,true,true,false,false,false,0,1,false,true],[false,false,false,false,false,false,false,false,true,false,false,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false],[false,false,false,false,false,false,false,false,true,false,false,6,0,false,false],[false,false,false,false,false,false,false,false,true,false,false,12,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false],[false,false,false,false,false,false,false,false,false,false,false,0,1,false,true],[true,true,true,true,false,false,false,false,false,false,false,0,0,true,false],[false,false,false,false,false,false,false,false,false,false,true,0,0,false,false]];
var switches = [[31,33,32,34,79,78,81,82],[51,53,52,54],[65,61,60,62,63,64],[],[],[14,16,83,85]];
var charD = [[28,45.4,0.45,27,0.8,false,1],[23,56,0.36,31,0.8,false,1.7],[20,51,0.41,20,0.85,false,5],[10,86,0.26,31,0.8,false,1.6],[10,84,0.23,31,0.8,false,1.4],[28,70,0.075,28,0.8,false,9],[26,49,0.2,20,0.75,false,0.6],[44,65,0.8,20,0.75,false,0.8],[16,56,0.25,17,0.76,false,0.8],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[0,0,0,0,0,false],[36.5,72.8,1,20,0.6,false,0],[15.1,72.8,0.6,20,0.7,true,0],[20,40,0.15,20,0.7,true,0.7],[25,50,0.64,20,0.6,true,0.1],[25,10,1,0,0.7,true,0.2],[25,50,1,20,0.7,true,0.1],[25,29,0.1,20,0.8,true,1],[21.5,43,0.3,20,0.6,true,0.5],[35,60,1,20,0.7,true,0.1],[22.5,45,1,20,0.7,true,0.8],[25,50,1,0,0.7,true,0.1],[15,30,0.64,20,0.6,true,0.2],[10,55,0.8,0,0.3,true,0.4],[45,10,1,0,0.7,true,0.2],[20,40,1,0,0.8,false,0.8],[16,45,0.4,20,0.94,false,1.1],[25,10,1,0,0.7,true,0.3],[45,10,0.4,0,0.7,true,0.7],[15,50,0.1,0,0.8,true,1.9],[25,25,0.1,0,0.8,true,1.7],[30,540,10,10,0.4,true,0]];
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
var menuScreen = 0;
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
_root.attachMovie("white","white",10,{_alpha:0});
onEnterFrame = function()
{
	if(menuScreen == 0)
	{
		drawMenu();
		menuScreen = 1;
	}
	if(menuScreen == 2)
	{
		if(_xmouse < 587 || _ymouse < 469)
		{
			if(_ymouse <= 180)
			{
				cameraY = Math.min(Math.max(cameraY - (180 - _ymouse) * 0.1,0),1080);
			}
			else if(_ymouse >= 360)
			{
				cameraY = Math.min(Math.max(cameraY + (_ymouse - 360) * 0.1,0),1080);
			}
			levelMap._y = - cameraY;
		}
	}
	if(menuScreen == 3 || menuScreen == 4)
	{
		if(wipeTimer == 30)
		{
			if(transitionType == 0)
			{
				resetLevel();
			}
			else if(menuScreen == 4 && charsAtEnd >= charCount2)
			{
				if(gotThisCoin && !gotCoin[currentLevel])
				{
					gotCoin[currentLevel] = true;
					coins++;
				}
				timer += getTimer() - levelTimer2;
				if(playMode == 0)
				{
					currentLevel++;
					levelProgress = currentLevel;
					resetLevel();
				}
				else
				{
					exitLevel();
				}
				saveGame();
			}
		}
		if(menuScreen == 3)
		{
			menuScreen = 4;
		}
		if(cutScene == 1 || cutScene == 2)
		{
			if(Key.isDown(13) || Key.isDown(16))
			{
				if(!csPress && cutScene == 1)
				{
					cutSceneLine++;
					if(cutSceneLine >= dialogueChar[currentLevel].length)
					{
						endCutScene();
					}
					else
					{
						displayLine(currentLevel,cutSceneLine);
					}
				}
				csPress = true;
			}
			else
			{
				csPress = false;
				if(cutScene == 2)
				{
					cutScene = 3;
				}
			}
		}
		else
		{
			if(levelChar["char" + control].burst._currentframe == 2)
			{
				levelChar["char" + control].burst.play();
			}
			if(recover)
			{
				char[control].justChanged = 2;
				if(recoverTimer == 0)
				{
					if(Key.isDown(37))
					{
						if(!leftPress)
						{
							recoverCycle(HPRC2,-1);
						}
						leftPress = true;
					}
					else
					{
						leftPress = false;
					}
					if(Key.isDown(39))
					{
						if(!rightPress)
						{
							recoverCycle(HPRC2,1);
						}
						rightPress = true;
					}
					else
					{
						rightPress = false;
					}
				}
			}
			else
			{
				if(cornerHangTimer == 0)
				{
					if(Key.isDown(37))
					{
						char[control].moveHorizontal(- power);
					}
					else if(Key.isDown(39))
					{
						char[control].moveHorizontal(power);
					}
				}
				if(!Key.isDown(37) && !Key.isDown(39))
				{
					char[control].stopMoving();
				}
			}
			if(Key.isDown(38))
			{
				if(!upPress)
				{
					if(recover && recoverTimer == 0)
					{
						recoverTimer = 60;
						char[recover2].charState = 2;
						char[recover2].x = char[HPRC1].x;
						char[recover2].y = char[HPRC1].y - 20;
						char[recover2].vx = 0;
						char[recover2].vy = -1;
						levelChar["char" + recover2]._x = char[recover2].x;
						levelChar["char" + recover2]._y = char[recover2].y;
						levelChar["char" + recover2].charBody.gotoAndStop(4);
						levelChar["char" + recover2]._visible = true;
						if(char[recover2].id == 5)
						{
							levelChar["char" + recover2].leg1._visible = true;
							levelChar["char" + recover2].leg2._visible = true;
						}
						levelChar["char" + recover2].leg1.gotoAndStop(2);
						levelChar["char" + recover2].leg2.gotoAndStop(2);
						levelChar["char" + recover2]._alpha = 100;
						HPRCBubble.charImage.gotoAndStop(1);
						goal = Math.round(char[HPRC1].x / 30) * 30;
					}
					else if(char[control].id != 2 && !recover && char[control].deathTimer >= 30)
					{
						if(char[control].carry)
						{
							putDown(control);
							charThrow(control);
						}
						else
						{
							var _loc2_ = 0;
							while(_loc2_ < charCount)
							{
								if(_loc2_ != control && near(control,_loc2_) && char[_loc2_].charState >= 6 && char[control].standingOn != _loc2_ && onlyMovesOneBlock(_loc2_,control))
								{
									if(char[_loc2_].carry)
									{
										putDown(_loc2_);
									}
									if(ifCarried(_loc2_))
									{
										putDown(char[_loc2_].carriedBy);
									}
									char[control].carry = true;
									char[control].carryObject = _loc2_;
									levelChar["char" + _loc2_].swapDepths(charDepth + charCount * 2 - control * 2 + 1);
									char[_loc2_].carriedBy = control;
									char[_loc2_].weight2 = char[_loc2_].weight;
									char[control].weight2 = char[_loc2_].weight + char[control].weight;
									rippleWeight(control,char[_loc2_].weight2,1);
									fallOff(_loc2_);
									aboveFallOff(_loc2_);
									char[_loc2_].justChanged = 2;
									char[control].justChanged = 2;
									if(char[_loc2_].submerged == 1)
									{
										char[_loc2_].submerged = 0;
									}
									if(char[_loc2_].onob && char[control].y - char[_loc2_].y > yOff(_loc2_))
									{
										char[control].y = char[_loc2_].y + yOff(_loc2_);
										char[control].onob = false;
										char[_loc2_].onob = true;
									}
									break;
								}
								_loc2_ = _loc2_ + 1;
							}
						}
					}
				}
				upPress = true;
			}
			else
			{
				upPress = false;
			}
			if(Key.isDown(40))
			{
				if(!downPress)
				{
					if(char[control].carry)
					{
						putDown(control);
					}
					else if(recover)
					{
						if(recoverTimer == 0)
						{
							recover = false;
							HPRCBubble.charImage.gotoAndStop(1);
						}
					}
					else if(near2(control,HPRC2) && char[control].id != 2 && char[control].onob)
					{
						char[control].stopMoving();
						if(char[control].x >= char[HPRC2].x - 33)
						{
							char[control].dire = 2;
						}
						else
						{
							char[control].dire = 4;
						}
						recover = true;
						recover2 = charCount - 1;
						recoverCycle(HPRC2,0);
					}
				}
				downPress = true;
			}
			else
			{
				downPress = false;
			}
			if(Key.isDown(90))
			{
				if(!qPress && !recover)
				{
					changeControl();
					qTimer = 6;
				}
				qPress = true;
			}
			else
			{
				qPress = false;
			}
			if(Key.isDown(32))
			{
				if((char[control].onob || char[control].submerged == 3) && char[control].landTimer > 2 && !recover)
				{
					if(char[control].submerged == 3)
					{
						char[control].swimUp(0.14 / char[control].weight2);
					}
					else
					{
						char[control].jump(- jumpPower);
					}
					char[control].onob = false;
					fallOff(control);
				}
			}
			else
			{
				char[control].landTimer = 80;
			}
		}
		if(Key.isDown(82) && wipeTimer == 0)
		{
			wipeTimer = 1;
			transitionType = 0;
			if(cutScene == 1)
			{
				csBubble.gotoAndPlay(17);
			}
		}
		locations[4] = 1000;
		_loc2_ = 0;
		while(_loc2_ < charCount)
		{
			if(char[_loc2_].charState >= 5)
			{
				char[_loc2_].landTimer = char[_loc2_].landTimer + 1;
				if(char[_loc2_].carry && char[char[_loc2_].carryObject].justChanged < char[_loc2_].justChanged)
				{
					char[char[_loc2_].carryObject].justChanged = char[_loc2_].justChanged;
				}
				if(char[_loc2_].standingOn == -1)
				{
					if(char[_loc2_].onob)
					{
						if(char[_loc2_].charState >= 5)
						{
							char[_loc2_].fricGoal = onlyConveyorsUnder(_loc2_);
						}
					}
				}
				else
				{
					char[_loc2_].fricGoal = char[char[_loc2_].standingOn].vx;
				}
				char[_loc2_].applyForces(char[_loc2_].weight2,control == _loc2_,jumpPower * 0.7);
				if(char[_loc2_].deathTimer >= 30)
				{
					char[_loc2_].charMove();
				}
				if(char[_loc2_].id == 3)
				{
					if(char[_loc2_].temp > 50)
					{
						levelChar["char" + _loc2_].fire.gotoAndStop(2);
						var _loc4_ = 0;
						while(_loc4_ < charCount)
						{
							if(char[_loc4_].charState >= 5 && _loc4_ != _loc2_)
							{
								if(Math.abs(char[_loc2_].x - char[_loc4_].x) < char[_loc2_].w + char[_loc4_].w && char[_loc4_].y > char[_loc2_].y - char[_loc2_].h && char[_loc4_].y < char[_loc2_].y + char[_loc4_].h)
								{
									char[_loc4_].heated = 2;
									heat(_loc4_);
								}
							}
							_loc4_ = _loc4_ + 1;
						}
					}
					else
					{
						levelChar["char" + _loc2_].fire.gotoAndStop(1);
					}
				}
			}
			else if(char[_loc2_].charState >= 3)
			{
				var _loc8_ = Math.floor(levelTimer / char[_loc2_].speed) % (startLocations[currentLevel][_loc2_][6].length - 2);
				char[_loc2_].vx = cardinal[startLocations[currentLevel][_loc2_][6][_loc8_ + 2]][0] * (30 / char[_loc2_].speed);
				char[_loc2_].vy = cardinal[startLocations[currentLevel][_loc2_][6][_loc8_ + 2]][1] * (30 / char[_loc2_].speed);
				char[_loc2_].px = char[_loc2_].x;
				char[_loc2_].py = char[_loc2_].y;
				char[_loc2_].charMove();
			}
			if(char[_loc2_].charState == 3 || char[_loc2_].charState == 5)
			{
				_loc4_ = 0;
				while(_loc4_ < charCount)
				{
					if(char[_loc4_].charState >= 7 && _loc4_ != _loc2_)
					{
						if(Math.abs(char[_loc2_].x - char[_loc4_].x) < char[_loc2_].w + char[_loc4_].w && char[_loc4_].y > char[_loc2_].y - char[_loc2_].h && char[_loc4_].y < char[_loc2_].y + char[_loc4_].h)
						{
							startDeath(_loc4_);
						}
					}
					_loc4_ = _loc4_ + 1;
				}
			}
			if(char[_loc2_].justChanged >= 1)
			{
				if(char[_loc2_].standingOn >= 1)
				{
					if(char[char[_loc2_].standingOn].charState == 4)
					{
						char[_loc2_].justChanged = 2;
					}
				}
				if(char[_loc2_].stoodOnBy.length >= 1)
				{
					_loc4_ = 0;
					while(_loc4_ < char[_loc2_].stoodOnBy.length)
					{
						char[char[_loc2_].stoodOnBy[_loc4_]].y = char[_loc2_].y - char[_loc2_].h;
						char[char[_loc2_].stoodOnBy[_loc4_]].vy = char[_loc2_].vy;
						_loc4_ = _loc4_ + 1;
					}
				}
				else if(!char[_loc2_].carry && char[_loc2_].submerged >= 2)
				{
					char[_loc2_].weight2 = char[_loc2_].weight - 0.16;
				}
				if(char[_loc2_].charState >= 5 && !ifCarried(_loc2_))
				{
					if(char[_loc2_].vy > 0 || char[_loc2_].vy == 0 && char[_loc2_].vx != 0)
					{
						landOnObject(_loc2_);
					}
					if(char[_loc2_].vy < 0 && (char[_loc2_].charState == 4 || char[_loc2_].charState == 6) && !ifCarried(_loc2_))
					{
						objectsLandOn(_loc2_);
					}
				}
			}
			if(char[_loc2_].charState >= 7 && char[_loc2_].charState != 9 && !gotThisCoin)
			{
				var _loc7_ = calcDist(_loc2_);
				if(_loc7_ < locations[4])
				{
					locations[4] = _loc7_;
					locations[5] = _loc2_;
				}
			}
			_loc2_ = _loc2_ + 1;
		}
		var _loc11_ = undefined;
		if(!gotThisCoin)
		{
			_loc11_ = 140 - locations[4] * 0.7;
		}
		if(gotCoin[currentLevel])
		{
			_loc11_ = Math.max(_loc11_,30);
		}
		levelActive["tileX" + locations[2] + "Y" + locations[3]]._alpha = _loc11_;
		_loc2_ = 0;
		while(_loc2_ < charCount)
		{
			if(char[_loc2_].vy != 0 || char[_loc2_].vx != 0 || char[_loc2_].x != char[_loc2_].px || char[_loc2_].py != char[_loc2_].y)
			{
				char[_loc2_].justChanged = 2;
			}
			if(char[_loc2_].charState == 2)
			{
				recoverTimer--;
				var _loc5_ = (60 - recoverTimer) / 60;
				levelChar["char" + _loc2_]._yscale = _loc5_ * 100;
				levelChar["char" + _loc2_]._x = inter(char[HPRC1].x,goal,_loc5_);
				if(recoverTimer <= 0)
				{
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
			}
			else if(char[_loc2_].justChanged >= 1 && char[_loc2_].charState >= 5)
			{
				var _loc3_ = Math.floor((char[_loc2_].y - char[_loc2_].h) / 30);
				while(_loc3_ <= Math.floor(char[_loc2_].y / 30))
				{
					var _loc9_ = Math.floor((char[_loc2_].x - char[_loc2_].w) / 30);
					while(_loc9_ <= Math.floor((char[_loc2_].x + char[_loc2_].w - 0.01) / 30))
					{
						if(blockProperties[thisLevel[_loc3_][_loc9_]][11] >= 1 && blockProperties[thisLevel[_loc3_][_loc9_]][11] <= 12)
						{
							if(Math.floor(char[_loc2_].x / 30) == _loc9_)
							{
								var _loc1_ = (char[_loc2_].x - Math.floor(char[_loc2_].x / 30) * 30 - 15) * 5;
								if(_loc1_ < levelActive2["tileX" + _loc9_ + "Y" + _loc3_].lever._rotation && char[_loc2_].vx < 0 || _loc1_ > levelActive2["tileX" + _loc9_ + "Y" + _loc3_].lever._rotation && char[_loc2_].vx > 0)
								{
									if(_loc1_ < 0 && levelActive2["tileX" + _loc9_ + "Y" + _loc3_].lever._rotation > 0 || _loc1_ > 0 && levelActive2["tileX" + _loc9_ + "Y" + _loc3_].lever._rotation < 0)
									{
										leverSwitch((blockProperties[thisLevel[_loc3_][_loc9_]][11] - 1) % 6);
									}
									levelActive2["tileX" + _loc9_ + "Y" + _loc3_].lever._rotation = _loc1_;
								}
							}
						}
						_loc9_ = _loc9_ + 1;
					}
					_loc3_ = _loc3_ + 1;
				}
				checkButton2(_loc2_,false);
				if(ifCarried(_loc2_))
				{
					char[_loc2_].vx = char[char[_loc2_].carriedBy].vx;
					char[_loc2_].vy = char[char[_loc2_].carriedBy].vy;
					if(char[char[_loc2_].carriedBy].x + xOff(_loc2_) >= char[_loc2_].x + 20)
					{
						char[_loc2_].x += 20;
					}
					else if(char[char[_loc2_].carriedBy].x + xOff(_loc2_) <= char[_loc2_].x - 20)
					{
						char[_loc2_].x -= 20;
					}
					else
					{
						char[_loc2_].x = char[char[_loc2_].carriedBy].x + xOff(_loc2_);
					}
					if(char[char[_loc2_].carriedBy].y - yOff(_loc2_) >= char[_loc2_].y + 20)
					{
						char[_loc2_].y += 20;
					}
					else if(char[char[_loc2_].carriedBy].y - yOff(_loc2_) <= char[_loc2_].y - 20)
					{
						char[_loc2_].y -= 20;
					}
					else
					{
						char[_loc2_].y = char[char[_loc2_].carriedBy].y - yOff(_loc2_);
					}
					char[_loc2_].dire = Math.ceil(char[char[_loc2_].carriedBy].dire / 2) * 2;
				}
				if(char[_loc2_].standingOn >= 0)
				{
					char[_loc2_].y = char[char[_loc2_].standingOn].y - char[char[_loc2_].standingOn].h;
					char[_loc2_].vy = char[char[_loc2_].standingOn].vy;
				}
				stopX = 0;
				stopY = 0;
				toBounce = false;
				if(newTileHorizontal(_loc2_,1))
				{
					if(horizontalType(_loc2_,1,8) && char[_loc2_].charState == 10)
					{
						startCutScene();
					}
					if(horizontalProp(_loc2_,1,7,char[_loc2_].x,char[_loc2_].y) && char[_loc2_].charState >= 7)
					{
						startDeath(_loc2_);
					}
					else if(char[_loc2_].x > char[_loc2_].px && horizontalProp(_loc2_,1,3,char[_loc2_].x,char[_loc2_].y))
					{
						stopX = 1;
					}
				}
				if(newTileHorizontal(_loc2_,-1))
				{
					if(horizontalType(_loc2_,-1,8) && char[_loc2_].charState == 10)
					{
						startCutScene();
					}
					if(horizontalProp(_loc2_,-1,6,char[_loc2_].x,char[_loc2_].y) && char[_loc2_].charState >= 7)
					{
						startDeath(_loc2_);
					}
					else if(char[_loc2_].x < char[_loc2_].px && horizontalProp(_loc2_,-1,2,char[_loc2_].x,char[_loc2_].y))
					{
						stopX = -1;
					}
				}
				if(newTileDown(_loc2_))
				{
					if(verticalType(_loc2_,1,8,false) && char[_loc2_].charState == 10)
					{
						startCutScene();
					}
					if(verticalType(_loc2_,1,13,true))
					{
						toBounce = true;
					}
					else if(verticalProp(_loc2_,1,5,char[_loc2_].px,char[_loc2_].y) && char[_loc2_].charState >= 7)
					{
						startDeath(_loc2_);
					}
					else if(char[_loc2_].y > char[_loc2_].py && verticalProp(_loc2_,1,1,char[_loc2_].px,char[_loc2_].y))
					{
						stopY = 1;
					}
				}
				if(newTileUp(_loc2_))
				{
					if(verticalType(_loc2_,-1,8,false) && char[_loc2_].charState == 10)
					{
						startCutScene();
					}
					if(verticalProp(_loc2_,-1,4,char[_loc2_].x,char[_loc2_].y) && char[_loc2_].charState >= 7)
					{
						startDeath(_loc2_);
					}
					else if(char[_loc2_].y < char[_loc2_].py && verticalProp(_loc2_,-1,0,char[_loc2_].px,char[_loc2_].y))
					{
						stopY = -1;
					}
				}
				if(stopX != 0 && stopY != 0)
				{
					if(stopY == 1)
					{
						_loc3_ = Math.floor(char[_loc2_].y / 30) * 30;
					}
					if(stopY == -1)
					{
						_loc3_ = Math.ceil((char[_loc2_].y - char[_loc2_].h) / 30) * 30 + char[_loc2_].h;
					}
					if(!horizontalProp(_loc2_,stopX,stopX / 2 + 2.5,char[_loc2_].x,_loc3_))
					{
						stopX = 0;
					}
					else
					{
						if(stopX == 1)
						{
							_loc9_ = Math.floor((char[_loc2_].x + char[_loc2_].w) / 30) * 30 - char[_loc2_].w;
						}
						if(stopX == -1)
						{
							_loc9_ = Math.ceil((char[_loc2_].x - char[_loc2_].w) / 30) * 30 + char[_loc2_].w;
						}
						if(!verticalProp(_loc2_,stopY,stopY / 2 + 0.5,_loc9_,char[_loc2_].y))
						{
							stopY = 0;
						}
					}
				}
				if(stopX != 0)
				{
					char[_loc2_].fricGoal = 0;
					if(char[_loc2_].submerged >= 2)
					{
						_loc4_ = _loc2_;
						if(ifCarried(_loc2_))
						{
							_loc4_ = char[_loc2_].carriedBy;
						}
						if(char[_loc4_].dire % 2 == 1)
						{
							char[_loc4_].swimUp(0.14 / char[_loc4_].weight2);
							if(char[_loc4_].standingOn >= 0)
							{
								fallOff(_loc2_);
							}
							char[_loc4_].onob = false;
						}
					}
					if(char[_loc2_].id == 5)
					{
						startDeath(_loc2_);
					}
					if(stopX == 1)
					{
						_loc9_ = Math.floor((char[_loc2_].x + char[_loc2_].w) / 30) * 30 - char[_loc2_].w;
					}
					else if(stopX == -1)
					{
						_loc9_ = Math.ceil((char[_loc2_].x - char[_loc2_].w) / 30) * 30 + char[_loc2_].w;
					}
					char[_loc2_].x = _loc9_;
					char[_loc2_].vx = 0;
					stopCarrierX(_loc2_,_loc9_);
				}
				if(stopY != 0)
				{
					if(stopY == 1)
					{
						_loc3_ = Math.floor(char[_loc2_].y / 30) * 30;
						if(!ifCarried(_loc2_))
						{
							cornerHangTimer = 0;
						}
						fallOff(_loc2_);
						land(_loc2_,_loc3_,0);
						land2(_loc2_,_loc3_);
						checkButton(_loc2_);
					}
					else if(stopY == -1)
					{
						if(char[_loc2_].id == 5)
						{
							startDeath(_loc2_);
						}
						if(char[_loc2_].id == 3 && char[_loc2_].temp > 50)
						{
							char[_loc2_].temp = 0;
						}
						_loc3_ = Math.ceil((char[_loc2_].y - char[_loc2_].h) / 30) * 30 + char[_loc2_].h;
						char[_loc2_].y = _loc3_;
						char[_loc2_].vy = 0;
						bumpHead(_loc2_);
						if(ifCarried(_loc2_))
						{
							bumpHead(char[_loc2_].carriedBy);
						}
					}
					stopCarrierY(_loc2_,_loc3_,stopY == 1);
				}
				if(newTileHorizontal(_loc2_,1) || newTileHorizontal(_loc2_,-1))
				{
					if(verticalType(_loc2_,1,13,true))
					{
						toBounce = true;
					}
					if(horizontalProp(_loc2_,1,14,char[_loc2_].x,char[_loc2_].y) || horizontalProp(_loc2_,-1,14,char[_loc2_].x,char[_loc2_].y))
					{
						submerge(_loc2_);
					}
					if(horizontalType(_loc2_,1,15) || horizontalType(_loc2_,-1,15))
					{
						char[_loc2_].heated = 1;
					}
					checkButton(_loc2_);
				}
				if(newTileUp(_loc2_))
				{
					if(verticalProp(_loc2_,-1,14,char[_loc2_].x,char[_loc2_].y))
					{
						submerge(_loc2_);
					}
					if(verticalType(_loc2_,-1,15,false))
					{
						char[_loc2_].heated = 1;
					}
				}
				if(newTileDown(_loc2_))
				{
					if(verticalProp(_loc2_,1,14,char[_loc2_].x,char[_loc2_].y))
					{
						submerge(_loc2_);
					}
					if(verticalType(_loc2_,1,15,false))
					{
						char[_loc2_].heated = 1;
					}
				}
				if(char[_loc2_].submerged >= 2 && char[_loc2_].standingOn >= 0 && char[_loc2_].weight2 < 0)
				{
					fallOff(_loc2_);
				}
				if(char[_loc2_].submerged >= 2)
				{
					unsubmerge(_loc2_);
				}
				if(char[_loc2_].heated >= 1)
				{
					heat(_loc2_);
				}
				else if(char[_loc2_].id != 3 || char[_loc2_].temp <= 50)
				{
					if(char[_loc2_].temp >= 0)
					{
						char[_loc2_].temp -= char[_loc2_].heatSpeed;
						char[_loc2_].justChanged = 2;
					}
					else
					{
						char[_loc2_].temp = 0;
					}
				}
				if(char[_loc2_].heated == 2)
				{
					char[_loc2_].heated = 0;
				}
				if(char[_loc2_].standingOn >= 0)
				{
					_loc4_ = char[_loc2_].standingOn;
					if(Math.abs(char[_loc2_].x - char[_loc4_].x) >= char[_loc2_].w + char[_loc4_].w || ifCarried(_loc4_))
					{
						fallOff(_loc2_);
					}
				}
				else if(char[_loc2_].onob)
				{
					if(!ifCarried(_loc2_) && char[_loc2_].standingOn == -1)
					{
						char[_loc2_].y = Math.round(char[_loc2_].y / 30) * 30;
					}
					if(!verticalProp(_loc2_,1,1,char[_loc2_].x,char[_loc2_].y))
					{
						char[_loc2_].onob = false;
						aboveFallOff(_loc2_);
						if(ifCarried(_loc2_))
						{
							cornerHangTimer = 0;
						}
					}
					if(char[_loc2_].charState >= 7 && verticalProp(_loc2_,1,5,char[_loc2_].x,char[_loc2_].y))
					{
						startDeath(_loc2_);
					}
				}
			}
			if(char[_loc2_].charState >= 5)
			{
				char[_loc2_].px = char[_loc2_].x;
				char[_loc2_].py = char[_loc2_].y;
				if(char[_loc2_].justChanged >= 1 && char[_loc2_].charState >= 5)
				{
					if(toBounce)
					{
						bounce(_loc2_);
					}
					getCoin(_loc2_);
				}
				if(char[_loc2_].deathTimer < 30)
				{
					if(char[_loc2_].id == 5 && char[_loc2_].deathTimer >= 7)
					{
						char[_loc2_].deathTimer = 6;
						levelChar["char" + _loc2_].leg1._visible = false;
						levelChar["char" + _loc2_].leg2._visible = false;
					}
					char[_loc2_].deathTimer--;
					blinkDeath(_loc2_);
					if(char[_loc2_].deathTimer <= 0)
					{
						endDeath(_loc2_);
					}
				}
				else if(char[_loc2_].charState >= 7 && (char[_loc2_].justChanged >= 1 || levelTimer == 0))
				{
					setBody(_loc2_);
				}
				if(_loc2_ == HPRC2)
				{
					if(!recover)
					{
						levelChar["char" + _loc2_].charBody.textie.text = "";
					}
					else if(recoverTimer == 0)
					{
						levelChar["char" + _loc2_].charBody.textie.text = "enter name";
					}
					else if(recoverTimer > 40)
					{
						levelChar["char" + _loc2_].charBody.textie.text = names[char[recover2].id];
					}
					else if(recoverTimer > 10)
					{
						levelChar["char" + _loc2_].charBody.textie.text = "Keep going";
					}
					else
					{
						levelChar["char" + _loc2_].charBody.textie.text = "Done";
					}
					levelChar["char" + _loc2_].charBody.crank._rotation = recoverTimer * 12;
					if(!recover && HPRCBubble.charImage._currentframe <= 2)
					{
						if(near(control,_loc2_) && numberOfDead() >= 1 && char[control].id != 2)
						{
							HPRCBubble.charImage.gotoAndStop(2);
						}
						else
						{
							HPRCBubble.charImage.gotoAndStop(1);
						}
					}
				}
				if(char[_loc2_].y > levelHeight * 30 + 160 && char[_loc2_].charState >= 7)
				{
					startDeath(_loc2_);
				}
				if(char[_loc2_].charState == 10 && char[_loc2_].justChanged >= 1)
				{
					if(Math.abs(char[_loc2_].x - locations[0] * 30) <= 30 && Math.abs(char[_loc2_].y - (locations[1] * 30 + 10)) <= 50)
					{
						if(!char[_loc2_].atEnd)
						{
							charsAtEnd++;
							levelActive["tileX" + locations[0] + "Y" + locations[1]].light["light" + charsAtEnd].gotoAndPlay(2);
							if(charsAtEnd >= charCount2)
							{
								wipeTimer = 1;
								if(playMode == 0)
								{
									transitionType = 1;
								}
								else
								{
									transitionType = 2;
								}
							}
						}
						char[_loc2_].atEnd = true;
					}
					else
					{
						if(char[_loc2_].atEnd)
						{
							levelActive["tileX" + locations[0] + "Y" + locations[1]].light["light" + charsAtEnd].gotoAndPlay(16);
							charsAtEnd--;
						}
						char[_loc2_].atEnd = false;
					}
				}
				if(_loc2_ == control)
				{
					setCamera();
				}
			}
			if(char[_loc2_].charState >= 3)
			{
				if(qTimer > 0 || char[_loc2_].justChanged >= 1)
				{
					var _loc6_ = 0;
					if(_loc2_ == control && qTimer > 0)
					{
						_loc6_ = 9 - Math.pow(qTimer - 4,2);
					}
					levelChar["char" + _loc2_]._x = char[_loc2_].x;
					levelChar["char" + _loc2_]._y = char[_loc2_].y - _loc6_;
					if(_loc2_ == HPRC2)
					{
						HPRCBubble.charImage._x = char[_loc2_].x;
						HPRCBubble.charImage._y = char[_loc2_].y - 78;
					}
					if(char[_loc2_].deathTimer >= 30)
					{
						setTint(_loc2_);
					}
				}
				char[_loc2_].justChanged--;
			}
			_loc2_ = _loc2_ + 1;
		}
		qTimer--;
		_loc9_ = - cameraX;
		_loc3_ = - cameraY;
		if(wipeTimer < 60)
		{
			_loc9_ += (Math.random() - 0.5) * (30 - Math.abs(wipeTimer - 30));
			_loc3_ += (Math.random() - 0.5) * (30 - Math.abs(wipeTimer - 30));
		}
		if(char[control].temp > 0 && char[control].temp <= 50)
		{
			_loc9_ += (Math.random() - 0.5) * char[control].temp * 0.2;
			_loc3_ += (Math.random() - 0.5) * char[control].temp * 0.2;
		}
		setMovieClipCoordinates(_loc9_,_loc3_);
		levelTimer++;
	}
	if(menuScreen == 5)
	{
		_loc9_ = Math.floor((_xmouse - (330 - scale * levelWidth / 2)) / scale);
		_loc3_ = Math.floor((_ymouse - (240 - scale * levelHeight / 2)) / scale);
		if(mouseIsDown)
		{
			if(selectedTab == 3)
			{
				if(tool <= 1 && mouseOnGrid())
				{
					if(tool == 1)
					{
						_loc2_ = 0;
					}
					else
					{
						_loc2_ = selectedTile;
					}
					if(_loc2_ >= 0 && _loc2_ < tileCount)
					{
						myLevel[1][_loc3_][_loc9_] = _loc2_;
						levelCreator.tiles["tileX" + _loc9_ + "Y" + _loc3_].gotoAndStop(_loc2_ + 1);
						if(_loc2_ == 6 && (_loc9_ != LCEndGateX || _loc3_ != LCEndGateY))
						{
							myLevel[1][LCEndGateY][LCEndGateX] = 0;
							levelCreator.tiles["tileX" + LCEndGateX + "Y" + LCEndGateY].gotoAndStop(1);
							LCEndGateX = _loc9_;
							LCEndGateY = _loc3_;
							setEndGateLights();
						}
					}
				}
			}
			if((tool == 2 || tool == 5) && LCRect[0] != -1)
			{
				if(_loc9_ != LCRect[2] || _loc3_ != LCRect[3])
				{
					LCRect[2] = Math.min(Math.max(_loc9_,0),levelWidth - 1);
					LCRect[3] = Math.min(Math.max(_loc3_,0),levelHeight - 1);
					drawLCRect(Math.min(LCRect[0],LCRect[2]),Math.min(LCRect[1],LCRect[3]),Math.max(LCRect[0],LCRect[2]),Math.max(LCRect[1],LCRect[3]));
				}
			}
		}
		if(mouseOnGrid())
		{
			if(tool == 6)
			{
				levelCreator.rectSelect.clear();
				var _loc13_ = undefined;
				var _loc12_ = undefined;
				if(closeToEdgeY())
				{
					levelCreator.rectSelect.lineStyle(2 * scale / 9,32768,100);
					_loc13_ = Math.round((_ymouse - (240 - scale * levelHeight / 2)) / scale);
					_loc12_ = 0;
				}
				else
				{
					levelCreator.rectSelect.lineStyle(2 * scale / 9,8388608,100);
					_loc13_ = Math.floor((_ymouse - (240 - scale * levelHeight / 2)) / scale);
					_loc12_ = 0.5;
				}
				levelCreator.rectSelect.moveTo(330 - scale * levelWidth / 2,240 - scale * levelHeight / 2 + scale * (_loc13_ + _loc12_));
				levelCreator.rectSelect.lineTo(330 + scale * levelWidth / 2,240 - scale * levelHeight / 2 + scale * (_loc13_ + _loc12_));
			}
			else if(tool == 7)
			{
				levelCreator.rectSelect.clear();
				var _loc14_ = undefined;
				var _loc10_ = undefined;
				if(closeToEdgeX())
				{
					levelCreator.rectSelect.lineStyle(2 * scale / 9,32768,100);
					_loc14_ = Math.round((_xmouse - (330 - scale * levelWidth / 2)) / scale);
					_loc10_ = 0;
				}
				else
				{
					levelCreator.rectSelect.lineStyle(2 * scale / 9,8388608,100);
					_loc14_ = Math.floor((_xmouse - (330 - scale * levelWidth / 2)) / scale);
					_loc10_ = 0.5;
				}
				levelCreator.rectSelect.moveTo(330 - scale * levelWidth / 2 + scale * (_loc14_ + _loc10_),240 - scale * levelHeight / 2);
				levelCreator.rectSelect.lineTo(330 - scale * levelWidth / 2 + scale * (_loc14_ + _loc10_),240 + scale * levelHeight / 2);
			}
		}
		else if(tool == 6 || tool == 7)
		{
			levelCreator.rectSelect.clear();
		}
		_loc2_ = 0;
		while(_loc2_ < 6)
		{
			_loc3_ = _loc2_ * 40;
			if(_loc2_ > selectedTab)
			{
				_loc3_ += 300;
			}
			if(Math.abs(levelCreator.sideBar["tab" + (_loc2_ + 1)]._y - _loc3_) < 0.5)
			{
				levelCreator.sideBar["tab" + (_loc2_ + 1)]._y = _loc3_;
			}
			else
			{
				levelCreator.sideBar["tab" + (_loc2_ + 1)]._y += (_loc3_ - levelCreator.sideBar["tab" + (_loc2_ + 1)]._y) * 0.2;
			}
			_loc2_ = _loc2_ + 1;
		}
	}
	if(levelTimer <= 30 || menuScreen != 4)
	{
		if(wipeTimer >= 30 && wipeTimer <= 60)
		{
			white._alpha = 220 - wipeTimer * 4;
		}
	}
	else
	{
		white._alpha = 0;
	}
	if(wipeTimer == 29 && menuScreen == 4 && (charsAtEnd >= charCount2 || transitionType == 0))
	{
		white._alpha = 100;
	}
	if(wipeTimer >= 60)
	{
		wipeTimer = 0;
	}
	if(wipeTimer >= 1)
	{
		wipeTimer++;
	}
};
_root.onMouseDown = function()
{
	mouseIsDown = true;
	if(menuScreen == 5)
	{
		if(_xmouse > 660)
		{
			var _loc8_ = 0;
			while(_loc8_ < 6)
			{
				var _loc9_ = _loc8_ * 40;
				if(_loc8_ > selectedTab)
				{
					_loc9_ += 300;
				}
				if(_ymouse >= _loc9_ && _ymouse < _loc9_ + 40)
				{
					setSelectedTab(_loc8_);
					if(_loc8_ == 3 && (selectedTile < 0 || selectedTile > tileCount))
					{
						setTool(0);
						setSelectedTile(1);
					}
					break;
				}
				_loc8_ = _loc8_ + 1;
			}
			if(selectedTab == 3)
			{
				var _loc10_ = Math.floor((_xmouse - 660) / 60);
				_loc9_ = Math.floor((_ymouse - 160) / 60);
				_loc8_ = _loc10_ + _loc9_ * 5;
				if(_loc8_ >= 0 && _loc8_ < tileCount && (tool != 3 && tool != 2 || !blockProperties[_loc8_][9]))
				{
					setSelectedTile(_loc8_);
					if(_loc8_ >= 1 && tool == 1)
					{
						setTool(0);
					}
				}
			}
			else
			{
				setSelectedTile(1000);
			}
			clearRectSelect();
		}
		else if(Math.abs(_ymouse - 510) <= 20 && Math.abs(_xmouse - 330) <= 300)
		{
			_loc8_ = Math.floor((_xmouse - 30) / 50);
			if(_loc8_ != 8)
			{
				if(_loc8_ >= 9)
				{
					_loc8_ = _loc8_ - 1;
				}
				if(_loc8_ == 9)
				{
					undo();
				}
				else if(_loc8_ == 10)
				{
					setUndo();
					clearMyLevel(1);
					updateLCtiles();
				}
				else
				{
					setTool(_loc8_);
					if(tool <= 3)
					{
						setSelectedTab(3);
						if((tool == 3 || tool == 2) && blockProperties[selectedTile][9])
						{
							setSelectedTile(1);
						}
					}
				}
			}
		}
		else
		{
			if(tool != 4 && tool != 5)
			{
				setUndo();
			}
			_loc10_ = Math.floor((_xmouse - (330 - scale * levelWidth / 2)) / scale);
			_loc9_ = Math.floor((_ymouse - (240 - scale * levelHeight / 2)) / scale);
			if(mouseOnScreen())
			{
				if(tool == 2 || tool == 5)
				{
					LCRect[0] = LCRect[2] = Math.min(Math.max(_loc10_,0),levelWidth - 1);
					LCRect[1] = LCRect[3] = Math.min(Math.max(_loc9_,0),levelHeight - 1);
				}
			}
			if(mouseOnGrid())
			{
				if(tool == 3)
				{
					var _loc11_ = myLevel[1][_loc9_][_loc10_];
					fillTile(_loc10_,_loc9_,selectedTile,_loc11_);
				}
				else if(tool == 4)
				{
					setSelectedTab(3);
					setSelectedTile(myLevel[1][_loc9_][_loc10_]);
				}
				else if(tool == 6)
				{
					var _loc5_ = 0;
					if(closeToEdgeY() || levelHeight >= 2)
					{
						if(closeToEdgeY())
						{
							_loc5_ = 1;
						}
						else
						{
							_loc5_ = -1;
						}
						clearLCGrid();
						var _loc7_ = Math.round((_ymouse - (240 - scale * levelHeight / 2)) / scale);
						levelHeight += _loc5_;
						myLevel[1] = new Array(levelHeight);
						var _loc4_ = 0;
						var _loc2_ = 0;
						while(_loc2_ < levelHeight)
						{
							if(_loc2_ < _loc7_)
							{
								_loc4_ = _loc2_;
							}
							else
							{
								_loc4_ = Math.max(_loc2_ - _loc5_,0);
							}
							myLevel[1][_loc2_] = new Array(levelWidth);
							var _loc1_ = 0;
							while(_loc1_ < levelWidth)
							{
								myLevel[1][_loc2_][_loc1_] = myLevel[0][_loc4_][_loc1_];
								_loc1_ = _loc1_ + 1;
							}
							_loc2_ = _loc2_ + 1;
						}
						drawLCGrid();
					}
				}
				else if(tool == 7)
				{
					var _loc6_ = (_xmouse - (330 - scale * levelWidth / 2)) / scale % 1;
					_loc5_ = 0;
					if(closeToEdgeX() || levelWidth >= 2)
					{
						if(closeToEdgeX())
						{
							_loc5_ = 1;
						}
						else
						{
							_loc5_ = -1;
						}
						clearLCGrid();
						_loc6_ = Math.round((_xmouse - (330 - scale * levelWidth / 2)) / scale);
						levelWidth += _loc5_;
						myLevel[1] = new Array(levelHeight);
						var _loc3_ = 0;
						_loc2_ = 0;
						while(_loc2_ < levelHeight)
						{
							myLevel[1][_loc2_] = new Array(levelWidth);
							_loc1_ = 0;
							while(_loc1_ < levelWidth)
							{
								if(_loc1_ < _loc6_)
								{
									_loc3_ = _loc1_;
								}
								else
								{
									_loc3_ = Math.max(_loc1_ - _loc5_,0);
								}
								myLevel[1][_loc2_][_loc1_] = myLevel[0][_loc2_][_loc3_];
								_loc1_ = _loc1_ + 1;
							}
							_loc2_ = _loc2_ + 1;
						}
						drawLCGrid();
					}
				}
			}
		}
	}
};
_root.onMouseUp = function()
{
	if(tool == 2)
	{
		y = Math.min(LCRect[1],LCRect[3]);
		while(y <= Math.max(LCRect[1],LCRect[3]))
		{
			x = Math.min(LCRect[0],LCRect[2]);
			while(x <= Math.max(LCRect[0],LCRect[2]))
			{
				myLevel[1][y][x] = selectedTile;
				levelCreator.tiles["tileX" + x + "Y" + y].gotoAndStop(selectedTile + 1);
				x++;
			}
			y++;
		}
		clearRectSelect();
	}
	mouseIsDown = false;
};
