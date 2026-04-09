-- Seed Data for Appraiz
-- Run with: supabase db seed

-- ======================
-- Create Admin User
-- ======================
DO $$
DECLARE
  admin_id uuid;
  admin_email text := 'admin@example.com';
  admin_password text := 'password123';
  existing_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id FROM auth.users WHERE email = admin_email;

  IF existing_user_id IS NULL THEN
    -- Insert into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO admin_id;
  ELSE
    admin_id := existing_user_id;
  END IF;

  -- Insert into admin table
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.admin (id, email, created_at, updated_at)
    VALUES (admin_id, admin_email, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE '✅ Admin user created: % / %', admin_email, admin_password;
  ELSE
    RAISE NOTICE '⚠️  Admin user already exists: %', admin_email;
  END IF;
END $$;

-- ======================
-- Create Guest Users
-- ======================
DO $$
DECLARE
  guest_id uuid;
  guest_email text;
  guest_password text := 'password123';
  guest_name text;
  company_name text;
  guest_data RECORD;
BEGIN
  -- Create multiple guest users
  FOR guest_data IN
    SELECT * FROM (VALUES
      ('guest1@example.com', '山田太郎', '株式会社サンプル'),
      ('guest2@example.com', '佐藤花子', '株式会社テスト'),
      ('guest3@example.com', '鈴木一郎', '合同会社デモ')
    ) AS t(email, name, company)
  LOOP
    guest_email := guest_data.email;
    guest_name := guest_data.name;
    company_name := guest_data.company;

    -- Check if user already exists
    SELECT id INTO guest_id FROM auth.users WHERE email = guest_email;

    IF guest_id IS NULL THEN
      -- Insert into auth.users
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        guest_email,
        crypt(guest_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('role', 'guest', 'name', guest_name, 'company_name', company_name),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
      )
      RETURNING id INTO guest_id;
    END IF;

    -- Insert into guest table
    IF guest_id IS NOT NULL THEN
      INSERT INTO public.guest (id, email, name, company_name, created_at, updated_at)
      VALUES (guest_id, guest_email, guest_name, company_name, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;

      RAISE NOTICE '✅ Guest user created: % / %', guest_email, guest_password;
    ELSE
      RAISE NOTICE '⚠️  Guest user already exists: %', guest_email;
    END IF;
  END LOOP;
END $$;

-- ======================
-- Create Sample Hackathon
-- ======================
INSERT INTO public.hackathon (id, name, scoring_date, access_password, created_at, updated_at)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'Spring Hackathon 2024',
    NOW() + INTERVAL '30 days',
    'hackathon2024',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ======================
-- Create Sample Teams
-- ======================
INSERT INTO public.team (name, hackathon_id, created_at, updated_at)
VALUES
  ('Team Alpha', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('Team Beta', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('Team Gamma', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ======================
-- Create Sample Scoring Items
-- ======================
INSERT INTO public.scoring_item (name, max_score, hackathon_id, created_at, updated_at)
VALUES
  ('アイデアの独創性', 10, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('実装の完成度', 10, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('プレゼンテーション', 10, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('ビジネス性', 10, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ======================
-- Summary
-- ======================
DO $$
BEGIN
  RAISE NOTICE '====================================';
  RAISE NOTICE 'シードデータの投入が完了しました！';
  RAISE NOTICE '';
  RAISE NOTICE '管理者アカウント:';
  RAISE NOTICE '  Email: admin@example.com';
  RAISE NOTICE '  Password: password123';
  RAISE NOTICE '  URL: /admin/auth/login';
  RAISE NOTICE '';
  RAISE NOTICE 'ゲストアカウント:';
  RAISE NOTICE '  Email: guest1@example.com';
  RAISE NOTICE '  Email: guest2@example.com';
  RAISE NOTICE '  Email: guest3@example.com';
  RAISE NOTICE '  Password: password123 (共通)';
  RAISE NOTICE '  URL: /guest/auth/login';
  RAISE NOTICE '';
  RAISE NOTICE 'サンプルハッカソン:';
  RAISE NOTICE '  Name: Spring Hackathon 2024';
  RAISE NOTICE '  Teams: 3チーム';
  RAISE NOTICE '  Scoring Items: 4項目';
  RAISE NOTICE '====================================';
END $$;
