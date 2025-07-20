import React from 'react';
import styles from './ErrorButton.module.css';

class ErrorButton extends React.Component {
  state = { shouldError: false };

  triggerError = () => {
    this.setState({ shouldError: true });
  };

  render() {
    if (this.state.shouldError) {
      throw new Error('Test error triggered by button click');
    }

    return (
      <button className={styles.errorButton} onClick={this.triggerError}>
        Trigger Test Error
      </button>
    );
  }
}

export default ErrorButton;
