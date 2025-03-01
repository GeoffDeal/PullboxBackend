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
