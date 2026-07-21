import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import ProjectsBoard from './ProjectsBoard';
import { siteConfig } from "@/siteConfig";

export const metadata = {
  title: "项目矩阵 | " + siteConfig.title,
  description: "开源项目与代码仓库展示",
};

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  topics: string[];
};

function generateDescription(repo: GitHubRepo): string {
  if (repo.description) return repo.description;

  const name = repo.name.replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
  const lang = repo.language ? `基于 ${repo.language} 开发` : "";
  const topics = repo.topics.length > 0
    ? `涉及 ${repo.topics.slice(0, 3).map(t => `#${t}`).join("、")}`
    : "";

  const parts = [name, lang, topics].filter(Boolean);
  return parts.length > 1 ? parts.join("，") : `${name} — 个人开源项目`;
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch("https://api.github.com/users/jaychou4399/repos?sort=updated&per_page=30", {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    return repos.filter(r => !r.fork).slice(0, 12);
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const repos = await fetchRepos();

  const projects = repos.map(repo => ({
    id: `gh-${repo.id}`,
    name: repo.name,
    description: generateDescription(repo),
    icon: getLanguageIcon(repo.language),
    githubUrl: repo.html_url,
    tags: repo.topics.length > 0 ? repo.topics.slice(0, 4) : (repo.language ? [repo.language] : ["Code"]),
  }));

  return (
    <div className="min-h-screen relative pb-20">
      <Navbar />
      <PageTransition>
        <div className="mt-28">
          <ProjectsBoard projects={projects} />
        </div>
      </PageTransition>
    </div>
  );
}

function getLanguageIcon(lang: string | null): string {
  const icons: Record<string, string> = {
    TypeScript: "🟦", JavaScript: "🟨", Python: "🐍", Rust: "🦀",
    Go: "🔵", Java: "☕", "C++": "⚙️", C: "🔧", "C#": "🟣",
    HTML: "🟧", CSS: "🟦", Swift: "🕊️", Kotlin: "🟪",
    Dart: "🎯", Ruby: "💎", PHP: "🐘", Shell: "🐚",
  };
  return icons[lang || ""] || "📦";
}