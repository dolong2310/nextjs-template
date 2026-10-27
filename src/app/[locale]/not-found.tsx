import { Link } from "@/libs/i18n/navigation";
import { useTranslations } from "next-intl";

const NotFound = () => {
  const t = useTranslations();

  return (
    <div>
      <h1>{t("404 Not Found")}</h1>
      <p>{t("Could not find requested resource")}</p>
      <Link href="/">{t("Back to home")}</Link>
    </div>
  );
};

export default NotFound;
