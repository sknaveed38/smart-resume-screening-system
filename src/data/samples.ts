import { JobDescription } from '../types';

export const SAMPLE_JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: 'jd-fullstack',
    title: 'Senior Full-Stack Software Engineer',
    department: 'Engineering',
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'AWS'],
    descriptionText: `We are looking for a Senior Full-Stack Software Engineer to join our high-performing core platforms team. In this role, you will lead the architecture, engineering, and maintenance of our interactive, scalable web portals.

Key Responsibilities:
- Design and build elegant, responsive client applications using modern React, Tailwind, and State Management.
- Develop, query, and optimize secure restful APIs using Node.js, Express, and relational PostgreSQL databases.
- Integrate secure third-party services and coordinate state-of-the-art authentication flow systems.
- Containerize configurations with Docker and deploy systems inside container-orchestrated environments like AWS ECS.
- Mentor junior engineers and champion strict clean-code principles, linting pipelines, and automated test coverage.

Requirements:
- 5+ years of software engineering experience.
- Deep level expertise with React, TypeScript, and backend APIs.
- Proficient building with database tables and complex queries (PostgreSQL / SQL databases).
- Exceptional communication skills and collaborative agile values.`
  },
  {
    id: 'jd-datascientist',
    title: 'Senior Machine Learning & Data Scientist',
    department: 'AI & Data Platforms',
    skillsRequired: ['Python', 'PyTorch', 'TensorFlow', 'Pandas', 'Scikit-Learn', 'Natural Language Processing', 'SQL', 'LLMs', 'Prompt Engineering'],
    descriptionText: `We are seeking a Senior Data Scientist / ML Engineer specialized in Natural Language Processing and Generative AI. You will build, fine-tune, and integrate AI models to power smart features on our enterprise systems.

Key Responsibilities:
- Standardize, process, and analyze vast raw unstructured datasets using Pandas and NumPy.
- Design, build, train, and deploy custom NLP models using PyTorch, TensorFlow, or Scikit-learn.
- Integrate, evaluate, and configure Large Language Model endpoints (like Gemini or OpenAI) using prompt engineering and advanced retrieval-augmented generation (RAG) frameworks.
- Construct scalable data pipelines and query high-volume relational and analytical data storage systems using SQL.
- Write clear mathematical documentations and collaborate on predictive analytics features.

Requirements:
- Master's or PhD in Computer Science, Mathematics, or a highly technical quantitative discipline.
- 4+ years of professional ML/AI engineering experience.
- Strong Python proficiency and experience writing custom neural network models.
- Exceptional analytical problem-solving skills.`
  },
  {
    id: 'jd-pm',
    title: 'Technical Product Manager',
    department: 'Product Management',
    skillsRequired: ['Product Strategy', 'Agile/Scrum', 'User Research', 'Data Analytics', 'Roadmapping', 'Jira', 'SQL', 'A/B Testing'],
    descriptionText: `We are hiring a Technical Product Manager to own the lifecycle development of our collaborative workspace tools. You will bridge the gap between business desires, engineering timelines, and design principles.

Key Responsibilities:
- Define product vision, compile detail-oriented functional requirement papers, and maintain highly prioritized backlogs in Jira.
- Partner closely with engineering leads and designers using agile development and Scrum methodologies.
- Engage with enterprise users to perform thorough user research, discover friction points, and distill design needs.
- Pull data directly using SQL and evaluate metrics, tracking engagement, and coordinating scientific A/B tests.
- Communicate roadmaps, release milestones, and strategic objectives confidently to corporate executives.

Requirements:
- 3+ years of technical product management experience.
- Strong technical foundations (comprehension of APIs, database systems, and web architecture).
- Impeccable storytelling, prioritization, and analytical credentials.`
  }
];

