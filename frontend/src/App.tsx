/**
 * Application root: composes the page sections inside the toast provider.
 */
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { ServicesSection } from './components/sections/ServicesSection';
import { HowItWorks } from './components/sections/HowItWorks';
import { DiscoveryAssistant } from './components/assistant/DiscoveryAssistant';
import { Footer } from './components/layout/Footer';

export default function App() {
  return (
    <ToastProvider>
      <a
        href="#assistant"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to the Discovery Assistant
      </a>

      <Navbar />

      <main>
        <Hero />
        <ServicesSection />
        <DiscoveryAssistant />
        <HowItWorks />
      </main>

      <Footer />
    </ToastProvider>
  );
}
