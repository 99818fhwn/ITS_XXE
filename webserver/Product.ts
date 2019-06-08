export class Product {
    id: number;
    fridge_id: number;
    start_weight: number;
    current_weight: number;
    expire_date: string;
    constructor(id: number, fridge_id: number, start_weight: number, 
        current_weight: number, expire_date: string) {
        this.id = id;
        this.fridge_id = fridge_id;
        this.start_weight = start_weight;
        this.current_weight = current_weight;
        this.expire_date = expire_date;
    }
}
