// src/components/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-red-600">
          <h2 className="text-xl font-bold">Une erreur est survenue.</h2>
          <p>Essayez de recharger la page ou contactez le support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
