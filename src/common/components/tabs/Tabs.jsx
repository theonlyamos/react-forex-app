import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Tabs.css';

class Tabs extends Component {
  static propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    panels: PropTypes.arrayOf(PropTypes.element),
  };

  state = {
    active: 0,
  };

  handleActiveTab = index => () => {
    this.setState({ active: index });
  };

  render() {
    const { headers = [], panels = [] } = this.props;
    const { active } = this.state;

    return (
      <div className="tab">
        <div className="tab__header">
          {headers && headers.map((header, index) => (
            <span
              key={header}
              className={active === index ? 'tab__header_active' : ''}
              onClick={this.handleActiveTab(index)}
              id={active !== index ? 'tab_panel' : ''}
            >
              {header}
            </span>
          ))}
        </div>
        {panels.map((panel, index) => (
          <div
            key={index}
            className={'tab__panel ' + (active === index ? 'tab__panel_active' : '')}
          >
            {panel}
          </div>
        ))}
      </div>
    );
  }
}

export default Tabs;
