const apiUrlGeolocalizacion = 'http://127.0.0.1:5000/buscar100km'; // URL para la búsqueda por geolocalización
const apiUrlProvincia = 'http://127.0.0.1:5000/buscarPorProvincia'; // URL para la búsqueda por provincia
const embalsesList = document.getElementById('embalsesList');

document.getElementById('fetchEmbalsesBtn')?.addEventListener('click', fetchEmbalses);

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
    fetch(`${apiUrlGeolocalizacion}?latitud=${lat}&longitud=${lon}`)
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

// Funcionalidad para la búsqueda por provincia
document.getElementById('provinciaSearchForm')?.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario tradicional

    const provincia = document.getElementById('provincia').value;

    try {
        const response = await fetch(`${apiUrlProvincia}?provincia=${provincia}`);
        
        if (!response.ok) {
            throw new Error('Error en la red');
        }

        const data = await response.json();
        console.log('Datos recibidos de la API:', data); // Para depuración
        
        // Asegúrate de acceder correctamente al arreglo de embalses
        const embalses = data.items; // Acceder al arreglo correcto
        if (!embalses || embalses.length === 0) {
            embalsesListGeo.innerHTML = '<p>No se encontraron embalses.</p>';
            return;
        }
        
        mostrarEmbalses(embalses); // Llama a la función con el arreglo correcto
    } catch (error) {
        console.error('Error al obtener los embalses:', error);
        embalsesListGeo.innerHTML = '<p>Error al cargar los embalses. Por favor, intenta nuevamente.</p>';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');

    // Cargar el tema preferido desde el localStorage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeToggle.checked = true; // Mantener el interruptor en ON
    }

    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark');

        // Guardar la preferencia del tema en el localStorage
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});