const handler = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/load-model',
        handler: handler.loadModelHandler,
    },
    {
        method: 'POST',
        path: '/predict',
        options: {
            payload: {
                maxBytes: 1048576 * 5, // Max 5 MB
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
            },
        },
        handler: handler.predictHandler,
    },
];

module.exports = routes;
