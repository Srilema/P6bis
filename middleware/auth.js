const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //req.headers.authorization is composed by two words separated by a comma
    //the token is the second words, so split and get second element
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    //get userId from token
    const userId = decodedToken.userId;
    //put it inside req to let it be accessible by routers and controllers
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};


/*const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{
    try{
        const token = req.header.authorization.split(" ")[1];
        console.log(token);
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        req.auth={
            userId:userId,
          };
        next();
    } catch(error){
        res.status(401).json({error});
    }
};*/

