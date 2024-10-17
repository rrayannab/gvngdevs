const apiUrl = 'http://127.0.0.1:5000/api/buscar'; // Cambia la URL para apuntar al backend
const embalsesList = document.getElementById('embalsesList');

document.getElementById('fetchEmbalsesBtn').addEventListener('click', fetchEmbalses);

async function fetchEmbalses() {
    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert('Geolocalización no es soportada por este navegador.');
    }
}

function successCallback(position) {
    const lat = position.coords.latitude;  // Obtener latitud
    const lon = position.coords.longitude;  // Obtener longitud

    // Enviar la ubicación al backend
    fetch(`${apiUrl}?latitud=${lat}&longitud=${lon}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            // Verifica si hay datos
            if (!data.items || data.items.length === 0) {
                embalsesList.innerHTML = '<p>No se encontraron embalses.</p>';
                return;
            }
            mostrarEmbalses(data.items);
        })
        .catch(error => {
            console.error('Error al obtener los embalses:', error);
            embalsesList.innerHTML = '<p>Error al cargar los embalses. Por favor, intenta nuevamente.</p>';
        });
}

function errorCallback(error) {
    alert('No se pudo obtener la ubicación. Por favor, habilita los servicios de ubicación en tu dispositivo.');
}

// Función para mostrar embalses en la lista
function mostrarEmbalses(embalses) {
    embalsesList.innerHTML = ''; // Limpiar la lista anterior

    embalses.forEach(embalse => {
        const embalseDiv = document.createElement('div');
        embalseDiv.classList.add('embalse');
        embalseDiv.innerHTML = `
            <h2>${embalse.embalse_nombre}</h2>
            <p>Ámbito: ${embalse.ambito_nombre}</p>
            <p>Agua Total: ${embalse.agua_total} m³</p>
            <p>Flag Eléctrico: ${embalse.electrico_flag}</p>
        `;
        embalsesList.appendChild(embalseDiv);
    });
}