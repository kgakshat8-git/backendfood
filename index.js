const express = require('express');
const app = express();
const mongoodb = require('./db');
mongoodb();
const abc = require("./Routes/Createuser");
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library'); // being used for g-verification
require('dotenv').config();
const User=require('./models/User');
const jwt=require("jsonwebtoken")
const stripe =require('stripe') (process.env.STRIPE_KEY) //used for payment
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwtSecret="Hello its my first Mern Stack Project" 
const bodyParser = require('body-parser');

const CLIENT_ID = process.env.CLIENT_ID; 
const client = new OAuth2Client(CLIENT_ID);
console.log(client)

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // * Allows requests from any origin
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ); 
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    ); 
    next();
});

app.get('/', (req, res) => {
    res.send('BLANK');
});

app.get('/funny', (req, res) => {
    res.send('Hahahaha');
});

app.use(express.json()); // Make JSON format input available in req.body
app.use('/api',abc);
app.use('/api', require('./Routes/Displaydata'));
app.use('/api', require('./Routes/OrderData'));

// New route for Google authentication
app.post('/api/auth/google', async (req, res) => {
    const { tokenId } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        console.log('Google Sign-In Success:', payload);
        
        let gmail=payload.email;
        console.log(payload.email);
        let gmaildata= await User.findOne({email:gmail});
        if(!gmaildata){
            try{
                await User.create({
                     name:payload.name,
                     email:gmail,
                     password:"default",
                     location:"Default",
                 })
                 console.log("naya gmail hai");
                 res.json({ success: true});
         
                 }
             catch(err){
             console.log(err);
             res.json({success:"gadbadgoogle"})
             }
        }
        else{
            console.log("pehle se hai");
                const data={
                user:{
                    id:gmaildata.id
                }
            }
            const authToken=jwt.sign(data,jwtSecret)
    
            //console.log(userData)
            res.json({success:false, authToken:authToken, mailid:gmail, name1:payload.given_name});
            }     
    } catch (error) {
        console.log('Google Sign-In Error:', error);
        res.status(401).json({ success: 'nhi', message: 'Invalid token' });
    }
});


app.post('/api/payment', async (req, res) => {
    const { totalamt, mailid } = req.body;

    try {
        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Paying to EatIndia',
                        },
                        unit_amount: totalamt * 100, // Stripe expects the amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://justeatind-akshat-kumar-guptas-projects.vercel.app/paymentsuccess',
            cancel_url: 'https://justeatind-akshat-kumar-guptas-projects.vercel.app/paymentfailed',
            customer_email: mailid,
            metadata: { mailid }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.log('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});
app.use('/api',require('./Routes/Mailclient'))


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
