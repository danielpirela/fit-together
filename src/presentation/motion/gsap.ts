/**
 * GSAP Motion Library Setup
 * Registers plugins and exports easing constants.
 * ScrollTrigger is imported and registered here but unused until v2 animations.
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Easing curves following product motion personality:
 * snappy entrances, smooth exits.
 */
export const easeOutExpo = 'expo.out';
export const easeOutQuart = 'quart.out';
export const easeInOutQuart = 'quart.inOut';
export const easeOutBack = 'back.out(1.5)';

export { gsap };
