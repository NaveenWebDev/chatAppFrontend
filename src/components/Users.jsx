import React, { useContext, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import axios from "axios"
import {GlobalUserData} from "../App"

const Users = ({getUserDataForChatById}) => {

  const apiUrl = process.env.REACT_APP_MAIN_URL;
  const [searchQuery, setSearchQuery] = useState("all")
  const [chatUsers, setChatUsers] = useState([])

  const {userobject} = useContext(GlobalUserData);

  const getUserDataForChat = async ()=>{
    await axios.get(`${apiUrl}/getUserDataForChat/${searchQuery}`)
      .then((res)=>{
        setChatUsers(res?.data?.result);
      })
      .catch((err)=>{
        console.log(err.message)
      })
  }

  useEffect(()=>{
    getUserDataForChat()
  },[searchQuery])

  useEffect(()=>{
    function setQery(params) {
      setSearchQuery("all")
    }
    setQery()
  },[searchQuery.length === 0])


  return (
    <>  
        <div className="bg-gray-500 flex justify-center items-center m-3 rounded-md">
        <InputBase
          sx={{ ml: 1, flex: 1, color:"white", width:"100%"}}
          placeholder="Search User"
          inputProps={{ "aria-label": "search google maps" }}
          onChange={(e)=>setSearchQuery(e.target.value)}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon sx={{color:"white"}} />
        </IconButton>
        </div>

    {/* ========================users========================= */}

      { chatUsers.map((user, i)=>(
        userobject?.id === user?.id? null :
      <div key={user?.id} className="flex justify-between items-center bg-gray-500 p-2 m-3 rounded-md cursor-pointer" onClick={()=>getUserDataForChatById(user?.id)}>

        <div className="w-[15%]">
          <Avatar
            alt="Remy Sharp"
            src={user?.imageUrl}
          />
        </div>

        <div className="w-[85%] text-white">
          <p>{user?.userName}</p>
          <p className="text-gray-300">recent message</p>
        </div>
      </div>
    ))

      }
    </>
  );
};

export default Users;
