const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
const hasWellformedToken = res => {
  if(!res.body.token.match(JWS_REGEX)) throw new Error("malformed jwt token")
}

module.exports = {hasWellformedToken}
