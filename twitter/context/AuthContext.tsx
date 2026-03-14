/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import axiosInstance from "@/lib/axiosInstance";

interface User {
  phone: any;
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  coverImage?: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    username: string,
    displayName: string,
  ) => Promise<void>;
  googlesignin: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser?.email) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const emailFromFirebase = firebaseUser.email;

        if (!emailFromFirebase) {
          console.error("Firebase returned no email");
          return;
        }

        const res = await axiosInstance.get("/loggedinuser", {
          params: { email: emailFromFirebase },
        });

        if (res.data) {
          setUser(res.data);
          localStorage.setItem("twitter-user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Auth state error:", err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!email?.trim()) {
        alert("Enter valid email");
        return;
      }

      const usercred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const emailFromFirebase = usercred.user.email;

      if (!emailFromFirebase) {
        console.error("Firebase returned no email");
        setIsLoading(false);
        return;
      }

      const res = await axiosInstance.get("/loggedinuser", {
        params: { email: emailFromFirebase },
      });

      if (res.data) {
        setUser(res.data);
        localStorage.setItem("twitter-user", JSON.stringify(res.data));
      }
    } catch (error: any) {
      console.error("FIREBASE ERROR:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    username: string,
    displayName: string,
  ) => {
    setIsLoading(true);
    try {
      const usercred = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const newuser = {
        username,
        displayName,
        avatar: usercred.user.photoURL || "",
        email: usercred.user.email,
      };

      const res = await axiosInstance.post("/register", newuser);

      if (res.data) {
        setUser(res.data);
        localStorage.setItem("twitter-user", JSON.stringify(res.data));
      }
    } catch (error: any) {
      console.error("FIREBASE ERROR:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Email already registered. Please login instead.");
      } else if (error.code === "auth/weak-password") {
        alert("Password must be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else {
        alert("Signup failed. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const googlesignin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const emailFromFirebase = firebaseUser.email;

      if (!emailFromFirebase) {
        console.error("Google user has no email");
        return;
      }

      const res = await axiosInstance.get("/loggedinuser", {
        params: { email: emailFromFirebase },
      });

      if (res.data) {
        setUser(res.data);
        localStorage.setItem("twitter-user", JSON.stringify(res.data));
      }
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") return;

      console.error("GOOGLE SIGNIN ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("twitter-user");
    setUser(null);
  };

  const updateProfile = async (profileData: any) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const res = await axiosInstance.patch(
        `/userupdate/${user.email}`,
        profileData,
      );

      if (res.data) {
        setUser(res.data);
        localStorage.setItem("twitter-user", JSON.stringify(res.data));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        googlesignin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
