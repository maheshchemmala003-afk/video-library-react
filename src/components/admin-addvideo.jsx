import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function AdminAddVideo(){

    const [ categories, setCategories] =useState([{CategoryId:0, CategoryName :''}])
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues:{
            VideoId:0,
            Title:'',
            Url:'',
            Description:'',
            Likes:0,
            Dislikes:0,
            Views:0,
            CategoryId:0,
            Comments:['']
        },
        onSubmit : (video)=>{
            axios.post(`http://127.0.0.1:5000/add-video`,video)
                alert("video Added successfully")
                navigate('/admin-dash')
        }
    })
    function LoadCategories(){
        axios.get(`http://127.0.0.1:5000/get-categories`)
        .then(response=>{
            response.data.unshift({
                CategoryId : -1,
                CategoryName : 'Select an Category'
            })
            setCategories(response.data)
        })
    }
    useEffect(()=>{
        LoadCategories();
    },[])

    return(
        <div className="m-3 p-3 bg-light w-25">
            <h3>Add Video</h3>
            <form onSubmit={formik.handleSubmit} style={{height:'400px'}} className="overflow-auto" >
                <dl>
                    <dt>VideoId</dt>
                    <dd> <input type="number" name="VideoId" onChange={formik.handleChange} className="form-control"  /> </dd>
                    <dt>Title</dt>
                    <dd> <input type="text" name="Title" onChange={formik.handleChange} className="form-control" /> </dd>
                    <dt>Url</dt>
                    <dd> <input type="text" name="Url" onChange={formik.handleChange} className="form-control" /> </dd>
                    <dt>Description</dt>
                    <dd> <input type="text" name="Description" onChange={formik.handleChange} className="form-control" /> </dd>
                    <dt>Likes</dt>
                    <dd><input type="number" name="Likes" onChange={formik.handleChange}  className="form-control" /></dd>
                    <dt> Dislikes</dt>
                    <dd> <input type="number" name="Dislikes" onChange={formik.handleChange} className="form-control" /> </dd>
                    <dt>Views</dt>
                    <dd><input type="number" name="Views" onChange={formik.handleChange}  className="form-control" /></dd>
                    <dt> Category </dt>
                    <dd>
                        <select className="form-control" name="CategoryId" onChange={formik.handleChange}>
                           {
                            categories.map(category =>
                                 <option key={category.CategoryId} value={category.CategoryId}> {category.CategoryName} </option>
                                )
                           }
                        </select>
                    </dd>
                </dl>
                <button className="btn btn-success me-2">Add Video</button>
                <Link to={'/admin-dash'} className="btn btn-danger" > Cancel </Link>
            </form>
            
        </div>
    )
}