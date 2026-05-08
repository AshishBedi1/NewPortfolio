import { ExternalLink, Github } from "lucide-react";
import { useState } from "react";

const projects = [
  {
    id: 1,
    category: "personal",
    title: "ERP",
    description:
      "Built a complete ERP web application with robust authentication, role-based flows, and scalable MERN architecture.",
    image: "/projects/erp.png",
    tags: ["MongoDB", "Express", "React", "Node.js"],
    demoUrl: "https://erp-client-p5tx.vercel.app/",
    repoUrl: "https://github.com/AshishBedi1/ERP",
    imageClassName: "object-contain p-6",
    imageWrapperClassName: "bg-white",
  },
  {
    id: 2,
    category: "office",
    title: "UpRock",
    description:
      "Contributed to the UpRock web platform focused on performance, responsive UI, and scalable frontend architecture.",
    image: "/projects/uprock.png",
    tags: ["Next.js", "TypeScript", "TailwindCSS"],
    demoUrl: "https://uprock.com/",
  },
  {
    id: 4,
    category: "office",
    title: "Savyre",
    description:
      "Worked on Savyre's hiring platform features with a production-ready MERN stack and Dockerized workflows.",
    image: "/projects/savyre.jpeg",
    tags: ["MERN", "Docker"],
    demoUrl: "https://app.savyre.com/",
  },
  {
    id: 5,
    category: "office",
    title: "Refereree",
    description:
      "Built and maintained product flows for Refereree's platform with a component-driven UI and smooth user experience.",
    image: "/projects/refereree.svg",
    tags: ["ReactJS", "Material UI"],
    demoUrl: "https://app.refereree.com/",
    imageClassName: "object-contain p-6",
    imageWrapperClassName: "bg-white",
  },
];

export const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("office");
  const filteredProjects = projects.filter(
    (project) => project.category === activeCategory
  );

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {" "}
          Featured <span className="text-primary"> Projects </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
        </p>

        <div className="flex justify-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => setActiveCategory("office")}
            className={`px-4 py-2 rounded-full border transition ${
              activeCategory === "office"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/60"
            }`}
          >
            Office Work
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("personal")}
            className={`px-4 py-2 rounded-full border transition ${
              activeCategory === "personal"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/60"
            }`}
          >
            Personal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover"
            >
              <div
                className={`h-48 overflow-hidden ${project.imageWrapperClassName ?? ""}`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-full ${
                    project.imageClassName ?? "object-cover"
                  } transition-transform duration-500 group-hover:scale-110`}
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={`${project.id}-${tag}`}
                      className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1"> {project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <ExternalLink size={20} />
                    </a>
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground/80 hover:text-primary transition-colors duration-300"
                      >
                        <Github size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};