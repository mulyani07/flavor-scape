const tf = require('@tensorflow/tfjs-node');

const loadModel = async (modelPath) => {
    try {
        const model = await tf.loadLayersModel(`https://storage.googleapis.com/modelfv/models/model.json`);
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        throw new Error('Error loading model: ' + error.message);
    }
};

module.exports = loadModel;
