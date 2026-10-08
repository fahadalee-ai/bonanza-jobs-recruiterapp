import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/jobs/$jobId/success")({
  component: function RedirectHome() {
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: "/referrals", replace: true });
    }, [navigate]);
    return null;
  },
});
