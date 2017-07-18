import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  content: {
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
};

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
    };
  }

  componentDidMount() {
    const stopper = this.props.text + '...';
    this.interval = window.setInterval(() => {
      if (this.state.text === stopper) {
        this.setState(() => (
          { text: this.props.text }
        ));
      } else {
        this.setState(prevState => (
          { text: prevState.text + '.' }
        ));
      }
    }, this.props.speed);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <p style={styles.content}>
        {this.state.text}
      </p>
    );
  }
}

Loading.defaultProps = {
  text: 'Loading',
  speed: 300,
};

Loading.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired,
};
