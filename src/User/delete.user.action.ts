import User from "./user.model.js";

export const deleteAUser = async (username:string) => {
    const deleted = await User.findOneAndDelete({username});

    if(deleted){
        return {success: "User deleted successfully"}
    } else {
        return {error: "That user doesn't exist"}
    }
}