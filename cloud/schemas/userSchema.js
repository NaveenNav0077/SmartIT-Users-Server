const mongoose = require('../index');

const switchSchema = new mongoose.Schema({
  switchNo:{
    type:Number,
    required:true
  },
  switchName:{
    type:String,
    required:true,
  },
  roomName:{
    type:String,
    required:true,
  },
  switchStatus:{
    type:Boolean,
    default:false
  },
  switchIcon:{
    type:String,
    require:true
  }
});

const deviceSchema = new mongoose.Schema({
  homeName:{
    type:String,
  },
  deviceName:{
    type:String
  },
  switchs:[switchSchema]
});

const homeSchema = new mongoose.Schema({
    homeName:{
        type:String
    },
    homeImage:{
        type:String
    }
})

const userSchema = new mongoose.Schema ({
  email: {
    type:String,
    required:true,
    unique:true
  },
  userName: {
    type:String,
    required:true
  },
  password: {
    type:String,
    required:true
  },
  googleId: {
    type:String,
    required:true
  },
  profileImage:{
    type:String
  },
  homes:[homeSchema],
  devices:[deviceSchema]
});

const User = new mongoose.model("User", userSchema);

module.exports = User;