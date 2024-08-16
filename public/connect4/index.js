const canvases = (function () {
  let count = 100;
  let arr = [];
  for (let i = 0; i < count; i++) {
    let canvas = document.createElement("canvas");
    arr.push(canvas);
  }
  return arr;
})();

function drawCanvases(canvases) {
  for (let i = 0; i < canvases.length; i++) {
    document.body.append(canvases[i]);
  }
}

function resizeCanvas(canvas) {}
drawCanvases(canvases);
