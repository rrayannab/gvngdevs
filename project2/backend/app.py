from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

# URL de la API de búsqueda
BUSQUEDA_URL = 'https://ga473b1ce3e1bab-ibcmn5vgzooakfto.adb.eu-madrid-1.oraclecloudapps.com/ords/gvngdevs/busqueda'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/buscar', methods=['GET'])
def buscar():
    # Obtén los parámetros de latitud y longitud
    latitud = request.args.get('latitud')
    longitud = request.args.get('longitud')
    print(latitud, longitud)
    print(f"{BUSQUEDA_URL}/{latitud}/{longitud}/100")

    # Realiza la solicitud a la API de búsqued
    response = requests.get(f"{BUSQUEDA_URL}/{latitud}/{longitud}/1000")
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Error al obtener datos de la API de búsqueda."}), 500

if __name__ == '__main__':
    app.run(debug=True)