import { render, screen } from '@testing-library/react';
import YouTube from 'react-youtube';
import ChapterList from './ChapterList';
import mockData from '../../__tests__/mockDataChapters.json';

describe('ChapterList', () => {
  it('should render chapters list', () => {
    render(
      <ChapterList
        chapters={mockData.chapters}
        currentTime={0}
        playerRef={{} as React.MutableRefObject<YouTube>}
        globalPlayerState={2}
        setGlobalPlayerState={jest.fn()}
      />,
    );
    mockData.chapters.forEach((chapter) =>
      expect(
        screen.getByRole('heading', { name: `${chapter.timeStart} ${chapter.title}` }),
      ).toBeInTheDocument(),
    );
  });
});
