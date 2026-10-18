import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { FaUser, FaLock, FaEnvelope, FaEyeSlash } from "react-icons/fa";
import {
  doSignInWithEmailAndPassword,
  doCreateUserWithEmailAndPassword,
} from "../../firebase/auth";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

const LoginPage = () => {
  const [isVisible, setVisible] = useState(false);

  const toggle = () => {
    setVisible(!isVisible);
  };
  // Firebase Setup

  //login
  const [lemail, setLEmail] = useState("");
  const [lpassword, setLPassword] = useState("");

  //register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  //register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await doCreateUserWithEmailAndPassword(email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstname: fname,
          lastname: lname,
        });
      }
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
      });
    }
  };

  //login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await doSignInWithEmailAndPassword(lemail, lpassword);
      toast.success("Logged In Successfully!!", {
        position: "top-center",
      });
      window.location.href = "/MainDashboard";
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
      });
    }
  };
  // Firebase Setup

  //annimation

  const [action, setAction] = useState("");

  const registerLink = () => {
    setAction("active");
  };

  const loginLink = () => {
    setAction("");
  };

  //background color
  useEffect(() => {
    document.body.className = "bodyLogin"; // Change body class to match ComponentA style

    return () => {
      document.body.className = ""; // Reset body class when leaving the component
    };
  }, []);

  return (
    <div className={`${styles.wrapper} ${action ? styles.wrapperActive : ""}`}>
      {/* Login */}
      <div className={`${styles["form-box"]} ${styles.login}`}>
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <div className={styles["input-box"]}>
            <input
              type="email"
              placeholder="Email"
              value={lemail}
              onChange={(e) => setLEmail(e.target.value)}
              required
            />
            <FaEnvelope className={styles.icon} />
          </div>
          <div className={styles["input-box"]}>
            <input
              type={!isVisible ? "password" : "text"}
              placeholder="Password"
              value={lpassword}
              onChange={(e) => setLPassword(e.target.value)}
              required
            />
            <FaLock className={styles.icon} />
          </div>

          {/* <label className="flex justify-end text-[#333] text-[14.5px] mt-[-15px] mb-2">
            <div></div>
            <input
              type="checkbox"
              className="w-4 shrink-0 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 "
              onClick={toggle}
            />
            <span>Show password</span>
          </label> */}

          <div className={styles["remember-forgot"]}>
            <label>
              <input onClick={toggle} type="checkbox" /> Show password
            </label>
          </div>

          <button
            className="w-full h-[45px] bg-gradient-to-r from-[#007bff] to-[#2217c5] border-0 outline-none rounded-[10px] shadow-md cursor-pointer text-white font-bold text-[16px]"
            type="submit">
            Login
          </button>

          <div className={styles["register-link"]}>
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={registerLink}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Register */}
      <div className={`${styles["form-box"]} ${styles.register}`}>
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          <div className={styles["input-box"]}>
            <input
              type="text"
              placeholder="First name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
            />
            <FaUser className={styles.icon} />
          </div>

          <div className={styles["input-box"]}>
            <input
              type="text"
              placeholder="Last name"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              required
            />
            <FaUser className={styles.icon} />
          </div>

          <div className={styles["input-box"]}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className={styles.icon} />
          </div>
          <div className={styles["input-box"]}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className={styles.icon} />
          </div>

          <div className={styles["remember-forgot"]}>
            <label>
              <input type="checkbox" required /> I agree to the termes &
              conditions
            </label>
          </div>

          <button
            className="w-full h-[45px] bg-gradient-to-r from-[#007bff] to-[#2217c5] border-0 outline-none rounded-[10px] shadow-md cursor-pointer text-white font-bold text-[16px]"
            type="submit">
            Register
          </button>

          <div className={styles["register-link"]}>
            <p>
              Already have an account?{" "}
              <a href="#" onClick={loginLink}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
