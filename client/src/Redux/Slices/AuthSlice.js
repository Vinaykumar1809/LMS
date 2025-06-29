import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

// Safely parse localStorage data
let storedUserData = localStorage.getItem('data');
let parsedUserData = {};

try {
    parsedUserData = storedUserData && storedUserData !== "undefined"
        ? JSON.parse(storedUserData)
        : {};  
} catch (error) {
    console.error("Invalid JSON in localStorage 'data':", error);
    parsedUserData = {};
}

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    role: localStorage.getItem('role') || "",
    data: parsedUserData
};

export const createAccount = createAsyncThunk("/auth/signup", async (formData) => {
    try {
        const resPromise = axiosInstance.post("user/register", formData);

        toast.promise(resPromise, {
            loading: "Wait! creating your account",
            success: (res) => res?.data?.message,
            error: "Failed to create account"
        });

        const res = await resPromise;
        return res.data;
    } catch (error) {
        console.error(error?.response?.data?.stack || error);
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error;
    }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("user/login", data);
        toast.promise(res, {
            loading: "Wait! authentication in progress...",
            success: (data) => data?.data?.message,
            error: "Failed to log in"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Login failed");
        throw error;
    }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        const res = axiosInstance.post("user/logout");
        toast.promise(res, {
            loading: "Wait! logout in progress...",
            success: (data) => data?.data?.message,
            error: "Failed to log out"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Logout failed");
        throw error;
    }
});

// function to change user password
export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async (userPassword, { rejectWithValue }) => {
    try {
      const resPromise = axiosInstance.post("/user/change-password", userPassword);

      await toast.promise(resPromise, {
        loading: "Changing password...",
        success: (data) => data?.data?.message || "Password changed",
        error: (err) => err?.response?.data?.message || "Failed to change password",
      });

      const res = await resPromise;
      return res.data;
    } catch (error) {
      // important: forward the message to component via payload
      return rejectWithValue(error?.response?.data);
    }
  }
);


// function to handle forget password
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email) => {
    try {
      let res = axiosInstance.post("/user/reset", { email });

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to send verification email",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
    try {
        const res = axiosInstance.put(`user/update/${data[0]}`, data[1]);
        toast.promise(res, {
            loading: "Wait! profile update in progress...",
            success: (data) => data?.data?.message,
            error: "Failed to update profile"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Profile update failed");
        throw error;
    }
});

// function to reset the password
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  try {
    let res = axiosInstance.post(`/user/reset/${data.resetToken}`, {
      password: data.password,
    });

    toast.promise(res, {
      loading: "Resetting...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to reset password",
    });
    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


export const getUserData = createAsyncThunk("/user/details", async () => {
    try {
        const res = axiosInstance.get("user/me");
        return (await res).data;
    } catch (error) {
        toast.error(error.message || "Failed to fetch user data");
        throw error;
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;
            })
            .addCase(logout.fulfilled, (state) => {
                localStorage.clear();
                state.data = {};
                state.isLoggedIn = false;
                state.role = "";
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                if (!action?.payload?.user) return;
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;
            });
    }
});


export default authSlice.reducer;
