import express from "express";
import {
  validateCreate,
  validateUpdate,
  validateDelete,
  validateGetAll,
  validateGet,
} from "../middleware/appointment.js";
import {
  create,
  getAll,
  update,
  deleteChat,
  get,
} from "../controllers/appointment.js";

const router = express.Router();

router.post(["/create"], validateCreate(), create);
router.post("/read", validateGetAll(), getAll);
router.post("/read/:_id", validateGet(), get);
router.put("/update", validateUpdate(), update);
router.delete("/delete/:_id", validateDelete(), deleteChat);

export default router;
