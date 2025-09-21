import React from 'react'
import { Sparkles } from "lucide-react";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, axiosConfig } from '../config/api';

function Auth() {

    const [Issignup, setIsSignup] = useState(false)
    function handleOnchange(e) {
        e.preventDefault()
    }

    const navigate = useNavigate();

    // function Auth() {
    //     const [Issignup, setIsSignup] = useState(false);
    //     const [formData, setFormData] = useState({
    //         fullname: "",
    //         email: "",
    //         password: "",
    //     });

    // Handle input change
    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    // };


    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleAuthAction = async (e) => {
        e.preventDefault();

        try {
            if (Issignup) {
                // --- Signup API ---
                await axios.post(API_ENDPOINTS.REGISTER, {
                    fullname,
                    email,
                    password,
                }, axiosConfig);

                alert("Signup successful! Please login.");
                setIsSignup(false); // switch back to login mode
                setPassword("");
            } else {
                // --- Login API ---
                const res = await axios.post(API_ENDPOINTS.LOGIN, {
                    email,
                    password,
                }, axiosConfig);

                // Save JWT token
                localStorage.setItem("token", res.data.token);

                // Redirect based on onboarding status
                if (res.data.user?.onboarding?.isOnboarded) {
                    navigate("/dashboard");
                } else {
                    navigate("/onboarding");
                }
            }
        } catch (error) {
            console.error("Auth error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            alert(errorMessage);
        }
    };

    return (
        <>
            <div className='auth-container lg:flex items-center lg:mt-10  justify-center border w-full  p-10 gap-4 rounded-lg shadow-lg bg-gray-100 '>
                <div className='left-part border  h-[450px] items-center  gap-4 flex flex-col justify-center p-6  sm:mb-4 rounded-lg shadow-lg bg-white'>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                        <span className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            CareerQuest
                        </span>
                    </div>
                    <h1 className='headline text-4xl'>AI That Maps Your Career Path.</h1>
                    <p className='tagline '>Discover the best path for your skills, passion, and goals.</p>
                </div>
                <div>

                    <form action="" className='flex flex-col border-2 border-gray-200 p-2  w-full rounded-lg shadow-lg bg-white'>
                        <h1 className=' text-center pb-4 text-4xl'> {Issignup ? "Signup" : "Sign in"}</h1>
                        {Issignup && (
                            <>

                                <label htmlFor="name" className=' ml-2 text-gray-600'>Fullname:</label>
                                <input type="text" name='name' className='  text-[14px] p-2 rounded-lg m-2 border-2 border-gray-300 lg:w-[300px]  focus:outline-0' placeholder='Enter your name:'
                                    onChange={(e) => setFullname(e.target.value)} />
                            </>
                        )}
                        <label htmlFor="email" className=' ml-2  text-gray-600'>E-mail:</label>
                        <input type="email" name='email'
                            className=' p-2  text-[14px] rounded-lg m-2 border-2 border-gray-300 lg:w-[300px]  focus:outline-0'
                            placeholder='Enter your mail:'
                            onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="password" className=' ml-2 text-gray-600'>Password:</label>
                        <input type="password" name='password' className=' p-2 text-[14px] rounded-lg m-2 border-2 border-gray-300 lg:w-[300px]  focus:outline-0' placeholder='Enter your password:'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {!Issignup && <p className='text-center text-blue-600 underline cursor-pointer m-2'>forgot Password</p>}
                        <button type='button' className=' border-2 border-black text-black p-2 rounded-lg m-2 hover:bg-black hover:text-white hover:transition-shadow cursor-pointer'

                            onClick={handleAuthAction}
                        > {Issignup ? "Signup" : "Sign in"}</button>
                        <p className='text-center gap-2'>{Issignup ? "if you have a account" : "if you dont have an account"}
                            <span
                                onClick={() => {
                                    setIsSignup(!Issignup)

                                }}
                                className="text-blue-600  cursor-pointer  ml-2"
                            >
                                {Issignup ? "Sign In" : "Sign Up"}
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </>

    )
}

export default Auth
