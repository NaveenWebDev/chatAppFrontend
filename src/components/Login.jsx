import React, { useState } from "react";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SignUP from "./SignUP";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [updatedFormData, setUpdateFormData] = useState({});
  const [error, setError] = useState("");

  const apiUrl = process.env.REACT_APP_MAIN_URL;

  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const profileFormData = (name, value) => {
    setUpdateFormData({ ...updatedFormData, [name]: value });
  };

  const login = async (e) => {
    e.preventDefault();

    await axios
      .post(`${apiUrl}/login`, updatedFormData)
      .then((res) => {
        localStorage.setItem("userData", JSON.stringify(res?.data?.result?.user))
        localStorage.setItem("token", JSON.stringify(res?.data?.result?.token))

        setError(null);

        setUpdateFormData({
          email: "",
          password: "",
        });
        navigate("/")
      })
      .catch((err) => {
        setError(err.response.data.message);
        console.log(err.response.data.message);
      });
  };

  return (
    <>
    <div className="bg-gray-700">
      <div className="max-w-[1200px] w-[90%] m-auto h-screen">
        <div className="flex flex-col md:flex-row h-full items-center justify-center">
          <div className="w-full md:w-[50%]">
            <h2
              style={{ textShadow: "0 0 30px gray" }}
              className="text-5xl text-white font-bold text-center"
            >
              Welcome to Our Chat Application
            </h2>
          </div>
          <div className="w-full md:w-[50%] p-10">
            <form
              className="border rounded-lg p-5 shadow-2xl shadow-indigo-200 bg-slate-100"
              onSubmit={login}
            >
              <div className="flex gap-2 flex-col justify-center items-center">
                <TextField
                  id="standard-basic"
                  placeholder="Email"
                  variant="standard"
                  type="email"
                  sx={{ padding: "0.5rem", width: "100%" }}
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
                {error && <p className="text-red-600">{error}</p>}
                <Button
                  variant="outlined"
                  type="submit"
                  sx={{ margin: "0.5rem", width: "100%", padding: "0.5rem" }}
                >
                  Log In
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClickOpen}
                  sx={{ margin: "0.5rem", padding: "0.5rem" }}
                >
                  Create New Account
                </Button>
              </div>
            </form>
          </div>
        </div>
        <SignUP open={open} setOpen={setOpen} />
      </div>
    </div>
    </>

  );
};

export default Login;
