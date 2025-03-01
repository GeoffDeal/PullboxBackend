// {
//     boxNumber: '',
//     name: 'Jordan Banner',
//     email: 'greyhulk@emailprovider.com',
//     phone: '(709) 555-5566',
//     userID: 6,
//     customer: true,
//     customerType: 'inactive',
//     subList: ['Scarlet Witch'],
//     pulls: [],
// }

// {
// 	"id": 1,
// 	"name": "Rachel Deal",
// 	"email": "qt@test.com",
// 	"box_number": null,
// 	"phone": "333-5555",
// 	"customer": 1,
// 	"status": "pending"
// }

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
