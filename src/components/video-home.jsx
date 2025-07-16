import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import MobileNumberInput from "./mobilenumberinput";
import OTPVerify from "./OTPVerify";
import { useState } from "react";
import axios from "axios";
import OTPFlow from "./OTPFlow";

const categories = [
    { name: "Technology", icon: "💻" },
    { name: "Education", icon: "📚" },
    { name: "Entertainment", icon: "🎭" },
    { name: "Sports", icon: "⚽" },
];

const featuredVideos = [
    { id: 1, title: "AI in 2025", thumbnail: "/images/AI.jpg" },
    { id: 2, title: "React Best Practices", thumbnail: "/images/react.jpg" },
];


export function VideoHome() {
    
    return (
        <div>
            {/* Carousel Section */}
            <div className="m-4">
                <div id="banners" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner rounded-3">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <div className={`carousel-item ${num === 1 ? "active" : ""}`} data-bs-interval="3000" key={num}>
                                <img src={`/images/slide-${num}.jpg`} className="w-100 d-block" alt={`slide ${num}`} height="400" />
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" data-bs-target="#banners" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon"></span>
                    </button>
                    <button className="carousel-control-next" data-bs-target="#banners" data-bs-slide="next">
                        <span className="carousel-control-next-icon"></span>
                    </button>
                    <div className="carousel-indicators">
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                            <button key={num} className={num === 0 ? "active" : ""} data-bs-slide-to={num} data-bs-target="#banners"></button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Login Section */}
            <div className="m-4 text-center d-flex justify-content-center align-items-center gap-3">
                <Link to="/admin-login" className="btn btn-outline-warning">Admin Login</Link>
                <Link to="/user-login" className="btn btn-outline-primary">User Login</Link>
            </div>

            {/* Categories Section */}
            <div className="p-4 text-center text-white">
                <h2 className="mb-3">Categories</h2>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                    {categories.map((category) => (
                        <div key={category.name} className="p-3 border rounded shadow-sm">
                            <span className="fs-3">{category.icon}</span>
                            <p className="mt-2 mb-0">{category.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Videos Section */}
            <div className="p-4 text-center">
                <h2 className="mb-3 text-white">Featured Videos</h2>
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                    {featuredVideos.map((video) => (
                        <div key={video.id} className="card shadow-sm" style={{ width: "18rem" }}>
                            <img src={video.thumbnail} height="150" className="card-img-top" alt={video.title} />
                            <div className="card-body text-center">
                                <h5 className="card-title">{video.title}</h5>
                                <PlayCircle className="text-primary" size={32}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
           
            {/* Footer */}
            <footer className="p-4 text-center text-light mt-4">
                <p>&copy; 2025 Video Library. All Rights Reserved.</p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/about" className="text-decoration-none">About</Link>
                    <Link to="/contact" className="text-decoration-none">Contact</Link>
                    <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
                </div>
            </footer>
            
        </div>
    );
}
