(() => {
  "use strict";

  const exercises = [...document.querySelectorAll(".exercise")];
  const score = document.querySelector("#score");

  function updateScore() {
    const correct = exercises.filter((exercise) => exercise.dataset.state === "correct").length;
    score.textContent = `${correct} de ${exercises.length}`;
  }

  function parseDecimal(value) {
    const clean = value.trim().replace(",", ".");
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(clean)) return null;
    return Number(clean);
  }

  function clearFeedback(exercise) {
    delete exercise.dataset.state;
    exercise.querySelector(".feedback").textContent = "";
    const resolution = exercise.querySelector("details");
    resolution.open = false;
    resolution.hidden = true;
    updateScore();
  }

  exercises.forEach((exercise) => {
    const form = exercise.querySelector("form");
    const fields = [...form.querySelectorAll("input")];
    const feedback = exercise.querySelector(".feedback");
    const resolution = exercise.querySelector("details");

    fields.forEach((field) => {
      field.addEventListener("input", () => clearFeedback(exercise));
      field.addEventListener("change", () => clearFeedback(exercise));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      resolution.open = false;
      resolution.hidden = true;
      const field = form.querySelector('input[type="radio"]:checked, input[type="text"]');
      const answer = field?.value.trim() ?? "";
      if (!answer) {
        feedback.textContent = "Preencha a resposta antes de responder.";
        exercise.dataset.state = "empty";
        updateScore();
        return;
      }

      let correct;
      if (exercise.dataset.kind === "number") {
        const entered = parseDecimal(answer);
        const expected = parseDecimal(exercise.dataset.answer);
        if (entered === null) {
          feedback.textContent = "Digite um número válido, usando vírgula ou ponto decimal.";
          exercise.dataset.state = "empty";
          updateScore();
          return;
        }
        correct = Math.abs(entered - expected) < 1e-9;
      } else {
        correct = answer === exercise.dataset.answer;
      }

      exercise.dataset.state = correct ? "correct" : "incorrect";
      feedback.textContent = correct ? "Correto! O passo a passo está disponível abaixo." : `Ainda não. Dica: ${exercise.dataset.hint}`;
      resolution.hidden = false;
      updateScore();
    });
  });

  document.querySelector("#reset-all").addEventListener("click", () => {
    exercises.forEach((exercise) => {
      exercise.querySelector("form").reset();
      const resolution = exercise.querySelector("details");
      resolution.open = false;
      resolution.hidden = true;
      delete exercise.dataset.state;
      exercise.querySelector(".feedback").textContent = "";
    });
    updateScore();
    exercises[0].querySelector("input").focus();
  });
})();
