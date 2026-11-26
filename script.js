const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskStats = document.querySelector("#task-stats");

function updateTaskStats() {
  const totalTasks = taskList.querySelectorAll(":scope > li").length;
  const completedTasks = taskList.querySelectorAll('.task-text[aria-pressed="true"]').length;

  taskStats.textContent = `共 ${totalTasks} 项，已完成 ${completedTasks} 项`;
}

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
    updateTaskStats();
  });

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "删除";

  removeButton.addEventListener("click", () => {
    taskItem.remove();
    updateTaskStats();
  });

  taskItem.append(taskButton, removeButton);
  taskList.append(taskItem);
  updateTaskStats();

  taskForm.reset();
  taskInput.focus();
});

updateTaskStats();