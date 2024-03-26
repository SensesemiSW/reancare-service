import { LessThanOrEqual, Repository } from 'typeorm';
import { AwardsFactsSource } from './awards.facts.db.connector';
import { AwardsFact } from './awards.facts.service';
import { Injector } from '../../../../src/startup/injector';
import { Logger } from '../../../../src/common/logger';
import { VitalFact } from './models/vital.fact.model';
import { BloodGlucoseService } from '../../../../src/services/clinical/biometrics/blood.glucose.service';
import { BodyWeightService } from '../../../../src/services/clinical/biometrics/body.weight.service';
import { BodyTemperatureService } from '../../../../src/services/clinical/biometrics/body.temperature.service';
import { BloodPressureService } from '../../../../src/services/clinical/biometrics/blood.pressure.service';
import { BloodOxygenSaturationService } from '../../../../src/services/clinical/biometrics/blood.oxygen.saturation.service';
import { PulseService } from '../../../../src/services/clinical/biometrics/pulse.service';
import { HelperRepo } from '../../../../src/database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../src/common/time.helper';
import { DurationType } from '../../../../src/domain.types/miscellaneous/time.types';

//////////////////////////////////////////////////////////////////////////////

export const updateVitalFact = async (model: AwardsFact) => {

    const vitalFactRepository: Repository<VitalFact> =
        AwardsFactsSource.getRepository(VitalFact);
    const vitalService = await getVitalService(model.Facts.VitalName);

    const lastRecords = await vitalFactRepository.find({
        where : {
            ContextReferenceId : model.PatientUserId,
            RecordDate         : LessThanOrEqual(new Date())
        },
        order : {
            RecordDate : 'DESC'
        }
    });
    const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(model.PatientUserId);
    const tempDate = TimeHelper.subtractDuration(model.RecordDate, offsetMinutes, DurationType.Minute);
    const tempDateStr = TimeHelper.formatDateToLocal_YYYY_MM_DD(tempDate);
    model.RecordDateStr = tempDateStr;

    await addOrUpdateVitalRecord(model);

    const lastRecord = lastRecords.length > 0 ? lastRecords[0] : null;
    var unpopulatedRecords = [];
    if (lastRecord == null) {
        unpopulatedRecords = await vitalService.getAllUserResponsesBefore(
            model.PatientUserId, new Date());
    }
    else {
        unpopulatedRecords = await vitalService.getAllUserResponsesBetween(
            model.PatientUserId, lastRecord.RecordDate, new Date());
    }
    for await (var r of unpopulatedRecords) {
        const model_: AwardsFact = {
            PatientUserId  : model.PatientUserId,
            RecordId       : r.RecordId,
            RecordDate     : r.RecordDate,
            RecordDateStr  : r.RecordDateStr,
            FactType       : 'Vitals',
            RecordTimeZone : r.RecordTimeZone,
            Facts          : {
                VitalName           : r.VitalName,
                VitalPrimaryValue   : r.VitalPrimaryValue,
                VitalSecondaryValue : r.VitalSecondaryValue ?? null,
                Unit                : r.Unit,
            }
        };
        await addOrUpdateVitalRecord(model_);
    }

};

async function addOrUpdateVitalRecord(model: AwardsFact) {
    const vitalFactRepository: Repository<VitalFact> =
        AwardsFactsSource.getRepository(VitalFact);
    const existing = await vitalFactRepository.findOne({
        where : {
            RecordId : model.RecordId
        }
    });
    if (!existing) {
        const fact = {
            RecordId            : model.RecordId,
            ContextReferenceId  : model.PatientUserId,
            VitalName           : model.Facts.VitalName,
            VitalPrimaryValue   : model.Facts.VitalPrimaryValue,
            VitalSecondaryValue : model.Facts.VitalSecondaryValue ?? null,
            Unit                : model.Facts.Unit,
            RecordDate          : model.RecordDate,
            RecordDateStr       : model.RecordDateStr,
            RecordTimeZone      : model.RecordTimeZone
        };
        const record = await vitalFactRepository.create(fact);
        const saved = await vitalFactRepository.save(record);
        Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
    }
    else {
        existing.VitalPrimaryValue = model.Facts.UserResponse ?? (await existing).VitalPrimaryValue;
        const saved = await vitalFactRepository.save(existing);
        Logger.instance().log(`${JSON.stringify(saved, null, 2)}`);
    }
}

async function getVitalService(vitalName) {
    const service = {
        "BloodGlucose"          : Injector.Container.resolve(BloodGlucoseService),
        "BodyWeight"            : Injector.Container.resolve(BodyWeightService),
        "BodyTemperature"       : Injector.Container.resolve(BodyTemperatureService),
        "BloodPressure"         : Injector.Container.resolve(BloodPressureService),
        "BloodOxygenSaturation" : Injector.Container.resolve(BloodOxygenSaturationService),
        "Pulse"                 : Injector.Container.resolve(PulseService)
    };
    return service[vitalName];
}
