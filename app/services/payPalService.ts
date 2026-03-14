import api from "../api/api";
import PayPalOrderRequest from "../models/payPal";



export const createOrderPayPal = async (body: PayPalOrderRequest) => {
  try {
    const response = await api.post("/orders", body);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create order");
  }
};

export const captureOrderPayPal = async (orderId:string) => {
  try {

    const response = await api.post(`/orders/${orderId}/capture`);
    return response.data;
    
  } catch (error) {
   throw new Error("Failed to capture order");
  }
};