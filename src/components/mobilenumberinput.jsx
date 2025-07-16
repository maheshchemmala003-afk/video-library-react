// MobileNumberInput.jsx
import { useState } from "react";

export default function MobileNumberInput({ onSendOTP }) {
  const [mobile, setMobile] = useState("");

  const handleSendOTP = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }
    onSendOTP(mobile);
  };

  return (
    <div>
      <input
        type="tel"
        placeholder="Enter mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button onClick={handleSendOTP}>Send OTP</button>
    </div>
  );
}
