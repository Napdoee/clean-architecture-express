const msgResponse = (messsage) => ({
  "status": "success",
  message,
})

const succesResponse = ({ ...data }) => ({
  "status": "success",
  data
})

module.exports = { succesResponse, msgResponse };