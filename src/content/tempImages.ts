/**
 * Temporary images that fill empty image slots until real work is available.
 * Files live in public/images/temp as "<id>-<width>.webp". Sources, licences and what to
 * replace each one with are listed in docs/temp-images.md. Remove an entry (and its
 * `temp` reference in src/content/services.ts) once the real image is in place.
 */
/** widths: files on disk; w/h: intrinsic size of the smallest file (reserves layout space). */
export type TempImage = { widths: number[]; w: number; h: number; alt: string };

const tile = { widths: [300, 600], w: 300, h: 300 };
const wide = { widths: [640, 1280], w: 640, h: 400 };
const comparison = { widths: [700, 1300, 2432], w: 700, h: 306 };
const phoneComparison = { widths: [700, 1300, 2432], w: 700, h: 276 };

export const tempImages = {
  "calling-phone-desk": {
    ...tile,
    alt: "Smartphone on a stand beside a notepad on a wooden desk",
  },
  "chatbot-bloom-assistant": {
    ...tile,
    alt: "Bloom Studio website chat assistant suggesting common questions",
  },
  "app-wireframe-paper": {
    ...tile,
    alt: "Hand-drawn app and website wireframes on paper with an orange pen",
  },
  "app-wireframe-paper-wide": {
    ...wide,
    alt: "Hand-drawn app and website wireframes on paper with an orange pen",
  },
  "app-wireframe-blue": {
    ...tile,
    alt: "Hand-drawn wireframe sketches on a dark blue background",
  },
  "uiux-humandata-mobile": {
    ...tile,
    alt: "HumanData Labs website shown on a phone screen",
  },
  "software-portal-demo": {
    ...tile,
    alt: "Incodet client portal demo showing project progress for a sample client",
  },
  "software-brhex-floorplan": {
    ...tile,
    alt: "BRHEX Studio floor plan viewer showing a ground floor layout",
  },
  "social-studio-lights": {
    ...tile,
    alt: "Small content studio with lights, stands and paper backdrops",
  },
  "social-studio-lights-wide": {
    ...wide,
    alt: "Small content studio with lights, stands and paper backdrops",
  },
  "social-planning-flatlay": {
    ...tile,
    alt: "Pens, markers and paper clips on a white desk for content planning",
  },
  "webdev-bloom-before": {
    ...comparison,
    alt: "Grey-box wireframe of the Bloom Studio homepage",
  },
  "webdev-bloom-after": {
    ...comparison,
    alt: "Finished Bloom Studio homepage with booking and salon assistant buttons",
  },
  "uiux-bloom-mobile-before": {
    ...phoneComparison,
    alt: "Grey-box wireframe of the Bloom Studio homepage on a phone",
  },
  "uiux-bloom-mobile-after": {
    ...phoneComparison,
    alt: "Finished Bloom Studio homepage on a phone",
  },
  "appdev-humandata-mobile-before": {
    ...phoneComparison,
    alt: "Grey-box wireframe of the HumanData Labs homepage on a phone",
  },
  "appdev-humandata-mobile-after": {
    ...phoneComparison,
    alt: "Finished HumanData Labs homepage on a phone",
  },
} satisfies Record<string, TempImage>;

export type TempImageId = keyof typeof tempImages;

export const tempImageSrc = (id: TempImageId, width: number) => `/images/temp/${id}-${width}.webp`;
