import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AuthContext } from "@/context/auth/authContext";
import { InstructorContext } from "@/context/instructor/instructorContext";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut, Menu, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

function InstructorDashboardpage() {
    const [activeTab, setActiveTab] = useState(sessionStorage.getItem('activeTab') || "dashboard");
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const { resetCredentials } = useContext(AuthContext);
    const { instructorCoursesList, setInstructorCoursesList } =
        useContext(InstructorContext);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    async function fetchAllCourses() {
        const response = await fetchInstructorCourseListService();
        if (response?.success) setInstructorCoursesList(response?.data);
    }

    useEffect(() => {
        fetchAllCourses();
    }, []);

    const menuItems = [
        {
            icon: BarChart,
            label: "Dashboard",
            value: "dashboard",
            component: (
                <InstructorDashboard listOfCourses={instructorCoursesList} fetchAllCourses={fetchAllCourses} />
            ),
        },
        {
            icon: Book,
            label: "Courses",
            value: "courses",
            component: <InstructorCourses listOfCourses={instructorCoursesList} fetchAllCourses={fetchAllCourses} />,
        },
        {
            icon: LogOut,
            label: "Logout",
            value: "logout",
            component: null,
        },
    ];

    function handleLogout() {
        resetCredentials();
        toast.success("Logged out successfully");
        sessionStorage.clear();
        navigate("/");
        
    }

    return (
        <div className="flex h-full min-h-screen bg-black text-white relative">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 z-50">
                <h2 className="text-xl font-bold text-white">Admin View</h2>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="text-gray-300 hover:bg-zinc-800 hover:text-white"
                >
                    {showMobileSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </header>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-900 transition-transform duration-300 transform 
                ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"} 
                md:relative md:translate-x-0 md:block
            `}>
                <div className="p-4 h-full flex flex-col pt-20 md:pt-4">
                    <h2 className="text-2xl font-bold mb-6 text-white hidden md:block">
                        Instructor View
                    </h2>

                    <nav className="flex-1">
                        {menuItems.map((menuItem) =>
                            menuItem.value === "logout" ? (
                                <AlertDialog key={menuItem.value}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            className="w-full justify-start mb-2 text-gray-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                                            variant="ghost"
                                        >
                                            <menuItem.icon className="mr-2 h-4 w-4" />
                                            {menuItem.label}
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you sure you want to logout?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-gray-400">
                                                You will be logged out of your admin account.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-gray-200 cursor-pointer">
                                                Cancel
                                            </AlertDialogCancel>

                                            <AlertDialogAction
                                                onClick={handleLogout}
                                                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                            >
                                                Logout
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <Button
                                    key={menuItem.value}
                                    className={`w-full justify-start mb-2  cursor-pointer ${activeTab === menuItem.value
                                            ? "bg-orange-600 hover:bg-orange-700 text-white"
                                            : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                                        }`}
                                    variant="ghost"
                                    onClick={() => {
                                        setActiveTab(menuItem.value);
                                        setShowMobileSidebar(false);
                                    }}
                                >
                                    <menuItem.icon className="mr-2 h-4 w-4" />
                                    {menuItem.label}
                                </Button>
                            )
                        )}
                    </nav>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {showMobileSidebar && (
                <div 
                    className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setShowMobileSidebar(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-black mt-16 md:mt-0">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white capitalize">{activeTab}</h1>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        {menuItems.map((menuItem) => (
                            <TabsContent key={menuItem.value} value={menuItem.value}>
                                {menuItem.component !== null ? menuItem.component : null}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

export default InstructorDashboardpage;