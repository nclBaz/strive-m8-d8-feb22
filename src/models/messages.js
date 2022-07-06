import mongoose from "mongoose"

const { Schema, model } = mongoose

const MessagesSchema = new Schema(
  {
    text: { type: String, required: true },
    sender: { type: String, required: true },
    // sender: {type: mongoose.Types.ObjectId, ref: "User"} <-- if you have real users sender should be the _id of that user
    room: { type: mongoose.Types.ObjectId, ref: "Room", required: true },
  },
  { timestamps: true }
)

export default model("Message", MessagesSchema)
