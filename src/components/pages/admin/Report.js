/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Button,
  Link as fabLink,
} from "react-floating-action-button";
import { Link } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import { FoodService } from "../../../services";
import AdminService from "../../../services/adminService";
// import UserContext from "../../context/UserContext";
// import { FoodService } from "../../services/";
// import ErrorNotice from "../misc/ErrorNotice";
// import FoodInsert from "./Food/FoodInsert";
// import moment from "moment";
export default function Report() {
  const { userData } = useContext(UserContext);
  const caloriesLimit = process.env.REACT_APP_Calories_Threshold;
  const [error, setError] = useState();
  const [saveData, setSaveData] = useState(false);
  const [perUserAvg, setPerUserAvg] = useState(0);
  const [currentWeekEntries, setCurrentWeekEntries] = useState(0);
  const [beforeCurrentWeekEntries, setBeforeCurrentWeekEntries] = useState(0);
  const [foodList, setFoodList] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function userStatsCall() {
    try {
      let resp = await AdminService.retrieveStats();
      console.log(resp.data.perUserSum);
      setBeforeCurrentWeekEntries(resp.data.BeforeCurrentWeek);
      setCurrentWeekEntries(resp.data.entriesCurrentWeek);
      moldUserAverageCalories(resp.data.perUserSum);
      // setFoodList(resp.data.perUserSum);
    } catch (err) {
      setError(err.message);
    }
  }
  const moldUserAverageCalories = (data) => {
    let sum = 0;
    let total = data.map((item) => (sum += item.total));
    setPerUserAvg(sum / data.length);
    console.log(sum, "total");
  };
  useEffect(() => {
    userStatsCall();
  }, []);

  const saveFood = async ({ name, calories, dateChange }) => {
    try {
      let resp = await FoodService.saveFood({
        name,
        calories,
        published: dateChange,
      });
      userStatsCall();
      // setSaveData(true);
      // closeModal(false);
      // setLoadModal(false);
    } catch (error) {}

    // console.log("nutrition", resp);
  };

  return (
    <div className="row">
      <div className="col-sm-4">
        <div className="card bg-green">
          <div className="card-body">
            <h5 className="card-title">{perUserAvg}</h5>
            <p className="card-text">
              The average number of calories added per user for the last 7 days
            </p>
            {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
          </div>
        </div>
      </div>
      <div className="col-sm-4">
        <div className="card bg-green">
          <div className="card-body">
            <h5 className="card-title">{currentWeekEntries}</h5>
            <p className="card-text">
              Number of added entries in the last 7 days
            </p>
          </div>
        </div>
      </div>
      <div className="col-sm-4">
        <div className="card bg-green">
          <div className="card-body">
            <h5 className="card-title">{beforeCurrentWeekEntries}</h5>
            <p className="card-text">added entries the week before</p>
          </div>
        </div>
      </div>
    </div>
  );
}
