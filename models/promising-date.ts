import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AllowNull,
    ForeignKey,
    BelongsTo,
    DataType,
    AutoIncrement
} from 'sequelize-typescript';
import EventModel from './event';
import PromisingModel from './promising';


@Table({ tableName: 'Promising_Date', modelName: 'PromisingDate' })
class PromisingDate extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, field: 'id' })
    id: number;

    @ForeignKey(() => PromisingModel)
    @Column({ type: DataType.INTEGER })
    promisingId: number;

    @ForeignKey(() => EventModel)
    @Column({ type: DataType.INTEGER })
    EventId: number;

    @AllowNull(false)
    @Column({ type: DataType.DATE })
    dateTime: Date;

    @BelongsTo(() => EventModel, { foreignKey: 'promisingId', onDelete: 'cascade' })
    ownPromising: EventModel;

    @BelongsTo(() => EventModel, { foreignKey: 'eventId', onDelete: 'cascade' })
    ownEvent: EventModel;
}

export default PromisingDate;
