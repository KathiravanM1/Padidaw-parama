import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import "./App.css";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import SeniorLanding from "./components/SeniorLanding";
import Student from "./pages/Student.jsx";
import Resources from "./pages/Resources.jsx";
import StudentLayout from "./Layouts/StudentLayout.jsx";
import AnnaUniversityMarkingSystem from "./pages/MarkingSystem.jsx";
import Scholarship from "./pages/Scholarship.jsx";
import DefaultLayout from "./Layouts/DefaultLayout.jsx";
import SeniorUploadPage from "./pages/AdminResources.jsx";
import SeniorLayout from "./Layouts/SeniorLayout.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import ProblemSolvingPage from "./pages/ProblemSolving.jsx";
import ShareProject from "./pages/SeniorExp.jsx";
import PostProblemPage from "./pages/SeniorProblem.jsx";
import Projects from "./pages/Projects.jsx";
import AttendanceTracker from "./pages/LeaveTracker.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminResources from "./pages/AdminResources.jsx";
import NotFound from "./pages/NotFound.jsx";
import SeniorRoadmap from "./components/SeniorRoadmap.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./components/LoginPage.jsx";

function App() {
  return (
      <Routes>
          <Route path="/" element={<DefaultLayout/>}>
            <Route index element={<LandingPage />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
        </Route>
        <Route path="senior" element={
          <ProtectedRoute allowedRoles={['senior', 'admin']}>
            <SeniorLayout />
          </ProtectedRoute>
        } >
            <Route index element={<SeniorLanding />} />
            <Route path="resources" element={<SeniorUploadPage />} />
            <Route path="project" element={<ShareProject/>} />
            <Route path="problemsolving" element={<PostProblemPage/>} />
            <Route path="roadmap" element={<SeniorRoadmap/>} />
        </Route>
        <Route path="student" element={
          <ProtectedRoute allowedRoles={['student', 'senior', 'admin']}>
            <StudentLayout />
          </ProtectedRoute>
        }>
            <Route index element={<Student />}/>
            <Route path="resources" element={<Resources />} />
            <Route path="markingsystem" element={<AnnaUniversityMarkingSystem />} />
            <Route path="guide" element={<Scholarship/>} />
            <Route path="problemsolving" element={<ProblemSolvingPage />} />
            <Route path="projects" element={<Projects/>} />
            <Route path="attendance/login" element={<LoginPage onLogin={() => window.location.href = '/student/leavetracker'} />} />
            <Route path="roadmap" element={<Roadmap/>} />
            <Route path="leavetracker" element={<AttendanceTracker/>}></Route>
        </Route>
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
            <Route index element={<AdminPanel />} />
            <Route path="resources" element={<AdminResources />} />
        </Route>
        
        <Route path="*" element={<DefaultLayout />}>
            <Route index element={<NotFound />} />
        </Route>
      </Routes>
  );
}

export default App;