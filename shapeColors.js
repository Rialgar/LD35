window.setColorSet = function(id){
  if(id == 1){
    window.shapeColors = [
      "#990000",
      "#008800",
      "#000099",
      "#999900"
    ];
    window.backgroundColor = "white";
    window.wallColor = "#444444";
    window.selectorColor = "black";
    window.plusColor = "#004400";
    window.minusColor = "#440000";
  } else if(id == 2){
    window.shapeColors = [
      "#444444",
      "#AAAAAA",
      "#666666",
      "#CCCCCC"
    ];
    window.backgroundColor = "#000000";
    window.wallColor = "#888888";
    window.selectorColor = "#FFFFFF";
    window.plusColor = "#FFFFFF";
    window.minusColor = "#FFFFFF";
  } else if(id == 3){
    window.shapeColors = [
      "#BBBBBB",
      "#555555",
      "#999999",
      "#333333"
    ];
    window.backgroundColor = "#FFFFFF";
    window.wallColor = "#777777";
    window.selectorColor = "#000000";
    window.plusColor = "#000000";
    window.minusColor = "#000000";
  }else {
    window.shapeColors = [
      "#FF0000",
      "#00FF00",
      "#FFFF00",
      "#FF00FF"
    ];
    window.backgroundColor = "black";
    window.wallColor = "grey";
    window.selectorColor = "white";
    window.plusColor = "green";
    window.minusColor = "darkred";
  }
}
setColorSet();
