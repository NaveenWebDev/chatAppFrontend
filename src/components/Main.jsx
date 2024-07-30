import React from "react";
import Users from "./Users";
import Avatar from "@mui/material/Avatar";


const Main = () => {
  return (
    <main className="bg-gray-700 h-screen">
        <div className="max-w-[1200px] w-[90%] m-auto">
          <div className="flex justify-between h-screen border ">
            <div className="h-full w-[30%]">
              <Users />
            </div>

            <div className="h-full w-[70%] flex flex-col justify-between">
              <div className="click-user bg-gray-500 p-3 text-white flex items-center gap-2">
                <Avatar
                  alt="Remy Sharp"
                  src="https://cdn.vectorstock.com/i/500p/53/42/user-member-avatar-face-profile-icon-vector-22965342.jpg"
                />
                <div>
                  <p>userName</p>
                  <p>Online</p>
                </div>
              </div>
              <div className="chats border border-gray-400 flex-grow flex flex-col justify-end items-end relative">
                <div className="chatbox h-[90%] w-[100%] overflow-auto absolute top-0 text-white p-5">

                    <p className="bg-gray-600 w-[30%] p-3 rounded-md" >hi brooo</p>
 
                </div>
                <div className="h-[10%] w-full border">

              <input type="text" placeholder="enter your message" className="w-full bg-gray-500 text-white h-full placeholder:text-white p-3" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
  )
}

export default Main