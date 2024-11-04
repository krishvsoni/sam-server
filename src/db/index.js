const mongoose = require('mongoose');
require('dotenv').config()

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL||"mongodb+srv://krishsoni:2203031050659@paytm.aujjoys.mongodb.net/SAM", {
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
