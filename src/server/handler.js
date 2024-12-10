const loadModel = require('../services/loadModel');
const runInference = require('../services/inferenceService');
const storeData = require('../services/storeData');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

let model;

const handler = {
    async loadModelHandler(request, h) {
        try {
            model = await loadModel('model/model.h5');
            return h.response({ message: 'Model loaded successfully' }).code(200);
        } catch (error) {
            return h.response({ error: error.message }).code(500);
        }
    },

    async predictHandler(request, h) {
        try {
            if (!model) {
                throw new Error('Model is not loaded. Load the model first.');
            }

            const { file } = request.payload.image;
            const imageBuffer = await file.toBuffer();
            const tensor = tf.node.decodeImage(imageBuffer).resizeNearestNeighbor([224, 224]).toFloat().expandDims();

            const prediction = await runInference(model, tensor);
            const detectedVegetable = prediction[0];

            const recipes = getRecipeRecommendations(detectedVegetable);
            await storeData('predictions', { detectedVegetable, recipes });

            return h.response({ detectedVegetable, recipes }).code(200);
        } catch (error) {
            return h.response({ error: error.message }).code(400);
        }
    },
};

const getRecipeRecommendations = (vegetable) => {
    const recipeDatabase = {
        carrot: [
            { title: 'Carrot Soup', ingredients: ['carrot', 'onion', 'garlic'], instructions: 'Boil everything and blend.' },
            { title: 'Carrot Salad', ingredients: ['carrot', 'lettuce', 'olive oil'], instructions: 'Mix everything.' },
            { title: 'Carrot Cake', ingredients: ['carrot', 'flour', 'sugar'], instructions: 'Bake it.' },
        ],
    };

    return recipeDatabase[vegetable] || [];
};

module.exports = handler;
