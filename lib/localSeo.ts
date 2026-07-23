// Local / geo SEO configuration for Homes Decorator service-location landing
// pages. This is the single source of truth for city-level enrichment used to
// keep each landing page unique (avoiding duplicate content), to build local
// FAQ clusters, and to power internal linking between neighbouring cities.
//
// Keys are location slugs as produced by slugify() (lowercase, hyphenated),
// matching ServiceLocationPage.locationSlug.

export interface CityInfo {
  name: string;
  slug: string;
  region: "Haryana" | "Delhi NCR" | "Delhi";
  // One-line positioning statement used in answer-first summaries.
  intro: string;
  // Well-known localities/sectors used to demonstrate on-the-ground coverage.
  nearbyAreas: string[];
  // Recognisable landmarks — strong local-entity signals for search & AI.
  landmarks: string[];
  // Climate / construction context that shapes waterproofing & flooring advice.
  climateNote: string;
  // Slugs of geographically adjacent cities for internal linking.
  nearbyCitySlugs: string[];
}

export const CITY_DATA: Record<string, CityInfo> = {
  bhiwani: {
    name: "Bhiwani",
    slug: "bhiwani",
    region: "Haryana",
    intro:
      "Bhiwani is Homes Decorator's home base, so our engineers reach any site across the district the same day for inspection.",
    nearbyAreas: ["Behal", "Tosham Road", "Hansi Gate", "Bhiwani Model Town", "Loharu"],
    landmarks: ["Panchmukhi Hanuman Temple", "Bhiwani Junction", "Kitlana Toll"],
    climateNote:
      "Bhiwani's semi-arid climate brings extreme summer heat and sharp monsoon bursts, so terraces need UV-stable, crack-bridging membranes.",
    nearbyCitySlugs: ["charkhi-dadri", "rohtak", "hansi", "hisar"],
  },
  "charkhi-dadri": {
    name: "Charkhi Dadri",
    slug: "charkhi-dadri",
    region: "Haryana",
    intro:
      "Charkhi Dadri sits next door to our Bhiwani HQ, giving clients fast turnaround on waterproofing and flooring work.",
    nearbyAreas: ["Dadri City", "Badhra", "Jhojhu Kalan"],
    landmarks: ["Dadri Railway Station", "Birhod Lake"],
    climateNote:
      "The area's hard groundwater and dusty summers make sealed SPC flooring and positive-side waterproofing especially durable.",
    nearbyCitySlugs: ["bhiwani", "rohtak", "jhajjar"],
  },
  rohtak: {
    name: "Rohtak",
    slug: "rohtak",
    region: "Haryana",
    intro:
      "Rohtak is a core Homes Decorator service hub with a strong base of completed residential and commercial projects.",
    nearbyAreas: ["Model Town", "Sector 1-6", "Delhi Road", "Sonipat Road"],
    landmarks: ["Rohtak Junction", "Tilyar Lake", "MDU University"],
    climateNote:
      "Rohtak's clay-heavy soil holds monsoon moisture against basements, so we prioritise negative-side grouting and slab treatment.",
    nearbyCitySlugs: ["bhiwani", "sonipat", "jhajjar", "hisar"],
  },
  hisar: {
    name: "Hisar",
    slug: "hisar",
    region: "Haryana",
    intro:
      "Hisar clients rely on Homes Decorator for industrial-grade waterproofing and commercial flooring installations.",
    nearbyAreas: ["Model Town", "Sector 13-16", "Rajgarh Road", "Auto Market"],
    landmarks: ["Hisar Junction", "Blue Bird Lake", "Agroha Dham"],
    climateNote:
      "Hisar records some of Haryana's hottest summers, demanding thermally stable membranes and expansion-tolerant flooring.",
    nearbyCitySlugs: ["hansi", "fatehabad", "bhiwani", "sirsa"],
  },
  hansi: {
    name: "Hansi",
    slug: "hansi",
    region: "Haryana",
    intro:
      "Hansi's older housing stock benefits from Homes Decorator's structural seepage and re-flooring expertise.",
    nearbyAreas: ["Old City", "Hisar Road", "Barwala Road"],
    landmarks: ["Hansi Fort", "Char Qutub Dargah"],
    climateNote:
      "Ageing masonry in Hansi is prone to rising damp, which we treat with cementitious wall systems and injection grouting.",
    nearbyCitySlugs: ["hisar", "bhiwani", "jind"],
  },
  fatehabad: {
    name: "Fatehabad",
    slug: "fatehabad",
    region: "Haryana",
    intro:
      "Fatehabad homeowners choose Homes Decorator for long-warranty waterproofing suited to farmland-belt construction.",
    nearbyAreas: ["Model Town", "Bhattu Road", "Ratia Road"],
    landmarks: ["Humayun Mosque", "Fatehabad Bus Stand"],
    climateNote:
      "High water tables near the canal network make basement and plinth waterproofing a priority in Fatehabad.",
    nearbyCitySlugs: ["hisar", "sirsa", "jind"],
  },
  sirsa: {
    name: "Sirsa",
    slug: "sirsa",
    region: "Haryana",
    intro:
      "Sirsa is served by Homes Decorator for waterproofing, SPC flooring and PVC cladding on residential and shop-front projects.",
    nearbyAreas: ["Sangwan Chowk", "Dabwali Road", "Barnala Road"],
    landmarks: ["Dera Sacha Sauda", "Sirsa Junction"],
    climateNote:
      "Sirsa's dry heat and occasional flash monsoon call for flexible terrace membranes that resist thermal cracking.",
    nearbyCitySlugs: ["fatehabad", "hisar"],
  },
  jind: {
    name: "Jind",
    slug: "jind",
    region: "Haryana",
    intro:
      "Jind clients get Homes Decorator's full range of moisture-proofing and premium flooring services.",
    nearbyAreas: ["Model Town", "Rohtak Road", "Safidon Road"],
    landmarks: ["Bhuteshwar Temple", "Jind Junction", "Rani Talab"],
    climateNote:
      "Waterlogging along Jind's low-lying colonies during monsoon makes plinth and floor-level waterproofing essential.",
    nearbyCitySlugs: ["rohtak", "hansi", "panipat", "karnal"],
  },
  panipat: {
    name: "Panipat",
    slug: "panipat",
    region: "Haryana",
    intro:
      "Panipat's textile industry and dense housing trust Homes Decorator for commercial waterproofing and flooring.",
    nearbyAreas: ["Model Town", "Sector 11-13", "GT Road", "Assandh Road"],
    landmarks: ["Kala Amb", "Panipat Junction", "Devi Temple"],
    climateNote:
      "Humidity from the Yamuna belt accelerates seepage in Panipat, so we use multi-coat membranes with anti-fungal primers.",
    nearbyCitySlugs: ["karnal", "sonipat", "jind"],
  },
  karnal: {
    name: "Karnal",
    slug: "karnal",
    region: "Haryana",
    intro:
      "Karnal homeowners rely on Homes Decorator for premium wooden flooring and terrace waterproofing.",
    nearbyAreas: ["Sector 6-14", "Model Town", "Kunjpura Road"],
    landmarks: ["Karnal Lake", "Cantonment", "Karan Lake Resort"],
    climateNote:
      "The fertile Karnal belt has high sub-soil moisture, making negative-side basement treatment a common requirement.",
    nearbyCitySlugs: ["panipat", "kurukshetra", "sonipat"],
  },
  sonipat: {
    name: "Sonipat",
    slug: "sonipat",
    region: "Haryana",
    intro:
      "Sonipat, on Delhi's doorstep, is a key Homes Decorator zone for both NCR-standard flooring and waterproofing.",
    nearbyAreas: ["Model Town", "Sector 14-15", "Kundli", "Rai"],
    landmarks: ["Kundli Industrial Area", "Sonipat Junction", "Ashoka University"],
    climateNote:
      "Rapid construction around Kundli means fresh-slab curing issues, which we address with breathable waterproof coatings.",
    nearbyCitySlugs: ["rohtak", "panipat", "delhi", "karnal"],
  },
  ambala: {
    name: "Ambala",
    slug: "ambala",
    region: "Haryana",
    intro:
      "Ambala's cantonment and city clients choose Homes Decorator for reliable, warranty-backed waterproofing.",
    nearbyAreas: ["Ambala Cantt", "Ambala City", "Mahesh Nagar"],
    landmarks: ["Ambala Cantt Junction", "Sis Ganj Gurudwara"],
    climateNote:
      "Higher rainfall near the Shivalik foothills makes sloped-roof and terrace waterproofing critical in Ambala.",
    nearbyCitySlugs: ["panchkula", "kurukshetra"],
  },
  panchkula: {
    name: "Panchkula",
    slug: "panchkula",
    region: "Haryana",
    intro:
      "Panchkula's planned sectors trust Homes Decorator for premium flooring and modern waterproofing systems.",
    nearbyAreas: ["Sector 2-25", "MDC", "Pinjore"],
    landmarks: ["Cactus Garden", "Morni Hills", "Yadavindra Gardens"],
    climateNote:
      "Foothill rainfall and freeze-thaw swings near Panchkula demand elastomeric, flexible membrane systems.",
    nearbyCitySlugs: ["ambala", "kurukshetra"],
  },
  kurukshetra: {
    name: "Kurukshetra",
    slug: "kurukshetra",
    region: "Haryana",
    intro:
      "Kurukshetra clients get Homes Decorator's heritage-friendly seepage treatment and durable flooring.",
    nearbyAreas: ["Thanesar", "Sector 7-13", "Pehowa Road"],
    landmarks: ["Brahma Sarovar", "Jyotisar", "Kurukshetra University"],
    climateNote:
      "Proximity to large water bodies raises humidity in Kurukshetra, favouring anti-fungal, multi-layer waterproofing.",
    nearbyCitySlugs: ["karnal", "ambala", "panchkula"],
  },
  gurgaon: {
    name: "Gurgaon",
    slug: "gurgaon",
    region: "Delhi NCR",
    intro:
      "Gurgaon (Gurugram) is a flagship Homes Decorator market for high-rise waterproofing, SPC flooring and office interiors.",
    nearbyAreas: ["DLF Phases 1-5", "Sohna Road", "Golf Course Road", "Sector 56-57", "Cyber City"],
    landmarks: ["Kingdom of Dreams", "Cyber Hub", "Ambience Mall", "IFFCO Chowk"],
    climateNote:
      "Gurgaon's high-rise terraces and podium decks face intense sun and monsoon pooling, so we specify PU membranes with proper slope correction.",
    nearbyCitySlugs: ["delhi", "faridabad", "gurugram", "rewari"],
  },
  gurugram: {
    name: "Gurugram",
    slug: "gurugram",
    region: "Delhi NCR",
    intro:
      "Gurugram clients rely on Homes Decorator for commercial-grade waterproofing, flooring and interior fit-outs.",
    nearbyAreas: ["DLF Phases 1-5", "Sohna Road", "Golf Course Extension", "Sector 56-57", "Cyber City"],
    landmarks: ["Cyber Hub", "Ambience Mall", "Kingdom of Dreams", "IFFCO Chowk"],
    climateNote:
      "Podium decks and basements in Gurugram's towers need engineered drainage plus PU/chemical grouting to stop water ingress.",
    nearbyCitySlugs: ["gurgaon", "delhi", "faridabad"],
  },
  delhi: {
    name: "Delhi",
    slug: "delhi",
    region: "Delhi",
    intro:
      "Across Delhi, Homes Decorator handles everything from terrace waterproofing to premium wooden flooring for homes and offices.",
    nearbyAreas: ["South Delhi", "Dwarka", "Rohini", "Saket", "Vasant Kunj", "Pitampura"],
    landmarks: ["India Gate", "Qutub Minar", "Connaught Place", "Akshardham"],
    climateNote:
      "Delhi's old and new construction mix means both rising damp in heritage homes and slab pooling in new builds — we treat both.",
    nearbyCitySlugs: ["gurgaon", "noida", "faridabad", "ghaziabad"],
  },
  noida: {
    name: "Noida",
    slug: "noida",
    region: "Delhi NCR",
    intro:
      "Noida's sectors and high-rises trust Homes Decorator for waterproofing, SPC flooring and PVC wall panelling.",
    nearbyAreas: ["Sector 18", "Sector 62", "Sector 137", "Noida Extension"],
    landmarks: ["DLF Mall of India", "Botanical Garden", "Okhla Bird Sanctuary"],
    climateNote:
      "Yamuna-belt humidity and high-rise terraces in Noida call for robust membrane systems and basement waterproofing.",
    nearbyCitySlugs: ["greater-noida", "delhi", "ghaziabad"],
  },
  "greater-noida": {
    name: "Greater Noida",
    slug: "greater-noida",
    region: "Delhi NCR",
    intro:
      "Greater Noida's new townships choose Homes Decorator for fresh-slab waterproofing and modern flooring.",
    nearbyAreas: ["Pari Chowk", "Alpha", "Knowledge Park", "Techzone"],
    landmarks: ["Buddh International Circuit", "Pari Chowk", "GBU"],
    climateNote:
      "New construction across Greater Noida brings green-concrete moisture, addressed with breathable waterproof coatings.",
    nearbyCitySlugs: ["noida", "ghaziabad", "delhi"],
  },
  ghaziabad: {
    name: "Ghaziabad",
    slug: "ghaziabad",
    region: "Delhi NCR",
    intro:
      "Ghaziabad residents rely on Homes Decorator for seepage control, terrace treatment and durable flooring.",
    nearbyAreas: ["Indirapuram", "Vaishali", "Raj Nagar Extension", "Kaushambi"],
    landmarks: ["Shipra Mall", "City Forest", "Hindon River"],
    climateNote:
      "Dense construction near the Hindon river raises seepage risk in Ghaziabad's basements and party walls.",
    nearbyCitySlugs: ["noida", "delhi", "greater-noida"],
  },
  faridabad: {
    name: "Faridabad",
    slug: "faridabad",
    region: "Delhi NCR",
    intro:
      "Faridabad's industrial and residential clients pick Homes Decorator for tough, warranty-backed waterproofing and flooring.",
    nearbyAreas: ["Sector 15-21", "NIT", "Ballabgarh", "Neharpar"],
    landmarks: ["Surajkund", "Badkhal Lake", "Town Park"],
    climateNote:
      "Aravalli run-off around Faridabad increases foundation moisture, making plinth and basement waterproofing important.",
    nearbyCitySlugs: ["delhi", "gurgaon", "ballabgarh"],
  },
};

