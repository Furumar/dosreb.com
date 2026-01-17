"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function StockmannProject() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [projectImages, setProjectImages] = useState<{ src: string; alt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch('/api/files?project=stockmann&folder=photos')
      .then(res => res.json())
      .then(data => {
        if (data.files && data.files.length > 0) {
          setProjectImages(data.files.map((file: any, i: number) => ({
            src: file.url,
            alt: `Stockmann Project View ${i + 1}`
          })));
        } else {
          // Fallback to placeholder images if no images in Supabase
          setProjectImages([
            { src: "/lumi-hero.png", alt: "Stockmann Project - Upload images to Supabase" },
          ]);
        }
      })
      .catch(() => {
        setProjectImages([
          { src: "/lumi-hero.png", alt: "Stockmann Project - Upload images to Supabase" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

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
