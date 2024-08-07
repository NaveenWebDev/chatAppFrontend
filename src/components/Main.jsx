import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Users from "./Users";
import Avatar from "@mui/material/Avatar";
import { GlobalUserData } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { io } from "socket.io-client";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CircularProgress from "@mui/material/CircularProgress";
import ApiConnector from "../services/ApiConnector";
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Main = () => {
  const apiUrl = process.env.REACT_APP_MAIN_URL;
  const { userobject, setToken } = useContext(GlobalUserData);
  const navigate = useNavigate();
  const [chatUser, setChatUser] = useState([]);
  const [chatId, setChatId] = useState();
  const [myMessage, setMyMessage] = useState("");
  const [groupId, setGroupId] = useState();
  const [fileUrl, setFileUrl] = useState("");
  const [receivedChats, setReceivedChats] = useState([]);
  const [socketData, setSocketData] = useState("");
  const chatEndRef = useRef(null);
  const socketRef = useRef();
  const [loader, setLoader] = useState(false);
  const [online, setOnline] = useState(true);
  const [chatGroup, setChatGroup] = useState([]);
  const [myGroupMessage, setMyGroupMessage] = useState("");
  const [receivedGroupChats, setReceivedGroupChats] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [memberData,setMemberData] = useState([])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // socket connection
    socketRef.current = io(`https://chatappbackend-33tk.onrender.com`, {
      credentials: true,
    });
    // socketRef.current = io(`http://localhost:4000`, {
    //   credentials: true,
    // });

    socketRef.current.on("connect", () => {
      console.log("Socket connected: ", socketRef.current.id);
    });

    socketRef.current.on("message", (data) => {
      setSocketData(data);
    });
    socketRef.current.on("groupMessage", (data) => {
      setSocketData(data);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      Swal.fire({
        title: "Good job!",
        text: "you are online",
        icon: "success"
      });
    };
    const handleOfline = () => {
      setOnline(false);
      Swal.fire({
        title: "Check Your Internet Connection",
        text: "you are ofline",
        icon: "error"
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOfline);

    return () => {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOfline);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken("");
    navigate("/auth");
  };

  const getUserDataForChatById = async (id) => {
    setChatId(id);
    await ApiConnector.get(`/getUserDataForChatById/${id}`)
      .then((res) => {
        setChatUser(res?.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getGroupDataForChatById = async (id) => {
    await ApiConnector.get(`/getGroupDataForChatById/${id}`)
      .then((res) => {
        setChatGroup(res?.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getGroupDataForChatById(groupId);
  }, [groupId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const createChat = async () => {
    if (myMessage === "" && fileUrl === "") {
      return;
    }

    const payload = {
      userId: userobject?.id,
      chat: myMessage ? myMessage : null,
      fileUrl: fileUrl ? fileUrl : null,
      receiverId: chatId,
    };

    await ApiConnector.post(`/createChat`, payload)
      .then((res) => {
        // socket.emit("message", myMessage)
        socketRef.current.emit("message", myMessage);
        console.log("message send");
        setMyMessage("");
        setFileUrl("");
        receiveChats();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    scrollToBottom();
  }, [socketData, receivedChats, myMessage, myGroupMessage, receivedGroupChats]);
  // ==================================receive chats datas ================================

  const receiveChats = async () => {
    await ApiConnector.get(
      `/receiveChats/userId=${userobject?.id}/receiverId=${chatId}`
    )
      .then((res) => {
        setReceivedChats(res?.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    receiveChats();
  }, [socketData, chatId]);

  const uploadFile = async (e) => {
    const payload = {
      imageFile: e.target.files[0],
    };
    setLoader(true);
    await ApiConnector.post(`/imageUpload`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res?.data?.result);
        setFileUrl(res?.data?.result);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendGroupMessage = async ()=>{

    if (myGroupMessage === "" && fileUrl === "") {
      return;
    }

    const payload = {
      groupId, 
      message : myGroupMessage ,
      userId :userobject?.id,
      userName :userobject?.userName,
    }
    await ApiConnector.post(`/sendGroupMessage`, payload)
      .then((res)=>{
        // console.log("message Send on Group")
        socketRef.current.emit("groupMessage", myGroupMessage);
        setMyGroupMessage("")
        getGroupMessages(groupId)
      })
      .catch((err)=>{
        Swal.fire({
          icon: "error",
          title: "Please add yourself in this group",
          text: err.response.data.message
        });
        console.log(err.response.data.message)
      })
  }
  const getGroupMessages = async (id)=>{

    await ApiConnector.get(`/getGroupMessages/${id}`)
      .then((res)=>{
        setReceivedGroupChats(res?.data?.result)
      })
      .catch((err)=>{
        console.log(err)
      })
  }

  useEffect(()=>{
    getGroupMessages(groupId)
  },[groupId, socketData])


  const chatUsersData = (data)=>{
    setMemberData(data)
  }

  // ==========================addGroupMember============================

  const addGroupMember = async (id)=>{
    const payload = {
      groupId,
      userId: id,
    }
    await ApiConnector.post(`/addGroupMember`, payload)
      .then((res)=>{
        console.log("member added")
      })
      .catch((err)=>{
        console.log("something went wrong")
      })
  }
  console.log(chatGroup)
  return (
    <main className="bg-gray-700 h-screen">
      <div className="max-w-[1200px] w-[90%] m-auto">
        <div className="flex justify-between h-screen border overflow-hidden rounded-lg">
          <div className="h-full w-[30%]">
            <Users
              getUserDataForChatById={getUserDataForChatById}
              setChatId={setChatId}
              receiveChats={receiveChats}
              setGroupId={setGroupId}
              chatUsersData={chatUsersData}
              userId={userobject?.id}
            />
          </div>

          {chatId || groupId ? (
            <div className="h-full w-[70%] flex flex-col justify-between">
              <div className="click-user bg-gray-500 p-3 text-white flex justify-between items-center gap-2">
                {chatId &&
                  chatUser?.map((user, i) => (
                    <>

                    <div className="flex items-center gap-2" key={user?.id}>
                      <Avatar alt="Remy Sharp" src={user?.imageUrl} />
                      <div>
                        <p>{user?.userName}</p>
                        <p>Online</p>
                      </div>
                    </div>
                <button onClick={logout}>LogOut</button>
                    </>
                  ))}
                {groupId &&
                  chatGroup?.map((user, i) => (
                    <>
                    <div className="flex items-center gap-2" key={user?.id}>
                      <Avatar alt="Remy Sharp" src={user?.imageUrl} />
                      <div>
                        <p>{user?.name}</p>
                        <p>you and other's</p>
                      </div>
                    </div>
                    {
                      user?.userId == userobject?.id ?
                <Button sx={{color:"white"}} onClick={handleClickOpen}>Add Member</Button>
                :null
                    }
                    </>
                  ))}

              </div>

{/* ==================================messages=============================== */}

              <div className="chats border border-gray-400 flex-grow flex flex-col justify-end items-end relative">
                <div className="chatbox h-[90%] w-[100%] overflow-auto absolute top-0 text-white p-5">
                  {chatId && receivedChats.map((val, ind) => (
                    <span
                      className={`flex flex-col gap-2 ${
                        val?.userId === userobject?.id ? "items-end" : null
                      } `}
                    >
                      <img
                        src={val?.imageUrl}
                        alt=""
                        className="w-[40%] mt-2"
                      />

                      <p
                        className={`bg-gray-600 w-[40%] p-3 rounded-md ${
                          val?.userId === userobject?.id ? "bg-gray-800" : null
                        } `}
                      >
                        {val?.chat}

                        <div ref={chatEndRef} />
                      </p>
                    </span>
                  ))}

                  {groupId && receivedGroupChats.map((val, ind) => (
                    <span
                      className={`flex flex-col gap-2 ${
                        val?.userId === userobject?.id ? "items-end" : null
                      } `}
                    >
                      <img
                        src={val?.imageUrl}
                        alt=""
                        className="w-[40%] mt-2"
                      />

                      <p
                        className={`bg-gray-600 w-[40%] flex flex-col p-3 rounded-md ${
                          val?.userId === userobject?.id ? "bg-gray-800" : null
                        } `}
                      >
                    <span className="text-green-400">{val?.userName}</span>
                    <span>
                        {val?.message}
                    </span>

                        <div ref={chatEndRef} />
                      </p>
                    </span>
                  ))}

                </div>


                {chatId && (
                  <div className="h-[10%] w-full flex items-center bg-gray-500">
                    <input
                      type="text"
                      placeholder="enter your message"
                      className="w-full  text-white h-full border-none outline-none bg-gray-500 placeholder:text-white p-3"
                      value={myMessage}
                      onChange={(e) => setMyMessage(e.target.value)}
                    />
                    <span className="bg-[#1976D2] mx-1 rounded-full cursor-pointer grid place-items-center h-[50px] w-[70px] relative text-white">
                      <input
                        type="file"
                        name="file"
                        className="border h-full w-full absolute rounded-full opacity-0 cursor-pointer"
                        onChange={(e) => uploadFile(e)}
                      />
                      <SpeedDialIcon className="cursor-pointer" />
                    </span>
                    {loader ? (
                      <CircularProgress sx={{ color: "white" }} />
                    ) : (
                      <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        className="self-stretch"
                        onClick={createChat}
                      >
                        Send
                      </Button>
                    )}
                  </div>
                )}

                {groupId && (
                  <div className="h-[10%] w-full flex items-center bg-gray-500">
                    <input
                      type="text"
                      placeholder="enter your group message"
                      className="w-full  text-white h-full border-none outline-none bg-gray-500 placeholder:text-white p-3"
                      value={myGroupMessage}
                      onChange={(e)=>setMyGroupMessage(e.target.value)}
                    />
                    {/* <span className="bg-[#1976D2] mx-1 rounded-full cursor-pointer grid place-items-center h-[50px] w-[70px] relative text-white">
                      <input
                        type="file"
                        name="file"
                        className="border h-full w-full absolute rounded-full opacity-0 cursor-pointer"
                        // onChange={(e) => uploadFile(e)}
                      />
                      <SpeedDialIcon className="cursor-pointer" />
                    </span> */}
                    {loader ? (
                      <CircularProgress sx={{ color: "white" }} />
                    ) : (
                      <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        className="self-stretch"
                        onClick={sendGroupMessage}
                      >
                        Send
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full w-[70%] flex justify-between items-center rounded-lg p-5">
              <p
                className="flex justify-center bg-gray-500 rounded-lg text-5xl text-white w-full h-full items-center text-center"
                style={{ textShadow: "0 0 20px" }}
              >
                {online === true
                  ? "Welcome to our chat Applicaton "
                  : "Please check your internet Connection you are ofline"}
              </p>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{textAlign:"center"}}>{"Add Members"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          {
          memberData.map((val, i)=>(
          <div className="flex justify-between items-center gap-2 border my-3 p-2 rounded-md" key={val?.id} >
                    <div className="flex gap-2">
                      <Avatar alt="Remy Sharp" src={val?.imageUrl} />
                      <div>
                        <p>{val?.userName}</p>
                        <p>member</p>
                      </div>
                    </div>

                       <AddCircleIcon sx={{cursor:"pointer"}} onClick={()=>addGroupMember(val?.id)} />
                    </div>
          ))
          }

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>cancel</Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Main;
