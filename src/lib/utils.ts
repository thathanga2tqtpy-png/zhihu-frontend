import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Vài giây trước";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;
  
  const years = Math.floor(months / 12);
  return `${years} năm trước`;
}

export function obfuscateText(text: string): string {
  if (!text) return text;
  
  // Chỉ sử dụng Zero-Width No-Break Space (\uFEFF) và Zero-Width Joiner (\u200D)
  // Tuyệt đối KHÔNG dùng \u200B (Zero Width Space) vì nó sẽ tự động xuống dòng khi thiếu chỗ
  const zeroWidthChars = ['\uFEFF', '\u200D'];
  
  // Sử dụng Intl.Segmenter để tách đúng từng ký tự Tiếng Việt (grapheme)
  // Tránh việc chèn ký tự ẩn vào giữa chữ và dấu (ví dụ: o + ^ -> ô)
  const segmenter = new Intl.Segmenter('vi-VN', { granularity: 'grapheme' });
  
  // Split by line to preserve formatting
  const lines = text.split('\n');
  const obfuscatedLines = lines.map(line => {
    // Split by spaces to process words
    const words = line.split(' ');
    const obfuscatedWords = words.map(word => {
      // Bỏ qua các từ quá ngắn
      if (word.length < 2) return word;
      
      const chars = Array.from(segmenter.segment(word.normalize('NFC'))).map(s => s.segment);
      let newWord = "";
      
      for (let i = 0; i < chars.length; i++) {
        newWord += chars[i];
        // 30% xác suất chèn ký tự ẩn giữa các ký tự (không chèn ở cuối từ)
        if (i < chars.length - 1 && Math.random() < 0.3) { 
          const randomChar = zeroWidthChars[Math.floor(Math.random() * zeroWidthChars.length)];
          newWord += randomChar;
        }
      }
      return newWord;
    });
    return obfuscatedWords.join(' ');
  });
  
  return obfuscatedLines.join('\n');
}
