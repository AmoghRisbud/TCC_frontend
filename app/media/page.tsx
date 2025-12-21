import { getGallery } from "../../lib/content";
import MediaClient from "./MediaClient";

export const metadata = {
  title: "Media | TCC",
};

// Force dynamic rendering to always fetch fresh data from Redis
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MediaPage() {
  const items = await getGallery();
  return <MediaClient items={items} />;
}
