import WaveTrack from "@/components/wave.track/wave.track";
import { fetchAPIs } from "@/utils/fetchAPIs";
import type { Metadata } from "next";
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>;
};


export async function generateStaticParams() {

  return [
    { slug: 'sau-con-mua-67a363c97c0b404349194bc8.html' },
    { slug: 'truy-lung-bao-vat-67a363c97c0b404349194bc3.html' },
    { slug: 'mien-man-67a363c97c0b404349194bc2.html' },
  ]

}

export async function generateMetadata({ params }: Props ): Promise<Metadata> {
  const { slug } = await params;
  const getId = (slug?.split('.html')[0])?.split('-') ?? []
  const id = getId[getId.length - 1]

  // fetch data
  const trackInfo = await fetchAPIs<IBackendRes<ITracksTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
  });


  return {
    title: trackInfo.data?.title,
    description: trackInfo.data?.description,
    openGraph: {
      title: 'thenam2kx - Beyond Your Coding Skills',
      description: 'Beyond Your Coding Skills',
      type: 'website',
      images: [`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${trackInfo.data?.imgUrl}`],
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DetailTrackPage = async ({ params }: { params: any }) => {

  const { slug } = await params;
  const getId = (slug?.split('.html')[0])?.split('-') ?? []
  const id = getId[getId.length - 1]

  const trackInfo = await fetchAPIs<IBackendRes<ITracksTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    nextOption: {
      next: { tag: ['track-by-id'] }
    }
  });

  if (!trackInfo.data) {
    return notFound()
  }

  const listComments = await fetchAPIs<
    IBackendRes<IModelPaginate<ITrackComment>>
  >({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 10,
      trackId: id,
      sort: "-createdAt",
    },
  });

  return (
    <div>
      <WaveTrack
        trackInfo={trackInfo?.data ?? null}
        comments={listComments.data?.result ?? null}
      />
    </div>
  );
};

export default DetailTrackPage;
