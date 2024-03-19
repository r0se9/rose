console.clear();
let ctx = cnv.getContext("2d");

let img = new Image();
img.crossOrigin = "anonymous";
img.src = "/rose.jpg";
img.onload = () => {
  console.log(img);

  // prepare image data
  let imgSize = { x: img.width, y: img.height };

  ctx.canvas.width = imgSize.x;
  ctx.canvas.height = imgSize.y;
  ctx.drawImage(img, 0, 0);

  let imgData = ctx.getImageData(0, 0, img.width, img.height);
  let imgBytes = imgData.data;
  //

  let canvasRatio = imgSize.x / imgSize.y;

  let uY = (val) => ctx.canvas.height * 0.01 * val;
  let uX = (val) => ctx.canvas.width * 0.01 * val;

  function resize() {
    ctx.canvas.height = innerHeight * 0.95;
    ctx.canvas.width = ctx.canvas.height * canvasRatio;
    ctx.fillStyle = "black";
    //ctx.fillRect(0, 0, uX(100), uY(100));
  }

  resize();
  window.addEventListener("resize", (event) => {
    resize();
  });

  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed;
      this.speedRatio;
      this.color;
      this.radius = 0.1;
      this.init();
    }
    init() {
      this.x = Math.random() * 100;
      this.y = 0; //Math.random() * 100;
      this.speed = Math.random() * 0.6 + 0.4;
    }
    getData() {
      let x = Math.floor(this.x * 0.01 * imgSize.x);
      let y = Math.floor(this.y * 0.01 * imgSize.y);

      let idx = y * (imgSize.x * 4) + x * 4;
      let r = imgBytes[idx + 0];
      let g = imgBytes[idx + 1];
      let b = imgBytes[idx + 2];
      this.color = `rgb(${r}, ${g}, ${b})`;
      let gray = (r + g + b) / 3 / 255;

      this.speedRatio = 1 - gray * 0.9;
    }
    update() {
      this.y += this.speed * this.speedRatio;
      if (this.y >= 100) {
        this.init();
        this.getData();
      }
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(uX(this.x), uY(this.y), uY(this.radius), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Points {
    constructor(amount) {
      this.amount = amount;
      this.points;
      this.init();
    }
    init() {
      this.points = Array.from({ length: this.amount }, () => {
        return new Point();
      });
    }
    update() {
      this.points.forEach((p) => {
        p.getData();
        p.update();
        p.draw();
      });
    }
  }

  let points = new Points(15000);

  draw();

  function draw() {
    requestAnimationFrame(draw);
    ctx.fillStyle = `rgba(32, 32, 32, 0.1)`;
    ctx.fillRect(0, 0, uX(100), uY(100));
    points.update();
  }
};
