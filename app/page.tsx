import { getAllContent } from '@/lib/utils';
import PortfolioClient from '@/components/PortfolioClient';

export default async function Page() {
  const content = await getAllContent();
  return <PortfolioClient initialContent={content} />;
}
