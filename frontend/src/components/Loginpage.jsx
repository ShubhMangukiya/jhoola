import React, { useState } from "react";
import img from "../image/login.svg";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import logo from "../image/login logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function Loginpage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { email, password });

    if (!email || !password) {
      setError("Please fill in both email and password.");
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    // Static admin credentials
    const adminEmail = "admin";
    const adminPassword = "admin123";

    console.log("Comparing credentials:", { entered: email, expected: adminEmail });

    if (email === adminEmail && password === adminPassword) {
      try {
        console.log("Admin credentials matched. Setting localStorage...");
        localStorage.setItem("token", "admin-dummy-token");
        localStorage.setItem("isAdmin", "true");
        console.log("localStorage set:", {
          token: localStorage.getItem("token"),
          isAdmin: localStorage.getItem("isAdmin"),
        });
        console.log("Navigating to /admin/dashboard...");
        navigate("/admin/dashboard", { replace: true });
      } catch (err) {
        console.error("Navigation error:", err);
        setError("Failed to redirect to dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Dynamic user login via backend
    try {
      console.log("Attempting user login via API...");
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("User login successful. Setting localStorage...");
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", "false");
        console.log("localStorage set:", {
          token: localStorage.getItem("token"),
          isAdmin: localStorage.getItem("isAdmin"),
        });
        console.log("Navigating to /...");
        navigate("/", { replace: true });
      } else {
        console.error("Login failed:", data.message);
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex justify-center items-center h-screen overflow-hidden">
      {/* Login Form Section */}
      <div className="p-8 w-full lg:w-1/2 lg:p-36 md:p-20">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <div className="p-2 text-center">
              <Link to="/">
                <img src={logo} alt="Zulas logo" className="rounded-4xl object-fill" />
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-lime-950">Email</label>
              <input
                type="text"
                placeholder="Enter Email or Username"
                className="w-full border border-lime-950 focus:border-lime-950 focus:ring focus:ring-lime-950 h-12 rounded-md px-4 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-lime-950">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-lime-950 focus:border-lime-950 focus:ring focus:ring-lime-950 h-12 rounded-md px-4 pr-10 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-10 -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-lime-950" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-lime-950" />
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="#" className="text-lime-950 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-lime-950 text-white h-12 rounded-md cursor-pointer hover:bg-lime-800 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/Signup" className="text-lime-950 text-sm hover:underline">
              Can't Log in? Sign up an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:block w-1/2 h-full">
        <img
          src={img}
          alt="Placeholder"
          className="object-cover w-[90%] h-[90%] rounded-4xl"
        />
      </div>
    </div>
  );
}

export default Loginpage;