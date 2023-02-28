import { render, screen } from '@testing-library/react';
import YouTube from 'react-youtube';
import Chapter from './Chapter';
import mockData from '../../__tests__/mockDataChapters.json';

describe('Chapter', () => {
  it('should render chapter content', () => {
    const chapter = mockData.chapters[0];
    render(
      <Chapter
        chapter={chapter}
        currentTime={0}
        player={{} as YouTube}
        globalPlayerState={2}
        setGlobalPlayerState={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('heading', { name: `${chapter.timeStart} ${chapter.title}` }),
    ).toBeInTheDocument();
  });
});
