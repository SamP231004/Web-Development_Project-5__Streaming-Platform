import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const channelId = params.get("channelId");
  const navigate = useNavigate();

  useEffect(() => {
    if (channelId) {
      // Mark this channel as joined in localStorage
      const joinedChannels = JSON.parse(localStorage.getItem("joinedChannels") || "[]");
      if (!joinedChannels.includes(channelId)) {
        joinedChannels.push(channelId);
        localStorage.setItem("joinedChannels", JSON.stringify(joinedChannels));
      }
    }
    // Redirect to main page after a short delay
    setTimeout(() => navigate("/"), 1000);
  }, [channelId, navigate]);

  return <div>Payment successful! Redirecting...</div>;
};

export default PaymentSuccess;