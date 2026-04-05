const mongoose = require('mongoose');
const categoryModel = require('./schemas/categories');
const productModel = require('./schemas/products');
const roleModel = require('./schemas/roles');
const userModel = require('./schemas/users');
const inventoryModel = require('./schemas/inventories');
const promotionModel = require('./schemas/promotions');

const mongoUrl = 'mongodb://localhost:27017/NNPTUD-C3';
const USD_TO_VND = 26000;

const categories = [
  { name: 'Men Shirts', slug: 'mens-shirts', description: 'Men shirts and tops', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg' },
  { name: 'Men Pants', slug: 'mens-pants', description: 'Men trousers and jeans', image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg' },
  { name: 'Men Shoes', slug: 'mens-shoes', description: 'Men sneakers and casual shoes', image: 'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg' },
  { name: 'Women Dresses', slug: 'womens-dresses', description: 'Women dresses and seasonal outfits', image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg' },
  { name: 'Women Shoes', slug: 'womens-shoes', description: 'Women shoes and sneakers', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg' },
  { name: 'Watches', slug: 'watches', description: 'Watches and timepieces', image: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg' },
  { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories', image: 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg' },
];

const products = [
  {
    sku: 'MEN-TSH-001',
    title: 'Oversized Cotton T-Shirt',
    slug: 'oversized-cotton-t-shirt',
    price: 19.99,
    description: 'Soft oversized tee with a relaxed silhouette, ideal for everyday streetwear.',
    images: ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'],
    categorySlug: 'mens-shirts',
  },
  {
    sku: 'MEN-JNS-002',
    title: 'Slim Fit Denim Jeans',
    slug: 'slim-fit-denim-jeans',
    price: 39.99,
    description: 'Clean slim-fit denim with a comfortable stretch and modern cut.',
    images: ['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg'],
    categorySlug: 'mens-pants',
  },
  {
    sku: 'WOM-DRE-003',
    title: 'Floral Summer Dress',
    slug: 'floral-summer-dress',
    price: 49.99,
    description: 'Lightweight floral dress for warm days and easy styling.',
    images: ['https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg'],
    categorySlug: 'womens-dresses',
  },
  {
    sku: 'WOM-SHO-004',
    title: 'Minimal White Sneakers',
    slug: 'minimal-white-sneakers',
    price: 59.99,
    description: 'Minimal sneakers with a clean profile, made for daily wear.',
    images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'],
    categorySlug: 'womens-shoes',
  },
  {
    sku: 'ACC-BAG-005',
    title: 'Structured Crossbody Bag',
    slug: 'structured-crossbody-bag',
    price: 34.99,
    description: 'Compact crossbody bag with a structured shape and everyday utility.',
    images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'],
    categorySlug: 'accessories',
  },
  {
    sku: 'MEN-SNE-006',
    title: 'Retro Runner Sneakers',
    slug: 'retro-runner-sneakers',
    price: 74.99,
    description: 'Retro-inspired runner sneakers with cushioned support and bold details.',
    images: ['https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg'],
    categorySlug: 'mens-shoes',
  },
  {
    sku: 'WOM-WAT-007',
    title: 'Classic Leather Watch',
    slug: 'classic-leather-watch',
    price: 89.99,
    description: 'Elegant leather watch with a timeless dial and polished finish.',
    images: ['https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg'],
    categorySlug: 'watches',
  },
  {
    sku: 'ACC-SUN-008',
    title: 'Polarized Sunglasses',
    slug: 'polarized-sunglasses',
    price: 24.99,
    description: 'Polarized sunglasses that balance style and everyday eye protection.',
    images: ['https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg'],
    categorySlug: 'accessories',
  },
  {
    sku: 'MEN-SHR-009',
    title: 'Linen Resort Shirt',
    slug: 'linen-resort-shirt',
    price: 32.5,
    description: 'Breathable linen shirt with a relaxed fit for warm weather.',
    images: ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'],
    categorySlug: 'mens-shirts',
  },
  {
    sku: 'MEN-SHR-010',
    title: 'Oxford Button Shirt',
    slug: 'oxford-button-shirt',
    price: 36.75,
    description: 'Classic oxford shirt suitable for office and casual outfits.',
    images: ['https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg'],
    categorySlug: 'mens-shirts',
  },
  {
    sku: 'MEN-PAN-011',
    title: 'Tapered Chino Pants',
    slug: 'tapered-chino-pants',
    price: 41.2,
    description: 'Clean chino silhouette with slight taper for modern styling.',
    images: ['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg'],
    categorySlug: 'mens-pants',
  },
  {
    sku: 'MEN-PAN-012',
    title: 'Straight Raw Denim',
    slug: 'straight-raw-denim',
    price: 52.9,
    description: 'Raw denim jeans with straight cut and structured drape.',
    images: ['https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg'],
    categorySlug: 'mens-pants',
  },
  {
    sku: 'MEN-SHO-013',
    title: 'Canvas High Top Shoes',
    slug: 'canvas-high-top-shoes',
    price: 48.6,
    description: 'Everyday high-top canvas shoes with lightweight comfort.',
    images: ['https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg'],
    categorySlug: 'mens-shoes',
  },
  {
    sku: 'MEN-SHO-014',
    title: 'Monochrome Street Sneakers',
    slug: 'monochrome-street-sneakers',
    price: 78.25,
    description: 'Street sneakers with monochrome palette and padded sole.',
    images: ['https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg'],
    categorySlug: 'mens-shoes',
  },
  {
    sku: 'WOM-DRS-015',
    title: 'Pleated Midi Dress',
    slug: 'pleated-midi-dress',
    price: 57.3,
    description: 'Elegant pleated dress with fluid movement and soft texture.',
    images: ['https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg'],
    categorySlug: 'womens-dresses',
  },
  {
    sku: 'WOM-DRS-016',
    title: 'Sleeveless Satin Dress',
    slug: 'sleeveless-satin-dress',
    price: 63.8,
    description: 'Satin dress designed for events with minimal silhouette.',
    images: ['https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'],
    categorySlug: 'womens-dresses',
  },
  {
    sku: 'WOM-DRS-017',
    title: 'Printed Wrap Dress',
    slug: 'printed-wrap-dress',
    price: 54.1,
    description: 'Wrap dress with all-over print and adjustable waist tie.',
    images: ['https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'],
    categorySlug: 'womens-dresses',
  },
  {
    sku: 'WOM-SHO-018',
    title: 'Chunky Casual Sneakers',
    slug: 'chunky-casual-sneakers',
    price: 61.4,
    description: 'Chunky outsole sneakers for bold styling and comfort.',
    images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'],
    categorySlug: 'womens-shoes',
  },
  {
    sku: 'WOM-SHO-019',
    title: 'Slip On Leather Flats',
    slug: 'slip-on-leather-flats',
    price: 43.2,
    description: 'Lightweight leather flats for all-day wear.',
    images: ['https://images.pexels.com/photos/19090/pexels-photo.jpg'],
    categorySlug: 'womens-shoes',
  },
  {
    sku: 'WOM-SHO-020',
    title: 'Minimal Court Sneakers',
    slug: 'minimal-court-sneakers',
    price: 58.7,
    description: 'Court-inspired sneaker with clean lines and neutral tones.',
    images: ['https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg'],
    categorySlug: 'womens-shoes',
  },
  {
    sku: 'WAT-LEA-021',
    title: 'Chronograph Steel Watch',
    slug: 'chronograph-steel-watch',
    price: 112.5,
    description: 'Steel chronograph watch with textured dial finish.',
    images: ['https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg'],
    categorySlug: 'watches',
  },
  {
    sku: 'WAT-LEA-022',
    title: 'Mesh Strap Watch',
    slug: 'mesh-strap-watch',
    price: 85.6,
    description: 'Slim watch case paired with breathable mesh strap.',
    images: ['https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg'],
    categorySlug: 'watches',
  },
  {
    sku: 'WAT-LEA-023',
    title: 'Minimal Gold Dial Watch',
    slug: 'minimal-gold-dial-watch',
    price: 97.3,
    description: 'Minimal gold dial watch for refined daily styling.',
    images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'],
    categorySlug: 'watches',
  },
  {
    sku: 'ACC-BAG-024',
    title: 'Mini Bucket Bag',
    slug: 'mini-bucket-bag',
    price: 38.4,
    description: 'Compact bucket bag with drawstring closure and long strap.',
    images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'],
    categorySlug: 'accessories',
  },
  {
    sku: 'ACC-BAG-025',
    title: 'Textured Shoulder Bag',
    slug: 'textured-shoulder-bag',
    price: 46.9,
    description: 'Shoulder bag with textured body and magnetic flap.',
    images: ['https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg'],
    categorySlug: 'accessories',
  },
  {
    sku: 'ACC-SUN-026',
    title: 'Retro Square Sunglasses',
    slug: 'retro-square-sunglasses',
    price: 28.3,
    description: 'Square frame sunglasses with UV-protective lenses.',
    images: ['https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg'],
    categorySlug: 'accessories',
  },
  {
    sku: 'ACC-SUN-027',
    title: 'Gradient Lens Sunglasses',
    slug: 'gradient-lens-sunglasses',
    price: 31.5,
    description: 'Gradient lens eyewear designed for modern street style.',
    images: ['https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg'],
    categorySlug: 'accessories',
  },
  {
    sku: 'MEN-SHR-028',
    title: 'Short Sleeve Camp Shirt',
    slug: 'short-sleeve-camp-shirt',
    price: 29.8,
    description: 'Camp-collar shirt with easy fit and breathable weave.',
    images: ['https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg'],
    categorySlug: 'mens-shirts',
  },
  {
    sku: 'MEN-PAN-029',
    title: 'Cargo Utility Pants',
    slug: 'cargo-utility-pants',
    price: 47.4,
    description: 'Utility cargo pants with roomy pockets and tapered hem.',
    images: ['https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg'],
    categorySlug: 'mens-pants',
  },
  {
    sku: 'WOM-DRS-030',
    title: 'Ruffle Hem Day Dress',
    slug: 'ruffle-hem-day-dress',
    price: 52.2,
    description: 'Day dress with subtle ruffle details and airy fit.',
    images: ['https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'],
    categorySlug: 'womens-dresses',
  },
];

const categoryMap = new Map();

const slugify = (text) =>
  String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toVnd = (usdPrice) => Math.round(Number(usdPrice || 0) * USD_TO_VND);

async function main() {
  await mongoose.connect(mongoUrl);

  // 1. KHỞI TẠO QUYỀN (ROLES)
  console.log('Seeding roles...');
  const adminRole = await roleModel.findOneAndUpdate(
    { name: 'admin' },
    { $set: { name: 'admin', description: 'Administrator with full access' } },
    { upsert: true, returnDocument: 'after' }
  );

  const memberRole = await roleModel.findOneAndUpdate(
    { name: 'member' },
    { $set: { name: 'member', description: 'Regular customer' } },
    { upsert: true, returnDocument: 'after' }
  );

  // 2. KHỞI TẠO TÀI KHOẢN ADMIN MẶC ĐỊNH
  console.log('Seeding admin user...');
  let adminUser = await userModel.findOne({ username: 'admin' });

  if (!adminUser) {
    adminUser = new userModel({
      username: 'admin',
      email: 'admin@gmail.com',
      fullName: 'System Administrator',
      role: adminRole._id,
      status: true
    });
  }

  adminUser.password = 'admin123'; // Trigger pre('save') hook in users.js
  adminUser.role = adminRole._id;
  adminUser.status = true;
  adminUser.isDeleted = false;
  adminUser.loginCount = 0;   // Reset login attempts
  adminUser.lockTime = null;  // Unlock account
  
  await adminUser.save();
  console.log('Admin user seeded and unlocked successfully.');

  // 3. KHỞI TẠO DANH MỤC
  const categoryDocs = [];
  for (const item of categories) {
    const doc = await categoryModel.findOneAndUpdate(
      { slug: item.slug },
      {
        $set: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          image: item.image,
          isDeleted: false,
        },
      },
      { returnDocument: 'after', upsert: true }
    );

    categoryMap.set(item.slug, doc._id);
    categoryDocs.push(doc);
  }

  await productModel.deleteMany({ sku: { $in: products.map((item) => item.sku) } });

  const productDocs = products.map((item) => ({
    sku: item.sku,
    title: item.title,
    slug: item.slug || slugify(item.title),
    price: toVnd(item.price),
    description: item.description,
    images: item.images,
    category: categoryMap.get(item.categorySlug),
    isDeleted: false,
  }));

  const insertedProducts = await productModel.insertMany(productDocs);

  // 4. KHỞI TẠO TỒN KHO CHO SẢN PHẨM MỚI
  const inventoryModel = require('./schemas/inventories');
  const inventoryDocs = insertedProducts.map((p) => ({
    product: p._id,
    stock: 100, // Mặc định có 100 sản phẩm trong kho
    reserved: 0,
    soldCount: 0,
  }));

  // Xóa kho cũ của các sp này (nếu có) và chèn mới
  await inventoryModel.deleteMany({ product: { $in: insertedProducts.map(p => p._id) } });
  await inventoryModel.insertMany(inventoryDocs);

  // 5. KHỞI TẠO KHUYẾN MÃI
  console.log('Seeding promotions...');
  const promotionDocs = [
    {
      code: 'WELCOME10',
      title: 'Chào mừng bạn mới',
      description: 'Giảm 10% cho đơn hàng đầu tiên',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Hạn 1 năm
      usageLimit: 1000,
      status: true
    },
    {
      code: 'FREESHIP',
      title: 'Miễn phí vận chuyển',
      description: 'Giảm 50.000đ phí vận chuyển cho đơn từ 500k',
      discountType: 'fixed',
      discountValue: 50000,
      minOrderValue: 500000,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      usageLimit: 500,
      status: true
    }
  ];

  await promotionModel.deleteMany({ code: { $in: promotionDocs.map(p => p.code) } });
  await promotionModel.insertMany(promotionDocs);

  console.log(
    `Seeded ${categoryDocs.length} categories, ${insertedProducts.length} products, ${promotionDocs.length} promotions, and initialized inventories. (rate: 1 USD = ${USD_TO_VND} VND)`
  );
  console.log('--- ADMIN ACCOUNT CREATED ---');
  console.log('Username: admin');
  console.log('Password: admin123');
  console.log('-----------------------------');

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
