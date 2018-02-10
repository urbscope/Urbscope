
export const CLOUD_VISION_API_KEY = 'AIzaSyA361CU6vtQeV7TySOxc0VO_pBhIxaRt6M'

import vision from "react-cloud-vision-api"
vision.init({ auth: CLOUD_VISION_API_KEY})

export const detectLandmarks = (base64Image, results) => {
  // Making a request object to send to the server
  let req = new vision.Request({
    image: new vision.Image({
      base64: base64Image,
    }),
    features: [
      new vision.Feature('LANDMARK_DETECTION', results),
    ]
  })

  // Sending the request
  vision.annotate(req).then((res) => {
    if (res.responses[0].landmarkAnnotations !== undefined){
      console.log(res.responses)
      console.log(res.responses[0].landmarkAnnotations)
      console.log(res.responses[0].landmarkAnnotations[0])
    }
  })
}
