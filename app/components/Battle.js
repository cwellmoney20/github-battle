var React = require('react')
var PropTypes = require('prop-types')
var Link = require('react-router-dom').Link

function PlayerPreview(props) {
  return (
    <div>
      <div className="column">
        <img
          className="avatar"
          src={props.avatar}
          alt={`Avatar for ${props.username}`}
        />
        <h2 className="username">@{props.username}</h2>
      </div>
      <button className="reset" onClick={props.onReset.bind(null, props.id)}>
        Reset
      </button>
    </div>
  )
}

PlayerPreview.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired
}

class PlayerInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    let value = event.target.value
    this.setState({ username: value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.props.id, this.state.username)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="column">
        <label className="header" htmlFor="username">
          {this.props.label}
        </label>
        <input
          type="text"
          id="username"
          placeholder="github username"
          autoComplete="off"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <button
          className="button"
          type="submit"
          disabled={!this.state.username}
        >
          Submit
        </button>
      </form>
    )
  }
}

PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

class Battle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playerOneName: '',
      playerTwoName: '',
      playerOneImage: null,
      playerTwoImage: null
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  handleSubmit(id, username) {
    this.setState(() => {
      var newState = {}
      newState[`${id}Name`] = username
      newState[`${id}Image`] = `https://github.com/${username}.png?size=200`
      return newState
    })
  }

  handleReset(id) {
    this.setState(() => {
      var newState = {}
      newState[`${id}Name`] = ''
      newState[`${id}Image`] = null
      return newState
    })
  }

  render() {
    let match = this.props.match
    let playerOneName = this.state.playerOneName
    let playerTwoName = this.state.playerTwoName
    let playerOneImage = this.state.playerOneImage
    let playerTwoImage = this.state.playerTwoImage
    return (
      <div className="container">
        <div className="row">
          {/* shorthand if statement */}
          {!playerOneName && (
            <PlayerInput
              id="playerOne"
              label="Player One"
              onSubmit={this.handleSubmit}
            />
          )}

          {playerOneImage !== null && (
            <PlayerPreview
              avatar={playerOneImage}
              username={playerOneName}
              onReset={this.handleReset}
              id="playerOne"
            />
          )}

          {!playerTwoName && (
            <PlayerInput
              id="playerTwo"
              label="Player Two"
              onSubmit={this.handleSubmit}
            />
          )}

          {playerTwoImage !== null && (
            <PlayerPreview
              avatar={playerTwoImage}
              username={playerTwoName}
              onReset={this.handleReset}
              id="playerTwo"
            />
          )}
        </div>

        {playerOneImage && playerTwoImage && (
          <Link
            to={{
              pathname: `${match.url}/results`,
              search: `?playerOneName=${playerOneName}&playerTwoName=${playerTwoName}`
            }}
            className="battle"
          >
            Battle
          </Link>
        )}
      </div>
    )
  }
}

module.exports = Battle
