document.addEventListener("DOMContentLoaded", () => {
  const draggables = document.querySelectorAll(".draggable");
  const dropzones = document.querySelectorAll(".dropzone");
  const message = document.getElementById("message");
  const verifyBtn = document.getElementById("verify-btn");
  const attemptsCountDisplay = document.getElementById("attempts-count");

  let intentos = 3;
  let gameOver = false;

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", (e) => {
      if (gameOver) {
        e.preventDefault(); // Evita arrastrar si el juego terminó
        return;
      }
      e.dataTransfer.setData("text/plain", e.currentTarget.id);
      e.dataTransfer.effectAllowed = "move";
      setTimeout(() => draggable.classList.add("hide"), 0);
    });

    draggable.addEventListener("dragend", (e) => {
      e.currentTarget.classList.remove("hide");
      // Ya no llamamos a checkOrder() aquí, ahora lo hace el botón
    });
  });

  dropzones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      if (gameOver) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      zone.classList.add("hovered");
    });

    zone.addEventListener("dragenter", (e) => {
      if (gameOver) return;
      e.preventDefault();
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("hovered");
    });

    zone.addEventListener("drop", (e) => {
      if (gameOver) return;
      e.preventDefault();
      zone.classList.remove("hovered");

      const id = e.dataTransfer.getData("text/plain");
      const draggable = document.getElementById(id);

      if (
        draggable &&
        (zone.id === "start-zone" || !zone.querySelector(".draggable"))
      ) {
        const source = draggable.parentElement;
        zone.appendChild(draggable);
        if (source && source.classList.contains("slot")) {
          source.classList.remove("filled");
        }
        if (zone.classList.contains("slot")) {
          zone.classList.add("filled");
        }
      }
    });
  });

  // Evento del botón Verificar
  verifyBtn.addEventListener("click", () => {
    if (gameOver) return;

    const slots = document.querySelectorAll(".slot");
    let correctCount = 0;
    let totalPlaced = 0;

    slots.forEach((slot) => {
      const child = slot.querySelector(".draggable");
      const expectedId = slot.getAttribute("data-expected");

      if (child) {
        totalPlaced++;
        if (child.id === expectedId) {
          correctCount++;
        }
      }
    });

    // Validar si el usuario no ha puesto todas las piezas
    if (totalPlaced < 4) {
      message.textContent = "¡Coloca todas las piezas antes de verificar!";
      message.style.color = "#ffc107";
      return;
    }

    // Si todas son correctas (Victoria)
    if (correctCount === 4) {
      message.textContent =
        "¡Excelente! Has colocado todos en el orden correcto.";
      message.style.color = "#28a745";
      endGame();
    } else {
      // Si hay error (Resta intento)
      intentos--;
      attemptsCountDisplay.textContent = intentos;

      if (intentos > 0) {
        message.textContent =
          "Orden incorrecto. Te quedan " + intentos + " intento(s).";
        message.style.color = "#dc3545";
      } else {
        // Sin intentos (Derrota)
        message.textContent = "¡Te quedaste sin intentos! Fin del juego.";
        message.style.color = "#dc3545";
        endGame();
      }
    }
  });

  // Función para bloquear el juego al terminar
  function endGame() {
    gameOver = true;
    verifyBtn.disabled = true;
    // Opcional: quitar el estilo visual de "cursor: grab"
    draggables.forEach((d) => (d.style.cursor = "default"));
  }
});
