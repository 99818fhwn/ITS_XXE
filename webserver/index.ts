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
        // this.app.get("/register/:usr.:pwd", this.registerRequest.bind(this));
        // this.app.get("/logout", this.logoutRequest.bind(this));
        // this.app.get("/submitscore/:score.:message", this.newScoreRequest.bind(this));
        // this.app.get("/getuserscores", this.getUserScore.bind(this));
        // this.app.get("/getgloballeaderboardscores", this.getLeaderboard.bind(this));
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
    private loginRequest(req: express.Request, res: express.Response) {
        const username = req.params.usr;
        const password = req.params.pwd;

        // CREATE TABLE users(
        //     username varchar(255) not null,
        //     password varchar(255) not null,
        //     userid int not null AUTO_INCREMENT,
        //     uuid varchar(255)
        // ) ENGINE = storage_engine

        console.log(username + ' and the ' + password);

        connection.query('SELECT * FROM users WHERE password = \'' + password + "\' and username = \'" + username + '\'', function (err, rows, fields) {
            if (err) {
                throw err;
            }
            else {
                if (rows.length == 1) {
                    console.log('The solution is: ' + rows[0].uuid);
                    var uuid = uuid4();
                    connection.query('UPDATE users SET uuid = \'' + uuid + '\' where username = \'' + username + '\' and password = \'' + password + '\'', function (err1, rows1, fields) {
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
                    res.send(400, "Login failed.");
                }
            }
        });
        //connection.end();
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

    // // Registers a user by name and password then sends corresponding statuscode.
    // private registerRequest(req: express.Request, res: express.Response) {
    //     const username: string = req.params.usr;
    //     const password: string = req.params.pwd;

    //     console.log(this.leaderBoardScores);

    //     let hmm = this.getDateString();

    //     for (const user of this.registeredUsers) {
    //         if (user.username === username) {
    //             res.send(409, "Username is already taken.");
    //             return;
    //         }
    //     }

    //     this.registeredUsers.push(new User(username, password));
    //     res.send(201, "Registration successful");
    // }

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

    // // Gets the personal highscores.
    // private getUserScore(req: express.Request, res: express.Response) {
    //     const uuidValue: string = req.header("Authorization");

    //     for (const user of this.registeredUsers) {
    //         if (user.uuid === uuidValue) {
    //             console.log(user.gameResults);
    //             res.send(user.gameResults);
    //             return;
    //         }
    //     }
    // }

    // // Sends the leaderboard.
    // private getLeaderboard(req: express.Request, res: express.Response) {
    //     res.send(this.leaderBoardScores);
    // }

    // // Adding now score to the boards.
    // private newScoreRequest(req: express.Request, res: express.Response) {
    //     const score = req.params.score;
    //     const message = req.params.message;
    //     let userFound = false;
    //     const uuidToken: string = req.header("Authorization");

    //     // Checking for valid user.
    //     for (const user of this.registeredUsers) {
    //         if (user.uuid === uuidToken) {

    //             let roundResult = new RoundResult(user.username, score, message, this.getDateString());

    //             console.log(roundResult);
    //             // Adding round to users round results.
    //             user.addRoundResult(roundResult);
    //             user.gameResults.sort((a, b) => b.score - a.score);
    //             user.gameResults.slice(1, 11);
    //             userFound = true;

    //             // Adding new score to leaderboard.
    //             this.leaderBoardScores.push(roundResult);
    //             this.leaderBoardScores.sort((a, b) => b.score - a.score);
    //         }
    //     }

    //     if (userFound) {
    //         res.send(201, "Added score.");
    //     } else {
    //         res.send(404, "User not found.");
    //     }
    // }

    // private getDateString(): string {
    //     let dd = this.dateTime.getUTCDate();
    //     let mm = this.dateTime.getUTCMonth();
    //     let yyyy = this.dateTime.getUTCFullYear();
    //     let hh = this.dateTime.getUTCHours();
    //     let minmin = this.dateTime.getUTCMinutes();
    //     let finalDate = dd + "." + mm + "." + yyyy + " [" + hh + ":" + minmin + "]"
    //     return finalDate;
    // }

    private logRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log(req.url);
        next();
    }
}

new Server();