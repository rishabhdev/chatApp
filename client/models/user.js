/**
 * Created by rishabh on 13/07/16.
 */
define(['jquery','ko','socketInstance'],function(jquery,ko,socket){
    function userDetail(){
        var self=this;
        self.userName=ko.observable();
        self.email=ko.observable();
        self.authenticated=ko.observable(false);
        self.userList=ko.observableArray([]);

        socket.on('userListUpdate',function(data){
            data.forEach(function(val){
                val['online']=ko.observable(false);
            });
            self.userList(data);

        });

        socket.on('onlineUsersUpdate',function(data){
            console.log('onlineUsersUpdate');
            self.userList().forEach(function(value){
                if(data[value['userName']]){
                  value['online'](true);
                }else{
                    value['online'](false);
                }

            });
            self.userList.valueHasMutated();
        })

        socket.on('authFailure',function(data){
            self.userName(null);
            self.email(null);
        });

    }
    return new userDetail();
});