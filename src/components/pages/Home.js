/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Button,
  Link as fabLink,
} from "react-floating-action-button";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { FoodService } from "../../services/";
import ErrorNotice from "../misc/ErrorNotice";
import FoodInsert from "./Food/FoodInsert";
import moment from "moment";
import Report from "./admin/Report";
import toast from "react-hot-toast";

export default function Home() {
  const { userData } = useContext(UserContext);
  const caloriesLimit = process.env.REACT_APP_Calories_Threshold;
  const [error, setError] = useState();
  const [saveData, setSaveData] = useState(false);
  const [loadModal, setLoadModal] = useState(false);

  const [foodList, setFoodList] = useState([]);
  const foodListCall = async () => {
    console.log("food list call");
    try {
      let resp = await FoodService.retrieveFoodList();
      // console.log(resp.data);
      setFoodList(resp.data.foodList);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    if (userData.user && userData.user.role === "user") {
      foodListCall();
    } else {
    }
  }, [userData.user]);

  const saveFood = async ({ name, calories, dateChange }) => {
    try {
      let resp = await FoodService.saveFood({
        name,
        calories,
        published: dateChange,
      });
      foodListCall();
      setLoadModal(false);
      toast.success("Food Entry Added Successfully");
    } catch (err) {
      toast.error(err.message);
    }

    // console.log("nutrition", resp);
  };

  const onClickHandler = (e) => {
    const hiddenElement = e.currentTarget.nextSibling;
    hiddenElement.className.indexOf("collapse show") > -1
      ? hiddenElement.classList.remove("show")
      : hiddenElement.classList.add("show");
  };

  return (
    <div className="page">
      {userData.user && userData.user.role === "user" && (
        <React.Fragment>
          <h1>Welcome {userData.user.username}</h1>
          <div className="col-md-12">
            {error && (
              <ErrorNotice
                message={error}
                clearError={() => setError(undefined)}
              />
            )}
            {loadModal && (
              <FoodInsert
                closeModal={setLoadModal}
                saveFood={saveFood}
                foodList={foodList}
              />
            )}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Date</th>
                  <th scope="col">Calories consumed</th>
                  {/* <th scope="col">Date in-take</th> */}
                </tr>
              </thead>
              <tbody>
                {foodList.length > 0 ? (
                  foodList.map((foodItem, index) => (
                    <React.Fragment key={Math.random()}>
                      <tr
                        onClick={onClickHandler}
                        className={`${
                          foodItem.total >= caloriesLimit
                            ? "calories_extend"
                            : ""
                        }`}
                      >
                        <th scope="row">{index + 1}</th>
                        <td>{foodItem._id}</td>
                        <td>
                          {foodItem.total}{" "}
                          {foodItem.total >= caloriesLimit && (
                            <span
                              className="fa-info-circle fa"
                              data-bs-toggle="tooltip"
                              data-bs-placement="right"
                              // title={`you have crossed the maximum limit of ${caloriesLimit} calories per day`}
                              title={`you have consumed ${
                                foodItem.total - caloriesLimit
                              } more calories for today`}
                            ></span>
                          )}
                        </td>
                        {/* <td>
                          {moment(foodItem.published).format("Do MMMM YYYY")}
                        </td> */}
                      </tr>
                      {/* <div className=""> */}
                      <tr className="collapse">
                        <table className="table ">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">product Name</th>
                              <th scope="col">Calories</th>
                              <th scope="col">Time in-take</th>
                            </tr>
                          </thead>
                          <tbody>
                            {foodItem.foodItems.map((subitem, subIndex) => (
                              <tr key={Math.random()}>
                                <React.Fragment>
                                  <td>{subIndex + 1}</td>
                                  <td>{subitem.name}</td>
                                  <td>{subitem.calories}</td>
                                  <td>
                                    {moment(subitem.timeEat).format("hh:mm a")}
                                  </td>
                                </React.Fragment>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    {/* <th scope="row"> </th> */}
                    <th rowSpan={4}>No Item Found</th>
                  </tr>
                )}
              </tbody>
            </table>
            <Container>
              <Button
                tooltip="Add New Food Item"
                icon="fa fa-plus"
                styles={{ backgroundColor: "#449c44d7", color: "#ffffff" }}
                key={"hdd"}
                rotate={false}
                onClick={() => setLoadModal(true)}
              />
            </Container>
          </div>
        </React.Fragment>
      )}
      {userData.user && userData.user.role === "admin" && <Report />}
    </div>
  );
}
