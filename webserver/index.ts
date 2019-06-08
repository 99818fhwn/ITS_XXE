import * as express from "express";
import * as path from "path";
import * as uuid4 from "uuidv4";
import * as mysql from 'mysql';
<<<<<<< HEAD
import { UserViewModel } from "./UserViewModel";
=======
import * as bodyParser from 'body-parser';
import { Product } from "./Product";
>>>>>>> ee67f39d32f70cb64e40fcf4edc6d6f92e7610e0

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smarthomedb' ////Hier den namen der DB eintragen!
});

export class Server {
    public app: express.Application;
    public dateTime: Date;

    constructor() {
        this.app = express();
        this.dateTime = new Date();
        connection.connect();

        this.app.use(express.static(path.join(__dirname, "SmartHomeUI/dist/SmartHomeUI")));  // http://expressjs.com/en/starter/static-files.html
        this.app.use(this.logRequest.bind(this));                              // http://expressjs.com/en/guide/writing-middleware.html
        this.app.use(bodyParser.text().bind(this));
        //this.app.use(this.authorize.bind(this));
        this.app.use(this.authorize.bind(this));
        //this.app.use("/revalidate/:token", this.logInStillValid.bind(this));
        this.app.get("/login/:usr.:pwd", this.loginRequest.bind(this));
        this.app.get("/register/:usr.:pwd", this.registerRequest.bind(this));
<<<<<<< HEAD
        this.app.get("/mainpage/users", this.getUsers.bind(this));
=======
            
        this.app.post("/products/:fridgeid", this.productsRequest.bind(this));

        this.app.get("/isOn/:fridgeid.:isOn", this.isOnRequest.bind(this));
        this.app.get("/setTemperature/:fridgeid.:temp", this.setTemperatureRequest.bind(this));
>>>>>>> ee67f39d32f70cb64e40fcf4edc6d6f92e7610e0
        // this.app.get("/logout", this.logoutRequest.bind(this));
        this.app.listen(4200);
    }

    private productsRequest(req: express.Request, res: express.Response) {
        
        var DOMParser = require('xmldom').DOMParser;
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(req.body, "text/xml");

        let l = xmlDoc.getElementsByTagName("product").length;


        //let products : Product[] = [];
        let responses = [];

        for(let i = 0; i < l; i++)
        {
            let id :string = xmlDoc.getElementsByTagName("id")[i].childNodes[0].nodeValue;
            let fridge_id :string = xmlDoc.getElementsByTagName("fridge_id")[i].childNodes[0].nodeValue;
            let start_weight :string = xmlDoc.getElementsByTagName("start_weight")[i].childNodes[0].nodeValue;
            let current_weight :string = xmlDoc.getElementsByTagName("current_weight")[i].childNodes[0].nodeValue;
            let expire_date : string = xmlDoc.getElementsByTagName("expire_date")[i].childNodes[0].nodeValue;

            console.log("dt: " + expire_date);
            //console.log(parseInt(id) + " " + parseInt(fridge_id) + " " + parseInt(start_weight) + " " +
            //parseInt(current_weight) + " " + expire_date);

            //let p = new Product(parseInt(id), parseInt(fridge_id), parseInt(start_weight), parseInt(current_weight), expire_date.to);
            //products[i] = p;


            connection.query('SELECT * FROM products WHERE product_id = ' + id + ' and fridge_id = ' + fridge_id, 
            function (err, rows, fields) {
                console.log(rows);
                if (err) {
                    res.status(400).send("error");
                    throw err;
                }
                else {
                    console.log("rows: " + rows);
                    if (rows.length == 1) {
                        console.log("pr exists");
                        connection.query('UPDATE products SET current_weight = ' + current_weight + 
                        ' where product_id = ' + id + ' and fridge_id = ' + fridge_id, 
                            function (err1, rows1, fields) {
                                    if (err1) {
                                        throw err1;
                                    }
                                    else {
                                        responses.push(current_weight);
                                        return;
                                    }
                            });
                    }
                    else{
                        console.log("pr dsnt exist");
                        var qs = 'INSERT INTO products (product_id, fridge_id, start_weight, current_weight, expire_date)' +
                        ' VALUES(' + id + ', ' + fridge_id + ', ' + start_weight + ', ' + current_weight + ', \'' + expire_date + '\')';
                        console.log(qs);
                        connection.query(qs
                            , 
                            function (err1, rows1, fields) {
                                    if (err1) {
                                        throw err1;
                                    }
                                    else {
                                        responses.push(current_weight+expire_date);
                                        return;
                                    }
                            });
                    }
                }
            
            });
        }  

        res.send(responses);
    }

