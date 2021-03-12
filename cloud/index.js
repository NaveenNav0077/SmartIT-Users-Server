const mongoose = require('mongoose');
require('dotenv').config();

try{
    mongoose.connect(
        process.env.DB_URL, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        },
        (err)=>{
            if(err){
                console.log('Cloud connection error');
            } else {
                console.log('Sucessfuly connected with cloud');
            }
        }
    );
}

catch(err){
    console.log(err);
}

module.exports = mongoose;