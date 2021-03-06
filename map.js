function Map(number, bgCanvas, scale){
  var spec = Map.specs[number];
  if(!spec){
    throw new Error("No such map: '"+number+"'");
  }
  if(spec.length != Map.mapSize){
    throw new Error("Invalid map height "+spec.length+" in map: '"+number+"'");
  }
  if(spec[0].length != Map.mapSize){
    throw new Error("Invalid map width "+spec[0].length+" in map: '"+number+"'");
  }
  this.bgCanvas = bgCanvas;
  this.scale = scale;
  this.tiles = [];
  this.shapes = [];
  this.receptors = [];
  this.changers = [];
  for(var x = 0; x < Map.mapSize; x++){
    this.tiles[x] = [];
    for(var y = 0; y < Map.mapSize; y++){
      this.tiles[x][y] = {collision: false};
      switch (spec[y][x]) {
        case "#":
          this.tiles[x][y].collision = true;
          break;
        case "3":
          this.tiles[x][y].shape = new Shape(x, y, 3);
          break;
        case "4":
          this.tiles[x][y].shape = new Shape(x, y, 4);
          break;
        case "5":
          this.tiles[x][y].shape = new Shape(x, y, 5);
          break;
        case "6":
          this.tiles[x][y].shape = new Shape(x, y, 6);
          break;
        case "e":
          this.tiles[x][y].receptor = new Receptor(x, y, 3);
          break;
        case "r":
          this.tiles[x][y].receptor = new Receptor(x, y, 4);
          break;
        case "t":
          this.tiles[x][y].receptor = new Receptor(x, y, 5);
          break;
        case "z":
          this.tiles[x][y].receptor = new Receptor(x, y, 6);
          break;
        case "+":
          this.tiles[x][y].changer = new Changer(x, y, 1);
          break;
        case "-":
          this.tiles[x][y].changer = new Changer(x, y, -1);
          break;
        default:
      }
      if(this.tiles[x][y].shape){
        this.shapes.push(this.tiles[x][y].shape);
      }
      if(this.tiles[x][y].receptor){
        this.receptors.push(this.tiles[x][y].receptor);
      }
      if(this.tiles[x][y].changer){
        this.changers.push(this.tiles[x][y].changer);
      }
    }
  }
  this.drawBackground();
}

Map.prototype.update = function(millis){
  for(var i = 0; i < this.shapes.length; i++){
    var shape = this.shapes[i];
    var xBefore = Math.round(shape.x);
    var yBefore = Math.round(shape.y);
    this.shapes[i].update(millis);
    var xAfter = Math.round(shape.x);
    var yAfter = Math.round(shape.y);
    if(xAfter != xBefore || yAfter != yBefore){
      this.tiles[xBefore][yBefore].shape = null;
      this.tiles[xAfter][yAfter].shape = shape;
    }
    if(shape.receptionProgress === false){
      var receptor = this.tiles[xAfter][yAfter].receptor;
      if(receptor && !receptor.filled && receptor.sides == shape.sides){
        shape.startReception(receptor);
      } else {
        var changer = this.tiles[xAfter][yAfter].changer;
        if(changer){
          changer.change(shape);
        }
      }
    } else if (shape.receptor.filled){
      this.shapes.splice(this.shapes.indexOf(shape), 1);
      i--;
      this.redrawReceptor(shape.receptor);
    }
  }
  for(var i = 0; i < this.receptors.length; i++){
    this.receptors[i].update(millis);
  }
  for(var i = 0; i < this.changers.length; i++){
    this.changers[i].update(millis);
  }
};

Map.prototype.clear = function(ctx){
  for(var i = 0; i < this.shapes.length; i++){
    ctx.translate(this.shapes[i].x, this.shapes[i].y);
    this.shapes[i].clear(ctx);
    ctx.translate(-this.shapes[i].x, -this.shapes[i].y);
  }
  for(var i = 0; i < this.changers.length; i++){
    ctx.translate(this.changers[i].x, this.changers[i].y);
    this.changers[i].clear(ctx);
    ctx.translate(-this.changers[i].x, -this.changers[i].y);
  }
}

