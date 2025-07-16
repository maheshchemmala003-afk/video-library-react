// OTPVerify.jsx
import { useState } from "react";

export default function OTPVerify({ mobile, onVerify }) {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    onVerify(mobile, otp);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify}>Verify OTP</button>
    </div>
  );
}
