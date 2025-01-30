import { onMounted, ref } from "vue"

interface PaginationFilters {
  perPage?: number
}

const usePagination = ({ perPage: pP = 10 }: PaginationFilters) => {
  const perPage = ref(pP)
  const pageNumber = ref(1)
  const currentRange = ref({ from: 0, to: perPage.value - 1 })
  const limitReached = ref(false)
  const totalDocuments = ref<number>(60)

  const getTotal = () => {}

  onMounted(getTotal)

  return {
    perPage,
    pageNumber,
    currentRange,
    limitReached,
    totalDocuments,
  }
}

export default usePagination
