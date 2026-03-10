import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";
import Footer from "./footer";

function StudentViewCommonLayout() {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      {!location.pathname.includes("course-progress") ? (
        <StudentViewCommonHeader />
      ) : null}

      <main className="grow">
        <Outlet />
      </main>

      {!location.pathname.includes("course-progress") && !location.pathname.includes("courses") ? (
        <Footer />
      ) : null}
    </div>
  );
}

export default StudentViewCommonLayout;