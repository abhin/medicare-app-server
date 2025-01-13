import express from "express";
import {
  validateCreate,
  validateUpdate,
  validateDelete,
  validateGetAllChat,
  validateGetChat,
} from "../middleware/chat.js";
import {
  create,
  getAllChats,
  update,
  deleteChat,
  getChat,
} from "../controllers/chat.js";

const router = express.Router();

router.post(["/create"], validateCreate(), create);
router.post("/read", validateGetAllChat(), getAllChats);
router.post("/read/:_id", validateGetChat(), getChat);
router.put("/update", validateUpdate(), update);
router.delete("/delete/:_id", validateDelete(), deleteChat);

export default router;
