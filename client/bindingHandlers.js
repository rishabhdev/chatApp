/**
 * Created by rishabh on 20/07/16.
 */
define(['ko','commentModel'],function(ko,commentModel){
    ko.bindingHandlers.handleHeightOfElements={
        init:function(element,valueAccessor,allBinding,viewModel){

            $(window).on('resize',adjustHeight);
            adjustHeight();

            function adjustHeight(){
                var headerHeight=$(element).find('.header').outerHeight();
                console.log(headerHeight);
                var height=$(window).height()-headerHeight;
                var width=$(window).width()- $('.users').outerWidth();
                var commentListHeight=$(window).height()-75 -115;
                console.log('commentListHeight',commentListHeight);

                console.log(width);
                console.log(height);
                $('.users').css('height',height+'px');
                $('.commentBoxWrapper').css('height',height+'px');
                $('.commentBoxWrapper').css('width',width+'px');
                $('.commentList').css('height',commentListHeight+'px');

            }
        }
    }
    ko.bindingHandlers.scrollOnComment={
        init:function(element){
            ko.computed(function(){
                commentModel.commentList();
                $(element).scrollTop(element.scrollHeight);
            })
        }
    }
})