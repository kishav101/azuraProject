export function setupAddVehicleHandler() {
    const addBtn = document.querySelector('.add-vehicle-btn');
    if (!addBtn) return;

    addBtn.addEventListener('click', async () => {
        const vehicleData = {
            make: document.getElementById('vMake').value,
            model: document.getElementById('vModel').value,
            km: document.getElementById('vMileage').value,
            color: document.getElementById('vColor').value,
            location: document.getElementById('vLocation').value,
            value: document.getElementById('vValue').value
        };

        try {
            let valid = validateVehicleData(vehicleData);
            const headers = {
                'Content-Type': 'application/json'
            };
            if (!valid) {
                showToast('Please capture valid information', 3000, "#DC4C64");
                return;
            }
            const response = await fetch('http://localhost:3000/insertData', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(vehicleData)
            });
            const result = await response.json();
            if (response.ok) {
                showToast('Vehicle inserted successfully.', 3000, "#14A44D");
            } else {
                showToast('Failed to add vehicle.', 3000, "#DC4C64");

            }
        } catch (error) {
            showToast('An error occurred while sending the data.', 3000, "#DC4C64");
        }
    });
}

function validateVehicleData() {
    const fields = {
        make: document.getElementById('vMake'),
        model: document.getElementById('vModel'),
        km: document.getElementById('vMileage'),
        color: document.getElementById('vColor'),
        location: document.getElementById('vLocation'),
        value: document.getElementById('vValue')
    };

    let isValid = true;
    Object.values(fields).forEach(field => field.style.border = '');

    for (const [key, field] of Object.entries(fields)) {
        const value = field.value.trim();

        if ((key === 'km' || key === 'value')) {
            
            const num = Number(value);
            if (!Number.isInteger(num) || num <= 0) {
                field.style.border = '2px solid red';
                isValid = false;
            }
        } else if (value === '') {
            field.style.border = '2px solid red';
            isValid = false;
        }
    }

    return isValid;
}


function showToast(message, duration = 3000, backgroundColor = '#323232') {
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
