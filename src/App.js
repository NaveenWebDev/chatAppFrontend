import React from "react";
import Main from "./components/Main";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main></Main>} />
        <Route path="/auth" element={<Login></Login>} />
      </Routes>
    </>
  );
};

export default App;
