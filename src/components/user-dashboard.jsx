import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToViewLater } from "../slicers/video-slicer";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Button,
    Modal,
    Box
} from "@mui/material";
import { ThumbUp, ThumbDown, Visibility, Share, Email, Link as LinkIcon } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

export function UserDashBoard() {
    const [cookie, setCookie, removeCookie] = useCookies(["username"]);
    const [videos, setVideos] = useState([]);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    let navigate = useNavigate();
    const dispatch = useDispatch();

    // Get VideosCount from Redux state
    const VideosCount = useSelector((state) => state.videos.VideosCount);

    useEffect(() => {
        axios.get(`https://video-library-react-4.onrender.com/get-videos`).then((response) => {
            setVideos(response.data);
        });
    }, [VideosCount]);

    function handleSignout() {
        removeCookie("username");
        navigate("/user-login");
    }

    function watchLaterClick(VideoId) {
        axios.get(`https://video-library-react-4.onrender.com/get-video/${VideoId}`).then((response) => {
            const video = response.data[0];
            alert(`${VideoId}\nVideo saved to Watch Later`);
            dispatch(addToViewLater(video));
        });
    }
    function handleLike(video) {
        const isLiked = video.isLiked || false;
        axios.get(`https://video-library-react-4.onrender.com/get-video/${video.VideoId}`, {
            VideoId: video.VideoId,
            action: isLiked ? "decrement" : "increment",
        }).then(() => {
            setVideos((prevVideos) =>
                prevVideos.map((v) =>
                    v.VideoId === video.VideoId
                        ? { ...v, Likes: isLiked ? v.Likes - 1 : v.Likes + 1, Dislikes: v.isDisliked ? v.Dislikes - 1 : v.Dislikes, isLiked: !isLiked, isDisliked: false }
                        : v
                )
            );
        });
    }

    function handleDisLike(video) {
        const isDisliked = video.isDisliked || false;
        axios.get(`https://video-library-react-4.onrender.com/get-video/${video.VideoId}`, {
            VideoId: video.VideoId,
            action: isDisliked ? "decrement" : "increment",
        }).then(() => {
            setVideos((prevVideos) =>
                prevVideos.map((v) =>
                    v.VideoId === video.VideoId
                        ? { ...v, Dislikes: isDisliked ? v.Dislikes - 1 : v.Dislikes + 1, Likes: v.isLiked ? v.Likes - 1 : v.Likes, isDisliked: !isDisliked, isLiked: false }
                        : v
                )
            );
        });
    }

    function handleShareClick(video) {
        setSelectedVideo(video);
        setShareModalOpen(true);
    }

    function copyToClipboard(url) {
        navigator.clipboard.writeText(url).then(() => {
            alert("Link copied to clipboard!");
        });
    }
    function handleSearchClick() {
        const video = document.getElementById("txtSearch").value.trim().toLowerCase();
    
        if (video === "") {
            // If search box is empty, reset to show all videos
            axios.get(`https://video-library-react-4.onrender.com/get-videos`)
                .then((response) => {
                    setVideos(response.data);
                })
                .catch(error => console.error("Error fetching videos:", error));
            return;
        }
    
        axios.get(`https://video-library-react-4.onrender.com/get-video/${video.Title}`)
            .then((response) => {
                setVideos(response.data);  // Update state with search results
            })
            .catch(error => console.error("Search error:", error));
    }
    return (
        <div className="bg-light p-4 m-4 rounded">
            <h3 className="d-flex justify-content-between">
                <div>
                    <span>{cookie["username"]}</span> <span> Dashboard </span>
                </div>
                {/* <div>
                <div className="input-group" >
                    <input type="text" placeholder="search the video" id="txtSearch" className="form-control" />
                    <button onClick={handleSearchClick} className="btn btn-warning bi bi-search " ></button>
                </div>
                </div> */}
                <div>
                    <span className="h5">Saved videos</span>
                    <Link to={"/saved-videos"} className="bg-success badge mx-2 text-decoration-none">
                        {VideosCount}
                    </Link>
                    <button onClick={handleSignout} className="btn btn-danger">
                        Sign Out
                    </button>
                </div>
            </h3>
            <div className="row">
                <div className="col-10">
                    <section className="mt-4 d-flex flex-wrap">
                        {videos.map((video) => (
                            <Card key={video.VideoId} className="m-2 p-2" style={{ width: "270px" }}>
                                <CardHeader
                                    title={<Typography variant="h6" noWrap sx={{ fontSize: "1rem", fontWeight: "bold" }}>{video.Title}</Typography>}
                                />
                                <CardContent>
                                    <iframe
                                        src={video.Url}
                                        style={{ width: "100%", height: "200px", border: "none" }}
                                        title={video.Title}
                                    />
                                </CardContent>
                                <CardActions className="d-flex flex-column align-items-start">
                                    <div>
                                        <IconButton className="fs-6"> <Visibility /> {video.Views} </IconButton>
                                        <IconButton className={`fs-6 ${video.isLiked ? "text-danger" : ""}`} onClick={() => handleLike(video)}><ThumbUp /> {video.Likes}</IconButton>
                                        <IconButton className={`fs-6 ${video.isDisliked ? "text-danger" : ""}`} onClick={() => handleDisLike(video)}><ThumbDown /> {video.Dislikes}</IconButton>
                                        <IconButton onClick={() => handleShareClick(video)}> <Share/> </IconButton>
                                    </div>
                                    <Button onClick={() => watchLaterClick(video.VideoId)} variant="contained" color="warning" fullWidth sx={{ mt: 2 }}>
                                        Watch Later
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </section>
                </div>
            </div>

            {/* Share Modal */}
            <Modal open={shareModalOpen} onClose={() => setShareModalOpen(false)}>
                <Box sx={{ width: 300, bgcolor: "white", p: 3, borderRadius: 2, mx: "auto", mt: 10 }}>
                    <Typography variant="h6">Share Video</Typography>
                    {selectedVideo && (
                        <div>
                            <IconButton onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedVideo.Title + " " + selectedVideo.Url)}`, "_blank")}>
                                <WhatsAppIcon sx={{ color: "green" }} />
                            </IconButton>
                            <IconButton onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedVideo.Url)}`, "_blank")}>
                                <FacebookIcon sx={{ color: "blue" }} />
                            </IconButton>
                            <IconButton onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedVideo.Title)}&url=${encodeURIComponent(selectedVideo.Url)}`, "_blank")}>
                                <TwitterIcon sx={{ color: "skyblue" }} />
                            </IconButton>
                            <IconButton onClick={() => window.open(`https://www.instagram.com/?url=${encodeURIComponent(selectedVideo.Url)}`, "_blank")}>
                                <InstagramIcon sx={{ color: "purple" }} />
                            </IconButton>
                            <IconButton onClick={() => window.location.href = `mailto:?subject=Check this out!&body=${encodeURIComponent(selectedVideo.Title + " " + selectedVideo.Url)}`}>
                                <Email sx={{ color: "red" }} />
                            </IconButton>
                            <IconButton onClick={() => copyToClipboard(selectedVideo.Url)}>
                                <LinkIcon />
                            </IconButton>
                        </div>
                    )}
                    <Button onClick={() => setShareModalOpen(false)} variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
