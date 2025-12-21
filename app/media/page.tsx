import { getGallery } from "../../lib/content";
import MediaClient from "./MediaClient";

export const metadata = {
  title: "Media | TCC",
};

export default async function MediaPage() {
  const items = await getGallery();
  return <MediaClient items={items} />;
}
