const canvasCollection = document.getElementsByTagName("canvas");

function drawCube(canvas) {}

function initDraw(child) {
  // Each 'child' represents a child node of the HTML Collection of each canvas on the page.
  for (let i = 0; i < child.length; i++) {
    drawCube(child[i]);
  }
}
initDraw(canvasCollection);
``;
