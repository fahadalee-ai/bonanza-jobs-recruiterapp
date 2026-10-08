import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/jobs/$jobId/apply")({
  component: function RedirectRefer() {
    const { jobId } = Route.useParams();
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: "/refer", search: { job: jobId }, replace: true });
    }, [navigate, jobId]);
    return null;
  },
});
