import { useState } from "react";

const STAGES = [
  {
    id: "kari",
    label: "仮交際",
    desc: "まだ関係を築いている段階。軽めの話題から。",
  },
  {
    id: "shinken",
    label: "真剣交際",
    desc: "結婚を前提に、具体的な暮らしの話を。",
  },
];

const THEME_SETS = {
  kari: [
    {
      id: "favorite",
      label: "好きなこと・休日の過ごし方",
      icon: "☀️",
      intro:
        "まずは気軽なテーマから。お互いの『好きなこと』や『休日の過ごし方』を知ることで、自然な会話のきっかけが見つかります。",
      question:
        "休日はどんな過ごし方が好きですか?最近楽しかったこと、好きな食べ物・場所なども教えてください。",
    },
    {
      id: "communication",
      label: "連絡のペース・スタイル",
      icon: "💬",
      intro:
        "LINEや連絡の頻度・スタイルは、人によって『普通』の感覚が大きく違います。早めに共有しておくと、誤解を防げます。",
      question:
        "普段、LINEや連絡はどのくらいの頻度・タイミングで返すのが心地よいですか?既読のタイミングや、返信が少し遅くなる時の気持ちなども教えてください。",
    },
    {
      id: "dateplan",
      label: "デート日程調整",
      icon: "📅",
      intro:
        "デートの日程調整も、実は『前提のズレ』が出やすいテーマです。曖昧な希望のままだと、お互い気を遣いすぎてしまうこともあります。今の希望を率直に書いてみてください。",
      question:
        "次回のデートについて、希望する曜日・時間帯(平日/休日、日中/夜など)、頻度の目安(週1回くらい、月2回くらいなど)を教えてください。当日の連絡(待ち合わせ確認の連絡など)についての希望もあれば教えてください。",
    },
  ],
  shinken: [
    {
      id: "money",
      label: "お金の使い方",
      icon: "💰",
      intro:
        "お金の話は『言葉の前提のズレ』が一番多いテーマです。例えば『お小遣いの中で選択する』と言っても、その範囲は人によって全く違います。まずはお互いの『今のイメージ』を、遠慮せず素直に書いてみてください。後で私が整理してお伝えします。",
      question:
        "結婚後、生活費とは別に「自分の自由に使えるお金(お小遣い)」について、どんなイメージを持っていますか?(金額の目安、何に使いたいか、貯金や投資との関係など、思いつくまま書いてください)",
    },
    {
      id: "lifestyle",
      label: "暮らし方・時間の使い方",
      icon: "🏠",
      intro:
        "平日・休日の過ごし方や、一人の時間・二人の時間のバランスは、価値観が大きく出るテーマです。『普通』の感覚は人それぞれ違うので、まずは今の生活リズムや理想のイメージを教えてください。",
      question:
        "平日と休日、それぞれどんな過ごし方が理想ですか?また「一人の時間」はどのくらい必要だと感じますか?",
    },
    {
      id: "housework",
      label: "家事・育児の分担",
      icon: "🧺",
      intro:
        "『家事をやる』という言葉も、人によって範囲が違います。例えば『洗濯をする』が、洗うところまでなのか、干してたたんで収納するまでなのか。具体的な行動レベルで言葉にしてみると、ズレが見えてきます。",
      question:
        "家事の中で「これは自分が担当したい/担当してもいいと思う」ものと、その「どこまでやる」のイメージ(例:洗濯=洗う/干す/たたむ/しまう のどこまでか)を具体的に書いてください。育児について考えていることがあれば、それも教えてください。",
    },
    {
      id: "parents",
      label: "親御さんとの付き合い方",
      icon: "👵",
      intro:
        "実家との距離感や付き合い方は、育った環境によって『当たり前』が大きく異なるテーマです。良かれと思っての行動が、相手にとっては負担に感じられることもあります。まずはお互いの『今の関係性』と『理想』を教えてください。",
      question:
        "ご自身の実家とは、現在どのくらいの頻度で連絡・訪問していますか?また結婚後、お互いの実家とどのような関係でいたいか、イメージを教えてください。",
    },
    {
      id: "hobby",
      label: "趣味の許容度",
      icon: "🎨",
      intro:
        "趣味にかける時間やお金は、本人にとっては大切なものでも、相手から見ると『そんなに?』と感じることもあります。まずは率直に、今大事にしている趣味と、それにかけている時間・お金について教えてください。",
      question:
        "今、大切にしている趣味は何ですか?それにかけている時間(週にどのくらい)やお金について、率直に教えてください。また、相手の趣味についてどこまで応援・許容できそうか、今の気持ちも聞かせてください。",
    },
  ],
};

