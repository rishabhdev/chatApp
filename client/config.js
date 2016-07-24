/**
 * Created by rishabh on 13/07/16.
 */
require['config']({
    paths: {
        'userModel': './models/user',
        'commentModel': './models/comment',
        'jquery':'./lib/jquery-3.0.0.min',
        'ko':'./lib/knockout-3.4.0',
        'socket':'./lib/socketIo',
        'mainVm':'mainViewModel',
        'socketInstance':'initSocket',
        'bindingHandlers':'bindingHandlers'
    }
});

require(['bindingHandlers','mainVm'],function(bindingHandlers,mainVm){

});