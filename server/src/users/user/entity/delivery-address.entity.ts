import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { User } from "./user.entity";

@Entity('delivery_addresses')
@Index(['userId'])
@Index(['isDefault'])
@Index(['createdAt'])
@Index(['userId', 'isDefault'])
export class DeliveryAddress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        type: 'varchar', 
        length: 100,
        comment: 'Имя получателя'
    })
    firstName: string;

    @Column({ 
        type: 'varchar', 
        length: 100,
        comment: 'Фамилия получателя'
    })
    lastName: string;

    @Column({ 
        type: 'varchar', 
        length: 100,
        nullable: true,
        comment: 'Отчество получателя'
    })
    patronymic: string | null;

    @Column({ 
        type: 'varchar', 
        length: 10,
        comment: 'Код страны'
    })
    phoneCode: string;

    @Column({ 
        type: 'varchar', 
        length: 20,
        comment: 'Номер телефона'
    })
    phone: string;

    @Column({ 
        type: 'varchar', 
        length: 100,
        comment: 'Регион/область'
    })
    region: string;

    @Column({ 
        type: 'varchar', 
        length: 100,
        comment: 'Город'
    })
    city: string;

    @Column({ 
        type: 'varchar', 
        length: 200,
        comment: 'Улица'
    })
    street: string;

    @Column({ 
        type: 'varchar', 
        length: 50,
        comment: 'Строение/корпус'
    })
    building: string;

    @Column({ 
        type: 'varchar', 
        length: 50,
        comment: 'Дом'
    })
    house: string;

    @Column({ 
        type: 'varchar', 
        length: 50,
        comment: 'Квартира'
    })
    apartment: string;

    @Column({ 
        type: 'varchar', 
        length: 10,
        comment: 'Почтовый индекс'
    })
    postalCode: string;

    @Column({ 
        type: 'text',
        nullable: true,
        comment: 'Дополнительная информация'
    })
    additionalInfo: string | null;

    @Column({ 
        type: 'boolean',
        default: false,
        comment: 'Адрес по умолчанию'
    })
    isDefault: boolean;

    @Column({ 
        type: 'varchar',
        length: 100,
        comment: 'Название адреса (например: "Дом", "Работа")'
    })
    addressName: string;

    @ManyToOne(() => User, user => user.deliveryAddresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

        @Column({ name: 'user_id' })
    userId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}



