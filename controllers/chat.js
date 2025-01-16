import Chats from "../models/chats.js";

export async function create(payload) {
  let chatData = payload;
  try {
    const chat = new Chats(chatData);
    await chat.save();

    return {
      success: true,
      message: "Chat created successfully",
      chat,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error during chat creation.",
      error: error.message,
    };
  }
}

export async function update(req, res) {
  const chatData = req.body;
  const { id } = chatData;

  try {
    if (!id) throw new Error("Chats ID not found.");

    const chat = await Chats.findByIdAndUpdate(id, chatData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Chats updated successfully.",
      chat,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error during chat update.",
      error: error.message,
    });
  }
}

export async function getAllChats(req, res) {
  const { roomId, limit = 50, skip = 0 } = req.body;
  try {
    const chats = await Chats.find({ roomId })
      .populate("sender receiver", "name _id")
      .sort({ createdAt: 1 });
    // .sort({ createdAt: 1 })
    // .skip(Number(skip))
    // .limit(Number(limit));

    res.status(200).json({
      success: true,
      chats,
      message: "Chats fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching Chats.",
      error: error.message,
    });
  }
}

export async function getChat(req, res) {
  const { _id } = req.body;

  try {
    const chat = await Chats.findById(_id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching chat.",
      error: error.message,
    });
  }
}

export async function deleteChat(req, res) {
  const { _id } = req.params;

  try {
    const existingUsers = await Chats.exists({ _id });

    if (!existingUsers) {
      return res.status(404).json({
        success: false,
        message: "Chats does not exist.",
      });
    }

    await Chats.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: `Chats deleted successfully. ID: ${_id}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error occurred while deleting chat.",
      error: error.message,
    });
  }
}
