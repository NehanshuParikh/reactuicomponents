import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom';
import { InputField } from './InputField';
import { vi } from 'vitest';
import React from "react";
describe('InputField', () => {
  it('associates label with input', () => {
    render(<InputField label="Email" placeholder="e.g. user@example.com" />);
    const input = screen.getByPlaceholderText(/user@example.com/i);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', input.getAttribute('id'));
  });

  it('shows error when invalid', () => {
    render(<InputField invalid errorMessage="Invalid" />);
    expect(screen.getByText('Invalid')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('calls onChange', () => {
    const fn = vi.fn();
    render(<InputField onChange={fn} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hi' } });
    expect(fn).toHaveBeenCalled();
  });
});