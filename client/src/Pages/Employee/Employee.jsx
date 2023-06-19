import { Delete, Edit, PersonAddAlt, Visibility } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
const Employee = () => {
  const navigate = useNavigate();
  const [emp, setEmp] = useState([]);
  const [isloading, setLoading] = useState(false);
  const getEmpData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/getemployees`)
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setEmp(response.data.data);
        }
      })
      .catch((error) => {
        if (error?.response.status === 400) {
          return <h1>Data Not Found</h1>;
        }
        if (error?.response.status === 404) {
          console.log("Some Error Occured");
        }
      });
  };
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      getEmpData();
    }, 650);
    localStorage.getItem("auth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onEmpDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/deleteemployee/${id}`
      );
      if (res && res.data.success) {
        getEmpData();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };
  const onDeleteAll = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/delete-all`
      );
      if (res && res.data.success) {
        getEmpData();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };
  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "header",
      description: "ID",
      flex: 0,
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "header",
      description: "Name",
      flex: 1,
      editable: true,
    },

    {
      field: "email",
      headerName: "Email",
      headerClassName: "header",
      description: "Email",
      flex: 1,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      headerClassName: "header",
      description: "Contact",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "header",
      description: "Actions",
      flex: 0,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility color={"primary"} />}
          label="Delete"
          onClick={() => navigate(`/viewemployee/${params.row.empId}`)}
        />,
        <GridActionsCellItem
          icon={<Delete color={"error"} />}
          label="Delete"
          onClick={() => onEmpDelete(params.row.empId)}
        />,
        <GridActionsCellItem
          icon={<Edit color="info" />}
          label="Edit"
          onClick={() => navigate(`/editemployee/${params.row.empId}`)}
        />,
      ],
    },
  ];
  const rows = emp.map((row, key) => ({
    id: key + 1,
    name: row.firstname + " " + row.lastname,
    email: row.email,
    phone: row.phone,
    actions: row.actions,
    empId: row._id,
  }));
  return (
    <>
      {isloading ? (
        <>
          <Loader />
        </>
      ) : (
        <Grid container padding={2}>
          <Typography
            className="font"
            color="#202c70"
            variant="h3"
            paddingBottom={3}
          >
            Employees
          </Typography>
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap-reverse",
            }}
            xs={12}
          >
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={onDeleteAll}
              sx={{ marginBottom: "16px" }}
            >
              Delete All Employees
            </Button>
            <Link to="/addemployee" className="btn-link">
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddAlt />}
                sx={{ marginBottom: "16px" }}
              >
                Add Employee
              </Button>
            </Link>
          </Grid>
          <Grid item lg={12} sm={12} xs={11}>
            {emp.length <= 0 ? (
              <div style={{ textAlign: "center", color: "red" }}>
                <h1>* NO EMPLOYEE DATA FOUND ...</h1>
              </div>
            ) : (
              <DataGrid
                columns={columns}
                rows={rows}
                initialState={{
                  ...emp.initialState,
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[1, 3, 5]}
                sx={{ background: "#a9a9a914" }}
                slots={{ toolbar: GridToolbar }}
              />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};
export default Employee;
