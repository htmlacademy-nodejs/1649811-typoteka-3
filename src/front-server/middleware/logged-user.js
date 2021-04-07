'use strict';

const jwt = require(`jsonwebtoken`);
const {COOKIE_ACCESS, COOKIE_REFRESH, userCookieOption} = require(`../const`);
const api = require(`../api`).getApi();


module.exports = (req, res, next) => {
  const user = req.signedCookies[COOKIE_ACCESS];

  if (!user) {
    return next();
  }

  jwt.verify(user, process.env.JWT_ACCESS_SECRET, async (err, userData) => {
    if (err) {
      try {
        const refresh = req.signedCookies[COOKIE_REFRESH];
        const {accessToken, refreshToken} = await api.refresh(refresh);
        res
          .cookie(COOKIE_ACCESS, accessToken, userCookieOption)
          .cookie(COOKIE_REFRESH, refreshToken, userCookieOption);

        res.locals.loggedUser = jwt.decode(accessToken);
        res.locals.accessToken = accessToken;

        return next();

      } catch (error) {
        console.log(`jwt error:`, error.message);
        return res
          .clearCookie(COOKIE_ACCESS)
          .clearCookie(COOKIE_REFRESH)
          .redirect(`/`);
      }
    }

    res.locals.loggedUser = userData;
    res.locals.accessToken = user;
    return next();
  });

  return null;
};
