import time
from flask import Response, Flask
from flask_cors import CORS
from threading import Thread, Lock
import cv2

global video_frame
video_frame = None

global thread_lock
thread_lock = Lock()

class Webcam:
    '''
    Camera class to handle video capture with a laptop webcam using OpenCV
    '''
    def __init__(self, image_w=640, image_h=480, framerate=30):
        self.w = image_w
        self.h = image_h
        self.framerate = framerate
        self.running = True
        self.frame = None

    def init_camera(self):
        # initialize the camera
        self.camera = cv2.VideoCapture(0)
        # Set resolution
        self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, self.w)
        self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, self.h)

        print('Webcam loaded.. .warming camera')
        time.sleep(2)

    def update(self):
        self.init_camera()
        while self.running:
            self.poll_camera()

    def poll_camera(self):
        global video_frame, thread_lock
        self.ret, frame = self.camera.read()
        if frame is not None:
            with thread_lock:
                video_frame = frame.copy()

            self.frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    def run(self):
        self.poll_camera()
        return self.frame

    def run_threaded(self):
        return self.frame

    def shutdown(self):
        self.running = False
        print('stopping Webcam')
        time.sleep(.5)
        self.camera.release()

def encodeFrame():
    global thread_lock
    while True:
        with thread_lock:
            global video_frame
            if video_frame is None:
                continue
            return_key, encoded_image = cv2.imencode(".jpg", video_frame)
            if not return_key:
                continue

        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
               bytearray(encoded_image) + b'\r\n')


# Create the Flask object for the application
app = Flask(__name__)
CORS(app)

@app.route("/")
def streamFrames():
    return Response(encodeFrame(), mimetype="multipart/x-mixed-replace; boundary=frame")


if __name__ == '__main__':
    cam = Webcam(image_w=640, image_h=480)
    # Create a thread for processing image frames
    process_thread = Thread(target=cam.update)
    process_thread.daemon = True

    process_thread.start()
    
    app.run("0.0.0.0", port="8000")
