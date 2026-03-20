import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Sparkles, Compass, X, Zap, Star, Globe,
  Brain, TrendingUp, FlaskConical, BookOpen, Users, Map,
  Lightbulb, Eye,
} from "lucide-react";
import navoLogo from "@/assets/navo-logo.png";

// ── Color palette per node type ────────────────────────────────────
const TYPE_STYLE = {
  skill:     { hsl: "36 80% 58%",  label: "Skill",     icon: Zap    },
  career:    { hsl: "10 82% 62%",  label: "Career",    icon: Star   },
  industry:  { hsl: "258 55% 65%", label: "Industry",  icon: Globe  },
  direction: { hsl: "158 55% 55%", label: "Direction", icon: Compass },
} as const;
type NodeType = keyof typeof TYPE_STYLE;

// ── Node definitions ───────────────────────────────────────────────
interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number; y: number;
  r: number;
  description: string;
  whyMatters: string;
  relatedSkills: string[];
  experiments: string[];
  connects: string[];
}

const NODES: GraphNode[] = [
  // ── Skills ────────────────────────────────────────
  {
    id: "writing", label: "Writing &\nStorytelling", type: "skill", x: 440, y: 390, r: 20,
    description: "The ability to shape ideas into words that move people.",
    whyMatters: "Writing is the foundation of communication, persuasion, and presence — in any field.",
    relatedSkills: ["Clarity of thought", "Audience awareness", "Structural thinking"],
    experiments: ["Write one honest reflection about your work this week", "Summarise a complex idea in 3 sentences"],
    connects: ["content-strategist", "brand-strategist", "educator", "media", "tech-writer"],
  },
  {
    id: "curiosity", label: "Intellectual\nCuriosity", type: "skill", x: 370, y: 265, r: 22,
    description: "The drive to explore ideas beyond what is immediately useful.",
    whyMatters: "Curiosity is the engine behind learning, innovation, and creative problem-solving.",
    relatedSkills: ["Research", "Pattern recognition", "Synthesis"],
    experiments: ["Spend 30 minutes exploring a topic you know nothing about", "Ask five 'why' questions about something familiar"],
    connects: ["ai-fluency", "systems", "learning-designer", "design-thinking", "researcher"],
  },
  {
    id: "communication", label: "Clear\nCommunication", type: "skill", x: 275, y: 400, r: 20,
    description: "Making complex things understandable to any audience.",
    whyMatters: "The rarest skill in technical and strategic fields — and one of the most valuable.",
    relatedSkills: ["Active listening", "Simplification", "Empathy"],
    experiments: ["Explain your work to someone outside your field", "Record yourself explaining one idea in 60 seconds"],
    connects: ["community-arch", "brand-strategist", "connector-path", "educator", "content-strategist"],
  },
  {
    id: "systems", label: "Systems\nThinking", type: "skill", x: 540, y: 280, r: 21,
    description: "Seeing how parts connect and how changes ripple through a whole.",
    whyMatters: "Systems thinkers can navigate complexity that overwhelms everyone else.",
    relatedSkills: ["Causal reasoning", "Feedback loops", "Mental models"],
    experiments: ["Map the system behind one process in your life", "Identify one unintended consequence in a current decision"],
    connects: ["ai-product", "startup-op", "data-thinking", "builder-path"],
  },
  {
    id: "empathy", label: "Human\nEmpathy", type: "skill", x: 215, y: 310, r: 19,
    description: "The ability to understand others' experience from the inside.",
    whyMatters: "Empathy powers design, leadership, teaching, and community — every human-facing field.",
    relatedSkills: ["Perspective-taking", "Listening", "Emotional intelligence"],
    experiments: ["Have a conversation where you only ask questions", "Map a user's frustration with something you built"],
    connects: ["researcher", "learning-designer", "community-arch", "connector-path"],
  },
  {
    id: "design-thinking", label: "Design\nThinking", type: "skill", x: 400, y: 195, r: 20,
    description: "A human-centered approach to solving problems creatively.",
    whyMatters: "It bridges technical capability and real human need — making anything more useful and beautiful.",
    relatedSkills: ["Prototyping", "User research", "Iteration"],
    experiments: ["Sketch 3 different solutions to one everyday problem", "Interview one person about a frustration they have"],
    connects: ["researcher", "ai-product", "learning-designer", "curiosity"],
  },
  {
    id: "ai-fluency", label: "AI\nFluency", type: "skill", x: 610, y: 240, r: 21,
    description: "Understanding how AI tools work and where they can help.",
    whyMatters: "AI fluency is becoming a fundamental literacy — not just for engineers, but for anyone who works with ideas.",
    relatedSkills: ["Prompt design", "Tool evaluation", "Critical AI thinking"],
    experiments: ["Use an AI tool to help with something you struggle with", "Ask an AI to explain something complex in simple terms"],
    connects: ["ai-product", "data-thinking", "tech", "systems"],
  },
  {
    id: "data-thinking", label: "Data\nLiteracy", type: "skill", x: 565, y: 385, r: 18,
    description: "Reading, questioning, and reasoning with data.",
    whyMatters: "Data literacy helps you make better decisions and see patterns others miss.",
    relatedSkills: ["Statistical intuition", "Visualisation thinking", "Questioning assumptions"],
    experiments: ["Find one data point that changed your view on something", "Analyse a simple dataset and find one insight"],
    connects: ["ai-product", "startup-op", "tech", "ai-fluency"],
  },

  // ── Careers ───────────────────────────────────────
  {
    id: "content-strategist", label: "Content\nStrategist", type: "career", x: 145, y: 195, r: 22,
    description: "Shape how ideas, stories, and knowledge reach audiences at scale.",
    whyMatters: "Every organisation needs people who can turn expertise into compelling content that builds trust.",
    relatedSkills: ["Audience research", "Editorial thinking", "SEO", "Brand voice"],
    experiments: ["Write a content brief for a topic you care about", "Study the content strategy of a brand you admire"],
    connects: ["writing", "brand-strategist", "media", "communication"],
  },
  {
    id: "ai-product", label: "AI Product\nBuilder", type: "career", x: 790, y: 170, r: 24,
    description: "Design and ship products powered by AI to solve meaningful real-world problems.",
    whyMatters: "The next wave of transformative products will be built by people who understand both AI and human need.",
    relatedSkills: ["Product thinking", "Prompt engineering", "User research", "Rapid prototyping"],
    experiments: ["Use an AI API to build something tiny in a weekend", "Map out the user journey for an AI feature you wish existed"],
    connects: ["systems", "ai-fluency", "startup-op", "tech", "builder-path", "design-thinking"],
  },
  {
    id: "learning-designer", label: "Learning\nDesigner", type: "career", x: 200, y: 535, r: 22,
    description: "Create the conditions where people learn, grow, and develop genuine capability.",
    whyMatters: "As work changes faster, the ability to design learning experiences becomes one of the most valuable skills on earth.",
    relatedSkills: ["Curriculum design", "Adult learning theory", "Facilitation", "Feedback design"],
    experiments: ["Design a 30-minute workshop on something you know well", "Teach one concept to someone and observe where they get stuck"],
    connects: ["curiosity", "empathy", "educator", "teacher-path", "education", "design-thinking"],
  },
  {
    id: "community-arch", label: "Community\nArchitect", type: "career", x: 445, y: 595, r: 22,
    description: "Design spaces — physical or digital — where people connect, contribute, and belong.",
    whyMatters: "Community is the new distribution. People who build genuine human connections build real leverage.",
    relatedSkills: ["Event design", "Online community management", "Facilitation", "Storytelling"],
    experiments: ["Host one small gathering around an idea you care about", "Start a thread or forum on a topic you want to explore"],
    connects: ["communication", "empathy", "startup-op", "education", "connector-path"],
  },
  {
    id: "brand-strategist", label: "Brand\nStrategist", type: "career", x: 100, y: 360, r: 21,
    description: "Help organisations articulate who they are and why it matters.",
    whyMatters: "Brand strategy sits at the intersection of psychology, storytelling, and business — and has never been more valuable.",
    relatedSkills: ["Positioning", "Competitive analysis", "Narrative design", "Visual language"],
    experiments: ["Write a one-paragraph brand story for an organisation you admire", "Identify the hidden positioning of 3 competing products"],
    connects: ["writing", "communication", "media", "content-strategist"],
  },
  {
    id: "startup-op", label: "Startup\nOperator", type: "career", x: 800, y: 430, r: 22,
    description: "Build something from nothing with a small team — learning everything as you go.",
    whyMatters: "Startups are the fastest compressing environments for skill development. Nothing teaches like building.",
    relatedSkills: ["First-principles thinking", "Resourcefulness", "Prioritisation", "Communication under uncertainty"],
    experiments: ["Identify a problem in your life and sketch a startup solution in one page", "Talk to 5 people about a problem you think is worth solving"],
    connects: ["systems", "data-thinking", "ai-product", "tech", "builder-path"],
  },
  {
    id: "researcher", label: "UX / Human\nResearcher", type: "career", x: 685, y: 555, r: 21,
    description: "Understand how people think, feel, and behave — then translate that into design insight.",
    whyMatters: "In a world of assumptions, good researchers find the truth. Every product and policy is better with real research.",
    relatedSkills: ["Interview design", "Observation", "Synthesis", "Reporting insights"],
    experiments: ["Conduct one 15-minute user interview about something you're building", "Map the emotional journey of a product you use daily"],
    connects: ["empathy", "design-thinking", "tech", "curiosity"],
  },
  {
    id: "educator", label: "Educator /\nFacilitator", type: "career", x: 315, y: 635, r: 21,
    description: "Help people develop new capabilities — in schools, companies, or communities.",
    whyMatters: "The most leveraged thing you can do is help other people grow. Teaching is a multiplier.",
    relatedSkills: ["Curriculum design", "Feedback", "Patience", "Explanation"],
    experiments: ["Write a lesson plan for one skill you have", "Run a 20-minute learning session with one other person"],
    connects: ["writing", "communication", "learning-designer", "education", "teacher-path"],
  },
  {
    id: "tech-writer", label: "Technical\nWriter", type: "career", x: 150, y: 115, r: 19,
    description: "Make complex technical ideas accessible to real humans.",
    whyMatters: "Millions of dollars are lost to unclear documentation. Technical writers are undervalued and in high demand.",
    relatedSkills: ["Simplification", "Documentation systems", "Empathy for readers"],
    experiments: ["Rewrite one piece of confusing documentation clearly", "Explain one API or technical concept in plain language"],
    connects: ["writing", "tech", "ai-fluency"],
  },

  // ── Industries ────────────────────────────────────
  {
    id: "tech", label: "Technology", type: "industry", x: 970, y: 260, r: 26,
    description: "The industry building the tools, platforms, and systems that shape modern life.",
    whyMatters: "Technology intersects with every field — understanding it opens doors in almost any direction.",
    relatedSkills: ["Technical literacy", "Product thinking", "Systems design"],
    experiments: ["Explore one new tool and write a short review", "Map the tech stack behind one product you use daily"],
    connects: ["ai-product", "startup-op", "researcher", "tech-writer", "ai-fluency"],
  },
  {
    id: "education", label: "Education", type: "industry", x: 80, y: 610, r: 24,
    description: "The systems and organisations dedicated to human learning and development.",
    whyMatters: "Education shapes who people become. Those who work in it have disproportionate impact.",
    relatedSkills: ["Curriculum design", "Assessment", "Learning psychology"],
    experiments: ["Shadow or interview an educator for one day", "Design an alternative way to teach one subject"],
    connects: ["learning-designer", "community-arch", "educator", "teacher-path"],
  },
  {
    id: "media", label: "Media &\nCreative", type: "industry", x: 70, y: 140, r: 24,
    description: "The organisations that shape culture through content, stories, and creative work.",
    whyMatters: "Media is how ideas spread, culture forms, and change happens. It runs on human creativity.",
    relatedSkills: ["Creative direction", "Production", "Audience development"],
    experiments: ["Create one piece of original content in a medium you've never tried", "Pitch a story idea to a publication or podcast"],
    connects: ["writing", "content-strategist", "brand-strategist", "tech-writer"],
  },

  // ── Directions ────────────────────────────────────
  {
    id: "builder-path", label: "The\nBuilder", type: "direction", x: 720, y: 330, r: 28,
    description: "People who build things — products, companies, tools — that didn't exist before.",
    whyMatters: "Builders create the leverage that changes what's possible. Every great product started with someone who decided to build.",
    relatedSkills: ["Shipping fast", "Learning from failure", "Resourcefulness", "Vision"],
    experiments: ["Build one small thing in a weekend — anything", "Find one problem you face daily and prototype a solution"],
    connects: ["ai-product", "startup-op", "systems", "tech"],
  },
  {
    id: "connector-path", label: "The\nConnector", type: "direction", x: 175, y: 465, r: 28,
    description: "People who bring others together — building communities, bridges, and belonging.",
    whyMatters: "In a fragmented world, connectors hold things together. The network you build is always worth more than any single skill.",
    relatedSkills: ["Relationship building", "Facilitation", "Event design", "Listening"],
    experiments: ["Introduce two people who should know each other", "Host one small gathering around an idea you care about"],
    connects: ["communication", "empathy", "community-arch", "education"],
  },
  {
    id: "teacher-path", label: "The\nTeacher", type: "direction", x: 455, y: 695, r: 28,
    description: "People who help others grow — in classrooms, companies, and communities.",
    whyMatters: "Teaching is one of the highest-leverage things a person can do. What you teach multiplies through everyone you reach.",
    relatedSkills: ["Curriculum design", "Patience", "Explanation", "Inspiration"],
    experiments: ["Teach one thing you know to someone who doesn't", "Create a short resource that helps someone learn faster"],
    connects: ["educator", "learning-designer", "education", "writing"],
  },
];

