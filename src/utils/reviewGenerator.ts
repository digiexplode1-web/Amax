import { Product } from '../types';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const REVIEW_AUTHORS = [
  'Aravind Sharma', 'Meera Nair', 'Siddharth Roy', 'Priya Patel', 'Vikram Malhotra',
  'Ananya Iyer', 'Rohan Gupta', 'Kiran Deshmukh', 'Sneha Reddy', 'Aditya Verma',
  'Shalini Sen', 'Sanjay Joshi', 'Pooja Kapoor', 'Deepak Mehta', 'Sunita Rao'
];

const REVIEWS_BY_CATEGORY: Record<string, string[]> = {
  'name-plates': [
    'Absolutely gorgeous name plate! The steel cuts are razor-sharp and the gold mirror finish shines beautifully at night.',
    'High quality craftsmanship. The acrylic backing gives it a lovely 3D look. Packaging was very secure and arrived without a single scratch.',
    'Perfect addition to our new villa. Multiple neighbours asked where we got this done. Worth every rupee!',
    'The LED backlighting is extremely elegant. Gives a premium boutique look to our house entrance.',
    'Superb finish. Easy to install with the provided stud screws. Highly recommended!'
  ],
  'decorative-lights': [
    'The shadows created by this laser-cut wall light are stunning! It completely transformed our living room ambiance.',
    'Excellent build quality. The LEDs are bright yet warm, not harsh at all. Very happy with this decorative purchase.',
    'Adds a rich heritage look to our hallway. The metal cut is precise and the gold paint is flawless.',
    'An absolute masterpiece. Guests always compliment this light panel in our foyer.',
    'Very sturdy wall lamp. Easy to mount and the wiring connection was straightforward.'
  ],
  'wall-interior': [
    'Transformative wall panelling! Used it behind our TV console and it looks like a luxury hotel lounge.',
    'Precision CNC cut and premium powder coating. Zero blemishes. Completely satisfied with the modern aesthetic.',
    'Adds depth and texture to our drawing room. The design is contemporary and matches our furniture beautifully.',
    'Excellent finish and very robust. Installed it in our office reception and it has elevated the entire branding.',
    'Perfect panel thickness and size. The champagne gold finish is spectacular.'
  ],
  'staircase-pillars': [
    'The illuminated staircase pillar is the star of our duplex house! Everyone who walks in is amazed by the light effect.',
    'Sturdy cast acrylic core and flawless chrome base. Gives a very modern premium look to the railing.',
    'Adds a gorgeous glow to the steps at night. Super high-end look and very robust build.',
    'The engraving is highly precise. The LED glow diffuses beautifully through the acrylic.',
    'Very easy to clean and maintains its crystal-clear shine. Truly premium home decor product.'
  ],
  'main-gate': [
    'Very heavy duty steel door panel. Extremely secure and the dark bronze finish looks royal.',
    'The custom Jali design matches our villa architecture perfectly. The welding and finishing is outstanding.',
    'Very thick metal sheet with excellent rust-proof coating. Has endured two heavy monsoons without any rust.',
    'Gives a massive security upgrade while keeping the entrance looking stylish. Extremely satisfied.',
    'A solid purchase. Worth every penny for the quality and security it provides.'
  ],
  'room-dividers': [
    'We bought the rose gold divider for our salon lobby and it is an absolute showstopper! Clients love taking pictures near it.',
    'Sturdy frame and delicate lattice work. It divides our living and dining area without blocking light or airflow.',
    'Very clean finishing and the mirror polish is immaculate. Easy to move around if needed.',
    'Adds instant luxury to a plain room. The PVD coating is premium and does not fingerprint easily.',
    'Excellent room partition. Very stable and the patterns are cut with absolute perfection.'
  ],
  'balcony-grills': [
    'Looks much better than standard boring balcony grills. The leaf pattern allows light while giving great privacy.',
    'Weatherproof coating is top-tier. No rust after a heavy monsoon season. Excellent product.',
    'Gives our terrace a clean modern architecture feel. Very heavy and sturdy construction.',
    'Perfect safety screen. Keeps children safe while enhancing the exterior look of the building.',
    'Very premium look and easy maintenance. The black matte finish is gorgeous.'
  ],
  'garden-outdoor': [
    'Perfect Corten steel privacy screen. It has developed a beautiful natural rust patina. Ideal for the garden.',
    'High quality aluminum panel. Doesn\'t get too hot in direct sunlight and divides our patio area elegantly.',
    'Very beautiful landscape divider. Stands solid against high winds in our backyard.',
    'Aesthetically superior and extremely durable. Perfect for poolside screening.',
    'Highly weather resistant. The green coating blends beautifully with our garden plants.'
  ]
};

export const getReviewsForProduct = (productId: string, categoryId: string, ratingInput?: number): Review[] => {
  // Use hash of productId to make reviews deterministic per product
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = productId.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const catId = categoryId || 'room-dividers';
  const comments = REVIEWS_BY_CATEGORY[catId] || REVIEWS_BY_CATEGORY['room-dividers'];
  
  // Decide how many reviews: 3 to 5
  const count = (hash % 3) + 3;
  const reviews: Review[] = [];

  const baseRating = ratingInput || 4.7;

  for (let i = 0; i < count; i++) {
    const authorIndex = (hash + i) % REVIEW_AUTHORS.length;
    const commentIndex = (hash + i) % comments.length;
    
    // Ratings between 4 and 5
    let reviewRating = 5;
    if (i === 1) reviewRating = 4;
    else if (i === 2) reviewRating = 4.5;
    else if ((hash + i) % 2 === 0) reviewRating = 5;
    else reviewRating = 4.8;
    
    // Format date: e.g. "June 12, 2026"
    const dateOffsetDays = (hash + i * 15) % 120; // up to 4 months ago
    const date = new Date(Date.now() - dateOffsetDays * 24 * 60 * 60 * 1000);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    reviews.push({
      id: `rev-${productId}-${i}`,
      author: REVIEW_AUTHORS[authorIndex],
      rating: reviewRating,
      comment: comments[commentIndex],
      date: formattedDate,
      verified: (hash + i) % 3 !== 0 // 66% verified purchase
    });
  }

  return reviews;
};
