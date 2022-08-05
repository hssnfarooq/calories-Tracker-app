/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import SweetAlert from "react-bootstrap-sweetalert";
import UserContext from "../../../context/UserContext";
import AdminService from "../../../services/adminService";
import moment from "moment";
import FoodInsert from "../Food/FoodInsert";
import toast from "react-hot-toast";
export default function ManageUsers() {
  const { userData } = useContext(UserContext);
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);
  const [allUsers, setAllUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loadModal, setLoadModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFoodDetail, setEditFoodDetail] = useState(null);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [editRecordId, setEditRecordId] = useState(null);
  const countPerPage = 5;
  const columns = [
    {
      name: "Food Name",
      cell: (row) => <span width="30px">{row.name}</span>,
    },
    {
      name: "Calories Contain",
      selector: "calories",
    },
    {
      name: "date intake",
      // selector: "published",
      cell: (row) => {
        return moment(row.published).format("YYYY MM DD  hh:mm a");
      },
    },
    {
      name: "Eaten By",
      selector: "creator.username",
    },
    {
      name: (
        <button className="btn btn-success btn-sm" onClick={() => addFood()}>
          New Entry
        </button>
      ),
      cell: (row) => {
        return (
          <div style={{ justifyContent: "space-between" }}>
            <span
              className="fa fa-pencil"
              onClick={() => editUserEntry(row)}
            ></span>
            <span
              className="fa fa-trash"
              style={{ marginLeft: "10px" }}
              onClick={() => deleteUserEntry(row._id)}
            ></span>
          </div>
        );
      },
    },
  ];
  const getFoodList = async () => {
    try {
      let res = await AdminService.adminFoodList(page - 1, countPerPage);
      console.log("first response", res);
      setData(res.data);
    } catch (error) {
      setData({});
    }
  };

  const editUserEntry = (record) => {
    setEditFoodDetail(record);
    setEditRecordId(record._id);
    setIsEditMode(true);
    setLoadModal(true);
  };
  const updateFood = async (data) => {
    try {
      console.log("inside update", data);
      let reqData = { ...data, published: data.dateChange };
      delete reqData._id;
      delete reqData.dateChange;
      delete reqData.creator;
      let resp = await AdminService.adminEditFood(editRecordId, reqData);
      setLoadModal(false);
      setEditRecordId(null);
      getFoodList();
      toast.success("Food Entry Updated Successfully");
      // console.log("update resp", resp);
    } catch (err) {
      console.log("error update", err.message);
      toast.error(err.message);
    }
  };
  const saveFood = async (data) => {
    try {
      let reqData = { ...data, published: data.dateChange };
      console.log("save by admin", reqData);
      // delete reqData._id;
      // delete reqData.dateChange;
      await AdminService.newFoodEntryByAdmin(reqData);
      setLoadModal(false);
      getFoodList();
      toast.success("Food Entry Added Successfully");
      // console.log("resp", resp);
    } catch (err) {
      // console.log("error save", err.message);
      toast.error(err.message);
    }
  };
  const deleteUserEntry = (id) => {
    setDeleteRecordId(id);
    setShowAlert(true);
  };
  const addFood = async () => {
    setLoadModal(true);
    let user = await AdminService.allUsersList();
    console.log("user Liust", user);
    setAllUsers(user.data.usersList);
  };
  const handleDeleteAlert = async (resp) => {
    console.log("resp", resp);
    setShowAlert(false);
    await AdminService.adminDeleteFood(deleteRecordId);
    getFoodList();
    toast.success("Food Entry Deleted Successfully");
    // setDeleteRecordId(id);
  };
  const cancelDeleteAlert = () => {
    // console.log("resp", );
    setDeleteRecordId(null);
    setShowAlert(false);
  };

  useEffect(() => {
    getFoodList();
  }, [page]);

  return (
    <div className="page">
      <DataTable
        title={`All Added Food Entries      
`}
        columns={columns}
        data={data.data}
        highlightOnHover
        pagination
        paginationServer
        paginationTotalRows={data.total}
        paginationPerPage={countPerPage}
        paginationComponentOptions={{
          noRowsPerPage: true,
        }}
        onChangePage={(page) => setPage(page)}
      />
      <SweetAlert
        show={showAlert}
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        confirmButtonColor="#449c44d7"
        onConfirm={handleDeleteAlert}
        onCancel={cancelDeleteAlert}
      />
      {loadModal && (
        <FoodInsert
          closeModal={setLoadModal}
          isEditMode={isEditMode}
          calledBy={"admin"}
          FoodDetail={editFoodDetail}
          saveFood={isEditMode ? updateFood : saveFood}
          usersList={allUsers}
        />
      )}
    </div>
  );
}
