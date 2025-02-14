const API_URL = "http://localhost:8888/api";
let sortOrder = "desc"; // Начинаем с убывания

// 🔹 Загружаем список сотрудников с сортировкой
async function loadEmployees() {
    const response = await fetch(`${API_URL}/employees`);
    let employees = await response.json();

    // 🔹 Сортируем сотрудников по баллам
    employees.sort((a, b) => {
        return sortOrder === "desc" ? b.points - a.points : a.points - b.points;
    });

    const tableBody = document.querySelector("#employeeTable tbody");
    const participantsList = document.getElementById("participantsList");

    tableBody.innerHTML = "";
    participantsList.innerHTML = ""; // Очистка списка участников перед обновлением

    employees.forEach(emp => {
        // 🔹 Заполняем таблицу сотрудников
        const row = `<tr>
            <td>${emp.nickname || "—"}</td>
            <td>${emp.static || "—"}</td>
            <td>${emp.points}</td>
            <td><button onclick="deleteEmployee(${emp.id})">❌ Удалить</button></td>
        </tr>`;
        tableBody.innerHTML += row;

        // 🔹 Заполняем список участников в форме создания события
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = emp.id;
        checkbox.id = `emp-${emp.id}`;

        const label = document.createElement("label");
        label.htmlFor = `emp-${emp.id}`;
        label.innerText = `${emp.nickname} (${emp.static})`;

        const div = document.createElement("div");
        div.appendChild(checkbox);
        div.appendChild(label);

        participantsList.appendChild(div);
    });
}

// 🔹 Добавляем сортировку при клике на заголовок "Баллы"
document.addEventListener("DOMContentLoaded", () => {
    const pointsHeader = document.querySelector("#employeeTable th:nth-child(3)");

    pointsHeader.style.cursor = "pointer";
    pointsHeader.addEventListener("click", () => {
        sortOrder = sortOrder === "desc" ? "asc" : "desc"; // Меняем порядок сортировки
        loadEmployees();
    });

    // Загружаем данные при запуске
    loadEmployees();
});

// 🔹 Добавление сотрудника
async function addEmployee() {
    const nickname = document.getElementById("nickname").value.trim();
    const staticRole = document.getElementById("static").value.trim();

    if (!nickname || !staticRole) {
        alert("Введите имя и статик!");
        return;
    }

    await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, static: staticRole })
    });

    document.getElementById("nickname").value = "";
    document.getElementById("static").value = "";
    loadEmployees(); 
}

// 🔹 Создание события
async function addEvent() {
    const name = document.getElementById("eventName").value;
    const datetime = document.getElementById("eventDateTime").value; 
    const points = parseInt(document.getElementById("eventPoints").value);

    if (!name || !datetime || isNaN(points)) {
        return alert("Заполните все поля!");
    }

    // 🔹 Получаем выбранных сотрудников
    const selectedEmployees = Array.from(document.querySelectorAll("#participantsList input:checked"))
        .map(input => parseInt(input.value));

    if (selectedEmployees.length === 0) {
        return alert("Выберите хотя бы одного участника!");
    }

    await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, datetime, participants: selectedEmployees, points })
    });

    document.getElementById("eventName").value = "";
    document.getElementById("eventDateTime").value = "";
    document.getElementById("eventPoints").value = "";

    alert("Событие успешно создано!");
}

// 🔹 Удаление сотрудника
async function deleteEmployee(id) {
    if (!confirm("Вы уверены, что хотите удалить сотрудника?")) return;

    await fetch(`${API_URL}/employees/${id}`, { method: "DELETE" });
    loadEmployees();
}

// 🔹 Сброс баллов
async function resetPoints() {
    await fetch(`${API_URL}/employees/reset-points`, { method: "PUT" });
    loadEmployees();
}
