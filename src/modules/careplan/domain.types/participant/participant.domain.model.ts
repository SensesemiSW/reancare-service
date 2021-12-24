export interface ParticipantDomainModel {
    id?            : string;
    Provider       : string;
    Name           : string;
    UserId         : string;
    Gender?        : string;
    IsActive?      : boolean;
    Age?           : number;
    Dob?           : Date;
    HeightInInches?: number;
    WeightInLbs?   : number;
    MaritalStatus? : string;
    ZipCode?       : number;
}
