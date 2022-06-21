import PromisingModel from '../../models/promising';
import CategoryKeyword from '../../models/category-keyword';

export class PromisingResponse {
    id: number;
    promisingName: string;
    ownerId: number;
    minTime: Date;
    maxTime: Date;
    category: CategoryKeyword | any;

    constructor(promising: PromisingModel) {
        this.id = promising.id;
        this.promisingName = promising.promisingName;
        this.ownerId = promising.ownerId;
        this.minTime = promising.minTime;
        this.maxTime = promising.maxTime;
        this.category = promising.categoryId;
    }


}
