import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StudentProvider from "./context/student/studentContext.jsx";
import InstructorProvider from "./context/instructor/instructorContext.jsx";
import AuthProvider from "./context/auth/authContext.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <InstructorProvider>
        <StudentProvider>
          <App />
          <Toaster  position="top-center" />
        </StudentProvider>
      </InstructorProvider>
    </AuthProvider>
  </BrowserRouter>
);