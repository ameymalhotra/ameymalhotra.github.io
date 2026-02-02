/**
 * Content Configuration
 * 
 * Customize your portfolio content here. All text content and links
 * can be easily updated without touching component logic.
 */

export const content = {
  about: `I'm a Computer Science student passionate about building 
innovative software solutions. I enjoy working across the full stack 
and am always learning new technologies to solve real-world problems.`,

  stack: {
    backend: ['Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB'],
    frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    data: ['Pandas', 'NumPy', 'SQL', 'Data Analysis'],
    infra: ['Docker', 'AWS', 'Git', 'CI/CD'],
  },

  projects: [
    {
      id: 1,
      name: 'Project Alpha',
      description: 'A scalable data processing system that handles complex workflows and transforms raw data into actionable insights.',
      problem: 'Solving complex data processing challenges',
      solution: 'Built a scalable system using modern technologies',
      tech: ['React', 'Node.js', 'PostgreSQL'],
      impact: 'Improved processing time by 40%',
      link: 'https://github.com/yourusername/project-alpha',
      liveUrl: null,
    },
    {
      id: 2,
      name: 'Project Beta',
      description: 'Redesigned user interface focused on accessibility and modern UX patterns, improving engagement across all user segments.',
      problem: 'User experience needed improvement',
      solution: 'Redesigned interface with focus on accessibility',
      tech: ['React', 'TypeScript', 'Tailwind CSS'],
      impact: 'Increased user engagement by 25%',
      link: 'https://github.com/yourusername/project-beta',
      liveUrl: 'https://project-beta.example.com',
    },
    {
      id: 3,
      name: 'Project Gamma',
      description: 'Performance-optimized backend service with intelligent caching and query optimization for high-traffic applications.',
      problem: 'System needed better performance',
      solution: 'Optimized algorithms and database queries',
      tech: ['Python', 'PostgreSQL', 'Redis'],
      impact: 'Reduced response time by 60%',
      link: 'https://github.com/yourusername/project-gamma',
      liveUrl: null,
    },
  ],

  experience: [
    {
      role: 'Undergraduate Research Assistant',
      company: 'Data Science and Computational Biology Lab',
      period: 'Sep 2025 - Present',
      description: 'Engineering ML pipelines for cancer pathology image classification using transformer architectures',
    },
    {
      role: 'Undergraduate Research Assistant',
      company: 'SCALE-R Lab, Department of Geography',
      period: 'Sep 2025 - Present',
      description: 'Building interactive web dashboards for coastal resilience visualization using React and MapBox',
    },
    {
      role: 'Project Lead',
      company: 'Unlock AI',
      period: 'May 2025 - Present',
      description: 'Leading development of a privacy-focused academic advising system using small language models',
    },
    {
      role: 'Teaching Assistant',
      company: 'Department of Computer Science',
      period: 'Aug - Dec 2025',
      description: 'Delivered Python programming support to 65+ students, improving comprehension scores by 20%',
    },
  ],

  now: `Currently focused on building full-stack applications and 
exploring new technologies. Working on personal projects and 
contributing to open source.`,

  contact: {
    email: 'axm8832@miami.edu',
    github: 'https://github.com/tech-greek',
    linkedin: 'https://www.linkedin.com/in/amey-malhotra/',
    formEndpoint: null, // e.g. 'https://formspree.io/f/YOUR_FORM_ID' or null to hide form
    tagline: "Let's get in touch and build together.",
  },

  resume: {
    url: '/resume.pdf', // Place your resume.pdf in the public folder
    filename: 'resume.pdf',
  },
}

export const commands = [
  'help',
  'about',
  'stack',
  'projects',
  'experience',
  'now',
  'contact',
  'resume',
  'clear',
]
