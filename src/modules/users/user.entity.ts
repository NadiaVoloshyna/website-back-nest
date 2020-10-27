import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    phone: number;

// const Tutorial = sequelize.define("tutorial", { ... })
// const Comment = sequelize.define("comment", { ... })

// Tutorial.hasMany(Comment, { as: "comments" });
// Comment.belongsTo(Tutorial, {
//   foreignKey: "tutorialId",
//   as: "tutorial",
// });
}

