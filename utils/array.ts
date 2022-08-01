import User from "../models/user";

const arrayUtil = {
    async deleteJsonKey(jsonArray: any, target: string) {
        jsonArray[target] = undefined;
        return jsonArray;
    },
    async paramValidation(paramList: any, requireList: any) {
        for (const requirement of requireList) {
            if (requirement in paramList == false) {
                return false;
            }
        }
        return true;
    },
    async sortingNameList(nameList: Array<User>){
        nameList.sort(function(a, b) {
            return a.userName < b.userName ? -1 : a.userName > b.userName ? 1 : 0;
        });
        return nameList;
    }
};

export default arrayUtil;