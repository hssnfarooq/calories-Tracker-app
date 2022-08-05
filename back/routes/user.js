const express = require("express");
const { check } = require("express-validator");
const auth = require("../middlewares/auth");
const userController = require("../controllers/user");
const admin = require("../middlewares/admin");

const router = express.Router();

router.post(
  "/friendInvite",
  [
    check("username", "Please enter a valid username").trim().notEmpty(),
    check("email", "Please enter a valid email").trim().isEmail(),
    auth,
  ],
  userController.signUp
);

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").trim().isEmail(),
    check("password", "Please enter a valid password")
      .trim()
      .isLength({ min: 6 }),
  ],
  userController.login
);

router.get("/userInfo", auth, userController.userInfo);
router.get("/logout", auth, userController.logout);

module.exports = router;
