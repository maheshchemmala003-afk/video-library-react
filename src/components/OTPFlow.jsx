import axios from "axios";
import { useState } from "react";
import MobileNumberInput from "./mobilenumberinput";
import OTPVerify from "./OTPVerify";

export default function OTPFlow() {
    const [mobile, setMobile] = useState("");
    const [step, setStep] = useState("enterMobile");
  
    const sendOTP = async (mobile) => {
      try {
        await axios.post("/send-otp", { mobile });
        setMobile(mobile);
        setStep("verifyOTP");
      } catch (err) {
        alert("Failed to send OTP");
      }
    };
  
    const verifyOTP = async (mobile, otp) => {
      try {
        const res = await axios.post("/verify-otp", { mobile, otp });
        alert("OTP Verified Successfully!");
      } catch (err) {
        alert("Invalid OTP");
      }
    };
    return(
        <div className="bg-light p-4 m-4 w-25 rounded">
          {step === "enterMobile" && <MobileNumberInput onSendOTP={sendOTP} />}
          {step === "verifyOTP" && <OTPVerify mobile={mobile} onVerify={verifyOTP} />}
        </div>
      );
    
}
