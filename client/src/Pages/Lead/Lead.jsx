import {
  Clear,
  Delete,
  DoneAllOutlined,
  Edit,
  Pending,
  PersonAddAlt,
  Visibility,
} from "@mui/icons-material";
import { Button, Chip, Grid, Typography } from "@mui/material";
import Loader from "../Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  DataGrid,
  GridActionsCellItem,
  GridMenuIcon,
  GridToolbar,
} from "@mui/x-data-grid";
const Lead = () => {
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [role, setRole] = useState();
  const [lead, setLead] = useState([]);
  const [isloading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [checkboxSelection, setCheckboxSelection] = useState(false);
  const getEmpLead = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/getemplead/${id}`)
      .then((res) => {
        setLoading(false);
        setLead(res.data.data);
      });
  };
  const getLeadData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/getleads`)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setLead(response.data.data);
        }
      })
      .catch((error) => {
        if (error?.response.status === 400) {
          return <h1>Data Not Found</h1>;
        }
        if (error?.response.status === 404) {
          console.log(error.response.data.message);
        }
      });
  };
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth")).result.token;
    const data = JSON.parse(atob(token.split(".")[1])).admin;
    const id = data._id;
    setId(id);
    setRole(data.role);
    setLoading(true);
    setTimeout(() => {
      if (role === "admin") {
        getLeadData();
      } else if (role === "employee") {
        getEmpLead();
      }
    }, 650);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, role]);
  const onLeadDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/deletelead/${id}`
      );
      if (res && res.data.success) {
        getLeadData();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // const onDeleteAll = async () => {
  //   try {
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_API}/api/delete-all`
  //     );
  //     if (res && res.data.success) {
  //       getLeadData();
  //       toast.success(res.data.message);
  //     } else {
  //       toast.error(res.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.data.message);
  //   }
  // };
  const onDeleteSelectedRow = async () => {
    const uData = lead.filter((e, index) => selectedFile.includes(index + 1));
    const Data = uData.map((element) => {
      return element._id;
    });
    const body = Data;
    const res = await axios.post(
      `${process.env.REACT_APP_API}/api/deleteselectedIds`,
      body
    );
    if (res && res.data.success) {
      getLeadData();
      setCheckboxSelection(false);
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };
  const onRowUpdate = async (newRowLead) => {
    try {
      if (!newRowLead.email) {
        toast.error("Please Enter Email");
        return;
      }
      if (!newRowLead.phone) {
        toast.error("Please Enter Phone Number");
        return;
      }
      if (!newRowLead.lead) {
        toast.error("Please Enter Lead");
        return;
      }
      if (!newRowLead.assign) {
        toast.error("Please Assign to any Employee");
        return;
      }
      if (!newRowLead.status) {
        toast.error("Please Enter Status of Lead");
        return;
      }
      const body = {
        firstname: newRowLead.name.split(" ").slice(0, -1).join(" "),
        lastname: newRowLead.name.split(" ").slice(-1).join(" "),
        email: newRowLead.email,
        phone: newRowLead.phone,
        company: newRowLead.company,
        enquiry: newRowLead.lead,
        assign: newRowLead.assign,
        status: newRowLead.status,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/updatelead/${newRowLead.leadId}`,
        body
      );
      if (res && res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    const updatedRow = { ...newRowLead };
    return updatedRow;
  };
  const adminColumns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "header",
      description: "ID",
      flex: 0,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "header",
      description: "Name",
      flex: 0.8,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "header",
      description: "Email",
      flex: 1.2,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      headerClassName: "header",
      description: "Contact",
      flex: 0.8,
      editable: true,
    },
    {
      field: "employeename",
      headerName: "Assign",
      headerClassName: "header",
      description: "Assigned to particular Employee",
      flex: 0.8,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "header",
      description: "Status of the Lead",
      flex: 1.2,
      renderCell: (params) => {
        return (
          <Chip
            icon={
              params.row.status === "PENDING" ? (
                <Pending />
              ) : params.row.status === "COMPLETED" ? (
                <DoneAllOutlined />
              ) : params.row.status === "REJECTED" ? (
                <Clear />
              ) : (
                ""
              )
            }
            label={params.row.status}
            variant={"contained"}
            size="medium"
            sx={{ width: "130px" }}
            className={
              params.row.status === "PENDING"
                ? "pending"
                : params.row.status === "COMPLETED"
                ? "accepted"
                : params.row.status === "REJECTED"
                ? "rejected"
                : ""
            }
            color="info"
          />
        );
      },
    },
    {
      field: "lead",
      headerName: "Lead",
      headerClassName: "header",
      description: "Lead Information",
      flex: 1.3,
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
          label="View"
          onClick={() => navigate(`/viewlead/${params.row.leadId}`)}
        />,
        <GridActionsCellItem
          icon={<Delete sx={{ color: "#dc3535cc !important" }} />}
          label="Delete"
          onClick={() => onLeadDelete(params.row.leadId)}
        />,
        <GridActionsCellItem
          icon={<Edit color="info" />}
          label="Edit"
          onClick={() => navigate(`/editlead/${params.row.leadId}`)}
        />,
      ],
    },
  ];
  const employeeColumns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "header",
      description: "ID",
      flex: 0,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "header",
      description: "Name",
      flex: 0.8,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "header",
      description: "Email",
      flex: 1.2,
      editable: false,
    },
    {
      field: "phone",
      headerName: "Phone",
      headerClassName: "header",
      description: "Contact",
      flex: 0.8,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "header",
      description: "Status of the Lead",
      flex: 1.2,
      renderCell: (params) => {
        return (
          <Chip
            icon={
              params.row.status === "PENDING" ? (
                <Pending />
              ) : params.row.status === "COMPLETED" ? (
                <DoneAllOutlined />
              ) : params.row.status === "REJECTED" ? (
                <Clear />
              ) : (
                ""
              )
            }
            label={params.row.status}
            variant={"contained"}
            size="medium"
            sx={{ width: "130px" }}
            className={
              params.row.status === "PENDING"
                ? "pending"
                : params.row.status === "COMPLETED"
                ? "accepted"
                : params.row.status === "REJECTED"
                ? "rejected"
                : ""
            }
            color="info"
          />
        );
      },
    },
    {
      field: "lead",
      headerName: "Lead",
      headerClassName: "header",
      description: "Lead Information",
      flex: 1.3,
      editable: false,
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
          label="View"
          onClick={() => navigate(`/viewlead/${params.row.leadId}`)}
        />,
        <GridActionsCellItem
          icon={<Edit color="info" />}
          label="Edit"
          onClick={() => navigate(`/editlead/${params.row.leadId}`)}
        />,
      ],
    },
  ];
  const rows = lead.map((row, key) => ({
    id: key + 1,
    name: row.firstname + " " + row.lastname,
    email: row.email,
    phone: row.phone,
    assign: row.assign,
    employeename: row.employeename,
    status: row.status,
    actions: row.actions,
    lead: row.enquiry,
    leadId: row._id,
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
              Leads
            </Typography>
            {role === "admin" ? (
              <>
                <Grid
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    flexWrap: "wrap-reverse",
                  }}
                >
                  {/* <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={onDeleteAll}
                    sx={{
                      mb: 3,
                    }}
                  >
                    Delete All Leads
                  </Button> */}
                  <Link to={"/addlead"}>
                    <Button
                      variant="contained"
                      startIcon={<PersonAddAlt />}
                      sx={{ mb: 3 }}
                    >
                      Add Lead
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    sx={{
                      mb: 3,
                      marginLeft: "12px",
                    }}
                    onClick={onDeleteSelectedRow}
                  >
                    Delete Selected Lead
                  </Button>
                </Grid>
              </>
            ) : null}
          </Grid>

          <Grid item lg={12} sm={12} xs={11}>
            <GridMenuIcon
              sx={{ mb: 0 }}
              variant="contained"
              color="inherit"
              onClick={() => setCheckboxSelection(!checkboxSelection)}
            />
            <DataGrid
              rows={rows}
              columns={
                role === "admin"
                  ? adminColumns
                  : role === "employee"
                  ? employeeColumns
                  : []
              }
              autoHeight
              slots={{ toolbar: GridToolbar }}
              sx={{ background: "#a9a9a942" }}
              initialState={{
                ...lead.initialState,
                pagination: { paginationModel: { pageSize: 7 } },
              }}
              pageSizeOptions={[7, 20, 30]}
              processRowUpdate={onRowUpdate}
              experimentalFeatures={{ newEditingApi: true }}
              checkboxSelection={checkboxSelection}
              onRowSelectionModelChange={(selectionModel) => {
                setSelectedFile(selectionModel);
              }}
              disableSelectionOnClick={checkboxSelection}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};
export default Lead;
