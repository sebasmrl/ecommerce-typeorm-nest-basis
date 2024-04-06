import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

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

    //un producto puede tener muchas imagenes
    @OneToMany(
        ()=> ProductImage,
        (productImage)=>productImage.product,
        { cascade: true, eager:true } 
    )
    images?:ProductImage[];
    //eager: true carga automaicamente todas las entidades que estan relacionadas 
    //todos los find lo tienen, pero esta deshabilitada para las queryBuilder, se debe usar leftJoinAndSelect para cargar la relación.
    


    
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
