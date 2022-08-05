const { verifyToken } = require("../utils/jwt");
const User = require("../models/userModel");
const CustomError = require("../models/CustomError");
const { decode } = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // let token;
    // if (
    //   req.headers.authorization &&
    //   req.headers.authorization.startsWith("Bearer")
    // ) {
    //   token = req.headers.authorization.split(" ")[1];
    // }

    // if (!token) {
    //   return next(
    //     new CustomError("Unauthorized access, provide the token", 401)
    //   );
    // }

    // let decoded;
    // try {
    //   decoded = verifyToken(token);
    //   // console.log("decode", decode());
    //   // console.log("decoded", decoded.header);
    //   // console.log(decoded.payload);
    // } catch (err) {
    //   return next(
    //     new CustomError("Unauthorized access, provide the token", 401)
    //   );
    // }

    // const user = await User.findById(decoded.id);

    // if (!user) {
    //   return next(new CustomError("Unauthorized access", 401));
    // }

    // req.uid = decoded.id;

    // req.user = {
    //   username: user.username,
    //   email: user.email,
    //   _id: user._id,
    //   foods: user.foods,
    //   role: user.role,
    // };
    // console.log("admin test", req.user);
    if (req.user.role === "admin") {
      next();
    } else {
      return next(new CustomError("Unauthorized access", 401));
    }
  } catch (err) {
    next(new CustomError("Something went wrong", 500));
  }
};
