"use client";

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

// Component hiển thị Banner AdSense
function AdSenseBanner() {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="my-8 flex justify-center overflow-hidden w-full">
      <ins className="adsbygoogle"
           style={{ display: 'inline-block', width: '728px', height: '90px', maxWidth: '100%' }}
           data-ad-client="ca-pub-8108202645906541"
           data-ad-slot="6154669759"></ins>
    </div>
  );
}

// Component hiển thị 1 cụm Canvas
interface CanvasChunkProps {
  paragraphs: string[];
}

const CanvasChunk = memo(({ paragraphs }: CanvasChunkProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || paragraphs.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get computed styles from container to inherit ReadingSettings
    const readingContent = document.getElementById("reading-content");
    const styleSource = readingContent || container;
    const computedStyle = window.getComputedStyle(styleSource);
    const fontSize = parseFloat(computedStyle.fontSize) || 18;
    const fontFamily = computedStyle.fontFamily || 'serif';
    
    // Parse line height. `computedStyle.lineHeight` might be "normal" or "32px".
    let lineHeightPx = fontSize * 1.8; // default
    if (computedStyle.lineHeight !== 'normal') {
        const parsed = parseFloat(computedStyle.lineHeight);
        if (!isNaN(parsed)) {
            lineHeightPx = parsed;
        }
    }

    const color = computedStyle.color || '#000';
    
    // Support high DPI screens
    const dpr = window.devicePixelRatio || 1;
    
    // Set width to container width
    const width = container.clientWidth;
    const padding = 0; // We rely on container's padding
    const maxWidth = width - padding * 2;
    
    // We need to calculate the height first by simulating the drawing
    ctx.font = `${computedStyle.fontWeight || 'normal'} ${fontSize}px ${fontFamily}`;
    
    // Helper to wrap text
    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    const paragraphSpacing = fontSize * 1.2;
    
    // Calculate total height
    let totalHeight = padding;
    const wrappedParagraphs = paragraphs.map(text => {
      const lines = wrapText(text, maxWidth);
      const height = lines.length * lineHeightPx;
      totalHeight += height + paragraphSpacing;
      return lines;
    });

    // Add extra padding at the bottom
    totalHeight += padding;

    // Set canvas dimensions
    canvas.width = width * dpr;
    canvas.height = totalHeight * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${totalHeight}px`;

    // Scale context for high DPI
    ctx.scale(dpr, dpr);

    // Clear canvas before drawing to avoid artifacts
    ctx.clearRect(0, 0, width, totalHeight);

    // Draw
    ctx.font = `${computedStyle.fontWeight || 'normal'} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';

    let y = padding;
    wrappedParagraphs.forEach(lines => {
      lines.forEach(line => {
        ctx.fillText(line, padding, y);
        y += lineHeightPx;
      });
      y += paragraphSpacing;
    });
  };

  useEffect(() => {
    // Initial render
    // Use a small timeout to let the ReadingSettings apply its classes first
    const timer = setTimeout(renderCanvas, 150);

    // Re-render on resize
    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        requestAnimationFrame(renderCanvas);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // Observer for ReadingSettings injecting classes into #reading-content
    const readingContent = document.getElementById("reading-content");
    let observer: MutationObserver | null = null;
    let themeObserver: MutationObserver | null = null;
    
    // We need to wait for CSS transitions (like duration-300 or duration-500) to finish
    // before reading computedStyle.color, otherwise we get intermediate faded colors.
    const debouncedRender = () => {
      setTimeout(renderCanvas, 350); 
    };

    if (readingContent) {
        observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
              if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                debouncedRender();
              }
          });
        });
        observer.observe(readingContent, { attributes: true });
    }

    // Observe theme changes on the <html> element
    themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          debouncedRender();
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      if (themeObserver) themeObserver.disconnect();
    };
  }, [paragraphs, resolvedTheme]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas 
        ref={canvasRef} 
        className="w-full block select-none pointer-events-none" 
        style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
      />
    </div>
  );
});
CanvasChunk.displayName = 'CanvasChunk';

interface CanvasNovelReaderProps {
  content: string;
}

export function CanvasNovelReader({ content }: CanvasNovelReaderProps) {
  // Split into paragraphs (removing empty lines if any)
  const paragraphs = content.split('\n').map(p => p.trim()).filter(p => p.length > 0);
  
  // Teaser for SEO: First 2 paragraphs
  const teaserParagraphs = paragraphs.slice(0, 2);
  const canvasParagraphs = paragraphs.slice(2);

  // Split canvas paragraphs into chunks of ~2000 words
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;
  const WORDS_PER_AD = 2000;

  canvasParagraphs.forEach(p => {
    // Count words in the current paragraph
    const words = p.split(/\s+/).length;
    currentChunk.push(p);
    currentWordCount += words;

    // If the chunk exceeds the limit, push it and start a new one
    if (currentWordCount >= WORDS_PER_AD) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentWordCount = 0;
    }
  });
  
  // Don't forget the last chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return (
    <div className="canvas-novel-reader w-full">
      {/* SEO Teaser (Real DOM) */}
      <div className="teaser-content space-y-4 mb-4">
        {teaserParagraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
      
      {/* Protected Content (Chunks of Canvas interleaved with Ads) */}
      {chunks.map((chunk, index) => (
        <React.Fragment key={index}>
          <CanvasChunk paragraphs={chunk} />
          
          {/* Insert an AdSense Banner between chunks (except after the very last one) */}
          {/* index < chunks.length - 1 && <AdSenseBanner /> */}
        </React.Fragment>
      ))}
    </div>
  );
}
