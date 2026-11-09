import { visible } from "./visible";

export type Review = {
  name: string;
  business: string;
  city: string;
  /** Whole stars, 1 to 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  /** Placeholder card. Never shown in production. */
  sample?: boolean;
  todo?: boolean;
};

/**
 * Only real, verifiable reviews go here (with the client's permission). The reviews section
 * appears in production as soon as this list has one complete entry.
 */
const all: Review[] = [];

export const reviews = visible(all, ["name", "business", "city", "rating", "quote"]);

const sampleQuote =
  "Sample review. A short quote from a real client about working with Incodet will appear here.";

/**
 * Placeholder cards so the carousel can be built and tested. They only render on the dev
 * server, and only while there are no real reviews. See docs/temp-images.md.
 */
export const sampleReviews: Review[] = [
  {
    name: "Client name",
    business: "Roofing business",
    city: "City",
    rating: 5,
    quote: sampleQuote,
    sample: true,
  },
  {
    name: "Client name",
    business: "Hair salon",
    city: "City",
    rating: 5,
    quote: sampleQuote,
    sample: true,
  },
  {
    name: "Client name",
    business: "Car rental company",
    city: "City",
    rating: 5,
    quote: sampleQuote,
    sample: true,
  },
  {
    name: "Client name",
    business: "Dental clinic",
    city: "City",
    rating: 5,
    quote: sampleQuote,
    sample: true,
  },
  {
    name: "Client name",
    business: "Barber shop",
    city: "City",
    rating: 5,
    quote: sampleQuote,
    sample: true,
  },
  {
    name: "Client name",
    business: "Restaurant",
    city: "City",
    rating: 5,
    quote: sampleQuote,
    sample: true,
  },
];

/** Real reviews when there are any; otherwise the samples on the dev server only. */
export const reviewsToShow = (isDev: boolean): Review[] =>
  reviews.length ? reviews : isDev ? sampleReviews : [];
