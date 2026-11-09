document.addEventListener("DOMContentLoaded", () => {
  const draggables = document.querySelectorAll(".draggable");
  const dropzones = document.querySelectorAll(".dropzone");
  const message = document.getElementById("message");
  const tituloProceso = document.getElementById("titulo-proceso");
  const resultImage = document.getElementById("resultado-img");
  const verifyBtn = document.getElementById("verify-btn");
  const verifyLabel = document.getElementById("verificando_organos");
  const verifyIcon = verifyBtn.querySelector("img");
  const attemptsCountDisplay = document.getElementById("attempts-count");
  const startZone = document.getElementById("start-zone");
  const camuflaje = document.getElementById("avestruz");
  const slots = document.querySelectorAll(".slot");
  const slotsContainer = document.querySelector(".slots-container");
  const ratitas = document.querySelectorAll(".icono_rata");
  const jinetes_apocalipsis = ["uno", "dos", "tres", "cuatro"];
  const imagenesCorrectas = [
    "experimentar",
    "entrenar",
    "pulir_detalles",
    "seleccionar",
  ];

  let intentos = 3;
  let gameOver = false;
  let retryPending = false;
  let nextStep = false;

  function updateVerifyButton() {
    const allItemsPlaced = [...slots].every((slot) =>
      slot.querySelector(".draggable"),
    );
    verifyBtn.disabled = !nextStep && (gameOver || !allItemsPlaced);
    verifyBtn.classList.toggle("deshabilitado", verifyBtn.disabled);
  }

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
        clearFeedback();
        const source = draggable.parentElement;
        zone.appendChild(draggable);
        if (source && source.classList.contains("slot")) {
          source.classList.remove("filled");
        }
        if (zone.classList.contains("slot")) {
          zone.classList.add("filled");
        }
        updatePlacementIcons();
        updateVerifyButton();
      }
    });
  });

  // Evento del botón Verificar
  verifyBtn.addEventListener("click", () => {
    if (nextStep) {
      window.location.href = "nucleo2.1.html";
      return;
    }

    if (gameOver) return;

    if (retryPending) {
      retryPending = false;
      verifyLabel.textContent = "Comprobar";
      verifyIcon.src = "img/tilde.png";
      camuflaje.hidden = false;
      draggables.forEach((draggable) => startZone.appendChild(draggable));
      slots.forEach((slot) => slot.classList.remove("filled"));
      clearFeedback();
      updatePlacementIcons();
      updateVerifyButton();
      return;
    }

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

    camuflaje.hidden = true;
    const isCorrect = correctCount === slots.length;
    draggables.forEach((draggable) => {
      draggable.classList.remove("draggable_correcto", "draggable_incorrecto");
      draggable.classList.add(
        isCorrect ? "draggable_correcto" : "draggable_incorrecto",
      );
    });
    ratitas.forEach((icon, index) => {
      icon.src = `img/${jinetes_apocalipsis[index]}_${isCorrect ? "correcto" : "rojo"}.png`;
      icon.hidden = false;
    });

    resultImage.src = isCorrect
      ? "img/correcto_casillero.png"
      : "img/incorrecto_casillero.png";
    resultImage.alt = isCorrect ? "Respuesta correcta" : "Respuesta incorrecta";
    resultImage.hidden = false;
    if (isCorrect) {
      tituloProceso.textContent = "Así se arman sus obras";
      draggables.forEach((draggable) => {
        const image = draggable.querySelector(".drag-image");
        const itemNumber = Number(draggable.id.split("-")[1]);
        const correctImage = imagenesCorrectas[itemNumber - 1];
        if (image && correctImage) {
          image.src = `img/${correctImage}_bien.png`;
        }
      });
      slotsContainer.classList.add("orden-correcto");
      message.textContent =
        "¡Perfecto!, ordenaste las etapas en el orden correcto.";
      nextStep = true;
      verifyLabel.textContent = "Siguiente";
      verifyIcon.src = "img/Flecha derecha.png";
      endGame();
    } else {
      message.textContent =
        "Las etapas no van de esa manera. Intentalo de nuevo.";
      intentos--;
      attemptsCountDisplay.textContent = intentos;

      if (intentos === 0) {
        endGame();
      } else {
        retryPending = true;
        verifyLabel.textContent = "Intentar de nuevo";
        verifyIcon.src = "img/Flecha derecha.png";
      }
    }
  });

  function clearFeedback() {
    ratitas.forEach((icon) => (icon.hidden = true));
    resultImage.hidden = true;
    message.textContent = "";
    draggables.forEach((draggable) =>
      draggable.classList.remove("draggable_correcto", "draggable_incorrecto"),
    );
  }

  function updatePlacementIcons() {
    slots.forEach((slot, index) => {
      const icon = ratitas[index];
      if (!icon) return;

      const hasItem = slot.querySelector(".draggable");
      icon.hidden = !hasItem;
      if (hasItem) {
        icon.src = `img/${jinetes_apocalipsis[index]}_verde.png`;
      }
    });
  }

  // Función para bloquear el juego al terminar
  function endGame() {
    gameOver = true;
    updateVerifyButton();
    // Opcional: quitar el estilo visual de "cursor: grab"
    draggables.forEach((d) => (d.style.cursor = "default"));
  }

  updateVerifyButton();
});