Map.prototype.draw = function(ctx){
  for(var i = 0; i < this.shapes.length; i++){
    ctx.translate(this.shapes[i].x, this.shapes[i].y);
    this.shapes[i].draw(ctx);
    ctx.translate(-this.shapes[i].x, -this.shapes[i].y);
  }
  for(var i = 0; i < this.changers.length; i++){
    ctx.translate(this.changers[i].x, this.changers[i].y);
    this.changers[i].draw(ctx);
    ctx.translate(-this.changers[i].x, -this.changers[i].y);
  }
};

Map.prototype.drawBackground = function(){
  var ctx = this.bgCanvas.getContext("2d");
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
  ctx.save();
  ctx.scale(this.scale, this.scale);
  ctx.translate(.5, .5);
  ctx.fillStyle = wallColor;
  ctx.beginPath();
  for(var x = 0; x < Map.mapSize; x++){
    for(var y = 0; y < Map.mapSize; y++){
      var tile = this.tiles[x][y];
      ctx.translate(x, y);
      if(tile.collision){
        ctx.rect(-.5, -.5, 1, 1);
      }
      ctx.translate(-x,-y);
    }
  }
  ctx.fill();
  for(var i = 0; i < this.receptors.length; i++){
    ctx.translate(this.receptors[i].x, this.receptors[i].y);
    this.receptors[i].draw(ctx);
    ctx.translate(-this.receptors[i].x, -this.receptors[i].y);
  }
  ctx.restore();
}

Map.prototype.redrawReceptor = function(receptor){
  var ctx = this.bgCanvas.getContext("2d");
  ctx.save();
  ctx.scale(this.scale, this.scale);
  ctx.translate(receptor.x + .5, receptor.y + .5);
  receptor.draw(ctx);
  ctx.restore();
}

Map.prototype.resize = function(scale){
  this.scale = scale;
  this.drawBackground();
}

Map.prototype.hasColision = function(x, y){
  return x < 0 || y < 0 || x >= Map.mapSize || y >= Map.mapSize ||
    this.tiles[x][y].collision || this.tiles[x][y].shape;
}

Map.prototype.getTarget = function(fromX, fromY, dirX, dirY){
  while(true){
    var nx = fromX + dirX;
    var ny = fromY + dirY;
    if(this.hasColision(nx, ny)){
      return {x: fromX, y: fromY};
    }
    fromX = nx;
    fromY = ny;
  }
};

