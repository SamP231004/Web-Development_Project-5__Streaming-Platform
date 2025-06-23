import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const JoinChannelButton = ({ channelId, username }) => {
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  // Check joined status on mount and when storage changes
  useEffect(() => {
    const checkJoined = () => {
      const joinedChannels = JSON.parse(localStorage.getItem("joinedChannels") || "[]");
      setJoined(joinedChannels.includes(channelId));
    };
    checkJoined();
    window.addEventListener("storage", checkJoined);
    return () => window.removeEventListener("storage", checkJoined);
  }, [channelId]);

  const handleJoin = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/version_1/payment/create-checkout-session`,
        { channelId, username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.open(res.data.url);
    } catch (err) {
      alert("Failed to start payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        borderRadius: '10px',
        padding: '3px 7px',
        border: '0.5px solid white',
        cursor: 'pointer',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
      }}
      color={joined ? "success" : "primary"}
      disabled={joined || loading}
      onClick={handleJoin}
    >
      {joined ? "Joined" : loading ? "Redirecting..." : "Join"}
    </Button>
  );
};

export default JoinChannelButton;