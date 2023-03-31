from flask import Flask, request, jsonify
import flask
from flask_cors import CORS, cross_origin
import json

#Set up Flask:
app = Flask(__name__)

cors = CORS(app)

# конфигурирование нужным заголовоком приложения flask для ответа CORS браузеру
app.config['CORS_HEADERS'] = 'Content-Type'


json_data = 'data.json'

@app.route("/api", methods=["GET"])
# декорирование запроса, что бы сервер отдавал CORS ответ
@cross_origin()
def getME():
    if (request.method == 'GET'):
        with open(json_data, 'r') as f:
            data = json.load(f)
        
        return jsonify(data)

# Добавление новых элементов через api
@app.route("/api", methods=["POST"])
@cross_origin()
def jsonPOST():
    try:
        new_data = json.loads(request.data)
        
        with open(json_data, 'r') as f:
            data = json.load(f)
        
        data.append(new_data)

        with open('data.json', 'w') as outfile:
            json.dump(data, outfile, ensure_ascii=False, indent=2)

        return new_data
    except Exception as e:
        print("Error add: {e}")

# Удаление элементов списка
@app.route("/api", methods=["DELETE"])
@cross_origin()
def jsonDEL():
    try:
        delete_data = json.loads(request.data)

        delete_count = delete_data['count']

        with open(json_data, 'r') as f:
            data = json.load(f)

        for element in data:
            if element['count'] == delete_count:
                print(element)
                data.remove(element)

        with open('data.json', 'w') as outfile:
            json.dump(data, outfile, ensure_ascii=False, indent=2)

        return data
    except Exception as e:
        print(f"Error delete: {e}")


# Изменение элементов списка
@app.route("/api", methods=["PUT"])
@cross_origin()
def jsonCHANGE():
    try:
        change_data = json.loads(request.data)
        
        change_data_count = change_data['count']

        with open(json_data, 'r') as f:
            data = json.load(f)

        for element in data:
            if element['count'] == change_data_count:
                element['status'] = change_data['status']

        with open('data.json', 'w') as outfile:
            json.dump(data, outfile, ensure_ascii=False, indent=2)

        return data
    except Exception as e:
        print("Error change: {e}")