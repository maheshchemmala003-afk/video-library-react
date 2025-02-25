import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export function AdminEditVideo(){

    const [categories, setCategories] = useState([]);
    const [videos , setVideos] = useState([{VideoId:0, Title:'',Url:'' ,Description:'',Likes:0,Dislikes:0,Views:'',CategoryId:0,Comments:[]}])

    let params = useParams();
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues:{
            VideoId : videos[0].VideoId,
            Title:videos[0].Title,
            Url:videos[0].Url,
            Description:videos[0].Description,
            Likes:videos[0].Likes,
            Dislikes:videos[0].Dislikes,
            Views:videos[0].Views,
            CategoryId:videos[0].CategoryId
            },
        onSubmit:(values)=>{
            axios.put(`http://127.0.0.1:5000/edit-video/${params.id}`,values)
            alert('video Edited Successfully...');
            navigate('/admin-dash');
        },
        enableReinitialize : true
    });

    function LoadCategories(){
        axios.get(`http://127.0.0.1:5000/get-categories`)
        .then(response=>{
            response.data.unshift({
                CategoryId: -1,
                CategoryName: 'Select an Category'
            })
            setCategories(response.data);
        })
       
    }

    useEffect(()=>{
        LoadCategories();
        axios.get(`http://127.0.0.1:5000/get-video/${params.id}`)
        .then(response=>{
            setVideos(response.data);
        })
    },[])

    return(
        <div className="m-3 p-3 bg-light w-25">
            <h3>Edit Video</h3>
            <form onSubmit={formik.handleSubmit} style={{height:'400px'}} className="overflow-auto" >
                <dl>
                    <dt>VideoId</dt>
                    <dd> <input type="number" value={formik.values.VideoId} onChange={formik.handleChange} name="VideoId"  className="form-control"  /> </dd>
                    <dt>Title</dt>
                    <dd> <input type="text" value={formik.values.Title}  onChange={formik.handleChange} name="Title"  className="form-control" /> </dd>
                    <dt>Url</dt>
                    <dd> <input type="text" value={formik.values.Url}  onChange={formik.handleChange} name="Url"  className="form-control" /> </dd>
                    <dt>Description</dt>
                    <dd> <input type="text" value={formik.values.Description}  onChange={formik.handleChange} name="Description"  className="form-control" /> </dd>
                    <dt>Likes</dt>
                    <dd><input type="number" value={formik.values.Likes}  onChange={formik.handleChange} name="Likes"   className="form-control" /></dd>
                    <dt> Dislikes</dt>
                    <dd> <input type="number" value={formik.values.Dislikes}  onChange={formik.handleChange} name="Dislikes"  className="form-control" /> </dd>
                    <dt>Views</dt>
                    <dd><input type="number" value={formik.values.Views} onChange={formik.handleChange} name="Views"   className="form-control" /></dd>
                    <dt> Category </dt>
                    <dd>
                        <select value={formik.values.CategoryId}  className="form-select" onChange={formik.handleChange} name="CategoryId" >
                           {
                            categories.map(category=>
                                <option key={category.CategoryId} value={category.CategoryId} > {category.CategoryName} </option>
                            )
                            }
                        </select>
                    </dd>
                </dl>
                <button className="btn btn-success me-2" > Save Video </button>
                <Link to='/admin-dash' className="btn btn-danger">Cancel</Link>

            </form>
        </div>
    )
}