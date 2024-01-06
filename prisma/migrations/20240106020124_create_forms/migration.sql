-- CreateTable
CREATE TABLE "public"."forms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."forms" ADD CONSTRAINT "forms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

------------------------------------------------ START TO ADDITIONAL ITEMS FOR POLICIES ---------------------------------------------------
ALTER TABLE "public"."forms" ENABLE ROW LEVEL SECURITY;
CREATE Policy "Individual_Authorized_Form_Access"
    on forms for select
    using (auth.uid() = user_id);
-- This Policy added will allow only users to access their own data
-- if the user has the correct auth id that matches the user_id of that row.