function Shape(x, y, sides){
  this.rotation = 0;
  this.radius = .4;
  this.sides = sides;
  this.x = x;
  this.y = y;
}

Shape.prototype.update = function(millis){
  this.rotation += Math.PI * millis/1000;
}

Shape.prototype.draw = function(ctx){
  ctx.save();
  ctx.translate(this.x, this.y);
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
  ctx.fillStyle = shapeColors[(this.sides-3)%shapeColors.length];
  ctx.fill();
  ctx.restore();
}
