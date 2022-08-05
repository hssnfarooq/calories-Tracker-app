const base_url = process.env.REACT_APP_API_URL;
// const base_url = process.env.API_URL;
// process.env.API_URL;
// console.log("process.env.API_URL", process.env.API_URL);
export const USERINFO = base_url + "/user/userInfo";
export const LOGIN = base_url + "/user/login";
export const INVITATION = base_url + "/user/friendInvite";
export const LOGOUT = base_url + "/user/logout";
export const FOODLIST = base_url + "/food/";
export const NEWFOODENTRY = base_url + "/food/new";
export const ADMINSTATS = base_url + "/admin/";
export const ADMINUSERSLIST = base_url + "/admin/allUsers";
export const ADMINEDITFOOD = base_url + "/admin/edit";
export const ADMINADDFOOD = base_url + "/admin/new";
export const ADMINFOODLIST = base_url + "/admin/foodList";
export const ADMINDELETEFOODENTRY = base_url + "/admin/deleteFood";

export const Nutritionix =
  "https://trackapi.nutritionix.com/v2/search/instant?branded=true&common=false&self=false&query=";
