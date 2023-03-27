import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { StatusCreate, UserSchemaProps, UserTypeCreate } from '../../models/userModel';
import { IUserDriversRepository } from '../../Repository/IUserDriversRepository';

export class GoogleServices {
  private readonly GG_ID: string | any = process.env.GG_ID;
  private readonly GG_KEY: string | any = process.env.GG_KEY;
  private readonly END_POINT_SERVER: string | any = process.env.END_POINT_SERVER;

  constructor(private userDriverRepository: IUserDriversRepository) {
    this.initializeLoginGoogle();
  }

  public initializeLoginGoogle() {
    passport.serializeUser((user, done) => {
      done(null, user as UserSchemaProps);
    });

    passport.deserializeUser((user, done) => {
      done(null, user as UserSchemaProps);
    });

    passport.use(
      new GoogleStrategy(
        {
          clientID: this.GG_ID,
          clientSecret: this.GG_KEY,
          callbackURL: `${this.END_POINT_SERVER}/callback-gg`
        },
        async (accessToken: string, refreshToken: string, profile: Profile, cb: Function) => {
          const { picture } = profile._json;
          const { id, emails } = profile;
          const email = emails?.[0].value;
          const checkEmail = await this.userDriverRepository.findByEmail(email as string);
          if (checkEmail) {
            return cb(null, checkEmail);
          }
          const username = email?.split('@')[0] + '_' + id;
          const user = await this.userDriverRepository.createUser(
            username,
            '',
            profile.displayName,
            email as string,
            StatusCreate.ACTIVE,
            UserTypeCreate.GOOGLE,
            id,
            picture
          );
          return cb(null, user);
        }
      )
    );
  }

  public authenticate() {
    return passport.authenticate('google', { scope: ['profile', 'email'] });
  }

  public handleCallback() {
    return passport.authenticate('google', {
      successRedirect: this.END_POINT_SERVER + '/profile-gg',
      failureRedirect: process.env.END_POINT_HOME
    });
  }
}
