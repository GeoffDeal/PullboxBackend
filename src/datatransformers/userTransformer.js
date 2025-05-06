export const transformUser = (clerkUser, pbUser) => {
  const transformed = {
    id: clerkUser.id,
    boxNumber: pbUser.box_number,
    name: clerkUser.firstName + " " + clerkUser.lastName,
    email: clerkUser.emailAddresses[0].emailAddress,
    customerType: pbUser.status,
  };
  return transformed;
};
