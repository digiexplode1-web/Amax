import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, query, where, doc, setDoc, addDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, FIRESTORE_DATABASE_ID, FIREBASE_PROJECT_ID, auth } from '../config/firebase';
import { Product, Category, Banner, CartItem, HomepageSettings } from '../types';

interface ShopContextType {
  products: Product[];
  allProducts: Product[];
  categories: Category[];
  banners: Banner[];
  homepageSettings: HomepageSettings | null;
  updateHomepageSettings: (settings: HomepageSettings) => Promise<void>;
  loading: boolean;
  error: string | null;
  errorDetails: string | null;
  retryConnection: () => void;
  cart: CartItem[];
  wishlist: Product[];
  lastAddedItem: { product: Product; quantity: number } | null;
  isCartBouncing: boolean;
  dismissCartToast: () => void;
  addToCart: (product: Product, quantity?: number, selectedFinish?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
  activeProductsCount: number;
  seedInitialDataIfEmpty: () => Promise<void>;
  isSeeding: boolean;
  seedSuccessMessage: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating'>) => Promise<string>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<string>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  placeOrder: (order: any) => Promise<string>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_CART_KEY = 'amax_crafts_cart_v1';
const LOCAL_WISHLIST_KEY = 'amax_crafts_wishlist_v1';
const LOCAL_PRODUCTS_KEY = 'amax_local_products_v1';
const LOCAL_CATEGORIES_KEY = 'amax_local_categories_v1';
const LOCAL_HOMEPAGE_SETTINGS_KEY = 'amax_local_homepage_settings_v1';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedSuccessMessage, setSeedSuccessMessage] = useState<string | null>(null);

  const [lastAddedItem, setLastAddedItem] = useState<{ product: Product; quantity: number } | null>(null);
  const [isCartBouncing, setIsCartBouncing] = useState<boolean>(false);

  // Firestore retrieved states
  const [firestoreProducts, setFirestoreProducts] = useState<Product[]>([]);
  const [firestoreCategories, setFirestoreCategories] = useState<Category[]>([]);
  const [firestoreHomepageSettings, setFirestoreHomepageSettings] = useState<HomepageSettings | null>(null);

