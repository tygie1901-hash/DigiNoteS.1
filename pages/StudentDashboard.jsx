import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../src/firebase"; 

const StudentDashboard = () => {
  const location = useLocation();

  const email = location.state?.email;
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (location.state?.firstLogin) {
      setShowPasswordModal(true);
      toast.info("Please create a new password");
    }
    console.log(email)
  }, [location]);


const handleCreatePassword = async () => {
  if (password.length < 6) {
    return toast.error("Password must be at least 6 characters");
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    toast.success("Account created successfully!");
    setShowPasswordModal(false);

  } catch (error) {

    if (error.code === "auth/email-already-in-use") {
      toast.error("Email already exists. Please login.");
    } 
    else if (error.code === "auth/invalid-email") {
      toast.error("Invalid email format.");
    }
    else if (error.code === "auth/weak-password") {
      toast.error("Password is too weak.");
    }
    else {
      toast.error(error.message);
    }
  }
};

  return (
    <div>
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Create New Password</h3>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleCreatePassword}>
              Save Password
            </button>
          </div>
        </div>
      )}

      <h1>Student Dashboard</h1>

      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default StudentDashboard;