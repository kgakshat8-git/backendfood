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

const jwtSecret="Hello its my first Mern Stack Project" 

const CLIENT_ID = process.env.CLIENT_ID; 
const client = new OAuth2Client(CLIENT_ID);
console.log(client)

app.use(cors());
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
    res.header('Referrer-Policy', 'no-referrer-when-downgrade'); 
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


app.post('/api/payment', async(req,res)=>{
    const product = await stripe.products.create({
        name:"Paying to EatIndia"
    })

    if(product){
        var price = await stripe.prices.create({
            product:`${product.id}`,
            unit_amount:req.body.totalamt*100,
            currency:'inr'

        })
    }
    if(price.id){
        var session= await stripe.checkout.sessions.create({
            line_items:[
            {
                price:`${price.id}`,
                quantity:1
            }
            ],
            mode:'payment',
            success_url:'https://justeatind-akshat-kumar-guptas-projects.vercel.app/paymentsuccess',
            cancel_url:'https://justeatind-akshat-kumar-guptas-projects.vercel.app/paymentfailed',
            customer_email:req.body.mailid
        }

        )}
        res.json(session)

})

app.use('/api',require('./Routes/Mailclient'))


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
