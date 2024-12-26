module.exports = {
    apps: [
        {
            name: 'chat_app_be',
            script: './dist/server.js',
            cwd: __dirname,
            autorestart: true,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
