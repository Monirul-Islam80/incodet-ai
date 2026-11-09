import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { seoHead } from "@/components/site/PageHero";
import { site } from "@/config/site";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () =>
    seoHead(
      "Privacy Policy | Incodet",
      "How Incodet collects, uses, stores and protects your personal information, and the choices you have.",
      "/privacy",
    ),
  component: PrivacyPage,
});

function PrivacyPage() {
  const email = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          This policy explains what personal information we collect, why we collect it, how we look
          after it and the choices you have. We have written it in plain English so it is easy to
          follow.
        </p>
      }
      sections={[
        {
          h: "Who we are",
          body: (
            <p>
              Incodet builds websites, AI chatbots, AI phone agents and custom software. Our head
              office is in Perth at {site.address}, with teams in{" "}
              {site.locations
                .slice(1)
                .map((l) => l.city)
                .join(", ")
                .replace(/, ([^,]*)$/, " and $1")}
              . You can contact us about privacy at any time at {email}.
            </p>
          ),
        },
        {
          h: "What we collect",
          body: (
            <>
              <p>We only collect information we need to talk to you and deliver our services:</p>
              <ul>
                <li>
                  Details you give us through our contact form or when you book a call, such as your
                  name, email, phone number, business name and what you need.
                </li>
                <li>Emails and messages we exchange with you, including WhatsApp messages.</li>
                <li>
                  Client portal account data, such as your login email and the project files and
                  messages you share there.
                </li>
                <li>Invoices and payment confirmations.</li>
                <li>
                  If you accept analytics, basic data about how our website is used, such as pages
                  visited, device type and approximate location.
                </li>
              </ul>
            </>
          ),
        },
        {
          h: "How we use your information",
          body: (
            <p>
              We use your information to reply to enquiries, run calls you book, plan and deliver
              projects, send invoices, provide support and improve our website. We do not sell your
              personal information.
            </p>
          ),
        },
        {
          h: "AI chatbots and AI phone agents we run for clients",
          body: (
            <>
              <p>
                We build and run AI chatbots and AI phone agents for our clients' businesses. When
                you chat with or call one of these businesses:
              </p>
              <ul>
                <li>
                  Chat transcripts and call recordings may be stored so the service can work, for
                  example to create a booking or send the business owner the details.
                </li>
                <li>
                  Callers are told when a call is answered by an AI agent and that the call may be
                  recorded.
                </li>
                <li>
                  Our clients decide how long recordings and transcripts are kept, within the limits
                  of their plan.
                </li>
              </ul>
              <p>
                For these conversations, the business you contacted is responsible for your
                information and we process it on their behalf. Please contact that business with any
                questions about how they use it.
              </p>
            </>
          ),
        },
        {
          h: "Service providers we use",
          body: (
            <>
              <p>
                We use trusted providers to run our services. They only receive the information they
                need to do their job:
              </p>
              <ul>
                <li>Website hosting and database providers.</li>
                <li>
                  AI voice and chat providers, currently including Vapi, OpenAI and ElevenLabs.
                </li>
                <li>Payment providers Payoneer, Wise and PayPal, and banks.</li>
              </ul>
            </>
          ),
        },
        {
          h: "Cookies and analytics",
          body: (
            <p>
              We only use essential cookies and storage that our website needs to work. If we turn
              on privacy-friendly analytics, a banner asks for your consent first and no analytics
              scripts load unless you click Accept. If you decline, nothing is loaded. Your choice
              is saved in your browser, and you can change it at any time by clearing the stored
              data for this website in your browser settings.
            </p>
          ),
        },
        {
          h: "How long we keep information",
          body: (
            <>
              <ul>
                <li>Enquiries and booking records are kept for up to 24 months.</li>
                <li>Client project and invoice records are kept for 7 years for tax purposes.</li>
              </ul>
              <p>After these periods, we delete the information.</p>
            </>
          ),
        },
        {
          h: "Your rights",
          body: (
            <p>
              You can ask to see the personal information we hold about you, ask us to correct it or
              ask us to delete it. Email us at {email} and we will reply as soon as we can.
            </p>
          ),
        },
        {
          h: "International transfers",
          body: (
            <p>
              We are based in Australia and work with clients in other countries. Some of our
              service providers store or process information outside Australia. When that happens,
              we choose providers that protect personal information to a high standard.
            </p>
          ),
        },
        {
          h: "Governing law",
          body: <p>This policy is governed by the laws of Western Australia.</p>,
        },
        {
          h: "Changes to this policy",
          body: (
            <p>
              We may update this policy from time to time. When we do, we will change the "Last
              updated" date at the top of this page. If a change is significant, we will let our
              clients know.
            </p>
          ),
        },
      ]}
    />
  );
}
