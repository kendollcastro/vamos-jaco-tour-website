import { jsx } from 'react/jsx-runtime';
import { useRef, useState, useEffect } from 'react';
import 'clsx';

function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.15,
  once = true
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);
  const baseStyles = {
    transitionProperty: "opacity, transform, filter",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    transitionDelay: `${delay}ms`
  };
  const animations = {
    "fade-up": {
      hidden: { opacity: 0, transform: "translateY(40px)" },
      visible: { opacity: 1, transform: "translateY(0)" }
    },
    "fade-left": {
      hidden: { opacity: 0, transform: "translateX(-40px)" },
      visible: { opacity: 1, transform: "translateX(0)" }
    },
    "fade-right": {
      hidden: { opacity: 0, transform: "translateX(40px)" },
      visible: { opacity: 1, transform: "translateX(0)" }
    },
    "scale-in": {
      hidden: { opacity: 0, transform: "scale(0.9)" },
      visible: { opacity: 1, transform: "scale(1)" }
    },
    "blur-in": {
      hidden: { opacity: 0, filter: "blur(10px)", transform: "translateY(20px)" },
      visible: { opacity: 1, filter: "blur(0)", transform: "translateY(0)" }
    }
  };
  const anim = animations[animation];
  const style = {
    ...baseStyles,
    ...isVisible ? anim.visible : anim.hidden
  };
  return /* @__PURE__ */ jsx("div", { ref, className, style, children });
}

export { ScrollReveal as S };
