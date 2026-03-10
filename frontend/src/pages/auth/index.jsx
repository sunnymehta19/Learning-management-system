import CommonForm from "@/components/common-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth/authContext";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
    const [activeTab, setActiveTab] = useState("signin");
    const {
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
    } = useContext(AuthContext);

    function handleTabChange(value) {
        setActiveTab(value);
    }

    async function handleSignUpSubmit(event) {
        const data = await handleRegisterUser(event);

        if (data?.success) {
            setActiveTab("signin");
        }
    }

    function checkIfSignInFormIsValid() {
        return (
            signInFormData &&
            signInFormData.userEmail !== "" &&
            signInFormData.password !== ""
        );
    }

    function checkIfSignUpFormIsValid() {
        return (
            signUpFormData &&
            signUpFormData.userName !== "" &&
            signUpFormData.userEmail !== "" &&
            signUpFormData.password !== ""
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-black text-white relative">

            {/* Header */}
            <div className="absolute left-4 top-5">
                <Link to={"/"} className="flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 mr-4" />
                    <span className="font-extrabold text-xl text-white">
                        LMS LEARN
                    </span>
                </Link>
            </div>


            {/* Auth Section */}
            <div className="flex items-center justify-center min-h-screen bg-black">
                <Tabs
                    value={activeTab}
                    defaultValue="signin"
                    onValueChange={handleTabChange}
                    className="w-full max-w-md"
                >
                    {/* Tabs */}
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800 text-white">
                        <TabsTrigger
                            value="signin"
                            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-white hover:text-white cursor-pointer"
                        >
                            Sign In
                        </TabsTrigger>
                        <TabsTrigger
                            value="signup"
                            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-white hover:text-white cursor-pointer"
                        >
                            Sign Up
                        </TabsTrigger>
                    </TabsList>

                    {/* Sign In */}
                    <TabsContent value="signin">
                        <Card className="p-6 space-y-4 bg-zinc-900 border border-zinc-800 text-white">
                            <CardHeader>
                                <CardTitle className="text-xl text-center">
                                    Sign in to your account
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Enter your email and password to access your account
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-2">
                                <CommonForm
                                    formControls={signInFormControls}
                                    buttonText={"Sign In"}
                                    formData={signInFormData}
                                    setFormData={setSignInFormData}
                                    isButtonDisabled={!checkIfSignInFormIsValid()}
                                    handleSubmit={handleLoginUser}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Sign Up */}
                    <TabsContent value="signup">
                        <Card className="p-6 space-y-4 bg-zinc-900 border border-zinc-800 text-white">
                            <CardHeader>
                                <CardTitle className="text-xl text-center">
                                    Create a new account
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Enter your details to get started
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-2 pb-3">
                                <CommonForm
                                    formControls={signUpFormControls}
                                    buttonText={"Sign Up"}
                                    formData={signUpFormData}
                                    setFormData={setSignUpFormData}
                                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                                    handleSubmit={handleSignUpSubmit}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default AuthPage;