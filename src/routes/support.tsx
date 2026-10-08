import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PrimaryButton, TextArea, TextField } from "@/components/ui-app";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/support")({
  component: SupportPage,
});

function SupportPage() {
  const { pushToast } = useApp();
  const [subject, setSubject] = useState("Referral status");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-dvh bg-background pb-8">
      <PageHeader title="Contact support" fallback="/settings" />
      <div className="px-4">
        {sent ? (
          <p className="text-[15px] leading-6 text-muted-foreground">We received your note. A specialist replies within one business day at the email on your agent profile.</p>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (message.trim().length < 12) return;
              setSent(true);
              pushToast("Message sent", "Support will reply within one business day.");
            }}
          >
            <TextField label="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
            <TextArea label="How can we help?" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Include a referral ID if you have one." />
            <PrimaryButton className="w-full">Send</PrimaryButton>
            <p className="mt-4 text-[13px] leading-5 text-muted-foreground">Phone: (800) 555-0148 · Weekdays 8:00 AM–6:00 PM CT</p>
          </form>
        )}
      </div>
    </div>
  );
}
