import { useState } from "react";
import "./css/AuthPages.css";
import { Lock, ArrowRight, Sparkles, ShieldCheck, Mail, GraduationCap } from 'lucide-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/firebase";

import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!id || !password) {
    setError("Please fill in all fields.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      id,
      password
    );

    const user = userCredential.user;

    console.log("Logged In:", user.email);

    if (role === "student") {
      navigate("/student");
    } else {
      navigate("/faculty");
    }

  } catch (error) {
    console.log(error.message);
    setError("Invalid Email or Password");
  }
};

  return (
    <div className="mainContainer">

      {/* LEFT SIDE CONTENT */}
      <div className="left-side-content">

        <h2 className="left-side-heading">
          Elevate <br />
          <span className="gradient-text">Learning.</span>
        </h2>

        <p className="desc">
          Access your personalized dashboard, connect with peers, and let AI guide your academic journey.
        </p>
        <div className="features">
          <div className="feature-box">
            <GraduationCap className="text-blue-900 mb-2" size={24} color="#2a579f"/>
            <h3 className="feature-head">Smart Path</h3>
            <p className="feature-desc">AI-curated curriculum.</p>
          </div>

          <div className="feature-box">
            <ShieldCheck className="text-green-500 mb-2" size={24} color="#1c8a44"/>
          <h3 className="feature-head">Secure Drive</h3>
          <p className="feature-desc">Private note storage.</p>
          </div>
        </div>
      </div>


      {/* RIGHT SIDE CONTENT */}
      <div className="right-side-content">
        <div className="header">
          <h2 className="logo">D</h2>
          <h2>DigiNoteS</h2>
        </div>
        <div className="credentials">
        <div className='welcome-container'>
        <h2 className="welcome">Welcome Back</h2>
        <p className="welcome-desc">Please enter your credentials to access the portal.</p>
        </div>

        <div className="role-selection">
          <button onClick={() => setRole("student") } className={role === "student" ? "active-btn" : "normal-btn"}>
            Student
          </button>

          <button onClick={() => setRole("faculty")} className={role === ("faculty")?'active-btn':'normal-btn'}>
            Faculty
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="form-details">

          <div className="enroll-div">
            <label className="label-name">
              {role === "student" ? "Enrollment ID" : "Faculty ID"}
            </label><br />

            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder={role === "student" ? "21DCS001" : "emp_123"}
            />
          </div>

          <br />

          <div className="pwd-div">
            <label className="label-name">Password</label><br />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
            />
          </div>

          <br />

          {error && <p>{error}</p>}

          <button type="submit" className="signin">
            Sign In
          </button>

        </form>

        <p className="issues">
          Don't Have An Account? <a href="./register">Signup</a>
        </p>

      </div>
    </div>
    </div>
  );
};

export default AuthPage;
