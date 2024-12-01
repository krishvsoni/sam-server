const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const qs = require('qs');
const axios = require('axios');
const createWebhook = require('../hooks/hook');
const cors = require('cors');
require('dotenv').config();
const hookRouter=express.Router();


const GITHUB_SECRET = "letsfuckinggo";
const records = [];

hookRouter.use(cors());
hookRouter.use(bodyParser.json({
    verify: (req, res, buf, encoding) => {
        req.rawBody = buf; // Save the raw buffer for signature verification
    }
}));

// Verify Signature Middleware
function verifySignature(req, res) {
    const signature = `sha256=${crypto
        .createHmac('sha256', GITHUB_SECRET)
        .update(req.rawBody)
        .digest('hex')}`;

    const githubSignature = req.headers['x-hub-signature-256'];
    if (githubSignature !== signature) {
        console.error('Invalid signature!');
        res.status(401).send('Invalid signature');
        return false;
    }
    return true;
}

hookRouter.get('/', (req, res) => {
    res.send('Hello World!');
});

// OAuth Token Exchange
hookRouter.post("/getAccessToken", async (req, res) => {
    const { code } = req.body;
    const client_id = "Ov23li6B22aE7pvYNv3L";
    const client_secret = "c58845e40227b16e316b8525fcb729da08f513b6"; 

    try {
        const { data } = await axios.post(
            "https://github.com/login/oauth/access_token",
            { client_id, client_secret, code },
            { headers: { Accept: "hookRouterlication/json" } }
        );
        res.json({ access_token: data.access_token });
    } catch {
        res.status(500).json({ message: "Failed to exchange code for token" });
    }
});

// Set Webhook
hookRouter.post('/setWebhook', async (req, res) => {
    const { userName, repoName, github_access_token } = req.body;

    if (!userName || !repoName || !github_access_token) {
        return res.status(400).json({ error: "userName, repoName, and github_access_token are required" });
    }

    try {
        const commitsResponse = await axios.get(
            `https://api.github.com/repos/${userName}/${repoName}/commits`,
            {
                headers: {
                    Authorization: `token ${github_access_token}`,
                },
            }
        );

        const recentCommit = commitsResponse.data[0]?.sha;
        if (!recentCommit) {
            return res.status(404).json({ error: "No commits found for the repository" });
        }

        const existingRecord = records.find(
            record => record.userName === userName && record.repoName === repoName
        );

        if (existingRecord) {
            return res.status(400).json({ error: "Webhook is already set for this repository" });
        }

        records.push({
            userName,
            repoName: `${userName}/${repoName}`,
            recentCommit,
        });

        await createWebhook(userName, repoName, github_access_token);

        res.status(200).json({
            message: "Webhook set and repository details stored successfully",
            record: { userName, repoName, recentCommit },
        });
    } catch (error) {
        console.error("Error setting webhook:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to set webhook or fetch repository details" });
    }
});
async function extractChanges(commits, repo, branch) {
    const luaFiles = [];
    for (const commit of commits) {
        console.log(`Processing Commit: ${commit.id}`);
        const changedFiles = [
            ...(commit.added || []),
            ...(commit.modified || [])
        ]; // Only include added/modified files, not removed ones.
        for (const file of changedFiles) {
            if (file.endsWith('.lua')) {
                console.log(`Lua File Found: ${file}`);
                try {
                    // Fetch file content from GitHub
                    const fileUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${file}`;
                    const response = await axios.get(fileUrl);
                    luaFiles.push({ file, content: response.data });
                } catch (error) {
                    console.error(`Error fetching ${file}:`, error.response?.data || error.message);
                }
            }
        }
    }
    return luaFiles;
}
async function analyzeReport(luaFiles) {
    for (const { file, content } of luaFiles) {
        if (!content) {
            console.error(`File ${file} has no content.`);
            continue;
        }
        try {
            console.log(`Analyzing ${file}...`);
            const response = await axios.post('https://sam-offchain-dbedazdhd2dugrdk.eastus-01.azurewebsites.net/analyze',
                // const response = await axios.post('http://127.0.0.1:5000/analyze',
                qs.stringify({ code: content }), {
                headers: {
                    'Content-Type': 'hookRouterlication/x-www-form-urlencoded',
                },
            });
            console.log(`Analysis for ${file}:`);
            console.log(response.data);
        } catch (error) {
            console.error(`Error analyzing ${file}:`, error.response?.data || error.message);
        }
    }
}
hookRouter.post('/webhook', async (req, res) => {
    if (!verifySignature(req, res)) return;
    const event = req.headers['x-github-event'];
    if (event === 'push') {
        const commits = req.body.commits;
        const repo = req.body.repository.full_name; // e.g., "haard18/A-TEST"
        const branch = req.body.ref.split('/').pop(); // Extract branch name
        console.log(`Push event received on ${branch} branch for ${repo}`);
        try {
            // Extract Lua changes from the commits
            const luaFiles = await extractChanges(commits, repo, branch);
            if (luaFiles.length === 0) {
                console.log('No Lua files changed.');
            } else {
                console.log('Lua files extracted:', luaFiles.map(file => file.file));
                // Send to /analyze endpoint
                await analyzeReport(luaFiles);
            }
            // Get the latest commit SHA from the first commit in the push event
            const latestCommit = commits[0].id;
            // Debugging: Log repo names for comparison
            console.log("Records:", records.map(record => record.repoName));
            console.log("Received repo:", repo);
            // Normalize case for comparison (convert to lowercase)
            const normalizedRepo = repo.toLowerCase();
            // Find the existing record for the repository using lowercase comparison
            const existingRecord = records.find(record => record.repoName.toLowerCase() === normalizedRepo);
            if (existingRecord) {
                // Update the existing record with the latest commit
                existingRecord.recentCommit = latestCommit;
                console.log(`Updated latest commit for ${repo}: ${latestCommit}`);
            } else {
                // If no matching record is found, skip adding a new record
                console.log(`No matching record found for ${repo}. Skipping update.`);
            }
        } catch (error) {
            console.error('Error processing webhook:', error.message);
        }
    }
    res.send('Webhook processed');
});
hookRouter.get('/records', (req, res) => {
    res.json(records);
});
module.exports = hookRouter;