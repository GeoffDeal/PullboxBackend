// "ProductName": "ZATANNA: BRING DOWN THE HOUSE #4",
// "Category": "COMICS",
// "ItemCode": "DC06240206",
// "Sku": "76194138125100411",
// "MSRP": "$5.99",
// "Release": "2024-09-25",
// "FOCDueDate": "2024-09-02",
// "Qty.Ord.OnTime": "",
// "Qty.Ord.Late": "",
// "ImageURL": "https://www.universaldist.com/api/v1/images/ec2c8919-3cf4-4ca4-823b-bd0c7257f115/raw?size=l",
// "Issue": "4",
// "Publisher": "Dc",
// "ProductType": "Comic",
// "SeriesSku": "761941381251",
// "IssueSku": "761941381251004",
// "Variant": "1",
// "Printing": "1",

// {
//     "id": 1975,
//     "sku": "76194138623200331",
//     "product_name": "THE NEW GODS #3 BIRTH OF A NEW GOD ACETATE\nSUBJECT TO ALLOCATION",
//     "item_code": "DC11240166",
//     "msrp": "$9.99",
//     "release_date": "2025-02-19T03:30:00.000Z",
//     "foc_due_date": "2025-01-13T03:30:00.000Z",
//     "image_url": "https://www.universaldist.com/api/v1/images/bab2ec0b-fa7d-47ff-ac1c-7fc0eb13fafe/raw?size=l",
//     "issue": "3.0",
//     "variant": "3",
//     "printing": "1",
//     "incentive": null,
//     "series_id": "ecc6e63e-2334-4512-a006-0a9009b130f1",
//     "publisher": "Dc",
//     "product_type": "Comic",
//     "date_added": "2025-02-26T03:30:00.000Z"
// }

export const transformProduct = (product) => {
  const releaseDate = new Date(product.release_date);
  const formattedRelease = releaseDate.toLocaleDateString("en-CA");

  const focDate = new Date(product.foc_due_date);
  const formattedFoc = focDate.toLocaleDateString("en-CA");

  const transformed = {
    ID: product.id,
    ProductName: product.product_name,
    ItemCode: product.item_code,
    Sku: product.sku,
    MSRP: product.msrp,
    Release: formattedRelease,
    FOCDueDate: formattedFoc,
    ImageURL: product.image_url,
    Issue: product.issue,
    Publisher: product.publisher,
    ProductType: product.product_type,
    SeriesID: product.series_id,
    Variant: product.variant,
    Printing: product.printing,
    Incentive: product.incentive,
  };
  return transformed;
};
