import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SettingsProvider } from '../context/SettingsContext';
import Contact from '../components/Contact';
import { sendMessage } from '../firebase/services';
vi.mock('../firebase/services', () => ({ sendMessage: vi.fn() }));

function openForm() { render(<SettingsProvider><MemoryRouter><Contact /></MemoryRouter></SettingsProvider>); }
function fillForm() {
  fireEvent.change(screen.getByLabelText('আপনার নাম'), { target: { value: 'আলিফ হাসান' } });
  fireEvent.change(screen.getByLabelText('ফোন / WhatsApp নম্বর'), { target: { value: '০১৭১২ ৩৪৫৬৭৮' } });
  fireEvent.change(screen.getByLabelText('আপনার প্রয়োজন'), { target: { value: 'আমার দোকানের জন্য মাসিক পোস্ট ডিজাইন দরকার।' } });
}
describe('Bengali inquiry form', () => {
  beforeEach(() => vi.clearAllMocks());
  it('focuses the first invalid field without submitting', () => {
    openForm();
    fireEvent.click(screen.getByRole('button', { name: 'আপনার প্রয়োজন জানান' }));
    expect(screen.getByLabelText('আপনার নাম')).toHaveFocus();
    expect(sendMessage).not.toHaveBeenCalled();
  });
  it('accepts Bengali phone digits and an empty optional email', async () => {
    sendMessage.mockResolvedValue('message-id');
    openForm(); fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'আপনার প্রয়োজন জানান' }));
    await waitFor(() => expect(sendMessage).toHaveBeenCalledWith(expect.objectContaining({ phone: '01712345678', email: '' })));
    expect(await screen.findByRole('status')).toHaveTextContent('আপনার বার্তা পেয়েছি।');
    expect(screen.getByRole('status')).toHaveFocus();
  });
  it('keeps the draft and allows retry after a network failure', async () => {
    sendMessage.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce('message-id');
    openForm(); fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'আপনার প্রয়োজন জানান' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('আপনার লেখা রাখা আছে');
    expect(screen.getByLabelText('আপনার প্রয়োজন')).toHaveValue('আমার দোকানের জন্য মাসিক পোস্ট ডিজাইন দরকার।');
    fireEvent.click(screen.getByRole('button', { name: 'আপনার প্রয়োজন জানান' }));
    expect(await screen.findByRole('status')).toHaveTextContent('আপনার বার্তা পেয়েছি।');
    expect(sendMessage).toHaveBeenCalledTimes(2);
  });
  it('blocks a second submit while the first request is in flight', async () => {
    let resolve;
    sendMessage.mockImplementation(() => new Promise(done => { resolve = done; }));
    openForm(); fillForm();
    const form = screen.getByLabelText('আপনার নাম').closest('form');
    fireEvent.submit(form); fireEvent.submit(form);
    await waitFor(() => expect(sendMessage).toHaveBeenCalledTimes(1));
    resolve('message-id');
    await screen.findByRole('status');
  });
  it('includes optional business, budget and timeline information', async () => {
    sendMessage.mockResolvedValue('message-id');
    openForm(); fillForm();
    fireEvent.change(screen.getByLabelText(/ব্যবসার নাম/), { target: { value: 'পরীক্ষামূলক প্রতিষ্ঠান' } });
    fireEvent.change(screen.getByLabelText(/আনুমানিক বাজেট/), { target: { value: '৳১০,০০০' } });
    fireEvent.change(screen.getByLabelText(/কবে নাগাদ প্রয়োজন/), { target: { value: 'আগামী মাসে' } });
    fireEvent.click(screen.getByRole('button', { name: 'আপনার প্রয়োজন জানান' }));
    await waitFor(() => expect(sendMessage).toHaveBeenCalledWith(expect.objectContaining({ company: 'পরীক্ষামূলক প্রতিষ্ঠান', budget: '৳১০,০০০', timeline: 'আগামী মাসে' })));
    await screen.findByRole('status');
  });

});
