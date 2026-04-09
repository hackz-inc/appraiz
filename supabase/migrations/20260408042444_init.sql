


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "public";






CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'guest'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "email" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."admin" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."confirmed_team_order" (
    "id" bigint NOT NULL,
    "hackathon_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."confirmed_team_order" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."confirmed_team_order_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."confirmed_team_order_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."confirmed_team_order_id_seq" OWNED BY "public"."confirmed_team_order"."id";



CREATE TABLE IF NOT EXISTS "public"."guest" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "name" character varying(48) NOT NULL,
    "company_name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."guest" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hackathon" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "name" character varying(48) NOT NULL,
    "scoring_date" "date" NOT NULL,
    "access_password" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."hackathon" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hackathon_guest" (
    "id" bigint NOT NULL,
    "hackathon_id" "uuid" NOT NULL,
    "guest_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."hackathon_guest" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hackathon_guest_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."hackathon_guest_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hackathon_guest_id_seq" OWNED BY "public"."hackathon_guest"."id";



CREATE TABLE IF NOT EXISTS "public"."presentation_order" (
    "id" bigint NOT NULL,
    "order" integer NOT NULL,
    "team_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."presentation_order" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."presentation_order_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."presentation_order_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."presentation_order_id_seq" OWNED BY "public"."presentation_order"."id";



CREATE TABLE IF NOT EXISTS "public"."scoring_item" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "name" character varying(48) NOT NULL,
    "max_score" integer NOT NULL,
    "hackathon_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."scoring_item" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."scoring_item_result" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "score" integer NOT NULL,
    "scoring_item_id" "uuid" NOT NULL,
    "scoring_result_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."scoring_item_result" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."scoring_result" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "judge_name" character varying(255) NOT NULL,
    "comment" "text" DEFAULT ''::"text",
    "team_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."scoring_result" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "name" character varying(48) NOT NULL,
    "hackathon_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."team" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team_social" (
    "id" bigint NOT NULL,
    "team_id" "uuid" NOT NULL,
    "platform" character varying(50) NOT NULL,
    "url" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."team_social" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."team_social_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."team_social_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."team_social_id_seq" OWNED BY "public"."team_social"."id";



ALTER TABLE ONLY "public"."confirmed_team_order" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."confirmed_team_order_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hackathon_guest" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hackathon_guest_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."presentation_order" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."presentation_order_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."team_social" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."team_social_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."admin"
    ADD CONSTRAINT "admin_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."admin"
    ADD CONSTRAINT "admin_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."confirmed_team_order"
    ADD CONSTRAINT "confirmed_team_order_hackathon_id_key" UNIQUE ("hackathon_id");



ALTER TABLE ONLY "public"."confirmed_team_order"
    ADD CONSTRAINT "confirmed_team_order_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guest"
    ADD CONSTRAINT "guest_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."guest"
    ADD CONSTRAINT "guest_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon_guest"
    ADD CONSTRAINT "hackathon_guest_hackathon_id_guest_id_key" UNIQUE ("hackathon_id", "guest_id");



ALTER TABLE ONLY "public"."hackathon_guest"
    ADD CONSTRAINT "hackathon_guest_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hackathon"
    ADD CONSTRAINT "hackathon_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."presentation_order"
    ADD CONSTRAINT "presentation_order_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scoring_item"
    ADD CONSTRAINT "scoring_item_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scoring_item_result"
    ADD CONSTRAINT "scoring_item_result_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scoring_result"
    ADD CONSTRAINT "scoring_result_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team"
    ADD CONSTRAINT "team_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_social"
    ADD CONSTRAINT "team_social_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_hackathon_guest_guest" ON "public"."hackathon_guest" USING "btree" ("guest_id");



CREATE INDEX "idx_hackathon_guest_hackathon" ON "public"."hackathon_guest" USING "btree" ("hackathon_id");



CREATE INDEX "idx_presentation_order_team" ON "public"."presentation_order" USING "btree" ("team_id");



CREATE INDEX "idx_scoring_item_hackathon" ON "public"."scoring_item" USING "btree" ("hackathon_id");



CREATE INDEX "idx_scoring_item_result_scoring_item" ON "public"."scoring_item_result" USING "btree" ("scoring_item_id");



CREATE INDEX "idx_scoring_item_result_scoring_result" ON "public"."scoring_item_result" USING "btree" ("scoring_result_id");



CREATE INDEX "idx_scoring_result_team" ON "public"."scoring_result" USING "btree" ("team_id");



CREATE INDEX "idx_team_hackathon" ON "public"."team" USING "btree" ("hackathon_id");



CREATE OR REPLACE TRIGGER "update_admin_updated_at" BEFORE UPDATE ON "public"."admin" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_confirmed_team_order_updated_at" BEFORE UPDATE ON "public"."confirmed_team_order" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_guest_updated_at" BEFORE UPDATE ON "public"."guest" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_hackathon_guest_updated_at" BEFORE UPDATE ON "public"."hackathon_guest" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_hackathon_updated_at" BEFORE UPDATE ON "public"."hackathon" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_presentation_order_updated_at" BEFORE UPDATE ON "public"."presentation_order" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_scoring_item_result_updated_at" BEFORE UPDATE ON "public"."scoring_item_result" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_scoring_item_updated_at" BEFORE UPDATE ON "public"."scoring_item" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_scoring_result_updated_at" BEFORE UPDATE ON "public"."scoring_result" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_team_social_updated_at" BEFORE UPDATE ON "public"."team_social" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_team_updated_at" BEFORE UPDATE ON "public"."team" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."confirmed_team_order"
    ADD CONSTRAINT "confirmed_team_order_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathon"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_guest"
    ADD CONSTRAINT "hackathon_guest_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "public"."guest"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."hackathon_guest"
    ADD CONSTRAINT "hackathon_guest_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathon"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."presentation_order"
    ADD CONSTRAINT "presentation_order_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."scoring_item"
    ADD CONSTRAINT "scoring_item_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathon"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."scoring_item_result"
    ADD CONSTRAINT "scoring_item_result_scoring_item_id_fkey" FOREIGN KEY ("scoring_item_id") REFERENCES "public"."scoring_item"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."scoring_item_result"
    ADD CONSTRAINT "scoring_item_result_scoring_result_id_fkey" FOREIGN KEY ("scoring_result_id") REFERENCES "public"."scoring_result"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."scoring_result"
    ADD CONSTRAINT "scoring_result_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team"
    ADD CONSTRAINT "team_hackathon_id_fkey" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathon"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_social"
    ADD CONSTRAINT "team_social_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE CASCADE;



CREATE POLICY "Admin can insert their own data" ON "public"."admin" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Admin can update their own data" ON "public"."admin" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Admin can view their own data" ON "public"."admin" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Allow all deletes on confirmed team order" ON "public"."confirmed_team_order" FOR DELETE USING (true);



CREATE POLICY "Allow all deletes on hackathon guests" ON "public"."hackathon_guest" FOR DELETE USING (true);



CREATE POLICY "Allow all deletes on presentation order" ON "public"."presentation_order" FOR DELETE USING (true);



CREATE POLICY "Allow all deletes on scoring item results" ON "public"."scoring_item_result" FOR DELETE USING (true);



CREATE POLICY "Allow all deletes on scoring items" ON "public"."scoring_item" FOR DELETE USING (true);



CREATE POLICY "Allow all deletes on scoring results" ON "public"."scoring_result" FOR DELETE USING (true);



CREATE POLICY "Allow all deletes on team social" ON "public"."team_social" FOR DELETE USING (true);



CREATE POLICY "Allow all inserts on confirmed team order" ON "public"."confirmed_team_order" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow all inserts on hackathon guests" ON "public"."hackathon_guest" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow all inserts on presentation order" ON "public"."presentation_order" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow all inserts on scoring items" ON "public"."scoring_item" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow all inserts on team social" ON "public"."team_social" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow all updates on confirmed team order" ON "public"."confirmed_team_order" FOR UPDATE USING (true);



CREATE POLICY "Allow all updates on hackathon guests" ON "public"."hackathon_guest" FOR UPDATE USING (true);



CREATE POLICY "Allow all updates on presentation order" ON "public"."presentation_order" FOR UPDATE USING (true);



CREATE POLICY "Allow all updates on scoring item results" ON "public"."scoring_item_result" FOR UPDATE USING (true);



CREATE POLICY "Allow all updates on scoring items" ON "public"."scoring_item" FOR UPDATE USING (true);



CREATE POLICY "Allow all updates on scoring results" ON "public"."scoring_result" FOR UPDATE USING (true);



CREATE POLICY "Allow all updates on team social" ON "public"."team_social" FOR UPDATE USING (true);



CREATE POLICY "Allow all updates on teams" ON "public"."team" FOR UPDATE USING (true);



CREATE POLICY "Anyone can insert scoring item results" ON "public"."scoring_item_result" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can insert scoring results" ON "public"."scoring_result" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can view hackathons" ON "public"."hackathon" FOR SELECT USING (true);



CREATE POLICY "Anyone can view scoring item results" ON "public"."scoring_item_result" FOR SELECT USING (true);



CREATE POLICY "Anyone can view scoring results" ON "public"."scoring_result" FOR SELECT USING (true);



CREATE POLICY "Anyone can view team social links" ON "public"."team_social" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can view confirmed team order" ON "public"."confirmed_team_order" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view hackathon guests" ON "public"."hackathon_guest" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view presentation order" ON "public"."presentation_order" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view scoring items" ON "public"."scoring_item" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can view teams" ON "public"."team" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."team" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Guest can insert their own data" ON "public"."guest" FOR INSERT WITH CHECK (true);



CREATE POLICY "Guest can update their own data" ON "public"."guest" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Guest can view their own data" ON "public"."guest" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Service role can delete hackathons" ON "public"."hackathon" FOR DELETE USING (true);



CREATE POLICY "Service role can insert hackathons" ON "public"."hackathon" FOR INSERT WITH CHECK (true);



CREATE POLICY "Service role can update hackathons" ON "public"."hackathon" FOR UPDATE USING (true);



ALTER TABLE "public"."admin" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."confirmed_team_order" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hackathon" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hackathon_guest" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."presentation_order" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."scoring_item" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."scoring_item_result" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."scoring_result" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."team" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."team_social" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



























































































































GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_generate_v1"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_generate_v1mc"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1mc"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1mc"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1mc"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_generate_v4"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_generate_v4"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_generate_v4"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_generate_v4"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_nil"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_nil"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_nil"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_nil"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_ns_dns"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_ns_dns"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_ns_dns"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_ns_dns"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_ns_oid"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_ns_oid"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_ns_oid"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_ns_oid"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_ns_url"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_ns_url"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_ns_url"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_ns_url"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_ns_x500"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_ns_x500"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_ns_x500"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_ns_x500"() TO "service_role";


















GRANT ALL ON TABLE "public"."admin" TO "anon";
GRANT ALL ON TABLE "public"."admin" TO "authenticated";
GRANT ALL ON TABLE "public"."admin" TO "service_role";



GRANT ALL ON TABLE "public"."confirmed_team_order" TO "anon";
GRANT ALL ON TABLE "public"."confirmed_team_order" TO "authenticated";
GRANT ALL ON TABLE "public"."confirmed_team_order" TO "service_role";



GRANT ALL ON SEQUENCE "public"."confirmed_team_order_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."confirmed_team_order_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."confirmed_team_order_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."guest" TO "anon";
GRANT ALL ON TABLE "public"."guest" TO "authenticated";
GRANT ALL ON TABLE "public"."guest" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon" TO "anon";
GRANT ALL ON TABLE "public"."hackathon" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon" TO "service_role";



GRANT ALL ON TABLE "public"."hackathon_guest" TO "anon";
GRANT ALL ON TABLE "public"."hackathon_guest" TO "authenticated";
GRANT ALL ON TABLE "public"."hackathon_guest" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hackathon_guest_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hackathon_guest_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hackathon_guest_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."presentation_order" TO "anon";
GRANT ALL ON TABLE "public"."presentation_order" TO "authenticated";
GRANT ALL ON TABLE "public"."presentation_order" TO "service_role";



GRANT ALL ON SEQUENCE "public"."presentation_order_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."presentation_order_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."presentation_order_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."scoring_item" TO "anon";
GRANT ALL ON TABLE "public"."scoring_item" TO "authenticated";
GRANT ALL ON TABLE "public"."scoring_item" TO "service_role";



GRANT ALL ON TABLE "public"."scoring_item_result" TO "anon";
GRANT ALL ON TABLE "public"."scoring_item_result" TO "authenticated";
GRANT ALL ON TABLE "public"."scoring_item_result" TO "service_role";



GRANT ALL ON TABLE "public"."scoring_result" TO "anon";
GRANT ALL ON TABLE "public"."scoring_result" TO "authenticated";
GRANT ALL ON TABLE "public"."scoring_result" TO "service_role";



GRANT ALL ON TABLE "public"."team" TO "anon";
GRANT ALL ON TABLE "public"."team" TO "authenticated";
GRANT ALL ON TABLE "public"."team" TO "service_role";



GRANT ALL ON TABLE "public"."team_social" TO "anon";
GRANT ALL ON TABLE "public"."team_social" TO "authenticated";
GRANT ALL ON TABLE "public"."team_social" TO "service_role";



GRANT ALL ON SEQUENCE "public"."team_social_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."team_social_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."team_social_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































