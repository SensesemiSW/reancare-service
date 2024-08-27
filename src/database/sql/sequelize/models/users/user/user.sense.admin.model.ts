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

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Usage',
    tableName       : 'sense-usage-events',
    paranoid        : true,
    freezeTableName : true,
})
export default class SenseUsageEvents extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : uuidv4,
        allowNull    : false,
    })
    id: string;

    @Length({ min: 1, max: 255 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    RecordId: string;

    @Length({ min: 1, max: 255 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    ClientId: string;

    @Length({ min: 1, max: 64 })
    @Column({
        type      : DataType.STRING(65),
        allowNull : false,
    })
    RecordType: string;

    @Length({ min: 1, max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    DeviceId: string;

    @Length({ min: 1, max: 64 })
    @Column({
        type      : DataType.STRING(65),
        allowNull : true,
    })
    DeviceType: string;

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
