window.addEventListener("load" , function(){
  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  var scale = 1;

  var shapes = [];
  shapes.push(new Shape(1, 2, 3));
  shapes.push(new Shape(2, 2, 4));
  shapes.push(new Shape(3, 2, 5));
  shapes.push(new Shape(4, 2, 6));
  shapes.push(new Shape(5, 2, 7));
  shapes.push(new Shape(6, 2, 8));

  function resize(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var sx = canvas.width/20;
    var sy = canvas.height/20;
    scale = Math.min(sx, sy);
  }
  resize();
  window.addEventListener("resize", resize);

  function update(millis){
    for(var i = 0; i < shapes.length; i++){
      shapes[i].update(millis);
    }
  }
  function draw(){
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    for(var i = 0; i < shapes.length; i++){
      shapes[i].draw(ctx);
    }
    ctx.restore();
  }
  var last = Date.now();
  function step(){
    var now = Date.now();
    var delta = now - last;
    last = now;
    update(delta),
    draw();
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);

});
