import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#101217] to-[#030406]">
      <div className="w-full max-w-md bg-[#101317] p-8 rounded-xl border border-white/10 shadow-xl">
        
        <h2 className="text-3xl font-semibold mb-2 text-white">Welcome Back</h2>
        <p className="text-gray-400 mb-6">Log in to continue your journey</p>

        <form className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 rounded-lg bg-[#0c0f13] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-600/40 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 p-3 rounded-lg bg-[#0c0f13] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-600/40 transition"
              required
            />
          </div>

          <button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-full shadow-green-600/40 shadow-md transition">
            Log In
          </button>
        </form>

        <p className="mt-5 text-gray-400 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
