const express = require('express');
const router = express.Router();
const User = require('../cloud/schemas/userSchema'); 
const VerifyUser = require('../utils/jwtSession');
const Response = require('../utils/responseFunctions');
const { celebrate, Joi, errors } = require('celebrate');

router.route('/')

.all((req,res,next)=>{
    next();
})

//Read all my devices


//Create a new device
.post(
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            create_device:Joi.object().keys({
                homeName:Joi.string().required(),
                deviceName:Joi.string().allow("")
            })
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, create_device } = await req.body;
    User.findById( { _id:userId },async (err,result)=>{
        if(err){
            Response(res,400,'no-token','No device found','no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                result.devices.push(create_device);
                result.save((err, result)=>{
                    if(err){
                        Response(res,400,'no-token','No home found','no-result',err);
                    } else {
                        Response(res,200,'no-token','Device added sucessfuly',result.devices,'');
                    }
                });  
            } else {
                Response(res,400,'no-token','No device found','no-result',err);
            }     
        }   
    });
})

//Delete a particular device
.delete(
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            deviceId:Joi.string().required()
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, deviceId } = await req.body;
    User.findById({ _id:userId },async (err,result)=>{
        if(err){
            Response(res,400,'no-token','No device found','no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                if(result.devices.id(deviceId)!==null){   
                    result.devices.id(deviceId).remove();
                    result.save((err, result)=>{
                        if(err){
                            Response(res,400,'no-token','Error occured while deleting devices','no-result',err);
                        } else {
                            Response(res,200,'no-token','Device deleted sucessfuly',result.devices,'');
                        }
                    });  
                } else {
                    Response(res,400,'no-token','No device found','no-result',err);
                }
               
            } else {
                Response(res,400,'no-token','No device found','no-result',err);
            }     
        }   

    });
});

router.get(
    '/userId/:userId',
    VerifyUser,
    async (req,res)=>{
    const { userId } = req.params;
    User.findById( { _id:userId },async (err,result)=>{
        if(err){
            Response(res,400,'no-token','No device found','no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                Response(res,200,'no-token','Devices readed sucessfuly',result.devices,'');
            } else {
                Response(res,400,'no-token','No device found','no-result',err);
            }   
        }    
    });
})

//Edit a particular device
router.put(
    '/edit-name',
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            deviceId:Joi.string().required(),
            deviceName:Joi.string().required()
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, deviceId, deviceName } = await req.body;
    User.findById({ _id:userId }  ,async (err,result)=>{
        if(err){
            Response(res,400,'no-token','No device found','no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                if(result.devices.id(deviceId)!==null){     
                    result.devices.id(deviceId).deviceName = deviceName;
                    result.save((err, result)=>{
                        if(err){
                            Response(res,400,'no-token','Error occured while updating devices name','no-result',err);
                        } else {
                            Response(res,200,'no-token','Device devices name updating sucessfuly',result.devices,'');
                        }
                    });  
                } else {
                    Response(res,400,'no-token','No device found','no-result',err);
                }
               
            } else {
                Response(res,400,'no-token','Device not found','no-result',err);
            }     
        }   

    });
});

router.get(
    '/findone',
    VerifyUser,
    async (req,res)=>{
    const { userId, deviceId } = await req.body;
    User.findById({ _id:userId } ,async (err,result)=>{
        if(err){
            Response(res,400,'no-token','No device found','no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                const data = await result.devices.id(deviceId);
                if(data !== null){
                    Response(res,200,'no-token','Device found sucessfuly',data,'');
                } else {
                    Response(res,400,'no-token','Device not found','no-result',err);
                }
            } else {
                Response(res,400,'no-token','Device not found','no-result',err);
            }     
        }   

    });
})

module.exports = router;