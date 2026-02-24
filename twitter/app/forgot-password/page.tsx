/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

export default function ForgotPassword() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [mode, setMode] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      setMessage("");

      if (mode === "email" && !email) {
        setMessage("Please enter email");
        return;
      }
      if (mode === "phone" && !phone) {
        setMessage("Please enter phone");
        return;
      }

      const payload =
        mode === "email" ? { email, mode: "email" } : { phone, mode: "phone" };

      await axiosInstance.post("/forgot-password/request", payload);

      setStep("verify");
      setMessage(
        mode === "email"
          ? "OTP sent to your registered email"
          : "OTP sent to your phone",
      );
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      setMessage("");

      if (!otp) {
        setMessage("Enter OTP");
        return;
      }

      const payload =
        mode === "email"
          ? { email, otp, mode: "email" }
          : { phone, otp, mode: "phone" };

      const res = await axiosInstance.post("/forgot-password/verify", payload);

      setMessage(res.data.message || "Password reset successful");
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white p-4">
      <div className="w-full max-w-md border border-gray-800 rounded-2xl p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        {step === "request" && (
          <>
            {mode === "email" ? (
              <input
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-lg text-white text-sm sm:text-base outline-none focus:border-blue-500"
              />
            ) : (
              <input
                placeholder="Enter your Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-lg text-white text-sm sm:text-base outline-none focus:border-blue-500"
              />
            )}

            <button
              onClick={sendOtp}
              className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-full font-semibold text-sm sm:text-base transition-colors"
            >
              Send OTP
            </button>

            <button
              onClick={() => setMode(mode === "email" ? "phone" : "email")}
              className="w-full mt-4 text-blue-400 hover:underline text-sm sm:text-base"
            >
              {mode === "email" ? "Use phone instead" : "Use email instead"}
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 bg-black border border-gray-700 rounded-lg text-white text-sm sm:text-base outline-none focus:border-blue-500"
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-full font-semibold text-sm sm:text-base transition-colors"
            >
              Verify & Reset
            </button>

            <button
              onClick={sendOtp}
              className="w-full mt-3 text-blue-400 hover:underline text-sm sm:text-base"
            >
              Resend OTP
            </button>

            <button
              onClick={() => setStep("request")}
              className="w-full mt-2 text-gray-400 hover:underline text-sm sm:text-base"
            >
              Change Email / Phone
            </button>
          </>
        )}

        {message && (
          <p className="mt-6 text-center text-gray-300 text-sm sm:text-base">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
