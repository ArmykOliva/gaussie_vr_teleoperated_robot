import {Component, Property} from '@wonderlandengine/api';

/**
 * ImgTexture
 */
export class ImgTexture extends Component {
    static TypeName = 'ImgTexture';
    /* Properties that are configurable in the editor */
    static Properties = {
        imageUrl: Property.string('https://cdn.prod.website-files.com/64e92a8556392a3ffbfe138c/64ea0306862892bff88fac03_aichat-p-500.png', 'Image URL')
    };

    start() {
        // Load the image as texture
        this.loadAndApplyTexture(this.imageUrl);
    }

    async loadAndApplyTexture(url) {
        try {
            // Load texture from URL
            const texture = await this.engine.textures.load(url, 'anonymous');
            
            // Retrieve the mesh component from this object
            const mesh = this.object.getComponent('mesh');
            if (!mesh) {
                console.error('Missing mesh component on the object.');
                return;
            }

            // Clone the material to avoid affecting other objects using the same material
            this.material = mesh.material.clone();
            mesh.material = this.material;
            
            // Apply the loaded texture
            this.material.diffuseTexture = texture;
        } catch (error) {
            console.error('Failed to load texture:', error);
        }
    }


    update(dt) {
        /* Called every frame. */
    }
}
