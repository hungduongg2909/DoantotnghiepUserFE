// hooks/usePayments.js
import { useState, useCallback } from "react";
import PaymentAPI from "../services/PaymentAPI";

export const usePayments = () => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const [pagination, setPagination] = useState({
      page: 1,
      limit: 10,
      total: 0,
   });

   // fetch Payments by User
   const getPreviewPayment = useCallback(async ({ page, limit }) => {
      try {
         setLoading(true);
         setError(null);

         const response = await PaymentAPI.getPreviewPaymentByUser(page, limit);

         if (response.success) {
            setData(response.data);
            setPagination({
               page: response.pagination.page,
               limit: response.pagination.limit,
               total: response.pagination.total,
            });
            return response;
         } else {
            setError(
               response.message || "An error occurred while retrieving data"
            );
            return response;
         }
      } catch (err) {
         setError(err.response.data.message || "Unable to connect to server");
         throw err;
      } finally {
         setLoading(false);
      }
   }, []);

   const reset = useCallback(() => {
      setData(null);
      setError(null);
      setLoading(false);
   }, []);

   return {
      data,
      loading,
      error,
      pagination,
      getPreviewPayment,
      reset,
   };
};
