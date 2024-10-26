var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var waitlistSchema = new Schema({
    name: String,
    email: {
       type: String,
       unique: true
    }
});
var SentinelSchema = new Schema({
    targetProcess: String,
    sentinelProcessId: String,
});

var Waitlist = mongoose.model("Waitlist", waitlistSchema);
var Sentinel = mongoose.model("SentinelSchema", SentinelSchema);
module.exports = { Waitlist, Sentinel }; ;