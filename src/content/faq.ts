import { visible } from "./visible";

export type FaqItem = { question: string; answer: string; todo?: boolean };

const all: FaqItem[] = [
  {
    question: "What does each plan include?",
    answer:
      "Starter is a website with online booking and booking emails. Growth adds an AI website chatbot, a 24/7 AI calling agent and owner alerts by email and WhatsApp. Scale is a multi-page or SaaS-level platform with AI automation, client dashboards and custom integrations.",
  },
  {
    question: "How does the 24/7 AI calling agent work?",
    answer:
      "It answers every call, including after hours. It gives callers your business information, books appointments and sends you the details by email or WhatsApp.",
  },
  {
    question: "What does pay for what you use mean?",
    answer:
      "You only pay for the features you choose. Growth includes 300 AI call minutes a month, and extra minutes cost $0.20 each, billed only if you use them. Every feature is also available on its own.",
  },
  {
    question: "How long does it take?",
    answer: "Starter takes 1 to 2 weeks, Growth 2 to 3 weeks and Scale 4 to 8 weeks.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We test everything, go live and stay on to support and improve it. Starter includes optional care for $19 a month, which covers hosting and updates.",
  },
  { question: "Is there a contract?", answer: "No. There are no lock-in contracts." },
  { question: "How can I pay?", answer: "We accept Payoneer, Wise, PayPal and bank transfer." },
  {
    question: "Which countries do you work with?",
    answer: "We work with businesses in the USA, UK, Canada, Australia and Europe.",
  },
  {
    question: "Who owns the website?",
    answer: "You do. Once paid, your website and its content are yours.",
  },
  { question: "Which languages does the AI agent speak?", answer: "", todo: true },
];

export const faq = visible(all, ["question", "answer"]);

/** FAQ items picked by question, in the given order. */
export const faqFor = (questions: string[]) =>
  questions.map((q) => faq.find((f) => f.question === q)).filter((f): f is FaqItem => Boolean(f));
