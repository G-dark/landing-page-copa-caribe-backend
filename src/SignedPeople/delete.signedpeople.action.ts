import { SignedPeople } from "./signedpeople.model.js";

export const deleteASigned = async(id: string) => {
    const deleted = await SignedPeople.findOneAndDelete({id});

    if (deleted) {
    return { success: "Signed person deleted successfully" };
  } else {
    return { error: "Person not found" };
  }
};
