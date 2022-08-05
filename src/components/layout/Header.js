import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../../context/UserContext";
import AuthOptions from "../auth/AuthOptions";

export default function Header() {
  const { userData, setUserData } = useContext(UserContext);

  const showInvite = () => {
    setUserData({ ...userData, showInviteModal: true });
  };
  return (
    <header id="header">
      <Link to="/">
        <h1 className="title">Calories Tracking App</h1>
      </Link>
      {userData.user && (
        <div className="navItemStyle">
          <NavLink to="/">Home</NavLink>
          {userData.user.role === "admin" && (
            <NavLink to="/manage-users">Manage Users</NavLink>
          )}
          <button className="btn btn-success brn-sm" onClick={showInvite}>
            Invite Friend
          </button>
        </div>
      )}
      {/* <Link to="/manage-users">ManageUsers</Link> */}
      <AuthOptions />
    </header>
  );
}
