import { render, screen } from '@testing-library/react';
import App from './App';

test('renders browser window', () => {
  render(<App />);
  // Check if the browser window component is rendered
  // Updated to match the new aria-label "New Tab"
  const browserElement = screen.getByRole('region', { name: /new tab/i });
  expect(browserElement).toBeInTheDocument();
});

test('renders ATLAS logo on start page', () => {
  render(<App />);
  const logoElement = screen.getByText(/ATLAS/i);
  expect(logoElement).toBeInTheDocument();
});