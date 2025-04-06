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

export const transformWeeksPulls = (pull) => {
  const releaseDate = new Date(pull.release_date);
  const formattedRelease = releaseDate.toLocaleDateString("en-CA");

  const focDate = new Date(pull.foc_due_date);
  const formattedFoc = focDate.toLocaleDateString("en-CA");

  const pullDate = new Date(pull.pull_date);
  const formattedPull = pullDate.toLocaleDateString("en-CA");

  const transformed = {
    ID: pull.id,
    ProductName: pull.product_name,
    ItemCode: pull.item_code,
    Sku: pull.sku,
    MSRP: pull.msrp,
    Release: formattedRelease,
    FOCDueDate: formattedFoc,
    ImageURL: pull.image_url,
    Issue: pull.issue,
    Publisher: pull.publisher,
    ProductType: pull.product_type,
    SeriesID: pull.series_id,
    Variant: pull.variant,
    Printing: pull.printing,
    Incentive: pull.incentive,
    userId: pull.user_id,
    amount: pull.amount,
    pullDate: formattedPull,
    pullId: pull.pulls_list_id,
    userName: pull.name,
    userBoxNumber: pull.box_number,
  };
  return transformed;
};
