var photo = {
    tpmsId:'',
            
    take: function(image_id,tpmsId) {
        if(tpmsId!=null || tpmsId=="")
            photo.tpmsId = tpmsId+'_';
        
        var image_place = document.getElementById(image_id);
        var image = document.createElement('img');
        image.style.height = '50px';
        image.style.width = '50px';
        image_place.appendChild(image);
        
        navigator.camera.getPicture(onSuccess, onFail, {quality: 50,
            destinationType: Camera.DestinationType.FILE_URI});

        function onSuccess(imageURI) {
            image.src = imageURI;
            image.setAttribute('onClick', 'info_box_ok.show(\'<image style="width:150px;height:150px;" src="'+imageURI+'"/>\',\''+data_localize.ok+'\')');
            photo.save(imageURI);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    },
    save: function(imageURI) {
        window.resolveLocalFileSystemURI(imageURI, resolveOnSuccess, resOnError);
        
        function resolveOnSuccess(entry) {
            var d = new Date();
            var n = d.getTime();
            //new file name
            var newFileName = photo.tpmsId+"_"+ n + ".jpg";
            var myFolderApp = "Translogik iProbe";

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
                //The folder is created if doesn't exist
                fileSys.root.getDirectory(myFolderApp,
                        {create: true, exclusive: false},
                function(directory) {
                    entry.moveTo(directory, newFileName, successMove, resOnError);
                },
                        resOnError);
            },
                    resOnError);
        }
        function successMove(e){
            //console.log(e);
        }
        function resOnError(error) {
            alert(error.code);
        }
    }
}