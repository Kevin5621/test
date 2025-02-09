import { useEffect, useState, useRef } from "react";
import { Typewriter } from "./hook/Animated_typeWritter";
import { AnimatedButton } from "./hook/AnimatedButton";
import { cardClick } from "./hook/getCard";

const Hero = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const cardTimer = setTimeout(() => setCardVisible(true), 500);
    const contentTimer = setTimeout(() => setContentVisible(true), 1500);
    const buttonTimer = setTimeout(() => setButtonsVisible(true), 6300);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const scrolled = Math.min(
              Math.max((1 - entry.intersectionRatio) * 1.2, 0),
              1
            );
            setScrollProgress(scrolled);
          } else {
            setScrollProgress(1);
          }
        });
      },
      {
        threshold: Array.from({ length: 100 }, (_, i) => i / 100),
        rootMargin: "-25% 0px -15% 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      clearTimeout(cardTimer);
      clearTimeout(contentTimer);
      clearTimeout(buttonTimer);
      observer.disconnect();
    };
  }, []);

  const getCardStyles = cardClick(isPressed, cardVisible, scrollProgress);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let startTime: number | null = null;

        const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const scrollProgress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutQuad(scrollProgress);
            window.scrollTo(0, startPosition + distance * ease);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        const easeInOutQuad = (t: number) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        requestAnimationFrame(animation);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="home" 
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark transition-colors duration-200"
    >
      <div className="w-full max-w-4xl mx-auto text-center pt-16 sm:pt-15 px-4 sm:px-6 flex items-center min-h-screen">
        <div 
          className={`
            w-full min-h-[520px] sm:min-h-[460px] p-6 sm:p-8 rounded-2xl 
            transition-all duration-400 ease-out my-auto
            ${cardVisible ? 'opacity-100' : 'opacity-0'}
            cursor-pointer relative bg-gray-100 dark:bg-dark
          `}
          style={getCardStyles()}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
        >
          {contentVisible && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8">
              <div className="w-full">
                <Typewriter 
                  text="Yohanes Kevin Gilang Pratama"
                  delay={0}
                  className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4"
                />
              </div>

              <div className="w-full">
                <Typewriter 
                  text="Smart Contract Developer"
                  delay={1900}
                  className="block text-lg sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-6"
                />
              </div>

              <div className="mb-10 w-full max-w-2xl mx-auto">
                <Typewriter 
                  text="I make elegant solutions to complex problems, specializing in React, Dart, and BlockChain Technology. Let's build something amazing together."
                  delay={2900}
                  speed={13}
                  className="block text-sm sm:text-lg text-gray-600 dark:text-gray-300"
                />
              </div>

              <div className="flex flex-col items-center sm:flex-row sm:justify-center gap-4 sm:gap-6 w-full">
                <div className="w-48 sm:w-auto">
                  <AnimatedButton 
                    text="View Projects" 
                    delay={1000}
                    buttonVisible={buttonsVisible}
                    onClick={() => scrollToSection('projects')}
                    icon={null} 
                  />
                </div>
                <div className="w-48 sm:w-auto">
                  <AnimatedButton 
                    text="Contact Me" 
                    delay={1000}
                    buttonVisible={buttonsVisible}
                    onClick={() => scrollToSection('contact')}
                    icon={null} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
