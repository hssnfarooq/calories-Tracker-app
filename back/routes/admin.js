const express = require("express");

const auth = require("../middlewares/auth");
const adminController = require("../controllers/admin");
const { check } = require("express-validator");
const admin = require("../middlewares/admin");

const router = express.Router();

router.get("/", [auth, admin], adminController.reportStats);
router.get("/allUsers", [auth, admin], adminController.allUsersList);

router.post(
  "/new",
  auth,
  [
    check("name", "Please fill out the field").trim().notEmpty(),
    check("calories", "Please fill out the field").trim().notEmpty(),
    check("creator", "Please Select the user Name").trim().notEmpty(),
    check("published", "Please Select a Valid date").isISO8601().toDate(),
  ],

  adminController.createFoodEntry
);

router.get("/foodList", [auth, admin], adminController.findAll);
router.delete("/deleteFood/:id", [auth, admin], adminController.delete);
router.post(
  "/edit/:id",
  [auth, admin],
  [
    check("name", "Please fill out the field").trim().notEmpty(),
    check("calories", "Please fill out the field").trim().notEmpty(),
    check("published").isISO8601().toDate(),
  ],

  adminController.update
);

router.post("/delete/:id", auth, adminController.delete);

module.exports = router;
