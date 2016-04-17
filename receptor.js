function Receptor(x, y, sides){
  this.radius = .4;
  this.sides = sides;
  this.x = x;
  this.y = y;
  this.filled = false;
}

Receptor.prototype.update = function(millis){

}

Receptor.prototype.draw = function(ctx){
  ctx.fillStyle = shapeColors[(this.sides-3)%shapeColors.length];
  ctx.beginPath();
  ctx.rect(-.5, -.5, 1, 1);
  ctx.fill();
  if(!this.filled){
    ctx.fillStyle = "black";
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
    ctx.fill();
  }
}
