TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (
  name,
  description,
  image_url,
  rating,
  review_count,
  price,
  stock,
  category,
  brand
)
VALUES
  (
    'Laptop Pro 15',
    '15-inch performance laptop with 32GB RAM and 1TB SSD for creators and developers.',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    4.7,
    1842,
    1299.99,
    15,
    'Computers',
    'NovaTech'
  ),
  (
    'UltraBook Air 13',
    'Lightweight 13-inch ultrabook with all-day battery and sharp Retina-class display.',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80',
    4.6,
    2213,
    999.00,
    21,
    'Computers',
    'Aerial'
  ),
  (
    'Wireless Headphones',
    'Premium Bluetooth headphones with active noise cancellation and 40-hour battery life.',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    4.5,
    9280,
    199.99,
    35,
    'Audio',
    'SonicOne'
  ),
  (
    'Studio Earbuds',
    'Compact true wireless earbuds with deep bass and clear call quality.',
    'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&w=900&q=80',
    4.3,
    5174,
    89.99,
    60,
    'Audio',
    'SonicOne'
  ),
  (
    'Mechanical Keyboard',
    'Hot-swappable RGB keyboard with tactile switches and durable aluminum frame.',
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    4.6,
    4210,
    119.00,
    22,
    'Accessories',
    'KeyForge'
  ),
  (
    'Ergo Wireless Mouse',
    'Ergonomic wireless mouse with silent clicks and adjustable DPI.',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
    4.4,
    3391,
    49.90,
    54,
    'Accessories',
    'KeyForge'
  ),
  (
    '4K Monitor',
    '27-inch 4K UHD IPS monitor with USB-C and 99% sRGB color coverage.',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    4.4,
    2673,
    349.50,
    18,
    'Monitors',
    'VisionX'
  ),
  (
    '34-inch Ultrawide Monitor',
    'Curved ultrawide display ideal for multitasking and immersive gaming.',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80',
    4.5,
    1968,
    549.00,
    12,
    'Monitors',
    'VisionX'
  ),
  (
    'Smartphone X12',
    'Flagship smartphone with pro-grade camera, OLED screen, and fast charging.',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    4.6,
    10422,
    899.00,
    28,
    'Phones',
    'Orbit'
  ),
  (
    'Smartphone Lite 5G',
    'Affordable 5G phone with long battery life and smooth performance.',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
    4.2,
    6880,
    399.00,
    40,
    'Phones',
    'Orbit'
  ),
  (
    'Smart Watch Active',
    'Fitness-focused smartwatch with heart-rate tracking and sleep insights.',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
    4.3,
    3721,
    149.00,
    33,
    'Wearables',
    'Pulse'
  ),
  (
    'Fitness Band Plus',
    'Slim activity tracker with 14-day battery and waterproof design.',
    'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=900&q=80',
    4.1,
    2550,
    69.00,
    48,
    'Wearables',
    'Pulse'
  ),
  (
    'Gaming Chair Pro',
    'High-back ergonomic gaming chair with lumbar support and recline lock.',
    'https://images.pexels.com/photos/7862492/pexels-photo-7862492.jpeg?auto=compress&cs=tinysrgb&w=900',
    4.4,
    1810,
    229.00,
    14,
    'Home Office',
    'SitRight'
  ),
  (
    'Adjustable Standing Desk',
    'Electric standing desk with memory presets and cable management tray.',
    'https://images.unsplash.com/photo-1593476550610-87baa860004a?auto=format&fit=crop&w=900&q=80',
    4.5,
    2403,
    319.00,
    16,
    'Home Office',
    'SitRight'
  ),
  (
    'Portable SSD 1TB',
    'Compact high-speed USB-C SSD for backups and content workflows.',
    'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=900&q=80',
    4.7,
    7922,
    129.00,
    70,
    'Storage',
    'DataNest'
  ),
  (
    'Wi-Fi 6 Router',
    'Dual-band Wi-Fi 6 router with wide range and low-latency performance.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Linksys-Wireless-G-Router.jpg/800px-Linksys-Wireless-G-Router.jpg',
    4.3,
    1654,
    139.00,
    29,
    'Networking',
    'LinkNova'
  );
