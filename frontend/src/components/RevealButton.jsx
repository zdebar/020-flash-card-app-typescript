import "./RevealButton.css";
import PropTypes from 'prop-types';

export default function RevealButton({ onClick }) {
  return (
    <button onClick={onClick} className="revealButton flex justify-center align-center border">
      Reveal
    </button>
  );
}

RevealButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};