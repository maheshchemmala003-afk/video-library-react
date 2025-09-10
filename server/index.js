var mongoClient = require('mongodb').MongoClient;

var express = require('express');

var cors = require('cors');
var app = express();
app.use(cors());

app.use(express.urlencoded({extended:true}));
app.use(express.json());

var connectionString = "mongodb://127.0.0.1:27017";
app.get('/get-admin',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database =  connectionObject.db("videodb");
        database.collection("tbladmin").find({}).toArray().then((docs=>{
            res.send(docs);
            res.end();
        }))
    })
});

app.get('/get-videos',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");
        database.collection("tblvideos").find({}).toArray().then((docs=>{
            res.send(docs);
            res.end();
        }));
    });
});
app.get('/get-categories',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");
        database.collection("tblcategories").find({}).toArray().then((docs=>{
            res.send(docs);
            res.end();
        }));
    });
});
app.get('/get-users',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");
        database.collection("tblusers").find({}).toArray().then((docs=>{
            res.send(docs);
            res.end();
        }));
    });
});

app.get('/get-user/:Userid',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");
        database.collection("tblusers").find({UserId:req.params.Userid}).toArray().then(docs=>{
            res.send(docs);
            res.end();
        });
    });
});

app.get('/get-video/:id',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");
        database.collection("tblvideos").find({VideoId:parseInt(req.params.id)}).toArray().then(docs=>{
            res.send(docs);
            res.end();
        });
    });
});

app.get('/filter-video/:categoryid',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");
        database.collection("tblvideos").find({CategoryId:parseInt(req.params.categoryid)}).toArray().then(docs=>{
            res.send(docs);
            res.end();
        });
    });
});

app.post('/register-user',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");

        var user = {
            UserId : req.body.UserId,
            UserName: req.body.UserName,
            Password: req.body.Password,
            Email: req.body.Email,
            Mobile: req.body.Mobile
        }

        database.collection("tblusers").insertOne(user).then(()=>{
            console.log("User Registered Successfully...")
            res.end();
        });
    });
});

app.post('/add-video',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
    
        var database = connectionObject.db("videodb");

        var video = {
            VideoId : parseInt(req.body.VideoId),
            Title : req.body.Title,
            Url : req.body.Url,
            Description : req.body.Description,
            Likes : parseInt(req.body.Likes),
            Dislikes : parseInt(req.body.Dislikes),
            Views : parseInt(req.body.Views),
            CategoryId : parseInt(req.body.CategoryId),
            Comments : [req.body.Comments]
        }
        database.collection("tblvideos").insertOne(video).then(()=>{
            console.log("Video Added Successfully...");
            res.end();
        });
    });
});

app.post('/add-category',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");

        var category = {
            CategoryId : parseInt(req.body.CategoryId),
            CategoryName : req.body.CategoryName
        }
        database.collection("tblcategories").insertOne(category).then(()=>{
            console.log("Category Added Successfully...");
            res.end();
        });
    });
});

app.put('/edit-video/:id',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");

        var video = {
            VideoId : parseInt(req.body.VideoId),
            Title : req.body.Title,
            Url : req.body.Url,
            Description : req.body.Description,
            Likes : parseInt(req.body.Likes),
            Dislikes : parseInt(req.body.Dislikes),
            Views : parseInt(req.body.Views),
            CategoryId : parseInt(req.body.CategoryId),
            Comments : [req.body.Comments]
        }

        database.collection("tblvideos").updateOne({VideoId:parseInt(req.params.id)},{$set:video}).then(()=>{
            console.log("Video Updated Successfully...");
            res.end();
        });
    });
});

