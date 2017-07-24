import fetch from 'isomorphic-fetch';
import Promise from 'es6-promise-promise';

// uses flickr api: photosets.getList -> photosets.getPhotos -> photos.getInfo
const PHOTOSET_ID = '72157678045313813';
const USER_ID = '146447925%40N07';
const API_KEY = '0564471d68ed3cc6268a0abbb76c7d2b';
const API_CALL = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${API_KEY}&photoset_id=${PHOTOSET_ID}&extras=tags&format=json&nojsoncallback=1`;
const API_CALL_PHOTOSETS_GETLIST = `https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${API_KEY}&user_id=${USER_ID}&format=json&nojsoncallback=1`;

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

const setPhotos = albumID => {
  const API_CALL_PHOTOSETS_GETINFO = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${API_KEY}&photoset_id=${albumID}&extras=tags&format=json&nojsoncallback=1`;
  var resu = fetch(API_CALL_PHOTOSETS_GETINFO)
    .then(response => response.json())
    .then(json => {
      console.log("json: ", json.photoset.photo)
      return json.photoset.photo})
  return resu;

};

const setAlbum = photoset => {
  var variab = photoset.map(album => {
    console.log("albumid", album)
    return setPhotos(album.id)
      .then(result => {
        console.log("res: ", result)
        return {albumName: album.title._content, photos: result}
    });
    // console.log("temp: ", temp);
    // return {albumName: album.title._content};
      // console.log("Set: ", setPhotos(album.id))
      // setPhotos(album.id)
      //   .then(descrip => {
      //     console.log("des: ", descrip)
      //     return descrip
      //   })
      // var test1 = setPhotos(album.id);
      // console.log("test1: ", test1)
      // Promise.all(test1)
      //   .then(result => {console.log("rere: ", result)})
      
      // return setPhotos(album.id).then(photos => ({albumName: album.title._content, photos}))
        // .then(result => console.log("Result: ", result));
      // return {albumName: album.title._content}
      // return {albumName: album.title._content, photos: setPhotos(album.id)}
    }
  )
  console.log("variabl: ", variab);
  return variab
};

const fetchImages = () => (
  fetch(API_CALL_PHOTOSETS_GETLIST)
    .then(response => response.json())
    .then(json => setAlbum(json.photosets.photoset))
    .then(result => {
      console.log("Result: ", result)
      Promise.all(result)
        .then(re => console.log("re", re))
    })
    // .then(photoset => (
    //   Promise.all(setDescription(photoset))
    //     .then(completePhotoSet => completePhotoSet)))
);

// const fetchImages = () => (
//   fetch(API_CALL)
//     .then(response => response.json())
//     .then(json => {console.log(json); return photoParser(json.photoset.photo)})
//     .then(photoset => { console.log("photoset: ", setDescription(photoset))
//       return Promise.all(setDescription(photoset))
//         .then(completePhotoSet => completePhotoSet)})
// );

export default fetchImages;
