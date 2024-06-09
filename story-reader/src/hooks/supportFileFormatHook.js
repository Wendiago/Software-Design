import { useQuery } from "@tanstack/react-query";
import { downloadAPI } from "../api";

export function useAllSupportFileFormats() {
  const { status, data: { data: file_formats } = {} } = useQuery({
    queryKey: ["support_file"],
    queryFn: downloadAPI.getAllSupportedFileFormats,
  });

  return { status, file_formats };
}
