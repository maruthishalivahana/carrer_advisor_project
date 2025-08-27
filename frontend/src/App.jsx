import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex h-screen justify-center items-center'>
        <h1 className='text-5xl capitalize  bold text-black-400 text-center mr-auto ml-auto items-center'>we are developing a carrer advisor paltfom</h1>
      </div>

    </>
  )
}

export default App
