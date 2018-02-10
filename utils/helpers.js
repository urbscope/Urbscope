

export const fixDetectedLandmarks = (res) => {

  let landmarks = res.responses[0].landmarkAnnotations

  if (landmarks !== undefined) {
    return landmarks.map( lm => {
      return {
        mid: lm.mid,
        description: lm.description,
        latitude: lm.locations[0].latLng.latitude,
        longitude: lm.locations[0].latLng.longitude,
      }
    })
  } else {
    return null
  }
}

export const fixLandmarkDetails = (res) => {
  let landmark = res.response.venues[0]

  // console.log(res)
  // console.log(landmark)

  if (landmark !== undefined) {
    return landmark
    // .map( lm => {
    //   return {
    //     id: lm.id,
    //     categories: lm.categories,
    //     contact: lm.contact,
    //     location: lm.location,
    //     address: lm.location.address,
    //     name: lm.name,
    //     website: lm.url,
    //     chains: lm.venueChains,
    //   }
    // })
  } else {
    return null
  }

}
