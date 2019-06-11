export class LightViewModel {

    public light_name: string;
    public is_on: string;
    public id: string;

    constructor(is_on, light_name, id) {
        this.is_on = is_on;
        this.light_name = light_name;
        this.id = id;
    }
}