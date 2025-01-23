import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    startDate: {
      type: date,
      required: true,
      index: true
    },
    endDate: {
      type: String,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
      index: true,
    }
  },
  { timestamps: true }
);

chatSchema.index({ users: 1, sender: 1, roomId: 1 });

const Chats = mongoose.model("Chats", chatSchema);

export default Chats;
