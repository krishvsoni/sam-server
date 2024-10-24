import { stringify } from 'qs';
import { Router } from 'express';
import axios from 'axios';
// import bodyParser from 'body-parser';
import { config } from 'dotenv';
config();
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

console.log(clientId)
console.log(clientSecret)

// const isValidPath = (path) => {
//     return /\.(lua|luanb)$/.test(path);
// };

// router.get('/import', async (req, res) => {
//     const { token, owner, repo, path } = req.query; 

//     // Validate input parameters
//     if (!token || !owner || !repo || !path || !isValidPath(path)) {
//         return res.status(400).json({ message: 'Invalid parameters' });
//     }

//     try {
//         const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
//             headers: {
//                 Authorization: `token ${token}`,
//                 Accept: 'application/vnd.github.v3.raw',
//             },
//         });

//         const fileContent = Buffer.from(response.data.content, 'base64').toString('utf-8');
//         res.json({ fileContent });
//     } catch (error) {
//         console.error('Error fetching file from GitHub:', error.message);
//         if (error.response && error.response.status === 404) {
//             return res.status(404).json({ message: 'File not found' });
//         }
//         res.status(500).json({ message: 'Error fetching file from GitHub' });
//     }
// });

// router.get('/callback', async (req, res) => {
//     const { code } = req.query;

//     if (!code) {
//         return res.status(400).json({ message: 'Authorization code is required' });
//     }

//     try {
//         const tokenResponse = await axios.post(
//             'https://github.com/login/oauth/access_token',
//             stringify({
//                 client_id: clientId,
//                 client_secret: clientSecret,
//                 code: code,
//             }),
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                     'Accept': 'application/json',
//                 },
//             }
//         );

//         const accessToken = tokenResponse.data.access_token;
//         res.redirect(`/import?token=${accessToken}`);
//     } catch (error) {
//         console.error('Error exchanging code for access token:', error.message);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

export default router;
