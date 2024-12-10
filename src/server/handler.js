/** @format */

const predictClassification = require("../services/inferenceService");
const { storeData, getData } = require("../services/storeData");
const crypto = require("crypto");

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    // Lakukan prediksi dengan model
    const { confidenceScore, label, suggestion } = await predictClassification(model, image);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Data yang akan disimpan ke Firestore
    const data = {
        id,
        ingredient: label,
        recipes: suggestion, // Suggestion berisi array resep
        confidenceScore,
        createdAt,
    };

    // Simpan hasil prediksi ke database
    await storeData(id, data);

    const response = h.response({
        status: "success",
        message: confidenceScore > 0 ? "Ingredient successfully identified" : "Please use a clearer image.",
        data,
    });
    response.code(201);
    return response;
}

async function getPredictHandler(request, h) {
    const { id } = request.params;

    // Ambil data prediksi berdasarkan ID
    const data = await getData(id);

    if (!data) {
        const response = h.response({
            status: "fail",
            message: "Prediction not found",
        });
        response.code(404);
        return response;
    }

    const response = h.response({
        status: "success",
        data,
    });
    response.code(200);
    return response;
}

module.exports = { postPredictHandler, getPredictHandler };
