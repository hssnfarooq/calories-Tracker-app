import Axios from "axios";
import ErrorNotice from "../components/misc/ErrorNotice";
import { USERINFO, LOGIN, LOGOUT, INVITATION } from "../urls/APIURLS";

const AuthService = {
  _url: process.env.API_URL,
  _token: localStorage.getItem("auth-token"),
  async login(loginUser) {
    // console.log("auth service login responding", loginUser);
    return await Axios.post(LOGIN, loginUser);
  },
  async userInvite(userInfo) {
    // console.log("auth service login responding", loginUser);
    return await Axios.post(INVITATION, userInfo, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    });
  },
  async logout() {
    // console.log(localStorage.getItem("auth-token"));
    await Axios.get(LOGOUT, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    });
    // return Promise.resolve().then(() => {
    localStorage.clear();

    return true;
    // });
  },

  async retrieveUser() {
    try {
      return await Axios.get(USERINFO, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });
    } catch (error) {
      // return error;
    }
  },
};

export default AuthService;
