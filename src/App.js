import React, { useEffect, useState } from "react";
import Main from "./components/Main";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import { createContext  } from "react";

const GlobalUserData = createContext();

const App = () => {
  let storedToken = localStorage.getItem("token");
  let userDatas = localStorage.getItem("userData");
  const [token, setToken ] = useState(storedToken);
  const [userData, setUserData] = useState(userDatas);

  const navigate = useNavigate()
  
  const checkLoginOrNot = ()=>{
    if(token){
      navigate("/")
    }else{
      navigate("/auth")
    }
  }
  useEffect(()=>{
    setUserData(userDatas)
  },[userDatas])
  
  useEffect(()=>{
    checkLoginOrNot()
  },[token])

  const userobject = JSON.parse(userData)



  return (
    <GlobalUserData.Provider value={{token, setToken, userobject}} >
      <Routes>
        <Route path="/" element={<Main></Main>} />
        <Route path="/auth" element={<Login></Login>} />
      </Routes>
    </GlobalUserData.Provider>
  );
};

export default App;
export {GlobalUserData};
