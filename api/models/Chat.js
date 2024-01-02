import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    chatname: {
      type: String,
      trim: true,
    },
    isgroupchat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestmessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupadmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamp: true }
);

export default mongoose.model("Chat", chatSchema);
