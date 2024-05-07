const isSignedIn = (req, res, next) => {
    // check that there is a session user: if so, allow rest of response to proceed
    if (req.session.user) return next();
    // otherwise redited to sign-in
    res.redirect("/auth/sign-in");
  };
  
module.exports = isSignedIn;