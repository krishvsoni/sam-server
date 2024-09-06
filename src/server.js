import express from 'express';
import mongoose from 'mongoose';
import connectToDB from './db/index.js';
import waitlist from './db/model.js';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors(
    'https://sam-v1.vercel.app/',
));
connectToDB();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to SAM API');

});
app.post('/api/waitlist', async (req, res) => {
    const { name, email } = req.body;
    try {
        const existingEmail = await waitlist.findOne({ email });
        if (existingEmail) {
            return res.status(400).send('Email already exists in waitlist');
        }
        await waitlist.create({ name, email });
        res.status(201).send('Added to waitlist');
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        res.status(500).send('Error adding to waitlist');
    }
});


app.listen(PORT, () => {
    console.log('Server listening on port 3000');
});