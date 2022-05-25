import { Table, Column, Model, HasMany, BelongsTo, PrimaryKey, HasOne } from 'sequelize-typescript'
import { Event } from './event'

@Table
export class Time extends Model {
    @PrimaryKey
    @Column
    timeId!: number

    @Column
    endTime !: Date

    @Column
    startTime !: Date

    @HasMany(() => Event)
    eventId !: number
}
