import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import {
    checkCoursePurchaseInfoService,
    fetchStudentViewCourseListService,
} from "@/services"; 
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth/authContext";
import { StudentContext } from "@/context/student/studentContext";
import HeroSection from "@/components/student-view/hero-section";
import { 
    Layout, 
    Database, 
    BarChart4, 
    Cpu, 
    Brain, 
    Cloud, 
    Shield, 
    Smartphone, 
    Gamepad2, 
    Layers,
    ArrowRight
} from "lucide-react";
import HomePageSkeleton from "@/components/student-view/homepage-skeleton";



const categoryIconMap = {
    'web-development': Layout,
    'backend-development': Database,
    'data-science': BarChart4,
    'machine-learning': Cpu,
    'artificial-intelligence': Brain,
    'cloud-computing': Cloud,
    'cyber-security': Shield,
    'mobile-development': Smartphone,
    'game-development': Gamepad2,
    'software-engineering': Layers
};

function StudentHomePage() {
    const { studentViewCoursesList, setStudentViewCoursesList, loadingState, setLoadingState } =
        useContext(StudentContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleNavigateToCoursesPage(getCurrentId) {
        sessionStorage.removeItem("filters");
        const currentFilter = {
            category: [getCurrentId],
        };

        sessionStorage.setItem("filters", JSON.stringify(currentFilter));

        navigate("/courses");
    }

    async function fetchAllStudentViewCourses() {
        setLoadingState(true);
        const response = await fetchStudentViewCourseListService();
        if (response?.success) setStudentViewCoursesList(response?.data);
        setLoadingState(false);
    }

    async function handleCourseNavigate(getCurrentCourseId) {
        if (!auth?.authenticate) {
            navigate(`/course/details/${getCurrentCourseId}`);
            return;
        }
        const response = await checkCoursePurchaseInfoService(
            getCurrentCourseId,
            auth?.user?._id
        );

        if (response?.success) {
            if (response?.data) {
                navigate(`/course-progress/${getCurrentCourseId}`);
            } else {
                navigate(`/course/details/${getCurrentCourseId}`);
            }
        }
    }

    useEffect(() => {
        fetchAllStudentViewCourses();
    }, []);

    // Filter to only show featured courses
    const featuredCourses = studentViewCoursesList && studentViewCoursesList.length > 0
        ? studentViewCoursesList.filter(course => course.isFeatured)
        : [];

    if (loadingState) return <HomePageSkeleton />;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* hero section */}
            <HeroSection />

            {/* Course Categories */}
            <section className="py-16 px-4 lg:px-8 bg-black  border-zinc-900 select-none">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-extrabold mb-8 text-white tracking-tight">Explore Categories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {courseCategories.map((categoryItem) => {
                            const IconComponent = categoryIconMap[categoryItem.id] || Layout;
                            return (
                                <button
                                    key={categoryItem.id}
                                    onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
                                    className="flex flex-col items-center justify-center p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                                >
                                    <div className="p-3 rounded-xl bg-zinc-800/50 group-hover:bg-orange-500/20 mb-4 transition-colors">
                                        <IconComponent className="h-8 w-8 text-zinc-400 group-hover:text-orange-400 transition-colors" />
                                    </div>
                                    <span className="font-bold text-zinc-300 group-hover:text-white text-center">
                                        {categoryItem.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="bg-black py-20 px-4 lg:px-8 select-none">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Featured Courses</h2>
                            <p className="text-zinc-400">Hand-picked premium content to elevate your skills.</p>
                        </div>
                        <Button 
                            variant="ghost" 
                            onClick={() => navigate('/courses')}
                            className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 transition-colors cursor-pointer hidden sm:flex items-center gap-2"
                        >
                            View all courses
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCourses && featuredCourses.length > 0 ? (
                            featuredCourses.map((courseItem) => (
                                <div
                                    key={courseItem?._id}
                                    onClick={() => handleCourseNavigate(courseItem?._id)}
                                    className="group flex flex-col bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-zinc-700 hover:shadow-2xl hover:shadow-orange-900/20"
                                >
                                    <div className="relative overflow-hidden aspect-video">
                                        <img
                                            src={courseItem?.image}
                                            alt={courseItem?.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="bg-orange-500/90 text-white font-bold px-6 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                View Course
                                            </div>
                                        </div>
                                        {/* Price tag */}
                                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-zinc-700 text-white font-bold px-3 py-1 rounded-lg">
                                            ${courseItem?.pricing}
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex flex-col grow">
                                        <h3 className="font-bold text-xl mb-3 text-white line-clamp-2 leading-tight group-hover:text-orange-400 transition-colors">
                                            {courseItem?.title}
                                        </h3>
                                        
                                        <div className="mt-auto flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                                                {courseItem?.instructorName?.charAt(0).toUpperCase()}
                                            </div>
                                            <p className="text-sm text-zinc-400 font-medium">
                                                {courseItem?.instructorName}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                                <h1 className="text-2xl font-bold text-zinc-300 mb-2">No Featured Courses Yet</h1>
                                <p className="text-zinc-500 mb-6">Instructors haven't picked any featured courses at this time.</p>
                                <Button 
                                    onClick={() => navigate('/courses')}
                                    className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                                >
                                    Browse All Courses
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/courses')}
                        className="w-full mt-8 border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer sm:hidden py-6 rounded-xl font-bold"
                    >
                        View all courses
                    </Button>
                </div>
            </section>
        </div>
    );
}

export default StudentHomePage;