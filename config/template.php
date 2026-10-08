<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-villa".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-villa'),

    'flavors' => array (
  'landing-villa' => 
  array (
    'label' => 'VILLA TROPIS — Villa',
    'brand_name' => 'VILLA TROPIS',
    'brand_tagline' => 'Liburan tropis, privasi penuh',
    'brand_initials' => 'VT',
    'accent' => '#115e59',
    'category' => 'properti',
    'home' => 'landings.villa',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/villa',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
