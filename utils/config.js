require('dotenv').config();

const PORT = process.env.PORT || 3003;
const { MONGODB_URI_TEST, MONGODB_URI } = process.env;
module.exports = {
    MONGODB_URI_TEST,
    MONGODB_URI,
    PORT,
};
