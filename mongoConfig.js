var MONGODB_URI;

if (process.env.ENVIRONMENT === 'PRODUCTION') {
    MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-uclqy.mongodb.net/todo?retryWrites=true`;
} else if (process.env.ENVIRONMENT === 'STAGING') {
    MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-uclqy.mongodb.net/todotesting?retryWrites=true`;
} else if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
    MONGODB_URI = 'mongodb://127.0.0.1:27017/todo';
} else if (process.env.ENVIRONMENT === 'TESTING') {
    MONGODB_URI = 'mongodb://127.0.0.1:27017/todotesting';
}

module.exports = {
    MONGODB_URI
};
