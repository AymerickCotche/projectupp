const Sellsy = require("node-sellsy").default

export default new Sellsy({
  creds: {
    consumerKey: process.env.SELLSY_DIM_CONSUMER_KEY,
    consumerSecret: process.env.SELLSY_DIM_CONSUMER_SECRET,
    userToken: process.env.SELLSY_DIM_ACCESS_TOKEN,
    userSecret: process.env.SELLSY_DIM_TOKEN_SECRET,
  },
  endPoint: 'https://apifeed.sellsy.com/0/'
})