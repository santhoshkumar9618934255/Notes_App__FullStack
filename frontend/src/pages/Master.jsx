import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../components/Dashboard";
import NewNotes from "../components/NewNotes";
import UpdateNotes from "../components/UpdateNotes";

const Master = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/newnotes" element={<NewNotes />} />  
       <Route path="/updatenotes/:id" element={<UpdateNotes />} />


      </Routes>
    </BrowserRouter>
  );
};

export default Master;
