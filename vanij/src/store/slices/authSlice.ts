import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verifyPassword, verifyEmail, resendOtp, verifyOtp, changePassword } from '../../services/api';

interface LoginCredentials {
  id: number;
  password: string;
  token?: string;
}

interface EmailValidationState {
  isValid: boolean;
  email: string;
  error: string | null;
}

interface OtpValidationState {
  isValid: boolean;
  otp: string;
  error: string | null;
}

export const verifyUserPassword = createAsyncThunk(
  'auth/verifyPassword',
  async ({ id, password, token }: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await verifyPassword(id, password);
      return { ...response, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
  }
);

export const verifyUserEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await verifyEmail(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Email verification failed');
    }
  }
);

export const resendUserOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resendOtp(email);
      console.log('OTP Response:', response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OTP resend failed');
    }
  }
);

export const verifyUserOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ id, otp }: { id: number, otp: string }, { rejectWithValue }) => {
    try {
      const email = ''; //dummy just for placeholder
      const response = await verifyOtp(email, otp);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  'auth/changePassword',
  async ({ id, password, confirmPassword }: { id: number, password: string, confirmPassword: string }, { rejectWithValue }) => {
    try {
      const response = await changePassword(id, password, confirmPassword);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password change failed');
    }
  }
);

// const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null as string | null,
    emailValidation: {
      isValid: false,
      email: '',
      error: null
    } as EmailValidationState,
    otpValidation: {
      isValid: false,
      otp: '',
      error: null
    } as OtpValidationState
  },
  reducers: {
    validateEmail: (state, action) => {
      const email = action.payload;
      state.emailValidation.email = email;
      
      if (!email) {
        state.emailValidation.isValid = false;
        state.emailValidation.error = 'Email is required';
        return;
      }

      // if (!EMAIL_REGEX.test(email)) {
      //   state.emailValidation.isValid = false;
      //   state.emailValidation.error = 'Invalid email format';
      //   return;
      // }

      state.emailValidation.isValid = true;
      state.emailValidation.error = null;
    },
    resetEmailValidation: (state) => {
      state.emailValidation = {
        isValid: false,
        email: '',
        error: null
      };
    },
    setEmail: (state, action) => {
      state.emailValidation.email = action.payload;
    },
    validateOtp: (state, action) => {
      const otp = action.payload;
      state.otpValidation.otp = otp;
      
      if (!otp) {
        state.otpValidation.isValid = false;
        state.otpValidation.error = 'OTP is required';
        return;
      }

      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        state.otpValidation.isValid = false;
        state.otpValidation.error = 'Invalid OTP format';
        return;
      }

      state.otpValidation.isValid = true;
      state.otpValidation.error = null;
    },
    resetOtpValidation: (state) => {
      state.otpValidation = {
        isValid: false,
        otp: '',
        error: null
      };
    },
    setOtp: (state, action) => {
      state.otpValidation.otp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(verifyUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyUserEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.emailValidation.isValid = true;
        state.emailValidation.email = action.payload.email;
      })
      .addCase(verifyUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.emailValidation.isValid = false;
        state.emailValidation.error = action.payload as string;
      })
      .addCase(resendUserOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendUserOtp.fulfilled, (state, action) => {
        state.loading = false;
        // The OTP is logged to console in the API service
      })
      .addCase(resendUserOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyUserOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpValidation.isValid = true;
        state.user = action.payload;
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.loading = false;
        state.otpValidation.isValid = false;
        state.otpValidation.error = action.payload as string;
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.otpValidation.isValid = false;
        state.otpValidation.error = action.payload as string;
      });
  },
});

export const { validateEmail, resetEmailValidation, setEmail, validateOtp, resetOtpValidation, setOtp } = authSlice.actions;

// Selectors
export const selectEmailValidation = (state: { auth: { emailValidation: EmailValidationState } }) => state.auth.emailValidation;
export const selectOtpValidation = (state: { auth: { otpValidation: OtpValidationState } }) => state.auth.otpValidation;

export default authSlice.reducer;