import { inject, injectable } from 'tsyringe';
import { ConfigurationManager } from '../../../config/configuration.manager';
import { IAddressRepo } from '../../../database/repository.interfaces/general/address.repo.interface';
import { IPatientRepo } from '../../../database/repository.interfaces/users/patient/patient.repo.interface';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import { IPersonRoleRepo } from '../../../database/repository.interfaces/person/person.role.repo.interface';
import { IRoleRepo } from '../../../database/repository.interfaces/role/role.repo.interface';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { ITenantRepo } from '../../../database/repository.interfaces/tenant/tenant.repo.interface';
import { IHealthProfileRepo } from '../../../database/repository.interfaces/users/patient/health.profile.repo.interface';
import { CurrentUser } from '../../../domain.types/miscellaneous/current.user';
import { PatientDomainModel } from '../../../domain.types/users/patient/patient/patient.domain.model';
import { PatientDetailsDto, PatientDto } from '../../../domain.types/users/patient/patient/patient.dto';
import { PatientDetailsSearchResults, PatientSearchFilters, PatientSearchResults } from '../../../domain.types/users/patient/patient/patient.search.types';
import { PersonDetailsDto } from '../../../domain.types/person/person.dto';
import { Roles } from '../../../domain.types/role/role.types';
import { PatientStore } from '../../../modules/ehr/services/patient.store';
import { Injector } from '../../../startup/injector';
import { AuthHandler } from '../../../auth/auth.handler';
import { IHealthReportSettingsRepo } from '../../../database/repository.interfaces/users/patient/health.report.setting.repo.interface';
import { HealthReportSettingsDomainModel, ReportFrequency } from '../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PatientService {

    _ehrPatientStore: PatientStore = null;

    constructor(
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IAddressRepo') private _addressRepo: IAddressRepo,
        @inject('ITenantRepo') private _tenantRepo: ITenantRepo,
        @inject('IHealthProfileRepo') private _healthProfileRepo: IHealthProfileRepo,
        @inject('IHealthReportSettingsRepo') private _healthReportSettingsRepo: IHealthReportSettingsRepo
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrPatientStore = Injector.Container.resolve(PatientStore);
        }
    }

    //#region Publics

    create = async (patientDomainModel: PatientDomainModel): Promise<PatientDetailsDto> => {

        if (this._ehrPatientStore) {
            const ehrId = await this._ehrPatientStore.create(patientDomainModel);
            patientDomainModel.EhrId = ehrId;
        }
        var dto = await this._patientRepo.create(patientDomainModel);
        dto = await this.updateDetailsDto(dto);
        const role = await this._roleRepo.getByName(Roles.Patient);
        await this._personRoleRepo.addPersonRole(dto.User.Person.id, role.id);
        await this.createUserDefaultHealthReportSettings(dto.User.id);

        return dto;
    };

    public getByUserId = async (id: string): Promise<PatientDetailsDto> => {
        var dto = await this._patientRepo.getByUserId(id);
        dto = await this.updateDetailsDto(dto);
        if (dto == null) {
            return null;
        }
        var healthProfile = await this._healthProfileRepo.getByPatientUserId(id);
        dto.HealthProfile = healthProfile;
        return dto;
    };

    public getByPersonId = async (personId: string): Promise<PatientDetailsDto> => {
        var dto = await this._patientRepo.getByPersonId(personId);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: PatientSearchFilters
    ): Promise<PatientDetailsSearchResults | PatientSearchResults> => {
        var items = [];
        var results = await this._patientRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    public getPatientByPhone = async (
        filters: PatientSearchFilters
    ): Promise<PatientDetailsSearchResults | PatientSearchResults> => {

        var items = [];
        var results = await this._patientRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }

        var tenant = await this._tenantRepo.getTenantWithCode('default');

        if (items.length > 0) {
            const currentUser: CurrentUser = {
                UserId        : items[0].id,
                TenantId      : tenant.id,
                TenantCode    : tenant.Code,
                TenantName    : tenant.Name,
                DisplayName   : items[0].DisplayName,
                Phone         : items[0].Phone,
                Email         : items[0].Email,
                UserName      : items[0].UserName,
                CurrentRoleId : 2,
                CurrentRole   : 'Patient',
            };
            const accessToken = await AuthHandler.generateUserSessionToken(currentUser);
            items[0].accessToken = accessToken;
        }
        results.Items = items;
        return results;
    };

    public updateByUserId = async (id: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        var dto = await this._patientRepo.updateByUserId(id, updateModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public deleteByUserId = async (id: string): Promise<boolean> => {
        return await this._patientRepo.deleteByUserId(id);
    };

    public getAllPatientUserIds = async (): Promise<any[]> => {
        return await this._patientRepo.getAllPatientUserIds();
    };

    public getPatientsRegisteredLastMonth = async (): Promise<any[]> => {
        return await this._patientRepo.getPatientsRegisteredLastMonth();
    };

    public getAllRegisteredPatients = async (): Promise<any[]> => {
        return await this._patientRepo.getAllRegisteredPatients();
    };

    public checkforExistingPersonWithRole
        = async (domainModel: PatientDomainModel, roleId: number): Promise<PersonDetailsDto> => {

            const persons
                = await this._personRepo.getAllPersonsWithPhoneAndRole(domainModel.User.Person.Phone, roleId);
            if (persons.length > 0) {
                return persons[0];
            }
            return null;
        };
   
    //#endregion

    //#region Privates

    private createUserDefaultHealthReportSettings = async (userId: uuid) => {
        const model: HealthReportSettingsDomainModel = {
            PatientUserId : userId,
            Preference    : {
                ReportFrequency             : ReportFrequency.Month,
                HealthJourney               : true,
                MedicationAdherence         : true,
                BodyWeight                  : true,
                BloodGlucose                : true,
                BloodPressure               : true,
                SleepHistory                : true,
                LabValues                   : true,
                ExerciseAndPhysicalActivity : true,
                FoodAndNutrition            : true,
                DailyTaskStatus             : true
            }
        };
        
        await this._healthReportSettingsRepo.createReportSettings(model);
    };

    private updateDetailsDto = async (dto: PatientDetailsDto): Promise<PatientDetailsDto> => {
        if (dto == null) {
            return null;
        }

        var user = await this._userRepo.getById(dto.UserId);
        if (user == null) {
            return null;
        }

        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        const addresses = await this._personRepo.getAddresses(user.PersonId);
        user.Person.Addresses = addresses;
        dto.User = user;
        return dto;
    };

    private updateDto = async (dto: PatientDto): Promise<PatientDto> => {
        if (dto == null) {
            return null;
        }
        const user = await this._userRepo.getById(dto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        dto.DisplayName = user.Person.DisplayName;
        dto.UserName = user.UserName;
        dto.Phone = user.Person.Phone;
        dto.Email = user.Person.Email;
        dto.Gender = user.Person.Gender;
        dto.BirthDate = user.Person.BirthDate;
        dto.Age = user.Person.Age;
        dto.FirstName = user.Person.FirstName;
        dto.LastName = user.Person.LastName;
        dto.ImageResourceId = user.Person.ImageResourceId;
        return dto;
    };
    
    //#endregion

}
