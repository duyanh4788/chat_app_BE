import passport from 'passport';
import { Profile, Strategy as FacebookStrategy } from 'passport-facebook';
import { UserSchemaProps, UserTypeCreate } from '../../models/userModel';
import { IUserDriversRepository } from '../../Repository/IUserDriversRepository';

export class FaceBookService {
    private readonly FB_ID: string | any = process.env.FB_ID;
    private readonly FB_KEY: string | any = process.env.FB_KEY;
    private readonly END_POINT_SERVER: string | any = process.env.END_POINT_SERVER;

    constructor(private userDriverRepository: IUserDriversRepository) {
        this.initializeFacebookStrategy();
    }

    public initializeFacebookStrategy() {
        passport.use(new FacebookStrategy({
            clientID: this.FB_ID,
            clientSecret: this.FB_KEY,
            callbackURL: `${this.END_POINT_SERVER}/callback-fb`,
            profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
        }, async (accessToken: string, refreshToken: string, profile: Profile, cb: Function) => {
            const { _json } = profile
            const checkEmail = await this.userDriverRepository.findByEmail(_json.email);
            if (checkEmail) {
                return cb(null, checkEmail)
            }
            await this.userDriverRepository.createUser(_json.email.split('@')[0] + '_' + _json.id, _json.id, _json.name, _json.email, UserTypeCreate.FACEBOOK, _json.id)
            return cb(null, profile)
        }));

        passport.serializeUser((user, done) => {
            done(null, user as UserSchemaProps);
        });

        passport.deserializeUser((user, done) => {
            done(null, user as UserSchemaProps);
        });

    }
}
