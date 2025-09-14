import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from 'yup';

export function UserRegister() {
    const [mobile, setMobile] = useState('');
    const [mobileOtp, setMobileOtp] = useState('');
    const [mobileOtpSent, setMobileOtpSent] = useState(false);
    const [mobileVerified, setMobileVerified] = useState(false);



    const [email, setEmail] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailExpired, setEmailExpired] = useState(false);
    const [mobileExpired, setMobileExpired] = useState(false);


    const [emailOtpTimeRemaining, setEmailOtpTimeRemaining] = useState(0);
    const [mobileOtpTimeRemaining, setMobileOtpTimeRemaining] = useState(0);

    const [emailVerified, setEmailVerified] = useState(false);


    const [emailMessage, setEmailMessage] = useState('');
    const [emailMessageColor, setEmailMessageColor] = useState('');
    const [mobileMessage, setMobileMessage] = useState('');
    const [mobileMessageColor, setMobileMessageColor] = useState('');

    const [successMessage, setSuccessMessage] = useState('');


    let navigate = useNavigate();

    const formik = useFormik({
  initialValues: {
    UserId: '',
    UserName: '',
    Password: '',
    Email: '',
    Mobile: ''
  },
  onSubmit: async (user, { resetForm }) => {
    // ✅ Check OTPs first
    if (!emailVerified || !mobileVerified) {
      alert('Please verify your Email and Mobile before Registering');
      return;
    }

    try {
      // ✅ Save user in backend
      await axios.post(`https://video-library-react-4.onrender.com/register-user`, user);

      // ✅ Success message
      setSuccessMessage('Registration successful! ✅');

      // ✅ Reset form fields
      resetForm();

      // ✅ Reset OTP states
      setEmail('');
      setMobile('');
      setEmailOtp('');
      setMobileOtp('');
      setEmailOtpSent(false);
      setMobileOtpSent(false);
      setEmailVerified(false);
      setMobileVerified(false);
      setEmailExpired(false);
      setMobileExpired(false);
      setEmailMessage('');
      setMobileMessage('');

      // ✅ Navigate after short delay (so message shows)
      setTimeout(() => {
        navigate('/user-login');
      }, 1500);

    } catch (error) {
      alert('Something went wrong during registration');
    }
  },
  validationSchema: yup.object({
    UserId: yup.string().required('UserId is required').min(6, 'UserId must be at least 6 chars').max(15, 'UserId must be less than 15 chars'),
    UserName: yup.string().required('UserName is required').min(4, 'Too short').max(10, 'Too long'),
    Password: yup.string().required('Password is required').min(8, 'Password too short').max(16, 'Password too long'),
    Email: yup.string().required('Email is required').email('Invalid Email address'),
    Mobile: yup.string().required('Mobile is required').matches(/^[6-9]\d{9}$/, 'Invalid Mobile Number')
  })
});

const sendEmailOtp = async () => {
    try {
        await axios.post('https://video-library-react-4.onrender.com/send-email-otp', { email });
        setEmailOtpSent(true);
        setEmailMessage('OTP sent to your email.');
        setEmailMessageColor('green');
        setEmailExpired(false);
        setEmailOtpTimeRemaining(90);
    } catch (error) {
        setEmailMessage('Failed to send OTP to email.');
        setEmailMessageColor('red');
    }
};
const verifyEmailOtp = async () => {
    if (emailExpired) {
        setEmailMessage('Email OTP expired. Please request a new OTP.');
        setEmailMessageColor('red');
        return;
    }
    try {
        const res = await axios.post('https://video-library-react-4.onrender.com/verify-email-otp', { email, otp: emailOtp });
        setEmailVerified(true);
        setEmailMessage(res.data.message);
        setEmailMessageColor('green');
    } catch (error) {
        setEmailMessage('Invalid Email OTP.');
        setEmailMessageColor('red');
    }
};
const sendMobileOtp = async () => {
    if (!emailVerified) return;
    try {
        await axios.post('https://video-library-react-4.onrender.com/send-mobile-otp', { mobile });
        setMobileOtpSent(true);
        setMobileMessage('OTP sent to your mobile number.');
        setMobileMessageColor('green');
        setMobileExpired(false);
        setMobileOtpTimeRemaining(90);
    } catch (error) {
        setMobileMessage('Failed to send OTP to mobile.');
        setMobileMessageColor('red');
    }
};
const verifyMobileOtp = async () => {
    if (mobileExpired) {
        setMobileMessage('Mobile OTP expired. Please request a new OTP.');
        setMobileMessageColor('red');
        return;
    }
    try {
        const res = await axios.post('https://video-library-react-4.onrender.com/verify-mobile-otp', { mobile, otp: mobileOtp });
        setMobileVerified(true);
        setMobileMessage(res.data.message);
        setMobileMessageColor('green');
    } catch (error) {
        setMobileMessage('Invalid Mobile OTP.');
        setMobileMessageColor('red');
    }
};
useEffect(() => {
    let timer;
    if (emailOtpSent && emailOtpTimeRemaining > 0 && !emailVerified) {
        timer = setInterval(() => {
            setEmailOtpTimeRemaining(prev => prev - 1);
        }, 1000);
    } else if (emailOtpTimeRemaining === 0 && emailOtpSent && !emailVerified) {
        setEmailExpired(true);
    }
    return () => clearInterval(timer);
}, [emailOtpSent, emailOtpTimeRemaining, emailVerified]);

