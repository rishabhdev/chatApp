/**
 * Created by rishabh on 14/07/16.
 */
define(['socket'],function(socket){
    function initSocket(){

        if(window.counterrr){
            window.counterrr++;
        }
        else{
            window.counterrr=0;
        }
        console.log( window.counterrr);

        return socket.connect("http://35.154.27.20:20000");
    }
    return initSocket();
})
