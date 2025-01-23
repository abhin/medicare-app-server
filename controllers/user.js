import bcrypt from "bcrypt";
import Users from "../models/users.js";
import { sendAccountActivationEmail } from "../utils/email.js";

export async function create(req, res) {
  let userData = req.body;
  const { password, sendEmail } = userData;
  const succMsg = sendEmail
    ? "Account created successfully. Please check your email for activation."
    : "Account created successfully.";

  let userId;

  try {
    userData.password = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const newUser = new Users(userData);

    await newUser.save();

    const { password: _, ...user } = newUser.toObject();
    userId = user._id;

    if (sendEmail && !(await sendAccountActivationEmail(user))) {
      throw new Error(
        "Failed to send activation email. Please contact support."
      );
    }

    return res.status(201).json({
      success: true,
      message: succMsg,
      user,
    });
  } catch (error) {
    await Users.findByIdAndDelete({ _id: userId });
    res.status(400).json({
      success: false,
      message: "Error during user creation.",
      error: error.message,
    });
  }
}

export async function update(req, res) {
  let userData = req.body;
  const { password } = userData;
  const id = req.accessKeyValue;

  try {
    if (!id) throw new Error("Users ID not found.");

    if (password) {
      userData.password = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS)
      );
    }

    const updatedUsers = await Users.findByIdAndUpdate(id, userData, {
      new: true,
    }).populate("department");;

    const { password: _, ...userResponse } = updatedUsers.toObject();

    res.status(200).json({
      success: true,
      message: "Users updated successfully.",
      user: userResponse,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error during user update.",
      error: error.message,
    });
  }
}

export async function getAllUsers(req, res) {
  const { isUserDepartNameAggregateSearch, query } = req.body;
  try {
    let result = [];

    if (isUserDepartNameAggregateSearch === true) {
      result = await userDepartNameAggregateSearch(query);
    } else {
      result = await Users.find(query).populate("department");
    }

    if (result?.ok == 0) {
      throw new Error();
    }

    res.status(200).json({
      success: true,
      users: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching users.",
      error: true,
    });
  }
}

export async function getUser(req, res) {
  const { _id } = req.params;

  try {
    const user = await Users.findById(_id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching user.",
      error: error.message,
    });
  }
}

export async function deleteUser(req, res) {
  const { _id } = req.params;

  try {
    const existingUsers = await Users.exists({ _id });

    if (!existingUsers) {
      return res.status(404).json({
        success: false,
        message: "Users does not exist.",
      });
    }

    await Users.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: `Users deleted successfully. ID: ${_id}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error occurred while deleting user.",
      error: error.message,
    });
  }
}

export async function activate(req, res) {
  const _id = req.accessKeyValue;
  const redirectToClient = req.params?.doRedirect || "true";

  try {
    if (!_id) throw new Error("Users ID not found.");

    const updatedUsers = await Users.findByIdAndUpdate(
      _id,
      { status: true },
      { new: true }
    );

    if (!updatedUsers) {
      throw new Error("Activation failed. Invalid URL.");
    }

    if (redirectToClient == "true") {
      res.redirect(`${process.env.CLIENT_HOST_URL}/login?userActivated=true`);
    } else {
      res.status(200).json({
        success: true,
        message: "Account activated successfully.",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function userDepartNameAggregateSearch(matchConditions) {
  try {
    const users = await Users.aggregate([
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "departmentDetails",
        },
      },
      {
        $unwind: {
          path: "$departmentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: matchConditions,
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    return users;
  } catch (err) {
    return err;
  }
}
