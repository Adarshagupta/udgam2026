"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import logo from "@/app/assets/logo.png";
import styles from "@/components/site.module.css";

const registrationUrl = "https://payment.collexo.com/pay-fee/srm-ap-events";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/register", label: "Committees" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className={`${styles.chrome} ${isHome ? styles.chromeHome : ""}`.trim()}>
      <nav className={`${styles.nav} ${isHome ? styles.navHome : ""}`.trim()} aria-label="Primary">
        <Link className={styles.brand} href="/">
          <Image
            alt="UDGAM"
            className={styles.brandLogo}
            priority
            src={logo}
          />
          <span className={styles.brandStamp}>{isHome ? "Festival Arc" : "Campus Route"}</span>
        </Link>

        <div className={styles.navLinks}>
          {links.map((link) => (
            <Link
              key={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          className={styles.navAction}
          href={registrationUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Register
        </Link>
      </nav>
    </div>
  );
}
