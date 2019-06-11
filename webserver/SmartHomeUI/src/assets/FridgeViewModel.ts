export class FridgeViewModel {

    public fridge_id: string;
    public temperatur: string;
    public is_on: string;

    constructor(fridgeid: string, temperatur: string, is_on: string) {
        this.fridge_id = fridgeid;
        this.temperatur = temperatur;
        this.is_on = is_on;
    }
}