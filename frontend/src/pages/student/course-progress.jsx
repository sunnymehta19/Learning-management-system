import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth/authContext";
import { StudentContext } from "@/context/student/studentContext";
import {
    getCurrentCourseProgressService,
    getLectureVideoUrlService,
    markLectureAsViewedService,
    resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Lock, Play, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
        useContext(StudentContext);
    const [lockCourse, setLockCourse] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
        useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [videoUrl, setVideoUrl] = useState(null);
    const { id } = useParams();

    async function fetchCurrentCourseProgress() {
        const response = await getCurrentCourseProgressService(auth?.user?._id, id);
        if (response?.success) {
            if (!response?.data?.isPurchased) {
                setLockCourse(true);
            } else {
                setStudentCurrentCourseProgress({
                    courseDetails: response?.data?.courseDetails,
                    progress: response?.data?.progress,
                });

                if (response?.data?.completed) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                    setShowCourseCompleteDialog(true);
                    setShowConfetti(true);

                    return;
                }

                if (response?.data?.progress?.length === 0) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                } else {
                    const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
                        (acc, obj, index) => {
                            return acc === -1 && obj.viewed ? index : acc;
                        },
                        -1
                    );

                    setCurrentLecture(
                        response?.data?.courseDetails?.curriculum[
                        lastIndexOfViewedAsTrue + 1
                        ]
                    );
                }
            }
        }
    }

    async function updateCourseProgress() {
        if (currentLecture) {
            const response = await markLectureAsViewedService(
                auth?.user?._id,
                studentCurrentCourseProgress?.courseDetails?._id,
                currentLecture._id
            );

            if (response?.success) {
                fetchCurrentCourseProgress();
            }
        }
    }

    async function fetchLectureVideoUrl(courseId, lectureId) {
        const response = await getLectureVideoUrlService(courseId, lectureId);
        if (response?.success) {
            setVideoUrl(response?.data?.videoUrl);
        }
    }

    async function handleRewatchCourse() {
        const response = await resetCourseProgressService(
            auth?.user?._id,
            studentCurrentCourseProgress?.courseDetails?._id
        );

        if (response?.success) {
            setCurrentLecture(null);
            setShowConfetti(false);
            setShowCourseCompleteDialog(false);
            fetchCurrentCourseProgress();
        }
    }

    useEffect(() => {
        fetchCurrentCourseProgress();
    }, [id]);

    useEffect(() => {
        if (currentLecture?.progressValue === 1) updateCourseProgress();
        if (currentLecture && studentCurrentCourseProgress?.courseDetails?._id) {
            fetchLectureVideoUrl(studentCurrentCourseProgress?.courseDetails?._id, currentLecture?._id);
        }
    }, [currentLecture]);

    useEffect(() => {
        if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
    }, [showConfetti]);


    return (
        <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
            {showConfetti && <Confetti />}
            <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={() => navigate("/student-courses")}
                        className="text-white bg-orange-600 hover:bg-orange-700 cursor-pointer"

                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4 " />
                        BACK
                    </Button>
                    <h1 className="text-lg font-bold hidden md:block">
                        {studentCurrentCourseProgress?.courseDetails?.title}
                    </h1>
                </div>
                <Button 
                    className="cursor-pointer md:flex " 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsSideBarOpen(!isSideBarOpen)}
                >
                    {isSideBarOpen ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </Button>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div
                    className={`flex-1 ${isSideBarOpen ? "md:mr-[400px]" : ""
                        } transition-all duration-300 flex flex-col`}
                >
                    {/* Video Player Wrapper */}
                    <div className="relative bg-black shadow-2xl h-[400px] md:h-[600px] lg:h-[700px]">
                        {videoUrl ? (
                            <VideoPlayer
                                width="100%"
                                height="100%"
                                url={videoUrl}
                                onProgressUpdate={setCurrentLecture}
                                progressData={currentLecture}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400">Loading video...</p>
                            </div>
                        )}
                    </div>

                    {/* Mobile Only: Title below video player */}
                    <div className="md:hidden p-4 bg-[#1c1d1f] border-b border-gray-700">
                        <h2 className="text-xl font-bold text-white">{currentLecture?.title}</h2>
                    </div>

                    {/* Mobile Only: Tabs below video */}
                    <div className="md:hidden flex-1 overflow-y-auto bg-[#1c1d1f] border-t border-gray-700">
                        <Tabs defaultValue="content" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-800 rounded-none h-14 p-0">
                                <TabsTrigger value="content" className=" text-white bg-zinc-700 hover:text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-none h-full">Content</TabsTrigger>
                                <TabsTrigger value="overview" className=" text-white bg-zinc-700 hover:text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-none h-full">Overview</TabsTrigger>
                            </TabsList>
                            <TabsContent value="content" className="p-0 m-0">
                                <ScrollArea className="h-[calc(100vh-450px)]">
                                    <div className="p-4 space-y-2">
                                        {studentCurrentCourseProgress?.courseDetails?.curriculum?.map((item) => (
                                            <div
                                                key={item._id}
                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                                    item._id === currentLecture?._id 
                                                    ? "bg-orange-500/20 border border-orange-500/30" 
                                                    : "hover:bg-gray-800 border border-transparent"
                                                }`}
                                                onClick={() => {
                                                    setCurrentLecture(item);
                                                }}
                                            >
                                                {studentCurrentCourseProgress?.progress?.find(
                                                    (progressItem) => progressItem.lectureId === item._id
                                                )?.viewed ? (
                                                    <Check className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <PlayCircle className={`h-5 w-5 ${item._id === currentLecture?._id ? "text-orange-500" : "text-gray-500"}`} />
                                                )}
                                                <span className={`text-sm font-medium ${
                                                    item._id === currentLecture?._id ? "text-orange-400" : "text-gray-300"
                                                }`}>
                                                    {item.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                            <TabsContent value="overview" className="p-6 m-0 text-gray-300">
                                <h3 className="text-xl font-bold text-white mb-4">About this course</h3>
                                <p className="leading-relaxed">
                                    {studentCurrentCourseProgress?.courseDetails?.description}
                                </p>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="p-6 bg-[#1c1d1f] flex-1 hidden md:block">
                        <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
                    </div>
                </div>
                <div
                    className={`fixed top-[64px] right-0 bottom-0 w-full sm:w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 z-50 hidden md:block ${isSideBarOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="flex md:hidden items-center justify-between p-4 border-b border-gray-700">
                        <h2 className="font-bold">Course Content</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsSideBarOpen(false)}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                    <Tabs defaultValue="content" className="h-full flex flex-col">
                        <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
                            <TabsTrigger
                                value="content"
                                className=" text-white bg-zinc-700 hover:text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-none h-full"
                            >
                                Course Content
                            </TabsTrigger>
                            <TabsTrigger
                                value="overview"
                                className=" text-white bg-zinc-700 hover:text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-none h-full"
                            >
                                Overview
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="content">
                            <ScrollArea className="h-full">
                                <div className="p-4 space-y-2">
                                    {studentCurrentCourseProgress?.courseDetails?.curriculum?.map(
                                        (item) => {
                                            const isCurrent = currentLecture?._id === item._id;
                                            return (
                                                <div
                                                    className={`flex items-center space-x-2 text-sm font-bold cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
                                                        isCurrent ? "bg-zinc-800 text-orange-400" : "text-white hover:bg-zinc-800/50"
                                                    }`}
                                                    key={item._id}
                                                    onClick={() => setCurrentLecture(item)}
                                                >
                                                    {studentCurrentCourseProgress?.progress?.find(
                                                        (progressItem) => progressItem.lectureId === item._id
                                                    )?.viewed ? (
                                                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                                                    ) : (
                                                        <Play className={`h-4 w-4 shrink-0 ${isCurrent ? "text-orange-400" : "text-gray-400"}`} />
                                                    )}
                                                    <span className="line-clamp-2">{item?.title}</span>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="overview" className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-4">About this course</h2>
                                    <p className="text-gray-400 leading-relaxed">
                                        {studentCurrentCourseProgress?.courseDetails?.description}
                                    </p>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Dialog open={lockCourse}>
                <DialogContent className="sm:w-[425px] bg-zinc-900">
                    <DialogHeader>
                        <DialogTitle>You can't view this page</DialogTitle>
                        <DialogDescription>
                            Please purchase this course to get access
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={showCourseCompleteDialog}>
                <DialogContent showCloseButton={false} showOverlay={false} className="sm:w-[425px] bg-zinc-900">
                    <DialogHeader>
                        <DialogTitle>Congratulations!</DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You have completed the course</Label>
                            <div className="flex flex-row gap-3">
                                <Button className="bg-orange-600 hover:bg-orange-700 cursor-pointer" onClick={() => navigate("/student-courses")}>
                                    My Courses Page
                                </Button>
                                <Button className="bg-orange-600 hover:bg-orange-700 cursor-pointer" onClick={handleRewatchCourse}>Rewatch Course</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default StudentViewCourseProgressPage;