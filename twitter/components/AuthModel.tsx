/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X } from "lucide-react";
import TwitterLogo from "./TwitterLogo";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const AuthModel = ({ isopen, onclose, initialmode = "login" }: any) => {
  const [mode, setMode] = useState<"login" | "signup">(initialmode);
  const { login, signup, isLoading } = useAuth();
  const [showpassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    displayName: "",
    phone: "",
  });

  const [error, setError] = useState<any>({});
  if (!isopen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (mode === "signup") {
      if (!formData.username.trim())
        newErrors.username = "Username is required";

      if (!formData.displayName.trim())
        newErrors.displayName = "Display name is required";

      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^[0-9]{10,15}$/.test(formData.phone))
        newErrors.phone = "Enter valid phone number";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        onclose();
      } else {
        await signup(
          formData.email,
          formData.password,
          formData.username,
          formData.displayName,
        );
        onclose();
        setFormData({
          email: "",
          password: "",
          username: "",
          displayName: "",
          phone: "",
        });
      }
    } catch {
      setError({ general: "Authentication failed. Please try again" });
    }
  };

  const handleInputchange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error[field]) setError((prev: any) => ({ ...prev, [field]: "" }));
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError({});
    setFormData({
      email: "",
      password: "",
      username: "",
      displayName: "",
      phone: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <Card
        className="
      w-full
      max-w-md
      max-h-[92vh]
      overflow-y-auto
      bg-black
      border-gray-800
      text-white
      rounded-xl
    "
      >
        {/* HEADER */}
        <CardHeader className="relative pb-4 sm:pb-6">
          <Button
            variant="ghost"
            onClick={onclose}
            size="icon"
            className="absolute right-2 top-2 sm:right-4 sm:top-4 text-white"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <div className="text-center">
            <div className="mb-4 sm:mb-6 flex justify-center">
              <TwitterLogo size="lg" className="text-white sm:scale-110" />
            </div>

            <CardTitle className="text-xl sm:text-2xl font-bold">
              {mode === "login" ? "Sign in to X" : "Create your account"}
            </CardTitle>
          </div>
        </CardHeader>

        {/* BODY */}
        <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6">
          {error.general && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
              {error.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {mode === "signup" && (
              <>
                <Input
                  placeholder="Display Name"
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputchange("displayName", e.target.value)
                  }
                />

                <Input
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputchange("username", e.target.value)
                  }
                />

                <Input
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputchange("phone", e.target.value)}
                />
                {error.phone && (
                  <p className="text-red-400 text-sm">{error.phone}</p>
                )}
              </>
            )}

            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputchange("email", e.target.value)}
            />

            <Input
              type={showpassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputchange("password", e.target.value)}
            />

            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-blue-400 hover:underline text-xs sm:text-sm"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-500 rounded-full py-2.5 sm:py-3 text-sm sm:text-base"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <Separator />

          <p className="text-center text-gray-400 text-sm">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <Button
              variant="link"
              onClick={switchMode}
              className="text-blue-400 text-sm"
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModel;
