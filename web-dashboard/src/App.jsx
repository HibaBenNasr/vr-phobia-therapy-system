import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase/firebase";
import React, { useEffect, useState } from "react";

import LoginPage from "./Components/LoginRegister/LoginPage";
import MainDashboard from "./Components/MainDashboard/MainDashboard";
import PatientDashboard from "./Components/PatientDashboard/PatientDashboard";
import Profile from "./Components/MainDashboard/Profile/Profile";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await auth.onAuthStateChanged((user) => {
        setUser(user);
        setLoading(false);
      });
    };

    fetchUser();
  }, []);
  function loadingDiv() {
    return (
      <div className="h-screen flex items-center justify-center">
        <svg
          className="animate-spin w-48 h-48 text-blue-500 "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    );
  }

  return (
    <Router>
      <div className="App bg-gray-100 dark:bg-gray-900">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route
                path="/"
                element={
                  loading ? (
                    loadingDiv()
                  ) : user ? (
                    <Navigate to="/MainDashboard" />
                  ) : (
                    <LoginPage />
                  )
                }
              />
              <Route
                path="/Profile"
                element={
                  loading ? (
                    loadingDiv()
                  ) : user ? (
                    <Profile />
                  ) : (
                    <Navigate to="/LoginPage" replace />
                  )
                }
              />

              <Route
                path="/MainDashboard"
                element={
                  loading ? (
                    loadingDiv()
                  ) : user ? (
                    <MainDashboard />
                  ) : (
                    <Navigate to="/LoginPage" replace />
                  )
                }
              />

              <Route
                path="/PatientDashboard"
                element={
                  loading ? (
                    loadingDiv()
                  ) : user ? (
                    <PatientDashboard />
                  ) : (
                    <Navigate to="/LoginPage" replace />
                  )
                }
              />

              <Route
                path="/LoginPage"
                element={
                  loading ? (
                    loadingDiv()
                  ) : user ? (
                    <Navigate to="/MainDashboard" replace />
                  ) : (
                    <LoginPage />
                  )
                }
              />
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
