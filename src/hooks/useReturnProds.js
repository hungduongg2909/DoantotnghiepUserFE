// hooks/useReturnProds.js
import { useState, useCallback } from "react";
import ReturnProdAPI from "../services/ReturnProdAPI";

export const useReturnProds = () => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const [pagination, setPagination] = useState({
      page: 1,
      limit: 10,
      total: 0,
   });

   // Trả về các assignment của user còn thiếu hàng trả:
   const getProdAssignShortageByUserId = useCallback(
      async (page, limit) => {
         try {
            setLoading(true);
            setError(null);

            const response = await ReturnProdAPI.getProdAssignShortageByUserId(page, limit);

            if (response.success) {
               setData(response.data);
               setPagination({
                  page: response.pagination.page,
                  limit: response.pagination.limit,
                  total: response.pagination.total,
               });
               return response;
            } else {
               setError(response.errors || response.message || "Error while retrieving incomplete list of items");
               return response;
            }
         } catch (err) {
            setError(err.message);
            throw err;
         } finally {
            setLoading(false);
         }
      },
      []
   );

   // Trả về các ReturnProd Unconfirm của user:
   const getReturnProdUnconfirm = useCallback(
      async (page, limit) => {
         try {
            setLoading(true);
            setError(null);

            const response = await ReturnProdAPI.getReturnProdUnconfirm(page, limit);

            if (response.success) {
               setData(response.data);
               setPagination({
                  page: response.pagination.page,
                  limit: response.pagination.limit,
                  total: response.pagination.total,
               });
               return response;
            } else {
               setError(response.errors || response.message || "Error while retrieving incomplete list of items");
               return response;
            }
         } catch (err) {
            setError(err.message);
            throw err;
         } finally {
            setLoading(false);
         }
      },
      []
   );

   // Lưu các bản ghi trả hàng của user
   const createReturnProd = useCallback(
      async (data) => {
         try {
            setLoading(true);
            setError(null);

            const response = await ReturnProdAPI.createReturnProd(data);

            if (response.success) {
               return response;
            } else {
               setError(response.errors || response.message || "Error saving return list");
               return response;
            }
         } catch (err) {
            setError(err.message);
            throw err;
         } finally {
            setLoading(false);
         }
      },
      []
   );

   // Sửa các bản ghi trả hàng chưa confirm
   const editReturnProdUnconfirm = useCallback(
      async (data) => {
         try {
            setLoading(true);
            setError(null);

            const response = await ReturnProdAPI.editReturnProdUnconfirm(data);

            if (response.success) {
               // Refresh data after updating
               await getReturnProdUnconfirm(pagination.page, pagination.limit);
               return response;
            } else {
               setError(response.errors || response.message || "Error editing return list");
               return response;
            }
         } catch (err) {
            setError(err.message);
            throw err;
         } finally {
            setLoading(false);
         }
      },
      [getReturnProdUnconfirm, pagination.page, pagination.limit]
   );

   // Delete return product by id
   const deleteReturnProd = useCallback(
      async (id) => {
         try {
            setLoading(true);
            setError(null);

            const response = await ReturnProdAPI.deleteReturnProdById(id);

            if (response.success) {
               // Refresh data after deleting
               await getReturnProdUnconfirm(pagination.page, pagination.limit);
               return response;
            } else {
               setError(response.errors || response.message || "Error editing return list");
               return response;
            }
         } catch (err) {
            setError(err.message);
            throw err;
         } finally {
            setLoading(false);
         }
      },
      [getReturnProdUnconfirm, pagination.page, pagination.limit]
   );

   // // Search ReturnProds
   // const searchReturnProds = useCallback(
   //    async (searchTerm, page = 1, limit = 10) => {
   //       try {
   //          setLoading(true);
   //          setError(null);

   //          const response = await ReturnProdAPI.searchReturnProds(searchTerm, {
   //             page,
   //             limit,
   //          });

   //          if (response.success) {
   //             setData(response.data);
   //             setPagination({
   //                page: response.pagination.page,
   //                limit: response.pagination.limit,
   //                total: response.pagination.total,
   //             });
   //          } else {
   //             setError(response.message || "Có lỗi khi tìm kiếm");
   //          }
   //       } catch (err) {
   //          setError(err.message || "Không thể kết nối đến server");
   //       } finally {
   //          setLoading(false);
   //       }
   //    },
   //    []
   // );

   // Reset state
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
      getProdAssignShortageByUserId,
      getReturnProdUnconfirm,
      createReturnProd,
      editReturnProdUnconfirm,
      deleteReturnProd,
      // searchReturnProds,
      reset,
   };
};
