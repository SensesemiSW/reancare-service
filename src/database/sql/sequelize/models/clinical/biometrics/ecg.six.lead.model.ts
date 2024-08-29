import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    IsUUID,
    PrimaryKey,
    Length,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({
    timestamps      : true,
    modelName       : 'EcgSixLead', // Adjust modelName as needed
    tableName       : 'biometrics_ecg_six_leads', // Adjust tableName as needed
    paranoid        : true,
    freezeTableName : true
})
export default class EcgSixLead extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : uuidv4,
        allowNull    : false,
    })
    id: string;

    @Length({ min: 2, max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    RefId: string;

    @Length({ min: 1, max: 255 })
    @Column({
        type      : DataType.STRING(255),
        allowNull : false,
    })
    PatientId: string;

    @Column({
        type      : DataType.STRING,
        allowNull : true,
    })
    DeviceName: string;

    @Column({
        type      : DataType.JSON,
        allowNull : true,
    })
    CalculatedData: JSON;

    @Column({
        type      : DataType.STRING,
        allowNull : true,
    })
    ImageUrl: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @Column
    @UpdatedAt
    UpdatedAt: Date;

    @Column
    @DeletedAt
    DeletedAt: Date;

}
