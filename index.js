const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const vendorRoutes = require('./routes/vendorRoutes')
const bodyParser = require('body-parser');
const frimRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path')

const app = express();
dotenv.config();
app.use(cors())
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("DB connected successfully"))
.catch((err)=>console.log(err))

app.use(bodyParser.json())
app.use('/vendor',vendorRoutes);
app.use('/firm',frimRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`);

})
app.use('/',(req,res)=>{
    res.send("<h1> This is welcome Page")
})
