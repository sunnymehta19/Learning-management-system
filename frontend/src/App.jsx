import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import NotFoundPage from "./pages/not-found";
import StudentHomePage from "./pages/student/home";
import StudentCoursesPage from "./pages/student/student-courses";
import AccountPage from "./pages/student/account";
import InstructorDashboardpage from "./pages/instructor";
import { AuthContext } from "./context/auth/authContext";
import RouteGuard from "./components/route-guard";
import AuthPage from "./pages/auth";
import StudentViewCommonLayout from "./components/student-view/common-layout";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route path="/" element={<StudentViewCommonLayout />}>
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route
          path="course/details/:id"
          element={<StudentViewCourseDetailsPage />}
        />
        <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route
          path="course-progress/:id"
          element={<StudentViewCourseProgressPage />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;