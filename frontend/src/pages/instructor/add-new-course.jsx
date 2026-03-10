import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseCurriculumInitialFormData, courseLandingInitialFormData, } from "@/config";
import { AuthContext } from "@/context/auth/authContext";
import { InstructorContext } from "@/context/instructor/instructorContext";
import { addNewCourseService, fetchInstructorCourseDetailsService, updateCourseByIdService } from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";



import { toast } from "sonner";

function AddNewCoursePage() {
    const {
        courseLandingFormData,
        courseCurriculumFormData,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        currentEditedCourseId,
        setCurrentEditedCourseId,
    } = useContext(InstructorContext);

    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();



    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        }

        return value === "" || value === null || value === undefined;
    }

    function validateFormData() {
        for (const key in courseLandingFormData) {
            if (isEmpty(courseLandingFormData[key])) {
                return false;
            }
        }

        let hasFreePreview = false;

        for (const item of courseCurriculumFormData) {
            if (
                isEmpty(item.title) ||
                isEmpty(item.videoUrl) ||
                isEmpty(item.public_id)
            ) {
                return false;
            }

            if (item.freePreview) {
                hasFreePreview = true; //found at least one free preview
            }
        }

        return hasFreePreview;
    }

    async function handleCreateCourse() {
        const courseFinalFormData = {
            instructorId: auth?.user?._id,
            instructorName: auth?.user?.userName,
            date: new Date(),
            ...courseLandingFormData,
            students: [],
            curriculum: courseCurriculumFormData,
            isPublised: true,
        };

        const response =
            currentEditedCourseId !== null
                ? await updateCourseByIdService(
                    currentEditedCourseId,
                    courseFinalFormData
                )
                : await addNewCourseService(courseFinalFormData);

        if (response?.success) {
            toast.success(currentEditedCourseId !== null ? "Course updated successfully!" : "Course created successfully!");
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate(-1);
            setCurrentEditedCourseId(null);
        } else {
            toast.error(response?.message || "Failed to save course. Please try again.");
        }

    
    }

    async function fetchCurrentCourseDetails() {
        const response = await fetchInstructorCourseDetailsService(
            currentEditedCourseId
        );

        if (response?.success) {
            const setCourseFormData = Object.keys(
                courseLandingInitialFormData
            ).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key];

                return acc;
            }, {});

    
            setCourseLandingFormData(setCourseFormData);
            setCourseCurriculumFormData(response?.data?.curriculum);
        }


    }

    useEffect(() => {
        if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
    }, [currentEditedCourseId]);

    useEffect(() => {
        if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
    }, [params?.courseId]);


    return (
        <div className="container mx-auto p-4 mt-10">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-neu-machina">Create a new course</h1>
                <Button
                    disabled={!validateFormData()}
                    className="w-full sm:w-auto text-sm tracking-wider font-extrabold px-8 bg-orange-500 hover:bg-orange-600"
                    onClick={handleCreateCourse}
                >
                    SUBMIT
                </Button>
            </div>
            <Card className="bg-black">
                <CardContent>
                    <div className="container mx-auto p-4 bg-black">
                        <Tabs defaultValue="curriculum" className="space-y-4 ">
                            <TabsList className="bg-zinc-800 w-full justify-start overflow-x-auto overflow-y-hidden flex h-auto p-1 no-scrollbar">
                                <TabsTrigger className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-white hover:text-white font-semibold shrink-0" value="curriculum">Curriculum</TabsTrigger>
                                <TabsTrigger className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-white hover:text-white font-semibold shrink-0" value="course-landing-page">Course Landing Page</TabsTrigger>
                                <TabsTrigger className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-white hover:text-white font-semibold shrink-0" value="settings">Settings</TabsTrigger>
                            </TabsList>
                            <TabsContent value="curriculum">
                                <CourseCurriculum />
                            </TabsContent>
                            <TabsContent value="course-landing-page">
                                <CourseLanding />
                            </TabsContent>
                            <TabsContent value="settings">
                                <CourseSettings />
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AddNewCoursePage;