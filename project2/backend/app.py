from flask import Flask, request, jsonify, render_template
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import requests

app = Flask(__name__)

# Inicializar Limiter usando el método init_app
limiter = Limiter(key_func=get_remote_address)
limiter.init_app(app)

# URL de la API de búsqueda
BUSQUEDA_URL = 'https://ga473b1ce3e1bab-ibcmn5vgzooakfto.adb.eu-madrid-1.oraclecloudapps.com/ords/gvngdevs/busqueda'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/index')
def index2():
    return render_template('index.html')

@app.route('/geolocalizacion')
def geolocalizacion():
    return render_template('geolocalizacion.html')

@app.route('/provincia')
def provincia():
    return render_template('provincia.html')

@app.route('/buscar100km', methods=['GET'])
@limiter.limit("10 per minute")  # Limitar a 10 solicitudes por minuto
def buscar():
    # Obtén los parámetros de latitud y longitud
    latitud = request.args.get('latitud')
    longitud = request.args.get('longitud')
    print(latitud, longitud)
    print(f"{BUSQUEDA_URL}/{latitud}/{longitud}/100")

    # Realiza la solicitud a la API de búsqued
    response = requests.get(f"{BUSQUEDA_URL}/{latitud}/{longitud}/100?limit=1000&offset=0")
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Error al obtener datos de la API de búsqueda."}), 500

@app.route('/buscarPorProvincia', methods=['GET'])
@limiter.limit("10 per minute")  # Limitar a 10 solicitudes por minuto
def buscar_por_provincia():
    # Obtén el parámetro de provincia
    provincia = request.args.get('provincia')

    if provincia is None:
        return jsonify({"error": "Falta el parámetro de provincia."}), 400

    try:
        # Realiza la solicitud a la API de búsqueda (ajusta la URL si es necesario)
        response = requests.get(f"{BUSQUEDA_URL}/{provincia}")

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "Error al obtener datos de la API de búsqueda."}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)