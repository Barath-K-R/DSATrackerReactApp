import React, { useState } from "react";
import {login,signUp} from '../api/authApi.js'
import { useAuthContext } from "../context/authContext/authContext.js";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [formData, setFormData] = useState({ identifier: "", email: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const { dispatch } = useAuthContext(); 
  const navigate = useNavigate();

  const resetFormData = () => {
    setFormData({ identifier: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
   
        if (formData.password !== formData.confirmPassword) {
          console.log('password not match')
          toast.error("Passwords do not match!",{
            position: "top-right",
          });
          return;
        }

        const signupData = {
          email: formData.email,
          password: formData.password,
        };
        const response = await signUp(signupData);
        toast.success("Signup successful! Please log in.",{
          position: "top-right",
        });
        setIsSignup(false);
        resetFormData();
      } else {
        // Handle Login
        const loginData = {
          identifier: formData.identifier,
          password: formData.password,
        };
        const response = await login(loginData);
       
        // Update context state with user and tokens
        dispatch({ type: 'SET_AUTH_USER', payload: response.data.user });
        dispatch({
          type: 'SET_TOKEN',
          payload: response.data.accessToken,
        });
        localStorage.setItem('isLoggedIn',true);
        toast.success("Login successful!");
        navigate("/"); 
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
  
        if (isSignup) {
          if (status === 400 && data.message === "Username or email already exists") {
            toast.error("Username or email already exists!");
          } else {
            toast.error("Signup failed. Please try again.");
          }
        } else {
          if (status === 404 && data.message === "User not found") {
            toast.error("User not found!");
          } else if (status === 401 && data.message === "Invalid password") {
            toast.error("Invalid password!");
          } else {
            toast.error("Login failed. Please try again.");
          }
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-start justify-center pt-14 w-full h-full bg-customDark">
      <div className="flex flex-col justify-start items-center gap-6 h-5/6 w-2/6 pt-6 mt-4 text-white bg-customGray rounded-md shadow-md">
        <h2 className="text-center mt-4 text-lg font-normal">
          {isSignup ? "Sign Up" : "Log In"} to Chat Application
        </h2>

        {isSignup ? (
          <section className="flex flex-col w-5/6 h-10 mt-4">
            <input
              type="email"
              name="email"
              className="w-full h-full border border-gray-300 text-black bg-gray-100 outline-none focus:ring-0 pl-3 focus:border-gray-300 rounded-md"
              onChange={handleChange}
              value={formData.email}
              placeholder="Enter your email"
            />
          </section>
        ) : (
          <section className="flex flex-col w-5/6 h-10 mt-4">
            <input
              type="text"
              name="identifier"
              className="w-full h-full border border-gray-300 text-black bg-gray-100 outline-none focus:ring-0 pl-3 focus:border-gray-300 rounded-md"
              onChange={handleChange}
              value={formData.identifier}
              placeholder="Email or Username"
            />
          </section>
        )}

        <section className="flex flex-col w-5/6 h-10 mt-4">
          <input
            type="password"
            name="password"
            className="w-full h-full border border-gray-300 text-black bg-gray-100 outline-none focus:ring-0 pl-3 focus:border-gray-300 rounded-md"
            onChange={handleChange}
            value={formData.password}
            placeholder="Enter your password"
          />
        </section>

        {isSignup && (
          <section className="flex flex-col w-5/6 h-10 mt-4">
            <input
              type="password"
              name="confirmPassword"
              className="w-full h-full border border-gray-300 text-black bg-gray-100 outline-none focus:ring-0 pl-3 focus:border-gray-300 rounded-md"
              onChange={handleChange}
              value={formData.confirmPassword}
              placeholder="Confirm your password"
            />
          </section>
        )}

        <button className="h-10 w-2/6 rounded-xl bg-blue-500" onClick={handleSubmit}>
          {isSignup ? "Sign Up" : "Log In"}
        </button>
        <p className="text-center mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              setIsSignup((prev) => !prev);
              setFormData({ identifier: "", email: "", password: "", confirmPassword: "" }); // Reset form on toggle
            }}
          >
            {isSignup ? "Log In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
