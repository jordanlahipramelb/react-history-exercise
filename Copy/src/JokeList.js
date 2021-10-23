import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  // sets default props
  static defaultProps = {
    numJokesToGet: 10,
  };

  // set up base props of class
  constructor(props) {
    super(props);
    // declare states
    this.state = {
      jokes: [],
    };

    // declare and bind functions
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.resetVotes = this.resetVotes.bind(this);
    this.toggleLock = this.toggleLock.bind(this);
    this.vote = this.vote.bind(this);
  }

  // call getJokes when component mounts
  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  // retrieve jokes from API
  // useEffect
  async getJokes() {
    try {
      // load jokes instate
      let jokes = this.state.jokes;
      // jokes found in localStorage
      let jokeVotes = JSON.parse(
        window.localStorage.getItem("jokeVotes") || "{}"
      );
      let seenJokes = new Set(jokes.map((j) => j.id));

      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokeVotes[joke.id] = jokeVotes[joke.id] || 0;
          jokes.push({ ...joke, votes: jokeVotes[joke.id], locked: false });
        } else {
          console.log("duplicate found!");
        }
      }

      // set state to jokes
      this.setState({ jokes });
      window.localStorage.setItem("jokeVotes", JSON.stringify(jokeVotes));
    } catch (e) {
      console.log(e);
    }
  }

  // empty joke list, set to loasing state, then call getJokes
  generateNewJokes() {
    this.setState((state) => ({ jokes: state.jokes.filter((j) => j.locked) }));
  }

  resetVotes() {
    // reset votes in localStorage
    window.localStorage.setItem("jokeVotes", "{}");
    this.setState((st) => ({
      // map through jokes and add a votes object to each
      jokes: st.jokes.map((joke) => ({ ...joke, votes: 0 })),
    }));
  }

  /* change vote for this id by delta (+1 or -1) */
  // functions used in children class

  vote(id, delta) {
    let jokeVotes = JSON.parse(window.localStorage.getItem("jokeVotes"));

    jokeVotes[id] = (jokeVotes[id] || 0) + delta;

    window.localStorage.setItem("jokeVotes", JSON.stringify(jokeVotes));

    this.setState((st) => ({
      jokes: st.jokes.map((joke) =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      ),
    }));
  }

  /** “Locks” a joke with a lock button, so that you can keep jokes on the page when you request new jokes. */
  toggleLock(id) {
    this.setState((st) => ({
      jokes: st.jokes.map((joke) =>
        joke.id === id ? { ...joke, locked: !joke.locked } : joke
      ),
    }));
  }

  /* render: either loading spinner or list of sorted jokes. */

  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    let allLocked =
      sortedJokes.filter((j) => j.locked).length === this.props.numJokesToGet;

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={this.generateNewJokes}
          disabled={allLocked}
        >
          Get New Jokes
        </button>
        <button className="JokeList-getmore" onClick={this.resetVotes}>
          Reset Vote Counts
        </button>

        {sortedJokes.map((j) => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={this.vote}
            locked={j.locked}
            toggleLock={this.toggleLock}
          />
        ))}
      </div>
    );
  }
}

export default JokeList;
