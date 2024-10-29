const express = require('express');
const axios = require('axios');
const { spawnprocess, sendCode, monitorProcess, askAirdrop } = require('../processServices');
const { Sentinel } = require('../db/model');
const { monitor } = require('@permaweb/aoconnect');
// const { uploadToArweave } = require('../processServices');
require('dotenv').config()


const processRouter = express.Router();

processRouter.post('/spawnProcess', async (req, res) => {

    const { cronValue, targetProcess } = req.body
    if (!cronValue || !targetProcess) {
        res.status(400).json({ error: "Invalid request" })
        return;
    }
    const existingSentinel = await Sentinel.findOne({ targetProcess })
    if (existingSentinel) {
        res.status(400).json({ error: "Process already running" })
        return;
    }

    const pid = await spawnprocess(cronValue)
    try {
        const newSentinel = await Sentinel.create({ targetProcess, sentinelProcessId: pid });
        
        return res.status(201).json({ pid });
    } catch (error) {
        console.error('Error creating sentinel:', error);
        return res.status(500).send('Error creating sentinel');
    }
})
processRouter.post('/sendCode', async (req, res) => {
    const { processId, targetId, tagArray } = req.body
    const mid = await sendCode(processId, targetId, tagArray)
    res.json({ mid })
})
processRouter.post('/monitorProcess',async(req,res)=>{
    const {processId} = req.body
    const monitorId = await monitorProcess(processId)
    res.json({monitorId})
})
processRouter.post('/airdrop',async(req,res)=>{
    const {walletid}= req.body
    const mid=await askAirdrop(walletid);
    res.json({mid})
})

// processRouter.post('/uploadToArweave', uploadToArweave)

module.exports = processRouter