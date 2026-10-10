import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AppointmentCard from '../components/AppointmentCard.jsx';

const base = {
  _id: '1', time: '10:00 AM', illness: 'Migraine', comments: '', report: '', status: 'booked',
  date: '2099-01-10T00:00:00.000Z',
  doctor: { name: 'Dr. Rohan Deshmukh', specialty: 'Neurologist', image: '' }
};

describe('AppointmentCard', () => {
  it('shows doctor, reason and a working cancel button for upcoming bookings', () => {
    const onCancel = vi.fn();
    render(<AppointmentCard appointment={base} onCancel={onCancel} />);
    expect(screen.getByText('Dr. Rohan Deshmukh')).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cancel appointment/i }));
    expect(onCancel).toHaveBeenCalledWith(base);
  });

  it('hides the cancel button once cancelled', () => {
    render(<AppointmentCard appointment={{ ...base, status: 'cancelled' }} onCancel={() => {}} />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel appointment/i })).toBeNull();
  });
});
