window.addEventListener("load" , function(){
  var bgCanvas = document.createElement("canvas");
  document.body.appendChild(bgCanvas);
  var canvas = document.createElement("canvas");
  canvas.style.zIndex = 500;
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

  var hoverX = 0;
  var hoverY = 0;
  function drawSelector(ctx){
    ctx.translate(hoverX, hoverY);
    ctx.strokeStyle = "white";
    ctx.lineWidth = .1;
    ctx.lineCap = "round";
    ctx.beginPath();

    ctx.moveTo(-.5, -.2);
    ctx.arc(-.3, -.3, .2, Math.PI, 3/2*Math.PI);
    ctx.lineTo(-.2, -.5);

    ctx.moveTo(.2, -.5);
    ctx.arc(.3, -.3, .2, 3/2*Math.PI, 0);
    ctx.lineTo(.5, -.2);

    ctx.moveTo(.5, .2);
    ctx.arc(.3, .3, .2, 0, 1/2*Math.PI);
    ctx.lineTo(.2, .5);

    ctx.moveTo(-.2, .5);
    ctx.arc(-.3, .3, .2, 1/2*Math.PI, Math.PI);
    ctx.lineTo(-.5, .2);

    ctx.stroke();
  }

  var selected = null;

  function select(){
    if(selected){
      selected.deselect();
    }
    if(map.tiles[hoverX] && map.tiles[hoverX][hoverY]){
      var shape = map.tiles[hoverX][hoverY].shape;
      if(shape && selected != shape){
        shape.select();
        selected = shape;
      } else {
        selected = null;
      }
    }
  }

  function move(dirX, dirY){
    var target = map.getTarget(selected.x, selected.y, dirX, dirY);
    selected.setTarget(target.x, target.y);
  }

  window.addEventListener("mousemove", function(ev){
    if(selected && selected.moving){
      return;
    }
    hoverX = Math.floor(ev.clientX/scale);
    hoverY = Math.floor(ev.clientY/scale);
  });
  window.addEventListener("click", function(){
    if(selected && selected.moving){
      return;
    }
    select();
  });
  window.addEventListener("keydown", function(ev){
    if(selected && selected.moving){
      return;
    }
    var key = ev.key || ev.code;
    var keyCode = ev.keyCode || ev.which || ev.charCode;
    console.log(key, keyCode);
    if(key == "Space" || keyCode == "32" || key == "Enter" || keyCode == "13"){
      select();
      ev.preventDefault();
    } else if(key == "ArrowLeft" || keyCode == 37 || key == "KeyA" || keyCode == 65){
      if(selected){
        move(-1, 0);
      }else if(hoverX > 0){
        hoverX-=1;
      }
      ev.preventDefault();
    } else if(key == "ArrowRight" || keyCode == 39 || key == "KeyD" || keyCode == 68){
      if(selected){
        move(1, 0);
      }else if(hoverX < Map.mapSize-1){
        hoverX+=1;
      }
      ev.preventDefault();
    } else if(key == "ArrowUp" || keyCode == 38 || key == "KeyW" || keyCode == 80){
      if(selected){
        move(0, -1);
      }else if(hoverY > 0){
        hoverY-=1;
      }
      ev.preventDefault();
    } else if(key == "ArrowDown" || keyCode == 40 || key == "KeyS" || keyCode == 83){
      if(selected){
        move(0, 1);
      }else if(hoverY < Map.mapSize-1){
        hoverY+=1;
      }
      ev.preventDefault();
    }
  })

  function update(millis){
    map.update(millis);
    if(selected && selected.moving){
      hoverX = selected.x;
      hoverY = selected.y;
    }
  }
  function draw(){
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    map.draw(ctx);
    drawSelector(ctx);
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
