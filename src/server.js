const express = require('express');
const connectToDB = require('./db/index.js');
const waitlist = require('./db/model.js');
const cors = require('cors');
const axios = require('axios');
const gql = require('graphql-tag');
const { print } = require('graphql');
const router = require('./router/repoRouter.js');
const processRouter = require('./router/processRouter.js');
const app = express();

app.use(express.json());
app.use(cors(
  'https://sam-v1.vercel.app/','http://localhost:5173','https://sentio-app.ar-io.dev/','http://localhost:5173/offchain?code=',
));
connectToDB();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to SENTIO API');

});

app.use('/api/github',router)
app.use('/api/process',processRouter)
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
app.post('/getProcesses', async (req, res) => {
  const { address } = req.body;


  const query = gql`
    query {
    transactions(
      owners: "${address}", 
      tags: [{ name: "Data-Protocol", values: ["ao"] }, { name: "Type", values: ["Process"] }],
      first: 999
    ) {
      edges {
      node {
        id
        tags {
        name
        value
        }
      }
      }
    }
    }
  `;

  try {
  const response = await axios.post(
    'https://arweave-search.goldsky.com/graphql',
    {
    query: print(query),
    },
    {
    headers: {
      'accept': 'application/graphql-response+json, application/graphql+json, application/json, text/event-stream, multipart/mixed',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'origin': 'https://www.ao.link',
      'priority': 'u=1, i',
      'referer': 'https://www.ao.link/',
      'sec-ch-ua': '"Opera";v="111", "Chromium";v="125", "Not.A/Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 OPR/111.0.0.0'
    }
    }
  );

  res.json(response.data.data.transactions);
  } catch (error) {
  console.error(error);
  res.status(500).send('Error making the request');
  }
});

app.listen(PORT, () => {
  console.log('Server listening on port 3000');
});
