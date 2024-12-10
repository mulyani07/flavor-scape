const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
    try {
        // Proses gambar menjadi tensor
        const tensor = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        // Tentukan hasil prediksi berdasarkan confidence score
        let result = { 
            confidenceScore, 
            label: "Unidentified Ingredient", 
            suggestion: [
                { recipeName: "Unknown", ingredients: [], instructions: "No recipe available." },
            ],
        };

        if (confidenceScore >= 50) {
            // Misalkan hasil prediksi berdasarkan label dengan confidence tertinggi
            const labelIndex = score.indexOf(Math.max(...score));
            const labels = ["Cabbage", "Cauliflower", "Bottle-Gourd"]; // Label dari model Anda
            const label = labels[labelIndex] || "Unknown";

            // Rekomendasi resep berdasarkan bahan
            const recipeSuggestions = {
                Cabbage: [
                    {
                        recipeName: "Cabbage Stir Fry",
                        ingredients: ["Cabbage", "Garlic", "Soy Sauce", "Sesame Oil"],
                        instructions: "Chop cabbage. Stir fry with garlic, soy sauce, and sesame oil.",
                    },
                    {
                        recipeName: "Cabbage Soup",
                        ingredients: ["Cabbage", "Onion", "Carrot", "Vegetable Stock"],
                        instructions: "Boil chopped cabbage, onion, and carrot in vegetable stock until tender.",
                    },
                    {
                        recipeName: "Cabbage Salad",
                        ingredients: ["Cabbage", "Carrot", "Mayonnaise", "Lemon Juice"],
                        instructions: "Mix shredded cabbage and carrot. Add mayonnaise and lemon juice. Serve chilled.",
                    },
                ],
                Cauliflower: [
                    {
                        recipeName: "Cauliflower Rice",
                        ingredients: ["Cauliflower", "Garlic", "Olive Oil", "Salt"],
                        instructions: "Grate cauliflower into rice-sized pieces. Sauté with garlic and olive oil.",
                    },
                    {
                        recipeName: "Cauliflower Curry",
                        ingredients: ["Cauliflower", "Tomato", "Onion", "Spices"],
                        instructions: "Cook cauliflower with tomato, onion, and spices to make a curry.",
                    },
                    {
                        recipeName: "Roasted Cauliflower",
                        ingredients: ["Cauliflower", "Olive Oil", "Salt", "Pepper"],
                        instructions: "Roast cauliflower florets with olive oil, salt, and pepper at 200°C for 25 minutes.",
                    },
                ],
                "Bottle-Gourd": [
                    {
                        recipeName: "Bottle Gourd Curry",
                        ingredients: ["Bottle Gourd", "Tomato", "Onion", "Spices"],
                        instructions: "Cook bottle gourd with tomato, onion, and spices to make a curry.",
                    },
                    {
                        recipeName: "Bottle Gourd Soup",
                        ingredients: ["Bottle Gourd", "Garlic", "Vegetable Stock"],
                        instructions: "Blend boiled bottle gourd with garlic and vegetable stock. Serve warm.",
                    },
                    {
                        recipeName: "Bottle Gourd Halwa",
                        ingredients: ["Bottle Gourd", "Milk", "Sugar", "Ghee"],
                        instructions: "Grate bottle gourd. Cook with milk, sugar, and ghee until thickened.",
                    },
                ],
            };

            result = { 
                confidenceScore, 
                label, 
                suggestion: recipeSuggestions[label] || [
                    { recipeName: "No Recipe Found", ingredients: [], instructions: "No suggestions available for this ingredient." },
                ],
            };
        }

        return result;
    } catch (error) {
        throw new InputError("Terjadi kesalahan dalam melakukan prediksi. Pastikan Anda mengunggah gambar yang benar.");
    }
}

module.exports = predictClassification;
