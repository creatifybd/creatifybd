import React from 'react';

// The public recovery path must not depend on administration animation code.
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) {
    console.error('Page error', error, info);
    try { this.props.onError?.(error, info); } catch { /* Reporting must not break recovery. */ }
  }
  handleReset = () => {
    if (this.props.level === 'section') this.setState({ hasError: false });
    else window.location.reload();
  };
  render() {
    if (!this.state.hasError) return this.props.children;
    const section = this.props.level === 'section';
    return <div className="cb-error-boundary" role="alert" style={{ minHeight: section ? 180 : '100svh', display: 'grid', placeContent: 'center', padding: '32px 20px', color: '#17201d', background: '#fff', textAlign: 'center' }}>
      <h2>সাময়িক ত্রুটি হয়েছে</h2>
      <p>{section ? 'এই অংশটি লোড করা যায়নি। আবার চেষ্টা করুন।' : 'পেজটি আবার লোড করুন অথবা হোম পেজে ফিরে যান।'}</p>
      <div className="cb-actions" style={{ justifyContent: 'center', marginTop: 20 }}>
        <button type="button" className="cb-button cb-button-red" onClick={this.handleReset}>{section ? 'আবার চেষ্টা করুন' : 'পুনরায় লোড করুন'}</button>
        {!section && <a className="cb-button cb-button-outline" href="/">হোম পেজ</a>}
      </div>
    </div>;
  }
}
export default ErrorBoundary;
