document.addEventListener("DOMContentLoaded", () => {
  const attemptsCountDisplay = document.getElementById("attempts-count");
  const storedAttempt = Number(sessionStorage.getItem("nucleo3-attempt-count"));

  if (
    attemptsCountDisplay &&
    Number.isInteger(storedAttempt) &&
    storedAttempt >= 1 &&
    storedAttempt <= 3
  ) {
    attemptsCountDisplay.textContent = storedAttempt;
  }
});
