window.addEventListener("load" , function(){
  var bgCanvas = document.createElement("canvas");
  document.body.appendChild(bgCanvas);
  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  var scale = 1;

  var map = new Map(0, bgCanvas, scale);

  function resize(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    bgCanvas.width = canvas.clientWidth;
    bgCanvas.height = canvas.clientHeight;
    var sx = canvas.width/20;
    var sy = canvas.height/20;
    scale = Math.min(sx, sy);
    map.resize(scale);
  }
  resize();
  window.addEventListener("resize", resize);

  function update(millis){
    map.update(millis);
  }
  function draw(){
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    map.draw(ctx);
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
