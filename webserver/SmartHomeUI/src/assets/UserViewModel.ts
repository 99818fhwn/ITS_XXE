export class UserViewModel {

    public name;
    public id;
    public isadmin;

    constructor(name: string, id: string, isadmin: string) {
        this.name = name;
        this.id = id;
        this.isadmin = isadmin;
    }
}