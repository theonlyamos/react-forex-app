import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './PageLayout.css';

class PageLayout extends PureComponent {
  static propTypes = {
    header: PropTypes.string,
    content: PropTypes.element,
  };

  render() {
    const { header, content } = this.props;
    const contentWithProps = React.Children.map(content, child =>
      React.cloneElement(child, { socket: this.props.socket, router: this.props.router })
    );
    return (
      <div className="page-layout">
        <div className="page-layout__header">
          <div className="page-layout__name">{header}</div>
        </div>
        <div className="page-layout__content">{contentWithProps}</div>
      </div>
    );
  }
}

export default PageLayout;
