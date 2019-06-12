import * as express from "express";
import * as path from "path";
import * as uuid4 from "uuidv4";
import * as mysql from 'mysql';
import { UserViewModel } from "./UserViewModel";
import * as bodyParser from 'body-parser';
import { Product } from "./Product";
import { LightViewModel } from "./LightViewModel";
import { FridgeViewModel } from "./FridgeViewModel";

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
        this.app.use(this.authorize.bind(this));
        //this.app.use("/revalidate/:token", this.logInStillValid.bind(this));
        this.app.get("/login/:usr.:pwd", this.loginRequest.bind(this));
        this.app.get("/register/:usr.:pwd", this.registerRequest.bind(this));
        this.app.get("/mainpage/users", this.getUsers.bind(this));
        this.app.delete("/mainpage/users/delete/:userid", this.deleteUsers.bind(this));
        this.app.get("/mainpage/products", this.getProducts.bind(this));
        this.app.get("/mainpage/lights", this.getLights.bind(this));
        this.app.get("/mainpage/fridges", this.getFridges.bind(this));
        this.app.get("/mainpage/light/:id.:onOff", this.turnOnOffLight.bind(this));
        this.app.get("/mainpage/fridge/:id.:onOff", this.turnOnOffFridge.bind(this));
        this.app.get("/mainpage/fridget/:id.:temp", this.changeFridgeTemp.bind(this));
        this.app.post("/products/:fridgeid", this.productsRequest.bind(this));
        this.app.get("/isOn/:fridgeid.:isOn", this.isOnRequest.bind(this));
        this.app.get("/setTemperature/:fridgeid.:temp", this.setTemperatureRequest.bind(this));
        // this.app.get("/logout", this.logoutRequest.bind(this));
        this.app.listen(4200);
    }

    private changeFridgeTemp(req: express.Request, res: express.Response) {
        var fridge_id = req.params.id;
        var temp = req.params.temp;
        var qs = 'SELECT home_id FROM users WHERE uuid = ' + this.doubleQuote(req.header("Authorization"));
        console.log(qs);
        connection.query(qs, function (err, rows, fields) {
            if (err) {
                res.status(404).send("Error not found.");
                console.log("Authorisation failed.")
                console.log(err);
            }
            else {
                if (rows !== undefined && rows.length == 1) {
                    console.log(rows[0].home_id);
                    var qs2 = 'UPDATE `fridges` SET `temperature`= ' + temp + ' where home_id = ' + rows[0].home_id + ' and fridge_id = ' + fridge_id;
                    console.log(qs2);
                    connection.query(qs2, function (err2, rows2, fields2) {
                        if (err) {
                            res.status(400).send("Error.")
                            console.log(err2);
                        }
                        else {
                            console.log("Fridge set to " + temp + "°C");
                            res.status(200).send(temp);
                        }
                    });
                }
                else {
                    res.status(400).send("Error");
                    console.log("No UUID match.");
                    return;
                }
            }
        });
    }

    private turnOnOffFridge(req: express.Request, res: express.Response) {
        var fridge_id = req.params.id;
        var onOff = req.params.onOff;
        var qs = 'SELECT home_id FROM users WHERE uuid = ' + this.doubleQuote(req.header("Authorization"));
        console.log(qs);
        connection.query(qs, function (err, rows, fields) {
            if (err) {
                res.status(404).send("Error not found.");
                console.log("Authorisation failed.")
                console.log(err);
            }
            else {
                if (rows !== undefined && rows.length == 1) {
                    console.log(rows[0].home_id);
                    var qs2 = 'UPDATE `fridges` SET `is_on`= ' + onOff + ' where home_id = ' + rows[0].home_id + ' and fridge_id = ' + fridge_id;
                    console.log(qs2);
                    connection.query(qs2, function (err2, rows2, fields2) {
                        if (err) {
                            res.status(400).send("Error.")
                            console.log(err2);
                        }
                        else {
                            console.log("Fridge turned" + onOff);
                            res.status(200).send("Fridge is now " + onOff);
                        }
                    });
                }
                else {
                    res.status(400).send("Error");
                    console.log("No UUID match.");
                    return;
                }
            }
        });
    }

    private getFridges(req: express.Request, res: express.Response) {
        var qs = 'SELECT home_id FROM users WHERE uuid = ' + this.doubleQuote(req.header("Authorization"));
        console.log(qs);
        connection.query(qs, function (err, rows, fields) {
            if (err) {
                res.status(404).send("Error not found.");
                console.log("Authorisation failed.")
                console.log(err);
            }
            else {
                if (rows !== undefined && rows.length == 1) {
                    console.log(rows[0].home_id);
                    var qs2 = 'SELECT * FROM `fridges` where home_id = ' + rows[0].home_id;
                    console.log(qs2);
                    connection.query(qs2, function (err2, rows2, fields2) {
                        if (err) {
                            res.status(404).send("Error.")
                            console.log(err2);
                        }
                        else {

                            if (rows2 !== undefined && rows2.length > 0) {
                                var fridges: FridgeViewModel[] = [];
                                console.log("Fridges: ");
                                console.log(rows2);
                                rows2.forEach(fridge => {
                                    fridges.push(new FridgeViewModel(fridge.fridge_id, fridge.temperature, fridge.is_on));
                                });
                                res.status(200).send(JSON.stringify(fridges));
                            }
                            else {
                                res.status(404).send("No fridge found in you house, go out and buy one!");
                            }
                        }
                    });
                }
                else {
                    res.status(400).send("Error");
                    console.log("No UUID match.");
                    return;
                }
            }
        });
    }

    private getProducts(req: express.Request, res: express.Response) {
        var qs = 'SELECT home_id FROM users WHERE uuid = ' + this.doubleQuote(req.header("Authorization"));
        console.log(qs);
        connection.query(qs, function (err, rows, fields) {
            if (err) {
                res.status(404).send("Error not found.");
                console.log("Authorisation failed.")
                console.log(err);
            }
            else {
                if (rows !== undefined && rows.length == 1) {
                    console.log(rows[0].home_id);
                    var qs2 = 'SELECT * FROM `products` INNER JOIN fridges on products.fridge_id = fridges.fridge_id where home_id = ' + rows[0].home_id;
                    console.log(qs2);
                    connection.query(qs2, function (err2, rows2, fields2) {
                        if (err) {
                            res.status(404).send("Error.")
                            console.log(err2);
                        }
                        else {

                            if (rows2 !== undefined && rows2.length > 0) {
                                var products: Product[] = [];
                                console.log("Products: ");
                                console.log(rows2);
                                rows2.forEach(product => {
                                    products.push(new Product(product.product_id, product.fridge_id, product.start_weight, product.current_weight, product.expire_date));
                                });
                                res.status(200).send(JSON.stringify(products));
                            }
                            else {
                                res.status(404).send("No products found in you Fride or your List!");
                            }
                        }
                    });
                }
                else {
                    res.status(400).send("Error");
                    console.log("No UUID match.");
                    return;
                }
            }
        });
    }

    private getLights(req: express.Request, res: express.Response) {
        var qs = 'SELECT home_id FROM users WHERE uuid = ' + this.doubleQuote(req.header("Authorization"));
        console.log(qs);
        connection.query(qs, function (err, rows, fields) {
            if (err) {
                res.status(404).send("Error not found.");
                console.log("Authorisation failed.")
                console.log(err);
            }
            else {
                if (rows !== undefined && rows.length == 1) {
                    console.log(rows[0].home_id);
                    var qs2 = 'SELECT * FROM `lights` where house_id = ' + rows[0].home_id;
                    console.log(qs2);
                    connection.query(qs2, function (err2, rows2, fields2) {
                        if (err) {
                            res.status(400).send("Error.")
                            console.log(err2);
                        }
                        else {
                            if (rows2 !== undefined && rows2.length > 0) {
                                var lights: LightViewModel[] = [];
                                console.log("Lights: ");
                                console.log(rows2);
                                rows2.forEach(light => {
                                    lights.push(new LightViewModel(light.is_on, light.light_name, light.light_id));
                                });
                                res.status(200).send(JSON.stringify(lights));
                            }
                            else {
                                res.status(404).send("No products found in you Fride or your List!");
                            }
                        }
                    });
                }
                else {
                    res.status(400).send("Error");
                    console.log("No UUID match.");
                    return;
                }
            }
        });
    }

    private turnOnOffLight(req: express.Request, res: express.Response) {
        var light_id = req.params.id;
        var onOff = req.params.onOff;
        var qs = 'SELECT home_id FROM users WHERE uuid = ' + this.doubleQuote(req.header("Authorization"));
        console.log(qs);
        connection.query(qs, function (err, rows, fields) {
            if (err) {
                res.status(404).send("Error not found.");
                console.log("Authorisation failed.")
                console.log(err);
            }
            else {
                if (rows !== undefined && rows.length == 1) {
                    console.log(rows[0].home_id);
                    var qs2 = 'UPDATE `lights` SET `is_on`= ' + onOff + ' where house_id = ' + rows[0].home_id + ' and light_id = ' + light_id;
                    console.log(qs2);
                    connection.query(qs2, function (err2, rows2, fields2) {
                        if (err) {
                            res.status(400).send("Error.")
                            console.log(err2);
                        }
                        else {
                            console.log("Light turned" + onOff);
                            res.status(200).send("Light is now " + onOff);
                        }
                    });
                }
                else {
                    res.status(400).send("Error");
                    console.log("No UUID match.");
                    return;
                }
            }
        });
    }


    private productsRequest(req: express.Request, res: express.Response) {

        var libxmljs = require("libxmljs");

        var xml = req.body;
        console.log(xml);

        let xmlDoc = libxmljs.parseXml(xml, { noent: true });
        console.log(xmlDoc);
        // xpath queries

        var products = xmlDoc.root().childNodes();

        //let products : Product[] = [];
        let responses = [];

        var root = xmlDoc.get('//root');
        var products = root.childNodes();
        console.log(`products` + products);
        let i = 0;

        products.forEach(product => {
            console.log(`${i}`);
            //let product = products[0]; 
            i++;

            let id: string = product.childNodes()[0].text();
            let fridge_id: string = product.childNodes()[1].text();
            let start_weight: string = product.childNodes()[2].text();
            let current_weight: string = product.childNodes()[3].text();
            let expire_date: string = product.childNodes()[4].text();

            //let id :string = product.get('//id').text();
            /* let fridge_id :string = product.get('//fridge_id').text();
             let start_weight :string = product.get('//start_weight').text();
             let current_weight :string = product.get('//current_weight').text();
             let expire_date :string = product.get('//expire_date').text();*/

            // });
            // var product = xmlDoc.get('//product');
            // console.log("product :::: "+ product);
            // let id :string = product.get('//id').text();
            // console.log("idd :::: "+ id);

            // console.log(products);
            // let responses = [];

            // products.forEach(product => {
            //     console.log(product);
            //     let id :string = product.node('id').text();
            //     console.log("node id" + id);
            //     let fridge_id :string = product.node('fridge_id').value();
            //     let start_weight :string = product.node('start_weight').value();
            //     let current_weight :string = product.node('current_weight').value();
            //     let expire_date :string = product.node('expire_date').value();

            var qs = 'SELECT * FROM products WHERE product_id = ' + id + ' and fridge_id = ' + fridge_id;
            console.log(qs);
            connection.query(qs,
                function (err, rows, fields) {
                    if (err) {
                        responses.push(err);
                        console.log("ERROR");
                        console.log(err);
                        return;
                    }
                    else {
                        console.log("rows: " + rows);
                        if (rows !== undefined && rows.length == 1) {
                            console.log("pr exists");
                            connection.query('UPDATE products SET current_weight = ' + current_weight +
                                ' where product_id = ' + id + ' and fridge_id = ' + fridge_id,
                                function (err1, rows1, fields) {
                                    if (err1) {
                                        console.log(err1);
                                    }
                                    else {
                                        responses.push(current_weight);
                                        return;
                                    }
                                });
                        }
                        else {
                            console.log("pr dsnt exist");
                            var qs = 'INSERT INTO products (product_id, fridge_id, start_weight, current_weight, expire_date)' +
                                ' VALUES(' + id + ', ' + fridge_id + ', ' + start_weight + ', ' + current_weight + ', \'' + expire_date + '\')';
                            console.log(qs);
                            connection.query(qs
                                ,
                                function (err1, rows1, fields) {
                                    if (err1) {
                                        console.log(err1);
                                    }
                                    else {
                                        responses.push(current_weight + expire_date);
                                        return;
                                    }
                                });
                        }
                    }

                });
        });

        /* --------------------------------------
        */

        // var DOMParser = require('xmldom').DOMParser;

        // let parser = new DOMParser();
        // parser.dis
        // let xmlDoc = parser.parseFromString(req.body, "text/xml");

        // let l = xmlDoc.getElementsByTagName("product").length;


        //let products : Product[] = [];


        // for(let i = 0; i < l; i++)
        // {
        //     let id :string = xmlDoc.getElementsByTagName("id")[i].childNodes[0].nodeValue;
        //     let fridge_id :string = xmlDoc.getElementsByTagName("fridge_id")[i].childNodes[0].nodeValue;
        //     let start_weight :string = xmlDoc.getElementsByTagName("start_weight")[i].childNodes[0].nodeValue;
        //     let current_weight :string = xmlDoc.getElementsByTagName("current_weight")[i].childNodes[0].nodeValue;
        //     let expire_date : string = xmlDoc.getElementsByTagName("expire_date")[i].childNodes[0].nodeValue;

        //     console.log("id: " + id);
        //     //console.log(parseInt(id) + " " + parseInt(fridge_id) + " " + parseInt(start_weight) + " " +
        //     //parseInt(current_weight) + " " + expire_date);

        //     //let p = new Product(parseInt(id), parseInt(fridge_id), parseInt(start_weight), parseInt(current_weight), expire_date.to);
        //     //products[i] = p;


        //     connection.query('SELECT * FROM products WHERE product_id = ' + id + ' and fridge_id = ' + fridge_id, 
        //     function (err, rows, fields) {
        //         console.log(rows);
        //         if (err) {
        //             res.status(400).send("error");
        //             throw err;
        //         }
        //         else {
        //             console.log("rows: " + rows);
        //             if (rows.length == 1) {
        //                 console.log("pr exists");
        //                 connection.query('UPDATE products SET current_weight = ' + current_weight + 
        //                 ' where product_id = ' + id + ' and fridge_id = ' + fridge_id, 
        //                     function (err1, rows1, fields) {
        //                             if (err1) {
        //                                 throw err1;
        //                             }
        //                             else {
        //                                 responses.push(current_weight);
        //                                 return;
        //                             }
        //                     });
        //             }
        //             else{
        //                 console.log("pr dsnt exist");
        //                 var qs = 'INSERT INTO products (product_id, fridge_id, start_weight, current_weight, expire_date)' +
        //                 ' VALUES(' + id + ', ' + fridge_id + ', ' + start_weight + ', ' + current_weight + ', \'' + expire_date + '\')';
        //                 console.log(qs);
        //                 connection.query(qs
        //                     , 
        //                     function (err1, rows1, fields) {
        //                             if (err1) {
        //                                 throw err1;
        //                             }
        //                             else {
        //                                 responses.push(current_weight+expire_date);
        //                                 return;
        //                             }
        //                     });
        //             }
        //         }

        //     });
        // }  

        console.log("Sending response:" + responses);
        res.send(responses);
    }

    private isOnRequest(req: express.Request, res: express.Response) {
        const isOn = this.doubleQuote(req.params.isOn);
        const fridgeid = this.doubleQuote(req.params.fridgeid);

        console.log('fridge_id: ' + fridgeid + ' isOn: ' + isOn);

        connection.query('SELECT * FROM fridges WHERE fridge_id = ' + fridgeid, function (err, rows, fields) {
            if (err) {
                res.status(400).send("isOn coulnt be set.");
                console.log(err);
            }
            else {
                console.log(rows);
                connection.query('UPDATE fridges SET is_on = ' + isOn + ' where fridge_id = ' + fridgeid,
                    function (err1, rows1, fields) {
                        if (err1) {
                            console.log(err1);
                        }
                        else {
                            res.send(isOn);
                            return;
                        }
                    });
            }
        });
    }

    private setTemperatureRequest(req: express.Request, res: express.Response) {
        const temp = this.doubleQuote(req.params.temp);
        const fridgeid = this.doubleQuote(req.params.fridgeid);

        console.log('fridge_id: ' + fridgeid + ' temp: ' + temp);

        connection.query('SELECT * FROM fridges WHERE fridge_id = ' + fridgeid, function (err, rows, fields) {
            if (err) {
                res.status(400).send("Temperature coulnt be set.");
                console.log(err);
            }
            else {
                console.log(rows);
                connection.query('UPDATE fridges SET temperature = ' + temp + ' where fridge_id = ' + fridgeid,
                    function (err1, rows1, fields) {
                        if (err1) {
                            console.log(err1);
                        }
                        else {
                            res.send(temp);
                            return;
                        }
                    });
            }
        });
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
                console.error(err);
            }
            else {
                console.log(rows);
                if (rows !== undefined && rows.length == 1) {
                    console.log('The solution is: ' + rows[0].uuid);
                    var uuid = uuid4();
                    var uuids = "'" + uuid + "'";
                    connection.query('UPDATE users SET uuid = ' + uuids + ' where name = ' + username + ' and password = ' + password, function (err1, rows1, fields) {
                        if (err1) {
                            console.log(err1);
                        }
                        else {
                            res.send(uuid + "+//+" + rows[0].is_admin);
                            return;
                        }
                    });
                }
                else {
                    res.status(400).send("Login failed.");
                    console.log("Login failed.");
                }
            }
        });
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
                        console.log(err);
                    }
                    else {
                        if (rows !== undefined && rows.length == 1) {
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

    private deleteUsers(req: express.Request, res: express.Response) {
        // If login or register is requested.
        console.log("deleting:");
        var userid = req.params.userid;

        var tokens = this.doubleQuote(req.header("Authorization"));

        if (req.header("Authorization") == null) {
            res.status(401).send("Unauthorized");
            return;
        } else {
            var qs = 'SELECT * FROM users WHERE uuid = ' + tokens + ' and is_admin = 1';
            console.log(qs);
            connection.query(qs, function (err, rows, fields) {
                if (err) {
                    res.status(400).send("Unauthorized you do not have admin priviledges.");
                    console.log("Authorisation failed.")
                    console.log(err);
                }
                else {
                    if (rows !== undefined && rows.length == 1) {
                        var qs2 = 'Delete FROM users WHERE home_id = ' + rows[0].home_id + ' and user_id = ' + userid;
                        console.log(qs2);
                        connection.query(qs2, function (err2, rows2, fields2) {
                            console.log(rows2);
                            if (err2) {
                                res.status(400).send("Error, Nothing got deleted");
                                console.log(err2);
                            }
                            if (rows2 != undefined) {
                                res.status(200).send("User deleted! >:D");
                            }
                            else {
                                res.status(400).send("Nothing got deleted");
                            }
                        });
                    }
                }
            });
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
                    console.log(err);
                }
                else {
                    if (rows !== undefined && rows.length == 1) {
                        var qs2 = 'SELECT * FROM users WHERE home_id = ' + rows[0].home_id + ' and ( uuid is null or Not uuid = ' + tokens + ' )';
                        console.log(qs2);
                        connection.query(qs2, function (err, rows2, fields2) {
                            if (err) {
                                console.log(err);
                                res.status(400).send("Error");
                            }
                            console.log(rows2);
                            var users: UserViewModel[] = []

                            if (rows2 !== undefined && rows2.length > 0) {
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
                console.log(err);
            }
            else {
                console.log(rows);
                if (rows !== undefined && rows.length == 1) {
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
                                console.log(err1);
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