import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  key: "",
  subscription_id: "",
  clientSecret: "",
  isPaymentVerified: false,
  allPayments: {},
  finalMonths: {},
  monthlySalesRecord: []
};

export const getStripeKey = createAsyncThunk("/stripe/getKey", async () => {
  try {
    const response = await axiosInstance.get("/payments/stripe-key"); // Endpoint still same
    return response.data;
  } catch (error) {
    toast.error("Failed to load Stripe key");
  }
});

export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async () => {
  try {
    const response = await axiosInstance.post("/payments/subscribe");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Subscription failed");
  }
});
export const verifyUserPayment = createAsyncThunk("/payments/verify", async ({ session_id }) => {
  try {
    const response = await axiosInstance.post(`/payments/verify?session_id=${session_id}`);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Verification failed");
  }
});


export const getPaymentRecord = createAsyncThunk("/payments/record", async () => {
  try {
    const response = axiosInstance.get("/payments?count=100");
    toast.promise(response, {
      loading: "Fetching Stripe records",
      success: (data) => data?.data?.message,
      error: "Failed to fetch records"
    });
    return (await response).data;
  } catch (error) {
    toast.error("Operation failed");
  }
});

export const cancelCourseBundle = createAsyncThunk("/payments/cancel", async () => {
  try {
    const response = axiosInstance.post("/payments/unsubscribe");
    toast.promise(response, {
      loading: "Cancelling subscription",
      success: (data) => data?.data?.message,
      error: "Cancellation failed"
    });
    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStripeKey.fulfilled, (state, action) => {
        state.key = action?.payload?.key;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        state.subscription_id = action?.payload?.subscription_id;
        state.clientSecret = action?.payload?.client_secret;
      })
      .addCase(verifyUserPayment.fulfilled, (state, action) => {
        toast.success(action?.payload?.message);
        state.isPaymentVerified = action?.payload?.success;
      })
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        state.allPayments = action?.payload?.allPayments;
        state.finalMonths = action?.payload?.finalMonths;
        state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
      })
      .addCase(getStripeKey.rejected, () => {
  toast.error("Failed to fetch Stripe key");
})
      .addCase(purchaseCourseBundle.rejected, () => {
  toast.error("Subscription creation failed");
})

  }
});

export default paymentSlice.reducer;
 