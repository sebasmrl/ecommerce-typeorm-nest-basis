import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{ unique: true}) //add contrains
    title:string;

    @Column('float', { default:0 })
    price:number;

    @Column({ type:'text', nullable:true})
    description:string;

    @Column({ type:'text', unique:true})
    slug:string;

    @Column({type:'int', default:0})
    stock:number;

    @Column('text',{ array:true})
    sizes:string[];

    @Column({ type:'text'})
    gender:string;

    @Column('text',{ array:true, default:[] })
    tags:string[]
    //images

    
    @BeforeInsert()
    checkSlugProperty(){
        if(!this.slug) this.slug = this.title;
          
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'","");
    }

    @BeforeUpdate()
    checkUpdateSlugProperty(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'","");
    
    }

}
