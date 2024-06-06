import { useQuery } from "@tanstack/react-query";
import { useAllSources } from "./useAllSources";
import { categoryAPI } from "../api";

export function useAllCategories() {
  const { source } = useAllSources();
  const {
    isPending,
    error,
    data: categories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryAPI.getAllCategories(source),
  });

  return { isPending, error, categories };
}

export function useNovelByCategory(category, pageNumber) {
  const { source } = useAllSources();
  const {
    isPending,
    error,
    data: { data } = {},
  } = useQuery({
    queryKey: ["novel-by-category"],
    queryFn: () =>
      categoryAPI.getNovelByCategory({ category, pageNumber, source }),
  });

  return { isPending, error, data };
}
