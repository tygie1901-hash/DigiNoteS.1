import { useState } from "react";
import "./css/AuthPages.css";
import { ShieldCheck, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./../src/firebase"; // adjust path
import { createUserWithEmailAndPassword,deleteUser } from "firebase/auth";

const RegistrationPage = () => {

  const navigate = useNavigate();
  
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  const isValidEmail = () => {
    let validDomain = "";
    
    if (!email) {
      toast.error("Email is required");
      return false;
    }

    if (role === "student") {
      validDomain = "@charusat.edu.in";
    } else {
      validDomain = "@charusat.ac.in";
    }

    if (!email.endsWith(validDomain)) {
      toast.error(`Invalid ${role} email!`);
      return false;
    }

    return true;
  };
  
  const sendOtp = async () => {
    if (!isValidEmail()) return;

    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        "TempPassword123!"
      );

      await deleteUser(userCredential.user);

      const res = await fetch("http://localhost:5000/api/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: normalizedEmail })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStep(2);
      toast.success("OTP sent successfully");

    } catch (error) {

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered. Please login.");
        return;
      }

      toast.error(error.message);

    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) return setError("Enter OTP");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Account verified!");

      if (role === "student") {
        navigate("/student", { state: { firstLogin: true,email } });
      } else {
        navigate("/teacher", { state: { firstLogin: true } });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="mainContainer">
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="dark"
    />
    {/* LEFT SIDE */}
    <div className="left-side-content">
      <h2 className="left-side-heading">
        Elevate <br />
        <span className="gradient-text">Learning.</span>
      </h2>

      <p className="desc">
        Access your personalized dashboard and private notes.
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

    {/* RIGHT SIDE */}
    <div className="right-side-content">
      <div className="header">
        <h2 className="logo">D</h2>
        <h2>DigiNoteS</h2>
      </div>

      {/* ROLE */}
      <div className="credentials">
        <div className='welcome-container'>
          <h2 className="welcome">Signup</h2>
          <p className="welcome-desc">Please enter your credentials to access the portal </p>
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
        <form onSubmit={verifyOtp} className="form-details">

          {/* EMAIL */}
          <div className='email-div'>
          <label className='label-name'>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="example@gmail.com"
            disabled={step===2}
          />
          </div>
          {/* OTP FIELD */}
          {step===2 && (
            <div className="otp-div">
              <label className="label-name">OTP</label>
              <input
                value={otp}
                onChange={(e)=>setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </div>
          )}

          {error && <p>{error}</p>}

          {/* BUTTONS */}
          {step===1 ? (
            <button type="button" onClick={sendOtp} disabled={loading} className="send-otp">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <button type="submit" disabled={loading} className="send-otp">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          )}

        </form>

      </div>
    </div>
</div>
);
};

export default RegistrationPage;