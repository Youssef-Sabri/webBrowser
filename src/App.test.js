import { render, screen } from '@testing-library/react';
import App from './App';

test('renders browser window', () => {
  render(<App />);
  // Check if the browser window component is rendered
  const browserElement = screen.getByRole('region', { name: /start page/i });
  expect(browserElement).toBeInTheDocument();
});

test('renders ATLAS logo on start page', () => {
  render(<App />);
  const logoElement = screen.getByText(/ATLAS/i);
  expect(logoElement).toBeInTheDocument();
});