import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor/instructorContext";
import { deleteCourseService } from "@/services";
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function InstructorCourses({ listOfCourses, fetchAllCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  async function handleDeleteCourse(courseId) {
    const response = await deleteCourseService(courseId);
    if (response?.success) {
      toast.success("Course deleted successfully");
      fetchAllCourses();
    } else {
      toast.error(response?.message || "Failed to delete course");
    }
  }

  return (
    <Card className="bg-zinc-900 border border-zinc-800 text-white">
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold text-white">
          All Courses
        </CardTitle>

        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="p-6 bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
        >
          Create New Course
        </Button>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block overflow-x-auto">
          <Table>

            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Course</TableHead>
                <TableHead className="text-gray-400">Students</TableHead>
                <TableHead className="text-gray-400">Revenue</TableHead>
                <TableHead className="text-right text-gray-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((course) => (
                    <TableRow
                      key={course?._id}
                      className="border-zinc-800 hover:bg-zinc-800/40"
                    >
                      <TableCell className="font-medium text-white">
                        {course?.title}
                      </TableCell>

                      <TableCell className="text-gray-300 pl-8">
                        {course?.students?.length}
                      </TableCell>

                      <TableCell className="text-gray-300">
                        ${course?.students?.length * course?.pricing}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            navigate(`/instructor/edit-course/${course?._id}`);
                          }}
                          
                          size="sm"
                          className="text-gray-300 hover:text-white cursor-pointer"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              className="text-red-400 hover:text-red-500 cursor-pointer"
                            >
                              <Delete className="h-5 w-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                This action cannot be undone. This will permanently delete your
                                course and remove its data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700 border-none cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCourse(course?._id)}
                                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>

          </Table>
        </div>
        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {listOfCourses && listOfCourses.length > 0
            ? listOfCourses.map((course) => (
                <div key={course._id} className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 space-y-3">
                  <div className="text-white font-bold">{course.title}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400">Students</span>
                      <span className="text-gray-200 font-medium">{course?.students?.length}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400">Revenue</span>
                      <span className="text-gray-200 font-medium">${course?.students?.length * course?.pricing}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-zinc-700">
                    <Button
                      onClick={() => navigate(`/instructor/edit-course/${course?._id}`)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50"
                          size="sm"
                        >
                          <Delete className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-white w-[90%] rounded-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            This will permanently delete the course.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-2 mt-4">
                          <AlertDialogCancel className="flex-1 bg-zinc-800 text-white hover:bg-zinc-700 border-none">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCourse(course?._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;