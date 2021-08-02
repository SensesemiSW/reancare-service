import express from 'express';

import { PatientService } from '../../services/patient.service';
import { UserService } from '../../services/user.service';
import { PersonService } from '../../services/person.service';
import { Helper } from '../../common/helper';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { Authorizer } from '../../auth/authorizer';
import { PatientValidator } from '../validators/patient.validator';
import { PatientDetailsDto, PatientDomainModel } from '../../data/domain.types/patient.domain.types';

import { Roles } from '../../data/domain.types/role.domain.types';
import { UserDomainModel } from '../../data/domain.types/user.domain.types';
import { ApiError } from '../../common/api.error';
import { AddressDomainModel } from '../../data/domain.types/address.domain.types';
import { AddressValidator } from '../validators/address.validator';
import { AddressService } from '../../services/address.service';
import { RoleService } from '../../services/role.service';
import { PersonDomainModel } from '../../data/domain.types/person.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientController {
    //#region member variables and constructors

    _service: PatientService = null;
    _userService: UserService = null;
    _personService: PersonService = null;
    _addressService: AddressService = null;
    _roleService: RoleService = null;
    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(PatientService);
        this._userService = Loader.container.resolve(UserService);
        this._personService = Loader.container.resolve(PersonService);
        this._roleService = Loader.container.resolve(RoleService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.Create';

            var patientDomainModel = await PatientValidator.create(request, response);

            //Throw an error if patient with same name and phone number exists
            var existingPatientCountSharingPhone = await this._service.checkforDuplicatePatients(
                patientDomainModel
            );

            var userName = await this._userService.generateUserName(
                patientDomainModel.User.Person.FirstName,
                patientDomainModel.User.Person.LastName
            );

            var displayId = await this._userService.generateUserDisplayId(
                Roles.Patient,
                patientDomainModel.User.Person.Phone,
                existingPatientCountSharingPhone
            );

            var displayName = Helper.constructPersonDisplayName(
                patientDomainModel.User.Person.Prefix,
                patientDomainModel.User.Person.FirstName,
                patientDomainModel.User.Person.LastName
            );

            patientDomainModel.User.Person.DisplayName = displayName;
            patientDomainModel.User.UserName = userName;
            patientDomainModel.DisplayId = displayId;

            var userDomainModel = patientDomainModel.User;
            var personDomainModel = userDomainModel.Person;

            //Create a person first

            var person = await this._personService.getPersonWithPhone(patientDomainModel.User.Person.Phone);
            if (person == null) {
                person = await this._personService.create(personDomainModel);
                if (person == null) {
                    throw new ApiError(400, 'Cannot create person!');
                }
            }

            var role = await this._roleService.getByName(Roles.Patient);
            patientDomainModel.PersonId = person.id;
            userDomainModel.Person.id = person.id;
            userDomainModel.RoleId = role.id;

            var user = await this._userService.create(userDomainModel);
            if (user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            patientDomainModel.UserId = user.id;

            //KK: Note - Please add user to appointment service here...
            // var appointmentCustomerModel = PatientMapper.ToAppointmentCustomerDomainModel(userDomainModel);
            // var customer = await this._appointmentService.createCustomer(appointmentCustomerModel);

            patientDomainModel.DisplayId = displayId;
            var patient = await this._service.create(patientDomainModel);
            if (user == null) {
                throw new ApiError(400, 'Cannot create patient!');
            }

            await this.createAddress(request, patient);

            ResponseHandler.success(request, response, 'Patient created successfully!', 201, {
                Patient: patient,
            });
        } catch (error) {
            //KK: Todo: Add rollback in case of mid-way exception
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.GetByUserId';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            var userId: string = await PatientValidator.getByUserId(request, response);

            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const patient = await this._service.getByUserId(userId);
            if (patient == null) {
                throw new ApiError(404, 'Patient not found.');
            }

            ResponseHandler.success(request, response, 'Patient retrieved successfully!', 200, {
                Patient: patient,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.Search';
            await this._authorizer.authorize(request, response);

            var filters = await PatientValidator.search(request, response);

            var extractFull: boolean =
                request.query.fullDetails != 'undefined' && typeof request.query.fullDetails == 'boolean'
                    ? request.query.fullDetails
                    : false;

            const searchResults = await this._service.search(filters, extractFull);
            var count = searchResults.Items.length;
            var message =
                count == 0 ? 'No records found!' : `Total ${count} patient records retrieved successfully!`;
                
            ResponseHandler.success(request, response, message, 200, {
                Patients: searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateByUserId = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.UpdateByUserId';
            await this._authorizer.authorize(request, response);

            var patientDomainModel = await PatientValidator.updateByUserId(request, response);

            var userId: string = await PatientValidator.getByUserId(request, response);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            var userDomainModel: UserDomainModel = patientDomainModel.User;
            var updatedUser = await this._userService.update(patientDomainModel.UserId, userDomainModel);
            if (!updatedUser) {
                throw new ApiError(400, 'Unable to update user!');
            }
            var personDomainModel: PersonDomainModel = patientDomainModel.User.Person;
            personDomainModel.id = updatedUser.Person.id;
            var updatedPerson = await this._personService.update(personDomainModel.id, personDomainModel);
            if (!updatedPerson) {
                throw new ApiError(400, 'Unable to update person!');
            }
            const updatedPatient = await this._service.updateByUserId(
                patientDomainModel.UserId,
                patientDomainModel
            );
            if (updatedPatient == null) {
                throw new ApiError(400, 'Unable to update patient record!');
            }

            await this.createOrUpdateAddress(request, patientDomainModel);

            ResponseHandler.success(request, response, 'Patient records updated successfully!', 200, {
                Patient: updatedPatient,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.DeleteByUserId';
            await this._authorizer.authorize(request, response);

            var userId: string = await PatientValidator.delete(request, response);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const deleted = await this._personService.delete(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Patient records deleted successfully!', 200, {
                Deleted: true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Private methods

    private async createOrUpdateAddress(request, patientDomainModel: PatientDomainModel) {
        var addressDomainModel: AddressDomainModel = null;
        var addressBody = request.body.Address ?? null;

        if (addressBody != null) {
            addressDomainModel = await AddressValidator.getDomainModel(addressBody);

            //get existing address to update
            var existingAddresses = await this._addressService.getByPersonId(patientDomainModel.PersonId);
            if (existingAddresses.length < 1) {
                addressDomainModel.PersonId = patientDomainModel.PersonId;
                var address = await this._addressService.create(addressDomainModel);
                if (address == null) {
                    throw new ApiError(400, 'Cannot create address!');
                }
            } else if (existingAddresses.length == 1) {
                const updatedAddress = await this._addressService.update(
                    existingAddresses[0].id,
                    addressDomainModel
                );
                if (updatedAddress == null) {
                    throw new ApiError(400, 'Unable to update address record!');
                }
            }
        }
    }

    private async createAddress(request, patient: PatientDetailsDto) {
        var addressDomainModel: AddressDomainModel = null;
        var addressBody = request.body.Address ?? null;
        if (addressBody != null) {
            addressDomainModel = await AddressValidator.getDomainModel(addressBody);
            addressDomainModel.PersonId = patient.User.id;
            var address = await this._addressService.create(addressDomainModel);
            if (address == null) {
                throw new ApiError(400, 'Cannot create address!');
            }
        }
    }

    //#endregion
};
