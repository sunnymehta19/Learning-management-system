import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth/authContext";
import { StudentContext } from "@/context/student/studentContext";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDown, BookOpen, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function CourseCard({ courseItem, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "linear-gradient(145deg, rgba(39,39,42,0.75) 0%, rgba(24,24,27,0.85) 100%)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Orange glow border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(249,115,22,0.45), 0 8px 32px rgba(249,115,22,0.08)" }}
      />

      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={courseItem?.image}
          alt={courseItem?.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/70 via-transparent to-transparent" />
        {/* Level badge — frosted */}
        <span
          className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide"
          style={{
            background: "rgba(249,115,22,0.85)",
            backdropFilter: "blur(6px)",
            color: "#fff",
          }}
        >
          {courseItem?.level}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 relative">
        {/* Top shimmer line */}
        <div className="absolute top-0 left-5 right-5 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {/* Category tags — frosted */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full capitalize"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#a1a1aa",
            }}
          >
            {courseItem?.category?.replace(/-/g, " ")}
          </span>
          <span
            className="text-xs px-2.5 py-0.5 rounded-full capitalize"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#a1a1aa",
            }}
          >
            {courseItem?.primaryLanguage}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors duration-200 truncate">
          {courseItem?.title}
        </h3>

        {/* Instructor */}
        <p className="text-zinc-400 text-sm mb-3">
          by{" "}
          <span className="text-zinc-300 font-medium">
            {courseItem?.instructorName}
          </span>
        </p>

        {/* Lectures */}
        <div className="flex items-center gap-1.5 text-zinc-400 text-sm mb-4">
          <BookOpen className="h-4 w-4 text-orange-400/60" />
          <span>
            {courseItem?.curriculum?.length}{" "}
            {courseItem?.curriculum?.length <= 1 ? "Lecture" : "Lectures"}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-4" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-xs">Price</span>
            <p className="text-white font-bold text-xl">${courseItem?.pricing}</p>
          </div>
          <div className="flex items-center gap-1 text-orange-400 text-sm font-semibold group-hover:gap-2 transition-all duration-200">
            Check Course
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-zinc-800 rounded w-1/3" />
        <div className="h-5 bg-zinc-800 rounded w-3/4" />
        <div className="h-4 bg-zinc-800 rounded w-1/2" />
        <div className="h-4 bg-zinc-800 rounded w-1/4" />
        <div className="flex justify-between mt-4">
          <div className="h-6 bg-zinc-800 rounded w-16" />
          <div className="h-6 bg-zinc-800 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = { ...cpyFilters, [getSectionId]: [getCurrentOption.id] };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id);
      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({ ...filters, sortBy: sort });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    // If user is not logged in, go straight to course details
    if (!auth?.user?._id) {
      navigate(`/course/details/${getCurrentCourseId}`);
      return;
    }

    try {
      const response = await checkCoursePurchaseInfoService(
        getCurrentCourseId,
        auth?.user?._id
      );
      if (response?.success && response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    } catch (error) {
      // If the API call fails for any reason, still navigate to course details
      navigate(`/course/details/${getCurrentCourseId}`);
    }
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    const storedFilters = JSON.parse(sessionStorage.getItem("filters"));
    if (storedFilters) {
      setFilters(storedFilters);
    }
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  // Count active filters
  const activeFilterCount = Object.values(filters).flat().length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden md:block w-64 shrink-0">
            {sidebarOpen && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sticky top-24 space-y-6">
                <FilterContent 
                  filters={filters} 
                  handleFilterOnChange={handleFilterOnChange}
                  setFilters={setFilters}
                  activeFilterCount={activeFilterCount}
                />
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top bar: toggle sidebar + sort */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden md:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors border border-zinc-700 rounded-lg px-3 py-2 hover:border-zinc-500"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {sidebarOpen ? "Hide Filters" : "Show Filters"}
                </button>

                {/* Mobile Filter Trigger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="md:hidden flex items-center gap-2 bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] bg-zinc-950 border-zinc-800 p-0 overflow-y-auto">
                    <SheetHeader className="p-6 border-b border-zinc-900">
                      <SheetTitle className="text-white flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-orange-500" />
                        Course Filters
                      </SheetTitle>
                    </SheetHeader>
                    <div className="p-6">
                      <FilterContent 
                        filters={filters} 
                        handleFilterOnChange={handleFilterOnChange}
                        setFilters={setFilters}
                        activeFilterCount={activeFilterCount}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-zinc-400 text-sm hidden sm:block">
                  {studentViewCoursesList.length} Results
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="font-medium">Sort By</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[200px] bg-zinc-900 border-zinc-700 text-white"
                  >
                    <DropdownMenuRadioGroup
                      value={sort}
                      onValueChange={(value) => setSort(value)}
                    >
                      {sortOptions.map((sortItem) => (
                        <DropdownMenuRadioItem
                          key={sortItem.id}
                          value={sortItem.id}
                          className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer hover:text-white focus:text-white"
                        >
                          {sortItem.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Course Grid */}
            {loadingState ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {studentViewCoursesList.map((courseItem) => (
                  <CourseCard
                    key={courseItem?._id}
                    courseItem={courseItem}
                    onClick={() => handleCourseNavigate(courseItem?._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold text-white mb-2">No Courses Found</h2>
                <p className="text-zinc-400 mb-6 max-w-sm">
                  Try adjusting your filters or search with different keywords.
                </p>
                <button
                  onClick={() => {
                    setFilters({});
                    sessionStorage.removeItem("filters");
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function FilterContent({ filters, handleFilterOnChange, setFilters, activeFilterCount }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-orange-400" />
          <span className="font-bold text-white text-sm">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              setFilters({});
              sessionStorage.removeItem("filters");
            }}
            className="text-xs text-zinc-400 hover:text-orange-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {Object.keys(filterOptions).map((keyItem) => (
        <div key={keyItem}>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
            {keyItem === "primaryLanguage" ? "Language" : keyItem}
          </h3>
          <div className="space-y-2">
            {filterOptions[keyItem].map((option) => {
              const isChecked =
                filters &&
                Object.keys(filters).length > 0 &&
                filters[keyItem] &&
                filters[keyItem].indexOf(option.id) > -1;
              return (
                <Label
                  key={option.id}
                  className="flex items-center gap-3 cursor-pointer group/label"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() =>
                      handleFilterOnChange(keyItem, option)
                    }
                    className="border-zinc-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <span
                    className={`text-sm transition-colors ${
                      isChecked
                        ? "text-white font-medium"
                        : "text-zinc-400 group-hover/label:text-zinc-200"
                    }`}
                  >
                    {option.label}
                  </span>
                </Label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StudentViewCoursesPage;