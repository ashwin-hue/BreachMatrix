import * as THREE from 'three';
import { easing } from 'maath';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initStoryLayer() {
  // 1. Accessibility & Flag Check
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('story') === 'off' || window.__STORY_LAYER === false) {
    console.log('[StoryLayer] Flag is off, skipping 3D layer.');
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[StoryLayer] prefers-reduced-motion active, skipping 3D layer.');
    return;
  }

  // 2. WebGL Support Verification
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) {
      console.warn('[StoryLayer] WebGL not supported, disabling 3D layer.');
      return;
    }
  } catch (e) {
    return;
  }

  // 3. Mount Fixed Transparent Canvas (z-index: 0, pointer-events: none)
  document.body.classList.add('story-active');

  let styleTag = document.getElementById('story-active-styles');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'story-active-styles';
    styleTag.textContent = `
      body.story-active {
        background-color: #08080a !important;
      }
      body.story-active .site-viewport-wrapper,
      body.story-active .scroll-container,
      body.story-active .scroll-section,
      body.story-active .slide-cover-board,
      body.story-active .vertical-portfolio-gutter,
      body.story-active .cover-canvas,
      body.story-active .slide-index-board,
      body.story-active .slide-about-board,
      body.story-active .slide-team-board,
      body.story-active .slide-project-board,
      body.story-active .slide-contact-board {
        background: transparent !important;
      }
    `;
    document.head.appendChild(styleTag);
  }

  let canvas = document.getElementById('story-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'story-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 0;
      opacity: 1;
    `;
    document.body.prepend(canvas);
  }

  // Ensure main content sits above canvas with transparency
  const viewportWrapper = document.getElementById('site-viewport-wrapper');
  if (viewportWrapper) {
    viewportWrapper.style.position = 'relative';
    viewportWrapper.style.zIndex = '1';
    viewportWrapper.style.background = 'transparent';
  }

  // 4. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8,
  });

  window.__lenis = lenis;

  // Integrate Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Hook into contact drawer & menu to pause/resume Lenis cleanly
  const modal = document.getElementById('secure-modal');
  if (modal) {
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains('chat-drawer-open')) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // 5. Three.js Scene Setup
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
  camera.position.set(0, 0, 5.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  // 6. Lighting (Refined High-End Editorial Studio)
  const ambientLight = new THREE.AmbientLight(0x181822, 2.5);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 5.0);
  keyLight.position.set(4, 6, 5);
  scene.add(keyLight);

  const rimLightLime = new THREE.DirectionalLight(0xd4ff00, 6.0);
  rimLightLime.position.set(-5, -2, 3);
  scene.add(rimLightLime);

  const coreLight = new THREE.PointLight(0xd4ff00, 8.0, 10);
  coreLight.position.set(0, 0, 0.5);
  scene.add(coreLight);

  const backLight = new THREE.DirectionalLight(0x606080, 2.5);
  backLight.position.set(0, 4, -4);
  scene.add(backLight);

  // 7. The Kinetic Monolith Matrix Group
  const monolithGroup = new THREE.Group();
  scene.add(monolithGroup);

  // Outer Faceted Obsidian Monolith
  const outerGeo = new THREE.IcosahedronGeometry(1.6, 0);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0x161622,
    roughness: 0.12,
    metalness: 0.88,
    flatShading: true,
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  monolithGroup.add(outerMesh);

  // Glowing Cyber-Lime Wireframe Lattice Conduit
  const wireGeo = new THREE.WireframeGeometry(outerGeo);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0xd4ff00,
    transparent: true,
    opacity: 0.85,
    linewidth: 1.5,
  });
  const wireframe = new THREE.LineSegments(wireGeo, wireMat);
  monolithGroup.add(wireframe);

  // Inner Resonating Geometric Core
  const innerGeo = new THREE.OctahedronGeometry(0.9, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xd4ff00,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  monolithGroup.add(innerMesh);

  // Floating Micro Particulate Field
  const particleCount = 120;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 14;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xd4ff00,
    size: 0.045,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // 8. Damped Interactive State
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  // Normalized scroll tracker (0 to 1)
  let scrollProgress = 0;
  function updateScrollProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // 9. Hero Section Initial DOM Reveals (Gentle, zero layout shift)
  const heroTitle = document.querySelector('.cover-brand-title');
  const heroSubtitle = document.querySelector('.cover-brand-subtitle');
  const heroSubtag = document.querySelector('.cover-subtag');
  const heroCollage = document.querySelector('.cover-collage-layer');

  if (heroTitle && heroSubtitle && heroSubtag && heroCollage) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.1 } });
    heroTl.fromTo(
      heroSubtag,
      { opacity: 0, y: 14 },
      { opacity: 0.95, y: 0, delay: 0.1 }
    );
    heroTl.fromTo(
      heroTitle,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0 },
      '-=0.85'
    );
    heroTl.fromTo(
      heroSubtitle,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0 },
      '-=0.85'
    );
    heroTl.fromTo(
      heroCollage,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 1.4 },
      '-=0.9'
    );
  }

  // Smooth fade-in of 3D canvas once initialized
  requestAnimationFrame(() => {
    canvas.style.opacity = '1';
  });

  // 10. Damped Render Loop (maath/damping)
  let clock = new THREE.Clock();
  let isTabHidden = false;

  document.addEventListener('visibilitychange', () => {
    isTabHidden = document.hidden;
    if (!isTabHidden) {
      clock.getDelta(); // reset delta on unhide to prevent jump
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    if (isTabHidden) return;

    const delta = Math.min(clock.getDelta(), 0.1);
    const elapsedTime = clock.getElapsedTime();

    // Damped cursor tracking
    easing.damp(mouse, 'x', mouse.targetX, 0.25, delta);
    easing.damp(mouse, 'y', mouse.targetY, 0.25, delta);

    // Hero Monolith Equilibrium & Damped Breathing
    const breath = Math.sin(elapsedTime * 0.75) * 0.08;
    const targetY = breath - (scrollProgress * 4.0); // Prepares smooth scroll handoff
    const targetRotX = mouse.y * 0.22 + elapsedTime * 0.06;
    const targetRotY = mouse.x * 0.28 + elapsedTime * 0.09;
    const targetRotZ = mouse.x * 0.08;

    easing.damp(monolithGroup.position, 'y', targetY, 0.35, delta);
    easing.damp(monolithGroup.position, 'x', mouse.x * 0.25, 0.35, delta);
    easing.dampE(monolithGroup.rotation, [targetRotX, targetRotY, targetRotZ], 0.3, delta);

    // Counter-rotation of inner core for optical depth
    innerMesh.rotation.y -= delta * 0.2;
    innerMesh.rotation.z += delta * 0.15;

    // Gentle particle drift
    particles.rotation.y = elapsedTime * 0.025;
    particles.rotation.x = breath * 0.15;

    // Camera breathing in hero section
    const targetCamZ = 5.2 + Math.sin(elapsedTime * 0.5) * 0.05;
    easing.damp(camera.position, 'z', targetCamZ, 0.4, delta);
    easing.damp(camera.position, 'x', mouse.x * 0.15, 0.4, delta);
    easing.damp(camera.position, 'y', mouse.y * 0.12, 0.4, delta);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // 11. Window Resize Handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ScrollTrigger.refresh();
  }, { passive: true });
}

if (typeof window !== 'undefined') {
  window.initStoryLayer = initStoryLayer;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStoryLayer);
  } else {
    initStoryLayer();
  }
}
