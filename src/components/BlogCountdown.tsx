import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BlogCountdownProps {
  targetDate: Date;
  title: string;
  links?: Array<{ text: string; href: string }>;
  className?: string;
}

export function BlogCountdown({ targetDate, title, links = [], className }: BlogCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsPast(true);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={cn(
      "border-2 border-foreground/20 rounded-2xl p-6 text-center my-6 bg-card",
      className
    )}>
      <div className="text-sm opacity-80 mb-2">{title}</div>
      <div className="text-4xl font-bold leading-tight">
        {isPast ? (
          <span>Bugün 💘</span>
        ) : (
          <span>
            {timeLeft.days} gün {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
        )}
      </div>
      {links.length > 0 && (
        <div className="mt-4 flex gap-3 justify-center flex-wrap">
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              className="inline-block px-4 py-2 rounded-full border border-foreground/30 text-sm hover:bg-primary/10 transition-colors"
            >
              {link.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Countdown pattern parser for blog content
export function parseCountdownFromHtml(html: string): {
  targetDate: Date;
  title: string;
  links: Array<{ text: string; href: string }>;
} | null {
  // Match countdown HTML block
  const countdownMatch = html.match(/<!-- COUNTDOWN START -->([\s\S]*?)<!-- COUNTDOWN END -->/);
  if (!countdownMatch) return null;

  const content = countdownMatch[1];

  // Extract target date from script
  const dateMatch = content.match(/new Date\(["']([^"']+)["']\)/);
  if (!dateMatch) return null;

  const targetDate = new Date(dateMatch[1]);
  if (isNaN(targetDate.getTime())) return null;

  // Extract title
  const titleMatch = content.match(/<div[^>]*>([^<]+)<\/div>\s*<div[^>]*id=["'][\w-]+-countdown["']/);
  const title = titleMatch ? titleMatch[1].trim() : 'Geri Sayım';

  // Extract links
  const links: Array<{ text: string; href: string }> = [];
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    links.push({ href: linkMatch[1], text: linkMatch[2].trim() });
  }

  return { targetDate, title, links };
}
