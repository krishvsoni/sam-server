const mongoose = require('mongoose');
require('dotenv').config()

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, 
            socketTimeoutMS: 45000, 
        });
        console.log('Connected to SentioDB');
    } catch (error) {
        console.error('Error connecting to SentioDB:', error);
    }
};

module.exports = connectToDB;
