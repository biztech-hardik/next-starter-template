'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const HeaderInteractions = () => {
  const pathname = usePathname(); // Updates on route change

  useEffect(() => {
    // ✅ Remove body.isActive on route change
    document.body.classList.remove('isActive');
  }, [pathname]); // Runs immediately on route change

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);

    const hamburger = document.querySelector('.hamburger');
    const body = document.body;
    const menuLinks = document.querySelectorAll('.header-links .menu-list li a');
    const headerLogo = document.querySelector('.header-logo');
    const headerLinks = document.querySelector('.header-links');
    const header = document.querySelector('.header');

    const toggleMenu = () => body.classList.toggle('isActive');
    const closeMenu = () => body.classList.remove('isActive');
    const handleScroll = () => {
      if (window.scrollY > 80) {
        header?.classList.add('bg_color');
      } else {
        header?.classList.remove('bg_color');
      }
    };

    hamburger?.addEventListener('click', toggleMenu);
    menuLinks.forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('scroll', handleScroll);

    // Hover menu (desktop only)
    let hoverHandler: () => void;
    if (window.innerWidth > 767 && headerLogo && headerLinks) {
      hoverHandler = () => headerLinks.classList.toggle('showHome');
      headerLogo.addEventListener('mouseenter', hoverHandler);
      headerLogo.addEventListener('mouseleave', hoverHandler);
    }

    return () => {
      window.removeEventListener('resize', setVh);
      hamburger?.removeEventListener('click', toggleMenu);
      menuLinks.forEach(link => link.removeEventListener('click', closeMenu));
      window.removeEventListener('scroll', handleScroll);
      if (hoverHandler) {
        headerLogo?.removeEventListener('mouseenter', hoverHandler);
        headerLogo?.removeEventListener('mouseleave', hoverHandler);
      }
    };
  }, []);

  return null;
};

export default HeaderInteractions;
