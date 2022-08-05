/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { AuthService } from "./services/";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import UserContext from "./context/UserContext";
import { checkLoggedIn } from "./utills/Helper";
//TODO: Private Route remaining
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "font-awesome/css/font-awesome.min.css";

import "./style.css";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import NoMatch from "./components/pages/NoMatch";
import ManageUsers from "./components/pages/admin/ManageUsers";
import InviteFriend from "./components/pages/Invitation/InviteFriend";

import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [userData, setUserData] = useState({
    token: localStorage.getItem("auth-token"),
    user: undefined,
    showInviteModal: false,
  });

  useEffect(() => {
    const userInfo = async () => {
      try {
        const tokenRes = await checkLoggedIn();
        console.log("tokenRes", tokenRes);
        if (tokenRes) {
          if (!tokenRes) {
            console.log("userRes.token", tokenRes);
            toast.error("you are not authorized");
          }
          const userRes = await AuthService.retrieveUser();
          // console.log("line 31", userRes);
          if (userRes) {
            setUserData({
              ...userData,
              tokenRes,
              user: userRes.data.userInfo,
            });
          } else {
            localStorage.setItem("auth-token", "");
          }
        }
      } catch (error) {
        toast.error("session expired");
        // history.pushState("/login");
      }
    };
    userInfo();
    // }, 0);
  }, []);

  // console.log("userData ==>", userData);
  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
          <Header />
          <div>
            <Toaster />
          </div>
          <div className="container">
            <InviteFriend />
            <Switch>
              {/*
               <Route exact path="/" component={Home} /> */}

              <PrivateRoute exact path="/" redirectTo="/login" isAdmin={false}>
                <Home />
              </PrivateRoute>
              <PrivateRoute
                exact
                path="/manage-users"
                redirectTo="/404"
                isAdmin={true}
              >
                <ManageUsers />
              </PrivateRoute>
              <PublicRoute
                path="/login"
                redirectTo="/"
                exact
                // component={Login}
              >
                <Login />
              </PublicRoute>
              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
          </div>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}
