// services/ReturnProdAPI.js
import axiosClient from "./axiosClient";

const ReturnProdAPI = {
   // Trả về các assignment của user còn thiếu hàng trả:
   getProdAssignShortageByUserId: (page, limit) => {
      const url = `/returns/shortage?page=${page}&limit=${limit}`;
      return axiosClient.get(url);
   },
   // Trả về các bản ghi trả hàng chưa confirm của user
   getReturnProdUnconfirm: (page, limit) => {
      const url = `/returns/unconfirmuser?page=${page}&limit=${limit}`;
      return axiosClient.get(url);
   },
   // Lưu các bản ghi trả hàng của user
   createReturnProd: (items) => {
      const url = "/returns";
      return axiosClient.post(url, items);
   },
   // Sửa các bản ghi trả hàng chưa confirm
   editReturnProdUnconfirm: (items) => {
      const url = "/returns/unconfirm";
      return axiosClient.patch(url, items);
   },
   // Xóa bản ghi trả hàng chưa confirm theo id
   deleteReturnProdById: (id) => {
      const url = `/returns/${id}`
      return axiosClient.delete(url);
   }
};

export default ReturnProdAPI;