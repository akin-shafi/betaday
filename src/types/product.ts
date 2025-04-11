export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string | null;
    isAvailable: boolean;
    business: {
      name: string;
      city: string;
      state: string;
      deliveryTimeRange?: string; // Match API, optional for flexibility
      rating?: string; // Match API, optional
    };
  }