import { Visibility } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Loader";
const ViewEmp = () => {
  const [viewEmp, setViewEmp] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const [isloading, setLoading] = useState(false);
  const { id } = useParams("");
  const EmpView = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/getemp-details/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setViewEmp(response.data.data);
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
      EmpView();
    }, 650);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {isloading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <Grid container padding={2}>
            <Grid align="center" item lg={4} xs={12} sm={8} md={10} mx="auto">
              <Paper elevation={24} sx={{ padding: "30px" }}>
                <Grid
                  paddingBottom={3}
                  item
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar sx={{ marginRight: "10px", background: "#202c70" }}>
                    <Visibility />
                  </Avatar>
                  <Typography
                    className="font"
                    color={"#202c70"}
                    variant="h4"
                    align="center"
                    fontWeight="bolder"
                  >
                    View Lead
                  </Typography>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      readOnly
                      label="Firstname"
                      placeholder="Enter Your Firstname"
                      name="firstname"
                      fullWidth
                      value={viewEmp.firstname}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      readonly
                      label="Lastname"
                      fullWidth
                      placeholder="Enter Your Lastname"
                      name="lastname"
                      value={viewEmp.lastname}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      readonly
                      label="Email"
                      placeholder="Enter Your Email"
                      fullWidth
                      name="email"
                      value={viewEmp.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      readonly
                      label="Phone Number"
                      placeholder="Enter Your Number"
                      type="number"
                      fullWidth
                      name="phone"
                      value={viewEmp.phone}
                    />
                  </Grid>
                </Grid>
                <Link to="/employees" className="btn-link">
                  <Button
                    variant="contained"
                    sx={{
                      margin: "25px 0 0 0",
                    }}
                  >
                    Back
                  </Button>
                </Link>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};
export default ViewEmp;
