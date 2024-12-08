const predictController = require('../controllers/predictController');

const routes = [
    {
        method: 'POST',
        path: '/predict',
        options: {
            payload: {
                maxBytes: 1000000, // Batas maksimal 1MB
                output: 'stream',
                parse: true, // Pastikan parsing payload diaktifkan
            },
        },
        handler: predictController.predict,
    }
];

module.exports = routes;
