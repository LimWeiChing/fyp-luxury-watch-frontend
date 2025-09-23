import React, { useState, useEffect, useRef } from "react";

// ========================================
// IMAGE IMPORTS - REPLACE THESE PATHS
// ========================================
import luxuryAuthenticityImg from "../../img/I1.png"; // 👈 REPLACE: Luxury Authenticity image
import supplyChainImg from "../../img/I2.png"; // 👈 REPLACE: Supply Chain image
import transferOwnershipImg from "../../img/I3.png"; // 👈 REPLACE: Transfer Ownership image
import personalRelationshipImg from "../../img/I4.png"; // 👈 REPLACE: Personal Relationship image (Fixed typo)
// ========================================

const GetStarted = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [scrollDirection, setScrollDirection] = useState("down");
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);
  const observerRef = useRef(null);

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const newVisible = new Set(prev);
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              newVisible.add(entry.target.id);
            } else {
              newVisible.delete(entry.target.id);
            }
          });
          return newVisible;
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -100px 0px" }
    );

    const sections = document.querySelectorAll(".slide-section");
    sections.forEach((section) => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, []);

  const sections = [
    {
      id: "authenticity",
      title: "Luxury\nAuthenticity",
      description:
        "Create unique digital identities for each product in an effort to prevent counterfeits",
      imageSrc: luxuryAuthenticityImg, // 👈 USING IMPORTED IMAGE
      imageAlt: "Luxury authenticity with phone and certificate",
      direction: "left",
    },
    {
      id: "supply-chain",
      title: "Supply Chain\nTransparency",
      description:
        "Build trust for customers and show transparency initiatives by tracking the entire supply chain, from raw materials to the final product.",
      imageSrc: supplyChainImg, // 👈 USING IMPORTED IMAGE
      imageAlt: "Supply chain transparency illustration",
      direction: "right",
    },
    {
      id: "ownership",
      title: "Transfer of\nOwnership and\nResale",
      description:
        "Facilitate seamless transfer of ownership and streamline the resale process.",
      imageSrc: transferOwnershipImg, // 👈 USING IMPORTED IMAGE
      imageAlt: "Transfer of ownership and resale process",
      direction: "left",
    },
    {
      id: "relationship",
      title: "Personal\nRelationship",
      description:
        "Engage customers with an innovative web3 approach through digital collectibles.",
      imageSrc: personalRelationshipImg, // 👈 USING IMPORTED IMAGE
      imageAlt: "Personal relationship through digital collectibles",
      direction: "right",
    },
  ];

  // Inline styles object
  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
      color: "white",
      overflowX: "hidden",
      fontFamily: "Georgia, serif",
      position: "relative",
    },
    backgroundOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      pointerEvents: "none",
      zIndex: 1,
    },
    backgroundOrb1: {
      position: "absolute",
      top: "80px",
      left: "80px",
      width: "288px",
      height: "288px",
      background: "radial-gradient(circle, #00d4aa 0%, transparent 70%)",
      borderRadius: "50%",
      filter: "blur(60px)",
      animation: "pulse 4s ease-in-out infinite",
    },
    backgroundOrb2: {
      position: "absolute",
      bottom: "80px",
      right: "80px",
      width: "384px",
      height: "384px",
      background: "radial-gradient(circle, #14b8a6 0%, transparent 70%)",
      borderRadius: "50%",
      filter: "blur(60px)",
      animation: "pulse 4s ease-in-out infinite 2s",
    },
    backgroundOrb3: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "256px",
      height: "256px",
      background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
      borderRadius: "50%",
      filter: "blur(60px)",
      animation: "pulse 4s ease-in-out infinite 4s",
    },
    header: {
      position: "relative",
      zIndex: 10,
      textAlign: "center",
      padding: "60px 24px 40px 24px",
      maxWidth: "1024px",
      margin: "0 auto",
    },
    mainTitle: {
      fontSize: isMobile ? "2.5rem" : "4rem",
      fontWeight: "300",
      letterSpacing: "0.1em",
      marginBottom: "24px",
      background: "linear-gradient(135deg, #00d4aa 0%, #14b8a6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      animation: "fadeInUp 1s ease-out",
      lineHeight: "1.1",
    },
    subtitle: {
      fontSize: isMobile ? "2.5rem" : "4rem",
      fontWeight: "bold",
      letterSpacing: "0.1em",
      marginBottom: "32px",
      background: "linear-gradient(135deg, #14b8a6 0%, #00d4aa 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      animation: "fadeInUp 1s ease-out 0.5s",
      animationFillMode: "both",
      lineHeight: "1.1",
    },
    headerDescription: {
      fontSize: "1.25rem",
      color: "#d1d5db",
      maxWidth: "512px",
      margin: "0 auto",
      lineHeight: "1.6",
      animation: "fadeInUp 1s ease-out 1s",
      animationFillMode: "both",
    },
    dotsContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "32px",
      gap: "8px",
    },
    dot: {
      width: "8px",
      height: "8px",
      backgroundColor: "#00d4aa",
      borderRadius: "50%",
      animation: "bounce 2s infinite",
    },
    sectionsContainer: {
      position: "relative",
      zIndex: 10,
    },
    section: {
      minHeight: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "40px 16px" : "60px 24px",
    },
    sectionContent: {
      maxWidth: "1344px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "32px" : "48px",
      flexDirection: isMobile ? "column" : "row",
    },
    textContent: {
      flex: 1,
      transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      maxWidth: "600px",
      textAlign: isMobile ? "center" : "left",
    },
    sectionTitle: {
      fontSize: isMobile ? "2.5rem" : "3rem",
      fontWeight: "300",
      lineHeight: "1.1",
      marginBottom: "24px",
      whiteSpace: "pre-line",
      background: "linear-gradient(135deg, #ffffff 0%, #d1d5db 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    sectionDescription: {
      fontSize: "1.1rem",
      color: "#d1d5db",
      lineHeight: "1.6",
      marginBottom: "24px",
    },
    progressBars: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
      justifyContent: isMobile ? "center" : "flex-start",
    },
    progressBar: {
      height: "4px",
      borderRadius: "2px",
      background: "linear-gradient(135deg, #00d4aa 0%, #14b8a6 100%)",
      transition: "all 0.5s ease",
    },
    imageContent: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      transitionDelay: "200ms",
    },
    imageContainer: {
      position: "relative",
      maxWidth: "500px",
      width: "100%",
    },
    imageWrapper: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "16px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      transition: "all 0.5s ease",
      cursor: "pointer",
    },
    image: {
      width: "100%",
      height: "auto",
      display: "block",
      transition: "all 0.5s ease",
      objectFit: "cover",
    },
    imagePlaceholder: {
      width: "100%",
      height: "320px",
      background: "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "16px",
      flexDirection: "column",
    },
    placeholderIcon: {
      width: "64px",
      height: "64px",
      background: "linear-gradient(135deg, #00d4aa 0%, #14b8a6 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      marginBottom: "16px",
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(to top, rgba(0, 0, 0, 0.2) 0%, transparent 100%)",
      opacity: 0,
      transition: "opacity 0.5s ease",
    },
    glowEffect: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(135deg, rgba(0, 212, 170, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%)",
      borderRadius: "16px",
      filter: "blur(20px)",
      opacity: 0,
      transition: "opacity 0.5s ease",
      zIndex: -1,
    },
    animationDot1: {
      position: "absolute",
      top: "-16px",
      right: "-16px",
      width: "12px",
      height: "12px",
      backgroundColor: "#00d4aa",
      borderRadius: "50%",
      animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      opacity: 0.75,
    },
    animationDot2: {
      position: "absolute",
      bottom: "-16px",
      left: "-16px",
      width: "8px",
      height: "8px",
      backgroundColor: "#14b8a6",
      borderRadius: "50%",
      animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      animationDelay: "1s",
      opacity: 0.75,
    },
    footer: {
      position: "relative",
      zIndex: 10,
      textAlign: "center",
      padding: "60px 24px 40px 24px",
      borderTop: "1px solid rgba(55, 65, 81, 0.5)",
      maxWidth: "1024px",
      margin: "0 auto",
    },
    footerTitle: {
      fontSize: "2rem",
      fontWeight: "300",
      marginBottom: "16px",
      background: "linear-gradient(135deg, #00d4aa 0%, #14b8a6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    footerDescription: {
      color: "#d1d5db",
      marginBottom: "32px",
      fontSize: "1.1rem",
    },
    ctaButton: {
      background: "linear-gradient(135deg, #00d4aa 0%, #14b8a6 100%)",
      color: "white",
      fontWeight: "600",
      padding: "16px 32px",
      borderRadius: "50px",
      border: "none",
      fontSize: "1.1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 25px rgba(0, 212, 170, 0.3)",
    },
  };

  const handleImageError = (e, section) => {
    console.error(`Failed to load image for ${section.id}:`, section.imageSrc);
    e.target.style.display = "none";
    const placeholder = e.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = "flex";
    }
  };

  const getFlexDirection = (section, index) => {
    if (isMobile) return "column";
    return section.direction === "right" ? "row-reverse" : "row";
  };

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.backgroundOverlay}>
        <div style={styles.backgroundOrb1}></div>
        <div style={styles.backgroundOrb2}></div>
        <div style={styles.backgroundOrb3}></div>
      </div>

      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>
          Benefits of Using our Blockchain Solutions
        </h1>

        <p style={styles.headerDescription}>
          Transform your business with cutting-edge blockchain technology that
          ensures authenticity, transparency, and seamless digital experiences
        </p>
        <div style={styles.dotsContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.dot,
                animationDelay: `${i * 200}ms`,
              }}
            ></div>
          ))}
        </div>
      </header>

      {/* Sections */}
      <div style={styles.sectionsContainer}>
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="slide-section"
            style={styles.section}
          >
            <div
              style={{
                ...styles.sectionContent,
                flexDirection: getFlexDirection(section, index),
              }}
            >
              {/* Text Content */}
              <div
                style={{
                  ...styles.textContent,
                  opacity: visibleSections.has(section.id) ? 1 : 0,
                  transform: visibleSections.has(section.id)
                    ? "translateX(0)"
                    : isMobile
                    ? "translateY(50px)"
                    : `translateX(${
                        section.direction === "left" ? "-80px" : "80px"
                      })`,
                }}
              >
                <h2 style={styles.sectionTitle}>{section.title}</h2>
                <p style={styles.sectionDescription}>{section.description}</p>
                <div style={styles.progressBars}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.progressBar,
                        width: visibleSections.has(section.id) ? "32px" : "8px",
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Image Content */}
              <div
                style={{
                  ...styles.imageContent,
                  opacity: visibleSections.has(section.id) ? 1 : 0,
                  transform: visibleSections.has(section.id)
                    ? "translateX(0) scale(1)"
                    : isMobile
                    ? "translateY(-50px) scale(0.95)"
                    : `translateX(${
                        section.direction === "left" ? "80px" : "-80px"
                      }) scale(0.95)`,
                }}
              >
                <div style={styles.imageContainer}>
                  <div
                    style={styles.imageWrapper}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1.05) rotate(1deg)";
                      const overlay =
                        e.currentTarget.querySelector(".image-overlay");
                      const glow =
                        e.currentTarget.querySelector(".glow-effect");
                      const img = e.currentTarget.querySelector("img");
                      if (overlay) overlay.style.opacity = "1";
                      if (glow) glow.style.opacity = "1";
                      if (img) img.style.filter = "brightness(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                      const overlay =
                        e.currentTarget.querySelector(".image-overlay");
                      const glow =
                        e.currentTarget.querySelector(".glow-effect");
                      const img = e.currentTarget.querySelector("img");
                      if (overlay) overlay.style.opacity = "0";
                      if (glow) glow.style.opacity = "0";
                      if (img) img.style.filter = "brightness(1)";
                    }}
                  >
                    <img
                      src={section.imageSrc}
                      alt={section.imageAlt}
                      style={styles.image}
                      loading="lazy"
                      onError={(e) => handleImageError(e, section)}
                      onLoad={(e) =>
                        console.log(`Image loaded successfully: ${section.id}`)
                      }
                    />

                    {/* Fallback placeholder */}

                    {/* Overlay Effects */}
                    <div
                      className="image-overlay"
                      style={styles.imageOverlay}
                    ></div>

                    {/* Glowing Effect */}
                    <div
                      className="glow-effect"
                      style={styles.glowEffect}
                    ></div>

                    {/* Animation Dots */}
                    <div style={styles.animationDot1}></div>
                    <div style={styles.animationDot2}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <h3 style={styles.footerTitle}>Ready to Transform Your Business?</h3>
        <p style={styles.footerDescription}>
          Join thousands of companies already using our blockchain solutions
        </p>
        <button
          style={styles.ctaButton}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 15px 35px rgba(0, 212, 170, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 10px 25px rgba(0, 212, 170, 0.3)";
          }}
        >
          Get Started Today
        </button>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-8px);
          }
          70% {
            transform: translateY(-4px);
          }
          90% {
            transform: translateY(-2px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default GetStarted;
