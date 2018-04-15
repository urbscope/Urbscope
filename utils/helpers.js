

export const fixDetectedLandmarks = (res) => {

  let landmarks = res.responses[0].landmarkAnnotations
  let result = []

  if (landmarks !== undefined) {
    result = landmarks.map( lm => {
      return {
        mid: lm.mid,
        description: lm.description,
        latitude: lm.locations[0].latLng.latitude,
        longitude: lm.locations[0].latLng.longitude,
      }
    })

    return result.reduce( (resultLocations, current) => {
      if (current.description !== undefined){
        let exists = resultLocations.find( x => x.description === current.description)
        if (!exists){
          return resultLocations.concat(current)
        }
      }
      return resultLocations
    }, [])

  } else {
    return null
  }
}

export const fixLandmarkDetailsFS = (res) => {
  let landmark = res.response.venues[0]

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

export const fixLandmarkDetail = (res) => {

  let detail = null
  
  if (res.itemListElement.length > 0 ){
    detail = res.itemListElement[0].result
  }

  return detail
}
