const axios = require('axios');
const WEBHOOK_URL = "https://sam-server.azurewebsites.net/webhook";
const SECRET = "letsfuckinggo";

const createWebhook = async (owner, repo, github_access_token) => {
    try {
        // List existing webhooks
        const hooksResponse = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/hooks`,
            {
                headers: {
                    Authorization: `token ${github_access_token}`,
                },
            }
        );

        // Check if a webhook with the same URL already exists
        const existingHook = hooksResponse.data.find(
            hook => hook.config.url === WEBHOOK_URL
        );

        if (existingHook) {
            console.log("Webhook already exists:", existingHook);
            return;
        }

        // Create the webhook if it doesn't exist
        const response = await axios.post(
            `https://api.github.com/repos/${owner}/${repo}/hooks`,
            {
                name: "web",
                active: true,
                events: ["push"],
                config: {
                    url: WEBHOOK_URL,
                    content_type: "json",
                    secret: SECRET,
                },
            },
            {
                headers: {
                    Authorization: `token ${github_access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Webhook created successfully:", response.data);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
};

module.exports = createWebhook;
