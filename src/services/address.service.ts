import { inject, injectable } from "tsyringe";
import { AddressDomainModel, AddressDto, AddressSearchFilters, AddressSearchResults } from "../domain.types/address.domain.types";
import { IAddressRepo } from "../database/repository.interfaces/address.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AddressService {

    constructor(
        @inject('IAddressRepo') private _addressRepo: IAddressRepo,
    ) {}

    create = async (addressDomainModel: AddressDomainModel): Promise<AddressDto> => {
        return await this._addressRepo.create(addressDomainModel);
    };

    getById = async (id: string): Promise<AddressDto> => {
        return await this._addressRepo.getById(id);
    };

    getByPersonId = async (personId: string): Promise<AddressDto[]> => {
        return await this._addressRepo.getByPersonId(personId);
    };

    getByOrganizationId = async (organizationId: string): Promise<AddressDto[]> => {
        return await this._addressRepo.getByOrganizationId(organizationId);
    };

    search = async (filters: AddressSearchFilters): Promise<AddressSearchResults> => {
        return await this._addressRepo.search(filters);
    };

    update = async (id: string, addressDomainModel: AddressDomainModel): Promise<AddressDto> => {
        return await this._addressRepo.update(id, addressDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._addressRepo.delete(id);
    };

}
