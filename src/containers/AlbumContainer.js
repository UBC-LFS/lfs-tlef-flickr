import React, { Component } from 'react'
import R from 'ramda'
import { fetchAlbumCover } from '../utils/Api'
import Loading from '../components/Loading'
import AlbumDisplay from '../components/AlbumDisplay'

export default class AlbumContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albumSet: [],
      browserHeight: 0,
      albumContainerWidth: 0,
      albumWidth: 0,
      albumsPerRow: 0,
      displayStage: 'album'
    }
    this.resizeBrowser = this.resizeBrowser.bind(this)

    this.callAPI = this.callAPI.bind(this)

    this.imageController = this.imageController.bind(this)
    this.getPhotoDimensions = this.getPhotoDimensions.bind(this)
    this.addLineBreak = this.addLineBreak.bind(this)
  }

  componentWillMount () {
    window.addEventListener('resize', this.resizeBrowser.bind(this))
    let browserHeight = document.documentElement.clientHeight - 400
    this.setState({ browserHeight })
  }

  componentDidMount () {
    this.callAPI()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeBrowser.bind(this))
    this.state.displayStage = 'photos'
  }

  resizeBrowser () {
    const albumContainerWidth = document.getElementById('app').clientWidth
    let albumsPerRow = 0
    switch (true) {
      case albumContainerWidth < 992:
        albumsPerRow = 2
        break
      case albumContainerWidth < 1200:
        albumsPerRow = 3
        break
      default:
        albumsPerRow = 3
    }
    const albumWidth = (albumContainerWidth - ((albumsPerRow - 1) * 15)) / albumsPerRow
    if (this.state.displayStage === 'album') {
      this.setState({ albumContainerWidth, albumsPerRow, albumWidth })
    }
  }

  callAPI () {
    fetchAlbumCover().then(photoset => this.imageController(photoset))
  }

  imageController (photoSets) {
    Promise.all(photoSets.map(photoSet => {
      const photosLineBreak = this.addLineBreak(photoSet.albumPhotos)
      const photoFinal = this.getPhotoDimensions(photosLineBreak)
      return Promise.all(photoFinal).then(photoDimensions => this.addDimensionsToPhotos(photoSet.albumPhotos, photoDimensions)).then((photos) => {
        const sortImg = R.sortWith([R.ascend(R.compose(R.toUpper, R.prop('title')))])
        const sortedPhotos = sortImg(photos)
        return {
          albumName: photoSet.albumName,
          albumID: photoSet.albumID,
          albumSize: photoSet.albumSize,
          albumDetails: {
            photo: sortedPhotos,
            visiblePhotos: sortedPhotos
          }
        }
      })
    })).then(albumSet => this.setState({
      albumSet
    }, this.resizeBrowser))
  }

  addDimensionsToPhotos (photosArray, photoDimensions) {
    const tempPhotosArray = photosArray
    for (let i = 0; i < photoDimensions.length; i += 1) {
      const imageOrientation = (photoDimensions[i][0] > photoDimensions[i][1]
        ? 'landscape'
        : 'portrait')
      tempPhotosArray[i].width = photoDimensions[i][0]
      tempPhotosArray[i].height = photoDimensions[i][1]
      tempPhotosArray[i].orientation = imageOrientation
    }
    return tempPhotosArray
  }

  getPhotoDimensions (photosArray) {
    const photos = []
    const filterArray = photosArray[0]
    function getDimensions (photoImage) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          resolve([img.width, img.height])
        }
        img.onerror = () => {
          const message = 'Could not get image dimension'
          reject(new Error(message))
        }
        img.src = photoImage.imageURL
      })
    }
    photos.push(getDimensions(filterArray))
    return photos
  }

  addLineBreak (photosImages) {
    const tempPhotosImages = photosImages.map((image) => {
      const tempImage = image
      // Check if Patrick if this is needed
      // tempImage.description = tempImage.description.replace(/\n/g, '<br>');
      return tempImage
    })
    return tempPhotosImages
  }

  /** ============ */
  render () {
    return (
      <div id='albumContainer'>
        <div className='container'>
          <h1>Albums</h1>
        </div>
        {this.state.albumSet.length === 0 ? (
          <Loading
            browserHeight={this.state.browserHeight}
          />
        ) : (
          <div>
            <AlbumDisplay
              albums={this.state.albumSet}
              coverSize={this.state.albumWidth}
            />
          </div>
          )}
        <div>
          {this.state.albumSet.length !== 0 &&
            <div className='footer'>
              {'This product uses the Flickr API but is not endorsed or certified by Flickr.'}
            </div>
          }
        </div>
      </div>
    )
  }
}
