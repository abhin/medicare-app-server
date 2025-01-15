import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    roomId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    messageType: {
      type: String,
      required: true,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

chatSchema.index({ users: 1, sender: 1, roomId: 1 });

const Chats = mongoose.model("Chats", chatSchema);

export default Chats;
