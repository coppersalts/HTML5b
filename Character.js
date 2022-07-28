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
		this.stoodOnBy = new Array(0);
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
		this.buttonsPressed = new Array(0);
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
		this.legdire = 1;
		this.leg1skew = 0;
		this.leg2skew = 0;
		this.legAnimationFrame = [0,0]; // Animation offset.
		this.burstFrame = -1;
		this.diaMouthFrame = 0;
		this.expr = 0;
		this.dExpr = tdExpr;
		this.acidDropTimer = [0, 0]; // Why am I doing it like this
	}

	applyForces(grav, control, waterUpMaxSpeed)
	{
		var _loc2_ = undefined;
		if(grav >= 0)
		{
			_loc2_ = Math.sqrt(grav);
		}
		if(grav < 0)
		{
			_loc2_ = - Math.sqrt(- grav);
		}
		if(!this.onob && this.submerged != 1)
		{
			this.vy = Math.min(this.vy + _loc2_,25);
		}
		if(this.onob || control)
		{
			this.vx = (this.vx - this.fricGoal) * this.friction + this.fricGoal;
		}
		else
		{
			this.vx *= 1 - (1 - this.friction) * 0.12;
		}
		if(Math.abs(this.vx) < 0.01)
		{
			this.vx = 0;
		}
		if(this.submerged == 1)
		{
			this.vy = 0;
			if(this.weight2 > 0.18)
			{
				this.submerged = 2;
			}
		}
		else if(this.submerged >= 2)
		{
			if(this.vx > 1.5)
			{
				this.vx = 1.5;
			}
			if(this.vx < -1.5)
			{
				this.vx = -1.5;
			}
			if(this.vy > 1.8)
			{
				this.vy = 1.8;
			}
			if(this.vy < - waterUpMaxSpeed)
			{
				this.vy = - waterUpMaxSpeed;
			}
		}
	}
	charMove() {
		this.y += this.vy;
		this.x += this.vx;
	}
	moveHorizontal(power) {
		if (power * this.fricGoal <= 0 && !this.onob)
		{
			this.fricGoal = 0;
		}
		this.vx += power;
		if(power < 0)
		{
			this.dire = 1;
		}
		if(power > 0)
		{
			this.dire = 3;
		}
		this.justChanged = 2;
	}
	stopMoving() {
		if(this.dire == 1)
		{
			this.dire = 2;
		}
		if(this.dire == 3)
		{
			this.dire = 4;
		}
	}

	jump(jumpPower) {
		this.vy = jumpPower;
	}

	swimUp(jumpPower)
	{
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
