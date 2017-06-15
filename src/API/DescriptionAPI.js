const PHOTO_API_KEY = 'a2c875aae5b778785643d935a972153f';

const getDescription = (photoDetails) => {
    // let descriptionArray = [];
    let testfnc = function() {
        let descriptionArray = [];
        for (let i = 0; i < photoDetails.length; i++)
        {
            let id = photoDetails[i][4];
            const PHOTO_API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${PHOTO_API_KEY}&photo_id=${id}&format=json&nojsoncallback=1`;
            let test7 = fetch(PHOTO_API_CALL)
                .then( response => response.json() )
                .then( json => {
                    console.log("json ",json.photo.description._content);
                    descriptionArray.push(json.photo.description._content);
                    return json.photo.description._content;
                })
                .then(console.log("des:",descriptionArray))
        console.log("test7: ",test7);
        }
    };
    testfnc();
};

const fetchDescription = (photos) => {
    console.log("Photos: ", photos);

    getDescription(photos)
        // .then(console.log("length: ", photos.length));
    // console.log("length: ", photos.length)
    
    
    // for (let i = 0; i < photos.length; i++)
    // {

    // }
};

export default fetchDescription;