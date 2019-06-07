import * as mysql from 'mysql';

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smarthomedb' ////Hier den namen der DB eintragen!
});

export class Fridge
{
    id : number;
    home_id : number;

    tempSensor: number;
    isOn : boolean;
    products : Product[];
    
    
    constructor(id : number, home_id : number) 
    {
        this.id = id;
        this.home_id = home_id;

        this.tempSensor  = 12; // random temp
        // if temp changes more than for 1 degree updates the db ?
        this.isOn = true;


        connection.connect();

        this.getProducts().then(function(v)
        {
            //this.products = v;
            console.log("2");
        }); // get all products from db with this fridge id

        //console.log(this.products);
    }


    public doubleQuote(input : string): string 
    {
        return "'" + input + "'";
    }

    private async getProducts()
    {
        var res = await this.getProductsFromDB();
        return res;
        /*return new Promise(resolve => 
            {
              resolve(res);
            })*/
    }

    private async getProductsFromDB()
    {
        let res : Product[];

        connection.query('SELECT * FROM products WHERE fridge_id = ' + this.id, function (err, rows, fields) {
            if (err) {
                //res.status(400).send("error");
                throw err;
            }
            else {
                console.log("1");
                console.log("Rows:\n");
                console.log(rows);
                res = rows;
                /*if (rows.length == 1) {
                    res.status(409).send("Username is already taken.");
                    return;

                }*/
                //INSERT INTO `users`(`user_id`, `name`, `password`, `uuid`, `home_id`, `is_admin`) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5],[value-6])
                //INSERT INTO`users`(`name`, `password`, `home_id`) VALUES('1marvin', 'marvin', 2)
                /*else {
                    connection.query('INSERT INTO `users`(`name`, `password`, `home_id`) VALUES(' 
                    + username + ',' + password + ',' + 1 + ')', 
                    function (err1, rows1, fields) {
                        if (err1) {                                                                                                 //// Care always home_id 1 should be changed
                            res.status(400).send("error");
                            throw err1;
                        }
                        else {
                            res.status(200).send("Succesfully registered.");
                            return;
                        }
                    });
                }*/
            }
        });

        return res;
    }

}

class Product
{
    id : number;
    fridge_id : number;
    start_weight : number;
    current_weight : number;
    expire_date : Date;
}

new Fridge(1, 1);