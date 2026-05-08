import { Briefcase, Code, User } from "lucide-react";

export const AboutSection = () => {
    return (
        <section id="about" className="py-24 px-4 relative">
            {" "}
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    About <span className="text-primary"> Me</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">
                            Passionate Web Developer
                        </h3>

                        <p className="text-muted-foreground">
                            With over 2 years of experience in full stack web development, I
                            build scalable and maintainable MERN applications that prioritize
                            performance, accessibility, and clean architecture.
                        </p>

                        <p className="text-muted-foreground">
                            I focus on delivering production-ready solutions through strong
                            React and Node.js fundamentals, structured GitHub workflows,
                            Docker-based environments, and reliable server deployments.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                            <a href="#contact" className="cosmic-button">
                                {" "}
                                Get In Touch
                            </a>

                            <a
                                href="/AshishBediCV.pdf (1).pdf"
                                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
                            >
                                Download CV
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Code className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">Full Stack MERN Development</h4>
                                    <p className="text-muted-foreground">
                                        Building end-to-end web applications using MongoDB,
                                        Express, React, and Node.js with scalable architecture
                                        and clean code practices.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">API &amp; Backend Engineering
                                    </h4>
                                    <p className="text-muted-foreground">
                                        Designing and integrating robust REST APIs,
                                        authentication flows, and data handling to power
                                        dynamic, reliable user experiences.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Briefcase className="h-6 w-6 text-primary" />
                                </div>

                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">Deployment &amp; Performance
                                    </h4>
                                    <p className="text-muted-foreground">
                                        Delivering production-ready apps with Docker-based
                                        workflows, GitHub-driven collaboration, and smooth
                                        server deployment with performance optimization.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};