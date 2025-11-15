import { createSlice } from "@reduxjs/toolkit";

interface PaymentStatusState {
  togglePayment: boolean;
}

const initialState: PaymentStatusState = {
  togglePayment: false,
};

const paymentStatusSlice = createSlice({
  name: "paymentStatus",
  initialState,
  reducers: {
    setPaymentStatus: (state) => {
      state.togglePayment = !state.togglePayment;
    },
    resetPaymentStatus: (state) => {
      state.togglePayment = false;
    },
  },
});

export const { setPaymentStatus, resetPaymentStatus } =
  paymentStatusSlice.actions;
export default paymentStatusSlice.reducer;
