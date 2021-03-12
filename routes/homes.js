const express = require('express');
const router = express.Router();
const User = require('../cloud/schemas/userSchema'); 
const { celebrate, Joi, errors } = require('celebrate');
const VerifyUser = require('../utils/jwtSession');
const Response = require('../utils/responseFunctions');
 
router.route('/')

.all((req,res,next)=>{
    next();
})

//Read all my homes 
.get(
    VerifyUser,
    async (req,res)=>{
    const { userId } = await req.body;
    User.findById({ _id:userId },async (err,result)=>{
        if(err){
            Response(res,400,'no-token','Error occured during getting all homes','no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                Response(res,200,'no-token','Home readed sucessfuly',result.homes,'');
            } else {
                Response(res,400,'no-token','No home found','no-result',err);
            }    
        }    
    });
})

//Create a new home
.post(
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            createHome:Joi.object().keys({
                homeName:Joi.string().required(),
                homeImage:Joi.string().allow("")
            })
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, createHome } = await req.body;
    User.findById({ _id:userId },async (err,result)=>{
        if(err){
            Response(res,400,'no-token','Error occured during creating homes','no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                const data = result.homes.filter((homes)=>homes.homeName===createHome.homeName);
                if(data.length===0){
                    result.homes.push(createHome);
                    result.save((err, result)=>{
                        if(err){
                            Response(res,400,'no-token','Error occured while creating new home','no-result',err);
                        } else {
                            Response(res,200,'no-token','Home created sucessfuly',result.homes,'');
                        }
                    });  
                } else {
                    Response(res,400,'no-token','Home name alredy exsist','no-result',err);
                }
            } else {
                Response(res,400,'no-token','No home found' ,'no-result',err);
            }     
        }   
    });
});

router.get(
    '/findOne',
    VerifyUser,
    async (req,res)=>{
    const { userId, homeId } = await req.body;
    User.findById({ _id:userId },async (err,result)=>{
        if(err){
            Response(res,400,'no-token','No user found' ,'no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                const data = await result.homes.id(homeId);
                if(data !== null){
                    Response(res,200,'no-token','Home found',data,'');
                } else {
                    Response(res,400,'no-token','No homes found' ,'no-result',err);
                }
            } else {
                Response(res,400,'no-token','No user found' ,'no-result',err);
            }    
        }    
    });
});

router.put(
    '/edit-name',
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            homeId:Joi.string().required(),
            homeName:Joi.string().required()
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, homeId, homeName } = await req.body;
    User.findById({ _id:userId },async (err,result)=>{
        if(err){
            Response(res,400,'no-token','No user found' ,'no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                const data = await result.homes.id(homeId);
                if(data !== null && data !== undefined){
                    result.homes.id(homeId).homeName = homeName;
                    result.save((err, result)=>{
                        if(err){
                          Response(res,400,'no-token','Error occured while editing home name' ,'no-result',err);
                        } else {
                            Response(res,200,'no-token','Home name updated sucessfuly',result.homes,'');
                        }
                    });  
                } else {
                    Response(res,400,'no-token','Home not found' ,'no-result',err);
                }
            } else {
                Response(res,400,'no-token','No user found' ,'no-result',err);
            }    
        }    
    });
});

router.put(
    '/edit-image',
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            homeId:Joi.string().required(),
            homeImage:Joi.string().required()
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, homeId, homeImage } = await req.body;
    User.findById({ _id:userId },async (err,result)=>{
        if(err){
            Response(res,400,'no-token','No user found' ,'no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                const data = await result.homes.id(homeId);
                if(data !== null && data !== undefined){
                    result.homes.id(homeId).homeImage = homeImage;
                    result.save((err, result)=>{
                        if(err){
                            Response(res,400,'no-token','Error occured while editing home Image' ,'no-result',err);
                        } else {
                            Response(res,200,'no-token','Home image updated sucessfuly',result.homes,'');
                        }
                    });  
                } else {
                    Response(res,400,'no-token','Home not found' ,'no-result',err);
                }
            } else {
                Response(res,400,'no-token','No user found' ,'no-result',err);
            }    
        }    
    });
});


router.delete(
    '/removeOne',
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            homeId:Joi.string().required()
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, homeId } = await req.body;
    User.findById({ _id:userId },async (err,result)=>{
        if(err){
            Response(res,400,'no-token','No user found' ,'no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                const data = await result.homes.id(homeId);
                if(data !== null){
                    result.homes.id(homeId).remove();
                    result.save((err, result)=>{
                        if(err){
                          Response(res,400,'no-token','Error occured while deleting home' ,'no-result',err);
                        } else {
                            Response(res,200,'no-token','Home image updated sucessfuly',result.homes,'');
                        }
                    });  
                } else {
                    Response(res,400,'no-token','Home not found' ,'no-result',err);
                }
            } else {
                Response(res,400,'no-token','No user found' ,'no-result',err);
            }    
        }    
    });
});

module.exports = router;