const ROLE_COLOR = {
  A: "bg-rose-50 border-rose-200 text-rose-900",
  B: "bg-sky-50 border-sky-200 text-sky-900",
  AI: "bg-amber-50 border-amber-200 text-amber-900",
};

export default function App() {
  const [stage, setStage] = useState(null);
  const [names, setNames] = useState(null);
  const [draftNames, setDraftNames] = useState({ A: "", B: "" });
  const [theme, setTheme] = useState(null);
  const [activeRole, setActiveRole] = useState("A");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const replies = {
    A: messages.filter((m) => m.role === "A").map((m) => m.text).join("\n"),
    B: messages.filter((m) => m.role === "B").map((m) => m.text).join("\n"),
  };

  // --- ステージ選択 ---
  if (!stage) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md">
          <h1 className="text-xl font-bold text-gray-800 mb-1">AI仲人チャット</h1>
          <p className="text-sm text-gray-500 mb-6">
            今のお二人の交際ステージを選んでください。(後から変更できます)
          </p>
          <div className="space-y-3">
            {STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStage(s.id)}
                className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 transition-colors"
              >
                <p className="font-semibold text-gray-800">{s.label}</p>
                <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- ニックネーム入力 ---
  if (!names) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-gray-800">AI仲人チャット</h1>
            <button
              onClick={() => setStage(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              ステージ変更
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            お二人のニックネームを入力してください。AI仲人もこの名前で呼びます。
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-rose-600">
                女性会員さんのニックネーム
              </label>
              <input
                value={draftNames.A}
                onChange={(e) => setDraftNames((n) => ({ ...n, A: e.target.value }))}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") e.preventDefault();
                }}
                onKeyUp={(e) => e.stopPropagation()}
                placeholder="例: みっちん"
                className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-sky-600">
                男性会員さんのニックネーム
              </label>
              <input
                value={draftNames.B}
                onChange={(e) => setDraftNames((n) => ({ ...n, B: e.target.value }))}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") e.preventDefault();
                }}
                onKeyUp={(e) => e.stopPropagation()}
                placeholder="例: まっちゃん"
                className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <button
              onClick={() => {
                if (!draftNames.A.trim() || !draftNames.B.trim()) return;
                setNames({ A: draftNames.A.trim(), B: draftNames.B.trim() });
              }}
              className="w-full rounded-xl bg-gray-800 text-white text-sm font-medium py-2 hover:bg-gray-700"
            >
              はじめる
            </button>
          </div>
        </div>
      </div>
    );
  }

  const startTheme = (t) => {
    setTheme(t);
    setMessages([
      { role: "AI", text: t.intro },
      { role: "AI", text: "質問:\n" + t.question },
    ]);
    setActiveRole("A");
  };

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { role: activeRole, text: draft.trim() }]);
    setDraft("");
  };

  const undoLastMessage = () => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.role === "AI") return prev; // AIの整理結果は取り消し対象外
      return prev.slice(0, -1);
    });
  };

  const canAskAI =
    theme &&
    messages.some((m) => m.role === "A") &&
    messages.some((m) => m.role === "B") &&
    !loading;

  const askAI = async () => {
    setLoading(true);
    setError("");
    try {
      const systemPrompt = `あなたは結婚相談所のベテラン仲人AIです。お見合い・交際中の男女2名のチャットに同席し、二人が直接言いにくいことを、穏やかで温かいトーンで橋渡しします。
二人の呼び方は必ず「${names.A}」「${names.B}」というニックネームで統一してください。「女性会員さん」「彼女さん」のような言い換えは使わないでください。
役割:
1. 二人の回答に含まれる「言葉の前提のズレ」(例:同じ言葉でも指す範囲・程度が違う点)を具体的に見つける
2. その違いを、どちらも傷つかないように、お互いを尊重した言い方で言い換えて伝える
3. 共通点・良い点をまず伝え、その後で違いやすれ違いそうなポイントを伝える
4. 最後に「中間案」または「第三案」を1つ以上、具体的に提案する
5. 全体を穏やかで前向きな雰囲気で、800文字程度の日本語でまとめる。見出しや箇条書きを使って読みやすくしてよい。`;

      const userPrompt = `テーマ:${theme.label}

【${names.A}さんの回答】
${replies.A || "(まだ回答なし)"}

【${names.B}さんの回答】
${replies.B || "(まだ回答なし)"}

上記をもとに、橋渡しと中間案の提示をお願いします。`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      const data = await response.json();
      const textBlock = (data.content || []).find((c) => c.type === "text");
      const aiText = textBlock ? textBlock.text : "(応答を取得できませんでした)";

      setMessages((prev) => [...prev, { role: "AI", text: aiText }]);
    } catch (e) {
      setError("AIへの問い合わせでエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  // --- テーマ選択画面 ---
  if (!theme) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-gray-800">AI仲人チャット</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setStage(null)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                ステージ変更
              </button>
              <button
                onClick={() => {
                  setDraftNames(names);
                  setNames(null);
                }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                ニックネーム修正
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">
            {names.A} さん・{names.B} さん
          </p>
          <p className="text-xs text-gray-400 mb-6">
            現在のステージ: {STAGES.find((s) => s.id === stage)?.label}
          </p>
          <p className="text-sm text-gray-500 mb-4">話したいテーマを選んでください。</p>
          <div className="space-y-3">
            {THEME_SETS[stage].map((t) => (
              <button
                key={t.id}
                onClick={() => startTheme(t)}
                className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 flex items-center gap-3 transition-colors"
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="text-gray-800 font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- チャット画面 ---
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">
            {STAGES.find((s) => s.id === stage)?.label} / テーマ
          </p>
          <p className="font-semibold text-gray-800">
            {theme.icon} {theme.label}
          </p>
        </div>
        <button
          onClick={() => setTheme(null)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          テーマを変更
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-2xl border px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${ROLE_COLOR[m.role]}`}
          >
            <p className="text-xs font-semibold mb-1 opacity-70">
              {m.role === "AI" ? "AI仲人" : m.role === "A" ? names.A : names.B}
            </p>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="rounded-2xl border px-4 py-3 text-sm bg-amber-50 border-amber-200 text-amber-800">
            AI仲人が橋渡しを考えています...
          </div>
        )}
        {error && (
          <div className="rounded-2xl border px-4 py-3 text-sm bg-red-50 border-red-200 text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 px-4 py-3 space-y-2 bg-white">
        <div className="flex gap-2">
          {["A", "B"].map((r) => (
            <button
              key={r}
              onClick={() => setActiveRole(r)}
              className={`flex-1 text-xs font-semibold rounded-full py-2 border transition-colors ${
                activeRole === r
                  ? r === "A"
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-sky-500 text-white border-sky-500"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {r === "A" ? names.A : names.B} として入力
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`${activeRole === "A" ? names.A : names.B} としてのメッセージを入力...`}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            rows={2}
          />
          <button
            onClick={sendMessage}
            className="px-4 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-700"
          >
            送信
          </button>
        </div>
        {messages.length > 0 && messages[messages.length - 1].role !== "AI" && (
          <button
            onClick={undoLastMessage}
            className="w-full text-xs text-gray-400 hover:text-gray-600 underline"
          >
            直前の送信を取り消す
          </button>
        )}
        <button
          onClick={askAI}
          disabled={!canAskAI}
          className={`w-full rounded-xl py-2 text-sm font-semibold transition-colors ${
            canAskAI
              ? "bg-amber-400 text-white hover:bg-amber-500"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          AI仲人に橋渡しをお願いする
        </button>
        <p className="text-[10px] text-gray-400 text-center">
          ※両者の回答を送信後に押すと、AI仲人が言葉のズレを整理し、中間案を提案します
        </p>
      </div>
    </div>
  );
}
