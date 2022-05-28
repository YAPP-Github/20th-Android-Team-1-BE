import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AllowNull,
    HasMany,
    ForeignKey,
    BelongsTo,
    DataType,
    AutoIncrement
} from 'sequelize-typescript';
import User from './user';
import EventModel from './Event'

@Table({ tableName: 'Promising', modelName: 'Promising' })
class PromisingModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, field: 'promisingId' })
    id: number;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    promiseName: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    ownerId: number;

    // @ForeignKey(() => Group)
    // @Column({ type: DataType.INTEGER })
    // groupId: number;

    // @ForeignKey(() => CategoryKeyword)
    // @Column({ type: DataType.INTEGER })
    // categoryId: number;

    @HasMany(() => EventModel)
    ownEvents: EventModel[];

    @BelongsTo(() => User, 'ownerId')
    owner: User;
}

export default PromisingModel;
