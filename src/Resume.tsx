import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Link as LinkIcon, Github, Linkedin, MapPin, Calendar, ArrowLeft } from 'lucide-react';

const Resume: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-sky-200 dark:bg-sky-900 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-200 dark:bg-indigo-900 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="relative container max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-6 py-16">
                <div className="relative bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-blue-100/50 dark:border-blue-900/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-950/50">

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-all mb-6 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Home</span>
                    </Link>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-blue-950 dark:text-blue-50 mb-4">Ryan Fahey</h1>
                        <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm md:text-base text-blue-800 dark:text-blue-200 mb-3">
                            <a href="mailto:ryan@ryan.science" className="flex items-center gap-1 hover:text-blue-950 dark:hover:text-blue-100 transition-colors">
                                <Mail size={16} /> ryan@ryan.science
                            </a>
                            <a href="https://ryan.science" className="flex items-center gap-1 hover:text-blue-950 dark:hover:text-blue-100 transition-colors">
                                <LinkIcon size={16} /> ryan.science
                            </a>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm md:text-base text-blue-800 dark:text-blue-200 mb-3">
                            <a href="https://github.com/Ryan5453" className="flex items-center gap-1 hover:text-blue-950 dark:hover:text-blue-100 transition-colors">
                                <Github size={16} /> Ryan5453
                            </a>
                            <a href="https://www.linkedin.com/in/Ryan5453" className="flex items-center gap-1 hover:text-blue-950 dark:hover:text-blue-100 transition-colors">
                                <Linkedin size={16} /> linkedin.com/in/Ryan5453
                            </a>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm text-blue-700 dark:text-blue-300">
                            <span className="flex items-center gap-1">
                                <MapPin size={16} /> Boston, Massachusetts
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={16} /> Availability: January - August 2026
                            </span>
                        </div>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-blue-950 dark:text-blue-50 mb-4 pb-2 border-b-2 border-blue-300 dark:border-blue-700">Education</h2>
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Northeastern University</h3>
                                <span className="text-blue-700 dark:text-blue-300 text-sm md:text-base">Boston, MA</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-blue-800 dark:text-blue-200">Khoury College of Computer Sciences</p>
                                <span className="text-blue-700 dark:text-blue-300 text-sm md:text-base">September 2023 - June 2027</span>
                            </div>
                            <p className="italic text-blue-800 dark:text-blue-200 mb-1">Candidate for Bachelor of Science in Computer Science, AI Concentration</p>
                            <p className="text-blue-800 dark:text-blue-200 mb-2"><strong>GPA:</strong> 3.596/4.0, Dean's List</p>
                            <p className="text-blue-800 dark:text-blue-200">
                                <strong>Related Courses:</strong> <a href="https://pages.github.khoury.northeastern.edu/4130/2024F/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors underline">Engineering LLM-integrated systems</a>, Algorithms & Data, Computer Systems,
                                Object-Oriented Design, <a href="https://ccs.neu.edu/home/alina/classes/Fall2025/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors underline">AI Security & Privacy</a>, <a href="https://course.ccs.neu.edu/ds4400/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors underline">Machine Learning and Data Mining 1</a>
                            </p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-blue-950 dark:text-blue-50 mb-4 pb-2 border-b-2 border-blue-300 dark:border-blue-700">Computer Knowledge</h2>
                        <div className="space-y-2">
                            <p className="text-blue-800 dark:text-blue-200">
                                <strong>Languages:</strong> <em>Proficient:</em> Python, Java; <em>Familiar:</em> JavaScript, TypeScript, Rust
                            </p>
                            <p className="text-blue-800 dark:text-blue-200">
                                <strong>Technologies:</strong> Docker, Kubernetes, ArgoCD, React, FastAPI, Postgres, MongoDB, Redis, Cloudflare
                            </p>
                            <p className="text-blue-800 dark:text-blue-200">
                                <strong>Operating Systems:</strong> macOS, Linux (Ubuntu, Debian), Windows
                            </p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-blue-950 dark:text-blue-50 mb-4 pb-2 border-b-2 border-blue-300 dark:border-blue-700">Projects</h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Flowery</h3>
                                <a href="https://flowery.pw" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors flex items-center gap-1 text-sm md:text-base">
                                    <LinkIcon size={14} /> flowery.pw
                                </a>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm text-blue-700 dark:text-blue-300">Python, FastAPI, Docker, Redis, TypeScript/Vite/React, Rust, FFmpeg</p>
                                <span className="text-blue-700 dark:text-blue-300 text-sm">December 2022 - Present</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 ml-4">
                                <li>Developed text-to-speech service with web UI and HTTP API, processing 1M+ requests/month for Discord bots, accessibility tools, and developer integrations</li>
                                <li>Built audio processing engine with caching, rate-limiting, dynamic translation, and speed adjustment</li>
                                <li>Currently implementing full Speech Synthesis Markup Language (SSML) compliance</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Demucs</h3>
                                <a href="https://github.com/Ryan5453/demucs" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors flex items-center gap-1 text-sm md:text-base">
                                    <Github size={14} /> Ryan5453/demucs
                                </a>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm text-blue-700 dark:text-blue-300">Python, PyTorch, TorchCodec, Cog, FFmpeg</p>
                                <span className="text-blue-700 dark:text-blue-300 text-sm">June 2025 - Present</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 ml-4">
                                <li>Modernized Meta's SOTA audio source separation model for current Python/PyTorch ecosystem</li>
                                <li>Designed Python API and CLI with multiple deployment strategies (CLI, Python API, REST API via Cog/Replicate) and simplified GPU installation across CUDA versions using UV</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">LyricScribe</h3>
                                <a href="https://github.com/Ryan5453/lyricscribe" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors flex items-center gap-1 text-sm md:text-base">
                                    <Github size={14} /> Ryan5453/lyricscribe
                                </a>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm text-blue-700 dark:text-blue-300">Python, High Performance Computing (Explorer Cluster)</p>
                                <span className="text-blue-700 dark:text-blue-300 text-sm">April 2024 - Present</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 ml-4">
                                <li>Conducting research measuring background noise effects on audio transcription quality (word error rate)</li>
                                <li>Developing transcription pipeline with fine-tuned model on HPC cluster to improve music transcription</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-blue-950 dark:text-blue-50 mb-4 pb-2 border-b-2 border-blue-300 dark:border-blue-700">Experience</h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Montai Therapeutics</h3>
                                <span className="text-blue-700 dark:text-blue-300 text-sm md:text-base">Cambridge, MA</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <p className="italic text-blue-800 dark:text-blue-200">MLOps & Infrastructure Engineer Co-op</p>
                                <span className="text-blue-700 dark:text-blue-300 text-sm md:text-base">January 2025 - June 2025</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 ml-4">
                                <li>Migrated infrastructure to ArgoCD, enabling reproducible ML experiments across multiple GPU types with Docker-in-Docker access for JupyterHub, accelerating computational drug discovery workflows</li>
                                <li>Developed GitHub PR bot with Slack integration, reducing open PRs 75% to accelerate code reviews and feature delivery across computational modeling team</li>
                                <li>Managed AWS/K8s/Docker infrastructure and containerized environments, ensuring system reliability for time-sensitive research</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Northeastern University</h3>
                                <span className="text-blue-700 dark:text-blue-300 text-sm md:text-base">Boston, MA</span>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <p className="italic text-blue-800 dark:text-blue-200">IT Support, Mechanical & Industrial Engineering</p>
                                <span className="text-blue-700 dark:text-blue-300 text-sm md:text-base">September 2023 - Present</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 ml-4">
                                <li>Provide technical support to faculty and graduate students through systematic troubleshooting, hardware repairs, and system upgrades (RAM, storage, OS configurations) for research workstations</li>
                                <li>Manage $1M+ 3D printing lab and large-format plotters, coordinating print job workflows and supporting capstone students with poster printing and prototyping for senior design projects</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-950 dark:text-blue-50 mb-4 pb-2 border-b-2 border-blue-300 dark:border-blue-700">Interests</h2>
                        <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 ml-4">
                            <li>Artificial Intelligence and Machine Learning (LLMs, RL, Computer Vision, ASR, TTS)</li>
                            <li>DevOps practices and server management (containerization, CI/CD, cloud infrastructure)</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Resume;
