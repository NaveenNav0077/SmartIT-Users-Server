var express = require('express');
var router = express.Router();
const User = require('../cloud/schemas/userSchema');
const jwt = require('jsonwebtoken');
const Response = require('../utils/responseFunctions');
const { celebrate, Joi, errors } = require('celebrate');

router.post(
  '/register',
  celebrate({
    body:Joi.object().keys({
      email:Joi.string().required(),
      userName:Joi.string().required(),
      password:Joi.string().required(),
      googleId:Joi.string().required(),
      profileImage:Joi.string().required()
    })
  }),
  errors(),
  async (req,res)=>{
  try{
    const { email } = await req.body;
    await User.findOne({ email },async (err, result)=>{
      if(err){
        Response(res,400,'no-token','Error user alredy exsist','no-result',err);
      } else {
        if(result===null){
          await User(req.body).save((err,user)=>{
            if(err){
              Response(res,400,'no-token','Error occured while saving user','no-result',err);
            } else {
               if(user){
              jwt.sign({ password:user.password }, process.env.SECRET_KEY, (tokenErr, token)=>{
                if(tokenErr){
                  Response(res,400,'no-token','Error occured while creating user token','no-result',tokenErr); 
                } else {
                  if(req.session.SmartIT === undefined){
                    req.session.SmartIT =  { token, email };
                  }
                  Response(res,200,token,'User registerd sucessfuly',user,'');
                }
              });
            } else {
              Response(res,400,'no-token','User alredy exsist','no-result',err);
            }
            }
          })
        } else {
          Response(res,400,'no-token','User alredy exsist','no-result',err);
        }
      }
    });  
  } catch(err) {
    Response(res,500,'no-token','Server side error','no-result',err);
  }
});

router.post(
  '/login',
  celebrate({
    body:Joi.object().keys({
      email:Joi.string().required(),
      password:Joi.string().required(),
    })
  }),
  errors(),
  async (req,res)=>{
  try{
    if(req.session.SmartIT===undefined){
      const { email, password } = await req.body;
      await User.findOne({ email },async (err, result)=>{
        if(err){
          console.log(err);
          Response(res,400,'no-token','Error occured while finding user','no-result',err);
        } else {
          if(result){
            console.log(result)
            if(result.password === password){
              await jwt.sign({ password:req.body.password }, process.env.SECRET_KEY, (tokenErr, token)=>{
                if(tokenErr){
                  console.log(tokenErr);
                  Response(res,400,'no-token','Error occured while creating user token','no-result',tokenErr); 
                } else {
                  req.session.SmartIT = { token, email:result.email };
                  Response(res,200,token,'User loged in sucessfuly',result)
                }
              });
            } else {
              Response(res,400,'no-token','Password in correct','no-result',err);
            }
          } else {
            Response(res,400,'no-token','User not found','no-result',err);
          }
        }
      });  
    } else {
      const { email, token } = await req.session.SmartIT;
      await User.findOne({ email },async (err, result)=>{
        if(err){
          console.log(err);
          Response(res,400,'no-token','Error occured while finding user','no-result',err);
        } else {
          if(result){
            Response(res,200,token,'User loged in sucessfuly',result);
          } else {
            Response(res,400,'no-token','User not found','no-result',err);
          }
        }
      });  
    }
    
  } catch(err) {
    console.log(err);
    Response(res,500,'no-token','Server side error','no-result',err);
  }
});

router.get('/logout',async (req,res)=>{
  try{
    if(req.session.SmartIT!==undefined){
      req.session.destroy()
      res.clearCookie("SmartIT");
      Response(res,200,'no-token','User loged out sucessfuly','no-result');
    } else {
      Response(res,200,'no-token','User loged out sucessfuly','no-result');
    }
  } catch (err){
    console.log(err);
    Response(res,500,'no-token','Server side error','no-result',err);
  }
});

module.exports = router;