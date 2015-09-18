/**
 * Created by Damian Simon Peter on 9/17/2015.
 */


var ImageConverter = {

    fetchImg: function(){

        if(localStorage.img) {

            $('#img').attr('src',localStorage.img);

        }
    },


    onFileUpload:function(){
        document.getElementById('imageUpload').addEventListener('change', this.handleFileSelect, false);

    },
    handleFileSelect:function(evt) {

        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    $('#img').attr('src', e.target.result);
                    localStorage.setItem('img', e.target.result);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }


};
//Uncomment to taste!
//ImageConverter.fetchImg();
//ImageConverter.onFileUpload();
//ImageConverter.handleFileSelect(evt);