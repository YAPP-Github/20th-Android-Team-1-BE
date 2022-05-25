import { Table, Column, Model, HasMany, BelongsTo, PrimaryKey } from 'sequelize-typescript'
import { Promising } from './promising'

@Table
export class Event extends Model {
    @PrimaryKey
    @Column
    EventId!: number

    @HasOne(() => Promising)
    promiseId !: string

    @HasOne(() => User)
    userId !: number
}
