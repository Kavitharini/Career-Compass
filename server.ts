import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Data persistence setup
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  education?: string;
  degree?: string;
  specialization?: string;
  graduationYear?: string;
  experienceLevel?: string;
  skills?: string[];
  interests?: string[];
  careerPreferences?: {
    preferredIndustry?: string;
    preferredWorkType?: string;
    preferredLocation?: string;
    remotePreference?: string;
    preferredJobLevel?: string;
  };
  targetRole?: string;
  recommendations?: any[];
  skillGap?: any;
  resumeAnalysis?: any;
  completedRoadmapItems?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Database {
  users: Record<string, UserRecord>;
  sessions: Record<string, string>; // token -> userId
}

function loadDb(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db:', err);
  }
  return { users: {}, sessions: {} };
}

function saveDb(db: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// Seed a default demo user if empty
let db = loadDb();
const DEMO_USER_ID = 'user_demo_101';
if (!db.users[DEMO_USER_ID]) {
  db.users[DEMO_USER_ID] = {
    id: DEMO_USER_ID,
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    password: 'password123',
    education: 'Bachelor of Science',
    degree: 'Computer Science & Engineering',
    specialization: 'Artificial Intelligence & Software Systems',
    graduationYear: '2025',
    experienceLevel: 'Fresher',
    skills: ['Python', 'SQL', 'JavaScript', 'React', 'Git', 'Data Analysis', 'Problem Solving', 'REST APIs'],
    interests: ['Artificial Intelligence', 'Data Science', 'Software Development', 'Machine Learning', 'Cloud Computing'],
    careerPreferences: {
      preferredIndustry: 'Technology & SaaS',
      preferredWorkType: 'Full-time',
      preferredLocation: 'San Francisco, CA or Remote',
      remotePreference: 'Hybrid',
      preferredJobLevel: 'Entry Level',
    },
    targetRole: 'Data Engineer',
    completedRoadmapItems: ['foundations-sql-window-func', 'foundations-python-generators'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.sessions['demo-token-alex'] = DEMO_USER_ID;
  saveDb(db);
}

// Helper: Get user from Authorization header
function getAuthUser(req: express.Request): UserRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  const userId = db.sessions[token];
  if (!userId) return null;
  return db.users[userId] || null;
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = Object.values(db.users).find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

  const newUser: UserRecord = {
    id,
    name,
    email,
    password,
    skills: [],
    interests: [],
    completedRoadmapItems: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users[id] = newUser;
  db.sessions[token] = id;
  saveDb(db);

  return res.json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      education: newUser.education,
      experienceLevel: newUser.experienceLevel,
      skills: newUser.skills,
      interests: newUser.interests,
      targetRole: newUser.targetRole,
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = Object.values(db.users).find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  db.sessions[token] = user.id;
  saveDb(db);

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      education: user.education,
      degree: user.degree,
      specialization: user.specialization,
      graduationYear: user.graduationYear,
      experienceLevel: user.experienceLevel,
      skills: user.skills,
      interests: user.interests,
      careerPreferences: user.careerPreferences,
      targetRole: user.targetRole,
      completedRoadmapItems: user.completedRoadmapItems,
    },
  });
});

app.post('/api/auth/demo-login', (req, res) => {
  const token = 'demo-token-' + Date.now();
  db.sessions[token] = DEMO_USER_ID;
  saveDb(db);
  const user = db.users[DEMO_USER_ID];
  return res.json({ token, user });
});

app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.json({ user });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '').trim();
    delete db.sessions[token];
    saveDb(db);
  }
  return res.json({ success: true });
});

// ----------------------------------------------------
// USER PROFILE & DATA ENDPOINTS
// ----------------------------------------------------

app.post('/api/user/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    name,
    education,
    degree,
    specialization,
    graduationYear,
    experienceLevel,
    skills,
    interests,
    careerPreferences,
    targetRole,
  } = req.body;

  if (name) user.name = name;
  if (education !== undefined) user.education = education;
  if (degree !== undefined) user.degree = degree;
  if (specialization !== undefined) user.specialization = specialization;
  if (graduationYear !== undefined) user.graduationYear = graduationYear;
  if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
  if (Array.isArray(skills)) user.skills = skills;
  if (Array.isArray(interests)) user.interests = interests;
  if (careerPreferences) user.careerPreferences = careerPreferences;
  if (targetRole !== undefined) user.targetRole = targetRole;

  user.updatedAt = new Date().toISOString();
  saveDb(db);

  return res.json({ success: true, user });
});

app.post('/api/user/target-role', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { targetRole } = req.body;
  if (!targetRole) return res.status(400).json({ error: 'Target role is required' });

  user.targetRole = targetRole;
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  return res.json({ success: true, targetRole });
});

app.post('/api/user/roadmap-progress', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { itemId, completed } = req.body;
  if (!itemId) return res.status(400).json({ error: 'itemId is required' });

  if (!user.completedRoadmapItems) {
    user.completedRoadmapItems = [];
  }

  if (completed) {
    if (!user.completedRoadmapItems.includes(itemId)) {
      user.completedRoadmapItems.push(itemId);
    }
  } else {
    user.completedRoadmapItems = user.completedRoadmapItems.filter((id) => id !== itemId);
  }

  user.updatedAt = new Date().toISOString();
  saveDb(db);
  return res.json({ success: true, completedRoadmapItems: user.completedRoadmapItems });
});

// ----------------------------------------------------
// AI CAREER RECOMMENDATIONS
// ----------------------------------------------------

