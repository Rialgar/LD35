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
        default:
      }
      if(this.tiles[x][y].shape){
        this.shapes.push(this.tiles[x][y].shape);
      }
      if(this.tiles[x][y].receptor){
        this.receptors.push(this.tiles[x][y].receptor);
      }
    }
  }
  this.drawBackground();
}

Map.prototype.update = function(millis){
  for(var i = 0; i < this.shapes.length; i++){
    this.shapes[i].update(millis);
  }
  for(var i = 0; i < this.receptors.length; i++){
    this.receptors[i].update(millis);
  }
};

Map.prototype.draw = function(ctx){
  ctx.translate(.5, .5);
  for(var i = 0; i < this.shapes.length; i++){
    ctx.translate(this.shapes[i].x, this.shapes[i].y);
    this.shapes[i].draw(ctx);
    ctx.translate(-this.shapes[i].x, -this.shapes[i].y);
  }
  for(var i = 0; i < this.receptors.length; i++){
    ctx.translate(this.receptors[i].x, this.receptors[i].y);
    this.receptors[i].draw(ctx);
    ctx.translate(-this.receptors[i].x, -this.receptors[i].y);
  }
};

Map.prototype.drawBackground = function(){
  var ctx = this.bgCanvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
  ctx.save();
  ctx.scale(this.scale, this.scale);
  ctx.translate(.5, .5);
  for(var x = 0; x < Map.mapSize; x++){
    for(var y = 0; y < Map.mapSize; y++){
      var tile = this.tiles[x][y];
      ctx.translate(x, y);
      if(tile.collision){
        ctx.fillStyle = "grey";
        ctx.rect(-.5, -.5, 1, 1);
        ctx.fill();
      }
      ctx.translate(-x,-y);
    }
  }
  ctx.restore();
}

Map.prototype.resize = function(scale){
  this.scale = scale;
  this.drawBackground();
}

Map.specs = [
  [
    "####################",
    "#3#4#5#6#          #",
    "# # # # #          #",
    "# # # # #          #",
    "# # # # #          #",
    "# # # # #          #",
    "# # # # #          #",
    "# # # # #          #",
    "# # # # #          #",
    "# # # # #          #",
    "# # # # #          #",
    "# # # # ############",
    "# # # #           z#",
    "# # # ##############",
    "# # #             t#",
    "# # ################",
    "# #               r#",
    "# ##################",
    "#                 e#",
    "####################"
  ]
]

Map.mapSize = 20;