// Build a quick lookup
const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]));

// Derive unique edges
const EDGES: [string, string][] = [];
const edgeSet = new Set<string>();
NODES.forEach((n) => {
  n.connects.forEach((tid) => {
    if (!NODE_MAP[tid]) return;
    const key = [n.id, tid].sort().join("--");
    if (!edgeSet.has(key)) { edgeSet.add(key); EDGES.push([n.id, tid]); }
  });
});

// ── Discovery paths (curated sequences) ───────────────────────────
const DISCOVERY_PATHS = [
  { label: "AI Creator", ids: ["curiosity", "ai-fluency", "systems", "ai-product", "builder-path", "tech"], color: "10 82% 62%" },
  { label: "Human-Centered Builder", ids: ["empathy", "design-thinking", "researcher", "learning-designer", "teacher-path"], color: "36 80% 58%" },
  { label: "Ideas Amplifier", ids: ["writing", "communication", "content-strategist", "brand-strategist", "media", "connector-path"], color: "258 55% 65%" },
  { label: "Community Maker", ids: ["empathy", "communication", "community-arch", "education", "connector-path"], color: "158 55% 55%" },
];

// ── Helpers ────────────────────────────────────────────────────────
function hslStr(hsl: string, alpha = 1) {
  return alpha < 1 ? `hsla(${hsl} / ${alpha})` : `hsl(${hsl})`;
}

