const { stringify } = require('qs');
const { Router } = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const router = Router();

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;


router.post('/exchange-code', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  try {
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }), {
      headers: { 'Accept': 'application/json' },
    });

    if (tokenResponse.data.error) {
      return res.status(400).json({ error: tokenResponse.data.error });
    }

    res.json({ access_token: tokenResponse.data.access_token });
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    res.status(500).json({ error: 'Error exchanging code for access token' });
  }
});

  

module.exports = router;
