const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    taskInput.focus();
    return;
  }

  const taskItem = document.createElement("li");

  const taskButton = document.createElement("button");
  taskButton.type = "button";
  taskButton.className = "task-text";
  taskButton.textContent = taskText;
  taskButton.setAttribute("aria-pressed", "false");

  taskButton.addEventListener("click", () => {
    const isCompleted = taskButton.getAttribute("aria-pressed") === "true";
    taskButton.setAttribute("aria-pressed", String(!isCompleted));
  });

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "删除";

  removeButton.addEventListener("click", () => {
    taskItem.remove();
  });

  taskItem.append(taskButton, removeButton);
  taskList.append(taskItem);

  taskForm.reset();
  taskInput.focus();
});
