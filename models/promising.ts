import { Table, Column, Model, HasMany, BelongsTo, PrimaryKey, HasOne } from 'sequelize-typescript'

@Table
export class Promising extends Model {
    @PrimaryKey
    @Column
    promisingId!: number

    @Column
    promiseName !: string

    @HasOne(() => User)
    ownerId !: number

    @HasOne(() => User_Group)
    groupId?: number

    @HasOne(() => CategoryKeyword)
    categoryId !: number
}