Map.specs = [
  [
    "####################",
    "#3#r               #",
    "# ################ #",
    "# #5#z           # #",
    "# # ############ # #",
    "# # #+        -# # #",
    "# # #          # # #",
    "# # #          # # #",
    "# # #          # # #",
    "# # #          # # #",
    "# # #          # # #",
    "# # #          # # #",
    "# # #          # # #",
    "# # #          # # #",
    "# # #-        +#6# #",
    "# # ############## #",
    "# #             t#4#",
    "# ##################",
    "#                 e#",
    "####################"
  ],
  [
    "####################",
    "#3                 #",
    "#        #         #",
    "#                 ##",
    "#                  #",
    "#                  #",
    "#    r             #",
    "#         #        #",
    "##               e #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                 4#",
    "####################"
  ],
  [
    "####################",
    "#4       #        5#",
    "#             #    #",
    "#                  #",
    "#                  #",
    "#  r               #",
    "#                  #",
    "#  t               #",
    "#            #     #",
    "#       #          #",
    "#                 ##",
    "#                  #",
    "#                  #",
    "#                  #",
    "# #                #",
    "#           #      #",
    "#                  #",
    "#                  #",
    "#                  #",
    "####################"
  ],
  [
    "####################",
    "#4       #         #",
    "#                  #",
    "#                  #",
    "#      r           #",
    "#                  #",
    "#                  #",
    "#   #       #      #",
    "#       #          #",
    "#                  #",
    "#                  #",
    "#     z            #",
    "#  #               #",
    "#          #       #",
    "#    #             #",
    "#   #              #",
    "#       #          #",
    "#           #      #",
    "#6       #         #",
    "####################"
  ],
  [
    "####################",
    "#    4   r#        #",
    "#       ###        #",
    "#4      #          #",
    "#       #          #",
    "## #######         #",
    "#        #         #",
    "#        #         #",
    "##       #         #",
    "#       ##         #",
    "# #      #         #",
    "#        #         #",
    "#                  #",
    "#      # #         #",
    "#        #         #",
    "##########         #",
    "#                  #",
    "#                  #",
    "#                 r#",
    "####################"
  ],
  [
    "####################",
    "#55    #           #",
    "#      #           #",
    "#           #      #",
    "#             #    #",
    "#      #           #",
    "#      #           #",
    "##########  # ######",
    "#    #      #      #",
    "#           #      #",
    "#           ##    ##",
    "#    #      #      #",
    "#    ########   t  #",
    "#           #      #",
    "#           #      #",
    "#           #      #",
    "#           #      #",
    "#####       #      #",
    "#t                 #",
    "####################"
  ],
  [
    "####################",
    "#3       #         #",
    "# r                #",
    "#                  #",
    "#                  #",
    "#    #             #",
    "#         #        #",
    "#                  #",
    "#     #            #",
    "##                 #",
    "#       #          #",
    "#                  #",
    "#              +   #",
    "# #                #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "####################"
  ],
  [
    "####################",
    "#6              #  #",
    "#                  #",
    "#                  #",
    "#  #               #",
    "#              #   #",
    "#                  #",
    "#                  #",
    "#        #         #",
    "#   #         #    #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#       e -        #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#   #              #",
    "####################"
  ],
  [
    "####################",
    "#                  #",
    "#  #               #",
    "#        +         #",
    "#3      #          #",
    "#  #              ##",
    "#      #           #",
    "# #                #",
    "#                  #",
    "#                 5#",
    "#                  #",
    "#           #      #",
    "#       #      r   #",
    "##           #     #",
    "#        #         #",
    "#   r              #",
    "#             -    #",
    "#          #       #",
    "#                  #",
    "####################"
  ],
  [
    "####################",
    "# 3    #           #",
    "#      #           #",
    "#      #           #",
    "#                  #",
    "#                  #",
    "#      #           #",
    "#   4  #           #",
    "###########    #####",
    "#       #          #",
    "#       #          #",
    "#       #   +      #",
    "#                  #",
    "#                  #",
    "#       #          #",
    "#       #          #",
    "###   ##############",
    "###   ########### r#",
    "###-              r#",
    "####################"
  ],
  [
    "####################",
    "#         #        #",
    "#     #            #",
    "#                  #",
    "#3            #    #",
    "#          #       #",
    "#      #           #",
    "#      r           #",
    "#         #       3#",
    "#          r       #",
    "#            #     #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#   +              #",
    "#                  #",
    "#                  #",
    "####################"
  ],
  [
    "####################",
    "#    e          #  #",
    "#3 3##########  #  #",
    "# 4 #       ##  ####",
    "#            ##    #",
    "#   #        #   ###",
    "#   #        #     #",
    "#########  #####-###",
    "##t#t####          #",
    "## # ##            #",
    "## # ##            #",
    "## # ##            #",
    "## # ##            #",
    "##-#-## #          #",
    "#       #          #",
    "#       #####  +   #",
    "#    ## #          #",
    "#  #  #     #      #",
    "#     #     #      #",
    "####################"
  ],
  [
    "####################",
    "#                  #",
    "#                  #",
    "#     #       #    #",
    "##            #   3#",
    "##   #        #    #",
    "# #                #",
    "#   #   #          #",
    "#        e         #",
    "#  ## #      #     #",
    "#                  #",
    "#      # #     #   #",
    "#     4#+##    #   #",
    "#      # #     #   #",
    "#                  #",
    "#      ###         #",
    "#  z               #",
    "# # # # # # # #    #",
    "#                  #",
    "####################"
  ],
  [
    "####################",
    "#                  #",
    "#       ###        #",
    "#                  #",
    "#       #+#        #",
    "#        #         #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#     3  r         #",
    "#     4# z #       #",
    "#     5  t         #",
    "#       # #        #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "#                  #",
    "####################"
  ]
]

Map.mapSize = 20;
