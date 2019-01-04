var axios = require('axios')

var id = 'YOUR_CLIENT_ID'
var sec = 'YOUR_SECRET_ID'
var params = `?client_id=${id}&client_secret=${sec}`

function getProfile(username) {
  return axios
    .get(`https://api.github.com/users/${username}${params}`)
    .then(user => {
      return user.data
    })
    .catch(err => {
      console.log(err)
    })
}

function getRepos(username) {
  return axios.get(
    `https://api.github.com/users/${username}/repos${params}?&per_page=100`
  )
}

function getStarCount(repos) {
  return repos.data.reduce((acc, repo) => {
    return acc + repo.stargazers_count
  }, 0)
}

function calculateScore(profile, repos) {
  let followers = profile.followers
  let totalStars = getStarCount(repos)

  return followers * 3 + totalStars
}

function handleError(error) {
  console.warn(error)
  return null
}

function getUserData(player) {
  return axios.all([getProfile(player), getRepos(player)]).then(data => {
    let [profile, repos] = data

    return {
      profile,
      score: calculateScore(profile, repos)
    }
  })
}

function sortPlayers(players) {
  return players.sort((a, b) => {
    return b.score - a.score
  })
}

module.exports = {
  battle: function(players) {
    return axios
      .all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError)
  },
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
