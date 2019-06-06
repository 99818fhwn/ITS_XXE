import * as express from "express";
import * as path from "path";

export class Server {
    public app: express.Application;
    
    constructor() {
        this.app = express();
        this.app.use(express.static(path.join(__dirname, "web")));  // http://expressjs.com/en/starter/static-files.html
        this.app.use(this.logRequest);                              // http://expressjs.com/en/guide/writing-middleware.html
        this.app.get('/data', this.dataEPHandler);                  // http://expressjs.com/en/starter/basic-routing.html
        this.app.get('/data/:id', this.dataEPHandler);              // http://expressjs.com/en/starter/basic-routing.html
        this.app.all('/data[0-9]*', this.dataEPHandler);            // http://expressjs.com/en/guide/routing.html
        this.app.listen(3001);
    }  

    private dataEPHandler(req: express.Request, res: express.Response) {
        res.send(`{data:1, request:'${req.url}', id:'${req.params.id || -1}'}`);
    }

    private logRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log(req.url);
        next();
    }
}

new Server();