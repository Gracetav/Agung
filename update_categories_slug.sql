USE bengkel_agung;

-- 1. Tambah kolom slug (Wajib Unik) setelah kolom name
ALTER TABLE categories ADD COLUMN slug VARCHAR(255) AFTER name;

-- 2. Tambah kolom description dan is_active jika belum ada
ALTER TABLE categories ADD COLUMN description TEXT AFTER slug;

-- 3. Update data lama agar memiliki slug agar tidak error saat di-query
UPDATE categories SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '&', 'and')) WHERE slug IS NULL;

-- 4. Set kolom slug menjadi UNIQUE dan NOT NULL untuk kedepannya
ALTER TABLE categories MODIFY slug VARCHAR(255) NOT NULL;
ALTER TABLE categories ADD UNIQUE (slug);
