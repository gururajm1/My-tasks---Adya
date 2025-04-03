import React from 'react'
import { Button } from '@/components/ui/button'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const navigate = useNavigate();
  const email = useSelector((state:any) => state.auth.emailValidation.email)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login');
  }
  return (
  <div>
    <div>
      <div className='p-5'>
        <span>Welcome {email}</span>
      </div>
      <Button variant={'destructive'} className='cursor-pointer ml-5 hover:bg-red-500' onClick={handleLogout}>Logout</Button>
        
      <div className='p-5'>Dashboard</div>
      {/* <span className="flex justify-end">
        <Button variant={'destructive'} className='cursor-pointer' onClick={handleLogout}>Logout</Button>
      </span> */}
    </div>
  </div>
  )
}

export default Dashboard