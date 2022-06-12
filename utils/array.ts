
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
    }
};

export default arrayUtil;