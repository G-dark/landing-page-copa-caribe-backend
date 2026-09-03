import { SignedPeople, SignedPeopleType } from "./signedpeople.model.js";

export const makeASigned = async (signed: SignedPeopleType) => {
  const find = await SignedPeople.find({ id: signed.id });

  const newSigned = new SignedPeople(signed);

  if (find.length == 0) {
    const created = await newSigned.save();

    if (created) {
      return { success: "registered people" };
    } else {
      return { error: "Failed to register people" };
    }
  } else {
    return { error: "That person already exists" };
  }
};
