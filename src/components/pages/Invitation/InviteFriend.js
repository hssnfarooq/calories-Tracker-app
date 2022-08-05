/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../../context/UserContext";
import { AuthService, FoodService } from "../../../services";
import ErrorNotice from "../../misc/ErrorNotice";
import moment from "moment";
import DateTimePicker from "react-datetime-picker";
import { useSearchDebounce } from "../../../utills/Helper";
import toast from "react-hot-toast";

export default function InviteFriend({}) {
  const [name, setName] = React.useState("");
  const [localErrors, setLocalErrors] = React.useState({});
  const [error, setError] = useState();
  const { userData, setUserData } = useContext(UserContext);
  const [friendData, setFriendData] = useState({ username: "", email: "" });
  useEffect(() => {
    console.log("userData", userData);
  }, []);
  const validateEmail = () => {
    let isValid = true;
    if (!friendData.email) {
      isValid = false;
      setLocalErrors({
        ...localErrors,
        email: "Please enter your email Address.",
      });
    } else {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(friendData.email)) {
        isValid = false;
        setLocalErrors({
          ...localErrors,
          email: "Please enter valid email address.",
        });
      }
    }
    return isValid;
  };
  const disableButton = () => {
    return !friendData.username || !friendData.email;
  };
  const sendInvite = async (e) => {
    e.preventDefault();
    let isValid = validateEmail();
    console.log("isvalid", isValid);
    if (isValid) {
      try {
        let res = await AuthService.userInvite(friendData);
        setLocalErrors({});
        closeModal();
        toast.success(`invite send on ${friendData.email}`);
      } catch (err) {
        console.log("err", err.response);

        if (err && err?.response?.data?.errors.length > 0) {
          err.response.data.errors.map((e) => {
            toast.error(e.msg);
          });
        } else {
          toast.error("something went wrong");
        }
      }
    }
  };
  const closeModal = () => {
    setUserData({ ...userData, showInviteModal: false });
  };

  return userData.showInviteModal ? (
    <React.Fragment>
      <div className="modal" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Invite a Friend</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => closeModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <label htmlFor="name" className="form-label ">
                  Name
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  id="name"
                  value={friendData.username}
                  onChange={(e) =>
                    setFriendData({ ...friendData, username: e.target.value })
                  }
                />
                <label htmlFor="email" className="form-label ">
                  Email
                </label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  id="email"
                  value={friendData.email}
                  onChange={(e) =>
                    setFriendData({ ...friendData, email: e.target.value })
                  }
                />
                <div className="text-danger">{localErrors.email}</div>
                <br />
                <div style={{ display: "flex" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => closeModal(false)}
                  >
                    Close
                  </button>
                  <button
                    disabled={disableButton()}
                    style={{ marginLeft: "3px" }}
                    className="btn btn-success"
                    onClick={(e) => sendInvite(e)}
                  >
                    <span className="fa fa-paper-plane"></span> Send Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  ) : null;
}
