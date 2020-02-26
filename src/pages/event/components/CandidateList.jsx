import React from 'react';
import PropTypes from 'prop-types';
import './CandidateList.css';

const CandidateList = ({ candidates = [], onChange = () => null, candidate }) => (
  <div className="candidate-list max">
    <div className="candidate-list__header header-sm">Candidates List</div>
    <div className="candidate-list__content">
      {candidates.map(({ id, name, disabled }, index) => (
        <div
          style={{
            width:
              candidates.length % 2
                ? candidates.length - 1 === index
                  ? '100%'
                  : 'calc(50% - 5px)'
                : 'calc(50% - 5px)',
          }}
          key={id + name}
          className={
            'candidate-list__candidate ' +
            (candidate === id && !disabled ? 'active' : '') +
            (disabled ? 'disabled' : '')
          }
          onClick={() => !disabled && onChange(id)}
        >
          {name}
        </div>
      ))}
    </div>
  </div>
);

CandidateList.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    }),
  ),
  candidate: PropTypes.number,
  onChange: PropTypes.func,
};

export default CandidateList;
