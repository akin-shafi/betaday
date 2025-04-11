const API_URL = import.meta.env.VITE_API_BASE_URL;

// ================== Products =========================== //
export const fetchProducts = async (token, businessId = null) => {
  try {
    const url = businessId
      ? `${API_URL}/products?businessId=${businessId}`
      : `${API_URL}/products`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch products.");
    }

    const data = await response.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching products.");
  }
};

export const fetchProductById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch product details.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error fetching product details.");
  }
};

export const createProduct = async (data, token) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create product.");
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message || "Error creating product.");
  }
};

export const updateProduct = async (id, data, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update product.");
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message || "Error updating product.");
  }
};

export const deleteProduct = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete product.");
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message || "Error deleting product.");
  }
};

export const updateProductStatus = async (id, isActive, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update product status.");
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message || "Error updating product status.");
  }
};

export const updateProductStock = async (id, stock, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}/stock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stock }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update product stock.");
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message || "Error updating product stock.");
  }
};

export const uploadProductImage = async (id, imageFile, token) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${API_URL}/products/${id}/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload product image.");
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message || "Error uploading product image.");
  }
};

export const searchProducts = async (query, token, businessId = null) => {
  try {
    const url = businessId
      ? `${API_URL}/products/search?q=${query}&businessId=${businessId}`
      : `${API_URL}/products/search?q=${query}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search products.");
    }

    const data = await response.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (error) {
    throw new Error(error.message || "Error searching products.");
  }
};

export const getProductCategories = async (token) => {
  try {
    const response = await fetch(`${API_URL}/products/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch product categories."
      );
    }

    const data = await response.json();
    return Array.isArray(data.categories) ? data.categories : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching product categories.");
  }
};
