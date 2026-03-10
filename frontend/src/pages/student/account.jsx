import { useContext } from "react";
import { AuthContext } from "@/context/auth/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Settings, 
  BookOpen, 
  LogOut,
  Mail,
  Phone,
  Calendar,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AccountPage() {
  const { auth, resetCredentials } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 md:pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 pb-8 border-b border-zinc-900">
          <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-zinc-800 ring-4 ring-orange-500/10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-zinc-900 text-2xl md:text-3xl font-bold text-orange-500">
              {auth?.user?.userName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight capitalize">{auth?.user?.userName}</h1>
            <p className="text-zinc-500 flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
              <Mail className="h-4 w-4" /> {auth?.user?.userEmail}
            </p>
            <div className="pt-2">
               <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-[10px] md:text-xs font-medium text-orange-400 ring-1 ring-inset ring-orange-500/20 uppercase tracking-wider">
                 {auth?.user?.role === "user" ? "Student Account" : "Instructor Account"}
               </span>
            </div>
          </div>
          <Button 
             onClick={handleLogout}
             className="w-full md:w-auto border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-red-400 gap-2 cursor-pointer transition-all mt-2 md:mt-0"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>

        {/* Profile Content Only */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card className="bg-zinc-950 border border-zinc-900">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription className="text-zinc-500">Update your account details and profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">User Name</Label>
                  <Input 
                    className="bg-black border-zinc-800 h-11 focus:border-orange-500/50 transition-colors text-white capitalize" 
                    defaultValue={auth?.user?.userName} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Email Address</Label>
                  <Input 
                    className="bg-black border-zinc-800 h-11 opacity-60 text-white" 
                    defaultValue={auth?.user?.userEmail} 
                    readOnly
                  />
                </div>
               
              
              </div>
              
              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
