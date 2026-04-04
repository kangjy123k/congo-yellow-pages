export const PRODUCT_CATEGORIES = {
  "找建筑产品": ["建材", "工具", "电气设备", "工程机械"],
  "找家具": ["装修材料", "家具"],
};

export const SERVICE_CATEGORIES = ["房建", "装修", "道路", "特殊工程"];

export const INVENTORY_TYPES = [
  { value: "local", label: "本地库存" },
  { value: "china", label: "中国发货" },
];

export const LISTING_TYPES = [
  { value: "sell", label: "出售" },
  { value: "rent", label: "出租" },
  { value: "both", label: "可售可租" },
];

export const RENTAL_TYPES = [
  { value: "lessor", label: "出租方" },
  { value: "lessee", label: "承租方" },
];

export const NAV_ITEMS = [
  { href: "/", label: "首页" },
  { href: "/products?main=找建筑产品", label: "找建筑产品" },
  { href: "/products?main=找家具", label: "找家具" },
  { href: "/services", label: "找服务商" },
  { href: "/rental", label: "租赁" },
  { href: "/projects", label: "项目发布" },
];
