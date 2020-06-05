////////////////////////////////////
// The user class should          //
// abstract the username/login    //
// combination with only a        //
// userId and a auth Token        //
////////////////////////////////////

export class User {

    constructor (
        public email: string, 
        public id: string, //our User Id token
        private _token : string, //firebase user Id
        private _tokenExpirationDate: Date
    ) {}
    
    get token() {
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }

        return this._token
    }
}
