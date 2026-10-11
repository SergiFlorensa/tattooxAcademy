"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type * as ThreeTypes from "three";

type Language = "ca" | "es";
type ExperienceCopy = {
  label: string;
  title: string;
  accent: string;
  modelAlt: string;
};

const copy: Record<Language, ExperienceCopy> = {
  ca: {
    label: "04 / DE LA MÀQUINA A LA PELL",
    title: "Un traç.",
    accent: "Una història.",
    modelAlt: "Màquina de tatuar DFM en grafit i acer fosc",
  },
  es: {
    label: "04 / DE LA MÁQUINA A LA PIEL",
    title: "Un trazo.",
    accent: "Una historia.",
    modelAlt: "Máquina de tatuar DFM en grafito y acero oscuro",
  },
};

type TattooPenExperienceProps = {
  language: Language;
  motion: boolean;
};

export default function TattooPenExperience({ language, motion }: TattooPenExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const modelRef = useRef<HTMLCanvasElement>(null);
  const renderRequestRef = useRef<(() => void) | null>(null);
  const motionRef = useRef(motion);
  const settleUntilRef = useRef(0);
  const pointerRef = useRef({ active: false, x: 0, y: 0, tiltX: 0, tiltY: 0 });
  const [modelReady, setModelReady] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const t = copy[language];

  useEffect(() => {
    motionRef.current = motion;
    settleUntilRef.current = performance.now() + 650;
    renderRequestRef.current?.();
  }, [motion]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = modelRef.current;
    if (!section || !canvas) return;

    let alive = true;
    let visible = false;
    let initialized = false;
    let frameId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let renderer: ThreeTypes.WebGLRenderer | null = null;
    let scene: ThreeTypes.Scene | null = null;
    let camera: ThreeTypes.OrthographicCamera | null = null;
    let assembly: ThreeTypes.Group | null = null;
    let disposed = false;
    let scrollDirty = true;
    let scrollTilt = 0;
    let frameWidth = 1;
    const mobileQuery = window.matchMedia("(max-width: 780px), (hover: none) and (pointer: coarse)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const render = (time: number) => {
      frameId = 0;
      if (!alive || !visible || document.hidden || !renderer || !scene || !camera || !assembly) return;

      const pointer = pointerRef.current;
      const automaticMotion = motionRef.current && !reducedMotionQuery.matches;
      if (automaticMotion) {
        // Read the stage position once per scrolling frame, only near this section.
        if (scrollDirty) {
          const bounds = canvas.parentElement?.getBoundingClientRect();
          if (bounds) {
            const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
            scrollTilt = progress * 2 - 1;
          }
          scrollDirty = false;
        }
      } else {
        scrollTilt = 0;
        scrollDirty = true;
      }
      const idleDrift = automaticMotion ? Math.sin(time * 0.00034) * 0.025 : 0;
      assembly.rotation.x += ((pointer.tiltY * 0.28 + idleDrift) - assembly.rotation.x) * 0.11;
      assembly.rotation.y += ((pointer.tiltX * 0.3 + scrollTilt * 0.12) - assembly.rotation.y) * 0.11;
      assembly.rotation.z += ((Math.PI / 2 + pointer.tiltY * 0.07 + scrollTilt * 0.055) - assembly.rotation.z) * 0.075;
      // Bounded horizontal travel: both ends of the journey retain most of the pen.
      assembly.position.x += ((scrollTilt * frameWidth * (mobileQuery.matches ? 0.26 : 0.18)) - assembly.position.x) * 0.09;
      assembly.position.y += ((idleDrift * 0.35) - assembly.position.y) * 0.11;

      renderer.render(scene, camera);
      if (automaticMotion || time < settleUntilRef.current) frameId = window.requestAnimationFrame(render);
    };

    const requestRender = () => {
      if (!frameId && alive && visible && !document.hidden) frameId = window.requestAnimationFrame(render);
    };
    renderRequestRef.current = requestRender;

    const onScroll = () => {
      if (!visible || !motionRef.current || reducedMotionQuery.matches) return;
      scrollDirty = true;
      requestRender();
    };
    const onMotionMediaChange = () => {
      scrollDirty = true;
      settleUntilRef.current = performance.now() + 650;
      requestRender();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    mobileQuery.addEventListener("change", onMotionMediaChange);
    reducedMotionQuery.addEventListener("change", onMotionMediaChange);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent || !renderer || !camera) return;
      const width = Math.max(1, parent.clientWidth);
      const height = Math.max(1, parent.clientHeight);
      renderer.setSize(width, height, false);
      frameWidth = 0.82 / (mobileQuery.matches ? 1.03 : 0.88);
      camera.left = -frameWidth / 2;
      camera.right = frameWidth / 2;
      camera.top = frameWidth * height / width / 2;
      camera.bottom = -camera.top;
      camera.updateProjectionMatrix();
      scrollDirty = true;
      requestRender();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      if (alive) {
        setModelReady(false);
        setModelFailed(true);
      }
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    const releaseScene = () => {
      if (disposed) return;
      disposed = true;
      scene?.traverse((object) => {
        const mesh = object as ThreeTypes.Mesh;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
        materials.forEach((material) => material.dispose());
      });
      renderer?.dispose();
    };

    const initialize = async () => {
      if (initialized) return;
      initialized = true;
      try {
        const [THREE, { GLTFLoader }] = await Promise.all([
          import("three"),
          import("three/addons/loaders/GLTFLoader.js"),
        ]);
        if (!alive) return;

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
        camera.position.set(0, 0, 3);
        camera.lookAt(0, 0, 0);
        scene.add(new THREE.HemisphereLight(0xe5fff6, 0x101715, 1.7));
        const keyLight = new THREE.DirectionalLight(0xf4fff8, 3.1);
        keyLight.position.set(-2.5, 3.5, 4);
        scene.add(keyLight);
        const edgeLight = new THREE.DirectionalLight(0x47c6d8, 2.6);
        edgeLight.position.set(3, 0.5, -2);
        scene.add(edgeLight);
        const fillLight = new THREE.DirectionalLight(0x76f07e, 0.8);
        fillLight.position.set(-3, -2, 1);
        scene.add(fillLight);

        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));

        const gltf = await new GLTFLoader().loadAsync("/models/dfm-pen-v1.glb");
        if (!alive || !scene) {
          gltf.scene.traverse((object) => {
            const mesh = object as ThreeTypes.Mesh;
            mesh.geometry?.dispose();
            const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
            materials.forEach((material) => material.dispose());
          });
          return;
        }

        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const center = bounds.getCenter(new THREE.Vector3());
        const dimensions = bounds.getSize(new THREE.Vector3());
        gltf.scene.position.sub(center);
        assembly = new THREE.Group();
        assembly.add(gltf.scene);
        assembly.scale.setScalar(0.82 / Math.max(dimensions.x, dimensions.y, dimensions.z));
        assembly.rotation.z = Math.PI / 2;
        scene.add(assembly);
        resizeObserver = new ResizeObserver(resize);
        if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
        resize();
        setModelReady(true);
        requestRender();
      } catch {
        releaseScene();
        if (alive) {
          setModelReady(false);
          setModelFailed(true);
        }
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      visible = true;
      void initialize();
    } else {
      visibilityObserver = new IntersectionObserver((entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
        if (visible) {
          scrollDirty = true;
          void initialize();
          requestRender();
        }
      }, { rootMargin: "160px 0px", threshold: 0.04 });
      visibilityObserver.observe(section);
    }

    const onVisibilityChange = () => {
      scrollDirty = true;
      requestRender();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      alive = false;
      if (frameId) window.cancelAnimationFrame(frameId);
      visibilityObserver?.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("scroll", onScroll);
      mobileQuery.removeEventListener("change", onMotionMediaChange);
      reducedMotionQuery.removeEventListener("change", onMotionMediaChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (renderRequestRef.current === requestRender) renderRequestRef.current = null;
      releaseScene();
    };
  }, []);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    pointerRef.current.active = true;
    pointerRef.current.x = event.clientX;
    pointerRef.current.y = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const pointer = pointerRef.current;
    if (event.pointerType === "mouse") {
      const bounds = event.currentTarget.getBoundingClientRect();
      pointer.tiltX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
      pointer.tiltY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));
    } else {
      if (!pointer.active) return;
      pointer.tiltX = Math.max(-1, Math.min(1, pointer.tiltX + (event.clientX - pointer.x) * 0.014));
      pointer.tiltY = Math.max(-1, Math.min(1, pointer.tiltY + (event.clientY - pointer.y) * 0.014));
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }
    settleUntilRef.current = performance.now() + 650;
    renderRequestRef.current?.();
  }

  function stopPointer(event: ReactPointerEvent<HTMLDivElement>) {
    pointerRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    renderRequestRef.current?.();
  }

  function resetHover(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    pointerRef.current.tiltX = 0;
    pointerRef.current.tiltY = 0;
    settleUntilRef.current = performance.now() + 650;
    renderRequestRef.current?.();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const step = 0.22;
    if (event.key === "ArrowLeft") pointerRef.current.tiltX -= step;
    else if (event.key === "ArrowRight") pointerRef.current.tiltX += step;
    else if (event.key === "ArrowUp") pointerRef.current.tiltY -= step;
    else if (event.key === "ArrowDown") pointerRef.current.tiltY += step;
    else return;
    event.preventDefault();
    pointerRef.current.tiltX = Math.max(-1, Math.min(1, pointerRef.current.tiltX));
    pointerRef.current.tiltY = Math.max(-1, Math.min(1, pointerRef.current.tiltY));
    settleUntilRef.current = performance.now() + 650;
    renderRequestRef.current?.();
  }

  return (
    <section ref={sectionRef} className="tattoo-pen-section section-space page-width reveal" aria-labelledby="tattoo-pen-heading" data-motion={motion ? "on" : "off"}>
      <div className="tattoo-pen-copy">
        <p className="eyebrow">{t.label}</p>
        <h2 id="tattoo-pen-heading">{t.title}<br /><span>{t.accent}</span></h2>
      </div>

      <div className={`tattoo-pen-scene${modelReady ? " is-ready" : ""}${modelFailed ? " is-fallback" : ""}`} data-motion={motion ? "on" : "off"}>
        <p className="tattoo-pen-signature" aria-label="DFM Tattoo Artist"><span>DFM</span><span>TATTOO ARTIST</span></p>
        <div
          className="tattoo-pen-object"
          role="group"
          aria-label={t.modelAlt}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopPointer}
          onPointerCancel={stopPointer}
          onPointerLeave={resetHover}
          onKeyDown={handleKeyDown}
        >
          <Image className="tattoo-pen-poster" src="/models/dfm-pen-v1-studio.webp" alt="" aria-hidden="true" width={1200} height={1200} sizes="(max-width: 780px) 80vw, 40vw" unoptimized />
          <canvas ref={modelRef} className="tattoo-pen-canvas" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
