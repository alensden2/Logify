import { BrowserRouter, Route, Routes } from "react-router-dom";


import './App.css';
import Login from './login';
import Register from "./registration";
import ProfilePage from "./profilePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>  
        <Route path='/profile' element={<ProfilePage />}></Route>                  
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
