import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/recent")({
  component: function RedirectJobs() {
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: "/jobs", replace: true });
    }, [navigate]);
    return null;
  },
});
