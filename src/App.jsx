import { Routes, Route } from "react-router-dom";

import AuthPage from "../pages/Authpage";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import RegistrationPage from "../pages/RegistrationPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/register" element={<RegistrationPage />} />
    </Routes>
  );
}

export default App;
