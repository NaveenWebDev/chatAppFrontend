import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Users from "./Users";
import Avatar from "@mui/material/Avatar";
import { GlobalUserData } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import {io} from "socket.io-client";


const Main = () => {
  const apiUrl = process.env.REACT_APP_MAIN_URL;
  const { userobject, setToken } = useContext(GlobalUserData);
  const navigate = useNavigate();
  const [chatUser, setChatUser] = useState([]);
  const [chatId, setChatId] = useState();
  const [myMessage, setMyMessage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [receivedChats, setReceivedChats] = useState([]);
  const [socketData, setSocketData] = useState("")
  const chatEndRef = useRef(null);

  const socket = useMemo(() => io(`http://localhost:4000`), [])
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken("");
    navigate("/auth");
  };

  const getUserDataForChatById = async (id) => {
    setChatId(id);
    await axios
      .get(`${apiUrl}/getUserDataForChatById/${id}`)
      .then((res) => {
        setChatUser(res?.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createChat = async ()=>{

    if(myMessage === ""){
      return
    }

    const payload = {
      userId:userobject?.id,
      chat:myMessage? myMessage : null,
      fileUrl:fileUrl? fileUrl : null,
      receiverId:chatId
    }

    await axios.post(`${apiUrl}/createChat`, payload)
      .then((res)=>{
        console.log("message send")
        socket.emit("message", myMessage)
        setMyMessage("")
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  // ==================================receive chats datas ================================

  const receiveChats = async ()=>{
    await axios.get(`${apiUrl}/receiveChats/userId=${userobject?.id}/receiverId=${chatId}`,)
    .then((res)=>{
      console.log("message received")
      setReceivedChats(res?.data?.result)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    receiveChats()
},[chatId, myMessage, socketData])

  useEffect(()=>{
    scrollToBottom()
},[myMessage, socketData , receivedChats])


useEffect(() => {
  socket.on("message",(data) => {
    setSocketData(data)
  });
  return () => {
    socket.disconnect();
  };
}, []);


  return (
    <main className="bg-gray-700 h-screen">
      <div className="max-w-[1200px] w-[90%] m-auto">
        <div className="flex justify-between h-screen border overflow-hidden rounded-lg">
          <div className="h-full w-[30%]">
            <Users getUserDataForChatById={getUserDataForChatById} />
          </div>

          {chatId ? (
            <div className="h-full w-[70%] flex flex-col justify-between">
              <div className="click-user bg-gray-500 p-3 text-white flex justify-between items-center gap-2">
                {chatUser?.map((user, i) => (
                  <div className="flex items-center gap-2" key={user?.id}>
                    <Avatar alt="Remy Sharp" src={user?.imageUrl} />
                    <div>
                      <p>{user?.userName}</p>
                      <p>Online</p>
                    </div>
                  </div>
                ))}

                <button onClick={logout}>LogOut</button>
              </div>
              <div className="chats border border-gray-400 flex-grow flex flex-col justify-end items-end relative">
                <div className="chatbox h-[90%] w-[100%] overflow-auto absolute top-0 text-white p-5">
                {
                  receivedChats.map((val, ind)=>(
                  <span className={`flex flex-col gap-2 ${val?.userId === userobject?.id ? "items-end" : null} `}>

                  <img
                    src={val?.imageUrl}
                    alt=""
                    className="w-[40%]"
                  />
                  <p className={`bg-gray-600 w-[40%] p-3 rounded-md ${val?.userId === userobject?.id ? "bg-gray-800" : null} `}>{val?.chat}
                  <div ref={chatEndRef} />
                  </p>
                  </span>
                  ))
                }
                </div>
                <div className="h-[10%] w-full flex bg-gray-500">
                  <input
                    type="text"
                    placeholder="enter your message"
                    className="w-full  text-white h-full border-none outline-none bg-gray-500 placeholder:text-white p-3"
                    value={myMessage}
                    onChange={(e)=>setMyMessage(e.target.value)}
                  />
                  <Button variant="contained" endIcon={<SendIcon />} onClick={createChat}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full w-[70%] flex justify-between items-center rounded-lg p-5">
              <p
                className="flex justify-center bg-gray-500 rounded-lg text-5xl text-white w-full h-full items-center"
                style={{ textShadow: "0 0 20px" }}
              >
                Welcome to our chat Applicaton
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Main;
