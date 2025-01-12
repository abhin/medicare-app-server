import Departments from "../models/departments.js";

export async function create(req, res) {
  let departmentData = req.body;

  try {
    const department = new Departments(departmentData);
    await department.save();

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error during department creation.",
      error: error.message,
    });
  }
}

export async function update(req, res) {
  const departmentData = req.body;
  const {id} = departmentData;

  try {
    if (!id) throw new Error("Departments ID not found.");

    const department = await Departments.findByIdAndUpdate(id, departmentData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Departments updated successfully.",
      department,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error during department update.",
      error: error.message,
    });
  }
}

export async function getAllDepartments(req, res) {
  try {
    const departments = await Departments.find();
    res.status(200).json({
      success: true,
      departments,
      message: "Departments fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching Departments.",
      error: error.message,
    });
  }
}

export async function getDepartment(req, res) {
  const { _id } = req.body;

  try {
    const department = await Departments.findById(_id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching department.",
      error: error.message,
    });
  }
}

export async function deleteDepartment(req, res) {
  const { _id } = req.params;

  try {
    const existingUsers = await Departments.exists({ _id });

    if (!existingUsers) {
      return res.status(404).json({
        success: false,
        message: "Departments does not exist.",
      });
    }

    await Departments.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: `Departments deleted successfully. ID: ${_id}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error occurred while deleting department.",
      error: error.message,
    });
  }
}