    private isOnRequest(req: express.Request, res: express.Response) {
        const isOn = this.doubleQuote(req.params.isOn);
        const fridgeid = this.doubleQuote(req.params.fridgeid);

        console.log('fridge_id: ' + fridgeid + ' isOn: ' + isOn);

        connection.query('SELECT * FROM fridges WHERE fridge_id = ' + fridgeid, function (err, rows, fields) {
            if (err) {
                res.status(400).send("isOn coulnt be set.");
                throw err;
            }
            else {
                console.log(rows);
                connection.query('UPDATE fridges SET is_on = ' + isOn + ' where fridge_id = ' + fridgeid, 
                function (err1, rows1, fields) {
                        if (err1) {
                            throw err1;
                        }
                        else {
                            res.send(isOn);
                            return;
                        }
                });
            }
        });
        //connection.end();
    }

    private setTemperatureRequest(req: express.Request, res: express.Response) {
        const temp = this.doubleQuote(req.params.temp);
        const fridgeid = this.doubleQuote(req.params.fridgeid);

        console.log('fridge_id: ' + fridgeid + ' temp: ' + temp);

        connection.query('SELECT * FROM fridges WHERE fridge_id = ' + fridgeid, function (err, rows, fields) {
            if (err) {
                res.status(400).send("Temperature coulnt be set.");
                throw err;
            }
            else {
                console.log(rows);
                connection.query('UPDATE fridges SET temperature = ' + temp + ' where fridge_id = ' + fridgeid, 
                function (err1, rows1, fields) {
                        if (err1) {
                            throw err1;
                        }
                        else {
                            res.send(temp);
                            return;
                        }
                });
            }
        });
        //connection.end();
    }



    // private async getProductsFromDB()
    // {
    //     let res : Product[];

    //     connection.query('SELECT * FROM products WHERE fridge_id = ' + this.id, function (err, rows, fields) {
    //         if (err) {
    //             //res.status(400).send("error");
    //             throw err;
    //         }
    //         else {
    //             console.log("1");
    //             console.log("Rows:\n");
    //             console.log(rows);
    //             res = rows;
    //         }
    //     });

    //     return res;
    // }

    // private logInStillValid(req: express.Request, res: express.Response) {
    //     const token = req.params.token;

    //     for (const user of this.registeredUsers) {
    //         if (user.uuid == token) {
    //             res.send("true");
    //             return;
    //         }
    //     }

    //     res.send(404);
    // }

    // Checks if users is registered and sends new uuid.
    // example get: http://localhost:4200/login/lisa.password 
    private loginRequest(req: express.Request, res: express.Response) {
        const username = this.doubleQuote(req.params.usr);
        const password = this.doubleQuote(req.params.pwd);

        // console.log(username + ' and the ' + password);

        connection.query('SELECT * FROM users WHERE password = ' + password + ' and name = ' + username, function (err, rows, fields) {
            if (err) {
                res.status(400).send("Login failed.");
                throw err;
            }
            else {
                console.log(rows);
                if (rows.length == 1) {
                    console.log('The solution is: ' + rows[0].uuid);
                    var uuid = uuid4();
                    var uuids = "'" + uuid + "'";
                    connection.query('UPDATE users SET uuid = ' + uuids + ' where name = ' + username + ' and password = ' + password, function (err1, rows1, fields) {
                        if (err1) {
                            throw err1;
                        }
                        else {
                            res.send(uuid + "+//+" + rows[0].is_admin);
                            return;
                        }
                    });
                }
                else {
                    res.status(400).send("Login failed.");
                }
            }
        });
        //connection.end();
    }

    public doubleQuote(input): string {
        return "'" + input + "'";
    }