export const SAMPLE_RESUMES = {
  alex: {
    name: 'Alex Rivera - Senior Full Stack Engineer',
    text: `ALEX RIVERA
Email: alex.rivera@devmail.io | Phone: +1-555-0192 | Web: github.com/alexrivera-dev

PROFESSIONAL SUMMARY
Dynamic and highly analytical Senior Software Engineer with over 6 years of expertise building scalable, high-fidelity full-stack applications. Proven track record leading developer teams, drafting modern component architectures in React and TypeScript, designing low-latency REST APIs in Node.js, and deploying container-driven distributed storage clusters.

CORE SKILLS
- Frontend: React (18+), TypeScript, Next.js, Redux Toolkit, Tailwind CSS, HTML5/CSS3
- Backend: Node.js, Express, RESTful APIs, GraphQL, Python (FastAPI)
- Databases: PostgreSQL, MongoDB, Redis
- DevOps: Docker, AWS (S3, EC2, ECS), Git, CI/CD Pipelines

EXPERIENCE
Lead Full Stack Engineer | CloudTech Solutions (2023 - Present)
- Architected and deployed a multi-tenant client administrative portal using React, TypeScript, and Tailwind CSS, increasing user engagement by 40%.
- Supervised the engineering of a relational PostgreSQL data layer, rewriting slow SQL queries and improving page load speeds by 2.4 seconds.
- Created microservice APIs with Node.js and Express, implementing clean route structures, JSON-schema validators, and token-based state handlers.
- Established a rigorous Docker setup for seamless staging and localized team container alignment.

Senior Software Developer | WebLabs Systems (2020 - 2023)
- Engineered scalable interactive modules in React, integrating rich user feedback state, visual components, and real-time alerts.
- Configured secure server middleware, routing algorithms, and third-party SaaS integrations.
- Coordinated regular agile sprints, conducting constructive pull-request code reviews and managing tasks on Jira boards.

EDUCATION
Bachelor of Science in Computer Science
University of San Francisco (Graduated: 2020)`
  },
  sarah: {
    name: 'Dr. Sarah Chen - Senior Data Scientist',
    text: `DR. SARAH CHEN
Email: sarah.chen@analytics-labs.org | Phone: +1-555-0481 | Web: scholar.google.org/sarahchen

PROFESSIONAL SUMMARY
Distinguished AI Researcher and Data Scientist with 5+ years of industry experience creating neural networks, working with natural language architectures, and deploying complex analytical pipelines. Specializes in advanced NLP models, Python scripting, text embeddings, and large language model integration.

CORE SKILLS
- Languages: Python (Expert), SQL, R, C++
- AI/ML Stack: PyTorch, TensorFlow, Scikit-Learn, Hugging Face, Transformers, Prompt Engineering
- Analytics & NLP: Natural Language Processing, Pandas, NumPy, text-mining, TF-IDF
- Cloud/Data platforms: GCP (BigQuery), AWS, PostgreSQL, Snowflake

EXPERIENCE
Principal ML Engineer | Cortex AI Labs (2022 - Present)
- Supervised the build-out of a custom natural language parsing utility using Python and PyTorch, analyzing massive corporate text files, extracting patterns, and outputting structured telemetry.
- Engineered generative AI applications incorporating prompt engineering, semantic routing models, and large context embeddings.
- Structured complex SQL pipelines across BigQuery models to organize data pools, saving $50k in storage fees.
- Formulated predictive text analysis algorithms with Scikit-learn, yielding 94% categorical precision.

Data Scientist | Alpha Analytics (2019 - 2022)
- Applied Pandas, Numpy, and Pandas Profiling to conduct rigorous EDA (exploratory data analysis) on unstructured data streams.
- Trained and validated predictive classifiers, generating user recommendation widgets.
- Author of 3 publications on deep neural networks at international AI workshops.

EDUCATION
Ph.D. in Computer Science (Specialization: Machine Learning)
Stanford University (Graduated: 2019)`
  },
  marcus: {
    name: 'Marcus Vance - Product Manager',
    text: `MARCUS VANCE
Email: vance.marcus@producthub.net | Phone: +1-555-0372 | Web: linkedin.com/in/marcusvance

PROFESSIONAL SUMMARY
Highly collaborative Product Manager with 4 years of tenure leading multi-disciplinary squads to build user-centric SaaS interfaces. Veteran in user research, sprint methodologies, data analytics, and agile roadmap governance.

CORE SKILLS
- Product Strategy: Product Life-cycle, Roadmapping, Market Research, Feature Prioritization
- Tools: Jira, Confluence, Figma, Amplitude, Mixpanel, Tableau
- Technical: SQL, REST APIs, HTML/CSS, Agile/Scrum (Scrum Alliance Certified)

EXPERIENCE
Product Manager | CollabFlow Software (2022 - Present)
- Steered the product lifecycles for key co-working layout tools, increasing daily active workspaces by 35%.
- Authored crisp product requirement documents (PRDs) and engineered clear Jira Epic backlogs.
- Conducted exhaustive user interviews and qualitative feedback loops, driving UX enhancements.
- Pulled Tableau and custom SQL reports to monitor user conversion, evaluating features via split testing.

Associate Product Product Professional | DevMatrix Corp (2020 - 2022)
- Collaborated inside rapid agile sprints with engineers and designers to release critical integrations.
- Coordinated weekly Scrum events, daily sync standups, and retrospective planning sessions.

EDUCATION
Bachelor of Science in Business & Technology
University of Washington (Graduated: 2020)`
  },
  jack: {
    name: 'Jack Wright - Junior Web Developer',
    text: `JACK WRIGHT
Email: jacky@dev-coder.com | Phone: +1-555-0982

PROFESSIONAL SUMMARY
Enthusiastic and motivated Junior Frontend Developer with 1 year of programming experience. Eager to expand web skills and contribute to interactive designs.

CORE SKILLS
- Web: HTML5, CSS3, JavaScript (ES6)
- Libraries: jQuery, basic Bootstrap, novice React
- Tools: Git, VS Code

EXPERIENCE
Junior Web Intern | Local Digital Solutions (2025)
- Coded simple static landing pages for local small business owners using clean basic styles.
- Fixed basic styling bugs, adjusted responsive margins, and aligned form elements.
- Assisted in uploading media assets and configuring simple WordPress forms.

EDUCATION
Associate Degree in Information Technology
Seattle Community College (Graduated: 2024)`
  }
};
