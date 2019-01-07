import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import Loading from './Loading'

//stateless functional component
function SelectLanguage({ selectedLanguage, onSelect }) {
  let languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python']
  return (
    <ul className="languages">
      {languages.map(language => {
        return (
          <li
            style={language === selectedLanguage ? { color: 'red' } : null}
            onClick={() => {
              onSelect(language)
            }}
            key={language}
          >
            {language}
          </li>
        )
      })}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

function RepoGrid({ repos }) {
  return (
    <ul className="popular-list">
      {repos.map(({ name, stargazers_count, owner, html_url }, index) => (
        <li key={name} className="popular-item">
          <div className="popular-rank">#{index + 1}</div>
          <ul className="space-list-items">
            <li>
              <img
                className="avatar"
                src={owner.avatar_url}
                alt={`Avater for ${owner.login}`}
              />
            </li>
            <li>
              <a target="_blank" href={html_url}>
                {name}
              </a>
            </li>
            <li>@{owner.login}</li>
            <li>{stargazers_count} stars</li>
          </ul>
        </li>
      ))}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

class Popular extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedLanguage: 'All',
      repos: null
    }
    this.updateLanguage = this.updateLanguage.bind(this)
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage)
  }

  updateLanguage(language) {
    this.setState({
      selectedLanguage: language,
      repos: null
    })

    fetchPopularRepos(language)
      .then(repos => {
        this.setState({ repos })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const { selectedLanguage, repos } = this.state
    return (
      <div>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {!repos ? <Loading text="Loading" /> : <RepoGrid repos={repos} />}
      </div>
    )
  }
}

export default Popular
