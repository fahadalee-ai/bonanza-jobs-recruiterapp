import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/applications/")({
  component: function RedirectReferrals() {
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: "/referrals", replace: true });
    }, [navigate]);
    return null;
  },
});
