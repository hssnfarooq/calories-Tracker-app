const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const { destroyToken } = require("../utils/jwt");
const { createToken } = require("../utils/jwt");
const CustomError = require("../models/CustomError");
const { genPassword, emailService } = require("../utils/helper");

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { username, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return next(
        new CustomError("User with provided email already exists", 403)
      );
    }
    // user = await User.findOne({ username });

    // // if (user) {
    // //   return next(
    // //     new CustomError("User with provided username already exists", 403)
    // //   );
    // // }

    let password = genPassword();
    user = new User({
      username,
      email,
      password: password,
      is_invited: true,
      invited_by: req.user.username,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    await user.save();
    emailService({
      username,
      email,
      password: password,
    });
    res.status(201).json({ success: true, user });
  } catch (err) {
    console.log(err);
    next(new CustomError("Something went wrong", 500));
  }
};

const logout = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("destru", token);
      // console.log(destroyToken(token));
      res.status(201).json({ success: true });
    }
  } catch (err) {
    console.log(err);
    next(new CustomError("Something went wrong", 500));
  }
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) return next(new CustomError("Invalid credentials", 400));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new CustomError(`Invalid credentials`, 400));
    }

    const accessToken = createToken({
      id: user._id,
    });
    user.isLoggedIn = true;
    await user.save();
    res
      .header("authorization", accessToken)
      .send({ success: true, accessToken, user });
  } catch (err) {
    console.log(err);
    next(new CustomError("Something went wrong", 500));
  }
};

const userInfo = async (req, res, next) => {
  console.log(req.user);
  // return req.user;
  return res.status(201).send({ success: true, userInfo: req.user });
};

module.exports = { signUp, login, userInfo, logout };
