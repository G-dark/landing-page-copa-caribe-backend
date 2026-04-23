import { SignedPeople, SignedPeopleType } from "./signedpeople.model.js";

export const updateASigned = async (id: string, signed: SignedPeopleType) => {

    const updated = await SignedPeople.findOneAndUpdate({id}, {$set: signed})

    if(updated){
        return {success: "Signed Person updated"}
    } else {
        return {error: "Can't update"}
    }
};
