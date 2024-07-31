import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import axios from "axios";
import Swal from "sweetalert2";
import LinearProgress from "@mui/material/LinearProgress";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const SignUP = ({ open, setOpen }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordCnf, setShowPasswordCnf] = React.useState(false);
  const [updatedFormData, setUpdateFormData] = useState({});
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const apiUrl = process.env.REACT_APP_MAIN_URL;

  const handleClose = () => {
    setOpen(false);
    setUpdateFormData({
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError(null);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPasswordCnf = () => setShowPasswordCnf((show) => !show);
  const handleMouseDownPasswordCnf = (event) => {
    event.preventDefault();
  };

  const profileFormData = (name, value) => {
    setUpdateFormData({ ...updatedFormData, [name]: value });
  };

  const signUp = async (e) => {
    e.preventDefault();
    setLoader(true)
    await axios
      .post(`${apiUrl}/signup`, updatedFormData)
      .then((res) => {
        setLoader(false)
        setUpdateFormData({
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setError(null);
        Swal.fire({
          title: "Good job",
          text: "SignUp successfully",
          icon: "success",
        });

        setOpen(false);
      })
      .catch((err) => {
        setLoader(false)
        setError(err.response.data.message);
        console.log(err.response.data.message);
      });
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <h2 className="text-3xl font-bold">Sign Up</h2>
            <div className="mt-5 flex flex-col gap-2">
              <TextField
                id="outlined-basic"
                label="firstName"
                variant="standard"
                sx={{ width: "100%" }}
                value={updatedFormData.firstName}
                onChange={(e) => profileFormData("firstName", e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="lastName"
                variant="standard"
                sx={{ width: "100%" }}
                value={updatedFormData.lastName}
                onChange={(e) => profileFormData("lastName", e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="userName"
                variant="standard"
                sx={{ width: "100%" }}
                value={updatedFormData.userName}
                onChange={(e) => profileFormData("userName", e.target.value)}
              />
              <TextField
                id="outlined-basic"
                type="email"
                label="email"
                variant="standard"
                sx={{ width: "100%" }}
                value={updatedFormData.email}
                onChange={(e) => profileFormData("email", e.target.value)}
              />
              <Input
                id="standard-adornment-password"
                sx={{ padding: "0.5rem", width: "100%" }}
                type={showPassword ? "text" : "password"}
                placeholder="enter your password"
                value={updatedFormData.password}
                onChange={(e) => profileFormData("password", e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Input
                id="standard-adornment-password"
                sx={{ padding: "0.5rem", width: "100%" }}
                type={showPasswordCnf ? "text" : "password"}
                placeholder="enter your confirmPassword"
                value={updatedFormData.confirmPassword}
                onChange={(e) =>
                  profileFormData("confirmPassword", e.target.value)
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordCnf}
                      onMouseDown={handleMouseDownPasswordCnf}
                    >
                      {showPasswordCnf ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          </DialogContentText>
        </DialogContent>
        {error && <p className="text-red-600 px-5"> {error}</p>}
        {loader ? (
          <LinearProgress />
        ) : (
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={signUp}>Sign Up</Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

export default SignUP;
