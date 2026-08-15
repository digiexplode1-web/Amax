export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  categoryId: string;
  images: string[];
  imageUrl?: string; // fallback single image
  imageStoragePath?: string; // Firebase Storage object path
  material?: string; // e.g. Mild Steel, Stainless Steel, MDF, WPC, Brass
  dimensions?: string; // e.g. 4ft x 8ft, Custom
  thickness?: string; // e.g. 2mm, 3mm, 6mm, 12mm
  finish?: string; // e.g. Powder Coated, Gold PVD, Antique Brass, Natural Wood
  isActive: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isWeddingEssential?: boolean;
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string | Date | any;
  updatedAt?: string | Date | any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  itemCount?: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  ctaText?: string;
  isActive: boolean;
  position?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedFinish?: string;
  customNotes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  selectedFinish?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount?: number;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  aboutText: string;
  currency: string;
}

export interface HomepageSettings {
  hero: {
    heading: string;
    highlightedWord: string;
    subheading: string;
    description: string;
    backgroundImageUrl: string;
    badgeText: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  announcementText: string;
}
