/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import LoadingSpinner from "../loading-spinner";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import ProfilePage from "../ProfilePage";
import Feed from "../Feed";
import { Menu } from "lucide-react";

const Mainlayout = ({ children }: any) => {
  const { user, isLoading } = useAuth();
  const [currentPage, setcurrentPage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-4xl font-bold mb-4">X</div>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="flex w-full max-w-350 mx-auto">
        {/* MOBILE SIDEBAR DRAWER */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div
              className="relative z-50 w-64 h-full bg-black border-r border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                currentPage={currentPage}
                onNavigate={(page: string) => {
                  setcurrentPage(page);
                  setIsSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* LEFT SIDEBAR */}
        <div
          className="
        hidden md:block
        w-20 lg:w-64
        border-r border-gray-800
      "
        >
          <Sidebar currentPage={currentPage} onNavigate={setcurrentPage} />
        </div>

        {/* MAIN CONTENT */}
        <main className="w-full max-w-3xl md:border-x border-gray-800">
          {/* MOBILE HEADER */}
          <div className="md:hidden flex items-center gap-4 p-3 border-b border-gray-800">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Menu />
            </button>
            <span className="font-bold text-lg">X</span>
          </div>

          {currentPage === "home" && <Feed />}
          {currentPage === "profile" && <ProfilePage />}
        </main>

        {/* RIGHT SIDEBAR */}
        <div className="hidden xl:block w-80 p-4">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Mainlayout;
