// FixedDropout.js
import * as tf from '@tensorflow/tfjs';

// Define the custom FixedDropout layer
class FixedDropout extends tf.layers.Layer {
    constructor(config) {
        super(config);
        this.rate = config.rate;
    }

    call(inputs, kwargs) {
        const training = kwargs.training || false;
        if (training) {
            return tf.dropout(inputs, this.rate);
        } else {
            return inputs;
        }
    }

    getConfig() {
        const baseConfig = super.getConfig();
        return { ...baseConfig, rate: this.rate };
    }

    static get className() {
        return 'FixedDropout';
    }
}

// Register the custom layer
tf.serialization.registerClass(FixedDropout);

export default FixedDropout;
