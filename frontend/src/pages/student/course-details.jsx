import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth/authContext";
import { StudentContext } from "@/context/student/studentContext";
import { checkCoursePurchaseInfoService, createPaymentService, fetchStudentViewCourseDetailsService } from "@/services";
import { CheckCircle, Globe, Loader2, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";




function StudentViewCourseDetailsPage() {
    const {
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        loadingState,
        setLoadingState,
    } = useContext(StudentContext);

    const { auth } = useContext(AuthContext);

    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
        useState(null);
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
    const [approvalUrl, setApprovalUrl] = useState("");
    const [isEnrollLoading, setIsEnrollLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    async function fetchStudentViewCourseDetails() {
      
        const response = await fetchStudentViewCourseDetailsService(
            currentCourseDetailsId
        );

        if (response?.success) {
            setStudentViewCourseDetails(response?.data);
            setLoadingState(false);
        } else {
            setStudentViewCourseDetails(null);
            setLoadingState(false);
        }
    }

    function handleSetFreePreview(getCurrentVideoInfo) {
        setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
    }

    async function handleCreatePayment() {
        if (!auth?.authenticate) {
            navigate("/auth");
            return;
        }

        const paymentPayload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            orderStatus: "pending",
            paymentMethod: "paypal",
            paymentStatus: "initiated",
            orderDate: new Date(),
            paymentId: "",
            payerId: "",
            instructorId: studentViewCourseDetails?.instructorId,
            instructorName: studentViewCourseDetails?.instructorName,
            courseImage: studentViewCourseDetails?.image,
            courseTitle: studentViewCourseDetails?.title,
            courseId: studentViewCourseDetails?._id,
            coursePricing: studentViewCourseDetails?.pricing,
        };


        setIsEnrollLoading(true);
        const response = await createPaymentService(paymentPayload);

        if (response.success) {
            sessionStorage.setItem(
                "currentOrderId",
                JSON.stringify(response?.data?.orderId)
            );
            setApprovalUrl(response?.data?.approveUrl);
        } else {
            setIsEnrollLoading(false);
        }
    }

    useEffect(() => {
        if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
    }, [displayCurrentVideoFreePreview]);

    useEffect(() => {
        if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
    }, [currentCourseDetailsId]);

    useEffect(() => {
        if (id) setCurrentCourseDetailsId(id);
    }, [id]);

    useEffect(() => {
        if (!location.pathname.includes("course/details"))
            setStudentViewCourseDetails(null),
                setCurrentCourseDetailsId(null),
                setCoursePurchaseId(null);
    }, [location.pathname]);

    if (loadingState) return <Skeleton />;

    if (approvalUrl !== "") {
        window.location.href = approvalUrl;
    }

    const getIndexOfFreePreviewUrl =
        studentViewCourseDetails !== null
            ? studentViewCourseDetails?.curriculum?.findIndex(
                (item) => item.freePreview
            )
            : -1;

    return (
        <div className="min-h-screen bg-black text-white mx-auto pb-24 md:pb-0">
            {/* Breadcrumbs or Back button could go here */}
            
            <div className="md:px-4 lg:px-8 max-w-7xl mx-auto pt-16 md:pt-24">
            {/* Hero Header */}
            <div className="bg-zinc-900 md:bg-linear-to-br md:from-zinc-900 md:to-zinc-800 md:border md:border-zinc-700/50 text-white p-6 md:p-8 md:rounded-2xl mb-6 md:mb-8">
                <div className="max-w-4xl">
                    <h1 className="text-2xl md:text-4xl font-extrabold mb-3 md:mb-4 tracking-tight">
                        {studentViewCourseDetails?.title}
                    </h1>
                    <p className="text-zinc-400 md:text-zinc-300 text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
                        {studentViewCourseDetails?.subtitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                {studentViewCourseDetails?.instructorName?.charAt(0)}
                            </span>
                            <span>By <span className="text-white font-medium capitalize">{studentViewCourseDetails?.instructorName}</span></span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <span>•</span>
                            <span>Updated {studentViewCourseDetails?.date.split("T")[0]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:inline">•</span>
                            <Globe className="h-4 w-4 text-zinc-500" />
                            <span className="capitalize">{studentViewCourseDetails?.primaryLanguage}</span>
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 px-4 md:px-0">
                {/* Main Content */}
                <main className="grow space-y-6">
                    {/* What you'll learn */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">What you'll learn</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {studentViewCourseDetails?.objectives
                                .split(",")
                                .map((objective, index) => (
                                    <li key={index} className="flex items-start gap-2 text-zinc-300">
                                        <CheckCircle className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                                        <span>{objective.trim()}</span>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    {/* Course Description */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Course Description</h2>
                        <p className="text-zinc-400 leading-relaxed">{studentViewCourseDetails?.description}</p>
                    </div>

                    {/* Course Curriculum */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Course Curriculum</h2>
                        <ul className="space-y-2">
                            {studentViewCourseDetails?.curriculum?.map(
                                (curriculumItem, index) => (
                                    <li
                                        key={index}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                                            curriculumItem?.freePreview
                                                ? "cursor-pointer hover:bg-zinc-800 text-white"
                                                : "cursor-not-allowed text-zinc-500"
                                        }`}
                                        onClick={
                                            curriculumItem?.freePreview
                                                ? () => handleSetFreePreview(curriculumItem)
                                                : null
                                        }
                                    >
                                        {curriculumItem?.freePreview ? (
                                            <PlayCircle className="h-4 w-4 text-orange-400 shrink-0" />
                                        ) : (
                                            <Lock className="h-4 w-4 text-zinc-600 shrink-0" />
                                        )}
                                        <span className="text-sm">{curriculumItem?.title}</span>
                                        {curriculumItem?.freePreview && (
                                            <span className="ml-auto text-xs text-orange-400 font-medium">Preview</span>
                                        )}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </main>

                {/* Sidebar / Enrollment Card */}
                <aside className="w-full md:w-[380px] lg:w-[420px] shrink-0 order-first md:order-last mb-8 md:mb-0">
                    <div
                        className="rounded-2xl overflow-hidden md:sticky md:top-24"
                        style={{
                            background: "linear-gradient(145deg, rgba(39,39,42,0.85), rgba(24,24,27,0.95))",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                        }}
                    >
                        {/* Video Preview */}
                        <div className="aspect-video relative group">
                            <VideoPlayer
                                url={
                                    getIndexOfFreePreviewUrl !== -1
                                        ? studentViewCourseDetails?.curriculum[
                                            getIndexOfFreePreviewUrl
                                          ].videoUrl
                                        : ""
                                }
                                width="100%"
                                height="100%"
                            />
                            {getIndexOfFreePreviewUrl !== -1 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-bold">
                                        Preview this course
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-white font-extrabold text-4xl">
                                    ${studentViewCourseDetails?.pricing}
                                </span>
                                <span className="text-zinc-500 line-through text-lg">${studentViewCourseDetails?.pricing * 2}</span>
                                <span className="text-green-500 font-bold ml-auto text-sm">50% Off</span>
                            </div>
                            
                            <Button
                                onClick={handleCreatePayment}
                                disabled={isEnrollLoading}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 rounded-xl text-lg shadow-lg shadow-orange-950/20 transition-all active:scale-[0.98] hidden md:flex items-center justify-center gap-2"
                            >
                                {isEnrollLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Enroll Now"
                                )}
                            </Button>
                            
                            <div className="mt-6 space-y-3">
                                <p className="text-center text-xs text-zinc-500">30-Day Money-Back Guarantee</p>
                                <div className="text-sm font-medium text-zinc-300">
                                    <p className="mb-2">This course includes:</p>
                                    <ul className="space-y-2 text-zinc-400 font-normal">
                                        <li className="flex items-center gap-2">
                                            <PlayCircle className="h-4 w-4" />
                                            {studentViewCourseDetails?.curriculum?.length} lessons
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            Full lifetime access
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>

            {/* Sticky Mobile Enrollment Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 p-4 z-50 flex items-center justify-between gap-4">
                <div>
                    <span className="text-zinc-500 text-xs block">Total Price</span>
                    <span className="text-white font-bold text-2xl">${studentViewCourseDetails?.pricing}</span>
                </div>
                <Button
                    onClick={handleCreatePayment}
                    disabled={isEnrollLoading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-orange-950-20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isEnrollLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Enroll Now"
                    )}
                </Button>
            </div>

            {/* Free Preview Dialog */}
            <Dialog
                open={showFreePreviewDialog}
                onOpenChange={() => {
                    setShowFreePreviewDialog(false);
                    setDisplayCurrentVideoFreePreview(null);
                }}
            >
                <DialogContent className="w-[800px] bg-zinc-900 border-zinc-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white">Course Preview</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-xl overflow-hidden">
                        <VideoPlayer
                            url={displayCurrentVideoFreePreview}
                            width="100%"
                            height="100%"
                        />
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                        {studentViewCourseDetails?.curriculum
                            ?.filter((item) => item.freePreview)
                            .map((filteredItem) => (
                                <p
                                    key={filteredItem._id}
                                    onClick={() => handleSetFreePreview(filteredItem)}
                                    className="cursor-pointer text-sm font-medium text-zinc-300 hover:text-orange-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-800"
                                >
                                    {filteredItem?.title}
                                </p>
                            ))}
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" className="border-zinc-600 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default StudentViewCourseDetailsPage;