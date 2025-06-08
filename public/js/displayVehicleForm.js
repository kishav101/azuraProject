export async function fetchAndDisplayVehicles() {
    try {
        const response = await fetch('http://localhost:3000/getAllData');
        const vehicles = await response.json();

        const tableBody = document.getElementById('vehicleTableBody');
        tableBody.innerHTML = '';
        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${vehicle?.VehicleID}</td>
        <td>${vehicle?.Make}</td>
        <td>${vehicle?.Model}</td>
        <td>${vehicle?.KM}</td>
        <td>${vehicle?.Color}</td>
        <td>${vehicle?.Location}</td>
        <td>${vehicle?.Value}</td>
      `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        alert('Error fetching vehicles, please try refeshing.');
    }
}

export function setupSearchHandler() {
    const addBtn = document.querySelector('.search-vehicle-btn');
    if (!addBtn) return;

    addBtn.addEventListener('click', async () => {
        const id = document.getElementById('vSearchId').value;
        const resultField = document.getElementById('searchResult');
        if (!isValidPositiveInt(id)) {
            showToast('Please capture a valid VehicleID in format of digits.', 3000, "#DC4C64");
            return;
        }
        try {
            const headers = {
                'Content-Type': 'application/json'
            }
            fetch('http://localhost:3000/getAllDataById', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ id: id })
            })
                .then(res => res.json())
                .then(data => {
                    resultField.value = data[0]?.KM === undefined ? "VehicleId Not Found" : data[0]?.KM + " KM" ?? "Result"
                });

        } catch (error) {
            showToast('An error occurred while sending the data.', 3000, "#DC4C64");
        }
    });
}

const isValidPositiveInt = (value) => {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
}

const showToast = (message, duration = 3000, backgroundColor = '#323232') => {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    toast.style.backgroundColor = backgroundColor;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, duration);
}
