const Hapi = require('@hapi/hapi');
const predictRoute = require('./routes/predictRoute');  // Menyertakan file routes

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });

    // Menyambungkan route ke server
    server.route(predictRoute);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();