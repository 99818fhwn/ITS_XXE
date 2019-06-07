import * as express from "express";
import * as path from "path";
import * as uuid4 from "uuidv4";
import * as mysql from 'mysql';

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
        //this.app.use(this.authorize.bind(this));
        //this.app.use("/revalidate/:token", this.logInStillValid.bind(this));
        this.app.get("/login/:usr.:pwd", this.loginRequest.bind(this));
        this.app.get("/register/:usr.:pwd", this.registerRequest.bind(this));
        // this.app.get("/logout", this.logoutRequest.bind(this));
        this.app.listen(4200);
    }

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

        console.log(username + ' and the ' + password);

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
                            res.send(uuid);
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

    // // For every request checking the valid token.
    // private authorize(req: express.Request, res: express.Response, next: express.NextFunction) {
    //     // If login or register is requested.
    //     if ((req.url.search("login") == 1) || (req.url.search("register") == 1)) {
    //         next();
    //     } else {
    //         if (req.header("Authorization") == null) {
    //             res.status(401).send("Unauthorized");
    //             return;
    //         } else {
    //             next();
    //         }
    //     }
    // }

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