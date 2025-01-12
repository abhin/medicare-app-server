import bcrypt from "bcrypt";
import isUrl from "is-url";
import User from "../models/users.js";
import { sendAccountActivationEmail } from "../utils/email.js";
import { generateAccessToken } from "../utils/accessToken.js";
import { generateFullServerUrl } from "../utils/url.js";

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("department");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials.",
      });
    }

    if (!user.status) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive.",
      });
    }

    const token = generateAccessToken({ accessKey: user._id });
    const { password: _, ...userResponse } = user.toObject();
    userResponse.token = token;
    userResponse.profilePic =
      user.profilePic && 
      (isUrl(user.profilePic) ? user.profilePic : generateFullServerUrl(req, user.profilePic));


    res.status(200).json({
      success: true,
      message: "Login success",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during login.",
      error: error.message,
    });
  }
}

export async function googleLoginCallBack(req, res) {
  const { name, picture, email, email_verified } = JSON.parse(
    req?.user?.profile?._raw
  );

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        profilePic: picture,
        status: email_verified,
      },
      { new: true, upsert: true, sort: { createdAt: -1 } }
    );

    if (!user.status && !(await sendAccountActivationEmail(user))) {
      throw new Error(
        "Failed to send activation email. Please contact support."
      );
    }

    res.redirect(
      `${process.env.CLIENT_HOST_URL}/${generateAccessToken({accessKey: email}, "1d")}`
    );
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
}

export function googleUserVerify(req, res) {
  const { uId } = req.authUser;

  User.findOne({ email: uId })
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Google user verification success",
        user: {
          token: generateAccessToken({accessKey:data._id}),
          name: data.name,
          email: data.email,
          profilePic: data.profilePic,
        },
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: "Error/ Timeout Google user verification. Please try again",
        error: err,
      });
    });
}
