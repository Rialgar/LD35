function Receptor(x, y, sides){
  this.radius = .4;
  this.sides = sides;
  this.x = x;
  this.y = y;
  this.filled = false;
  this.receptionProgress = 0;
}

Receptor.prototype.update = function(millis){
  if(this.shape && this.receptionProgress < 1){
    this.receptionProgress = Math.min(this.receptionProgress + millis/1000, 1);
    this.shape.setRotation(this.shape.receptionStartAngle * (1-this.receptionProgress));

    this.shape.x = this.shape.receptionStartX * (1-this.receptionProgress) + this.x*this.receptionProgress;
    this.shape.y = this.shape.receptionStartY * (1-this.receptionProgress) + this.y*this.receptionProgress;

    var sqBase = (this.receptionProgress-.5);
    this.shape.setScale(2 - sqBase * sqBase * 4);

    if(this.receptionProgress == 1){
      this.shape.deselect();
    }
  }
}

Receptor.prototype.draw = function(ctx){
  ctx.fillStyle = shapeColors[(this.sides-3)%shapeColors.length];
  ctx.beginPath();
  ctx.rect(-.5, -.5, 1, 1);
  ctx.fill();
  ctx.beginPath();
  for(var i = 0; i < this.sides; i++){
    var angle = i*2*Math.PI/this.sides;
    var x = Math.sin(angle) * this.radius;
    var y = Math.cos(angle) * this.radius;
    if(i==0){
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.closePath();
  if(!this.filled){
    ctx.fillStyle = backgroundColor;
    ctx.fill();
  } else {
    ctx.strokeStyle = backgroundColor;
    ctx.lineWidth = .05;
    ctx.lineJoin = "round";
    ctx.stroke();
  }
}
