

## Storage Settings for External Providers

Based on the `pennyekart-1` repository, the other project has a `StorageConfigPage.tsx` that allows admins to configure external storage providers (Cloudinary, AWS S3, ImageKit, Backblaze, DigitalOcean Spaces, Wasabi, Custom) with credentials stored in a `storage_providers` database table. The current project only uses Supabase Storage.

### What will be built

An admin page at `/admin/storage-settings` where super_admins can:
- Add external storage providers (Cloudinary, AWS S3, ImageKit, Backblaze, DigitalOcean Spaces, Wasabi, or Custom)
- Configure credentials for each provider
- Enable/disable providers and set priority order
- Delete providers
- The system will use the highest-priority enabled provider for uploads, falling back to Supabase Storage

### Technical Steps

1. **Database Migration** - Create `storage_providers` table:
   - `id` (uuid, PK), `provider_name` (text), `is_enabled` (boolean), `priority` (integer), `credentials` (jsonb), `created_at`, `updated_at`
   - RLS: only super_admin/admin can read/write

2. **New Page: `src/pages/admin/AdminStorageSettings.tsx`** - Adapted from the pennyekart-1 `StorageConfigPage.tsx`:
   - List configured providers with enable/disable toggle, priority, credential fields
   - Add Provider dialog with preset options (Cloudinary, S3, ImageKit, Backblaze, DO Spaces, Wasabi, Custom)
   - Save, delete functionality
   - Uses existing `AdminNavbar` pattern instead of `AdminLayout`

3. **Update `src/App.tsx`** - Add route `/admin/storage-settings`

4. **Update `src/pages/admin/AdminDashboard.tsx`** - Add "Storage Settings" card to super_admin utilities section

5. **Update `src/components/admin/ImageUpload.tsx`** - Add logic to check for an enabled external provider and upload there first (Cloudinary via unsigned upload preset), falling back to Supabase Storage. For Cloudinary specifically, upload via `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`.

6. **Update Supabase types** - Add `storage_providers` table type to match the new schema

