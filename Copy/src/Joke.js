import React from "react";
import "./Joke.css";

/** Display a joke and the buttons for it. */

class Joke extends React.Component {
  constructor(props) {
    super(props);

    // bind this to functions
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.toggleLock = this.toggleLock.bind(this);
  }

  // from JokesList
  /* change vote for this id by delta (+1 or -1) */
  upVote() {
    this.props.vote(this.props.id, +1);
  }

  downVote() {
    this.props.vote(this.props.id, -1);
  }

  toggleLock() {
    this.props.toggleLock(this.props.id);
  }

  render() {
    return (
      // if locked, className is Joke Joke-locked, else it's just Joke
      <div className={`Joke ${this.props.locked ? "Joke-locked" : ""}`}>
        <div className="Joke-votearea">
          {/* refers to *this* class */}
          <button onClick={this.upVote}>
            <i className="fas fa-thumbs-up" />
          </button>

          {/* refers to *this* class */}
          <button onClick={this.downVote}>
            <i className="fas fa-thumbs-down" />
          </button>
          <button onClick={this.toggleLock}>
            <i
              className={`fas ${this.props.locked ? "fa-unlock" : " fa-lock"}`}
            />
          </button>
          {this.props.votes}
        </div>

        <div className="Joke-text">{this.props.text}</div>
      </div>
    );
  }
}

export default Joke;
