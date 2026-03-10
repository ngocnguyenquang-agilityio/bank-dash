import { render, screen, fireEvent } from '@testing-library/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './carousel';

// Mock embla-carousel-react
const mockScrollPrev = jest.fn();
const mockScrollNext = jest.fn();
const mockCanScrollPrev = jest.fn().mockReturnValue(false);
const mockCanScrollNext = jest.fn().mockReturnValue(true);
const mockOn = jest.fn();
const mockOff = jest.fn();

jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [
    jest.fn(), // ref callback
    {
      scrollPrev: mockScrollPrev,
      scrollNext: mockScrollNext,
      canScrollPrev: mockCanScrollPrev,
      canScrollNext: mockCanScrollNext,
      on: mockOn,
      off: mockOff,
    },
  ],
}));

describe('Carousel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with carousel role', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('renders carousel items as slides', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const slides = screen.getAllByRole('group');
    expect(slides).toHaveLength(2);
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide');
  });

  it('renders previous and next buttons', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );

    expect(screen.getByText('Previous slide')).toBeInTheDocument();
    expect(screen.getByText('Next slide')).toBeInTheDocument();
  });

  it('handles keyboard navigation with ArrowLeft', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const carousel = screen.getByRole('region');
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    expect(mockScrollPrev).toHaveBeenCalled();
  });

  it('handles keyboard navigation with ArrowRight', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const carousel = screen.getByRole('region');
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(mockScrollNext).toHaveBeenCalled();
  });

  it('disables previous button when canScrollPrev is false', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
      </Carousel>,
    );

    const prevButton = screen.getByText('Previous slide').closest('button')!;
    expect(prevButton).toBeDisabled();
  });

  it('calls scrollNext on next button click', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselNext />
      </Carousel>,
    );

    fireEvent.click(screen.getByText('Next slide').closest('button')!);
    expect(mockScrollNext).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <Carousel className="custom-class">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    expect(screen.getByRole('region')).toHaveClass('custom-class');
  });
});
