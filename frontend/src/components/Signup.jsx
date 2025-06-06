import React, { useState } from "react";
import img from "../image/login.svg";
import { Eye, EyeOff } from "lucide-react";
import logo from "../image/login logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "./Variable";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/Loginpage"), 2000);
    } catch (err) {
      console.error(err);
      setError("An error occurred during registration");
    }
  };

  return (
    <div className="bg-white flex justify-center items-center h-screen overflow-hidden">
      <div className="p-8 w-full lg:w-1/2 lg:p-36 md:p-20">
        <div className="w-full max-w-full mx-auto">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Link to="/">
                <img src={logo} alt="Kuku Logo" className="rounded-3xl" />
              </Link>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-lime-950 focus:ring-lime-950 rounded-md text-sm placeholder:text-lime-950"
              />
            </div>

            <div>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-lime-950 focus:ring-lime-950 rounded-md text-sm placeholder:text-lime-950"
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-lime-950 focus:ring-lime-950 rounded-md text-sm placeholder:text-lime-950"
              />
            </div>

            <div className="relative">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-lime-950 focus:ring-lime-950 rounded-md text-sm placeholder:text-lime-950"
              />
              <button
                type="button"
                className="mt-3 absolute right-3 top-1/2 transform -translate-y-1/2 text-lime-950"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              className="w-full py-3 mt-6 text-white bg-lime-950 rounded-md hover:bg-lime-950 transition-colors"
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

      {/* Right Side Image */}
      <div className="hidden lg:block w-1/2 h-full mt-22">
        <img
          src={img}
          alt="Signup Illustration"
          className="object-cover w-[90%] h-[90%] rounded-4xl"
        />
      </div>
    </div>
  );
}

export default Signup;
