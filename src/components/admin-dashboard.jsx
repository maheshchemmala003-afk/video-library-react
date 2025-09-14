import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export function AdminDash(){

    const [videos , setVideos] = useState([{VideoId:0, Title:'',Url:'' ,Description:'',Likes:0,Dislikes:0,Views:'',CategoryId:0,Comments:['']}])

    useEffect(()=>{
        axios.get(`https://video-library-react-4.onrender.com/get-videos`)
        .then(response=>{
            setVideos(response.data);
        })
    },[])

    return(
        <div className="text-center p-3 bg-light m-3 rounded">
            <h3 className="text-danger">Admin Dashboard</h3>
           <Link to='/add-video' className="btn btn-primary bi bi-camera-video my-2"> Add Video </Link>
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Preview</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                           videos.map(video => (
                            <tr key={video.VideoId}>
                                <td>{video.Title}</td>
                                <td>
                                   <iframe src={video.Url} width="200" height="100" ></iframe>
                                </td>
                                <td>
                                    <Link to={`/edit-video/${video.VideoId}`} className="btn btn-sm bi-pen-fill btn-primary me-2" > Edit</Link>
                                    <Link to={`/delete-video/${video.VideoId}`} className="btn btn-sm bi bi-trash-fill btn-danger"> Delete</Link>
                                </td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
                <div><Link to="/" >Back to Home</Link></div>
            </div>
        </div>
    )
}
