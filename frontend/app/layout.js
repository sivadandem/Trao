import './globals.css';
import Providers from '../components/Providers';

export const metadata = {
  title: 'Trao — AI Travel Planner',
  description: 'Plan your perfect trip with the power of AI. Get personalized itineraries, hotel recommendations, packing lists, and risk assessments in seconds.',
  keywords: 'travel planner, AI travel, trip planning, itinerary generator, Gemini AI',
  icons: {
    icon: 'https://static.thenounproject.com/png/1043924-200.png',
  },
  openGraph: {
    title: 'Trao — AI Travel Planner',
    description: 'Plan your perfect trip with AI-powered itineraries',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://static.thenounproject.com/png/1043924-200.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              const storedTheme = localStorage.getItem('trao_theme');
              const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (_) {}
          })()
        `}} />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
