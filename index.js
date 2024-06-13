const express=require('express')
const app=express()
const mongoodb=require('./db')
mongoodb()
const abc=require("./Routes/Createuser")
const cors=require('cors')
//console.log(app);

app.use(cors(
    {
        origin:["https://justeatind-akshat-kumar-guptas-projects.vercel.app"],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization', 
        credentials:true
    }
))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://justeatind-akshat-kumar-guptas-projects.vercel.app"); // Allow requests from any origin
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ); // Allow specified methods
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    ); // Allow specified headers
    next();
});



app.get('/funny',(req,res)=>{
    res.send('Hahahaha')
})
app.use(express.json())       ////Its used to make available json format input taken from client side(thunderclient/postman) into req.body;
app.use('/api',abc)
app.use('/api',require('./Routes/Displaydata')); 
app.use('/api',require('./Routes/OrderData'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});