export default () => ({
    app: {
        name: process.env.APPNAME,
        version: process.env.APPVERSION,
        port: process.env.APP_PORT
    },
    mysql: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
    }
});