import { Link } from "react-router-dom";


export function VideoHome(){
    return(
        <div className="d-flex justify-content-center align-items-center" style={{height:'100vh'}}>
            <Link to="/admin-login" className="btn btn-danger me-2" > Admin Login </Link> 
            <Link to="/user-login" className="btn btn-warning" > User Login </Link>
        </div>
    )
}