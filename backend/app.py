import pymysql
from pymysql import IntegrityError
from flask import Flask, jsonify, request
import csv
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import numpy as np
import pandas as pd
import tensorflow as tf
from flask import Flask, request, jsonify
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
import json

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///delfin.db'
db = SQLAlchemy(app)

host = 'localhost'
user = 'root'
password = ''
database = 'delfin'
port = 3306



@app.route('/')
def index():
    return "¡Hola, mundo!"


# Configurar pymysql
pymysql.install_as_MySQLdb()

# Establecer la conexión a la base de datos
try:
    connection = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    database='delfin',
    port=3306
    )
    print("Conexión exitosa a la base de datos")
    cursor = connection.cursor()
except pymysql.Error as e:
    print("Error de conexión a la base de datos:", e)


table_exists_query = '''
    SELECT COUNT(*) FROM information_schema.tables
    WHERE table_schema = 'delfin' AND table_name = 'Proyects'
'''
cursor.execute(table_exists_query)
table_exists = cursor.fetchone()[0]  

if not table_exists:
    create_table_query = '''
        CREATE TABLE Proyects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(32),
            `desc` VARCHAR(100),
            saveOn VARCHAR(200),
            processOn VARCHAR(200),
            toCompare VARCHAR(200),
            processCompare VARCHAR(200),
            result VARCHAR(4000)
        )
    '''
    cursor.execute(create_table_query)
    connection.commit()


#Modelos

