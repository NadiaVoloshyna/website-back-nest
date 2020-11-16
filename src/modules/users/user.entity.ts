import { Table, Column, Model, DataType, HasMany, ForeignKey } from 'sequelize-typescript';
import { Post } from '../posts/post.entity';
import { File } from '../files/file.entity';

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    public email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    public phone: number;

    @ForeignKey(() => User)
    @HasMany(() => Post)
    posts: Post[];

    @ForeignKey(() => User)
    @HasMany(() => File)
    file: File[];
}



