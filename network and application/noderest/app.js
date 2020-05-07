const express = require('express');

const app = express();
//const basicAuth = require('express-basic-auth');
//const morgan = require('morgan');
const bodyParser = require('body-parser'); 
var cors = require("cors");

//const mongoose = require('mongoose');
app.use(cors());

const routes = require('./api/routes/routes');


// mongoose.connect(
//     'mongodb+srv://apps:'
// +process.env.MONGO_ATLAS_PW+
// '@node-practise-avqsi.mongodb.net/',{dbName :'test'}
// );



//app.use(morgan('dev'));


// app.use(basicAuth({
//     users: { 'admin': 'supersecret' }
// }))
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


app.use('/',routes);
//app.use('/procurement',statusRoutes);
app.use((req,res,next)=>{
    res.status(200).json({
        message : 'It Works!'
    });
});

app.use((error,req,res,next) =>{
    res.status(error.status ||500);
    res.json({
        error : {
            message : error.message
        }
    });
});


module.exports= app;