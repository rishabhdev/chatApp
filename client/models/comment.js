/**
 * Created by rishabh on 13/07/16.
 */

define(['jquery','ko','socketInstance'],function(jquery,ko,socket){
    function commentCollection(){
        var self=this;
        self.commentList=ko.observable({});


        self.retrieve=function(thisUser,chatPartner,callback){

            $.ajax({
                method: "POST",
                url: "/getCommentsForUserPair",
                data: {thisUser:thisUser, chatPartner: chatPartner}
            }).done(function (response) {

                console.log(response);
                if(response.status ==="ok"){

                    var commentList=self.commentList();
                    console.log(self.commentList());
                    if(!commentList[chatPartner]){
                        commentList[chatPartner]=ko.observableArray([]);
                    }
                    if(response.data) {
                        commentList[chatPartner](response.data);
                    }
                    self.commentList(commentList);
                    callback(null,response.data);
                }
                else if(response.err){
                    alert(response.err);
                    callback(response.err);
                }
            });
        }

        self.addComment=function(comment){
            $.ajax({
                method:"POST",
                url:"/addComment",
                data:comment
            }).done(function(response){

                console.log(response);
            })
        }
        socket.on('message',function(data){
            if(self.commentList()[data.sender]){
                self.commentList()[data.sender]=ko.observableArray([]);
            }else{
                self.commentList()[data.sender].push(data);
            }
        });

    }
    return new commentCollection();
});