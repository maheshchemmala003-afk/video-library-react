import { TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from 'yup';

export function UserRegister(){

    let navigate = useNavigate();

    const formik = useFormik({
       initialValues:{
        UserId : '',
        UserName :'',
        Password : '',
        Email:'',
        Mobile:''
       },
       onSubmit:(user)=>{
        axios.post(`http://127.0.0.1:5000/register-user`,user);
        alert('Registered User Succesfully..')
        navigate('/user-login');
       },
       validationSchema:yup.object({
        UserId: yup.string().required('UserId is required').min(6,'userId is not less than 6 chars').max(15,'userId is too long - it should be less than 15 chars '),
        UserName : yup.string().required('UserName is required').min(4,'too short').max(10,'too long'),
        Password: yup.string().required('Password is required').min(8,'password is short').max(16,'password is long'),
        Email:yup.string().required('Email is required').email('Invalid Email address'),
        Mobile:yup.string().required('Mobile is required').matches(/\+91\d{10}/,'Invalid Password')
       })
    })

    return(
        <div className="bg-light p-4 m-4 w-25 rounded">
            <h3>Register User</h3>
            <form onSubmit={formik.handleSubmit} style={{height:'400px'}} className="overflow-auto" >
                <dl>
                    <dt>UserId</dt>
                    <dd><TextField variant="standard" label="Your UserId" type="text" name="UserId" onChange={formik.handleChange} className="form-control" /></dd>
                    <dd className="text-danger" > {formik.errors.UserId} </dd>
                    <dt>UserName</dt>
                    <dd><TextField variant="standard" label="Your UserName" type="text" name="UserName" onChange={formik.handleChange} className="form-control" /></dd>
                    <dd className="text-danger" > {formik.errors.UserName} </dd>
                    <dt>Password</dt>
                    <dd><TextField type="password" label="Your Password" variant="standard" name="Password" onChange={formik.handleChange} className="form-control" /></dd>
                    <dd className="text-danger" > {formik.errors.Password} </dd>
                    <dt>Email</dt>
                    <dd><TextField type="email" label="Enter Your EMail" variant="standard" name="Email" onChange={formik.handleChange} className="form-control" /></dd>
                    <dd className="text-danger" > {formik.errors.Email} </dd>
                    <dt>Mobile</dt>
                    <dd><TextField type="text" label="Enter Your Mobile" variant="standard" name="Mobile" onChange={formik.handleChange} className="form-control" /></dd>
                    <dd className="text-danger" > {formik.errors.Mobile} </dd>
                </dl>
                <button className="btn btn-primary">Register</button>
               <div className="my-3">
               <Link to='/user-login'> Existing User Login </Link>
               </div>
               <div>
               <Link to='/admin-login'> Admin Login </Link>
               </div>
            </form>
        </div>
    )
}