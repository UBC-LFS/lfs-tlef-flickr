const PHOTOSET_ID = '72157678045313813';
const API_KEY = '0564471d68ed3cc6268a0abbb76c7d2b';
// imagesArray holds an array of [URL, title, description]];

const mapAndPush = json => {
    let imagesArray = [];
    json.photoset.photo.map(({farm, server, id, secret, title, description, tags}) => {
        const imageURL = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
        const imageTitle = title;
        const imageContent = '';//description._content;
        const imageTags = tags;
        imagesArray.push([imageURL, imageTitle, imageContent, imageTags]);
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