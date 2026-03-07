"use client";

import { useState } from "react";
import { useTranslation } from "@/context/LanguageContext";

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import RecentProjects from "@/components/RecentProjects";
import TechStackGrid from "@/components/TechStackGrid";
import AICapability from "@/components/AICapability";
import Education from "@/components/Education";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/ResizableNavbar";

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    { name: t("nav.about"), link: "#about" },
    { name: t("nav.projects"), link: "#projects" },
    // { name: t("nav.testimonials"), link: "#testimonials" },
    { name: t("nav.experience"), link: "#experience" },
    { name: t("nav.contact"), link: "#contact" },
  ];

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <Navbar>
          {/* Desktop Navigation */}
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} />
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {/* <NavbarButton variant="gradient" href="#contact">
                {t("nav.contactMe")}
              </NavbarButton> */}
            </div>
          </NavBody>

          {/* Mobile Navigation */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-300 hover:text-white"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
              <div className="flex w-full flex-col gap-4">
                <LanguageSwitcher />
                {/* <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="gradient"
                  href="#contact"
                  className="w-full"
                >
                  {t("nav.contactMe")}
                </NavbarButton> */}
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>

        <Hero />
        <Grid />
        <AICapability />
        <TechStackGrid />
        <Experience />
        <Education />
        <RecentProjects />
        {/* <Clients /> */}
        <Approach />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
