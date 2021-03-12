const jwt = require('jsonwebtoken');
const Response = require('./responseFunctions');

function VerifyUser(req,res,next){
    try{
        if(req.session.SmartIT===undefined){
            const bearerHeader = req.headers.authorization;
            if( bearerHeader !== undefined ){
                const bearerToken = bearerHeader.split(' ');
                const token = bearerToken[1];
                jwt.verify( token, process.env.SECRET_KEY, (err,result)=>{
                    if(err){
                        Response(res,400,'no-token','Error occured while verifying token','no-result',err);
                    }
                    if(result!==undefined){
                        next();
                    }
                })
            } else {
                Response(res,400,'no-token','Token not found','no-result','');
            }
        } else {
            jwt.verify( req.session.SmartIT.token, process.env.SECRET_KEY, (err,result)=>{
                if(err){
                    Response(res,400,'no-token','Token expired','no-result',err);
                }
                if(result!==undefined){
                    next();
                }
            })
        }   
    }
    catch(err){
        console.log(err)
    }
}

module.exports = VerifyUser ;