import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' }) // onDelete: 'CASCADE' is used to delete the profile when the user's foreign key is deleted
    @JoinColumn() // user_id is created here because of the @JoinColumn() annotation
    user: User;

    @Column()
    name: string;
        
}