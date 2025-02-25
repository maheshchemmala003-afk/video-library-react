import { Password } from "@mui/icons-material";
import { TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import * as yup from 'yup';

export function UserLogin() {

    // const [users,setUsers] = useState([{UserId:'',UserName:'',Password:'',Email:'',Mobile:''}]);
    const[cookie , setCookie, removeCookie] = useCookies(['username']);
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues:{
            UserId:'',
            UserName:'',
            Password:'',
            Email:'',
            Mobile:''
        },
        onSubmit:(user)=>{
            axios.get(`http://127.0.0.1:5000/get-users`)
            .then(response=>{
                var result = response.data.find(item=>item.UserId===user.UserId);
                if(result){
                    if(result.Password===user.Password){
                        setCookie('username',result.UserName)
                        navigate('/user-dash')
                    }else{
                        alert('Invalid Password')
                    }
                }else{
                    alert('Invalid User Id');
                }
            })
        },
        validationSchema: yup.object({
            UserId: yup.string().required('UserId Is required').min(4,'userid should not be less than 4 chars').max(14,'userid is too long'),
            Password: yup.string().required('Password is required').min(6,'Password is short').max(15,'password is too long')
        })
    })

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="bg-light p-3 w-25 rounded">
                <h3 className="text-center bi bi-person-fill" >User Login</h3>
                <form onSubmit={formik.handleSubmit}>
                    <dl>
                        <dt>User Id</dt>
                        <dd> <TextField variant="standard" type="text" name="UserId" label="Enter Your UserId" onChange={formik.handleChange} className="form-control" /> </dd>
                        <dd className="text-danger" > {formik.errors.UserId} </dd>
                        <dt> Password </dt>
                        <dd> <TextField variant="standard" type="password" label="Enter Your Password" name="Password" onChange={formik.handleChange} className="form-control" /> </dd>
                        <dd className="text-danger" > {formik.errors.Password} </dd>
                    </dl>
                    <button type="submit" className="btn btn-warning w-100 mb-3"> Login </button>
                    <Link to='/user-register'>New User Register</Link>
                </form>
            </div>
        </div>
    )
}