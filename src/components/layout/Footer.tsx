import { FooterSection } from './FooterSection';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FooterSection
            title="TextbookXchange"
            content="Making textbook exchange easy and affordable for students."
          />
          <FooterSection
            title="Quick Links"
            links={[
              { text: 'About Us', href: '#' },
              { text: 'How It Works', href: '#' },
              { text: 'Contact', href: '#' },
            ]}
          />
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}