import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state: any) => state.auth.emailValidation.email);

  useEffect(() => {
    if (!email) {
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        dispatch({
          type: 'auth/setEmail',
          payload: savedEmail,
        });
      }
    }
  }, [email, dispatch]);

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Welcome {email}</h1>
        <div className="text-lg">Dashboard Content</div>
      </div>
    </div>
  );
};

export default Dashboard;
