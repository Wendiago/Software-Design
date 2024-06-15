import { useQuery } from "@tanstack/react-query";
import { sourceAPI } from "../api";

export function useAllSources() {
  const { error, data: { data: source } = {} } = useQuery({
    queryKey: ["source"],
    queryFn: sourceAPI.getAllSources,
  });

  return { error, source };
}
