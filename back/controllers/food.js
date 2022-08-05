const Food = require("../models/food");
const User = require("../models/userModel");
const CustomError = require("../models/CustomError");

exports.createFoodEntry = async (req, res, next) => {
  if (!req.body) {
    return next(new CustomError("Body cannot be empty", 400));
  }
  try {
    let insertDate = {
      name: req.body.name,
      calories: req.body.calories,
      creator: req.uid,
    };
    if (req.body.published) {
      insertDate["published"] = req.body.published;
    }
    const food = await Food.create(insertDate);

    //connected foods with the user
    const user = await User.findById(req.uid);

    if (user) {
      const foods = [...user.foods, food.id];
      await user.updateOne({ foods });

      return res.status(201).send({ success: true, food });
    }
  } catch (err) {
    // console.log("error", err);
    next(new CustomError("Something went wrong", 500));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    // console.log("req.user._id", req.user);
    const tut = await Food.aggregate(
      [
        { $match: { creator: req.user._id } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$published" },
            },
            total: {
              $sum: "$calories",
            },
            foodItems: {
              $push: {
                name: "$name",
                calories: "$calories",
                _id: "$_id",
                timeEat: "$published",
              },
            },
          },
        },

        { $sort: { _id: 1 } },
      ],
      function (err, doc) {
        return JSON.stringify(doc);
      }
    );
    return res.status(200).send({ success: true, foodList: tut });
  } catch (err) {
    console.log(err);
    next(new CustomError("Something went wrong", 500));
  }
};
