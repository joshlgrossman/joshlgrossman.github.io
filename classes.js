// classes
function Player(){
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.currentAnimation = Sprites.playerRun;
}

Player.prototype.currentTile = function(){
	return Game.map.get(this.x, this.y);
};

Player.prototype.update = function(){
	var walking = false;
	if(Key.isDown(87)){
		walking = true;
		this.vy = -1;
	} else if (Key.isDown(83)){
		walking = true;
		this.vy = 1;
	}
	if(Key.isDown(65)){
		walking = true;
		this.vx = -1;
	} else if(Key.isDown(68)){
		walking = true;
		this.vx = 1;
	}
	if(walking) this.currentAnimation.play();
	else this.currentAnimation.reset();
	var dx = (this.vx!=0)?(this.vx/Math.abs(this.vx)*12):0;
	var dy = (this.vy!=0)?(this.vy/Math.abs(this.vy)*10):0;
	var tileX = Math.floor((this.x+12+dx)/24);
	var tileY = Math.floor((this.y+14+dy)/24);
	var type = Game.camera.currentRoom.map().tiles.get(tileX,tileY).type;
	if(type != Tile.floor){
		if(type == Tile.door){
			var r;
			if(tileX == 0){
				r = Game.camera.currentRoom.doors[Direction.left];
			} else if(tileX == 15){
				r = Game.camera.currentRoom.doors[Direction.right];
			} else if(tileY == 0){
				r = Game.camera.currentRoom.doors[Direction.up];
			} else if(tileY == 9){
				r = Game.camera.currentRoom.doors[Direction.down];
			}
			Game.camera.panTo(r);
		} else if(type == Tile.stairsUp){
			Game.previousLevel();
		} else if(type == Tile.stairsDown){
			Game.nextLevel();
		}
		this.vx = 0;
		this.vy = 0;
	}
	var v = this.vx*this.vx+this.vy*this.vy;
	if(v>1){
		v = Math.sqrt(v);
		this.vx *= 1/v;
		this.vy *= 1/v;
	}
	this.x += this.vx;
	this.y += this.vy;
	this.vx *= 0.8;
	this.vy *= 0.8;
	this.currentAnimation.update();
};

Player.prototype.draw = function(gfx){
	this.currentAnimation.draw(gfx,this.x,this.y);
};