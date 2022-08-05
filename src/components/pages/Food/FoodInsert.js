/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import UserContext from "../../../context/UserContext";
import { FoodService } from "../../../services/";
import Autocomplete from "./Autocomplete";
import ErrorNotice from "../../misc/ErrorNotice";
import moment from "moment";
import DateTimePicker from "react-datetime-picker";
import { useSearchDebounce } from "../../../utills/Helper";

export default function FoodInsert({
  saveFood,
  closeModal,
  isEditMode,
  calledBy,
  usersList,
  FoodDetail,
}) {
  const [name, setName] = React.useState("");
  const [error, setError] = useState();
  const [dateChange, onDateChange] = React.useState(new Date());
  const [calories, setCalories] = React.useState(0);
  const [display, setDisplay] = React.useState(false);
  const [UsersInput, setUsersInput] = React.useState(false);
  const [productName, setProductName] = React.useState("");
  const [creator, setcreator] = React.useState("");
  const [search, setSearch] = useSearchDebounce();

  const setDetail = (value) => {
    // console.log("sele", value);
    setProductName(value);
    setDisplay(false);
    setName(value.food_name);
    setCalories(Math.round(value.nf_calories));
  };
  const saveFoodData = (e) => {
    e.preventDefault();
    if (productName) {
      saveFood({ name, calories, dateChange, creator });
    } else {
      setError("please input all values");
    }
  };
  const disableButton = () => {
    if (!isEditMode && calledBy === "admin") {
      return !name || !productName || !dateChange || !creator;
    }
    return !productName || !dateChange || !name;
  };
  useEffect(() => {
    if (isEditMode && calledBy === "admin") {
      console.log("yes edit mode", FoodDetail);
      setName(FoodDetail.name);
      setProductName(FoodDetail.name);
      setCalories(FoodDetail.calories);
      onDateChange(new Date(FoodDetail.published));
    }
    if (!isEditMode && calledBy === "admin") {
      setUsersInput(true);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="modal" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditMode ? "Edit" : "New"} Food Entry
              </h5>
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
                {error && (
                  <ErrorNotice
                    message={error}
                    clearError={() => setError(undefined)}
                  />
                )}
                <label htmlFor="product_name" className="form-label ">
                  Food Name
                </label>
                <input
                  id="product_name"
                  name="product_name"
                  value={name}
                  onChange={(e) => {
                    setDisplay(true);
                    setName(e.target.value);
                    setSearch(e.target.value);
                  }}
                  className="form-control"
                  placeholder="Apple"
                />
                {display && search && (
                  <Autocomplete search={search} onClickItem={setDetail} />
                )}
                <label htmlFor="calories" className="form-label">
                  Calories
                </label>
                <input
                  id="calories"
                  type="number"
                  value={name ? calories : 0}
                  className="form-control"
                  name="calories"
                  disabled={true}
                  placeholder="Doe"
                />
                {UsersInput && (
                  <React.Fragment>
                    <label htmlFor="user" className="form-label">
                      Taken By
                    </label>
                    <select
                      id="user"
                      value={creator}
                      className="form-control"
                      name="user"
                      onChange={(e) => setcreator(e.target.value)}
                    >
                      <option value="">Select User</option>
                      {usersList.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </React.Fragment>
                )}
                <label className="form-label">Date in-take</label>
                <DateTimePicker
                  disableClock={true}
                  onChange={onDateChange}
                  maxDate={new Date()}
                  clearIcon={null}
                  value={dateChange}
                  className="form-control"
                />
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
                  {/* <button type="submit">Submit</button> */}
                  <button
                    // type="submit"
                    disabled={disableButton()}
                    style={{ marginLeft: "3px" }}
                    // className={btn {(!productName || !dateChange) ? }
                    className="btn btn-success"
                    onClick={(e) => saveFoodData(e)}
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
