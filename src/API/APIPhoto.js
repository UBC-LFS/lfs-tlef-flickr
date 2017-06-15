const PHOTOSET_ID = '72157678045313813';
const API_KEY = '0564471d68ed3cc6268a0abbb76c7d2b';
const PHOTO_API_KEY = '2c96c0998c85115fd50f75c5ca2aa4cc';
// imagesArray holds an array of [URL, title, description]];

const getPhotoDescription = (photo_API_call) => {
    return fetch(photo_API_call)
           .then( response => response.json())
           .then( json => 
                json.photo.description._content
           )
};

const mapAndPush = json => {
    let imagesArray = [];
    let count = 0;
    let testArr = [];
    json.photoset.photo.map(({farm, server, id, secret, title, description, tags}) => {
        const PHOTO_API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${PHOTO_API_KEY}&photo_id=${id}&format=json&nojsoncallback=1`;
        const imageURL = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
        const imageTitle = title;
        const imageContent = '';//description._content;
        const imageTags = tags;
        getPhotoDescription(PHOTO_API_CALL)
            .then(description => imagesArray.push([imageURL, imageTitle, imageContent, imageTags, description]))
            .then(() => console.log("promise: ",imagesArray));
        
        // getPhotoDescription(PHOTO_API_CALL)
        //     .then(description => {
        //         console.log(description)
        //         return description})
        //     .then((descr,count) => console.log(++count + ": " + descr));
        // getPhotoDescription(PHOTO_API_CALL)
        //     .then(description => imagesArray.push([imageURL, imageTitle, imageContent, imageTags, description]))
        //     .then(console.log(imagesArray))
        //     .then(testArr.push(++count))
        //     .then(console.log(testArr));
        // imagesArray.push([imageURL, imageTitle, imageContent, imageTags]);
        // console.log(imagesArray);
    });
    console.log("imagesArray: ",imagesArray);
    return imagesArray;
}

const fetchImages = (searchTerm) => {
    //const API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&tags=${searchTerm}&tag_mode=all&extras=description&format=json&nojsoncallback=1`;
    const API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${API_KEY}&photoset_id=${PHOTOSET_ID}&extras=tags&format=json&nojsoncallback=1`;
    let getPhotoInfo = fetch(API_CALL)
        .then( response => response.json())
        .then( json => mapAndPush(json))
    console.log("HERE");
    console.log("Photo Info: ", getPhotoInfo);
    Promise.all(getPhotoInfo).then(values => console.log("Values: ", values));
    // return getPhotoInfo;
        // .then( asd => {console.log("asdf")
        //                 console.log(asd)})
};

export default fetchImages;