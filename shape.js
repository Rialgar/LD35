function Shape(x, y, sides){
  this.rotation = 0;
  this.radius = .4;
  this.sides = sides;
  this.x = (this.targetX = x);
  this.y = (this.targetY = y);
  this.selected = false;
  this.moving = false;
}

Shape.prototype.update = function(millis){
  if(this.selected){
    this.rotation = (this.rotation + Math.PI * millis/1000)%(2*Math.PI);
  }
  if(this.moving){
    if(this.targetX != this.x || this.targetY != this.y){
      var deltaX = this.targetX - this.x;
      var movX = deltaX/Math.abs(deltaX) * millis*10/1000;
      if(Math.abs(movX) < Math.abs(deltaX)){
        this.x += movX;
      } else {
        this.x = this.targetX;
      }
      var deltaY = this.targetY - this.y;
      var movY = deltaY/Math.abs(deltaY) * millis*10/1000;
      if(Math.abs(movY) < Math.abs(deltaY)){
        this.y += movY;
      } else {
        this.y = this.targetY;
      }
    } else {
      this.moving = false;
    }
  }
}

Shape.prototype.draw = function(ctx){
  ctx.fillStyle = shapeColors[(this.sides-3)%shapeColors.length];
  ctx.beginPath();
  for(var i = 0; i < this.sides; i++){
    var angle = this.rotation + i*2*Math.PI/this.sides;
    var x = Math.sin(angle) * this.radius;
    var y = Math.cos(angle) * this.radius;
    if(i==0){
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.closePath();
  ctx.fill();
  if(this.selected){
    ctx.strokeStyle = "white";
    ctx.lineWidth = .05;
    ctx.lineJoin = "round";
    ctx.stroke();
  }
}

Shape.prototype.select = function(){
  this.selected = true;
}

Shape.prototype.deselect = function(){
  this.selected = false;
}

Shape.prototype.setTarget = function(x, y){
  this.targetX = x;
  this.targetY = y;
  this.moving = true;
}

Shape.prototype.setRotation = function(angle){
  this.rotation = angle;
}

Shape.prototype.setScale = function(scale){
  this.radius = .4 * scale;
}

Shape.prototype.saveReceptionStart = function(){
  while(this.rotation > -Math.PI/2){
    this.rotation -= Math.PI * 2/this.sides;
  }
  this.receptionStartAngle = this.rotation;
  this.receptionStartX = this.x;
  this.receptionStartY = this.y;
}
