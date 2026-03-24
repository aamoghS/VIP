"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedNumber from "@/components/AnimatedNumber";
import {
  BarChart3,
  Users,
  Target,
  Zap,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Trophy,
  Sparkles,
  Radio,
  Clock,
  Cpu,
} from "lucide-react";

type TopicBreakdown = {
  topic: string;
  total: number;
  correct: number;
  accuracy: number;
};

type MetricEvent = {
  id: string;
  sessionId: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: number;
};

type MetricsData = {
  activeSessionCount: number;
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  accuracyRate: number;
  totalSprintCompletions: number;
  totalXpEarned: number;
  topicBreakdown: TopicBreakdown[];
  recentEvents: MetricEvent[];
  currentSessionId: string;
};

const topicColors: Record<string, string> = {
  variables: "#a855f7",
  logic: "#3b82f6",
  loops: "#10b981",
  math: "#f59e0b",
  science: "#06b6d4",
  ela: "#ec4899",
  history: "#8b5cf6",
  unknown: "#64748b",
};

const topicEmoji: Record<string, string> = {
  variables: "🔧",
  logic: "🧠",
  loops: "♾️",
  math: "📐",
  science: "🧪",
  ela: "📝",
  history: "📚",
  unknown: "❓",
};

const eventLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  question_answered: { label: "Question Answered", icon: <Target size={16} />, color: "#3b82f6" },
  sprint_completed: { label: "Sprint Completed", icon: <Zap size={16} />, color: "#10b981" },
  xp_earned: { label: "XP Earned", icon: <Sparkles size={16} />, color: "#f59e0b" },
  page_visited: { label: "Page Visited", icon: <Activity size={16} />, color: "#64748b" },
  sprint_joined: { label: "Sprint Joined", icon: <Users size={16} />, color: "#8b5cf6" },
  reward_claimed: { label: "Reward Claimed", icon: <Trophy size={16} />, color: "#ec4899" },
};

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function MetricsPage() {
  const { data, isLoading, error } = useQuery<MetricsData>({
    queryKey: ["metrics"],
    queryFn: async () => {
      const res = await fetch("/api/metrics");
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return res.json();
    },
    refetchInterval: 3000,
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "60vh", gap: "1.5rem" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <BarChart3 size={48} color="var(--accent-indigo)" />
        </motion.div>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Loading metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="glass-card" style={{ padding: "2rem", textAlign: "center" }}>
          <XCircle size={48} color="#ef4444" style={{ marginBottom: "1rem" }} />
          <p style={{ color: "var(--text-secondary)" }}>Failed to load metrics. Try refreshing.</p>
        </div>
      </div>
    );
  }

  const maxTopicTotal = Math.max(...data.topicBreakdown.map((t) => t.total), 1);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>

      <motion.div variants={itemVariants} className="flex-between" style={{ marginBottom: "2.5rem" }}>
        <div className="page-header">
          <h1 className="page-title">Real-Time Metrics</h1>
          <p className="page-subtitle">Live activity tracking powered by cookie sessions</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div className="badge-premium" style={{ background: "var(--accent-indigo-dim)" }}>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Radio size={14} color="var(--accent-indigo)" />
            </motion.div>
            <span style={{ color: "var(--accent-indigo)", fontWeight: 600 }}>Live</span>
          </div>
          {data.currentSessionId && (
            <div className="badge-premium" style={{ background: "var(--bg-elevated)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}>
              <Cpu size={14} />
              <span>{data.currentSessionId.slice(0, 12)}…</span>
            </div>
          )}
        </div>
      </motion.div>


      <motion.div
        variants={itemVariants}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}
      >

        <motion.div className="glass-card" whileHover={{ y: -4 }} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)"
            }}>
              <Users size={20} color="#10b981" />
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Active Sessions</span>
          </div>
          <motion.div
            key={data.activeSessionCount}
            initial={{ scale: 1.2, color: "#10b981" }}
            animate={{ scale: 1, color: "var(--text-primary)" }}
            style={{ fontSize: "2.5rem", fontWeight: 700 }}
          >
            <AnimatedNumber value={data.activeSessionCount} />
          </motion.div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {data.totalSessions} total
          </div>
        </motion.div>


        <motion.div className="glass-card" whileHover={{ y: -4 }} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(59, 130, 246, 0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
            }}>
              <Target size={20} color="#3b82f6" />
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Questions</span>
          </div>
          <motion.div
            key={data.totalQuestions}
            initial={{ scale: 1.2, color: "#3b82f6" }}
            animate={{ scale: 1, color: "var(--text-primary)" }}
            style={{ fontSize: "2.5rem", fontWeight: 700 }}
          >
            <AnimatedNumber value={data.totalQuestions} />
          </motion.div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {data.totalCorrect} correct
          </div>
        </motion.div>


        <motion.div className="glass-card" whileHover={{ y: -4 }} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(168, 85, 247, 0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)"
            }}>
              <TrendingUp size={20} color="#a855f7" />
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Accuracy</span>
          </div>
          <motion.div
            key={data.accuracyRate}
            initial={{ scale: 1.2, color: "#a855f7" }}
            animate={{ scale: 1, color: "var(--text-primary)" }}
            style={{ fontSize: "2.5rem", fontWeight: 700 }}
          >
            <AnimatedNumber value={data.accuracyRate} />%
          </motion.div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {data.totalSprintCompletions} sprints done
          </div>
        </motion.div>


        <motion.div className="glass-card" whileHover={{ y: -4 }} style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(245, 158, 11, 0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)"
            }}>
              <Sparkles size={20} color="#f59e0b" />
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total XP</span>
          </div>
          <motion.div
            key={data.totalXpEarned}
            initial={{ scale: 1.2, color: "#f59e0b" }}
            animate={{ scale: 1, color: "var(--text-primary)" }}
            style={{ fontSize: "2.5rem", fontWeight: 700 }}
          >
            <AnimatedNumber value={data.totalXpEarned} />
          </motion.div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            across all sessions
          </div>
        </motion.div>
      </motion.div>


      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

        <motion.div variants={itemVariants} className="glass-card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <BarChart3 size={22} color="var(--accent-indigo)" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Topic Breakdown</h2>
          </div>

          {data.topicBreakdown.length === 0 ? (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
              No questions answered yet. Start solving challenges!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {data.topicBreakdown.map((topic, i) => {
                const color = topicColors[topic.topic] || topicColors.unknown;
                const emoji = topicEmoji[topic.topic] || topicEmoji.unknown;
                const barWidth = (topic.total / maxTopicTotal) * 100;

                return (
                  <motion.div
                    key={topic.topic}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>{emoji}</span>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "capitalize" }}>{topic.topic}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{topic.total} Q</span>
                        <span style={{
                          color: topic.accuracy >= 70 ? "#10b981" : topic.accuracy >= 40 ? "#f59e0b" : "#ef4444",
                          fontWeight: 600, fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace"
                        }}>
                          {topic.accuracy}%
                        </span>
                      </div>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.3)", borderRadius: "3px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                        style={{ height: "100%", background: color, borderRadius: "3px" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>


        <motion.div variants={itemVariants} className="glass-card" style={{ maxHeight: "450px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <Activity size={22} color="var(--accent-blue)" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Live Activity</h2>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#10b981", marginLeft: "auto"
              }}
            />
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {data.recentEvents.length === 0 ? (
              <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
                No activity yet. Start using the platform!
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {data.recentEvents.map((event, i) => {
                  const info = eventLabels[event.type] || { label: event.type, icon: <Activity size={16} />, color: "#64748b" };
                  const isCorrect = event.payload?.isCorrect;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.625rem 0.875rem",
                        background: "rgba(0,0,0,0.2)",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: `3px solid ${info.color}`,
                        fontSize: "0.85rem",
                      }}
                    >
                      <div style={{ color: info.color, flexShrink: 0 }}>
                        {info.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span>{info.label}</span>
                          {event.type === "question_answered" && (
                            isCorrect ?
                              <CheckCircle size={14} color="#10b981" /> :
                              <XCircle size={14} color="#ef4444" />
                          )}
                          {event.type === "xp_earned" && (
                            <span style={{ color: "#f59e0b", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                              +{String(event.payload.amount)}
                            </span>
                          )}
                          {Boolean(event.payload?.topic) && (
                            <span style={{
                              color: topicColors[String(event.payload.topic)] || "var(--text-muted)",
                              textTransform: "capitalize", fontSize: "0.8rem"
                            }}>
                              {String(event.payload.topic)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", flexShrink: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={12} />
                        {formatTimeAgo(event.timestamp)}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
