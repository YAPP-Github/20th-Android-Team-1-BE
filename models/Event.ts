import {
    Table,
    Column,
    Model,
    AllowNull,
    PrimaryKey,
    ForeignKey,
    DataType,
    HasMany,
    AutoIncrement,
    BelongsTo
} from 'sequelize-typescript';
import User from './user'
import PromisingModel from './Promising'
import TimeModel from './Time';

@Table({ tableName: 'Event', modelName: 'Event' })
class EventModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, field: 'eventId' })
    id: number;

    @ForeignKey(() => PromisingModel)
    @AllowNull(false)
    @Column({ type: DataType.INTEGER })
    promiseId: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @BelongsTo(() => PromisingModel, 'promiseId')
    promising: PromisingModel

    @BelongsTo(() => User, 'userId')
    user: User

    @HasMany(() => TimeModel)
    eventTimes: TimeModel[];
}

export default EventModel;
