import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from 'yup';

export function AdminLogin() {

    let navigate = useNavigate();

    const formik =useFormik({
        initialValues:{
            UserId : '',
            Password:''
        },
        onSubmit: (admin)=>{
            axios.get(`http://127.0.0.1:5000/get-admin`)
           .then(response=>{
                var user = response.data.find(item=> item.UserId === admin.UserId);
                if(user){
                    if(admin.Password === user.Password){
                        navigate('/admin-dash');
                    }else{
                        alert('Invalid Password');
                    }
                }else{
                    alert('Invalid User Id');
                }
           })
        },
        validationSchema:yup.object({
            UserId:yup.string().required('UserId is required').min(4,'too short -min 4 chars ').max(15,'too long - max 15 chars only'),
            Password:yup.string().required('Password is required').min(4,'too short - it should be min 4 chars ').max(10,'password is long - it should not be greater than 10 chars')
        })
    })
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh',padding: '1rem' }}>
            <div className="bg-light p-4 w-100 rounded" style={{ maxWidth: '400px' }}>
                <h3 className=" text-center bi bi-person-fill mb-3" > Admin Login</h3>
                <form onSubmit={formik.handleSubmit}>
                    <dl>
                        <dt>Admin Id</dt>
                        <dd> <TextField type="text" variant="standard" label="Enter Admin Id" name="UserId" onChange={formik.handleChange} className="form-control" /> </dd>
                        <dd className="text-danger" > {formik.errors.UserId} </dd>
                        <dt>Password</dt>
                        <dd> <TextField type="password" variant="standard" label="Enter Your Password" name="Password" onChange={formik.handleChange}  className="form-control" /> </dd>
                        <dd className="text-danger" > {formik.errors.Password} </dd>
                    </dl>
                    <Button variant="outlined" className="btn btn-danger w-100" type="submit" > Login </Button>
                    <Link to="/" className="btn btn-link"> Back to Home </Link>
                </form>
            </div>
        </div>
    )
}
