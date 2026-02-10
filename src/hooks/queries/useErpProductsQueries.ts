import { useQuery } from "@tanstack/react-query";
import {
  aiApi,
  type ErpProduct,
  type ErpProductsQuery,
} from "@/utils/api/aiApi";

export const useErpProductsQueries = (query?: ErpProductsQuery) => {
  const getProducts = useQuery<ErpProduct[]>({
    queryKey: ["erp-products", query?.tenantId, query?.limit, query?.offset],
    queryFn: () => aiApi.getErpProducts(query),
    staleTime: 60 * 1000,
  });

  return {
    getProducts,
  };
};
