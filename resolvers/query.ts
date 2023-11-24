import { Pet } from "../types.ts"; 
import { GraphQLError } from "graphql"; 
import { PetModel } from "../pet.ts"; 

export const Query = {
    pets: async (_parent: unknown, args: {breed?: string}): Promise<Pet[]> => {
        try{
            if(args.breed){ 
                const p = await PetModel.find({breed: args.breed}).exec(); 
                if (!p) {
                    throw new GraphQLError(`No pet found`, {
                      extensions: { code: "NOT_FOUND" },
                    });
                    }
                
                const pets = p.map((pet) => { 
                    return {
                        id: pet.id,
                        name: pet.name,
                        breed: pet.breed,
                    }
                })
    
                return pets;
            }
            const p = await PetModel.find().exec(); 
            if (!p) {
                throw new GraphQLError(`No pet found`, {
                  extensions: { code: "NOT_FOUND" },
                });
                }
        
            const pets = p.map((pet) => { 
                return {
                    id: pet.id,
                    name: pet.name,
                    breed: pet.breed,
                }
            })
            return pets;
    
    }
    catch(err){
        throw new GraphQLError(err.message);
    }
    },
    pet: async (_parent: unknown, args: { id: string }) => {
        try{
        const pet = await PetModel.findById({_id: args.id}).exec();
        if (!pet) {
            throw new GraphQLError(`No pet found with id ${args.id}`, {
              extensions: { code: "NOT_FOUND" },
            });
            }
        return {
        id: pet._id.toString(),
        name: pet.name,
        breed: pet.breed,
        };
    }catch(err){
        throw new GraphQLError(err.message);
    }
    }

    };