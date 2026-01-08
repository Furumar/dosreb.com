"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function StockmannProject() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Placeholder images - replace with actual project images
  const projectImages = [
    { src: "/lumi-hero.png", alt: "Stockmann Project View 1" },
    { src: "/lumi-hero.png", alt: "Stockmann Project View 2" },
    { src: "/lumi-hero.png", alt: "Stockmann Project View 3" },
  ];

  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>Stockmann Project</h1>
        <p className="page-lead">
          The Stockmann project is a flagship real estate and construction management case for DOSREB, demonstrating the platform's ability to handle complex, high-profile developments.
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">Project Gallery</h2>
        <div className="project-gallery">
          {projectImages.map((image, index) => (
            <div
              key={index}
              className="gallery-item"
              onClick={() => setSelectedImage(image.src)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={300}
                height={300}
                style={{ objectFit: "cover", borderRadius: "1rem" }}
              />
            </div>
          ))}
        </div>
        <p style={{ marginTop: "2rem" }}>
          <Link href="/projects" className="btn-secondary">← Back to Projects</Link>
        </p>
      </section>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>×</button>
            <Image
              src={selectedImage}
              alt="Project image"
              width={800}
              height={800}
              style={{ width: "100%", height: "auto", borderRadius: "1rem" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
