const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://krishsoni:2203031050659@paytm.aujjoys.mongodb.net/SAMv1", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000, // Adjust socket timeout based on your needs
        });
        console.log('Connected to SentioDB');
    } catch (error) {
        console.error('Error connecting to SentioDB:', error);
    }
};

module.exports = connectToDB;
