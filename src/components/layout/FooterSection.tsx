interface FooterLink {
  text: string;
  href: string;
}

interface FooterSectionProps {
  title: string;
  content?: string;
  links?: FooterLink[];
}

export function FooterSection({ title, content, links }: FooterSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {content && <p className="text-gray-400">{content}</p>}
      {links && (
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.text}>
              <a href={link.href} className="text-gray-400 hover:text-white">
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}