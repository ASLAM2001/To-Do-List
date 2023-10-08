document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const dueDateInput = document.getElementById("dueDate");
    const prioritySelect = document.getElementById("priority");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const filterPrioritySelect = document.getElementById("filterPriority");
    const sortTypeSelect = document.getElementById("sortType");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.dataset.index = index;
            li.innerHTML = `
                <div class="task-info">
                    <span class="task-priority ${task.priority}">${task.name}</span>
                    <span class="due-date">${task.dueDate}</span>
                </div>
                <div class="task-actions">
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function addTask() {
        const taskName = taskInput.value.trim();
        const taskDueDate = dueDateInput.value;
        const taskPriority = prioritySelect.value;

        if (taskName !== "") {
            tasks.push({
                name: taskName,
                dueDate: taskDueDate,
                priority: taskPriority,
            });
            saveTasks();
            taskInput.value = "";
            dueDateInput.value = "";
            renderTasks();
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const newName = prompt("Edit task name:", tasks[index].name);
        if (newName !== null) {
            tasks[index].name = newName;
            saveTasks();
            renderTasks();
        }
    }

    function applyFiltersAndSort() {
        let filteredTasks = [...tasks];
        const filterPriority = filterPrioritySelect.value;
        const sortType = sortTypeSelect.value;

        if (filterPriority !== "all") {
            filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
        }

        if (sortType === "priority") {
            filteredTasks.sort((a, b) => a.priority.localeCompare(b.priority));
        } else if (sortType === "dueDate") {
            filteredTasks.sort((a, b) => (a.dueDate || "") - (b.dueDate || ""));
        }

        tasks = filteredTasks;
        renderTasks();
    }

    addTaskButton.addEventListener("click", addTask);
    taskList.addEventListener("click", function (e) {
        const target = e.target;

        if (target.classList.contains("delete-button")) {
            const index = target.closest("li").dataset.index;
            deleteTask(index);
        } else if (target.classList.contains("edit-button")) {
            const index = target.closest("li").dataset.index;
            editTask(index);
        }
    });

    filterPrioritySelect.addEventListener("change", applyFiltersAndSort);
    sortTypeSelect.addEventListener("change", applyFiltersAndSort);

    renderTasks();
    applyFiltersAndSort();
});
