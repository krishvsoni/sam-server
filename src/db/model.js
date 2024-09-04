import { Schema } from "mongoose";
import mongoose from "mongoose";

const waitlistSchema = new Schema({
    name: String,
    email: {
       type: String,
       unique: true
}});

const waitlist=mongoose.model("Waitlist",waitlistSchema)
export default  waitlist;