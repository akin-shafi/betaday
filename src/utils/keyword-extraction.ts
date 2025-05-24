// Enhanced keyword extraction with Nigerian context
export const extractKeywords = (text: string): { businessType?: string; searchTerm: string; keywords: string[] } => {
  const normalizedText = text.toLowerCase().trim()

  const businessTypeMap: { [key: string]: string } = {
    // Food & Restaurants (Nigerian context)
    food: "Restaurants",
    restaurant: "Restaurants",
    eat: "Restaurants",
    meal: "Restaurants",
    lunch: "Restaurants",
    dinner: "Restaurants",
    breakfast: "Restaurants",
    pizza: "Restaurants",
    burger: "Restaurants",
    chicken: "Restaurants",
    rice: "Restaurants",
    soup: "Restaurants",
    jollof: "Restaurants",
    "jollof rice": "Restaurants",
    amala: "Restaurants",
    "pounded yam": "Restaurants",
    eba: "Restaurants",
    fufu: "Restaurants",
    "pepper soup": "Restaurants",
    suya: "Restaurants",
    "meat pie": "Restaurants",
    "chin chin": "Restaurants",
    plantain: "Restaurants",
    beans: "Restaurants",
    yam: "Restaurants",
    "fried rice": "Restaurants",
    "ofada rice": "Restaurants",

    // Drinks (Nigerian context)
    drink: "Drinks",
    drinks: "Drinks",
    beverage: "Drinks",
    juice: "Drinks",
    water: "Drinks",
    soda: "Drinks",
    coffee: "Drinks",
    tea: "Drinks",
    smoothie: "Drinks",
    cocktail: "Drinks",
    beer: "Drinks",
    wine: "Drinks",
    fura: "Drinks",
    "fura da nono": "Drinks",
    zobo: "Drinks",
    kunu: "Drinks",
    "palm wine": "Drinks",
    "tiger nut": "Drinks",
    "coconut water": "Drinks",
    "ginger drink": "Drinks",

    // Groceries & Supermarkets
    grocery: "Supermarkets",
    groceries: "Supermarkets",
    supermarket: "Supermarkets",
    market: "Supermarkets",
    shop: "Supermarkets",
    store: "Supermarkets",
    buy: "Supermarkets",
    shopping: "Supermarkets",
    provisions: "Supermarkets",

    // Pharmacy
    pharmacy: "Pharmacies",
    medicine: "Pharmacies",
    drug: "Pharmacies",
    medication: "Pharmacies",
    pills: "Pharmacies",
    health: "Pharmacies",
    medical: "Pharmacies",
    chemist: "Pharmacies",
  }

  const stopWords = new Set([
    "i",
    "want",
    "to",
    "need",
    "looking",
    "for",
    "find",
    "get",
    "buy",
    "order",
    "some",
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "by",
    "with",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "can",
    "could",
    "would",
    "should",
    "will",
    "shall",
    "may",
    "might",
    "must",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
  ])

  const words = normalizedText.split(/\s+/).filter((word) => word.length > 2)

  // Find business type (check for multi-word phrases first)
  let businessType: string | undefined

  const multiWordPhrases = [
    "jollof rice",
    "pounded yam",
    "pepper soup",
    "fura da nono",
    "palm wine",
    "tiger nut",
    "coconut water",
    "ginger drink",
    "meat pie",
    "chin chin",
    "fried rice",
    "ofada rice",
  ]

  for (const phrase of multiWordPhrases) {
    if (normalizedText.includes(phrase)) {
      businessType = businessTypeMap[phrase]
      break
    }
  }

  if (!businessType) {
    for (const word of words) {
      if (businessTypeMap[word]) {
        businessType = businessTypeMap[word]
        break
      }
    }
  }

  const keywords = words.filter((word) => !stopWords.has(word) && word.length > 2 && !businessTypeMap[word])
  const searchTerm = keywords.join(" ")

  return {
    businessType,
    searchTerm,
    keywords,
  }
}
