const runInference = async (model, tensor) => {
    try {
        const predictions = model.predict(tensor).dataSync();
        const labelIndex = predictions.indexOf(Math.max(...predictions));
        const labels = ['carrot', 'potato', 'broccoli']; // Sesuaikan dengan label model Anda
        return [labels[labelIndex]];
    } catch (error) {
        throw new Error('Error during inference: ' + error.message);
    }
};

module.exports = runInference;
