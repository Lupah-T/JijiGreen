// Central place for the age + reward rules so server and docs stay in sync.

// Users younger than this are "children" (Junior Recyclers)
export const ADULT_AGE = 16;

// Children can start redeeming toys, storybooks etc. from this many points
export const CHILD_MIN_REDEEM_POINTS = 60;

// Lifetime points (all points ever earned, not the spendable balance) that unlock the grand award
export const MILESTONE_POINTS = 500;

export const ageGroupForAge = (age) => (Number(age) < ADULT_AGE ? "child" : "adult");

const child = (title, description, pointsCost, category, emoji, stock = 25) => ({
  title, description, pointsCost, category, emoji, stock, audience: "child", kind: "standard",
});
const adult = (title, description, pointsCost, category, emoji, stock = 100) => ({
  title, description, pointsCost, category, emoji, stock, audience: "adult", kind: "standard",
});
const milestone = (title, description, category, emoji) => ({
  title, description, pointsCost: 0, category, emoji, stock: 500, audience: "all",
  kind: "milestone", milestoneAt: MILESTONE_POINTS,
});

// Seeded automatically the first time the server starts with an empty rewards collection.
export const DEFAULT_REWARDS = [
  // ── Children (under 16): unlock from 60 points ──
  child("Colouring Book & Crayons Set", "A fun colouring book with a pack of crayons.", 60, "Stationery", "🖍️"),
  child("Animal Storybook", "An illustrated storybook about animals and nature.", 80, "Storybooks", "📚"),
  child("Eco Heroes Storybook", "Stories about kids who save the planet.", 100, "Storybooks", "📖"),
  child("Wooden Puzzle", "A colourful 48-piece wooden puzzle.", 120, "Toys", "🧩"),
  child("Soft Toy Teddy", "A cuddly teddy bear toy.", 150, "Toys", "🧸"),
  child("Toy Car Set", "A set of 3 pull-back toy cars.", 180, "Toys", "🚗"),
  child("Board Game (Snakes & Ladders)", "A family board game for hours of fun.", 220, "Games", "🎲"),
  child("Football", "A size-4 football for the playground.", 260, "Sports", "⚽"),

  // ── Adults (16+): airtime, vouchers, eco rewards ──
  adult("Safaricom KES 20 Airtime", "Airtime sent to your phone number.", 100, "Airtime", "📱"),
  adult("Safaricom KES 50 Airtime", "Airtime sent to your phone number.", 200, "Airtime", "📱"),
  adult("Safaricom KES 100 Airtime", "Airtime sent to your phone number.", 380, "Airtime", "📱"),
  adult("Data Bundle 1GB", "1GB data bundle valid for 7 days.", 300, "Data", "📶"),
  adult("Naivas KES 200 Shopping Voucher", "Shopping voucher redeemable at Naivas.", 450, "Vouchers", "🛒"),
  adult("Java House Coffee Voucher", "A free coffee at Java House.", 250, "Vouchers", "☕"),
  adult("Sponsor a Tree", "We plant an indigenous tree in your name.", 150, "Eco Impact", "🌳"),
  adult("Reusable Water Bottle", "A branded stainless-steel bottle.", 350, "Eco Impact", "🥤"),

  // ── Grand award: auto-issued at 500 lifetime points (everyone) ──
  milestone("Eco Champion Watch", "A stylish JijiGreen sports watch.", "Grand Award", "⌚"),
  milestone("Eco Champion Bag", "A durable recycled-material backpack.", "Grand Award", "🎒"),
  milestone("Eco Champion Certificate", "Official certificate of recognition from JijiGreen.", "Grand Award", "🏆"),
];
