import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, TrendingUp, Star, ArrowRight, Plus, Search } from "lucide-react";

const groups = [
  {
    id: 1,
    name: "Career Pivots After Layoffs",
    desc: "For people navigating unexpected transitions and turning disruption into opportunity.",
    members: 4821,
    posts: 342,
    active: "5 min ago",
    tags: ["Transition", "Support", "Strategy"],
    color: "teal",
    trending: true,
  },
  {
    id: 2,
    name: "AI Beginners",
    desc: "A judgment-free zone for learning AI tools from scratch. Ask anything.",
    members: 8734,
    posts: 1204,
    active: "2 min ago",
    tags: ["AI Tools", "Learning", "Beginner"],
    color: "violet",
    trending: true,
  },
  {
    id: 3,
    name: "Midlife Reinvention",
    desc: "For those 40+ rewriting their next chapter with wisdom, courage, and curiosity.",
    members: 3291,
    posts: 218,
    active: "12 min ago",
    tags: ["Identity", "Courage", "Growth"],
    color: "amber",
    trending: false,
  },
  {
    id: 4,
    name: "Corporate → Creator",
    desc: "Making the leap from 9-to-5 to independent creator, educator, or entrepreneur.",
    members: 5512,
    posts: 671,
    active: "8 min ago",
    tags: ["Creator Economy", "Independence", "Entrepreneurship"],
    color: "teal",
    trending: true,
  },
  {
    id: 5,
    name: "Automation Explorers",
    desc: "Learn to build automations that save time, scale effort, and create new income.",
    members: 2108,
    posts: 134,
    active: "30 min ago",
    tags: ["Automation", "Tools", "Income"],
    color: "violet",
    trending: false,
  },
  {
    id: 6,
    name: "Remote & Independent",
    desc: "Building sustainable location-independent careers and income streams.",
    members: 6877,
    posts: 892,
    active: "1 min ago",
    tags: ["Remote Work", "Freelance", "Freedom"],
    color: "amber",
    trending: false,
  },
];

const recentPosts = [
  {
    author: "Sarah K.",
    group: "Career Pivots After Layoffs",
    time: "2 hours ago",
    content: "After 8 months of feeling lost after my layoff, I finally landed my first client as an AI workflow consultant. The Pathly path was my roadmap. Don't give up. 🙌",
    likes: 147,
    replies: 38,
  },
  {
    author: "Marcus T.",
    group: "AI Beginners",
    time: "4 hours ago",
    content: "Week 3 of learning AI tools as a 52-year-old. I made my first automation workflow today. It saved 4 hours of manual work. This stuff is actually incredible.",
    likes: 203,
    replies: 61,
  },
  {
    author: "Priya M.",
    group: "Corporate → Creator",
    time: "6 hours ago",
    content: "Quit my marketing director role last month to launch my digital course business. First cohort sold out in 48 hours. BEST DECISION I EVER MADE.",
    likes: 312,
    replies: 94,
  },
];

export default function Community() {
  const [joined, setJoined] = useState<number[]>([1, 2]);
  const [search, setSearch] = useState("");

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.desc.toLowerCase().includes(search.toLowerCase())
  );

  const tagColorMap: Record<string, string> = {
    teal: "border-teal-500/20 bg-teal-500/8 text-teal",
    violet: "border-violet-500/20 bg-violet-500/8 text-violet-500",
    amber: "border-amber-500/20 bg-amber-500/8 text-amber",
  };

  const borderColorMap: Record<string, string> = {
    teal: "border-teal-500/20 hover:border-teal-500/40",
    violet: "border-violet-500/20 hover:border-violet-500/40",
    amber: "border-amber-500/20 hover:border-amber-500/40",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-violet-500 text-sm font-semibold uppercase tracking-widest mb-3">Community</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              You're not alone in this
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              50,000+ people navigating career reinvention together. Find your group, share your story, accelerate your evolution.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Active Members", value: "50K+", icon: Users },
              { label: "Daily Posts", value: "2,400+", icon: MessageCircle },
              { label: "Success Stories", value: "8,000+", icon: Star },
              { label: "Groups", value: "24", icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="bg-surface-1 border border-border/50 rounded-xl p-4 text-center">
                <s.icon className="w-5 h-5 text-teal mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Groups */}
            <div className="lg:col-span-2">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search communities..."
                  className="w-full bg-surface-1 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal-500/50"
                />
              </div>

              <div className="space-y-4">
                {filtered.map((g) => {
                  const isJoined = joined.includes(g.id);
                  return (
                    <div
                      key={g.id}
                      className={`bg-gradient-card border rounded-2xl p-5 transition-all ${borderColorMap[g.color]}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-foreground">{g.name}</h3>
                            {g.trending && (
                              <span className="text-xs bg-teal-500/10 text-teal border border-teal-500/20 rounded-full px-2 py-0.5 flex items-center gap-1">
                                <TrendingUp className="w-2.5 h-2.5" />Trending
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{g.desc}</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {g.tags.map((t) => (
                              <span key={t} className={`text-xs px-2.5 py-0.5 rounded-full border ${tagColorMap[g.color]}`}>{t}</span>
                            ))}
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{g.members.toLocaleString()} members</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{g.posts} posts</span>
                            <span>Active {g.active}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() =>
                            setJoined((prev) =>
                              prev.includes(g.id) ? prev.filter((id) => id !== g.id) : [...prev, g.id]
                            )
                          }
                          className={
                            isJoined
                              ? "bg-teal-500/10 border border-teal-500/30 text-teal hover:bg-teal-500/20 shrink-0"
                              : "bg-gradient-teal text-primary-foreground hover:opacity-90 shrink-0"
                          }
                        >
                          {isJoined ? "Joined ✓" : <><Plus className="w-3 h-3 mr-1" />Join</>}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Recent success stories */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber fill-amber" />
                  Recent Wins
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((post, i) => (
                    <div key={i} className="pb-4 border-b border-border/40 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-teal flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {post.author[0]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{post.author}</p>
                          <p className="text-xs text-muted-foreground">{post.time}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{post.content}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.replies}</span>
                        <span className="text-teal">in {post.group}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your groups */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-3">Your Groups ({joined.length})</h3>
                {joined.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Join groups to see them here.</p>
                ) : (
                  <div className="space-y-2">
                    {groups.filter((g) => joined.includes(g.id)).map((g) => (
                      <div key={g.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-2 transition-colors cursor-pointer">
                        <div className={`w-2 h-2 rounded-full ${g.color === "teal" ? "bg-teal" : g.color === "amber" ? "bg-amber" : "bg-violet-500"}`} />
                        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">{g.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Button size="sm" variant="outline" className="w-full mt-4 border-border hover:border-teal-500/40 text-xs">
                  <ArrowRight className="w-3 h-3 mr-1.5" />
                  Open Community Hub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
