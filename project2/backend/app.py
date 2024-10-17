from flask import Flask
from flask_cors import CORS  # Importa CORS
import requests

app = Flask(__name__)

# Habilita CORS para todas las rutas
CORS(app)

# URL de la API de embalses
API_URL = 'https://ga473b1ce3e1bab-ibcmn5vgzooakfto.adb.eu-madrid-1.oraclecloudapps.com/ords/gvngdevs/embalses/'

# Función para imprimir los embalses
def print_embalses():
    try:
        response = requests.get(API_URL)
        response.raise_for_status()  # Lanza un error si la respuesta no fue 200
        data = response.json()

        if 'items' in data:
            for embalse in data['items']:
                print(f"ID: {embalse['id']}, "
                      f"Ámbito: {embalse['ambito_nombre']}, "
                      f"Nombre: {embalse['embalse_nombre']}, "
                      f"Agua Total: {embalse['agua_total']} m³, "
                      f"Flag Eléctrico: {embalse['electrico_flag']}")
        else:
            print("No se encontraron embalses.")
        
    except requests.exceptions.RequestException as e:
        print(f'Error al obtener los embalses: {e}')

@app.route('/print_embalses', methods=['GET'])
def print_embalses_route():
    print_embalses()
    return "Los embalses se han impreso en la consola."

@app.route('/api/embalses', methods=['GET'])
def embalses_route():
    try:
        response = requests.get(f"{API_URL}?limit=1000&offset=0")
        response.raise_for_status()
        data = response.json()
        return data  # Devuelve los datos como JSON
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)