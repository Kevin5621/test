import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?:() => void
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text = '',
  delay = 0,
  speed = 50,
  className = ''
}) => {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);
  const [delayComplete, setDelayComplete] = useState(false);
  
  // Clean the input text to remove any undefined values
  const cleanText = text?.replace(/undefined/g, '').trim() || '';

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
      setDelayComplete(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started || !cleanText) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < cleanText.length) {
        setDisplayText(cleanText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [cleanText, speed, started]);

  return (
    <span className={className}>
      {displayText}
      {delayComplete && displayText.length < cleanText.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};