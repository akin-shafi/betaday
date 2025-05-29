import Link from "next/link";
import type { ReactNode } from "react";

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string | ReactNode;
}

export interface FAQCategory {
  id: string;
  name: string;
}

export const faqCategories: FAQCategory[] = [
  { id: "all", name: "All Questions" },
  { id: "general", name: "General" },
  { id: "account", name: "Account & Profile" },
  { id: "payments", name: "Payments & Wallet" },
  { id: "delivery", name: "Delivery" },
  { id: "partners", name: "Business Partners" },
  { id: "riders", name: "Delivery Partners" },
];

export const faqData: FAQItem[] = [
  // General Questions
  {
    id: "01",
    category: "general",
    question: "What is BetaDay?",
    answer:
      "BetaDay is a technology company that provides reliable delivery services to both businesses and consumers. We connect local businesses with customers through efficient delivery solutions, enabling businesses to expand their reach while providing consumers with convenient access to products they need. Our platform is designed to make deliveries faster, more reliable, and more affordable for everyone.",
  },
  {
    id: "15",
    category: "general",
    question: "How do I contact customer support?",
    answer:
      "You can contact our customer support team through multiple channels. For immediate assistance, use the in-app chat feature available in the BetaDay app. You can also email us at support@betaday.com or call our customer service line at +234-XXX-XXXX during business hours (8am-10pm daily). For general inquiries, you can reach out to us on social media or visit our Help Center for self-service options and frequently asked questions.",
  },

  // Business Partners - Vendor Handbook
  {
    id: "02",
    category: "partners",
    question: "How do I sign up as a business partner?",
    answer: (
      <>
        Signing up as a business partner with BetaDay is simple. Visit our{" "}
        <Link href="/partner" className="text-orange-300 underline font-medium">
          Partners page
        </Link>{" "}
        and click on {`'Join as a Partner'`}. Fill out the application form with
        your business details, and our team will contact you within 48 hours to
        discuss partnership options and onboarding. We work with businesses of
        all sizes and are committed to creating delivery solutions that meet
        your specific needs.
      </>
    ),
  },
  {
    id: "16",
    category: "partners",
    question: "What documents do I need to become a partner?",
    answer:
      "To become a BetaDay partner, you'll need: (1) Valid business registration certificate or CAC documents, (2) Tax identification number (TIN), (3) Bank account details for payments, (4) Food handler's permit (for food businesses), (5) Business address verification, (6) Valid ID of business owner/manager, and (7) Menu with pricing (for restaurants). Our team will guide you through the document submission process during onboarding.",
  },
  {
    id: "17",
    category: "partners",
    question: "How long does the approval process take?",
    answer:
      "The partner approval process typically takes 3-5 business days after we receive all required documents. Our team reviews your application, verifies documents, and may schedule a brief call or visit to your location. Once approved, we'll provide you with access to the Partner Dashboard and begin the onboarding process. Rush processing is available for urgent cases.",
  },
  {
    id: "18",
    category: "partners",
    question: "What are the commission rates?",
    answer:
      "BetaDay charges a competitive commission rate of 15-20% per order, depending on your business category and order volume. High-volume partners may qualify for reduced rates. There are no setup fees or monthly charges - you only pay when you receive orders. Commission covers payment processing, customer support, marketing, and delivery logistics. Detailed commission structure will be discussed during onboarding.",
  },
  {
    id: "19",
    category: "partners",
    question: "How do I receive payments?",
    answer:
      "Payments are processed weekly every Tuesday for the previous week's orders (Monday to Sunday). Funds are automatically transferred to your registered bank account after deducting applicable commissions and fees. You can track all transactions in real-time through the Partner Dashboard. Payment reports include order details, commission breakdown, and net amounts. Minimum payout threshold is ₦5,000.",
  },
  {
    id: "20",
    category: "partners",
    question: "How do I manage my menu and pricing?",
    answer:
      "Use the Partner Dashboard to easily manage your menu, update prices, add new items, or mark items as unavailable. Changes reflect on the platform within 15 minutes. You can create categories, add item descriptions and photos, set preparation times, and manage inventory. We recommend keeping your menu updated and using high-quality photos to attract more customers.",
  },
  {
    id: "21",
    category: "partners",
    question: "What happens when I receive an order?",
    answer:
      "When you receive an order: (1) You'll get instant notifications via the Partner App and SMS, (2) Accept the order within 2 minutes to maintain good ratings, (3) Prepare the order according to specifications, (4) Update order status as you progress (Accepted → Preparing → Ready), (5) Hand over to the assigned delivery partner, (6) Confirm handover in the app. The entire process is tracked for quality assurance.",
  },
  {
    id: "22",
    category: "partners",
    question: "Can I reject or cancel orders?",
    answer:
      "Yes, you can reject orders within 2 minutes of receiving them if you're unable to fulfill them (e.g., out of ingredients, too busy). However, frequent rejections may affect your Partner Score. For cancellations after acceptance, contact our support team immediately. Valid reasons include ingredient unavailability, equipment failure, or emergency situations. We track cancellation rates to ensure service quality.",
  },
  {
    id: "23",
    category: "partners",
    question: "How do I handle customer complaints?",
    answer:
      "For order-related issues: (1) Address concerns professionally and promptly, (2) Contact BetaDay support if you need assistance, (3) Document any issues in the Partner Dashboard, (4) Offer solutions when possible (remake, refund, etc.). Our customer support team handles most complaints, but your cooperation helps resolve issues faster. Maintaining good customer relationships is key to success on our platform.",
  },
  {
    id: "24",
    category: "partners",
    question: "What are the operating hours and availability?",
    answer:
      "You can set your own operating hours in the Partner Dashboard. Update your availability in real-time - mark yourself as 'Open', 'Busy', or 'Closed'. You can also schedule automatic opening/closing times. During busy periods, you can temporarily stop accepting new orders. We recommend maintaining consistent hours and communicating any changes to avoid customer disappointment.",
  },
  {
    id: "25",
    category: "partners",
    question: "How do I improve my restaurant's visibility?",
    answer:
      "To boost visibility: (1) Maintain high ratings by providing quality food and service, (2) Use attractive, high-quality photos for all menu items, (3) Keep accurate preparation times, (4) Respond quickly to orders, (5) Participate in promotional campaigns, (6) Offer competitive pricing, (7) Keep your menu updated and diverse. Top-performing partners get featured placement and promotional opportunities.",
  },
  {
    id: "26",
    category: "partners",
    question: "What promotional opportunities are available?",
    answer:
      "BetaDay offers various promotional opportunities: (1) Featured restaurant placements, (2) Discount campaigns and flash sales, (3) New customer promotions, (4) Seasonal and holiday campaigns, (5) Social media features, (6) Email newsletter inclusions. High-performing partners get priority access to promotional slots. You can also create your own promotions through the Partner Dashboard.",
  },
  {
    id: "27",
    category: "partners",
    question: "How do I access sales reports and analytics?",
    answer:
      "The Partner Dashboard provides comprehensive analytics: (1) Daily, weekly, and monthly sales reports, (2) Order volume and trends, (3) Customer ratings and feedback, (4) Peak hours analysis, (5) Best-selling items, (6) Revenue breakdowns, (7) Performance comparisons. Export reports in PDF or Excel format. Use these insights to optimize your menu, pricing, and operations.",
  },
  {
    id: "28",
    category: "partners",
    question: "What support is available for partners?",
    answer:
      "BetaDay provides comprehensive partner support: (1) Dedicated partner success manager, (2) 24/7 technical support hotline, (3) Regular training sessions and webinars, (4) Marketing and promotional guidance, (5) Operational best practices sharing, (6) Priority customer service, (7) Partner community forums. Contact support via phone, email, or the Partner Dashboard for immediate assistance.",
  },
  {
    id: "29",
    category: "partners",
    question: "Can I pause or temporarily close my store?",
    answer:
      "Yes, you can temporarily pause your store anytime through the Partner Dashboard. Use this feature during holidays, maintenance, ingredient shortages, or personal emergencies. Set automatic reopening times or manually reactivate when ready. Customers will see your store as 'temporarily closed' with expected reopening time. Extended closures (over 7 days) should be communicated to your partner success manager.",
  },
  {
    id: "30",
    category: "partners",
    question: "How do I handle special dietary requirements and allergies?",
    answer:
      "Clearly mark menu items with dietary information: vegetarian, vegan, gluten-free, nuts, dairy, etc. Use the menu management system to add detailed ingredient lists and allergen warnings. When customers have special requests, read order notes carefully and contact them if clarification is needed. Always err on the side of caution with allergies - if unsure, contact the customer directly through our platform.",
  },
  {
    id: "31",
    category: "partners",
    question: "What are the packaging and food safety requirements?",
    answer:
      "All food must be packaged securely to prevent spills and maintain temperature. Use food-grade containers, seal items properly, and include utensils when necessary. Follow local health department guidelines for food safety and hygiene. Maintain proper food storage temperatures, use fresh ingredients, and ensure clean preparation areas. BetaDay may conduct periodic quality checks to ensure standards are maintained.",
  },
  {
    id: "13",
    category: "partners",
    question: "What is the BetaDay Partner Score?",
    answer:
      "The BetaDay Partner Score is a rating system that helps us maintain high-quality service across our platform. Business partners are rated based on factors like order preparation time, accuracy, customer satisfaction, and overall reliability. A higher score increases your visibility on the platform and can lead to promotional opportunities. We provide regular feedback and suggestions to help partners improve their scores and grow their business with BetaDay.",
  },
  {
    id: "32",
    category: "partners",
    question: "How do I terminate my partnership with BetaDay?",
    answer:
      "You can terminate your partnership anytime by providing 30 days written notice through the Partner Dashboard or by contacting your partner success manager. Complete all pending orders before termination. Final payments will be processed according to the regular schedule. We'll provide a final settlement report and remove your store from the platform. Exit interviews help us improve our services for future partners.",
  },

  // Account & Profile
  {
    id: "03",
    category: "account",
    question: "How do I create a customer account?",
    answer:
      "Creating a customer account on BetaDay takes just a minute. Download our mobile app from the App Store or Google Play, or visit our website and click 'Sign Up'. Enter your name, email, phone number, and create a password. Verify your account through the link sent to your email, and you're ready to start using BetaDay for all your delivery needs.",
  },
  {
    id: "10",
    category: "account",
    question: "How do I update my profile?",
    answer:
      "To update your profile, log in to your BetaDay account and click on your profile icon in the top right corner. Select 'Account Settings' from the dropdown menu. Here, you can edit your personal information, update your delivery addresses, change your password, and manage your notification preferences. Remember to click 'Save Changes' after making any updates to ensure your new information is stored.",
  },

  // Payments & Wallet
  {
    id: "04",
    category: "payments",
    question: "What is BetaDay Wallet?",
    answer:
      "BetaDay Wallet is our secure in-app payment system that makes transactions faster and more convenient. You can add funds to your wallet using various payment methods, including credit/debit cards and bank transfers. The wallet allows for quick checkout, easy refunds, and special promotions. All transactions are encrypted and protected by industry-standard security protocols.",
  },
  {
    id: "11",
    category: "payments",
    question: "How do I delete a saved payment method?",
    answer:
      "To delete a saved payment method, log in to your BetaDay account and go to 'Account Settings'. Navigate to the 'Payment Methods' tab where you'll see all your saved cards and payment options. Click the three dots next to the payment method you want to remove and select 'Delete'. You'll be asked to confirm this action. For security reasons, you may need to enter your password to complete the deletion process.",
  },
  {
    id: "12",
    category: "payments",
    question: "How do I fund my BetaDay wallet?",
    answer:
      "To fund your BetaDay wallet, log in to your account and click on 'Wallet' in the main menu. Select 'Add Funds' and enter the amount you wish to add. Choose your preferred payment method from the options provided (card, bank transfer, or other available methods). Follow the prompts to complete the transaction. Funds are usually added instantly, but bank transfers may take up to 24 hours to reflect in your wallet.",
  },

  // Delivery
  {
    id: "05",
    category: "delivery",
    question: "What areas do you currently serve?",
    answer:
      "BetaDay currently operates in select urban areas, with plans for rapid expansion. Our service is available in major neighborhoods of Lagos, with plans to expand to other cities soon. You can check if we deliver to your area by entering your address in our app or website. We're constantly growing our coverage area to serve more communities.",
  },
  {
    id: "06",
    category: "delivery",
    question: "What is the delivery fee?",
    answer:
      "Our delivery fees are calculated based on distance, package size, and delivery urgency. We strive to keep our fees competitive and transparent. The exact fee for your delivery will be displayed before you confirm your order. BetaDay Plus members enjoy reduced or waived delivery fees on eligible orders. We also offer special rates for business partners with regular delivery needs.",
  },
  {
    id: "08",
    category: "delivery",
    question: "What is Priority delivery?",
    answer:
      "Priority delivery is our premium service option that ensures your package is delivered with the highest urgency. When you select Priority delivery, your order is placed at the front of the queue and assigned to our fastest riders. This service comes with a slightly higher fee but guarantees the quickest possible delivery time, making it perfect for urgent items or time-sensitive deliveries.",
  },
  {
    id: "09",
    category: "delivery",
    question: "Why do you charge Priority fees?",
    answer:
      "Priority fees allow us to offer expedited delivery services for time-sensitive orders. These fees compensate our delivery partners for the additional effort required to prioritize your delivery over standard orders. They also help us maintain service quality by ensuring we have enough delivery partners available for urgent requests, even during peak hours. The Priority fee is always displayed transparently before you confirm your order.",
  },

  // Delivery Partners (Riders)
  {
    id: "07",
    category: "riders",
    question: "How do I become a delivery partner?",
    answer:
      "To become a BetaDay delivery partner, visit our 'Join as a Rider' page and complete the application form. You'll need to provide personal information, vehicle details, and required documentation. Qualified applicants will be invited for an orientation session. We provide training, branded gear, and ongoing support to help our delivery partners succeed. Join our team to enjoy flexible hours and competitive earnings.",
  },
  {
    id: "14",
    category: "riders",
    question: "How do riders get paid?",
    answer:
      "BetaDay delivery partners (riders) receive weekly payments for all completed deliveries. Earnings include base delivery fees plus any tips from customers. Payments are automatically transferred to the rider's registered bank account every Monday for the previous week's work. Riders can track their earnings in real-time through the BetaDay Rider app, which provides a detailed breakdown of each delivery and associated earnings.",
  },
];

// Helper functions
export const getFAQsByCategory = (category: string): FAQItem[] => {
  if (category === "all") return faqData;
  return faqData.filter((faq) => faq.category === category);
};

export const getFAQById = (id: string): FAQItem | undefined => {
  return faqData.find((faq) => faq.id === id);
};

export const getCategoryById = (id: string): FAQCategory | undefined => {
  return faqCategories.find((category) => category.id === id);
};
