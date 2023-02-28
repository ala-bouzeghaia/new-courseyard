import { queryByAttribute, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Videos from '../pages/videos';
import mockDataChapters from './mockDataChapters.json';
import YouTube from 'react-youtube';

const TestQueryProvider = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

jest.mock('../hooks/useChapters', () => ({
  useChapters: () => {
    return mockDataChapters;
  },
}));

describe('videos', () => {
  it('should renders video title', () => {
    render(<Videos />, { wrapper: TestQueryProvider });
    const title = screen.getByRole('heading', { name: /React JS Crash Course/ });
    expect(title).toBeInTheDocument();
  });

  it('should render YouTube player', () => {
    const { container } = render(<YouTube id="custom-id" videoId="w7ejDZ8SWv8" />);
    expect(queryByAttribute('id', container, 'custom-id')).toBeInTheDocument();
  });

  it('should render chapters list', () => {
    render(<Videos />, { wrapper: TestQueryProvider });
    mockDataChapters.chapters.forEach((chapter) =>
      expect(
        screen.getByRole('heading', { name: `${chapter.timeStart} ${chapter.title}` }),
      ).toBeInTheDocument(),
    );
  });
});
