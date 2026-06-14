import { SignedPeople, SignedPeopleType } from "./signedpeople.model.js";

export const readSigned = async (id?: string, query?: any) => {
  let signed;
  if (id) {
    signed = await SignedPeople.find({ id });
  } else if (query) {
    if (query.date) {
      const { date, ...restQuery } = query;
      if (date == "15") {
        const FifteenDaysAgo = new Date();
        FifteenDaysAgo.setDate(FifteenDaysAgo.getDate() - 15);
        signed = await SignedPeople.find({
          date: { $gte: FifteenDaysAgo },
          ...restQuery,
        }).exec();
      } else if (date == "30") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        signed = await SignedPeople.find({
          date: { $gte: thirtyDaysAgo },
          ...restQuery,
        }).exec();
      } else if (date == "1y") {
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);
        signed = await SignedPeople.find({
          date: { $gte: oneYearAgo },
          ...restQuery,
        }).exec();
      } else {
        signed = await SignedPeople.find(query).exec();
      }
    } else {
      signed = await SignedPeople.find(query).exec();
    }
  } else {
    signed = await SignedPeople.find();
  }

  if (signed.length > 0) {
    return signed.map((signed) => {
      return transform2Signed(signed);
    });
  } else {
    return { error: "There are not signed people" };
  }
};

export const transform2Signed = (signed: any): SignedPeopleType => {
  return {
    id: signed.id,
    name: signed.name,
    lastName: signed.lastName,
    tel: signed.tel,
    email: signed.email,
    teamName: signed.teamName,
    oneCat: signed.oneCat,
    multiplesCat: signed.multipleCat,
    date: signed.date,
    fase: signed.fase,
    cargo:signed.cargo
  };
};
