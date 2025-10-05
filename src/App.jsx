// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";

// Import pages
// import Home from "./pages/Home/Home";
import Return from "./pages/Return/Return";
import Manager from "./pages/Manager/Manager";
import Preview from "./pages/Preview/Preview";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword/ResetPassword";
import ChangePassword from "./pages/Auth/ChangePassword/ChangePassword";

function App() {
   return (
      <Router>
         <Routes>
            {/* Routes với MainLayout (có Header) */}
            <Route path="/" element={<MainLayout />}>
               <Route index element={<Return />} />
               <Route path="return" element={<Return />} />
               <Route path="manager" element={<Manager />} />
               <Route path="preview" element={<Preview />} />
            </Route>

            {/* Routes không có Header (Auth pages) */}
            <Route element={<AuthLayout brand="User" />}>
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/forgot-password" element={<ForgotPassword />} />
               <Route path="/reset-password" element={<ResetPassword />} />
               <Route path="/change-password" element={<ChangePassword />} />
            </Route>

            {/* 404 Page */}
            <Route
               path="*"
               element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-100">
                     <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                           404
                        </h1>
                        <p className="text-gray-600">Page not found</p>
                     </div>
                  </div>
               }
            />
         </Routes>
      </Router>
   );
}

export default App;
