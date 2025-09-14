import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export function AdminDelVideo(){

    const [ videos , setVideos ] = useState([{VideoId:0, Title:'', Url:'', Description:'', Likes:0, Dislikes:0, Views:'', Comments:[''], CategoryId:0}])

    let params = useParams();
    let navigate = useNavigate();

    useEffect(()=>{
        axios.get(`https://video-library-react-4.onrender.com/get-video/${params.id}`)
        .then(response=>{
            setVideos(response.data)
        })
    },[]);

    function handleDelClick(){
        axios.delete(`https://video-library-react-4.onrender.com/delete-video/${params.id}`)
        navigate('/admin-dash');
    }

    return(
        <div className="bg-light p-2 m-4 w-25 rounded">
            <h4> Are You sure , You Want Delete ? </h4>
            <dl>
                <dt> Title </dt>
                <dd> {videos[0].Title} </dd>
                <dt>Description</dt>
                <dd> {videos[0].Description} </dd>
            </dl>
            <button onClick={handleDelClick} className="btn btn-danger me-2" > Yes </button>
            <Link to='/admin-dash' className="btn btn-warning" > No </Link>
        </div>
    )
}
