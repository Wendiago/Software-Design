import { useQuery } from "@tanstack/react-query";
import { useAllSources } from "./useAllSources";
import { novelAPI } from "../api";

export function useNovelSearched(keyword, pageNumber) {
  const { source } = useAllSources();
  const {
    isPending,
    error,
    data: { data } = {},
  } = useQuery({
    queryKey: ["novel-searched"],
    queryFn: () => novelAPI.searchNovel({ keyword, pageNumber, source }),
  });

  return { isPending, error, data };
}

export function useNovelChapterList(title, pageNumber) {
  const { source } = useAllSources();
  const {
    isPending,
    error,
    data: { data } = {},
  } = useQuery({
    queryKey: ["novel-chapter-list"],
    queryFn: () => novelAPI.getNovelChapterList({ title, pageNumber, source }),
  });

  return { isPending, error, data };
}

export function useNovelDetail(title) {
  const { source } = useAllSources();
  const {
    isPending,
    error,
    data: { data } = {},
  } = useQuery({
    queryKey: ["novel-detail"],
    queryFn: () => novelAPI.getNovelDetail({ title, source }),
  });

  return { isPending, error, data };
}

export function useNovelChapterContent(title, chapterNumber, source) {
  const {
    isPending,
    error,
    data: { data } = {},
  } = useQuery({
    queryKey: ["novel-chapter-content"],
    queryFn: () =>
      novelAPI.getNovelChapterContent({ title, chapterNumber, source }),
  });

  return { isPending, error, data };
}