    // For every request checking the valid token.
    private authorize(req: express.Request, res: express.Response, next: express.NextFunction) {
        // If login or register is requested.
        console.log("authorizing:");
        if ((req.url.search("login") == 1) || (req.url.search("register") == 1)) {
            next();
            console.log("login or register was requested");
        } else {
            if (req.header("Authorization") == null) {
                res.status(401).send("Unauthorized");
                return;
            } else {
                var qs = 'SELECT * FROM users WHERE uuid = ' + this.doubleQuote(req.header("Authorization"));
                console.log(qs);
                connection.query(qs, function (err, rows, fields) {
                    if (err) {
                        res.status(400).send("Authorisation failed.");
                        console.log("Authorisation failed.")
                        throw err;
                    }
                    else {
                        if (rows.length == 1) {
                            next();
                            console.log(rows);
                        }
                        else {
                            res.status(401).send("Unauthorized");
                            console.log("unautorized nothing found");
                            return;
                        }
                    }
                });
            }
        }
    }


    private getUsers(req: express.Request, res: express.Response) {
        // If login or register is requested.
        console.log("editing:");

        var tokens = this.doubleQuote(req.header("Authorization"));

        if (req.header("Authorization") == null) {
            res.status(401).send("Unauthorized");
            return;
        } else {
            var qs = 'SELECT * FROM users WHERE uuid = ' + tokens + 'and is_admin = 1';
            console.log(qs);
            connection.query(qs, function (err, rows, fields) {
                if (err) {
                    res.status(400).send("Unauthorized you do not have admin priviledges.");
                    console.log("Authorisation failed.")
                    throw err;
                }
                else {
                    var qs2 = 'SELECT * FROM users WHERE home_id = ' + rows[0].home_id + ' and ( uuid is null or Not uuid = ' + tokens + ' )';
                    console.log(qs2);
                    connection.query(qs2, function (err, rows2, fields2) {
                        console.log(rows2);
                        var users: UserViewModel[] = []

                        if (rows2.length > 0) {
                            rows2.forEach(userrow => {
                                users.push(new UserViewModel(userrow.name, userrow.user_id, userrow.is_admin));
                            });
                            res.status(200).send(JSON.stringify(users));
                        }
                        else {
                            res.status(400).send("Nothing found here :(, you might be lonely.");
                        }
                    });
                }
            });
        }
    }

    // Registers a user by name and password then sends corresponding statuscode.
    // example: http://localhost:4200/register/gunter.pw ::::: BUT home id is not changable in this case 
    private registerRequest(req: express.Request, res: express.Response) {
        const username: string = this.doubleQuote(req.params.usr);
        const password: string = this.doubleQuote(req.params.pwd);

        let hmm = this.getDateString();

        connection.query('SELECT * FROM users WHERE name = ' + username, function (err, rows, fields) {
            if (err) {
                res.status(400).send("error");
                throw err;
            }
            else {
                console.log(rows);
                if (rows.length == 1) {
                    res.status(409).send("Username is already taken.");
                    return;

                }
                //INSERT INTO `users`(`user_id`, `name`, `password`, `uuid`, `home_id`, `is_admin`) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5],[value-6])
                //INSERT INTO`users`(`name`, `password`, `home_id`) VALUES('1marvin', 'marvin', 2)
                else {
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
                }
            }
        });
    }

    // // Checks for the uuid and removes the current from the active user.
    // private logoutRequest(req: express.Request, res: express.Response) {
    //     const uuid: string = req.header("Authorization");

    //     for (const user of this.registeredUsers) {
    //         if (user.uuid === uuid) {
    //             user.uuid = null;
    //             console.log("Logout request was succesfull");
    //         }
    //     }

    //     res.send(200, "Logout successful");
    // }


    private getDateString(): string {
        let dd = this.dateTime.getUTCDate();
        let mm = this.dateTime.getUTCMonth();
        let yyyy = this.dateTime.getUTCFullYear();
        let hh = this.dateTime.getUTCHours();
        let minmin = this.dateTime.getUTCMinutes();
        let finalDate = dd + "." + mm + "." + yyyy + " [" + hh + ":" + minmin + "]"
        return finalDate;
    }

    private logRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log(req.url);
        next();
    }
}

new Server();