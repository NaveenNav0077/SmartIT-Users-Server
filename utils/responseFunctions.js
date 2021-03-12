function Response(res,status,token,message,result,error){
    if( status === 200 ){
      res.json({ 
        "status" : 200, 
        "message": message, 
        "token": token,
        "result" : result 
      });
    } else {
      res.json({ 
        "status" : status, 
        "message": message, 
        "error" : error 
      });
    }
}

module.exports = Response;