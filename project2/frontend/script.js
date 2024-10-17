const apiUrl = 'http://127.0.0.1:5000/api/embalses'; // Cambia la URL para apuntar al backend
const embalsesList = document.getElementById('embalsesList');

document.getElementById('fetchEmbalsesBtn').addEventListener('click', fetchEmbalses);

async function fetchEmbalses() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Error en la red');
        }

        const data = await response.json();

        // Verifica si hay datos
        if (!data.items || data.items.length === 0) {
            embalsesList.innerHTML = '<p>No se encontraron embalses.</p>';
            return;
        }

        mostrarEmbalses(data.items);
    } catch (error) {
        console.error('Error al obtener los embalses:', error);
        embalsesList.innerHTML = '<p>Error al cargar los embalses. Por favor, intenta nuevamente.</p>';
    }
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