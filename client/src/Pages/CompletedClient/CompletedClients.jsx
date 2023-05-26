import { Delete, Edit } from "@mui/icons-material";
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Loader from "../Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

    if (response.status === 200) {
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
              <TableContainer
                component={Paper}
                sx={{ overflow: "auto", maxHeight: "74vh" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Id
                      </TableCell>
                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Name
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Phone
                      </TableCell>
                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Company{" "}
                      </TableCell>

                      {role === "admin" ? (
                        <>
                          {/* <TableCell
                            sx={{
                              background: "black",
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            Assign to
                          </TableCell> */}
                          <TableCell
                            sx={{
                              background: "black",
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            Actions
                          </TableCell>
                        </>
                      ) : null}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {client.map((row, key) => (
                      <TableRow key={key}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {key + 1}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {row.firstname} {row.lastname}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {row.email}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {row.phone}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {row.company}
                        </TableCell>

                        {role === "admin" ? (
                          <>
                            {/* <TableCell sx={{ textAlign: "center" }}>
                              {row.employeename}
                            </TableCell> */}
                            <TableCell
                              align="center"
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <IconButton
                                aria-label="edit"
                                color="info"
                                onClick={() =>
                                  navigate(`/editclient/${row._id}`)
                                }
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                color="error"
                                onClick={() => onDelete(row._id)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </>
                        ) : null}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Clients;
