import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { AuthService } from "../../services";

export default function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);

  const history = useHistory();

  const login = () => history.push("/login");
  const logout = async () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");

    // await AuthService.logout();
    history.push("/login");
  };

  return (
    <nav className="auth-options">
      {userData.user ? (
        <button onClick={logout}>Log out</button>
      ) : (
        <React.Fragment>
          <button onClick={login}>Log in</button>
        </React.Fragment>
      )}
    </nav>
  );
}
