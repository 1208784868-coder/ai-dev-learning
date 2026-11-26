const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskStats = document.querySelector("#task-stats");
const taskStorageKey = "aiDevLearningTasksV1";
const priorityLabels = {
  low: "低优先级",
  medium: "中优先级",
  high: "高优先级",
};
const tasks = loadTasks();

function normalizePriority(priority) {
  return typeof priority === "string" && Object.hasOwn(priorityLabels, priority)
    ? priority
    : "medium";
}

function loadTasks() {
  let savedTasks;
  try {
    savedTasks = JSON.parse(localStorage.getItem(taskStorageKey));
  } catch {
    return [];
  }

  if (!Array.isArray(savedTasks)) {
    return [];
  }

  const taskIds = new Set();
  let prioritiesChanged = false;
  for (const task of savedTasks) {
    if (
      !task ||
      typeof task.id !== "string" ||
      task.id.trim() === "" ||
      taskIds.has(task.id) ||
      typeof task.taskText !== "string" ||
      task.taskText.trim() === "" ||
      typeof task.completed !== "boolean"
    ) {
      return [];
    }

    taskIds.add(task.id);
    const priority = normalizePriority(task.priority);
    if (task.priority !== priority) {
      task.priority = priority;
      prioritiesChanged = true;
    }
  }

  if (prioritiesChanged) {
    saveTasks(savedTasks);
  }

  return savedTasks;
}

function saveTasks(tasksToSave = tasks) {
  try {
    localStorage.setItem(taskStorageKey, JSON.stringify(tasksToSave));
  } catch (error) {
    console.warn("无法保存任务到浏览器存储。", error);
  }
}

function createTaskId() {
  let id;
  do {
    id = crypto.getRandomValues(new Uint32Array(4)).join("-");
  } while (tasks.some((task) => task.id === id));
  return id;
}

function updateTaskStats() {
  const completedTasks = tasks.filter((task) => task.completed).length;
  taskStats.textContent = `共 ${tasks.length} 项，已完成 ${completedTasks} 项`;
}

function createTaskButton(label) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  return button;
}

function createTaskItem(task) {
  const taskItem = document.createElement("li");
  const taskButton = createTaskButton(task.taskText);
  taskButton.className = "task-text";
  taskButton.setAttribute("aria-pressed", String(task.completed));

  const priorityLabel = document.createElement("span");
  priorityLabel.className = `task-priority task-priority--${task.priority}`;
  priorityLabel.textContent = priorityLabels[task.priority];

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
  taskItem.append(taskButton, editInput, priorityLabel, actions);

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

    task.taskText = updatedText;
    taskButton.textContent = task.taskText;
    saveTasks();
    endEditing();
  }

  taskButton.addEventListener("click", () => {
    if (!editInput.hidden) {
      return;
    }

    task.completed = !task.completed;
    taskButton.setAttribute("aria-pressed", String(task.completed));
    updateTaskStats();
    saveTasks();
  });

  editButton.addEventListener("click", () => {
    editInput.value = task.taskText;
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
    const taskIndex = tasks.findIndex((entry) => entry.id === task.id);
    tasks.splice(taskIndex, 1);
    taskItem.remove();
    updateTaskStats();
    saveTasks();
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

  const selectedPriority = taskForm.querySelector('input[name="priority"]:checked');
  const priority = normalizePriority(selectedPriority?.value);
  const task = { id: createTaskId(), taskText, completed: false, priority };
  tasks.push(task);
  taskList.append(createTaskItem(task));
  updateTaskStats();
  saveTasks();

  taskForm.reset();
  taskInput.focus();
});

for (const task of tasks) {
  taskList.append(createTaskItem(task));
}
updateTaskStats();
