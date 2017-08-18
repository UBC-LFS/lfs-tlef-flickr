import fetch from 'isomorphic-fetch';
import Promise from 'es6-promise-promise';

//72157678045313813
const PHOTOSET_ID = '72157683286006992';
const API_KEY = '0564471d68ed3cc6268a0abbb76c7d2b';
const API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${API_KEY}&photoset_id=${PHOTOSET_ID}&extras=tags&format=json&nojsoncallback=1`;

const getDescription = URL => (
  fetch(URL)
    .then(response => response.json())
    .then(json => json.photo.description._content)
    .then(description => description)
);

const setDescription = photoset => (
  photoset.map(img => (
    getDescription(img.descriptionURL)
      .then((description) => {
        img.description = description;
        return img;
      })
  ))
);

const photoParser = photoset => (
  photoset.map((photo) => {
    const newPhoto = Object.assign({}, photo);
    newPhoto.descriptionURL = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${API_KEY}&photo_id=${photo.id}&format=json&nojsoncallback=1`;
    newPhoto.imageURL = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
    delete newPhoto.isfamily;
    delete newPhoto.isfriend;
    delete newPhoto.isprimary;
    delete newPhoto.server;
    delete newPhoto.farm;
    delete newPhoto.ispublic;
    delete newPhoto.secret;
    return newPhoto;
  })
);

const fetchImages = () => (
  fetch(API_CALL)
    .then(response => response.json())
    .then(json => photoParser(json.photoset.photo))
    .then(photoset => (
      Promise.all(setDescription(photoset))
        .then(completePhotoSet => completePhotoSet)))
);

export default fetchImages;