app.post('/api/ai/recommend-careers', async (req, res) => {
  const user = getAuthUser(req);
  const profileData = req.body.profile || (user ? {
    skills: user.skills || [],
    interests: user.interests || [],
    education: user.education || '',
    degree: user.degree || '',
    specialization: user.specialization || '',
    experienceLevel: user.experienceLevel || 'Fresher',
    careerPreferences: user.careerPreferences || {},
  } : req.body);

  const prompt = `
You are the AI Career Recommendation Engine for Career Compass, a career guidance platform for students, freshers, and early-career professionals.
Analyze the user's profile below:
Skills: ${(profileData.skills || []).join(', ') || 'None specified yet'}
Interests: ${(profileData.interests || []).join(', ') || 'None specified yet'}
Education: ${profileData.education || 'Undergraduate'} ${profileData.degree ? 'in ' + profileData.degree : ''} ${profileData.specialization ? '(' + profileData.specialization + ')' : ''}
Graduation Year: ${profileData.graduationYear || '2025'}
Experience Level: ${profileData.experienceLevel || 'Fresher'}
Career Preferences: ${JSON.stringify(profileData.careerPreferences || {})}

CRITICAL REQUIREMENT - SCORE THRESHOLD:
- Recommend ALL possible and viable careers that have a compatibility score of MORE THAN 50% (51% to 100%).
- Evaluate all major tech, data, cloud, software, AI/ML, security, development, and system domains.
- Do NOT restrict yourself to only 3 to 5 roles. If 7, 8, 10, or 12 roles meet the criterion of matchScore > 50%, return ALL of them!
- Do NOT include any role with a matchScore of 50% or below. Every returned role must strictly have matchScore > 50.
- Sort the resulting array in descending order of matchScore.

CRITICAL SAFETY & ACCURACY RULES:
- The match score is an AI-generated compatibility estimate based on skill overlap and interest alignment, not a guarantee of employment.
- Realistically evaluate which skills from the user's profile match the role, and which critical skills are missing or need development.
- Do NOT invent fake URLs or certifications. Provide legitimate, recognized certification titles (e.g., AWS Certified Cloud Practitioner, Google Cloud Professional Data Engineer, Meta Front-End Developer) and reputable platforms (Coursera, edX, AWS, Google, freeCodeCamp).

Return a JSON array containing objects with this exact structure:
[
  {
    "id": "slug-role-name",
    "jobTitle": "Data Engineer",
    "category": "Data", // One of: "Technology", "Data", "AI/ML", "Cloud", "Security", "Development", "Business", "Design"
    "matchScore": 87, // number strictly greater than 50 (51-100)
    "shortDescription": "Designs, builds, and maintains data pipelines, data warehouses, and scalable ingestion architectures.",
    "explanation": "You have strong SQL and Python skills and an interest in data systems.",
    "matchingSkills": ["Python", "SQL", "Data Analysis"],
    "missingSkills": ["Apache Spark", "ETL", "Data Warehousing", "Cloud Platforms"],
    "typicalResponsibilities": [
      "Design and maintain scalable data pipelines and ETL processes",
      "Optimize SQL database queries and schema architectures",
      "Integrate distributed compute engines with cloud object stores"
    ],
    "recommendedNextSteps": [
      "Learn PySpark fundamentals and DataFrame transformations",
      "Build an end-to-end data pipeline project with PostgreSQL and Airflow"
    ],
    "relevantCertifications": [
      {
        "name": "Google Cloud Professional Data Engineer",
        "provider": "Google Cloud",
        "difficulty": "Intermediate",
        "duration": "2-3 months"
      }
    ],
    "careerPath": "Junior Data Analyst → Associate Data Engineer → Senior Data Engineer → Lead Data Architect",
    "salaryRange": "$85,000 - $130,000",
    "industryDemand": "Very High"
  }
]
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('No GEMINI_API_KEY set');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        systemInstruction: 'You are an expert career counselor and data-driven talent strategist. Return strictly valid JSON array of all roles with matchScore > 50 in descending order.',
      },
    });

    const text = response.text || '[]';
    const parsedRecommendations = JSON.parse(text);

    // Enforce matchScore > 50 rule and descending sort
    const recommendations = (Array.isArray(parsedRecommendations) ? parsedRecommendations : [])
      .filter((r: any) => typeof r.matchScore === 'number' && r.matchScore > 50)
      .sort((a: any, b: any) => b.matchScore - a.matchScore);

    if (user) {
      user.recommendations = recommendations;
      if (!user.targetRole && recommendations.length > 0) {
        user.targetRole = recommendations[0].jobTitle;
      }
      saveDb(db);
    }

    return res.json({ recommendations });
  } catch (err: any) {
    console.error('Gemini career recommendation failed or fallback used:', err?.message);
    // Return high quality curated fallback if API key is not yet set or rate limited
    const fallbackRecommendations = getCuratedRecommendations(profileData)
      .filter((r) => r.matchScore > 50)
      .sort((a, b) => b.matchScore - a.matchScore);

    if (user) {
      user.recommendations = fallbackRecommendations;
      if (!user.targetRole && fallbackRecommendations.length > 0) {
        user.targetRole = fallbackRecommendations[0].jobTitle;
      }
      saveDb(db);
    }
    return res.json({ recommendations: fallbackRecommendations, fallback: true });
  }
});

// ----------------------------------------------------
// AI SKILL GAP ANALYZER & LEARNING ROADMAP
// ----------------------------------------------------

app.post('/api/ai/skill-gap', async (req, res) => {
  const user = getAuthUser(req);
  const targetRole = req.body.targetRole || (user ? user.targetRole : 'Data Engineer') || 'Full-Stack Developer';
  const userSkills = req.body.userSkills || (user ? user.skills : ['Python', 'SQL', 'React', 'JavaScript']) || [];
  const experienceLevel = req.body.experienceLevel || (user ? user.experienceLevel : 'Fresher') || 'Fresher';

  const prompt = `
You are the Skill Gap Analyzer and Roadmap Architect for Career Compass.
Analyze the skill gap between:
Target Job Role: "${targetRole}"
User's Current Skills: ${userSkills.join(', ') || 'No skills provided'}
User Experience Level: "${experienceLevel}"

Perform a realistic, rigorous evaluation of what is required for this role in industry today.
Identify:
1. Already Strong skills (skills the user has that strongly match the role)
2. Needs Improvement skills (skills the user has or partially knows that need deeper enterprise mastery)
3. Missing skills (essential skills required for the role that the user currently lacks)
4. Overall Skill Readiness score (percentage 0-100, labeled as an AI-generated compatibility estimate)
5. Structured 5-Phase Learning Roadmap:
   - Phase 1: Foundations
   - Phase 2: Intermediate Skills
   - Phase 3: Advanced Skills
   - Phase 4: Practical Projects (with concrete project concepts)
   - Phase 5: Interview Preparation

Return JSON matching this exact structure:
{
  "targetRole": "${targetRole}",
  "readinessScore": 68,
  "summary": "You have solid fundamentals in Python and SQL, but need practical cloud ETL and distributed streaming experience to be job-ready.",
  "skillsComparison": [
    {
      "name": "Python",
      "requiredProficiency": "Advanced",
      "userProficiency": "Intermediate",
      "status": "Already Strong", // "Already Strong" | "Needs Improvement" | "Missing"
      "matchPercentage": 85,
      "importance": "Required" // "Required" | "Important" | "Nice to have"
    },
    {
      "name": "SQL & Relational Modeling",
      "requiredProficiency": "Advanced",
      "userProficiency": "Advanced",
      "status": "Already Strong",
      "matchPercentage": 90,
      "importance": "Required"
    },
    {
      "name": "Apache Spark & PySpark",
      "requiredProficiency": "Intermediate",
      "userProficiency": "Beginner / None",
      "status": "Missing",
      "matchPercentage": 25,
      "importance": "Required"
    },
    {
      "name": "Cloud Data Warehouses (Snowflake / BigQuery)",
      "requiredProficiency": "Intermediate",
      "userProficiency": "None",
      "status": "Missing",
      "matchPercentage": 15,
      "importance": "Important"
    },
    {
      "name": "Data Orchestration (Airflow / Prefect)",
      "requiredProficiency": "Intermediate",
      "userProficiency": "None",
      "status": "Missing",
      "matchPercentage": 10,
      "importance": "Important"
    },
    {
      "name": "Git & CI/CD Pipelines",
      "requiredProficiency": "Intermediate",
      "userProficiency": "Intermediate",
      "status": "Needs Improvement",
      "matchPercentage": 65,
      "importance": "Important"
    }
  ],
  "roadmap": [
    {
      "phase": "Phase 1: Foundations",
      "duration": "Weeks 1-3",
      "objective": "Solidify core programming and database paradigms",
      "items": [
        {
          "id": "p1-1",
          "title": "Advanced SQL & Query Optimization",
          "description": "Master window functions, CTEs, partition keys, and query execution plans.",
          "priority": "High",
          "topics": ["Window functions (ROW_NUMBER, RANK, DENSE_RANK)", "CTEs and recursive queries", "Indexing strategies", "EXPLAIN ANALYZE"],
          "recommendedResource": "PostgreSQL Official Docs & Mode Analytics SQL Guide"
        },
        {
          "id": "p1-2",
          "title": "Production Python for Data",
          "description": "Generators, concurrency, typing, and memory-efficient data processing.",
          "priority": "High",
          "topics": ["Type hinting & Pydantic", "Multiprocessing & AsyncIO", "Itertools and Generators"],
          "recommendedResource": "Fluent Python & RealPython"
        }
      ]
    },
    {
      "phase": "Phase 2: Intermediate Skills",
      "duration": "Weeks 4-7",
      "objective": "Bridge data engineering pipelines and distributed processing",
      "items": [
        {
          "id": "p2-1",
          "title": "Distributed Computing with Apache Spark",
          "description": "Understand RDDs, DataFrames, Spark SQL, and lazy evaluation semantics.",
          "priority": "High",
          "topics": ["Spark Architecture (Driver & Executors)", "PySpark DataFrames & Catalyst Optimizer", "Shuffling and Partitioning strategies"],
          "recommendedResource": "Learning Spark (O'Reilly) & PySpark Documentation"
        },
        {
          "id": "p2-2",
          "title": "Data Warehousing & Columnar Storage",
          "description": "Learn star schemas, snowflake schemas, dimensional modeling, and Parquet formatting.",
          "priority": "Medium",
          "topics": ["Kimball Dimensional Modeling", "Slowly Changing Dimensions (SCD)", "Columnar file formats (Parquet, ORC)"],
          "recommendedResource": "The Data Warehouse Toolkit by Ralph Kimball"
        }
      ]
    },
    {
      "phase": "Phase 3: Advanced Skills",
      "duration": "Weeks 8-10",
      "objective": "Implement cloud infrastructure and orchestration workflows",
      "items": [
        {
          "id": "p3-1",
          "title": "Workflow Orchestration with Apache Airflow",
          "description": "Author Directed Acyclic Graphs (DAGs), manage task dependencies, sensors, and backfills.",
          "priority": "High",
          "topics": ["DAG design principles", "Operators, Hooks, and Providers", "Airflow Variables, Connections, and XComs"],
          "recommendedResource": "Astronomer Airflow Guides"
        },
        {
          "id": "p3-2",
          "title": "Cloud Platform Data Engineering (GCP / AWS)",
          "description": "Build pipelines leveraging cloud object storage and serverless data warehousing.",
          "priority": "High",
          "topics": ["GCS / AWS S3 data lakes", "Google BigQuery / Snowflake / AWS Redshift", "IAM roles and data encryption"],
          "recommendedResource": "Cloud Provider Architecture Centers"
        }
      ]
    },
    {
      "phase": "Phase 4: Capstone Projects",
      "duration": "Weeks 11-13",
      "objective": "Build portfolio-grade end-to-end data systems that impress recruiters",
      "items": [
        {
          "id": "p4-1",
          "title": "End-to-End Real-Time or Batch Ingestion Pipeline",
          "description": "Extract streaming or batch web data, process with Spark, load into BigQuery/Postgres, and orchestrate via Airflow with Docker.",
          "priority": "High",
          "topics": ["Docker compose environment", "Data quality validation with Great Expectations", "GitHub repo with CI/CD"],
          "recommendedResource": "Open-source GitHub Portfolio Templates"
        }
      ]
    },
    {
      "phase": "Phase 5: Interview Preparation",
      "duration": "Weeks 14-15",
      "objective": "Master system design for data and technical whiteboard challenges",
      "items": [
        {
          "id": "p5-1",
          "title": "Data System Design & SQL LeetCode Mastery",
          "description": "Practice dimensional schema design, idempotency patterns, and hard SQL scenarios.",
          "priority": "High",
          "topics": ["Data system scalability & partitioning tradeoffs", "LeetCode Hard SQL challenges", "Behavioral STAR method storytelling"],
          "recommendedResource": "Designing Data-Intensive Applications by Martin Kleppmann"
        }
      ]
    }
  ]
}
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('No GEMINI_API_KEY set');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const skillGapData = JSON.parse(response.text || '{}');
    if (user) {
      user.skillGap = skillGapData;
      saveDb(db);
    }
    return res.json(skillGapData);
  } catch (err: any) {
    console.error('Skill gap analysis fallback:', err?.message);
    const fallbackGap = getCuratedSkillGap(targetRole, userSkills);
    if (user) {
      user.skillGap = fallbackGap;
      saveDb(db);
    }
    return res.json(fallbackGap);
  }
});

