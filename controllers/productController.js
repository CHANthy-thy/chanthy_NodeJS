let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 500 }
];

// --- Existing Functions ---
const getProducts = (req, res) => {
  res.status(200).json(products);
};

const createProduct = (req, res) => {
  const newProduct = req.body;
  products.push(newProduct);

  res.status(201).json({
    message: "Product created successfully!",
    product: newProduct
  });
};

// --- UPDATE Function ---
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const index = products.findIndex(p => p.id == id);

  if (index !== -1) {
    products[index] = { ...products[index], name, price };

    res.status(200).json({
      message: "Product updated successfully!",
      product: products[index]
    });
  } else {
    res.status(404).json({
      message: "Product not found!"
    });
  }
};

// --- DELETE Function ---
const deleteProduct = (req, res) => {
  const { id } = req.params;

  products = products.filter(p => p.id != id);

  res.status(200).json({
    message: "Product deleted successfully!"
  });
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};