class Proyects(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return f"<Proyects(id={self.id})>"


@app.route('/process_csv', methods=['POST'])
def process_csv():
    nombre_archivo = request.form.get('nombre_archivo')

    ruta_archivo = fr'{nombre_archivo}'

    if "result" in ruta_archivo:
        columnas = [[] for _ in range(14)]
        with open(ruta_archivo, 'r') as archivo:
            lector_csv = csv.reader(archivo)
            next(lector_csv)


            for fila in lector_csv:
                if len(fila) == 14:
                    for i in range(14):
                        floatValue = float(fila[i])
                        columnas[i].append(floatValue)

        resultados = [columna for i, columna in enumerate(columnas)]        
        nuevo_arreglo = [subarreglo[1:] for subarreglo in resultados]

        return jsonify(nuevo_arreglo)
    else:
        columnas = [[] for _ in range(15)]
        with open(ruta_archivo, 'r') as archivo:
            lector_csv = csv.reader(archivo)
            next(lector_csv)

            for fila in lector_csv:
                if len(fila) == 15:
                    for i in range(15):
                        floatValue = float(fila[i])
                        columnas[i].append(floatValue)

        resultados = [columna for i, columna in enumerate(columnas)]
        return jsonify(resultados)



@app.route('/create-proyect', methods=['POST'])
def create_proyect():
    data = request.get_json('signalData')

    try:
        insert_query = '''
            INSERT INTO `proyects` (`title`, `desc`, `saveOn`, `processOn`, `toCompare`, `processCompare`, result)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        title = data['title']
        desc = data['description']
        saveOn = data['saveOn']
        processOn = None
        toCompare = data['toCompare']
        processCompare = None
        result = None

        cursor.execute(insert_query, (title, desc, saveOn, processOn, toCompare, processCompare, result))
        connection.commit()

        proyect_id = cursor.lastrowid
        response = {'id': proyect_id}
        return jsonify(response)
    except IntegrityError as e:
        error_message = str(e)
        response = {'error': error_message}
        return jsonify(response), 400
    

@app.route('/proyects', methods=['GET'])
def get_proyects():

    try:   
        select_query = 'SELECT * FROM `proyects`'
        cursor.execute(select_query)
        results = cursor.fetchall()

        proyects = []
        for row in results:
             proyect = {
                'id': row[0],
                'title': row[1],
                'desc': row[2],
                'saveOn': row[3],
                'processOn': row[4],
                'toCompare': row[5],
                'processCompare': row[6],
                'result': row[7]
             }
             proyects.append(proyect)
       
        return jsonify(proyects)
    except IntegrityError as e:
        error_message = str(e)
        response = {'error': error_message}
        return jsonify(response), 400


@app.route('/delete/<proyect_id>', methods=['DELETE'])
def delete_proyect(proyect_id):
    try:
         delete_query = '''
            DELETE FROM `proyects`
            WHERE `id` = %s
        '''
         cursor.execute(delete_query, (proyect_id,))
         connection.commit()

         response = {'message': 'Proyecto eliminado correctamente'}
         return jsonify(response), 200
    except pymysql.Error as e:
        response = {'error': str(e)}
        return jsonify(response), 500


@app.route('/processData/<proyect_id>', methods=['POST'])
def processData(proyect_id):
    try:
        nombre_archivo = request.form.get('nombre_archivo')

        ruta_archivo = fr'{nombre_archivo}'
        if nombre_archivo is None:
            return jsonify('No se encontró el archivo')

        columnas = [[] for _ in range(15)]

        with open(ruta_archivo, 'r') as archivo:
            lector_csv = csv.reader(archivo)
            next(lector_csv)

            for fila in lector_csv:
                if len(fila) == 15:
                    for i in range(15):
                        floatValue = float(fila[i])
                        columnas[i].append(floatValue)

        resultados = [columna for i, columna in enumerate(columnas)]
        fft_results = []
        for signal in resultados:
            fft = np.fft.fft(signal)
            fft_magnitude = np.abs(fft) 
            fft_results.append(fft_magnitude)
        

        fileName = nombre_archivo[16:]
        output_file = nombre_archivo[0:16] + "result" + fileName

        transposed_results = [
            [str(num).replace('(', '').replace(')', '') for num in sublist]
            for sublist in fft_results
            ]
        
        arreglo = {'F3': transposed_results[0], 'FC5': transposed_results[1], 'AF3': transposed_results[2],  'F7': transposed_results[3], 'T7': transposed_results[4], 'P7': transposed_results[5], 'O1': transposed_results[6], 'O2': transposed_results[7], 'P8': transposed_results[8], 'T8': transposed_results[9], 'F8': transposed_results[10], 'AF4': transposed_results[11], 'FC6': transposed_results[12], 'F4': transposed_results[13]}
        df = pd.DataFrame(arreglo, columns = ['F3', 'FC5', 'AF3',  'F7', 'T7', 'P7', 'O1', 'O2', 'P8', 'T8', 'F8', 'AF4', 'FC6', 'F4'])
        df.to_csv(output_file, index=False)

        query = "UPDATE proyects SET processOn = %s WHERE id = %s"    
        print(output_file, proyect_id)
        cursor.execute(query, (output_file, proyect_id,))
        connection.commit()


        return jsonify('El proceso se ha realizado con éxito')
    except pymysql.Error as e:
        response = {'error': str(e)}
        return jsonify(response), 500


@app.route('/processDataTrain/<proyect_id>', methods=['POST'])
def processDataTrain(proyect_id):
    try:
        nombre_archivo = request.form.get('nombre_archivo')

        ruta_archivo = fr'{nombre_archivo}'
        if nombre_archivo is None:
            return jsonify('No se encontró el archivo')

        columnas = [[] for _ in range(15)]

        with open(ruta_archivo, 'r') as archivo:
            lector_csv = csv.reader(archivo)
            next(lector_csv)

            for fila in lector_csv:
                if len(fila) == 15:
                    for i in range(15):
                        floatValue = float(fila[i])
                        columnas[i].append(floatValue)

        resultados = [columna for i, columna in enumerate(columnas)]
        fft_results = []
        for signal in resultados:
            fft = np.fft.fft(signal)
            fft_magnitude = np.abs(fft) 
            fft_results.append(fft_magnitude)
        

        fileName = nombre_archivo[16:]
        output_file = nombre_archivo[0:16] + "result" + fileName

        transposed_results = [
            [str(num).replace('(', '').replace(')', '') for num in sublist]
            for sublist in fft_results
            ]
        
        arreglo = {'F3': transposed_results[0], 'FC5': transposed_results[1], 'AF3': transposed_results[2],  'F7': transposed_results[3], 'T7': transposed_results[4], 'P7': transposed_results[5], 'O1': transposed_results[6], 'O2': transposed_results[7], 'P8': transposed_results[8], 'T8': transposed_results[9], 'F8': transposed_results[10], 'AF4': transposed_results[11], 'FC6': transposed_results[12], 'F4': transposed_results[13]}
        df = pd.DataFrame(arreglo, columns = ['F3', 'FC5', 'AF3',  'F7', 'T7', 'P7', 'O1', 'O2', 'P8', 'T8', 'F8', 'AF4', 'FC6', 'F4'])
        df.to_csv(output_file, index=False)

        query = "UPDATE proyects SET processCompare = %s WHERE id = %s"    
        print(output_file, proyect_id)
        cursor.execute(query, (output_file, proyect_id,))
        connection.commit()


        return jsonify('El proceso se ha realizado con éxito')
    except pymysql.Error as e:
        response = {'error': str(e)}
        return jsonify(response), 500



@app.route('/results/<proyect_id>', methods=['POST'])
def results(proyect_id):
    data = request.json

    try: 
        x_train = np.array(data['x_train'])
        y_train = np.array(data['y_train'])
        x_test = np.array(data['x_test'])
        y_test = np.array(data['y_test'])
        elec = data['elec']

        y_train_binary = np.array([1 if np.any(label) else 0 for label in y_train])
        y_test_binary = np.array([1 if np.any(label) else 0 for label in y_test])

        y_train_binary = np.expand_dims(y_train_binary, axis=1)
        y_test_binary = np.expand_dims(y_test_binary, axis=1)
        
        num_features = len(x_train[0])
        print(num_features)
        
        model = Sequential()
        model.add(Dense(num_features, activation='relu', input_shape=(num_features,)))
        model.add(Dense(num_features/2, activation='sigmoid'))
        model.add(Dense(num_features, activation='tanh'))
        model.add(Dense(num_features/2, activation='sigmoid'))
        model.add(Dense(num_features, activation='tanh'))
        model.add(Dense(num_features/2, activation='sigmoid'))
        model.add(Dense(num_features, activation='tanh'))
        model.add(Dense(num_features, activation='sigmoid'))
        model.add(Dense(1, activation='sigmoid'))
        model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
        model.fit(x_train, y_train_binary, epochs=15, batch_size=num_features)
        loss, accuracy = model.evaluate(x_test, y_test_binary)
        predictions = model.predict(x_test)

        if loss > accuracy:
            return jsonify("Los datos no fueron de la calidad esperada, ingrese más información o vuelalo a intentar")
        else:
            data = {
                'predictions': predictions.tolist(), 
                'elec' : elec 
            }
            data_json = json.dumps(data)
            print(data_json)
            query = "UPDATE proyects SET result = %s WHERE id = %s"    
            cursor.execute(query, (data_json, proyect_id,))
            connection.commit()
            return jsonify("El proceso se realizó con exito")
    except pymysql.Error as e:
        response = {'error': str(e)}
        return jsonify(response), 500



if __name__ == '__main__':
    app.run()

