import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main property search heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Property Search/i);
  expect(headingElement).toBeInTheDocument();
});