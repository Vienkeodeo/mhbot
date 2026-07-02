import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowLeftRight,
  BarChart3,
  Bell,
  Blocks,
  Bot,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Circle,
  ClipboardList,
  Copy,
  CreditCard,
  Crown,
  Download,
  Edit3,
  FileText,
  Folder,
  Globe2,
  Hash,
  Image,
  LayoutDashboard,
  Layers,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Phone,
  Pin,
  Plus,
  Reply,
  Search,
  Send,
  Settings,
  Shield,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Tags,
  Trash2,
  Type,
  UploadCloud,
  UserPlus,
  UserRoundPlus,
  Users,
  UsersRound,
  X,
  Zap
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "employees", label: "Nhân viên", icon: Users },
  { id: "integrations", label: "Tích hợp", icon: Blocks },
  { id: "tags", label: "Thẻ", icon: Tags },
  { id: "ai", label: "AI Agent", icon: Bot },
  { id: "settings", label: "Cài đặt", icon: Settings }
];

const conversations = [
  {
    id: "vip",
    title: "VIP - Support 1-1 AI",
    avatar: "VIP",
    channel: "Zalo cá nhân",
    account: "Tài khoản mẫu",
    time: "58 phút",
    preview: "Minh Anh: KHÓA HỌC SOLO (Doanh n...",
    unread: true,
    members: 6,
    tag: null,
    color: "red"
  },
  {
    id: "lunch",
    title: "ĐẶT CƠM Văn Phòng - Bếp A",
    avatar: "COM",
    channel: "Zalo cá nhân",
    account: "Tài khoản mẫu",
    time: "1 giờ",
    preview: "Lan: [Hình ảnh]",
    unread: true,
    members: 42,
    tag: null,
    color: "gold"
  },
  {
    id: "shorts",
    title: "v-shorts : thảo luận góp ý",
    avatar: "VS",
    channel: "Zalo cá nhân",
    account: "Tài khoản mẫu",
    time: "1 giờ",
    preview: "Anh Dũng: ok",
    unread: true,
    members: 18,
    tag: null,
    color: "violet"
  },
  {
    id: "family",
    title: "Cơm Nhà",
    avatar: "CN",
    channel: "Zalo cá nhân",
    account: "Tài khoản mẫu",
    time: "3 giờ",
    preview: "Thùy Ly: Cả Nhà Ơi Hôm Nay có ❤...",
    unread: true,
    members: 11,
    tag: null,
    color: "lime"
  },
  {
    id: "community",
    title: "CỘNG ĐỒNG KINDTECH",
    avatar: "KT",
    channel: "Zalo cá nhân",
    account: "Tài khoản mẫu",
    time: "15 giờ",
    preview: "Phước Lợi: [Hình ảnh]",
    unread: true,
    members: 74,
    tag: null,
    color: "teal"
  },
  {
    id: "zoom",
    title: "VINALINK - DMPK214 ZOOM",
    avatar: "VL",
    channel: "Zalo cá nhân",
    account: "Tài khoản mẫu",
    time: "19 giờ",
    preview: "Bùi Lực: Hôm trước đã hướng dẫn...",
    unread: true,
    members: 29,
    tag: null,
    color: "rose"
  },
  {
    id: "food",
    title: "Nhóm đồ ăn",
    avatar: "N",
    channel: "Zalo cá nhân",
    account: "Tài khoản mẫu",
    time: "1 ngày",
    preview: "Bùi Cao Thành: Dạ vâng chị ạ, sau em ...",
    unread: true,
    members: 9,
    tag: null,
    color: "pink"
  },
  {
    id: "rental",
    title: "MH RenTal",
    avatar: "MH",
    channel: "Zalo cá nhân",
    account: "Tài khoản mẫu",
    time: "1 ngày",
    preview: "Zalo: ⏰ Dọn kho bãi công...",
    unread: true,
    members: 4,
    tag: "Công việc",
    color: "orange"
  }
];

const baseMessages = [
  {
    id: "m1",
    sender: "Ngô Quý Hoàn",
    avatar: "NQ",
    text: "Đây a nhé",
    note: "Tin nhắn đã được thu hồi",
    time: "12:51"
  },
  {
    id: "m2",
    sender: "Tuấn Hà",
    avatar: "TH",
    text:
      "KHÓA HỌC SOLO (Doanh nghiệp 1 người bằng AI) sẽ khai giảng online 30/6\nLịch cập nhật tại https://khoahocsolo.com.\n-----------\nKHÁCH SVIP Vinalink, VIP vĩ mô, Cao Phong...sẽ được học miễn phí (Không cần cọc) và vào các nhóm sau để nhận link zoom các buổi học.\n-----------\nCác anh chị VIP muốn học miễn phí có 2 cách\n1) Đăng ký tại https://khoahocsolo.com và đặt cọc 2 tr, theo quy chế học tập có kỷ luật cho nghiêm túc.\n2) Đăng ký tại đây nâng SVIP sẽ được miễn cọc, miễn kỷ luật và được học tối đa 2 người.",
    time: "10:09",
    long: true
  }
];

const tagRows = [
  ["Tất cả - Tài khoản mẫu - Zalo", "#000000"],
  ["Khách hàng", "#D91B1B"],
  ["Gia đình", "#F31BC8"],
  ["Công việc", "#FF6905"],
  ["Bạn bè", "#FAC000"],
  ["Trả lời sau", "#4BC377"],
  ["Đồng nghiệp", "#0068FF"]
];

const members = [
  ["Ngô Quý Hoàn", ""],
  ["Tuấn Hà", ""],
  ["Trần Lâm Vinalink", "Trưởng nhóm"],
  ["Bạn", ""],
  ["Bùi Thuỳ Lực", ""],
  ["Hà Nguyệt Thu", ""]
];

const zaloPersonalResearch = [
  {
    name: "zca-js",
    package: "zca-js@2.1.2",
    fit: "Adapter ưu tiên",
    note: "Unofficial Zalo personal API cho JavaScript, phù hợp đặt ở backend để tạo QR/session."
  },
  {
    name: "openzca",
    package: "openzca@0.1.59",
    fit: "CLI tương thích zca",
    note: "CLI open-source tương thích ZCA, yêu cầu Node >= 22.13, hợp cho worker/bridge riêng."
  },
  {
    name: "Zalo OA OpenAPI",
    package: "Official",
    fit: "Kênh chính thức",
    note: "Dùng cho Official Account; không cung cấp QR login cho tài khoản Zalo cá nhân."
  }
];

const zaloQrSession = {
  endpoint: "/api/integrations/zalo-personal/qr-session",
  statusEndpoint: "/api/integrations/zalo-personal/qr-session/:id",
  webhook: "/api/integrations/zalo-personal/webhook",
  storage: "Server-side encrypted session store"
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") &&
  window.location.port === "5173"
    ? "http://127.0.0.1:8787"
    : "");

const SSE_URL = `${API_BASE_URL}/api/integrations/zalo-personal/stream`;

function formatZaloTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatZaloRelative(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60_000) return "Vừa xong";
  if (diffMs < 60 * 60_000) return `${Math.floor(diffMs / 60_000)} phút`;
  if (diffMs < 24 * 60 * 60_000) return `${Math.floor(diffMs / (60 * 60_000))} giờ`;
  return `${Math.floor(diffMs / (24 * 60 * 60_000))} ngày`;
}

function deriveAvatarTone(label) {
  const tones = ["blue", "teal", "red", "gold", "violet", "lime", "rose", "pink", "orange"];
  if (!label) return tones[0];
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash * 31 + label.charCodeAt(i)) | 0;
  }
  return tones[Math.abs(hash) % tones.length];
}

function deriveInitials(name) {
  if (!name) return "?";
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const segments = trimmed.split(/\s+/).filter(Boolean);
  if (segments.length === 1) return segments[0].slice(0, 2).toUpperCase();
  return (segments[0][0] + segments[segments.length - 1][0]).toUpperCase();
}

function mapConversationApi(row) {
  const displayName = row.name || row.accountDisplayName || "Hội thoại";
  // Parse sticker preview if lastMessagePreview is JSON with sticker structure
  let preview = row.lastMessagePreview || "Chưa có tin nhắn";
  if (preview.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(preview);
      if (parsed && parsed.id && parsed.catId) {
        preview = "[Sticker]";
      }
    } catch {}
  }
  return {
    id: row.id,
    apiId: row.id,
    accountId: row.accountId,
    accountDisplayName: row.accountDisplayName,
    title: displayName,
    avatar: deriveInitials(displayName),
    channel: row.threadType === "group" ? "Zalo nhóm" : "Zalo cá nhân",
    account: row.accountDisplayName || "Tài khoản Zalo",
    avatarUrl: row.avatar,
    accountAvatarUrl: row.accountAvatar,
    time: formatZaloRelative(row.lastMessageAt),
    timestamp: row.lastMessageAt || row.updatedAt,
    preview,
    unread: (row.unreadCount || 0) > 0,
    unreadCount: row.unreadCount || 0,
    members: row.memberCount || (row.threadType === "group" ? 2 : 2),
    tag: null,
    color: deriveAvatarTone(displayName),
    threadId: row.threadId,
    threadType: row.threadType,
    lastMessageAt: row.lastMessageAt
  };
}

function mapMessageApi(row) {
  // Parse sticker data if content is JSON with sticker structure
  let sticker = null;
  const content = row.content || "";
  if (content.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(content);
      if (parsed && parsed.id && parsed.catId) {
        sticker = parsed;
      }
    } catch {}
  }

  return {
    id: row.id,
    apiId: row.id,
    senderId: row.senderId,
    senderName: row.senderName,
    avatar: deriveInitials(row.senderName || row.senderId || "?"),
    text: sticker ? "" : content,
    time: formatZaloTime(row.ts),
    timestamp: row.ts,
    outgoing: row.isSelf,
    isSelf: row.isSelf,
    status: row.status,
    msgType: row.msgType,
    quote: row.quote || null,
    sticker,
    raw: row
  };
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || payload.detail || "Không thể gọi API backend.");
  }
  return payload;
}

function useZaloStream({ onMessage, onConnect, onDisconnect } = {}) {
  useEffect(() => {
    if (!SSE_URL) return undefined;
    let source;
    let closedByClient = false;
    let retryTimer = null;

    const connect = () => {
      try {
        source = new EventSource(SSE_URL);
      } catch (error) {
        if (!closedByClient) {
          retryTimer = window.setTimeout(connect, 4_000);
        }
        return;
      }

      const handleReady = () => onConnect?.();
      const handleMessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          onMessage?.(payload);
        } catch (error) {
          console.warn("stream payload error", error);
        }
      };
      const handlePing = () => {};

      source.addEventListener("ready", handleReady);
      source.addEventListener("message", handleMessage);
      source.addEventListener("ping", handlePing);
      source.onerror = () => {
        onDisconnect?.();
        if (closedByClient) return;
        if (source) {
          source.close();
          source = null;
        }
        retryTimer = window.setTimeout(connect, 4_000);
      };
    };

    connect();

    return () => {
      closedByClient = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      if (source) source.close();
      onDisconnect?.();
    };
  }, []);
}

function App() {
  const [page, setPage] = useState("chat");
  const [settingsSection, setSettingsSection] = useState("info");
  const [utilityModal, setUtilityModal] = useState(null);
  const [toast, setToast] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  if (page === "org") {
    return <OrganizationPicker onEnter={() => setPage("chat")} />;
  }

  const openPage = (id) => {
    setPage(id);
    if (id !== "settings") setSettingsSection("info");
  };

  const openBilling = () => {
    setPage("settings");
    setSettingsSection("billing");
  };

  return (
    <div className="app">
      <TopBar
        active={page}
        onNavigate={openPage}
        onOrg={() => setPage("org")}
        onBilling={openBilling}
        onInstall={() => notify("Ứng dụng đã sẵn sàng để cài đặt trên trình duyệt.")}
      />
      <SideRail
        active={page}
        onChat={() => setPage("chat")}
        onOpenUtility={setUtilityModal}
        unreadCount={unreadCount}
      />
      <main className={`workspace ${page === "chat" ? "workspace-chat" : ""}`}>
        {page === "chat" && <ChatPage onNotify={notify} onUnreadCountChange={setUnreadCount} />}
        {page === "dashboard" && <DashboardPage onNavigate={openPage} />}
        {page === "employees" && <EmployeesPage onNotify={notify} />}
        {page === "integrations" && <IntegrationsPage onNotify={notify} />}
        {page === "tags" && <TagsPage onNotify={notify} />}
        {page === "ai" && <AIPage onNotify={notify} />}
        {page === "settings" && (
          <SettingsPage
            section={settingsSection}
            onBilling={openBilling}
            onNotify={notify}
          />
        )}
      </main>
      {toast && <div className="toast">{toast}</div>}
      {utilityModal && (
        <UtilityModal
          type={utilityModal}
          onClose={() => setUtilityModal(null)}
          onNotify={notify}
        />
      )}
    </div>
  );
}

function TopBar({ active, onNavigate, onOrg, onBilling, onInstall }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate("chat")}>
        <Logo />
      </button>
      <nav className="main-nav" aria-label="Chính">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-button ${active === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
              title={item.label}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="top-actions">
        <div className="org-pill">
          <Building2 size={18} />
          <span>
            <small>Tổ chức</small>
            MH power
          </span>
          <button className="round-icon" onClick={onOrg} title="Đổi tổ chức">
            <ArrowLeftRight size={17} />
          </button>
        </div>
        <button className="primary-pill" onClick={onBilling}>
          <CreditCard size={17} />
          Nâng cấp gói
        </button>
        <button className="install-pill" onClick={onInstall}>
          <Download size={17} />
          Cài đặt Ứng dụng
        </button>
      </div>
    </header>
  );
}

function SideRail({ active, onChat, onOpenUtility, unreadCount }) {
  return (
    <aside className="side-rail">
      <div className="rail-avatar">H</div>
      <button
        className={`rail-button ${active === "chat" ? "selected" : ""}`}
        onClick={onChat}
        title="Chat"
      >
        <MessageSquare size={21} />
        {unreadCount > 0 && <b>{unreadCount}</b>}
      </button>
      <button className="rail-button" title="Danh bạ" onClick={() => onOpenUtility("contacts")}>
        <UsersRound size={21} />
      </button>
      <button className="rail-button" title="Tệp" onClick={() => onOpenUtility("files")}>
        <ClipboardList size={21} />
      </button>
      <button className="rail-button" title="Kho dữ liệu" onClick={() => onOpenUtility("data")}>
        <Layers size={22} />
      </button>
      <div className="rail-divider" />
      <div className="rail-bottom">
        <button className="rail-logout" title="Đăng xuất" onClick={() => onOpenUtility("logout")}>
          <LogOut size={20} />
        </button>
        <span>v1.0.2</span>
      </div>
    </aside>
  );
}

function Logo() {
  return (
    <span className="logo-lockup">
      <span className="logo-bot">MH</span>
      <strong>AiChat</strong>
    </span>
  );
}

