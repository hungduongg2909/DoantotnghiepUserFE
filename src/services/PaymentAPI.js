// services/PaymentAPI.js
import axiosClient from "./axiosClient";

const PaymentAPI = {
   getPreviewPaymentByUser: (page, limit) => {
      const url = `/payments/user?page=${page}&limit=${limit}`;
      return axiosClient.get(url);
   }
};

export default PaymentAPI;
