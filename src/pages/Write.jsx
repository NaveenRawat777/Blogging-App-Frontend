import { useEffect, useState } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  CodeXml,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  PenLine,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import client, { getError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Loading, Notice } from "./PageHelpers";
import { categories } from "./constants";

function ContentEditor({ initialContent, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      LinkExtension.configure({ openOnClick: false }),
      UnderlineExtension,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-80 px-4 py-4 text-lg leading-8 outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  if (!editor) return null;

  const insertImage = () => {
    const url = window.prompt("Paste the image URL");
    if (url?.trim()) editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const setLink = () => {
    const url = window.prompt("Paste the link URL");
    if (url?.trim()) {
      const { empty } = editor.state.selection;
      if (empty) {
        const text =
          window.prompt("Text to display for this link") || url.trim();
        editor
          .chain()
          .focus()
          .insertContent({
            type: "text",
            text,
            marks: [{ type: "link", attrs: { href: url.trim() } }],
          })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url.trim() })
          .run();
      }
    }
  };

  const tools = [
    {
      label: "Undo",
      icon: Undo2,
      action: () => editor.chain().focus().undo().run(),
    },
    {
      label: "Redo",
      icon: Redo2,
      action: () => editor.chain().focus().redo().run(),
    },
    {
      label: "Heading 1",
      text: "H1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: () => editor.isActive("heading", { level: 1 }),
    },
    {
      label: "Heading 2",
      text: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: () => editor.isActive("heading", { level: 2 }),
    },
    {
      label: "Heading 3",
      text: "H3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: () => editor.isActive("heading", { level: 3 }),
    },
    {
      label: "Bold",
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: () => editor.isActive("bold"),
    },
    {
      label: "Italic",
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: () => editor.isActive("italic"),
    },
    {
      label: "Strikethrough",
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      active: () => editor.isActive("strike"),
    },
    {
      label: "Underline",
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: () => editor.isActive("underline"),
    },
    {
      label: "Inline code",
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      active: () => editor.isActive("code"),
    },
    {
      label: "Code block",
      icon: CodeXml,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: () => editor.isActive("codeBlock"),
    },
    {
      label: "Bullet list",
      text: "• List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: () => editor.isActive("bulletList"),
    },
    {
      label: "Numbered list",
      text: "1. List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: () => editor.isActive("orderedList"),
    },
    {
      label: "Horizontal rule",
      icon: Minus,
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      label: "Block quote",
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: () => editor.isActive("blockquote"),
    },
    {
      label: "Align left",
      icon: AlignLeft,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      active: () => editor.isActive({ textAlign: "left" }),
    },
    {
      label: "Align centre",
      icon: AlignCenter,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      active: () => editor.isActive({ textAlign: "center" }),
    },
    {
      label: "Align right",
      icon: AlignRight,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      active: () => editor.isActive({ textAlign: "right" }),
    },
    {
      label: "Add link",
      icon: LinkIcon,
      action: setLink,
      active: () => editor.isActive("link"),
    },
    {
      label: "Add image from URL",
      text: "Image",
      icon: ImagePlus,
      action: insertImage,
    },
  ];

  return (
    <div className="overflow-hidden rounded border border-stone-300 bg-white">
      <div className="content-toolbar flex flex-nowrap items-center gap-1 overflow-x-auto border-b border-stone-200 bg-stone-50 p-2">
        {tools.map(({ label, icon: Icon, text, action, active }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            onMouseDown={(event) => {
              event.preventDefault();
              action();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                action();
              }
            }}
            className={`shrink-0 rounded px-2 py-2 text-sm text-stone-600 hover:bg-stone-200 hover:text-forest ${active?.() ? "bg-stone-200 text-forest" : ""}`}
          >
            {Icon && <Icon size={17} className={text ? "mr-1 inline" : ""} />}
            {text}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export function Write() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setError("");
    client
      .get("/blogs", { params: { mine: "true", limit: 50 } })
      .then(({ data }) =>
        setPost(data.items.find((item) => item._id === id) || null),
      )
      .catch((e) => setError(getError(e)));
  }, [id]);

  useEffect(() => {
    setContent(post?.content || "");
    setCover(post?.cover || "");
  }, [post]);

  if (!user) return <Navigate to="/login" />;
  if (id && !post) return <Loading />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    values.tags = String(values.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const endpoint = id ? `/blogs/${id}` : "/blogs";
      await client[id ? "put" : "post"](endpoint, values);
      nav("/dashboard");
    } catch (e) {
      setError(getError(e));
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex justify-between border-b border-stone-200 pb-5 text-sm font-bold">
        <Link to="/dashboard">← My stories</Link>
        <span className="text-stone-500">
          {id ? "Edit story" : "New story"}
        </span>
      </div>

      <form onSubmit={submit} className="mx-auto grid max-w-3xl gap-5 py-12">
        <select
          className="w-44 rounded border border-stone-300 bg-white px-3 py-2 text-sm"
          name="category"
          defaultValue={post?.category || "General"}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          className="border-0 bg-transparent p-0 font-display text-5xl font-bold outline-none placeholder:text-stone-300"
          name="title"
          defaultValue={post?.title}
          placeholder="A title worth stopping for"
          required
        />
        <textarea
          className="min-h-20 resize-y border-0 bg-transparent p-0 text-lg leading-7 text-stone-500 outline-none placeholder:text-stone-300"
          name="excerpt"
          defaultValue={post?.excerpt}
          placeholder="A short, compelling summary…"
        />

        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-bold" htmlFor="cover">
              Story cover image
            </label>
            {cover && (
              <button
                type="button"
                onClick={() => setCover("")}
                className="text-xs font-bold text-stone-500 hover:text-coral"
              >
                Remove image
              </button>
            )}
          </div>
          {cover ? (
            <img
              src={cover}
              alt="Story cover preview"
              className="h-56 w-full rounded border border-stone-200 object-cover"
              onLoad={(event) => {
                event.currentTarget.style.display = "block";
              }}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="grid h-40 place-items-center rounded border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500">
              Add an image URL to create a cover for this story.
            </div>
          )}
          <input
            id="cover"
            className="rounded border border-stone-300 bg-white px-3 py-3"
            name="cover"
            type="url"
            value={cover}
            onChange={(event) => setCover(event.target.value)}
            placeholder="https://example.com/your-cover-image.jpg"
          />
        </section>

        <section>
          <label className="mb-2 block text-sm font-bold" htmlFor="content">
            Content
          </label>
          <ContentEditor
            key={post?._id || "new"}
            initialContent={post?.content}
            onChange={setContent}
          />
          <input
            id="content"
            type="hidden"
            name="content"
            value={content}
            required
          />
        </section>

        <input
          className="rounded border border-stone-300 bg-white px-3 py-3"
          name="tags"
          defaultValue={post?.tags?.join(", ")}
          placeholder="Tags, separated by commas"
        />
        <button
          type="submit"
          disabled={submitting}
          className="justify-self-end inline-flex items-center gap-2 rounded bg-forest px-5 py-3 text-sm font-bold text-white hover:bg-forest/90 transition disabled:opacity-70"
        >
          {submitting ? (
            "Saving…"
          ) : id ? (
            <>
              Update story <PenLine size={16} />
            </>
          ) : (
            <>
              Publish story <PenLine size={16} />
            </>
          )}
        </button>
        <Notice error={error} />
      </form>
    </main>
  );
}
