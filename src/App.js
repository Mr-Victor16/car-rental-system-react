import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout/Layout';
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyRentals from "./pages/MyRentals";
import Rentals from "./pages/Rentals";
import CarList from "./pages/CarList";
import GlobalSnackbar from "./components/GlobalSnackbar";
import UserList from "./pages/UserList";
import AddUser from "./pages/AddUser";
import ProtectedRoute from "./auth/ProtectedRoute";
import NoPermission from "./pages/NoPermission";
import CarForm from "./pages/CarForm";

function App() {
  return (
      <>
        <GlobalSnackbar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path='register' element={<Register />} />

              <Route
                  path="profile"
                  element={<ProtectedRoute element={<Profile />} />}
              />

              <Route
                  path="car/add"
                  element={<ProtectedRoute element={<CarForm />} admin={true} />}
              />

              <Route
                  path="car/edit/:id"
                  element={<ProtectedRoute element={<CarForm />} admin={true} />}
              />

              <Route
                  path="my-rentals"
                  element={<ProtectedRoute element={<MyRentals />} />}
              />

              <Route
                  path="rentals"
                  element={<ProtectedRoute element={<Rentals />} admin={true} />}
              />

              <Route
                  path="car/list"
                  element={<ProtectedRoute element={<CarList />} admin={true} />}
              />

              <Route
                  path="users"
                  element={<ProtectedRoute element={<UserList />} admin={true} />}
              />

              <Route
                  path="user/add"
                  element={<ProtectedRoute element={<AddUser />} admin={true} />}
              />

              <Route path="*" element={<NoPage />} />
              <Route path="no-permission" element={<NoPermission />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;