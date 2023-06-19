import { Delete, Edit } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import Loader from "../Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
const Clients = () => {
  const [id, setId] = useState();
  const [role, setRole] = useState();
  const [client, setClient] = useState([]);
  const [isloading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getEmpClient = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/getemplead/${id}`)
      .then((res) => {
        setLoading(false);
        setClient(res.data.data.filter((e) => e.status === "COMPLETED"));
      });
  };
  const getData = async () => {
    let response = await axios.get(`${process.env.REACT_APP_API}/api/getleads`);

    if (!!response && response.data.success) {
      setLoading(false);
      setClient(response.data.data.filter((e) => e.status === "COMPLETED"));
    }
  };
  useEffect(() => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("auth")).result.token;
    const data = JSON.parse(atob(token.split(".")[1])).admin;
    const id = data._id;
    setId(id);
    setRole(data.role);
    setTimeout(() => {
      if (role === "admin") {
        getData();
      } else if (role === "employee") {
        getEmpClient();
      }
    }, 650);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, role]);
  const onDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/deleteclient/${id}`
      );
      if (res && res.data.success) {
        getData();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
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
      field: "company",
      headerName: "Company",
      headerClassName: "header",
      description: "Company of the associated Client ",
      flex: 1,
    },
    {
      field: "lead",
      headerName: "Lead",
      headerClassName: "header",
      description: "Lead Information",
      flex: 1,
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
          icon={<Delete color={"error"} />}
          label="Delete"
          onClick={() => onDelete(params.row.clientId)}
        />,
        <GridActionsCellItem
          icon={<Edit color="info" />}
          label="Edit"
          onClick={() => navigate(`/editclient/${params.row.clientId}`)}
        />,
      ],
    },
  ];
  const rows = client.map((row, key) => ({
    id: key + 1,
    name: row.firstname + " " + row.lastname,
    email: row.email,
    phone: row.phone,
    company: row.company,
    lead: row.enquiry,
    actions: row.actions,
    clientId: row._id,
  }));
  return (
    <>
      {isloading ? (
        <>
          <Loader />
        </>
      ) : (
        <Grid container padding={2}>
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
            xs={12}
          >
            <Typography
              className="font"
              color="#202c70"
              variant="h3"
              paddingBottom={3}
            >
              Clients
            </Typography>
          </Grid>

          <Grid item lg={12} sm={12} xs={11}>
            {client.length <= 0 ? (
              <div style={{ textAlign: "center", color: "red" }}>
                <h1>* NO CLIENT DATA FOUND...</h1>
              </div>
            ) : (
              <DataGrid
                columns={columns}
                rows={rows}
                initialState={{
                  ...client.initialState,
                  pagination: { paginationModel: { pageSize: 6 } },
                }}
                pageSizeOptions={[6, 20, 30]}
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
export default Clients;
