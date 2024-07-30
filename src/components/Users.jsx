import React from "react";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
const Users = () => {
  return (
    <>  
        <div className="bg-gray-500 flex justify-center items-center m-3 rounded-md">
        <InputBase
          sx={{ ml: 1, flex: 1, color:"white", width:"100%"}}
          placeholder="Search User"
          inputProps={{ "aria-label": "search google maps" }}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon sx={{color:"white"}} />
        </IconButton>
        </div>

    {/* ========================users========================= */}

      <div className="flex justify-between items-center bg-gray-500 p-2 m-3 rounded-md cursor-pointer">

        <div className="w-[15%]">
          <Avatar
            alt="Remy Sharp"
            src="https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg"
          />
        </div>

        <div className="w-[85%] text-white">
          <p>UserName</p>
          <p className="text-gray-300">recent message</p>
        </div>
      </div>
    </>
  );
};

export default Users;
