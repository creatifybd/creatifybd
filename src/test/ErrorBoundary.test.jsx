import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

describe('Error recovery', () => {
  it('keeps successful content visible', () => {
    render(<ErrorBoundary><p>আপনার কাজ</p></ErrorBoundary>);
    expect(screen.getByText('আপনার কাজ')).toBeVisible();
  });
  it('shows Bengali recovery controls when a page fails', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const Broken = () => { throw new Error('Route unavailable'); };
    render(<ErrorBoundary><Broken /></ErrorBoundary>);
    expect(screen.getByRole('alert')).toHaveTextContent('সাময়িক ত্রুটি হয়েছে');
    expect(screen.getByRole('button', { name: 'পুনরায় লোড করুন' })).toBeEnabled();
    expect(screen.getByRole('link', { name: 'হোম পেজ' })).toHaveAttribute('href', '/');
    log.mockRestore();
  });
  it('recovers a failed section without discarding the rest of the page', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    let unavailable = true;
    const Section = () => { if (unavailable) throw new Error('Temporary failure'); return <p>আবার দেখা যাচ্ছে</p>; };
    render(<><p>আপনার লেখা রাখা আছে</p><ErrorBoundary level="section"><Section /></ErrorBoundary></>);
    unavailable = false;
    fireEvent.click(screen.getByRole('button', { name: 'আবার চেষ্টা করুন' }));
    expect(screen.getByText('আবার দেখা যাচ্ছে')).toBeVisible();
    expect(screen.getByText('আপনার লেখা রাখা আছে')).toBeVisible();
    log.mockRestore();
  });
});
