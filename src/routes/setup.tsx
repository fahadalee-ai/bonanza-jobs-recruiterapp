import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/setup")({
  component: function RedirectSignup() {
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: "/signup", replace: true });
    }, [navigate]);
    return null;
  },
});
