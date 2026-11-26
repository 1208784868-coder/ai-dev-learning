const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskStats = document.querySelector("#task-stats");

function updateTaskStats() {
  const totalTasks = taskList.querySelectorAll(":scope > li").length;
  const completedTasks = taskList.querySelectorAll('.task-text[aria-pressed="true"]').length;

  taskStats.textContent = `共 ${totalTasks} 项，已完成 ${completedTasks} 项`;
}

function createTaskButton(label) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  return button;
}

function createTaskItem(taskText) {
  const taskItem = document.createElement("li");
  const taskButton = createTaskButton(taskText);
  taskButton.className = "task-text";
  taskButton.setAttribute("aria-pressed", "false");

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "task-edit-input";
  editInput.setAttribute("aria-label", "编辑任务文字");
  editInput.autocomplete = "off";

  const editButton = createTaskButton("编辑");
  const removeButton = createTaskButton("删除");
  const saveButton = createTaskButton("保存");
  const cancelButton = createTaskButton("取消");

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.append(editButton, removeButton, saveButton, cancelButton);
  taskItem.append(taskButton, editInput, actions);

  function setEditing(isEditing) {
    taskButton.hidden = isEditing;
    editButton.hidden = isEditing;
    removeButton.hidden = isEditing;
    editInput.hidden = !isEditing;
    saveButton.hidden = !isEditing;
    cancelButton.hidden = !isEditing;
  }

  function endEditing() {
    setEditing(false);
    editInput.value = "";
    editInput.setCustomValidity("");
    editButton.focus();
  }

  function saveEdit() {
    const updatedText = editInput.value.trim();
    if (updatedText === "") {
      editInput.setCustomValidity("请输入任务内容。");
      editInput.reportValidity();
      return;
    }

    taskButton.textContent = updatedText;
    endEditing();
  }

  taskButton.addEventListener("click", () => {
    if (!editInput.hidden) {
      return;
    }

    const isCompleted = taskButton.getAttribute("aria-pressed") === "true";
    taskButton.setAttribute("aria-pressed", String(!isCompleted));
    updateTaskStats();
  });

  editButton.addEventListener("click", () => {
    editInput.value = taskButton.textContent;
    setEditing(true);
    editInput.focus();
  });

  editInput.addEventListener("input", () => {
    editInput.setCustomValidity("");
  });

  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();
      saveEdit();
    }
  });

  saveButton.addEventListener("click", saveEdit);
  cancelButton.addEventListener("click", endEditing);

  removeButton.addEventListener("click", () => {
    taskItem.remove();
    updateTaskStats();
  });

  setEditing(false);
  return taskItem;
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    taskInput.focus();
    return;
  }

  taskList.append(createTaskItem(taskText));
  updateTaskStats();

  taskForm.reset();
  taskInput.focus();
});

updateTaskStats();
