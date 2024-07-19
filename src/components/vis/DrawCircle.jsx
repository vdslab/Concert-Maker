const DrawCircle = (ctx, x, y, radius, color, strokeColor) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
};

export default DrawCircle;
