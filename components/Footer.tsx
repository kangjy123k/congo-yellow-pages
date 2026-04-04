import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-3">刚果金建筑装修行业黄页</h3>
          <p className="text-sm text-gray-400">
            刚果金领先的建筑装修行业信息平台，连接商家与客户。
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">找产品</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products?main=找建筑产品&cat=建材" className="hover:text-white">建材</Link></li>
            <li><Link href="/products?main=找建筑产品&cat=工具" className="hover:text-white">工具</Link></li>
            <li><Link href="/products?main=找建筑产品&cat=电气设备" className="hover:text-white">电气设备</Link></li>
            <li><Link href="/products?main=找建筑产品&cat=工程机械" className="hover:text-white">工程机械</Link></li>
            <li><Link href="/products?main=找家具&cat=家具" className="hover:text-white">家具</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">找服务</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services?cat=房建" className="hover:text-white">房建</Link></li>
            <li><Link href="/services?cat=装修" className="hover:text-white">装修</Link></li>
            <li><Link href="/services?cat=道路" className="hover:text-white">道路</Link></li>
            <li><Link href="/rental" className="hover:text-white">租赁</Link></li>
            <li><Link href="/projects" className="hover:text-white">项目发布</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">商家入口</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/merchant/register" className="hover:text-white">商家入驻</Link></li>
            <li><Link href="/merchant/login" className="hover:text-white">商家登录</Link></li>
            <li><Link href="/demand/new" className="hover:text-white">登记需求</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} 刚果金建筑装修行业黄页 版权所有
      </div>
    </footer>
  );
}
