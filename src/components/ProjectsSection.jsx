import mywizbeeLogo from "@/assets/projects/mywizbee.png";
import { cn } from "@/lib/utils";
import { ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";

const AUTO_PLAY_MS = 1200;

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
    title: "Savyre",
    description:
      "Worked on Savyre's hiring platform features with a production-ready MERN stack and Dockerized workflows.",
    image: "/projects/savyre.jpeg",
    tags: ["MERN", "Docker"],
    demoUrl: "https://app.savyre.com/",
  },
  {
    id: 3,
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
    title: "Refereree",
    description:
      "Built and maintained product flows for Refereree's platform with a component-driven UI and smooth user experience.",
    image: "/projects/refereree.svg",
    tags: ["ReactJS", "Material UI"],
    demoUrl: "https://app.refereree.com/",
    imageClassName: "object-contain p-6",
    imageWrapperClassName: "bg-white",
  },
  {
    id: 5,
    category: "office",
    title: "Housing Bookers",
    description:
      "Contributed to Housing Bookers, a furnished rental platform for short and long-term stays with secure payments and landlord-tenant flows.",
    image: "/projects/housingbookers.svg",
    tags: ["Next.js"],
    demoUrl: "https://www.housingbookers.com/",
    imageClassName: "object-contain p-8",
    imageWrapperClassName: "bg-white",
  },
  {
    id: 6,
    category: "office",
    title: "MyWizBee",
    description:
      "Contributed to MyWizBee, a kid-safe learning platform where children share daily school lessons and get follow-up questions, quizzes, and parent email summaries.",
    image: mywizbeeLogo,
    tags: ["Full Stack", "TypeScript", "Express", "Postgres"],
    demoUrl: "https://mywizbee.com/",
    imageClassName: "object-contain p-6",
    imageWrapperClassName: "bg-white",
  },
];

function ProjectCard({ project }) {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover h-full">
      <div
        className={`h-48 overflow-hidden ${project.imageWrapperClassName ?? ""}`}
      >
        <img
          src={project.image}
          alt={project.title}
          className={cn(
            "w-full h-full transition-transform duration-500 group-hover:scale-110",
            project.imageClassName ?? "object-cover"
          )}
        />
      </div>

      <div className="p-6 text-left">
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

        <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {project.description}
        </p>
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
  );
}

function useSlidesPerView() {
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setSlidesPerView(3);
      else if (window.innerWidth >= 768) setSlidesPerView(2);
      else setSlidesPerView(1);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return slidesPerView;
}

export const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("office");
  const [activeIndex, setActiveIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const slidesPerView = useSlidesPerView();

  const filteredProjects = projects.filter(
    (project) => project.category === activeCategory
  );

  const canCarousel = filteredProjects.length > slidesPerView;
  const carouselProjects = canCarousel
    ? [...filteredProjects, ...filteredProjects.slice(0, slidesPerView)]
    : filteredProjects;

  useEffect(() => {
    setActiveIndex(0);
    setEnableTransition(true);
  }, [activeCategory, slidesPerView]);

  useEffect(() => {
    if (!canCarousel || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) =>
        prev >= filteredProjects.length ? prev : prev + 1
      );
    }, AUTO_PLAY_MS);

    return () => clearInterval(timer);
  }, [canCarousel, isPaused, activeCategory, slidesPerView, filteredProjects.length]);

  const handleTransitionEnd = () => {
    if (!canCarousel || activeIndex < filteredProjects.length) return;

    setEnableTransition(false);
    setActiveIndex(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEnableTransition(true));
    });
  };

  const trackWidthPercent = (carouselProjects.length / slidesPerView) * 100;
  const slideWidthPercent = 100 / carouselProjects.length;
  const trackOffset =
    carouselProjects.length > 0
      ? (activeIndex / carouselProjects.length) * 100
      : 0;

  const activeIndicator =
    (activeIndex + Math.floor(slidesPerView / 2)) % filteredProjects.length;

  return (
    <section id="projects" className="py-24 px-4 md:px-8 relative">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
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
            className={cn(
              "px-4 py-2 rounded-full border transition",
              activeCategory === "office"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/60"
            )}
          >
            Professional
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("personal")}
            className={cn(
              "px-4 py-2 rounded-full border transition",
              activeCategory === "personal"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/60"
            )}
          >
            Personal
          </button>
        </div>

        <div
          className="overflow-hidden w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={cn(
              "flex",
              enableTransition && "transition-transform duration-500 ease-in-out"
            )}
            style={{
              width: `${trackWidthPercent}%`,
              transform: `translate3d(-${trackOffset}%, 0, 0)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {carouselProjects.map((project, index) => (
              <div
                key={`${project.id}-${index}`}
                className="shrink-0 box-border"
                style={{ width: `${slideWidthPercent}%` }}
              >
                <div className="h-full px-2">
                  <ProjectCard project={project} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {canCarousel && (
          <div className="flex justify-center gap-2 mt-8" aria-hidden="true">
            {filteredProjects.map((project, index) => (
              <span
                key={project.id}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  index === activeIndicator
                    ? "w-8 bg-primary"
                    : "w-2.5 bg-primary/30"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
