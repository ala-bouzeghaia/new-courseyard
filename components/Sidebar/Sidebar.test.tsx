import { render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import userEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('should load and display menu items', () => {
    render(<Sidebar />);
    const home = screen.getByRole('link', { name: /home/i });
    const schedule = screen.getByRole('link', { name: /schedule/i });
    const courses = screen.getByRole('link', { name: /courses/i });
    const videos = screen.getByRole('link', { name: /videos/i });

    expect(home).toBeInTheDocument();
    expect(schedule).toBeInTheDocument();
    expect(courses).toBeInTheDocument();
    expect(videos).toBeInTheDocument();
  });

  it('should redirect when clicked', async () => {
    render(<Sidebar />, { wrapper: MemoryRouterProvider });
    const user = userEvent.setup();

    await user.click(screen.getByRole('link', { name: /home/i }));
    expect(mockRouter.asPath).toEqual('/');

    await user.click(screen.getByRole('link', { name: /schedule/i }));
    expect(mockRouter.asPath).toEqual('/schedule');

    await user.click(screen.getByRole('link', { name: /courses/i }));
    expect(mockRouter.asPath).toEqual('/courses');

    await user.click(screen.getByRole('link', { name: /videos/i }));
    expect(mockRouter.asPath).toEqual('/videos');
  });
});
