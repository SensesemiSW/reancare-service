import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../../../../common/logger';
import { injectable } from 'tsyringe';
import { Injector } from '../../../../startup/injector';
import { FileResourceService } from '../../../../services/general/file.resource.service';
import { DocumentDomainModel } from '../../../../domain.types/users/patient/document/document.domain.model';
import { FileResourceUploadDomainModel } from '../../../../domain.types/general/file.resource/file.resource.domain.model';
import { DocumentService } from '../../../../services/users/patient/document.service';
import {
    DownloadDisposition,
    FileResourceMetadata,
} from '../../../../domain.types/general/file.resource/file.resource.types';
import { DocumentTypes } from '../../../../domain.types/users/patient/document/document.types';
import { VisitType } from '../../../../domain.types/miscellaneous/clinical.types';
import { OrderTypes } from '../../../../domain.types/clinical/order/order.types';

///////////////////////////////////////////////////////////////////////

@injectable()
export class ReportService {
    
    _fileResourceService: FileResourceService = Injector.Container.resolve(FileResourceService);

    _documentservice: DocumentService = Injector.Container.resolve(DocumentService);

    private async fetchReports(patientId: string, apiKey: string): Promise<any[]> {
        const url = `${process.env.SENSE_BASE_URL}/reports/`;

        try {
            const response = await axios.get(url, {
                params: { id: patientId },
                headers: { 'x-api-key': apiKey }
            });

            const reportData = response.data.Data?.report || [];
            if (!Array.isArray(reportData)) {
                throw new Error('Expected report data to be an array');
            }

            return reportData;
        } catch (error) {
            Logger.instance().log(`fetchReports: ${error}`);
            throw new Error('Failed to fetch reports');
        }
    }

    private async downloadPDF(report): Promise<any> {
        const parts = report.ReportKeyName.split('/');
        const reportName = parts.pop();
        const filePath = path.join(process.cwd(), 'tmp', 'resources', 'downloads', `${reportName}`);

        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const writer = fs.createWriteStream(filePath);

        try {
            const response = await axios.get(report.ReportUrl, {
                responseType: 'stream',
                headers: { 'x-api-key': process.env.SENSE_X_API_KEY },
            });

            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            return filePath;
        } catch (error) {
            Logger.instance().log(`downloadPDF: ${error}`);
            throw new Error('Failed to download PDF');
        }
    }

    public async processReport(patientIds: string[], apiKey: string): Promise<void> {
        try {
            for (const patientId of patientIds) {
                const reports = await this.fetchReports(patientId, apiKey);

                if (reports.length === 0) {
                    continue;
                }

                for (const report of reports) {
                    const KeyName = report.ReportKeyName;
                    const parts = KeyName.split('/');
                    const originalName = parts.pop();
                    const referenceId = report.id;

                    const existingDocument = await this._documentservice.getDocumentByReferenceId(referenceId);

                    if (existingDocument) {
                        continue;
                    }

                    const sourceFilePath = path.join(process.cwd(), 'tmp', 'resources', 'downloads', `${originalName}`);

                    await this.downloadPDF(report);

                    const fileResourceMetadata: FileResourceMetadata = {
                        ResourceId: '12345',
                        VersionId: 'v1.0',
                        Version: '1.0.0',
                        FileName: originalName,
                        OriginalName: originalName,
                        SourceFilePath: sourceFilePath,
                        MimeType: 'application/pdf',
                        Size: 204800,
                        StorageKey: report.ReportKeyName,
                        IsDefaultVersion: true,
                        IsPublicResource: false,
                        Disposition: DownloadDisposition.Inline,
                        Url: report.ReportUrl,
                        Stream: null,
                    };

                    const model: DocumentDomainModel = {
                        id: report.id,
                        EhrId: report.id,
                        DisplayId: 'SENSE',
                        DocumentType: DocumentTypes.LabReport,
                        PatientUserId: report.PatientId,
                        MedicalPractitionerUserId: null,
                        UploadedByUserId: report.PatientId,
                        AssociatedVisitId: null,
                        AssociatedOrderId: null,
                        MedicalPractionerRole: null,
                        AssociatedVisitType: VisitType.LabVisit,
                        AssociatedOrderType: OrderTypes.Unknown,
                        FileMetaData: fileResourceMetadata,
                        RecordDate: new Date(),
                        UploadedDate: new Date(),
                        ReferenceId: report.id,
                    };

                    const fileResourceDomainModel: FileResourceUploadDomainModel = {
                        FileMetadata: model.FileMetaData,
                        IsMultiResolutionImage: false,
                        IsPublicResource: false,
                        OwnerUserId: model.PatientUserId,
                        UploadedByUserId: model.PatientUserId,
                    };

                    const fileResourceDto = await this._fileResourceService.upload(fileResourceDomainModel);
                    model.FileMetaData = fileResourceDto.DefaultVersion;

                    const document = await this._documentservice.upload(model);

                    if (document == null) {
                        Logger.instance().log('Cannot upload document!');
                    } else {
                        fs.unlink(sourceFilePath, (error) => {
                            if (error) {
                                Logger.instance().log(`Error deleting reports: ${error}`);
                            }
                        });
                    }
                }
            }
        } catch (error) {
            Logger.instance().log(`Error in process reports: ${error}`);
        }
    }
}
