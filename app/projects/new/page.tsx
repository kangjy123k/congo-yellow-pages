"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useDict } from "@/lib/i18n/I18nProvider";

const CATS: Array<{ key: string; value: string }> = [
  { key: "construction", value: "Construction" },
  { key: "renovation", value: "Rénovation" },
  { key: "road", value: "Route" },
  { key: "other", value: "Autre" },
];

export default function NewProjectPage() {
  const dict = useDict();
  const t = dict.projectsNew;
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title"),
      category: fd.get("category"),
      budget: fd.get("budget") ? Number(fd.get("budget")) : undefined,
      budgetUnit: "USD",
      description: fd.get("description"),
      location: fd.get("location"),
      contact: fd.get("contact"),
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    if (res.ok) setSubmitted(true);
    else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || t.submitting);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.success}</h2>
          <div className="flex gap-3 justify-center mt-6">
            <Link
              href="/projects"
              className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              {t.back}
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {dict.nav.home}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900">{t.title}</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-4"
        >
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          <Field label={t.fields.title} required>
            <input
              name="title"
              required
              type="text"
              placeholder={t.placeholders.title}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </Field>

          <Field label={t.fields.category}>
            <select
              name="category"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              defaultValue=""
            >
              <option value="">{dict.common.category}</option>
              {CATS.map((c) => (
                <option key={c.value} value={c.value}>
                  {dict.projects.cat[c.key as keyof typeof dict.projects.cat]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.fields.budget}>
            <input
              name="budget"
              type="number"
              min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </Field>

          <Field label={t.fields.description} required>
            <textarea
              name="description"
              required
              rows={4}
              placeholder={t.placeholders.description}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
          </Field>

          <Field label={t.fields.location}>
            <input
              name="location"
              type="text"
              placeholder={t.placeholders.location}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </Field>

          <Field label={t.fields.contact} required>
            <input
              name="contact"
              required
              type="tel"
              placeholder={t.placeholders.contact}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? t.submitting : t.submit}
          </button>

          <p className="text-center text-sm text-gray-500">
            <Link href="/projects" className="text-gray-600 hover:underline">
              ← {t.back}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
