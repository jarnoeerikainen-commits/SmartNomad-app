import { ReactNode } from 'react';

interface PitchDeckSlideProps {
  children: ReactNode;
  className?: string;
  background?: string;
}

export const PitchDeckSlide = ({
  children,
  className = '',
  background = 'bg-gradient-to-br from-background via-background to-accent/5',
}: PitchDeckSlideProps) => {
  return (
    <div
      className={`w-full h-[600px] rounded-xl p-12 shadow-2xl flex flex-col justify-center ${background} ${className} animate-fade-in`}
    >
      {children}
    </div>
  );
};
