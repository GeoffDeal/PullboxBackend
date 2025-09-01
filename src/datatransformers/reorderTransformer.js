import { stripTime } from "../utils/timeFunctions.js";

export const transformReorder = (reorder) => {
  const transformed = {
    id: reorder.id,
    userId: reorder.user_id,
    product: reorder.product,
    notes: reorder.notes,
    orderDate: stripTime(reorder.order_date),
    requestDate: stripTime(reorder.request_date),
    orderStatus: reorder.order_status,
    updatedAt: stripTime(reorder.updated_at),
    ...(reorder.userName && { userName: reorder.userName }),
  };
  return transformed;
};
