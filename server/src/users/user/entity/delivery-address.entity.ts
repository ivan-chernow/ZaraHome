import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
@Entity()
export class DeliveryAddress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    patronymic: string;

    @Column()
    phoneCode: string;

    @Column()
    phone: string;

    @Column()
    region: string;

    @Column()
    city: string;

    @Column()
    street: string;

    @Column()
    building: string;

    @Column()
    house: string;

    @Column()
    apartment: string;

    @ManyToOne(() => User, user => user.deliveryAddresses)
    user: User;

   
}



