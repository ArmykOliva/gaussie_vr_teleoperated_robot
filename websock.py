import time
from flask import Response, Flask
from flask_cors import CORS
from threading import Thread, Lock
from flask_socketio import SocketIO, emit


# Create the Flask object for the application
app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('controller_data')
def handle_controller_data(data):
    print("Received data:", data)
    emit('response', {'status': 'received'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8001)