// import validateEmail from "../utils/validateEmail";
import { FOODLIST, NEWFOODENTRY, Nutritionix } from "../urls/APIURLS";
import Axios from "axios";

const FoodService = {
  _url: process.env.REACT_APP_API_URL,
  _nutritionixid: process.env.REACT_APP_Nutritionix_APP_ID,
  _nutritionixkey: process.env.REACT_APP_Nutritionix_API_KEY,
  _token: localStorage.getItem("auth-token"),

  async retrieveFoodList() {
    // console.log("get food token", this._token);
    // console.log("Direct  token", localStorage.getItem("auth-token"));
    return await Axios.get(FOODLIST, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    });
  },

  async saveFood(foodDetail) {
    // console.log("foodDetail service login responding", foodDetail);
    return await Axios.post(NEWFOODENTRY, foodDetail, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    });
  },
  async retrieveNutriotionItems(item) {
    // console.log("18", process.env);
    return await Axios.get(`${Nutritionix}${item}`, {
      headers: {
        "x-app-key": `${this._nutritionixkey}`,
        "x-app-id": `${this._nutritionixid}`,
      },
    });
  },
};

export default FoodService;
