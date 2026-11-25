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
  taskItem.textContent = taskText;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "删除";

  removeButton.addEventListener("click", () => {
    taskItem.remove();
  });

  taskItem.append(removeButton);
  taskList.append(taskItem);

  taskForm.reset();
  taskInput.focus();
});
