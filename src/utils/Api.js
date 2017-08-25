import fetch from 'isomorphic-fetch';
import Promise from 'es6-promise-promise';

// uses flickr api: photosets.getList -> photosets.getPhotos -> photos.getInfo
const USER_ID = '146447925%40N07';
let PHOTOSET_ID = ''; 
const API_KEY = '0564471d68ed3cc6268a0abbb76c7d2b';
const API_CALL_PHOTOSETS_GETLIST = `https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${API_KEY}&user_id=${USER_ID}&format=json&nojsoncallback=1`;

const getPhotos = albumID => {
  const API_CALL_PHOTOSETS_GETPHOTO = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${API_KEY}&photoset_id=${albumID}&extras=tags&format=json&nojsoncallback=1`;
  return fetch(API_CALL_PHOTOSETS_GETPHOTO)
    .then(response => response.json())
    .then(json => {return json.photoset.photo})
};

const setAlbum = albumInfo => {
  return albumInfo.map(album => {
    return getPhotos(album.id)
      .then(photos => {
        return {albumName: album.title._content, photos, albumID: album.id, albumSize: album.photos}
      });
    })
};

// const getPhotosDescription = photoInfoURL => (
//   fetch(photoInfoURL)
//     .then(response => response.json())
//     .then(json => json.photo.description._content)
// )

const setAlbumDescription = albumSet => {
  const filterAlbumSet = albumSet;
  filterAlbumSet.photos.splice(1); 
  return filterAlbumSet.photos.map(photo => {
    const descriptionURL = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${API_KEY}&photo_id=${photo.id}&format=json&nojsoncallback=1`;
    const tempPhoto = Object.assign({}, photo);
    tempPhoto.imageURL = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
    delete tempPhoto.isfamily;
    delete tempPhoto.isfriend;
    delete tempPhoto.isprimary;
    delete tempPhoto.server;
    delete tempPhoto.farm;
    delete tempPhoto.ispublic;
    delete tempPhoto.secret;
    return tempPhoto;
    // return getPhotosDescription(descriptionURL)
    //   .then(description => {
    //     tempPhoto.description = description;
    //     return tempPhoto;
    //   })
  })
}

const fetchAlbumCover = () => (
  fetch(API_CALL_PHOTOSETS_GETLIST)
  .then(response => response.json())
  .then(json => setAlbum(json.photosets.photoset))
  .then(photoSet => (
    Promise.all(photoSet)
      .then(photoSetNoDescription => photoSetNoDescription)
  ))
  .then(albumsPhotosNoDescription => (
    albumsPhotosNoDescription.map(albumPhotos => (
      Promise.all(setAlbumDescription(albumPhotos))
        .then(albumOfPhotosPromise => ({albumName: albumPhotos.albumName, albumPhotos: albumOfPhotosPromise, albumID: albumPhotos.albumID, albumSize: albumPhotos.albumSize}))
    ))
  ))
  .then(albumsPhotosWithDescription => (
    Promise.all(albumsPhotosWithDescription)
      .then(albumFinal => {
        return albumFinal
      })
  ))
);

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

// https://stackoverflow.com/questions/36094865/how-to-do-promise-all-for-array-of-array-of-promises
const fetchImages = (albumID) => {
  const API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${API_KEY}&photoset_id=${albumID}&extras=tags&format=json&nojsoncallback=1`;
  return fetch(API_CALL)
  .then(response => response.json())
  .then(json => photoParser(json.photoset.photo))
  .then(photoset => (
    Promise.all(setDescription(photoset))
      .then(completePhotoSet => completePhotoSet)))
}

export {fetchImages, fetchAlbumCover};
