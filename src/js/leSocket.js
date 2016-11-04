/**
 * @author: xing dongpeng
 * @date: 2016-09-20
 * @des: chat room
 */


class LeSocket extends WebSocket {
    constructor(url) {
       super(url);
       this.params = {
            url: url
       }
    }
    send(data) {
        super.send(data);
    }
}


var a = {a:1}




export { a } 

