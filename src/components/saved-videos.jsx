import { useSelector, useDispatch } from "react-redux";
import { removeFromViewLater } from "../slicers/video-slicer";
import { Link } from "react-router-dom";
import { Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, Modal, Typography } from "@mui/material";
import { Email, Facebook, Share, ThumbDown, ThumbUp, Visibility,Link as LinkIcon } from "@mui/icons-material";
import axios from "axios";
import { useState } from "react";
import { updateVideo } from "../slicers/video-slicer";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import  FacebookIcon  from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";





export function SavedVideos() {
    const savedVideos = useSelector((state) => state.videos.savedVideos);
    const [videos, setVideos] = useState([]);
    const dispatch = useDispatch();
    const [ selectedVideo,setSelectedVideo] = useState(null)
    const[shareModalOpen, setShareModalOpen] = useState(false)
    function handleRemove(VideoId) {
        if (window.confirm("Are you sure you want to remove this video?")) {
            dispatch(removeFromViewLater(VideoId));
        }
    }
   function handleLike(video) {
    const isLiked = video.isLiked || false;

    axios
        .get(`https://video-library-react-4.onrender.com/get-video/${video.VideoId}?action=${isLiked ? "decrement" : "increment"}`)
        .then(() => {
            dispatch(updateVideo({
                VideoId: video.VideoId,
                Likes: isLiked ? video.Likes - 1 : video.Likes + 1,
                Dislikes: video.isDisliked ? video.Dislikes - 1 : video.Dislikes,
                isLiked: !isLiked,
                isDisliked: false,
            }));
        });
}

function handleDisLike(video) {
    const isDisliked = video.isDisliked || false;

    axios
        .get(`https://video-library-react-4.onrender.com/get-video/${video.VideoId}?action=${isDisliked ? "decrement" : "increment"}`)
        .then(() => {
            dispatch(updateVideo({
                VideoId: video.VideoId,
                Dislikes: isDisliked ? video.Dislikes - 1 : video.Dislikes + 1,
                Likes: video.isLiked ? video.Likes - 1 : video.Likes,
                isDisliked: !isDisliked,
                isLiked: false,
            }));
        });
}
function handleShareClick(video){
    setSelectedVideo(video);
    setShareModalOpen(true);
}
function copyToClipboard(url){
    navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard!");
    });
}
    return (
        <div className="bg-light p-4 m-3 rounded">
            <h2>Your Saved Videos</h2>
            <section className="mt-3 d-flex flex-wrap">
                {savedVideos.length === 0 ? (
                    <p>No saved videos yet. Start adding videos to your Watch Later list!</p>
                ) : (
                    savedVideos.map((video) => (
                        <Card key={video.VideoId} className="m-2 p-2" style={{ width: "280px" }}>
                            <CardHeader
                                title={
                                   <Typography variant="h6" noWrap sx={{fontSize:'1rem',fontWeight:'bold'}}>
                                    {video.Title}
                                   </Typography>
                                }
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
                                <IconButton className={`fs-6 ${video.isLiked ? "text-danger" : ""} `} onClick={()=>handleLike(video)} > <ThumbUp /> {video.Likes} </IconButton>
                                <IconButton className={`fs-6 ${video.isDisliked ? "text-danger" : ""} `} onClick={()=>handleDisLike(video)} > <ThumbDown /> {video.Dislikes} </IconButton>
                                <IconButton onClick={()=>handleShareClick(video)} > <Share/> </IconButton>
                                </div>
                                <Button 
                                    onClick={() => handleRemove(video.VideoId)}
                                    sx={{mt:3}}
                                    variant="contained" color="secondary"
                                    >
                                    Remove video
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                )}
            </section>
            <div>
                <Link to={"/user-dash"}>Back to Dashboard</Link>
            </div>
            <Modal open={shareModalOpen} onClose={()=>setShareModalOpen(false)} >
                <Box sx={{width:300, bgcolor:"white",p:3,borderRadius:2,mx:"auto",mt:10}} >
                    <Typography variant="h5" >Share Video</Typography>
                    {
                        selectedVideo && (
                            <div>
                                <IconButton onClick={()=>window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedVideo.Title + " " + selectedVideo.Url )}`,"_blank")} >
                                    <WhatsAppIcon sx={{color:"green"}} />
                                </IconButton>
                                <IconButton onClick={()=>window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedVideo.Url)}`, "_blank")} >
                                    <FacebookIcon sx={{color:"blue"}} />
                                </IconButton>
                                <IconButton onClick={()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedVideo.Title)}&url=${encodeURIComponent(selectedVideo.Url)}`, "_blank")} >
                                    <TwitterIcon sx={{color:"skyblue"}} />
                                </IconButton>
                                <IconButton onClick={()=>window.open(`https://www.instagram.com/?url=${encodeURIComponent(selectedVideo.Url)}`, "_blank")} >
                                    <InstagramIcon sx={{color:"purple"}} />
                                </IconButton>
                                <IconButton onClick={() => window.location.href = `mailto:?subject=Check this out!&body=${encodeURIComponent(selectedVideo.Title + " " + selectedVideo.Url)}`} >
                                    <Email sx={{color:"red"}} />   
                                </IconButton>
                                <IconButton onClick={()=> copyToClipboard(selectedVideo.Url)} >
                                    <LinkIcon />
                                </IconButton>
                            </div>
                        )
                    }
                    <Button onClick={() => setShareModalOpen(false)} variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
