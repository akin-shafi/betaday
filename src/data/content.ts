// data/content.ts
  
export const textGroups = [
  {
    headline: "Are you hungry?",
    subline: "Beta is here",
    description:
      "Craving restaurant-quality meals? Get chef-crafted dishes delivered faster than you can set the table!",
  },
  {
    headline: "Midnight munchies?",
    subline: "Beta got you covered",
    description:
      "Late-night cravings solved! Our 24/7 delivery brings your favorite meals anytime, anywhere.",
  },
  {
    headline: "Taste the difference",
    subline: "Freshness delivered",
    description:
      "Straight from our partner kitchens to your door - meals so fresh, you'll think you cooked them yourself!",
  },
];

export const categories = [
  { name: "Beans Combo", image: "/images/beans.png" },
  { name: "Rice Dishes", image: "/images/rice.png" },
  { name: "Swallows", image: "/images/swallow.png" },
  { name: "Small Chops", image: "/images/small_chops.png" },
  { name: "Fast Meals", image: "/images/fast_meal.png" },
  { name: "Desserts", image: "/images/delicacy.png" },
  { name: "Drinks", image: "/images/drink.png" },
  { name: "Soups", image: "/images/swallow.png" },
];

// export const categories = [
//   { name: "Restaurant", image: "/icons/restaurant.png" },
//   { name: "Pharmacy", image: "/icons/pharmacy.png" },
//   { name: "Laundry", image: "/icons/laundry.png" },
// ];

export const features = [
  {
    image: "location-1.png",
    title: "Wide selection of restaurants",
    description:
      "Explore diverse cuisines from over 200 top-rated local restaurants, all at your fingertips. From sizzling grills to vegan delights - satisfy every craving!",
  },
  {
    image: "cup-1.png",
    title: "Easy ordering process",
    description:
      "Order in three taps - browse mouthwatering menus, customize meals to your taste, and checkout securely in under a minute. Food freedom made simple!",
  },
  {
    image: "fast-delivery.png",
    title: "Fast delivery within 20 min",
    description:
      "Your food arrives piping hot with our priority delivery network. Guaranteed within 20 minutes or your next meal is on us! Clock's ticking...",
  },
];

export const menuItemsByCategory = {
  combo: [
    {
      id: "combo-1",
      name: "Super Combo Pack",
      description: "Rice + Beans + Plantain + Chicken",
      price: "₦4,500",
      image: "/images/food.png",
      popular: true,
    },
    {
      id: "combo-2",
      name: "Classic Combo",
      description: "Jollof Rice + Chicken + Coleslaw",
      price: "₦3,500",
      image: "/images/food.png",
    },
  ],
  beans: [
    {
      id: "beans-1",
      name: "Favorite Crispy Beans",
      description: "Oil Beans + Plantain",
      price: "₦2,500",
      image: "/images/food.png",
      popular: true,
    },
    {
      id: "beans-2",
      name: "Beans Porridge",
      description: "Porridge Beans + Plantain + Fish",
      price: "₦2,800",
      image: "/images/food.png",
    },
  ],
  spaghetti: [
    {
      id: "spaghetti-1",
      name: "Spicy Spaghetti",
      description: "Spaghetti + Chicken + Vegetables",
      price: "₦2,800",
      image: "/images/food.png",
    },
    {
      id: "spaghetti-2",
      name: "Seafood Spaghetti",
      description: "Spaghetti + Mixed Seafood",
      price: "₦3,500",
      image: "/images/food.png",
      popular: true,
    },
  ],
  rice: [
    {
      id: "rice-1",
      name: "Jollof Rice Special",
      description: "Jollof Rice + Chicken + Plantain",
      price: "₦3,000",
      image: "/images/food.png",
      popular: true,
    },
    {
      id: "rice-2",
      name: "Fried Rice Deluxe",
      description: "Fried Rice + Turkey + Coleslaw",
      price: "₦3,200",
      image: "/images/food.png",
    },
  ],
  swallow: [
    {
      id: "swallow-1",
      name: "Pounded Yam",
      description: "With Egusi Soup + Goat Meat",
      price: "₦2,500",
      image: "/images/food.png",
    },
    {
      id: "swallow-2",
      name: "Amala Special",
      description: "With Ewedu + Gbegiri + Fish",
      price: "₦2,300",
      image: "/images/food.png",
    },
  ],
};

export const restaurant = {
  id: "iya-sharafa",
  name: "Iya Sharafa Bread and Beans ",
  image: "/images/food.png",
  deliveryTime: "11min - 20min",
  rating: "4.5",
  reviews: "62",
  openingTime: "9am - 12pm",
};

export const sampleCategories = [
  { id: "all", name: "All", count: 18 },
  { id: "combo", name: "COMBO", count: 6 },
  { id: "beans", name: "BEANS", count: 4 },
  { id: "spaghetti", name: "SPAGHETTI", count: 3 },
  { id: "rice", name: "RICE", count: 3 },
  { id: "swallow", name: "SWALLOW", count: 2 },
];

export const SEARCH_OPTIONS = [
  {
    category: "Restaurants",
    items: [
      { value: "Food", label: "Food" },
      { value: "Fast Food", label: "Fast Food" },
      { value: "Local Dishes", label: "Local Dishes" },
      { value: "Pizza", label: "Pizza" },
      { value: "Desserts", label: "Desserts" },
    ],
  },
  {
    category: "Supermarket",
    items: [
      { value: "Groceries", label: "Groceries" },
      { value: "Toiletries", label: "Toiletries" },
      { value: "Bread", label: "Bread" },
      { value: "Beverages", label: "Beverages" },
      { value: "Snacks", label: "Snacks" },
    ],
  },
  {
    category: "Pharmacies",
    items: [
      { value: "Medication", label: "Medication" },
      { value: "First Aid Supplies", label: "First Aid Supplies" },
      { value: "Vitamins", label: "Vitamins" },
      { value: "Personal Care", label: "Personal Care" },
    ],
  },
  {
    category: "Local Market",
    items: [
      { value: "Fresh Produce", label: "Fresh Produce" },
      { value: "Meat", label: "Meat" },
      { value: "Fish", label: "Fish" },
      { value: "Spices", label: "Spices" },
    ],
  },
  {
    category: "Laundry",
    items: [
      { value: "Laundry Service", label: "Laundry Service" },
      { value: "Dry Cleaning", label: "Dry Cleaning" },
      { value: "Ironing", label: "Ironing" },
    ],
  },
];
