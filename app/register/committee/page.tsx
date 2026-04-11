import { CommitteeRegistrationForm } from "@/components/public/committee-registration-form";
import { env } from "@/lib/env";

import styles from "@/app/register/committee/page.module.css";

export const metadata = {
  title: "Team Registration",
  description:
    "Submit committee and executive registrations with image upload, head name, and co-head name.",
};

export default function CommitteeRegistrationPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <CommitteeRegistrationForm maxUploadSizeMb={env.r2.maxUploadSizeMb} />
      </div>
    </div>
  );
}
