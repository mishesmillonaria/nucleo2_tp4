const canvas = document.getElementById("lienzo");
const sin_pretexto = canvas.getContext("2d");

let fonditoCocainomano = "white";
let dibujando = false;
let posX = 0;
let posY = 0;

function setup() {
  sin_pretexto.fillStyle = fonditoCocainomano;
  sin_pretexto.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;

  if (mouseY > 0) {
    dibujando = true;
    posX = e.clientX - rect.left;
    posY = e.clientY - rect.top;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!dibujando) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (mouseY > 0) {
    sin_pretexto.strokeStyle = "#000000";
    sin_pretexto.lineWidth = 18;
    sin_pretexto.lineCap = "round";

    sin_pretexto.beginPath();
    sin_pretexto.moveTo(posX, posY);
    sin_pretexto.lineTo(mouseX, mouseY);
    sin_pretexto.stroke();
  }

  posX = mouseX;
  posY = mouseY;
});

window.addEventListener("mouseup", () => {
  dibujando = false;
});

//Se inicializa al cargar.

setup();
