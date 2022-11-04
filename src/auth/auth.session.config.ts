import * as session from 'express-session';
import * as passport from 'passport';

export const sessionConfig = (app) => {
  app.use(
    session({
      name: process.env.SESSION_ID,
      resave: false,
      saveUninitialized: true,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60, //60분
      },
    }),
  );

  app.use(passport.initilize());
  app.use(passport.session());
};
