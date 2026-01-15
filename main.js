const state = {
    tasks: [],
    filter: "all", // all | active | completed
    loading: false,
    error: null
};

async function fetchInitialTasks() {
    state.loading = true;
    render(); // show loading indicator

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
        const data = await response.json();
        state.tasks = data.map(t => ({
            id: t.id,
            title: t.title,
            completed: t.completed
        }));
    } catch (err) {
        state.error = "Failed to load tasks";
    } finally {
        state.loading = false;
        render();
    }
}

function render() {
    const app = document.getElementById("task-list");

    if (state.loading) {
        app.innerHTML = "<div id='loading'>Loading...</div>";
        return;
    }

    if (state.error) {
        app.innerHTML = `<div id="error">${state.error}</div>`;
        return;
    }

    const selectedFilterOption = document.getElementById("filter-options").value;
    let filteredTasks = state.tasks;
    if (selectedFilterOption === "active") {
        filteredTasks = state.tasks.filter(t => !t.completed);
    } else if (selectedFilterOption === "completed") {
        filteredTasks = state.tasks.filter(t => t.completed);
    }
    // TODO: add UI components here
    console.log("Rendering tasks:", filteredTasks);
    app.innerHTML = `<table id="tasks-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Completed</th>
        <th>Actions</th>
      </tr></thead>
    <tbody>
    ${filteredTasks.map(task => `
      <tr>
        <td>${task.id}</td>
        <td>${task.title}</td>
        <td>${task.completed ? "Completed" : "Active"}</td>
        <td>
          <button onclick="toggleTask(${task.id})">${task.completed ? "Mark Active" : "Mark Completed"}</button>
          <button onclick="deleteTask(${task.id})">Delete</button>
        </td>
      </tr>
    `).join("")}
    </tbody>
    </table>`; // Placeholder

}

function onFilterChange(element) {
    state.filter = element.value;
    render();
}

function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    task.completed = !task.completed;
    render();
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    render();
}

function addTask() {
    const titleInput = document.getElementById("task-input");
    if (titleInput.value.trim() === "") return;
    const newTask = {
        id: state.tasks.length ? Math.max(...state.tasks.map(t => t.id)) + 1 : 1,
        title: titleInput.value,
        completed: false
    }
    state.tasks.push(newTask);
    titleInput.value = "";
    render();
}

onload = () => {
    fetchInitialTasks();
}