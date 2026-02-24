import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import chocolataLogo from '../../LogoAssets/ChokolatLogo.png';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [shouldExit, setShouldExit] = useState(false);

  useEffect(() => {
    // Sequence:
    // 0s: Mount
    // 0.2s: Stamp Impact (Heavy press) - logo starts appearing
    // 1.2s: Logo stamp complete, text visible
    // 3.0s: Pause to read
    // 3.1s: Split Start (Box opens) - trigger panel exit, logo starts fading
    // 4.1s: Complete - trigger container exit
    const panelTimer = setTimeout(() => {
      setShouldExit(true);
    }, 3100);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4100);

    return () => {
      clearTimeout(panelTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // ANIMATION VARIANTS

  const containerVariants: Variants = {
    initial: {
      opacity: 1
    },
    enter: {
      opacity: 1
    },
    exit: {
      opacity: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1 
      }
    }
  };

  // The panels that slide apart
  // Increased shadow for more depth during the reveal
  const panelVariants: Variants = {
    initial: { y: 0 },
    exit: (custom) => ({
      y: custom === 'top' ? '-100%' : '100%',
      transition: { 
        duration: 1.0, 
        ease: [0.76, 0, 0.24, 1] // "Quart" ease for a heavy, premium sliding feel
      }
    })
  };

  // The logo stamp effect
  // Removed the shimmer. Focused on the "Ink Press" feeling.
  const logoVariants: Variants = {
    initial: { 
      scale: 1.2, 
      opacity: 0, 
      filter: "blur(15px)", // Heavy blur for "out of focus" start
      y: 0
    },
    enter: { 
      scale: 1, 
      opacity: 1, 
      filter: "blur(0px)",
      y: 0,
      transition: {
        delay: 0.2, // Start at 0.2s (Stamp Impact)
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1] // "Expo" ease: starts fast, lands very gently
      }
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      filter: "blur(5px)", // Blur out slightly as it vanishes
      transition: { 
        delay: 0, // Start fading as panels open
        duration: 0.4, 
        ease: "easeIn" 
      }
    }
  };

  // Text animation - appears after logo stamp
  const textVariants: Variants = {
    initial: {
      opacity: 0,
      y: 10
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8, // Start after logo begins appearing
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.div
      className={styles.splashContainer}
      variants={containerVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* 
        TOP PANEL 
        Deep shadow to simulate a thick box lid
      */}
      <motion.div 
        custom="top"
        variants={panelVariants}
        className={styles.topPanel}
        animate={shouldExit ? "exit" : "initial"}
      >
      </motion.div>

      {/* 
        BOTTOM PANEL 
      */}
      <motion.div 
        custom="bottom"
        variants={panelVariants}
        className={styles.bottomPanel}
        animate={shouldExit ? "exit" : "initial"}
      >
      </motion.div>

      {/* 
        LOGO CONTAINER (Centered) 
      */}
      <div className={styles.logoContainer}>
        <motion.div 
          className={styles.logoWrapper}
          variants={logoVariants}
          initial="initial"
          animate={shouldExit ? "exit" : "enter"}
        >
          <img 
            src={chocolataLogo} 
            alt="Chocolata" 
            className={styles.logoImage} 
          />
        </motion.div>
        <motion.div 
          className={styles.textContainer}
          variants={textVariants}
          initial="initial"
          animate={shouldExit ? "exit" : "enter"}
        >
          <h1 className={styles.brandName}>CHOCOLATA</h1>
          <p className={styles.tagline}>Artisanal Chocolate</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;


