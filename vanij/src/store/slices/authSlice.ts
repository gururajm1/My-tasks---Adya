import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verifyPassword, verifyEmail } from '../../services/api';

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
    } as EmailValidationState
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
    }
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
      });
  },
});

export const { validateEmail, resetEmailValidation } = authSlice.actions;

// Selectors
export const selectEmailValidation = (state: { auth: { emailValidation: EmailValidationState } }) => state.auth.emailValidation;

export default authSlice.reducer;