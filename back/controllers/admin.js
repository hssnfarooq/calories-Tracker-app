const Food = require("../models/food");
const User = require("../models/userModel");
const CustomError = require("../models/CustomError");

exports.createFoodEntry = async (req, res, next) => {
  // console.log("req.body", req.body);
  if (!req.body) {
    return next(new CustomError("Body cannot be empty", 400));
  }
  // return false;
  let creator = req.body.creator;
  try {
    let insertDate = {
      name: req.body.name,
      calories: req.body.calories,
      creator: creator,
      created_by: "admin",
    };
    if (req.body.published) {
      insertDate["published"] = req.body.published;
    }
    const food = await Food.create(insertDate);
    // console.log("food", food);
    //connected foods with the user

    const user = await User.findById(creator);
    // console.log("User", user);
    if (user) {
      const foods = [...user.foods, food.id];
      await user.updateOne({ foods });

      return res.status(201).send({ success: true, food });
    }
  } catch (err) {
    // console.log(err);
    next(new CustomError("Something went wrong", 500));
  }
};

exports.reportStats = async (req, res, next) => {
  try {
    // console.log("reportStats", req.user);
    var lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 6);
    // console.log("last week", lastWeek);
    //average of entries by per user
    const tut = await Food.aggregate([
      { $match: { published: { $gte: lastWeek } } },
      {
        $group: {
          _id: "$creator",
          total: {
            $sum: "$calories",
          },
        },
      },
    ]);
    const entriesCurrentWeek = await Food.countDocuments({
      created_at: { $gte: lastWeek },
    });
    const BeforeCurrentWeek = await Food.countDocuments({
      created_at: { $lte: lastWeek },
    });

    return res.status(200).send({
      success: true,
      perUserSum: tut,
      entriesCurrentWeek,
      BeforeCurrentWeek,
    });
  } catch (err) {
    // console.log(err);
    next(new CustomError("Something went wrong", 500));
  }
};
exports.allUsersList = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "username"
    );

    return res.status(200).send({
      success: true,
      usersList: users,
    });
  } catch (err) {
    // console.log(err);
    next(new CustomError("Something went wrong", 500));
  }
};

exports.findAll = async (req, res, next) => {
  const { page, size, title } = req.query;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};
  const { limit, offset } = getPagination(page, size);
  const populate = {
    path: "creator",
    select: "username",
  };
  try {
    const data = await Food.paginate(condition, {
      populate,
      sort: { published: -1 },
      offset,
      limit,
    });
    if (!data) {
      return next(new CustomError("food not found", 404));
    }
    res.send({
      success: true,
      total: data.totalDocs,
      data: data.docs,
      total_pages: data.totalPages,
      currentPage: data.page - 1,
      per_page: limit,
    });
    // res.send({ success: true, foodDetail: data });
  } catch (err) {
    next(new CustomError("Something went wrong", 500));
  }
};

exports.update = async (req, res, next) => {
  try {
    // console.log("update is called", req.body);
    const editfood = await Food.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!editfood) {
      return next(new CustomError("food not found", 404));
    }

    return res.status(200).send({ success: true, food: editfood });
  } catch (err) {
    next(new CustomError("Something went wrong", 500));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return next(new CustomError("food not found", 404));
    }

    if (req.user.role !== "admin") {
      return next(new CustomError("Unauthorized access to delete route", 400));
    }

    // console.log("delete tre", food);
    await food.remove(req.params.id);
    const user = await User.findById(food.creator);

    if (user) {
      let foods = user.foods.filter((tutId) => tutId != req.params.id);
      await user.updateOne({ foods });
    }

    return res.send({ success: true, food });
  } catch (err) {
    console.log("error", err);
    next(new CustomError("Something went wrong", 500));
  }
};

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
