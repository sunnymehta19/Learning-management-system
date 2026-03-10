import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, Star, NotebookText } from "lucide-react";
import { updateCourseByIdService } from "@/services";
import { toast } from "sonner";

function InstructorDashboard({ listOfCourses, fetchAllCourses }) {
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );

    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  const stats = calculateTotalStudentsAndProfit();

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: stats.totalProfit,
    },
  ];

  async function handleToggleFeature(course) {
    const response = await updateCourseByIdService(course._id, {
      ...course,
      isFeatured: !course.isFeatured,
    });
    if (response?.success) {
      if (fetchAllCourses) fetchAllCourses();
      toast.success(course.isFeatured ? "Course removed from featured" : "Course marked as featured");
    } else {
      toast.error("Failed to update featured status");
    }
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {config.map((item, index) => (
          <Card
            key={index}
            className="bg-zinc-900 border border-zinc-800 text-white"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {item.label}
              </CardTitle>

              <item.icon className="h-5 w-5 text-gray-400" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-white">
                {item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
 
      {/* Featured Courses Management */}
      <Card className="bg-zinc-900 border border-zinc-800 text-white mb-8">
        <CardHeader>
          <CardTitle className="text-white">Manage Featured Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">Course Name</TableHead>
                  <TableHead className="text-gray-400 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listOfCourses.map((course) => (
                  <TableRow key={course._id} className="border-zinc-800 hover:bg-transparent" >
                    <TableCell className="font-medium text-white ">
                      <div className="flex items-center gap-2">
                        {course.isFeatured && (
                          <NotebookText className="h-4 w-4" />
                        )}
                        {course.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-right ">
                      <Button
                        onClick={() => handleToggleFeature(course)}
                        variant="outline"
                        className={
                          course.isFeatured
                            ? "border-red-600 text-red-500 hover:bg-red-600/10 hover:text-red-500 bg-transparent cursor-pointer"
                            : "border-green-600 text-green-500 hover:bg-green-600/10 hover:text-green-500 bg-transparent cursor-pointer"
                        }
                      >
                        {course.isFeatured ? "Remove from Featured" : "Make Featured"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {listOfCourses.map((course) => (
              <div key={course._id} className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-white font-bold">
                  {course.isFeatured && <NotebookText className="h-4 w-4 text-orange-500" />}
                  {course.title}
                </div>
                <Button
                  onClick={() => handleToggleFeature(course)}
                  variant="outline"
                  className={`w-full ${
                    course.isFeatured
                      ? "border-red-600 text-red-500 hover:bg-red-600/10 bg-transparent"
                      : "border-green-600 text-green-500 hover:bg-green-600/10 bg-transparent"
                  }`}
                >
                  {course.isFeatured ? "Remove from Featured" : "Make Featured"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="bg-zinc-900 border border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-white">Students List</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="hidden md:block overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">Course Name</TableHead>
                  <TableHead className="text-gray-400">Student Name</TableHead>
                  <TableHead className="text-gray-400">Student Email</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {stats.studentList.map((studentItem, index) => (
                  <TableRow key={index} className="border-zinc-800 hover:bg-transparent ">
                    <TableCell className="font-medium text-white">
                      {studentItem.courseTitle}
                    </TableCell>

                    <TableCell className="text-gray-300 capitalize">
                      {studentItem.studentName}
                    </TableCell>

                    <TableCell className="text-gray-300">
                      {studentItem.studentEmail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {stats.studentList.map((studentItem, index) => (
              <div key={index} className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 space-y-2">
                <div className="text-white font-bold">{studentItem.courseTitle}</div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Student:</span>
                  <span className="text-gray-200 capitalize">{studentItem.studentName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-gray-200">{studentItem.studentEmail}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;