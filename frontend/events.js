const API_URL = "http://localhost:8888/api";

// 🔹 Загружаем список мероприятий
async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        if (!response.ok) throw new Error("Ошибка загрузки данных");
        
        const events = await response.json();
        console.log("Загруженные мероприятия:", events); // Лог в консоли

        const tableBody = document.querySelector("#eventsTable tbody");
        tableBody.innerHTML = "";

        if (events.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4'>Нет проведённых мероприятий</td></tr>";
            return;
        }

        events.forEach(event => {
            // 🔹 Проверяем, является ли participants массивом
            let participantsText = "—";
            if (Array.isArray(event.participants)) {
                participantsText = event.participants.join(", ");
            } else if (typeof event.participants === "string") {
                participantsText = event.participants; // Если API возвращает строку, просто используем её
            }

            const row = `<tr>
                <td>${event.name}</td>
                <td>${event.datetime}</td>
                <td>${event.points}</td>
                <td>${participantsText}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Ошибка загрузки мероприятий:", error);
    }
}


// 🔹 Удаление всех мероприятий
async function deleteAllEvents() {
    if (!confirm("Вы уверены, что хотите удалить все мероприятия?")) return;

    try {
        const response = await fetch(`${API_URL}/events`, { method: "DELETE" });
        if (!response.ok) throw new Error("Ошибка при удалении");

        loadEvents(); // Перезагрузка данных
    } catch (error) {
        console.error("Ошибка удаления мероприятий:", error);
    }
}


// 🔹 Загружаем данные при открытии страницы
document.addEventListener("DOMContentLoaded", loadEvents);
