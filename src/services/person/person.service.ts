import { IPersonRepo } from '../../database/repository.interfaces/person/person.repo.interface';
import { IPersonRoleRepo } from '../../database/repository.interfaces/person/person.role.repo.interface';
import { IRoleRepo } from '../../database/repository.interfaces/role/role.repo.interface';
import { injectable, inject } from 'tsyringe';
import { PersonDomainModel } from '../../domain.types/person/person.domain.model';
import { PersonDetailsDto, PersonDto } from '../../domain.types/person/person.dto';
import { PersonSearchFilters, PersonSearchResults } from '../../domain.types/person/person.search.types';
import { AddressDto } from '../../domain.types/general/address/address.dto';
import { OrganizationDto } from '../../domain.types/general/organization/organization.types';
import { RoleDto } from '../../domain.types/role/role.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PersonService {

    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo
    ) {}

    //#region Publics

    create = async (personDomainModel: PersonDomainModel): Promise<PersonDetailsDto> => {

        var dto = await this._personRepo.create(personDomainModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public getById = async (id: string): Promise<PersonDetailsDto> => {
        var dto = await this._personRepo.getById(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public getPersonRolesByPhone = async (phone: string): Promise<RoleDto[]> => {
        return await this._personRepo.getPersonRolesByPhone(phone);
    };

    public getPersonRolesByEmail = async (email: string): Promise<RoleDto[]> => {
        return await this._personRepo.getPersonRolesByEmail(email);
    };

    public exists = async (id: string): Promise<boolean> => {
        return await this._personRepo.exists(id);
    };

    public getPersonWithEmail = async (email: string): Promise<PersonDetailsDto> => {
        return await this._personRepo.getPersonWithEmail(email);
    };

    public search = async (filters: PersonSearchFilters): Promise<PersonSearchResults> => {
        return await this._personRepo.search(filters);
    };

    public multiplePersonsWithSamePhone = async (phone: string): Promise<boolean> => {
        if (!phone) {
            return false;
        }
        const persons = await this._personRepo.search({
            Phone : phone
        });

        if (persons.TotalCount > 1) {
            return true;
        }

        return false;
    };

    public multiplePersonsWithSameEmail = async (email: string): Promise<boolean> => {
        if (!email) {
            return false;
        }
        const persons = await this._personRepo.search({
            Email : email
        });

        if (persons.TotalCount > 1) {
            return true;
        }

        return false;
    };

    public update = async (id: string, personDomainModel: PersonDomainModel): Promise<PersonDetailsDto> => {
        var dto = await this._personRepo.update(id, personDomainModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._personRepo.delete(id);
    };

    getPersonWithPhone = async (phone: string): Promise<PersonDetailsDto> => {
        var dto = await this._personRepo.getPersonWithPhone(phone);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    getOrganizations = async (id: string): Promise<OrganizationDto[]> => {
        return await this._personRepo.getOrganizations(id);
    };

    addAddress = async (id: string, addressId: string): Promise<boolean> => {
        return await this._personRepo.addAddress(id, addressId);
    };

    removeAddress = async (id: string, addressId: string): Promise<boolean> => {
        return await this._personRepo.removeAddress(id, addressId);
    };

    getAddresses = async (id: string): Promise<AddressDto[]> => {
        return await this._personRepo.getAddresses(id);
    };

    getAllPersonsWithPhoneAndRole = async (phone: string, roleId: number): Promise<PersonDetailsDto[]> => {
        return await this._personRepo.getAllPersonsWithPhoneAndRole(phone, roleId);
    };

    //#endregion

    //#region Privates

    private updateDetailsDto = async (dto: PersonDetailsDto): Promise<PersonDetailsDto> => {
        if (dto == null) {
            return null;
        }
        const personRoles = await this._personRoleRepo.getPersonRoles(dto.id);
        dto.Roles = personRoles;
        return dto;
    };

    private updateDto = async (dto: PersonDto): Promise<PersonDto> => {
        return dto;
    };

    //#endregion

}
