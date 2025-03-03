export const transformUser = (user) => {
  const transformed = {
    id: user.id,
    boxNumber: user.box_number,
    name: user.name,
    email: user.email,
    phone: user.phone,
    customer: user.customer === 1,
    customerType: user.status,
  };
  return transformed;
};
