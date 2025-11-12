import { useEffect, useState } from "react";

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

const sample = [
  {
    id: 1,
    title: "Bienvenido al foro",
    content: "Comparte tus opiniones y recomienda películas aquí.",
    tag: "general",
    author: "Admin",
    avatar: "https://i.pravatar.cc/40?u=admin",
    replies: [],
    views: 34,
    date: new Date().toISOString(),
  },
];

export default function Forum() {
  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("general");
  const [author, setAuthor] = useState(
    () => localStorage.getItem("username") || "Anon"
  );
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("forumThreads");
    if (raw) setThreads(JSON.parse(raw));
    else {
      setThreads(sample);
      localStorage.setItem("forumThreads", JSON.stringify(sample));
    }
  }, []);

  function createThread(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Completa el título y el contenido antes de publicar.");
      return;
    }
    const t = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      tag,
      author: author || "Anon",
      avatar: `https://i.pravatar.cc/40?u=${Math.floor(Math.random() * 1000)}`,
      replies: [],
      views: 0,
      date: new Date().toISOString(),
    };
    const next = [t, ...threads];
    setThreads(next);
    localStorage.setItem("forumThreads", JSON.stringify(next));
    setTitle("");
    setContent("");
    setError("");
  }

  function openThread(id) {
    const next = threads.map((t) => {
      if (t.id === id) return { ...t, views: (t.views || 0) + 1 };
      return t;
    });
    setThreads(next);
    localStorage.setItem("forumThreads", JSON.stringify(next));
    const thread = next.find((t) => t.id === id);
    setSelected(thread);
    setReplyText("");
  }

  function closeThread() {
    setSelected(null);
    setReplyText("");
  }

  function postReply(e) {
    e.preventDefault();
    if (!replyText.trim() || !selected) return;
    const reply = {
      id: Date.now(),
      author: author || "Anon",
      text: replyText.trim(),
      date: new Date().toISOString(),
    };
    const next = threads.map((t) => {
      if (t.id === selected.id) {
        const replies = Array.isArray(t.replies)
          ? [...t.replies, reply]
          : [reply];
        return { ...t, replies, views: t.views || 0 };
      }
      return t;
    });
    setThreads(next);
    localStorage.setItem("forumThreads", JSON.stringify(next));
    setSelected(next.find((t) => t.id === selected.id));
    setReplyText("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1228] to-[#12152f] text-white overflow-x-hidden">
      <div className="text-center p-4 sm:p-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold mb-6 sm:mb-10">
          FORO
        </h2>
      </div>

      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <form
          onSubmit={createThread}
          className="bg-[#0f1228]/50 backdrop-blur border border-cyan-500/30 p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 neon-glow"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <input
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                localStorage.setItem("username", e.target.value);
              }}
              placeholder="Tu nombre"
              className="bg-[#1a1f3a] border border-cyan-500/30 p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 transition-all"
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del tema"
              className="bg-[#1a1f3a] border border-cyan-500/30 p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 transition-all col-span-1 sm:col-span-2"
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full bg-[#1a1f3a] border border-cyan-500/30 p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 transition-all mb-3"
            placeholder="Escribe tu opinión o inicia un debate..."
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 justify-between">
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="bg-[#1a1f3a] border border-cyan-500/30 p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-white focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 transition-all w-full sm:w-auto"
            >
              <option value="general">General</option>
              <option value="anime">Películas</option>
              <option value="review">Director</option>
              <option value="discussion">Saga</option>
            </select>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {error ? (
                <div className="text-xs text-red-400">{error}</div>
              ) : null}
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-xs sm:text-sm font-semibold disabled:opacity-50 hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-cyan-500/50 flex-1 sm:flex-none"
                disabled={!title.trim() || !content.trim()}
              >
                Publicar
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => openThread(t.id)}
              className="bg-[#0f1228]/50 backdrop-blur border border-cyan-500/20 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 cursor-pointer hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
            >
              <img
                src={t.avatar || "/placeholder.svg"}
                alt={t.author}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-2 sm:gap-4">
                  <div className="w-full">
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      {t.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-1 line-clamp-2">
                      {t.content}
                    </p>
                  </div>
                  <div className="text-right flex flex-row sm:flex-col items-end gap-2">
                    <span className="text-xs text-cyan-400">
                      {t.views || 0} 👁
                    </span>
                    <span className="text-xs text-cyan-400">
                      {Array.isArray(t.replies) ? t.replies.length : 0} 💬
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
                    <span>{t.author}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>{timeAgo(t.date)} ago</span>
                  </div>
                  <div>
                    <span className="text-xs bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 px-2 sm:px-3 py-1 rounded-full">
                      {t.tag}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal / Thread detail */}
        {selected && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-[#0f1228] border border-cyan-500/30 max-w-2xl w-full rounded-2xl p-4 sm:p-6 text-left shadow-2xl neon-glow max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-2xl font-bold text-white">
                    {selected.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    por {selected.author} · {timeAgo(selected.date)} ago
                  </p>
                </div>
                <button
                  onClick={closeThread}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-2xl flex-shrink-0"
                >
                  ×
                </button>
              </div>

              <div className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-200 border-t border-cyan-500/20 pt-3 sm:pt-4">
                {selected.content}
              </div>

              <div className="mt-4 sm:mt-6">
                <h4 className="font-semibold text-white text-sm sm:text-base">
                  Respuestas
                </h4>
                <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4 max-h-40 sm:max-h-56 overflow-auto">
                  {(Array.isArray(selected.replies)
                    ? selected.replies
                    : []
                  ).map((r) => (
                    <div
                      key={r.id}
                      className="bg-[#1a1f3a]/50 border border-cyan-500/20 p-2 sm:p-3 rounded-lg"
                    >
                      <div className="text-xs sm:text-sm text-gray-300">
                        {r.text}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 sm:mt-2">
                        {r.author} · {timeAgo(r.date)} ago
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={postReply}
                  className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2"
                >
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    className="flex-1 bg-[#1a1f3a] border border-cyan-500/30 p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-cyan-500/50"
                  >
                    Responder
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
