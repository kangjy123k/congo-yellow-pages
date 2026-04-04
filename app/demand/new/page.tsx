"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function NewDemandPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      category: fd.get("category"),
      description: fd.get("description"),
      budget: fd.get("budget") ? Number(fd.get("budget")) : undefined,
    };

    const res = await fetch("/api/demands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      const json = await res.json();
      setError(json.error || "提交失败，请稍后重试");
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">需求已提交！</h2>
          <p className="text-gray-500 mb-6">我们会尽快与您联系，匹配合适的商家。</p>
          <Link
            href="/"
            className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900">登记需求</h1>
          <p className="text-gray-500 mt-1">告诉我们您需要什么，我们帮您找到合适的商家</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-4"
        >
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              required
              type="text"
              placeholder="请输入您的姓名"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              联系电话 <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              required
              type="tel"
              placeholder="请输入联系电话"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">需求类型</label>
            <select
              name="category"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">请选择类型（可不选）</option>
              <option value="建材">建材</option>
              <option value="工具">工具</option>
              <option value="电气设备">电气设备</option>
              <option value="工程机械">工程机械</option>
              <option value="装修材料">装修材料</option>
              <option value="家具">家具</option>
              <option value="房建">房建服务</option>
              <option value="装修">装修服务</option>
              <option value="道路">道路工程</option>
              <option value="租赁">租赁</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              需求描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="请详细描述您的需求，例如：需要采购多少量的建材、项目地点、具体规格等"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              预算（USD）
            </label>
            <input
              name="budget"
              type="number"
              min="0"
              placeholder="请输入预算金额（可不填）"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "提交中..." : "提交需求"}
          </button>
        </form>
      </div>
    </div>
  );
}
