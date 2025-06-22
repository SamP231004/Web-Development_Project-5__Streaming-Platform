import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const channelId = params.get("channelId");
  const navigate = useNavigate();

  useEffect(() => {
    if (channelId) {
      const joinedChannels = JSON.parse(localStorage.getItem("joinedChannels") || "[]");
      if (!joinedChannels.includes(channelId)) {
        joinedChannels.push(channelId);
        localStorage.setItem("joinedChannels", JSON.stringify(joinedChannels));
      }
    }
    const timeout = setTimeout(() => navigate("/"), 1000);
    return () => clearTimeout(timeout);
  }, [channelId, navigate]);

  return <div>Payment successful! Redirecting...</div>;
};

export default PaymentSuccess;