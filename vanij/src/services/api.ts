import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://vanijapp.adya.ai/api/v1/vanij/gateway/backend',
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    //  If login token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Static token based on endpoint
    if (config.url?.includes('/verify_password')) {
      config.headers.Authorization = `Bearer ${import.meta.env.VITE_PASSWORD_AUTH_TOKEN}`;
    }

    if (
      config.url?.includes('/login') ||
      config.url?.includes('/resend_otp') ||
      config.url?.includes('/verify_otp') ||
      config.url?.includes('/change_password')
    ) {
      config.headers.Authorization = `Bearer ${import.meta.env.VITE_EMAIL_AUTH_TOKEN}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//  res Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.warn('Unauthorized: Redirecting to login...');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// API functions

export const verifyPassword = async (id: number, password: string) => {
  const response = await axiosInstance.post('/user/verify_password', {
    id,
    password,
  });
  return response.data;
};

export const verifyEmail = async (email: string) => {
  const response = await axiosInstance.post('/user/login', {
    login: email,
  });
  return response.data;
};

export const resendOtp = async (email: string) => {
  const response = await axiosInstance.post('/user/resend_otp', {
    id: 3145,
  });
  console.log('OTP from API:', response.data.data.otp);
  return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post('/user/verify_otp', {
      id: 3145,
      otp,
    });
    return response.data;
  } catch (error: any) {
    // Extract error details from the response
    const errorData = error.response?.data;
    if (errorData?.error?.message) {
      const { blocked_until, number_of_attempts_remaining } = errorData.error.message;
      throw {
        ...error,
        response: {
          ...error.response,
          data: {
            meta: errorData.meta,
            error: {
              blocked_until,
              number_of_attempts_remaining
            }
          }
        }
      };
    }
    throw error;
  }
};

export const changePassword = async (
  id: number,
  password: string,
  confirmPassword: string
) => {
  const response = await axiosInstance.post('/user/change_password', {
    id,
    password,
    confirm_password: confirmPassword,
  });
  return response.data;
};

export default axiosInstance;
