var axios = require('axios')

var id = 'YOUR_CLIENT_ID'
var sec = 'YOUR_SECRET_ID'
var params = '?client_id=' + id + '&client_secret=' + sec

module.exports = {
  battle: function(players) {},
  fetchPopularRepos: function(language) {
    let encodedURI = window.encodeURI(
      `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
    )

    return axios
      .get(encodedURI)
      .then(response => {
        return response.data.items
      })
      .catch(err => {
        console.log(err)
        return err
      })
  }
}
