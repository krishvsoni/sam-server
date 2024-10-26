const express = require('express');
const axios = require('axios');
const {spawnprocess,sendCode} = require('../processServices');
require('dotenv').config()

const processRouter = express.Router();
processRouter.post('/spawnProcess',async (req,res)=>{
    const {cronValue}=req.body
    const pid=await spawnprocess(cronValue)
    res.json({pid})
})
processRouter.post('/sendCode',async (req,res)=>{
    const {processId,targetId,tagArray}=req.body
    const mid=await sendCode(processId,targetId,tagArray)
    res.json({mid})
})
module.exports=processRouter