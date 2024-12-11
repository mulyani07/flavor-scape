require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require("../services/loadModel");

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080,
         host: '0.0.0.0',
    });

 try {
        const model = await loadModel();
        server.app.model = model;
    } catch (error) {
        console.error("Failed to load model:", error.message);
        server.app.model = null; // Pastikan server tahu jika model gagal dimuat
    }

    server.route(routes);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

init();
