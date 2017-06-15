const PHOTOSET_ID = '72157678045313813';
const API_KEY = '0564471d68ed3cc6268a0abbb76c7d2b';
const PHOTO_API_KEY = '2c96c0998c85115fd50f75c5ca2aa4cc';
// imagesArray holds an array of [URL, title, description]];

const getPhotoDescription = (photo_API_Call) => {
    return fetch(photo_API_Call)
           .then( response => response.json())
           .then( json => json.photo.description._content)
}

const setPhotoDescriptions = (imagesArray, descriptionArray, setImageDescriptions) => {
    Promise.all(descriptionArray)
        .then(descriptions => {
            for(let i=0; i<imagesArray.length; i++)
            {
                imagesArray[i].push(descriptions[i]);
            }
        })
        .then(setImageDescriptions(imagesArray));
}

const mapAndPushPhotos = (json,setImageDescriptions) => {
    let imagesArray = [];
    let descriptionArray = [];
    console.log("json: ", json);
    json.photoset.photo.map(({farm, server, id, secret, title, description, tags}) => {
        const PHOTO_API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${PHOTO_API_KEY}&photo_id=${id}&format=json&nojsoncallback=1`;
        const imageURL = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
        const imageTitle = title;
        const imageContent = '';//description._content;
        const imageTags = tags;
        const imageID = id;

        descriptionArray.push(getPhotoDescription(PHOTO_API_CALL));
        imagesArray.push([imageURL, imageTitle, imageContent, imageTags, imageID]);
    });
    setPhotoDescriptions(imagesArray, descriptionArray, setImageDescriptions);
}

const fetchImages = (setImageDescriptions) => {
    //const API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&tags=${searchTerm}&tag_mode=all&extras=description&format=json&nojsoncallback=1`;
    const API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${API_KEY}&photoset_id=${PHOTOSET_ID}&extras=tags&format=json&nojsoncallback=1`;
    fetch(API_CALL)
        .then( response => response.json())
        .then( json => mapAndPushPhotos(json,setImageDescriptions));
};

export default fetchImages;