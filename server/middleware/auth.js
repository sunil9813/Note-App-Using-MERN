import jwt from "jsonwebtoken"

// wants to like a post
// click the like button => first go to auth middleware(next)
// then yo can like

const secretKey = "test"
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]

    const isCustomAuth = token.length < 500

    let decodedData
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secretKey)
      req.userId = decodedData?.id
    } else {
      decodedData = jwt.decode(token)
      req.userId = decodedData?.sub
    }
    next()
  } catch (error) {
    console.log(error)
  }
}

export default auth
