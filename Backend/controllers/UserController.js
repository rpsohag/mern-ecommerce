import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "./../models/User.js";
import { generateToken } from "../config/jwtToken.js";
import { validateMongoDBId } from "../utils/validateMongodDBId.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "./EmailController.js";

export const useRegister = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;
  if ((!firstname, !lastname, !email, !mobile, !password)) {
    return res.status(400).json({
      message: "All fields are required!",
    });
  }
  const emailCheck = await User.findOne({ email });
  if (emailCheck) {
    return res.status(400).json({
      message: "Email Already Registered!",
    });
  }
  const user = await User.create({
    firstname,
    lastname,
    email,
    mobile,
    password,
  });
  if (user) {
    return res.status(200).json({
      message: "User Created Successfully!",
      data: user,
    });
  } else {
    return res.status(400).json({
      message: "Something went wrong!",
    });
  }
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isValidPassword(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 23 * 60 * 60 * 1000,
    });

    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not authorized!");
  if (findAdmin && (await findAdmin.isValidPassword(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 23 * 60 * 60 * 1000,
    });

    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

export const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
  const rToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken: rToken });
  if (!user) {
    throw new Error("No refreshToken in db");
  }
  jwt.verify(rToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("something wrong with refresh token");
    }
    const accessToken = generateToken(user?.id);
    res.json({ accessToken });
  });
});

export const userLogout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
  const rToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken: rToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(
    { refreshToken: rToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

export const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    throw new Error(error);
  }
});

export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const user = await User.findById(id);
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({
      message: "User successfully deleted!",
      data: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Blocked Successfully",
      data: block,
    });
  } catch (error) {
    throw new Error(error);
  }
});
export const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User unBlocked Successfully",
      data: block,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updateSingleUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBId(_id);
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      { new: true }
    );
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDBId(_id);

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.findByIdAndUpdate(_id, {
      password: hashPassword,
    });

    res.json(user);
  } else {
    const user = await User.findById(_id);
    res.json(user);
  }
});

export const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("user not found with this email");
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, please follow this link to reset your password, this link is valid till 30 minutes <a href="http://127.0.0.1:5000/api/user/reset-password/${token}">Click Here</a>`;
    const data = {
      to: email,
      text: "Hello user",
      subject: "Forgot Password",
      html: resetURL,
    };
    sendEmail(data);
    res.json({
      message: "Reset email has been sent!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Token expired! Please tried again later");
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    user.password = hashPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  } else {
    const user = await User.findById(_id);
    res.json(user);
  }
});

export const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        address: req.body.address,
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});
