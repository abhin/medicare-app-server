import express from "express";
import {
  validateCreate,
  validateUpdate,
  validateDelete,
  validateGetDepartment,
} from "../middleware/department.js";
import {
  create,
  getAllDepartments,
  update,
  deleteDepartment,
  activate,
  getDepartment,
} from "../controllers/department.js";

const router = express.Router();

router.post(["/create"], validateCreate(), create);
router.get("/read", getAllDepartments);
router.get("/read/:_id", validateGetDepartment(), getDepartment);
router.put("/update", validateUpdate(), update);
router.delete("/delete/:_id", validateDelete(), deleteDepartment);

export default router;
