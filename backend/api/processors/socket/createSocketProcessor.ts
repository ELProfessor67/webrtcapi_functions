import { Server } from "socket.io";

class CcreatetSocketProcessor {
    private _io: Server;

    constructor() {  
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });
    }

    get io() {
        return this._io;
    }

}

export default CcreatetSocketProcessor;