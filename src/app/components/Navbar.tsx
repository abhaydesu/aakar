import React from 'react'

export const Navbar = () => {
  return (
    <nav className='bg-green-200 py-8'>
        <div className='flex text-2xl font-medium flex-end justify-between mx-25 '>
        <div className=''>
          Aakar
        </div>
        <div className='flex flex-row gap-6 '>
          <a href="/dashboard">Dashboard</a>
          <a href="">Contact</a>
          <a href="">About us</a>
        </div>
        </div>
      </nav>
  )
}
