class AuthController {

  Login(req, res){
    return res.status(200).send({
      success: 'true',
      message: 'logged in',
    });
  }

  Profile(req, res){
    return res.status(200).send({
      success: 'true',
      message: {
            "id": req.user._id,
            "username": req.user.username
          }
    });
  }

  Signup(req, res){
    return res.status(200).send({
      success: 'true',
      message: 'signed up',
    });
  }

  Logout(req, res){
    req.logout();
    return res.status(200).send({
      success: 'true',
      message: 'logged out',
    });
  }
}

const authController = new AuthController();
module.exports = authController;