export function getCityData(locationSlug: string): CityInfo | null {
  if (!locationSlug) return null;
  return CITY_DATA[locationSlug.toLowerCase()] || null;
}

export function getNearbyCities(locationSlug: string): CityInfo[] {
  const city = getCityData(locationSlug);
  if (!city) return [];
  return city.nearbyCitySlugs
    .map((s) => getCityData(s))
    .filter((c): c is CityInfo => Boolean(c) && c!.slug !== city.slug);
}

// Flat list of every known city, sorted alphabetically. Used by the admin
// landing-page editor to populate the Location dropdown from a single source
// of truth so new cities added here appear automatically.
export const ALL_CITIES: { slug: string; name: string }[] = Object.values(
  CITY_DATA,
)
  .map((c) => ({ slug: c.slug, name: c.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

// ---------------------------------------------------------------------------
// Service metadata — links each landing-page serviceSlug back to its parent
// service hub and to related services for internal-linking / breadcrumbs.
// ---------------------------------------------------------------------------

export interface ServiceInfo {
  label: string; // Human label, e.g. "Terrace Waterproofing"
  parentSlug: string; // Parent hub route, e.g. "/services/waterproofing"
  parentLabel: string;
  relatedSlugs: string[]; // Other landing serviceSlugs to cross-link
}

export const SERVICE_INFO: Record<string, ServiceInfo> = {
  "terrace-waterproofing": {
    label: "Terrace Waterproofing",
    parentSlug: "/services/waterproofing",
    parentLabel: "Waterproofing",
    relatedSlugs: ["bathroom-waterproofing", "basement-waterproofing"],
  },
  "bathroom-waterproofing": {
    label: "Bathroom Waterproofing",
    parentSlug: "/services/waterproofing",
    parentLabel: "Waterproofing",
    relatedSlugs: ["terrace-waterproofing", "basement-waterproofing"],
  },
  "basement-waterproofing": {
    label: "Basement Waterproofing",
    parentSlug: "/services/waterproofing",
    parentLabel: "Waterproofing",
    relatedSlugs: ["terrace-waterproofing", "bathroom-waterproofing"],
  },
  "wooden-flooring-installation": {
    label: "Wooden Flooring Installation",
    parentSlug: "/services/wooden-flooring",
    parentLabel: "Wooden Flooring",
    relatedSlugs: ["spc-vinyl-flooring", "pvc-wall-panels-cladding"],
  },
  "spc-vinyl-flooring": {
    label: "SPC & Vinyl Flooring",
    parentSlug: "/services/pvc",
    parentLabel: "PVC & Flooring",
    relatedSlugs: ["wooden-flooring-installation", "pvc-wall-panels-cladding"],
  },
  "pvc-wall-panels-cladding": {
    label: "PVC Wall Panels & Cladding",
    parentSlug: "/services/pvc",
    parentLabel: "PVC & Flooring",
    relatedSlugs: ["spc-vinyl-flooring", "wooden-flooring-installation"],
  },
};

export function getServiceInfo(serviceSlug: string): ServiceInfo | null {
  return SERVICE_INFO[serviceSlug] || null;
}

// ---------------------------------------------------------------------------
// Local FAQ builder — produces a unique, city-aware FAQ cluster for each
// landing page. Feeds both the on-page accordion and FAQPage JSON-LD, giving
// GEO/AI engines answer-ready, citation-friendly Q&A.
// ---------------------------------------------------------------------------

export function buildLandingFaqs(opts: {
  service: string;
  city: CityInfo | null;
  cityName: string;
}): { question: string; answer: string }[] {
  const { service, city, cityName } = opts;
  const areas = city?.nearbyAreas?.slice(0, 3).join(", ");

  const faqs: { question: string; answer: string }[] = [
    {
      question: `Do you provide ${service} services in ${cityName}?`,
      answer: `Yes. Homes Decorator provides professional ${service.toLowerCase()} across ${cityName}${
        areas ? `, including ${areas}` : ""
      }. Every project starts with a free on-site inspection and moisture assessment, and finishes with a written warranty.`,
    },
    {
      question: `How much does ${service} cost in ${cityName}?`,
      answer: `Pricing depends on the area (in sq ft), substrate condition and the system specified. After a free inspection in ${cityName}, Homes Decorator provides a transparent, written per-square-foot quotation with no hidden charges. Call +91 8295524045 for an estimate.`,
    },
    {
      question: `How soon can Homes Decorator start work in ${cityName}?`,
      answer: `We typically schedule an inspection in ${cityName} within 24-48 hours of your request and can begin work shortly after the quotation is approved.`,
    },
    {
      question: `Is a warranty provided on ${service} in ${cityName}?`,
      answer: `Yes. Homes Decorator issues a written warranty — up to 10 years on waterproofing and wear warranties on flooring — for all work completed in ${cityName}.`,
    },
  ];

  if (city?.climateNote) {
    faqs.push({
      question: `Why is ${service} important for homes in ${cityName}?`,
      answer: city.climateNote,
    });
  }

  return faqs;
}
