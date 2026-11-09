import { visible } from "./visible";

export type Industry = {
  slug: string;
  name: string;
  to: string;
  icon:
    | "roof"
    | "floor"
    | "salon"
    | "barber"
    | "restaurant"
    | "hotel"
    | "car"
    | "wash"
    | "dental"
    | "medical"
    | "firm";
  page: {
    title: string;
    description: string;
    h1: string;
    intro: string;
    pains: { title: string; body: string }[];
    transcript: { caller: string; ai: string; alert: string };
    /** Small note shown under the transcript. */
    note?: string;
    /** Case study slug shown under "Related work". */
    relatedWork?: string;
  };
  todo?: boolean;
};

const medicalNote =
  "The AI agent handles bookings and general questions only. It never gives medical advice and directs urgent cases to emergency services.";

const all: Industry[] = [
  {
    slug: "roofing",
    name: "Roofing",
    to: "/industries/roofing",
    icon: "roof",
    page: {
      title: "AI Receptionist & Websites for Roofing Companies | Incodet",
      description:
        "Booking websites and a 24/7 AI calling agent for roofing companies. Every call answered, every inspection booked, even when you are up on a roof.",
      h1: "Never miss another roofing job",
      intro:
        "Booking websites and a 24/7 AI calling agent for roofing companies. Every call answered, every inspection booked, even when you are up on a roof.",
      pains: [
        {
          title: "Calls come in while you are on a roof",
          body: "You cannot answer the phone with a ladder in one hand.",
        },
        {
          title: "Storm season floods the phone",
          body: "More calls than you can handle, all on the same day.",
        },
        {
          title: "Missed calls go to the next roofer",
          body: "Most callers will not leave a voicemail. They just call someone else.",
        },
      ],
      transcript: {
        caller:
          "Hi, my roof started leaking after last night's storm. Can someone come and look at it?",
        ai: "Sorry to hear that. I can book a roof inspection for you. What is the property address, and does tomorrow morning or afternoon suit you better?",
        alert: "New inspection booked: roof leak, tomorrow morning.",
      },
    },
  },
  {
    slug: "epoxy-flooring",
    name: "Epoxy Flooring",
    to: "/industries/epoxy-flooring",
    icon: "floor",
    page: {
      title: "AI Receptionist & Websites for Epoxy Flooring Companies | Incodet",
      description:
        "Booking websites and a 24/7 AI calling agent for epoxy flooring companies. The agent collects the job details and books the site visit while you are on a job.",
      h1: "Turn every enquiry into a booked quote",
      intro:
        "Booking websites and a 24/7 AI calling agent for epoxy flooring companies. The agent collects the job details and books the site visit while you are on a job.",
      pains: [
        {
          title: "You are mid-pour when the phone rings",
          body: "Coatings do not wait, so calls get missed.",
        },
        {
          title: "Quotes need details first",
          body: "Floor size, current surface and timing, every single time.",
        },
        {
          title: "Leads go cold fast",
          body: "If nobody replies the same day, the customer moves on.",
        },
      ],
      transcript: {
        caller: "Hi, I would like a quote for an epoxy garage floor.",
        ai: "Happy to help. Roughly how big is the garage, and is the floor bare concrete or already coated? I can then book a free site visit.",
        alert: "New site visit booked: garage floor quote.",
      },
    },
  },
  {
    slug: "salons",
    name: "Salons",
    to: "/industries/salons",
    icon: "salon",
    page: {
      title: "AI Receptionist & Booking Websites for Salons | Incodet",
      description:
        "Booking websites, an AI chatbot and a 24/7 AI calling agent for salons. Clients book any time and you stay focused on the person in your chair.",
      h1: "Bookings that run while you work",
      intro:
        "Booking websites, an AI chatbot and a 24/7 AI calling agent for salons. Clients book any time and you stay focused on the person in your chair.",
      pains: [
        {
          title: "The phone rings mid-appointment",
          body: "Stopping to answer means keeping a client waiting.",
        },
        {
          title: "Clients want to book at 10pm",
          body: "If they cannot book late at night, they book somewhere else.",
        },
        {
          title: "Gaps in the diary cost money",
          body: "Missed calls mean empty slots you could have filled.",
        },
      ],
      transcript: {
        caller: "Hi, can I book a cut and colour this Saturday?",
        ai: "Of course. I have 11:00 or 14:30 available on Saturday. Which would you like?",
        alert: "New booking: cut and colour, Saturday 11:00.",
      },
      relatedWork: "bloom-studio",
    },
  },
  {
    slug: "barber-shops",
    name: "Barber Shops",
    to: "/industries/barber-shops",
    icon: "barber",
    page: {
      title: "AI Receptionist & Booking Websites for Barber Shops | Incodet",
      description:
        "Booking websites and a 24/7 AI calling agent for barber shops. Every call answered and every booking made, without putting the clippers down.",
      h1: "Keep cutting. We will pick up the phone.",
      intro:
        "Booking websites and a 24/7 AI calling agent for barber shops. Every call answered and every booking made, without putting the clippers down.",
      pains: [
        {
          title: "Clippers in hand, phone ringing",
          body: "You cannot stop a fade halfway to take a call.",
        },
        {
          title: "The same questions all day",
          body: "Opening hours, prices and wait times, over and over.",
        },
        {
          title: "After-hours calls are lost",
          body: "People book their next cut in the evening, when you are closed.",
        },
      ],
      transcript: {
        caller: "Have you got anything this afternoon for a skin fade?",
        ai: "Yes, I have 15:30 or 16:15 free today. Can I take your name for the booking?",
        alert: "New booking: skin fade, today 15:30.",
      },
    },
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    to: "/industries/restaurants",
    icon: "restaurant",
    page: {
      title: "AI Receptionist & Booking Websites for Restaurants | Incodet",
      description:
        "Booking websites and a 24/7 AI calling agent for restaurants. Reservations, opening hours and menu questions handled while your team serves guests.",
      h1: "Every table booked, every call answered",
      intro:
        "Booking websites and a 24/7 AI calling agent for restaurants. Reservations, opening hours and menu questions handled while your team serves guests.",
      pains: [
        {
          title: "The phone rings during the dinner rush",
          body: "Nobody is free to answer when you are busiest.",
        },
        {
          title: "The same questions all day",
          body: "Opening hours, parking and dietary options, again and again.",
        },
        { title: "Missed calls mean empty tables", body: "Callers book wherever picks up first." },
      ],
      transcript: {
        caller: "Hi, can I book a table for four tomorrow at 7pm?",
        ai: "Yes, I have a table for four at 7pm tomorrow. Can I take a name and a mobile number for the booking?",
        alert: "New reservation: table for 4, tomorrow 7pm.",
      },
    },
  },
  {
    slug: "hotels",
    name: "Hotels",
    to: "/industries/hotels",
    icon: "hotel",
    page: {
      title: "AI Receptionist & Booking Websites for Hotels | Incodet",
      description:
        "Websites, an AI chatbot and a 24/7 AI calling agent for hotels and guesthouses. Room enquiries, check-in questions and booking requests answered day and night.",
      h1: "A front desk that never sleeps",
      intro:
        "Websites, an AI chatbot and a 24/7 AI calling agent for hotels and guesthouses. Room enquiries, check-in questions and booking requests answered day and night.",
      pains: [
        { title: "Calls at 2am", body: "Late arrivals and overseas guests call around the clock." },
        {
          title: "Front desk stretched thin",
          body: "Staff juggle guests at the desk and a ringing phone.",
        },
        {
          title: "Lost direct bookings",
          body: "Unanswered enquiries end up on booking sites that charge commission.",
        },
      ],
      transcript: {
        caller: "Do you have a double room free this Friday and Saturday?",
        ai: "Yes, a double room is available for Friday and Saturday. I can send your booking request to the team now. What name should I use?",
        alert: "New room request: double room, Friday and Saturday.",
      },
    },
  },
  {
    slug: "car-rentals",
    name: "Car Rentals",
    to: "/industries/car-rentals",
    icon: "car",
    page: {
      title: "AI Receptionist & Booking Websites for Car Rental Companies | Incodet",
      description:
        "Booking websites and a 24/7 AI calling agent for car rental companies. Availability questions, pickup times and booking requests handled without hold music.",
      h1: "Rental enquiries answered in seconds",
      intro:
        "Booking websites and a 24/7 AI calling agent for car rental companies. Availability questions, pickup times and booking requests handled without hold music.",
      pains: [
        {
          title: "Customers want answers now",
          body: "If you do not pick up, they call the next rental desk.",
        },
        {
          title: "The same questions on repeat",
          body: "Prices, deposits, licence rules and pickup times.",
        },
        {
          title: "Late flights, late calls",
          body: "Customers still need help after the office closes.",
        },
      ],
      transcript: {
        caller: "Do you have an automatic SUV from Monday to Thursday?",
        ai: "Yes, an automatic SUV is available Monday to Thursday. What time would you like to pick it up?",
        alert: "New rental request: automatic SUV, Monday to Thursday.",
      },
    },
  },
  {
    slug: "car-wash",
    name: "Car Wash",
    to: "/industries/car-wash",
    icon: "wash",
    page: {
      title: "AI Receptionist & Booking Websites for Car Washes | Incodet",
      description:
        "Online booking and a 24/7 AI calling agent for car wash and detailing businesses. Customers pick a service and a time while you keep the bays moving.",
      h1: "More washes booked, fewer missed calls",
      intro:
        "Online booking and a 24/7 AI calling agent for car wash and detailing businesses. Customers pick a service and a time while you keep the bays moving.",
      pains: [
        {
          title: "Hands busy, phone ringing",
          body: "You cannot answer while washing or detailing a car.",
        },
        {
          title: "Busy weekends, quiet weekdays",
          body: "No easy way to spread bookings across the week.",
        },
        { title: "Package questions", body: "Which wash, how long and how much, every time." },
      ],
      transcript: {
        caller: "Can I book a full valet on Saturday morning?",
        ai: "Of course. A full valet takes about two hours. I have 9:00 or 11:30 free on Saturday. Which suits you?",
        alert: "New booking: full valet, Saturday 9:00.",
      },
    },
  },
  {
    slug: "dental-clinics",
    name: "Dental Clinics",
    to: "/industries/dental-clinics",
    icon: "dental",
    page: {
      title: "AI Receptionist & Booking Websites for Dental Clinics | Incodet",
      description:
        "Booking websites and a 24/7 AI calling agent for dental practices. New patient enquiries and appointment requests handled around the clock.",
      h1: "Patients booked, front desk freed up",
      intro:
        "Booking websites and a 24/7 AI calling agent for dental practices. New patient enquiries and appointment requests handled around the clock.",
      pains: [
        {
          title: "Reception is always busy",
          body: "Patients at the desk, patients in the chair, phone ringing.",
        },
        {
          title: "After-hours tooth pain",
          body: "Patients call at night and need a clear next step.",
        },
        { title: "No-shows leave gaps", body: "Forgotten appointments mean empty chairs." },
      ],
      transcript: {
        caller: "Hi, I have a toothache. Can I get an appointment this week?",
        ai: "Sorry to hear that. The earliest appointment is Wednesday at 10:15. Shall I book it for you?",
        alert: "New appointment: toothache, Wednesday 10:15.",
      },
      note: medicalNote,
    },
  },
  {
    slug: "medical-clinics",
    name: "Medical Clinics",
    to: "/industries/medical-clinics",
    icon: "medical",
    page: {
      title: "AI Receptionist & Booking Websites for Medical Clinics | Incodet",
      description:
        "Booking websites and a 24/7 AI calling agent for clinics and private practices. Patients book, reschedule and get answers to common questions any time.",
      h1: "Appointments booked without the phone queue",
      intro:
        "Booking websites and a 24/7 AI calling agent for clinics and private practices. Patients book, reschedule and get answers to common questions any time.",
      pains: [
        {
          title: "The 8am phone rush",
          body: "Everyone calls at once and most hear the engaged tone.",
        },
        { title: "Rescheduling eats staff time", body: "Every change means another call." },
        { title: "Common questions on repeat", body: "Opening hours, parking and what to bring." },
      ],
      transcript: {
        caller: "I need to move my appointment on Thursday to next week.",
        ai: "No problem. I can offer Tuesday at 9:40 or Wednesday at 14:00. Which would you prefer?",
        alert: "Appointment moved: Thursday to Tuesday 9:40.",
      },
      note: medicalNote,
    },
  },
  {
    slug: "professional-firms",
    name: "Law & Accounting Firms",
    to: "/industries/professional-firms",
    icon: "firm",
    page: {
      title: "AI Receptionist & Booking Websites for Law & Accounting Firms | Incodet",
      description:
        "Websites, an AI chatbot and a 24/7 AI calling agent for law firms, accountants and consultants. New enquiries are answered and booked in while you focus on clients.",
      h1: "Every enquiry captured, every consultation booked",
      intro:
        "Websites, an AI chatbot and a 24/7 AI calling agent for law firms, accountants and consultants. New enquiries are answered and booked in while you focus on clients.",
      pains: [
        {
          title: "Billable time lost to the phone",
          body: "Every unplanned call interrupts client work.",
        },
        {
          title: "Enquiries after hours",
          body: "Prospects reach out in the evening and expect a reply.",
        },
        {
          title: "Calls you cannot take on",
          body: "Time spent on enquiries outside your services.",
        },
      ],
      transcript: {
        caller: "Hi, I need help with my small business tax return. Can I speak to someone?",
        ai: "I can book you an initial consultation with one of the team. Does tomorrow at 11:00 or 15:30 work?",
        alert: "New consultation: small business tax, tomorrow 11:00.",
      },
    },
  },
];

export const industries = visible(all, ["name", "to"]);

export function getIndustry(slug: string): Industry {
  const i = all.find((x) => x.slug === slug);
  if (!i) throw new Error(`Unknown industry: ${slug}`);
  return i;
}

export const industryWhatYouGet = [
  "A booking website your customers can use day or night",
  "An AI chatbot that answers questions on your site",
  "A 24/7 AI calling agent that picks up every call",
  "Owner alerts by email and WhatsApp with every booking",
];

export const industryFaq = [
  "How does the 24/7 AI calling agent work?",
  "How long does it take?",
  "Is there a contract?",
];
