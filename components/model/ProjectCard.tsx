import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, GithubIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { ImageViewer } from '../helper/ImageViewer';
import { ProjectFeatures } from './types';
import { Typewriter } from '../hook/Animated_typeWritter';
import { AnimatedButton } from '../hook/AnimatedButton';
import { useTheme } from '../../styles/themeContexts';

interface ProjectImage {
  image: string;
  title: string;
}

interface Project {
  title: string;
  description: string;
  image: ProjectImage[];
  technologies: string[];
  githubUrl: string;
  features?: ProjectFeatures;
}

interface ProjectCardProps extends Project {
  index: number;
  isVisible: boolean;
  typewriterDelay: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  technologies,
  githubUrl,
  features,
  isVisible,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTechnologies, setShowTechnologies] = useState(false);
  const [currentTechIndex, setCurrentTechIndex] = useState(-1);
  const hasAnimatedTech = useRef(false);
  const [showImage, setShowImage] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState('0px');
  const [, setIsAnimating] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [titleFinished, setTitleFinished] = useState(false);
  const [descriptionFinished, setDescriptionFinished] = useState(false);
  const [readMoreFinished, setReadMoreFinished] = useState(false);
  const [technologiesFinished, setTechnologiesFinished] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const animateTechnologies = useCallback(() => {
    if (technologies.length > 0 && !hasAnimatedTech.current) {
      const processSequentialTech = (index: number) => {
        if (index < technologies.length) {
          setCurrentTechIndex(index);
  
          setTimeout(() => {
            const techTextLength = technologies[index].length;
            const typewriterDelay = techTextLength * 50;
  
            setTimeout(() => {
              processSequentialTech(index + 1);
            }, typewriterDelay);
  
            if (index === technologies.length - 1) {
              setTimeout(() => {
                setTechnologiesFinished(true);
                hasAnimatedTech.current = true;
              }, typewriterDelay);
            }
          }, 300);
        }
      };
  
      processSequentialTech(0);
    }
  }, [technologies]);

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + ' ...';
  };
    
  // Add this effect to force shadow recalculation on theme change
  useEffect(() => {
    const forceUpdate = () => {
      setScrollProgress(prev => prev + 0.01);
      requestAnimationFrame(() => {
        setScrollProgress(prev => Math.max(prev - 0.01, 0));
      });
    };
    forceUpdate();
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const scrolled = Math.min(
          Math.max(window.scrollY / (window.innerHeight * 0.3), 0),
          1
        );
        setScrollProgress(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setIsAnimating(true);
      const height = isExpanded ? `${contentRef.current.scrollHeight}px` : '0px';
      setContentHeight(height);

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isExpanded, features]);

  useEffect(() => {
    if (isVisible) {
      const animationSequence = async () => {
        // Initial card visibility
        setCardVisible(true);
  
        // Staggered animation delays
        const baseDelay = 100;
  
        // Title animation
        setShowTitle(true);
        await new Promise(resolve => setTimeout(resolve, title.length * 30));
        setTitleFinished(true);
  
        // Description animation (faster speed)
        setShowDescription(true);
        await new Promise(resolve => setTimeout(resolve, description.length * 10));
        setDescriptionFinished(true);
  
        // Read more animation
        setShowReadMore(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setReadMoreFinished(true);
  
        // Technologies animation with more noticeable progression
        await new Promise(resolve => {
          setShowTechnologies(true);
          animateTechnologies();
          setTimeout(resolve, technologies.length * 150 + baseDelay * 2);
        });
        setTechnologiesFinished(true);
  
        // Image and final elements with staggered delays
        await new Promise(resolve => {
          // Stagger the appearance of different elements
          const imageDelay = setTimeout(() => {
            setShowImage(true);
          }, baseDelay);
  
          const navButtonsDelay = setTimeout(() => {
            setShowNavButtons(true);
          }, baseDelay * 3);
  
          const contentDelay = setTimeout(() => {
            setShowContent(true);
            resolve(null);
          }, baseDelay * 4);
  
          return () => {
            clearTimeout(imageDelay);
            clearTimeout(contentDelay);
            clearTimeout(navButtonsDelay);
          };
        });

        await new Promise(resolve => {
          const buttonTimer = setTimeout(() => {
            setButtonsVisible(true);
            resolve(null);
          }, baseDelay * 6);

          return () => {
            clearTimeout(buttonTimer);
          };
        });
      };
  
      const initialDelay = setTimeout(animationSequence, 200);
  
      return () => {
        clearTimeout(initialDelay);
      };
    }
  }, [
    isVisible, 
    title.length, 
    description.length, 
    technologies.length, 
    animateTechnologies
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('.card');
      if (element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distance = Math.abs(elementCenter - viewportCenter);
        const maxDistance = windowHeight / 2 + rect.height / 2;
        
        const progress = Math.min(distance / maxDistance, 1);
        setScrollProgress(progress);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % image.length);
  }, [image.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + image.length) % image.length);
  }, [image.length]);

  const getCardStyle = () => {
    const baseIntensity = 1;
    const scrollEffect = scrollProgress * 1.2;
    const shadowIntensity = Math.max(baseIntensity - scrollEffect, 0);

    const lightOuterShadow = `
      ${16 * shadowIntensity}px ${16 * shadowIntensity}px ${32 * shadowIntensity}px #d1d1d1,
      ${-16 * shadowIntensity}px ${-16 * shadowIntensity}px ${32 * shadowIntensity}px #ffffff,
      0 0 ${15 * shadowIntensity}px rgba(209, 209, 209, 0.7)
    `; // Added third shadow for more depth

    // Dark theme shadows
    const darkOuterShadow = `
      ${16 * shadowIntensity}px ${16 * shadowIntensity}px ${32 * shadowIntensity}px #151515,
      ${-16 * shadowIntensity}px ${-16 * shadowIntensity}px ${32 * shadowIntensity}px #353535,
      0 0 ${15 * shadowIntensity}px rgba(21, 21, 21, 0.7)
    `; // Added third shadow for more depth

    const isDark = document.documentElement.classList.contains('dark');
    const shadow = isDark ? darkOuterShadow : lightOuterShadow;

    return {
      transform: `
        scale(${cardVisible ? (isHovered ? 1.02 : 1) : 0.95})
        translateY(${isHovered ? -8 : 0}px)
      `,
      boxShadow: cardVisible ? shadow : 'none',
      opacity: 1, // Add this to ensure visibility
    };
  };

  return (
    <>
      {isFullscreen && (
        <ImageViewer
          images={image}
          currentIndex={currentImageIndex}
          onClose={() => setIsFullscreen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      
    <div 
      ref={cardRef}
      className={`opacity-0 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 delay-100' : ''
      }`}
    >
      <div 
        className="card rounded-2xl bg-gray-100 dark:bg-dark p-4 relative overflow-hidden h-full
          transition-all duration-500 ease-in-out will-change-[box-shadow]"
        style={getCardStyle()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
          <div className="flex flex-col h-full">
            {/* Fixed Height Top Section */}
            <div className="min-h-[120px]">
              {/* Title */}
              <h3 className={`text-xl font-semibold text-gray-800 dark:text-gray-100 h-7 mb-3 transition-opacity duration-500 ${showTitle ? 'opacity-100' : 'opacity-0'}`}>
                {isVisible && (
                  <Typewriter 
                    text={title}
                    delay={0}
                    speed={100}
                    className="inline"
                    onComplete={() => setTitleFinished(true)}
                  />
                )}
              </h3>

              {/* Description */}
              <div className={`transition-all duration-500 ${showDescription ? 'opacity-100' : 'opacity-0'}`}>
                {isVisible && titleFinished && (
                  <Typewriter
                    text={isExpanded ? description : truncateDescription(description, 300)}
                    delay={0}
                    speed={10}
                    className="text-gray-600 dark:text-gray-300"
                    onComplete={() => setDescriptionFinished(true)}
                  />
                )}
              </div>
            </div>

            {/* Read More Section - Fixed Height */}
            <div className="h-[40px] flex items-center">
              {(description.length > 150 || features) && (
                <div className={`transition-all duration-500 ${showReadMore ? 'opacity-100' : 'opacity-0'}`}>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 
                             dark:hover:text-gray-200 flex items-center gap-1"
                  >
                    {isVisible && descriptionFinished && (
                      <Typewriter
                        text={isExpanded ? "Show less" : "Read more"}
                        delay={0}
                        speed={30}
                        className="flex items-center gap-1"
                        onComplete={() => setReadMoreFinished(true)}
                      />
                    )}
                    {isExpanded ? (
                      <ChevronUpIcon className="transform transition-transform duration-500" size={16} />
                    ) : (
                      <ChevronDownIcon className="transform transition-transform duration-500" size={16} />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Features Content - Expandable */}
            <div
              ref={contentRef}
              style={{
                maxHeight: contentHeight,
                transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden'
              }}
              className={`transition-all duration-500 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
            >
              {features && (
                <div className="grid grid-cols-1 gap-2 py-2">
                  {features.sections.map((section, idx) => (
                    <div 
                      key={idx} 
                      className="space-y-1"
                      style={{
                        transform: `translateY(${isExpanded ? '0' : '10px'})`,
                        opacity: isExpanded ? 1 : 0,
                        transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.1}s`
                      }}
                    >
                      <h4 className="font-medium text-gray-700 dark:text-gray-200">
                        {section.title}
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                        {section.items.map((item, itemIdx) => (
                          <li 
                            key={itemIdx}
                            style={{
                              transform: `translateY(${isExpanded ? '0' : '5px'})`,
                              opacity: isExpanded ? 1 : 0,
                              transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${(idx * 0.1 + itemIdx * 0.05)}s`
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Technologies Section - Fixed Height */}
            <div className="h-[60px] flex items-center">
              <div className={`w-full transition-all duration-500 ${showTechnologies ? 'opacity-100' : 'opacity-0'}`}>
                {isVisible && readMoreFinished && (
                  <div className="flex flex-wrap gap-1.5">
                    {technologies.map((tech, idx) => (
                      <div
                        key={tech}
                        className={`px-3 py-1 text-sm rounded-full text-gray-600 dark:text-gray-300 
                                    bg-gray-100 dark:bg-dark transition-all duration-500
                                    ${idx <= currentTechIndex ? 'shadow-neumorph-inset dark:shadow-neumorph-dark-inset' : ''}`}
                        style={{
                          transitionDelay: `${idx * 0}ms`
                        }}
                      >
                        {idx <= currentTechIndex && (
                          <Typewriter
                            text={tech}
                            delay={300}
                            speed={45}
                            className="inline"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section with Fixed Heights */}
            <div className="mt-auto">
              {/* Image Section - Fixed Height */}
              <div className="h-[300px] mb-4">
                {image && image.length > 0 && isVisible && technologiesFinished && (
                  <div 
                    className={`rounded-lg bg-gray-100 dark:bg-dark p-2 h-full 
                      transition-all duration-1000 ease-in-out relative overflow-hidden
                      ${showImage 
                        ? 'shadow-neumorph-inset dark:shadow-neumorph-dark-inset' 
                        : 'shadow-none'}`}
                  >
                    <div 
                      className={`absolute inset-0 z-10 transition-all duration-1000 ease-in-out
                        ${showImage 
                          ? 'bg-white/10 dark:bg-black/10 opacity-100' 
                          : 'bg-transparent opacity-0'}`}
                    />
                    
                    <div 
                      className={`relative h-full rounded-lg overflow-hidden cursor-pointer
                        transition-all duration-1000 ease-in-out
                        ${showContent ? 'opacity-100' : 'opacity-0'}`}
                      onClick={() => setIsFullscreen(true)}
                    >
                      {/* Layer for morphing effect */}
                      <div 
                        className={`absolute inset-0 z-20 bg-gray-200 dark:bg-gray-800 
                          transition-all duration-1000 ease-in-out
                          ${showImage 
                            ? 'opacity-0 scale-110 rotate-[2deg]' 
                            : 'opacity-100 scale-100 rotate-0'}`}
                      />

                      <img
                        src={image[currentImageIndex].image}
                        alt={image[currentImageIndex].title}
                        className={`w-full h-full object-contain absolute inset-0 z-30
                          transition-all duration-1000 ease-in-out
                          ${showImage 
                            ? 'opacity-100 scale-100 blur-none' 
                            : 'opacity-0 scale-95 blur-sm'}`}
                      />

                      <p 
                        className={`absolute bottom-2 left-2 text-sm text-gray-600 dark:text-gray-300 
                          bg-white/80 dark:bg-black/80 px-2 py-1 rounded z-40
                          transition-all duration-1000 ease-in-out
                          ${showContent 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-2'}`}
                      >
                        {image[currentImageIndex].title} ({currentImageIndex + 1}/{image.length})
                      </p>
                    </div>

                    {image.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10
                                   flex items-center justify-center transition-all duration-500
                                   ${showNavButtons ? 'opacity-80 hover:opacity-100' : 'opacity-0'}`}
                        >
                          <ChevronLeftIcon size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={handleNext}
                          className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10
                                   flex items-center justify-center transition-all duration-500
                                   ${showNavButtons ? 'opacity-80 hover:opacity-100' : 'opacity-0'}`}
                        >
                          <ChevronRightIcon size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* GitHub Button - Fixed Height */}
              <div className="h-[40px] flex items-center">
                <div className="w-48 sm:w-auto">
                  {isVisible && technologiesFinished && (
                    <AnimatedButton
                    text="View on GitHub"
                    delay={1000}
                    buttonVisible={buttonsVisible}
                    onClick={() => window.open(githubUrl, '_blank', 'noopener,noreferrer')}
                    icon={<GithubIcon size={16} />}
                    parentRef={cardRef}
                    variant="subtle"
                  />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};