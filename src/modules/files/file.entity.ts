import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class File extends Model<File> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    url: string;
}



  
  
  