// ----------------------------------------------------
// AI RESUME ANALYZER & ATS SCORE
// ----------------------------------------------------

app.post('/api/ai/analyze-resume', async (req, res) => {
  const user = getAuthUser(req);
  const { resumeText, fileBase64, mimeType, targetRole = user?.targetRole || 'Software Engineer' } = req.body;

  if (!resumeText && !fileBase64) {
    return res.status(400).json({ error: 'Please upload a resume file or paste resume text.' });
  }

  const promptText = `
You are the ATS Resume Evaluator and Senior Technical Recruiter at Career Compass.
Analyze the uploaded resume for the target job role: "${targetRole}".

IMPORTANT SAFETY & ACCURACY RULES:
- Clearly evaluate the resume's match against the specific demands of "${targetRole}".
- The ATS score is an AI-generated compatibility estimate (0-100) based on keyword matching, standard section layout, quantifiable achievements, and technical relevance. It is NOT an official score from Workday, Greenhouse, or any vendor.
- Extract actual detected technical skills, soft skills, education, and experience details.
- Provide actionable, high-impact before-and-after bullet point rewrites showing how weak bullets can be transformed into metric-driven XYZ statements (Accomplished [X] as measured by [Y], by doing [Z]).
- Perform a Resume Skill Gap analysis: Which target skills are missing from the resume, and where can the candidate demonstrate them?

Return JSON matching this exact structure:
{
  "atsScore": 76, // 0-100 integer
  "overallScore": 78,
  "targetRole": "${targetRole}",
  "summary": "Strong technical foundation in core programming and academic projects, but lacks quantifiable business impact metrics and cloud deployment keywords.",
  "strengths": [
    "Clear separation of technical skills and education",
    "Good use of modern frameworks like React and Node.js",
    "Consistent chronological work/internship history"
  ],
  "weaknesses": [
    "Most project bullet points lack measurable metrics or business outcomes (% improvement, user count, latency reduction)",
    "Missing key industry cloud and DevOps keywords (Docker, CI/CD, AWS/GCP)",
    "Action verbs in experience section are repetitive (e.g., 'Worked on', 'Helped with')"
  ],
  "keywordAnalysis": {
    "existing": ["Python", "SQL", "JavaScript", "React", "Git", "REST APIs", "PostgreSQL"],
    "missing": ["Docker", "Kubernetes", "CI/CD", "Unit Testing", "Cloud Architecture", "Agile/Scrum"],
    "repeated": ["developed", "worked", "created"]
  },
  "detectedSkills": [
    "Python", "SQL", "JavaScript", "React", "Node.js", "Git", "PostgreSQL", "HTML5/CSS3", "Agile"
  ],
  "experienceAnalysis": {
    "level": "Fresher to Early Career",
    "rating": "Moderate",
    "notes": "Demonstrates good hands-on internship and academic project initiative. Needs to frame project work with technical ownership rather than passive participation."
  },
  "educationAnalysis": {
    "degree": "Detected Computer Science or technical degree",
    "rating": "Strong",
    "notes": "Education credentials align well with target tech roles."
  },
  "projectAnalysis": {
    "rating": "Good",
    "feedback": "Projects demonstrate fundamental web and programming concepts. To stand out, deploy them publicly with live URLs and GitHub README documentation."
  },
  "formattingCheck": {
    "overall": "Pass",
    "readabilityScore": 88,
    "issues": [
      "Ensure margins are standard 0.5 to 0.75 inches for ATS parsers",
      "Avoid multi-column tables or text boxes which confuse legacy ATS parsers",
      "Ensure contact links (LinkedIn, GitHub) are plain text URLs"
    ]
  },
  "resumeSkillGaps": {
    "skillsToAdd": ["Docker containerization", "CI/CD pipeline configuration", "Cloud deployment (AWS/GCP)", "Automated testing (Jest/PyTest)"],
    "skillsToStrengthen": ["SQL database indexing & performance tuning", "Production error monitoring"],
    "actionableRecommendations": [
      "Add a 'DevOps & Tooling' subsection under your Skills block with Docker and GitHub Actions",
      "In your main portfolio project, add a bullet describing automated test coverage and containerized deployment"
    ]
  },
  "improvementSuggestions": [
    {
      "original": "Worked on a chatbot project using Python and NLP.",
      "improved": "Architected an end-to-end NLP conversational assistant in Python utilizing transformer embeddings, decreasing query response latency by 35% across 500+ test interactions.",
      "reason": "Replaced weak passive verb 'worked on' with active verb 'Architected', quantified the outcome, and highlighted specific technical stack."
    },
    {
      "original": "Responsible for creating database schemas and writing queries.",
      "improved": "Designed normalized relational schemas in PostgreSQL and indexed key query paths, reducing API response times by 40% under concurrent simulated load.",
      "reason": "Eliminated 'Responsible for' and demonstrated optimization, schema design, and measurable speedup."
    },
    {
      "original": "Built frontend user interface using React and CSS.",
      "improved": "Engineered responsive frontend SPA with React and Tailwind CSS, implementing client-side caching to achieve sub-second page transitions and WCAG AA accessibility compliance.",
      "reason": "Specified responsive UI engineering, caching performance, and accessibility standards."
    }
  ]
}
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('No GEMINI_API_KEY set');
    }

    let contentsPayload: any;

    if (fileBase64 && mimeType === 'application/pdf') {
      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: fileBase64,
            },
          },
          { text: promptText },
        ],
      };
    } else {
      const textToAnalyze = resumeText || 'Technical Resume for college graduate with computer science background.';
      contentsPayload = promptText + '\n\nRESUME TEXT CONTENT:\n' + textToAnalyze;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const analysis = JSON.parse(response.text || '{}');
    if (user) {
      user.resumeAnalysis = analysis;
      saveDb(db);
    }
    return res.json(analysis);
  } catch (err: any) {
    console.error('Resume analyzer fallback:', err?.message);
    const fallbackAnalysis = getCuratedResumeAnalysis(targetRole, resumeText);
    if (user) {
      user.resumeAnalysis = fallbackAnalysis;
      saveDb(db);
    }
    return res.json(fallbackAnalysis);
  }
});

// ----------------------------------------------------
// AI CAREER ASSISTANT (CONVERSATIONAL)
// ----------------------------------------------------

app.post('/api/ai/assistant', async (req, res) => {
  const user = getAuthUser(req);
  const { messages, userContext } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const latestMessage = messages[messages.length - 1].content;

  const profileSummary = `
User Context:
Name: ${user?.name || userContext?.name || 'User'}
Education: ${user?.education || userContext?.education || 'Undergraduate'} in ${user?.degree || userContext?.degree || 'Computer Science'}
Experience Level: ${user?.experienceLevel || userContext?.experienceLevel || 'Fresher'}
Skills: ${(user?.skills || userContext?.skills || []).join(', ')}
Interests: ${(user?.interests || userContext?.interests || []).join(', ')}
Current Target Role: ${user?.targetRole || userContext?.targetRole || 'Software Engineer'}
Skill Readiness Score: ${user?.skillGap?.readinessScore || userContext?.readinessScore || '68%'}
Latest Resume ATS Score: ${user?.resumeAnalysis?.atsScore || userContext?.atsScore || '76/100'}
Missing Skills for Target Role: ${(user?.skillGap?.skillsComparison || [])
    .filter((s: any) => s.status === 'Missing')
    .map((s: any) => s.name)
    .join(', ') || 'Cloud platforms, distributed streaming, Docker'}
`;

  const systemInstruction = `
You are the AI Career Assistant inside Career Compass.
Your job is to provide hyper-personalized, encouraging, highly pragmatic career mentoring.
You have direct visibility into the user's career profile, target role, skill gap analysis, and resume evaluation.

GUIDELINES:
1. Always ground your guidance in the user's actual stored profile and target role.
2. If they ask "What should I learn next?", cite their specific missing skills from their skill gap analysis.
3. If they ask about their resume, reference their ATS score and strengths/weaknesses.
4. Keep answers crisp, formatted with clear bullet points, bold key terms, and realistic action items.
5. Do not make false promises about guaranteed employment.
6. Speak in an authentic, professional, supportive tone like an experienced engineering director or senior mentor.
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('No GEMINI_API_KEY set');
    }

    // Build chat conversation
    const historyText = messages
      .slice(-6)
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const fullPrompt = `${profileSummary}\n\nChat History:\n${historyText}\n\nRespond to the user's latest query directly as the Assistant.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm here to help navigate your career! What specific area would you like to explore today?";
    return res.json({ reply });
  } catch (err: any) {
    console.error('AI assistant fallback:', err?.message);
    const reply = generateAssistantFallback(latestMessage, user);
    return res.json({ reply });
  }
});

// ----------------------------------------------------
// LEARNING RESOURCES & SAMPLE DATA
// ----------------------------------------------------

app.get('/api/learning-resources', (req, res) => {
  const skill = (req.query.skill as string) || '';
  const resources = getCuratedLearningResources(skill);
  return res.json({ resources });
});

app.get('/api/sample-resumes', (req, res) => {
  return res.json({
    techFresher: `Alex Morgan
alex.morgan@email.com | (555) 234-5678 | San Francisco, CA
LinkedIn: linkedin.com/in/alexmorgan-dev | GitHub: github.com/alexmorgan

EDUCATION
Bachelor of Science in Computer Science & Engineering
State University, 2021 – 2025
GPA: 3.82 / 4.0

TECHNICAL SKILLS
Languages: Python, SQL, JavaScript, TypeScript, HTML/CSS
Frameworks & Libraries: React, Node.js, Express, Tailwind CSS, Pandas, NumPy
Databases & Tools: PostgreSQL, SQLite, Git, GitHub, RESTful APIs, Linux

PROJECTS
Smart Analytics Dashboard (React, Node.js, PostgreSQL)
• Built a full-stack dashboard for visualizing student performance metrics and cohort attendance.
• Created PostgreSQL queries with joins and aggregations to query over 50,000 data rows.
• Implemented interactive charts using Recharts with filtering and responsive UI.

NLP Customer Sentiment Analyzer (Python, Pandas, Scikit-Learn)
• Developed a text sentiment classification pipeline evaluating 10,000+ customer reviews.
• Used TF-IDF vectorization and Logistic Regression achieving 86% accuracy.
• Cleaned and preprocessed unstructured text data using Python regex and NLTK.

Campus Event Portal (React, Firebase)
• Designed frontend user interface for college club event discovery and registration.
• Integrated authentication and real-time database listeners for live attendee updates.

EXPERIENCE
Software Engineering Intern | NextGen Cloud Labs (June 2024 – August 2024)
• Assisted backend development team with REST API endpoint maintenance in Node.js.
• Wrote unit tests and documented internal developer onboarding guides.
• Participated in weekly agile sprints, daily standups, and pull request code reviews.
`,
    dataAnalyst: `Jordan Lee
jordan.lee@example.com | Dallas, TX | linkedin.com/in/jordanlee-data

SUMMARY
Detail-oriented Data Analyst with 1 year of experience in SQL querying, Python scripting, and executive KPI dashboard development.

SKILLS
SQL, Python, Tableau, Power BI, Excel (Advanced, Pivot Tables, VBA), Statistical Modeling, ETL Concepts

EXPERIENCE
Junior Data Analyst | Apex Retail Solutions (2024 – Present)
• Built automated sales tracking dashboards in Power BI used by 20+ regional store managers.
• Extracted and sanitized weekly customer transactional data from Snowflake database.
• Identified inventory discrepancy patterns leading to $18,000 quarterly savings.
`,
  });
});

// Fallback generator functions for instant resilience
function getCuratedRecommendations(profile: any) {
  const userSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
  const userInterests = (profile.interests || []).map((i: string) => i.toLowerCase());

  const library = [
    {
      id: 'data-engineer',
      jobTitle: 'Data Engineer',
      category: 'Data',
      skillsNeeded: ['python', 'sql', 'data analysis', 'postgresql', 'mongodb', 'docker', 'rest apis'],
      interestsNeeded: ['data engineering', 'data science', 'software development', 'cloud computing'],
      baseScore: 58,
      shortDescription: 'Builds scalable data ingestion pipelines, warehouse architectures, and distributed transformation workflows.',
      explanation: 'Matches your data handling and scripting foundations with high enterprise demand for scalable analytical storage.',
      matchingSkillsSample: ['Python', 'SQL', 'Data Analysis'],
      missingSkills: ['Apache Spark', 'ETL Pipelines', 'Airflow', 'Cloud Data Warehouses'],
      typicalResponsibilities: [
        'Design and deploy robust batch and streaming ETL/ELT pipelines',
        'Model dimensional schemas and manage cloud data warehouse infrastructure',
        'Monitor pipeline reliability, data lineage, and query execution speeds',
      ],
      recommendedNextSteps: [
        'Complete hands-on PySpark transformation exercises',
        'Build a multi-source data ingestion pipeline with Docker and PostgreSQL',
      ],
      relevantCertifications: [
        { name: 'Google Cloud Professional Data Engineer', provider: 'Google Cloud', difficulty: 'Intermediate', duration: '2-3 months' },
        { name: 'IBM Data Engineering Professional Certificate', provider: 'Coursera', difficulty: 'Beginner to Intermediate', duration: '3 months' },
      ],
      careerPath: 'Junior Data Analyst → Data Engineer → Senior Data Engineer → Lead Data Architect',
      salaryRange: '$85,000 - $135,000',
      industryDemand: 'Very High',
    },
    {
      id: 'fullstack-developer',
      jobTitle: 'Full-Stack Software Engineer',
      category: 'Development',
      skillsNeeded: ['javascript', 'typescript', 'react', 'node.js', 'sql', 'rest apis', 'git'],
      interestsNeeded: ['software development', 'web development', 'ui/ux design', 'mobile app development'],
      baseScore: 56,
      shortDescription: 'Engineers responsive front-end user experiences and resilient server-side microservices.',
      explanation: 'Leverages your coding foundations and problem solving into modern web and service architectures.',
      matchingSkillsSample: ['JavaScript', 'React', 'REST APIs', 'SQL'],
      missingSkills: ['TypeScript', 'Docker', 'CI/CD Pipelines', 'System Design'],
      typicalResponsibilities: [
        'Develop accessible, modern client-side SPAs using React/TypeScript',
        'Implement resilient RESTful and GraphQL backend endpoints',
        'Collaborate across cross-functional teams in agile sprints',
      ],
      recommendedNextSteps: [
        'Migrate JavaScript projects to strict TypeScript',
        'Containerize web applications using multi-stage Dockerfiles',
      ],
      relevantCertifications: [
        { name: 'Meta Front-End Developer Professional Certificate', provider: 'Coursera', difficulty: 'Beginner', duration: '2 months' },
        { name: 'AWS Certified Developer - Associate', provider: 'Amazon Web Services', difficulty: 'Intermediate', duration: '3 months' },
      ],
      careerPath: 'Junior Web Developer → Full-Stack Engineer → Senior Software Engineer → Engineering Manager',
      salaryRange: '$80,000 - $130,000',
      industryDemand: 'High',
    },
    {
      id: 'ml-engineer',
      jobTitle: 'Machine Learning Engineer',
      category: 'AI/ML',
      skillsNeeded: ['python', 'machine learning', 'deep learning', 'nlp', 'data analysis', 'sql'],
      interestsNeeded: ['artificial intelligence', 'machine learning', 'data science', 'nlp'],
      baseScore: 54,
      shortDescription: 'Productionalizes AI models, builds inference microservices, and manages feature stores.',
      explanation: 'Aligns closely with algorithmic data processing and artificial intelligence domain interest.',
      matchingSkillsSample: ['Python', 'Data Analysis', 'Problem Solving'],
      missingSkills: ['PyTorch', 'Model Deployment (FastAPI/Triton)', 'MLOps & Experiment Tracking', 'Feature Engineering'],
      typicalResponsibilities: [
        'Train and fine-tune predictive and generative deep learning models',
        'Deploy low-latency model inference endpoints with Docker and FastAPI',
        'Establish automated evaluation benchmarks and drift detection',
      ],
      recommendedNextSteps: [
        'Train and deploy a fine-tuned Hugging Face transformer pipeline',
        'Implement automated model registry tracking with MLflow',
      ],
      relevantCertifications: [
        { name: 'DeepLearning.AI Machine Learning Specialization', provider: 'Coursera / DeepLearning.AI', difficulty: 'Intermediate', duration: '3 months' },
        { name: 'AWS Certified Machine Learning - Specialty', provider: 'AWS', difficulty: 'Advanced', duration: '4 months' },
      ],
      careerPath: 'ML Research Intern → Machine Learning Engineer → Senior MLOps Engineer → AI Solutions Director',
      salaryRange: '$95,000 - $150,000',
      industryDemand: 'Very High',
    },
    {
      id: 'data-scientist',
      jobTitle: 'Data Scientist',
      category: 'Data',
      skillsNeeded: ['python', 'sql', 'data analysis', 'machine learning', 'problem solving', 'communication'],
      interestsNeeded: ['data science', 'artificial intelligence', 'machine learning', 'product management'],
      baseScore: 55,
      shortDescription: 'Transforms unstructured data into predictive insights, business models, and statistical intelligence.',
      explanation: 'Synthesizes analytical rigor, structured SQL querying, and business impact modeling.',
      matchingSkillsSample: ['Python', 'SQL', 'Data Analysis'],
      missingSkills: ['Applied Statistics & Hypothesis Testing', 'Machine Learning Algorithms', 'Tableau / Power BI', 'A/B Testing'],
      typicalResponsibilities: [
        'Formulate business hypotheses and test via experimental A/B trials',
        'Extract signals from massive relational data stores with advanced SQL',
        'Communicate executive findings through visual storytelling dashboards',
      ],
      recommendedNextSteps: [
        'Study probability distributions and statistical power calculations',
        'Publish an exploratory data analysis (EDA) notebook on Kaggle',
      ],
      relevantCertifications: [
        { name: 'Google Advanced Data Analytics Professional Certificate', provider: 'Coursera', difficulty: 'Intermediate', duration: '3 months' },
      ],
      careerPath: 'Junior Data Analyst → Data Scientist → Senior Lead Scientist → Chief Data Officer',
      salaryRange: '$88,000 - $138,000',
      industryDemand: 'High',
    },
    {
      id: 'cloud-devops-engineer',
      jobTitle: 'Cloud & DevOps Engineer',
      category: 'Cloud',
      skillsNeeded: ['docker', 'aws', 'python', 'git', 'rest apis', 'problem solving'],
      interestsNeeded: ['cloud computing', 'devops', 'software development', 'cybersecurity'],
      baseScore: 53,
      shortDescription: 'Automates infrastructure delivery, oversees cloud container clusters, and guarantees service reliability.',
      explanation: 'Capitalizes on system scripting and operational reliability for modern cloud deployments.',
      matchingSkillsSample: ['Git', 'Python', 'Problem Solving'],
      missingSkills: ['Terraform (IaC)', 'Kubernetes', 'AWS/GCP Cloud Architecture', 'CI/CD Pipelines'],
      typicalResponsibilities: [
        'Provision cloud infrastructure with Infrastructure-as-Code (Terraform)',
        'Maintain automated continuous integration and deployment (CI/CD) pipelines',
        'Optimize cluster utilization and implement observability metrics',
      ],
      recommendedNextSteps: [
        'Containerize a multi-service app with Docker and Docker Compose',
        'Deploy infrastructure using Terraform on AWS or Google Cloud',
      ],
      relevantCertifications: [
        { name: 'AWS Certified Solutions Architect - Associate', provider: 'AWS', difficulty: 'Intermediate', duration: '2-3 months' },
        { name: 'Certified Kubernetes Administrator (CKA)', provider: 'Linux Foundation', difficulty: 'Advanced', duration: '3-4 months' },
      ],
      careerPath: 'Cloud Support Associate → DevOps Engineer → Senior Platform Engineer → Cloud Architect',
      salaryRange: '$90,000 - $140,000',
      industryDemand: 'High',
    },
    {
      id: 'backend-engineer',
      jobTitle: 'Backend Software Engineer',
      category: 'Development',
      skillsNeeded: ['java', 'python', 'node.js', 'sql', 'postgresql', 'rest apis', 'c++'],
      interestsNeeded: ['software development', 'cloud computing', 'data engineering'],
      baseScore: 56,
      shortDescription: 'Designs resilient application logic, relational schemas, high-throughput caching, and API endpoints.',
      explanation: 'Direct application of programming fundamentals, database design, and server-side data contracts.',
      matchingSkillsSample: ['SQL', 'Python', 'REST APIs'],
      missingSkills: ['Microservice Architecture', 'Redis Caching', 'Database Sharding & Replication', 'gRPC'],
      typicalResponsibilities: [
        'Build performant backend services with clean architecture and automated test coverage',
        'Scale database query execution plans and optimize relational indexes',
        'Safeguard enterprise API endpoints with OAuth2 and rate limiting',
      ],
      recommendedNextSteps: [
        'Build a production-grade REST API with token authentication and rate limiting',
        'Design an asynchronous worker queue utilizing Redis and message brokers',
      ],
      relevantCertifications: [
        { name: 'Meta Back-End Developer Professional Certificate', provider: 'Coursera', difficulty: 'Intermediate', duration: '3 months' },
      ],
      careerPath: 'Junior Backend Developer → Backend Engineer → Staff Software Engineer → System Architect',
      salaryRange: '$85,000 - $132,000',
      industryDemand: 'High',
    },
    {
      id: 'frontend-developer',
      jobTitle: 'Frontend Web Specialist',
      category: 'Development',
      skillsNeeded: ['javascript', 'typescript', 'react', 'ui/ux design', 'git', 'communication'],
      interestsNeeded: ['web development', 'ui/ux design', 'software development'],
      baseScore: 54,
      shortDescription: 'Creates accessible, animated, and lightning-fast client interfaces with modern reactive component frameworks.',
      explanation: 'Focuses on user interaction fidelity, browser rendering performance, and component hierarchy.',
      matchingSkillsSample: ['JavaScript', 'React', 'Problem Solving'],
      missingSkills: ['Next.js App Router', 'Tailwind CSS Mastery', 'State Management (Zustand/Redux)', 'Web Accessibility (WCAG)'],
      typicalResponsibilities: [
        'Build pixel-perfect UI screens and responsive stateful design systems',
        'Optimize Core Web Vitals, initial page loads, and asset bundling',
        'Ensure WCAG AA accessibility compliance across all viewport sizes',
      ],
      recommendedNextSteps: [
        'Build a design system component library in TypeScript and Storybook',
        'Implement SSR and client caching using Next.js or Vite React',
      ],
      relevantCertifications: [
        { name: 'Meta Front-End Developer Certificate', provider: 'Coursera', difficulty: 'Beginner', duration: '2 months' },
      ],
      careerPath: 'Junior UI Developer → Frontend Engineer → Senior Frontend Specialist → UI Architect',
      salaryRange: '$78,000 - $125,000',
      industryDemand: 'Moderate to High',
    },
    {
      id: 'cybersecurity-analyst',
      jobTitle: 'Cybersecurity Analyst',
      category: 'Security',
      skillsNeeded: ['python', 'git', 'problem solving', 'communication'],
      interestsNeeded: ['cybersecurity', 'cloud computing', 'software development'],
      baseScore: 52,
      shortDescription: 'Monitors corporate threat surfaces, investigates vulnerabilities, and secures operational cloud networks.',
      explanation: 'Critical defensive tech role safeguarding enterprise data pipelines and infrastructure.',
      matchingSkillsSample: ['Problem Solving', 'Python Scripting'],
      missingSkills: ['Network Security & Protocols', 'SIEM & SOC Tools', 'Vulnerability Assessment', 'Incident Response'],
      typicalResponsibilities: [
        'Monitor security events across cloud endpoints and firewalls',
        'Perform static and dynamic application vulnerability reviews',
        'Enforce least-privilege role-based access controls (RBAC)',
      ],
      recommendedNextSteps: [
        'Obtain hands-on capture-the-flag (CTF) experience on TryHackMe',
        'Learn network traffic analysis with Wireshark and Zeek',
      ],
      relevantCertifications: [
        { name: 'CompTIA Security+', provider: 'CompTIA', difficulty: 'Beginner to Intermediate', duration: '2 months' },
        { name: 'Google Cybersecurity Professional Certificate', provider: 'Coursera', difficulty: 'Beginner', duration: '3 months' },
      ],
      careerPath: 'SOC Analyst L1 → Security Analyst L2 → Incident Responder → Information Security Officer',
      salaryRange: '$82,000 - $128,000',
      industryDemand: 'Very High',
    },
    {
      id: 'database-administrator',
      jobTitle: 'Database Administrator & Architect',
      category: 'Data',
      skillsNeeded: ['sql', 'postgresql', 'mongodb', 'python', 'docker', 'problem solving'],
      interestsNeeded: ['data engineering', 'data science', 'cloud computing'],
      baseScore: 53,
      shortDescription: 'Guarantees continuous uptime, replication, automated backups, and sub-millisecond query performance for transactional databases.',
      explanation: 'Directly utilizes relational data expertise and high interest in database internals.',
      matchingSkillsSample: ['SQL', 'PostgreSQL', 'Problem Solving'],
      missingSkills: ['High Availability Clustering', 'Database Sharding', 'Disaster Recovery Protocols', 'Performance Tuning'],
      typicalResponsibilities: [
        'Manage PostgreSQL/MySQL failover clusters and disaster recovery testing',
        'Analyze slow query logs and optimize indexing strategies',
        'Configure transparent data encryption and user security auditing',
      ],
      recommendedNextSteps: [
        'Set up physical and logical replication across two PostgreSQL instances',
        'Practice database stress benchmarking using pgbench',
      ],
      relevantCertifications: [
        { name: 'PostgreSQL Certified Associate', provider: 'EnterpriseDB', difficulty: 'Intermediate', duration: '2 months' },
      ],
      careerPath: 'Junior DBA → Database Administrator → Senior Database Architect → VP of Data Infrastructure',
      salaryRange: '$84,000 - $130,000',
      industryDemand: 'High',
    },
    {
      id: 'ai-product-analyst',
      jobTitle: 'AI Solutions & Product Analyst',
      category: 'Business',
      skillsNeeded: ['data analysis', 'communication', 'problem solving', 'leadership', 'python'],
      interestsNeeded: ['product management', 'artificial intelligence', 'machine learning', 'data science'],
      baseScore: 54,
      shortDescription: 'Bridges technical engineering teams with business stakeholders to define AI features and track product KPIs.',
      explanation: 'Blends technical literacy in AI concepts with strong analytical and communication skills.',
      matchingSkillsSample: ['Data Analysis', 'Communication', 'Problem Solving'],
      missingSkills: ['Product Discovery & User Journey Mapping', 'A/B Experimentation', 'AI Model Evaluation Metrics', 'Roadmapping'],
      typicalResponsibilities: [
        'Translate enterprise customer needs into technical product user stories',
        'Define key performance indicators (KPIs) and conversion funnels',
        'Facilitate agile sprint planning with engineering and design teams',
      ],
      recommendedNextSteps: [
        'Draft an end-to-end product requirements document (PRD) for an AI application',
        'Analyze product analytics telemetry using SQL and Mixpanel',
      ],
      relevantCertifications: [
        { name: 'Google Project Management Professional Certificate', provider: 'Coursera', difficulty: 'Beginner', duration: '3 months' },
      ],
      careerPath: 'Associate Product Analyst → Technical Product Manager → Senior PM → Head of Product',
      salaryRange: '$85,000 - $135,000',
      industryDemand: 'High',
    },
  ];

  // Calculate dynamic match score for each role
  return library
    .map((role) => {
      let score = role.baseScore;

      // Add points for matching skills
      const matched = role.skillsNeeded.filter((sn) => userSkills.includes(sn));
      score += matched.length * 7;

      // Add points for matching interests
      const matchedInterests = role.interestsNeeded.filter((inName) => userInterests.includes(inName));
      score += matchedInterests.length * 6;

      // Bound between 51 and 96
      const finalScore = Math.min(Math.max(score, 51), 96);

      // Filter matched skills from user
      const realMatchingSkills = (profile.skills || []).filter((s: string) =>
        role.skillsNeeded.includes(s.toLowerCase())
      );
      const displayMatching = realMatchingSkills.length > 0 ? realMatchingSkills : role.matchingSkillsSample;

      return {
        id: role.id,
        jobTitle: role.jobTitle,
        category: role.category as any,
        matchScore: finalScore,
        shortDescription: role.shortDescription,
        explanation: role.explanation,
        matchingSkills: displayMatching,
        missingSkills: role.missingSkills,
        typicalResponsibilities: role.typicalResponsibilities,
        recommendedNextSteps: role.recommendedNextSteps,
        relevantCertifications: role.relevantCertifications,
        careerPath: role.careerPath,
        salaryRange: role.salaryRange,
        industryDemand: role.industryDemand,
      };
    })
    .filter((role) => role.matchScore > 50) // STRICTLY MORE THAN 50%
    .sort((a, b) => b.matchScore - a.matchScore);
}

function getCuratedSkillGap(targetRole: string, userSkills: string[]) {
  return {
    targetRole,
    readinessScore: 68,
    summary: `Based on an AI-generated estimate, you possess core fundamentals for ${targetRole}. Bridging critical cloud and system architecture skills will accelerate your hiring velocity.`,
    skillsComparison: [
      { name: 'Python', requiredProficiency: 'Advanced', userProficiency: 'Intermediate', status: 'Already Strong', matchPercentage: 85, importance: 'Required' },
      { name: 'SQL & Database Design', requiredProficiency: 'Advanced', userProficiency: 'Advanced', status: 'Already Strong', matchPercentage: 90, importance: 'Required' },
      { name: 'Distributed Processing (Spark)', requiredProficiency: 'Intermediate', userProficiency: 'Beginner / Missing', status: 'Missing', matchPercentage: 20, importance: 'Required' },
      { name: 'Cloud Services (AWS / GCP)', requiredProficiency: 'Intermediate', userProficiency: 'Basic', status: 'Needs Improvement', matchPercentage: 45, importance: 'Required' },
      { name: 'Pipeline Orchestration (Airflow)', requiredProficiency: 'Intermediate', userProficiency: 'None', status: 'Missing', matchPercentage: 15, importance: 'Important' },
      { name: 'Docker & Containerization', requiredProficiency: 'Intermediate', userProficiency: 'Basic', status: 'Needs Improvement', matchPercentage: 50, importance: 'Important' },
      { name: 'System Design & Scalability', requiredProficiency: 'Intermediate', userProficiency: 'Beginner', status: 'Needs Improvement', matchPercentage: 35, importance: 'Important' },
    ],
    roadmap: [
      {
        phase: 'Phase 1: Foundations',
        duration: 'Weeks 1-3',
        objective: 'Solidify foundational data modeling and advanced SQL techniques',
        items: [
          {
            id: 'p1-1',
            title: 'Complex SQL & Analytical Window Functions',
            description: 'Master partition-by analytics, sliding frames, recursive CTEs, and execution explain plans.',
            priority: 'High',
            topics: ['Window functions: ROW_NUMBER, RANK, LAG/LEAD', 'Recursive CTE queries', 'Indexing techniques (B-Tree, Hash, GIN)'],
            recommendedResource: 'PostgreSQL Official Documentation & Mode Analytics',
          },
          {
            id: 'p1-2',
            title: 'Idiomatic Production Python',
            description: 'Deep dive into memory management, generators, typing, and concurrent execution.',
            priority: 'High',
            topics: ['Generators & Itertools', 'Type hinting and Pydantic validation', 'AsyncIO and thread pools'],
            recommendedResource: 'Fluent Python (Luciano Ramalho)',
          },
        ],
      },
      {
        phase: 'Phase 2: Intermediate Skills',
        duration: 'Weeks 4-7',
        objective: 'Harness distributed processing frameworks and modern columnar storage',
        items: [
          {
            id: 'p2-1',
            title: 'Apache Spark & PySpark Foundations',
            description: 'Learn distributed RDD concepts, DataFrame transformations, and memory partition tuning.',
            priority: 'High',
            topics: ['Catalyst query optimizer & Tungsten engine', 'PySpark transformations & actions', 'Broadcast joins vs shuffle hash joins'],
            recommendedResource: 'Learning Spark 2nd Edition (O’Reilly)',
          },
          {
            id: 'p2-2',
            title: 'Dimensional Warehousing & Data Modeling',
            description: 'Implement star/snowflake schemas and columnar file formats (Parquet, Delta Lake).',
            priority: 'Medium',
            topics: ['Kimball Dimensional Modeling methodology', 'Slowly Changing Dimensions (SCD Type 1 & 2)', 'Columnar compression strategies'],
            recommendedResource: 'The Data Warehouse Toolkit by Ralph Kimball',
          },
        ],
      },
      {
        phase: 'Phase 3: Advanced Skills',
        duration: 'Weeks 8-10',
        objective: 'Automate pipeline orchestration and cloud infrastructure',
        items: [
          {
            id: 'p3-1',
            title: 'Workflow Orchestration with Apache Airflow',
            description: 'Author Python DAGs, configure task dependencies, retries, sensors, and SLAs.',
            priority: 'High',
            topics: ['DAG authoring best practices', 'Custom operators and task decorators', 'Managing secrets & connections'],
            recommendedResource: 'Astronomer Official Academy',
          },
          {
            id: 'p3-2',
            title: 'Cloud Data Storage & Warehousing (BigQuery/Snowflake)',
            description: 'Provision cloud resources, load data lakes, and execute cost-effective analytical queries.',
            priority: 'High',
            topics: ['Partitioned & clustered tables', 'IAM security & RBAC policies', 'Zero-copy cloning & time travel'],
            recommendedResource: 'Google Cloud Skills Boost & Snowflake University',
          },
        ],
      },
      {
        phase: 'Phase 4: Capstone Projects',
        duration: 'Weeks 11-13',
        objective: 'Construct an end-to-end production pipeline with reproducible code',
        items: [
          {
            id: 'p4-1',
            title: 'Automated Real-Time Batch Data Pipeline',
            description: 'Extract API events, process transformations with Spark, store in PostgreSQL, and orchestrate with Airflow in Docker.',
            priority: 'High',
            topics: ['Docker Compose multi-container setup', 'Data quality checks with Great Expectations', 'Documented GitHub repository with diagrams'],
            recommendedResource: 'Open-Source Data Engineering Zoomcamp',
          },
        ],
      },
      {
        phase: 'Phase 5: Interview Preparation',
        duration: 'Weeks 14-15',
        objective: 'Master technical system design and technical coding interviews',
        items: [
          {
            id: 'p5-1',
            title: 'Data Architecture System Design & Whiteboard Scenarios',
            description: 'Tackle distributed database trade-offs, idempotency, data consistency, and behavioral interviews.',
            priority: 'High',
            topics: ['CAP theorem & partition tolerance', 'Designing fault-tolerant streaming systems', 'STAR behavioral format for past projects'],
            recommendedResource: 'Designing Data-Intensive Applications by Martin Kleppmann',
          },
        ],
      },
    ],
  };
}

function getCuratedResumeAnalysis(targetRole: string, text?: string) {
  return {
    atsScore: 77,
    overallScore: 79,
    targetRole,
    summary: `Your resume demonstrates solid foundational technical competence for ${targetRole}, but needs stronger metric-driven accomplishment statements and explicit cloud/DevOps keywords.`,
    strengths: [
      'Clean, chronological structure that parses easily in ATS systems',
      'Strong technical section highlighting modern languages (Python, SQL, JavaScript)',
      'Good inclusion of hands-on project and academic credentials',
    ],
    weaknesses: [
      'Bullet points describe daily duties rather than business metrics or performance numbers',
      'Missing key industry keywords for this role (e.g., Docker, CI/CD, Cloud Architecture, Testing)',
      'Several repetitive action verbs (e.g. "Worked on", "Helped")',
    ],
    keywordAnalysis: {
      existing: ['Python', 'SQL', 'JavaScript', 'React', 'Git', 'REST APIs', 'PostgreSQL'],
      missing: ['Docker', 'CI/CD', 'Automated Testing', 'Cloud (AWS/GCP)', 'Agile/Scrum', 'Optimization'],
      repeated: ['worked', 'helped', 'developed'],
    },
    detectedSkills: ['Python', 'SQL', 'JavaScript', 'React', 'Node.js', 'Git', 'PostgreSQL', 'HTML/CSS'],
    experienceAnalysis: {
      level: 'Fresher to Early Career',
      rating: 'Moderate',
      notes: 'Good demonstration of practical internship/academic initiative. Needs to frame project ownership with quantitative metrics.',
    },
    educationAnalysis: {
      degree: 'Computer Science & Engineering',
      rating: 'Strong',
      notes: 'Directly aligns with technical recruiting criteria.',
    },
    projectAnalysis: {
      rating: 'Good',
      feedback: 'Projects showcase relevant skills. Highlight live demo URLs, Docker deployment, and unit test coverage to rank in the top 10% of applicants.',
    },
    formattingCheck: {
      overall: 'Pass',
      readabilityScore: 89,
      issues: [
        'Keep standard margins between 0.5 and 0.75 inches',
        'Avoid multi-column tables which confuse older applicant tracking parsers',
        'Include plain text links alongside hyperlinks',
      ],
    },
    resumeSkillGaps: {
      skillsToAdd: ['Docker containerization', 'CI/CD workflow automation', 'Cloud deployment (AWS or GCP)', 'Unit & integration testing'],
      skillsToStrengthen: ['SQL query indexing & performance tuning', 'Production error logging and monitoring'],
      actionableRecommendations: [
        'Add a "DevOps & Infrastructure" skill category containing Docker and GitHub Actions',
        'Revise your primary project bullet to highlight containerization and automated testing',
      ],
    },
    improvementSuggestions: [
      {
        original: 'Worked on a chatbot project using Python and NLP.',
        improved: 'Architected an NLP conversational assistant in Python utilizing transformer embeddings, decreasing query response latency by 35% across 500+ test interactions.',
        reason: 'Replaced weak verb "worked on" with "Architected", quantified user results, and highlighted exact technical stack.',
      },
      {
        original: 'Responsible for creating database schemas and writing queries.',
        improved: 'Designed normalized relational schemas in PostgreSQL and indexed high-frequency queries, cutting API latency by 40% under simulated peak loads.',
        reason: 'Eliminated passive phrasing and demonstrated optimization impact.',
      },
      {
        original: 'Built frontend user interface using React and CSS.',
        improved: 'Engineered responsive single-page application using React and Tailwind CSS, achieving 98+ Google Lighthouse performance and WCAG AA accessibility.',
        reason: 'Quantified performance with industry-standard benchmarks.',
      },
    ],
  };
}

function generateAssistantFallback(question: string, user: UserRecord | null) {
  const q = question.toLowerCase();
  const targetRole = user?.targetRole || 'Data Engineer';
  const skills = (user?.skills || []).join(', ') || 'Python, SQL, React';

  if (q.includes('learn next') || q.includes('skill') || q.includes('study')) {
    return `Based on your profile and target role of **${targetRole}**, here is your highest-leverage learning sequence:

1. **Distributed Processing (Apache Spark & PySpark)**: Since you already know Python & SQL, learning how to query big datasets across distributed clusters is the #1 skill gap that will unlock interviews.
2. **Containerization with Docker**: Containerizing your code ensures it runs anywhere. Learn to write Dockerfiles, build images, and run multi-service apps via Docker Compose.
3. **Workflow Orchestration (Airflow)**: Industry pipelines run on automated schedules. Build 1 DAG that extracts data, transforms it, and saves it to a database.

Would you like a step-by-step tutorial roadmap for any of these specific tools?`;
  }

  if (q.includes('resume') || q.includes('ats') || q.includes('improve')) {
    return `Looking at your resume analysis for **${targetRole}**:

- **Current ATS Estimate**: ${user?.resumeAnalysis?.atsScore || '77/100'}
- **Key Missing Keywords**: Docker, CI/CD, Automated Testing, Cloud Services (AWS/GCP).
- **Highest Impact Improvement**: Transform your project bullets using the **Google XYZ Formula**: *"Accomplished [X] as measured by [Y], by doing [Z]"*. For example, instead of *"Built a React website"*, write *"Engineered a responsive React dashboard with client-side caching, reducing page load latency by 40%"*.

You can review side-by-side before & after improvements directly in the **Resume Analyzer** tab!`;
  }

  if (q.includes('project') || q.includes('portfolio') || q.includes('build')) {
    return `To stand out for **${targetRole}** as a candidate with your background, here are two high-impact projects recruiters love:

1. **Automated Batch Ingestion & Analytics Pipeline**:
   - **Tech**: Python, PostgreSQL, Docker, Apache Airflow.
   - **What it does**: Ingests daily public API data (e.g. weather, finance, or GitHub repos), transforms records, and writes to a relational warehouse with schema migrations.
2. **Interactive Cloud-Backed Analytics Dashboard**:
   - **Tech**: React, TypeScript, FastAPI/Express, PostgreSQL.
   - **What it does**: Full-stack application allowing users to run custom analytics queries, filter cohorts, and export visual charts.

Both of these directly demonstrate end-to-end engineering rigor rather than simple toy apps.`;
  }

  return `Hello! As your Career Compass assistant, I'm analyzing your current target path: **${targetRole}**.

With your current skills in **${skills}**, you have a strong starting foundation! I can help you with:
- Analyzing your skill gaps and roadmap milestones
- Preparing for technical interview questions
- Optimizing your resume bullets for higher ATS scores
- Suggesting portfolio projects and verified certification paths

What specific challenge can we tackle right now?`;
}

function getCuratedLearningResources(skillQuery: string) {
  const allResources = [
    {
      id: 'res-1',
      title: 'Google Cloud Professional Data Engineer Certification',
      provider: 'Google Cloud',
      skill: 'Data Engineering & Cloud Storage',
      difficulty: 'Intermediate',
      duration: '2-3 Months (5 hrs/week)',
      type: 'Certification',
      url: 'https://cloud.google.com/learn/certification/data-engineer',
      whyRecommended: 'Industry-standard credential validating BigQuery, Dataflow, and scalable pipeline architecture on Google Cloud.',
    },
    {
      id: 'res-2',
      title: 'DeepLearning.AI Machine Learning Specialization',
      provider: 'Coursera & DeepLearning.AI (Andrew Ng)',
      skill: 'Machine Learning',
      difficulty: 'Beginner to Intermediate',
      duration: '3 Months (8 hrs/week)',
      type: 'Course',
      url: 'https://www.deeplearning.ai/courses/machine-learning-specialization/',
      whyRecommended: 'The gold-standard curriculum covering supervised learning, neural networks, and decision trees.',
    },
    {
      id: 'res-3',
      title: 'Meta Front-End Developer Professional Certificate',
      provider: 'Coursera & Meta',
      skill: 'React & Frontend Architecture',
      difficulty: 'Beginner to Intermediate',
      duration: '3-4 Months',
      type: 'Specialization',
      url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
      whyRecommended: 'Endorsed curriculum covering React, UX principles, Version Control, and coding interview preparation.',
    },
    {
      id: 'res-4',
      title: 'Apache Spark 3 - Real-World PySpark Pipelines',
      provider: 'DataCamp / freeCodeCamp',
      skill: 'Apache Spark',
      difficulty: 'Intermediate',
      duration: '4-6 Weeks',
      type: 'Course',
      url: 'https://spark.apache.org/docs/latest/api/python/',
      whyRecommended: 'Essential for distributed compute transformations, RDDs, Spark SQL, and big data streaming.',
    },
    {
      id: 'res-5',
      title: 'Docker & Kubernetes: The Practical Guide',
      provider: 'Udemy / Docker Official',
      skill: 'Docker & DevOps',
      difficulty: 'Beginner to Intermediate',
      duration: '4 Weeks',
      type: 'Course',
      url: 'https://docs.docker.com/get-started/',
      whyRecommended: 'Teaches containerization from ground zero, multi-container orchestration, and CI/CD integration.',
    },
    {
      id: 'res-6',
      title: 'AWS Certified Solutions Architect - Associate',
      provider: 'Amazon Web Services',
      skill: 'Cloud Architecture (AWS)',
      difficulty: 'Intermediate',
      duration: '2-3 Months',
      type: 'Certification',
      url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
      whyRecommended: 'Highly sought-after credential demonstrating mastery of VPCs, IAM, S3, EC2, and serverless architectures.',
    },
    {
      id: 'res-7',
      title: 'Designing Data-Intensive Applications (Self-Study Guide)',
      provider: "O'Reilly (Martin Kleppmann)",
      skill: 'Distributed Systems & Architecture',
      difficulty: 'Advanced',
      duration: '6 Weeks',
      type: 'Book & Guided Curriculum',
      url: 'https://dataintensive.net/',
      whyRecommended: 'The definitive text for understanding storage engines, replication, consensus, and batch processing.',
    },
  ];

  if (!skillQuery) return allResources;
  const q = skillQuery.toLowerCase();
  return allResources.filter(
    (r) => r.skill.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q)
  );
}

// ----------------------------------------------------
// FRONTEND SERVING & VITE INTEGRATION
// ----------------------------------------------------

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Career Compass server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
