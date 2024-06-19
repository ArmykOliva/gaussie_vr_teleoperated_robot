import {Component, Property, Type} from '@wonderlandengine/api';
import io from 'socket.io-client';

/**
 * InputSender
 */
export class InputSender extends Component {
    static TypeName = 'InputSender';
    static Properties = {
        serverURL: Property.string('http://192.168.0.3:8000', 'Server URL'),
        camRoot: { type: Type.Object },
        /** How far the thumbstick needs to be pushed to have the teleport target indicator show up */
        thumbstickActivationThreshhold: { type: Type.Float, default: -0.7 },
        /** How far the thumbstick needs to be released to execute the teleport */
        thumbstickDeactivationThreshhold: { type: Type.Float, default: 0.3 }
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
        if(!this.engine.xr) return;

        let data = {};
        for(const input of this.engine.xr.session.inputSources) {
            if (!data[input.handedness]) data[input.handedness] = {}; // Initialize the handedness object if it doesn't exist
            data[input.handedness]["x"] = input.gamepad.axes[2];
            data[input.handedness]["y"] = input.gamepad.axes[3];
        }
        if (this.socket.connected) {
            this.socket.emit('controller_data', JSON.stringify(data));
        }

        
    }

    onDestroy() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
