import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://vanijapp.adya.ai/api/v1/vanij/gateway/backend', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const verifyPassword = async (id: number, password: string) => {
  const response = await axiosInstance.post('/user/verify_password', {
    id,
    password
  }, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PASSWORD_AUTH_TOKEN}`
    }
  });
  return response.data;
};

export const verifyEmail = async (email: string) => {
  const response = await axiosInstance.post('/user/login', {
    login: email
  }, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_EMAIL_AUTH_TOKEN}`
    }
  });
  return response.data;
};

export const resendOtp = async (email: string) => {
  const response = await axiosInstance.post('/user/resend_otp', {
    id: 3145
  }, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_EMAIL_AUTH_TOKEN}`
    }
  });
  console.log('OTP from API:', response.data.data.otp); // Log the OTP to console
  return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await axiosInstance.post('/user/verify_otp', {
    id: 3145,
    otp: otp
  }, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_EMAIL_AUTH_TOKEN}`
    }
  });
  return response.data;
};

// interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptor res
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401 ) {
      console.log('Unauthorized: Redirecting to login...');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;