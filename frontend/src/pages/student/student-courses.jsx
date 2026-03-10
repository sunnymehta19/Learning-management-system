import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth/authContext";
import { StudentContext } from "@/context/student/studentContext";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
    const { auth } = useContext(AuthContext);
    const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
        useContext(StudentContext);
    const navigate = useNavigate();

    async function fetchStudentBoughtCourses() {
        const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
        if (response?.success) {
            setStudentBoughtCoursesList(response?.data);
        }
    }

    useEffect(() => {
        fetchStudentBoughtCourses();
    }, []);

    return (
        <div className="p-8 pt-24 bg-linear-to-br from-zinc-950 to-zinc-900 text-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">My Courses</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
                        studentBoughtCoursesList.map((course) => (
                            <Card
                                key={course.id}
                                className="group flex flex-col bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 text-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-orange-900/20"
                            >
                                <CardContent className="p-0 flex-grow relative">
                                    <div className="relative overflow-hidden aspect-video">
                                        <img
                                            src={course?.courseImage}
                                            alt={course?.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="bg-orange-500/90 rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                <Watch className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-2 text-white line-clamp-2 leading-snug group-hover:text-orange-400 transition-colors">
                                            {course?.title}
                                        </h3>
                                        
                                        <div className="flex items-center gap-2 mt-auto">
                                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                                                {course?.instructorName?.charAt(0).toUpperCase()}
                                            </div>
                                            <p className="text-sm text-zinc-400 font-medium capitalize">
                                                {course?.instructorName}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-5 pt-0 mt-auto">
                                    <Button
                                        onClick={() =>
                                            navigate(`/course-progress/${course?.courseId}`)
                                        }
                                        className="w-full bg-zinc-800 hover:bg-orange-600 text-white font-semibold transition-colors duration-300 border-0 cursor-pointer"
                                    >
                                        Start Watching
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                            <h2 className="text-2xl font-bold text-zinc-300 mb-2">No Courses found</h2>
                            <p className="text-zinc-500">You haven't purchased any courses yet.</p>
                            <Button 
                                onClick={() => navigate('/courses')}
                                className="mt-6 bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                            >
                                Explore Courses
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentCoursesPage;

