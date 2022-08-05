/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";
import { AuthService } from "../../services/";
import { useEffect } from "react";
// import AuthService from "./services/authService";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState([]);
  const [localErrors, setLocalErrors] = useState({});
  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();
  const store_token = localStorage.getItem("auth-token");

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (validateEmail()) {
        setLocalErrors({});
        const loginUser = { email, password };
        const loginRes = await AuthService.login(loginUser);
        // console.log("first", loginRes);

        setUserData({
          ...userData,
          token: loginRes.data.accessToken,
          user: loginRes.data.user,
        });
        localStorage.setItem("auth-token", loginRes.data.accessToken);
        history.push("/");
      }
    } catch (err) {
      console.log("err", err.response);
      if (err && err?.response?.data?.errors.length > 0) {
        setError(err.response.data.errors);
      } else {
        setError([{ msg: "somerthing went wrong" }]);
      }
    }
  };
  const validateEmail = () => {
    let isValid = true;
    if (!email) {
      isValid = false;
      setLocalErrors({
        ...localErrors,
        email: "Please enter your email Address.",
      });
    } else {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(email)) {
        isValid = false;
        setLocalErrors({
          ...localErrors,
          email: "Please enter valid email address.",
        });
      }
    }
    if (!password) {
      isValid = false;
      setLocalErrors({
        ...localErrors,
        password: "Please enter your password.",
      });
    }
    return isValid;
  };
  return !store_token ? (
    <div className="page">
      <h2>Log in</h2>

      {error.length > 0 && <ErrorNotice message={error} />}
      <form className="form" onSubmit={submit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="text-danger">{localErrors.email}</div>
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-danger">{localErrors.password}</div>
        <input type="submit" value="Log in" />
      </form>
    </div>
  ) : null;
}
