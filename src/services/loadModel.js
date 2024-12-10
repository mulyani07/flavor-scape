const tf = require('@tensorflow/tfjs-node');

const loadModel = async (modelPath) => {
    try {
        const model = await tf.loadLayersModel(`file://${modelPath}`);
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        throw new Error('Error loading model: ' + error.message);
    }
};

module.exports = loadModel;
