import { render, screen } from '@testing-library/react';
import RoundButton from '../RoundButton';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('RoundButton Component', () => {
  it('renders the button with children when not disabled', () => {
    render(
      <BrowserRouter>
        <RoundButton to="/test" className="test-class">
          Test
        </RoundButton>
      </BrowserRouter>
    );

    // Check if the button is rendered
    const button = screen.getByRole('button', { name: /test/i });
    expect(button).toBeInTheDocument();

    // Check if the button has the correct class
    expect(button).toHaveClass('color-primary');
  });

  it('renders a div when disabled', () => {
    render(
      <BrowserRouter>
        <RoundButton to="/test" disabled>
          Disabled
        </RoundButton>
      </BrowserRouter>
    );

    // Check if the div is rendered instead of a button
    const div = screen.getByText(/disabled/i);
    expect(div).toBeInTheDocument();

    // Check if the div has the correct class
    expect(div).toHaveClass('color-secondary');
  });
});
