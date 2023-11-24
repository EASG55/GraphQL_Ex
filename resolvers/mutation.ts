import { GraphQLError } from "graphql"; 
import { PetModel } from "../pet.ts"; 

export const Mutation = {
    addPet: async (_parents: unknown, args: {name: string; breed: string },) => {
        try {
            if(!args.name || !args.breed){
                throw new GraphQLError("missing name and/or breed", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }

        const newPet = new PetModel({ name: args.name, breed: args.breed});
        await newPet.save();
        return {
            id: newPet._id.toString(),
            name: newPet.name,
            breed: newPet.breed,
        };
    }catch(error){
            console.error(error);
            throw new GraphQLError(`error on save ${args.name}`, {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
    },
    deletePet: async (_parents: unknown, args: { id: string }) => {
        try {
        const pet = await PetModel.findByIdAndDelete(args.id).exec();
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
    }catch(error){
            console.error(error);
            throw new GraphQLError(`error on delete`, {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
    },
    updatePet: async (_parents: unknown, args: { id: string; name: string; breed: string },) => {
        try {
            if(!args.name || !args.breed){
                throw new GraphQLError("missing name and/or breed", {
                    extensions: { code: "BAD_USER_INPUT" },
                });
            }
        const newPet = await PetModel.findByIdAndUpdate(args.id, { name: args.name, breed: args.breed }, { new: true },
        );
        if (!newPet) {
            throw new GraphQLError(`No pet found with id ${args.id}`, {
            extensions: { code: "NOT_FOUND" },
            });
        }
        
        return {
            id: newPet._id.toString(),
            name: newPet.name,
            breed: newPet.breed,
        };
        
    }catch(error){
        console.error(error);
        throw new GraphQLError(`error on update`, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
    }
},
};
    