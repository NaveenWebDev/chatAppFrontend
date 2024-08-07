import React, { useContext, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { GlobalUserData } from "../App";
import ApiConnector from "../services/ApiConnector";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Swal from "sweetalert2";

const Users = ({ getUserDataForChatById, receiveChats , setGroupId, setChatId , chatUsersData }) => {
  const apiUrl = process.env.REACT_APP_MAIN_URL;
  const [searchQuery, setSearchQuery] = useState("all");
  const [chatUsers, setChatUsers] = useState([]);
  const [value, setValue] = React.useState("1");
  const [open, setOpen] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');
  const { userobject } = useContext(GlobalUserData);
  const [groups, setGroups] = React.useState([]);

  
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setGroupName("")
  };

  const getUserDataForChat = async () => {
    await ApiConnector.get(`/getUserDataForChat/${searchQuery}`)
      .then((res) => {
        setChatUsers(res?.data?.result);
        chatUsersData(res?.data?.result);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const createGroup = async () => {
    await ApiConnector.post(`/createGroup/${groupName}`)
      .then((res) => {
        Swal.fire({
          title: "Good job!",
          text: "Group Created Successfully",
          icon: "success"
        });
        setGroupName("")
        receiveGroup()
        handleClose()
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const receiveGroup = async () => {
    await ApiConnector.get(`/receiveGroup`)
      .then((res) => {
        setGroups(res?.data?.result)
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(()=>{
    receiveGroup()
  },[])

  useEffect(() => {
    getUserDataForChat();
  }, [searchQuery]);

  useEffect(() => {
    function setQery(params) {
      setSearchQuery("all");
    }
    setQery();
  }, [searchQuery.length === 0]);

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <div className="border flex justify-between rounded-sm">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label={<PersonIcon sx={{ color: "white" }} />} value="1" />
                <Tab label={<GroupsIcon />} sx={{ color: "white" }} value="2" />
              </TabList>
            </Box>
            <button className="text-white px-3" onClick={handleClickOpen}>Create Group</button>
          </div>
          <TabPanel value="1">
            <div>
              <div className="bg-gray-500 flex justify-center items-center rounded-md">
                <InputBase
                  sx={{ ml: 1, flex: 1, color: "white", width: "100%" }}
                  placeholder="Search User"
                  inputProps={{ "aria-label": "search google maps" }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon sx={{ color: "white" }} />
                </IconButton>
              </div>

              {/* ========================users========================= */}

              {chatUsers.map((user, i) =>
                userobject?.id === user?.id ? null : (
                  <div
                    key={user?.id}
                    className="flex justify-between items-center bg-gray-500 p-2 my-3 rounded-md cursor-pointer"
                    onClick={() => {
                      getUserDataForChatById(user?.id);
                      receiveChats();
                      setGroupId(false)
                    }}
                  >
                    <div className="w-[15%]">
                      <Avatar alt="Remy Sharp" src={user?.imageUrl} />
                    </div>

                    <div className="w-[85%] text-white">
                      <p>{user?.userName}</p>
                      <p className="text-gray-300">recent message</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div>
              {/* <div className="bg-gray-500 flex justify-center items-center rounded-md">
                <InputBase
                  sx={{ ml: 1, flex: 1, color: "white", width: "100%" }}
                  placeholder="Search Group"
                  inputProps={{ "aria-label": "search google maps" }}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon sx={{ color: "white" }} />
                </IconButton>
              </div> */}

              {/* ========================users========================= */}

              {
                groups.map((group, i)=>(
              <div
                className="flex justify-between items-center bg-gray-500 p-2 my-3 rounded-md cursor-pointer"
                onClick={() => {
                  setGroupId(group?.id);
                  setChatId(false)
                    }}
              >
                  <div className="w-[15%]" key={group?.id}>
                  <Avatar alt="Remy Sharp" src={group?.imageUrl} />
                </div>

                <div className="w-[85%] text-white">
                  <p>{group?.name}</p>
                  <p className="text-gray-300">recent message</p>
                </div>
              </div>
                ))
              }
            </div>
          </TabPanel>
        </TabContext>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Create Group"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <TextField id="standard-basic" label="GroupName" variant="standard" value={groupName} onChange={(e)=>setGroupName(e.target.value)} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>createGroup()} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Users;
