const API_URL = process.env.NEXT_PUBLIC_BASE_URL; // Use Vite environment variable

// ================== Businesses =========================== //
export const fetchBusinesses = async (token) => {
  try {
    const response = await fetch(`${API_URL}/businesses`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch businesses.");
    }

    const data = await response.json();
    console.log("data", data.businesses);
    // Ensure that data is always an array
    return Array.isArray(data.businesses) ? data.businesses : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching businesses.");
  }
};

// Updated fetchBusinessById function with relations parameter type
export const fetchBusinessById = async (id, relations = "") => {
  try {
    const url =
      relations != ""
        ? `${API_URL}/businesses/${id}?relations=${relations}`
        : `${API_URL}/businesses/${id}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch business details.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error fetching business details.");
  }
};

// const fetchBusinessById = async (id: string, relations?: string) => {
//   const response = await fetch(`${API_URL}/businesses/${id}?relations=${relations}`);
//   if (!response.ok) {
//     throw new Error("Failed to fetch business");
//   }
//   return response.json();
// };

export const createBusiness = async (data, token) => {
  const response = await fetch(`${API_URL}/businesses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create business.");
  }

  return response.json();
};

export const updateBusiness = async (id, data, token) => {
  const response = await fetch(`${API_URL}/businesses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteBusiness = async (id, token) => {
  const response = await fetch(`${API_URL}/businesses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete business");
};