// ── SVG Graph Canvas ───────────────────────────────────────────────
const VBOX_W = 1100;
const VBOX_H = 760;

interface GraphCanvasProps {
  selectedId: string | null;
  hoveredId: string | null;
  discoveryIds: Set<string> | null;
  exploredIds: Set<string>;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

function GraphCanvas({ selectedId, hoveredId, discoveryIds, exploredIds, onSelect, onHover }: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as SVGElement).closest("[data-node]")) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  };
  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startX) * (VBOX_W / (svgRef.current?.clientWidth ?? VBOX_W));
    const dy = (e.clientY - dragRef.current.startY) * (VBOX_H / (svgRef.current?.clientHeight ?? VBOX_H));
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
  };
  const onMouseUp = () => { dragRef.current = null; };

  const isHighlighted = (id: string) => {
    if (!discoveryIds) return true;
    return discoveryIds.has(id);
  };
  const isDimmed = (id: string) => discoveryIds !== null && !discoveryIds.has(id);

  // Edge color — use source node type color
  const edgeColor = (a: string, b: string) => {
    const na = NODE_MAP[a];
    if (!na) return "200 10% 50%";
    return TYPE_STYLE[na.type].hsl;
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VBOX_W} ${VBOX_H}`}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Defs */}
      <defs>
        {Object.entries(TYPE_STYLE).map(([type, s]) => (
          <radialGradient key={type} id={`glow-${type}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={hslStr(s.hsl, 0.4)} />
            <stop offset="100%" stopColor={hslStr(s.hsl, 0)} />
          </radialGradient>
        ))}
        {/* Subtle background star dots */}
        <pattern id="stars" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="0.7" fill="hsl(24 20% 93% / 0.06)" />
          <circle cx="10" cy="50" r="0.5" fill="hsl(24 20% 93% / 0.04)" />
          <circle cx="55" cy="10" r="0.6" fill="hsl(24 20% 93% / 0.05)" />
        </pattern>
        <filter id="blur-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background */}
      <rect width={VBOX_W} height={VBOX_H} fill="url(#stars)" />

      <g transform={`translate(${pan.x} ${pan.y})`}>

        {/* Edges */}
        {EDGES.map(([a, b]) => {
          const na = NODE_MAP[a]; const nb = NODE_MAP[b];
          if (!na || !nb) return null;
          const bothHighlighted = isHighlighted(a) && isHighlighted(b);
          const opacity = discoveryIds
            ? (bothHighlighted ? 0.5 : 0.04)
            : (selectedId && (a === selectedId || b === selectedId) ? 0.6 : 0.1);
          const strokeW = discoveryIds && bothHighlighted ? 1.5 : (selectedId && (a === selectedId || b === selectedId) ? 1.5 : 0.8);
          const color = edgeColor(a, b);
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={hslStr(color, opacity)}
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const s = TYPE_STYLE[node.type];
          const isSelected = selectedId === node.id;
          const isHovered = hoveredId === node.id;
          const dimmed = isDimmed(node.id);
          const explored = exploredIds.has(node.id);
          const scale = isSelected ? 1.25 : isHovered ? 1.12 : 1;
          const fillAlpha = isSelected ? 0.35 : isHovered ? 0.28 : dimmed ? 0.04 : 0.14;
          const strokeAlpha = isSelected ? 0.9 : isHovered ? 0.7 : dimmed ? 0.1 : 0.4;
          const labelAlpha = dimmed ? 0.2 : 1;
          const lines = node.label.split("\n");

          return (
            <g
              key={node.id}
              data-node={node.id}
              transform={`translate(${node.x} ${node.y}) scale(${scale})`}
              style={{ transformOrigin: `${node.x}px ${node.y}px`, transition: "transform 0.2s ease", cursor: "pointer" }}
              onClick={(e) => { e.stopPropagation(); onSelect(node.id); onHover(null); }}
              onMouseEnter={() => onHover(node.id)}
              onMouseLeave={() => onHover(null)}
            >
              {/* Glow halo */}
              {(isSelected || isHovered) && (
                <circle
                  r={node.r + 18}
                  fill={`url(#glow-${node.type})`}
                  opacity={isSelected ? 0.8 : 0.5}
                />
              )}

              {/* Main circle */}
              <circle
                r={node.r}
                fill={hslStr(s.hsl, fillAlpha)}
                stroke={hslStr(s.hsl, strokeAlpha)}
                strokeWidth={isSelected ? 2 : 1.5}
              />

              {/* Explored ring */}
              {explored && !isSelected && (
                <circle
                  r={node.r + 5}
                  fill="none"
                  stroke={hslStr(s.hsl, 0.5)}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              )}

              {/* Label lines */}
              {lines.map((line, i) => (
                <text
                  key={i}
                  textAnchor="middle"
                  y={node.r + 14 + i * 13}
                  fontSize="11"
                  fill={hslStr("24 20% 93%", labelAlpha * 0.8)}
                  fontWeight={isSelected ? "600" : "400"}
                  style={{ fontFamily: "inherit", pointerEvents: "none" }}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ── Node detail panel ──────────────────────────────────────────────
function NodePanel({ node, onClose }: { node: GraphNode; onClose: () => void }) {
  const s = TYPE_STYLE[node.type];
  const Icon = s.icon;
  const connected = node.connects.map((id) => NODE_MAP[id]).filter(Boolean);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-4 border-b"
        style={{ borderColor: `hsl(${s.hsl} / 0.2)` }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `hsl(${s.hsl} / 0.15)` }}>
            <Icon className="w-5 h-5" style={{ color: `hsl(${s.hsl})` }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5"
              style={{ color: `hsl(${s.hsl})` }}>{s.label}</p>
            <h3 className="text-lg font-bold text-foreground leading-tight">
              {node.label.replace("\n", " ")}
            </h3>
          </div>
        </div>
        <button onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Description */}
        <p className="text-sm text-foreground leading-relaxed">{node.description}</p>

        {/* Why it matters */}
        <div className="rounded-xl p-4"
          style={{ background: `hsl(${s.hsl} / 0.07)`, border: `1px solid hsl(${s.hsl} / 0.15)` }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: `hsl(${s.hsl})` }}>Why it matters</p>
          <p className="text-sm text-foreground leading-relaxed">{node.whyMatters}</p>
        </div>

        {/* Related skills */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Skills involved
          </p>
          <div className="flex flex-wrap gap-1.5">
            {node.relatedSkills.map((sk) => (
              <span key={sk} className="text-xs px-2.5 py-1 rounded-full border text-foreground/80"
                style={{ background: `hsl(${s.hsl} / 0.07)`, borderColor: `hsl(${s.hsl} / 0.2)` }}>
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Experiments */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-3.5 h-3.5" style={{ color: `hsl(${s.hsl})` }} />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Try a small experiment
            </p>
          </div>
          <div className="space-y-2">
            {node.experiments.map((exp, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: `hsl(${s.hsl} / 0.6)` }} />
                {exp}
              </div>
            ))}
          </div>
        </div>

        {/* Connected nodes */}
        {connected.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Connects to
            </p>
            <div className="flex flex-wrap gap-1.5">
              {connected.map((cn) => {
                const cs = TYPE_STYLE[cn.type];
                return (
                  <span key={cn.id} className="text-xs px-2.5 py-1 rounded-full border"
                    style={{
                      background: `hsl(${cs.hsl} / 0.07)`,
                      borderColor: `hsl(${cs.hsl} / 0.2)`,
                      color: `hsl(${cs.hsl})`,
                    }}>
                    {cn.label.replace("\n", " ")}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Legend ─────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex flex-wrap gap-3">
      {(Object.entries(TYPE_STYLE) as [NodeType, typeof TYPE_STYLE[NodeType]][]).map(([type, s]) => {
        const Icon = s.icon;
        return (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border"
              style={{ background: `hsl(${s.hsl} / 0.2)`, borderColor: `hsl(${s.hsl} / 0.6)` }} />
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────
type Tab = "graph" | "discovery" | "personal";

export default function PathGraph() {
  const [activeTab, setActiveTab] = useState<Tab>("graph");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [discoveryPath, setDiscoveryPath] = useState<number | null>(null);
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());
  const [showIntro, setShowIntro] = useState(true);

  const discoveryIds = discoveryPath !== null
    ? new Set(DISCOVERY_PATHS[discoveryPath].ids)
    : null;

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => prev === id ? null : id);
    setExploredIds((prev) => new Set([...prev, id]));
  }, []);

  const selectedNode = selectedId ? NODE_MAP[selectedId] : null;

  if (showIntro) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-3xl"
            style={{ background: "hsl(258 55% 65% / 0.05)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] rounded-full blur-3xl"
            style={{ background: "hsl(10 82% 62% / 0.04)" }} />
          {/* Floating dots */}
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-pulse"
              style={{
                width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
                left: `${(i * 17 + 7) % 90}%`, top: `${(i * 23 + 11) % 85}%`,
                background: `hsl(${i % 2 === 0 ? "36 80% 58%" : "258 55% 65%"} / 0.25)`,
                animationDelay: `${i * 300}ms`, animationDuration: `${2 + (i % 3)}s`,
              }} />
          ))}
        </div>

        <div className="relative z-10 max-w-xl w-full text-center animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <img src={navoLogo} alt="NAVO" className="w-7 h-7 rounded-lg object-contain" />
            <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
          </Link>

          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 relative"
            style={{ background: "linear-gradient(135deg, hsl(258 55% 65%), hsl(10 82% 62%))" }}>
            <Compass className="w-10 h-10 text-white" />
            <div className="absolute inset-0 rounded-3xl animate-ping opacity-20"
              style={{ background: "hsl(258 55% 65%)" }} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8 border"
            style={{ background: "hsl(258 55% 65% / 0.08)", borderColor: "hsl(258 55% 65% / 0.2)", color: "hsl(258 55% 65%)" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Path Graph · Interactive Exploration
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-6">
            Your future is not<br />
            <span className="italic" style={{
              background: "linear-gradient(135deg, hsl(258 55% 65%), hsl(10 82% 62%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>a straight line.</span>
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed mb-5 max-w-md mx-auto">
            It is a network of possibilities.
          </p>
          <p className="text-muted-foreground/70 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            The Path Graph helps you explore how interests, skills, and opportunities connect — so you can design your own path forward.
          </p>

          {/* Node type legend */}
          <div className="flex justify-center gap-4 flex-wrap mb-10">
            {(Object.entries(TYPE_STYLE) as [NodeType, typeof TYPE_STYLE[NodeType]][]).map(([type, s]) => {
              const Icon = s.icon;
              return (
                <div key={type} className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: `hsl(${s.hsl} / 0.07)`, border: `1px solid hsl(${s.hsl} / 0.15)` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${s.hsl} / 0.5)`, border: `1px solid hsl(${s.hsl})` }} />
                  <span className="text-xs font-medium" style={{ color: `hsl(${s.hsl})` }}>{s.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => setShowIntro(false)}
              className="text-white px-8 py-3 h-auto text-base font-semibold hover:opacity-90 gap-2"
              style={{ background: "linear-gradient(135deg, hsl(258 55% 65%), hsl(10 82% 62%))" }}>
              Explore the Path Graph
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/40 shrink-0 glass sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <img src={navoLogo} alt="NAVO" className="w-6 h-6 rounded-md object-contain" />
          <span className="text-sm font-bold text-foreground">Path<span className="text-gradient-coral">ly</span></span>
        </Link>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface-2 rounded-xl p-1">
          {(["graph", "discovery", "personal"] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
              style={activeTab === tab ? {
                background: "linear-gradient(135deg, hsl(258 55% 65%), hsl(10 82% 62%))",
                color: "white",
              } : { color: "hsl(var(--muted-foreground))" }}>
              {tab === "graph" ? "Explore" : tab === "discovery" ? "Discovery" : "My Path"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Legend />
          <Link to="/dashboard">
            <Button variant="outline" size="sm"
              className="border-border/60 text-muted-foreground hover:text-foreground text-xs hidden sm:flex">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* ── GRAPH TAB ─────────────────────────────────────────────── */}
      {activeTab === "graph" && (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Graph canvas */}
          <div className="flex-1 relative overflow-hidden"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(258 55% 65% / 0.04), transparent)" }}>
            <GraphCanvas
              selectedId={selectedId}
              hoveredId={hoveredId}
              discoveryIds={null}
              exploredIds={exploredIds}
              onSelect={handleSelect}
              onHover={setHoveredId}
            />

            {/* Hover tooltip */}
            {hoveredId && !selectedId && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none animate-fade-in">
                <div className="rounded-xl border px-4 py-2 text-sm font-medium glass"
                  style={{ borderColor: `hsl(${TYPE_STYLE[NODE_MAP[hoveredId]?.type]?.hsl ?? "0 0% 50%"} / 0.3)` }}>
                  <span className="text-foreground">{NODE_MAP[hoveredId]?.label.replace("\n", " ")}</span>
                  <span className="text-muted-foreground ml-2 text-xs">— click to explore</span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!selectedId && !hoveredId && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <p className="text-xs text-muted-foreground/50">Click any node to explore · Drag to pan</p>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className={`shrink-0 border-l border-border/40 bg-surface-1 transition-all duration-300 overflow-hidden ${
            selectedNode ? "w-80 xl:w-96" : "w-0"
          }`}>
            {selectedNode && (
              <NodePanel node={selectedNode} onClose={() => setSelectedId(null)} />
            )}
          </div>
        </div>
      )}

      {/* ── DISCOVERY TAB ─────────────────────────────────────────── */}
      {activeTab === "discovery" && (
        <div className="flex-1 flex overflow-hidden">
          {/* Graph with discovery overlay */}
          <div className="flex-1 relative overflow-hidden"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(36 80% 58% / 0.04), transparent)" }}>
            <GraphCanvas
              selectedId={selectedId}
              hoveredId={hoveredId}
              discoveryIds={discoveryIds}
              exploredIds={exploredIds}
              onSelect={handleSelect}
              onHover={setHoveredId}
            />
          </div>

          {/* Discovery sidebar */}
          <div className="w-72 xl:w-80 border-l border-border/40 bg-surface-1 overflow-y-auto shrink-0">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" style={{ color: "hsl(36 80% 58%)" }} />
                <h3 className="font-semibold text-foreground text-sm">Discovery Mode</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                Select a suggested path to see how different skills and careers connect. Nodes on that path will illuminate.
              </p>

              <div className="space-y-2">
                {DISCOVERY_PATHS.map((dp, i) => (
                  <button
                    key={i}
                    onClick={() => setDiscoveryPath(discoveryPath === i ? null : i)}
                    className="w-full text-left rounded-xl p-4 border transition-all hover:scale-[1.01]"
                    style={{
                      background: discoveryPath === i ? `hsl(${dp.color} / 0.1)` : `hsl(${dp.color} / 0.05)`,
                      borderColor: discoveryPath === i ? `hsl(${dp.color} / 0.4)` : `hsl(${dp.color} / 0.15)`,
                    }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-foreground">{dp.label}</p>
                      {discoveryPath === i && (
                        <span className="text-xs font-bold" style={{ color: `hsl(${dp.color})` }}>Active</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dp.ids.map((id) => (
                        <span key={id} className="text-xs px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground">
                          {NODE_MAP[id]?.label.replace("\n", " ")}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {discoveryPath !== null && (
                <div className="mt-5 rounded-xl p-4"
                  style={{
                    background: `hsl(${DISCOVERY_PATHS[discoveryPath].color} / 0.06)`,
                    border: `1px solid hsl(${DISCOVERY_PATHS[discoveryPath].color} / 0.15)`,
                  }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: `hsl(${DISCOVERY_PATHS[discoveryPath].color})` }}>
                    People with similar patterns often explore:
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The highlighted nodes show one possible route. Click any node to learn more and add experiments to your path.
                  </p>
                </div>
              )}
            </div>

            {/* Node detail in discovery */}
            {selectedNode && (
              <div className="border-t border-border/40">
                <NodePanel node={selectedNode} onClose={() => setSelectedId(null)} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PERSONAL PATH TAB ────────────────────────────────────── */}
      {activeTab === "personal" && (
        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-3xl px-6 py-10">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-4 border"
                style={{ background: "hsl(10 82% 62% / 0.08)", borderColor: "hsl(10 82% 62% / 0.2)", color: "hsl(10 82% 62%)" }}>
                <Eye className="w-3.5 h-3.5" />
                Personal Path View
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your evolving path</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nodes you've explored appear here. The more you explore, the clearer your pattern becomes.
              </p>
            </div>

            {/* Explored nodes */}
            {exploredIds.size === 0 ? (
              <div className="rounded-2xl border border-border/40 p-10 text-center bg-gradient-card">
                <Compass className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm font-medium text-foreground mb-2">You haven't explored any nodes yet</p>
                <p className="text-xs text-muted-foreground mb-4">Switch to Explore and click any node to start mapping your path.</p>
                <Button size="sm" onClick={() => setActiveTab("graph")}
                  className="gap-2 text-white"
                  style={{ background: "linear-gradient(135deg, hsl(258 55% 65%), hsl(10 82% 62%))" }}>
                  Start Exploring
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { label: "Nodes Explored", value: exploredIds.size, hsl: "10 82% 62%" },
                    {
                      label: "Skills Discovered",
                      value: [...exploredIds].filter((id) => NODE_MAP[id]?.type === "skill").length,
                      hsl: "36 80% 58%",
                    },
                    {
                      label: "Careers Seen",
                      value: [...exploredIds].filter((id) => NODE_MAP[id]?.type === "career").length,
                      hsl: "258 55% 65%",
                    },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl p-4 text-center"
                      style={{ background: `hsl(${stat.hsl} / 0.07)`, border: `1px solid hsl(${stat.hsl} / 0.18)` }}>
                      <p className="text-2xl font-bold" style={{ color: `hsl(${stat.hsl})` }}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Explored nodes by type */}
                {(["direction", "career", "skill", "industry"] as NodeType[]).map((type) => {
                  const nodes = [...exploredIds]
                    .map((id) => NODE_MAP[id])
                    .filter((n) => n?.type === type);
                  if (!nodes.length) return null;
                  const s = TYPE_STYLE[type];
                  return (
                    <div key={type} className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-widest mb-3"
                        style={{ color: `hsl(${s.hsl})` }}>{s.label}s</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {nodes.map((node) => (
                          <button
                            key={node.id}
                            onClick={() => { setSelectedId(node.id); setActiveTab("graph"); }}
                            className="text-left rounded-xl p-4 border transition-all hover:scale-[1.01] group"
                            style={{ background: `hsl(${s.hsl} / 0.06)`, borderColor: `hsl(${s.hsl} / 0.18)` }}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-foreground">
                                {node.label.replace("\n", " ")}
                              </p>
                              <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-current transition-colors"
                                style={{ color: `hsl(${s.hsl} / 0.4)` }} />
                            </div>
                            <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{node.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Possible next directions */}
                <div className="mt-8 rounded-2xl border border-border/40 p-6 bg-gradient-card">
                  <p className="text-sm font-semibold text-foreground mb-1">Possible next directions</p>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Based on the nodes you've explored, these areas are close in the network:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...exploredIds]
                      .flatMap((id) => NODE_MAP[id]?.connects ?? [])
                      .filter((id) => !exploredIds.has(id) && NODE_MAP[id])
                      .filter((id, idx, arr) => arr.indexOf(id) === idx)
                      .slice(0, 8)
                      .map((id) => {
                        const n = NODE_MAP[id];
                        const s = TYPE_STYLE[n.type];
                        return (
                          <button key={id}
                            onClick={() => { setSelectedId(id); setExploredIds((p) => new Set([...p, id])); setActiveTab("graph"); }}
                            className="text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-[1.02]"
                            style={{ background: `hsl(${s.hsl} / 0.08)`, borderColor: `hsl(${s.hsl} / 0.2)`, color: `hsl(${s.hsl})` }}>
                            {n.label.replace("\n", " ")} →
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground italic">
                    Your life is not a single path. It is a network of possibilities waiting to be explored.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
