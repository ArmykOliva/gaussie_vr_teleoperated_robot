import { Component, Property } from '@wonderlandengine/api';

/**
 * VideoTexture
 */
export class VideoTexture extends Component {
    static TypeName = 'VideoTexture';
    static Properties = {
        streamUrl: Property.string('http://192.168.0.3:8001', 'Stream URL')
    };

    start() {
        if (!this.streamUrl) {
            console.error('Stream URL is not set.');
            return;
        }

        this.img = new Image();
        this.img.crossOrigin = "Anonymous"; // Required for CORS

        this.img.onload = () => {
            if (this.texture) {
                // Destroy the old texture to free up space
                this.texture.destroy();
            }

            // Create a new texture from the updated image each time
            this.texture = this.engine.textures.create(this.img);

            const mesh = this.object.getComponent('mesh');
            if (mesh) {
                if (!this.material) {
                    this.material = mesh.material.clone();
                    mesh.material = this.material;
                }
                this.material.flatTexture = this.texture;
            }
        };

        this.img.onerror = (error) => {
            console.error('Error loading image:', error);
        };

        // Trigger the load
        this.img.src = this.streamUrl;
    }

    update(dt) {
        // If needed, could implement logic to periodically check or refresh the image source
        if (this.img.src !== this.streamUrl) {
            this.img.src = this.streamUrl;
        }
    }

    onStop() {
        if (this.texture) {
            // Destroy the texture when the component is stopped
            this.texture.destroy();
        }
    }
}
