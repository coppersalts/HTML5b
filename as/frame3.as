function clearVars()
{
   deathCount = timer = coins = levelProgress = 0;
   gotCoin = new Array(levelCount);
   var _loc1_ = 0;
   while(_loc1_ < levelCount)
   {
      gotCoin[_loc1_] = false;
      _loc1_ = _loc1_ + 1;
   }
}
function saveGame()
{
   bfdia5b.data.gotCoin = new Array(levelCount);
   var _loc1_ = 0;
   while(_loc1_ < levelCount)
   {
      bfdia5b.data.gotCoin[_loc1_] = gotCoin[_loc1_];
      _loc1_ = _loc1_ + 1;
   }
   bfdia5b.data.coins = coins;
   bfdia5b.data.levelProgress = levelProgress;
   bfdia5b.data.deathCount = deathCount;
   bfdia5b.data.timer = timer;
   bfdia5b.flush();
}
function charAt(j)
{
   return levelsString.charCodeAt(j + levelStart) - 48;
}
function charAt2(j)
{
   return levelsString.charAt(j + levelStart);
}
function tileAt(j, i, y)
{
   var _loc1_ = levelsString.charCodeAt(j + levelStart);
   if(_loc1_ == 128)
   {
      return 93;
   }
   if(_loc1_ <= 126)
   {
      return _loc1_ - 46;
   }
   if(_loc1_ <= 182)
   {
      return _loc1_ - 80;
   }
   return _loc1_ - 81;
}
stop();
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
var bfdia5b = SharedObject.getLocal("bfdia5b");
var deathCount;
var timer;
var coins;
var longMode = false;
if(bfdia5b.data.levelProgress == undefined)
{
   clearVars();
}
else
{
   levelProgress = bfdia5b.data.levelProgress;
   gotCoin = new Array(levelCount);
   coins = 0;
   var i = 0;
   while(i < levelCount)
   {
      gotCoin[i] = bfdia5b.data.gotCoin[i];
      if(gotCoin[i])
      {
         coins++;
      }
      i++;
   }
   deathCount = bfdia5b.data.deathCount;
   timer = bfdia5b.data.timer;
}
var lv = new LoadVars();
lv.onLoad = function(success)
{
   if(success)
   {
      _root.levelsString = this.loadedLevels;
      var _loc3_ = 0;
      while(_loc3_ < levelCount)
      {
         levelStart += 2;
         lineLength = 0;
         levelName[_loc3_] = "";
         while(charAt(lineLength) != -35)
         {
            levelName[_loc3_] += charAt2(lineLength);
            lineLength++;
         }
         levelStart += lineLength;
         levelWidth = 10 * charAt(2) + charAt(3);
         levelHeight = 10 * charAt(5) + charAt(6);
         charCount = 10 * charAt(8) + charAt(9);
         bgs[_loc3_] = 10 * charAt(11) + charAt(12);
         longMode = false;
         if(charAt(14) == 24)
         {
            longMode = true;
         }
         levels[_loc3_] = new Array(levelHeight);
         var _loc5_ = 0;
         while(_loc5_ < levelHeight)
         {
            levels[_loc3_][_loc5_] = new Array(levelWidth);
            _loc5_ = _loc5_ + 1;
         }
         if(longMode)
         {
            var _loc7_ = 0;
            while(_loc7_ < levelHeight)
            {
               var _loc6_ = 0;
               while(_loc6_ < levelWidth)
               {
                  levels[_loc3_][_loc7_][_loc6_] = 111 * tileAt(_loc7_ * (levelWidth * 2 + 2) + _loc6_ * 2 + 17,_loc3_,_loc7_) + tileAt(_loc7_ * (levelWidth * 2 + 2) + _loc6_ * 2 + 18,_loc3_,_loc7_);
                  _loc6_ = _loc6_ + 1;
               }
               _loc7_ = _loc7_ + 1;
            }
            levelStart += levelHeight * (levelWidth * 2 + 2) + 17;
         }
         else
         {
            _loc7_ = 0;
            while(_loc7_ < levelHeight)
            {
               _loc6_ = 0;
               while(_loc6_ < levelWidth)
               {
                  levels[_loc3_][_loc7_][_loc6_] = tileAt(_loc7_ * (levelWidth + 2) + _loc6_ + 17,_loc3_,_loc7_);
                  _loc6_ = _loc6_ + 1;
               }
               _loc7_ = _loc7_ + 1;
            }
            levelStart += levelHeight * (levelWidth + 2) + 17;
         }
         startLocations[_loc3_] = new Array(charCount);
         _loc5_ = 0;
         while(_loc5_ < charCount)
         {
            startLocations[_loc3_][_loc5_] = new Array(6);
            var _loc4_ = 0;
            while(_loc4_ < (f - 1) / 3)
            {
               startLocations[_loc3_][_loc5_][_loc4_] = charAt(_loc4_ * 3) * 10 + charAt(_loc4_ * 3 + 1);
               _loc4_ = _loc4_ + 1;
            }
            levelStart += f - 2;
            if(startLocations[_loc3_][_loc5_][5] == 3 || startLocations[_loc3_][_loc5_][5] == 4)
            {
               levelStart++;
               startLocations[_loc3_][_loc5_].push(new Array(0));
               lineLength = 0;
               while(charAt(lineLength) != -35)
               {
                  startLocations[_loc3_][_loc5_][6].push(charAt(lineLength));
                  lineLength++;
               }
               levelStart += lineLength;
            }
            levelStart += 2;
            _loc5_ = _loc5_ + 1;
         }
         lineCount = 10 * charAt(0) + charAt(1);
         levelStart += 4;
         dialogueText[_loc3_] = new Array(lineCount);
         dialogueChar[_loc3_] = new Array(lineCount);
         dialogueFace[_loc3_] = new Array(lineCount);
         _loc5_ = 0;
         while(_loc5_ < lineCount)
         {
            dialogueChar[_loc3_][_loc5_] = 10 * charAt(0) + charAt(1);
            if(charAt(2) == 24)
            {
               dialogueFace[_loc3_][_loc5_] = 2;
            }
            else
            {
               dialogueFace[_loc3_][_loc5_] = 3;
            }
            levelStart += 4;
            lineLength = 0;
            dialogueText[_loc3_][_loc5_] = "";
            while(charAt(lineLength) != -35)
            {
               lineLength++;
               dialogueText[_loc3_][_loc5_] += charAt2(lineLength - 1);
            }
            levelStart += lineLength + 2;
            _loc5_ = _loc5_ + 1;
         }
         mdao2 += 100000 * charAt(0) + 10000 * charAt(1) + 1000 * charAt(2) + 100 * charAt(3) + 10 * charAt(4) + charAt(5);
         mdao[_loc3_] = mdao2;
         levelStart += 8;
         _loc3_ = _loc3_ + 1;
      }
      gotoAndStop("game");
   }
};
lv.load("levels.txt");
