'use client';

import Link from 'next/link';
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: 'Managementul SSM', href: '/features/ssm' },
    { name: 'Managementul PSI', href: '/features/psi' },
    { name: 'Control Medical', href: '/features/medical' },
    { name: 'Evidență Echipamente', href: '/features/equipment' },
    { name: 'Instruire Angajați', href: '/features/training' },
  ];

  const companyLinks = [
    { name: 'Despre noi', href: '/about' },
    { name: 'Echipa', href: '/team' },
    { name: 'Consultanți parteneri', href: '/consultants' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { name: 'Termeni și condiții', href: '/terms' },
    { name: 'Politică de confidențialitate', href: '/privacy' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Politică cookies', href: '/cookies' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'contact@s-s-m.ro', href: 'mailto:contact@s-s-m.ro' },
    { icon: Phone, text: '+40 XXX XXX XXX', href: 'tel:+40XXXXXXXXX' },
    { icon: MapPin, text: 'România', href: null },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  const languages = [
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SSM</span>
              </div>
              <span className="text-white font-semibold text-lg">s-s-m.ro</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Platformă digitală pentru consultanți SSM/PSI și firme. Compliance simplu și eficient.
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produs</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Companie</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <contact.icon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">{contact.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Language Selector */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-400 font-medium">Limbă:</span>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-colors flex items-center space-x-1.5"
                  aria-label={`Switch to ${lang.name}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} s-s-m.ro. Toate drepturile rezervate.
            </p>
            <p className="text-sm text-gray-400">
              Platformă pentru consultanți SSM/PSI și firme din RO, BG, HU, DE
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