// Mobile OTP countdown
useEffect(() => {
    let timer;
    if (mobileOtpSent && mobileOtpTimeRemaining > 0 && !mobileVerified) {
        timer = setInterval(() => {
            setMobileOtpTimeRemaining(prev => prev - 1);
        }, 1000);
    } else if (mobileOtpTimeRemaining === 0 && mobileOtpSent && !mobileVerified) {
        setMobileExpired(true);
    }
    return () => clearInterval(timer);
}, [mobileOtpSent, mobileOtpTimeRemaining, mobileVerified]);

return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '1rem' }}>
        <div className="bg-light p-4 w-100 shadow rounded" style={{ maxWidth: '420px' }}>
            <h3 className="bi bi-person"> Register User</h3>
            <form onSubmit={formik.handleSubmit} className="overflow-auto" >
                <dl>
                    <dt>UserId</dt>
                    <dd><TextField fullWidth variant="standard" label="Your UserId" name="UserId" onChange={formik.handleChange}
                        error={formik.touched.UserId && Boolean(formik.errors.UserId)} helperText={formik.touched.UserId && formik.errors.UserId}
                    /></dd>
                    <dt>UserName</dt>
                    <dd><TextField fullWidth variant="standard" label="Your UserName" type="text" name="UserName" onChange={formik.handleChange}
                        error={formik.touched.UserName && Boolean(formik.errors.UserName)} helperText={formik.touched.UserName && formik.errors.UserName}
                    /></dd>

                    <dt>Password</dt>
                    <dd><TextField fullWidth type="password" label="Your Password" variant="standard" name="Password" onChange={formik.handleChange}
                        error={formik.touched.Password && Boolean(formik.errors.Password)} helperText={formik.touched.Password && formik.errors.Password}
                    /></dd>

                    <dt>Email</dt>
                    <dd><TextField fullWidth type="email" label="Enter Your EMail" variant="standard" name="Email"
                        onChange={(e) => {
                            formik.handleChange(e);
                            setEmail(e.target.value);
                        }}
                        error={formik.touched.Email && Boolean(formik.errors.Email)} helperText={formik.touched.Email && formik.errors.Email}
                    /></dd>
                    <Button variant="outlined" type="button" onClick={sendEmailOtp} style={{ color: "#000", transition: 'all 0.3s ease' }} >Send Otp</Button>

                    {emailOtpSent && !emailExpired && !emailVerified && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter Email OTP"
                                className="form-control w-50"
                                value={emailOtp}
                                onChange={e => setEmailOtp(e.target.value)}
                            />
                            <button
                                onClick={verifyEmailOtp}
                                type="button"
                                className="btn btn-sm my-1"
                                style={{ backgroundColor: "#04446e", color: "#d6e8f3" }}
                            >
                                Verify Email OTP
                            </button>
                            <p style={{ color: 'orange' }}>
                                Time remaining: {Math.floor(emailOtpTimeRemaining / 60)}:{(emailOtpTimeRemaining % 60).toString().padStart(2, '0')}
                            </p>
                        </>
                    )}

                    {emailVerified ? (
                        <p style={{ color: 'green', fontWeight: 'bold' }}>Email verified successfully ✅</p>
                    ) : emailExpired ? (
                        <p style={{ color: 'red', fontWeight: 'bold' }}>Email OTP expired. Please request a new OTP.</p>
                    ) : (
                        emailOtpSent && emailMessage && (
                            <p style={{ color: emailMessageColor, fontWeight: 'bold' }}>{emailMessage}</p>
                        )
                    )}


                    <dt>Mobile</dt>
                    <dd><TextField fullWidth type="mobile" label="Enter Your Mobile" variant="standard" name="Mobile" onChange={(e) => {
                        formik.handleChange(e);
                        setMobile(e.target.value)
                    }}
                        error={formik.touched.Mobile && Boolean(formik.errors.Mobile)} helperText={formik.touched.Mobile && formik.errors.Mobile}
                    /></dd>
                    <Button variant="outlined" className="btn btn-outline-primary"
                        onClick={sendMobileOtp}
                        type="button"
                        disabled={!emailVerified}
                        style={{ color: "#000", transition: 'all 0.3s ease' }}
                    >Send Otp</Button>

                    {mobileOtpSent && !mobileExpired && !mobileVerified && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter Mobile OTP"
                                className="form-control w-50"
                                value={mobileOtp}
                                onChange={e => setMobileOtp(e.target.value)}
                            />
                            <button
                                onClick={verifyMobileOtp}
                                type="button"
                                className="btn btn-sm my-1"
                                style={{ backgroundColor: "#04446e", color: "#d6e8f3" }}
                            >
                                Verify Mobile OTP
                            </button>
                            <p style={{ color: 'orange' }}>
                                Time remaining: {Math.floor(mobileOtpTimeRemaining / 60)}:{(mobileOtpTimeRemaining % 60).toString().padStart(2, '0')}
                            </p>
                        </>
                    )}

                    {mobileVerified ? (
                        <p style={{ color: 'green', fontWeight: 'bold' }}> Mobile verified successfully ✅</p>
                    ) : mobileExpired ? (
                        <p style={{ color: 'red', fontWeight: 'bold' }}> Mobile OTP expired. Please request a new OTP.</p>
                    ) : (
                        mobileOtpSent && mobileMessage && (
                            <p style={{ color: mobileMessageColor, fontWeight: 'bold' }}>{mobileMessage}</p>
                        )
                    )}


                </dl>
                <Button
                    type="submit"
                    variant="outlined"
                    className="btn btn-warning w-100"

                >Register
                </Button>

                {successMessage && (
                    <div style={{ color: 'green', fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>
                        {successMessage}
                    </div>
                )}

                <div className="my-3">
                    <Link to='/user-login'> Already Registered? </Link>
                </div>
                <div>
                    <Link to='/admin-login'> Admin Login </Link>
                </div>
            </form>
        </div>
    </div>
)
}
