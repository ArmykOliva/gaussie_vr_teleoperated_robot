import {Component, Property} from '@wonderlandengine/api';
import io from 'socket.io-client';

/**
 * InputSender
 */
export class InputSender extends Component {
    static TypeName = 'InputSender';
    static Properties = {
        serverURL: Property.string('http://10.0.0.69:8001', 'Server URL'),
    };

    start() {
        this.setupSocketIO();
    }

    setupSocketIO() {
        this.socket = io(this.serverURL);

        this.socket.on('connect', () => {
            console.log('Socket.IO connection established');
        });

        this.socket.on('response', (data) => {
            console.log("Server response:", data);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
        });
    }

    update(dt) {
        if (this.socket.connected) {
            //let data = this.collectControllerData();
            this.socket.emit('controller_data', "hello");
        }
    }

    onDestroy() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    sendControllerData() {
        let leftController = this.engine.input.getLeftController();
        let rightController = this.engine.input.getRightController();

        let data = {
            leftController: {
                position: leftController.position.toArray(),
                rotation: leftController.rotation.toArray(),
                joystick: leftController.joystick,
                buttons: {
                    trigger: leftController.buttons.trigger.pressed,
                    grip: leftController.buttons.grip.pressed,
                    touchpad: leftController.buttons.touchpad.pressed
                }
            },
            rightController: {
                position: rightController.position.toArray(),
                rotation: rightController.rotation.toArray(),
                joystick: rightController.joystick,
                buttons: {
                    trigger: rightController.buttons.trigger.pressed,
                    grip: rightController.buttons.grip.pressed,
                    touchpad: rightController.buttons.touchpad.pressed
                }
            }
        };

        this.socket.send(JSON.stringify(data));
    }
}
