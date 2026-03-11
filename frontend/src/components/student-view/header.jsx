import { GraduationCap, LayoutGrid, Menu, TvMinimalPlay, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth/authContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
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
} from "../ui/alert-dialog";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials, auth } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-4 z-50 backdrop-blur-md bg-black/20 select-none">
      <div className="flex items-center">
        <Link to="/home" className="flex items-center ml-0 md:ml-6">
          <GraduationCap className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-4 text-orange-500" />
          <span className="font-extrabold text-sm md:text-xl tracking-tighter">
            LMS LEARN
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-1 ml-4 line-height-1">
          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
            className="text-[14px] md:text-[16px] font-medium hover:bg-transparent hover:text-orange-500 focus:bg-transparent cursor-pointer"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="text-[14px] md:text-[16px] font-medium hover:bg-transparent hover:text-orange-500 focus:bg-transparent cursor-pointer"
          >
            Explore Courses
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 md:mr-6">
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:bg-zinc-800"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          {auth?.authenticate ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer border border-zinc-800">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-zinc-800 text-white font-bold font-neu-machina">
                    {auth?.user?.userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-950 border border-zinc-900 text-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{auth?.user?.userName}</p>
                    <p className="text-xs leading-none text-zinc-400">
                      {auth?.user?.userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-900" />
                <DropdownMenuGroup>
                {auth?.user?.role === "admin" && (
                  <DropdownMenuItem 
                    onClick={() => navigate("/instructor")}
                    className="cursor-pointer hover:bg-zinc-900"
                  >
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                  <DropdownMenuItem 
                    onClick={() => navigate("/account")}
                    className="cursor-pointer hover:bg-zinc-900"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/student-courses")}
                    className="cursor-pointer hover:bg-zinc-900"
                  >
                    <TvMinimalPlay className="mr-2 h-4 w-4" />
                    <span>My Courses</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-900" />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem 
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-zinc-900"
                    >
                      Logout
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-950 border border-zinc-900 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                        You will need to sign in again to access your courses and account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-white cursor-pointer">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                      >
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="bg-orange-600 hover:bg-orange-700 font-bold cursor-pointer"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[64px] bg-black/95 backdrop-blur-xl z-40 md:hidden flex flex-col p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col space-y-4">
            <Button
              variant="ghost"
              onClick={() => {
                navigate("/home");
                setIsMenuOpen(false);
              }}
              className="justify-start text-lg font-bold py-6 bg-zinc-900/50 hover:bg-zinc-800 border-b border-zinc-800 rounded-none px-4"
            >
              Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                navigate("/courses");
                setIsMenuOpen(false);
              }}
              className="justify-start text-lg font-bold py-6 bg-zinc-900/50 hover:bg-zinc-800 border-b border-zinc-800 rounded-none px-4"
            >
              Explore Courses
            </Button>
            {auth?.user?.role === "admin" && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/instructor");
                    setIsMenuOpen(false);
                  }}
                  className="justify-start text-lg font-bold py-6 bg-zinc-900/50 hover:bg-zinc-800 border-b border-zinc-800 rounded-none px-4"
                >
                  <LayoutGrid className="mr-3 h-5 w-5 text-orange-500" />
                  Admin Dashboard
                </Button>
            )}
          </nav>
          
           {!auth?.authenticate && (
             <Button
               className="mt-8 bg-orange-600 hover:bg-orange-700 font-bold py-6 rounded-xl"
               onClick={() => {
                 navigate("/auth");
                 setIsMenuOpen(false);
               }}
             >
               Sign In / Sign Up
             </Button>
          )}
        </div>
      )}
    </header>
  );
}

export default StudentViewCommonHeader;