require('dotenv').config()
const { createDataItemSigner, spawn, result, message, monitor, unmonitor } = require('@permaweb/aoconnect');
const fs = require('fs');
console.log(process.env)
const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf8'));
console.log(wallet)
async function spawnprocess(cronValue) {
    console.log('✔️ Spawning process');
    const processId = await spawn({
        module: "bkjb55i07GUCUSWROtKK4HU1mBS_X0TyH3M5jMV6aPg",
        scheduler: "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
        signer: createDataItemSigner(wallet),
        tags: [
            { name: "Cron-Interval", value: cronValue },
        ],
        data: "Spawn a process to run a cron job",
    });
    console.log('✔️ Process spawned:', processId);
    return processId;
}

async function sendCode(processId, targetId, tagArray) {
    const messageId = await message({
        process: processId,
        signer: createDataItemSigner(wallet),

        tags: [
            { name: "By the way", value: "I am a tag" },
            { name: "Action", value: "Eval" }
        ],
        data: `
        local tags = {${tagArray.map(tag => `"${tag}"`).join(',')}}
        local result = {}
        Handlers.add("Sender",{Action="Cron"},{
        function(msg)
        Send{Target="${targetId}",Action="RequestMessages"}
        end
        })

Handlers.add("S1",{Action="Cron"},{
Send{Target="${targetId}",Action="RequestMessages"}
})
Handlers.add("S2", {Action = "Analyze"},
function(msg)
    -- Iterate through the Data array
    for i = 1, #msg.Data do
        local tagArray = msg.Data[i].TagArray
        local from = msg.Data[i].From
        local id = msg.Data[i].Id
        
        -- Check each entry in TagArray
        for j = 1, #tagArray do
            -- Compare each tag name in tagArray with tags in the local tags list
            for k = 1, #tags do
                if tagArray[j].name == tags[k] then
                    print("Vulnerable tag found: " .. tags[k])
                    print("From: " .. from .. ", ID: " .. id)
                    
                    -- Add to result table
                    table.insert(result, {
                        vulnerable_tag = tags[k],
                        from = from,
                        id = id
                    })
                end
            end
        end
    end
	Send({Target=${targetId},Data=result,Action="ResultResponse"})
end)
 `,
    });
    console.log('✔️ Message sent:', messageId);
    return messageId;
}
async function monitorProcess(processId) {
    console.log('✔️ Monitoring process');
    const monitorId = await monitor({
        process: processId,
        signer: createDataItemSigner(wallet),
    });
    console.log('✔️ Process monitored:', monitorId);
    return monitorId;
}

module.exports = { spawnprocess, sendCode, monitorProcess };