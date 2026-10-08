import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/profile/certifications")({
  component: function Go() {
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: "/profile/edit", replace: true });
    }, [navigate]);
    return null;
  },
});
