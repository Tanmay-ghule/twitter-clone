/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/AuthContext";
import { Camera, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import LoadingSpinner from "./loading-spinner";
import { Textarea } from "./ui/textarea";

const Editprofile = ({ isopen, onclose }: any) => {
  const { user, updateProfile } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    location: "Earth",
    website: "example.com",
    avatar: user?.avatar || "",
    coverImage: user?.coverImage || "",
    phone: user?.phone || "",
  });

  const [error, setError] = useState<any>({});

  if (!isopen || !user) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    } else if (formData.displayName.length > 50) {
      newErrors.displayName = "Display name must be 50 characters or less";
    }

    if (formData.bio.length > 160) {
      newErrors.bio = "Bio must be 160 characters or less";
    }

    if (formData.website && formData.website.length > 100) {
      newErrors.website = "Website must be 100 characters or less";
    }

    if (formData.location && formData.location.length > 30) {
      newErrors.location = "Location must be 30 characters or less";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    try {
      await updateProfile(formData);
      onclose();
    } catch (error) {
      setError({ general: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error[field]) {
      setError((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.target.files || e.target.files.length === 0) return;

    const image = e.target.files[0];
    const formDataImg = new FormData();
    formDataImg.append("image", image);

    setIsLoading(true);
    try {
      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=abf3d42ccfaa0abe0105dd032362b0a7",
        {
          method: "POST",
          body: formDataImg,
        },
      );

      const data = await res.json();
      if (data?.data?.display_url) {
        setFormData((prev) => ({ ...prev, avatar: data.data.display_url }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <Card
        className="
          w-full
          max-w-xl lg:max-w-2xl
          bg-black
          border-gray-800
          text-white
          max-h-[92vh]
          overflow-y-auto
          rounded-xl
        "
      >
        <CardHeader className="relative pb-3 sm:pb-4 border-b border-gray-800 px-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black hover:bg-gray-900"
                onClick={onclose}
                disabled={isLoading}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <CardTitle className="text-lg sm:text-xl font-bold">
                Edit profile
              </CardTitle>
            </div>
            <Button
              type="submit"
              form="edit-profile-form"
              className="bg-white text-black hover:bg-gray-200 font-semibold rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {error.general && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm m-4">
              {error.general}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            id="avatarUpload"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          <form id="edit-profile-form" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="h-32 sm:h-40 md:h-48 bg-linear-to-r from-blue-600 to-purple-600 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/70 hover:bg-black/90"
                  disabled={isLoading}
                >
                  <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </Button>
              </div>

              <div className="absolute -bottom-12 sm:-bottom-14 md:-bottom-16 left-3 sm:left-4">
                <div className="relative">
                  <Avatar
                    className="
                      h-20 w-20          
                      sm:h-24 sm:w-24    
                      md:h-32 md:w-32    
                      border-4 border-black
                    "
                  >
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback className="text-xl sm:text-2xl">
                      {formData.displayName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/70 hover:bg-black/90"
                    disabled={isLoading}
                    onClick={() =>
                      document.getElementById("avatarUpload")?.click()
                    }
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 mt-14 sm:mt-16 space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Name</Label>
                <Input
                  className="h-10 sm:h-11"
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                  maxLength={50}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Bio</Label>
                <Textarea
                  className="min-h-24 sm:min-h-28"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  maxLength={160}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  maxLength={30}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  maxLength={100}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  maxLength={15}
                  disabled={isLoading}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Editprofile;
