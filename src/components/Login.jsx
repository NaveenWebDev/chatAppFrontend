import React from "react";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordCnf, setShowPasswordCnf] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPasswordCnf = () => setShowPasswordCnf((show) => !show);
  const handleMouseDownPasswordCnf = (event) => {
    event.preventDefault();
  };

  return (
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

            <form className="border rounded-lg p-5 bg-slate-100">
              <div className="flex gap-2 flex-col justify-center items-center" >
                <TextField
                  id="standard-basic"
                  placeholder="Email"
                  variant="standard"
                  type="email"
                  sx={{padding:"0.5rem", width:"100%"}}
                />

                <Input
                  id="standard-adornment-password"
                  sx={{padding:"0.5rem", width:"100%"}}
                  type={showPassword ? "text" : "password"}
                  placeholder="enter your password"
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
              <Button variant="outlined" type="submit" sx={{margin:"0.5rem", width:"100%", padding:"0.5rem"}} >Log In</Button>
              <Button variant="outlined" onClick={handleClickOpen} sx={{margin:"0.5rem", padding:"0.5rem"}} >Create New Create</Button>
              </div>
            </form>

          </div>
        </div>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
                <h2 className="text-3xl font-bold" >Sign Up</h2>
                  <div className="mt-5 flex flex-col gap-2">
          <TextField id="outlined-basic" label="firstName" variant="standard" sx={{width:"100%"}} />
          <TextField id="outlined-basic" label="lastName" variant="standard" sx={{width:"100%"}} />
          <TextField id="outlined-basic" label="userName" variant="standard" sx={{width:"100%"}} />
          <TextField id="outlined-basic" type="email" label="email" variant="standard" sx={{width:"100%"}} />
          <Input
                  id="standard-adornment-password"
                  sx={{padding:"0.5rem", width:"100%"}}
                  type={showPassword ? "text" : "password"}
                  placeholder="enter your password"
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
                  sx={{padding:"0.5rem", width:"100%"}}
                  type={showPasswordCnf ? "text" : "password"}
                  placeholder="enter your conformPassword"
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
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Sign Up</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
