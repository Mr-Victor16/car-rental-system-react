import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout/Layout';
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AddCar from "./pages/AddCar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="car/add" element={<AddCar />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;