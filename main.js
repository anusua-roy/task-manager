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

    // TODO: add UI components here
    console.log(state.tasks)
    app.innerHTML = `<table id="tasks-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Completed</th>
        <th>Actions</th>
      </tr></thead>
    <tbody>
    ${state.tasks.map(task => `
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

onload = () => {
    fetchInitialTasks();
}