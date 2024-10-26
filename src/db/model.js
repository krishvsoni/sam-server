var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var waitlistSchema = new Schema({
    name: String,
    email: {
       type: String,
       unique: true
    }
});

var Waitlist = mongoose.model("Waitlist", waitlistSchema);
module.exports = Waitlist;