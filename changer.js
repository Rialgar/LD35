function Changer(x, y, amount){
  this.x = x;
  this.y = y;
  this.amount = amount;
}

Changer.prototype.clear = function(ctx){
  ctx.clearRect(-.5, -.5, 1, 1);
}

Changer.prototype.draw = function(ctx){
  if(this.amount > 0){
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(-0.3, -0.1);
    ctx.lineTo(-0.1, -0.1);
    ctx.lineTo(-0.1, -0.3);
    ctx.lineTo( 0.1, -0.3);
    ctx.lineTo( 0.1, -0.1);
    ctx.lineTo( 0.3, -0.1);
    ctx.lineTo( 0.3,  0.1);
    ctx.lineTo( 0.1,  0.1);
    ctx.lineTo( 0.1,  0.3);
    ctx.lineTo(-0.1,  0.3);
    ctx.lineTo(-0.1,  0.1);
    ctx.lineTo(-0.3,  0.1);
    ctx.closePath();
    ctx.fill();
  } else if (this.amount < 0){
    ctx.fillStyle = "darkred";
    ctx.beginPath();
    ctx.moveTo(-0.3, -0.1);
    ctx.lineTo( 0.3, -0.1);
    ctx.lineTo( 0.3,  0.1);
    ctx.lineTo(-0.3,  0.1);
    ctx.closePath();
    ctx.fill();
  }
}

Changer.prototype.update = function(){
  if(this.lastChanged){
    var x = Math.round(this.lastChanged.x);
    var y = Math.round(this.lastChanged.y);
    if(x != this.x || y != this.y){
      this.lastChanged = null;
    }
  }
}

Changer.prototype.change = function(shape){
  if(this.lastChanged === shape){
    return;
  }
  var newSides = shape.sides + this.amount;
  if(newSides > 2 && newSides < 7){
    shape.changeTo(newSides);
    this.lastChanged = shape;
  }
}
