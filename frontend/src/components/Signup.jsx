import React, { useState } from "react";
import img from "../image/login.svg";
import { Eye, EyeOff } from "lucide-react";
import logo from "../image/login logo.svg";
import { Link, useNavigate } from "react-router-dom";

// Define BASE_URL (e.g., for local development)
const BASE_URL = "http://localhost:5000"; // Replace with your backend URL

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate("/Loginpage");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error signing up");
      console.error(error);
    }
  };

  return (
    <div className="bg-white flex justify-center items-center h-screen overflow-hidden">
      <div className="p-8 w-full lg:w-1/2 lg:p-36 md:p-20">
        <div className="w-full max-w-full mx-auto">
          <div className="flex flex-col items-center mb-8">
            <Link to="/">
              <img src={logo} alt="Kuku Logo" className="rounded-3xl" />
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>First Name</label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-lime-950 focus:border-lime-950 focus:ring focus:ring-lime-950 rounded-md focus:outline-none text-sm placeholder:text-lime-950 outline-none"
                required
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-lime-950 focus:border-lime-950 focus:ring focus:ring-lime-950 rounded-md focus:outline-none text-sm placeholder:text-lime-950"
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-lime-950 focus:border-lime-950 focus:ring focus:ring-lime-950 rounded-md focus:outline-none text-sm placeholder:text-lime-950"
                required
              />
            </div>
            <div className="relative">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-lime-950 focus:border-lime-950 focus:ring focus:ring-lime-950 rounded-md text-sm placeholder:text-lime-950"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lime-950 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-6 text-white bg-lime-950 rounded-md hover:bg-lime-950 transition-colors cursor-pointer"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-lime-950">
            Already have an account?{" "}
            <Link to="/Loginpage" className="text-lime-950 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block w-1/2 h-full mt-22">
        <img src={img} alt="Signup Illustration" className="object-cover w-[90%] h-[90%] rounded-4xl" />
      </div>
    </div>
  );
}

export default Signup;