import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { getJoinedChannels } from "./useJoinChannel.js";

const ResultScreen = ({ icon, title, message, children }) => (
  <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 2, px: 2 }}>
    {icon}
    <Typography variant="h4" component="h1">{title}</Typography>
    <Typography variant="body1" sx={{ color: "text.secondary" }}>{message}</Typography>
    {children}
  </Box>
);

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const channelId = params.get("channelId");
  const navigate = useNavigate();

  useEffect(() => {
    if (channelId) {
      const joinedChannels = getJoinedChannels();
      if (!joinedChannels.includes(channelId)) {
        localStorage.setItem("joinedChannels", JSON.stringify([...joinedChannels, channelId]));
      }
    }
    const timeout = setTimeout(() => navigate("/", { replace: true }), 2500);
    return () => clearTimeout(timeout);
  }, [channelId, navigate]);

  return (
    <ResultScreen
      icon={<CheckCircleOutlineIcon sx={{ fontSize: 72, color: "success.main" }} />}
      title="Welcome to the club!"
      message="Your payment was successful and your membership is active."
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
        <CircularProgress size={16} color="inherit" />
        <Typography variant="body2">Taking you back home...</Typography>
      </Box>
    </ResultScreen>
  );
};

export const PaymentCancel = () => {
  const navigate = useNavigate();
  return (
    <ResultScreen
      icon={<HighlightOffIcon sx={{ fontSize: 72, color: "text.disabled" }} />}
      title="Payment cancelled"
      message="No charge was made. You can join the channel any time."
    >
      <Button variant="contained" onClick={() => navigate("/", { replace: true })}>Back to videos</Button>
    </ResultScreen>
  );
};

export default PaymentSuccess;
