import React, { useState } from 'react';
import { Candidate, JobDescription, ScreeningResult } from './types';
import { SAMPLE_JOB_DESCRIPTIONS, SAMPLE_RESUMES } from './data/samples';
import JobDescriptionEditor from './components/JobDescriptionEditor';
import ResumeUploader from './components/ResumeUploader';
import CandidateLeaderboard from './components/CandidateLeaderboard';
import CandidateDetails from './components/CandidateDetails';
import ComparisonView from './components/ComparisonView';
import { LayoutDashboard, Users, BookMarked, Settings, RefreshCw, Sparkles, ServerCrash, HelpCircle } from 'lucide-react';

// Pre-calculated analysis maps to make the demo immediately engaging with zero delay
const PRELOADED_RESULTS_MAP: Record<string, Record<string, ScreeningResult>> = {
  'jd-fullstack': {
    'alex': {
      candidateName: 'Alex Rivera',
      email: 'alex.rivera@devmail.io',
      phone: '+1-555-0192',
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'AWS'],
      education: [
        { institution: 'University of San Francisco', degree: 'Bachelor of Science in Computer Science', graduationYear: '2020' }
      ],
      experience: [
        { company: 'CloudTech Solutions', role: 'Lead Full Stack Engineer', duration: '2023 - Present', description: 'Architected a client portal in React/TS. Rewrote PostgreSQL schema and optimized relational storage queries. Managed Docker clusters.' },
        { company: 'WebLabs Systems', role: 'Senior Software Developer', duration: '2020 - 2023', description: 'Built interactive React elements, integrated state-controllers, and led developer agile sprints.' }
      ],
      overallScore: 94,
      fitLevel: 'Very High',
      matchExplanation: 'Alex is an exceptional senior full-stack candidate. He covers every single core asset (React, Node, PostgreSQL, TS) and demonstrates 6+ years of strong leadership and database optimization achievements.',
      radarMetrics: {
        technicalAlignment: 96,
        experienceDepth: 94,
        domainKnowledge: 90,
        softSkills: 92,
        growthPotential: 95
      },
      strengths: [
        'Direct, multi-year core matching with React, TypeScript, Node.js and Postgres.',
        'Proven technical leadership, managing agile teams and staging deployment structures.',
        'Superb communication and mentor values.'
      ],
      weaknesses: [
        'Limited explicit focus on ML/AI technologies within historic projects.'
      ],
      keywordMatch: [
        { keyword: 'React', matched: true },
        { keyword: 'TypeScript', matched: true },
        { keyword: 'Node.js', matched: true },
        { keyword: 'Express', matched: true },
        { keyword: 'PostgreSQL', matched: true },
        { keyword: 'Tailwind CSS', matched: true },
        { keyword: 'Docker', matched: true },
        { keyword: 'AWS', matched: true }
      ],
      customQuestions: [
        'While you possess strong Docker staging knowledge, our team targets managed AWS Elastic Container Services. Speak of your experience coordinating load-balanced production clusters on AWS.',
        'You successfully optimized queries in PostgreSQL by 2.4 seconds. What specific strategies (indexing, CTE refactoring, pooling) did you implement?',
        'As a Lead Engineer, how do you handle architectural consensus when developers hold opposing opinions on state management?'
      ]
    },
    'sarah': {
      candidateName: 'Dr. Sarah Chen',
      email: 'sarah.chen@analytics-labs.org',
      phone: '+1-555-0481',
      skills: ['Python', 'SQL', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-Learn', 'Natural Language Processing'],
      education: [
        { institution: 'Stanford University', degree: 'Ph.D. in Computer Science (Machine Learning)', graduationYear: '2019' }
      ],
      experience: [
        { company: 'Cortex AI Labs', role: 'Principal ML Engineer', duration: '2022 - Present', description: 'Engineered text-parsing models. Programmed custom neural networks in PyTorch and deployed text semantic classifiers.' },
        { company: 'Alpha Analytics', role: 'Data Scientist', duration: '2019 - 2022', description: 'Conducted exploratory data analysis (EDA) using Pandas/Numpy. Formulated predictive recommendation APIs.' }
      ],
      overallScore: 68,
      fitLevel: 'Medium',
      matchExplanation: 'Dr. Chen is a premier ML researcher, but has limited exposure to full-stack front-end styling (React, Tailwind) and back-end web servers (Node, Express) required by this engineering vacancy.',
      radarMetrics: {
        technicalAlignment: 55,
        experienceDepth: 85,
        domainKnowledge: 95,
        softSkills: 80,
        growthPotential: 90
      },
      strengths: [
        'Outstanding mathematical, research, and machine learning qualifications (Stanford Ph.D.).',
        'Expert Python computational fluency (PyTorch, predictive statistics, data pipeline querying).'
      ],
      weaknesses: [
        'Zero direct experience with Node.js/Express backends or UI components.',
        'Missing standard frontend structures like React or modern tailwind CSS.'
      ],
      keywordMatch: [
        { keyword: 'React', matched: false },
        { keyword: 'TypeScript', matched: false },
        { keyword: 'Node.js', matched: false },
        { keyword: 'Express', matched: false },
        { keyword: 'PostgreSQL', matched: true }, // has SQL
        { keyword: 'Tailwind CSS', matched: false },
        { keyword: 'Docker', matched: false },
        { keyword: 'AWS', matched: true } // has AWS
      ],
      customQuestions: [
        'This role is focused heavily on developing client interfaces. How would you approach transitioning from Python/LLM projects to building React browser views?',
        'You have robust expertise with PostgreSQL. How do you handle schema migrations or database replication when designing data layers?'
      ]
    },
    'marcus': {
      candidateName: 'Marcus Vance',
      email: 'vance.marcus@producthub.net',
      phone: '+1-555-0372',
      skills: ['Product Strategy', 'Agile/Scrum', 'User Research', 'Data Analytics', 'Roadmapping', 'Jira', 'SQL'],
      education: [
        { institution: 'University of Washington', degree: 'Bachelor of Science in Business & Technology', graduationYear: '2010' }
      ],
      experience: [
        { company: 'CollabFlow Software', role: 'Product Manager', duration: '2022 - Present', description: 'Led lifecycle roadmap products. Written detailed product requirements (PRDs). Conducted custom user research.' }
      ],
      overallScore: 50,
      fitLevel: 'Low',
      matchExplanation: 'Marcus possesses exceptional product strategy, Jira coordination, and stakeholder agility credentials. However, he lacks direct full-stack coding capability matching our Senior Engineer specification.',
      radarMetrics: {
        technicalAlignment: 30,
        experienceDepth: 75,
        domainKnowledge: 70,
        softSkills: 95,
        growthPotential: 88
      },
      strengths: [
        'Exceptional agile management, Scrum methodology, and PRD technical copywriting.',
        'Strong corporate-facing communication and user conversion analytics.'
      ],
      weaknesses: [
        'Does not have practical engineering or code development profiles.',
        'Missing all requested core languages: JavaScript, React, TS, Node, Express.'
      ],
      keywordMatch: [
        { keyword: 'React', matched: false },
        { keyword: 'TypeScript', matched: false },
        { keyword: 'Node.js', matched: false },
        { keyword: 'Express', matched: false },
        { keyword: 'PostgreSQL', matched: true }, // has SQL
        { keyword: 'Tailwind CSS', matched: false },
        { keyword: 'Docker', matched: false },
        { keyword: 'AWS', matched: false }
      ],
      customQuestions: [
        'We value product-oriented thinking, but this is a pure-coding IC engineering seat. Tell us of your direct hands-on testing or coding capabilities.',
        'As product managers handle functional designs, how do you evaluate developer-led refactoring decisions against business feature demands?'
      ]
    },
    'jack': {
      candidateName: 'Jack Wright',
      email: 'jacky@dev-coder.com',
      phone: '+1-555-0982',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap', 'Git'],
      education: [
        { institution: 'Seattle Community College', degree: 'Associate Degree in Information Technology', graduationYear: '2024' }
      ],
      experience: [
        { company: 'Local Digital Solutions', role: 'Junior Web Intern', duration: '22025', description: 'Coded simple static layouts. Fixed CSS styling bugs and responsive container padding alignment.' }
      ],
      overallScore: 45,
      fitLevel: 'Low',
      matchExplanation: 'Jack is motivated but early in his career. He is missing the senior architecture milestones (database design, server-side REST APIs, container orchestrations) and 5+ years of industry experience required.',
      radarMetrics: {
        technicalAlignment: 40,
        experienceDepth: 25,
        domainKnowledge: 35,
        softSkills: 70,
        growthPotential: 75
      },
      strengths: [
        'Solid foundation in standard layout technologies: HTML, CSS, JavaScript (ES6).',
        'Proactive team intern motivation and Git versioning familiarities.'
      ],
      weaknesses: [
        'Extremely entry-level: possesses less than 1 year of professional history.',
        'Lacks backend, TypeScript, node server routing, or container deployment qualifications.'
      ],
      keywordMatch: [
        { keyword: 'React', matched: false },
        { keyword: 'TypeScript', matched: false },
        { keyword: 'Node.js', matched: false },
        { keyword: 'Express', matched: false },
        { keyword: 'PostgreSQL', matched: false },
        { keyword: 'Tailwind CSS', matched: false },
        { keyword: 'Docker', matched: false },
        { keyword: 'AWS', matched: false }
      ],
      customQuestions: [
        'Our applications are architected entirely in TypeScript. Have you worked with static typing, interfaces, and compile-time checkers?',
        'You have experience with simple landing projects. Describe your conceptual understanding of RESTful API query routing or database structures.'
      ]
    }
  },
  'jd-datascientist': {
    'alex': {
      candidateName: 'Alex Rivera',
      email: 'alex.rivera@devmail.io',
      phone: '+1-555-0192',
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'AWS'],
      education: [
        { institution: 'University of San Francisco', degree: 'Bachelor of Science in Computer Science', graduationYear: '2020' }
      ],
      experience: [
        { company: 'CloudTech Solutions', role: 'Lead Full Stack Engineer', duration: '2023 - Present', description: 'Architected Web Portals. Built relational layers in SQL, Node, Express.' }
      ],
      overallScore: 60,
      fitLevel: 'Medium',
      matchExplanation: 'Alex has tremendous general computational and SQL background. However, he is lacking the specific NLP modeling, mathematical data pipelines (Pandas/NumPy), and neural training models required for AI.',
      radarMetrics: {
        technicalAlignment: 50,
        experienceDepth: 75,
        domainKnowledge: 55,
        softSkills: 80,
        growthPotential: 82
      },
      strengths: [
        'Strong general backend coding, algorithm fluency, and PostgreSQL structures.',
        'Excellent engineering leadership and agile teamwork values.'
      ],
      weaknesses: [
        'Zero explicit ML/AI workspace frameworks (PyTorch, TensorFlow, Hugging Face).',
        'Lacks Python scripting depth required for heavy mathematical pipeline processing.'
      ],
      keywordMatch: [
        { keyword: 'Python', matched: false },
        { keyword: 'PyTorch', matched: false },
        { keyword: 'TensorFlow', matched: false },
        { keyword: 'Pandas', matched: false },
        { keyword: 'Scikit-Learn', matched: false },
        { keyword: 'Natural Language Processing', matched: false },
        { keyword: 'SQL', matched: true }, // PostgreSQL
        { keyword: 'LLMs', matched: false },
        { keyword: 'Prompt Engineering', matched: false }
      ],
      customQuestions: [
        'This is a pure research and numerical modeling seat. Speak of any academic or personal projects where you handled PyTorch, Pandas, or analytical ML datasets.'
      ]
    },
    'sarah': {
      candidateName: 'Dr. Sarah Chen',
      email: 'sarah.chen@analytics-labs.org',
      phone: '+1-555-0481',
      skills: ['Python', 'SQL', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-Learn', 'Natural Language Processing', 'LLMs', 'Prompt Engineering'],
      education: [
        { institution: 'Stanford University', degree: 'Ph.D. in Computer Science (Machine Learning)', graduationYear: '2019' }
      ],
      experience: [
        { company: 'Cortex AI Labs', role: 'Principal ML Engineer', duration: '2022 - Present', description: 'Structured text classification pipelines, custom semantic embeddings, PyTorch networks, and GenAI prompts.' },
        { company: 'Alpha Analytics', role: 'Data Scientist', duration: '2019 - 2022', description: 'Trained predictive data models, conducted clean exploratory data analytics using Pandas/NumPy, savings storage fees in SQL.' }
      ],
      overallScore: 97,
      fitLevel: 'Very High',
      matchExplanation: 'Dr. Chen is a perfect, outstanding match for the Senior Data Scientist vacancy. Her deep mathematical Ph.D. background, PyTorch neural networks, and prompt engineering credentials directly serve the role.',
      radarMetrics: {
        technicalAlignment: 98,
        experienceDepth: 96,
        domainKnowledge: 98,
        softSkills: 88,
        growthPotential: 95
      },
      strengths: [
        'Ph.D. specialization in neural architectures and text modeling from Stanford.',
        'Extremly strong tool competency: Python, custom PyTorch neural layering, Pandas, and GenAI prompting.',
        'Extensive database processing scaling across Snowflake and SQL setups.'
      ],
      weaknesses: [
        'No major product release coordination details compared to classic product roles.'
      ],
      keywordMatch: [
        { keyword: 'Python', matched: true },
        { keyword: 'PyTorch', matched: true },
        { keyword: 'TensorFlow', matched: true },
        { keyword: 'Pandas', matched: true },
        { keyword: 'Scikit-Learn', matched: true },
        { keyword: 'Natural Language Processing', matched: true },
        { keyword: 'SQL', matched: true },
        { keyword: 'LLMs', matched: true },
        { keyword: 'Prompt Engineering', matched: true }
      ],
      customQuestions: [
        'How do you handle dataset shifts or drift in production when optimizing long-standing text-mining algorithms?',
        'Describe your strategy for evaluating the accuracy, safety, and hallucinations of generative semantic embeddings.',
        'As an ML specialist, how do you convey highly technical mathematical models in simple terms to design or marketing partners?'
      ]
    },
    'marcus': {
      candidateName: 'Marcus Vance',
      email: 'vance.marcus@producthub.net',
      phone: '+1-555-0372',
      skills: ['Product Strategy', 'Agile/Scrum', 'User Research', 'Data Analytics', 'Roadmapping', 'SQL'],
      education: [
        { institution: 'University of Washington', degree: 'Bachelor of Science in Business & Technology', graduationYear: '2020' }
      ],
      experience: [
        { company: 'CollabFlow Software', role: 'Product Manager', duration: '2022 - Present', description: 'Defined product strategies, monitored analytics, and queried reports in relational SQL databases.' }
      ],
      overallScore: 55,
      fitLevel: 'Low',
      matchExplanation: 'Marcus possesses exceptional data-analytics monitoring and product-strategy foundations, but is completely missing the scientific engineering, model modeling, and script programming requirements.',
      radarMetrics: {
        technicalAlignment: 35,
        experienceDepth: 70,
        domainKnowledge: 65,
        softSkills: 95,
        growthPotential: 85
      },
      strengths: [
        'Excellent analytical telemetry tracking, metric evaluations, and SQL report pulls.',
        'Outstanding collaboration and timeline strategy governance.'
      ],
      weaknesses: [
        'Missing all ML frameworks: PyTorch, TensorFlow, Scikit-learn.',
        'Lacks programming capacities in Python scripting.'
      ],
      keywordMatch: [
        { keyword: 'Python', matched: false },
        { keyword: 'PyTorch', matched: false },
        { keyword: 'TensorFlow', matched: false },
        { keyword: 'Pandas', matched: false },
        { keyword: 'Scikit-Learn', matched: false },
        { keyword: 'Natural Language Processing', matched: false },
        { keyword: 'SQL', matched: true },
        { keyword: 'LLMs', matched: false },
        { keyword: 'Prompt Engineering', matched: false }
      ],
      customQuestions: [
        'This role requires deploying mathematics and deep networks. Speak of your familiarity collaborating specifically with Machine Learning and Data Engineers.'
      ]
    },
    'jack': {
      candidateName: 'Jack Wright',
      email: 'jacky@dev-coder.com',
      phone: '+1-555-0982',
      skills: ['HTML5', 'CSS3', 'JavaScript'],
      education: [
        { institution: 'Seattle Community College', degree: 'Associate Degree in Information Technology', graduationYear: '2024' }
      ],
      experience: [
        { company: 'Local Digital Solutions', role: 'Junior Web Intern', duration: '2025', description: 'Static front-end landing code structures.' }
      ],
      overallScore: 30,
      fitLevel: 'Low',
      matchExplanation: 'Jack is missing all modeling, mathematical programming, dataset analysis, and corporate data pipeline skills specified for our Data Scientist seat.',
      radarMetrics: {
        technicalAlignment: 25,
        experienceDepth: 15,
        domainKnowledge: 20,
        softSkills: 60,
        growthPotential: 70
      },
      strengths: [
        'Proactive learning values.'
      ],
      weaknesses: [
        'Missing standard AI tooling completely (Python, Jupyter, PyTorch, modeling, statistics).'
      ],
      keywordMatch: [
        { keyword: 'Python', matched: false },
        { keyword: 'PyTorch', matched: false },
        { keyword: 'TensorFlow', matched: false },
        { keyword: 'Pandas', matched: false },
        { keyword: 'Scikit-Learn', matched: false },
        { keyword: 'Natural Language Processing', matched: false },
        { keyword: 'SQL', matched: false },
        { keyword: 'LLMs', matched: false },
        { keyword: 'Prompt Engineering', matched: false }
      ],
      customQuestions: [
        'Data science requires extensive discrete calculus, statistics, and linear algebra. What is your academic and practical exposure to mathematical data models?'
      ]
    }
  },
  'jd-pm': {
    'alex': {
      candidateName: 'Alex Rivera',
      email: 'alex.rivera@devmail.io',
      phone: '+1-555-0192',
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Agile'],
      education: [
        { institution: 'University of San Francisco', degree: 'Bachelor of Science in Computer Science', graduationYear: '2020' }
      ],
      experience: [
        { company: 'CloudTech Solutions', role: 'Lead Full Stack Engineer', duration: '2023 - Present', description: 'Architected portals, managed Postgres layer, led developers, and evaluated sprint milestones.' }
      ],
      overallScore: 78,
      fitLevel: 'High',
      matchExplanation: 'Alex makes an interesting, highly qualified technical candidate. While he is an engineer, his proven team leadership, sprint design, client-facing dashboard engineering, and SQL analytics perfectly align with PM responsibilities.',
      radarMetrics: {
        technicalAlignment: 88,
        experienceDepth: 80,
        domainKnowledge: 70,
        softSkills: 85,
        growthPotential: 90
      },
      strengths: [
        'Deep technical foundations (APIs, structures, SQL databases, responsive views).',
        'Proven lead-developer coordination (scoping, estimating, and running sprints on Jira boards).'
      ],
      weaknesses: [
        'Lacks traditional corporate product ownership credentials (PRD definitions, corporate marketing strategy).'
      ],
      keywordMatch: [
        { keyword: 'Product Strategy', matched: false },
        { keyword: 'Agile/Scrum', matched: true },
        { keyword: 'User Research', matched: false },
        { keyword: 'Data Analytics', matched: true }, // has SQL reporting
        { keyword: 'Roadmapping', matched: false },
        { keyword: 'Jira', matched: true },
        { keyword: 'SQL', matched: true },
        { keyword: 'A/B Testing', matched: false }
      ],
      customQuestions: [
        'Why do you want to transition from a Senior engineering role to a formal Technical Product Management discipline?',
        'As a PM, how would you manage prioritizing technical debt cleanup requested by engineers vs new business customer features?'
      ]
    },
    'sarah': {
      candidateName: 'Dr. Sarah Chen',
      email: 'sarah.chen@analytics-labs.org',
      phone: '+1-555-0481',
      skills: ['Python', 'SQL', 'PyTorch'],
      education: [
        { institution: 'Stanford University', degree: 'Ph.D. in Computer Science', graduationYear: '2019' }
      ],
      experience: [
        { company: 'Cortex AI Labs', role: 'Principal ML Engineer', duration: '2022 - Present', description: 'Compiled system intelligence layers.' }
      ],
      overallScore: 60,
      fitLevel: 'Medium',
      matchExplanation: 'Dr. Chen is analytical and processes SQL metrics. However, her background is almost purely computational research-oriented, lacking user-testing, agile roadmapping, and UX feature design.',
      radarMetrics: {
        technicalAlignment: 75,
        experienceDepth: 80,
        domainKnowledge: 60,
        softSkills: 72,
        growthPotential: 85
      },
      strengths: [
        'Highly mathematical, data-fluent, and analytical foundations.',
        'Strong academic credibility.'
      ],
      weaknesses: [
        'Lacks experience guiding cross-functional design sprints, scrum rituals, or client relations.',
        'Missing focus on agile roadmap tools like Jira/PRDs.'
      ],
      keywordMatch: [
        { keyword: 'Product Strategy', matched: false },
        { keyword: 'Agile/Scrum', matched: false },
        { keyword: 'User Research', matched: false },
        { keyword: 'Data Analytics', matched: true },
        { keyword: 'Roadmapping', matched: false },
        { keyword: 'Jira', matched: false },
        { keyword: 'SQL', matched: true },
        { keyword: 'A/B Testing', matched: false }
      ],
      customQuestions: [
        'Product management focuses heavily on emotional empathy with typical, non-technical users. Describe how you would extract UX friction points from non-technical audiences.'
      ]
    },
    'marcus': {
      candidateName: 'Marcus Vance',
      email: 'vance.marcus@producthub.net',
      phone: '+1-555-0372',
      skills: ['Product Strategy', 'Agile/Scrum', 'User Research', 'Data Analytics', 'Roadmapping', 'Jira', 'SQL', 'A/B Testing'],
      education: [
        { institution: 'University of Washington', degree: 'Bachelor of Science in Business & Technology', graduationYear: '2020' }
      ],
      experience: [
        { company: 'CollabFlow Software', role: 'Product Manager', duration: '2022 - Present', description: 'Steered product life-cycles for client SaaS tools. Drafted crisp PRDs, prioritized Jira Epics, and analyzed Amplitude split metrics.' },
        { company: 'DevMatrix Corp', role: 'Associate Product Professional', duration: '2020 - 2022', description: 'Coordinated weekly sprint standups, scrum rituals, and user retro reviews.' }
      ],
      overallScore: 96,
      fitLevel: 'Very High',
      matchExplanation: 'Marcus represents a phenomenal fit as a Technical Product Manager. He has direct, proven mastery defining SaaS PRDs, coordinating scrum teams in Jira, and analyzing user conversion loops in SQL.',
      radarMetrics: {
        technicalAlignment: 85,
        experienceDepth: 94,
        domainKnowledge: 95,
        softSkills: 98,
        growthPotential: 96
      },
      strengths: [
        'Extremly strong technical product management pedigree across product life-cycles.',
        'Expert Scrum practitioner, prioritizing Jira epics and backlog scoping.',
        'Highly analytical: routinely queries SQL databases, runs Tableau dashboards, and evaluates A/B metrics.'
      ],
      weaknesses: [
        'Lacks active software production deployments compared to engineering leads.'
      ],
      keywordMatch: [
        { keyword: 'Product Strategy', matched: true },
        { keyword: 'Agile/Scrum', matched: true },
        { keyword: 'User Research', matched: true },
        { keyword: 'Data Analytics', matched: true },
        { keyword: 'Roadmapping', matched: true },
        { keyword: 'Jira', matched: true },
        { keyword: 'SQL', matched: true },
        { keyword: 'A/B Testing', matched: true }
      ],
      customQuestions: [
        'When prioritizing features, how do you handle pressure from high-profile sales accounts demanding unreleased bespoke modifications?',
        'Describe an A/B test you designed where the output was surprising or counter-intuitive. What adjustments did you direct?',
        'How do you establish clear success metrics (KPIs) when launching a brand new interactive product with zero historical usage?'
      ]
    },
    'jack': {
      candidateName: 'Jack Wright',
      email: 'jacky@dev-coder.com',
      phone: '+1-555-0982',
      skills: ['HTML5', 'CSS'],
      education: [
        { institution: 'Seattle Community College', degree: 'Associate Degree', graduationYear: '2024' }
      ],
      experience: [
        { company: 'Local Solutions', role: 'Junior Web Intern', duration: '2025', description: 'Coded local styles.' }
      ],
      overallScore: 25,
      fitLevel: 'Low',
      matchExplanation: 'Jack lacks product strategy, backlog prioritizations, data analytics, and stakeholder communication competencies required for PM leadership.',
      radarMetrics: {
        technicalAlignment: 30,
        experienceDepth: 15,
        domainKnowledge: 15,
        softSkills: 60,
        growthPotential: 68
      },
      strengths: [
        'Nice developmental enthusiast.'
      ],
      weaknesses: [
        'Has zero product design, roadmap scoping, user research or corporate Scrum qualifications.'
      ],
      keywordMatch: [
        { keyword: 'Product Strategy', matched: false },
        { keyword: 'Agile/Scrum', matched: false },
        { keyword: 'User Research', matched: false },
        { keyword: 'Data Analytics', matched: false },
        { keyword: 'Roadmapping', matched: false },
        { keyword: 'Jira', matched: false },
        { keyword: 'SQL', matched: false },
        { keyword: 'A/B Testing', matched: false }
      ],
      customQuestions: [
        'What specific books, mentors, or courses have you pursued to understand the strategic principles of Product Management?'
      ]
    }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'compare'>('dashboard');
  const [selectedJd, setSelectedJd] = useState<JobDescription>(SAMPLE_JOB_DESCRIPTIONS[0]);

  // Load baseline candidates with custom identifiers
  const makeBaselineCandidates = (jdId: string): Candidate[] => [
    {
      id: 'candidate-alex',
      fileName: 'alex_rivera_resume.pdf',
      fileSize: '124 KB',
      fileType: 'application/pdf',
      status: 'completed',
      uploadedAt: 'Baseline',
      result: PRELOADED_RESULTS_MAP[jdId]?.['alex']
    },
    {
      id: 'candidate-sarah',
      fileName: 'sarah_chen_phd_resume.txt',
      fileSize: '48 KB',
      fileType: 'text/plain',
      status: 'completed',
      uploadedAt: 'Baseline',
      result: PRELOADED_RESULTS_MAP[jdId]?.['sarah']
    },
    {
      id: 'candidate-marcus',
      fileName: 'marcus_vance_pm_resume.pdf',
      fileSize: '76 KB',
      fileType: 'application/pdf',
      status: 'completed',
      uploadedAt: 'Baseline',
      result: PRELOADED_RESULTS_MAP[jdId]?.['marcus']
    },
    {
      id: 'candidate-jack',
      fileName: 'jack_wright_intern_resume.txt',
      fileSize: '15 KB',
      fileType: 'text/plain',
      status: 'completed',
      uploadedAt: 'Baseline',
      result: PRELOADED_RESULTS_MAP[jdId]?.['jack']
    }
  ];

  const [candidates, setCandidates] = useState<Candidate[]>(() => makeBaselineCandidates(SAMPLE_JOB_DESCRIPTIONS[0].id));
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>('candidate-alex');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Function to re-estimate baseline candidates if JD changes
  const handleUpdateJd = (updatedJd: JobDescription) => {
    setSelectedJd(updatedJd);
    
    // Automatically re-evaluate preloaded candidates to keep scoring dynamic based on selected JD!
    setCandidates(prev => {
      return prev.map(c => {
        // If it's a preloaded baseline, pull its specific score for the new JD template
        const isPreloaded = ['candidate-alex', 'candidate-sarah', 'candidate-marcus', 'candidate-jack'].includes(c.id);
        if (isPreloaded) {
          const key = c.id.replace('candidate-', '');
          const mappedResult = PRELOADED_RESULTS_MAP[updatedJd.id]?.[key];
          if (mappedResult) {
            return {
              ...c,
              status: 'completed',
              result: { ...mappedResult }
            };
          }
        }
        
        // If it's a custom uploaded resume, we flag it to re-screen or clear its score.
        // To be helpful, we mark it failed/needs-re-run, or keep it, let's keep it but show a subtle warning
        return c;
      });
    });

    // Reset details selections gracefully
    setSelectedCandidateId(candidates.find(c => ['candidate-alex', 'candidate-sarah', 'candidate-marcus', 'candidate-jack'].includes(c.id))?.id || null);
  };

  // Screening API Caller (Server connection to Gemini)
  const handleQueueResume = async (resume: {
    fileName: string;
    fileSize: string;
    fileType: string;
    resumeText?: string;
    resumeBase64?: string;
    resumeMimeType?: string;
  }) => {
    const tempId = 'custom-' + Math.random().toString(36).substring(5);
    const newCandidate: Candidate = {
      id: tempId,
      fileName: resume.fileName,
      fileSize: resume.fileSize,
      fileType: resume.fileType,
      uploadedAt: new Date().toLocaleTimeString(),
      status: 'processing'
    };

    setCandidates(prev => [newCandidate, ...prev]);
    setSelectedCandidateId(tempId);

    try {
      const response = await fetch('/api/screen-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeText: resume.resumeText,
          resumeBase64: resume.resumeBase64,
          resumeMimeType: resume.resumeMimeType,
          jobTitle: selectedJd.title,
          jobDescription: selectedJd.descriptionText,
          requiredSkills: selectedJd.skillsRequired
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Model returned error " + response.status);
      }

      setCandidates(prev => prev.map(c => {
        if (c.id === tempId) {
          return {
            ...c,
            status: 'completed',
            result: data.result
          };
        }
        return c;
      }));
    } catch (err: any) {
      console.error("AJAX Error screening candidacy: ", err);
      setCandidates(prev => prev.map(c => {
        if (c.id === tempId) {
          return {
            ...c,
            status: 'failed',
            error: err.message || "Failed parsing PDF fields."
          };
        }
        return c;
      }));
    }
  };

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 3) {
        // limit to 3 for clean layouts
        alert("You can compare up to 3 candidates simultaneously for comparative reviews.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleRemoveCompare = (id: string) => {
    setSelectedForCompare(prev => prev.filter(x => x !== id));
  };

  const handleClearCompare = () => {
    setSelectedForCompare([]);
  };

  const activeCandidate = candidates.find(c => c.id === selectedCandidateId) || null;
  const comparedCandidatesList = candidates.filter(c => selectedForCompare.includes(c.id) && c.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Editorial Top Navigation Header */}
      <header className="border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col md:flex-row justify-between items-center bg-white gap-4 shrink-0 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-serif font-black text-xl shadow-sm">SK</div>
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">AI Screening Pipeline</h1>
            <p className="text-xl font-serif font-semibold italic text-slate-900 tracking-tight">SK Smart Resume Screening System</p>
          </div>
        </div>

        {/* Center: Dynamic Navigation Tabs with Underline styling */}
        <div className="flex items-center gap-6">
          <nav className="flex space-x-6">
            <button
              type="button"
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-slate-900 border-b-2 border-indigo-650'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              ATS Workspace
            </button>
            <button
              type="button"
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer relative ${
                activeTab === 'compare'
                  ? 'text-slate-900 border-b-2 border-indigo-650'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              onClick={() => setActiveTab('compare')}
            >
              Comparison Matrix
              {selectedForCompare.length > 0 && (
                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center bg-indigo-600 text-white font-mono text-[9px] font-bold rounded-full">
                  {selectedForCompare.length}
                </span>
              )}
            </button>
          </nav>

          <div className="w-px h-5 bg-slate-200 hidden sm:block"></div>

          {/* Live pipeline simulation status dots */}
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Session Progress</span>
            <div className="flex gap-1 mt-1">
              <div className="w-4 h-1 bg-indigo-600 rounded-full"></div>
              <div className="w-4 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="w-4 h-1 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' ? (
          /* Multi-column unified workspace with Editorial Card styling */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Column 1: Job Description configurator (left) - Spans 4 of 12 columns */}
            <div className="lg:col-span-4 space-y-8">
              <JobDescriptionEditor
                selectedJd={selectedJd}
                onUpdateJd={handleUpdateJd}
              />
              <ResumeUploader
                onQueueResume={handleQueueResume}
                isProcessingAny={candidates.some(c => c.status === 'processing')}
              />
            </div>

            {/* Column 2: Leaderboard matching (middle) - Spans 4 of 12 columns */}
            <div className="lg:col-span-4">
              <CandidateLeaderboard
                candidates={candidates}
                selectedCandidateId={selectedCandidateId}
                onSelectCandidate={setSelectedCandidateId}
                selectedForCompare={selectedForCompare}
                onToggleCompare={handleToggleCompare}
                onClearCompare={handleClearCompare}
              />
            </div>

            {/* Column 3: Active candidate profiling (right) - Spans 4 of 12 columns */}
            <div className="lg:col-span-4">
              {activeCandidate ? (
                <CandidateDetails
                  candidate={activeCandidate}
                />
              ) : (
                <div id="no-selection-details" className="bg-white rounded-none border border-slate-200 p-8 text-center space-y-4 shadow-sm min-h-[350px] flex flex-col items-center justify-center">
                  <BookMarked className="w-8 h-8 text-slate-300" />
                  <h3 className="text-base font-serif italic text-slate-700">No Applicant Selected</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Click on any candidate card in the ranked leaderboard pool to load their custom AI-parsed scorecard, radar diagram, or interview planners.
                  </p>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Comparison matrix panel */
          <ComparisonView
            candidates={comparedCandidatesList}
            onRemoveFromCompare={handleRemoveCompare}
            onClearAll={handleClearCompare}
          />
        )}
      </main>

      {/* Editorial Status Bar Footer */}
      <footer className="h-11 bg-slate-900 text-slate-400 flex items-center px-4 sm:px-8 justify-between mt-auto shrink-0 select-none">
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span>PIPELINE: ACTIVE</span>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span className="hidden sm:inline">GEMINI-3.5-FLASH</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
          <span>SYSTEM V2.4</span>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#a5b4fc]">
          Google AI Studio Workspace
        </div>
      </footer>
    </div>
  );
}
