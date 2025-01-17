import express from "express";
import {
  validateCreate,
  validateUpdate,
  validateDelete,
  validateActivation,
  validateGetAllUsers,
  validateGetUser,
  validateProfilePhotoUpdate,
} from "../middleware/user.js";
import {
  create,
  getAllUsers,
  update,
  deleteUser,
  activate,
  getUser,
} from "../controllers/user.js";

const router = express.Router();

router.post(["/create", "/signup"], validateCreate(), create);
router.post("/read", validateGetAllUsers(), getAllUsers);
router.get("/read/:_id", validateGetUser(), getUser);
router.put("/update", validateUpdate(), update);
router.delete("/delete/:_id", validateDelete(), deleteUser);
router.get("/activate/:token", validateActivation(), activate);
router.put(
  "/update-profile-photo",
  validateProfilePhotoUpdate(),
  update
);

export default router;
