export function SocialLinks() {
  const socialLinks = [
    { name: 'Twitter', href: '#' },
    { name: 'Facebook', href: '#' },
    { name: 'Instagram', href: '#' },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {link.name}
        </a>
      ))}
    </div>
  );
}