import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state: any) => state.auth.emailValidation.email);

  console.log('Email from Redux:', email);

  // Ensure we use email from localStorage as fallback
  useEffect(() => {
    if (!email) {
      // If needed, you can dispatch an action to set the email from localStorage here
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        dispatch({ 
          type: 'auth/setEmail', 
          payload: savedEmail 
        });
      }
    }
  }, [email, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
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