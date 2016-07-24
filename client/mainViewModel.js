/**
 * Created by rishabh on 14/07/16.
 */

define(['jquery','ko','commentModel','userModel','socketInstance'],function($,ko,commentModel,userModel,socket){
    function mainViewModel(){
        var self=this;
        self.addComment=function(sender,data){

            self.commentList.push(data);
        }
        self.showPreview=function(){

        }
        self.addFile=function(){

        }
        /**
         * mode: login,register,authenticated
         */
        self.mode=ko.observable("login");
        self.switchToLoginMode=function(){
            self.mode("login");
        }
        self.switchToRegisterMode=function(){
            self.mode("register");
        }

        self.password=ko.observable('');
        self.confirmPassword=ko.observable('');
        self.userName=ko.observable('');

        self.register=function() {

            if (self.userName() && self.password() && self.confirmPassword())
            {
                if (self.password() == self.confirmPassword()) {
                    $.ajax({
                        method: "POST",
                        url: "/register",
                        data: {'userName': self.userName, 'password': self.password}
                    }).done(function (response) {
                        if(response.status ==="ok"){
                            self.login();
                        }
                        else if(response.err =="@alreadyExists"){
                            alert("Username not available");
                        }
                    })
                }
                else {
                    alert("passwords doesnt match");
                }
            }
            else{
                alert("Please fill all values");
            }
        }
        self.login=function(){

            if (self.userName() && self.password())
            {
                    $.ajax({
                        method: "POST",
                        url: "/login",
                        data: {'userName': self.userName, 'password': self.password}
                    }).done(function (response) {
                        if(response.status ==="ok"){
                            self.onAuthenticate();
                        }
                        else if(response.err =="@notFound"){
                            alert("Inv login credentials");
                        }
                    })

            }
            else{
                alert("username or password is empty");
            }
        }



        self.onAuthenticate=function(){

            self.mode('authenticated');
            socket.emit('authenticated',self.userName());

        }


        self.userList=ko.observableArray([]);
        ko.computed(function(){
            console.log(self.userList());
            self.userList(userModel.userList());

        });

        self.activeUser=ko.observable();
        self.textAreaContent=ko.observable();

        self.handleKeydown=function(sender,event){
            if(event.which ===13){
                if(self.textAreaContent()) {
                    $(event.target).val("");
                    self.addComment(self.textAreaContent(),'text');
                }
                return false;
            }else{
                return true;
            }
        }
        self.activeChatPartner=ko.observable();

        self.commentList= ko.computed(function(){
            if(commentModel.commentList()[self.activeChatPartner()]) {
                console.log(commentModel.commentList()[self.activeChatPartner()]());
                return commentModel.commentList()[self.activeChatPartner()]();
            }
        });
        ko.computed(function(){
            console.log(commentModel.commentList()[self.activeChatPartner()]);

        })
        self.addComment=function(text,type){
            var self=this;
            var comment={sender:self.userName(),reciever:self.activeChatPartner(),title:text,createdAt:Date.now(),type:type};
            commentModel.commentList()[self.activeChatPartner()].push(comment);
            commentModel.commentList.valueHasMutated();
            commentModel.addComment(comment);

        }

        self.changeActivePartner=function(user){
            var self=this;
            self.activeChatPartner(user.userName);
            self.loadComment(self.activeChatPartner());

        }
        self.loadComment=function(userName){
            commentModel.retrieve(self.userName(),userName,function(data){
                console.log(data);
            })
        }

        console.log($('body').find('.authWrapper').length);
        ko.applyBindings(self,$('body').find('.authWrapper')[0]);
    }
    return new mainViewModel();
})