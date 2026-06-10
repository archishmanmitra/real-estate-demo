export type Property = {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  type: "apartment" | "villa" | "plot" | "residential";
  image: string;
  thumb: string;
  description: string;
  amenities: string[];
};

// Unsplash placeholder photography — swap for client assets in prod.
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const siteImages = {
  hero: u("photo-1567157577867-05ccb1388e66", 2000),
  feature: u("photo-1600607687939-ce8a6c25118c", 2000),
  about: u("photo-1600585154340-be6161a56a0c", 1600),
  parallax: [
    u("photo-1600566753190-17f0baa2a6c3", 640),
    u("photo-1600210492486-724fe5c67fb0", 640),
    u("photo-1600047509807-ba8f99d2cdde", 640),
  ],
};

export const properties: Property[] = [
  {
    id: "01",
    slug: "akshar-heights",
    name: "Akshar Heights",
    location: "Andheri West, Mumbai",
    price: "₹2.4 Cr",
    beds: 3, baths: 3, sqft: 1850,
    type: "apartment",
    image: u("photo-1545324418-cc1a3fa10c00"),
    thumb: u("photo-1545324418-cc1a3fa10c00", 640),
    description: "Elevated living above the city. 28-storey tower with panoramic views, rooftop pool, and concierge.",
    amenities: ["Rooftop Pool", "Concierge", "EV Charging", "Co-work Lounge"],
  },
  {
    id: "02",
    slug: "akshar-greens",
    name: "Akshar Greens",
    location: "Powai, Mumbai",
    price: "₹1.8 Cr",
    beds: 2, baths: 2, sqft: 1200,
    type: "apartment",
    image: u("photo-1512917774080-9991f1c4c750"),
    thumb: u("photo-1512917774080-9991f1c4c750", 640),
    description: "A garden community woven through native landscaping. 400 units, zero surface parking.",
    amenities: ["Landscaped Courts", "Jogging Trail", "Clubhouse", "Solar Powered"],
  },
  {
    id: "03",
    slug: "akshar-villas",
    name: "Akshar Villas",
    location: "Alibaug, Raigad",
    price: "₹4.2 Cr",
    beds: 4, baths: 4, sqft: 3200,
    type: "villa",
    image: u("photo-1613490493576-7fde63acd811"),
    thumb: u("photo-1613490493576-7fde63acd811", 640),
    description: "Weekend villa estates at the coast. Private plunge pool, sea-facing terrace, 2-acre plots.",
    amenities: ["Private Pool", "Sea View", "2-Acre Plot", "24hr Security"],
  },
  {
    id: "04",
    slug: "akshar-residences",
    name: "Akshar Residences",
    location: "Bandra East, Mumbai",
    price: "₹3.1 Cr",
    beds: 3, baths: 3, sqft: 2100,
    type: "residential",
    image: u("photo-1486406146926-c627a92ad1ab"),
    thumb: u("photo-1486406146926-c627a92ad1ab", 640),
    description: "Heritage neighbourhood, contemporary interiors. Stone-clad facade, double-height lobby.",
    amenities: ["Double-Height Lobby", "Stone Facade", "Gym", "Terrace Garden"],
  },
  {
    id: "05",
    slug: "akshar-skyline",
    name: "Akshar Skyline",
    location: "Lower Parel, Mumbai",
    price: "₹5.8 Cr",
    beds: 4, baths: 4, sqft: 3600,
    type: "apartment",
    image: u("photo-1449157291145-7efd050a4d0e"),
    thumb: u("photo-1449157291145-7efd050a4d0e", 640),
    description: "Mumbai's financial district at your feet. Sky villas on floors 40–55, private elevator lobbies.",
    amenities: ["Sky Villa", "Private Elevator", "Infinity Pool", "Business Lounge"],
  },
  {
    id: "06",
    slug: "akshar-meadows",
    name: "Akshar Meadows",
    location: "Pune, Hinjawadi",
    price: "₹95 Lac",
    beds: 2, baths: 2, sqft: 980,
    type: "apartment",
    image: u("photo-1494526585095-c41746248156"),
    thumb: u("photo-1494526585095-c41746248156", 640),
    description: "First home, done right. Smartly planned 2BHKs near the IT corridor with forest-edge views.",
    amenities: ["Forest Edge", "Smart Home", "EV Ready", "Community Hall"],
  },
];

export const navLinks = [
  { title: "Home", href: "/", src: siteImages.hero },
  { title: "Properties", href: "/properties", src: properties[0].image },
  { title: "About", href: "/about", src: siteImages.about },
  { title: "Contact", href: "/contact", src: siteImages.feature },
] as const;

export const routeLabels: Record<string, string> = {
  "/": "Home",
  "/properties": "Properties",
  "/about": "About",
  "/contact": "Contact",
};

export const discoveryCopy = {
  eyebrow: "EXPLORE AKSHAR",
  headline: ["Homes.", "Plots.", "Villas.", "Projects."],
  body: "We don't just build structures — we create addresses worth returning to. Akshar Realty has crafted over 12 landmark projects across Mumbai, Pune, and the Konkan coast.",
  searchPlaceholder: "Search by location or project name…",
};