app.put('/edit-category/:id',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");

        var category = {
            CategoryId : parseInt(req.body.CategoryId),
            CategoryName : req.body.CategoryName
        }

        database.collection("tblcategories").updateOne({CategoryId:parseInt(req.params.id)},{$set:category}).then(()=>{
            console.log("Category Updated Successfully...");
        });
    });
 });

 app.delete('/delete-category/:id',(req,res)=>{
    mongoClient.connect(connectionString).then((connectionObject)=>{
        var database = connectionObject.db("videodb");

        database.collection("tblcategories").deleteOne({CategoryId:parseInt(req.params.id)}).then(()=>{
            console.log("Category Deleted Successfully...");
            res.end();
        })
 })
 });
 app.delete("/delete-video/:id", (req, res)=>{
    mongoClient.connect(connectionString).then(connectionObject=>{
        var database = connectionObject.db("videodb");

        database.collection("tblvideos").deleteOne({VideoId:parseInt(req.params.id)})
        .then(()=>{
            console.log("Video Deleted.");
            res.end();
        })

    })
})

const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

// OTP Stores
let emailOtpStore = {};   // Email => OTP
let mobileOtpStore = {};  // Mobile => OTP

// Email transporter config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Twilio client config
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Helper to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 📩 Send Email OTP
app.post('/send-email-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  emailOtpStore[email] = otp;

  try {
    await transporter.sendMail({
      from: `"OTP Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Email OTP Code',
      text: `Your OTP is ${otp}`,
    });
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP to email' });
  }
});

app.post('/send-mobile-otp', async (req, res) => {
  const { mobile } = req.body;
  const otp = generateOTP();
  mobileOtpStore[mobile] = otp;

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobile}`, // Assuming Indian numbers
    });
    res.json({ success: true, message: 'OTP sent to mobile' });
  } catch (error) {
    console.error('Mobile send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP to mobile' });
  }
});
// Express Backend - verifyOTP.js
// ✅ Verify Email OTP
app.post('/verify-email-otp', (req, res) => {
  const { email, otp } = req.body;
  const validOtp = emailOtpStore[email];

  if (otp === validOtp) {
    delete emailOtpStore[email];
    res.json({ success: true, message: 'Email OTP Verified Successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid Email OTP' });
  }
});

// ✅ Verify Mobile OTP
app.post('/verify-mobile-otp', (req, res) => {
  const { mobile, otp } = req.body;
  const validOtp = mobileOtpStore[mobile];

  if (otp === validOtp) {
    delete mobileOtpStore[mobile];
    res.json({ success: true, message: 'Mobile OTP Verified Successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid Mobile OTP' });
  }
});
// 👍 Like Update Route
app.post("/update-like", (req, res) => {
    const { VideoId, action } = req.body;
    mongoClient.connect(connectionString).then((connectionObject) => {
        const db = connectionObject.db("videodb");

        db.collection("tblvideos").updateOne(
            { VideoId: parseInt(VideoId) },
            { $inc: { Likes: action === "increment" ? 1 : -1 } }
        ).then(() => {
            console.log("Likes updated successfully");
            res.json({ success: true });
        }).catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: "Failed to update likes" });
        });
    });
});

// 👎 Dislike Update Route
app.post("/update-dislike", (req, res) => {
    const { VideoId, action } = req.body;
    mongoClient.connect(connectionString).then((connectionObject) => {
        const db = connectionObject.db("videodb");

        db.collection("tblvideos").updateOne(
            { VideoId: parseInt(VideoId) },
            { $inc: { Dislikes: action === "increment" ? 1 : -1 } }
        ).then(() => {
            console.log("Dislikes updated successfully");
            res.json({ success: true });
        }).catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: "Failed to update dislikes" });
        });
    });
});

// 🔍 Search Videos by Title
app.get("/search-videos/:query", (req, res) => {
    const query = req.params.query.toLowerCase();
    mongoClient.connect(connectionString).then((connectionObject) => {
        const db = connectionObject.db("videodb");

        db.collection("tblvideos").find({
            Title: { $regex: query, $options: "i" } // case-insensitive search
        }).toArray().then((docs) => {
            res.send(docs);
        }).catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: "Search failed" });
        });
    });
});


// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
