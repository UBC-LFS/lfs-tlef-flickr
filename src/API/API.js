const PHOTOSET_ID = '72157678045313813';
const API_KEY = '0564471d68ed3cc6268a0abbb76c7d2b';
// const PHOTO_API_KEY = 'bbe7efc4bbe606cdb3353822e9776c7d';
const PHOTO_API_KEY = '8d5d6ada90954a0020e5230e281f32c3';
// imagesArray holds an array of [URL, title, description]];

const getDescription = json => {
    console.log(json["photo"]["description"]["_content"]);
    return json["photo"]["description"]["_content"];
}

const getPhotoDescription = (photo_API_Call) => {
    // let descriptionTest = "";
    return fetch(photo_API_Call)
        .then( response => response.json())
        .then( json => getDescription(json))
        // .then( json => {descriptionTest = json.photo.description._content})
        // .then( () => descriptionTest)
        // .then( () => console.log(descriptionTest))
        // return descriptionTest
    // return fetch(photo_API_call)
    //        .then( response => response.json())
    //        .then( json => json.photo.description._content)
}

const mapAndPush = json => {
    let imagesArray = [];
    console.log(json);
    json.photoset.photo.map(({farm, server, id, secret, title, description, tags}) => {
        const PHOTO_API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${PHOTO_API_KEY}&photo_id=${id}&format=json&nojsoncallback=1`;
        const imageURL = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
        const imageTitle = title;
        const imageContent = '';//description._content;
        const imageTags = tags;
        const imageID = id;
        // getPhotoDescription(PHOTO_API_CALL)
        //     .then(photoDescription => imagesArray.push([imageURL, imageTitle, imageContent, imageTags, photoDescription]));

        // imagesArray.push([imageURL, imageTitle, imageContent, imageTags, getPhotoDescription(PHOTO_API_CALL)]);

        imagesArray.push([imageURL, imageTitle, imageContent, imageTags, imageID]);
    });
    return imagesArray;
}

const fetchImages = (searchTerm) => {
    //const API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&tags=${searchTerm}&tag_mode=all&extras=description&format=json&nojsoncallback=1`;
    const API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${API_KEY}&photoset_id=${PHOTOSET_ID}&extras=tags&format=json&nojsoncallback=1`;
    return fetch(API_CALL)
        .then( response => response.json())
        .then( json => mapAndPush(json))
};

export default fetchImages;