function ChatPage({ onNotify, onUnreadCountChange }) {
  const [selectedId, setSelectedId] = useState("");
  const [listFilter, setListFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [advancedTags, setAdvancedTags] = useState([]);
  const [archivedIds, setArchivedIds] = useState([]);
  const [takeoverIds, setTakeoverIds] = useState([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [streamStatus, setStreamStatus] = useState("connecting");
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");
  const [listenerInfo, setListenerInfo] = useState([]);

  useEffect(() => {
    const count = conversations.filter((c) => c.unread).reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    onUnreadCountChange?.(count);
  }, [conversations, onUnreadCountChange]);

  const fetchConversations = useCallback(async () => {
    try {
      const payload = await apiRequest("/api/integrations/zalo-personal/conversations");
      const items = (payload.conversations || []).map(mapConversationApi);
      setConversations(items);
      setListError("");
    } catch (error) {
      setListError(error.message);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchListeners = useCallback(async () => {
    try {
      const payload = await apiRequest("/api/integrations/zalo-personal/listeners");
      setListenerInfo(payload.listeners || []);
    } catch (error) {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    fetchListeners();
  }, [fetchConversations, fetchListeners]);

  useZaloStream({
    onConnect: () => setStreamStatus("live"),
    onDisconnect: () => setStreamStatus("reconnecting"),
    onMessage: (payload) => {
      if (!payload?.accountId) return;
      // Parse sticker data for preview display
      let preview = payload.content || "[Tin nhắn mới]";
      if (preview.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(preview);
          if (parsed && parsed.id && parsed.catId) {
            preview = "[Sticker]";
          }
        } catch {}
      }
      const incomingPreview = payload.content
        ? `${payload.isSelf ? "Bạn" : payload.senderName}: ${preview}`
        : "[Tin nhắn mới]";
      setConversations((items) => {
        const existingIndex = items.findIndex((item) => item.id === payload.conversationId);
        if (existingIndex === -1) {
          const newConv = {
            id: payload.conversationId,
            apiId: payload.conversationId,
            accountId: payload.accountId,
            title: payload.senderName || payload.threadId,
            avatar: deriveInitials(payload.senderName || payload.threadId),
            channel: payload.threadType === "group" ? "Zalo nhóm" : "Zalo cá nhân",
            account: listenerInfo.find((item) => item.accountId === payload.accountId)?.displayName || "Tài khoản Zalo",
            time: "Vừa xong",
            timestamp: payload.ts,
            preview: incomingPreview,
            unread: !payload.isSelf,
            unreadCount: 1,
            members: 2,
            tag: null,
            color: deriveAvatarTone(payload.senderName || payload.threadId),
            threadId: payload.threadId,
            threadType: payload.threadType,
            lastMessageAt: payload.ts
          };
          return [newConv, ...items];
        }
        const next = [...items];
        const target = next[existingIndex];
        next[existingIndex] = {
          ...target,
          preview: incomingPreview,
          time: "Vừa xong",
          timestamp: payload.ts,
          lastMessageAt: payload.ts,
          unread: !payload.isSelf && target.id !== selectedId ? true : target.unread,
          unreadCount: !payload.isSelf
            ? (target.unreadCount || 0) + (target.id === selectedId ? 0 : 1)
            : target.unreadCount || 0
        };
        const [moved] = next.splice(existingIndex, 1);
        next.unshift(moved);
        return next;
      });
    }
  });

  const selected = useMemo(
    () => conversations.find((item) => item.id === selectedId),
    [conversations, selectedId]
  );

  useEffect(() => {
    if (!selected && conversations.length) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selected]);

  const filtered = useMemo(() => {
    let rows = conversations.filter((item) => !archivedIds.includes(item.id));
    if (listFilter === "unread") rows = rows.filter((item) => item.unread);
    if (listFilter === "takeover") rows = conversations.filter((item) => takeoverIds.includes(item.id));
    if (listFilter === "archive") rows = conversations.filter((item) => archivedIds.includes(item.id));
    if (advancedTags.length) {
      rows = rows.filter((item) => item.tag && advancedTags.includes(item.tag));
    }
    if (query.trim()) {
      const text = query.toLowerCase();
      rows = rows.filter(
        (item) =>
          item.title.toLowerCase().includes(text) ||
          (item.preview || "").toLowerCase().includes(text)
      );
    }
    return rows;
  }, [advancedTags, archivedIds, conversations, listFilter, query, takeoverIds]);

  const archiveConversation = (id) => {
    setArchivedIds((items) => (items.includes(id) ? items : [...items, id]));
    setTakeoverIds((items) => items.filter((item) => item !== id));
    if (selectedId === id) setSelectedId(conversations.find((item) => item.id !== id)?.id || "");
    onNotify("Đã lưu trữ hội thoại.");
  };

  const markTakeover = (id) => {
    setTakeoverIds((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
    onNotify("Đã cập nhật trạng thái cần tiếp quản.");
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    setConversations((items) =>
      items.map((item) =>
        item.id === id ? { ...item, unread: false, unreadCount: 0 } : item
      )
    );
    apiRequest(`/api/integrations/zalo-personal/conversations/${encodeURIComponent(id)}/read`, {
      method: "POST"
    }).catch(() => {});
  };

  const liveListenerIds = useMemo(
    () =>
      listenerInfo
        .filter((item) => item.listener && item.listener.status === "connected")
        .map((item) => item.accountId),
    [listenerInfo]
  );

  return (
    <div className="chat-shell">
      <section className="conversation-panel">
        <div className="conversation-tools">
          <div className="search-field">
            <Search size={18} />
            <input
              placeholder="Tìm kiếm ..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Xóa tìm kiếm">
                <X size={15} />
              </button>
            )}
          </div>
          <IconButton
            label="Gửi lời mời kết bạn Zalo"
            onClick={() => setModal("invite")}
          >
            <UserPlus size={18} />
          </IconButton>
          <IconButton label="Tạo nhóm Zalo" onClick={() => setModal("group")}>
            <UsersRound size={18} />
          </IconButton>
          <button className="account-filter" onClick={() => setModal("account")}>
            <SlidersHorizontal size={17} />
            Tài khoản
            <b>{liveListenerIds.length || 1}</b>
          </button>
        </div>
        <div className="list-tabs">
          {[
            ["all", "Tất cả"],
            ["unread", "Chưa đọc"],
            ["takeover", "Cần tiếp quản"],
            ["archive", "Lưu trữ"]
          ].map(([id, label]) => (
            <button
              key={id}
              className={listFilter === id ? "active" : ""}
              onClick={() => setListFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="advanced-filter">
          <button onClick={() => setAdvancedOpen((value) => !value)}>
            <SlidersHorizontal size={16} />
            Bộ lọc nâng cao
            <ChevronDown size={16} />
          </button>
          {advancedOpen && (
            <AdvancedFilter
              selected={advancedTags}
              onToggle={(tag) =>
                setAdvancedTags((items) =>
                  items.includes(tag) ? items.filter((item) => item !== tag) : [...items, tag]
                )
              }
              onClear={() => setAdvancedTags([])}
            />
          )}
        </div>
        <div
          className="api-status"
          style={{ margin: "8px 16px 0" }}
          data-status={streamStatus}
        >
          {streamStatus === "live"
            ? `Đang nghe live từ ${liveListenerIds.length} tài khoản Zalo`
            : streamStatus === "reconnecting"
              ? "Mất kết nối stream, đang thử lại..."
              : "Đang kết nối stream tới backend..."}
        </div>
        <div className="conversation-list">
          {loadingList ? (
            <div className="list-empty spinner-empty"><span className="spinner" /></div>
          ) : listError ? (
            <div className="list-empty">
              <Bell size={26} />
              <p>{listError}</p>
              <button className="primary-action" onClick={fetchConversations}>Thử lại</button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyList type={listFilter} />
          ) : (
            filtered.map((item) => (
              <ConversationRow
                key={item.id}
                item={item}
                selected={selectedId === item.id}
                onClick={() => handleSelect(item.id)}
                onArchive={() => archiveConversation(item.id)}
                onTakeover={() => markTakeover(item.id)}
                takeover={takeoverIds.includes(item.id)}
              />
            ))
          )}
        </div>
      </section>
      <section className="chat-panel">
        {selected ? (
          <ChatDetail
            conversation={selected}
            onClassify={() => setModal("classify")}
            onDrawer={setDrawer}
            onNotify={onNotify}
            liveListener={listenerInfo.find((item) => item.accountId === selected.accountId)}
          />
        ) : (
          <EmptyChat />
        )}
      </section>
      {modal === "account" && (
        <AccountModal
          onClose={() => setModal(null)}
          onNotify={onNotify}
          listeners={listenerInfo}
          onRefresh={fetchListeners}
        />
      )}
      {modal === "invite" && <InviteModal onClose={() => setModal(null)} onNotify={onNotify} />}
      {modal === "group" && <GroupModal onClose={() => setModal(null)} onNotify={onNotify} />}
      {modal === "classify" && <ClassifyModal onClose={() => setModal(null)} onNotify={onNotify} />}
      {drawer && (
        <ChatDrawer
          mode={drawer}
          onClose={() => setDrawer(null)}
          onChangeMode={setDrawer}
          onNotify={onNotify}
        />
      )}
    </div>
  );
}

function IconButton({ label, onClick, children }) {
  return (
    <button className="icon-button" aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  );
}

function ConversationRow({ item, selected, onClick, onArchive, onTakeover, takeover }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`conversation-row ${selected ? "selected" : ""}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <Avatar label={item.avatar} tone={item.color} />
      <span className="zalo-badge">Zalo</span>
      <span className="conversation-main">
        <strong>{item.title}</strong>
        <small>{item.account}</small>
        <em>{item.preview}</em>
        {item.tag && <mark>{item.tag}</mark>}
      </span>
      <span className="conversation-time">{item.time}</span>
      {item.unread && <span className="unread-dot" />}
      {takeover && <span className="takeover-badge">Tiếp quản</span>}
      <span
        className="row-more row-action-trigger"
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          setMenuOpen((value) => !value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            setMenuOpen((value) => !value);
          }
        }}
      >
        <MoreVertical size={16} />
      </span>
      {menuOpen && (
        <span className="row-action-menu" onClick={(event) => event.stopPropagation()}>
          <span
            role="button"
            tabIndex={0}
            onClick={onTakeover}
          >
            <UserRoundPlus size={14} />
            {takeover ? "Bỏ tiếp quản" : "Cần tiếp quản"}
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={onArchive}
          >
            <Folder size={14} />
            Lưu trữ
          </span>
        </span>
      )}
    </div>
  );
}

function AdvancedFilter({ selected, onToggle, onClear }) {
  return (
    <div className="advanced-popover">
      <div className="filter-title">
        <span><Tags size={15} /> Thẻ</span>
        <button onClick={onClear}>Xóa lọc</button>
      </div>
      {[
        ["Bạn bè", "#FAC000"],
        ["Công việc", "#FF6905"],
        ["Đồng nghiệp", "#0068FF"],
        ["Gia đình", "#F31BC8"],
        ["Khách hàng", "#D91B1B"],
        ["Trả lời sau", "#4BC377"]
      ].map(([label, color]) => (
        <label key={label} className="check-row">
          <input
            type="checkbox"
            checked={selected.includes(label)}
            onChange={() => onToggle(label)}
          />
          <span style={{ background: color }} />
          {label}
        </label>
      ))}
    </div>
  );
}

function EmptyList({ type }) {
  if (type === "archive") {
    return (
      <div className="list-empty">
        <Folder size={28} />
        <p>Không có hội thoại nào đã lưu trữ</p>
      </div>
    );
  }
  if (type === "takeover") {
    return (
      <div className="list-empty">
        <UsersRound size={28} />
        <p>Không có hội thoại cần tiếp quản</p>
      </div>
    );
  }
  return (
    <div className="list-empty spinner-empty">
      <span className="spinner" />
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="empty-chat">
      <MessageSquare size={56} />
      <h3>Chưa có cuộc trò chuyện nào</h3>
      <p>Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin</p>
      <small>Sẵn sàng kết nối và trò chuyện</small>
    </div>
  );
}

function ChatDetail({ conversation, onClassify, onDrawer, onNotify, liveListener }) {
  const [draft, setDraft] = useState("");
  const [formatOpen, setFormatOpen] = useState(false);
  const [formatState, setFormatState] = useState({ bold: false, italic: false, underline: false });
  const [quickOpen, setQuickOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [pollOpen, setPollOpen] = useState(false);
  const [pollSettings, setPollSettings] = useState(false);
  const [replyPreview, setReplyPreview] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [messageMenu, setMessageMenu] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [reactions, setReactions] = useState({});
  const [pinned, setPinned] = useState(null);
  const [sent, setSent] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setMessages([]);
    setReactions({});
    setReplyPreview(null);
    setSent([]);
    if (!conversation?.apiId) return undefined;
    setLoadingMessages(true);
    setMessagesError("");
    apiRequest(`/api/integrations/zalo-personal/conversations/${encodeURIComponent(conversation.apiId)}/messages`)
      .then((payload) => {
        if (cancelled) return;
        setMessages((payload.messages || []).map(mapMessageApi));
      })
      .catch((error) => {
        if (cancelled) return;
        setMessagesError(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, [conversation?.apiId]);

  useZaloStream({
    onMessage: (payload) => {
      if (!payload?.conversationId || payload.conversationId !== conversation?.apiId) return;
      if (payload.duplicate) return;
      setMessages((items) => {
        if (items.some((item) => item.id === payload.messageId)) return items;
        return [
          ...items,
          mapMessageApi({
            id: payload.messageId,
            accountId: payload.accountId,
            conversationId: payload.conversationId,
            cliMsgId: payload.messageId,
            threadId: payload.threadId,
            threadType: payload.threadType,
            senderId: payload.senderId,
            senderName: payload.senderName,
            isSelf: payload.isSelf,
            content: payload.content,
            ts: payload.ts
          })
        ];
      });
    }
  });

  const sendMessage = () => {
    if (!draft.trim() && !replyPreview) return;
    onNotify("Tin nhắn sẽ được gửi qua giao thức thật của Zalo khi bật webhook gửi.");
    setSent((items) => [
      ...items,
      {
        id: `sent-${Date.now()}`,
        text: draft.trim() || "👍",
        time: "Vừa xong",
        color: selectedColor,
        format: formatState
      }
    ]);
    setDraft("");
    setReplyPreview(null);
  };

  const addTimelineItem = (item) => {
    setSent((items) => [...items, { id: `sent-${Date.now()}`, time: "Vừa xong", ...item }]);
  };

  const chooseReaction = (messageId, emoji) => {
    setReactions((items) => ({ ...items, [messageId]: emoji }));
    setReaction(null);
    onNotify(`Đã thả cảm xúc ${emoji}.`);
  };

  const toggleFormat = (key) => {
    setFormatState((state) => ({ ...state, [key]: !state[key] }));
  };

  const messageRows = messages.length ? messages : sent.length ? null : [];

  return (
    <>
      <header className="chat-header">
        <Avatar
          label={conversation.avatar}
          tone={conversation.color}
          large
        />
        <strong>{conversation.title}</strong>
        <small>{conversation.members} thành viên • {conversation.channel}</small>
        <div className="chat-header-actions">
          {liveListener && (
            <span
              className={`online-pill ${liveListener.listener?.status || "stopped"}`}
              title={liveListener.listener?.lastError || liveListener.listener?.status}
            >
              <span className="online-dot" /> {labelForListener(liveListener.listener?.status)}
            </span>
          )}
          <IconButton label="Phân loại hội thoại" onClick={onClassify}>
            <SlidersHorizontal size={18} />
          </IconButton>
          <IconButton label="Nhật ký hoạt động AI" onClick={() => onDrawer("ai-log")}>
            <Activity size={18} />
          </IconButton>
          <IconButton label="Phân tích hội thoại" onClick={() => onDrawer("analysis")}>
            <ClipboardList size={18} />
          </IconButton>
          <IconButton label="Thông tin hội thoại" onClick={() => onDrawer("info")}>
            <MoreVertical size={18} />
          </IconButton>
        </div>
      </header>
      <div className="message-canvas">
        {loadingMessages ? (
          <div className="list-empty spinner-empty"><span className="spinner" /></div>
        ) : messagesError ? (
          <div className="list-empty">
            <Bell size={26} />
            <p>{messagesError}</p>
          </div>
        ) : (
          <>
            {!messages.length && !sent.length && (
              <div className="empty-chat">
                <MessageSquare size={28} />
                <p>Hội thoại này chưa nhận được tin nhắn nào từ Zalo.</p>
                <small>Listener sẽ đẩy tin nhắn thật vào đây khi bạn nhắn với tài khoản Zalo đã kết nối.</small>
              </div>
            )}
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isConsecutive = prevMessage && prevMessage.outgoing === message.outgoing;
              return (
                <div
                  className={`message-line ${message.outgoing ? "outgoing" : ""} ${isConsecutive ? "consecutive" : ""}`}
                  key={message.id}
                  onMouseEnter={() => setHovered(message.id)}
                  onMouseLeave={() => {
                    setHovered(null);
                    setMessageMenu(null);
                    setReaction(null);
                  }}
                >
                  {!message.outgoing && !isConsecutive && <Avatar label={message.avatar} tone={deriveAvatarTone(message.senderName || message.senderId)} />}
                  <div className={`message-bubble ${message.outgoing ? "outgoing-bubble" : ""}`}>
                    {!message.outgoing && !isConsecutive && <small>{message.senderName || message.senderId}</small>}
                    {message.sticker ? (
                      <img
                        src={`https://stickers.zaloapp.com/sticker/${message.sticker.catId}/${message.sticker.id}.png`}
                        alt="sticker"
                        className="sticker-image"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <p>{message.text}</p>
                    )}
                    {pinned === message.id && <mark className="inline-status">Đã ghim</mark>}
                    {reactions[message.id] && <span className="message-reaction">{reactions[message.id]}</span>}
                    <time>{message.time}</time>
                  </div>
                  {hovered === message.id && (
                    <div className="message-actions">
                      <button onClick={() => setReaction(reaction === message.id ? null : message.id)}>
                        <Smile size={16} />
                      </button>
                      <button onClick={() => setReplyPreview(message)}>
                        <Reply size={16} />
                      </button>
                      <button onClick={() => setMessageMenu(messageMenu === message.id ? null : message.id)}>
                        <MoreVertical size={16} />
                      </button>
                      {messageMenu === message.id && (
                        <div className="message-menu">
                          <button onClick={() => onNotify("Đã sao chép nội dung tin nhắn.")}>
                            <Copy size={15} />
                            Sao chép
                          </button>
                          <button
                            onClick={() => {
                              setPinned(message.id);
                              setMessageMenu(null);
                              onNotify("Đã ghim tin nhắn trong hội thoại.");
                            }}
                          >
                            <Pin size={15} />
                            Ghim tin nhắn
                          </button>
                        </div>
                      )}
                      {reaction === message.id && (
                        <div className="reaction-menu">
                          {["👍", "❤️", "😂", "😮", "😢"].map((emoji) => (
                            <button key={emoji} onClick={() => chooseReaction(message.id, emoji)}>{emoji}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {sent.map((item) => (
              <div className="message-line outgoing" key={item.id}>
                <div className={`message-bubble outgoing-bubble ${item.kind === "poll" ? "poll-bubble" : ""}`}>
                  {item.kind === "attachment" && <strong>{item.title}</strong>}
                  {item.kind === "poll" && <strong>{item.title}</strong>}
                  <p
                    style={{
                      color: item.color === "Black" ? undefined : item.color?.toLowerCase(),
                      fontWeight: item.format?.bold ? 800 : undefined,
                      fontStyle: item.format?.italic ? "italic" : undefined,
                      textDecoration: item.format?.underline ? "underline" : undefined
                    }}
                  >
                    {item.text}
                  </p>
                  <time>{item.time}</time>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="composer">
        <div className="composer-tools">
          <IconButton label="Tạo bình chọn" onClick={() => setPollOpen(true)}>
            <BarChart3 size={18} />
          </IconButton>
          <IconButton label="Gửi hình ảnh" onClick={() => setAttachment("image")}>
            <Image size={18} />
          </IconButton>
          <IconButton label="Đính kèm file" onClick={() => setAttachment("file")}>
            <Paperclip size={18} />
          </IconButton>
          <IconButton label="Định dạng tin nhắn" onClick={() => setFormatOpen((v) => !v)}>
            <Type size={18} />
          </IconButton>
          <IconButton label="Trả lời nhanh" onClick={() => setQuickOpen((v) => !v)}>
            <MessageSquare size={18} />
          </IconButton>
        </div>
        {formatOpen && (
          <div className="format-row">
            <button
              className={`format-bold ${formatState.bold ? "active" : ""}`}
              onClick={() => toggleFormat("bold")}
            >
              B
            </button>
            <button
              className={`format-italic ${formatState.italic ? "active" : ""}`}
              onClick={() => toggleFormat("italic")}
            >
              I
            </button>
            <button
              className={`format-underline ${formatState.underline ? "active" : ""}`}
              onClick={() => toggleFormat("underline")}
            >
              U
            </button>
            <button onClick={() => setColorOpen((v) => !v)}>
              <Sparkles size={17} />
            </button>
            {colorOpen && (
              <div className="color-menu">
                {["Black", "Green", "Blue", "Orange", "Red", "Yellow"].map((color) => (
                  <button
                    key={color}
                    className={selectedColor === color ? "active" : ""}
                    onClick={() => {
                      setSelectedColor(color);
                      setColorOpen(false);
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
            <small>Áp dụng cho tin nhắn mới</small>
          </div>
        )}
        {replyPreview && (
          <div className="reply-preview">
            <Reply size={15} />
            <span>
              <strong>Trích dẫn {replyPreview.senderName || replyPreview.senderId}</strong>
              {(replyPreview.text || "").slice(0, 62)}...
            </span>
            <button onClick={() => setReplyPreview(null)} title="Hủy trả lời">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="compose-input-row">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Nhập @, tin nhắn tới ${conversation.title}`}
            style={{
              color: selectedColor === "Black" ? undefined : selectedColor.toLowerCase(),
              fontWeight: formatState.bold ? 800 : undefined,
              fontStyle: formatState.italic ? "italic" : undefined,
              textDecoration: formatState.underline ? "underline" : undefined
            }}
          />
          <button className="emoji-button" onClick={() => setEmojiOpen((value) => !value)}>
            <Smile size={22} />
          </button>
          {draft || replyPreview ? (
            <button className="send-button" onClick={sendMessage} aria-label="Gửi tin nhắn">
              <Send size={20} />
            </button>
          ) : (
            <button
              className="thumb-button"
              onClick={() => setSent((items) => [...items, { id: `like-${Date.now()}`, text: "👍", time: "Vừa xong" }])}
              aria-label="Gửi nhanh biểu tượng cảm xúc"
            >
              👍
            </button>
          )}
        </div>
        {emojiOpen && (
          <div className="emoji-popover">
            {["😀", "👍", "❤️", "🙏", "🔥", "🎯", "✅", "✨"].map((emoji) => (
              <button key={emoji} onClick={() => setDraft((text) => `${text}${emoji}`)}>{emoji}</button>
            ))}
          </div>
        )}
        {quickOpen && (
          <QuickReplyPopover
            onSelect={(text) => {
              setDraft(text);
              setQuickOpen(false);
            }}
            onManage={() => onNotify("Đã mở phần quản lý trả lời nhanh mô phỏng.")}
          />
        )}
      </div>
      {attachment && (
        <AttachmentModal
          type={attachment}
          onClose={() => setAttachment(null)}
          onSend={(item) => {
            addTimelineItem(item);
            setAttachment(null);
            onNotify("Đã thêm tệp đính kèm vào hội thoại.");
          }}
        />
      )}
      {pollOpen && (
        <PollModal
          settings={pollSettings}
          onToggleSettings={() => setPollSettings((v) => !v)}
          onCreate={(poll) => {
            addTimelineItem(poll);
            setPollOpen(false);
            setPollSettings(false);
            onNotify("Đã tạo bình chọn trong hội thoại.");
          }}
          onClose={() => {
            setPollOpen(false);
            setPollSettings(false);
          }}
        />
      )}
    </>
  );
}

function labelForListener(status) {
  switch (status) {
    case "connected":
      return "Đang live";
    case "starting":
    case "connecting":
      return "Đang khởi động";
    case "reconnecting":
      return "Đang reconnect";
    case "error":
      return "Lỗi listener";
    case "stopped":
      return "Đã dừng";
    default:
      return "Chưa rõ";
  }
}

function QuickReplyPopover({ onSelect, onManage }) {
  const [query, setQuery] = useState("");
  const templates = [
    "Dạ em đã nhận thông tin, em kiểm tra và phản hồi anh/chị ngay ạ.",
    "Anh/chị cho em xin thêm số điện thoại để hỗ trợ nhanh hơn nhé.",
    "Dạ vâng, em gửi anh/chị thông tin chi tiết trong ít phút nữa."
  ];
  const filtered = templates.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="quick-popover">
      <div>
        <strong>Trả lời nhanh</strong>
        <small>Chọn mẫu có sẵn hoặc tìm theo phím tắt</small>
      </div>
      <button onClick={onManage}>Quản lý</button>
      <div className="search-field compact">
        <Search size={16} />
        <input
          placeholder="Tìm theo phím tắt hoặc nội dung"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="quick-template-list">
        {filtered.length ? (
          filtered.map((item) => (
            <button key={item} onClick={() => onSelect(item)}>{item}</button>
          ))
        ) : (
          <div className="quick-empty">Không tìm thấy</div>
        )}
      </div>
    </div>
  );
}

function PollModal({ settings, onToggleSettings, onCreate, onClose }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState("Không thời hạn");
  const [multi, setMulti] = useState(true);
  const [addable, setAddable] = useState(true);
  const validOptions = options.filter((item) => item.trim());

  return (
    <ModalShell title="Tạo bình chọn" onClose={onClose} wide={false}>
      <div className="poll-form">
        <label>
          Chủ đề bình chọn
          <textarea
            placeholder="Đặt câu hỏi bình chọn"
            maxLength={200}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <small>{question.length}/200</small>
        </label>
        {options.map((option, index) => (
          <label key={index}>
            {index === 0 ? "Các lựa chọn" : ""}
            <input
              placeholder={`Lựa chọn ${index + 1}`}
              value={option}
              onChange={(event) =>
                setOptions((items) => items.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))
              }
            />
            <small>{option.length}/200</small>
          </label>
        ))}
        <button className="link-button" onClick={() => setOptions((items) => [...items, ""])}>
          <Plus size={16} />
          Thêm lựa chọn
        </button>
        {settings && (
          <div className="poll-settings">
            <h4>Thời hạn bình chọn</h4>
            <div className="fake-select">
              {duration}
              <Calendar size={16} />
            </div>
            <div className="duration-grid">
              {["Không thời hạn", "Tùy chọn", "1 giờ", "24 giờ", "3 ngày", "7 ngày"].map((item) => (
                <button
                  className={duration === item ? "active" : ""}
                  key={item}
                  onClick={() => setDuration(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <h4>Thiết lập nâng cao</h4>
            <label className="switch-row" onClick={() => setMulti((value) => !value)}>
              Chọn nhiều phương án
              <span className={`switch ${multi ? "on" : ""}`} />
            </label>
            <label className="switch-row" onClick={() => setAddable((value) => !value)}>
              Có thể thêm phương án
              <span className={`switch ${addable ? "on" : ""}`} />
            </label>
          </div>
        )}
      </div>
      <div className="modal-footer">
        <button className="square-soft" onClick={onToggleSettings}>
          <Settings size={17} />
        </button>
        <span />
        <button onClick={onClose}>Hủy</button>
        <button
          className={question.trim() && validOptions.length >= 2 ? "primary-action" : "primary-disabled"}
          onClick={() => {
            if (!question.trim() || validOptions.length < 2) return;
            onCreate({
              kind: "poll",
              title: `Bình chọn: ${question.trim()}`,
              text: `${validOptions.join(" • ")}\nThời hạn: ${duration}`
            });
          }}
        >
          Tạo bình chọn
        </button>
      </div>
    </ModalShell>
  );
}

function AttachmentModal({ type, onClose, onSend }) {
  const [name, setName] = useState(type === "image" ? "anh-minh-hoa.png" : "bao-gia-demo.pdf");
  const isImage = type === "image";

  return (
    <ModalShell title={isImage ? "Gửi hình ảnh" : "Đính kèm file"} onClose={onClose}>
      <p className="modal-copy">
        {isImage
          ? "Mô phỏng chọn ảnh từ máy và gửi vào hội thoại."
          : "Mô phỏng chọn file tài liệu và gửi vào hội thoại."}
      </p>
      <div className="attachment-preview">
        {isImage ? <Image size={36} /> : <FileText size={36} />}
        <span>
          <strong>{name}</strong>
          <small>{isImage ? "PNG • 840 KB" : "PDF • 1.2 MB"}</small>
        </span>
      </div>
      <FormInput
        label={isImage ? "Tên ảnh" : "Tên file"}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        <button
          className="primary-action"
          onClick={() =>
            onSend({
              kind: "attachment",
              title: isImage ? "Hình ảnh" : "Tệp đính kèm",
              text: name.trim() || (isImage ? "anh-minh-hoa.png" : "tai-lieu.pdf")
            })
          }
        >
          <Send size={17} />
          Gửi
        </button>
      </div>
    </ModalShell>
  );
}

function AddMemberModal({ onClose, onAdd }) {
  const [name, setName] = useState("Thành viên mới");

  return (
    <ModalShell title="Thêm thành viên" onClose={onClose}>
      <p className="modal-copy">Tìm trong danh bạ hoặc nhập tên thành viên để mô phỏng thêm vào nhóm.</p>
      <FormInput
        label="Tên thành viên"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <div className="contact-box compact-list">
        {["Minh Anh", "Nguyễn CSKH", "Lan Hỗ trợ"].map((item) => (
          <button key={item} onClick={() => setName(item)}>
            <Avatar label={item.slice(0, 2).toUpperCase()} tone="teal" />
            {item}
          </button>
        ))}
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        <button className="primary-action" onClick={() => onAdd(name.trim() || "Thành viên mới")}>
          <UserRoundPlus size={17} />
          Thêm
        </button>
      </div>
    </ModalShell>
  );
}

function ChatDrawer({ mode, onClose, onChangeMode, onNotify }) {
  const [tab, setTab] = useState("activity");
  const [analysisRange, setAnalysisRange] = useState("7 ngày");
  const [summary, setSummary] = useState(null);
  const [muted, setMuted] = useState(false);
  const [internalNote, setInternalNote] = useState("");
  const [drawerModal, setDrawerModal] = useState(null);
  const [memberRows, setMemberRows] = useState(members);
  const aiLogs = [
    ["10:12", "AI đã đọc ngữ cảnh hội thoại mới nhất"],
    ["10:13", "AI chờ nhân viên xác nhận trước khi phản hồi"]
  ];

  if (mode === "members") {
    return (
      <aside className="drawer">
        <header>
          <button onClick={() => onChangeMode("info")}>
            <ArrowLeft size={20} />
          </button>
          <h3>Thành viên</h3>
        </header>
        <button className="wide-outline" onClick={() => setDrawerModal("member")}>
          <UserRoundPlus size={17} />
          Thêm thành viên
        </button>
        <p className="drawer-label">Danh sách thành viên ({memberRows.length})</p>
        <div className="member-list">
          {memberRows.map(([name, role], index) => (
            <div className="member-row" key={name}>
              <Avatar label={name.slice(0, 2).toUpperCase()} tone={index % 2 ? "blue" : "teal"} />
              <span>
                <strong>{name}</strong>
                {role && <small>{role}</small>}
              </span>
            </div>
          ))}
        </div>
        {drawerModal === "member" && (
          <AddMemberModal
            onClose={() => setDrawerModal(null)}
            onAdd={(name) => {
              setMemberRows((items) => [...items, [name, ""]]);
              setDrawerModal(null);
              onNotify("Đã thêm thành viên vào nhóm.");
            }}
          />
        )}
      </aside>
    );
  }
  if (mode === "info") {
    return (
      <aside className="drawer">
        <header>
          <h3>Thông tin hội thoại</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        <div className="drawer-profile">
          <Avatar label="VIP" tone="red" large />
          <strong>VIP - Support 1-1 AI</strong>
          <Edit3 size={16} />
        </div>
        <div className="drawer-actions">
          <button
            className={muted ? "active" : ""}
            onClick={() => {
              setMuted((value) => !value);
              onNotify(muted ? "Đã bật lại thông báo." : "Đã tắt thông báo hội thoại.");
            }}
          >
            <Bell size={18} />
            {muted ? "Bật thông báo" : "Tắt thông báo"}
          </button>
          <button onClick={() => setDrawerModal("member")}>
            <UserRoundPlus size={18} />
            Thêm thành viên
          </button>
        </div>
        <button className="drawer-row" onClick={() => onChangeMode("members")}>
          <UsersRound size={18} />
          Thành viên nhóm
          <small>6 thành viên</small>
          <ChevronDown size={16} />
        </button>
        <label className="note-box">
          Ghi chú nội bộ
          <textarea
            placeholder="Nhập thông tin cần ghi chú cho khách hàng..."
            value={internalNote}
            onChange={(event) => setInternalNote(event.target.value)}
          />
          {internalNote && <button onClick={() => onNotify("Đã lưu ghi chú nội bộ.")}>Lưu ghi chú</button>}
        </label>
        <button className="leave-row" onClick={() => setDrawerModal("leave")}>
          <LogOut size={17} />
          Rời nhóm
        </button>
        {drawerModal === "member" && (
          <AddMemberModal
            onClose={() => setDrawerModal(null)}
            onAdd={(name) => {
              setMemberRows((items) => [...items, [name, ""]]);
              setDrawerModal(null);
              onNotify("Đã thêm thành viên vào nhóm.");
            }}
          />
        )}
        {drawerModal === "leave" && (
          <ConfirmModal
            title="Rời nhóm"
            copy="Bạn sẽ không còn thấy hội thoại nhóm này trong danh sách. Bản clone chỉ mô phỏng thao tác."
            confirmText="Rời nhóm"
            onClose={() => setDrawerModal(null)}
            onConfirm={() => {
              setDrawerModal(null);
              onClose();
              onNotify("Đã mô phỏng thao tác rời nhóm.");
            }}
          />
        )}
      </aside>
    );
  }
  if (mode === "analysis") {
    return (
      <aside className="drawer analysis-drawer">
        <header>
          <div>
            <h3>Phân tích hội thoại</h3>
            <small>Tóm tắt AI & gợi ý hành động</small>
          </div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        <div className="summary-card">
          <Avatar label="VIP" tone="red" />
          <span>
            <strong>VIP - Support 1-1 AI</strong>
            <small>Bản tóm tắt gần nhất</small>
          </span>
        </div>
        <p className="drawer-label">Phạm vi phân tích</p>
        <div className="range-buttons">
          {["24 giờ", "3 ngày", "7 ngày", "Toàn bộ", "Tùy chỉnh"].map((item) => (
            <button
              key={item}
              className={analysisRange === item ? "active" : ""}
              onClick={() => setAnalysisRange(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          className="gradient-button"
          onClick={() => {
            setSummary(`Trong ${analysisRange}, hội thoại tập trung vào thông tin khóa học SOLO, link đăng ký và quyền học miễn phí cho nhóm VIP. Gợi ý: xác nhận danh sách học viên quan tâm và gửi lịch Zoom.`);
            onNotify("AI đã tạo bản tóm tắt hội thoại.");
          }}
        >
          <Sparkles size={18} />
          Tóm tắt ngay
        </button>
        {summary ? (
          <div className="analysis-result">
            <strong>Tóm tắt AI</strong>
            <p>{summary}</p>
            <button onClick={() => onNotify("Đã đánh dấu tóm tắt là cần xử lý.")}>
              <Pin size={15} />
              Đánh dấu cần xử lý
            </button>
          </div>
        ) : (
          <div className="empty-analysis">
            <Sparkles size={34} />
            <strong>Chưa có bản tóm tắt nào</strong>
            <p>Chọn phạm vi thời gian và bấm Tóm tắt ngay để AI phân tích hội thoại này.</p>
          </div>
        )}
      </aside>
    );
  }
  return (
    <aside className="drawer ai-log-drawer">
      <header>
        <div>
          <h3>Nhật ký hoạt động AI</h3>
          <small>Hiển thị các thông tin hoạt động của AI</small>
        </div>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </header>
      <div className="segmented">
        <button className={tab === "activity" ? "active" : ""} onClick={() => setTab("activity")}>
          Hoạt động AI
        </button>
        <button className={tab === "summary" ? "active" : ""} onClick={() => setTab("summary")}>
          AI Summary
        </button>
      </div>
      {tab === "activity" ? (
        <div className="ai-log-list">
          {aiLogs.map(([time, text]) => (
            <div key={time}>
              <strong>{time}</strong>
              <span>{text}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="drawer-empty">
          {summary || "Chưa có bản tóm tắt nào được yêu cầu cho hội thoại này."}
        </div>
      )}
      <footer>Dữ liệu log chỉ hiển thị cho nhân viên. Khách hàng không thấy thông tin này.</footer>
    </aside>
  );
}

function ModalShell({ title, children, onClose, wide }) {
  return (
    <div className="modal-backdrop">
      <section className={`modal ${wide ? "wide" : ""}`}>
        <header>
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function AccountModal({ onClose, onNotify, listeners = [], onRefresh }) {
  const [tab, setTab] = useState("active");
  const [selected, setSelected] = useState(() => new Set(listeners.map((item) => item.accountId)));
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    setSelected((prev) => {
      if (prev.size) return prev;
      return new Set(listeners.map((item) => item.accountId));
    });
  }, [listeners]);

  const visibleListeners = listeners.filter((item) => {
    const matchesQuery = (item.displayName || "").toLowerCase().includes(query.toLowerCase());
    if (tab === "active") return matchesQuery && item.listener?.status === "connected";
    if (tab === "other") return matchesQuery && item.listener?.status !== "connected";
    return matchesQuery;
  });

  const toggleAccount = (accountId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(accountId)) next.delete(accountId);
      else next.add(accountId);
      return next;
    });
  };

  const startListener = async (accountId) => {
    setBusy(true);
    setInfo("");
    try {
      await apiRequest(`/api/integrations/zalo-personal/accounts/${accountId}/listener/start`, { method: "POST" });
      setInfo(`Đã yêu cầu khởi động listener cho tài khoản.`);
      onRefresh?.();
    } catch (error) {
      setInfo(error.message);
    } finally {
      setBusy(false);
    }
  };

  const stopListener = async (accountId) => {
    setBusy(true);
    setInfo("");
    try {
      await apiRequest(`/api/integrations/zalo-personal/accounts/${accountId}/listener/stop`, { method: "POST" });
      setInfo(`Đã dừng listener.`);
      onRefresh?.();
    } catch (error) {
      setInfo(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell title="Chọn tài khoản" onClose={onClose} wide>
      <div className="account-modal">
        <aside>
          <small>Nền tảng</small>
          <button className="active">
            <span className="zalo-dot">Zalo</span>
            Zalo cá nhân
            <b>{listeners.length}</b>
          </button>
          <button onClick={() => setSelected(new Set())}>Bỏ chọn tất cả</button>
        </aside>
        <section>
          <div className="account-tabs">
            <button className={tab === "active" ? "active" : ""} onClick={() => setTab("active")}>Đang hoạt động</button>
            <button className={tab === "other" ? "active" : ""} onClick={() => setTab("other")}>Trạng thái khác</button>
          </div>
          <div className="search-field">
            <Search size={16} />
            <input
              placeholder="Tìm tài khoản..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          {visibleListeners.length === 0 ? (
            <div className="modal-empty">
              {listeners.length === 0
                ? "Chưa kết nối tài khoản Zalo cá nhân nào. Hãy vào Tích hợp để quét QR."
                : "Không có tài khoản phù hợp"}
            </div>
          ) : (
            visibleListeners.map((item) => (
              <div className="account-card-row" key={item.accountId}>
                <button
                  className={`account-card ${selected.has(item.accountId) ? "selected" : ""}`}
                  onClick={() => toggleAccount(item.accountId)}
                >
                  <Avatar label={deriveInitials(item.displayName || "Z")} tone="teal" />
                  <span>
                    <strong>{item.displayName || "Tài khoản Zalo"}</strong>
                    <small>ID: {item.accountId.slice(0, 12)} • {labelForListener(item.listener?.status)}</small>
                  </span>
                  {selected.has(item.accountId) && <Check size={18} />}
                </button>
                <div className="account-card-actions">
                  {item.listener?.status === "connected" ? (
                    <button onClick={() => stopListener(item.accountId)} disabled={busy}>Dừng</button>
                  ) : (
                    <button onClick={() => startListener(item.accountId)} disabled={busy}>
                      {item.listener?.status === "error" ? "Thử lại" : "Kết nối"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          {info && <div className="api-status" style={{ margin: "12px 0 0" }}>{info}</div>}
        </section>
        <aside>
          <small>Đã chọn ({selected.size})</small>
          <button onClick={() => setSelected(new Set())}>Xóa hết</button>
          {selected.size ? (
            Array.from(selected).map((accountId) => {
              const account = listeners.find((item) => item.accountId === accountId);
              if (!account) return null;
              return (
                <div className="picked-account" key={accountId}>
                  <Avatar label={deriveInitials(account.displayName || "Z")} tone="teal" />
                  {account.displayName || "Tài khoản Zalo"}
                </div>
              );
            })
          ) : (
            <div className="modal-empty">Chưa chọn tài khoản</div>
          )}
        </aside>
      </div>
      <div className="modal-footer">
        <span>{selected.size} tài khoản sẽ được lọc trong danh sách hội thoại.</span>
        <button onClick={onClose}>Hủy bỏ</button>
        <button
          className={selected.size ? "primary-action" : "primary-disabled"}
          onClick={() => {
            if (!selected.size) return;
            onClose();
            onNotify(`Đã áp dụng bộ lọc ${selected.size} tài khoản.`);
          }}
        >
          <Check size={17} />
          Áp dụng ({selected.size})
        </button>
      </div>
    </ModalShell>
  );
}

function InviteModal({ onClose, onNotify }) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("Xin chào! Mình muốn kết bạn.");
  const [searched, setSearched] = useState(false);

  return (
    <ModalShell title="Gửi lời mời kết bạn Zalo" onClose={onClose}>
      <p className="modal-copy">Chọn tài khoản Zalo cá nhân, nhập số điện thoại và lời chào để gửi lời mời kết bạn.</p>
      <FormSelect label="Tài khoản Zalo" value="Tài khoản mẫu" status="Hoạt động" />
      <FormInput
        label="Số điện thoại"
        placeholder="Ví dụ: 0915901919"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />
      <label className="form-field">
        Lời nhắn
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={150}
        />
        <small>{message.length}/150</small>
      </label>
      {searched && (
        <div className="modal-status-card">
          <Avatar label="Z" tone="blue" />
          <span>
            <strong>Người dùng Zalo mẫu</strong>
            <small>{phone || "0915901919"} • Có thể gửi lời mời</small>
          </span>
        </div>
      )}
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        {searched ? (
          <button
            className="primary-action"
            onClick={() => {
              onClose();
              onNotify("Đã gửi lời mời kết bạn Zalo mô phỏng.");
            }}
          >
            <UserPlus size={17} />
            Gửi lời mời
          </button>
        ) : (
          <button
            className={phone.trim() ? "primary-action" : "primary-disabled"}
            onClick={() => phone.trim() && setSearched(true)}
          >
            Tìm người dùng
          </button>
        )}
      </div>
    </ModalShell>
  );
}

function GroupModal({ onClose, onNotify }) {
  const [name, setName] = useState("");
  const [contactQuery, setContactQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [phone, setPhone] = useState("");
  const contacts = ["Ác Quy An Phát", "Ác Quy Gia Phát", "Ác Quy Hải Đăng", "Ác Quy Hạ Long"];
  const filteredContacts = contacts.filter((item) => item.toLowerCase().includes(contactQuery.toLowerCase()));
  const canCreate = name.trim() && selectedContacts.length;

  return (
    <ModalShell title="Tạo nhóm Zalo" onClose={onClose} wide>
      <p className="modal-copy">Chọn tài khoản Zalo, nhập tên nhóm và thêm thành viên từ danh bạ hoặc SĐT lạ.</p>
      <FormSelect label="Tài khoản Zalo" value="Tài khoản mẫu" status="Hoạt động" />
      <div className="group-grid">
        <div className="group-avatar">
          <UsersRound size={34} />
        </div>
        <FormInput
          label="Tên nhóm"
          placeholder="Ví dụ: Team CSKH VIP"
          hint={name.trim() ? `${name.length}/80` : "Nhập tên nhóm để tiếp tục."}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <FormInput
        label="Tìm trong danh bạ"
        placeholder="Nhập tên hoặc số điện thoại"
        value={contactQuery}
        onChange={(event) => setContactQuery(event.target.value)}
      />
      <div className="contact-box">
        {filteredContacts.map((contact, index) => (
          <button
            className={`contact-row ${selectedContacts.includes(contact) ? "selected" : ""}`}
            key={contact}
            onClick={() =>
              setSelectedContacts((items) =>
                items.includes(contact) ? items.filter((item) => item !== contact) : [...items, contact]
              )
            }
          >
            <Avatar label="A" tone={index === 3 ? "orange" : "blue"} />
            {contact}
            {selectedContacts.includes(contact) && <Check size={16} />}
          </button>
        ))}
      </div>
      <label className="phone-add">
        Hoặc nhập SĐT lạ
        <span>
          <Phone size={16} />
          <input
            placeholder="VD: 0901234567"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <button
            onClick={() => {
              if (!phone.trim()) return;
              setSelectedContacts((items) => [...items, phone.trim()]);
              setPhone("");
            }}
          >
            Thêm
          </button>
        </span>
      </label>
      <div className="modal-footer">
        <span>{selectedContacts.length} thành viên đã chọn</span>
        <button onClick={onClose}>Hủy</button>
        <button
          className={canCreate ? "primary-action" : "primary-disabled"}
          onClick={() => {
            if (!canCreate) return;
            onClose();
            onNotify(`Đã tạo nhóm ${name.trim()} với ${selectedContacts.length} thành viên.`);
          }}
        >
          Tạo nhóm Zalo
        </button>
      </div>
    </ModalShell>
  );
}

function ClassifyModal({ onClose, onNotify }) {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const toggle = (value, setter) => {
    setter((items) => (items.includes(value) ? items.filter((item) => item !== value) : [...items, value]));
  };

  return (
    <ModalShell title="Phân loại hội thoại" onClose={onClose}>
      <p className="modal-copy">Gắn danh mục và thẻ để thao tác nhanh hơn.</p>
      <div className="classify-current">
        <small>Đang chọn</small>
        <p>
          <Folder size={15} />
          Danh mục
        </p>
        <div className="selected-pills">
          {categories.length ? categories.map((item) => <mark key={item}>{item}</mark>) : <span>Chưa chọn</span>}
        </div>
        <p>
          <Tags size={15} />
          Thẻ
        </p>
        <div className="selected-pills">
          {tags.length ? tags.map((item) => <mark key={item}>{item}</mark>) : <span>Chưa chọn</span>}
        </div>
      </div>
      <div className="classify-list">
        <h4>Chọn từ danh sách</h4>
        <p>
          <Folder size={16} />
          <strong>Danh mục</strong>
          <small>Chọn danh mục cần gắn cho cuộc hội thoại</small>
        </p>
        <div className="tag-choice-row">
          {["Khách hàng", "Công việc", "Bạn bè", "Gia đình"].map((item) => (
            <button
              className={categories.includes(item) ? "active" : ""}
              key={item}
              onClick={() => toggle(item, setCategories)}
            >
              {item}
            </button>
          ))}
        </div>
        <p>
          <Tags size={16} />
          <strong>Thẻ</strong>
          <small>Chọn thẻ cần gắn cho cuộc hội thoại</small>
        </p>
        <div className="tag-choice-row">
          {["Trả lời sau", "Đồng nghiệp", "Khách hàng"].map((item) => (
            <button
              className={tags.includes(item) ? "active" : ""}
              key={item}
              onClick={() => toggle(item, setTags)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="modal-footer">
        <span>{categories.length + tags.length ? `${categories.length + tags.length} thay đổi` : "Chưa có thay đổi"}</span>
        <button onClick={onClose}>Hủy</button>
        <button
          className={categories.length + tags.length ? "primary-action" : "primary-disabled"}
          onClick={() => {
            if (!(categories.length + tags.length)) return;
            onClose();
            onNotify("Đã lưu phân loại hội thoại.");
          }}
        >
          <Check size={17} />
          Lưu thay đổi
        </button>
      </div>
    </ModalShell>
  );
}

function FormSelect({ label, value, status }) {
  return (
    <label className="form-field">
      {label}
      <button className="fake-select">
        {value}
        {status && <mark>{status}</mark>}
        <ChevronDown size={16} />
      </button>
    </label>
  );
}

function FormInput({ label, placeholder, hint, type = "text", value, onChange }) {
  return (
    <label className="form-field">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function DashboardPage({ onNavigate }) {
  const [listeners, setListeners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest("/api/integrations/zalo-personal/listeners");
        setListeners(data.listeners || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, []);

  const totalAccounts = listeners.length;
  const liveAccounts = listeners.filter((l) => l.listener?.status === "connected").length;
  const errorAccounts = listeners.filter((l) => l.listener?.status === "error").length;
  const disconnectedAccounts = listeners.filter(
    (l) => !["connected", "error"].includes(l.listener?.status)
  ).length;

  const zaloOA = 0; // chưa cấu hình
  const facebook = 0; // chưa cấu hình
  const totalChannels = (totalAccounts > 0 ? 1 : 0) + (zaloOA > 0 ? 1 : 0) + (facebook > 0 ? 1 : 0);
  const activeChannels = (totalAccounts > 0 ? 1 : 0);

  const staffCount = 1; // TODO: hook vào /api/employees khi có endpoint

  return (
    <PageScaffold icon={LayoutDashboard} title="Tổng quan hệ thống" subtitle="Quản lý tập trung mạng xã hội, nhân sự và AI Agent" eyebrow="MH POWER">
      <div className="metric-grid">
        <MetricCard
          color="blue"
          icon={MessageSquare}
          label="Kênh kết nối"
          value={String(totalChannels)}
          sub="Tổng số kênh đang theo dõi"
          foot={`Zalo cá nhân: ${totalAccounts} • Zalo OA: ${zaloOA} • Facebook: ${facebook}`}
        />
        <MetricCard
          color="teal"
          icon={Building2}
          label="Kênh hoạt động"
          value={totalAccounts > 0 ? `${liveAccounts}/${totalAccounts}` : "—"}
          sub="Tỷ lệ online"
          foot={`Online: ${liveAccounts} • Mất kết nối: ${errorAccounts + disconnectedAccounts}`}
        />
        <MetricCard
          color="pink"
          icon={Users}
          label="Nhân viên"
          value={`${staffCount}/${staffCount}`}
          sub="Đang làm việc"
          foot=""
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel-card channel-status">
          <h3>Trạng thái các kênh</h3>
          {loading ? (
            <div style={{ padding: "16px", color: "var(--text-muted)", fontSize: 13 }}>Đang tải...</div>
          ) : totalAccounts === 0 ? (
            <div style={{ padding: "16px", color: "var(--text-muted)", fontSize: 13 }}>
              Chưa có tài khoản nào. Vào Tích hợp để kết nối.
            </div>
          ) : (
            <>
              <div className="zalo-card">
                <header>
                  <strong>Zalo cá nhân</strong>
                  <span>{liveAccounts}/{totalAccounts}</span>
                </header>
                {listeners.map((l) => {
                  const status = l.listener?.status;
                  const isLive = status === "connected";
                  const isError = status === "error";
                  const initials = (l.displayName || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <div key={l.accountId} className="channel-row">
                      <Avatar
                        src={l.avatar || null}
                        label={initials}
                        tone={isLive ? "teal" : isError ? "red" : "yellow"}
                      />
                      <span>
                        <strong>{l.displayName || "Tài khoản không tên"}</strong>
                        <small>
                          {isLive ? "Đang hoạt động" : isError ? "Lỗi listener" : "Đang kết nối..."}
                        </small>
                      </span>
                    </div>
                  );
                })}
              </div>
              {zaloOA > 0 && (
                <div className="zalo-card">
                  <header>
                    <strong>Zalo OA</strong>
                    <span>—</span>
                  </header>
                </div>
              )}
              {facebook > 0 && (
                <div className="zalo-card">
                  <header>
                    <strong>Facebook Page</strong>
                    <span>—</span>
                  </header>
                </div>
              )}
            </>
          )}
        </section>
        <section className="panel-card quick-actions">
          <h3>Hành động nhanh</h3>
          {[
            ["Vào phòng Chat", "Trò chuyện với khách hàng", MessageSquare, "chat"],
            ["Quản lý AI Agent", "Cấu hình AI theo kịch bản", Bot, "ai"],
            ["Thêm tài khoản Zalo", "Kết nối tài khoản Zalo mới", Zap, "integrations"],
            ["Thêm nhân viên", "Thêm nhân viên vào tổ chức", UserPlus, "employees"],
            ["Phân quyền", "Quản lý quyền và vai trò", Shield, "tags"]
          ].map(([title, desc, Icon, target]) => (
            <button key={title} onClick={() => onNavigate(target)}>
              <span>
                <Icon size={21} />
              </span>
              <em>
                <strong>{title}</strong>
                <small>{desc}</small>
              </em>
              <ChevronDown size={18} />
            </button>
          ))}
        </section>
      </div>
    </PageScaffold>
  );
}

function EmployeesPage({ onNotify }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [rows, setRows] = useState([
    {
      id: "owner",
      name: "Hoan Ngo",
      email: "user@example.com",
      phone: "0973081446",
      role: "Chủ sở hữu",
      status: "Hoạt động",
      owner: true
    }
  ]);

  const roleLabel =
    roleFilter === "owner" ? "Chủ sở hữu" : roleFilter === "staff" ? "Nhân viên" : "Tất cả vai trò";
  const statusLabel = statusFilter === "active" ? "Hoạt động" : statusFilter === "pending" ? "Chờ tham gia" : "Tất cả";
  const filteredRows = rows.filter((row) => {
    const text = `${row.name} ${row.email} ${row.phone}`.toLowerCase();
    const roleOk =
      roleFilter === "all" ||
      (roleFilter === "owner" && row.owner) ||
      (roleFilter === "staff" && !row.owner);
    const statusOk =
      statusFilter === "all" ||
      (statusFilter === "active" && row.status === "Hoạt động") ||
      (statusFilter === "pending" && row.status === "Chờ tham gia");
    return text.includes(query.toLowerCase()) && roleOk && statusOk;
  });

  const cycleRole = () => {
    setRoleFilter((value) => (value === "all" ? "owner" : value === "owner" ? "staff" : "all"));
  };

  const cycleStatus = () => {
    setStatusFilter((value) => (value === "all" ? "active" : value === "active" ? "pending" : "all"));
  };

  return (
    <PageScaffold icon={Users} title="Quản lý nhân viên" subtitle="Theo dõi danh sách nhân viên hiện tại">
      <div className="page-header-action">
        <button className="primary-action" onClick={() => setModal({ type: "invite" })}>
          <Plus size={17} />
          Mời tham gia tổ chức
        </button>
      </div>
      <section className="data-card">
        <h3>Danh sách nhân viên</h3>
        <p>Quản lý nhân viên đã tham gia tổ chức và quyền truy cập của họ.</p>
        <div className="table-controls">
          <div className="search-field">
            <Search size={17} />
            <input
              placeholder="Tìm kiếm tên nhân viên"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button className="select-button" onClick={cycleRole}>
            {roleLabel} <ChevronDown size={16} />
          </button>
          <button className="select-button" onClick={cycleStatus}>
            {statusLabel} <ChevronDown size={16} />
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty">Không tìm thấy nhân viên phù hợp</td>
              </tr>
            ) : (
              filteredRows.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>
                    {row.name} {row.owner && <mark className="owner-badge">Owner</mark>}
                  </td>
                  <td>{row.email}</td>
                  <td>{row.phone}</td>
                  <td><mark>{row.role}</mark></td>
                  <td><mark className={row.status === "Hoạt động" ? "green" : ""}>{row.status}</mark></td>
                  <td>
                    <button
                      className="square-soft"
                      onClick={() => setModal({ type: "permission", employee: row })}
                      title="Phân quyền hội thoại"
                    >
                      <Tags size={16} />
                    </button>
                    <button
                      className="square-soft"
                      onClick={() => setModal({ type: "edit", employee: row })}
                      title="Chỉnh sửa nhân viên"
                    >
                      <Edit3 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
      {modal?.type === "invite" && (
        <InviteEmployeeModal
          onClose={() => setModal(null)}
          onInvite={(employee) => {
            setRows((items) => [...items, employee]);
            setModal(null);
            onNotify("Đã tạo lời mời tham gia tổ chức.");
          }}
        />
      )}
      {modal?.type === "permission" && (
        <PermissionModal
          employee={modal.employee}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            onNotify("Đã cập nhật quyền truy cập hội thoại.");
          }}
        />
      )}
      {modal?.type === "edit" && (
        <EmployeeEditModal
          employee={modal.employee}
          onClose={() => setModal(null)}
          onSave={(employee) => {
            setRows((items) => items.map((item) => (item.id === employee.id ? employee : item)));
            setModal(null);
            onNotify("Đã lưu thông tin nhân viên.");
          }}
        />
      )}
    </PageScaffold>
  );
}

function IntegrationsPage({ onNotify }) {
  const [modal, setModal] = useState(null);
  const [listeners, setListeners] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchListeners = async () => {
      try {
        const payload = await apiRequest("/api/integrations/zalo-personal/listeners");
        if (!cancelled) setListeners(payload.listeners || []);
      } catch (error) {
        if (!cancelled) setListeners([]);
      }
    };
    fetchListeners();
    const timer = window.setInterval(fetchListeners, 5_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const zaloConnected = listeners.length > 0;
  const onlineListeners = listeners.filter((item) => item.listener?.status === "connected").length;

  return (
    <PageScaffold icon={Blocks} title="Tích hợp nền tảng" subtitle="Kết nối và quản lý các kênh nhắn tin của bạn từ một nơi duy nhất">
      <div className="mini-metric-row">
        <MiniMetric title="Nền tảng đã kết nối" value={zaloConnected ? "1" : "0"} />
        <MiniMetric title="Tổng tài khoản" value={String(listeners.length)} />
        <MiniMetric title="Listener đang live" value={String(onlineListeners)} active={onlineListeners > 0} />
      </div>
      <div className="integration-grid">
        <IntegrationCard
          connected={zaloConnected}
          title="Zalo cá nhân"
          button="Thêm"
          accountLabel={zaloConnected ? `${listeners.length} tài khoản, ${onlineListeners} đang live` : "Chưa kết nối tài khoản nào"}
          onManage={() => setModal({ type: "manage", channel: "Zalo cá nhân" })}
          onConnect={() => setModal({ type: "connect", channel: "Zalo cá nhân" })}
        />
        <IntegrationCard
          title="Zalo OA"
          button="Kết nối Zalo OA"
          accountLabel="Chưa cấu hình"
          onConnect={() => setModal({ type: "connect", channel: "Zalo OA" })}
        />
        <IntegrationCard
          title="Facebook Page"
          button="Kết nối Facebook"
          accountLabel="Chưa cấu hình"
          onConnect={() => setModal({ type: "connect", channel: "Facebook Page" })}
        />
      </div>
      {modal?.type === "manage" && (
        <ManageChannelModal
          channel={modal.channel}
          onClose={() => setModal(null)}
          onRefresh={async () => {
            try {
              const payload = await apiRequest("/api/integrations/zalo-personal/listeners");
              setListeners(payload.listeners || []);
              onNotify("Đã kiểm tra lại trạng thái listener.");
            } catch (error) {
              onNotify(error.message);
            }
          }}
        />
      )}
      {modal?.type === "connect" && (
        <ConnectChannelModal
          channel={modal.channel}
          onClose={() => setModal(null)}
          onDone={() => {
            setModal(null);
            onNotify(`Đã tạo luồng kết nối ${modal.channel}.`);
          }}
        />
      )}
    </PageScaffold>
  );
}

function TagsPage({ onNotify }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [tags, setTags] = useState(tagRows.map(([name, color]) => ({ id: name, name, color })));
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <PageScaffold icon={Tags} title="Quản lý thẻ phân quyền" subtitle="Quản lý tập trung các thẻ phân quyền của tổ chức để cấp quyền truy cập hội thoại cho nhân viên">
      <div className="page-header-action">
        <button className="primary-action" onClick={() => setModal({ type: "create" })}>
          <Plus size={17} />
          Tạo thẻ mới
        </button>
      </div>
      <section className="data-card">
        <h3>Danh sách Thẻ ({tags.length})</h3>
        <div className="table-controls">
          <div className="search-field short">
            <Search size={17} />
            <input
              placeholder="Tìm kiếm thẻ..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <table className="tag-table">
          <thead>
            <tr>
              <th>Tên thẻ</th>
              <th>Màu hiển thị</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTags.length === 0 ? (
              <tr>
                <td colSpan="3" className="table-empty">Không tìm thấy thẻ phù hợp</td>
              </tr>
            ) : (
              filteredTags.map((tag) => (
                <tr key={tag.id}>
                  <td><mark>{tag.name}</mark></td>
                  <td><span className="color-dot" style={{ background: tag.color }} /> {tag.color}</td>
                  <td>
                    <button className="plain-icon" onClick={() => setModal({ type: "edit", tag })}>
                      <Edit3 size={17} />
                    </button>
                    <button className="plain-icon" onClick={() => setModal({ type: "delete", tag })}>
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
      {(modal?.type === "create" || modal?.type === "edit") && (
        <TagEditorModal
          tag={modal.tag}
          onClose={() => setModal(null)}
          onSave={(tag) => {
            setTags((items) =>
              modal.type === "edit"
                ? items.map((item) => (item.id === modal.tag.id ? { ...tag, id: modal.tag.id } : item))
                : [...items, { ...tag, id: `${tag.name}-${Date.now()}` }]
            );
            setModal(null);
            onNotify(modal.type === "edit" ? "Đã cập nhật thẻ." : "Đã tạo thẻ mới.");
          }}
        />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal
          title="Xóa thẻ"
          copy={`Thẻ ${modal.tag.name} sẽ không còn xuất hiện trong bộ lọc hội thoại.`}
          confirmText="Xóa thẻ"
          onClose={() => setModal(null)}
          onConfirm={() => {
            setTags((items) => items.filter((item) => item.id !== modal.tag.id));
            setModal(null);
            onNotify("Đã xóa thẻ khỏi danh sách.");
          }}
        />
      )}
    </PageScaffold>
  );
}

function AIPage({ onNotify }) {
  const [category, setCategory] = useState("Tất cả");
  const [modal, setModal] = useState(null);
  const [sources, setSources] = useState([]);
  const [step, setStep] = useState("knowledge");
  const [agentName, setAgentName] = useState("Top AiChat Agent");
  const [agentTone, setAgentTone] = useState("Thân thiện, rõ ràng");
  const [autoReply, setAutoReply] = useState(false);
  const [humanHandoff, setHumanHandoff] = useState(true);
  const [activated, setActivated] = useState(false);
  const visibleSources =
    category === "Tất cả" ? sources : sources.filter((source) => source.category === category);

  return (
    <PageScaffold centered icon={Bot} title="Thiết lập AI Agent" subtitle="Hoàn thành các bước bên dưới để kích hoạt trợ lý AI cho doanh nghiệp của bạn">
      <div className="ai-steps">
        <button className={step === "custom" ? "active" : "done"} onClick={() => setStep("custom")}><Check size={17} /> Tùy chỉnh AI Agent</button>
        <span />
        <button className={step === "knowledge" ? "active" : sources.length ? "done" : ""} onClick={() => setStep("knowledge")}><Folder size={17} /> Knowledge Base</button>
        <span />
        <button className={step === "settings" ? "active" : ""} onClick={() => setStep("settings")}><SlidersHorizontal size={17} /> Cài đặt AI</button>
        <span />
        <button className={step === "activate" ? "active" : activated ? "done" : ""} onClick={() => setStep("activate")}><Zap size={17} /> Kích hoạt</button>
      </div>
      {step === "custom" && (
        <section className="ai-card ai-config-card">
          <h2>Tùy chỉnh AI Agent</h2>
          <p>Đặt tên, vai trò và phong cách phản hồi cho trợ lý AI.</p>
          <div className="form-grid">
            <FormInput label="Tên Agent" value={agentName} onChange={(event) => setAgentName(event.target.value)} />
            <FormInput label="Phong cách trả lời" value={agentTone} onChange={(event) => setAgentTone(event.target.value)} />
          </div>
          <label className="form-field">
            Vai trò
            <textarea defaultValue="Tư vấn, tóm tắt hội thoại và gợi ý phản hồi cho nhân viên CSKH." />
          </label>
          <div className="modal-footer">
            <span>{agentName}</span>
            <button className="primary-action" onClick={() => {
              setStep("knowledge");
              onNotify("Đã lưu tùy chỉnh AI Agent.");
            }}>
              Lưu và tiếp tục
            </button>
          </div>
        </section>
      )}
      {step === "knowledge" && (
        <section className="ai-card">
          <h2>Nạp dữ liệu Kho tri thức</h2>
          <p>Tải lên tài liệu PDF, DOCX hoặc dán link Website. AI sẽ dựa vào dữ liệu này làm cơ sở để trả lời và tư vấn cho khách hàng.</p>
          <small>{sources.length ? `${sources.length} nguồn dữ liệu đang chờ huấn luyện.` : "Vui lòng thêm ít nhất 1 nguồn dữ liệu trước khi tiếp tục."}</small>
          <div className="kb-grid">
            <div className="upload-box">
              <UploadCloud size={19} />
              <strong>Tải lên tài liệu</strong>
              <p>Kéo thả hoặc bấm để chọn file (.pdf, .txt, .docx - tối đa 20MB)</p>
              <button onClick={() => setModal({ type: "file" })}>Chọn file</button>
            </div>
            <div className="upload-box">
              <Globe2 size={19} />
              <strong>Nạp dữ liệu từ website</strong>
              <p>Nhập URL để nạp nội dung và tự động thêm vào dữ liệu huấn luyện.</p>
              <button onClick={() => setModal({ type: "url" })}>Nạp từ Website (URL)</button>
            </div>
          </div>
          <div className="knowledge-card">
            <h3>Kho dữ liệu huấn luyện</h3>
            <div className="knowledge-tabs">
              {["Tất cả", "Thông tin sản phẩm", "Bảng giá", "Hỏi đáp (FAQ)", "Chính sách bán hàng", "Thông tin công ty", "Chính sách bảo mật"].map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            {visibleSources.length === 0 ? (
              <p>Danh mục {category} chưa có tài liệu đính kèm. Bạn có thể tải thêm file hoặc website để bổ sung ngữ cảnh cho AI.</p>
            ) : (
              <div className="knowledge-list">
                {visibleSources.map((source) => (
                  <div className="source-row" key={source.id}>
                    <FileText size={18} />
                    <span>
                      <strong>{source.name}</strong>
                      <small>{source.category} • {source.type}</small>
                    </span>
                    <mark>Chờ xử lý</mark>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <span>{sources.length ? "Đã có dữ liệu để cấu hình AI" : "Có thể tiếp tục với dữ liệu mẫu"}</span>
            <button className="primary-action" onClick={() => setStep("settings")}>Tiếp tục</button>
          </div>
        </section>
      )}
      {step === "settings" && (
        <section className="ai-card ai-config-card">
          <h2>Cài đặt AI</h2>
          <p>Chọn cách AI tham gia hội thoại và điều kiện chuyển cho nhân viên.</p>
          <div className="channel-detail-panel">
            <label className="switch-row" onClick={() => setAutoReply((value) => !value)}>
              Tự động trả lời khi có đủ ngữ cảnh
              <span className={`switch ${autoReply ? "on" : ""}`} />
            </label>
            <label className="switch-row" onClick={() => setHumanHandoff((value) => !value)}>
              Chuyển nhân viên khi AI không chắc chắn
              <span className={`switch ${humanHandoff ? "on" : ""}`} />
            </label>
          </div>
          <div className="modal-footer">
            <span>{autoReply ? "AI có thể tự trả lời" : "AI chỉ gợi ý cho nhân viên"}</span>
            <button className="primary-action" onClick={() => setStep("activate")}>Lưu cài đặt</button>
          </div>
        </section>
      )}
      {step === "activate" && (
        <section className="ai-card ai-config-card">
          <h2>Kích hoạt</h2>
          <p>Kiểm tra cấu hình cuối cùng trước khi bật AI Agent cho kênh Zalo cá nhân.</p>
          <div className="activation-summary">
            <ReadOnlyBox label="Agent" value={agentName} />
            <ReadOnlyBox label="Phong cách" value={agentTone} />
            <ReadOnlyBox label="Knowledge Base" value={`${sources.length} nguồn dữ liệu`} />
            <ReadOnlyBox label="Chế độ" value={autoReply ? "Tự động trả lời" : "Gợi ý cho nhân viên"} />
          </div>
          <button
            className={activated ? "wide-outline success" : "gradient-button"}
            onClick={() => {
              setActivated((value) => !value);
              onNotify(activated ? "Đã tắt AI Agent." : "Đã kích hoạt AI Agent.");
            }}
          >
            <Zap size={18} />
            {activated ? "AI Agent đang hoạt động" : "Kích hoạt AI Agent"}
          </button>
        </section>
      )}
      {modal && (
        <KnowledgeSourceModal
          type={modal.type}
          onClose={() => setModal(null)}
          onSave={(source) => {
            setSources((items) => [...items, source]);
            setModal(null);
            onNotify("Đã thêm nguồn dữ liệu vào Kho tri thức.");
          }}
        />
      )}
    </PageScaffold>
  );
}

function SettingsPage({ section, onBilling, onNotify }) {
  const [modal, setModal] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <PageScaffold icon={Settings} title="Cài đặt tổ chức" subtitle="Quản lý thông tin tổ chức và tài khoản">
      <p className="section-label">Thông tin</p>
      <div className="settings-grid">
        <section className="org-card">
          <header>
            <div className="org-icon"><Building2 size={30} /></div>
            <span>
              <h2>MH power</h2>
              <p>Thông tin tổ chức</p>
            </span>
            <mark className="green">Đang hoạt động</mark>
          </header>
          <div className="button-line">
            <button onClick={() => setModal({ type: "org" })}><Edit3 size={16} /> Chỉnh sửa thông tin</button>
            <button className="danger" onClick={() => setModal({ type: "delete-org" })}><Trash2 size={16} /> Xóa tổ chức</button>
          </div>
          <InfoGrid />
        </section>
        <section className="account-info-card">
          <header>
            <UserPlus size={22} />
            <h3>Thông tin tài khoản</h3>
            <mark className="owner-label">Chủ sở hữu</mark>
          </header>
          <ReadField icon={Users} label="Họ và tên" value="Hoan Ngo" />
          <ReadField icon={Mail} label="Email" value="user@example.com" />
          <ReadField icon={Phone} label="Số điện thoại" value="0973081446" />
          <ReadField
            icon={Lock}
            label="Mật khẩu"
            value="••••••••"
            action="Đổi"
            onAction={() => setModal({ type: "password" })}
          />
        </section>
      </div>
      <section className={`billing-section ${section === "billing" ? "open" : ""}`}>
        <p className="section-label">Gói dịch vụ</p>
        <div className="plan-card">
          <div>
            <Crown size={28} />
            <small>Gói hiện tại <mark className="green">Đang hoạt động</mark></small>
            <h2>Demo</h2>
            <span className="today-pill">Hôm nay</span>
          </div>
          <div className="days-left"><strong>29</strong><span>ngày<br />còn lại</span></div>
          <div className="timeline">
            <span />
            <span />
          </div>
          <footer>
            <span>Bắt đầu<br /><strong>27/6/2026</strong></span>
            <span>Kết thúc<br /><strong>27/7/2026</strong></span>
          </footer>
        </div>
        <div className="usage-card">
          <h3>Tình trạng sử dụng</h3>
          <UsageRow label="Nhân viên sử dụng" value="1 / 2 người" pct="50%" />
          <UsageRow label="Kênh kết nối" value="1 / 2 kênh" pct="50%" />
          <UsageRow label="AI Token" value="0 / 1.000.000 token" pct="0%" muted />
        </div>
        <div className="upgrade-strip">
          <span>
            <Sparkles size={18} />
            <strong>Nâng cấp để mở rộng hạn mức</strong>
            <small>Thêm nhân viên, kênh kết nối và AI token theo nhu cầu thực tế.</small>
          </span>
          <button className="primary-action" onClick={() => setModal({ type: "upgrade" })}>Nâng cấp</button>
        </div>
        <p className="section-label">Thanh toán</p>
        <button className="accordion-line" onClick={() => setInvoiceOpen((value) => !value)}>
          Hóa đơn gần đây <ChevronDown size={18} />
        </button>
        {invoiceOpen && <BillingList type="invoice" />}
        <button className="accordion-line" onClick={() => setPaymentOpen((value) => !value)}>
          Lịch sử thanh toán <ChevronDown size={18} />
        </button>
        {paymentOpen && <BillingList type="payment" />}
      </section>
      {modal?.type === "org" && (
        <OrgInfoModal
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            onNotify("Đã lưu thông tin tổ chức.");
          }}
        />
      )}
      {modal?.type === "password" && (
        <PasswordModal
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            onNotify("Đã cập nhật mật khẩu.");
          }}
        />
      )}
      {modal?.type === "upgrade" && (
        <UpgradeModal
          onClose={() => setModal(null)}
          onSelect={() => {
            setModal(null);
            onBilling();
            onNotify("Đã chọn gói nâng cấp mẫu.");
          }}
        />
      )}
      {modal?.type === "delete-org" && (
        <ConfirmModal
          title="Xóa tổ chức"
          copy="Luồng clone mô phỏng bước xác nhận xóa tổ chức, thao tác này không xóa dữ liệu thật."
          confirmText="Tôi hiểu"
          onClose={() => setModal(null)}
          onConfirm={() => {
            setModal(null);
            onNotify("Đã ghi nhận xác nhận xóa tổ chức trong bản clone.");
          }}
        />
      )}
    </PageScaffold>
  );
}

function InviteEmployeeModal({ onClose, onInvite }) {
  const [name, setName] = useState("Nhân viên mới");
  const [email, setEmail] = useState("new.member@example.com");
  const [phone, setPhone] = useState("0900000000");

  return (
    <ModalShell title="Mời tham gia tổ chức" onClose={onClose}>
      <p className="modal-copy">Tạo lời mời nhân viên và gán quyền truy cập hội thoại sau khi họ tham gia.</p>
      <FormInput label="Họ và tên" value={name} onChange={(event) => setName(event.target.value)} />
      <FormInput label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <FormInput label="Số điện thoại" value={phone} onChange={(event) => setPhone(event.target.value)} />
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        <button
          className="primary-action"
          onClick={() =>
            onInvite({
              id: `employee-${Date.now()}`,
              name: name.trim() || "Nhân viên mới",
              email: email.trim() || "new.member@example.com",
              phone: phone.trim() || "0900000000",
              role: "Nhân viên",
              status: "Chờ tham gia",
              owner: false
            })
          }
        >
          <Mail size={17} />
          Gửi lời mời
        </button>
      </div>
    </ModalShell>
  );
}

function EmployeeEditModal({ employee, onClose, onSave }) {
  const [name, setName] = useState(employee.name);
  const [phone, setPhone] = useState(employee.phone);

  return (
    <ModalShell title="Chỉnh sửa nhân viên" onClose={onClose}>
      <p className="modal-copy">Cập nhật thông tin hiển thị của nhân viên trong tổ chức.</p>
      <FormInput label="Họ và tên" value={name} onChange={(event) => setName(event.target.value)} />
      <FormInput label="Số điện thoại" value={phone} onChange={(event) => setPhone(event.target.value)} />
      <div className="modal-status-card">
        <Avatar label={employee.name.slice(0, 2).toUpperCase()} tone="blue" />
        <span>
          <strong>{employee.email}</strong>
          <small>{employee.role} • {employee.status}</small>
        </span>
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        <button
          className="primary-action"
          onClick={() => onSave({ ...employee, name: name.trim() || employee.name, phone: phone.trim() || employee.phone })}
        >
          <Check size={17} />
          Lưu thay đổi
        </button>
      </div>
    </ModalShell>
  );
}

function PermissionModal({ employee, onClose, onSave }) {
  const [selected, setSelected] = useState(["Tất cả - Tài khoản mẫu - Zalo", "Khách hàng"]);

  return (
    <ModalShell title="Phân quyền hội thoại" onClose={onClose}>
      <p className="modal-copy">Chọn các thẻ hội thoại mà {employee.name} được phép xem và phản hồi.</p>
      <div className="permission-list">
        {tagRows.map(([name, color]) => (
          <label className="check-row" key={name}>
            <input
              type="checkbox"
              checked={selected.includes(name)}
              onChange={() =>
                setSelected((items) =>
                  items.includes(name) ? items.filter((item) => item !== name) : [...items, name]
                )
              }
            />
            <span style={{ background: color }} />
            {name}
          </label>
        ))}
      </div>
      <div className="modal-footer">
        <span>{selected.length} thẻ đang chọn</span>
        <button onClick={onClose}>Hủy</button>
        <button className="primary-action" onClick={onSave}>
          <Check size={17} />
          Cập nhật quyền
        </button>
      </div>
    </ModalShell>
  );
}

function ManageChannelModal({ channel, onClose, onRefresh }) {
  const [detail, setDetail] = useState("status");
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [listeners, setListeners] = useState([]);
  const [busy, setBusy] = useState(false);
  const isZaloPersonal = channel === "Zalo cá nhân";

  useEffect(() => {
    if (!isZaloPersonal) return undefined;
    let cancelled = false;
    const fetchListeners = async () => {
      try {
        const payload = await apiRequest("/api/integrations/zalo-personal/listeners");
        if (!cancelled) setListeners(payload.listeners || []);
      } catch (error) {
        if (!cancelled) setListeners([]);
      }
    };
    fetchListeners();
    const timer = window.setInterval(fetchListeners, 4_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [isZaloPersonal]);

  const handleAction = async (accountId, action) => {
    setBusy(true);
    try {
      await apiRequest(`/api/integrations/zalo-personal/accounts/${accountId}/listener/${action}`, { method: "POST" });
      onRefresh?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell title={`Quản lý ${channel}`} onClose={onClose} wide>
      <div className="channel-manage">
        <div className="modal-status-card">
          <Avatar label="T" tone="blue" />
          <span>
            <strong>Tài khoản mẫu</strong>
            <small>{isZaloPersonal ? "QR session active • zca-js adapter • đồng bộ 2 phút trước" : "Đang hoạt động • đồng bộ 2 phút trước"}</small>
          </span>
          <mark className="green">Online</mark>
        </div>
        <div className="channel-options">
          <button onClick={onRefresh}><Activity size={17} /> Kiểm tra kết nối</button>
          <button onClick={() => setDetail("notify")}><Bell size={17} /> Cấu hình thông báo</button>
          <button onClick={() => setDetail("permission")}><Shield size={17} /> Phân quyền nhân viên</button>
          {isZaloPersonal && <button onClick={() => setDetail("listener")}><Activity size={17} /> Trạng thái listener</button>}
          {isZaloPersonal && <button onClick={() => setDetail("adapter")}><Blocks size={17} /> Thư viện QR</button>}
        </div>
        {detail === "status" && (
          <div className="channel-detail-panel">
            <strong>Trạng thái đồng bộ</strong>
            <p>
              {isZaloPersonal
                ? "Tin nhắn, danh bạ và trạng thái tài khoản được đồng bộ qua phiên QR lưu ở backend. Listener đang chạy trên server, mọi message real sẽ vào hội thoại trong app."
                : "Tin nhắn mới, danh bạ và trạng thái tài khoản đang được đồng bộ ổn định."}
            </p>
            {isZaloPersonal && listeners.length > 0 && (
              <div className="listener-list">
                {listeners.map((item) => (
                  <div key={item.accountId} className="listener-row">
                    <Avatar label={deriveInitials(item.displayName || "Z")} tone="teal" />
                    <div className="listener-info">
                      <strong>{item.displayName || "Tài khoản Zalo"}</strong>
                      <small>ID: {item.accountId.slice(0, 8)}…</small>
                    </div>
                    <span
                      className={`listener-status ${item.listener?.status || "stopped"}`}
                      title={item.listener?.lastError || ""}
                    >
                      <span className="listener-dot" />
                      {labelForListener(item.listener?.status)}
                    </span>
                    <button onClick={() => handleAction(item.accountId, item.listener?.status === "connected" ? "stop" : "start")} disabled={busy}>
                      {item.listener?.status === "connected" ? "Dừng" : "Khởi động lại"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {isZaloPersonal && (
              <div className="integration-contract">
                <ReadOnlyBox label="QR endpoint" value={zaloQrSession.endpoint} />
                <ReadOnlyBox label="Stream" value="/api/integrations/zalo-personal/stream (SSE)" />
                <ReadOnlyBox label="Session store" value={zaloQrSession.storage} />
              </div>
            )}
          </div>
        )}
        {detail === "listener" && isZaloPersonal && (
          <div className="channel-detail-panel">
            <strong>Listener realtime (zca-js WebSocket)</strong>
            <p>Listener kết nối tới máy chủ Zalo qua cookie đã mã hóa, tự reconnect với backoff khi mất mạng.</p>
            {listeners.length === 0 && <div className="modal-empty">Chưa có tài khoản Zalo nào.</div>}
            {listeners.length > 0 && (
              <div className="listener-list">
                {listeners.map((item) => (
                  <div key={item.accountId} className="listener-row">
                    <Avatar label={deriveInitials(item.displayName || "Z")} tone="blue" />
                    <div className="listener-info">
                      <strong>{item.displayName || "Tài khoản Zalo"}</strong>
                      <small>
                        Last connect: {item.listener?.lastConnectedAt ? formatZaloRelative(item.listener.lastConnectedAt) : "—"}
                        {item.listener?.reconnectAttempts ? ` • retry ${item.listener.reconnectAttempts}` : ""}
                      </small>
                      {item.listener?.lastError && <small className="risk-note">{item.listener.lastError}</small>}
                    </div>
                    <span className={`listener-status ${item.listener?.status || "stopped"}`}>
                      <span className="listener-dot" />
                      {labelForListener(item.listener?.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {detail === "notify" && (
          <div className="channel-detail-panel">
            <strong>Cấu hình thông báo</strong>
            <label className="switch-row" onClick={() => setNotifyEnabled((value) => !value)}>
              Nhận thông báo tin nhắn mới
              <span className={`switch ${notifyEnabled ? "on" : ""}`} />
            </label>
            <label className="switch-row">
              Thông báo khi mất kết nối
              <span className="switch on" />
            </label>
          </div>
        )}
        {detail === "permission" && (
          <div className="channel-detail-panel">
            <strong>Nhân viên được phân quyền</strong>
            {["Hoan Ngo", "QA Tester"].map((name) => (
              <label className="check-row" key={name}>
                <input type="checkbox" defaultChecked />
                <span style={{ background: "#0068FF" }} />
                {name}
              </label>
            ))}
          </div>
        )}
        {detail === "adapter" && (
          <div className="channel-detail-panel">
            <strong>Thư viện đã khảo sát</strong>
            <div className="library-list">
              {zaloPersonalResearch.map((item) => (
                <article key={item.name}>
                  <span>
                    <b>{item.name}</b>
                    <small>{item.package}</small>
                  </span>
                  <mark>{item.fit}</mark>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
            <div className="risk-note">
              Zalo cá nhân QR là hướng unofficial. Khi chạy thật nên dùng tài khoản thử nghiệm, giới hạn rate và có cơ chế ngắt phiên.
            </div>
          </div>
        )}
      </div>
      <div className="modal-footer">
        <span>{isZaloPersonal ? "Luồng QR thật cần backend adapter; prototype đang mô phỏng trạng thái an toàn." : "Clone mô phỏng trạng thái kết nối, không đăng nhập tài khoản thật."}</span>
        <button className="primary-action" onClick={onClose}>Xong</button>
      </div>
    </ModalShell>
  );
}

function ConnectChannelModal({ channel, onClose, onDone }) {
  if (channel === "Zalo cá nhân") {
    return <ZaloPersonalQrModal onClose={onClose} onDone={onDone} />;
  }

  return (
    <ModalShell title={`Kết nối ${channel}`} onClose={onClose}>
      <p className="modal-copy">Làm theo luồng xác thực để thêm kênh mới vào tổ chức. Bản clone dùng trạng thái mô phỏng.</p>
      <div className="connect-panel">
        <div className="qr-placeholder">
          <Zap size={28} />
        </div>
        <span>
          <strong>Mở ứng dụng {channel.includes("Facebook") ? "Facebook" : "Zalo"} và quét mã</strong>
          <small>Mã QR mẫu hết hạn sau 120 giây.</small>
        </span>
      </div>
      <FormInput label="Tên hiển thị" placeholder="VD: CSKH chi nhánh 1" />
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        <button className="primary-action" onClick={onDone}>
          <Check size={17} />
          Hoàn tất mô phỏng
        </button>
      </div>
    </ModalShell>
  );
}

function ZaloPersonalQrModal({ onClose, onDone }) {
  const [session, setSession] = useState(null);
  const [displayName, setDisplayName] = useState("Tài khoản Zalo CSKH");
  const [pollCount, setPollCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const status = session?.status || "idle";
  const qrReady = ["qr_ready", "scanned", "linked"].includes(status);
  const linked = status === "linked";
  const terminal = session?.isTerminal;

  const statusLabel = {
    idle: "Chưa tạo QR session",
    initializing: "Backend đang tạo QR thật",
    qr_ready: "Đang chờ quét mã trong app Zalo",
    scanned: "Điện thoại đã quét, đang chờ xác nhận",
    linked: "Kết nối Zalo cá nhân thành công",
    expired: "QR đã hết hạn",
    declined: "Đăng nhập đã bị từ chối",
    aborted: "Phiên QR đã hủy",
    error: "Không thể tạo/kết nối QR"
  }[status] || status;

  const refreshSession = async (id = session?.id) => {
    if (!id) return;
    const payload = await apiRequest(`/api/integrations/zalo-personal/qr-session/${id}`);
    setSession(payload.session);
    setPollCount((value) => value + 1);
  };

  const requestQr = async () => {
    setLoading(true);
    setError("");
    setPollCount(0);
    try {
      const payload = await apiRequest("/api/integrations/zalo-personal/qr-session", {
        method: "POST",
        body: JSON.stringify({ displayName })
      });
      setSession(payload.session);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const abortQr = async () => {
    if (!session?.id) return;
    setLoading(true);
    setError("");
    try {
      const payload = await apiRequest(`/api/integrations/zalo-personal/qr-session/${session.id}`, {
        method: "DELETE"
      });
      setSession(payload.session);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.id || terminal) return undefined;
    const interval = window.setInterval(() => {
      refreshSession(session.id).catch((requestError) => setError(requestError.message));
    }, 1800);
    return () => window.clearInterval(interval);
  }, [session?.id, terminal]);

  return (
    <ModalShell title="Kết nối Zalo cá nhân bằng QR" onClose={onClose} wide>
      <div className="zalo-connect-layout">
        <section className="qr-stage">
          <div className={`qr-frame ${qrReady ? "ready" : ""}`} aria-label="Mã QR đăng nhập Zalo cá nhân">
            {session?.qrImage ? (
              <img src={session.qrImage} alt="QR đăng nhập Zalo cá nhân" />
            ) : (
              <>
                <div className="fake-qr">
                  {Array.from({ length: 64 }).map((_, index) => (
                    <span key={index} className={(index * 7 + index) % 5 < 2 ? "dark" : ""} />
                  ))}
                </div>
                <Avatar label="Z" tone="blue" />
              </>
            )}
          </div>
          <div>
            <strong>{statusLabel}</strong>
            <small>
              {session?.id
                ? `Session: ${session.id.slice(0, 8)} • ${session.expiresAt ? `hết hạn ${new Date(session.expiresAt).toLocaleTimeString("vi-VN")}` : "đang chờ backend"}`
                : "Frontend gọi backend tạo QR thật bằng zca-js, cookie được mã hóa và lưu server-side."}
            </small>
            {session?.scannedUser && (
              <small>Đã quét bởi: {session.scannedUser.displayName}</small>
            )}
            {error && <small className="api-status error">{error}</small>}
            {session?.errorMessage && <small className="api-status error">{session.errorMessage}</small>}
          </div>
          <div className="qr-actions">
            <button className={loading ? "primary-disabled" : "primary-action"} onClick={requestQr}>
              <Zap size={17} />
              {session ? "Tạo QR mới" : "Tạo QR thật"}
            </button>
            <button
              className={session?.id && !terminal ? "wide-outline" : "primary-disabled"}
              onClick={() => refreshSession()}
            >
              <Activity size={17} />
              Poll trạng thái ({pollCount})
            </button>
            <button
              className={session?.id && !terminal ? "wide-outline" : "primary-disabled"}
              onClick={abortQr}
            >
              Hủy phiên QR
            </button>
          </div>
        </section>
        <section className="adapter-panel">
          <div className="stepper-list">
            {[
              ["1", "Backend tạo QR session bằng zca-js", status !== "idle"],
              ["2", "Người dùng quét QR trong app Zalo", ["scanned", "linked"].includes(status)],
              ["3", "Backend nhận cookie/imei/userAgent", linked],
              ["4", "Mã hóa session và lưu DB SQLite", linked]
            ].map(([number, label, done]) => (
              <div className={done ? "done" : ""} key={label}>
                <b>{number}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <label className="form-field">
            Tên hiển thị
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </label>
          <div className="integration-contract">
            <ReadOnlyBox label="Adapter ưu tiên" value="zca-js backend adapter" />
            <ReadOnlyBox label="QR create" value={zaloQrSession.endpoint} />
            <ReadOnlyBox label="Polling status" value={zaloQrSession.statusEndpoint} />
            <ReadOnlyBox label="DB/session store" value="node:sqlite + AES-256-GCM" />
          </div>
          <div className="api-status">
            API base: {API_BASE_URL || "same-origin"} • Trạng thái: {status}
          </div>
          <div className="risk-note">
            `zca-js` là unofficial cho Zalo cá nhân. QR trong màn này được tạo thật từ backend, nhưng việc sử dụng tài khoản cá nhân vẫn có rủi ro bị giới hạn theo chính sách nền tảng.
          </div>
        </section>
      </div>
      <div className="modal-footer">
        <span>{linked ? `${session.linkedAccount?.displayName || displayName} đã sẵn sàng đồng bộ.` : "Mở app Zalo trên điện thoại để quét QR thật."}</span>
        <button onClick={onClose}>Hủy</button>
        <button
          className={linked ? "primary-action" : "primary-disabled"}
          onClick={() => linked && onDone()}
        >
          <Check size={17} />
          Hoàn tất kết nối
        </button>
      </div>
    </ModalShell>
  );
}

function TagEditorModal({ tag, onClose, onSave }) {
  const [name, setName] = useState(tag?.name || "Thẻ mới");
  const [color, setColor] = useState(tag?.color || "#0068FF");
  const swatches = ["#D91B1B", "#F31BC8", "#FF6905", "#FAC000", "#4BC377", "#0068FF"];

  return (
    <ModalShell title={tag ? "Chỉnh sửa thẻ" : "Tạo thẻ mới"} onClose={onClose}>
      <p className="modal-copy">Thẻ dùng để phân loại và cấp quyền truy cập hội thoại.</p>
      <FormInput label="Tên thẻ" value={name} onChange={(event) => setName(event.target.value)} />
      <div className="tag-color-picker">
        <span>Màu hiển thị</span>
        <div>
          {swatches.map((item) => (
            <button
              key={item}
              className={color === item ? "active" : ""}
              style={{ background: item }}
              onClick={() => setColor(item)}
              aria-label={`Chọn màu ${item}`}
            />
          ))}
        </div>
      </div>
      <div className="tag-preview">
        <small>Xem trước</small>
        <mark style={{ borderColor: color, color }}>{name || "Thẻ mới"}</mark>
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        <button className="primary-action" onClick={() => onSave({ name: name.trim() || "Thẻ mới", color })}>
          <Check size={17} />
          Lưu thẻ
        </button>
      </div>
    </ModalShell>
  );
}

function KnowledgeSourceModal({ type, onClose, onSave }) {
  const [name, setName] = useState(type === "file" ? "bang-gia-demo.pdf" : "https://example.com/kien-thuc");
  const [category, setCategory] = useState("Thông tin sản phẩm");

  return (
    <ModalShell title={type === "file" ? "Tải lên tài liệu" : "Nạp dữ liệu từ website"} onClose={onClose}>
      <p className="modal-copy">
        {type === "file"
          ? "Chọn tên tài liệu để mô phỏng quá trình đưa file vào Kho tri thức."
          : "Nhập URL website để mô phỏng quá trình thu thập dữ liệu huấn luyện."}
      </p>
      <FormInput
        label={type === "file" ? "Tên tài liệu" : "URL website"}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <label className="form-field">
        Danh mục
        <button className="fake-select" onClick={() => setCategory((value) => (value === "Thông tin sản phẩm" ? "Hỏi đáp (FAQ)" : "Thông tin sản phẩm"))}>
          {category}
          <ChevronDown size={16} />
        </button>
      </label>
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        <button
          className="primary-action"
          onClick={() =>
            onSave({
              id: `source-${Date.now()}`,
              name: name.trim() || (type === "file" ? "tai-lieu-demo.pdf" : "https://example.com"),
              category,
              type: type === "file" ? "Tài liệu" : "Website"
            })
          }
        >
          <UploadCloud size={17} />
          Thêm dữ liệu
        </button>
      </div>
    </ModalShell>
  );
}

function OrgInfoModal({ onClose, onSave }) {
  return (
    <ModalShell title="Chỉnh sửa thông tin tổ chức" onClose={onClose} wide>
      <div className="form-grid">
        <FormInput label="Tên tổ chức" value="MH power" onChange={() => {}} />
        <FormInput label="Mã số thuế" placeholder="Chưa cập nhật" />
        <FormInput label="Email liên hệ" placeholder="company@example.com" />
        <FormInput label="Số điện thoại" placeholder="0900000000" />
      </div>
      <label className="form-field">
        Địa chỉ
        <textarea placeholder="Nhập địa chỉ tổ chức" />
      </label>
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        <button className="primary-action" onClick={onSave}>
          <Check size={17} />
          Lưu thông tin
        </button>
      </div>
    </ModalShell>
  );
}

function PasswordModal({ onClose, onSave }) {
  return (
    <ModalShell title="Đổi mật khẩu" onClose={onClose}>
      <FormInput label="Mật khẩu hiện tại" type="password" placeholder="Nhập mật khẩu hiện tại" />
      <FormInput label="Mật khẩu mới" type="password" placeholder="Nhập mật khẩu mới" />
      <FormInput label="Nhập lại mật khẩu mới" type="password" placeholder="Xác nhận mật khẩu mới" />
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        <button className="primary-action" onClick={onSave}>
          <Lock size={17} />
          Cập nhật
        </button>
      </div>
    </ModalShell>
  );
}

function UpgradeModal({ onClose, onSelect }) {
  return (
    <ModalShell title="Nâng cấp gói" onClose={onClose} wide>
      <div className="plan-options">
        {[
          ["Demo", "Đang dùng", "2 nhân viên • 2 kênh • 1M token"],
          ["Growth", "Phổ biến", "10 nhân viên • 8 kênh • 10M token"],
          ["Business", "Mở rộng", "Không giới hạn nhân viên • SLA ưu tiên"]
        ].map(([name, label, desc], index) => (
          <button className={index === 1 ? "featured" : ""} key={name} onClick={onSelect}>
            <small>{label}</small>
            <strong>{name}</strong>
            <span>{desc}</span>
          </button>
        ))}
      </div>
      <div className="modal-footer">
        <span>Thanh toán thật chưa được kích hoạt trong bản clone.</span>
        <button onClick={onClose}>Đóng</button>
      </div>
    </ModalShell>
  );
}

function BillingList({ type }) {
  const rows =
    type === "invoice"
      ? [["INV-2026-001", "Demo", "0đ", "Đã thanh toán"]]
      : [["27/06/2026", "Kích hoạt gói Demo", "0đ", "Thành công"]];

  return (
    <div className="billing-list">
      {rows.map(([a, b, c, d]) => (
        <div key={a}>
          <span>
            <strong>{a}</strong>
            <small>{b}</small>
          </span>
          <em>{c}</em>
          <mark className="green">{d}</mark>
        </div>
      ))}
    </div>
  );
}

function ConfirmModal({ title, copy, confirmText, onClose, onConfirm }) {
  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="confirm-card">
        <Trash2 size={30} />
        <p>{copy}</p>
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>Hủy</button>
        <button className="danger-action" onClick={onConfirm}>{confirmText}</button>
      </div>
    </ModalShell>
  );
}

function UtilityModal({ type, onClose, onNotify }) {
  const configs = {
    contacts: {
      title: "Danh bạ",
      icon: UsersRound,
      copy: "Quản lý danh bạ Zalo đã đồng bộ và thao tác nhanh với liên hệ.",
      rows: [
        ["Ác Quy An Phát", "Zalo cá nhân • Đã đồng bộ"],
        ["Minh Anh", "Khách hàng tiềm năng"],
        ["Lan Hỗ trợ", "Nội bộ"]
      ],
      action: "Tạo liên hệ"
    },
    files: {
      title: "Tệp đã gửi",
      icon: ClipboardList,
      copy: "Theo dõi tệp, ảnh và tài liệu được gửi trong các hội thoại.",
      rows: [
        ["bao-gia-demo.pdf", "PDF • 1.2 MB • Hôm nay"],
        ["anh-minh-hoa.png", "PNG • 840 KB • Hôm nay"],
        ["lich-hop.xlsx", "Excel • 420 KB • Hôm qua"]
      ],
      action: "Tải danh sách"
    },
    data: {
      title: "Kho dữ liệu",
      icon: Layers,
      copy: "Không gian lưu trữ tài liệu dùng cho vận hành và AI Agent.",
      rows: [
        ["Knowledge Base", "2 nguồn đang chờ xử lý"],
        ["File hội thoại", "3 tệp gần đây"],
        ["Mẫu trả lời", "3 mẫu khả dụng"]
      ],
      action: "Đồng bộ"
    }
  };

  if (type === "logout") {
    return (
      <ConfirmModal
        title="Đăng xuất"
        copy="Bản clone sẽ mô phỏng thao tác đăng xuất và giữ nguyên phiên làm việc local."
        confirmText="Đăng xuất"
        onClose={onClose}
        onConfirm={() => {
          onClose();
          onNotify("Đã mô phỏng thao tác đăng xuất.");
        }}
      />
    );
  }

  const config = configs[type] || configs.contacts;
  const Icon = config.icon;

  return (
    <ModalShell title={config.title} onClose={onClose} wide>
      <p className="modal-copy">{config.copy}</p>
      <div className="utility-grid">
        {config.rows.map(([title, desc]) => (
          <button key={title}>
            <Icon size={20} />
            <span>
              <strong>{title}</strong>
              <small>{desc}</small>
            </span>
            <ChevronDown size={16} />
          </button>
        ))}
      </div>
      <div className="modal-footer">
        <span>{config.rows.length} mục hiển thị</span>
        <button onClick={onClose}>Đóng</button>
        <button
          className="primary-action"
          onClick={() => onNotify(`${config.action} trong ${config.title} đã được mô phỏng.`)}
        >
          <Check size={17} />
          {config.action}
        </button>
      </div>
    </ModalShell>
  );
}

function OrganizationPicker({ onEnter }) {
  const [modal, setModal] = useState(null);
  const [newOrgName, setNewOrgName] = useState("Tổ chức mới");

  return (
    <div className="org-picker-page">
      <Logo />
      <section>
        <header>
          <div>
            <h1>Chọn tổ chức để tiếp tục</h1>
            <p>Chọn tổ chức muốn truy cập hoặc tạo tổ chức mới.</p>
          </div>
          <button onClick={() => setModal("login")}>Quay về đăng nhập</button>
          <button className="primary-action" onClick={() => setModal("create")}><Plus size={17} /> Thêm tổ chức của bạn</button>
        </header>
        <button className="org-choice" onClick={onEnter} aria-label="Vào tổ chức MH power">
          <span>MP</span>
          <strong>MH power</strong>
          <small>Mặc định • Chủ sở hữu • Hoạt động</small>
          <ChevronDown size={20} />
        </button>
      </section>
      <footer>© 2025 Top AiChat. Tất cả quyền được bảo lưu.</footer>
      {modal === "login" && (
        <ModalShell title="Quay về đăng nhập" onClose={() => setModal(null)}>
          <p className="modal-copy">Bản clone mô phỏng thao tác quay về màn đăng nhập mà không làm mất dữ liệu local.</p>
          <div className="modal-footer">
            <button onClick={() => setModal(null)}>Ở lại</button>
            <button className="primary-action" onClick={() => setModal(null)}>Xác nhận</button>
          </div>
        </ModalShell>
      )}
      {modal === "create" && (
        <ModalShell title="Thêm tổ chức" onClose={() => setModal(null)}>
          <FormInput
            label="Tên tổ chức"
            value={newOrgName}
            onChange={(event) => setNewOrgName(event.target.value)}
          />
          <FormInput label="Lĩnh vực" placeholder="VD: Bán lẻ, giáo dục, dịch vụ" />
          <div className="modal-footer">
            <button onClick={() => setModal(null)}>Hủy</button>
            <button className="primary-action" onClick={() => setModal(null)}>
              <Plus size={17} />
              Tạo tổ chức
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function PageScaffold({ icon: Icon, title, subtitle, eyebrow, children, centered }) {
  return (
    <div className={`page ${centered ? "centered-page" : ""}`}>
      <header className="page-title">
        <span className="page-icon"><Icon size={28} /></span>
        <div>
          {eyebrow && <mark>{eyebrow}</mark>}
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </header>
      {children}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub, foot, color }) {
  return (
    <article className={`metric-card ${color}`}>
      <span><Icon size={27} /></span>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{sub}</small>
      {foot && <em>{foot}</em>}
    </article>
  );
}

function MiniMetric({ title, value, active }) {
  return (
    <article className={`mini-metric ${active ? "active" : ""}`}>
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
}

function IntegrationCard({ title, connected, button, onManage, onConnect, accountLabel }) {
  return (
    <section className="integration-card">
      <header>
        <Avatar label={title.includes("Facebook") ? "F" : "Z"} tone={connected ? "blue" : "teal"} />
        <div>
          <h3>{title}</h3>
          <p>{accountLabel || (connected ? "1 tài khoản hoạt động" : "Chưa kết nối")}</p>
        </div>
      </header>
      {connected ? (
        <div className="connected-row">
          <Avatar label="Z" tone="blue" />
          <strong>{title}</strong>
          <span />
        </div>
      ) : (
        <div className="empty-integration">
          <Zap size={22} />
          <strong>Chưa có tài khoản nào</strong>
          <p>Hãy kết nối tài khoản để bắt đầu</p>
        </div>
      )}
      <footer>
        {connected && <button onClick={onManage}>Quản lý</button>}
        <button className="primary-action" onClick={onConnect}><Plus size={17} /> {button}</button>
      </footer>
    </section>
  );
}

function InfoGrid() {
  return (
    <div className="info-grid">
      <ReadOnlyBox label="Tên tổ chức" value="MH power" />
      <ReadOnlyBox label="Mã số thuế" value="Chưa cập nhật" />
      <ReadOnlyBox label="Lĩnh vực" value="Chưa cập nhật" />
      <ReadOnlyBox label="Email liên hệ" value="Chưa cập nhật" />
      <ReadOnlyBox label="Số điện thoại" value="Chưa cập nhật" />
      <ReadOnlyBox label="Địa chỉ" value="Chưa cập nhật" wide />
      <ReadOnlyBox label="Trạng thái tổ chức" value="Hoạt động" />
      <ReadOnlyBox label="Ngày tạo" value="27/06/2026 15:34" />
    </div>
  );
}

function ReadOnlyBox({ label, value, wide }) {
  return (
    <label className={wide ? "wide" : ""}>
      {label}
      <span>{value}</span>
    </label>
  );
}

function ReadField({ icon: Icon, label, value, action, onAction }) {
  return (
    <label className="read-field">
      <span><Icon size={15} /> {label}</span>
      <p>{value}{action && <button onClick={onAction}>{action}</button>}</p>
    </label>
  );
}

function UsageRow({ label, value, pct, muted }) {
  return (
    <div className="usage-row">
      <span>{label}</span>
      <em>{value} <b>{pct}</b></em>
      <div><span style={{ width: muted ? "2%" : "50%" }} /></div>
    </div>
  );
}

function Avatar({ label, tone = "blue", large, src }) {
  if (src) {
    return (
      <span className={`avatar ${large ? "large" : ""} ${tone}`}>
        <img src={src} alt={label || "avatar"} style={{ width: "100%", height: "100%", borderRadius: "inherit", objectFit: "cover" }} />
      </span>
    );
  }
  return <span className={`avatar ${tone} ${large ? "large" : ""}`}>{label}</span>;
}

export default App;
