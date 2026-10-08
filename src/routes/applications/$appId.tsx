import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/applications/$appId")({
  component: function RedirectReferral() {
    const { appId } = Route.useParams();
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: "/referrals/$referralId", params: { referralId: appId }, replace: true });
    }, [navigate, appId]);
    return null;
  },
});
