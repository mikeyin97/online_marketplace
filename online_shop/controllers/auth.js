class AuthController {

    Login(req, res){
        console.log("logged in");
        return res.status(200).send({
          success: 'false',
          message: 'logged in',
        });
    };

    Profile(req, res){
        return res.status(200).send({
            success: 'false',
            message: req.user,
        });
    }
      
}

const authController = new AuthController();
module.exports = authController;