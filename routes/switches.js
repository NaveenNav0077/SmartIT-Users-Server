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

//Create a new device
.post(
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            deviceId:Joi.string().required(),
            switchName:Joi.string().required(),
            roomName:Joi.string().required(),
            switchIcon:Joi.string().required(),
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, deviceId,  switchName, roomName, switchIcon  } = await req.body;
    User.findById( { _id:userId } ,async (err,result)=>{
        if(err){
            Response(res,400,'no-token','User not found','no-result',err);
        }
        else {
            if( result!==undefined && result !== null ){
                if(result.devices.id(deviceId)!==null){
                    const No = result.devices.id(deviceId).switchs.length + 1;
                    result.devices.id(deviceId).switchs.push({ switchNo:No, switchName, roomName, switchIcon });
                    result.save((err, result)=>{
                        if(err){
                            Response(res,400,'no-token','Error occured while creating new switch ',err);
                        } else {
                            Response(res,200,'no-token','Switches created sucessfuly',result.devices.id(deviceId).switchs  ,'');  
                        }
                    });

                }
            } else {
                Response(res,400,'no-token','Device not found','no-result',err);
            }
        }
    });
})

//Delete a particular switch
.delete(
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            deviceId:Joi.string().required(),
            switchId:Joi.string().required()
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, deviceId, switchId } = await req.body;
    User.findById({ _id:userId } ,async (err,result)=>{
        if(err){
            Response(res,400,'no-token','User not found','no-result',err);
        }
        else {
            if( result!==undefined && result!==null ){
                if(result.devices.id(deviceId)!==null){
                    if(result.devices.id(deviceId).switchs.id(switchId)!==null){
                        result.devices.id(deviceId).switchs.id(switchId).remove();
                        result.save((err, result)=>{
                            if(err){
                                Response(res,400,'no-token','Error occured while deleting switch',err);
                            } else {
                                Response(res,200,'no-token','Switches deleted sucessfuly',result.devices.id(deviceId).switchs  ,'');  
                            }
                        });
                    } else {
                        Response(res,400,'no-token','Switch not found','no-result',err);
                    }
                } else {
                    Response(res,400,'no-token','Switch not found','no-result',err);
                }
            } else {
                Response(res,400,'no-token','Device not found','no-result',err);
            }
        }
    });
});


//Read all my switch
router.get(
    '/userId/:userId/deviceId/:deviceId/',
    VerifyUser,
    async (req,res)=>{
    const { userId, deviceId } = req.params;
    User.findById({ _id:userId } ,async (err,result)=>{
        if(err){
            Response(res,400,'no-token','User not found','no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                const data = await result.devices.id(deviceId);
                if( data !== null ){
                    Response(res,200,'no-token','Devices readed sucessfuly',data.switchs ,'');  
                } else {
                    Response(res,400,'no-token','devices not found','no-result',err);
                }         
            }
        }
    });
})

router.get('/findone',VerifyUser,async (req,res)=>{
    const { userId, deviceId, switchId } = await req.body;
    User.findById({ _id:userId },async (err,result)=>{
        if(err){
            Response(res,400,'no-token','User not found','no-result',err);
        } else {
            if( result!==undefined && result!==null ){
                if( await result.devices.id(deviceId) !== null ){
                    const data = await result.devices.id(deviceId).switchs.id(switchId);
                    if( data !== null ){
                        Response(res,200,'no-token','Switches found sucessfuly',data ,'');  
                    }  
                } else {
                    Response(res,400,'no-token','Device not found','no-result',err);
                }         
            } else {
                Response(res,400,'no-token','Device not found','no-result',err);
            } 
        }
    });
});

//Edit a particular switch name
router.put(
    '/name',
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            deviceId:Joi.string().required(),
            switchId:Joi.string().required(),
            switchName:Joi.string().required(),
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, deviceId, switchId, switchName } = await req.body;
    User.findById( { _id:userId } ,async (err,result)=>{
        if(err){
            Response(res,400,'no-token','User not found','no-result',err);
        }
        else {
            if( result!==undefined && result!==null ){
                if(result.devices.id(deviceId)!==null){
                    if(result.devices.id(deviceId).switchs.id(switchId)!==null){
                        result.devices.id(deviceId).switchs.id(switchId).switchName = switchName;
                        result.save((err, result)=>{
                            if(err){
                              Response(res,400,'no-token','Error occured while updating switch name',err);
                            } else {
                              Response(res,200,'no-token','Switches name updated sucessfuly',result.devices.id(deviceId).switchs.id(switchId)  ,'');  
                            }
                        });
                    } else {
                        Response(res,400,'no-token','Switch not found','no-result',err);
                    }
                } else {
                    Response(res,400,'no-token','Switch not found','no-result',err);
                }
            } else {
                Response(res,400,'no-token','Device not found','no-result',err);
            }
        }
    });
});

//Edit a particular switch room
router.put(
    '/room',
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            deviceId:Joi.string().required(),
            switchId:Joi.string().required(),
            roomName:Joi.string().required(),
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, deviceId, switchId, roomName } = await req.body;
    User.findById( { _id:userId } ,async (err,result)=>{
        if(err){
            Response(res,400,'no-token','User not found','no-result',err);
        }
        else {
            if( result!==undefined && result!==null ){
                if(result.devices.id(deviceId)!==null){
                    if(result.devices.id(deviceId).switchs.id(switchId)!==null){
                        result.devices.id(deviceId).switchs.id(switchId).roomName = roomName;
                        result.save((err, result)=>{
                            if(err){
                                Response(res,400,'no-token','Error occured while updating switch room',err);
                            } else {
                                Response(res,200,'no-token','Switches room updated sucessfuly',result.devices.id(deviceId).switchs.id(switchId)  ,'');  
                            }
                        });
                    } else {
                        Response(res,400,'no-token','Switch not found','no-result',err);
                    }
                } else {
                    Response(res,400,'no-token','Switch not found','no-result',err);
                }
            } else {
                Response(res,400,'no-token','Device not found','no-result',err);
            }
        }
    });
});


//Edit a particular switch Status
router.put(
    '/status',
    VerifyUser,
    celebrate({
        body:Joi.object().keys({
            userId:Joi.string().required(),
            deviceId:Joi.string().required(),
            switchId:Joi.string().required(),
            switchStatus:Joi.boolean().required(),
        })
    }),
    errors(),
    async (req,res)=>{
    const { userId, deviceId, switchId, switchStatus } = await req.body;
    User.findById( { _id:userId } ,async (err,result)=>{
        if(err){
            Response(res,400,'no-token','User not found','no-result',err);
        }
        else {
            if( result!==undefined && result!==null ){
                if(result.devices.id(deviceId)!==null){
                    if(result.devices.id(deviceId).switchs.id(switchId)!==null){
                        result.devices.id(deviceId).switchs.id(switchId).switchStatus = switchStatus;
                        result.save((err, result)=>{
                            if(err){
                              Response(res,400,'no-token','Error occured while updating switch status',err);
                            } else {
                              Response(res,200,'no-token','Switches status updated sucessfuly',result.devices.id(deviceId).switchs.id(switchId)  ,'');  
                            }
                        });
                    } else {
                        Response(res,400,'no-token','Switch not found','no-result',err);
                    }
                } else {
                    Response(res,400,'no-token','Switch not found','no-result',err);
                }
            } else {
                Response(res,400,'no-token','Device not found','no-result',err);
            }
        }
    });
});

module.exports = router;