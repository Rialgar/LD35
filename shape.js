function Shape(x, y, sides){
  this.rotation = 0;
  this.radius = .4;
  this.sides = sides;
  this.x = x;
  this.y = y;
  this.selected = false;
}

Shape.prototype.update = function(millis){
  if(this.selected){
    this.rotation = (this.rotation + Math.PI * millis/1000)%(2*Math.PI);
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
