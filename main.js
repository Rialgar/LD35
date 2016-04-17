window.addEventListener("load" , function(){
  var bgCanvas = document.createElement("canvas");
  document.body.appendChild(bgCanvas);
  var canvas = document.createElement("canvas");
  canvas.style.zIndex = 500;
  document.body.appendChild(canvas);
  var curtain = document.createElement("div");
  curtain.style.zIndex = 1000;
  document.body.appendChild(curtain);
  var scale = 1;

  var currentLevel = 0;
  var map = new Map(currentLevel, bgCanvas, scale);

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
  var lastHoverX = 0;
  var hoverY = 0;
  var lastHoverY = 0;
  function clearSelector(ctx){
    ctx.translate(lastHoverX, lastHoverY);
    ctx.clearRect(-.6, -.6, 1.2, 1.2);
    ctx.translate(-lastHoverX, -lastHoverY);
  }
  function drawSelector(ctx){
    ctx.translate(hoverX, hoverY);
    ctx.strokeStyle = selectorColor;
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
    ctx.translate(-hoverX, -hoverY);
    lastHoverX = hoverX;
    lastHoverY = hoverY;
  }

  var selected = null;

  function select(){
    if(selected){
      selected.deselect();
    }
    if(map.tiles[hoverX] && map.tiles[hoverX][hoverY]){
      var shape = map.tiles[hoverX][hoverY].shape;
      if(shape && selected != shape && shape.receptionProgress === false){
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
  var colorset = 0;
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
    } else if(key == "KeyR" || keyCode == 82){
      currentLevel--;
      advanceLevel();
    } else if(key == "KeyC" || keyCode == 67){
      colorset = (colorset+1)%4;
      setColorSet(colorset);
      map.drawBackground();
    }
  })

  var advancing = false;
  function advanceLevel(){
    selected = null;
    curtain.style.opacity = 1;
    advancing = true;
  }

  curtain.addEventListener("transitionend", function(){
    if(advancing){
      if(currentLevel+1  >= Map.specs.length){
        alert("Congratulations! You beat all the levels. Please rate the game at ludumdare.com.");
      } else {
        var ctx = canvas.getContext("2d");
        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(.5, .5);
        map.clear(ctx);
        ctx.restore();
        currentLevel+=1;
        map = new Map(currentLevel, bgCanvas, scale);
        curtain.style.opacity = 0;
        advancing = false;
      }
    }
  });

  function update(millis){
    map.update(millis);
    if(selected && selected.moving){
      hoverX = selected.x;
      hoverY = selected.y;
    }
    if(selected && !selected.selected){
      selected = null;
      if(map.shapes.length == 0){
        advanceLevel();
      }
    }
  }
  function draw(){
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(.5, .5);
    map.clear(ctx);
    clearSelector(ctx);
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
