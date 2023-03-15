from flask import Flask, request, jsonify
import flask
from flask_cors import CORS
import json

#Set up Flask:
app = Flask(__name__)
#Set up Flask to bypass CORS:
cors = CORS(app)

#Create the receiver API POST endpoint:
#@app.route("/api", methods=["POST"])
#def postME():
#    data = request.get_json()
#    data = jsonify(data)
#    return data

@app.route("/api", methods=["GET"])
def getME():
    if (request.method == 'GET'):
        with open('data.json', 'r') as f:
            data = json.load(f)
        
        return jsonify(data)

# Добавление новых элементов через api
@app.route("/api", methods=["POST"])
def jsonPOST():
    try:
        new_data = json.loads(request.data)
        
        with open('data.json', 'r') as f:
            data = json.load(f)
        
        data.append(new_data)

        with open('data.json', 'w') as outfile:
            json.dump(data, outfile, ensure_ascii=False, indent=2)

        return new_data
    except Exception as e:
        print("Error add: {e}")

# Удаление элементов списка
@app.route("/api", methods=["DELETE"])
def jsonDEL():
    try:
        delete_data = json.loads(request.data)

        delete_count = delete_data['count']

        with open('data.json', 'r') as f:
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
def jsonCHANGE():
    try:
        change_data = json.loads(request.data)
        
        change_data_count = change_data['count']

        with open('data.json', 'r') as f:
            data = json.load(f)

        for element in data:
            if element['count'] == change_data_count:
                element['status'] = change_data['status']

        with open('data.json', 'w') as outfile:
            json.dump(data, outfile, ensure_ascii=False, indent=2)

        return data
    except Exception as e:
        print("Error change: {e}")

if __name__ == "__main__": 
    app.run(debug=True)