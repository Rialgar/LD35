function Shape(x, y, sides){
  this.rotation = 0;
  this.radius = .4;
  this.sides = sides;
  this.drawnSides = sides;
  this.x = (this.targetX = x);
  this.y = (this.targetY = y);
  this.selected = false;
  this.moving = false;
  this.receptionProgress = false;
}

Shape.prototype.update = function(millis){
  if(this.receptionProgress === false){
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
    if(this.sides != this.drawnSides){
      var delta = (this.sides - this.drawnSides);
      var change = delta/Math.abs(delta) * millis/1000;
      if(Math.abs(change) < Math.abs(delta)){
        this.drawnSides += change;
      } else {
        this.drawnSides = this.sides;
      }
    }
  } else {
    this.receptionProgress = Math.min(this.receptionProgress + millis/1000, 1);
    this.setRotation(this.receptionStartAngle * (1-this.receptionProgress));

    this.x = this.receptionStartX * (1-this.receptionProgress) + this.receptor.x*this.receptionProgress;
    this.y = this.receptionStartY * (1-this.receptionProgress) + this.receptor.y*this.receptionProgress;

    var sqBase = (this.receptionProgress-.5);
    this.setScale(2 - sqBase * sqBase * 4);

    if(this.receptionProgress == 1){
      this.deselect();
      this.receptor.filled = true;
    }
  }
}

Shape.prototype.clear = function(ctx){
  ctx.save();
  ctx.translate(this.lastX-this.x, this.lastY-this.y);
  ctx.clearRect(-this.lastRadius, -this.lastRadius, this.lastRadius*2, this.lastRadius*2);
  ctx.restore();
}

function lerpColors(c1, c2, t){
  var r1 = parseInt(c1.substr(1,2),16);
  var r2 = parseInt(c2.substr(1,2),16);
  var r = Math.round(r1 * (1-t) + r2 * t);
  r = r.toString(16);
  if(r.length < 2){
    r = "0"+r;
  }
  var g1 = parseInt(c1.substr(3,2),16);
  var g2 = parseInt(c2.substr(3,2),16);
  var g = Math.round(g1 * (1-t) + g2 * t);
  g = g.toString(16);
  if(g.length < 2){
    g = "0"+g;
  }
  var b1 = parseInt(c1.substr(5,2),16);
  var b2 = parseInt(c2.substr(5,2),16);
  var b = Math.round(b1 * (1-t) + b2 * t);
  b = b.toString(16);
  if(b.length < 2){
    b = "0"+b;
  }
  return "#"+r+g+b;
}

Shape.prototype.draw = function(ctx){
  var floor = Math.floor(this.drawnSides);
  var ceil = Math.ceil(this.drawnSides);
  var c1 = shapeColors[(floor-3)%shapeColors.length];
  var c2 = shapeColors[(ceil-3)%shapeColors.length];
  ctx.fillStyle = lerpColors(c1, c2, this.drawnSides-floor);
  ctx.beginPath();
  for(var i = 0; i < this.drawnSides; i++){
    var angle = this.rotation + i*2*Math.PI/this.drawnSides;
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
  this.lastX = this.x;
  this.lastY = this.y;
  this.lastRadius = this.radius+0.1;
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

Shape.prototype.startReception = function(receptor){
  while(this.rotation > -Math.PI/2){
    this.rotation -= Math.PI * 2/this.sides;
  }
  this.receptionStartAngle = this.rotation;
  this.receptionStartX = this.x;
  this.receptionStartY = this.y;
  this.receptor = receptor;
  this.receptionProgress = 0;
}

Shape.prototype.changeTo = function(newSides){
  this.sides = newSides;
}
