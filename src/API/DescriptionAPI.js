const PHOTO_API_KEY = '2c96c0998c85115fd50f75c5ca2aa4cc';

// const check

const getDescription = (photoDetails, setImageDescriptions) => {
    let descriptionArray = [];
    let testfnc = function() {
        // let descriptionArray = [];
        for (let i = 0; i < photoDetails.length; i++)
        {
            let id = photoDetails[i][4];
            const PHOTO_API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${PHOTO_API_KEY}&photo_id=${id}&format=json&nojsoncallback=1`;
            let test7 = fetch(PHOTO_API_CALL)
                .then( response => response.json() )
                .then( json => {
                    console.log("json ",json.photo.description._content);
                    return json.photo.description._content;
                })
                descriptionArray.push(test7);
                // .then(console.log("des:",descriptionArray))
            console.log("test7: ",test7);
        }
        console.log("des:",descriptionArray);
        Promise.all(descriptionArray)
            .then(values => setImageDescriptions(values));
            // .then(values => console.log("Values: ",values));
    };

    testfnc();
};

const fetchDescription = (photos, setImageDescriptions) => {
    console.log("Photos: ", photos);

    getDescription(photos, setImageDescriptions);
        // .then(console.log("length: ", photos.length));
    // console.log("length: ", photos.length)
    
    
    // for (let i = 0; i < photos.length; i++)
    // {

    // }
};

export default fetchDescription;