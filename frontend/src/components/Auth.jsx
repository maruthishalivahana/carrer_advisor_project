import React from 'react'
import { Sparkles } from "lucide-react";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Auth() {

    const [Issignup, setIsSignup] = useState(false)
    function handleOnchange(e) {
        e.preventDefault()
    }

    const navigate = useNavigate();

    const handleAuthAction = (e) => {
        e.preventDefault();
        // TODO: add real authentication logic
        navigate("/onboarding"); // ✅ go to onboarding
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
                                <input type="text" name='name' className='  text-[14px] p-2 rounded-lg m-2 border-2 border-gray-300 lg:w-[300px]  focus:outline-0' placeholder='Enter your name:' />
                            </>
                        )}
                        <label htmlFor="email" className=' ml-2  text-gray-600'>E-mail:</label>
                        <input type="email" name='email' className=' p-2  text-[14px] rounded-lg m-2 border-2 border-gray-300 lg:w-[300px]  focus:outline-0' placeholder='Enter your mail:' />
                        <label htmlFor="password" className=' ml-2 text-gray-600'>Password:</label>
                        <input type="password" name='password' className=' p-2 text-[14px] rounded-lg m-2 border-2 border-gray-300 lg:w-[300px]  focus:outline-0' placeholder='Enter your password:' />
                        {!Issignup && <p className='text-center text-blue-600 underline cursor-pointer m-2'>forgot Password</p>}
                        <button type='button' className=' border-2 border-black text-black p-2 rounded-lg m-2 hover:bg-black hover:text-white hover:transition-shadow cursor-pointer'
                            onChange={handleOnchange}
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
