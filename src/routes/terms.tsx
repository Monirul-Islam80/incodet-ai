import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { seoHead } from "@/components/site/PageHero";
import { site } from "@/config/site";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () =>
    seoHead(
      "Terms of Service | Incodet",
      "The terms that apply when you work with Incodet on websites, AI chatbots, AI phone agents and custom software.",
      "/terms",
    ),
  component: TermsPage,
});

function TermsPage() {
  const email = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return (
    <LegalPage
      title="Terms of Service"
      intro={
        <p>
          These terms apply when you work with Incodet. Your written proposal sets out the details
          of your project. If the proposal and these terms differ, the proposal applies.
        </p>
      }
      sections={[
        {
          h: "Our services",
          body: (
            <p>
              We build websites, AI chatbots, AI phone agents and custom software for businesses.
            </p>
          ),
        },
        {
          h: "Quotes and proposals",
          body: (
            <p>
              Before we start, we send you a written proposal. It sets out the scope, price,
              timeline and any notice period for your project. Work starts once you accept it.
            </p>
          ),
        },
        {
          h: "Fees",
          body: (
            <>
              <p>Our plans have a one-time setup fee and a monthly fee. All prices are in USD.</p>
              <p>
                Extra AI call minutes cost $0.20 per minute and are billed only if you use them.
              </p>
            </>
          ),
        },
        {
          h: "No lock-in contracts",
          body: (
            <p>There are no lock-in contracts. Any notice period is set out in your proposal.</p>
          ),
        },
        {
          h: "Payments",
          body: (
            <p>
              You can pay by Payoneer, Wise, PayPal or bank transfer. Please use your invoice number
              as the payment reference.
            </p>
          ),
        },
        {
          h: "Your responsibilities",
          body: (
            <ul>
              <li>Give us accurate information about your business.</li>
              <li>Provide the content we need, such as text, images and business details.</li>
              <li>Give feedback on time so we can keep to the agreed timeline.</li>
            </ul>
          ),
        },
        {
          h: "AI agent limitations",
          body: (
            <p>
              AI chatbots and AI phone agents can make mistakes. You are responsible for checking
              bookings and any important information they collect or give to your customers.
            </p>
          ),
        },
        {
          h: "Third-party services",
          body: (
            <p>
              Our services rely on third-party providers, such as hosting, booking, AI and payment
              services. We are not responsible for outages or changes made by those providers, but
              we will help you deal with them.
            </p>
          ),
        },
        {
          h: "Intellectual property and ownership",
          body: <p>Ownership of the work we create is as set out in your proposal.</p>,
        },
        {
          h: "Limitation of liability",
          body: (
            <p>
              To the extent the law allows, we are not liable for indirect or consequential losses,
              such as lost profits or lost bookings. Our total liability for any claim is limited to
              the fees you paid us in the three months before the claim.
            </p>
          ),
        },
        {
          h: "Termination",
          body: (
            <p>
              Either of us can end the service by giving notice as set out in your proposal. You pay
              for work done and services used up to the end date.
            </p>
          ),
        },
        {
          h: "Governing law",
          body: <p>These terms are governed by the laws of Western Australia.</p>,
        },
        { h: "Contact", body: <p>Questions about these terms? Email us at {email}.</p> },
      ]}
    />
  );
}
