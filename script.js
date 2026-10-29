const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const remainingCount = document.getElementById("remainingCount");
const summaryText = document.getElementById("summaryText");
const clearCompletedButton = document.getElementById("clearCompleted");
const listHeading = document.getElementById("listHeading");
const pendingTabCount = document.getElementById("pendingTabCount");
const completedTabCount = document.getElementById("completedTabCount");
const tabs = document.querySelectorAll(".tab");

let tasks = [];
let nextTaskId = 1;
let activeFilter = "pending";

function addTask(taskText) {
    const cleanText = taskText.trim();
    if (!cleanText) {
        taskInput.focus();
        return;
    }

    tasks.push({
        id: nextTaskId++,
        text: cleanText,
        completed: false
    });

    activeFilter = "pending";
    updateActiveTab();
    renderTasks();
}

function updateTaskStatus(taskId, isCompleted) {
    tasks = tasks.map(function (task) {
        if (task.id === taskId) {
            return { ...task, completed: isCompleted };
        }
        return task;
    });

    renderTasks();
}

function removeTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    renderTasks();
}

function clearCompletedTasks() {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    renderTasks();
}

function setFilter(filter) {
    activeFilter = filter;
    updateActiveTab();
    renderTasks();
}

function updateActiveTab() {
    tabs.forEach(function (tab) {
        const isActive = tab.dataset.filter === activeFilter;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-pressed", String(isActive));
    });
    listHeading.textContent = activeFilter === "pending" ? "Pending tasks" : "Completed tasks";
}

function renderTasks() {
    taskList.replaceChildren();

    const visibleTasks = tasks.filter(function (task) {
        return activeFilter === "pending" ? !task.completed : task.completed;
    });

    if (visibleTasks.length === 0) {
        const emptyState = document.createElement("li");
        emptyState.className = "empty-state";

        const heading = document.createElement("strong");
        heading.textContent = activeFilter === "pending" ? "No pending tasks" : "No completed tasks yet";

        const message = document.createElement("span");
        message.textContent = activeFilter === "pending"
            ? "Add a task above or enjoy your free time."
            : "Tasks you complete will appear here.";

        emptyState.append(heading, message);
        taskList.appendChild(emptyState);
    } else {
        visibleTasks.forEach(function (task) {
            const item = document.createElement("li");
            item.className = task.completed ? "task-item completed" : "task-item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "task-checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute("aria-label", `Mark "${task.text}" as ${task.completed ? "pending" : "completed"}`);
            checkbox.addEventListener("change", function () {
                updateTaskStatus(task.id, checkbox.checked);
            });

            const text = document.createElement("span");
            text.className = "task-text";
            text.textContent = task.text;

            const status = document.createElement("span");
            status.className = "status-label";
            status.textContent = task.completed ? "Completed" : "Pending";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("aria-label", `Delete task "${task.text}"`);
            deleteButton.addEventListener("click", function () {
                removeTask(task.id);
            });

            item.append(checkbox, text, status, deleteButton);
            taskList.appendChild(item);
        });
    }

    const pending = tasks.filter(function (task) {
        return !task.completed;
    }).length;
    const completed = tasks.length - pending;

    remainingCount.textContent = pending;
    pendingTabCount.textContent = pending;
    completedTabCount.textContent = completed;
    summaryText.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"} in total`;
    clearCompletedButton.disabled = completed === 0;
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask(taskInput.value);
    taskInput.value = "";
    taskInput.focus();
});

tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        setFilter(tab.dataset.filter);
    });
});

clearCompletedButton.addEventListener("click", clearCompletedTasks);

updateActiveTab();
renderTasks();
