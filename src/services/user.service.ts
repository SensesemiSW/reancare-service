import { Loader } from '../startup/loader';
import { IUserRepo } from '../database/repository.interfaces/user.repo.interface';
import { IPersonRoleRepo } from '../database/repository.interfaces/person.role.repo.interface';
import { IRoleRepo } from '../database/repository.interfaces/role.repo.interface';
import { IOtpRepo } from '../database/repository.interfaces/otp.repo.interface';
import { IMessagingService } from '../modules/communication/interfaces/messaging.service.interface';
import { UserDetailsDto, UserLoginDetails, UserDomainModel } from '../domain.types/user.domain.types';
import { injectable, inject } from 'tsyringe';
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';
import { CurrentUser } from '../domain.types/current.user';
import { OtpPersistenceEntity } from '../domain.types/otp.domain.types';
import { Roles } from '../domain.types/role.domain.types';
import { generate } from 'generate-password';
import { IPersonRepo } from '../database/repository.interfaces/person.repo.interface';
import { PersonDetailsDto } from '../domain.types/person.domain.types';
import { Helper } from '../common/helper';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserService {
    
    constructor(
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _userRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IOtpRepo') private _otpRepo: IOtpRepo,
        @inject('IMessagingService') private _messagingService: IMessagingService
    ) {}

    create = async (userDomainModel: UserDomainModel) => {
        const user = await this._userRepo.create(userDomainModel);
        if (user == null) {
            return null;
        }
        await this.generateLoginOtp(userDomainModel, user);
        return user;
    };

    public getById = async (id: string): Promise<UserDetailsDto> => {
        return await this._userRepo.getById(id);
    };

    public update = async (id: string, userDomainModel: UserDomainModel): Promise<UserDetailsDto> => {
        return await this._userRepo.update(id, userDomainModel);
    };

    public loginWithPassword = async (loginModel: UserLoginDetails): Promise<any> => {

        const user: UserDetailsDto = await this.checkUserDetails(loginModel);
        const hashedPassword = await this._userRepo.getUserHashedPassword(user.id);
        const isPasswordValid = Helper.compare(loginModel.Password, hashedPassword);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid password!');
        }

        //The following user data is immutable. Don't include any mutable data
        const currentUser: CurrentUser = {
            UserId        : user.id,
            DisplayName   : user.Person.DisplayName,
            Phone         : user.Person.Phone,
            Email         : user.Person.Email,
            UserName      : user.UserName,
            CurrentRoleId : loginModel.LoginRoleId,
        };
        const accessToken = await Loader.authorizer.generateUserSessionToken(currentUser);

        return { user: user, accessToken: accessToken };
    };

    public generateOtp = async (otpDetails: any): Promise<boolean> => {

        let person: PersonDetailsDto = null;

        if (otpDetails.Phone) {
            person = await this._personRepo.getPersonWithPhone(otpDetails.Phone);
            if (person == null) {
                const message = 'User does not exist with phone(' + otpDetails.Phone + ')';
                throw new ApiError(404, message);
            }
        } else if (otpDetails.Email) {
            person = await this._personRepo.getPersonWithPhone(otpDetails.Email);
            if (person == null) {
                const message = 'User does not exist with email(' + otpDetails.Email + ')';
                throw new ApiError(404, message);
            }
        }
        if (person == null) {
            throw new ApiError(404, 'Cannot find user.');
        }

        //Now check if that person is an user with a given role
        const personId = person.id;
        const user: UserDetailsDto = await this._userRepo.getUserByPersonIdAndRole(personId, otpDetails.RoleId);
        if (person == null) {
            throw new ApiError(404, 'Cannot find user with the given role.');
        }

        const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
        const currMillsecs = Date.now();
        const validTill = new Date(currMillsecs + (300 * 1000));

        const otpEntity: OtpPersistenceEntity = {
            Purpose   : otpDetails.Purpose,
            UserId    : user.id,
            Otp       : otp,
            ValidFrom : new Date(),
            ValidTill : validTill
        }

        const otpDto = await this._otpRepo.create(otpEntity);
        const message = `Hello ${user.Person.DisplayName}, ${otp} is OTP for your REANCare account and will expire in 5 minutes. If you have not requested this OTP, please contact REANCare support.`;
        const sendStatus = await this._messagingService.sendSMS(user.Person.Phone, message);
        if (sendStatus) {
            Logger.instance().log('Otp sent successfully.\n ' + JSON.stringify(otpDto, null, 2));
        }

        return true;
    };

    public loginWithOtp = async (loginModel: UserLoginDetails): Promise<any> => {
        
        const user: UserDetailsDto = await this.checkUserDetails(loginModel);

        const storedOtp = await this._otpRepo.getByOtpAndUserId(user.id, loginModel.Otp);
        if (!storedOtp) {
            throw new ApiError(404, 'Active Otp record not found!');
        }
        const date = new Date();
        if (storedOtp.ValidTill <= date) {
            throw new ApiError(400, 'Login OTP has expired. Please regenerate OTP again!');
        }

        //The following user data is immutable. Don't include any mutable data
        const currentUser: CurrentUser = {
            UserId        : user.id,
            DisplayName   : user.Person.DisplayName,
            Phone         : user.Person.Phone,
            Email         : user.Person.Email,
            UserName      : user.UserName,
            CurrentRoleId : loginModel.LoginRoleId,
        };
        const accessToken = Loader.authorizer.generateUserSessionToken(currentUser);

        return { user: user, accessToken: accessToken };
    };

    public generateUserName = async (firstName, lastName):Promise<string> => {
        if (firstName == null) {
            firstName = generate({ length: 4, numbers: false, lowercase: true, uppercase: false, symbols: false });
        }
        if (lastName == null) {
            lastName = generate({ length: 4, numbers: false, lowercase: true, uppercase: false, symbols: false });
        }
        let userName = this.constructUserName(firstName, lastName);
        let exists = await this._userRepo.userExistsWithUsername(userName);
        while (exists) {
            userName = this.constructUserName(firstName, lastName);
            exists = await this._userRepo.userExistsWithUsername(userName);
        }
        return userName;
    }
    
    private constructUserName(firstName: string, lastName: string) {
        const rand = Math.random()
            .toString(10)
            .substr(2, 4);
        let userName = firstName.substr(0, 3) + lastName.substr(0, 3) + rand;
        userName = userName.toLowerCase();
        return userName;
    }

    public generateUserDisplayId = async (role:Roles, phone, phoneCount = 0) => {

        let prefix = '';
    
        if (role === Roles.Doctor){
            prefix = 'DR#';
        } else if (role === Roles.Patient){
            prefix = 'PT#';
        } else if (role === Roles.LabUser){
            prefix = 'LU#';
        } else if (role === Roles.PharmacyUser){
            prefix = 'PU#';
        }
    
        let str = '';
        if (phone != null && typeof phone !== 'undefined') {
    
            const phoneTemp = phone.toString();
            const tokens = phoneTemp.split('+');
            let s = tokens.length > 1 ? tokens[1] : phoneTemp;

            if (s.startsWith('91')){
                s = s.slice(2);
            }
            s = s.trim();
            s = s.replace('+', '');
            s = s.replace(' ', '');
            s = s.replace('-', '');
    
            if (role === Roles.Patient) {
                const idx = (phoneCount + 1).toString();
                str = str + idx + '-' + s;
            } else {
                str = str + '0-' + s;
            }
        }
        else {
            const tmp = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
            str = tmp.substr(-10);
        }
        str = str.substr(0, 20);
    
        const displayId = prefix + str;
        return displayId;
    }

    private async checkUserDetails(loginModel: UserLoginDetails): Promise<UserDetailsDto> {

        let person: PersonDetailsDto = null;
        let user: UserDetailsDto = null;

        if (loginModel.Phone) {
            person = await this._personRepo.getPersonWithPhone(loginModel.Phone);
            if (person == null) {
                const message = 'User does not exist with phone(' + loginModel.Phone + ')';
                throw new ApiError(404, message);
            }
        } else if (loginModel.Email) {
            person = await this._personRepo.getPersonWithEmail(loginModel.Email);
            if (person == null) {
                const message = 'User does not exist with email(' + loginModel.Email + ')';
                throw new ApiError(404, message);
            }
        } else if (loginModel.UserName) {
            user = await this._userRepo.getUserWithUserName(loginModel.UserName);
            if (user == null) {
                const message = 'User does not exist with username (' + loginModel.UserName + ')';
                throw new ApiError(404, message);
            }
            person = await this._personRepo.getById(user.Person.id);
        }
        if (person == null) {
            throw new ApiError(404, 'Cannot find person.');
        }

        //Now check if that person is an user with a given role
        const personId = person.id;
        if (user == null) {
            user = await this._userRepo.getUserByPersonIdAndRole(personId, loginModel.LoginRoleId);
            if (user == null) {
                throw new ApiError(404, 'Cannot find user with the given role.');
            }
        }
        user.Person = user.Person ?? person;

        return user;
    }

    private async generateLoginOtp(userDomainModel: UserDomainModel, user: UserDetailsDto) {

        if (userDomainModel.GenerateLoginOTP === true) {
            const obj = {
                Phone   : user.Person.Phone,
                Email   : user.Person.Email,
                UserId  : user.id,
                Purpose : 'Login',
            };
            const successful = await this.generateOtp(obj);
            if (successful) {
                Logger.instance().log(`Login OTP sent successfully to user ${user.Person.DisplayName}.`);
            }
        }
    }

    // public resetPassword = async (obj: any): Promise<boolean> => {
    //     return true;
    // };

}