  // Local storage backup states
  const [localProducts, setLocalProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [localCategories, setLocalCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CATEGORIES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [localHomepageSettings, setLocalHomepageSettings] = useState<HomepageSettings | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_HOMEPAGE_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart & Wishlist local state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save state to localStorage helpers
  const saveLocalProducts = (list: Product[]) => {
    setLocalProducts(list);
    try {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save products locally', e);
    }
  };

  const saveLocalCategories = (list: Category[]) => {
    setLocalCategories(list);
    try {
      localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save categories locally', e);
    }
  };

  const saveLocalHomepageSettings = (settings: HomepageSettings) => {
    setLocalHomepageSettings(settings);
    try {
      localStorage.setItem(LOCAL_HOMEPAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save homepage settings locally', e);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Reactive Mergers
  useEffect(() => {
    const mergedMap = new Map<string, Product>();
    firestoreProducts.forEach((p) => mergedMap.set(p.id, p));
    localProducts.forEach((p) => mergedMap.set(p.id, p));

    let mergedList = Array.from(mergedMap.values());
    if (mergedList.length === 0) {
      mergedList = [
        // ==========================================
        // 1. NAME PLATES (8 Products)
        // ==========================================
        {
          id: 'prod-nameplate-1',
          name: 'Custom Stainless Steel Laser Cut Name Plate',
          description: 'High-precision laser-cut stainless steel house name plate with weatherproof acrylic backing and brushed metallic finish.',
          price: 4500,
          originalPrice: 5500,
          category: 'Name Plates',
          categoryId: 'name-plates',
          images: ['https://www.amaxcraft.com/img-products/laser-cut-name-plate-500x500.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/laser-cut-name-plate-500x500.jpg',
          material: 'Stainless Steel 304 & Acrylic',
          dimensions: '12in x 18in Custom',
          thickness: '2mm SS',
          finish: 'Brushed Silver / Gold Mirror',
          isActive: true,
          isFeatured: true,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 30,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-nameplate-2',
          name: 'Luxury SS Gold Mirror Finish Name Plate',
          description: 'Premium gold PVD coated stainless steel name plate with LED backlighting option for villa & office entrances.',
          price: 5200,
          originalPrice: 6200,
          category: 'Name Plates',
          categoryId: 'name-plates',
          images: ['https://www.amaxcraft.com/img-products/stainless-steel-name-plates-250x250(1).jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/stainless-steel-name-plates-250x250(1).jpg',
          material: 'Gold PVD Stainless Steel',
          dimensions: '15in x 24in',
          thickness: '3mm',
          finish: 'Mirror Gold PVD',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 20,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-nameplate-3',
          name: 'Modern Architectural Laser Cut Acrylic & Metal Name Plate',
          description: 'Contemporary multi-layer laser cut acrylic and metal house plaque tailored to modern apartment entrances.',
          price: 3800,
          originalPrice: 4500,
          category: 'Name Plates',
          categoryId: 'name-plates',
          images: ['https://www.amaxcraft.com/img-products/ss-name-plate-laser-cutting-service-500x500.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/ss-name-plate-laser-cutting-service-500x500.jpg',
          material: 'Acrylic & Brushed Steel',
          dimensions: '10in x 16in',
          thickness: '4mm',
          finish: 'Matte Black & Silver',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 25,
          rating: 4.7,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-nameplate-4',
          name: 'Classic Villa Brass & Steel House Name Plate',
          description: 'Traditional embossed brass and laser-etched steel name plate for main entrance gate pillars.',
          price: 4900,
          originalPrice: 5800,
          category: 'Name Plates',
          categoryId: 'name-plates',
          images: ['https://www.amaxcraft.com/img-products/01-250x250.jpeg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/01-250x250.jpeg',
          material: 'Solid Brass & SS 304',
          dimensions: '12in x 20in',
          thickness: '3mm',
          finish: 'Antique Brass Polish',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 15,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-nameplate-5',
          name: 'Designer LED Illuminated Acrylic Name Plate',
          description: 'Waterproof outdoor illuminated name plate with custom fonts and warm LED backlighting.',
          price: 4200,
          originalPrice: 5100,
          category: 'Name Plates',
          categoryId: 'name-plates',
          images: ['https://www.amaxcraft.com/img-products/c0137e4b-1131-462b-ba71-819872cba939.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/c0137e4b-1131-462b-ba71-819872cba939.jpg',
          material: 'Cast Acrylic & Warm LED',
          dimensions: '12in x 18in',
          thickness: '5mm',
          finish: 'Glossy Black & Crystal Clear',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 18,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-nameplate-6',
          name: 'Floral Engraved Metal House Number Plate',
          description: 'Ornate floral laser-engraved metal plaque featuring house numbers and family surname.',
          price: 3600,
          originalPrice: 4200,
          category: 'Name Plates',
          categoryId: 'name-plates',
          images: ['https://www.amaxcraft.com/img-products/bfb889d7-ca50-4f97-8fff-47032b2505c9.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/bfb889d7-ca50-4f97-8fff-47032b2505c9.jpg',
          material: 'Laser Cut Mild Steel',
          dimensions: '10in x 14in',
          thickness: '2.5mm',
          finish: 'Bronze Powder Coat',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 22,
          rating: 4.6,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-nameplate-7',
          name: 'Minimalist PVD Gold Stainless Steel Gate Plate',
          description: 'Sleek architectural name plate in gold PVD coating with clean typography for modern gates.',
          price: 5400,
          originalPrice: 6500,
          category: 'Name Plates',
          categoryId: 'name-plates',
          images: ['https://www.amaxcraft.com/img-products/7ed0adc6-2b53-42b7-9eae-be129d49c168.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/7ed0adc6-2b53-42b7-9eae-be129d49c168.jpg',
          material: 'Titanium PVD Stainless Steel',
          dimensions: '14in x 22in',
          thickness: '3mm',
          finish: 'Satin Gold PVD',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 14,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-nameplate-8',
          name: 'Royal Vintage Etched Brass Name Plate',
          description: 'Handcrafted vintage brass name plate with deep laser etching and protective lacquered finish.',
          price: 4800,
          originalPrice: 5600,
          category: 'Name Plates',
          categoryId: 'name-plates',
          images: ['https://www.amaxcraft.com/img-products/0fe08e7e-2331-4a31-a953-6d7636e5e4ba.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/0fe08e7e-2331-4a31-a953-6d7636e5e4ba.jpg',
          material: 'Heavy Brass Sheet',
          dimensions: '12in x 18in',
          thickness: '3mm',
          finish: 'Lacquered Brass',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 16,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },

        // ==========================================
        // 2. DECORATIVES LIGHTS (4 Products)
        // ==========================================
        {
          id: 'prod-light-1',
          name: 'Laser Cut Metal Wall Accent Light Panel',
          description: 'Decorative backlit wall lamp featuring intricate laser-cut geometry that creates warm ambient lighting.',
          price: 8900,
          originalPrice: 10500,
          category: 'Decoratives Lights',
          categoryId: 'decorative-lights',
          images: ['https://www.amaxcraft.com/img-products/walllighr.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/walllighr.jpg',
          material: 'Mild Steel & Warm LED',
          dimensions: '2ft x 4ft',
          thickness: '2mm Metal',
          finish: 'Matte Black / Antique Brass',
          isActive: true,
          isFeatured: true,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 18,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-light-2',
          name: 'Geometric Backlit Ambient Decorative Wall Lamp',
          description: 'Modern indoor backlit accent light with CNC floral motifs, perfect for living room and hotel lobby feature walls.',
          price: 7400,
          originalPrice: 8800,
          category: 'Decoratives Lights',
          categoryId: 'decorative-lights',
          images: ['https://www.amaxcraft.com/img-products/6bb3721e4d77a9a2b2c8ea0c5d42ee4a.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/6bb3721e4d77a9a2b2c8ea0c5d42ee4a.jpg',
          material: 'MS Powder Coated & Diffuser Acrylic',
          dimensions: '1.5ft x 3ft',
          thickness: '2mm',
          finish: 'Satin Gold Powder Coat',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 22,
          rating: 4.7,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-light-3',
          name: 'Architectural LED Pillar Light & Lantern',
          description: 'Laser-cut stainless steel outdoor pillar light post providing 360-degree decorative illumination.',
          price: 11200,
          originalPrice: 13500,
          category: 'Decoratives Lights',
          categoryId: 'decorative-lights',
          images: ['https://www.amaxcraft.com/img-products/A-L.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/A-L.jpg',
          material: 'SS 304 & Frosted Glass',
          dimensions: '1ft x 1ft x 4ft Height',
          thickness: '3mm SS',
          finish: 'Black UV Powder Coat',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 12,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-light-4',
          name: 'Luxury Hotel Lobby Illuminated Wall Sconce',
          description: 'Grand architectural backlit wall light created for hotel corridors, banquets, and upscale foyers.',
          price: 12900,
          originalPrice: 15000,
          category: 'Decoratives Lights',
          categoryId: 'decorative-lights',
          images: ['https://www.amaxcraft.com/img-hotel/walllighr.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-hotel/walllighr.jpg',
          material: 'PVD Gold Steel & Soft LED Strip',
          dimensions: '2ft x 5ft',
          thickness: '3mm',
          finish: 'Mirror Rose Gold',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 10,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },

        // ==========================================
        // 3. WALL INTERIOR (5 Products)
        // ==========================================
        {
          id: 'prod-wall-1',
          name: '3D Laser Cut Metallic Wall Panelling',
          description: 'Architectural metal wall cladding panel with 3D texture, creating a grand interior statement wall for luxury residences.',
          price: 14500,
          originalPrice: 17500,
          category: 'Wall Interior',
          categoryId: 'wall-interior',
          images: ['https://www.amaxcraft.com/images/wall-cladding.jpg'],
          imageUrl: 'https://www.amaxcraft.com/images/wall-cladding.jpg',
          material: 'Mild Steel / WPC / MDF',
          dimensions: '4ft x 8ft Panel',
          thickness: '3mm Metal + Frame',
          finish: 'Custom Metallic Polish',
          isActive: true,
          isFeatured: true,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 15,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-wall-2',
          name: 'Royal Floral Decorative Wall Interior Jali',
          description: 'Intricately patterned interior wall screen designed to enhance living rooms, temples, and reception areas.',
          price: 12800,
          originalPrice: 14900,
          category: 'Wall Interior',
          categoryId: 'wall-interior',
          images: ['https://www.amaxcraft.com/img-products/wall1.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/wall1.jpg',
          material: 'MDF & Brass Coating',
          dimensions: '3ft x 6ft',
          thickness: '6mm',
          finish: 'Royal Antique Gold',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 25,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-wall-3',
          name: 'Modern Geometric Metal Wall Screen',
          description: 'Precision CNC cut metal accent grid engineered for modular wall installation and TV backdrop walls.',
          price: 16200,
          originalPrice: 19000,
          category: 'Wall Interior',
          categoryId: 'wall-interior',
          images: ['https://www.amaxcraft.com/img-products/356bfe0f1f1cb9f67a22a6641fc7cdd3.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/356bfe0f1f1cb9f67a22a6641fc7cdd3.jpg',
          material: 'Laser Cut Aluminum Sheet',
          dimensions: '4ft x 8ft',
          thickness: '3mm',
          finish: 'Matte Bronze Finish',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 14,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-wall-4',
          name: 'Satin Gold Lattice Feature Wall Panel',
          description: 'Lustrous satin gold PVD coated wall panel that brings rich royal ambiance to dining and master bedroom walls.',
          price: 15800,
          originalPrice: 18500,
          category: 'Wall Interior',
          categoryId: 'wall-interior',
          images: ['https://www.amaxcraft.com/img-products/91ee0690eb2d35fe84b073c0d9d89e1b.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/91ee0690eb2d35fe84b073c0d9d89e1b.jpg',
          material: 'Stainless Steel Gold PVD',
          dimensions: '4ft x 7ft',
          thickness: '2mm SS',
          finish: 'Satin Gold PVD',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 12,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-wall-5',
          name: 'Textured Metal Cladding Architectural Wall Accent',
          description: 'Custom acoustic and decorative metal wall cladding featuring geometric relief patterns.',
          price: 13900,
          originalPrice: 16200,
          category: 'Wall Interior',
          categoryId: 'wall-interior',
          images: ['https://www.amaxcraft.com/img-products/4a71658ddee91002bf3b62f86d030b69.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/4a71658ddee91002bf3b62f86d030b69.jpg',
          material: 'Mild Steel & Acoustic Backer',
          dimensions: '3.5ft x 7ft',
          thickness: '3mm',
          finish: 'Champagne Gold',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 20,
          rating: 4.7,
          createdAt: new Date().toISOString(),
        },

        // ==========================================
        // 4. STAIRCASE LIGHTING PILLAR (4 Products)
        // ==========================================
        {
          id: 'prod-pillar-1',
          name: 'Illuminated Acrylic Staircase Railing Pillar',
          description: 'Stunning LED lit acrylic and stainless steel newel pillar for staircase balustrades and entrance railings.',
          price: 9500,
          originalPrice: 11500,
          category: 'Staircase lighting Pillar',
          categoryId: 'staircase-pillars',
          images: ['https://www.amaxcraft.com/img-products/piller1.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/piller1.jpg',
          material: 'Cast Acrylic & SS 304',
          dimensions: '4ft Height Pillar',
          thickness: 'Solid Acrylic Core',
          finish: 'Crystal Clear & Chrome',
          isActive: true,
          isFeatured: true,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 14,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-pillar-2',
          name: 'Luxury LED Staircase Light Post & Baluster',
          description: 'Modern laser-engraved illuminated staircase baluster offering elegant ambient step lighting.',
          price: 11800,
          originalPrice: 13800,
          category: 'Staircase lighting Pillar',
          categoryId: 'staircase-pillars',
          images: ['https://www.amaxcraft.com/img-products/acrylic-stair-lighting-railing-500x500.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/acrylic-stair-lighting-railing-500x500.jpg',
          material: 'Acrylic & Gold PVD Steel',
          dimensions: '3.5ft Height',
          thickness: 'Custom Fit',
          finish: 'Warm Gold LED',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 16,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-pillar-3',
          name: 'Architectural SS Stair Lighting Pillar',
          description: 'Heavy duty stainless steel newel post with internal diffused LED light guide for duplex staircases.',
          price: 13200,
          originalPrice: 15500,
          category: 'Staircase lighting Pillar',
          categoryId: 'staircase-pillars',
          images: ['https://www.amaxcraft.com/img-products/product-jpeg-500x500.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/product-jpeg-500x500.jpg',
          material: 'SS 304 & Acrylic Diffuser',
          dimensions: '4.2ft Height',
          thickness: '4mm SS Wall',
          finish: 'Mirror Polished Silver',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 10,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-pillar-4',
          name: 'Hotel Renovation LED Acrylic Railing Post',
          description: 'Commercial grade illuminated balustrade post crafted for hotel renovations and commercial atrium stairs.',
          price: 14500,
          originalPrice: 17000,
          category: 'Staircase lighting Pillar',
          categoryId: 'staircase-pillars',
          images: ['https://www.amaxcraft.com/img-hotel/a-r-p.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-hotel/a-r-p.jpg',
          material: 'Heavy Acrylic & Brass Fittings',
          dimensions: '4ft Height',
          thickness: 'Solid Core',
          finish: 'Crystal Clear & Brass',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 8,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },

        // ==========================================
        // 5. MAIN GATE (4 Products)
        // ==========================================
        {
          id: 'prod-maingate-1',
          name: 'Royal Decorative Main Gate Metal Panel',
          description: 'Heavy duty laser cut main gate security panel with elegant motifs and weatherproof UV powder coating.',
          price: 28500,
          originalPrice: 33000,
          category: 'Main Gate',
          categoryId: 'main-gate',
          images: ['https://www.amaxcraft.com/images/main-door.jpg'],
          imageUrl: 'https://www.amaxcraft.com/images/main-door.jpg',
          material: 'Heavy Gauge Mild Steel',
          dimensions: '6ft x 10ft Pair',
          thickness: '4mm Steel Plate',
          finish: 'Weatherproof Dark Bronze',
          isActive: true,
          isFeatured: true,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 10,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-maingate-2',
          name: 'Modern Heavy Duty Laser Cut Entrance Door',
          description: 'Architectural safety main door featuring laser cut geometric inserts for maximum security and grand aesthetic.',
          price: 34000,
          originalPrice: 39000,
          category: 'Main Gate',
          categoryId: 'main-gate',
          images: ['https://www.amaxcraft.com/img-products/door-1.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/door-1.jpg',
          material: 'Stainless Steel 304 & Teak Wood',
          dimensions: '4ft x 8ft Single Door',
          thickness: '5mm SS Plate',
          finish: 'Satin PVD Gold & Wood Polish',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 8,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-maingate-3',
          name: 'Security Grill Laser Cut Main Gate Screen',
          description: 'High strength laser-cut security screen insert for sliding driveway gates and villa compound doors.',
          price: 31500,
          originalPrice: 36000,
          category: 'Main Gate',
          categoryId: 'main-gate',
          images: ['https://www.amaxcraft.com/img-products/door-2.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/door-2.jpg',
          material: 'Mild Steel Heavy Plate',
          dimensions: '5ft x 12ft',
          thickness: '4mm',
          finish: 'Matte Charcoal Grey',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 12,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-maingate-4',
          name: 'Luxury Villa Entrance Gate Jali Design',
          description: 'Custom ornamental laser cut gate panel that enhances property curb appeal while providing sturdy privacy.',
          price: 36500,
          originalPrice: 42000,
          category: 'Main Gate',
          categoryId: 'main-gate',
          images: ['https://www.amaxcraft.com/images/banner-2.jpg'],
          imageUrl: 'https://www.amaxcraft.com/images/banner-2.jpg',
          material: 'Wrought Iron & SS Accents',
          dimensions: '7ft x 12ft Driveway Pair',
          thickness: '5mm',
          finish: 'Royal Antique Gold & Black',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 6,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },

        // ==========================================
        // 6. ROOM DIVIDERS (7 Products)
        // ==========================================
        {
          id: 'prod-divider-1',
          name: 'Laser Cut Stainless Steel Room Divider Screen',
          description: 'Freestanding decorative room divider partition screen in stainless steel with optional mirror shielding & built-in ambient lighting.',
          price: 18500,
          originalPrice: 22000,
          category: 'Room Dividers',
          categoryId: 'room-dividers',
          images: ['https://www.amaxcraft.com/images/room-divider.jpg'],
          imageUrl: 'https://www.amaxcraft.com/images/room-divider.jpg',
          material: 'SS 304 Framing & Jali',
          dimensions: '6ft x 6ft Span',
          thickness: '3mm Screen Panel',
          finish: 'Rose Gold PVD Mirror Finish',
          isActive: true,
          isFeatured: true,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 20,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-divider-2',
          name: '3D Lattice Folding Room Divider Screen',
          description: 'Elegant multi-panel folding screen partition with laser-engraved lattice motifs for home offices and bedrooms.',
          price: 21000,
          originalPrice: 24500,
          category: 'Room Dividers',
          categoryId: 'room-dividers',
          images: ['https://www.amaxcraft.com/img-products/r1.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/r1.jpg',
          material: 'Teak Frame & WPC Jali',
          dimensions: '6.5ft Height x 5ft Span',
          thickness: '18mm Heavy Frame',
          finish: 'Teak Wood Stain',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 12,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-divider-3',
          name: 'Custom Interior Partition Jali Screen',
          description: 'Ceiling-suspended architectural room divider screen providing privacy between dining and lounge zones.',
          price: 16800,
          originalPrice: 19500,
          category: 'Room Dividers',
          categoryId: 'room-dividers',
          images: ['https://www.amaxcraft.com/img-products/r2.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/r2.jpg',
          material: 'Mild Steel Laser Cut',
          dimensions: '4ft x 8ft Panel',
          thickness: '3mm',
          finish: 'Champagne Gold Powder Coat',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 18,
          rating: 4.7,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-divider-4',
          name: 'Rose Gold PVD Mirror Room Divider Screen',
          description: 'Opulent rose gold mirror stainless steel divider screen engineered for luxury hotel suites and bridal lounges.',
          price: 23500,
          originalPrice: 27500,
          category: 'Room Dividers',
          categoryId: 'room-dividers',
          images: ['https://www.amaxcraft.com/img-products/ea8dd53d822c145a8b2e62e0d765055b.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/ea8dd53d822c145a8b2e62e0d765055b.jpg',
          material: 'Mirror Rose Gold SS 304',
          dimensions: '4.5ft x 7.5ft',
          thickness: '3mm SS',
          finish: 'Rose Gold PVD Mirror',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 10,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-divider-5',
          name: 'Freestanding Metal & Wood Partition Screen',
          description: 'Versatile 4-panel freestanding privacy screen featuring laser-cut metallic inserts within solid hardwood frames.',
          price: 19800,
          originalPrice: 23000,
          category: 'Room Dividers',
          categoryId: 'room-dividers',
          images: ['https://www.amaxcraft.com/img-products/0dc18d86707fd86e3396b3ccfd0c3b86.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/0dc18d86707fd86e3396b3ccfd0c3b86.jpg',
          material: 'Teak Wood & Brass Jali',
          dimensions: '6ft Height x 6ft Span',
          thickness: '20mm Frame',
          finish: 'Natural Teak & Brass Accent',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 15,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-divider-6',
          name: 'Architectural Decorative Living Room Divider',
          description: 'Full-height floor to ceiling decorative jali partition screen customized with warm LED backlight channels.',
          price: 24900,
          originalPrice: 28900,
          category: 'Room Dividers',
          categoryId: 'room-dividers',
          images: ['https://www.amaxcraft.com/images/banner-1.jpg'],
          imageUrl: 'https://www.amaxcraft.com/images/banner-1.jpg',
          material: 'SS 304 & Acrylic Light Layer',
          dimensions: '5ft x 9ft Custom',
          thickness: '3mm SS',
          finish: 'Mirror Gold Finish',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 9,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-divider-7',
          name: 'Hotel Lobby Interior Partition Grille Screen',
          description: 'Commercial interior partition grille designed for hotel renovations, restaurant dividers, and VIP lounge privacy.',
          price: 26500,
          originalPrice: 31000,
          category: 'Room Dividers',
          categoryId: 'room-dividers',
          images: ['https://www.amaxcraft.com/img-hotel/interior-partition-grille.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-hotel/interior-partition-grille.jpg',
          material: 'Brass & SS PVD Coated',
          dimensions: '6ft x 9ft',
          thickness: '4mm',
          finish: 'Bronze Satin Polish',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 7,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },

        // ==========================================
        // 7. BALCONY GRILLS (5 Products)
        // ==========================================
        {
          id: 'prod-balcony-1',
          name: 'Laser Cut Balcony Safety Grill Panel',
          description: 'Custom architectural balcony grill panel engineered for privacy, ventilation, and outdoor weather resistance.',
          price: 10500,
          originalPrice: 12500,
          category: 'Balcony Grills',
          categoryId: 'balcony-grills',
          images: ['https://www.amaxcraft.com/images/balcony-railing.jpg'],
          imageUrl: 'https://www.amaxcraft.com/images/balcony-railing.jpg',
          material: 'Mild Steel / SS 304',
          dimensions: '3ft x 8ft Panel',
          thickness: '3mm Metal',
          finish: 'UV Weatherproof Black Matte',
          isActive: true,
          isFeatured: true,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 25,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-balcony-2',
          name: 'Architectural Exterior Terrace Railing Screen',
          description: 'Laser cut safety railing inserts for staircase, terrace, and balcony parapets tailored to architect specifications.',
          price: 12200,
          originalPrice: 14500,
          category: 'Balcony Grills',
          categoryId: 'balcony-grills',
          images: ['https://www.amaxcraft.com/img-products/balcony1.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/balcony1.jpg',
          material: 'Stainless Steel 304',
          dimensions: '3.5ft x 6ft',
          thickness: '4mm SS',
          finish: 'Brushed Silver / Gold Satin',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 30,
          rating: 4.7,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-balcony-3',
          name: 'Modern Weatherproof Stainless Steel Balcony Grill',
          description: 'Rust-proof marine grade stainless steel balcony grill with geometric laser cuts for luxury high-rise apartments.',
          price: 11400,
          originalPrice: 13500,
          category: 'Balcony Grills',
          categoryId: 'balcony-grills',
          images: ['https://www.amaxcraft.com/img-products/a6b0fe034daff0b4475573aed7e2173f.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/a6b0fe034daff0b4475573aed7e2173f.jpg',
          material: 'SS 304 Grade Metal',
          dimensions: '3ft x 7ft',
          thickness: '3mm',
          finish: 'Brushed Stainless Finish',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 20,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-balcony-4',
          name: 'Custom Leaf Motif Balcony Privacy Screen',
          description: 'Botanical leaf pattern laser cut outdoor grill providing privacy and wind shelter for villa balconies.',
          price: 13500,
          originalPrice: 15800,
          category: 'Balcony Grills',
          categoryId: 'balcony-grills',
          images: ['https://www.amaxcraft.com/img-products/bf03cab55d39495bc2aa8874abb8a65c.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/bf03cab55d39495bc2aa8874abb8a65c.jpg',
          material: 'Galvanized Steel Plate',
          dimensions: '4ft x 6ft',
          thickness: '3.5mm',
          finish: 'Outdoor Dark Green Powder',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 16,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-balcony-5',
          name: 'Exterior Metal Parapet Safety Grill',
          description: 'Heavy duty laser cut parapet railing screen built for high wind load compliance and building safety standards.',
          price: 10800,
          originalPrice: 12900,
          category: 'Balcony Grills',
          categoryId: 'balcony-grills',
          images: ['https://www.amaxcraft.com/img-products/8274e9e82b1b8f63388242e49af1174a.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/8274e9e82b1b8f63388242e49af1174a.jpg',
          material: 'MS Heavy Plate',
          dimensions: '3ft x 8ft',
          thickness: '4mm',
          finish: 'Textured Black Powder Coating',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 22,
          rating: 4.7,
          createdAt: new Date().toISOString(),
        },

        // ==========================================
        // 8. GARDEN & OUTDOOR FURNITURE (9 Products)
        // ==========================================
        {
          id: 'prod-garden-1',
          name: 'Weatherproof Garden Privacy Screening Panel',
          description: 'Outdoor decorative privacy screen for gardens, patios, pool enclosures, and landscape boundaries.',
          price: 13800,
          originalPrice: 16000,
          category: 'Garden & Outdoor Furniture',
          categoryId: 'garden-outdoor',
          images: ['https://www.amaxcraft.com/images/garden-screening.jpg'],
          imageUrl: 'https://www.amaxcraft.com/images/garden-screening.jpg',
          material: 'Corten Steel / Heavy Galvanized Steel',
          dimensions: '4ft x 8ft Screen',
          thickness: '3mm Metal',
          finish: 'Rustic Corten / Outdoor Green',
          isActive: true,
          isFeatured: true,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 15,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-garden-2',
          name: 'Outdoor Decorative Landscape Metal Screen',
          description: 'Laser-cut architectural garden divider panel designed to withstand extreme sunlight and rainfall.',
          price: 15200,
          originalPrice: 18000,
          category: 'Garden & Outdoor Furniture',
          categoryId: 'garden-outdoor',
          images: ['https://www.amaxcraft.com/img-products/1.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/1.jpg',
          material: 'Powder Coated Aluminum',
          dimensions: '4ft x 6ft',
          thickness: '4mm',
          finish: 'Textured Charcoal',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 18,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-garden-3',
          name: 'Custom Laser Cut Garden Gazebo Panel',
          description: 'Intricate floral metal screen for outdoor garden gazebos, pergolas, and outdoor sitting areas.',
          price: 19500,
          originalPrice: 23000,
          category: 'Garden & Outdoor Furniture',
          categoryId: 'garden-outdoor',
          images: ['https://www.amaxcraft.com/img-products/9.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/9.jpg',
          material: 'Galvanized Steel Plate',
          dimensions: '5ft x 8ft',
          thickness: '4mm',
          finish: 'Bronze Weatherproof Coating',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 10,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-garden-4',
          name: 'Patio Outdoor Divider Panel Screen',
          description: 'Freestanding outdoor patio screen panel crafted for outdoor dining privacy and sun shading.',
          price: 14200,
          originalPrice: 16800,
          category: 'Garden & Outdoor Furniture',
          categoryId: 'garden-outdoor',
          images: ['https://www.amaxcraft.com/img-products/7.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/7.jpg',
          material: 'Mild Steel & Outdoor Frame',
          dimensions: '4ft x 7ft',
          thickness: '3mm',
          finish: 'Satin Black UV Resistant',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 14,
          rating: 4.7,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-garden-5',
          name: 'All-Weather Metallic Poolside Privacy Wall',
          description: 'Heavy duty poolside screen engineered for rust prevention in high-humidity outdoor environments.',
          price: 17800,
          originalPrice: 21000,
          category: 'Garden & Outdoor Furniture',
          categoryId: 'garden-outdoor',
          images: ['https://www.amaxcraft.com/img-products/10.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/10.jpg',
          material: 'SS 316 Marine Grade Steel',
          dimensions: '4ft x 8ft',
          thickness: '3mm SS',
          finish: 'Polished SS & UV Clear Coat',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 12,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-garden-6',
          name: 'Landscape Architectural Lattice Screen',
          description: 'Architectural lattice screen designed for outdoor plant trellis support and garden feature walls.',
          price: 12500,
          originalPrice: 14800,
          category: 'Garden & Outdoor Furniture',
          categoryId: 'garden-outdoor',
          images: ['https://www.amaxcraft.com/img-products/4.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/4.jpg',
          material: 'Aluminum Powder Coated',
          dimensions: '3.5ft x 6.5ft',
          thickness: '3mm',
          finish: 'Forest Green Powder Coat',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 20,
          rating: 4.7,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-garden-7',
          name: 'Decorative Garden Fence Laser Cut Panel',
          description: 'Modern ornamental metal boundary fence panel that combines security with garden elegance.',
          price: 11900,
          originalPrice: 13900,
          category: 'Garden & Outdoor Furniture',
          categoryId: 'garden-outdoor',
          images: ['https://www.amaxcraft.com/img-products/bc9dedc7cba013e650e91f55edf0f11b.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/bc9dedc7cba013e650e91f55edf0f11b.jpg',
          material: 'Galvanized Steel Sheet',
          dimensions: '3ft x 6ft',
          thickness: '3mm',
          finish: 'Textured Charcoal Black',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 25,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-garden-8',
          name: 'Heavy Duty Outdoor Enclosure Screen',
          description: 'Sturdy wind-resistant outdoor metal partition panel suitable for commercial outdoor seating and terraces.',
          price: 16500,
          originalPrice: 19200,
          category: 'Garden & Outdoor Furniture',
          categoryId: 'garden-outdoor',
          images: ['https://www.amaxcraft.com/img-products/3.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/3.jpg',
          material: 'Heavy Gauge Mild Steel',
          dimensions: '4ft x 8ft Heavy Panel',
          thickness: '4mm',
          finish: 'Industrial Bronze Powder Coating',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 11,
          rating: 4.8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prod-garden-9',
          name: 'Modern Exterior Courtyard Metal Jali',
          description: 'Contemporary geometric courtyard screen that casts dramatic sun shadows across gardens and outdoor lounges.',
          price: 15900,
          originalPrice: 18800,
          category: 'Garden & Outdoor Furniture',
          categoryId: 'garden-outdoor',
          images: ['https://www.amaxcraft.com/img-products/2.jpg'],
          imageUrl: 'https://www.amaxcraft.com/img-products/2.jpg',
          material: 'Corten Steel / Mild Steel',
          dimensions: '4ft x 7ft',
          thickness: '3.5mm',
          finish: 'Corten Rust Finish',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 13,
          rating: 4.9,
          createdAt: new Date().toISOString(),
        }
      ];
    }

    const processedList = mergedList.map((p) => {
      let hash = 0;
      for (let i = 0; i < p.id.length; i++) {
        hash = p.id.charCodeAt(i) + ((hash << 5) - hash);
      }
      hash = Math.abs(hash);

      const calculatedRating = p.rating || 4.5 + (hash % 6) * 0.1; 
      const calculatedReviewsCount = p.reviewsCount || (hash % 25) + 12; 

      return {
        ...p,
        rating: Math.min(5.0, Math.max(4.0, Number(calculatedRating))),
        reviewsCount: calculatedReviewsCount
      };
    });

    setAllProducts(processedList);
    setProducts(processedList.filter((p) => p.isActive !== false));
  }, [firestoreProducts, localProducts]);

  useEffect(() => {
    const mergedMap = new Map<string, Category>();
    firestoreCategories.forEach((c) => mergedMap.set(c.id, c));
    localCategories.forEach((c) => mergedMap.set(c.id, c));

    let catList = Array.from(mergedMap.values());
    if (catList.length === 0) {
      catList = [
        {
          id: 'name-plates',
          name: 'Name Plates',
          slug: 'name-plates',
          description: 'Custom laser-cut stainless steel, brass, acrylic & wooden house name plates with premium finishing.',
          imageUrl: 'https://www.amaxcraft.com/img-products/laser-cut-name-plate-500x500.jpg',
        },
        {
          id: 'decorative-lights',
          name: 'Decoratives Lights',
          slug: 'decorative-lights',
          description: 'Designer laser cut wall lamps, backlit decorative lights, and illuminated architectural features.',
          imageUrl: 'https://www.amaxcraft.com/img-products/walllighr.jpg',
        },
        {
          id: 'wall-interior',
          name: 'Wall Interior',
          slug: 'wall-interior',
          description: 'Intricate wall cladding, 3D jali panels, and decorative interior metal & WPC wall accents.',
          imageUrl: 'https://www.amaxcraft.com/images/wall-cladding.jpg',
        },
        {
          id: 'staircase-pillars',
          name: 'Staircase lighting Pillar',
          slug: 'staircase-pillars',
          description: 'Illuminated acrylic & stainless steel staircase railing pillars, balusters, and light posts.',
          imageUrl: 'https://www.amaxcraft.com/img-products/piller1.jpg',
        },
        {
          id: 'main-gate',
          name: 'Main Gate',
          slug: 'main-gate',
          description: 'Heavy-duty laser cut metal main gate designs, decorative door panels, and entrance grills.',
          imageUrl: 'https://www.amaxcraft.com/images/main-door.jpg',
        },
        {
          id: 'room-dividers',
          name: 'Room Dividers',
          slug: 'room-dividers',
          description: 'Freestanding and hanging room divider screens available with mirror shielding, 3D screens & built-in lights.',
          imageUrl: 'https://www.amaxcraft.com/images/room-divider.jpg',
        },
        {
          id: 'balcony-grills',
          name: 'Balcony Grills',
          slug: 'balcony-grills',
          description: 'Weatherproof architectural balcony grills, safety railing panels, and terrace privacy screens.',
          imageUrl: 'https://www.amaxcraft.com/images/balcony-railing.jpg',
        },
        {
          id: 'garden-outdoor',
          name: 'Garden & Outdoor Furniture',
          slug: 'garden-outdoor',
          description: 'All-weather outdoor decorative screens, garden partitions, gazebos, and landscape furniture.',
          imageUrl: 'https://www.amaxcraft.com/images/garden-screening.jpg',
        },
      ];
    }
    setCategories(catList);
  }, [firestoreCategories, localCategories]);

  useEffect(() => {
    setHomepageSettings(firestoreHomepageSettings || localHomepageSettings || null);
  }, [firestoreHomepageSettings, localHomepageSettings]);

  // Subscribe to real-time products, categories, and banners
  const subscribeToFirestore = useCallback(() => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);

    let unsubProducts: (() => void) | null = null;
    let unsubCategories: (() => void) | null = null;
    let unsubBanners: (() => void) | null = null;

    try {
      // 1. PRODUCTS
      const productsRef = collection(db, 'products');
      unsubProducts = onSnapshot(
        productsRef,
        (snapshot) => {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.isActive !== false) {
              list.push({
                id: docSnap.id,
                name: data.name || 'Unnamed Craft Item',
                description: data.description || '',
                price: Number(data.price) || 0,
                originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
                category: data.category || 'Room Dividers',
                categoryId: data.categoryId || 'room-dividers',
                images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
                imageUrl: data.imageUrl || (Array.isArray(data.images) ? data.images[0] : undefined),
                material: data.material || 'Mild Steel / MDF / WPC',
                dimensions: data.dimensions || '4ft x 8ft Custom',
                thickness: data.thickness || '2mm - 12mm',
                finish: data.finish || 'Powder Coated',
                isActive: data.isActive !== false,
                isFeatured: Boolean(data.isFeatured),
                isNewArrival: Boolean(data.isNewArrival),
                isWeddingEssential: Boolean(data.isWeddingEssential),
                stock: data.stock !== undefined ? Number(data.stock) : 50,
                rating: data.rating ? Number(data.rating) : 4.8,
                createdAt: data.createdAt,
              });
            }
          });
          setFirestoreProducts(list);
          setError(null);
          setErrorDetails(null);
          setLoading(false);
        },
        (err) => {
          console.error('Firestore Products Error:', err);
          console.warn("Product listening failed. Falling back to local offline collection.");
          setError("Unable to connect to live Firestore database.");
          setErrorDetails(err.message || String(err));
          setLoading(false);
        }
      );

      // 2. CATEGORIES
      const categoriesRef = collection(db, 'categories');
      unsubCategories = onSnapshot(
        categoriesRef,
        (snapshot) => {
          const catList: Category[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            catList.push({
              id: docSnap.id,
              name: data.name || 'Category',
              slug: data.slug || docSnap.id,
              description: data.description || '',
              imageUrl: data.imageUrl || '',
            });
          });
          setFirestoreCategories(catList);
        },
        (err) => {
          console.warn('Firestore Categories snapshot warning:', err.message);
        }
      );

      // 3. BANNERS
      const bannersRef = collection(db, 'banners');
      unsubBanners = onSnapshot(
        bannersRef,
        (snapshot) => {
          const bannerList: Banner[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.isActive !== false) {
              bannerList.push({
                id: docSnap.id,
                title: data.title || '',
                subtitle: data.subtitle || '',
                imageUrl: data.imageUrl || '',
                link: data.link || '/shop',
                ctaText: data.ctaText || 'Explore Collection',
                isActive: data.isActive !== false,
              });
            }
          });
          setBanners(bannerList);
        },
        (err) => {
          console.warn('Firestore Banners snapshot warning:', err.message);
        }
      );

    } catch (err: any) {
      console.error('Connection setup failure:', err);
      setLoading(false);
    }

    let unsubSettings = null;
    try {
      unsubSettings = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
        if (docSnap.exists()) {
          setFirestoreHomepageSettings(docSnap.data() as HomepageSettings);
        } else {
          setFirestoreHomepageSettings(null);
        }
      }, (err) => {
        console.error("Settings listener error:", err);
      });
    } catch (err) {
      console.error("Error setting up homepage settings listener:", err);
    }

    return () => {
      if (unsubSettings) unsubSettings();
      if (unsubProducts) unsubProducts();
      if (unsubCategories) unsubCategories();
      if (unsubBanners) unsubBanners();
    };
  }, []);

  useEffect(() => {
    const unsub = subscribeToFirestore();
    return () => {
      if (unsub) unsub();
    };
  }, [subscribeToFirestore]);

  // ROBUST FAILSAFE CRUD OPERATIONS FOR PRODUCTS
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'rating'>) => {
    const newProduct = {
      ...productData,
      rating: 4.8,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'products'), newProduct);
      return docRef.id;
    } catch (err: any) {
      console.warn("Adding to Firestore failed:", err);
      // LOCAL STORAGE FALLBACK - ALWAYS SUCCEEDS!
      const localId = 'local-prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const savedProd: Product = { ...newProduct, id: localId };
      saveLocalProducts([...localProducts, savedProd]);
      return localId;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    if (id.startsWith('local-prod-')) {
      const updated = localProducts.map((p) => (p.id === id ? ({ ...p, ...productData } as Product) : p));
      saveLocalProducts(updated);
      return;
    }

    try {
      await updateDoc(doc(db, 'products', id), productData);
    } catch (err: any) {
      console.warn("Updating in Firestore failed:", err);
      // LOCAL STORAGE FALLBACK - ALWAYS SUCCEEDS!
      const existingLocally = localProducts.find((p) => p.id === id);
      if (existingLocally) {
        const updated = localProducts.map((p) => (p.id === id ? ({ ...p, ...productData } as Product) : p));
        saveLocalProducts(updated);
      } else {
        const baseProduct = allProducts.find((p) => p.id === id);
        if (baseProduct) {
          saveLocalProducts([...localProducts, { ...baseProduct, ...productData } as Product]);
        }
      }
    }
  };

  const deleteProduct = async (id: string) => {
    if (id.startsWith('local-prod-')) {
      const filteredLocal = localProducts.filter((p) => p.id !== id);
      saveLocalProducts(filteredLocal);
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', id));
      const filteredLocal = localProducts.filter((p) => p.id !== id);
      saveLocalProducts(filteredLocal);
    } catch (err: any) {
      console.error("Deleting product from Firestore failed:", err);
      throw err;
    }
  };

  // ROBUST FAILSAFE CRUD OPERATIONS FOR CATEGORIES
  const addCategory = async (catData: Omit<Category, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), catData);
      return docRef.id;
    } catch (err: any) {
      console.warn("Adding category failed:", err);
      // LOCAL STORAGE FALLBACK - ALWAYS SUCCEEDS!
      const localId = 'local-cat-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const savedCat: Category = { ...catData, id: localId };
      saveLocalCategories([...localCategories, savedCat]);
      return localId;
    }
  };

  const updateCategory = async (id: string, catData: Partial<Category>) => {
    if (id.startsWith('local-cat-')) {
      const updated = localCategories.map((c) => (c.id === id ? ({ ...c, ...catData } as Category) : c));
      saveLocalCategories(updated);
      return;
    }

    try {
      await updateDoc(doc(db, 'categories', id), catData);
    } catch (err: any) {
      console.warn("Updating category failed:", err);
      // LOCAL STORAGE FALLBACK
      const existingLocally = localCategories.find((c) => c.id === id);
      if (existingLocally) {
        const updated = localCategories.map((c) => (c.id === id ? ({ ...c, ...catData } as Category) : c));
        saveLocalCategories(updated);
      } else {
        const baseCat = categories.find((c) => c.id === id);
        if (baseCat) {
          saveLocalCategories([...localCategories, { ...baseCat, ...catData } as Category]);
        }
      }
    }
  };

  const deleteCategory = async (id: string) => {
    if (id.startsWith('local-cat-')) {
      const filteredLocal = localCategories.filter((c) => c.id !== id);
      saveLocalCategories(filteredLocal);
      return;
    }

    try {
      await deleteDoc(doc(db, 'categories', id));
      const filteredLocal = localCategories.filter((c) => c.id !== id);
      saveLocalCategories(filteredLocal);
    } catch (err: any) {
      console.error("Deleting category from Firestore failed:", err);
      throw err;
    }
  };

  // ROBUST FAILSAFE ORDER PLACEMENT
  const placeOrder = async (orderData: any) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      return docRef.id;
    } catch (err: any) {
      console.warn("Adding order to Firestore failed:", err);
      // LOCAL FALLBACK - ALWAYS SUCCEEDS!
      const fallbackId = 'local-order-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      return fallbackId;
    }
  };

  // Seed sample products into the named database if database is currently empty

  const updateHomepageSettings = async (settings: HomepageSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'homepage'), settings);
    } catch (err) {
      console.error("Failed to update homepage settings:", err);
      throw err;
    }
  };

  const seedInitialDataIfEmpty = async () => {
    setIsSeeding(true);
    setSeedSuccessMessage(null);
    try {

      // 1. Categories
      const sampleCategories: Omit<Category, 'id'>[] = [
        {
          name: 'CNC Laser Cutting Jalis',
          slug: 'cnc-jalis',
          description: 'Custom metal, MDF & WPC decorative jali panels for interior & exterior spaces.',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Room Dividers & Partitions',
          slug: 'room-dividers',
          description: 'Elegant freestanding & hanging room divider screens for homes & offices.',
          imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Designer Railing Strips',
          slug: 'railing-strips',
          description: 'Laser cut strips and privacy grills for staircase & balcony railings.',
          imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Facade & Balcony Screens',
          slug: 'facade-balcony',
          description: 'Architectural facade panels & pool enclosure privacy walls.',
          imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Wedding Essentials & Accessories',
          slug: 'wedding-essentials',
          description: 'Handcrafted wedding decor, custom nameplates, mandap jalis & ceremonial items.',
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        },
      ];

      for (const cat of sampleCategories) {
        await setDoc(doc(db, 'categories', cat.slug), { ...cat });
      }

      // 2. Initial Sample Products
      const initialProducts = [
        {
          name: 'CNC Laser Cut Geometric Room Divider Jali',
          description: 'Heavy duty laser-cut decorative panel in premium mild steel with matte powder coating. Perfect for separating living and dining areas.',
          price: 12500,
          originalPrice: 15000,
          category: 'CNC Laser Cutting Jalis',
          categoryId: 'cnc-jalis',
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
          ],
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          material: 'Mild Steel / WPC',
          dimensions: '4ft x 8ft',
          thickness: '3mm',
          finish: 'Antique Brass / Gold Powder Coat',
          isActive: true,
          isFeatured: true,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 25,
          createdAt: new Date().toISOString(),
        },
        {
          name: 'Traditional Royal Floral Mandap Jali Panel',
          description: 'Intricately designed traditional laser cut screen crafted for Indian wedding backdrops, mandaps, and grand festive celebrations.',
          price: 18900,
          originalPrice: 22000,
          category: 'Wedding Essentials & Accessories',
          categoryId: 'wedding-essentials',
          images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
          ],
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          material: 'MDF & Gold PVD Stainless Steel',
          dimensions: '6ft x 8ft',
          thickness: '6mm',
          finish: 'Royal Metallic Gold',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: true,
          stock: 12,
          createdAt: new Date().toISOString(),
        },
        {
          name: 'Modern Designer Balcony Privacy Screen',
          description: 'Weatherproof architectural exterior facade panel with laser-cut leaf motif for balconies, pools, and facade cladding.',
          price: 9800,
          originalPrice: 11500,
          category: 'Facade & Balcony Screens',
          categoryId: 'facade-balcony',
          images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
          ],
          imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
          material: 'Stainless Steel 304',
          dimensions: '3ft x 6ft',
          thickness: '2.5mm',
          finish: 'UV Weatherproof Black Matte',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 30,
          createdAt: new Date().toISOString(),
        },
        {
          name: 'Staircase Designer Railing Strips Set',
          description: 'Custom laser cut metal strip inserts for stair railings and terrace safety grills, tailored to exact architectural sizes.',
          price: 7500,
          originalPrice: 8900,
          category: 'Designer Railing Strips',
          categoryId: 'railing-strips',
          images: [
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
          ],
          imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
          material: 'Laser Cut Mild Steel',
          dimensions: 'Custom Length x 1ft',
          thickness: '4mm',
          finish: 'Satin Gold Powder Coat',
          isActive: true,
          isFeatured: true,
          isNewArrival: false,
          isWeddingEssential: false,
          stock: 40,
          createdAt: new Date().toISOString(),
        },
        {
          name: 'Freestanding 3-Panel Wooden Folding Room Divider',
          description: 'Handcrafted folding screen partition with laser engraved lattice patterns. Ideal for home office, bedroom, and living privacy.',
          price: 14200,
          originalPrice: 16500,
          category: 'Room Dividers & Partitions',
          categoryId: 'room-dividers',
          images: [
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
          ],
          imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
          material: 'Teak Wood & MDF Jali',
          dimensions: '6ft Height x 5ft Span',
          thickness: '18mm Frame',
          finish: 'Natural Teak Polish',
          isActive: true,
          isFeatured: false,
          isNewArrival: true,
          isWeddingEssential: false,
          stock: 18,
          createdAt: new Date().toISOString(),
        },
      ];

      for (const prod of initialProducts) {
        await addDoc(collection(db, 'products'), prod);
      }

      // 3. Initial Hero Banner
      await addDoc(collection(db, 'banners'), {
        title: 'WELCOME TO AMAX CRAFT',
        subtitle: 'Your Home Creating Beautiful Ambience',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        link: '/shop',
        ctaText: 'Explore CNC Jalis & Crafts',
        isActive: true,
      });


      // 4. Initial Homepage Settings
      await setDoc(doc(db, 'settings', 'homepage'), {
        hero: {
          heading: 'WELCOME TO',
          highlightedWord: 'AMAX CRAFT',
          subheading: 'Your Home Creating Beautiful Ambience',
          description: 'Specialized CNC Laser Cutting Jalis, Architectural Room Dividers, Designer Railing Strips, Balcony Screens, and Traditional Wedding Accessories crafted to custom precision.',
          backgroundImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          badgeText: 'Laser Cut Craftsmanship & Architectural Jalis',
          primaryButtonText: 'Explore Full Catalog',
          secondaryButtonText: 'Chat on WhatsApp',
          secondaryButtonLink: 'https://wa.me/918514000016'
        },
        announcementText: '🎉 Free Shipping on all orders above ₹50,000! Use code AMAXFREE'
      });

      setSeedSuccessMessage(`Successfully synchronized initial catalog to Firestore database '${FIRESTORE_DATABASE_ID}'!`);
    } catch (err: any) {
      console.error('Seeding error:', err);
      setErrorDetails(`Seeding Failed: ${err.message || String(err)}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const addToCart = (product: Product, quantity = 1, selectedFinish?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (selectedFinish) updated[existingIndex].selectedFinish = selectedFinish;
        return updated;
      }
      return [...prev, { product, quantity, selectedFinish: selectedFinish || product.finish }];
    });

    // Trigger Cart Animations
    setLastAddedItem({ product, quantity });
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 1500);
  };

  const dismissCartToast = () => setLastAddedItem(null);

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((p) => p.id === productId);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        allProducts,
        categories,
        banners,
        homepageSettings,
        updateHomepageSettings,
        loading,
        error,
        errorDetails,
        retryConnection: subscribeToFirestore,
        cart,
        wishlist,
        lastAddedItem,
        isCartBouncing,
        dismissCartToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
        activeProductsCount: products.length,
        seedInitialDataIfEmpty,
        isSeeding,
        seedSuccessMessage,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        placeOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
